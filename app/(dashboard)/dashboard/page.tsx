import {
  CreditCard,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  Sparkles,
  Download,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Milk,
  Croissant,
} from "lucide-react"

const transactions = [
  {
    name: "Organic Red Peppers",
    store: "Store #402",
    time: "10:45 AM",
    amount: "+$142.50",
    status: "COMPLETED",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJdxlv0pI0gwyygcSOmgjZqlvq2V4a4GE9Bnx7kffblLF3yGLAlFZ8jxdvlCMYl92ixmo9K3tzSQe5Jcm9OPbYK0EW0JAQI32FD9ldYSW-JC11H1z0xGHnY1x5SHk2_v5wDzUlYx5eotnUe6Ph3-dVdcmiXJAOyU2Fr55N3anMvWZMS3DGgqDoBOrfRDLcuzw3pmtyVsUHI99EjJAWNv9XbPcdXzTlBcaZZlORE3sBl2nXPuqF3-gdZQ4mGkFpWREoUw_acXNBMpg",
  },
  {
    name: "Honey Crisp Apples",
    store: "Store #115",
    time: "09:30 AM",
    amount: "+$89.20",
    status: "PENDING",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxSVg5Jbt_5QSD7syDBLlJExGv1eOvz9AfZaNNM1Yx6jSQwI9k_uue8YMOR1ZQVXSmxJvI7STqwIv2Kp4uNcu5WhVcOotcpf8PCk3wR-xyUCogi6ziQTrZ0AQW6g80ZE8_0bcYDmhq3NIPa1oNlAU2yG0a5r60KnR0w-yPelxPrLmUnR1LyfYb9TWynSQqX9m-YsfABQkmuW0W2xGo45DQ9tfxBNPQxZOA2tPDMTwruTz6LW6bnT2M5tgawC3XVk4KaUR5i_s-0UU",
  },
  {
    name: "Fresh Broccoli Bulk",
    store: "Store #209",
    time: "08:15 AM",
    amount: "+$310.00",
    status: "COMPLETED",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtjnIXyxQwnN6MMNN4MZhORF3YxL4HA9Sc-Sa5sBqNqFpNf9ngA4zbezJvXExuWvxElaZAQlAj_4o_449B6DZ9MhzCtNTc3zdbWwUrb8l52lI0E5aZrAggcFuqUDMsIyZQjjjicRq8aWB7IrkcFKFiCBxbX8c07AkSAETKLWwP2ArZh9SN3XTWbr2_feJkWkIMSEo5wEubomazzgfAXW7IpoR_hnIVX_W7TS7YBLphaw3_YIJIqUXyeictDCzgwUVr3mppQm-1LOI",
  },
  {
    name: "Organic Carrots",
    store: "Store #402",
    time: "07:50 AM",
    amount: "+$54.00",
    status: "FAILED",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuApwHWy2Xy5tVvTjsNjAKgfhORtRvB_ShQL17A9ckwNWrAGDF_Awtyp-w-E5GwqS6IlsGs9l7a9zFfCjxAGD868QaIoyzKRXFKRfRpwS06jJTP9vXRnXmApbGHisbSYpmC1UY_lVpV-vcQTkLuhcGOVJatmXJzWdZVubkblZiLP3ELj7-k7f6qt1435CLB4GkJ8M7DTT7-5Cx4axHQm5tRYZ8uwRE63W9-EEGFB06Q1v9DakZr92cykvc853lllPFt11fznnbxTHWY",
  },
]

const statusBadge: Record<string, string> = {
  COMPLETED: "bg-primary/10 text-primary",
  PENDING: "bg-harvest-orange/10 text-harvest-orange",
  FAILED: "bg-beet-red/10 text-beet-red",
}

const inventoryItems = [
  {
    name: "Baby Spinach 250g",
    sku: "VG-8820",
    category: "Vegetables",
    stock: "142 Units",
    status: "IN STOCK",
    icon: Leaf,
  },
  {
    name: "Whole Milk 1L",
    sku: "DY-4491",
    category: "Dairy",
    stock: "18 Units",
    status: "LOW STOCK",
    icon: Milk,
  },
  {
    name: "Artisan Sourdough",
    sku: "BK-1022",
    category: "Bakery",
    stock: "0 Units",
    status: "OUT OF STOCK",
    icon: Croissant,
  },
]

const inventoryStatusBadge: Record<string, string> = {
  "IN STOCK": "bg-primary/10 text-primary",
  "LOW STOCK": "bg-harvest-orange/10 text-harvest-orange",
  "OUT OF STOCK": "bg-beet-red/10 text-beet-red",
}

const chartBars = [
  { day: "Mon", heightClass: "h-[40%]", opacity: "bg-primary/20 hover:bg-primary/40" },
  { day: "Tue", heightClass: "h-[65%]", opacity: "bg-primary/20 hover:bg-primary/40" },
  { day: "Wed", heightClass: "h-[45%]", opacity: "bg-primary/20 hover:bg-primary/40" },
  { day: "Thu", heightClass: "h-[85%]", opacity: "bg-primary/60 hover:bg-primary/80" },
  { day: "Fri", heightClass: "h-[60%]", opacity: "bg-primary/20 hover:bg-primary/40" },
  { day: "Sat", heightClass: "h-[75%]", opacity: "bg-primary/20 hover:bg-primary/40" },
  { day: "Sun", heightClass: "h-[95%]", opacity: "bg-primary/90 hover:bg-primary" },
]

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-360 p-4 md:p-8">
      {/* Page header */}
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
        {/* Total Sales */}
        <div className="rounded-xl border border-outline-variant bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-surface-container p-2">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-1 text-primary">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">12.5%</span>
            </div>
          </div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
            Total Sales Today
          </p>
          <h3 className="text-2xl font-semibold text-deep-forest">$12,482.00</h3>
        </div>

        {/* Stock Alerts */}
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
          <h3 className="text-2xl font-semibold text-deep-forest">14 Items</h3>
        </div>

        {/* Active Orders */}
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
          <h3 className="text-2xl font-semibold text-deep-forest">42</h3>
        </div>

        {/* New Arrivals */}
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
          <h3 className="text-2xl font-semibold text-deep-forest">28 SKUs</h3>
        </div>
      </div>

      {/* Sales trends + recent transactions */}
      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Sales trends chart */}
        <div className="rounded-xl border border-outline-variant bg-card p-8 shadow-sm xl:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-deep-forest">Sales Trends</h3>
              <p className="text-sm text-on-surface-variant">
                Revenue analytics for the current week
              </p>
            </div>
            <select aria-label="Select time range" className="appearance-none rounded-lg bg-surface-gray px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="relative flex h-64 w-full items-end gap-2 px-2">
            <div className="pointer-events-none absolute inset-0 border-b border-l border-outline-variant/30" />
            {chartBars.map(({ day, heightClass, opacity }) => (
              <div
                key={day}
                className={`relative flex-1 cursor-pointer rounded-t-sm transition-colors ${heightClass} ${opacity}`}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between px-2 text-xs font-medium text-on-surface-variant">
            {chartBars.map(({ day }) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="rounded-xl border border-outline-variant bg-card p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-deep-forest">Recent Transactions</h3>
            <button type="button" className="text-xs font-medium text-primary transition-transform hover:underline active:scale-95">
              View All
            </button>
          </div>

          <div className="space-y-6">
            {transactions.map((tx) => (
              <div key={tx.name} className="group flex cursor-pointer items-center gap-4">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-outline-variant shadow-sm">
                  <img
                    src={tx.img}
                    alt={tx.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-deep-forest">{tx.name}</p>
                  <p className="text-xs text-on-surface-variant">
                    {tx.store} • {tx.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-deep-forest">{tx.amount}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusBadge[tx.status]}`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory table */}
      <div className="overflow-hidden rounded-xl border border-outline-variant bg-card shadow-sm">
        {/* Table header */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-outline-variant bg-surface-gray/50 px-8 py-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold text-deep-forest">Detailed Inventory Status</h3>
            <p className="text-sm text-on-surface-variant">
              Overview of stock levels and categories
            </p>
          </div>
          <div className="flex gap-3">
            <button type="button" className="flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/5 active:scale-95">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button type="button" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 active:scale-95">
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-gray">
                {["Item Name", "SKU", "Category", "Stock Level", "Status", "Action"].map(
                  (col, i) => (
                    <th
                      key={col}
                      className={`px-8 py-4 text-xs font-medium uppercase tracking-wider text-on-surface-variant ${
                        i === 3 ? "text-right" : i === 4 ? "text-center" : i === 5 ? "text-right" : ""
                      }`}
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inventoryItems.map((item) => (
                <tr
                  key={item.sku}
                  className="group cursor-pointer transition-colors hover:bg-surface-gray"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-high">
                        <item.icon className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                      </div>
                      <span className="text-sm font-semibold text-deep-forest">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 font-mono text-sm text-on-surface-variant">
                    {item.sku}
                  </td>
                  <td className="px-8 py-4 text-sm text-on-surface-variant">{item.category}</td>
                  <td className="px-8 py-4 text-right text-sm text-deep-forest">{item.stock}</td>
                  <td className="px-8 py-4 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${inventoryStatusBadge[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button type="button" aria-label={`More options for ${item.name}`} className="text-on-surface-variant transition-colors hover:text-primary">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant bg-surface-gray px-8 py-4 sm:flex-row">
          <span className="text-xs text-on-surface-variant">
            Showing 1 to 3 of 842 entries
          </span>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Previous page" className="rounded-lg border border-outline-variant p-2 transition-colors hover:bg-card disabled:opacity-50 active:scale-95">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                type="button"
                className={`rounded-lg px-3 py-1 text-xs font-medium active:scale-95 ${
                  p === 1
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "transition-colors hover:bg-card"
                }`}
              >
                {p}
              </button>
            ))}
            <span className="px-2 text-on-surface-variant">…</span>
            <button type="button" className="rounded-lg px-3 py-1 text-xs font-medium transition-colors hover:bg-card active:scale-95">
              28
            </button>
            <button type="button" aria-label="Next page" className="rounded-lg border border-outline-variant p-2 transition-colors hover:bg-card active:scale-95">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
