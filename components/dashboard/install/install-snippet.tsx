"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"

type InstallSnippetProps = {
  snippet: string
}

/** Shows the install snippet and copies it to the clipboard. */
export function InstallSnippet({ snippet }: InstallSnippetProps) {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)
  const copiedTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (copiedTimer.current !== null) {
        window.clearTimeout(copiedTimer.current)
      }
    }
  }, [])

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(snippet)
      setCopyError(null)
      setCopied(true)
      if (copiedTimer.current !== null) {
        window.clearTimeout(copiedTimer.current)
      }
      copiedTimer.current = window.setTimeout(() => {
        copiedTimer.current = null
        setCopied(false)
      }, 2000)
    } catch {
      setCopied(false)
      setCopyError("Could not copy the snippet.")
    }
  }

  return (
    <div className="space-y-3">
      <pre className="overflow-x-auto rounded-xl bg-muted p-4 text-sm">
        <code>{snippet}</code>
      </pre>
      <Button type="button" variant="outline" onClick={onCopy}>
        {copied ? "Copied" : "Copy snippet"}
      </Button>
      {copyError ? (
        <p role="alert" className="text-sm text-destructive">
          {copyError}
        </p>
      ) : null}
    </div>
  )
}
