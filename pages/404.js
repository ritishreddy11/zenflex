import Link from 'next/link'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'

export default function Custom404() {
  return (
    <>
      <SEOHead 
        title="Page Not Found - ZenFlex Wellness"
        description="The page you're looking for doesn't exist. Return to ZenFlex homepage to explore our yoga courses and wellness programs."
        url="/404"
      />
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="text-8xl font-serif text-brand mb-6">404</div>
            <h1 className="text-3xl font-serif text-brown-900 mb-4">Page Not Found</h1>
            <p className="text-brown-600 mb-8 leading-relaxed">
              The page you&apos;re looking for seems to have wandered off on its own wellness journey. 
              Let&apos;s get you back to finding your zen.
            </p>
            <div className="space-y-4">
              <Link href="/" className="btn btn-primary block">
                Return Home
              </Link>
              <Link href="/courses" className="btn btn-ghost block">
                Browse Courses
              </Link>
              <Link href="/contact" className="btn btn-ghost block">
                Contact Us
              </Link>
            </div>
            <div className="mt-12 text-sm text-brown-500">
              <p>&quot;Sometimes getting lost is the first step to finding yourself.&quot;</p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
