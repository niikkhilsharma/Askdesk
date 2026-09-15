import { PineconeStore } from "@langchain/pinecone"
import { Pinecone } from "@pinecone-database/pinecone"

import { EMBEDDING_DIMENSIONS } from "@/lib/knowledge-base/constants"
import { createEmbeddings } from "@/lib/llm"

/** Returns the configured Pinecone index name. */
function getPineconeIndexName() {
  return process.env.PINECONE_INDEX_NAME ?? "knowledge-base"
}

/** Returns the cloud used when creating a new Pinecone index. */
function getPineconeCloud() {
  return process.env.PINECONE_CLOUD ?? "aws"
}

/** Returns the region used when creating a new Pinecone index. */
function getPineconeRegion() {
  return process.env.PINECONE_REGION ?? "us-east-1"
}

let pinecone: Pinecone | null = null
let ensureIndexPromise: Promise<void> | null = null

/** Returns the shared Pinecone client. */
export function getPineconeClient() {
  if (!pinecone) {
    const apiKey = process.env.PINECONE_API_KEY

    if (!apiKey) {
      throw new Error("Missing PINECONE_API_KEY")
    }

    pinecone = new Pinecone({ apiKey })
  }

  return pinecone
}

/** Builds the per-user Pinecone namespace. */
export function getUserNamespace(userId: number) {
  return `user:${userId}`
}

/** Creates the knowledge-base index when it does not already exist. */
export async function ensurePineconeIndex() {
  if (!ensureIndexPromise) {
    ensureIndexPromise = createIndexIfNeeded()
  }

  return ensureIndexPromise
}

/** Creates a cosine index for text-embedding-3-small if Pinecone does not have one. */
async function createIndexIfNeeded() {
  const client = getPineconeClient()
  const existing = await client.listIndexes()
  const indexName = getPineconeIndexName()
  const alreadyExists = existing.indexes?.some(
    (index) => index.name === indexName
  )

  if (alreadyExists) {
    return
  }

  await client.createIndex({
    name: indexName,
    dimension: EMBEDDING_DIMENSIONS,
    metric: "cosine",
    spec: {
      serverless: {
        cloud: getPineconeCloud() as "aws" | "gcp" | "azure",
        region: getPineconeRegion(),
      },
    },
    waitUntilReady: true,
    suppressConflicts: true,
  })
}

/** Returns a LangChain vector store scoped to one user's namespace. */
export async function getUserVectorStore(userId: number) {
  await ensurePineconeIndex()

  const pineconeIndex = getPineconeClient().index(getPineconeIndexName())

  return PineconeStore.fromExistingIndex(createEmbeddings(), {
    pineconeIndex,
    namespace: getUserNamespace(userId),
  })
}

/** Deletes every vector that belongs to one document in a user's namespace. */
export async function deleteDocumentVectors(
  userId: number,
  documentId: number
) {
  const vectorStore = await getUserVectorStore(userId)

  await vectorStore.delete({
    filter: {
      documentId: String(documentId),
    },
  })
}
