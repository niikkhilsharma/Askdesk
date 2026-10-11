/** Reads a Postgres error code from a driver error or its cause. */
export function getDatabaseErrorCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null) {
    return undefined
  }

  if ("code" in error && typeof error.code === "string") {
    return error.code
  }

  if ("cause" in error) {
    return getDatabaseErrorCode(error.cause)
  }

  return undefined
}
