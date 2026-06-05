"use client"

import { Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  csvHref: string
}

export function ReportsActions({ csvHref }: Props) {
  return (
    <div className="flex items-center gap-3">
      <Button
        asChild
        variant="outline"
        className="gap-2 border-primary text-primary hover:bg-primary/5"
      >
        <a href={csvHref} download>
          <Download className="h-4 w-4" />
          Download CSV
        </a>
      </Button>
      <Button
        onClick={() => window.print()}
        className="gap-2 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 print:hidden"
      >
        <Printer className="h-4 w-4" />
        Print
      </Button>
    </div>
  )
}
