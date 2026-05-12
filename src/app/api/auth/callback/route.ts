import { AUTH_CALLBACK_PATH, getRequestAppOrigin } from '@/lib/auth/urls'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const legacyUrl = new URL(request.url)
  const callbackUrl = new URL(AUTH_CALLBACK_PATH, getRequestAppOrigin(request))
  callbackUrl.search = legacyUrl.search
  return NextResponse.redirect(callbackUrl)
}
