import Link from "next/link"
import { ChevronLeft, ChevronRight, Package } from "lucide-react"
import type { Transaction } from "@/lib/types"
import { cn } from "@/lib/utils"

const STATUS_CONFIG: Record<
  Transaction["status"],
  { label: string; className: string }
> = {
  COMPLETED: { label: "Completed", className: "bg-primary/10 text-primary" },
  PENDING: { label: "Pending", className: "bg-harvest-orange/10 text-harvest-orange" },
  FAILED: { label: "Failed", className: "bg-beet-red/10 text-beet-red" },
}

function buildUrl(
  page: number,
  from?: string,
  to?: string,
  category?: string,
  store?: string,
) {
  const p = new URLSearchParams()
  if (from) p.set("from", from)
  if (to) p.set("to", to)
  if (category && category !== "all") p.set("category", category)
  if (store && store !== "all") p.set("store", store)
  if (page > 1) p.set("page", String(page))
  const qs = p.toString()
  return `/reports${qs ? `?${qs}` : ""}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

interface Props {
  rows: Transaction[]
  total: number
  pageSize: number
  currentPage: number
  from?: string
  to?: string
  category?: string
  store?: string
}

export function ReportsTable({
  rows,
  total,
  pageSize,
  currentPage,
  from,
  to,
  category,
  store,
}: Props) {
  const totalPages = Math.ceil(total / pageSize)
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages
  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, total)

  // Build visible page numbers with ellipsis
  const pageNumbers: (number | "...")[] = []
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)
  } else {
    pageNumbers.push(1)
    if (currentPage > 3) pageNumbers.push("...")
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pageNumbers.push(i)
    }
    if (currentPage < totalPages - 2) pageNumbers.push("...")
    pageNumbers.push(totalPages)
  }

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-gray">
              {["Date", "Item", "Amount", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-on-surface-variant"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-sm text-on-surface-variant"
                >
                  No transactions found for the selected filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const status = STATUS_CONFIG[row.status]
                return (
                  <tr key={row.id} className="transition-colors hover:bg-surface-gray">
                    <td className="px-6 py-4 font-mono text-sm text-on-surface-variant">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-high">
                          {row.item_image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={row.item_image}
                              alt={row.item_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-on-surface-variant" />
                          )}
                        </div>
                        <span className="text-sm font-semibold text-deep-forest">
                          {row.item_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-deep-forest">
                      ${Number(row.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium",
                          status.className,
                        )}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant bg-surface-gray px-6 py-4 sm:flex-row">
        <span className="text-xs text-on-surface-variant">
          {total === 0
            ? "No entries"
            : `Showing ${start} to ${end} of ${total.toLocaleString()} entries`}
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Link
              href={buildUrl(currentPage - 1, from, to, category, store)}
              aria-disabled={!hasPrev}
              className={cn(
                "rounded-lg border border-outline-variant p-2 transition-colors",
                hasPrev ? "hover:bg-card" : "pointer-events-none opacity-40",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>

            {pageNumbers.map((p, i) =>
              p === "..." ? (
                <span key={`ell-${i}`} className="px-2 text-xs text-on-surface-variant">
                  …
                </span>
              ) : (
                <Link
                  key={p}
                  href={buildUrl(p, from, to, category, store)}
                  className={cn(
                    "rounded-lg px-3 py-1 text-xs font-medium transition-colors",
                    p === currentPage
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-card",
                  )}
                >
                  {p}
                </Link>
              ),
            )}

            <Link
              href={buildUrl(currentPage + 1, from, to, category, store)}
              aria-disabled={!hasNext}
              className={cn(
                "rounded-lg border border-outline-variant p-2 transition-colors",
                hasNext ? "hover:bg-card" : "pointer-events-none opacity-40",
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
