import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

export default function WidgetHeader() {
  return (
    <>
      <div className="sticky top-0 z-10 border-b bg-card">
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://askdesk.com/logo.png" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <p className="font-medium text-card-foreground">Askdesk</p>
          </div>

          <Button variant="ghost" size="icon">
            <XIcon />
          </Button>
        </div>
      </div>
    </>
  )
}
