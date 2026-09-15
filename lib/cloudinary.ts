import { v2 as cloudinary } from "cloudinary"

import {
  KNOWLEDGE_BASE_FOLDER,
  MAX_UPLOAD_BYTES,
} from "@/lib/knowledge-base/constants"

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing ${name}`)
  }

  return value
}

const cloudName = requireEnv(
  "CLOUDINARY_CLOUD_NAME",
  process.env.CLOUDINARY_CLOUD_NAME
)
const apiKey = requireEnv("CLOUDINARY_API_KEY", process.env.CLOUDINARY_API_KEY)
const apiSecret = requireEnv(
  "CLOUDINARY_API_SECRET",
  process.env.CLOUDINARY_API_SECRET
)

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
})

export { cloudinary, cloudName, apiKey, apiSecret, KNOWLEDGE_BASE_FOLDER, MAX_UPLOAD_BYTES }
