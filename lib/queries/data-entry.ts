import { createClient } from "@/lib/supabase/server"
import type { InventoryItem } from "@/lib/types"

export interface StockArrival {
  id: string
  product_name: string
  category: string
  quantity: number
  unit: string
  arrival_date: string
  supplier: string
  notes: string | null
  status: "PENDING" | "VERIFIED" | "QC_REVIEW" | "DRAFT"
  created_at: string
}

export async function getProductsForSelect(): Promise<Pick<InventoryItem, "id" | "name" | "sku" | "category">[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("inventory_items")
    .select("id, name, sku, category")
    .order("name")

  return (data ?? []) as Pick<InventoryItem, "id" | "name" | "sku" | "category">[]
}

export async function getRecentArrivals(limit = 3): Promise<StockArrival[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("stock_arrivals")
    .select("*")
    .not("status", "eq", "DRAFT")
    .order("created_at", { ascending: false })
    .limit(limit)

  return (data ?? []) as StockArrival[]
}
