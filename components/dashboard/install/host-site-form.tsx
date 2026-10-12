"use client"

import { addHostSiteAction } from "@/app/actions/install"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useActionState, useEffect, useRef, useState } from "react"

/** Form for adding the exact site where the bot may run. */
export function HostSiteForm() {
  const [state, formAction, pending] = useActionState(addHostSiteAction, {
    message: null,
  })
  const [url, setUrl] = useState("")
  const wasPending = useRef(false)
  const invalid = Boolean(state.message)

  useEffect(() => {
    if (wasPending.current && !pending && state.message === null) {
      setUrl("")
    }

    wasPending.current = pending
  }, [pending, state.message])

  return (
    <form action={formAction}>
      <FieldGroup className="gap-3">
        <Field data-invalid={invalid || undefined}>
          <FieldLabel htmlFor="host-site-url">Site address</FieldLabel>
          <Input
            id="host-site-url"
            name="url"
            type="text"
            inputMode="url"
            placeholder="https://www.oakclinic.com"
            autoComplete="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? "host-site-error" : undefined}
          />
          <FieldError
            id="host-site-error"
            errors={invalid ? [{ message: state.message ?? undefined }] : []}
          />
        </Field>
        <Button type="submit" disabled={pending} className="w-fit">
          {pending ? "Adding…" : "Add site"}
        </Button>
      </FieldGroup>
    </form>
  )
}
