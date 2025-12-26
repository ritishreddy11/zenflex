import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const { pathname } = useRouter()
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/courses', label: 'Courses' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact Us' },
  ]
  return (
    <div className="min-h-screen flex flex-col">
      <header className="header-bg header-shadow header-border rounded-2xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl logo-decor">ZenFlex</div>
          <nav className="flex gap-2 items-center">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} 
                className={`header-link${pathname === l.href ? ' nav-active' : ''}`}>{l.label}</Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-muted border-t mt-12">
        <div className="max-w-5xl mx-auto px-6 py-6 text-sm text-gray-600">
          © {new Date().getFullYear()} <span className="font-serif font-semibold">ZenFlex</span> — Yoga & Wellness · Follow on Instagram
        </div>
      </footer>
      {/* WhatsApp floating icon */}
      <a
        href="https://wa.me/916360866107?text=Hi%20ZenFlex%2C%20I%20want%20to%20know%20more%20about%20the%20courses"
        target="_blank"
        rel="noopener noreferrer"
        style={{ position: "fixed", right: 24, bottom: 24, zIndex: 50 }}
        className="group rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
        aria-label="Chat on WhatsApp"
      >
        <span style={{ background: '#fff', borderRadius: '50%', padding: 6, display: 'inline-block', boxShadow: '0 2px 12px #0002' }}>
          <img
            src="/whatsapp.svg"
            alt="WhatsApp Chat"
            width={48}
            height={48}
            style={{ display: "block" }}
          />
        </span>
      </a>
    </div>
  )
}
