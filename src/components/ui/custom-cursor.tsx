'use client'

import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: -100, y: -100 })

  useEffect(() => {
    // Only show custom cursor on desktop
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) return

    const cursor = cursorRef.current
    if (!cursor) return

    let animationId: number
    let targetX = -100
    let targetY = -100

    const animate = () => {
      // Smooth lerping
      positionRef.current.x += (targetX - positionRef.current.x) * 0.2
      positionRef.current.y += (targetY - positionRef.current.y) * 0.2

      cursor.style.left = `${positionRef.current.x}px`
      cursor.style.top = `${positionRef.current.y}px`

      animationId = requestAnimationFrame(animate)
    }

    const updateTarget = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const handleMouseLeave = () => {
      cursor.style.opacity = '0'
    }

    const handleMouseEnter = () => {
      cursor.style.opacity = '1'
    }

    window.addEventListener('mousemove', updateTarget)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    
    animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', updateTarget)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="fixed w-4 h-4 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150"
      style={{ willChange: 'left, top' }}
    />
  )
}
