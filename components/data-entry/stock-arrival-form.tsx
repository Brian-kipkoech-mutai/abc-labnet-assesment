"use client"

import { useState, useTransition, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronDown, Truck, CheckCircle2, Loader2,
  Package, AlertTriangle, CheckCircle,
  Leaf, Apple, Milk, Croissant, Coffee, UtensilsCrossed,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { submitStockArrival } from "@/lib/actions/stock-arrivals"
import type { StockArrival } from "@/lib/queries/data-entry"
import { cn } from "@/lib/utils"

const CATEGORY_OPTIONS = [
  { value: "Vegetables", label: "Vegetable", icon: Leaf },
  { value: "Fruits",     label: "Fruit",     icon: Apple },
  { value: "Dairy",      label: "Dairy",     icon: Milk },
  { value: "Bakery",     label: "Bakery",    icon: Croissant },
  { value: "Beverages",  label: "Beverage",  icon: Coffee },
  { value: "Meat",       label: "Meat",      icon: UtensilsCrossed },
  { value: "Other",      label: "Other",     icon: Package },
]

const UNITS = ["kg", "box", "unit", "pallet", "litre", "crate"]

const STATUS_STYLES: Record<string, string> = {
  VERIFIED:  "bg-primary/10 text-primary",
  PENDING:   "bg-harvest-orange/10 text-harvest-orange",
  QC_REVIEW: "bg-beet-red/10 text-beet-red",
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor(diff / 60_000)
  if (h >= 24) return new Date(dateStr).toLocaleDateString()
  if (h > 0) return `${h}h ago`
  if (m > 0) return `${m}m ago`
  return "just now"
}

interface Product { id: string; name: string; sku: string; category: string }

interface Props {
  products: Product[]
  recentArrivals: StockArrival[]
}

export function StockArrivalForm({ products, recentArrivals }: Props) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [category, setCategory] = useState("")
  const [unit, setUnit] = useState("kg")
  const [submitMode, setSubmitMode] = useState<"draft" | "submit">("submit")
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleProductChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const product = products.find((p) => p.name === e.target.value)
    if (product) setCategory(product.category)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("status", submitMode === "draft" ? "DRAFT" : "VERIFIED")
    setError(null)

    startTransition(async () => {
      const result = await submitStockArrival(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        if (submitMode === "submit") {
          setShowToast(true)
          setTimeout(() => setShowToast(false), 4000)
          formRef.current?.reset()
          setCategory("")
          setUnit("kg")
        }
        router.refresh()
      }
    })
  }

  return (
    <>
      {/* Form card */}
      <Card className="mb-12 overflow-hidden">
        <CardContent className="p-8">
          <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-4">

            {/* Product Name */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                Product Name
              </Label>
              <div className="relative">
                <select
                  name="product_name"
                  title="Select product"
                  aria-label="Product name"
                  required
                  onChange={handleProductChange}
                  className="h-12 w-full appearance-none rounded-lg border-none bg-surface-input px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select a product…</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                Category
              </Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map(({ value, label, icon: Icon }) => (
                  <label
                    key={value}
                    className={cn(
                      "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm transition-colors hover:bg-surface-gray",
                      category === value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-outline-variant text-on-surface-variant",
                    )}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={value}
                      checked={category === value}
                      onChange={() => setCategory(value)}
                      required
                      className="hidden"
                    />
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quantity + Unit */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="quantity" className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                Quantity
              </Label>
              <div className="flex gap-2">
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  required
                  className="h-12 flex-1 border-none bg-surface-input focus-visible:ring-primary/20"
                />
                <div className="relative w-28">
                  <select
                    name="unit"
                    title="Unit"
                    aria-label="Unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="h-12 w-full appearance-none rounded-lg border-none bg-surface-input px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                </div>
              </div>
            </div>

            {/* Arrival Date */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="arrival_date" className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                Arrival Date
              </Label>
              <Input
                id="arrival_date"
                name="arrival_date"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                className="h-12 border-none bg-surface-input focus-visible:ring-primary/20"
              />
            </div>

            {/* Supplier */}
            <div className="space-y-2 md:col-span-4">
              <Label htmlFor="supplier" className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                Supplier
              </Label>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                <Input
                  id="supplier"
                  name="supplier"
                  placeholder="Enter supplier name or ID"
                  required
                  className="h-12 border-none bg-surface-input pl-10 focus-visible:ring-primary/20"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2 md:col-span-4">
              <Label htmlFor="notes" className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                Notes / Quality Assessment
              </Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add any observations about stock condition…"
                rows={4}
                className="resize-none border-none bg-surface-input focus-visible:ring-primary/20"
              />
            </div>

            {/* Actions footer */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant pt-6 sm:flex-row md:col-span-4 mt-2">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 rounded-full bg-surface-gray px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-harvest-orange" />
                  <span className="text-xs font-bold text-on-surface-variant">Auto-Sync On</span>
                </div>
                <button
                  type="reset"
                  onClick={() => { setCategory(""); setUnit("kg") }}
                  className="text-sm font-medium text-on-surface-variant transition-colors hover:text-beet-red"
                >
                  Clear Form
                </button>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex w-full gap-3 sm:w-auto">
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => setSubmitMode("draft")}
                  className="flex-1 h-12 border-primary text-primary hover:bg-surface-gray sm:flex-none sm:px-8"
                >
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  onClick={() => setSubmitMode("submit")}
                  className="flex h-12 flex-1 items-center gap-2 bg-primary text-primary-foreground shadow-md hover:bg-primary/90 sm:flex-none sm:px-8"
                >
                  {isPending && submitMode === "submit" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Submit Entry
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Recent Arrivals */}
      <section>
        <h3 className="mb-6 text-2xl font-semibold text-deep-forest">Recent Arrivals</h3>
        {recentArrivals.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No arrivals recorded yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {recentArrivals.map((arrival) => {
              const isWarning = arrival.status === "QC_REVIEW"
              return (
                <div
                  key={arrival.id}
                  className={cn(
                    "group flex cursor-default items-center gap-4 rounded-xl border bg-card p-6 shadow-sm transition-colors",
                    isWarning ? "hover:border-destructive" : "hover:border-primary",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-110",
                      isWarning ? "bg-beet-red/10 text-beet-red" : "bg-primary/10 text-primary",
                    )}
                  >
                    {isWarning ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : (
                      <Package className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-deep-forest">{arrival.product_name}</p>
                    <p className="mb-2 text-xs text-on-surface-variant">
                      {arrival.quantity} {arrival.unit} • {timeAgo(arrival.created_at)}
                    </p>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", STATUS_STYLES[arrival.status] ?? "bg-muted text-muted-foreground")}>
                      {arrival.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Success toast */}
      <div
        className={cn(
          "fixed bottom-8 right-8 z-50 flex items-center gap-4 rounded-xl bg-primary px-6 py-4 text-primary-foreground shadow-2xl transition-all duration-500",
          showToast ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none",
        )}
      >
        <CheckCircle className="h-8 w-8 shrink-0" />
        <div>
          <p className="font-bold">Entry Successful</p>
          <p className="text-sm opacity-90">Stock has been added to warehouse inventory.</p>
        </div>
      </div>
    </>
  )
}
