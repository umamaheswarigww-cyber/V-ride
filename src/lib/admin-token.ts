// Edge-compatible admin session token utilities.
// Uses Web Crypto API (SubtleCrypto) which works in both Edge and Node runtimes.

const ADMIN_COOKIE_NAME = "vride_admin_session";
const SESSION_TTL = 4 * 60 * 60 * 1000; // 4 hours
const ALG = "HMAC";
const HASH = "SHA-256";

function getAuthSecret(): string {
  return (
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "v-ride-dev-fallback-do-not-use-in-prod"
  );
}

async function getKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(getAuthSecret()),
    { name: ALG, hash: HASH },
    false,
    ["sign", "verify"],
  );
}

function bufferToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes.buffer;
}

/**
 * Create a fresh admin session token (signed).
 * Token format: <payload>.<hmac_hex>
 */
export async function createAdminToken(): Promise<string> {
  const exp = Date.now() + SESSION_TTL;
  const payload = Buffer.from(JSON.stringify({ exp, role: "admin" })).toString("base64url");
  const key = await getKey();
  const enc = new TextEncoder();
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return `${payload}.${bufferToHex(sig)}`;
}

/**
 * Verify an admin session token. Returns true if valid + not expired.
 */
export async function verifyAdminToken(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  const [payload, hmac] = token.split(".");
  if (!payload || !hmac) return false;
  try {
    const key = await getKey();
    const enc = new TextEncoder();
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      hexToBuffer(hmac),
      enc.encode(payload),
    );
    if (!ok) return false;
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (decoded.exp && Date.now() < decoded.exp) return true;
  } catch {
    // ignore
  }
  return false;
}

export const ADMIN_COOKIE = ADMIN_COOKIE_NAME;
export const ADMIN_COOKIE_TTL = SESSION_TTL;
