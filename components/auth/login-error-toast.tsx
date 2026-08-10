"use client"

import { toast } from "sonner"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "next/navigation"

export default function LoginErrorToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const errorMessage = searchParams.get("error")
  const code = searchParams.get("code")

  let messageToShow

  switch (errorMessage) {
    case "CredentialsSignin":
      messageToShow =
        "Sign in failed. Check that the details you provided are correct."
      break

    default:
      messageToShow = errorMessage
      break
  }

  useEffect(() => {
    if (errorMessage === "CredentialsSignin" && code === "credentials")
      toast.error(messageToShow)

    router.replace(pathname, { scroll: false })
  }, [errorMessage])

  return null
}
