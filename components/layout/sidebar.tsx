"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  BarChart2,
  Map,
  Plus,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/client"

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Inventory", href: "/inventory", icon: Package },
  { title: "Reports", href: "/reports", icon: BarChart2 },
  { title: "Roadmap", href: "/roadmap", icon: Map },
]

const footerItems = [
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Help", href: "/help", icon: HelpCircle },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWvylAlC0ojnydnjinzu20nSsSKfQUP2NGAdVD-L-K-xlphedux31Vt6o0lA_0wK0GOBmMuo0goOea7GjWyh2PNYP8cZIw3o6oNwP8bnS0fOTSddFa-YuS29kVVJyZQNRwWw_H1tlDhnEoCzLjy--q0Zx9juWAc8m2NF6g9BZN6eVuFmsIS5a-lXbCJK3P7tVlvpBvkxeLNvS7WtBXqy9pgmhjKq9wbo81-qqqG9Md0ylwHm1q0r-4SzGVStuxyw1JeCcrybYrg-g"
            alt="ABC LAB NET Logo"
            className="h-10 w-10 rounded-lg object-cover shadow-sm"
          />
          <div>
            <span className="block text-sm font-bold leading-tight text-primary">
              ABC LAB NET
            </span>
            <p className="text-xs text-muted-foreground">Store Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <div className="mt-6 px-2">
          <Link
            href="/data-entry"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Entry
          </Link>
        </div>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4">
        <SidebarSeparator className="mb-2" />
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="text-destructive hover:text-destructive"
            >
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
