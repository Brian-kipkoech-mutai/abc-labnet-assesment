"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addInventoryItem(formData: FormData) {
  const name = (formData.get("name") as string)?.trim()
  const sku = (formData.get("sku") as string)?.trim().toUpperCase()
  const category = formData.get("category") as string
  const stockRaw = formData.get("stock_quantity")
  const unit = ((formData.get("unit") as string) ?? "").trim() || "Units"

  if (!name || !sku || !category) {
    return { error: "Name, SKU and category are required." }
  }

  const stock_quantity = Number(stockRaw)
  if (isNaN(stock_quantity) || stock_quantity < 0) {
    return { error: "Stock quantity must be a non-negative number." }
  }

  const image_url = (formData.get("image_url") as string) || null

  const supabase = await createClient()
  const { error } = await supabase
    .from("inventory_items")
    .insert({ name, sku, category, stock_quantity, unit, image_url })

  if (error) {
    if (error.code === "23505") return { error: "An item with this SKU already exists." }
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  return { success: true as const }
}

export async function updateInventoryItem(id: string, formData: FormData) {
  const name = (formData.get("name") as string)?.trim()
  const sku = (formData.get("sku") as string)?.trim().toUpperCase()
  const category = formData.get("category") as string
  const stockRaw = formData.get("stock_quantity")
  const unit = ((formData.get("unit") as string) ?? "").trim() || "Units"
  const image_url = (formData.get("image_url") as string) || undefined

  if (!name || !sku || !category) {
    return { error: "Name, SKU and category are required." }
  }

  const stock_quantity = Number(stockRaw)
  if (isNaN(stock_quantity) || stock_quantity < 0) {
    return { error: "Stock quantity must be a non-negative number." }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("inventory_items")
    .update({
      name,
      sku,
      category,
      stock_quantity,
      unit,
      ...(image_url !== undefined && { image_url }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    if (error.code === "23505") return { error: "An item with this SKU already exists." }
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  return { success: true as const }
}
