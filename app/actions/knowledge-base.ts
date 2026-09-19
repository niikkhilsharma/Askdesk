"use server"

import { auth } from "@/auth"
import db from "@/db/db"
import { documentsTable } from "@/db/schema"
import { getCloudinary } from "@/lib/cloudinary"
import { ingestDocument } from "@/lib/knowledge-base/ingest"
import { deleteDocumentVectors } from "@/lib/pinecone"
import { and, eq } from "drizzle-orm"
import { after } from "next/server"
import { revalidatePath } from "next/cache"

/** Deletes a document that is not currently indexing. */
export async function deleteDocumentAction(formData: FormData) {
  const session = await auth()

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  const documentId = Number(formData.get("documentId"))

  if (!documentId || Number.isNaN(documentId)) {
    throw new Error("Invalid document ID")
  }

  const [document] = await db
    .select()
    .from(documentsTable)
    .where(
      and(
        eq(documentsTable.id, documentId),
        eq(documentsTable.userId, Number(session.user.id))
      )
    )
    .limit(1)

  if (!document) {
    throw new Error("Document not found")
  }

  if (document.status === "processing") {
    throw new Error("This document is still being indexed")
  }

  if (document.status === "ready" || document.status === "failed") {
    await deleteDocumentVectors(document.userId, document.id).catch((error) => {
      console.error("Failed to delete document vectors:", error)
    })
  }

  await getCloudinary().uploader.destroy(document.publicId, {
    resource_type: "raw",
  })

  await db.delete(documentsTable).where(eq(documentsTable.id, document.id))

  revalidatePath("/dashboard/knowledge-base")
}

/** Re-runs ingest for a document that failed to index. */
export async function retryDocumentAction(formData: FormData) {
  const session = await auth()

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  const documentId = Number(formData.get("documentId"))

  if (!documentId || Number.isNaN(documentId)) {
    throw new Error("Invalid document ID")
  }

  const [document] = await db
    .select({
      id: documentsTable.id,
      status: documentsTable.status,
    })
    .from(documentsTable)
    .where(
      and(
        eq(documentsTable.id, documentId),
        eq(documentsTable.userId, Number(session.user.id))
      )
    )
    .limit(1)

  if (!document) {
    throw new Error("Document not found")
  }

  if (document.status !== "failed") {
    throw new Error("Only failed documents can be retried")
  }

  after(() => ingestDocument(document.id, { fromStatuses: ["failed"] }))
  revalidatePath("/dashboard/knowledge-base")
}
