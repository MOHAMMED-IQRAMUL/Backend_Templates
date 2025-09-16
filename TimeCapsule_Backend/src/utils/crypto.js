import crypto from "node:crypto";

const ALGO = "aes-256-gcm";
const IV_LEN = 12; // GCM recommended 12 bytes
const KEY_LEN = 32; // 256-bit
const SALT_LEN = 16; // for PBKDF2
const ITER = 120000; // PBKDF2 iterations

export function deriveKey(passphrase, salt) {
  return crypto.pbkdf2Sync(passphrase, salt, ITER, KEY_LEN, "sha256");
}

export function encrypt(plaintext, passphrase) {
  const iv = crypto.randomBytes(IV_LEN);
  const salt = crypto.randomBytes(SALT_LEN);
  const key = deriveKey(passphrase, salt);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(String(plaintext), "utf8")),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return {
    algo: ALGO,
    iter: ITER,
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    data: encrypted.toString("base64"),
  };
}

export function decrypt(payload, passphrase) {
  const { algo, iter, salt, iv, tag, data } = payload;
  if (algo !== ALGO || iter !== ITER)
    throw new Error("Unsupported cipher params");
  const key = deriveKey(passphrase, Buffer.from(salt, "base64"));
  const decipher = crypto.createDecipheriv(
    ALGO,
    key,
    Buffer.from(iv, "base64")
  );
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(data, "base64")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
