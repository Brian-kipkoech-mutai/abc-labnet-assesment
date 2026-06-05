import { TrendingUp, TrendingDown, Star } from "lucide-react"
import {
  getReportTransactions,
  getReportSummary,
  getDistinctCategories,
  getDistinctStores,
  REPORT_PAGE_SIZE,
} from "@/lib/queries/reports"
import { ReportsActions } from "@/components/reports/reports-actions"
import { ReportsFilters } from "@/components/reports/reports-filters"
import { ReportsTable } from "@/components/reports/reports-table"
import { cn } from "@/lib/utils"

interface PageProps {
  searchParams: Promise<{
    from?: string
    to?: string
    category?: string
    store?: string
    page?: string
  }>
}

export default async function ReportsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page ?? 1))

  // Build CSV download URL with active filters so export matches what's on screen
  const csvParams = new URLSearchParams()
  if (params.from) csvParams.set("from", params.from)
  if (params.to) csvParams.set("to", params.to)
  if (params.category) csvParams.set("category", params.category)
  if (params.store) csvParams.set("store", params.store)
  const csvHref = `/api/reports/export${csvParams.size ? `?${csvParams}` : ""}`

  const [{ rows, total }, summary, categories, stores] = await Promise.all([
    getReportTransactions({
      from: params.from,
      to: params.to,
      category: params.category,
      staff: params.store,
      page,
    }),
    getReportSummary({
      from: params.from,
      to: params.to,
      category: params.category,
      staff: params.store,
    }),
    getDistinctCategories(),
    getDistinctStores(),
  ])

  return (
    <div className="mx-auto max-w-360 p-4 md:p-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-deep-forest md:text-3xl">
            Historical Sales Report
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Analyze sales performance and track historical transactions across all categories.
          </p>
        </div>
        <ReportsActions csvHref={csvHref} />
      </div>

      {/* Filters — all options fetched from DB */}
      <ReportsFilters
        categories={categories}
        stores={stores}
        defaultFrom={params.from}
        defaultTo={params.to}
        defaultCategory={params.category}
        defaultStore={params.store}
      />

      {/* Data Table */}
      <ReportsTable
        rows={rows}
        total={total}
        pageSize={REPORT_PAGE_SIZE}
        currentPage={page}
        from={params.from}
        to={params.to}
        category={params.category}
        store={params.store}
      />

      {/* Summary Cards — all calculated from filtered DB data */}
      <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Period Revenue"
          value={`$${summary.totalRevenue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          detail={{ icon: "up", text: "Completed transactions" }}
        />
        <MetricCard
          label="Total Transactions"
          value={summary.totalUnits.toLocaleString()}
          detail={{ icon: "up", text: "Completed orders" }}
        />
        <MetricCard
          label="Avg. Transaction"
          value={`$${summary.avgTransaction.toFixed(2)}`}
          detail={{ icon: "down", text: "Per completed order" }}
        />
        <MetricCard
          label="Top Performer"
          value={summary.topCategory}
          detail={{ icon: "star", text: "Leading category" }}
        />
      </section>
    </div>
  )
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: { icon: "up" | "down" | "star"; text: string }
}) {
  return (
    <div className="rounded-xl border border-outline-variant bg-card p-6 shadow-sm">
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
        {label}
      </p>
      <h3 className="text-2xl font-semibold text-deep-forest">{value}</h3>
      <div
        className={cn(
          "mt-2 flex items-center gap-1 text-xs font-medium",
          detail.icon === "down" ? "text-beet-red" : "text-primary",
        )}
      >
        {detail.icon === "up" && <TrendingUp className="h-3.5 w-3.5" />}
        {detail.icon === "down" && <TrendingDown className="h-3.5 w-3.5" />}
        {detail.icon === "star" && <Star className="h-3.5 w-3.5" />}
        <span>{detail.text}</span>
      </div>
    </div>
  )
}
