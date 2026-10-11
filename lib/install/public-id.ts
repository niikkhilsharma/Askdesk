import { randomBytes } from "node:crypto"

/** Creates an unguessable public id for an account's bot. */
export function createBotPublicId() {
  return `bot_${randomBytes(16).toString("base64url")}`
}
