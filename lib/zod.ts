import z, { object, string } from "zod"

import { MAX_UPLOAD_BYTES } from "@/lib/knowledge-base/constants"

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

const pdfFileNameSchema = z
  .string({ error: "File name is required" })
  .trim()
  .min(1, "File name is required")
  .max(255, "File name must be less than 255 characters")
  .refine((value) => value.toLowerCase().endsWith(".pdf"), {
    message: "Only PDF files are allowed",
  })

export const signUploadSchema = z.object({
  fileName: pdfFileNameSchema,
  bytes: z
    .number({ error: "File size is required" })
    .int("File size must be a whole number") 
    .positive("File size must be greater than zero")
    .max(MAX_UPLOAD_BYTES, `File must be ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB or smaller`),
})

export const confirmUploadSchema = z.object({
  fileName: pdfFileNameSchema,
  publicId: z.string().min(1, "Public ID is required").max(512),
  version: z
    .number({ error: "Version is required" })
    .int("Version must be a whole number")
    .positive("Version must be greater than zero"),
  signature: z.string().min(1, "Signature is required"),
  secureUrl: z.url("Secure URL must be valid"),
  bytes: z
    .number({ error: "File size is required" })
    .int("File size must be a whole number")
    .positive("File size must be greater than zero"),
})

export type SignUploadInput = z.infer<typeof signUploadSchema>
export type ConfirmUploadInput = z.infer<typeof confirmUploadSchema>

export const user = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.email(),
  passwordHash: z.string(),
  createdAt: z.date(),
})
