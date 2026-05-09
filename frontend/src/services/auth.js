import { reactive } from 'vue'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

export const authState = reactive({
  ready: false,
  loading: false,
  session: null,
  user: null,
  error: null,
})

let authListener = null

export async function initAuth() {
  if (!isSupabaseConfigured) {
    authState.ready = true
    authState.error = 'Supabase is not configured.'
    return
  }

  const { data, error } = await supabase.auth.getSession()

  if (error) {
    authState.error = error.message
  }

  authState.session = data?.session ?? null
  authState.user = data?.session?.user ?? null
  authState.ready = true

  if (!authListener) {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      authState.session = session
      authState.user = session?.user ?? null
      authState.error = null
      authState.ready = true
    })

    authListener = listener.subscription
  }
}

export async function signInWithEmail(email, password) {
  authState.loading = true
  authState.error = null

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  authState.loading = false

  if (error) {
    authState.error = error.message
    return { session: null, error }
  }

  authState.session = data.session
  authState.user = data.user

  return { session: data.session, error: null }
}

export async function signUpWithEmail(email, password, displayName) {
  authState.loading = true
  authState.error = null

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  })

  authState.loading = false

  if (error) {
    authState.error = error.message
    return { session: null, user: null, error }
  }

  authState.session = data.session
  authState.user = data.user

  return { session: data.session, user: data.user, error: null }
}

export async function signOut() {
  authState.loading = true
  authState.error = null

  const { error } = await supabase.auth.signOut()

  authState.loading = false

  if (error) {
    authState.error = error.message
    return { error }
  }

  authState.session = null
  authState.user = null

  return { error: null }
}
