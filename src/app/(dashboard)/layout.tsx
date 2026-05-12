import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/sidebar'
import { getServerAuthSnapshot } from '@/lib/auth/server-auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getServerAuthSnapshot()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-foreground">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="px-4 py-6 pt-20 md:px-6 md:py-8 lg:pt-8">
          <div className="animate-in fade-in duration-300">{children}</div>
        </main>
      </div>
    </div>
  )
}
