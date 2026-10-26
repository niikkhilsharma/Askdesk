import { afterEach, describe, expect, it } from "vitest"

import { getLlmClientOptions } from "@/lib/llm"

const envKeys = [
  "IS_USING_LITELLM",
  "OPENAI_API_KEY",
  "LITE_LLM_VIRTUAL_KEY_1",
  "LITE_LLM_BASE_URL",
] as const

const originalEnv = Object.fromEntries(
  envKeys.map((key) => [key, process.env[key]])
)

/** Restores provider env vars so one case cannot leak into the next. */
function restoreEnv() {
  for (const key of envKeys) {
    const value = originalEnv[key]

    if (value === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }
}

describe("getLlmClientOptions", () => {
  afterEach(() => {
    restoreEnv()
  })

  it("calls OpenAI when the LiteLLM flag is unset", () => {
    delete process.env.IS_USING_LITELLM
    process.env.OPENAI_API_KEY = "sk-openai"

    expect(getLlmClientOptions()).toEqual({
      apiKey: "sk-openai",
      configuration: { baseURL: "https://api.openai.com/v1" },
    })
  })

  it("calls OpenAI when the LiteLLM flag is false", () => {
    process.env.IS_USING_LITELLM = "false"
    process.env.OPENAI_API_KEY = "sk-openai"

    expect(getLlmClientOptions().configuration.baseURL).toBe(
      "https://api.openai.com/v1"
    )
  })

  it("calls LiteLLM when the flag is true", () => {
    process.env.IS_USING_LITELLM = "true"
    process.env.LITE_LLM_VIRTUAL_KEY_1 = "sk-virtual"
    process.env.LITE_LLM_BASE_URL = "https://proxy.example.com/v1"

    expect(getLlmClientOptions()).toEqual({
      apiKey: "sk-virtual",
      configuration: { baseURL: "https://proxy.example.com/v1" },
    })
  })

  it("uses the local LiteLLM proxy when no base URL is set", () => {
    process.env.IS_USING_LITELLM = "true"
    process.env.LITE_LLM_VIRTUAL_KEY_1 = "sk-virtual"
    delete process.env.LITE_LLM_BASE_URL

    expect(getLlmClientOptions().configuration.baseURL).toBe(
      "http://localhost:4000/v1"
    )
  })

  it("rejects a flag other than true or false", () => {
    process.env.IS_USING_LITELLM = "yes"

    expect(() => getLlmClientOptions()).toThrow(
      "IS_USING_LITELLM must be true or false"
    )
  })

  it("requires the key for the selected provider", () => {
    delete process.env.IS_USING_LITELLM
    delete process.env.OPENAI_API_KEY

    expect(() => getLlmClientOptions()).toThrow("Missing OPENAI_API_KEY")

    process.env.IS_USING_LITELLM = "true"
    delete process.env.LITE_LLM_VIRTUAL_KEY_1

    expect(() => getLlmClientOptions()).toThrow(
      "Missing LITE_LLM_VIRTUAL_KEY_1"
    )
  })
})
