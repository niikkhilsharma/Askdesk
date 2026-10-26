import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai"
import { createUIMessageStream } from "ai"

import {
  CHAT_MODEL,
  CHAT_MODELS,
  EMBEDDING_MODEL,
} from "@/lib/knowledge-base/constants"

const OPENAI_BASE_URL = "https://api.openai.com/v1"

/** Returns whether chat and embeddings should go through the LiteLLM proxy. */
function isUsingLiteLlm() {
  const value = process.env.IS_USING_LITELLM?.trim()

  if (value === undefined || value === "" || value === "false") {
    return false
  }

  if (value === "true") {
    return true
  }

  throw new Error("IS_USING_LITELLM must be true or false")
}

/** Returns the LiteLLM proxy base URL. */
function getLiteLlmBaseUrl() {
  return process.env.LITE_LLM_BASE_URL ?? "http://localhost:4000/v1"
}

/** Returns the LiteLLM virtual API key. */
function getLiteLlmApiKey() {
  const apiKey = process.env.LITE_LLM_VIRTUAL_KEY_1

  if (!apiKey) {
    throw new Error("Missing LITE_LLM_VIRTUAL_KEY_1")
  }

  return apiKey
}

/** Returns the OpenAI API key used when the LiteLLM proxy is off. */
function getOpenAiApiKey() {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY")
  }

  return apiKey
}

/** Builds the shared client options used by chat and embeddings. */
export function getLlmClientOptions() {
  if (isUsingLiteLlm()) {
    return {
      apiKey: getLiteLlmApiKey(),
      configuration: {
        baseURL: getLiteLlmBaseUrl(),
      },
    }
  }

  return {
    apiKey: getOpenAiApiKey(),
    configuration: {
      baseURL: OPENAI_BASE_URL,
    },
  }
}

/** Creates a chat model for RAG answers. */
export function createChatModel() {
  return new ChatOpenAI({
    model: CHAT_MODEL,
    ...CHAT_MODELS[CHAT_MODEL],
    useResponsesApi: false,
    ...getLlmClientOptions(),
  })
}

/** Creates an embeddings model for indexing and retrieval. */
export function createEmbeddings() {
  return new OpenAIEmbeddings({
    model: EMBEDDING_MODEL,
    ...getLlmClientOptions(),
  })
}

/** Pulls plain text out of a LangChain message content value. */
export function messageContentToText(content: unknown): string {
  if (typeof content === "string") {
    return content
  }

  if (!Array.isArray(content)) {
    return ""
  }

  return content
    .map((part) => {
      if (typeof part === "string") {
        return part
      }

      if (
        typeof part === "object" &&
        part !== null &&
        "text" in part &&
        typeof part.text === "string"
      ) {
        return part.text
      }

      return ""
    })
    .join("")
}

/** Converts a LangChain token stream into the UI message stream useChat expects. */
export function langchainToUIMessageStream(
  tokenStream: AsyncIterable<{ content: unknown }>
) {
  return createUIMessageStream({
    execute: async ({ writer }) => {
      const textId = crypto.randomUUID()

      writer.write({ type: "text-start", id: textId })

      for await (const chunk of tokenStream) {
        const delta = messageContentToText(chunk.content)

        if (delta) {
          writer.write({ type: "text-delta", id: textId, delta })
        }
      }

      writer.write({ type: "text-end", id: textId })
    },
  })
}
