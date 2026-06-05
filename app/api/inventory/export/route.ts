import { createClient } from "@/lib/supabase/server"
import { getInventoryStatus } from "@/lib/types"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { data: items } = await supabase
    .from("inventory_items")
    .select("*")
    .order("created_at", { ascending: false })

  const rows = (items ?? []).map((item) => [
    item.name,
    item.sku,
    item.category,
    item.stock_quantity,
    item.unit,
    getInventoryStatus(item.stock_quantity),
    new Date(item.created_at).toLocaleDateString(),
  ])

  const header = ["Name", "SKU", "Category", "Stock Qty", "Unit", "Status", "Created"]
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n")

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="inventory-${Date.now()}.csv"`,
    },
  })
}
