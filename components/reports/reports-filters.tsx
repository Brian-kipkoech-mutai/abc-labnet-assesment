"use client"

import { useRouter, usePathname } from "next/navigation"
import { useTransition } from "react"
import { Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  categories: string[]
  stores: string[]
  defaultFrom?: string
  defaultTo?: string
  defaultCategory?: string
  defaultStore?: string
}

export function ReportsFilters({
  categories,
  stores,
  defaultFrom,
  defaultTo,
  defaultCategory,
  defaultStore,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  function update(key: string, value: string) {
    const params = new URLSearchParams(window.location.search)
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("page")
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  return (
    <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
      {/* Date Range — spans 2 cols */}
      <div className="rounded-xl border border-outline-variant bg-card p-6 shadow-sm md:col-span-2">
        <Label className="mb-2 block text-xs font-medium uppercase tracking-wider text-on-surface-variant">
          Date Range
        </Label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <Input
              type="date"
              defaultValue={defaultFrom}
              onChange={(e) => update("from", e.target.value)}
              className="h-10 border-none bg-surface-input pl-10 focus-visible:ring-primary/20"
            />
          </div>
          <span className="shrink-0 text-xs font-medium text-on-surface-variant">to</span>
          <div className="relative flex-1">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <Input
              type="date"
              defaultValue={defaultTo}
              onChange={(e) => update("to", e.target.value)}
              className="h-10 border-none bg-surface-input pl-10 focus-visible:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Category — from inventory_items */}
      <div className="rounded-xl border border-outline-variant bg-card p-6 shadow-sm">
        <Label className="mb-2 block text-xs font-medium uppercase tracking-wider text-on-surface-variant">
          Category
        </Label>
        <Select
          defaultValue={defaultCategory ?? "all"}
          onValueChange={(v) => update("category", v)}
        >
          <SelectTrigger className="h-10 border-none bg-surface-input focus:ring-primary/20">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Store — from distinct store_id in transactions */}
      <div className="rounded-xl border border-outline-variant bg-card p-6 shadow-sm">
        <Label className="mb-2 block text-xs font-medium uppercase tracking-wider text-on-surface-variant">
          Store / Location
        </Label>
        <Select
          defaultValue={defaultStore ?? "all"}
          onValueChange={(v) => update("store", v)}
        >
          <SelectTrigger className="h-10 border-none bg-surface-input focus:ring-primary/20">
            <SelectValue placeholder="All Stores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stores</SelectItem>
            {stores.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  )
}
