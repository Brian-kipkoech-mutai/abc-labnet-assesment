"use client"

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { SalesTrendPoint } from "@/lib/types"

const chartConfig = {
  active:   { label: "Revenue", color: "var(--color-primary)" },
  inactive: { label: "Revenue", color: "var(--color-chart-1)" },
} satisfies ChartConfig

interface SalesChartProps {
  data: SalesTrendPoint[]
}

export function SalesChart({ data }: SalesChartProps) {
  const maxTotal = Math.max(...data.map((d) => d.total), 0)

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart
        data={data}
        barCategoryGap="8%"
        margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          vertical={false}
          stroke="var(--color-outline-variant)"
          strokeOpacity={0.4}
        />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "var(--color-on-surface-variant)" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: "var(--color-on-surface-variant)" }}
          tickFormatter={(v) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`)}
          width={40}
        />
        <ChartTooltip
          cursor={{ fill: "var(--color-surface-container)", opacity: 0.4 }}
          content={
            <ChartTooltipContent
              formatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(Number(value))
              }
            />
          }
        />
        <Bar dataKey="total" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={
                entry.total === maxTotal
                  ? "var(--color-primary)"
                  : "var(--color-chart-1)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
