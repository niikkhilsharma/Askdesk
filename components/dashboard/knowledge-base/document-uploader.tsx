"use client"

import { UploadCloud } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { MAX_UPLOAD_BYTES } from "@/lib/knowledge-base/constants"

type CloudinaryUploadResponse = {
  public_id: string
  version: number
  signature: string
  bytes: number
  secure_url: string
}

type SignUploadResponse = {
  cloudName: string
  apiKey: string
  timestamp: number
  publicId: string
  signature: string
}

function uploadToCloudinary(
  url: string,
  formData: FormData,
  onProgress: (value: number) => void
): Promise<CloudinaryUploadResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.open("POST", url)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as CloudinaryUploadResponse)
        } catch {
          reject(new Error("Failed to parse Cloudinary response"))
        }
        return
      }

      reject(new Error("Cloudinary upload failed"))
    }

    xhr.onerror = () => {
      reject(new Error("Cloudinary upload failed"))
    }

    xhr.send(formData)
  })
}

export function DocumentUploader() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed")
      return
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("File must be 10 MB or smaller")
      return
    }

    setIsUploading(true)
    setProgress(0)

    try {
      const signResponse = await fetch("/api/knowledge-base/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          bytes: file.size,
        }),
      })

      if (!signResponse.ok) {
        const errorBody = (await signResponse.json().catch(() => null)) as {
          message?: string
        } | null

        throw new Error(errorBody?.message ?? "Failed to prepare upload")
      }

      const signData = (await signResponse.json()) as SignUploadResponse

      const cloudinaryFormData = new FormData()
      cloudinaryFormData.append("file", file)
      cloudinaryFormData.append("api_key", signData.apiKey)
      cloudinaryFormData.append("timestamp", String(signData.timestamp))
      cloudinaryFormData.append("public_id", signData.publicId)
      cloudinaryFormData.append("signature", signData.signature)

      const cloudinaryResult = await uploadToCloudinary(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/raw/upload`,
        cloudinaryFormData,
        setProgress
      )

      const confirmResponse = await fetch("/api/knowledge-base/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          publicId: cloudinaryResult.public_id,
          version: cloudinaryResult.version,
          signature: cloudinaryResult.signature,
          secureUrl: cloudinaryResult.secure_url,
          bytes: cloudinaryResult.bytes,
        }),
      })

      if (!confirmResponse.ok) {
        const errorBody = (await confirmResponse.json().catch(() => null)) as {
          message?: string
        } | null

        throw new Error(errorBody?.message ?? "Failed to save document")
      }

      toast.success("PDF uploaded. Indexing in the background.")
      router.refresh()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Upload failed. Please try again."

      toast.error(message)
    } finally {
      setIsUploading(false)
      setProgress(0)

      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      void handleFile(file)
    }
  }

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files?.[0]

    if (file) {
      void handleFile(file)
    }
  }

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (!isUploading) {
            inputRef.current?.click()
          }
        }}
        onKeyDown={(event) => {
          if ((event.key === "Enter" || event.key === " ") && !isUploading) {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => {
          setIsDragging(false)
        }}
        onDrop={onDrop}
        className={cn(
          "flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/20 hover:bg-muted/40",
          isUploading && "pointer-events-none opacity-70"
        )}
      >
        <UploadCloud className="mb-3 size-8 text-muted-foreground" />
        <p className="text-sm font-medium">
          Drag and drop a PDF here, or click to browse
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Text-based PDFs only, up to 10 MB
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          disabled={isUploading}
        >
          Choose PDF
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={onInputChange}
          disabled={isUploading}
        />
      </div>

      {isUploading ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      ) : null}
    </div>
  )
}
