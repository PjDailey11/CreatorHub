import { User } from '@supabase/supabase-js'
import { Profile } from '@/types'

type MetadataSource = Record<string, unknown> | null | undefined

function readString(
  sources: MetadataSource[],
  keys: string[],
): string | null {
  for (const source of sources) {
    if (!source) continue

    for (const key of keys) {
      const value = source[key]
      if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim()
      }
    }
  }

  return null
}

function getMetadataSources(
  user: User | null | undefined,
): MetadataSource[] {
  if (!user) return []

  return [
    user.user_metadata as MetadataSource,
    ...(user.identities ?? []).map(
      (identity) => identity.identity_data as MetadataSource,
    ),
  ]
}

function getInitialsFromValue(value: string): string {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) return 'U'

  const initials = parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  return initials || 'U'
}

export function getAuthFullName(
  user: User | null | undefined,
  profile: Pick<Profile, 'full_name'> | null | undefined,
): string | null {
  if (profile?.full_name) {
    return profile.full_name
  }

  return readString(getMetadataSources(user), [
    'full_name',
    'name',
    'display_name',
    'user_name',
  ])
}

export function getAuthEmail(
  user: User | null | undefined,
  profile: Pick<Profile, 'email'> | null | undefined,
): string | null {
  if (profile?.email) {
    return profile.email
  }

  if (user?.email) {
    return user.email
  }

  return readString(getMetadataSources(user), ['email'])
}

export function getAuthAvatarUrl(
  user: User | null | undefined,
  profile: Pick<Profile, 'avatar_url'> | null | undefined,
): string | null {
  if (profile?.avatar_url) {
    return profile.avatar_url
  }

  return readString(getMetadataSources(user), [
    'avatar_url',
    'picture',
    'avatar',
    'photo_url',
  ])
}

export function getAuthDisplayName(
  user: User | null | undefined,
  profile:
    | Pick<Profile, 'full_name' | 'email'>
    | null
    | undefined,
): string {
  return (
    getAuthFullName(user, profile) ??
    getAuthEmail(user, profile) ??
    'User'
  )
}

export function getAuthInitials(
  user: User | null | undefined,
  profile:
    | Pick<Profile, 'full_name' | 'email'>
    | null
    | undefined,
): string {
  const name = getAuthFullName(user, profile)
  if (name) {
    return getInitialsFromValue(name)
  }

  const email = getAuthEmail(user, profile)
  if (email) {
    return getInitialsFromValue(email)
  }

  return 'U'
}

export function getProfileSeedFromUser(
  user: User,
): Pick<Profile, 'email' | 'full_name' | 'avatar_url'> {
  return {
    email: getAuthEmail(user, null),
    full_name: getAuthFullName(user, null),
    avatar_url: getAuthAvatarUrl(user, null),
  }
}