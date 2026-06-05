"use client"

import { Bell, Settings, Search } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface AppHeaderProps {
  userEmail?: string
}

export function AppHeader({ userEmail }: AppHeaderProps) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : "AL"

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card px-4 shadow-sm md:px-8">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <span className="text-lg font-bold text-deep-forest">ABC LAB NET</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search inventory..."
            className="w-64 border-none bg-surface-gray pl-9 focus-visible:ring-primary/20"
          />
        </div>

        <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent">
          <Bell className="h-5 w-5" />
        </button>

        <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent">
          <Settings className="h-5 w-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border bg-primary text-xs font-semibold text-primary-foreground transition-transform active:scale-95">
              {initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="truncate text-xs text-muted-foreground">
              {userEmail}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
