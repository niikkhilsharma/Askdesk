// import type { NextApiRequest, NextApiResponse } from "next"
// import NextAuth from "next-auth"

// async function auth(req: NextApiRequest, res: NextApiResponse) {
//   // Do whatever you want here, before the request is passed down to `NextAuth`
//   return await NextAuth(req, res, {
//     ...
//   })
// }

// export { auth as GET, auth as POST }

import { handlers } from "@/auth" // Referring to the auth.ts we just created
export const { GET, POST } = handlers
