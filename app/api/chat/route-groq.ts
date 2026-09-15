import { NextRequest } from "next/server"
import { groq } from "@ai-sdk/groq"
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from "ai"

export async function POST(req: NextRequest) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    messages: await convertToModelMessages(messages),
  })

  console.log(result)

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
