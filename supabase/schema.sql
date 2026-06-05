-- ============================================================
-- ABC LAB NET – run this in Supabase SQL Editor
-- ============================================================

-- Helper function: add quantity to inventory when a verified arrival is submitted
create or replace function public.increment_stock(p_name text, p_qty numeric)
returns void language sql security definer as $$
  update public.inventory_items
  set stock_quantity = stock_quantity + p_qty::integer,
      updated_at = now()
  where name = p_name;
$$;

create table if not exists public.stock_arrivals (
  id           uuid primary key default gen_random_uuid(),
  product_name text not null,
  category     text not null,
  quantity     numeric(10,2) not null,
  unit         text not null default 'kg',
  arrival_date date not null,
  supplier     text not null,
  notes        text,
  status       text not null default 'PENDING',
  created_at   timestamptz not null default now(),
  constraint stock_arrivals_status_check check (status in ('PENDING','VERIFIED','QC_REVIEW','DRAFT'))
);

alter table public.stock_arrivals enable row level security;

drop policy if exists "auth_read_stock_arrivals"   on public.stock_arrivals;
drop policy if exists "auth_insert_stock_arrivals" on public.stock_arrivals;
drop policy if exists "auth_update_stock_arrivals" on public.stock_arrivals;

create policy "auth_read_stock_arrivals"   on public.stock_arrivals for select    to authenticated using (true);
create policy "auth_insert_stock_arrivals" on public.stock_arrivals for insert    to authenticated with check (true);
create policy "auth_update_stock_arrivals" on public.stock_arrivals for update    to authenticated using (true);

insert into public.stock_arrivals (product_name, category, quantity, unit, arrival_date, supplier, status, created_at) values
  ('Organic Spinach', 'Vegetables', 120, 'kg',     current_date, 'Green Farms Ltd',      'VERIFIED',  now() - interval '2 hours'),
  ('Roma Tomatoes',   'Vegetables',  45, 'box',    current_date, 'Valley Fresh Co',      'VERIFIED',  now() - interval '5 hours'),
  ('Granny Smith',    'Fruits',      12, 'pallet', current_date, 'Orchard Direct',       'QC_REVIEW', now() - interval '8 hours')
on conflict do nothing;

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

drop policy if exists "auth_read_inventory"   on public.inventory_items;
drop policy if exists "auth_insert_inventory" on public.inventory_items;
drop policy if exists "auth_update_inventory" on public.inventory_items;
drop policy if exists "auth_delete_inventory" on public.inventory_items;
drop policy if exists "auth_read_transactions"   on public.transactions;
drop policy if exists "auth_insert_transactions" on public.transactions;

create policy "auth_read_inventory"   on public.inventory_items for select    to authenticated using (true);
create policy "auth_insert_inventory" on public.inventory_items for insert    to authenticated with check (true);
create policy "auth_update_inventory" on public.inventory_items for update    to authenticated using (true);
create policy "auth_delete_inventory" on public.inventory_items for delete    to authenticated using (true);
create policy "auth_read_transactions"   on public.transactions for select    to authenticated using (true);
create policy "auth_insert_transactions" on public.transactions for insert    to authenticated with check (true);

-- ============================================================
-- Storage policies for product-images bucket
-- ============================================================
drop policy if exists "public_read_product_images"  on storage.objects;
drop policy if exists "auth_upload_product_images"  on storage.objects;
drop policy if exists "auth_delete_product_images"  on storage.objects;

create policy "public_read_product_images" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "auth_upload_product_images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images');
create policy "auth_delete_product_images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images');

-- ============================================================
-- Seed data
-- ============================================================

insert into public.inventory_items (name, sku, category, stock_quantity, unit, image_url, created_at) values
  ('Baby Spinach 250g',   'VG-8820', 'Vegetables', 142, 'Units', null,                                                                                                                                                                                                                                                                                                                                                                    now() - interval '2 days'),
  ('Whole Milk 1L',       'DY-4491', 'Dairy',        18, 'Units', null,                                                                                                                                                                                                                                                                                                                                                                    now() - interval '5 days'),
  ('Artisan Sourdough',   'BK-1022', 'Bakery',         0, 'Units', null,                                                                                                                                                                                                                                                                                                                                                                    now() - interval '3 days'),
  ('Organic Red Peppers', 'VG-3301', 'Vegetables',   75, 'Units', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJdxlv0pI0gwyygcSOmgjZqlvq2V4a4GE9Bnx7kffblLF3yGLAlFZ8jxdvlCMYl92ixmo9K3tzSQe5Jcm9OPbYK0EW0JAQI32FD9ldYSW-JC11H1z0xGHnY1x5SHk2_v5wDzUlYx5eotnUe6Ph3-dVdcmiXJAOyU2Fr55N3anMvWZMS3DGgqDoBOrfRDLcuzw3pmtyVsUHI99EjJAWNv9XbPcdXzTlBcaZZlORE3sBl2nXPuqF3-gdZQ4mGkFpWREoUw_acXNBMpg', now() - interval '1 day'),
  ('Honey Crisp Apples',  'FR-7721', 'Fruits',        12, 'Units', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxSVg5Jbt_5QSD7syDBLlJExGv1eOvz9AfZaNNM1Yx6jSQwI9k_uue8YMOR1ZQVXSmxJvI7STqwIv2Kp4uNcu5WhVcOotcpf8PCk3wR-xyUCogi6ziQTrZ0AQW6g80ZE8_0bcYDmhq3NIPa1oNlAU2yG0a5r60KnR0w-yPelxPrLmUnR1LyfYb9TWynSQqX9m-YsfABQkmuW0W2xGo45DQ9tfxBNPQxZOA2tPDMTwruTz6LW6bnT2M5tgawC3XVk4KaUR5i_s-0UU', now() - interval '6 days'),
  ('Fresh Broccoli Bulk', 'VG-4412', 'Vegetables',  200, 'Units', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtjnIXyxQwnN6MMNN4MZhORF3YxL4HA9Sc-Sa5sBqNqFpNf9ngA4zbezJvXExuWvxElaZAQlAj_4o_449B6DZ9MhzCtNTc3zdbWwUrb8l52lI0E5aZrAggcFuqUDMsIyZQjjjicRq8aWB7IrkcFKFiCBxbX8c07AkSAETKLWwP2ArZh9SN3XTWbr2_feJkWkIMSEo5wEubomazzgfAXW7IpoR_hnIVX_W7TS7YBLphaw3_YIJIqUXyeictDCzgwUVr3mppQm-1LOI',  now() - interval '4 days'),
  ('Organic Carrots',     'VG-5503', 'Vegetables',    0, 'Units', 'https://lh3.googleusercontent.com/aida-public/AB6AXuApwHWy2Xy5tVvTjsNjAKgfhORtRvB_ShQL17A9ckwNWrAGDF_Awtyp-w-E5GwqS6IlsGs9l7a9zFfCjxAGD868QaIoyzKRXFKRfRpwS06jJTP9vXRnXmApbGHisbSYpmC1UY_lVpV-vcQTkLuhcGOVJatmXJzWdZVubkblZiLP3ELj7-k7f6qt1435CLB4GkJ8M7DTT7-5Cx4axHQm5tRYZ8uwRE63W9-EEGFB06Q1v9DakZr92cykvc853lllPFt11fznnbxTHWY',  now()),
  ('Cheddar Cheese 200g', 'DY-8812', 'Dairy',         45, 'Units', null,                                                                                                                                                                                                                                                                                                                                                                    now() - interval '2 days'),
  ('Whole Wheat Bread',   'BK-3311', 'Bakery',        30, 'Units', null,                                                                                                                                                                                                                                                                                                                                                                    now()),
  ('Orange Juice 1L',     'BV-2201', 'Beverages',      8, 'Units', null,                                                                                                                                                                                                                                                                                                                                                                    now() - interval '1 day'),
  ('Roma Tomatoes',       'VG-6614', 'Vegetables',   88, 'Units', null,                                                                                                                                                                                                                                                                                                                                                                    now() - interval '1 day'),
  ('Greek Yogurt 500g',   'DY-3322', 'Dairy',          5, 'Units', null,                                                                                                                                                                                                                                                                                                                                                                    now()),
  ('Baguette',            'BK-4400', 'Bakery',        22, 'Units', null,                                                                                                                                                                                                                                                                                                                                                                    now() - interval '2 days')
on conflict (sku) do update set image_url = excluded.image_url where excluded.image_url is not null;

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
