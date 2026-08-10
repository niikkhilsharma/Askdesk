"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type FieldErrors = {
  fullName?: string[]
  email?: string[]
  password?: string[]
  confirmPassword?: string[]
}

type RegisterResponse = {
  message: string
  errors?: FieldErrors
  formErrors?: string[]
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  async function register(formData: FormData) {
    setIsLoading(true)
    setFieldErrors({})

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          password: formData.get("password"),
          confirmPassword: formData.get("confirmPassword"),
        }),
      })

      const response: RegisterResponse = await res.json()

      // Handles Zod errors, duplicate email errors and server errors
      if (!res.ok) {
        setFieldErrors(response.errors ?? {})

        toast.error(response.message)
        return
      }

      toast.success("Registration successful", {
        description: "Please log in using the login page.",
      })

      router.push("/login")
    } catch (error) {
      console.error("Registration failed:", error)
      toast.error("Unable to connect to the server")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={(event) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        register(formData)
      }}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>

          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="fullName">Full Name</FieldLabel>

          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            aria-invalid={Boolean(fieldErrors.fullName)}
            required
          />

          {fieldErrors.fullName?.map((error) => (
            <p key={error} className="text-sm text-destructive">
              {error}
            </p>
          ))}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            aria-invalid={Boolean(fieldErrors.email)}
            required
          />

          {fieldErrors.email?.map((error) => (
            <p key={error} className="text-sm text-destructive">
              {error}
            </p>
          ))}

          {!fieldErrors.email && (
            <FieldDescription>
              We&apos;ll use this to contact you. We will not share your email
              with anyone else.
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>

          <Input
            id="password"
            name="password"
            type="password"
            aria-invalid={Boolean(fieldErrors.password)}
            required
          />

          {fieldErrors.password?.map((error) => (
            <p key={error} className="text-sm text-destructive">
              {error}
            </p>
          ))}

          {!fieldErrors.password && (
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            aria-invalid={Boolean(fieldErrors.confirmPassword)}
            required
          />

          {fieldErrors.confirmPassword?.map((error) => (
            <p key={error} className="text-sm text-destructive">
              {error}
            </p>
          ))}

          {!fieldErrors.confirmPassword && (
            <FieldDescription>Please confirm your password.</FieldDescription>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button">
            Sign up with GitHub
          </Button>

          <FieldDescription className="px-6 text-center">
            Already have an account? <Link href="/login">Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
