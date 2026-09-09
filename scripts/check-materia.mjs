import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(
  new URL("../app/lib/spring.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  },
}).outputText;
const { SpringValue } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

const reversed = new SpringValue();
reversed.target = 1;
for (let i = 0; i < 8; i++) reversed.step(1 / 60);
const before = { position: reversed.value, velocity: reversed.velocity };
reversed.target = 0;
assert.equal(reversed.value, before.position);
assert.equal(reversed.velocity, before.velocity);
for (let i = 0; i < 180; i++) reversed.step(1 / 60);
assert.equal(reversed.value, 0);
assert.equal(reversed.velocity, 0);

const samples = [30, 60, 144].map((fps) => {
  const spring = new SpringValue();
  spring.target = 1;
  for (let i = 0; i < Math.round(fps / 2); i++) spring.step(1 / fps);
  return spring.value;
});
assert.ok(
  Math.max(...samples) - Math.min(...samples) < 0.01,
  "Refresh rates must not change spring behavior materially",
);

const interrupted = new SpringValue(0, 280, 32);
for (let i = 0; i < 60; i++) {
  interrupted.target = i % 2 ? 0 : 600;
  interrupted.step(i % 7 === 0 ? 2 : 1 / 60);
  assert.ok(Number.isFinite(interrupted.value));
  assert.ok(
    interrupted.value >= -10 && interrupted.value <= 650,
    "Long frames must remain bounded",
  );
}
interrupted.target = 0;
for (let i = 0; i < 360; i++) interrupted.step(1 / 60);
assert.equal(interrupted.value, 0);
for (const damping of [6, 20, 30]) {
  const coarse = new SpringValue(0, 100, damping);
  const fine = new SpringValue(0, 100, damping);
  coarse.target = fine.target = 600;
  coarse.step(0.4);
  for (let i = 0; i < 24; i++) fine.step(1 / 60);
  assert.ok(
    Math.abs(coarse.value - fine.value) < 0.0001,
    "Suspended frames must preserve elapsed-time behavior for every damping regime",
  );
  assert.ok(Math.abs(coarse.velocity - fine.velocity) < 0.0001);
}
console.log(
  "PASS: momentum-preserving reversals, refresh-rate consistency and bounded long-frame recovery.",
);
