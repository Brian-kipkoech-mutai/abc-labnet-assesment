import { Info, ChevronRight } from "lucide-react"
import { getProductsForSelect, getRecentArrivals } from "@/lib/queries/data-entry"
import { StockArrivalForm } from "@/components/data-entry/stock-arrival-form"

export default async function DataEntryPage() {
  const [products, recentArrivals] = await Promise.all([
    getProductsForSelect(),
    getRecentArrivals(3).catch(() => []),
  ])

  return (
    <div className="mx-auto max-w-360 p-4 md:p-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <nav className="mb-2 flex items-center gap-1.5 text-on-surface-variant">
            <span className="text-xs font-medium">Inventory</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-xs font-bold text-primary">New Arrival</span>
          </nav>
          <h1 className="text-2xl font-semibold text-deep-forest md:text-3xl">
            New Stock Arrival
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Log fresh produce shipments into the central warehouse system.
          </p>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-3 rounded-xl border border-outline-variant bg-card p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-primary">Status: Receiving</p>
            <p className="text-xs text-on-surface-variant">Warehouse Zone A-4</p>
          </div>
        </div>
      </div>

      <StockArrivalForm products={products} recentArrivals={recentArrivals} />
    </div>
  )
}
