import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile(
  new URL("../app/api/github/repos/route.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
function loadRoute(fetcher, signals = AbortSignal) {
  const module = { exports: {} };
  vm.runInNewContext(compiled, {
    module,
    exports: module.exports,
    require: (name) => {
      assert.equal(name, "next/server");
      return {
        NextResponse: { json: (body, options) => Response.json(body, options) },
      };
    },
    process: { env: { GITHUB_TOKEN: "boundary-test-token" } },
    fetch: fetcher,
    URL,
    URLSearchParams,
    Headers,
    AbortSignal: signals,
    console: { warn() {} },
  });
  return module.exports.GET;
}
function request(query = "") {
  const url = `https://portfolio.example/api/github/repos${query}`;
  return { url, nextUrl: new URL(url), signal: new AbortController().signal };
}
function repository(index = 1) {
  return {
    id: index,
    name: `repo-${index}`,
    fork: false,
    html_url: `https://github.com/eneekoruiz/repo-${index}`,
    description: "A repository",
    language: "TypeScript",
    pushed_at: "2026-10-03T12:00:00Z",
    updated_at: "2026-10-03T12:00:00Z",
    size: 42,
    stargazers_count: 0,
    forks_count: 0,
    languages_url: "https://untrusted.example/steal-credentials",
  };
}

test("strict numeric parameters reject trailing characters before upstream work", async () => {
  const GET = loadRoute(() => {
    throw new Error("Unexpected upstream request");
  });
  for (const value of ["12junk", "1.5", "101", "-1", "0", "Infinity"]) {
    const response = await GET(request(`?per_page=${value}`));
    assert.equal(response.status, 400);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
  }
});

test("summary validates rows, canonicalizes links and skips enrichment", async () => {
  let calls = 0;
  const GET = loadRoute(async () => {
    calls++;
    return Response.json([
      null,
      repository(),
      repository(),
      { ...repository(2), pushed_at: null },
    ]);
  });
  const response = await GET(request("?summary=1"));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.length, 1);
  assert.equal(
    body[0].languages_url,
    "https://api.github.com/repos/eneekoruiz/repo-1/languages",
  );
  assert.equal(calls, 1);
});

test("invalid upstream objects degrade with generic uncached error", async () => {
  for (const data of [{ message: "secret upstream detail" }, [null, {}]]) {
    const response = await loadRoute(async () => Response.json(data))(
      request(),
    );
    assert.equal(response.status, 502);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.deepEqual(await response.json(), {
      error: "Unable to fetch repositories",
    });
  }
});

test("rate reset is converted to delay seconds; permission failure is not a rate limit", async () => {
  const reset = String(Math.floor(Date.now() / 1000) + 120);
  const limited = await loadRoute(
    async () =>
      new Response("", {
        status: 403,
        headers: { "X-RateLimit-Remaining": "0", "X-RateLimit-Reset": reset },
      }),
  )(request());
  assert.equal(limited.status, 429);
  const delay = Number(limited.headers.get("Retry-After"));
  assert.ok(delay > 115 && delay <= 120);
  const denied = await loadRoute(
    async () => new Response("secret", { status: 403 }),
  )(request());
  assert.equal(denied.status, 502);
  assert.deepEqual(await denied.json(), {
    error: "Unable to fetch repositories",
  });
});

test("language work has three concurrent workers, eight repositories and canonical token destination", async () => {
  let active = 0,
    peak = 0,
    languages = 0;
  const GET = loadRoute(async (url, options) => {
    if (url.includes("/users/"))
      return Response.json(
        Array.from({ length: 10 }, (_, i) => repository(i + 1)),
      );
    assert.ok(url.startsWith("https://api.github.com/repos/eneekoruiz/repo-"));
    assert.ok(url.endsWith("/languages"));
    assert.equal(options.headers.Authorization, "Bearer boundary-test-token");
    assert.ok(options.signal instanceof AbortSignal);
    languages++;
    active++;
    peak = Math.max(peak, active);
    await new Promise((resolve) => setTimeout(resolve, 5));
    active--;
    return Response.json({ TypeScript: 300, Invalid: -1 });
  });
  const response = await GET(request());
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(languages, 8);
  assert.equal(peak, 3);
  assert.deepEqual(body[0].all_languages, ["TypeScript"]);
  assert.equal(body.length, 10);
});

test("optional language failure retains repositories and primary language", async () => {
  const GET = loadRoute(async (url) => {
    if (url.includes("/users/")) return Response.json([repository()]);
    throw new Error("Failure with a secret that must not reach the response");
  });
  const response = await GET(request());
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(body[0].all_languages, ["TypeScript"]);
});

test("client disconnection aborts upstream and returns only generic diagnostics", async () => {
  const controller = new AbortController();
  const GET = loadRoute(
    (_url, options) =>
      new Promise((_resolve, reject) => {
        options.signal.addEventListener(
          "abort",
          () => reject(new Error("secret token in rejected request")),
          { once: true },
        );
      }),
  );
  const input = request();
  input.signal = controller.signal;
  const responsePromise = GET(input);
  controller.abort();
  const response = await responsePromise;
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), {
    error: "Unable to fetch repositories",
  });
});

const hookSource = await readFile(
  new URL("../app/hooks/useGitHubActivity.ts", import.meta.url),
  "utf8",
);
const hookCompiled = ts.transpileModule(hookSource, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
function mountHook(fetcher, visibility = "visible") {
  const updates = [];
  let effect, observer;
  const document = new EventTarget();
  document.visibilityState = visibility;
  document.getElementById = () => ({});
  const module = { exports: {} };
  vm.runInNewContext(hookCompiled, {
    module,
    exports: module.exports,
    require: (name) => {
      assert.equal(name, "react");
      return {
        useState: (initial) => [initial, (next) => updates.push(next)],
        useEffect: (callback) => {
          effect = callback;
        },
      };
    },
    document,
    fetch: fetcher,
    AbortController,
    setTimeout,
    clearTimeout,
    IntersectionObserver: class {
      constructor(callback) {
        this.callback = callback;
        observer = this;
      }
      observe() {}
      disconnect() {}
    },
  });
  module.exports.useGitHubActivity();
  const cleanup = effect();
  return {
    updates,
    document,
    cleanup,
    enter: () => observer.callback([{ isIntersecting: true }]),
  };
}

test("hidden intersection does not fetch; foreground approach fetches only once and drops malformed rows", async () => {
  let calls = 0;
  const hook = mountHook(async () => {
    calls++;
    return Response.json([
      null,
      {
        ...repository(),
        all_languages: ["TypeScript", "TypeScript", null, ""],
      },
      repository(),
      { ...repository(2), size: "invalid" },
    ]);
  }, "hidden");
  hook.enter();
  assert.equal(calls, 0);
  hook.document.visibilityState = "visible";
  hook.document.dispatchEvent(new Event("visibilitychange"));
  hook.enter();
  await new Promise(setImmediate);
  assert.equal(calls, 1);
  assert.equal(hook.updates.length, 1);
  assert.equal(hook.updates[0].repos.length, 1);
  assert.equal(hook.updates[0].repos[0].langs[0], "TypeScript");
  assert.equal(hook.updates[0].repos[0].langs.length, 1);
  assert.equal(hook.updates[0].offline, false);
  hook.cleanup();
});

test("unmount aborts optional client request without stale state updates", async () => {
  let aborted = false;
  const hook = mountHook(
    (_url, options) =>
      new Promise((_resolve, reject) => {
        options.signal.addEventListener(
          "abort",
          () => {
            aborted = true;
            reject(new Error("Aborted"));
          },
          { once: true },
        );
      }),
  );
  hook.enter();
  hook.cleanup();
  await new Promise(setImmediate);
  assert.equal(aborted, true);
  assert.equal(hook.updates.length, 0);
});

test("malformed-only client data uses offline fallback instead of crashing row render", async () => {
  const hook = mountHook(async () =>
    Response.json([{ name: "invalid" }, null]),
  );
  hook.enter();
  await new Promise(setImmediate);
  assert.equal(hook.updates.length, 1);
  assert.equal(hook.updates[0].offline, true);
  assert.equal(hook.updates[0].load, false);
  assert.equal(hook.updates[0].repos.length, 0);
  hook.cleanup();
});

test("one total deadline cancels language workers and prevents queued requests", async () => {
  const deadline = new AbortController();
  const delays = [];
  let languageCalls = 0;
  const signals = {
    any: (items) => AbortSignal.any(items),
    timeout: (milliseconds) => {
      delays.push(milliseconds);
      return milliseconds > 4500
        ? deadline.signal
        : new AbortController().signal;
    },
  };
  const GET = loadRoute(async (url, options) => {
    if (url.includes("/users/"))
      return Response.json(
        Array.from({ length: 8 }, (_, index) => repository(index + 1)),
      );
    languageCalls++;
    if (languageCalls === 3) queueMicrotask(() => deadline.abort());
    return new Promise((_resolve, reject) => {
      options.signal.addEventListener(
        "abort",
        () => reject(new Error("Deadline reached")),
        { once: true },
      );
    });
  }, signals);
  const response = await GET(request());
  assert.equal(response.status, 200);
  assert.equal(languageCalls, 3);
  assert.ok(delays[0] > 4500 && delays[0] < 8000);
  const body = await response.json();
  assert.equal(body.length, 8);
  for (const row of body) assert.deepEqual(row.all_languages, ["TypeScript"]);
});
