import { createClient } from '@/lib/supabase/server'
import {
  getRequestAppOrigin,
  sanitizeNextPath,
} from '@/lib/auth/urls'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const requestOrigin = getRequestAppOrigin(request)
  const code = requestUrl.searchParams.get('code')
  const next = sanitizeNextPath(requestUrl.searchParams.get('next'))

  // Surface OAuth provider errors that come back as ?error=...&error_description=...
  const oauthError = requestUrl.searchParams.get('error')
  const oauthErrorDescription = requestUrl.searchParams.get('error_description')
  if (oauthError) {
    console.log('[v0] auth callback received provider error:', {
      error: oauthError,
      description: oauthErrorDescription,
    })

    const loginUrl = new URL('/login', requestOrigin)
    loginUrl.searchParams.set('error', oauthError)
    if (oauthErrorDescription) {
      loginUrl.searchParams.set('error_description', oauthErrorDescription)
    }

    return NextResponse.redirect(loginUrl)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(new URL(next, requestOrigin))
    }

    console.log('[v0] exchangeCodeForSession failed:', {
      message: error.message,
      status: error.status,
      code: (error as { code?: string }).code,
      name: error.name,
    })

    const loginUrl = new URL('/login', requestOrigin)
    loginUrl.searchParams.set('error', 'auth_callback_error')
    loginUrl.searchParams.set('error_description', error.message)
    return NextResponse.redirect(loginUrl)
  }

  console.log('[v0] auth callback hit with neither code nor provider error')
  const loginUrl = new URL('/login', requestOrigin)
  loginUrl.searchParams.set('error', 'auth_callback_error')
  loginUrl.searchParams.set(
    'error_description',
    'No authorization code returned from provider.',
  )

  return NextResponse.redirect(loginUrl)
}
