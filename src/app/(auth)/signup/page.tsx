'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [alreadyExists, setAlreadyExists] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'info'
    text: string
    detail?: string
  } | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (password.length < 8) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 8 characters.',
      })
      return
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords don\u2019t match.' })
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        data: { full_name: fullName },
      },
    })

    if (error) {
      console.log('[v0] signUp failed:', {
        message: error.message,
        status: error.status,
        code: (error as { code?: string }).code,
      })
      const lower = error.message.toLowerCase()
      const isAlreadyExists =
        lower.includes('already registered') ||
        lower.includes('already exists') ||
        lower.includes('user already')
      const statusDetail =
        (error as { code?: string }).code || error.status
          ? `${(error as { code?: string }).code ?? ''}${
              error.status ? ` \u00b7 status ${error.status}` : ''
            }`.trim()
          : undefined
      const friendly = isAlreadyExists
        ? 'This email is already in use. Try signing in instead.'
        : error.status === 429
          ? 'Too many signup attempts. Wait a minute and try again.'
          : error.message
      setAlreadyExists(isAlreadyExists)
      setMessage({ type: 'error', text: friendly, detail: statusDetail })
      setLoading(false)
      return
    }

    // Supabase quirk: if a user with that email already exists, signUp may
    // return data without an error. The identities array is empty in that case.
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      console.log(
        '[v0] signUp returned empty identities array (existing email):',
        data.user.email,
      )
      setAlreadyExists(true)
      setMessage({
        type: 'error',
        text: 'This email is already in use. Try signing in instead.',
      })
      setLoading(false)
      return
    }

    // If email confirmation is OFF in Supabase, the user is signed in immediately
    if (data.session) {
      router.push('/dashboard')
      router.refresh()
      return
    }

    // Email confirmation is ON \u2014 user needs to click the link
    setMessage({
      type: 'success',
      text: 'Account created. Check your email to confirm, then sign in.',
    })
    setLoading(false)
  }

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    setMessage(null)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      console.log('[v0] signInWithOAuth(google) failed on signup:', {
        message: error.message,
        status: error.status,
        code: (error as { code?: string }).code,
      })
      setMessage({
        type: 'error',
        text: `Google sign-up failed: ${error.message}. Make sure Google is enabled in your Supabase project (Authentication \u2192 Providers).`,
        detail: error.status ? `status ${error.status}` : undefined,
      })
      setGoogleLoading(false)
      return
    }

    if (!data?.url) {
      console.log(
        '[v0] signInWithOAuth(google) on signup returned no redirect URL',
      )
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
          Create an Account
        </CardTitle>
        <CardDescription>
          Start growing your creator business today
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <div
            role={message.type === 'error' ? 'alert' : 'status'}
            className={`flex items-start gap-2 rounded-md border p-3 text-sm ${
              message.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200'
                : message.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-900 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-200'
                  : 'border-border bg-muted text-foreground'
            }`}
          >
            {message.type === 'error' && (
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            )}
            <div className="space-y-0.5">
              <p className="font-medium leading-snug">{message.text}</p>
              {message.detail && (
                <p className="text-xs text-muted-foreground">
                  {message.detail}
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                aria-label={
                  showConfirmPassword ? 'Hide password' : 'Show password'
                }
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        {alreadyExists && (
          <div className="flex flex-col gap-2">
            <Link
              href={`/login?email=${encodeURIComponent(email)}`}
              className="w-full"
            >
              <Button type="button" variant="outline" className="w-full">
                Go to sign in
              </Button>
            </Link>
            <Link href="/forgot-password" className="w-full">
              <Button
                type="button"
                variant="ghost"
                className="w-full text-pink-500 hover:text-pink-600"
              >
                Reset password
              </Button>
            </Link>
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-900 px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full bg-transparent"
          onClick={handleGoogleSignup}
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
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
