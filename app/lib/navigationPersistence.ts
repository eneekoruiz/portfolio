/**
 * PORTFOLIO NAVIGATION PERSISTENCE UTILITIES
 * ─────────────────────────────────────────────────────────────────────────────
 * Functions to save, load, and clear state to improve UX during transitions.
 */

export interface NavState {
  openIdx: number | null;
  scrollY: number;
}

const SESSION_KEY = 'projects_nav_state';

export function saveNavState(state: NavState): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch (_) {}
}

export function loadNavState(): NavState | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) as NavState : null;
  } catch (_) {
    return null;
  }
}

export function clearNavState(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (_) {}
}
