import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { findUserByEmail, verifyPassword } from "./utils/auth/auth"
import { signInSchema } from "./lib/zod"
import { ZodError } from "zod"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      authorize: async (credentials) => {
        try {
          let user = null

          const { email, password } = await signInSchema.parseAsync(credentials)

          user = await findUserByEmail(email)
          if (!user) return null

          const isValid = await verifyPassword(
            password,
            user.passwordHash // the stored hash, not the plaintext
          )

          if (!isValid) return null

          console.log("this is user", user)

          return {
            id: String(user.id),
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          }
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            console.log(error)
            return null
          }
          return null
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = String(user.id)
        token.fullName = user.fullName
        token.createdAt = user.createdAt
        token.updatedAt = user.updatedAt
      }

      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.fullName = token.fullName as string
      session.user.createdAt = token.createdAt as string
      session.user.updatedAt = token.updatedAt as string

      return session
    },
  },
})
