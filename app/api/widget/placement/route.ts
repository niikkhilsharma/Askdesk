import { isBotAllowedOnOrigin } from "@/lib/install/placement"
import { parentOriginFromFetchHeaders } from "@/lib/install/origin"
import { NextRequest, NextResponse } from "next/server"

/** Tells the loader whether this page may show the bot. */
export async function GET(request: NextRequest) {
  const botId = request.nextUrl.searchParams.get("botId")?.trim() ?? ""
  const origin = parentOriginFromFetchHeaders(request.headers)
  const allowed =
    botId.length > 0 &&
    origin !== null &&
    (await isBotAllowedOnOrigin(botId, origin))

  if (!allowed || !origin) {
    return new NextResponse(null, {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    })
  }

  return NextResponse.json(
    { allowed: true },
    {
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Cache-Control": "no-store",
        Vary: "Origin",
      },
    }
  )
}
