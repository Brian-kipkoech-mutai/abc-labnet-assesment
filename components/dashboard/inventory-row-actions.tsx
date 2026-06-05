"use client"

import { useState, useTransition, useRef } from "react"
import { MoreVertical, ImagePlus, X, Pencil } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateInventoryItem } from "@/lib/actions/inventory"
import { createClient } from "@/lib/supabase/client"
import type { InventoryItem } from "@/lib/types"

const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Bakery",
  "Meat",
  "Beverages",
  "Other",
]

export function InventoryRowActions({ item }: { item: InventoryItem }) {
  const [editOpen, setEditOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    item.image_url
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function clearImage() {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleOpenChange(next: boolean) {
    setEditOpen(next)
    if (!next) {
      setError(null)
      setImageFile(null)
      setImagePreview(item.image_url)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError(null)

    startTransition(async () => {
      if (imageFile) {
        const supabase = createClient()
        const ext = imageFile.name.split(".").pop() ?? "jpg"
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, imageFile, { cacheControl: "3600", upsert: false })

        if (uploadError) {
          setError(`Image upload failed: ${uploadError.message}`)
          return
        }

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(uploadData.path)

        formData.set("image_url", urlData.publicUrl)
      } else if (imagePreview === null && item.image_url) {
        // user explicitly cleared the image
        formData.set("image_url", "")
      }

      const result = await updateInventoryItem(item.id, formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setEditOpen(false)
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`More options for ${item.name}`}
            className="text-on-surface-variant transition-colors hover:text-primary"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setEditOpen(true)}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-deep-forest">Edit Item</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Image */}
            <div className="space-y-1.5">
              <Label>Product Image</Label>
              {imagePreview ? (
                <div className="relative w-full overflow-hidden rounded-lg border border-outline-variant">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-36 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 rounded-full bg-foreground/60 p-1 text-background backdrop-blur-sm hover:bg-foreground/80"
                    aria-label="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload product image"
                  aria-label="Upload product image"
                  className="flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-outline-variant bg-surface-gray transition-colors hover:bg-accent"
                >
                  <ImagePlus className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Click to upload image
                  </span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                title="Choose an image file to upload"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`name-${item.id}`}>Item Name</Label>
              <Input
                id={`name-${item.id}`}
                name="name"
                defaultValue={item.name}
                placeholder="e.g. Roma Tomatoes"
                title="Item name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor={`sku-${item.id}`}>SKU</Label>
                <Input
                  id={`sku-${item.id}`}
                  name="sku"
                  defaultValue={item.sku}
                  placeholder="e.g. SKU1234"
                  title="Stock keeping unit"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`category-${item.id}`}>Category</Label>
                <select
                  id={`category-${item.id}`}
                  name="category"
                  aria-label="Item category"
                  title="Item category"
                  defaultValue={item.category}
                  required
                  className="h-9 w-full rounded-md border border-input bg-surface-input px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
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
                <Label htmlFor={`qty-${item.id}`}>Stock Quantity</Label>
                <Input
                  id={`qty-${item.id}`}
                  name="stock_quantity"
                  type="number"
                  min="0"
                  defaultValue={item.stock_quantity}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`unit-${item.id}`}>Unit</Label>
                <Input
                  id={`unit-${item.id}`}
                  name="unit"
                  defaultValue={item.unit}
                  placeholder="e.g. kg, pcs"
                  title="Unit of measure"
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isPending ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
