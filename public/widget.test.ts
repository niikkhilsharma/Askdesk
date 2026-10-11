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
    setAttribute: vi.fn(),
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

/** Loads the classic widget script. It has no exports; the host page runs it as a script. */
async function loadWidgetScript() {
  // @ts-expect-error widget.js is a classic browser script, not an ES module.
  await import("./widget.js")
}

describe("Askdesk widget loader", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()
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
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
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
})
