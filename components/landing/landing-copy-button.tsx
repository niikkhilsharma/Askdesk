"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

/** Copies a snippet and confirms it with a toast. */
export function LandingCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  /** Writes the snippet to the clipboard. */
  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("Snippet copied")
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy the snippet")
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={onCopy}>
      {copied ? (
        <Check data-icon="inline-start" />
      ) : (
        <Copy data-icon="inline-start" />
      )}
      {copied ? "Copied" : "Copy"}
    </Button>
  )
}
