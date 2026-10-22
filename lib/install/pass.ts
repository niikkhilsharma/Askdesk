const HOUR_MS = 60 * 60 * 1000 
const encoder = new TextEncoder()

export type VisitorPassClaims = {
  botId: string
  origin: string
  exp: number
}

/** Signs a visitor pass for this bot and host site, expiring one hour from now. */
export async function signVisitorPass(
  botId: string,
  origin: string,
  now = Date.now()
) {
  if (!botId || !origin) {
    throw new Error("A visitor pass needs a bot and a host site")
  }

  const payload = Buffer.from(
    JSON.stringify({
      botId,
      origin,
      exp: now + HOUR_MS,
    })
  ).toString("base64url")
  const signature = await signPayload(payload)

  return `${payload}.${signature}`
}

/** Returns the claims when the signature is valid and the pass has not expired. */
export async function readVisitorPass(pass: string, now = Date.now()) {
  const parts = pass.split(".")

  if (parts.length !== 2) {
    return null
  }

  const [payload, signature] = parts

  if (!payload || !signature || !(await signatureMatches(payload, signature))) {
    return null
  }

  const claims = claimsFromPayload(payload)

  if (!claims || claims.exp <= now) {
    return null
  }

  return claims
}

/** Returns the claims when the pass is valid for this bot and host site. */
export async function checkVisitorPass(
  pass: string,
  botId: string,
  origin: string,
  now = Date.now()
) {
  const claims = await readVisitorPass(pass, now)

  if (!claims || claims.botId !== botId || claims.origin !== origin) {
    return null
  }

  return claims
}

/** Reads the server secret that signs visitor passes. */
function visitorPassSecret() {
  const secret = process.env.VISITOR_PASS_SECRET

  if (!secret) {
    throw new Error("Missing VISITOR_PASS_SECRET")
  }

  return secret
}

/** Imports the key used to sign and check visitor passes. */
async function passKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(visitorPassSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

/** Signs the payload and returns the signature text. */
async function signPayload(payload: string) {
  const signature = await crypto.subtle.sign(
    "HMAC",
    await passKey(),
    encoder.encode(payload)
  )

  return Buffer.from(signature).toString("base64url")
}

/** Reports whether this signature was made for the payload. */
async function signatureMatches(payload: string, signature: string) {
  const signatureBytes = decodeBase64Url(signature)

  if (!signatureBytes) {
    return false
  }

  return crypto.subtle.verify(
    "HMAC",
    await passKey(),
    signatureBytes,
    encoder.encode(payload)
  )
}

/** Reads claims from a payload, or null when the payload is not a visitor pass. */
function claimsFromPayload(payload: string): VisitorPassClaims | null {
  const bytes = decodeBase64Url(payload)

  if (!bytes) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes))

    if (!isVisitorPassClaims(parsed)) {
      return null
    }

    return {
      botId: parsed.botId,
      origin: parsed.origin,
      exp: parsed.exp,
    }
  } catch {
    return null
  }
}

/** Reports whether a value has the visitor pass claims. */
function isVisitorPassClaims(value: unknown): value is VisitorPassClaims {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const claims = value as {
    botId?: unknown
    origin?: unknown
    exp?: unknown
  }

  return (
    typeof claims.botId === "string" &&
    claims.botId.length > 0 &&
    typeof claims.origin === "string" &&
    claims.origin.length > 0 &&
    typeof claims.exp === "number" &&
    Number.isInteger(claims.exp)
  )
}

/** Turns a URL-safe string back into bytes, or null when it is not valid. */
function decodeBase64Url(value: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) {
    return null
  }

  return new Uint8Array(Buffer.from(value, "base64url"))
}
