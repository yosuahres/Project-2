// Sign-in for the menu admin. Supabase Auth checks the password; the menu_admins table decides
// who may edit. A login that signs in but is not listed there is signed straight back out.
import { shallowRef } from 'vue'
import { supabase } from '@/lib/supabase'

// The admin who is signed in, for the sidebar's user menu. Null when nobody is.
export const adminUser = shallowRef(null)

export class NotMenuAdminError extends Error {
  constructor() {
    super('This account is not allowed to edit the menu.')
    this.name = 'NotMenuAdminError'
  }
}

// Asked once per login and then remembered, so moving between admin pages costs no request.
let checkedUserId = null
let checkedIsAdmin = false

const isMenuAdmin = async (userId) => {
  if (userId === checkedUserId) return checkedIsAdmin
  // The table's policy lets a login see only its own row, so this finds one row or none.
  const { data, error } = await supabase
    .from('menu_admins')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  checkedUserId = userId
  checkedIsAdmin = Boolean(data)
  return checkedIsAdmin
}

const forget = () => {
  checkedUserId = null
  checkedIsAdmin = false
}

export const getAdminUser = async () => {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  const user = data.session?.user
  adminUser.value = user && (await isMenuAdmin(user.id)) ? user : null
  return adminUser.value
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  if (!(await isMenuAdmin(data.user.id))) {
    await signOut()
    throw new NotMenuAdminError()
  }
  adminUser.value = data.user
  return data.user
}

export const signOut = async () => {
  forget()
  adminUser.value = null
  await supabase.auth.signOut()
}

// Router guard: admin pages need an admin; the login page sends one already signed in onward.
export const adminGuard = async (to) => {
  const needsAdmin = to.matched.some((record) => record.meta.requiresAdmin)
  const isLoginPage = to.name === 'admin-login'
  if (!needsAdmin && !isLoginPage) return true

  const user = await getAdminUser().catch(() => null)
  if (needsAdmin && !user) return { name: 'admin-login', query: { next: to.fullPath } }
  if (isLoginPage && user) return { name: 'admin-menu' }
  return true
}
