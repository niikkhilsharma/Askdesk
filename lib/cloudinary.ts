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

let configured = false

/** Configures the Cloudinary SDK the first time upload or sign code needs it. */
function ensureCloudinaryConfig() {
  if (configured) return

  cloudinary.config({
    cloud_name: requireEnv("CLOUDINARY_CLOUD_NAME"),
    api_key: requireEnv("CLOUDINARY_API_KEY"),
    api_secret: requireEnv("CLOUDINARY_API_SECRET"),
    secure: true,
  })
  configured = true
}

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

/** Returns the Cloudinary SDK after applying environment credentials. */
export function getCloudinary() {
  ensureCloudinaryConfig()
  return cloudinary
}

export { KNOWLEDGE_BASE_FOLDER, MAX_UPLOAD_BYTES }
