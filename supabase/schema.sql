-- ============================================================
-- ABC LAB NET – run this in Supabase SQL Editor
-- ============================================================

create table if not exists public.inventory_items (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  sku            text not null,
  category       text not null,
  stock_quantity integer not null default 0,
  unit           text not null default 'Units',
  image_url      text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint inventory_items_sku_key unique (sku)
);

-- Add image_url if table already existed without it
alter table public.inventory_items
  add column if not exists image_url text;

create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  item_name   text not null,
  item_image  text,
  store_id    text not null,
  amount      numeric(10,2) not null,
  status      text not null,
  created_at  timestamptz not null default now(),
  constraint transactions_status_check check (status in ('COMPLETED','PENDING','FAILED'))
);

-- RLS
alter table public.inventory_items enable row level security;
alter table public.transactions    enable row level security;

do $$ begin
  create policy "auth_read_inventory"   on public.inventory_items for select    to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "auth_insert_inventory" on public.inventory_items for insert    to authenticated with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "auth_update_inventory" on public.inventory_items for update    to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "auth_delete_inventory" on public.inventory_items for delete    to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "auth_read_transactions"   on public.transactions for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "auth_insert_transactions" on public.transactions for insert to authenticated with check (true);
exception when duplicate_object then null; end $$;

-- ============================================================
-- Storage policies for product-images bucket
-- ============================================================
do $$ begin
  create policy "public_read_product_images" on storage.objects
    for select using (bucket_id = 'product-images');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "auth_upload_product_images" on storage.objects
    for insert to authenticated
    with check (bucket_id = 'product-images');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "auth_delete_product_images" on storage.objects
    for delete to authenticated
    using (bucket_id = 'product-images');
exception when duplicate_object then null; end $$;

-- ============================================================
-- Seed data
-- ============================================================

insert into public.inventory_items (name, sku, category, stock_quantity, unit, created_at) values
  ('Baby Spinach 250g',    'VG-8820', 'Vegetables', 142, 'Units', now() - interval '2 days'),
  ('Whole Milk 1L',        'DY-4491', 'Dairy',        18, 'Units', now() - interval '5 days'),
  ('Artisan Sourdough',    'BK-1022', 'Bakery',         0, 'Units', now() - interval '3 days'),
  ('Organic Red Peppers',  'VG-3301', 'Vegetables',   75, 'Units', now() - interval '1 day'),
  ('Honey Crisp Apples',   'FR-7721', 'Fruits',        12, 'Units', now() - interval '6 days'),
  ('Fresh Broccoli Bulk',  'VG-4412', 'Vegetables',  200, 'Units', now() - interval '4 days'),
  ('Organic Carrots',      'VG-5503', 'Vegetables',    0, 'Units', now()),
  ('Cheddar Cheese 200g',  'DY-8812', 'Dairy',         45, 'Units', now() - interval '2 days'),
  ('Whole Wheat Bread',    'BK-3311', 'Bakery',        30, 'Units', now()),
  ('Orange Juice 1L',      'BV-2201', 'Beverages',     8, 'Units', now() - interval '1 day'),
  ('Roma Tomatoes',        'VG-6614', 'Vegetables',   88, 'Units', now() - interval '1 day'),
  ('Greek Yogurt 500g',    'DY-3322', 'Dairy',          5, 'Units', now()),
  ('Baguette',             'BK-4400', 'Bakery',        22, 'Units', now() - interval '2 days')
on conflict (sku) do nothing;

insert into public.transactions (item_name, store_id, amount, status, created_at) values
  ('Organic Red Peppers', 'Store #402', 142.50, 'COMPLETED', now() - interval '2 hours'),
  ('Honey Crisp Apples',  'Store #115',  89.20, 'PENDING',   now() - interval '3 hours'),
  ('Fresh Broccoli Bulk', 'Store #209', 310.00, 'COMPLETED', now() - interval '4 hours'),
  ('Organic Carrots',     'Store #402',  54.00, 'FAILED',    now() - interval '5 hours'),
  ('Baby Spinach 250g',   'Store #101', 220.00, 'COMPLETED', now() - interval '6 hours'),
  ('Whole Milk 1L',       'Store #205', 180.50, 'COMPLETED', now() - interval '1 day'),
  ('Artisan Sourdough',   'Store #302',  95.00, 'PENDING',   now() - interval '1 day'),
  ('Cheddar Cheese 200g', 'Store #115', 340.00, 'COMPLETED', now() - interval '2 days'),
  ('Whole Wheat Bread',   'Store #401', 125.00, 'COMPLETED', now() - interval '2 days'),
  ('Orange Juice 1L',     'Store #209',  67.50, 'FAILED',    now() - interval '3 days'),
  ('Baby Spinach 250g',   'Store #302', 198.00, 'COMPLETED', now() - interval '1 day'),
  ('Organic Red Peppers', 'Store #115',  88.50, 'COMPLETED', now() - interval '1 day'),
  ('Fresh Broccoli Bulk', 'Store #401', 275.00, 'PENDING',   now()),
  ('Honey Crisp Apples',  'Store #202', 156.80, 'COMPLETED', now()),
  ('Organic Carrots',     'Store #101',  43.20, 'COMPLETED', now() - interval '30 minutes'),
  ('Roma Tomatoes',       'Store #303', 210.00, 'COMPLETED', now() - interval '3 days'),
  ('Greek Yogurt 500g',   'Store #205',  78.00, 'COMPLETED', now() - interval '4 days'),
  ('Baguette',            'Store #101',  55.00, 'COMPLETED', now() - interval '4 days'),
  ('Whole Milk 1L',       'Store #302', 145.00, 'COMPLETED', now() - interval '5 days'),
  ('Cheddar Cheese 200g', 'Store #401', 290.00, 'COMPLETED', now() - interval '5 days')
on conflict do nothing;
