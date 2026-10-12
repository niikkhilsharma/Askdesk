"use client"

/**
 * TEMPORARY snapshot stand-in. To remove it:
 * 1. Delete this file.
 * 2. In widget-shell.tsx, drop the WidgetDummyConversation import and put this back
 *    in place of <WidgetDummyConversation />:
 *
 *    <div className="flex flex-1 items-center justify-center px-6 py-8 text-center">
 *      <p className="text-sm text-muted-foreground">Answers are not live yet.</p>
 *    </div>
 *
 * This component never calls /api/chat.
 */

import AssistantMessageBubble from "@/components/widget/assistant-message-bubble"
import UserMessageBubble from "@/components/widget/user-message-bubble"
import WidgetInput from "@/components/widget/widget-input"

const MESSAGES: { id: string; role: "user" | "assistant"; text: string }[] = [
  {
    id: "welcome",
    role: "assistant",
    text: "Hi — welcome to Northline Family Clinic. How can we help today?",
  },
  { id: "hours-q", role: "user", text: "What are your hours?" },
  {
    id: "hours-a",
    role: "assistant",
    text: "Monday–Thursday, 8:00 a.m.–6:00 p.m. Friday, 8:00 a.m.–4:00 p.m. Saturday, 9:00 a.m.–1:00 p.m. for urgent visits. Closed Sunday.",
  },
  { id: "patients-q", role: "user", text: "Do you take new patients?" },
  {
    id: "patients-a",
    role: "assistant",
    text: "Yes. The first visit is a full checkup, and we ask you to arrive 15 minutes early.",
  },
  { id: "parking-q", role: "user", text: "Where do I park?" },
  {
    id: "parking-a",
    role: "assistant",
    text: "The lot behind the building is free for patients. Street parking is limited on weekdays. We're at 418 Northline Avenue, Suite 2.",
  },
]

/** Static clinic conversation for screenshots. Sending does nothing. */
export function WidgetDummyConversation() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-2 py-4">
        <p className="text-center text-sm text-muted-foreground">
          Today, 2:24pm
        </p>
        <div className="my-2">
          {MESSAGES.map((message) =>
            message.role === "user" ? (
              <UserMessageBubble key={message.id} message={message.text} />
            ) : (
              <AssistantMessageBubble key={message.id} message={message.text} />
            )
          )}
        </div>
      </div>
      <WidgetInput disabled sendMessage={() => {}} className="shrink-0" />
    </div>
  )
}
