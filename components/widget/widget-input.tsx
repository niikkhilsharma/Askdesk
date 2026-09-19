"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Send, Smile, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import EmojiPicker from "emoji-picker-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

const EMOJI_PICKER_HEIGHT = 350
const EMOJI_PICKER_GAP = 8
const MAX_TEXTAREA_ROWS = 4
const MIN_TEXTAREA_HEIGHT = 48

/** Composer with textarea, emoji picker, and send — used by the live widget and the landing preview. */
export default function WidgetInput({
  sendMessage,
  className,
  disabled = false,
}: {
  sendMessage: (message: { text: string }) => void
  className?: string
  disabled?: boolean
}) {
  const [input, setInput] = useState<string>("")
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 })
  const emojiButtonRef = useRef<HTMLButtonElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  if (disabled && showEmojiPicker) {
    setShowEmojiPicker(false)
  }

  /** Grows or shrinks the draft field to fit its text, up to a few rows. */
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = `${MIN_TEXTAREA_HEIGHT}px`

    const styles = window.getComputedStyle(textarea)
    const lineHeight = parseFloat(styles.lineHeight)
    const paddingTop = parseFloat(styles.paddingTop)
    const paddingBottom = parseFloat(styles.paddingBottom)
    const borderTop = parseFloat(styles.borderTopWidth)
    const borderBottom = parseFloat(styles.borderBottomWidth)
    const maxHeight =
      lineHeight * MAX_TEXTAREA_ROWS +
      paddingTop +
      paddingBottom +
      borderTop +
      borderBottom

    const nextHeight = Math.min(textarea.scrollHeight, maxHeight)
    textarea.style.height = `${nextHeight}px`
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden"
  }

  useLayoutEffect(() => {
    adjustTextareaHeight()
  }, [input])

  useLayoutEffect(() => {
    if (!showEmojiPicker || !emojiButtonRef.current) return

    /** Places the emoji picker just above the smile button. */
    const updatePosition = () => {
      if (!emojiButtonRef.current) return

      const rect = emojiButtonRef.current.getBoundingClientRect()
      const pickerWidth = 320
      setPickerPosition({
        top: rect.top - EMOJI_PICKER_HEIGHT - EMOJI_PICKER_GAP,
        left: Math.max(8, rect.right - pickerWidth),
      })
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)

    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
    }
  }, [showEmojiPicker])

  /** Sends the trimmed draft and clears the textarea. */
  const onSubmit = () => {
    const draft = input.trim()
    if (disabled || !draft) return
    sendMessage({ text: draft })
    setInput("")
    setShowEmojiPicker(false)
  }

  return (
    <div className={cn("mt-auto border-t bg-card px-2 py-4", className)}>
      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          placeholder="Type here..."
          rows={1}
          disabled={disabled}
          aria-label="Message"
          className="min-h-12 max-h-none flex-1 resize-none rounded-lg border-border bg-background py-3 [field-sizing:fixed]"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              onSubmit()
            }
          }}
        />

        <Button
          ref={emojiButtonRef}
          type="button"
          size="icon"
          variant="secondary"
          className="size-12 shrink-0"
          disabled={disabled}
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          {showEmojiPicker ? <XIcon /> : <Smile />}
        </Button>

        {showEmojiPicker &&
          createPortal(
            <div
              className="fixed z-50"
              style={{
                top: pickerPosition.top,
                left: pickerPosition.left,
              }}
            >
              <EmojiPicker
                className="rounded-lg shadow-lg"
                onEmojiClick={(emojiData) => {
                  if (disabled) return
                  setInput((prev) => prev + emojiData.emoji)
                }}
                lazyLoadEmojis
                previewConfig={{ showPreview: false }}
                height={EMOJI_PICKER_HEIGHT}
              />
            </div>,
            document.body
          )}

        <Button
          type="button"
          variant="default"
          size="icon"
          className="size-12 shrink-0"
          disabled={disabled}
          aria-label="Send message"
          onClick={onSubmit}
        >
          <Send />
        </Button>
      </div>
    </div>
  )
}
