import { createClient } from "@/lib/supabase/server"
import type {
  InventoryItem,
  Transaction,
  DashboardStats,
  SalesTrendPoint,
} from "@/lib/types"

export const PAGE_SIZE = 10
const LOW_STOCK_THRESHOLD = 20

export async function getInventoryItems(page = 1) {
  const supabase = await createClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const [{ data: items }, { count }] = await Promise.all([
    supabase
      .from("inventory_items")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to),
    supabase
      .from("inventory_items")
      .select("*", { count: "exact", head: true }),
  ])

  const total = count ?? 0
  return {
    items: (items ?? []) as InventoryItem[],
    total,
    pages: Math.ceil(total / PAGE_SIZE),
    page,
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const [salesResult, alertsResult, ordersResult, arrivalsResult] =
    await Promise.all([
      supabase
        .from("transactions")
        .select("amount")
        .eq("status", "COMPLETED")
        .gte("created_at", todayStart.toISOString()),
      supabase
        .from("inventory_items")
        .select("*", { count: "exact", head: true })
        .lt("stock_quantity", LOW_STOCK_THRESHOLD),
      supabase
        .from("transactions")
        .select("*", { count: "exact", head: true })
        .eq("status", "PENDING"),
      supabase
        .from("inventory_items")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekAgo.toISOString()),
    ])

  return {
    totalSalesToday:
      salesResult.data?.reduce((sum, t) => sum + Number(t.amount), 0) ?? 0,
    stockAlerts: alertsResult.count ?? 0,
    activeOrders: ordersResult.count ?? 0,
    newArrivals: arrivalsResult.count ?? 0,
  }
}

export async function getRecentTransactions(limit = 5): Promise<Transaction[]> {
  const supabase = await createClient()
  const { data: txs } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (!txs?.length) return []

  // Batch-fetch images from inventory_items for any transaction missing one
  const missingNames = txs.filter((t) => !t.item_image).map((t) => t.item_name as string)

  let imageMap: Record<string, string> = {}
  if (missingNames.length) {
    const { data: items } = await supabase
      .from("inventory_items")
      .select("name, image_url")
      .in("name", missingNames)
    imageMap = Object.fromEntries(
      (items ?? []).filter((i) => i.image_url).map((i) => [i.name, i.image_url])
    )
  }

  return txs.map((t) => ({
    ...t,
    item_image: t.item_image ?? imageMap[t.item_name] ?? null,
  })) as Transaction[]
}

export async function getSalesTrends(): Promise<SalesTrendPoint[]> {
  const supabase = await createClient()

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const { data } = await supabase
    .from("transactions")
    .select("amount, created_at")
    .eq("status", "COMPLETED")
    .gte("created_at", sevenDaysAgo.toISOString())

  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const ordered: { day: string; date: string; total: number }[] = []

  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    ordered.push({
      day: DAY_NAMES[d.getDay()],
      date: d.toISOString().split("T")[0],
      total: 0,
    })
  }

  data?.forEach((tx) => {
    const txDate = (tx.created_at as string).split("T")[0]
    const entry = ordered.find((o) => o.date === txDate)
    if (entry) entry.total += Number(tx.amount)
  })

  const max = Math.max(...ordered.map((o) => o.total), 1)
  return ordered.map((o) => ({
    day: o.day,
    total: o.total,
    heightPercent: Math.max(Math.round((o.total / max) * 90), 5),
  }))
}

export async function getAllInventoryForExport(): Promise<InventoryItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("inventory_items")
    .select("*")
    .order("created_at", { ascending: false })

  return (data ?? []) as InventoryItem[]
}
