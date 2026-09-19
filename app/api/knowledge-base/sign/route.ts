import { auth } from "@/auth"
import {
  getApiKey,
  getApiSecret,
  getCloudinary,
  getCloudName,
} from "@/lib/cloudinary"
import { buildKnowledgeBasePublicId } from "@/lib/knowledge-base/public-id"
import { signUploadSchema } from "@/lib/zod"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
  }

  const validationResult = await signUploadSchema.safeParseAsync(body)

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

  const publicId = buildKnowledgeBasePublicId(
    session.user.id,
    crypto.randomUUID()
  )
  const timestamp = Math.round(Date.now() / 1000)

  const signature = getCloudinary().utils.api_sign_request(
    { public_id: publicId, timestamp },
    getApiSecret()
  )

  return NextResponse.json({
    cloudName: getCloudName(),
    apiKey: getApiKey(),
    timestamp,
    publicId,
    signature,
  })
}
