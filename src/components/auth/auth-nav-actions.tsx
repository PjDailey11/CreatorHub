'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

export function AuthNavActions() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <Button variant="ghost" disabled>
          Checking session...
        </Button>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" className="dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800">
            Dashboard
          </Button>
        </Link>
        <Button
          onClick={signOut}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all"
        >
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/login">
        <Button variant="ghost" className="dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800">
          Sign In
        </Button>
      </Link>
      <Link href="/signup">
        <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all">
          Get Started
        </Button>
      </Link>
    </div>
  )
}
