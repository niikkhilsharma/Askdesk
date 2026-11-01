import { ImageResponse } from "next/og"

export const alt =
  "AskDesk — A chatbot for your website. Your customers get answers."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/** Social image using the light theme tokens. next/og cannot read CSS variables. */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "rgb(255, 255, 255)",
        color: "rgb(28, 28, 26)",
        padding: "72px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "rgb(40, 40, 36)",
            color: "rgb(252, 252, 251)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          A
        </div>
        <div style={{ fontSize: 28, fontWeight: 600 }}>AskDesk</div>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 64,
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: -1,
          maxWidth: 900,
        }}
      >
        A chatbot for your website. Your customers get answers.
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div
          style={{
            display: "flex",
            background: "rgb(245, 245, 242)",
            borderRadius: 16,
            padding: "16px 20px",
            fontSize: 22,
          }}
        >
          Do you take my insurance?
        </div>
        <div
          style={{
            display: "flex",
            background: "rgb(40, 40, 36)",
            color: "rgb(252, 252, 251)",
            borderRadius: 16,
            padding: "16px 20px",
            fontSize: 22,
          }}
        >
          Yes — most major plans.
        </div>
      </div>
    </div>,
    { ...size }
  )
}
