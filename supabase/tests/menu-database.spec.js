// @vitest-environment node
//
// A real Postgres, in this process, with every migration applied. The policies and constraints
// are the behaviour here, so mocking them would prove nothing. Supabase Auth is a stand-in.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PGlite } from '@electric-sql/pglite'
import { beforeAll, describe, expect, it } from 'vitest'
import { bundledMenuRows, bundledOutletRows } from '@/data/bundled-menu'

const MIGRATIONS = join(process.cwd(), 'supabase/migrations')

// The parts of Supabase the migrations lean on, including its habit of granting every new table
// to anon and authenticated, so the tests prove the migration narrows that.
const SUPABASE_STAND_IN = `
  create role anon nologin;
  create role authenticated nologin;

  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), email text);
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;

  grant usage on schema auth, public to anon, authenticated;
  alter default privileges in schema public grant all on tables to anon, authenticated;
  alter default privileges in schema public grant all on functions to anon, authenticated;
`

let db

const applyMigrations = async () => {
  for (const file of readdirSync(MIGRATIONS).sort()) {
    await db.exec(readFileSync(join(MIGRATIONS, file), 'utf8'))
  }
}

const createUser = async (email) => {
  const { rows } = await db.query('insert into auth.users (email) values ($1) returning id', [
    email,
  ])
  return rows[0].id
}

// Runs `work` as a guest (no user id) or a signed-in user, with row level security applying.
const as = async (userId, work) => {
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [userId ?? ''])
  await db.exec(`set role ${userId ? 'authenticated' : 'anon'}`)
  try {
    return await work()
  } finally {
    await db.exec('reset role')
    await db.query("select set_config('request.jwt.claim.sub', '', false)")
  }
}

const asGuest = (work) => as(null, work)

const count = async (sql, params) => (await db.query(sql, params)).rows.length

let adminId
let staffId

beforeAll(async () => {
  db = await PGlite.create()
  await db.exec(SUPABASE_STAND_IN)
  await applyMigrations()

  adminId = await createUser('admin@test')
  staffId = await createUser('staff@test')
  await db.query('insert into public.menu_admins (user_id) values ($1)', [adminId])
})

describe('the seed', () => {
  it('holds the bundled menu exactly', async () => {
    const items = await db.query(
      `select id, category_id, name, price, sort_order, is_available, popular_rank
         from public.menu_items order by id`,
    )
    const expected = [...bundledMenuRows.items].sort((a, b) => (a.id < b.id ? -1 : 1))
    expect(items.rows).toEqual(expected)

    const categories = await db.query(
      `select id, group_id, name_en, name_id, keywords, sort_order, is_visible
         from public.menu_categories order by group_id, sort_order`,
    )
    expect(categories.rows).toHaveLength(bundledMenuRows.categories.length)
    expect(categories.rows.find((row) => row.id === 'beer').keywords).toEqual(['beer', 'bir'])
  })

  it('holds the outlet and a week of hours', async () => {
    const { rows } = await db.query('select name, address, phone, maps_url from public.outlet')
    expect(rows).toEqual([bundledOutletRows.outlet])
    expect(await count('select 1 from public.outlet_hours')).toBe(7)
  })

  it('can be run again without duplicating or undoing anything', async () => {
    await db.query("update public.menu_items set price = 1 where id = 'hf-3'")
    await applyMigrations()
    const { rows } = await db.query("select price from public.menu_items where id = 'hf-3'")
    expect(rows[0].price).toBe(1)
    expect(await count('select 1 from public.menu_items')).toBe(bundledMenuRows.items.length)
    await db.query("update public.menu_items set price = 80000 where id = 'hf-3'")
  })
})

describe('guests', () => {
  it('read the shown menu', async () => {
    const rows = await asGuest(() => count('select 1 from public.menu_items'))
    expect(rows).toBe(bundledMenuRows.items.length)
  })

  it('do not see hidden items or sections', async () => {
    await db.query("update public.menu_items set is_available = false where id = 'hf-3'")
    await db.query("update public.menu_categories set is_visible = false where id = 'beer'")

    expect(await asGuest(() => count("select 1 from public.menu_items where id = 'hf-3'"))).toBe(0)
    expect(
      await asGuest(() => count("select 1 from public.menu_categories where id = 'beer'")),
    ).toBe(0)

    await db.query("update public.menu_items set is_available = true where id = 'hf-3'")
    await db.query("update public.menu_categories set is_visible = true where id = 'beer'")
  })

  it('cannot change a price', async () => {
    await expect(
      asGuest(() => db.query("update public.menu_items set price = 1 where id = 'hf-3'")),
    ).rejects.toThrow(/permission denied/)
  })

  it('cannot add themselves as an admin', async () => {
    await expect(
      asGuest(() => db.query('insert into public.menu_admins (user_id) values ($1)', [staffId])),
    ).rejects.toThrow(/permission denied/)
  })
})

describe('a signed-in login that is not an admin', () => {
  it('changes nothing', async () => {
    const result = await as(staffId, () =>
      db.query("update public.menu_items set price = 1 where id = 'hf-3' returning id"),
    )
    expect(result.rows).toHaveLength(0)

    await expect(
      as(staffId, () =>
        db.query(
          "insert into public.menu_items (category_id, name, price) values ('rice', 'X', 1)",
        ),
      ),
    ).rejects.toThrow(/row-level security/)

    const deleted = await as(staffId, () =>
      db.query("delete from public.menu_items where id = 'hf-3' returning id"),
    )
    expect(deleted.rows).toHaveLength(0)
  })

  it('cannot make itself an admin', async () => {
    await expect(
      as(staffId, () =>
        db.query('insert into public.menu_admins (user_id) values ($1)', [staffId]),
      ),
    ).rejects.toThrow(/permission denied/)
  })

  it('sees no admin row, only its own', async () => {
    expect(await as(staffId, () => count('select 1 from public.menu_admins'))).toBe(0)
    expect(await as(adminId, () => count('select 1 from public.menu_admins'))).toBe(1)
  })
})

describe('an admin', () => {
  it('changes a price', async () => {
    const result = await as(adminId, () =>
      db.query("update public.menu_items set price = 85000 where id = 'hf-3' returning price"),
    )
    expect(result.rows).toEqual([{ price: 85000 }])
  })

  it('adds, hides and removes an item', async () => {
    const id = await as(adminId, async () => {
      const { rows } = await db.query(
        "insert into public.menu_items (category_id, name, price) values ('rice', 'Nasi Uduk', 50000) returning id",
      )
      await db.query('update public.menu_items set is_available = false where id = $1', [
        rows[0].id,
      ])
      return rows[0].id
    })

    // An admin still sees what guests no longer do.
    expect(
      await as(adminId, () => count('select 1 from public.menu_items where id = $1', [id])),
    ).toBe(1)
    expect(await asGuest(() => count('select 1 from public.menu_items where id = $1', [id]))).toBe(
      0,
    )

    const deleted = await as(adminId, () =>
      db.query('delete from public.menu_items where id = $1 returning id', [id]),
    )
    expect(deleted.rows).toHaveLength(1)
  })

  it('edits the outlet and its hours', async () => {
    await as(adminId, async () => {
      await db.query("update public.outlet set phone = '+620000' where id")
      await db.query('update public.outlet_hours set is_closed = true where day = 0')
    })
    const { rows } = await asGuest(() =>
      db.query(
        'select o.phone, h.is_closed from public.outlet o, public.outlet_hours h where h.day = 0',
      ),
    )
    expect(rows).toEqual([{ phone: '+620000', is_closed: true }])
  })

  it('cannot delete a section that still has items', async () => {
    await expect(
      as(adminId, () => db.query("delete from public.menu_categories where id = 'rice'")),
    ).rejects.toThrow(/foreign key/)
  })

  it('cannot save a negative price or an empty name', async () => {
    await expect(
      as(adminId, () => db.query("update public.menu_items set price = -1 where id = 'hf-3'")),
    ).rejects.toThrow(/check constraint/)
    await expect(
      as(adminId, () => db.query("update public.menu_items set name = '  ' where id = 'hf-3'")),
    ).rejects.toThrow(/check constraint/)
  })

  it('cannot add a second outlet', async () => {
    await expect(
      as(adminId, () => db.query("insert into public.outlet (id, name) values (false, 'Other')")),
    ).rejects.toThrow(/check constraint/)
  })

  it('stamps updated_at on change', async () => {
    await as(adminId, () =>
      db.query("update public.menu_items set price = 79000 where id = 'hf-5'"),
    )
    const { rows } = await db.query(
      "select updated_at > created_at as touched from public.menu_items where id = 'hf-5'",
    )
    expect(rows[0].touched).toBe(true)
  })
})
