'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Camera,
  Crown,
  Sparkles,
  Mail,
  AlertTriangle,
  ExternalLink,
  Loader2,
} from 'lucide-react'

const TIER_META: Record<
  string,
  {
    label: string
    description: string
    monthlyPrice: number
    badgeClass: string
  }
> = {
  free: {
    label: 'Free',
    description: 'Basic features for getting started',
    monthlyPrice: 0,
    badgeClass: 'bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
  },
  starter: {
    label: 'Starter',
    description: 'For solo creators ramping up',
    monthlyPrice: 29,
    badgeClass:
      'bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/30',
  },
  pro: {
    label: 'Pro',
    description: 'Most popular for growing creators',
    monthlyPrice: 79,
    badgeClass:
      'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25',
  },
  agency: {
    label: 'Agency',
    description: 'For teams managing multiple creators',
    monthlyPrice: 199,
    badgeClass:
      'bg-amber-400/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/40',
  },
}

function tierMeta(tier: string | null | undefined) {
  return TIER_META[tier ?? 'free'] ?? TIER_META.free
}

const BIO_MAX = 500

export default function ProfilePage() {
  const { user, profile, loading } = useAuth()
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [onlyfansUsername, setOnlyfansUsername] = useState('')
  const [bio, setBio] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [updatingPassword, setUpdatingPassword] = useState(false)

  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [openingPortal, setOpeningPortal] = useState(false)

  // Hydrate form values whenever the profile loads/changes.
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setOnlyfansUsername(profile.onlyfans_username ?? '')
    }
  }, [profile])

  const email = profile?.email || user?.email || ''
  const tier = tierMeta(profile?.subscription_tier)
  const initial = (profile?.full_name?.charAt(0) ||
    email.charAt(0) ||
    'U'
  ).toUpperCase()

  const memberSince = profile?.created_at
    ? format(new Date(profile.created_at), 'MMMM yyyy')
    : '—'

  // Mock next billing date: 30 days from member-since for demo purposes.
  const nextBillingDate = profile?.created_at
    ? format(
        new Date(
          new Date(profile.created_at).getTime() + 30 * 24 * 60 * 60 * 1000
        ),
        'MMM d, yyyy'
      )
    : '—'

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSavingProfile(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim() || null,
          onlyfans_username: onlyfansUsername.trim() || null,
        })
        .eq('id', user.id)
      if (error) throw error
      toast.success('Profile saved')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not save profile'
      toast.error(message)
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match')
      return
    }
    setUpdatingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (error) throw error
      toast.success('Password updated')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not update password'
      toast.error(message)
    } finally {
      setUpdatingPassword(false)
    }
  }

  async function handleManageSubscription() {
    setOpeningPortal(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Could not open portal')
      window.location.href = data.url
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not open portal'
      toast.error(message)
      setOpeningPortal(false)
    }
  }

  function handleDeleteAccount() {
    // UI-only per spec.
    toast.success('Account deletion request received (demo only)')
    setDeleteOpen(false)
    setDeleteConfirmEmail('')
  }

  // Identify the OAuth identities so we can show "connected" state for Google.
  const googleIdentity = user?.identities?.find((i) => i.provider === 'google')

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile, account security, and subscription.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left: profile summary */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-3xl font-semibold text-white">
                    {initial}
                  </AvatarFallback>
                </Avatar>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => toast.info('Photo upload coming soon')}
              >
                <Camera className="h-4 w-4" />
                Change photo
              </Button>

              <div className="space-y-1">
                <h2 className="text-xl font-semibold leading-tight">
                  {profile?.full_name || 'Unnamed Creator'}
                </h2>
                <p className="text-sm text-muted-foreground break-all">
                  {email}
                </p>
              </div>

              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
                  tier.badgeClass
                )}
              >
                {profile?.subscription_tier === 'agency' ? (
                  <Crown className="h-3.5 w-3.5" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                {tier.label} plan
              </span>

              <div className="w-full border-t pt-4 text-left text-sm">
                <p className="text-muted-foreground">Member since</p>
                <p className="font-medium">{memberSince}</p>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Right: tabs */}
        <Tabs defaultValue="profile" className="flex-1">
          <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-grid">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* Tab 1: Profile */}
          <TabsContent value="profile" className="mt-4">
            <Card>
              <form onSubmit={handleSaveProfile}>
                <CardHeader>
                  <CardTitle>Profile information</CardTitle>
                  <CardDescription>
                    Update how your profile appears across CreatorHub.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="full_name">Full name</Label>
                    <Input
                      id="full_name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      maxLength={120}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="onlyfans_username">
                      OnlyFans username
                    </Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                        @
                      </span>
                      <Input
                        id="onlyfans_username"
                        value={onlyfansUsername}
                        onChange={(e) => setOnlyfansUsername(e.target.value)}
                        placeholder="yourhandle"
                        className="pl-7"
                        maxLength={50}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email_readonly">Email</Label>
                    <Input
                      id="email_readonly"
                      value={email}
                      readOnly
                      disabled
                      className="cursor-not-allowed opacity-80"
                    />
                    <p className="text-xs text-muted-foreground">
                      Contact support to change your email.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="bio">Bio</Label>
                      <span
                        className={cn(
                          'text-xs',
                          bio.length > BIO_MAX
                            ? 'text-destructive'
                            : 'text-muted-foreground'
                        )}
                      >
                        {bio.length} / {BIO_MAX}
                      </span>
                    </div>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) =>
                        setBio(e.target.value.slice(0, BIO_MAX))
                      }
                      placeholder="Tell your fans a little about yourself..."
                      rows={4}
                      maxLength={BIO_MAX}
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg shadow-pink-500/25"
                  >
                    {savingProfile ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save changes'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Tab 2: Account */}
          <TabsContent value="account" className="mt-4 space-y-6">
            {/* Change password */}
            <Card>
              <form onSubmit={handleUpdatePassword}>
                <CardHeader>
                  <CardTitle>Change password</CardTitle>
                  <CardDescription>
                    Use a strong password that you don&apos;t reuse elsewhere.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current_password">Current password</Label>
                    <Input
                      id="current_password"
                      type="password"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new_password">New password</Label>
                    <Input
                      id="new_password"
                      type="password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm_new_password">
                      Confirm new password
                    </Label>
                    <Input
                      id="confirm_new_password"
                      type="password"
                      autoComplete="new-password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button
                    type="submit"
                    disabled={updatingPassword}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  >
                    {updatingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update password'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Connected accounts */}
            <Card>
              <CardHeader>
                <CardTitle>Connected accounts</CardTitle>
                <CardDescription>
                  Sign in faster by connecting third-party providers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-border">
                      <GoogleIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Google</p>
                      {googleIdentity ? (
                        <p className="text-xs text-muted-foreground">
                          Connected as{' '}
                          <span className="font-medium">
                            {(googleIdentity.identity_data?.email as string) ||
                              email}
                          </span>
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Not connected
                        </p>
                      )}
                    </div>
                  </div>
                  {googleIdentity ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-green-500/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Connected
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast.info('Google connection flow not wired in demo')
                      }
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Danger zone */}
            <Card className="border-destructive/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Danger zone
                </CardTitle>
                <CardDescription>
                  Permanently delete your account and all associated data.
                  This cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardFooter className="justify-end">
                <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete account</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete your account?</DialogTitle>
                      <DialogDescription>
                        This permanently removes your CreatorHub account, all
                        your subscriber data, and cancels your subscription.
                        This cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                      <Label htmlFor="delete_confirm">
                        Type{' '}
                        <span className="font-semibold text-foreground">
                          {email}
                        </span>{' '}
                        to confirm
                      </Label>
                      <Input
                        id="delete_confirm"
                        value={deleteConfirmEmail}
                        onChange={(e) =>
                          setDeleteConfirmEmail(e.target.value)
                        }
                        placeholder={email}
                        autoComplete="off"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        disabled={deleteConfirmEmail !== email || !email}
                        onClick={handleDeleteAccount}
                      >
                        Delete forever
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Tab 3: Billing */}
          <TabsContent value="billing" className="mt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current plan</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Plan
                    </p>
                    <p className="mt-1 text-base font-semibold">
                      {tier.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Monthly price
                    </p>
                    <p className="mt-1 text-base font-semibold">
                      ${tier.monthlyPrice}
                      <span className="ml-1 text-sm font-normal text-muted-foreground">
                        /mo
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Next billing date
                    </p>
                    <p className="mt-1 text-base font-semibold">
                      {profile?.subscription_tier &&
                      profile.subscription_tier !== 'free'
                        ? nextBillingDate
                        : '—'}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button variant="outline" asChild>
                  <Link href="/pricing">Upgrade plan</Link>
                </Button>
                <Button
                  onClick={handleManageSubscription}
                  disabled={openingPortal}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                >
                  {openingPortal ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Opening portal...
                    </>
                  ) : (
                    <>
                      Manage subscription
                      <ExternalLink className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need help with billing?</CardTitle>
                <CardDescription>
                  Email questions, refunds, or invoice requests to support.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" asChild className="gap-2">
                  <a href="mailto:support@creatorhub.com">
                    <Mail className="h-4 w-4" />
                    support@creatorhub.com
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  )
}
