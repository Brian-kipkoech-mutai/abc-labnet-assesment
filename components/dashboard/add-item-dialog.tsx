"use client"

import { useState, useTransition } from "react"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addInventoryItem } from "@/lib/actions/inventory"

const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Bakery",
  "Meat",
  "Beverages",
  "Other",
]

export function AddItemDialog() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError(null)

    startTransition(async () => {
      const result = await addInventoryItem(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setOpen(false)
      }
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (v) setError(null)
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-deep-forest">Add New Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Item Name</Label>
            <Input id="name" name="name" placeholder="e.g. Baby Spinach 250g" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" placeholder="e.g. VG-0001" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                aria-label="Item category"
                required
                className="h-9 w-full rounded-md border border-input bg-surface-input px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                min="0"
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="unit">Unit</Label>
              <Input id="unit" name="unit" placeholder="Units" defaultValue="Units" />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPending ? "Adding…" : "Add Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
