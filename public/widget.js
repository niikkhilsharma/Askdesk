;(function () {
  const scriptElement = document.currentScript

  /** Reads the Askdesk origin from this script's own address. */
  function getWidgetBaseUrl() {
    if (!scriptElement) {
      return "https://mydomain.com"
    }

    const scriptSrc = scriptElement.getAttribute("src")

    if (!scriptSrc) {
      return "https://mydomain.com"
    }

    return new URL(scriptSrc).origin
  }

  /** Asks whether this page may show the bot. */
  async function fetchPlacement(baseUrl, botId) {
    try {
      const response = await fetch(
        `${baseUrl}/api/widget/placement?botId=${encodeURIComponent(botId)}`
      )

      if (response.status === 404) {
        return { result: "denied" }
      }

      if (!response.ok) {
        return { result: "unreachable" }
      }

      const body = await response.json()

      if (!body || typeof body.pass !== "string" || body.pass.length === 0) {
        return { result: "unreachable" }
      }

      return { result: "allowed", pass: body.pass }
    } catch {
      return { result: "unreachable" }
    }
  }

  /** Adds the bot iframe when this page is allowed, and gives it a visitor pass. */
  async function loadChatbotWidget() {
    const botId = scriptElement?.getAttribute("data-bot-id")

    if (!botId) {
      console.error("[Askdesk] Missing data-bot-id in script tag.")
      return
    }

    const existingWidget = document.getElementById("askdesk-chatbot-iframe")

    if (existingWidget) {
      return
    }

    const baseUrl = getWidgetBaseUrl()
    const placement = await fetchPlacement(baseUrl, botId)

    if (
      placement.result !== "allowed" ||
      document.getElementById("askdesk-chatbot-iframe")
    ) {
      return
    }

    let currentPass = placement.pass

    const iframe = document.createElement("iframe")
    iframe.id = "askdesk-chatbot-iframe"
    iframe.src = `${baseUrl}/widget?botId=${encodeURIComponent(botId)}`
    const launcherEdge = "56px"
    const panelWidth = 400
    const panelHeight = 600
    const frameInset = 24
    // Room around the Panel so its own shadow is visible. The iframe has none.
    const shadowRoom = 48

    iframe.style.position = "fixed"
    iframe.style.border = "none"
    iframe.style.zIndex = "999999"
    iframe.style.background = "transparent"

    /** Sets the iframe to the round Launcher, or to a clear window around the Panel. */
    function sizeFrame(open) {
      iframe.style.width = open
        ? `${panelWidth + shadowRoom * 2}px`
        : launcherEdge
      iframe.style.height = open
        ? `${panelHeight + shadowRoom * 2}px`
        : launcherEdge
      iframe.style.right = open ? `${frameInset - shadowRoom}px` : `${frameInset}px`
      iframe.style.bottom = open
        ? `${frameInset - shadowRoom}px`
        : `${frameInset}px`
      iframe.style.borderRadius = open ? "0" : "999px"
      iframe.style.boxShadow = "none"
      // The Launcher's own shadow must paint past this small frame. The open
      // frame clips to the gutter around the Panel.
      iframe.style.overflow = open ? "hidden" : "visible"
    }

    sizeFrame(false)
    iframe.setAttribute("title", "Askdesk Chatbot")
    iframe.setAttribute("allow", "clipboard-write")
    iframe.setAttribute("referrerpolicy", "origin")

    /** Posts one message from this page into the bot iframe. */
    function postToFrame(message) {
      if (!iframe.contentWindow) return

      iframe.contentWindow.postMessage(message, baseUrl)
    }

    /** Hands the current visitor pass to the bot iframe. */
    function handPassToFrame() {
      postToFrame({ type: "askdesk:pass", pass: currentPass })
    }

    /** Tells the iframe how a finished refresh turned out. */
    async function replacePass() {
      const nextPlacement = await fetchPlacement(baseUrl, botId)

      if (nextPlacement.result === "allowed") {
        currentPass = nextPlacement.pass
        handPassToFrame()
        return
      }

      // A refusal leaves the iframe up. Removing it when the host site is no
      // longer allowed is a later change. See docs/adr/0004-visitor-chat.md.
      postToFrame({
        type:
          nextPlacement.result === "denied"
            ? "askdesk:denied"
            : "askdesk:unreachable",
      })
    }

    /** Resizes the chat, hands over the pass, or refreshes it when the iframe asks. */
    function onWidgetMessage(event) {
      if (event.origin !== baseUrl) return
      if (event.source !== iframe.contentWindow) return
      if (!event.data) return

      if (event.data.type === "askdesk:open") {
        sizeFrame(true)
        postToFrame({ type: "askdesk:opened" })
        return
      }

      if (event.data.type === "askdesk:close") {
        sizeFrame(false)
        return
      }

      if (event.data.type === "askdesk:ready") {
        handPassToFrame()
        return
      }

      if (event.data.type === "askdesk:refresh") {
        void replacePass()
      }
    }

    iframe.addEventListener("load", handPassToFrame)
    window.addEventListener("message", onWidgetMessage)
    document.body.appendChild(iframe)
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      void loadChatbotWidget()
    })
  } else {
    void loadChatbotWidget()
  }
})()
