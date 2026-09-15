import { auth } from "@/auth"
import db from "@/db/db"
import { documentsTable } from "@/db/schema"
import { apiSecret, cloudinary } from "@/lib/cloudinary"
import { ingestDocument } from "@/lib/knowledge-base/ingest"
import { isOwnedKnowledgeBasePublicId } from "@/lib/knowledge-base/public-id"
import { confirmUploadSchema } from "@/lib/zod"
import { after, NextRequest, NextResponse } from "next/server"
import { z } from "zod"

function getDatabaseErrorCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null) {
    return undefined
  }

  if ("code" in error && typeof error.code === "string") {
    return error.code
  }

  if ("cause" in error) {
    return getDatabaseErrorCode(error.cause)
  }

  return undefined
}

/** Saves an uploaded PDF and starts indexing it in the background. */
export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    )
  }

  const validationResult = await confirmUploadSchema.safeParseAsync(body)

  if (!validationResult.success) {
    const { fieldErrors, formErrors } = z.flattenError(validationResult.error)

    return NextResponse.json(
      {
        message: "Please correct the highlighted fields",
        errors: fieldErrors,
        formErrors,
      },
      { status: 400 }
    )
  }

  const { fileName, publicId, version, signature, secureUrl, bytes } =
    validationResult.data

  const expectedSignature = cloudinary.utils.api_sign_request(
    { public_id: publicId, version },
    apiSecret
  )

  if (expectedSignature !== signature) {
    return NextResponse.json(
      { message: "Invalid upload signature" },
      { status: 400 }
    )
  }

  if (!isOwnedKnowledgeBasePublicId(publicId, session.user.id)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  try {
    const [document] = await db
      .insert(documentsTable)
      .values({
        userId: Number(session.user.id),
        fileName,
        publicId,
        secureUrl,
        bytes,
      })
      .returning()

    after(() => ingestDocument(document.id, { fromStatuses: ["pending"] }))

    return NextResponse.json({ document }, { status: 201 })
  } catch (error) {
    if (getDatabaseErrorCode(error) === "23505") {
      return NextResponse.json(
        { message: "This document has already been saved" },
        { status: 409 }
      )
    }

    console.error("Failed to save document:", error)

    return NextResponse.json(
      { message: "Something went wrong while saving your document" },
      { status: 500 }
    )
  }
}
