# Tools we are using

Short, project-specific reasons — what each tool does in this embedded AI chatbot.

## App and UI

- **Next.js** — App Router for the dashboard, embeddable widget, auth pages, API routes, and server actions.
- **React** — Client UI for chat, knowledge-base uploads, and dashboard navigation.
- **TypeScript** — Typed app, API, and database code so auth, documents, and RAG payloads stay consistent.
- **Turbopack** — Fast local Next.js dev server (`npm run dev`).
- **Tailwind CSS** — Utility styling for the dashboard, widget, and shadcn components.
- **shadcn/ui** — Generated UI primitives (button, sidebar, sheet, forms) that we customize in `components/ui`.
- **Radix UI** — Accessible primitives under those shadcn components (dialogs, menus, progress, labels).
- **Lucide** — Icons for the sidebar, knowledge-base list, theme switcher, and chat input.
- **next-themes** — Light / dark / system theme on the dashboard and widget.
- **Sonner** — Toast feedback for login errors, signup, and document upload/delete.
- **emoji-picker-react** — Emoji picker in the chat widget input.
- **Zod** — Validates login, signup, and knowledge-base upload/sign request bodies.

## Auth and data

- **NextAuth (Auth.js)** — Email/password sessions; gates dashboard routes, chat, and knowledge-base APIs.
- **bcryptjs** — Hashes signup passwords and verifies them at login.
- **Drizzle ORM** — Typed queries for users and document metadata (status, Cloudinary URL, index errors).
- **drizzle-kit** — Generates and applies Postgres migrations from `db/schema.ts`.
- **Neon Postgres** — Hosted database for users and per-user knowledge-base document records.

## AI / RAG

- **LiteLLM** — Local OpenAI-compatible proxy so chat and embeddings share one key/base URL instead of calling providers directly.
- **LangChain** — Chat messages, PDF chunking, and the Pinecone vector store used for ingest and retrieval.
- **OpenAI embeddings / chat (via LiteLLM)** — `text-embedding-3-small` for indexing; `gpt-4.1-nano` for grounded answers.
- **Pinecone** — Per-user namespaces of document chunks; similarity search supplies RAG context in `/api/chat`.
- **unpdf** — Extracts page-level text from uploaded PDFs before chunking.
- **Vercel AI SDK (`ai`, `@ai-sdk/react`)** — `useChat` in the dashboard/widget and UI message streaming from the chat API.
- **Groq (`@ai-sdk/groq`)** — Alternate streaming chat path in `route-groq.ts` (not the live RAG route).
- **LangSmith** — Tracing for LangChain ingest/retrieval/chat runs (`LANGSMITH_TRACING` in env).

## Media

- **Cloudinary SDK** — Signed PDF uploads, stored file URLs for ingest, and deletes when a document is removed.
- **Cloudinary Cursor plugin** — Lets the agent look up Cloudinary docs and transformation/upload details while working in this repo.

## Quality and DX

- **ESLint** — Lint Next.js / TypeScript during `npm run lint`.
- **Prettier** — Formats TS/TSX (`npm run format`).
- **GitHub Actions** — CI on push/PR; currently runs the SonarQube scan.
- **SonarQube / SonarCloud** — Static analysis of this repo (`sonar-project.properties` + `sonarqube` job in `.github/workflows/build.yml`).

## Deploy and agent tooling

- **Vercel** — Hosts the Next.js app (dashboard, widget, and API routes).
- **Vercel Cursor plugin** — In-editor guidance for Next.js, AI SDK, env vars, functions, and deploys on Vercel.
- **Vercel MCP** — Lets the agent inspect this Vercel project: deployments, env, logs, docs, and related platform actions without leaving Cursor.
