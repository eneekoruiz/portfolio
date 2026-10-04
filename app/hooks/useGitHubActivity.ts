"use client";
import { useEffect, useState } from "react";
import type { RepoFull } from "../types";

const OWNER = "eneekoruiz";
function parseRepository(value: unknown): RepoFull | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  if (
    !Number.isSafeInteger(row.id) ||
    Number(row.id) <= 0 ||
    typeof row.name !== "string" ||
    !/^[\w.-]{1,100}$/.test(row.name) ||
    row.name === "." ||
    row.name === ".." ||
    typeof row.fork !== "boolean" ||
    !(row.description === null || typeof row.description === "string") ||
    !(row.language === null || typeof row.language === "string") ||
    typeof row.pushed_at !== "string" ||
    !Number.isFinite(Date.parse(row.pushed_at)) ||
    !Number.isSafeInteger(row.size) ||
    Number(row.size) < 0 ||
    !Number.isSafeInteger(row.stargazers_count) ||
    Number(row.stargazers_count) < 0
  )
    return null;
  const repositoryUrl = `https://github.com/${OWNER}/${encodeURIComponent(row.name)}`;
  if (
    typeof row.html_url !== "string" ||
    row.html_url.toLowerCase() !== repositoryUrl.toLowerCase()
  )
    return null;
  const primaryLanguage =
    typeof row.language === "string" ? row.language.slice(0, 64) : null;
  const languages = Array.isArray(row.all_languages)
    ? row.all_languages
        .filter(
          (language): language is string =>
            typeof language === "string" &&
            language.length > 0 &&
            language.length <= 64,
        )
        .slice(0, 30)
    : primaryLanguage
      ? [primaryLanguage]
      : [];
  return {
    id: Number(row.id),
    name: row.name,
    fork: row.fork,
    description:
      typeof row.description === "string"
        ? row.description.slice(0, 1024)
        : null,
    html_url: repositoryUrl,
    language:
      typeof row.language === "string" ? row.language.slice(0, 64) : null,
    pushed_at: row.pushed_at,
    size: Number(row.size),
    stargazers_count: Number(row.stargazers_count),
    languages_url: `https://api.github.com/repos/${OWNER}/${encodeURIComponent(row.name)}/languages`,
    langs: languages.length
      ? [...new Set(languages)]
      : primaryLanguage
        ? [primaryLanguage]
        : [],
  };
}

/** Optional activity has one bounded request, after a visible reader approaches. */
export function useGitHubActivity() {
  const [state, setState] = useState({
    repos: [] as RepoFull[],
    load: true,
    offline: false,
    errorMsg: "",
  });
  useEffect(() => {
    const section = document.getElementById("github");
    if (!section) {
      setState({ repos: [], load: false, offline: false, errorMsg: "" });
      return;
    }
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
    let near = false;
    let started = false;
    const load = async () => {
      if (
        started ||
        disposed ||
        !near ||
        document.visibilityState !== "visible"
      )
        return;
      started = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", load);
      timer = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch(
          "/api/github/repos?per_page=12&summary=1",
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Unavailable");
        const data: unknown = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid response");
        const seen = new Set<number>();
        const validated = data
          .slice(0, 100)
          .map(parseRepository)
          .filter((repo): repo is RepoFull => repo !== null)
          .filter((repo) => {
            if (seen.has(repo.id)) return false;
            seen.add(repo.id);
            return true;
          });
        if (data.length > 0 && validated.length === 0)
          throw new Error("Invalid response");
        if (!disposed)
          setState({
            repos: validated.filter((repo) => !repo.fork).slice(0, 8),
            load: false,
            offline: false,
            errorMsg: "",
          });
      } catch {
        if (!disposed)
          setState({ repos: [], load: false, offline: true, errorMsg: "" });
      } finally {
        clearTimeout(timer);
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        void load();
      },
      { rootMargin: "300px" },
    );
    observer.observe(section);
    document.addEventListener("visibilitychange", load);
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", load);
      clearTimeout(timer);
      controller.abort();
    };
  }, []);
  return state;
}
