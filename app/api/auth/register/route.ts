// app/api/auth/register/route.ts

import { signUpSchema } from "@/lib/zod"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import db from "@/db/db"
import { usersTable } from "@/db/schema"
import { saltAndHashPassword } from "@/utils/auth/auth"

function getDatabaseErrorCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null) {
    return undefined
  }

  if ("code" in error && typeof error.code === "string") {
    return error.code
  }

  if ("cause" in error) {
    return getDatabaseErrorCode(error.cause)
  }

  return undefined
}

export async function POST(request: NextRequest) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      {
        message: "Invalid request body",
      },
      { status: 400 }
    )
  }

  const validationResult = await signUpSchema.safeParseAsync(body)

  if (!validationResult.success) {
    const { fieldErrors, formErrors } = z.flattenError(validationResult.error)

    return NextResponse.json(
      {
        message: "Please correct the highlighted fields",
        errors: fieldErrors,
        formErrors,
      },
      { status: 400 }
    )
  }

  try {
    const { fullName, email, password } = validationResult.data

    const passwordHash = await saltAndHashPassword(password)

    await db.insert(usersTable).values({
      fullName,
      email,
      passwordHash,
    })

    return NextResponse.json(
      {
        message: "User created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    /*
     * PostgreSQL error code 23505 means a unique constraint failed.
     * This will normally happen when the email already exists.
     */
    if (getDatabaseErrorCode(error) === "23505") {
      return NextResponse.json(
        {
          message: "An account with this email already exists",
          errors: {
            email: ["An account with this email already exists"],
          },
        },
        { status: 409 }
      )
    }

    console.error("Registration failed:", error)

    return NextResponse.json(
      {
        message: "Something went wrong while creating your account",
      },
      { status: 500 }
    )
  }
}
