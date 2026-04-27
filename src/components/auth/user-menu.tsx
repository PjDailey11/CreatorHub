'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LayoutDashboard, User, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

type UserMenuProps = {
  /** When true, render a wide trigger that includes name/email next to the avatar (sidebar style). */
  variant?: 'icon' | 'wide'
  className?: string
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function UserMenu({
  variant = 'icon',
  className,
  align = 'end',
  side = 'bottom',
}: UserMenuProps) {
  const { user, profile, signOut } = useAuth()

  const displayName = profile?.full_name || user?.email || 'User'
  const email = profile?.email || user?.email || ''
  const initial = (profile?.full_name?.charAt(0) ||
    profile?.email?.charAt(0) ||
    user?.email?.charAt(0) ||
    'U'
  ).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === 'wide' ? (
          <button
            type="button"
            className={cn(
              'group flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800',
              className
            )}
          >
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white font-semibold">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {email}
              </p>
            </div>
          </button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'rounded-full h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-800',
              className
            )}
            aria-label="Account menu"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white font-semibold">
                {initial}
              </AvatarFallback>
            </Avatar>
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        side={side}
        className="w-64"
        sideOffset={8}
      >
        <div className="px-2 py-2">
          <p className="text-sm font-medium truncate">{displayName}</p>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => signOut()}
          className="cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
