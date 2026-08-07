import crypto from "crypto";

/**
 * Hashes a password using PBKDF2 with a random salt.
 * Returns a string formatted as "salt:hash".
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against a stored "salt:hash" string.
 */
export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || !stored.includes(":")) {
    return false;
  }
  const [salt, originalHash] = stored.split(":");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hash === originalHash;
}

/**
 * Derives a 32-byte encryption key strictly from process.env.JWT_SECRET.
 */
function getEncryptionKey(): Buffer {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing");
  }
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts sensitive string tokens (e.g. OAuth Refresh Tokens) using AES-256-CBC.
 * Returns string formatted as "ivHex:encryptedHex".
 */
export function encryptToken(text: string): string {
  if (!text) return "";
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts sensitive string tokens encrypted via encryptToken.
 */
export function decryptToken(encryptedText: string): string {
  if (!encryptedText || !encryptedText.includes(":")) return "";
  const key = getEncryptionKey();
  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
