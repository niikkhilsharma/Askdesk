import type { UIMessage } from "ai"

/** Status the widget chat route uses when the pass cannot be used. */
export const VISITOR_PASS_REFUSED_STATUS = 401

export type VisitorRefresh =
  | { outcome: "pass"; pass: string }
  | { outcome: "denied" }
  | { outcome: "unreachable" }

export type VisitorThread = {
  messages: UIMessage[]
  pass: string | null
  answering: boolean
}

type VisitorMessageStore = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

/** Storage key for one bot's visitor thread. */
export function visitorMessagesKey(botId: string) {
  return `askdesk:visitor-messages:${botId}`
}

/** Reads the messages stored for this bot. */
export function readVisitorMessages(
  storage: Pick<VisitorMessageStore, "getItem">,
  botId: string
) {
  try {
    const raw = storage.getItem(visitorMessagesKey(botId))

    if (!raw) {
      return []
    }

    const parsed: unknown = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(isVisitorMessage)
  } catch {
    return []
  }
}

/** Saves this bot's messages in the browser. */
export function writeVisitorMessages(
  storage: Pick<VisitorMessageStore, "setItem">,
  botId: string,
  messages: UIMessage[]
) {
  try {
    storage.setItem(visitorMessagesKey(botId), JSON.stringify(messages))
  } catch {
    // A full or blocked store still leaves the messages on screen.
  }
}

/** Keeps the current messages when a new visitor pass arrives. */
export function acceptVisitorPass(thread: VisitorThread, pass: string) {
  return {
    messages: thread.messages,
    pass,
    answering: thread.answering,
  }
}

/** Leaves the messages on screen and stops answering. */
export function stopVisitorAnswering(thread: VisitorThread) {
  return {
    messages: thread.messages,
    pass: thread.pass,
    answering: false,
  }
}

/** Returns the chat request body with this visitor pass and the same messages. */
export function withVisitorPass(body: string, pass: string) {
  try {
    const payload: unknown = JSON.parse(body)

    if (
      typeof payload === "object" &&
      payload !== null &&
      !Array.isArray(payload)
    ) {
      return JSON.stringify({ ...payload, pass })
    }
  } catch {
    // A body that is not JSON is sent with only the pass.
  }

  return JSON.stringify({ pass })
}

/** Posts the question with this pass, and once more after a refused pass is replaced. */
export async function deliverVisitorQuestion(
  input: Parameters<typeof fetch>[0],
  init: RequestInit | undefined,
  pass: string,
  refresh: () => Promise<VisitorRefresh>,
  fetchImpl: typeof fetch = globalThis.fetch
) {
  const send = (nextPass: string) =>
    fetchImpl(input, {
      ...init,
      body: withVisitorPass(requestBody(init), nextPass),
    })

  const first = await send(pass)

  if (first.status !== VISITOR_PASS_REFUSED_STATUS) {
    return { response: first, pass, answering: true, refresh: null }
  }

  const next = await refresh()

  if (next.outcome !== "pass" || next.pass.length === 0) {
    return { response: first, pass, answering: false, refresh: next }
  }

  const second = await send(next.pass)

  return {
    response: second,
    pass: next.pass,
    answering: true,
    refresh: next,
  }
}

/** Reads the JSON body the chat transport already prepared. */
function requestBody(init: RequestInit | undefined) {
  return typeof init?.body === "string" ? init.body : "{}"
}

/** Reports whether a stored value is a chat message. */
function isVisitorMessage(value: unknown): value is UIMessage {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const message = value as { id?: unknown; role?: unknown; parts?: unknown }

  return (
    typeof message.id === "string" &&
    (message.role === "user" ||
      message.role === "assistant" ||
      message.role === "system") &&
    Array.isArray(message.parts)
  )
}
