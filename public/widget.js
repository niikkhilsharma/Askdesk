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

  /** Adds the bot iframe only when this page is an allowed host site. */
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
    let allowed = false

    try {
      const response = await fetch(
        `${baseUrl}/api/widget/placement?botId=${encodeURIComponent(botId)}`
      )
      allowed = response.ok
    } catch {
      allowed = false
    }

    if (!allowed || document.getElementById("askdesk-chatbot-iframe")) {
      return
    }

    const iframe = document.createElement("iframe")
    iframe.id = "askdesk-chatbot-iframe"
    iframe.src = `${baseUrl}/widget?botId=${encodeURIComponent(botId)}`
    iframe.style.position = "fixed"
    iframe.style.right = "24px"
    iframe.style.bottom = "24px"
    iframe.style.width = "400px"
    iframe.style.height = "600px"
    iframe.style.border = "none"
    iframe.style.borderRadius = "16px"
    iframe.style.zIndex = "999999"
    iframe.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.18)"
    iframe.style.background = "transparent"
    iframe.setAttribute("title", "Askdesk Chatbot")
    iframe.setAttribute("allow", "clipboard-write")
    iframe.setAttribute("referrerpolicy", "origin")

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
