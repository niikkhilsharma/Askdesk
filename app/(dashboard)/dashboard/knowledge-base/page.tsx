import { auth } from "@/auth"
import { DocumentList } from "@/components/dashboard/knowledge-base/document-list"
import { DocumentUploader } from "@/components/dashboard/knowledge-base/document-uploader"
import db from "@/db/db"
import { documentsTable } from "@/db/schema"
import { resumePendingDocuments } from "@/lib/knowledge-base/ingest"
import { desc, eq } from "drizzle-orm"
import { after } from "next/server"

/** Shows uploaded documents and resumes any that never started indexing. */
export default async function KnowledgeBasePage() {
  const session = await auth()

  const documents = session?.user
    ? await db
        .select()
        .from(documentsTable)
        .where(eq(documentsTable.userId, Number(session.user.id)))
        .orderBy(desc(documentsTable.createdAt))
    : []

  if (session?.user && documents.some((document) => document.status === "pending")) {
    after(() => resumePendingDocuments(Number(session.user.id)))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Knowledge Base</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload your datasets and files here to power your chatbot with the
          information it needs to answer questions.
        </p>
      </div>

      <DocumentUploader />

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Uploaded documents</h2>
        <DocumentList documents={documents} />
      </div>
    </div>
  )
}
