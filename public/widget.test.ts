import { beforeEach, describe, expect, it, vi } from "vitest"

/** Builds a fake host-page document for the embed loader. */
function fakeDocument({
  botId,
  existingWidget = null,
}: {
  botId: string | null
  existingWidget?: { id: string } | null
}) {
  const iframe = {
    id: "",
    src: "",
    style: {} as Record<string, string>,
    contentWindow: { postMessage: vi.fn() },
    remove: vi.fn(),
    setAttribute: vi.fn(),
    addEventListener: vi.fn(),
  }
  const appendChild = vi.fn()

  return {
    iframe,
    appendChild,
    document: {
      currentScript: {
        getAttribute(name: string) {
          if (name === "src") {
            return "http://localhost:3000/widget.js"
          }
          if (name === "data-bot-id") {
            return botId
          }
          return null
        },
      },
      readyState: "complete",
      getElementById: vi.fn((id: string) =>
        id === "askdesk-chatbot-iframe" ? existingWidget : null
      ),
      createElement: vi.fn(() => iframe),
      body: { appendChild },
      addEventListener: vi.fn(),
    },
  }
}

/** Lets the loader finish its placement check. */
async function flushLoader() {
  await new Promise((resolve) => setTimeout(resolve, 0))
}

/** Placement response the loader can read a visitor pass from. */
function allowedPlacement(pass: string) {
  return {
    ok: true,
    json: async () => ({ allowed: true, pass }),
  }
}

/** Returns the load listener the loader registered on the iframe. */
function frameLoadHandler(iframe: {
  addEventListener: ReturnType<typeof vi.fn>
}) {
  const call = iframe.addEventListener.mock.calls.find(
    (entry) => entry[0] === "load"
  )

  if (!call) {
    throw new Error("iframe load listener was not registered")
  }

  return call[1] as () => void
}

/** Loads the classic widget script. It has no exports; the host page runs it as a script. */
async function loadWidgetScript() {
  // @ts-expect-error widget.js is a classic browser script, not an ES module.
  await import("./widget.js")
}

describe("Askdesk widget loader", () => {
  const messageHandlers: Array<
    (event: { origin: string; data: unknown; source: unknown }) => void
  > = []

  beforeEach(() => {
    messageHandlers.length = 0
    vi.resetModules()
    vi.unstubAllGlobals()
    vi.stubGlobal("window", {
      addEventListener(
        _type: string,
        handler: (event: {
          origin: string
          data: unknown
          source: unknown
        }) => void
      ) {
        messageHandlers.push(handler)
      },
      removeEventListener(
        _type: string,
        handler: (event: {
          origin: string
          data: unknown
          source: unknown
        }) => void
      ) {
        const index = messageHandlers.indexOf(handler)
        if (index >= 0) messageHandlers.splice(index, 1)
      },
    })
  })

  it("logs and skips mounting when data-bot-id is missing", async () => {
    const consoleError = vi.fn()
    const fetchMock = vi.fn()
    const { appendChild, document } = fakeDocument({ botId: null })

    vi.stubGlobal("document", document)
    vi.stubGlobal("console", { error: consoleError })
    vi.stubGlobal("fetch", fetchMock)

    await loadWidgetScript()

    expect(consoleError).toHaveBeenCalledWith(
      "[Askdesk] Missing data-bot-id in script tag."
    )
    expect(fetchMock).not.toHaveBeenCalled()
    expect(appendChild).not.toHaveBeenCalled()
  })

  it("mounts one Askdesk iframe when the page is allowed", async () => {
    const consoleError = vi.fn()
    const fetchMock = vi.fn().mockResolvedValue(allowedPlacement("pass-1"))
    const { iframe, appendChild, document } = fakeDocument({
      botId: "bot_123",
    })

    vi.stubGlobal("document", document)
    vi.stubGlobal("console", { error: consoleError })
    vi.stubGlobal("fetch", fetchMock)

    await loadWidgetScript()
    await flushLoader()

    expect(consoleError).not.toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/api/widget/placement?botId=bot_123"
    )
    expect(iframe.id).toBe("askdesk-chatbot-iframe")
    expect(iframe.src).toBe("http://localhost:3000/widget?botId=bot_123")
    expect(iframe.setAttribute).toHaveBeenCalledWith("title", "Askdesk Chatbot")
    expect(iframe.setAttribute).toHaveBeenCalledWith("referrerpolicy", "origin")
    expect(appendChild).toHaveBeenCalledWith(iframe)
  })

  it("removes the iframe only for a close message from that frame", async () => {
    const fetchMock = vi.fn().mockResolvedValue(allowedPlacement("pass-1"))
    const { iframe, document } = fakeDocument({ botId: "bot_123" })

    vi.stubGlobal("document", document)
    vi.stubGlobal("console", { error: vi.fn() })
    vi.stubGlobal("fetch", fetchMock)

    await loadWidgetScript()
    await flushLoader()

    const onClose = messageHandlers[0]
    onClose({
      origin: "https://evil.example",
      data: { type: "askdesk:close" },
      source: iframe.contentWindow,
    })
    onClose({
      origin: "http://localhost:3000",
      data: { type: "askdesk:close" },
      source: {},
    })
    expect(iframe.remove).not.toHaveBeenCalled()

    onClose({
      origin: "http://localhost:3000",
      data: { type: "askdesk:close" },
      source: iframe.contentWindow,
    })
    expect(iframe.remove).toHaveBeenCalledOnce()
    expect(messageHandlers).toEqual([])
  })

  it("does not mount an iframe when the placement check cannot be reached", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network"))
    const { appendChild, document } = fakeDocument({ botId: "bot_123" })

    vi.stubGlobal("document", document)
    vi.stubGlobal("console", { error: vi.fn() })
    vi.stubGlobal("fetch", fetchMock)

    await loadWidgetScript()
    await flushLoader()

    expect(appendChild).not.toHaveBeenCalled()
  })

  it("does not mount an iframe when the page is not allowed", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false })
    const { appendChild, document } = fakeDocument({ botId: "bot_123" })

    vi.stubGlobal("document", document)
    vi.stubGlobal("console", { error: vi.fn() })
    vi.stubGlobal("fetch", fetchMock)

    await loadWidgetScript()
    await flushLoader()

    expect(fetchMock).toHaveBeenCalled()
    expect(appendChild).not.toHaveBeenCalled()
  })

  it("does not mount a second iframe when one already exists", async () => {
    const fetchMock = vi.fn()
    const { appendChild, document } = fakeDocument({
      botId: "bot_123",
      existingWidget: { id: "askdesk-chatbot-iframe" },
    })

    vi.stubGlobal("document", document)
    vi.stubGlobal("console", { error: vi.fn() })
    vi.stubGlobal("fetch", fetchMock)

    await loadWidgetScript()

    expect(fetchMock).not.toHaveBeenCalled()
    expect(appendChild).not.toHaveBeenCalled()
  })

  it("waits for the document when the script runs before it is ready", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false })
    const { document } = fakeDocument({ botId: "bot_123" })
    document.readyState = "loading"

    vi.stubGlobal("document", document)
    vi.stubGlobal("console", { error: vi.fn() })
    vi.stubGlobal("fetch", fetchMock)

    await loadWidgetScript()

    expect(document.addEventListener).toHaveBeenCalledWith(
      "DOMContentLoaded",
      expect.any(Function)
    )
    expect(fetchMock).not.toHaveBeenCalled()

    const onReady = document.addEventListener.mock.calls[0][1] as () => void
    onReady()
    await flushLoader()

    expect(fetchMock).toHaveBeenCalled()
  })

  it("falls back when the script address is missing", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false })
    const document = fakeDocument({ botId: "bot_123" }).document
    document.currentScript = {
      getAttribute(name: string) {
        return name === "data-bot-id" ? "bot_123" : null
      },
    }

    vi.stubGlobal("document", document)
    vi.stubGlobal("console", { error: vi.fn() })
    vi.stubGlobal("fetch", fetchMock)

    await loadWidgetScript()
    await flushLoader()

    expect(fetchMock).toHaveBeenCalledWith(
      "https://mydomain.com/api/widget/placement?botId=bot_123"
    )
  })

  it("hands the visitor pass to the iframe and replaces it when the iframe asks", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(allowedPlacement("pass-1"))
      .mockResolvedValueOnce(allowedPlacement("pass-2"))
    const { iframe, document } = fakeDocument({ botId: "bot_123" })

    vi.stubGlobal("document", document)
    vi.stubGlobal("console", { error: vi.fn() })
    vi.stubGlobal("fetch", fetchMock)

    await loadWidgetScript()
    await flushLoader()

    expect(iframe.contentWindow.postMessage).not.toHaveBeenCalled()

    frameLoadHandler(iframe)()

    expect(iframe.contentWindow.postMessage).toHaveBeenCalledWith(
      { type: "askdesk:pass", pass: "pass-1" },
      "http://localhost:3000"
    )

    const onMessage = messageHandlers[0]
    onMessage({
      origin: "https://evil.example",
      data: { type: "askdesk:refresh" },
      source: iframe.contentWindow,
    })
    onMessage({
      origin: "http://localhost:3000",
      data: { type: "askdesk:refresh" },
      source: {},
    })
    onMessage({
      origin: "http://localhost:3000",
      data: null,
      source: iframe.contentWindow,
    })
    onMessage({
      origin: "http://localhost:3000",
      data: { type: "askdesk:nope" },
      source: iframe.contentWindow,
    })
    await flushLoader()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(iframe.contentWindow.postMessage).toHaveBeenCalledTimes(1)

    onMessage({
      origin: "http://localhost:3000",
      data: { type: "askdesk:refresh" },
      source: iframe.contentWindow,
    })
    await flushLoader()

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(iframe.contentWindow.postMessage).toHaveBeenLastCalledWith(
      { type: "askdesk:pass", pass: "pass-2" },
      "http://localhost:3000"
    )
  })

  it("sends the pass it already holds when the iframe is listening", async () => {
    const fetchMock = vi.fn().mockResolvedValue(allowedPlacement("pass-1"))
    const { iframe, document } = fakeDocument({ botId: "bot_123" })

    vi.stubGlobal("document", document)
    vi.stubGlobal("console", { error: vi.fn() })
    vi.stubGlobal("fetch", fetchMock)

    await loadWidgetScript()
    await flushLoader()

    messageHandlers[0]({
      origin: "https://evil.example",
      data: { type: "askdesk:ready" },
      source: iframe.contentWindow,
    })
    messageHandlers[0]({
      origin: "http://localhost:3000",
      data: { type: "askdesk:ready" },
      source: iframe.contentWindow,
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(iframe.contentWindow.postMessage).toHaveBeenCalledTimes(1)
    expect(iframe.contentWindow.postMessage).toHaveBeenCalledWith(
      { type: "askdesk:pass", pass: "pass-1" },
      "http://localhost:3000"
    )
  })

  it("tells the iframe the host site is no longer allowed without removing it", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(allowedPlacement("pass-1"))
      .mockResolvedValueOnce({ ok: false, status: 404 })
    const { iframe, document } = fakeDocument({ botId: "bot_123" })

    vi.stubGlobal("document", document)
    vi.stubGlobal("console", { error: vi.fn() })
    vi.stubGlobal("fetch", fetchMock)

    await loadWidgetScript()
    await flushLoader()
    frameLoadHandler(iframe)()

    messageHandlers[0]({
      origin: "http://localhost:3000",
      data: { type: "askdesk:refresh" },
      source: iframe.contentWindow,
    })
    await flushLoader()

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(iframe.remove).not.toHaveBeenCalled()
    expect(iframe.contentWindow.postMessage).toHaveBeenLastCalledWith(
      { type: "askdesk:denied" },
      "http://localhost:3000"
    )
  })

  it("tells the iframe when a refresh fails without calling the site removed", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(allowedPlacement("pass-1"))
      .mockRejectedValueOnce(new Error("network"))
    const { iframe, document } = fakeDocument({ botId: "bot_123" })

    vi.stubGlobal("document", document)
    vi.stubGlobal("console", { error: vi.fn() })
    vi.stubGlobal("fetch", fetchMock)

    await loadWidgetScript()
    await flushLoader()
    frameLoadHandler(iframe)()

    messageHandlers[0]({
      origin: "http://localhost:3000",
      data: { type: "askdesk:refresh" },
      source: iframe.contentWindow,
    })
    await flushLoader()

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(iframe.remove).not.toHaveBeenCalled()
    expect(iframe.contentWindow.postMessage).toHaveBeenLastCalledWith(
      { type: "askdesk:unreachable" },
      "http://localhost:3000"
    )
  })

  it("waits while a refresh connection is still open", async () => {
    let finishPlacement: (value: unknown) => void = () => {}
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(allowedPlacement("pass-1"))
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            finishPlacement = resolve
          })
      )
    const { iframe, document } = fakeDocument({ botId: "bot_123" })

    vi.stubGlobal("document", document)
    vi.stubGlobal("console", { error: vi.fn() })
    vi.stubGlobal("fetch", fetchMock)

    await loadWidgetScript()
    await flushLoader()
    frameLoadHandler(iframe)()

    messageHandlers[0]({
      origin: "http://localhost:3000",
      data: { type: "askdesk:refresh" },
      source: iframe.contentWindow,
    })
    await flushLoader()

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(iframe.contentWindow.postMessage).toHaveBeenCalledTimes(1)

    finishPlacement(allowedPlacement("pass-2"))
    await flushLoader()

    expect(iframe.contentWindow.postMessage).toHaveBeenLastCalledWith(
      { type: "askdesk:pass", pass: "pass-2" },
      "http://localhost:3000"
    )
  })

  it("does not mount an iframe when the placement response has an empty pass", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ allowed: true, pass: "" }),
    })
    const { appendChild, document } = fakeDocument({ botId: "bot_123" })

    vi.stubGlobal("document", document)
    vi.stubGlobal("console", { error: vi.fn() })
    vi.stubGlobal("fetch", fetchMock)

    await loadWidgetScript()
    await flushLoader()

    expect(fetchMock).toHaveBeenCalled()
    expect(appendChild).not.toHaveBeenCalled()
  })

  it("does not mount an iframe when the placement response has no pass", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ allowed: true }),
    })
    const { appendChild, document } = fakeDocument({ botId: "bot_123" })

    vi.stubGlobal("document", document)
    vi.stubGlobal("console", { error: vi.fn() })
    vi.stubGlobal("fetch", fetchMock)

    await loadWidgetScript()
    await flushLoader()

    expect(fetchMock).toHaveBeenCalled()
    expect(appendChild).not.toHaveBeenCalled()
  })
})
