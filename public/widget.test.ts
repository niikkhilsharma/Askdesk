import { beforeEach, describe, expect, it, vi } from "vitest"

/** Builds a fake host-page document for the embed loader. */
function fakeDocument({
  agentId,
  existingWidget = null,
}: {
  agentId: string | null
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
          if (name === "data-agent-id") {
            return agentId
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

describe("Askdesk widget loader", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()
  })

  it("logs and skips mounting when data-agent-id is missing", async () => {
    const consoleError = vi.fn()
    const { appendChild, document } = fakeDocument({ agentId: null })

    vi.stubGlobal("document", document)
    vi.stubGlobal("console", { error: consoleError })

    await import("./widget.js")

    expect(consoleError).toHaveBeenCalledWith(
      "[Askdesk] Missing data-agent-id in script tag."
    )
    expect(appendChild).not.toHaveBeenCalled()
  })

  it("mounts one Askdesk iframe for the given agent", async () => {
    const consoleError = vi.fn()
    const { iframe, appendChild, document } = fakeDocument({
      agentId: "agent_123",
    })

    vi.stubGlobal("document", document)
    vi.stubGlobal("console", { error: consoleError })

    await import("./widget.js")

    expect(consoleError).not.toHaveBeenCalled()
    expect(iframe.id).toBe("askdesk-chatbot-iframe")
    expect(iframe.src).toBe("http://localhost:3000/widget?agentId=agent_123")
    expect(iframe.setAttribute).toHaveBeenCalledWith("title", "Askdesk Chatbot")
    expect(appendChild).toHaveBeenCalledWith(iframe)
  })

  it("does not mount a second iframe when one already exists", async () => {
    const { appendChild, document } = fakeDocument({
      agentId: "agent_123",
      existingWidget: { id: "askdesk-chatbot-iframe" },
    })

    vi.stubGlobal("document", document)
    vi.stubGlobal("console", { error: vi.fn() })

    await import("./widget.js")

    expect(appendChild).not.toHaveBeenCalled()
  })
})
