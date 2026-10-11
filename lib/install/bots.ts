import { asc, eq } from "drizzle-orm"

import db from "@/db/db"
import { botsTable, hostSitesTable, usersTable } from "@/db/schema"
import { getDatabaseErrorCode } from "@/lib/install/db-error"
import { createBotPublicId } from "@/lib/install/public-id"

/** Returns the account's bot, creating one when the account does not have it yet. */
export async function ensureBotForUser(userId: number) {
  const [existing] = await db
    .select()
    .from(botsTable)
    .where(eq(botsTable.userId, userId))
    .limit(1)

  if (existing) {
    return existing
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const [bot] = await db
        .insert(botsTable)
        .values({
          userId,
          publicId: createBotPublicId(),
        })
        .returning()

      return bot
    } catch (error) {
      if (getDatabaseErrorCode(error) !== "23505") {
        throw error
      }

      const [created] = await db
        .select()
        .from(botsTable)
        .where(eq(botsTable.userId, userId))
        .limit(1)

      if (created) {
        return created
      }
    }
  }

  throw new Error("Could not create a bot")
}

/** Loads the account's bot and the host sites it is allowed to run on. */
export async function getInstallState(userId: number) {
  const bot = await ensureBotForUser(userId)
  const hostSites = await db
    .select()
    .from(hostSitesTable)
    .where(eq(hostSitesTable.botId, bot.id))
    .orderBy(asc(hostSitesTable.createdAt), asc(hostSitesTable.id))

  return { bot, hostSites }
}

/** Creates a bot for every account that does not have one yet. */
export async function backfillBots() {
  const users = await db.select({ id: usersTable.id }).from(usersTable)
  let created = 0

  for (const user of users) {
    const [existing] = await db
      .select({ id: botsTable.id })
      .from(botsTable)
      .where(eq(botsTable.userId, user.id))
      .limit(1)

    if (existing) {
      continue
    }

    await ensureBotForUser(user.id)
    created += 1
  }

  return { accounts: users.length, created }
}
