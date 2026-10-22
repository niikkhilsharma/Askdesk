import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      "@": rootDir,
    },
  },
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: [
        "app/actions/install.ts",
        "app/api/auth/register/route.ts",
        "app/api/widget/chat/route.ts",
        "app/api/widget/placement/route.ts",
        "components/landing/mock-chat-script.ts",
        "db/schema.ts",
        "lib/chat/visitor-thread.ts",
        "lib/cloudinary.ts",
        "lib/install/bots.ts",
        "lib/install/db-error.ts",
        "lib/install/origin.ts",
        "lib/install/pass.ts",
        "lib/install/placement.ts",
        "lib/install/public-id.ts",
        "lib/install/snippet.ts",
        "public/widget.js",
        "scripts/backfill-bots.ts",
      ],
    },
  },
})
