"use client";
import { useEffect, useState } from "react";
import type { RepoFull } from "../types";
/** Fetch optional activity only when the reader approaches it. */
export function useGitHubActivity() {
  const [state, setState] = useState({
    repos: [] as RepoFull[],
    load: true,
    offline: false,
    errorMsg: "",
  });
  useEffect(() => {
    const section = document.getElementById("github");
    if (!section) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let disposed = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = setTimeout(() => controller.abort(), 8000);
        fetch("/api/github/repos?per_page=12&summary=1", {
          signal: controller.signal,
        })
          .then(async (response) => {
            if (!response.ok) throw new Error("Unavailable");
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error("Invalid response");
            if (!disposed)
              setState({
                repos: data
                  .filter((r) => !r.fork)
                  .slice(0, 8)
                  .map((r) => ({
                    ...r,
                    langs: r.all_languages ?? (r.language ? [r.language] : []),
                  })),
                load: false,
                offline: false,
                errorMsg: "",
              });
          })
          .catch(() => {
            if (!disposed)
              setState({ repos: [], load: false, offline: true, errorMsg: "" });
          })
          .finally(() => clearTimeout(timer));
      },
      { rootMargin: "300px" },
    );
    observer.observe(section);
    return () => {
      disposed = true;
      observer.disconnect();
      clearTimeout(timer);
      controller.abort();
    };
  }, []);
  return state;
}
