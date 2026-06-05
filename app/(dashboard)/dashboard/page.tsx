import Link from "next/link"
import {
  CreditCard,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  Sparkles,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Leaf,
} from "lucide-react"
import {
  getDashboardStats,
  getRecentTransactions,
  getSalesTrends,
  getInventoryItems,
  PAGE_SIZE,
} from "@/lib/queries/dashboard"
import { getInventoryStatus } from "@/lib/types"
import { AddItemDialog } from "@/components/dashboard/add-item-dialog"

// Static lookup so Tailwind can scan all class names at build time.
const BAR_HEIGHT: Record<number, string> = {
  5: "h-[5%]",   10: "h-[10%]", 15: "h-[15%]", 20: "h-[20%]",
  25: "h-[25%]", 30: "h-[30%]", 35: "h-[35%]", 40: "h-[40%]",
  45: "h-[45%]", 50: "h-[50%]", 55: "h-[55%]", 60: "h-[60%]",
  65: "h-[65%]", 70: "h-[70%]", 75: "h-[75%]", 80: "h-[80%]",
  85: "h-[85%]", 90: "h-[90%]",
}
function barHeightClass(percent: number): string {
  const snapped = Math.max(5, Math.min(90, Math.round(percent / 5) * 5))
  return BAR_HEIGHT[snapped] ?? "h-[5%]"
}

const STATUS_BADGE: Record<string, string> = {
  COMPLETED: "bg-primary/10 text-primary",
  PENDING: "bg-harvest-orange/10 text-harvest-orange",
  FAILED: "bg-beet-red/10 text-beet-red",
}

const INVENTORY_STATUS_BADGE: Record<string, string> = {
  "IN STOCK": "bg-primary/10 text-primary",
  "LOW STOCK": "bg-harvest-orange/10 text-harvest-orange",
  "OUT OF STOCK": "bg-beet-red/10 text-beet-red",
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
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

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam ?? 1))

  const [stats, { items, total, pages }, transactions, salesTrends] =
    await Promise.all([
      getDashboardStats(),
      getInventoryItems(page),
      getRecentTransactions(5),
      getSalesTrends(),
    ])

  const totalPages = pages
  const showingFrom = (page - 1) * PAGE_SIZE + 1
  const showingTo = Math.min(page * PAGE_SIZE, total)

  return (
    <div className="mx-auto max-w-360 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-deep-forest md:text-3xl">
          Store Overview
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Real-time performance and inventory health status.
        </p>
      </div>

      {/* Metric cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-outline-variant bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-surface-container p-2">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-1 text-primary">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Today</span>
            </div>
          </div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
            Total Sales Today
          </p>
          <h3 className="text-2xl font-semibold text-deep-forest">
            {formatCurrency(stats.totalSalesToday)}
          </h3>
        </div>

        <div className="rounded-xl border border-outline-variant bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-beet-red/10 p-2">
              <AlertTriangle className="h-5 w-5 text-beet-red" />
            </div>
            <span className="rounded-full bg-beet-red/10 px-3 py-1 text-xs font-medium text-beet-red">
              Critical
            </span>
          </div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
            Stock Alerts
          </p>
          <h3 className="text-2xl font-semibold text-deep-forest">
            {stats.stockAlerts} Items
          </h3>
        </div>

        <div className="rounded-xl border border-outline-variant bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-secondary-container/30 p-2">
              <ShoppingCart className="h-5 w-5 text-secondary" />
            </div>
            <span className="rounded-full bg-harvest-orange/10 px-3 py-1 text-xs font-medium text-harvest-orange">
              Processing
            </span>
          </div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
            Active Orders
          </p>
          <h3 className="text-2xl font-semibold text-deep-forest">
            {stats.activeOrders}
          </h3>
        </div>

        <div className="rounded-xl border border-outline-variant bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-surface-container-high p-2">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              This Week
            </span>
          </div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
            New Arrivals
          </p>
          <h3 className="text-2xl font-semibold text-deep-forest">
            {stats.newArrivals} SKUs
          </h3>
        </div>
      </div>

      {/* Sales trends + recent transactions */}
      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Chart */}
        <div className="rounded-xl border border-outline-variant bg-card p-8 shadow-sm xl:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-deep-forest">Sales Trends</h3>
              <p className="text-sm text-on-surface-variant">
                Revenue analytics for the current week
              </p>
            </div>
          </div>

          <div className="relative flex h-64 w-full items-end gap-2 px-2">
            <div className="pointer-events-none absolute inset-0 border-b border-l border-outline-variant/30" />
            {salesTrends.map((bar) => (
              <div
                key={bar.day}
                className={`group relative flex-1 cursor-pointer rounded-t-sm bg-primary/20 transition-colors hover:bg-primary/50 ${barHeightClass(bar.heightPercent)}`}
                title={`${bar.day}: ${formatCurrency(bar.total)}`}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between px-2 text-xs font-medium text-on-surface-variant">
            {salesTrends.map(({ day }) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="rounded-xl border border-outline-variant bg-card p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-deep-forest">
              Recent Transactions
            </h3>
            <button type="button" className="text-xs font-medium text-primary hover:underline">
              View All
            </button>
          </div>

          {transactions.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No transactions yet.</p>
          ) : (
            <div className="space-y-5">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-deep-forest">
                      {tx.item_name}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {tx.store_id} · {timeAgo(tx.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-deep-forest">
                      +{formatCurrency(Number(tx.amount))}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_BADGE[tx.status]}`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inventory table */}
      <div className="overflow-hidden rounded-xl border border-outline-variant bg-card shadow-sm">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-outline-variant bg-surface-gray/50 px-8 py-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold text-deep-forest">
              Detailed Inventory Status
            </h3>
            <p className="text-sm text-on-surface-variant">
              {total} items · page {page} of {totalPages || 1}
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/api/inventory/export"
              className="flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </a>
            <AddItemDialog />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-gray">
                {[
                  { label: "Item Name", align: "" },
                  { label: "SKU", align: "" },
                  { label: "Category", align: "" },
                  { label: "Stock Level", align: "text-right" },
                  { label: "Status", align: "text-center" },
                  { label: "Action", align: "text-right" },
                ].map(({ label, align }) => (
                  <th
                    key={label}
                    className={`px-8 py-4 text-xs font-medium uppercase tracking-wider text-on-surface-variant ${align}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-sm text-on-surface-variant">
                    No items yet. Add your first item above.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const status = getInventoryStatus(item.stock_quantity)
                  return (
                    <tr
                      key={item.id}
                      className="group cursor-pointer transition-colors hover:bg-surface-gray"
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high">
                            <Leaf className="h-5 w-5 text-primary" />
                          </div>
                          <span className="text-sm font-semibold text-deep-forest">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-4 font-mono text-sm text-on-surface-variant">
                        {item.sku}
                      </td>
                      <td className="px-8 py-4 text-sm text-on-surface-variant">
                        {item.category}
                      </td>
                      <td className="px-8 py-4 text-right text-sm text-deep-forest">
                        {item.stock_quantity} {item.unit}
                      </td>
                      <td className="px-8 py-4 text-center">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${INVENTORY_STATUS_BADGE[status]}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button
                          type="button"
                          aria-label={`More options for ${item.name}`}
                          className="text-on-surface-variant transition-colors hover:text-primary"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant bg-surface-gray px-8 py-4 sm:flex-row">
          <span className="text-xs text-on-surface-variant">
            {total === 0
              ? "No entries"
              : `Showing ${showingFrom}–${showingTo} of ${total} entries`}
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard?page=${page - 1}`}
                aria-label="Previous page"
                aria-disabled={page <= 1}
                className={`rounded-lg border border-outline-variant p-2 transition-colors hover:bg-card ${
                  page <= 1 ? "pointer-events-none opacity-40" : ""
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + 1
                return (
                  <Link
                    key={p}
                    href={`/dashboard?page=${p}`}
                    className={`rounded-lg px-3 py-1 text-xs font-medium ${
                      p === page
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "transition-colors hover:bg-card"
                    }`}
                  >
                    {p}
                  </Link>
                )
              })}

              {totalPages > 5 && (
                <>
                  <span className="px-1 text-on-surface-variant">…</span>
                  <Link
                    href={`/dashboard?page=${totalPages}`}
                    className="rounded-lg px-3 py-1 text-xs font-medium transition-colors hover:bg-card"
                  >
                    {totalPages}
                  </Link>
                </>
              )}

              <Link
                href={`/dashboard?page=${page + 1}`}
                aria-label="Next page"
                aria-disabled={page >= totalPages}
                className={`rounded-lg border border-outline-variant p-2 transition-colors hover:bg-card ${
                  page >= totalPages ? "pointer-events-none opacity-40" : ""
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
