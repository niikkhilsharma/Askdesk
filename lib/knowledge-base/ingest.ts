import { Document } from "@langchain/core/documents"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { and, eq, inArray } from "drizzle-orm"
import { extractText, getDocumentProxy } from "unpdf"

import db from "@/db/db"
import { documentsTable, type DocumentStatus } from "@/db/schema"
import {
  CHUNK_OVERLAP,
  CHUNK_SIZE,
} from "@/lib/knowledge-base/constants"
import { deleteDocumentVectors, getUserVectorStore } from "@/lib/pinecone"

const LAST_ERROR_MAX_LENGTH = 1000

/** Turns an unknown ingest failure into a short database-safe message. */
function toErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message.slice(0, LAST_ERROR_MAX_LENGTH)
  }

  return "Indexing failed"
}

/** Marks a document as failed and stores the last error. */
async function markDocumentFailed(documentId: number, error: unknown) {
  await db
    .update(documentsTable)
    .set({
      status: "failed",
      lastError: toErrorMessage(error),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(documentsTable.id, documentId),
        eq(documentsTable.status, "processing")
      )
    )
}

/** Claims a document for ingest so two jobs cannot index the same file. */
async function claimDocument(
  documentId: number,
  fromStatuses: DocumentStatus[]
) {
  const [claimed] = await db
    .update(documentsTable)
    .set({
      status: "processing",
      lastError: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(documentsTable.id, documentId),
        inArray(documentsTable.status, fromStatuses)
      )
    )
    .returning()

  return claimed ?? null
}

/** Downloads a PDF from Cloudinary and splits it into page-aware chunks. */
async function loadDocumentChunks(document: {
  id: number
  userId: number
  fileName: string
  secureUrl: string
}) {
  const response = await fetch(document.secureUrl)

  if (!response.ok) {
    throw new Error("Failed to download the PDF from Cloudinary")
  }

  const bytes = new Uint8Array(await response.arrayBuffer())
  const pdf = await getDocumentProxy(bytes)
  const { text: pageTexts } = await extractText(pdf, { mergePages: false })

  const pageDocuments = pageTexts.flatMap((pageText, index) => {
    if (!pageText.trim()) {
      return []
    }

    return [
      new Document({
        pageContent: pageText,
        metadata: {
          userId: document.userId,
          documentId: String(document.id),
          fileName: document.fileName,
          page: index + 1,
          source: document.secureUrl,
        },
      }),
    ]
  })

  if (pageDocuments.length === 0) {
    throw new Error(
      "No text could be extracted. This PDF may be scanned or image-only."
    )
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  })

  return splitter.splitDocuments(pageDocuments)
}

/** Extracts, embeds, and stores one document in Pinecone. */
export async function ingestDocument(
  documentId: number,
  options?: { fromStatuses?: DocumentStatus[] }
) {
  const fromStatuses = options?.fromStatuses ?? ["pending", "failed"]
  const claimed = await claimDocument(documentId, fromStatuses)

  if (!claimed) {
    return
  }

  try {
    const chunks = await loadDocumentChunks(claimed)

    if (chunks.length === 0) {
      throw new Error("The PDF produced no searchable text chunks.")
    }

    const vectorStore = await getUserVectorStore(claimed.userId)

    await deleteDocumentVectors(claimed.userId, claimed.id).catch(() => undefined)

    await vectorStore.addDocuments(chunks, {
      ids: chunks.map((_, index) => `${claimed.id}-${index}`),
    })

    await db
      .update(documentsTable)
      .set({
        status: "ready",
        lastError: null,
        indexedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(documentsTable.id, claimed.id))
  } catch (error) {
    await markDocumentFailed(claimed.id, error)
    console.error("Failed to index document:", error)
  }
}

/** Starts ingest for every pending document owned by a user. */
export async function resumePendingDocuments(userId: number) {
  const pendingDocuments = await db
    .select({ id: documentsTable.id })
    .from(documentsTable)
    .where(
      and(
        eq(documentsTable.userId, userId),
        eq(documentsTable.status, "pending")
      )
    )

  await Promise.all(
    pendingDocuments.map((document) =>
      ingestDocument(document.id, { fromStatuses: ["pending"] })
    )
  )
}
