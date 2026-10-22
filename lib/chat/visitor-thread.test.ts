import { describe, expect, it, vi } from "vitest"
import type { UIMessage } from "ai"

import {
  acceptVisitorPass,
  deliverVisitorQuestion,
  readVisitorMessages,
  stopVisitorAnswering,
  VISITOR_PASS_REFUSED_STATUS,
  visitorMessagesKey,
  withVisitorPass,
  writeVisitorMessages,
} from "@/lib/chat/visitor-thread"

const BOT = "bot_abc"

const messages: UIMessage[] = [
  {
    id: "question-1",
    role: "user",
    parts: [{ type: "text", text: "What are your hours?" }],
  },
  {
    id: "answer-1",
    role: "assistant",
    parts: [{ type: "text", text: "We open at 8." }],
  },
]

/** In-memory stand-in for the iframe's localStorage. */
function memoryStorage() {
  const values = new Map<string, string>()

  return {
    getItem(key: string) {
      return values.get(key) ?? null
    },
    setItem(key: string, value: string) {
      values.set(key, value)
    },
  }
}

describe("visitor messages", () => {
  it("keeps stored messages across a reload", () => {
    const storage = memoryStorage()

    writeVisitorMessages(storage, BOT, messages)

    expect(visitorMessagesKey(BOT)).toContain(BOT)
    expect(readVisitorMessages(storage, BOT)).toEqual(messages)
    expect(readVisitorMessages(storage, "bot_other")).toEqual([])
  })

  it("does not clear stored messages when a new pass arrives", () => {
    const storage = memoryStorage()
    const thread = {
      messages,
      pass: "pass-1",
      answering: true,
    }

    writeVisitorMessages(storage, BOT, thread.messages)

    const next = acceptVisitorPass(thread, "pass-2")

    expect(next.messages).toBe(messages)
    expect(next.pass).toBe("pass-2")
    expect(next.answering).toBe(true)
    writeVisitorMessages(storage, BOT, next.messages)
    expect(readVisitorMessages(storage, BOT)).toEqual(messages)
  })

  it("drops a stored value that is not a thread", () => {
    const storage = memoryStorage()
    storage.setItem(visitorMessagesKey(BOT), "not-json")
    storage.setItem(
      visitorMessagesKey("bot_other"),
      JSON.stringify({ nope: true })
    )
    storage.setItem(
      visitorMessagesKey("bot_mixed"),
      JSON.stringify([
        messages[0],
        null,
        { id: "question-1", role: "user" },
        "nope",
        {
          id: "note-1",
          role: "system",
          parts: [{ type: "text", text: "Note" }],
        },
        messages[1],
      ])
    )

    expect(readVisitorMessages(storage, BOT)).toEqual([])
    expect(readVisitorMessages(storage, "bot_other")).toEqual([])
    expect(readVisitorMessages(storage, "bot_mixed")).toEqual([
      messages[0],
      {
        id: "note-1",
        role: "system",
        parts: [{ type: "text", text: "Note" }],
      },
      messages[1],
    ])
  })

  it("leaves the on-screen messages alone when the browser refuses to store them", () => {
    expect(() =>
      writeVisitorMessages(
        {
          setItem() {
            throw new Error("quota")
          },
        },
        BOT,
        messages
      )
    ).not.toThrow()
  })

  it("leaves the messages on screen when answering stops", () => {
    const thread = { messages, pass: "pass-1", answering: true }
    const stopped = stopVisitorAnswering(thread)

    expect(stopped.messages).toBe(messages)
    expect(stopped.pass).toBe("pass-1")
    expect(stopped.answering).toBe(false)
  })

  it("does not ask for a new pass when the question is accepted", async () => {
    const refresh = vi.fn()
    const fetchImpl = vi.fn(async () => new Response("ok", { status: 200 }))

    const result = await deliverVisitorQuestion(
      "/api/widget/chat",
      {
        method: "POST",
        body: JSON.stringify({ botId: BOT, pass: "pass-1", messages }),
      },
      "pass-1",
      refresh,
      fetchImpl
    )

    expect(refresh).not.toHaveBeenCalled()
    expect(fetchImpl).toHaveBeenCalledOnce()
    expect(result.answering).toBe(true)
    expect(result.pass).toBe("pass-1")
    expect(result.response.status).toBe(200)
  })

  it("sends only the pass when the question body is not a JSON object", async () => {
    const bodies: string[] = []
    const fetchImpl = vi.fn(async (_input: unknown, init?: RequestInit) => {
      bodies.push(String(init?.body))
      return new Response("ok", { status: 200 })
    })

    await deliverVisitorQuestion(
      "/api/widget/chat",
      { method: "POST", body: "not-json" },
      "pass-1",
      vi.fn(),
      fetchImpl
    )
    await deliverVisitorQuestion(
      "/api/widget/chat",
      { method: "POST", body: JSON.stringify(["not", "an", "object"]) },
      "pass-1",
      vi.fn(),
      fetchImpl
    )
    await deliverVisitorQuestion(
      "/api/widget/chat",
      { method: "POST" },
      "pass-1",
      vi.fn(),
      fetchImpl
    )

    expect(JSON.parse(bodies[0])).toEqual({ pass: "pass-1" })
    expect(JSON.parse(bodies[1])).toEqual({ pass: "pass-1" })
    expect(JSON.parse(bodies[2])).toEqual({ pass: "pass-1" })
  })

  it("sends the same question again when a refused pass is replaced", async () => {
    const bodies: string[] = []
    const refresh = vi
      .fn()
      .mockResolvedValue({ outcome: "pass", pass: "pass-2" })
    const fetchImpl = vi.fn(async (_input: unknown, init?: RequestInit) => {
      bodies.push(String(init?.body))
      return new Response("no", {
        status: bodies.length === 1 ? VISITOR_PASS_REFUSED_STATUS : 200,
      })
    })
    const body = JSON.stringify({
      botId: BOT,
      pass: "pass-1",
      messages,
    })

    const result = await deliverVisitorQuestion(
      "/api/widget/chat",
      { method: "POST", body },
      "pass-1",
      refresh,
      fetchImpl
    )

    expect(refresh).toHaveBeenCalledOnce()
    expect(fetchImpl).toHaveBeenCalledTimes(2)
    expect(JSON.parse(bodies[1])).toEqual({
      botId: BOT,
      pass: "pass-2",
      messages,
    })
    expect(result.answering).toBe(true)
    expect(result.pass).toBe("pass-2")
    expect(result.response.status).toBe(200)
  })

  it("stops answering when the host site is removed or Askdesk cannot be reached", async () => {
    for (const next of [
      { outcome: "denied" as const },
      { outcome: "unreachable" as const },
      { outcome: "pass" as const, pass: "" },
    ]) {
      const fetchImpl = vi.fn(
        async () => new Response("no", { status: VISITOR_PASS_REFUSED_STATUS })
      )
      const refresh = vi.fn().mockResolvedValue(next)

      const result = await deliverVisitorQuestion(
        "/api/widget/chat",
        { method: "POST", body: withVisitorPass("{}", "pass-1") },
        "pass-1",
        refresh,
        fetchImpl
      )

      expect(fetchImpl).toHaveBeenCalledOnce()
      expect(refresh).toHaveBeenCalledOnce()
      expect(result.answering).toBe(false)
      expect(result.pass).toBe("pass-1")
      expect(result.refresh).toEqual(next)
      expect(result.response.status).toBe(VISITOR_PASS_REFUSED_STATUS)
    }
  })
})
