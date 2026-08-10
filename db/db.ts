import { drizzle } from "drizzle-orm/neon-http"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL")
}

const db = drizzle(databaseUrl!)
export default db
