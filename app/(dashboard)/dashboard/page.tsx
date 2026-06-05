import Link from "next/link"
import {
  CreditCard,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  Sparkles,
  Download,
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
import { InventoryRowActions } from "@/components/dashboard/inventory-row-actions"
import { SalesChart } from "@/components/dashboard/sales-chart"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


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
        <Card>
          <CardHeader>
            <div className="rounded-lg bg-surface-container p-2 w-fit">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <CardAction>
              <div className="flex items-center gap-1 text-primary">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-medium">Today</span>
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
              Total Sales Today
            </p>
            <p className="text-2xl font-semibold text-deep-forest">
              {formatCurrency(stats.totalSalesToday)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="rounded-lg bg-beet-red/10 p-2 w-fit">
              <AlertTriangle className="h-5 w-5 text-beet-red" />
            </div>
            <CardAction>
              <span className="rounded-full bg-beet-red/10 px-3 py-1 text-xs font-medium text-beet-red">
                Critical
              </span>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
              Stock Alerts
            </p>
            <p className="text-2xl font-semibold text-deep-forest">
              {stats.stockAlerts} Items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="rounded-lg bg-secondary-container/30 p-2 w-fit">
              <ShoppingCart className="h-5 w-5 text-secondary" />
            </div>
            <CardAction>
              <span className="rounded-full bg-harvest-orange/10 px-3 py-1 text-xs font-medium text-harvest-orange">
                Processing
              </span>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
              Active Orders
            </p>
            <p className="text-2xl font-semibold text-deep-forest">
              {stats.activeOrders}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="rounded-lg bg-surface-container-high p-2 w-fit">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <CardAction>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                This Week
              </span>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
              New Arrivals
            </p>
            <p className="text-2xl font-semibold text-deep-forest">
              {stats.newArrivals} SKUs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales trends + recent transactions */}
      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-deep-forest">Sales Trends</CardTitle>
            <CardDescription>Revenue analytics for the current week</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart data={salesTrends} />
          </CardContent>
        </Card>

        {/* Recent transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-deep-forest">Recent Transactions</CardTitle>
            <CardAction>
              <button type="button" className="text-xs font-medium text-primary hover:underline">
                View All
              </button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-sm text-on-surface-variant">No transactions yet.</p>
            ) : (
              <div className="space-y-5">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-4">
                    {tx.item_image ? (
                      <img
                        src={tx.item_image}
                        alt={tx.item_name}
                        className="h-10 w-10 shrink-0 rounded-full border border-outline-variant object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container">
                        <Leaf className="h-5 w-5 text-primary" />
                      </div>
                    )}
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
          </CardContent>
        </Card>
      </div>

      {/* Inventory table */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-outline-variant bg-surface-gray/50">
          <div>
            <CardTitle className="text-deep-forest">Detailed Inventory Status</CardTitle>
            <CardDescription>
              {total} items · page {page} of {totalPages || 1}
            </CardDescription>
          </div>
          <CardAction className="flex gap-3">
            <a
              href="/api/inventory/export"
              className="flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </a>
            <AddItemDialog />
          </CardAction>
        </CardHeader>

        <CardContent className="p-0">
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
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="h-10 w-10 rounded-full border border-outline-variant object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high">
                              <Leaf className="h-5 w-5 text-primary" />
                            </div>
                          )}
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
                        <InventoryRowActions item={item} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        </CardContent>

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
      </Card>
    </div>
  )
}
