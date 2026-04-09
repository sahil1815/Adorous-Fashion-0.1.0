import crypto from "crypto";

const AUTH_SECRET = process.env.AUTH_SECRET as string | undefined;

const HASH_ITERATIONS = 310000;
const HASH_KEYLEN = 64;
const HASH_DIGEST = "sha256";
const SALT_BYTE_LENGTH = 16;

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(SALT_BYTE_LENGTH).toString("hex");
  const derivedKey = crypto.scryptSync(
    password,
    salt,
    HASH_KEYLEN,
    { N: 16384, r: 8, p: 1 }
  ).toString("hex");
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, hashed: string) {
  const [salt, key] = hashed.split(":");
  if (!salt || !key) return false;

  const derivedKey = crypto
    .scryptSync(password, salt, HASH_KEYLEN, { N: 16384, r: 8, p: 1 })
    .toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(derivedKey, "hex"),
    Buffer.from(key, "hex")
  );
}

function getAuthSecret() {
  if (!AUTH_SECRET) {
    throw new Error(
      "Please define AUTH_SECRET in your .env.local for session signing"
    );
  }

  return AUTH_SECRET;
}

export function signSession(payload: {
  userId: string;
  email: string;
  name: string;
}) {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30;
  const body = JSON.stringify({ ...payload, exp: expiresAt });
  const encoded = Buffer.from(body).toString("base64url");
  const signature = crypto
    .createHmac(HASH_DIGEST, getAuthSecret())
    .update(encoded)
    .digest("base64url");

  return `${encoded}.${signature}`;
}

export function verifySession(token: string) {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = crypto
    .createHmac(HASH_DIGEST, getAuthSecret())
    .update(encoded)
    .digest("base64url");

  const signatureBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  if (signatureBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  if (!payload.exp || payload.exp < Date.now()) return null;

  return payload as {
    userId: string;
    email: string;
    name: string;
    exp: number;
  };
}
