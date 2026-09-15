"use client"

import { ExternalLink, FileText, RotateCw, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import {
  deleteDocumentAction,
  retryDocumentAction,
} from "@/app/actions/knowledge-base"
import { Button } from "@/components/ui/button"
import type { Document, DocumentStatus } from "@/db/schema"
import { cn } from "@/lib/utils"

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date))
}

const statusLabels: Record<DocumentStatus, string> = {
  pending: "Pending",
  processing: "Indexing",
  ready: "Ready",
  failed: "Failed",
}

/** Returns the badge styles for a document's index status. */
function getStatusClassName(status: DocumentStatus) {
  switch (status) {
    case "ready":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
    case "failed":
      return "bg-destructive/10 text-destructive"
    case "processing":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

type DocumentListProps = {
  documents: Document[]
}

export function DocumentList({ documents }: DocumentListProps) {
  const router = useRouter()
  const shouldPoll = documents.some(
    (document) =>
      document.status === "pending" || document.status === "processing"
  )

  useEffect(() => {
    if (!shouldPoll) {
      return
    }

    const intervalId = window.setInterval(() => {
      router.refresh()
    }, 3000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [router, shouldPoll])

  if (documents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center">
        <FileText className="mx-auto mb-3 size-8 text-muted-foreground" />
        <p className="text-sm font-medium">No documents uploaded yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload a PDF to start building your knowledge base.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <div
          key={document.id}
          className="flex items-center gap-4 rounded-xl border p-4"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <FileText className="size-5 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-medium">{document.fileName}</p>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  getStatusClassName(document.status)
                )}
              >
                {statusLabels[document.status]}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatBytes(document.bytes)} · {formatDate(document.createdAt)}
            </p>
            {document.status === "failed" && document.lastError ? (
              <p className="mt-1 text-sm text-destructive">{document.lastError}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a
                href={document.secureUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
                <ExternalLink className="size-4" />
              </a>
            </Button>

            {document.status === "failed" ? (
              <form action={retryDocumentAction}>
                <input type="hidden" name="documentId" value={document.id} />
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  aria-label={`Retry indexing ${document.fileName}`}
                >
                  <RotateCw className="size-4" />
                  Retry
                </Button>
              </form>
            ) : null}

            <form action={deleteDocumentAction}>
              <input type="hidden" name="documentId" value={document.id} />
              <Button
                type="submit"
                variant="ghost"
                size="icon-sm"
                disabled={document.status === "processing"}
                aria-label={`Delete ${document.fileName}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      ))}
    </div>
  )
}
