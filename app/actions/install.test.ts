import { beforeEach, describe, expect, it, vi } from "vitest"

const { auth, ensureBotForUser, revalidatePath, steps, take } = vi.hoisted(
  () => {
    const steps: Array<unknown[] | Error> = []

    function thenable(rows: unknown[] | Error) {
      const builder: Record<string, unknown> = {}
      const pass = () => builder

      for (const method of ["values", "where"]) {
        builder[method] = pass
      }

      builder.then = (
        onFulfilled?: (value: unknown) => unknown,
        onRejected?: (reason: unknown) => unknown
      ) => {
        const promise =
          rows instanceof Error ? Promise.reject(rows) : Promise.resolve(rows)
        return promise.then(onFulfilled, onRejected)
      }

      return builder
    }

    return {
      auth: vi.fn(),
      ensureBotForUser: vi.fn(),
      revalidatePath: vi.fn(),
      steps,
      take() {
        const next = steps.shift() ?? []
        return thenable(next)
      },
    }
  }
)

vi.mock("@/auth", () => ({ auth }))
vi.mock("@/lib/install/bots", () => ({ ensureBotForUser }))
vi.mock("next/cache", () => ({ revalidatePath }))
vi.mock("@/db/db", () => ({
  default: {
    insert: () => take(),
    delete: () => take(),
  },
}))

import { addHostSiteAction, removeHostSiteAction } from "@/app/actions/install"

describe("host site actions", () => {
  beforeEach(() => {
    steps.length = 0
    auth.mockReset()
    ensureBotForUser.mockReset()
    revalidatePath.mockReset()
    auth.mockResolvedValue({ user: { id: "4" } })
    ensureBotForUser.mockResolvedValue({ id: 7 })
  })

  it("rejects a signed-out account", async () => {
    auth.mockResolvedValue(null)

    await expect(
      addHostSiteAction({ message: null }, new FormData())
    ).rejects.toThrow("Unauthorized")
  })

  it("returns the parser message and does not insert", async () => {
    const formData = new FormData()
    formData.set("url", "www.oakclinic.com")

    await expect(
      addHostSiteAction({ message: null }, formData)
    ).resolves.toEqual({
      message: "Include https:// so the site address is exact.",
    })
    expect(ensureBotForUser).not.toHaveBeenCalled()
  })

  it("stores the origin and clears the message", async () => {
    const formData = new FormData()
    formData.set("url", "https://www.oakclinic.com/contact")
    steps.push([])

    await expect(
      addHostSiteAction({ message: null }, formData)
    ).resolves.toEqual({ message: null })
    expect(ensureBotForUser).toHaveBeenCalledWith(4)
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/install")
  })

  it("reports a duplicate origin", async () => {
    const formData = new FormData()
    formData.set("url", "https://www.oakclinic.com")
    steps.push(Object.assign(new Error("duplicate"), { code: "23505" }))

    await expect(
      addHostSiteAction({ message: null }, formData)
    ).resolves.toEqual({ message: "This site is already listed." })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it("rethrows an unexpected insert error", async () => {
    const formData = new FormData()
    formData.set("url", "https://www.oakclinic.com")
    const failure = Object.assign(new Error("down"), { code: "08006" })
    steps.push(failure)

    await expect(addHostSiteAction({ message: null }, formData)).rejects.toBe(
      failure
    )
  })

  it("rejects a missing host site id", async () => {
    await expect(removeHostSiteAction(new FormData())).rejects.toThrow(
      "Invalid host site"
    )
  })

  it("deletes a host site that belongs to the account", async () => {
    const formData = new FormData()
    formData.set("hostSiteId", "3")
    steps.push([])

    await removeHostSiteAction(formData)

    expect(ensureBotForUser).toHaveBeenCalledWith(4)
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/install")
  })
})
