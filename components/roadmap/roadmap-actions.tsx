"use client"

import { Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RoadmapActions() {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        onClick={() => window.print()}
        className="gap-2 border-primary text-primary hover:bg-primary/5"
      >
        <Download className="h-4 w-4" />
        Export PDF
      </Button>
      <Button
        onClick={() => window.print()}
        className="gap-2 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
      >
        <Printer className="h-4 w-4" />
        Print Map
      </Button>
    </div>
  )
}
