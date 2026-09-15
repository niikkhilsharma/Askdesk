import { and, eq } from "drizzle-orm"

import db from "@/db/db"
import { documentsTable } from "@/db/schema"
import { RETRIEVAL_TOP_K } from "@/lib/knowledge-base/constants"
import { getUserVectorStore } from "@/lib/pinecone"

export type RetrievedChunk = {
  content: string
  fileName: string
  page: number | null
}

/** Returns whether the user has at least one ready document. */
export async function hasReadyDocuments(userId: number) {
  const [readyDocument] = await db
    .select({ id: documentsTable.id })
    .from(documentsTable)
    .where(
      and(
        eq(documentsTable.userId, userId),
        eq(documentsTable.status, "ready")
      )
    )
    .limit(1)

  return Boolean(readyDocument)
}

/** Finds the chunks most relevant to a question in one user's knowledge base. */
export async function retrieveRelevantChunks(
  userId: number,
  query: string
): Promise<RetrievedChunk[]> {
  const vectorStore = await getUserVectorStore(userId)
  const results = await vectorStore.similaritySearch(query, RETRIEVAL_TOP_K)

  return results.map((document) => ({
    content: document.pageContent,
    fileName:
      typeof document.metadata.fileName === "string"
        ? document.metadata.fileName
        : "Unknown file",
    page:
      typeof document.metadata.page === "number" ? document.metadata.page : null,
  }))
}

/** Turns retrieved chunks into prompt context the model can cite. */
export function formatRetrievedContext(chunks: RetrievedChunk[]) {
  return chunks
    .map((chunk, index) => {
      const pageLabel = chunk.page ? `, p.${chunk.page}` : ""

      return `[Excerpt ${index + 1}: ${chunk.fileName}${pageLabel}]\n${chunk.content}`
    })
    .join("\n\n")
}
