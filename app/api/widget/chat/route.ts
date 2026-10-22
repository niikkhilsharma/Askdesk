import type { UIMessage } from "ai"
import { NextRequest, NextResponse } from "next/server"

import { streamAccountAnswer } from "@/lib/chat/answer"
import { VISITOR_PASS_REFUSED_STATUS } from "@/lib/chat/visitor-thread"
import { getAccountIdForBot } from "@/lib/install/bots"
import { readVisitorPass } from "@/lib/install/pass"
import { isBotAllowedOnOrigin } from "@/lib/install/placement"

/** Refuses a visitor question that has no usable pass. */
function refuseVisitorPass() {
  return NextResponse.json(
    { message: "Visitor pass refused" },
    { status: VISITOR_PASS_REFUSED_STATUS }
  )
}

/** Streams a visitor answer when the pass is still valid for this bot and host site. */
export async function POST(req: NextRequest) {
  const body: unknown = await req.json()

  if (typeof body !== "object" || body === null) {
    return refuseVisitorPass()
  }

  const { pass: passValue, botId: botIdValue, messages } = body as {
    pass?: unknown
    botId?: unknown
    messages?: unknown
  }
  const pass = typeof passValue === "string" ? passValue : ""
  const botId = typeof botIdValue === "string" ? botIdValue : ""
  const claims = pass ? await readVisitorPass(pass) : null

  if (!claims || claims.botId !== botId) {
    return refuseVisitorPass()
  }

  if (!(await isBotAllowedOnOrigin(claims.botId, claims.origin))) {
    return refuseVisitorPass()
  }

  const accountId = await getAccountIdForBot(claims.botId)

  if (accountId === null) {
    return refuseVisitorPass()
  }

  if (!Array.isArray(messages)) {
    return NextResponse.json(
      { message: "A user message is required" },
      { status: 400 }
    )
  }

  return streamAccountAnswer(accountId, messages as UIMessage[])
}
