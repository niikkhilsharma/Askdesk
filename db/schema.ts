import {
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core"

export const documentStatuses = [
  "pending",
  "processing",
  "ready",
  "failed",
] as const

export type DocumentStatus = (typeof documentStatuses)[number]

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fullName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
})

export const botsTable = pgTable("bots", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .unique()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  publicId: varchar({ length: 64 }).notNull().unique(),
  createdAt: timestamp().defaultNow().notNull(),
})

export const hostSitesTable = pgTable(
  "host_sites",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    botId: integer()
      .notNull()
      .references(() => botsTable.id, { onDelete: "cascade" }),
    origin: varchar({ length: 255 }).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => [unique("host_sites_bot_origin").on(table.botId, table.origin)]
)

export const documentsTable = pgTable("documents", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  fileName: varchar({ length: 255 }).notNull(),
  publicId: varchar({ length: 512 }).notNull().unique(),
  secureUrl: varchar({ length: 1024 }).notNull(),
  bytes: integer().notNull(),
  status: varchar({ length: 32 })
    .$type<DocumentStatus>()
    .notNull()
    .default("pending"),
  lastError: text(),
  indexedAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
})

export type Bot = typeof botsTable.$inferSelect
export type HostSite = typeof hostSitesTable.$inferSelect
export type Document = typeof documentsTable.$inferSelect
