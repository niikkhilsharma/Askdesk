import { NextRequest, NextResponse } from "next/server"
import type { UIMessage } from "ai"

import { auth } from "@/auth"
import { streamAccountAnswer } from "@/lib/chat/answer"

/** Streams a dashboard answer after the account is signed in. */
export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { messages }: { messages: UIMessage[] } = await req.json()

  return streamAccountAnswer(Number(session.user.id), messages)
}
