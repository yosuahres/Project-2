import { createClient } from '@supabase/supabase-js'

// Both are public by design: the anon (or "publishable") key only reaches what the row level
// security in supabase/migrations allows. Never put the service_role key in a VITE_ variable.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null
