import { KNOWLEDGE_BASE_FOLDER } from "@/lib/knowledge-base/constants"

function getAppFolder() {
  if (!process.env.CLOUDINARY_APP_FOLDER) {
    throw new Error("CLOUDINARY_APP_FOLDER is not set")
  }

  return process.env.CLOUDINARY_APP_FOLDER?.replace(/^\/+|\/+$/g, "")
}

export function getKnowledgeBaseRootPath() {
  return `${getAppFolder()}/${KNOWLEDGE_BASE_FOLDER}`
}

export function buildKnowledgeBasePublicId(userId: string, fileId: string) {
  return `${getKnowledgeBaseRootPath()}/${userId}/${fileId}.pdf`
}

export function isOwnedKnowledgeBasePublicId(publicId: string, userId: string) {
  return publicId.startsWith(`${getKnowledgeBaseRootPath()}/${userId}/`)
}
