import { MarketingFooter } from '@/components/marketing/marketing-footer'
import { MarketingHeader } from '@/components/marketing/marketing-header'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 -right-40 w-80 h-80 bg-pink-300 dark:bg-pink-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-yellow-200 dark:bg-yellow-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Navigation */}
      <MarketingHeader />

      {/* Main content */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      <MarketingFooter />
    </div>
  )
}
