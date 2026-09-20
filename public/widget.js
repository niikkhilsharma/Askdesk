;(function () {
  const scriptElement = document.currentScript

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

  function loadChatbotWidget() {
    const agentId = scriptElement?.getAttribute("data-agent-id")

    if (!agentId) {
      console.error("[Askdesk] Missing data-agent-id in script tag.")
      return
    }

    const existingWidget = document.getElementById("askdesk-chatbot-iframe")

    if (existingWidget) {
      return
    }

    const baseUrl = getWidgetBaseUrl()

    const iframe = document.createElement("iframe")
    iframe.id = "askdesk-chatbot-iframe"

    iframe.src = `${baseUrl}/widget?agentId=${encodeURIComponent(agentId)}`

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

    document.body.appendChild(iframe)
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadChatbotWidget)
  } else {
    loadChatbotWidget()
  }
})()
