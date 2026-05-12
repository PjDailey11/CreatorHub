import Link from 'next/link'
import { Mail, Sparkles } from 'lucide-react'

const productLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
]

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
]

const trustLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/contact', label: 'Contact' },
]

export function MarketingFooter() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-2xl">CreatorHub</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Independent CRM and workflow software for subscription creators who want
              clearer follow-up, pricing decisions, and revenue visibility.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-5 text-lg">Product</h3>
            <ul className="space-y-3 text-gray-400">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-5 text-lg">Legal</h3>
            <ul className="space-y-3 text-gray-400">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-5 text-lg">Contact</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-pink-400" />
                <a
                  href="mailto:support@creatorhub.com"
                  className="hover:text-white transition-colors"
                >
                  support@creatorhub.com
                </a>
              </li>
              <li className="text-sm text-gray-500">Typical response time: 1 business day.</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} CreatorHub. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {trustLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
