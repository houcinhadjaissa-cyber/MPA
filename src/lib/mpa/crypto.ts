// MPA WebCrypto Utilities — Client-side cryptographic security layer

const ALGO = { name: "AES-GCM", length: 256 } as const;

async function deriveKey(salt: Uint8Array): Promise<CryptoKey> {
  const raw = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode("mpa-session-key-v2"),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    raw,
    ALGO,
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptPayload(plaintext: string): Promise<string> {
  try {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(salt);
    const encoded = new TextEncoder().encode(plaintext);
    const cipherBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
    const result = new Uint8Array(salt.length + iv.length + cipherBuf.byteLength);
    result.set(salt, 0);
    result.set(iv, 16);
    result.set(new Uint8Array(cipherBuf), 28);
    return btoa(String.fromCharCode(...result));
  } catch {
    return plaintext;
  }
}

export async function decryptPayload(ciphertext: string): Promise<string> {
  try {
    const raw = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));
    const salt = raw.slice(0, 16);
    const iv = raw.slice(16, 28);
    const data = raw.slice(28);
    const key = await deriveKey(salt);
    const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
    return new TextDecoder().decode(plainBuf);
  } catch {
    return ciphertext;
  }
}

export async function hashState(state: unknown): Promise<string> {
  try {
    const encoded = new TextEncoder().encode(JSON.stringify(state));
    const hashBuf = await crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(hashBuf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "";
  }
}

export async function generateSessionId(): Promise<string> {
  const buf = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(buf).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function generateSyncId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function signPayload(payload: string): Promise<string> {
  try {
    const key = await crypto.subtle.generateKey(
      { name: "HMAC", hash: "SHA-256" },
      true,
      ["sign", "verify"]
    );
    const encoded = new TextEncoder().encode(payload);
    const sig = await crypto.subtle.sign("HMAC", key, encoded);
    return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return "";
  }
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

export function rateLimitKey(action: string): string {
  const window = Math.floor(Date.now() / 60_000);
  return `mpa_rl_${action}_${window}`;
}

export function checkRateLimit(action: string, maxPerMinute = 10): boolean {
  try {
    const key = rateLimitKey(action);
    const count = parseInt(localStorage.getItem(key) ?? "0", 10);
    if (count >= maxPerMinute) return false;
    localStorage.setItem(key, String(count + 1));
    return true;
  } catch {
    return true;
  }
}
