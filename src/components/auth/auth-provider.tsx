'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { User } from '@supabase/supabase-js'
import { AuthSnapshot, AuthStatus } from '@/lib/auth/types'
import {
  getAuthAvatarUrl,
  getAuthDisplayName,
  getAuthEmail,
  getAuthFullName,
  getAuthInitials,
} from '@/lib/auth/user'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types'

type AuthContextValue = {
  status: AuthStatus
  loading: boolean
  isAuthenticated: boolean
  user: User | null
  profile: Profile | null
  displayName: string
  fullName: string | null
  email: string | null
  avatarUrl: string | null
  initials: string
  signOut: () => Promise<void>
  refreshAuth: () => Promise<void>
  refreshProfile: () => Promise<Profile | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function readProfile(
  userId: string,
  supabase: ReturnType<typeof createClient>,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('[v0] Failed to read profile:', error.message)
    return null
  }

  return data
}

export function AuthProvider({
  children,
  initialAuth,
}: {
  children: React.ReactNode
  initialAuth: AuthSnapshot
}) {
  const [supabase] = useState(() => createClient())
  const [status, setStatus] = useState<AuthStatus>(
    initialAuth.status,
  )
  const [user, setUser] = useState<User | null>(initialAuth.user)
  const [profile, setProfile] = useState<Profile | null>(
    initialAuth.profile,
  )

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      return null
    }

    const nextProfile = await readProfile(user.id, supabase)
    setProfile(nextProfile)
    return nextProfile
  }, [supabase, user])

  const applyUser = useCallback(
    async (nextUser: User | null) => {
      if (!nextUser) {
        setUser(null)
        setProfile(null)
        setStatus('signed_out')
        return
      }

      setUser(nextUser)
      setStatus('signed_in')
      const nextProfile = await readProfile(
        nextUser.id,
        supabase,
      )
      setProfile(nextProfile)
    },
    [supabase],
  )

  const refreshAuth = useCallback(async () => {
    const {
      data: { user: nextUser },
    } = await supabase.auth.getUser()

    await applyUser(nextUser ?? null)
  }, [applyUser, supabase])

  useEffect(() => {
    let isActive = true

    const syncFromBrowser = async () => {
      const {
        data: { user: nextUser },
      } = await supabase.auth.getUser()

      if (!isActive) return

      await applyUser(nextUser ?? null)
    }

    void syncFromBrowser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void applyUser(session?.user ?? null)
    })

    return () => {
      isActive = false
      subscription.unsubscribe()
    }
  }, [applyUser, supabase])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setStatus('signed_out')
    window.location.assign('/')
  }, [supabase])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      loading: status === 'loading',
      isAuthenticated: status === 'signed_in' && !!user,
      user,
      profile,
      displayName: getAuthDisplayName(user, profile),
      fullName: getAuthFullName(user, profile),
      email: getAuthEmail(user, profile),
      avatarUrl: getAuthAvatarUrl(user, profile),
      initials: getAuthInitials(user, profile),
      signOut,
      refreshAuth,
      refreshProfile,
    }),
    [profile, refreshAuth, refreshProfile, signOut, status, user],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuthContext must be used within an AuthProvider',
    )
  }

  return context
}