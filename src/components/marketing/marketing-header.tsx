'use client'

import Link from 'next/link'
import { Menu, Sparkles } from 'lucide-react'
import { UserMenu } from '@/components/auth/user-menu'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuth } from '@/hooks/use-auth'

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
] as const

export function MarketingHeader() {
  const { isAuthenticated, loading } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 rounded-sm group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:shadow-pink-500/40 transition-shadow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              CreatorHub
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-sm text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 focus-visible:text-gray-900 dark:text-gray-300 dark:hover:text-white dark:focus-visible:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {loading ? (
              <>
                <div
                  className="h-9 w-20 rounded-md bg-gray-200/70 dark:bg-gray-800/70 animate-pulse"
                  aria-hidden
                />
                <div
                  className="h-9 w-9 rounded-full bg-gray-200/70 dark:bg-gray-800/70 animate-pulse"
                  aria-hidden
                />
                <span className="sr-only">Loading account</span>
              </>
            ) : isAuthenticated ? (
              <>
                <Button
                  asChild
                  className="hidden bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-pink-500/25 transition-all hover:from-pink-600 hover:to-purple-700 hover:shadow-pink-500/40 md:inline-flex"
                >
                  <Link href="/dashboard">
                    Dashboard
                  </Link>
                </Button>
                <UserMenu />
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="hidden dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 md:inline-flex"
                >
                  <Link href="/login">
                    Log in
                  </Link>
                </Button>
                <Button
                  asChild
                  className="hidden bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-pink-500/25 transition-all hover:from-pink-600 hover:to-purple-700 hover:shadow-pink-500/40 md:inline-flex"
                >
                  <Link href="/signup">
                    Start free trial
                  </Link>
                </Button>
              </>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 md:hidden"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[88vw] max-w-sm border-l border-gray-200 bg-white p-0 dark:border-gray-800 dark:bg-gray-950"
              >
                <SheetHeader className="border-b border-gray-200 px-6 py-5 text-left dark:border-gray-800">
                  <SheetTitle>Browse CreatorHub</SheetTitle>
                  <SheetDescription>
                    Navigate pricing, answers, and your next step.
                  </SheetDescription>
                </SheetHeader>

                <div className="flex flex-1 flex-col px-6 py-6">
                  <nav aria-label="Mobile primary" className="space-y-3">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className="flex min-h-12 items-center rounded-xl border border-gray-200 px-4 py-3 text-base font-semibold text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-white dark:hover:bg-gray-900"
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>

                  <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Ready to try CreatorHub?
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Start a 14-day free trial or compare plans first.
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    {isAuthenticated ? (
                      <SheetClose asChild>
                        <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                          <Link href="/dashboard">
                            Open dashboard
                          </Link>
                        </Button>
                      </SheetClose>
                    ) : (
                      <>
                        <SheetClose asChild>
                          <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                            <Link href="/signup">
                              Start your 14-day trial
                            </Link>
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button asChild variant="outline" className="w-full">
                            <Link href="/login">
                              Log in to CreatorHub
                            </Link>
                          </Button>
                        </SheetClose>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
