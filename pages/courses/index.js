import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'
import Layout from '../../components/Layout'
import ReactMarkdown from 'react-markdown'
import SEOHead from '../../components/SEOHead'
import { BreadcrumbSchema } from '../../components/StructuredData'

export default function Courses({ courses }) {
  return (
    <>
      <SEOHead 
        title="All Yoga Courses - ZenFlex Wellness"
        description="Explore our comprehensive yoga and wellness courses. From beginner to advanced levels, find the perfect course for your wellness journey."
        keywords="yoga courses, online yoga classes, wellness programs, meditation courses, holistic health training"
        url="/courses"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Courses", url: "/courses" }
      ]} />
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-serif mb-6 text-brown-900 text-center">All Courses</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(c => {
            // Handle both old and new pricing structure
            const originalPrice = c.original_price || c.price || 0
            const discountedPrice = c.discounted_price || originalPrice
            const hasDiscount = originalPrice > 0 && discountedPrice > 0 && originalPrice !== discountedPrice
            const discountPercentage = hasDiscount 
              ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
              : 0
            
            return (
              <Link key={c.id} href={`/course/${c.slug}`} className="block bg-beige-50 border border-beige-200 rounded-lg hover:shadow-md transition-shadow duration-200 p-6">
                <div className="w-full h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={c.image_url || '/placeholder-course.jpg'}
                    alt={c.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-brown-900 mb-3 text-lg">{c.title}</h3>
                <ReactMarkdown className="text-sm text-brown-600 mb-4 leading-relaxed line-clamp-2">
                  {c.short_desc}
                </ReactMarkdown>
                
                {/* Pricing */}
                {originalPrice > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-brand">₹{discountedPrice}</span>
                        {hasDiscount && (
                          <span className="text-sm text-red-500 line-through decoration-2 decoration-red-500 font-semibold">
                            ₹{originalPrice}
                          </span>
                        )}
                      </div>
                      {hasDiscount && (
                        <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">
                          {discountPercentage}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="btn btn-primary w-full text-center">
                  View Details
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </Layout>
    </>
  )
}

export async function getServerSideProps() {
  const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
  return { props: { courses: data || [] } }
}
