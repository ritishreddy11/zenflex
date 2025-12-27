import { supabase } from '../../lib/supabaseClient'
import Layout from '../../components/Layout'
import ReactMarkdown from 'react-markdown'
import SEOHead from '../../components/SEOHead'
import { BreadcrumbSchema } from '../../components/StructuredData'

export default function CoursePage({ course }) {
  if (!course) return <Layout><div className="p-8 text-brown-700">Course not found</div></Layout>
  
  // Debug: Log course data to see what we're getting
  console.log('Course data:', course)

  // Create WhatsApp enrollment link
  const waNumber = '916360866107' // Your WhatsApp number
  const message = encodeURIComponent(`Hi, I'm interested in enrolling in "${course.title}". Please share the payment link/QR. My name:`)
  const waLink = `https://wa.me/${waNumber}?text=${message}`

  // Handle both old and new pricing structure
  const originalPrice = course.original_price || course.price || 0
  const discountedPrice = course.discounted_price || 0
  const hasDiscount = originalPrice > 0 && discountedPrice > 0 && originalPrice !== discountedPrice

  return (
    <>
      <SEOHead 
        title={`${course.title} - ZenFlex Wellness Course`}
        description={course.description || course.short_desc || `Learn ${course.title} with expert guidance from ZenFlex. Transform your wellness journey with our comprehensive yoga and wellness course.`}
        keywords={`${course.title}, yoga course, wellness training, ${course.title.toLowerCase()}, online yoga, meditation`}
        url={`/course/${course.slug}`}
        image={course.image_url}
        course={course}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Courses", url: "/courses" },
        { name: course.title, url: `/course/${course.slug}` }
      ]} />
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Course Image */}
        {course.image_url && (
          <div className="mb-8">
            <img 
              src={course.image_url} 
              alt={course.title}
              className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Course Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif mb-4 text-brown-900">{course.title}</h1>
          <p className="text-lg text-brown-700 leading-relaxed">{course.description}</p>
        </div>

        {/* Pricing */}
        <div className="bg-beige-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-brown-900 mb-4">Course Pricing</h3>
          {hasDiscount ? (
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-brand">₹{discountedPrice}</span>
                <span className="text-lg text-red-500 line-through decoration-2 decoration-red-500 font-semibold">
                  ₹{originalPrice}
                </span>
              </div>
              <div className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-medium">
                {Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)}% OFF
              </div>
            </div>
          ) : (
            <div className="text-3xl font-bold text-brand">₹{discountedPrice || originalPrice}</div>
          )}
        </div>

        {/* Course Content */}
        {course.content && (
          <div className="mb-8">
            <h3 className="text-2xl font-serif text-brown-900 mb-4">What You&apos;ll Learn</h3>
            <div className="prose prose-lg text-brown-700 leading-relaxed">
              <ReactMarkdown>
                {course.content}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Enrollment CTA */}
        <div className="text-center bg-brand text-white rounded-lg p-8">
          <h3 className="text-2xl font-serif mb-4">Ready to Start Your Journey?</h3>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of students who have transformed their lives through our courses.
          </p>
          <a 
            href={waLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block bg-white text-brand px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Enroll Now via WhatsApp
          </a>
        </div>
      </div>
    </Layout>
    </>
  )
}

export async function getServerSideProps(ctx) {
  const slug = ctx.params.slug
  
  // First try exact match
  let { data, error } = await supabase.from('courses').select('*').eq('slug', slug).single()
  
  // If no exact match, try to find by slug with trimmed spaces
  if (!data && !error) {
    const { data: trimmedData } = await supabase
      .from('courses')
      .select('*')
      .ilike('slug', slug.trim())
      .single()
    data = trimmedData
  }
  
  // If still no match, try to find by slug with normalized format
  if (!data && !error) {
    const normalizedSlug = slug.toLowerCase().replace(/\s+/g, '-').replace(/--+/g, '-').trim()
    const { data: normalizedData } = await supabase
      .from('courses')
      .select('*')
      .ilike('slug', normalizedSlug)
      .single()
    data = normalizedData
  }
  
  return { props: { course: data || null } }
}
