import { config } from "dotenv"

config({ path: ".env.local" })
config()

/** Creates a bot for each existing account that does not have one. */
async function main() {
  const { backfillBots } = await import("../lib/install/bots")
  const result = await backfillBots()

  console.log(
    `Bots ready. ${result.created} created across ${result.accounts} accounts.`
  )
}

main().catch((error) => {
  console.error("Failed to backfill bots:", error)
  process.exit(1)
})
