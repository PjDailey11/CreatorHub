import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // Surface OAuth provider errors that come back as ?error=...&error_description=...
  const oauthError = searchParams.get('error')
  const oauthErrorDescription = searchParams.get('error_description')
  if (oauthError) {
    console.log('[v0] auth callback received provider error:', {
      error: oauthError,
      description: oauthErrorDescription,
    })
    const params = new URLSearchParams({
      error: oauthError,
      ...(oauthErrorDescription
        ? { error_description: oauthErrorDescription }
        : {}),
    })
    return NextResponse.redirect(`${origin}/login?${params.toString()}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }

    console.log('[v0] exchangeCodeForSession failed:', {
      message: error.message,
      status: error.status,
      code: (error as { code?: string }).code,
      name: error.name,
    })
    const params = new URLSearchParams({
      error: 'auth_callback_error',
      error_description: error.message,
    })
    return NextResponse.redirect(`${origin}/login?${params.toString()}`)
  }

  console.log('[v0] auth callback hit with neither code nor provider error')
  return NextResponse.redirect(
    `${origin}/login?error=auth_callback_error&error_description=${encodeURIComponent(
      'No authorization code returned from provider.',
    )}`,
  )
}
