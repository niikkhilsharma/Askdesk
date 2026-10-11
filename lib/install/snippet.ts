/** Builds the install snippet an account copies onto a host site. */
export function buildInstallSnippet(appOrigin: string, publicId: string) {
  return `<script
  async
  src="${appOrigin}/widget.js"
  data-bot-id="${publicId}"
></script>`
}

/** Reads this app's origin from the incoming request headers. */
export function originFromRequestHeaders(headerList: {
  get(name: string): string | null
}) {
  const forwardedHost = headerList.get("x-forwarded-host")
  const host = (forwardedHost?.split(",")[0] ?? headerList.get("host"))?.trim()

  if (!host) {
    throw new Error("Missing host")
  }

  const forwardedProto = headerList
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim()
  const proto =
    forwardedProto ||
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https")

  return `${proto}://${host}`
}
