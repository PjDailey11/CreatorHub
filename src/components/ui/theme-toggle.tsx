'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

function getInitialIsDark() {
  if (typeof window === 'undefined') {
    return true
  }

  const savedTheme = localStorage.getItem('theme')

  if (savedTheme === 'dark') return true
  if (savedTheme === 'light') return false

  return (
    document.documentElement.classList.contains('dark') ||
    document.documentElement.getAttribute('data-theme') === 'dark' ||
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(getInitialIsDark)

  const applyTheme = (nextIsDark: boolean) => {
    document.documentElement.classList.toggle('dark', nextIsDark)
    document.documentElement.setAttribute(
      'data-theme',
      nextIsDark ? 'dark' : 'light'
    )
  }

  useEffect(() => {
    applyTheme(isDark)
  }, [isDark])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)

    applyTheme(newIsDark)
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggleTheme}
      suppressHydrationWarning
      className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600" />
      )}
    </button>
  )
}
