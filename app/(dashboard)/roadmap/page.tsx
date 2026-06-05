import {
  Route,
  MousePointerClick,
  AlertTriangle,
  Navigation,
  KeyRound,
  LayoutDashboard,
  Package,
  BarChart2,
  GitBranch,
  Wrench,
  Bell,
  Settings,
  Info,
  CornerDownRight,
  PackagePlus,
  ClipboardList,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { RoadmapActions } from "@/components/roadmap/roadmap-actions"
import { SyncToast } from "@/components/roadmap/sync-toast"
import { cn } from "@/lib/utils"

const LEGEND = [
  {
    icon: <Route className="h-5 w-5 text-primary-foreground" />,
    iconClass: "rounded bg-primary",
    label: "Primary Path",
    desc: "Core UX Journey",
  },
  {
    icon: <MousePointerClick className="h-5 w-5 text-primary" />,
    iconClass: "rounded border-2 border-dashed border-primary",
    label: "Secondary Action",
    desc: "User Interactions",
  },
  {
    icon: <AlertTriangle className="h-5 w-5 text-white" />,
    iconClass: "rounded bg-harvest-orange",
    label: "Warning",
    desc: "Critical States",
  },
  {
    icon: <Navigation className="h-5 w-5 text-primary" />,
    iconClass: "rounded-full bg-surface-container",
    label: "Anchor",
    desc: "Nav Reference",
  },
]

const JOURNEY_STEPS = [
  {
    icon: <KeyRound className="h-10 w-10 text-primary" />,
    bg: "bg-surface-container-high",
    title: "Authentication",
    desc: "Secure biometric or credential login",
    badge: { label: "Success Path", className: "bg-primary/10 text-primary" },
  },
  {
    icon: <LayoutDashboard className="h-10 w-10 text-primary" />,
    bg: "bg-surface-container",
    title: "Landing Overview",
    desc: "Real-time inventory overview & alerts",
    badge: null,
  },
  {
    icon: <Package className="h-10 w-10 text-primary" />,
    bg: "bg-secondary-container",
    title: "Task Execution",
    desc: "Stock entry, sales logging, & quality checks",
    badge: { label: "Action Item", className: "bg-surface-container text-on-secondary-container" },
  },
  {
    icon: <BarChart2 className="h-10 w-10 text-primary" />,
    bg: "bg-surface-container-highest",
    title: "Data Analysis",
    desc: "Yield forecasting & profitability reports",
    badge: { label: "Final Goal", className: "bg-primary text-primary-foreground" },
  },
]

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-360 p-4 md:p-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-deep-forest md:text-3xl">
            User Flow &amp; Navigation Map
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">
            This visual architecture defines the primary interaction models and navigational hierarchy
            for the ABC LAB NET store management ecosystem.
          </p>
        </div>
        <RoadmapActions />
      </div>

      {/* Legend */}
      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        {LEGEND.map((item) => (
          <Card key={item.label} className="shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center", item.iconClass)}>
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-primary">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">

        {/* Core User Journey — full width */}
        <section className="relative overflow-hidden rounded-xl border border-outline-variant bg-card p-8 shadow-sm xl:col-span-12">
          <h3 className="mb-12 flex items-center gap-2 border-b border-outline-variant pb-4 text-lg font-semibold text-deep-forest">
            <Route className="h-5 w-5" /> Core User Journey
          </h3>

          <div className="relative flex flex-col items-start justify-between gap-12 md:flex-row md:gap-4">
            {/* Animated dashed connector — desktop only */}
            <svg
              aria-hidden
              className="pointer-events-none absolute left-0 top-12 z-0 hidden h-px w-full md:block"
            >
              <line
                className="flow-line"
                stroke="var(--color-primary)"
                strokeDasharray="8"
                strokeWidth="2"
                x1="10%"
                x2="90%"
                y1="0"
                y2="0"
              />
            </svg>

            {JOURNEY_STEPS.map((step) => (
              <div
                key={step.title}
                className="group relative z-10 flex flex-1 cursor-default flex-col items-center text-center transition-transform hover:scale-105 active:scale-95"
              >
                <div className={cn(
                  "mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-outline-variant shadow-sm transition-colors group-hover:border-primary",
                  step.bg,
                )}>
                  {step.icon}
                </div>
                <h4 className="mb-1 text-sm font-semibold text-primary">{step.title}</h4>
                <p className="max-w-37.5 text-xs text-on-surface-variant">{step.desc}</p>
                {step.badge && (
                  <span className={cn(
                    "mt-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase",
                    step.badge.className,
                  )}>
                    {step.badge.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Navigation Hierarchy — 7 cols */}
        <section className="rounded-xl border border-outline-variant bg-card p-8 shadow-sm xl:col-span-7">
          <h3 className="mb-8 flex items-center gap-2 border-b border-outline-variant pb-4 text-lg font-semibold text-deep-forest">
            <GitBranch className="h-5 w-5" /> Navigation Hierarchy
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-6 rounded-lg border-l-4 border-primary bg-surface-gray p-4 transition-colors hover:bg-surface-container">
              <LayoutDashboard className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-deep-forest">Dashboard</p>
                <p className="text-xs text-on-surface-variant">Global performance metrics and urgent alerts.</p>
              </div>
            </div>

            {/* Inventory with sub-item connector */}
            <div className="relative pl-10">
              <div className="absolute bottom-0 left-4 top-0 w-px bg-outline-variant" />
              <div className="relative flex items-center gap-6 rounded-lg border-l-4 border-primary bg-surface-gray p-4 transition-colors hover:bg-surface-container">
                <div className="absolute -left-6 top-1/2 h-px w-6 bg-outline-variant" />
                <Package className="h-6 w-6 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-deep-forest">Inventory Management</p>
                  <p className="text-xs text-on-surface-variant">Search, filter, and track store assets.</p>
                </div>
              </div>
              <div className="ml-8 mt-4 flex items-center gap-3 rounded-lg border border-dashed border-outline-variant bg-card p-3">
                <CornerDownRight className="h-4 w-4 shrink-0 text-on-surface-variant" />
                <PackagePlus className="h-4 w-4 shrink-0 text-primary" />
                <p className="text-xs font-semibold text-primary">Stock Entry (Task Component)</p>
              </div>
            </div>

            <div className="flex items-center gap-6 rounded-lg border-l-4 border-primary bg-surface-gray p-4 transition-colors hover:bg-surface-container">
              <ClipboardList className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-deep-forest">Reports &amp; Insights</p>
                <p className="text-xs text-on-surface-variant">Historical data and predictive analytics.</p>
              </div>
            </div>
          </div>
        </section>

        {/* TopAppBar Utilities — 5 cols, dark card */}
        <section className="relative overflow-hidden rounded-xl border border-outline-variant bg-deep-forest p-8 shadow-sm xl:col-span-5">
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary-container opacity-20 blur-3xl" />

          <h3 className="relative mb-8 flex items-center gap-2 border-b border-white/10 pb-4 text-lg font-semibold text-white">
            <Wrench className="h-5 w-5" /> TopAppBar Utilities
          </h3>

          <div className="relative space-y-4">
            {[
              { icon: <Bell className="h-5 w-5 text-white" />, title: "System Notifications", desc: "Real-time alerts & updates." },
              { icon: <Settings className="h-5 w-5 text-white" />, title: "Global Settings", desc: "System-wide configurations." },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-white/60">{item.desc}</p>
                </div>
              </div>
            ))}

            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10">
                <span className="text-xs font-bold text-white">U</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">User Profile</p>
                <p className="text-xs text-white/60">Account &amp; Security.</p>
              </div>
            </div>
          </div>

          <div className="relative mt-12 rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-white/80">
              <Info className="h-4 w-4" /> Design Philosophy
            </div>
            <p className="text-xs italic leading-relaxed text-white/70">
              &quot;The utility bar remains constant across all views to ensure high-priority system
              status awareness and accessibility.&quot;
            </p>
          </div>
        </section>

        {/* Branding & Visuals — full width, 2-col */}
        <section className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 xl:col-span-12">
          <div className="flex flex-col items-center gap-8 rounded-xl border border-outline-variant bg-card p-8 shadow-sm md:flex-row">
            <div className="flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-xl border border-outline-variant bg-surface-gray">
              <span className="text-2xl font-bold leading-tight text-primary">ABC</span>
              <span className="text-xs font-bold tracking-widest text-primary">LAB NET</span>
            </div>
            <div>
              <h4 className="mb-2 text-xl font-semibold text-deep-forest">Verdant Operations</h4>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                The visual language of ABC LAB NET combines deep forest organic tones with the structural
                rigidity of laboratory informatics. This balance ensures trust and high performance in
                agricultural logistics.
              </p>
            </div>
          </div>

          <div className="relative min-h-62.5 overflow-hidden rounded-xl border border-outline-variant shadow-sm">
            <div className="absolute inset-0 bg-linear-to-br from-primary via-deep-forest to-primary-container" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <h4 className="mb-2 text-lg font-semibold text-white">Technological Transparency</h4>
              <p className="max-w-sm text-sm text-white/70">
                Every flow is designed for minimal cognitive load while maximizing data visibility.
              </p>
            </div>
          </div>
        </section>
      </div>

      <SyncToast />
    </div>
  )
}
