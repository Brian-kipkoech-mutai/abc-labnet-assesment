import { createClient } from "@/lib/supabase/server"
import type { Transaction } from "@/lib/types"

export const REPORT_PAGE_SIZE = 10

export async function getReportTransactions({
  from,
  to,
  category,
  staff,
  page = 1,
}: {
  from?: string
  to?: string
  category?: string
  staff?: string
  page?: number
}): Promise<{ rows: Transaction[]; total: number }> {
  const supabase = await createClient()
  const offset = (page - 1) * REPORT_PAGE_SIZE

  // Resolve category filter → item names (transactions have no category column)
  let categoryNames: string[] | null = null
  if (category && category !== "all") {
    const { data: items } = await supabase
      .from("inventory_items")
      .select("name")
      .eq("category", category)
    categoryNames = items?.map((i) => i.name) ?? []
    if (categoryNames.length === 0) return { rows: [], total: 0 }
  }

  let query = supabase
    .from("transactions")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + REPORT_PAGE_SIZE - 1)

  if (from) query = query.gte("created_at", from)
  if (to) query = query.lte("created_at", `${to}T23:59:59.999Z`)
  if (categoryNames) query = query.in("item_name", categoryNames)
  if (staff && staff !== "all") query = query.eq("store_id", staff)

  const { data, count } = await query
  if (!data?.length) return { rows: [], total: count ?? 0 }

  // Backfill images from inventory_items when missing (same pattern as dashboard)
  const missingNames = data
    .filter((t) => !t.item_image)
    .map((t) => t.item_name as string)

  let imageMap: Record<string, string> = {}
  if (missingNames.length) {
    const { data: items } = await supabase
      .from("inventory_items")
      .select("name, image_url")
      .in("name", missingNames)
    imageMap = Object.fromEntries(
      (items ?? []).filter((i) => i.image_url).map((i) => [i.name, i.image_url]),
    )
  }

  const rows = data.map((t) => ({
    ...t,
    item_image: t.item_image ?? imageMap[t.item_name] ?? null,
  })) as Transaction[]

  return { rows, total: count ?? 0 }
}

export interface ReportSummary {
  totalRevenue: number
  totalUnits: number
  avgTransaction: number
  topCategory: string
}

export async function getReportSummary({
  from,
  to,
  category,
  staff,
}: {
  from?: string
  to?: string
  category?: string
  staff?: string
}): Promise<ReportSummary> {
  const supabase = await createClient()

  let categoryNames: string[] | null = null
  if (category && category !== "all") {
    const { data: items } = await supabase
      .from("inventory_items")
      .select("name")
      .eq("category", category)
    categoryNames = items?.map((i) => i.name) ?? []
    if (categoryNames.length === 0) {
      return { totalRevenue: 0, totalUnits: 0, avgTransaction: 0, topCategory: category }
    }
  }

  let query = supabase.from("transactions").select("amount, status, item_name")
  if (from) query = query.gte("created_at", from)
  if (to) query = query.lte("created_at", `${to}T23:59:59.999Z`)
  if (categoryNames) query = query.in("item_name", categoryNames)
  if (staff && staff !== "all") query = query.eq("store_id", staff)

  const { data } = await query
  const completed = (data ?? []).filter((t) => t.status === "COMPLETED")
  const totalRevenue = completed.reduce((sum, t) => sum + Number(t.amount ?? 0), 0)
  const totalUnits = completed.length
  const avgTransaction = totalUnits > 0 ? totalRevenue / totalUnits : 0

  // When no category filter: derive top category from completed transaction item names
  let topCategory = category && category !== "all" ? category : "—"
  if (!category || category === "all") {
    const names = [...new Set(completed.map((t) => t.item_name as string))]
    if (names.length) {
      const { data: items } = await supabase
        .from("inventory_items")
        .select("category, name")
        .in("name", names)
      if (items?.length) {
        const counts: Record<string, number> = {}
        items.forEach((i) => {
          counts[i.category] = (counts[i.category] ?? 0) + 1
        })
        topCategory =
          Object.entries(counts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "—"
      }
    }
  }

  return { totalRevenue, totalUnits, avgTransaction, topCategory }
}

export async function getDistinctCategories(): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("inventory_items").select("category")
  return [
    ...new Set((data ?? []).map((i) => i.category as string).filter(Boolean)),
  ].sort()
}

export async function getDistinctStores(): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("transactions")
    .select("store_id")
  return [
    ...new Set(
      (data ?? [])
        .map((t) => t.store_id as string)
        .filter((s) => s && s.trim() !== ""),
    ),
  ].sort()
}
