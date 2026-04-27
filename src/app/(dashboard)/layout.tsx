import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="px-4 py-6 pt-20 md:px-6 md:py-8 lg:pt-8">
          <div className="animate-in fade-in duration-300">{children}</div>
        </main>
      </div>
    </div>
  )
}
