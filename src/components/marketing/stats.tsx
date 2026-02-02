'use client'

import { Users, DollarSign, TrendingUp, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

const stats = [
  {
    icon: Users,
    value: 1000,
    suffix: '+',
    label: 'Active Creators',
    description: 'Trust CreatorHub',
  },
  {
    icon: DollarSign,
    value: 2.5,
    prefix: '$',
    suffix: 'M+',
    label: 'Revenue Managed',
    description: 'This month alone',
  },
  {
    icon: TrendingUp,
    value: 47,
    suffix: '%',
    label: 'Avg Revenue Increase',
    description: 'After 3 months',
  },
  {
    icon: Zap,
    value: 10,
    suffix: 'M+',
    label: 'Messages Automated',
    description: 'Via DM funnels',
  },
]

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  const displayValue = value < 10 ? count.toFixed(1) : Math.floor(count).toLocaleString()

  return (
    <span>{prefix}{displayValue}{suffix}</span>
  )
}

export function Stats() {
  return (
    <section className="py-20 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="text-center text-white group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300 shadow-lg">
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-5xl font-bold mb-2 tracking-tight">
                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="text-lg font-semibold mb-1">{stat.label}</div>
              <div className="text-white/70 text-sm font-medium">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
