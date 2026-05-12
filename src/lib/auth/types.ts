import { User } from '@supabase/supabase-js'
import { Profile } from '@/types'

export type AuthStatus = 'loading' | 'signed_out' | 'signed_in'

export interface AuthSnapshot {
  status: Exclude<AuthStatus, 'loading'>
  user: User | null
  profile: Profile | null
}