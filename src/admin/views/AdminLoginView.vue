<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CircleAlert, Eye, EyeOff, UtensilsCrossed } from 'lucide-vue-next'
import '../admin.css'
import { isSupabaseConfigured } from '@/lib/supabase'
import { NotMenuAdminError, signIn } from '../auth'

// Drawn as the finance app's sign-in (AuthCard and LoginForm).
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const isPasswordVisible = ref(false)
const error = ref('')
const isSigningIn = ref(false)

// Only ever return to an admin page, so a crafted link can't send someone elsewhere.
const nextPage = () => {
  const next = route.query.next
  return typeof next === 'string' && next.startsWith('/admin/') ? next : { name: 'admin-menu' }
}

const describeSignInError = (cause) => {
  if (cause instanceof NotMenuAdminError) return cause.message
  if (cause?.code === 'invalid_credentials') return 'The email or password is wrong.'
  if (cause?.status === 429) return 'Too many tries. Wait a minute, then try again.'
  return 'Could not sign in. Check your connection and try again.'
}

const submit = async () => {
  error.value = ''
  if (!email.value.trim() || !password.value) {
    error.value = 'Enter your email and password.'
    return
  }
  isSigningIn.value = true
  try {
    await signIn(email.value.trim(), password.value)
    router.replace(nextPage())
  } catch (cause) {
    error.value = describeSignInError(cause)
    password.value = ''
  } finally {
    isSigningIn.value = false
  }
}
</script>

<template>
  <main class="admin login">
    <div class="login__column">
      <div class="login__brand">
        <span class="login__tile">
          <UtensilsCrossed :size="18" :stroke-width="1.75" />
        </span>
        <span class="login__brand-name">Indah Puri Menu</span>
      </div>

      <div class="login__card">
        <div class="login__heading">
          <h1>Welcome back</h1>
          <p>Sign in to manage the restaurant menu</p>
        </div>

        <p v-if="!isSupabaseConfigured" class="admin-error login__body" role="alert">
          <CircleAlert :size="16" aria-hidden="true" />
          <span>
            Supabase is not set up for this site yet. Add VITE_SUPABASE_URL and
            VITE_SUPABASE_ANON_KEY, then rebuild.
          </span>
        </p>

        <form v-else class="admin-form login__body" novalidate @submit.prevent="submit">
          <p v-if="error" class="admin-error" role="alert">
            <CircleAlert :size="16" aria-hidden="true" />
            <span>{{ error }}</span>
          </p>

          <div class="admin-field">
            <label for="email" class="admin-label">Email</label>
            <input
              id="email"
              v-model="email"
              class="admin-input"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              autofocus
            />
          </div>

          <div class="admin-field">
            <label for="password" class="admin-label">Password</label>
            <div class="login__password">
              <input
                id="password"
                v-model="password"
                class="admin-input"
                :type="isPasswordVisible ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Password"
              />
              <button
                type="button"
                class="login__reveal"
                :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'"
                aria-controls="password"
                @click="isPasswordVisible = !isPasswordVisible"
              >
                <component :is="isPasswordVisible ? EyeOff : Eye" :size="18" :stroke-width="1.75" />
              </button>
            </div>
          </div>

          <button type="submit" class="login__submit" :disabled="isSigningIn">
            {{ isSigningIn ? 'Logging in…' : 'Login' }}
          </button>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 48px 16px;
  background: var(--n-100);
}

.login__column {
  width: 100%;
  max-width: 384px;
}

.login__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.login__tile {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--n-900);
  color: #ffffff;
}

.login__brand-name {
  color: var(--n-900);
  font-size: 16px;
  font-weight: 500;
}

.login__card {
  padding: 28px 24px;
  border: 1px solid var(--line-8);
  border-radius: 16px;
  background: #ffffff;
  box-shadow: var(--shadow-sm);
}

.login__heading {
  text-align: center;
}

.login__heading h1 {
  color: var(--n-900);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.4;
}

.login__heading p {
  margin-top: 4px;
  color: var(--n-500);
  font-size: 14px;
}

.login__body {
  margin-top: 24px;
}

.login__password {
  position: relative;
}

.login__password .admin-input {
  padding-right: 44px;
}

.login__reveal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  width: 44px;
  border-radius: 0 8px 8px 0;
  color: var(--n-500);
}

.login__reveal:hover {
  color: var(--n-900);
}

.login__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  margin-top: 4px;
  padding: 0 16px;
  border-radius: 8px;
  background: var(--n-900);
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.15s ease;
}

.login__submit:hover {
  opacity: 0.8;
}

.login__submit:disabled {
  pointer-events: none;
  opacity: 0.4;
}
</style>
