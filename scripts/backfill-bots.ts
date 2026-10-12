import { config } from "dotenv"
import path from "node:path"
import { pathToFileURL } from "node:url"

config({ path: ".env.local" })
config()

/** Creates a bot for each existing account that does not have one. */
export async function backfillExistingAccounts() {
  const { backfillBots } = await import("../lib/install/bots")
  const result = await backfillBots()

  console.log(
    `Bots ready. ${result.created} created across ${result.accounts} accounts.`
  )
}

const entry = process.argv[1]

if (entry && import.meta.url === pathToFileURL(path.resolve(entry)).href) {
  backfillExistingAccounts().catch((error) => {
    console.error("Failed to backfill bots:", error)
    process.exit(1)
  })
}
