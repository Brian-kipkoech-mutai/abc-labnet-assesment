# ABC LAB NET — Store Management System

A fullstack store management web application built as a technical assessment. It covers inventory tracking, stock arrivals, historical sales reporting, and system navigation documentation.

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router, RSC) |
| Language | TypeScript 5 |
| UI | shadcn/ui (radix-nova style) + Lucide icons |
| Styling | Tailwind CSS v4 + CSS design tokens |
| Auth & Database | Supabase (Auth, PostgreSQL, Storage) |
| Charts | Recharts |
| Package Manager | pnpm |

## Pages

| Route | Description |
|---|---|
| `/login` | Email/password authentication via Supabase Auth |
| `/dashboard` | Stats overview, sales trend chart, paginated inventory table, CSV export |
| `/inventory` | New stock arrival form — log deliveries against existing products |
| `/reports` | Historical sales report with date range, category & store filters, CSV export, print |
| `/roadmap` | User flow & navigation architecture map |

## Database Schema

Three tables in Supabase (PostgreSQL), all with RLS enabled:

- **`inventory_items`** — product catalog with name, SKU, category, stock quantity, unit, image
- **`stock_arrivals`** — delivery log; verified arrivals increment the matching product's stock via a DB function
- **`transactions`** — sales records with amount and status (COMPLETED / PENDING / FAILED)

Supabase Storage bucket `product-images` holds product photos.

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd abc-labnet-assesment
pnpm install
```

### 2. Set up environment variables

Create a `.env.local` file at the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set up the database

In your Supabase project, open the **SQL Editor** and run the full contents of [`supabase/schema.sql`](supabase/schema.sql).

This creates all tables, RLS policies, the `increment_stock` function, and seeds sample data.

### 4. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to `/login`.

## Project Structure

```
app/
  (auth)/login/          # Login page
  (dashboard)/
    dashboard/           # Main dashboard
    inventory/           # Stock arrival form
    reports/             # Sales report with filters
    roadmap/             # User flow map
  api/
    inventory/export/    # CSV export for inventory items
    reports/export/      # CSV export for filtered transactions
components/
  ui/                    # shadcn/ui primitives
  dashboard/             # Inventory table, add/edit dialogs, chart
  data-entry/            # Stock arrival form
  layout/                # Sidebar, header, mobile nav
  reports/               # Report filters, table, actions
  roadmap/               # Roadmap actions, sync toast
lib/
  supabase/              # Browser & server Supabase clients
  queries/               # Read queries (dashboard, data-entry, reports)
  actions/               # Server actions for mutations (inventory, stock arrivals)
  types.ts               # Shared TypeScript interfaces
supabase/
  schema.sql             # Full DB schema + seed data
```

## Key Concepts

**Inventory items vs Stock arrivals**
- Inventory items are the product catalog — each product exists once with a name, SKU, category, and image.
- Stock arrivals are delivery records — each one logs a quantity of an existing product arriving from a supplier. When marked **Verified**, the product's stock quantity is automatically incremented via the `increment_stock` database function.

**Authentication**
- Supabase Auth with email/password. All dashboard routes are protected server-side via the dashboard layout.

**Data flow**
- Server Components fetch data by default. Mutations use Next.js Server Actions followed by `revalidatePath()` to refresh the UI.

## Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Production build
pnpm typecheck  # Run TypeScript compiler check
pnpm lint       # Run ESLint
pnpm format     # Format with Prettier
```
