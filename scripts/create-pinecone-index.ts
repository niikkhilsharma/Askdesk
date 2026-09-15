import { config } from "dotenv"

import { ensurePineconeIndex } from "../lib/pinecone"

config({ path: ".env.local" })
config()

/** Creates the Pinecone knowledge-base index if it is missing. */
async function main() {
  await ensurePineconeIndex()
  console.log("Pinecone knowledge-base index is ready.")
}

main().catch((error) => {
  console.error("Failed to create the Pinecone index:", error)
  process.exit(1)
})
