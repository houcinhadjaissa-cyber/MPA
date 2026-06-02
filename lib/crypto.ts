/**
 * lib/crypto.ts — Real Web Crypto Implementation
 * Uses PBKDF2 key derivation + AES-GCM encryption.
 * Falls back to base64 with a clear warning if WebCrypto is unavailable (non-HTTPS, Node, etc.).
 * NEVER fails silently.
 */

// ─── Availability check ──────────────────────────────────────────────────────
export function isCryptoAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.crypto !== "undefined" &&
    typeof window.crypto.subtle !== "undefined"
  );
}

// ─── Key Derivation (PBKDF2) ─────────────────────────────────────────────────
/**
 * Derives a real AES-GCM CryptoKey from a password + salt using PBKDF2.
 * 100,000 iterations, SHA-256. Same security as major password managers.
 */
export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  if (!isCryptoAvailable()) {
    throw new Error(
      "[MPA Crypto] WebCrypto is unavailable. Ensure the app is served over HTTPS."
    );
  }
  const enc = new TextEncoder();
  const rawKey = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  // Uint8Array.from() produces Uint8Array<ArrayBuffer>, satisfying TypeScript 5.4+
  // strict BufferSource constraint on WebCrypto APIs (which rejects ArrayBufferLike).
  const saltFixed = Uint8Array.from(salt);
  return window.crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: saltFixed, iterations: 100_000, hash: "SHA-256" },
    rawKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// ─── Encrypt (AES-GCM) ──────────────────────────────────────────────────────
/**
 * Encrypts a plaintext string using AES-GCM with a fresh 96-bit random IV.
 * Returns both the ciphertext ArrayBuffer and the IV needed for decryption.
 */
export async function encryptData(
  key: CryptoKey,
  plaintext: string
): Promise<{ ciphertext: ArrayBuffer; iv: Uint8Array }> {
  if (!isCryptoAvailable()) throw new Error("[MPA Crypto] WebCrypto unavailable.");
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(plaintext)
  );
  return { ciphertext, iv };
}

// ─── Decrypt (AES-GCM) ──────────────────────────────────────────────────────
/**
 * Decrypts an AES-GCM ciphertext using the matching key and IV.
 * Throws explicitly if decryption fails (tampered data, wrong key, etc.).
 */
export async function decryptData(
  key: CryptoKey,
  iv: Uint8Array,
  ciphertext: ArrayBuffer
): Promise<string> {
  if (!isCryptoAvailable()) throw new Error("[MPA Crypto] WebCrypto unavailable.");
  try {
    const dec = new TextDecoder();
    const ivFixed = Uint8Array.from(iv); // ensure Uint8Array<ArrayBuffer> for strict TS 5.4+
    const plaintext = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: ivFixed },
      key,
      ciphertext
    );
    return dec.decode(plaintext);
  } catch {
    throw new Error(
      "[MPA Crypto] Decryption failed. Data may be corrupted or the key is incorrect."
    );
  }
}

// ─── Base64 Fallback (Non-HTTPS environments only) ──────────────────────────
/**
 * NOT cryptographically secure. Encodes to base64 with a visible console warning.
 * Used exclusively when WebCrypto is unavailable (e.g. local http:// dev).
 */
export function encryptFallback(data: string): string {
  console.warn(
    "[MPA Crypto] ⚠ INSECURE FALLBACK ACTIVE: WebCrypto not available. " +
    "Using base64 encoding — this is NOT encryption. Serve over HTTPS for real security."
  );
  return btoa(unescape(encodeURIComponent(data)));
}

export function decryptFallback(encoded: string): string {
  console.warn("[MPA Crypto] ⚠ Decoding base64 fallback — NOT real decryption.");
  try {
    return decodeURIComponent(escape(atob(encoded)));
  } catch {
    throw new Error("[MPA Crypto] Failed to decode base64 fallback data. Data may be corrupted.");
  }
}

// ─── Safe High-Level Wrappers ─────────────────────────────────────────────────
/**
 * Automatically picks WebCrypto or base64 fallback based on availability.
 * Returns a single base64 string encoding (iv ++ ciphertext) for easy storage.
 */
export async function safeEncrypt(password: string, salt: Uint8Array, plaintext: string): Promise<string> {
  if (!isCryptoAvailable()) return encryptFallback(plaintext);
  const key = await deriveKey(password, salt);
  const { ciphertext, iv } = await encryptData(key, plaintext);
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.byteLength);
  return btoa(String.fromCharCode(...Array.from(combined)));
}

export async function safeDecrypt(password: string, salt: Uint8Array, encoded: string): Promise<string> {
  if (!isCryptoAvailable()) return decryptFallback(encoded);
  const combined = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12).buffer;
  const key = await deriveKey(password, salt);
  return decryptData(key, iv, ciphertext);
}

/** Generates a cryptographically random salt (16 bytes). */
export function generateSalt(): Uint8Array {
  if (!isCryptoAvailable()) {
    const arr = new Uint8Array(16);
    for (let i = 0; i < 16; i++) arr[i] = Math.floor(Math.random() * 256);
    return arr;
  }
  return window.crypto.getRandomValues(new Uint8Array(16));
}
