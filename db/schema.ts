import { integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const documentStatuses = ["pending", "processing", "ready", "failed"] as const

export type DocumentStatus = (typeof documentStatuses)[number]

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fullName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
})

export const documentsTable = pgTable("documents", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  fileName: varchar({ length: 255 }).notNull(),
  publicId: varchar({ length: 512 }).notNull().unique(),
  secureUrl: varchar({ length: 1024 }).notNull(),
  bytes: integer().notNull(),
  status: varchar({ length: 32 }).$type<DocumentStatus>().notNull().default("pending"),
  lastError: text(),
  indexedAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
})

export type Document = typeof documentsTable.$inferSelect
