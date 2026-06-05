"use client"

import { useEffect, useState } from "react"
import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function SyncToast() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 1000)
    const hide = setTimeout(() => setVisible(false), 6000)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-8 right-8 z-50 flex items-center gap-4 rounded-xl bg-deep-forest px-6 py-4 text-white shadow-2xl transition-all duration-500",
        visible ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0 pointer-events-none",
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-foreground">
        <CheckCircle className="h-4 w-4 text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold">Map Synchronized</p>
        <p className="text-xs text-white/60">All components updated to Design System 1.0.</p>
      </div>
    </div>
  )
}
