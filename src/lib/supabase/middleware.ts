import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { resolvePostAuthPath } from '@/lib/auth/urls'

const PROTECTED_PATHS = [
  '/dashboard',
  '/profile',
  '/settings',
  '/subscribers',
  '/funnels',
  '/ppv',
  '/analytics',
]

const AUTH_PAGES = ['/login', '/signup']

function matchesPath(pathname: string, paths: string[]) {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  )
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Skip auth when Supabase env vars are not configured (e.g. during build)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isProtectedPath = matchesPath(pathname, PROTECTED_PATHS)

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    const nextPath = `${pathname}${request.nextUrl.search}`
    url.searchParams.set('next', nextPath)
    return NextResponse.redirect(url)
  }

  const isAuthPath = AUTH_PAGES.includes(pathname)

  if (isAuthPath && user) {
    const url = request.nextUrl.clone()
    url.pathname = resolvePostAuthPath(
      request.nextUrl.searchParams.get('next'),
    )
    url.search = ''
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
