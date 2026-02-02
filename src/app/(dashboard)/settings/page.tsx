'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/use-auth'
import { Check, CreditCard, User, Bell, Shield, Loader2 } from 'lucide-react'
import { PRICING_PLANS } from '@/lib/pricing'
import Link from 'next/link'

export default function SettingsPage() {
  const { user, profile, signOut } = useAuth()
  const [fullName, setFullName] = useState('')
  const [onlyfansUsername, setOnlyfansUsername] = useState('')
  const [saving, setSaving] = useState(false)
  const [loadingPortal, setLoadingPortal] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const supabase = createClient()

  const handleManageSubscription = async () => {
    setLoadingPortal(true)
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to open portal' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to manage subscription' })
    }
    setLoadingPortal(false)
  }

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setOnlyfansUsername(profile.onlyfans_username || '')
    }
  }, [profile])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setMessage(null)

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        onlyfans_username: onlyfansUsername,
      })
      .eq('id', user.id)

    if (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully' })
    }
    setSaving(false)
  }

  const currentPlan = profile?.subscription_tier || 'free'
  const planDetails = PRICING_PLANS[currentPlan as keyof typeof PRICING_PLANS]

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ''} disabled className="bg-gray-50" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="onlyfans">OnlyFans Username</Label>
              <Input
                id="onlyfans"
                value={onlyfansUsername}
                onChange={(e) => setOnlyfansUsername(e.target.value)}
                placeholder="@yourusername"
              />
            </div>

            {message && (
              <p className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {message.text}
              </p>
            )}

            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Subscription</CardTitle>
            </div>
            <CardDescription>Manage your subscription plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">
                    {planDetails?.name || 'Free'} Plan
                  </h3>
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-600">
                    Current
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {planDetails ? `$${planDetails.price}/month` : 'Free forever'}
                </p>
              </div>
              {currentPlan === 'free' ? (
                <Link href="/pricing">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    Upgrade
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" onClick={handleManageSubscription} disabled={loadingPortal}>
                  {loadingPortal && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Manage Subscription
                </Button>
              )}
            </div>

            {planDetails && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Plan Features:</p>
                <ul className="space-y-1">
                  {planDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates about your subscribers</p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Reports</p>
                <p className="text-sm text-muted-foreground">Get weekly analytics summaries</p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sign Out</p>
                <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
              </div>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-600">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
