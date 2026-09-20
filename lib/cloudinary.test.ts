import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const ORIGINAL_ENV = process.env

describe("cloudinary env helpers", () => {
  beforeEach(() => {
    vi.resetModules()
    process.env = { ...ORIGINAL_ENV }
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it("configures Cloudinary from the environment at import", async () => {
    process.env.CLOUDINARY_CLOUD_NAME = "demo-cloud"
    process.env.CLOUDINARY_API_KEY = "demo-key"
    process.env.CLOUDINARY_API_SECRET = "demo-secret"

    const { cloudinary, getApiKey, getApiSecret, getCloudName } =
      await import("@/lib/cloudinary")

    expect(getCloudName()).toBe("demo-cloud")
    expect(getApiKey()).toBe("demo-key")
    expect(getApiSecret()).toBe("demo-secret")
    expect(cloudinary.config().cloud_name).toBe("demo-cloud")
  })

  it("throws when a required Cloudinary variable is missing", async () => {
    delete process.env.CLOUDINARY_CLOUD_NAME
    process.env.CLOUDINARY_API_KEY = "demo-key"
    process.env.CLOUDINARY_API_SECRET = "demo-secret"

    await expect(import("@/lib/cloudinary")).rejects.toThrow(
      "Missing CLOUDINARY_CLOUD_NAME"
    )
  })
})
