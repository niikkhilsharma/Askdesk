import { and, eq } from "drizzle-orm"

import db from "@/db/db"
import { botsTable, hostSitesTable } from "@/db/schema"

/** Reports whether this bot is allowed to run on the given origin. */
export async function isBotAllowedOnOrigin(publicId: string, origin: string) {
  if (!publicId || publicId.length > 64 || !origin) {
    return false
  }

  const [match] = await db
    .select({ id: hostSitesTable.id })
    .from(botsTable)
    .innerJoin(hostSitesTable, eq(hostSitesTable.botId, botsTable.id))
    .where(
      and(eq(botsTable.publicId, publicId), eq(hostSitesTable.origin, origin))
    )
    .limit(1)

  return Boolean(match)
}
