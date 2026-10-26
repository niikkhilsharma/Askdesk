export const KNOWLEDGE_BASE_FOLDER = "knowledge-base"
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024 // 10MB

export const EMBEDDING_MODEL = "text-embedding-3-small"
export const EMBEDDING_DIMENSIONS = 1536

type ChatModelSettings = {
  temperature?: number
  reasoning?: {
    effort: "none" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max"
  }
}

/** Model ids and the request settings each one accepts. */
export const CHAT_MODELS = {
  "gpt-6-luna": {
    reasoning: { effort: "none" },
  },
} satisfies Record<string, ChatModelSettings>

/** The chat model used for RAG answers. Must be a key of CHAT_MODELS. */
export const CHAT_MODEL = "gpt-6-luna" satisfies keyof typeof CHAT_MODELS

export const CHUNK_SIZE = 1000
export const CHUNK_OVERLAP = 200
export const RETRIEVAL_TOP_K = 4
