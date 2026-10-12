import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const { ensureBotForUser, saltAndHashPassword, steps, take } = vi.hoisted(
  () => {
    const steps: Array<unknown[] | Error> = []

    function thenable(rows: unknown[] | Error) {
      const builder: Record<string, unknown> = {}
      const pass = () => builder
      builder.values = pass
      builder.returning = pass
      builder.where = pass
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
      ensureBotForUser: vi.fn(),
      saltAndHashPassword: vi.fn(async () => "hashed-password"),
      steps,
      take() {
        const next = steps.shift() ?? []
        return thenable(next)
      },
    }
  }
)

vi.mock("@/lib/install/bots", () => ({ ensureBotForUser }))
vi.mock("@/utils/auth/auth", () => ({ saltAndHashPassword }))
vi.mock("@/db/db", () => ({
  default: {
    insert: () => take(),
    delete: () => take(),
  },
}))

import { POST } from "@/app/api/auth/register/route"

const signup = {
  fullName: "Maya Clinic",
  email: "maya@oakclinic.test",
  password: "clinic-pass-123",
  confirmPassword: "clinic-pass-123",
}

function post(body: string) {
  return new NextRequest("http://localhost:3000/api/auth/register", {
    method: "POST",
    body,
    headers: { "content-type": "application/json" },
  })
}

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    steps.length = 0
    ensureBotForUser.mockReset()
    saltAndHashPassword.mockClear()
  })

  it("creates a bot for the new account", async () => {
    steps.push([{ id: 4 }])
    ensureBotForUser.mockResolvedValue({ id: 7 })

    const response = await POST(post(JSON.stringify(signup)))

    expect(response.status).toBe(201)
    expect(ensureBotForUser).toHaveBeenCalledWith(4)
  })

  it("removes the account when the bot cannot be created", async () => {
    steps.push([{ id: 4 }], [])
    ensureBotForUser.mockRejectedValue(new Error("bot insert failed"))

    const response = await POST(post(JSON.stringify(signup)))

    expect(response.status).toBe(500)
    expect(ensureBotForUser).toHaveBeenCalledWith(4)
  })

  it("does not create a bot when the email is already registered", async () => {
    steps.push(Object.assign(new Error("duplicate"), { code: "23505" }))

    const response = await POST(post(JSON.stringify(signup)))

    expect(response.status).toBe(409)
    expect(ensureBotForUser).not.toHaveBeenCalled()
  })
})
