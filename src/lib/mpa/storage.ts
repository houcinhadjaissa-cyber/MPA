const PREFIX = "mpa_v2_";

export function lsGet(key: string, fallback = ""): string {
  if (typeof window === "undefined") return fallback;
  try { return localStorage.getItem(PREFIX + key) ?? fallback; } catch { return fallback; }
}

export function lsSet(key: string, value: string) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(PREFIX + key, value); } catch {}
}

export function lsRemove(key: string) {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(PREFIX + key); } catch {}
}

export function lsGetJSON<T>(key: string, fallback: T): T {
  try {
    const raw = lsGet(key, "null");
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch { return fallback; }
}

export function lsSetJSON(key: string, value: unknown) {
  lsSet(key, JSON.stringify(value));
}

export function lsClear(prefix?: string) {
  if (typeof window === "undefined") return;
  try {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(prefix ?? PREFIX)
    );
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {}
}

export const LS_KEYS = {
  API_KEY:           "api_key",
  API_PROVIDER:      "api_provider",
  MASTER_OBJECTIVE:  "master_objective",
  TARGET_ENTITY:     "target_entity",
  TARGET_CONTEXT:    "target_context",
  PROTOCOL:          "protocol",
  CUSTOM_DIRECTIVES: "custom_directives",
  MODEL:             "model",
  TEMPERATURE:       "temperature",
  LAYERS:            "layers",
  CHAT_HISTORY:      "chat_history",
  PROJECTS:          "projects",
  SESSIONS:          "sessions",
  ACTIVE_SESSION:    "active_session",
  PROMPT_HISTORY:    "prompt_history",
  THEME:             "theme",
} as const;
