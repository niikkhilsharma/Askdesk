"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

/** Asks the host page to remove the chat iframe. */
function closeWidget() {
  if (window.parent === window) return

  let targetOrigin = "*"
  if (document.referrer) {
    try {
      targetOrigin = new URL(document.referrer).origin
    } catch {
      targetOrigin = "*"
    }
  }

  window.parent.postMessage({ type: "askdesk:close" }, targetOrigin)
}

/** Chat widget header with the Askdesk name and a close control. */
export default function WidgetHeader() {
  return (
    <div className="shrink-0 border-b bg-card">
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <p className="font-medium text-card-foreground">Askdesk</p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Close chat"
          onClick={closeWidget}
        >
          <XIcon />
        </Button>
      </div>
    </div>
  )
}
