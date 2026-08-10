import { Button } from "@/components/ui/button"
import { auth } from "@/auth"
import Link from "next/link"

export default async function Page() {
  const session = await auth()

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        {session?.user ? (
          <>
            <div>
              <h1 className="text-2xl font-semibold">
                Welcome, {session.user.fullName ?? "User"} 👋
              </h1>

              <div className="mt-4 space-y-2 rounded-lg border p-4">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {session.user.fullName ?? "N/A"}
                </p>

                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {session.user.email ?? "N/A"}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-semibold">Welcome!</h1>
              <p>Please log in or create an account to continue.</p>
            </div>

            <div className="flex gap-3">
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>

              <Button variant="outline" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        )}

        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}
