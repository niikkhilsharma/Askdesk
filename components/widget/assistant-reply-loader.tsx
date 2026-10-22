import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import styles from "@/components/widget/assistant-reply-loader.module.css"

/** Holds the assistant's place with a three-dot loader while a reply is on its way. */
export default function AssistantReplyLoader() {
  return (
    <div
      className="flex items-center gap-2 rounded-lg p-2"
      role="status"
      aria-live="polite"
    >
      <Avatar>
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
      <span className="sr-only">Assistant is replying</span>
      <span className={styles.loader} aria-hidden="true" />
    </div>
  )
}
