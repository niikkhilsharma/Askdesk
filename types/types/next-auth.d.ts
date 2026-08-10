// types/next-auth.d.ts

import type { DefaultSession } from "next-auth"
import type { JWT as DefaultJWT } from "next-auth/jwt"

type AppUserFields = {
  id: string
  fullName: string
  email: string
  createdAt: string
  updatedAt: string
}

declare module "next-auth" {
  interface Session {
    user: AppUserFields & Omit<DefaultSession["user"], "email">
  }

  interface User extends AppUserFields {}
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT, AppUserFields {}
}
