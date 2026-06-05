import { redirect } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/sidebar"
import { AppHeader } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader userEmail={user.email} />
        <main className="min-h-[calc(100svh-4rem)] bg-surface-gray pb-20 md:pb-0">
          {children}
        </main>
      </SidebarInset>

      {/* Mobile FAB */}
      <Link
        href="/data-entry"
        className="fixed bottom-20 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95 md:hidden hover:bg-primary/90"
        aria-label="New entry"
      >
        <Plus className="h-6 w-6" />
      </Link>

      <MobileNav />
    </SidebarProvider>
  )
}
