import z, { object, string } from "zod"

export const signInSchema = object({
  email: z.email("Invalid email"),
  password: string({ error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

export const signUpSchema = z
  .object({
    fullName: z
      .string({ error: "Full name is required" })
      .trim()
      .min(4, "Full name must be at least 4 characters")
      .max(255, "Full name must be less than 255 characters"),

    email: z
      .string({ error: "Email is required" })
      .trim()
      .toLowerCase()
      .pipe(z.email("Please enter a valid email address")),

    password: z
      .string({ error: "Password is required" })
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be less than 32 characters"),

    confirmPassword: z
      .string({ error: "Confirm password is required" })
      .min(1, "Confirm password is required")
      .min(8, "Confirm password must be at least 8 characters")
      .max(32, "Confirm password must be less than 32 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type SignUpInput = z.infer<typeof signUpSchema>

export const user = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.email(),
  passwordHash: z.string(),
  createdAt: z.date(),
})
