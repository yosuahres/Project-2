-- Sold out: an item stays on the guest menu, marked as not available today,
-- instead of disappearing as a hidden item does. Staff flip it in the admin.
--
-- Run in the SQL editor, after 0002_menu_seed.sql. Safe to re-run.

alter table public.menu_items
  add column if not exists is_sold_out boolean not null default false;
