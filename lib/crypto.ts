import crypto from 'crypto'

// AES-256-GCM. Key comes from env (base64, 32 bytes) — never hardcoded.
// Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
function key(): Buffer {
  const b64 = process.env.DATA_ENC_KEY
  if (!b64) throw new Error('DATA_ENC_KEY is not configured.')
  const k = Buffer.from(b64, 'base64')
  if (k.length !== 32) throw new Error('DATA_ENC_KEY must decode to exactly 32 bytes.')
  return k
}

// Returns base64( iv(12) ‖ authTag(16) ‖ ciphertext ).
export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv)
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, ct]).toString('base64')
}

export function decrypt(payload: string): string {
  const buf = Buffer.from(payload, 'base64')
  const iv = buf.subarray(0, 12)
  const tag = buf.subarray(12, 28)
  const ct = buf.subarray(28)
  const decipher = crypto.createDecipheriv('aes-256-gcm', key(), iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8')
}

// Encrypt a possibly-empty value; null/empty stays null so columns aren't padded with junk.
export function encryptOrNull(value: string | null | undefined): string | null {
  if (value == null || value === '') return null
  return encrypt(value)
}
