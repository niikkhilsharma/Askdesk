import * as userData from "@/dummy-data/user.json"
import bcrypt from "bcryptjs"
import db from "@/db/db"
import { usersTable } from "@/db/schema"
import { eq } from "drizzle-orm"

const SALT_ROUNDS = 10

export async function findUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1)

  return user ?? null
}

/**
 * Hashes a plaintext password with a generated salt.
 * bcrypt embeds the salt in the resulting hash string,
 * so you don't need to store it separately.
 */
export async function saltAndHashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  const hash = await bcrypt.hash(password, salt)
  return hash
}

/**
 * Compares a plaintext password against a stored bcrypt hash.
 * You'll need this in `authorize` to actually verify login attempts.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
