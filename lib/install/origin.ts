export type OriginParseResult =
  | { ok: true; origin: string }
  | { ok: false; message: string }

/** Keeps the origin of a pasted page URL and rejects a missing scheme. */
export function parseHostSiteOrigin(input: string): OriginParseResult {
  const trimmed = input.trim()

  if (!trimmed) {
    return { ok: false, message: "Enter a site address." }
  }

  if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) {
    return {
      ok: false,
      message: "Include https:// so the site address is exact.",
    }
  }

  let url: URL

  try {
    url = new URL(trimmed)
  } catch {
    return { ok: false, message: "Enter a valid site address." }
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, message: "Use an http or https address." }
  }

  if (url.username || url.password) {
    return {
      ok: false,
      message: "Enter a site address without a username or password.",
    }
  }

  return { ok: true, origin: url.origin }
}

/** Reads the page origin the browser reports for a placement check. */
export function parentOriginFromFetchHeaders(headerList: {
  get(name: string): string | null
}) {
  const origin = headerList.get("origin")

  if (origin && origin !== "null") {
    return origin
  }

  if (headerList.get("sec-fetch-site") === "same-origin") {
    return originFromReferer(headerList.get("referer"))
  }

  return null
}

/** Reads the parent page origin from a Referer header. */
export function originFromReferer(referer: string | null) {
  if (!referer) {
    return null
  }

  try {
    return new URL(referer).origin
  } catch {
    return null
  }
}
