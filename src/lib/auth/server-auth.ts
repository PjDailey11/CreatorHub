import 'server-only'

import { SupabaseClient, User } from '@supabase/supabase-js'
import { AuthSnapshot } from '@/lib/auth/types'
import { getProfileSeedFromUser } from '@/lib/auth/user'
import { logError } from '@/lib/logger'
import {
  createAdminClient,
  createClient,
} from '@/lib/supabase/server'
import { Profile } from '@/types'
import { Database } from '@/types/database'

type AppSupabaseClient = SupabaseClient<Database>

function isMissingAvatarColumnError(error: unknown): boolean {
  if (!error || typeof error !== 'object' || !('message' in error)) {
    return false
  }

  const message = String(error.message).toLowerCase()
  return (
    message.includes('avatar_url') &&
    (message.includes('column') || message.includes('schema cache'))
  )
}

function isPermissionError(error: unknown): boolean {
  if (!error || typeof error !== 'object' || !('message' in error)) {
    return false
  }

  const message = String(error.message).toLowerCase()
  return (
    message.includes('row-level security') ||
    message.includes('permission denied') ||
    message.includes(
      'new row violates row-level security policy',
    )
  )
}

async function readProfile(
  supabase: AppSupabaseClient,
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    logError({
      scope: 'auth.profile',
      event: 'profile_read_failed',
      userId,
      error: error.message,
    })
    return null
  }

  return data
}

async function upsertProfile(
  supabase: AppSupabaseClient,
  user: User,
  existingProfile: Profile | null,
  includeAvatar: boolean,
): Promise<Profile | null> {
  const seed = getProfileSeedFromUser(user)
  const payload = {
    id: user.id,
    email: user.email ?? existingProfile?.email ?? seed.email ?? null,
    full_name:
      existingProfile?.full_name ?? seed.full_name ?? null,
    ...(includeAvatar
      ? {
          avatar_url:
            existingProfile?.avatar_url ??
            seed.avatar_url ??
            null,
        }
      : {}),
  }

  const hasChanges =
    !existingProfile ||
    existingProfile.email !== payload.email ||
    existingProfile.full_name !== payload.full_name ||
    (includeAvatar &&
      existingProfile.avatar_url !==
        ('avatar_url' in payload
          ? payload.avatar_url
          : null))

  if (!hasChanges && existingProfile) {
    return existingProfile
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id' })
    .select('*')
    .single()

  if (!error) {
    return data
  }

  if (
    includeAvatar &&
    isMissingAvatarColumnError(error)
  ) {
    return upsertProfile(
      supabase,
      user,
      existingProfile,
      false,
    )
  }

  throw error
}

async function tryAdminProfileSync(
  user: User,
  existingProfile: Profile | null,
): Promise<Profile | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return existingProfile
  }

  try {
    const admin = createAdminClient()
    return await upsertProfile(
      admin,
      user,
      existingProfile,
      true,
    )
  } catch (error) {
    logError({
      scope: 'auth.profile',
      event: 'admin_profile_sync_failed',
      userId: user.id,
      error:
        error instanceof Error
          ? error.message
          : 'unknown error',
    })
    return existingProfile
  }
}

export async function syncProfileFromUser(
  user: User,
  userSupabase?: AppSupabaseClient,
): Promise<Profile | null> {
  const supabase = userSupabase ?? (await createClient())
  const existingProfile = await readProfile(supabase, user.id)

  try {
    return await upsertProfile(
      supabase,
      user,
      existingProfile,
      true,
    )
  } catch (error) {
    if (isPermissionError(error)) {
      return tryAdminProfileSync(user, existingProfile)
    }

    logError({
      scope: 'auth.profile',
      event: 'profile_sync_failed',
      userId: user.id,
      error:
        error instanceof Error
          ? error.message
          : 'unknown error',
    })
    return existingProfile
  }
}

export async function getServerAuthSnapshot(): Promise<AuthSnapshot> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    logError({
      scope: 'auth.server',
      event: 'get_user_failed',
      error: error.message,
    })
  }

  if (!user) {
    return {
      status: 'signed_out',
      user: null,
      profile: null,
    }
  }

  const profile = await syncProfileFromUser(user, supabase)

  return {
    status: 'signed_in',
    user,
    profile,
  }
}