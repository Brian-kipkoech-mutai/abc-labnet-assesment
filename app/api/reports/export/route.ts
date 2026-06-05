import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

function escapeCell(value: string | number | null | undefined): string {
  const str = String(value ?? "")
  return `"${str.replace(/"/g, '""')}"`
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return new Response("Unauthorized", { status: 401 })

  const { searchParams } = new URL(request.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const category = searchParams.get("category")
  const store = searchParams.get("store")

  // Resolve category filter to item names (transactions have no category column)
  let categoryNames: string[] | null = null
  if (category && category !== "all") {
    const { data: items } = await supabase
      .from("inventory_items")
      .select("name")
      .eq("category", category)
    categoryNames = items?.map((i) => i.name) ?? []
  }

  let query = supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false })

  if (from) query = query.gte("created_at", from)
  if (to) query = query.lte("created_at", `${to}T23:59:59.999Z`)
  if (categoryNames?.length) query = query.in("item_name", categoryNames)
  if (store && store !== "all") query = query.eq("store_id", store)

  const { data, error } = await query
  if (error) return new Response(error.message, { status: 500 })

  const header = ["Date", "Item", "Store", "Amount", "Status"]
  const rows = (data ?? []).map((row) => [
    escapeCell(new Date(row.created_at).toLocaleDateString("en-US")),
    escapeCell(row.item_name),
    escapeCell(row.store_id),
    escapeCell(Number(row.amount).toFixed(2)),
    escapeCell(row.status),
  ])

  const csv = [header.map(escapeCell), ...rows]
    .map((r) => r.join(","))
    .join("\n")

  const filename = `transactions-report-${Date.now()}.csv`

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
