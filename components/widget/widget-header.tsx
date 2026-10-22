"use client"

import type { Ref } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

/** Chat widget header with the Askdesk name and a close control. */
export default function WidgetHeader({
  onClose,
  closeRef,
}: {
  onClose: () => void
  closeRef?: Ref<HTMLButtonElement>
}) {
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
          ref={closeRef}
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Close chat"
          onClick={onClose}
        >
          <XIcon />
        </Button>
      </div>
    </div>
  )
}
