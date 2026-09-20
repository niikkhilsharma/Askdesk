import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

/** Chat widget header with the Askdesk name and a close control. */
export default function WidgetHeader() {
  return (
    <>
      <div className="sticky top-0 z-10 border-b bg-card">
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex items-center gap-2">
            <Avatar>
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
