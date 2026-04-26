'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

type Mode = 'password' | 'magic'

const ERROR_MESSAGES: Record<string, string> = {
  auth_callback_error:
    'We couldn\u2019t finish signing you in. Please try again.',
  oauth_provider_not_configured:
    'Google sign-in isn\u2019t enabled yet. Use email + password below or contact the site owner.',
  oauth_redirect_uri_mismatch:
    'This preview URL isn\u2019t in the Supabase allowed redirect list. Add it under Authentication \u2192 URL Configuration.',
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [mode, setMode] = useState<Mode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Surface errors that the OAuth callback redirected back with
  useEffect(() => {
    const err = searchParams.get('error')
    const description = searchParams.get('error_description')
    if (err) {
      setMessage({
        type: 'error',
        text:
          description ||
          ERROR_MESSAGES[err] ||
          `Sign-in failed (${err}). Please try again.`,
      })
    }
  }, [searchParams])

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage({
        type: 'error',
        text:
          error.message === 'Invalid login credentials'
            ? 'Wrong email or password. If you just signed up, check your email and confirm first.'
            : error.message,
      })
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setMessage({
        type: 'error',
        text:
          error.status === 429
            ? 'Too many magic-link requests. Wait a minute and try again, or use email + password.'
            : error.message,
      })
    } else {
      setMessage({
        type: 'success',
        text: 'Check your email for the magic link.',
      })
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setMessage(null)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setMessage({
        type: 'error',
        text: `Google sign-in failed: ${error.message}. Make sure Google is enabled in your Supabase project (Authentication \u2192 Providers).`,
      })
      setGoogleLoading(false)
      return
    }

    // signInWithOAuth normally redirects; if it didn't, surface that too
    if (!data?.url) {
      setMessage({
        type: 'error',
        text:
          'Google didn\u2019t return a redirect URL. Double-check that the Google provider is enabled and your client ID/secret are filled in.',
      })
      setGoogleLoading(false)
    }
  }

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Welcome Back
        </CardTitle>
        <CardDescription>Sign in to your CreatorHub account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          onSubmit={mode === 'password' ? handlePasswordLogin : handleMagicLink}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode === 'password' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('magic')
                    setMessage(null)
                  }}
                  className="text-xs text-pink-500 hover:text-pink-600 font-medium"
                >
                  Use magic link instead
                </button>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
          )}

          {mode === 'magic' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setMode('password')
                  setMessage(null)
                }}
                className="text-xs text-pink-500 hover:text-pink-600 font-medium"
              >
                Use password instead
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            disabled={loading}
          >
            {loading
              ? mode === 'password'
                ? 'Signing in...'
                : 'Sending...'
              : mode === 'password'
                ? 'Sign in'
                : 'Send magic link'}
          </Button>
        </form>

        {message && (
          <p
            className={`text-sm text-center ${
              message.type === 'error' ? 'text-red-500' : 'text-green-500'
            }`}
            role={message.type === 'error' ? 'alert' : 'status'}
          >
            {message.text}
          </p>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full bg-transparent"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {googleLoading ? 'Redirecting to Google...' : 'Google'}
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
