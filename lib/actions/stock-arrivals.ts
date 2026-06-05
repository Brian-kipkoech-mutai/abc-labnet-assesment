"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitStockArrival(formData: FormData) {
  const product_name = (formData.get("product_name") as string)?.trim()
  const category     = (formData.get("category") as string)?.trim()
  const quantity     = Number(formData.get("quantity"))
  const unit         = (formData.get("unit") as string) || "kg"
  const arrival_date = formData.get("arrival_date") as string
  const supplier     = (formData.get("supplier") as string)?.trim()
  const notes        = (formData.get("notes") as string)?.trim() || null
  const status       = (formData.get("status") as string) || "PENDING"

  if (!product_name || !category || !arrival_date || !supplier) {
    return { error: "Product, category, date and supplier are required." }
  }
  if (isNaN(quantity) || quantity <= 0) {
    return { error: "Quantity must be a positive number." }
  }

  const supabase = await createClient()

  const { error } = await supabase.from("stock_arrivals").insert({
    product_name,
    category,
    quantity,
    unit,
    arrival_date,
    supplier,
    notes,
    status,
  })

  if (error) return { error: error.message }

  // On VERIFIED submission, increase the matching inventory item's stock
  if (status === "VERIFIED") {
    await supabase.rpc("increment_stock", {
      p_name: product_name,
      p_qty: quantity,
    })
  }

  revalidatePath("/data-entry")
  revalidatePath("/dashboard")
  return { success: true as const }
}
