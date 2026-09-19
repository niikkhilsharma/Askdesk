import { v2 as cloudinary } from "cloudinary"

import {
  KNOWLEDGE_BASE_FOLDER,
  MAX_UPLOAD_BYTES,
} from "@/lib/knowledge-base/constants"

/** Returns a required Cloudinary environment variable. */
function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing ${name}`)
  }

  return value
}

cloudinary.config({
  cloud_name: requireEnv("CLOUDINARY_CLOUD_NAME"),
  api_key: requireEnv("CLOUDINARY_API_KEY"),
  api_secret: requireEnv("CLOUDINARY_API_SECRET"),
  secure: true,
})

/** Cloudinary cloud name from the environment. */
export function getCloudName() {
  return requireEnv("CLOUDINARY_CLOUD_NAME")
}

/** Cloudinary API key from the environment. */
export function getApiKey() {
  return requireEnv("CLOUDINARY_API_KEY")
}

/** Cloudinary API secret from the environment. */
export function getApiSecret() {
  return requireEnv("CLOUDINARY_API_SECRET")
}

export { cloudinary, KNOWLEDGE_BASE_FOLDER, MAX_UPLOAD_BYTES }
