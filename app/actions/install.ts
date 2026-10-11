"use server"

import { auth } from "@/auth"
import db from "@/db/db"
import { hostSitesTable } from "@/db/schema"
import { ensureBotForUser } from "@/lib/install/bots"
import { getDatabaseErrorCode } from "@/lib/install/db-error"
import { parseHostSiteOrigin } from "@/lib/install/origin"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type HostSiteActionState = {
  message: string | null
}

/** Returns the signed-in account id, or throws when no one is signed in. */
async function requireUserId() {
  const session = await auth()

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  return Number(session.user.id)
}

/** Adds a host site from a pasted page URL. */
export async function addHostSiteAction(
  _previous: HostSiteActionState,
  formData: FormData
): Promise<HostSiteActionState> {
  const userId = await requireUserId()
  const parsed = parseHostSiteOrigin(String(formData.get("url") ?? ""))

  if (!parsed.ok) {
    return { message: parsed.message }
  }

  const bot = await ensureBotForUser(userId)

  try {
    await db.insert(hostSitesTable).values({
      botId: bot.id,
      origin: parsed.origin,
    })
  } catch (error) {
    if (getDatabaseErrorCode(error) === "23505") {
      return { message: "This site is already listed." }
    }

    throw error
  }

  revalidatePath("/dashboard/install")

  return { message: null }
}

/** Removes one host site that belongs to the signed-in account. */
export async function removeHostSiteAction(formData: FormData) {
  const userId = await requireUserId()
  const hostSiteId = Number(formData.get("hostSiteId"))

  if (!hostSiteId || Number.isNaN(hostSiteId)) {
    throw new Error("Invalid host site")
  }

  const bot = await ensureBotForUser(userId)

  await db
    .delete(hostSitesTable)
    .where(
      and(eq(hostSitesTable.id, hostSiteId), eq(hostSitesTable.botId, bot.id))
    )

  revalidatePath("/dashboard/install")
}
