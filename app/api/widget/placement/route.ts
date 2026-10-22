import { parentOriginFromFetchHeaders } from "@/lib/install/origin"
import { signVisitorPass } from "@/lib/install/pass"
import { isBotAllowedOnOrigin } from "@/lib/install/placement"
import { NextRequest, NextResponse } from "next/server"

/**
 * Tells the loader whether this page may show the bot, and issues a visitor
 * pass when it may.
 */
export async function GET(request: NextRequest) {
  const botId = request.nextUrl.searchParams.get("botId")?.trim() ?? ""
  const origin = parentOriginFromFetchHeaders(request.headers)

  if (
    botId.length === 0 ||
    origin === null ||
    !(await isBotAllowedOnOrigin(botId, origin))
  ) {
    return new NextResponse(null, {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    })
  }

  return NextResponse.json(
    { allowed: true, pass: await signVisitorPass(botId, origin) },
    {
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Cache-Control": "no-store",
        Vary: "Origin",
      },
    }
  )
}
