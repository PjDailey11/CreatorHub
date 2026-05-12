const LOCAL_APP_ORIGIN = 'http://localhost:3000'
const DEFAULT_POST_AUTH_PATH = '/dashboard'
const AUTH_REDIRECT_BLOCKLIST = [
  '/',
  '/login',
  '/signup',
  '/auth/callback',
  '/api/auth/callback',
]

export const AUTH_CALLBACK_PATH = '/auth/callback'

function normalizeOrigin(origin: string): string {
  const trimmed = origin.trim()
  if (!trimmed) return LOCAL_APP_ORIGIN

  const withProtocol =
    trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`

  return new URL(withProtocol).origin
}

export function getConfiguredAppOrigin(): string {
  return normalizeOrigin(
    process.env.NEXT_PUBLIC_APP_URL ?? LOCAL_APP_ORIGIN,
  )
}

export function getBrowserAppOrigin(): string {
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin
  }

  return getConfiguredAppOrigin()
}

export function getRequestAppOrigin(request: Request): string {
  const requestUrl = new URL(request.url)
  const forwardedHost = request.headers.get('x-forwarded-host')

  if (!forwardedHost) {
    return requestUrl.origin
  }

  const forwardedProto =
    request.headers.get('x-forwarded-proto') ??
    requestUrl.protocol.replace(':', '')

  return normalizeOrigin(`${forwardedProto}://${forwardedHost}`)
}

export function buildAuthCallbackUrl(options?: {
  next?: string
  origin?: string
}): string {
  const callbackUrl = new URL(
    AUTH_CALLBACK_PATH,
    options?.origin ?? getBrowserAppOrigin(),
  )

  if (options?.next) {
    callbackUrl.searchParams.set('next', options.next)
  }

  return callbackUrl.toString()
}

export function sanitizeNextPath(
  next: string | null | undefined,
): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return DEFAULT_POST_AUTH_PATH
  }

  return next
}

export function resolvePostAuthPath(
  next: string | null | undefined,
): string {
  const sanitized = sanitizeNextPath(next)

  if (
    AUTH_REDIRECT_BLOCKLIST.some(
      (path) =>
        sanitized === path || sanitized.startsWith(`${path}?`),
    )
  ) {
    return DEFAULT_POST_AUTH_PATH
  }

  return sanitized
}