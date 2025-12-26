import Link from 'next/link'
import Layout from '../components/Layout'
import { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import ReviewsSection from '../components/ReviewsSection'
import QuoteSection from '../components/QuoteSection'
import SEOHead from '../components/SEOHead'
import { OrganizationSchema, WebsiteSchema, LocalBusinessSchema, FAQSchema } from '../components/StructuredData'

function positionToClasses(pos) {
  switch (pos) {
    case 'top-left':
      return 'top-6 left-6';
    case 'top-right':
      return 'top-6 right-6';
    case 'bottom-left':
      return 'bottom-6 left-6';
    case 'bottom-right':
      return 'bottom-6 right-6';
    case 'center':
      return 'top-1/2 left-1/2 transform-center';
    default:
      return 'top-6 left-6';
  }
}

export default function Home({ courses, heroSlides }) {
  const [idx, setIdx] = useState(0)
  const coursesScrollRef = useRef(null)
  const isScrollingRef = useRef(false)
  
  useEffect(() => {
    if (!heroSlides || heroSlides.length === 0) return
    const t = setInterval(() => setIdx((i) => (i + 1) % heroSlides.length), 5000)
    return () => clearInterval(t)
  }, [heroSlides])
  const slide = heroSlides && heroSlides.length > 0 ? heroSlides[idx] : null

  // Create duplicated courses array for infinite scroll (3 copies)
  const duplicatedCourses = courses.length > 0 ? [...courses, ...courses, ...courses] : []

  // Calculate card width including gap
  const cardWidth = 320 + 24 // 320px card + 24px gap (gap-6 = 1.5rem = 24px)
  const singleSetWidth = courses.length > 0 ? courses.length * cardWidth : 0

  useEffect(() => {
    const scrollContainer = coursesScrollRef.current
    if (!scrollContainer || courses.length === 0) return

    const handleScroll = () => {
      if (isScrollingRef.current) return
      
      const scrollLeft = scrollContainer.scrollLeft
      const clientWidth = scrollContainer.clientWidth

      // If scrolled near the end of third copy, jump to equivalent position in middle copy
      if (scrollLeft >= singleSetWidth * 2 - 100) {
        isScrollingRef.current = true
        const offset = scrollLeft - singleSetWidth * 2
        scrollContainer.scrollLeft = singleSetWidth + offset
        setTimeout(() => { isScrollingRef.current = false }, 50)
      }
      // If scrolled near the beginning of first copy, jump to equivalent position in middle copy
      else if (scrollLeft <= 100) {
        isScrollingRef.current = true
        scrollContainer.scrollLeft = singleSetWidth + scrollLeft
        setTimeout(() => { isScrollingRef.current = false }, 50)
      }
    }

    scrollContainer.addEventListener('scroll', handleScroll)
    
    // Initialize scroll position to middle copy after a brief delay
    setTimeout(() => {
      if (scrollContainer.scrollLeft < singleSetWidth) {
        scrollContainer.scrollLeft = singleSetWidth
      }
    }, 100)

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [courses, singleSetWidth])

  const scrollCourses = (direction) => {
    if (coursesScrollRef.current && !isScrollingRef.current) {
      const scrollAmount = cardWidth
      const currentScroll = coursesScrollRef.current.scrollLeft
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount
      
      coursesScrollRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      })
    }
  }

  return (
    <>
      <SEOHead 
        title="ZenFlex - Yoga & Wellness Coaching | Mindful Living"
        description="Transform your wellness journey with ZenFlex. Expert yoga instruction, holistic coaching, and mindful living practices. Online sessions available worldwide."
        keywords="yoga classes, wellness coaching, meditation, mindful living, holistic health, stress relief, balance, zen lifestyle"
        url="/"
      />
      <OrganizationSchema />
      <WebsiteSchema />
      <LocalBusinessSchema />
      <FAQSchema />
    <Layout>
      <div className="main-card-page-bg min-h-[82vh]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* HERO SLIDES SECTION */}
          <section className="rounded-2xl mb-8 border border-beige-200 overflow-hidden bg-beige-50">
            <div className="relative">
              {slide ? (
                <>
                  <img src={slide.image_url} alt="hero" className="hero-img fade-slide" />
                  <div className={`absolute ${positionToClasses(slide.position)} max-w-2xl`}>
                    {slide.h1 ? <h1 className="text-4xl font-serif mb-2 text-brown-900" dangerouslySetInnerHTML={{ __html: slide.h1.replace(/\n/g, '<br/>') }} /> : null}
                    {slide.h2 ? <h2 className="text-2xl font-serif mb-2 text-brown-700" dangerouslySetInnerHTML={{ __html: slide.h2.replace(/\n/g, '<br/>') }} /> : null}
                    {slide.h3 ? <h3 className="text-xl font-serif mb-3 text-brown-700" dangerouslySetInnerHTML={{ __html: slide.h3.replace(/\n/g, '<br/>') }} /> : null}
                    <Link href="/courses" className="btn btn-primary">Explore Courses</Link>
                  </div>
                </>
              ) : (
                <div className="h-40 w-full flex items-center justify-center text-brown-700">
                  No hero slides added yet.
                </div>
              )}
            </div>
        </section>

        {/* Wellness content - blended into page */}
        <section className="text-center mb-24 max-w-4xl mx-auto px-6 py-12">
          <div
            className="text-2xl font-serif text-brown-900 mb-8 leading-relaxed italic"
            style={{ fontWeight: 550 }}
          >
            &quot;True wellness isn&apos;t found in extremes — it&apos;s built through mindful choices, one breath at a time.&quot;
          </div>

          <div className="text-brown-700 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
            At <span className="font-semibold text-brand">ZenFlex</span>, we bring together yoga, holistic coaching, and mindful living to help you glow from within.<br/>
            Whether your goal is calm, clarity, or balance — we'll walk with you every step of the way.
          </div>
          <div className="text-xl font-semibold text-brand">
            Start Your Wellness Journey Now
          </div>
          <div className="text-xl font-semibold text-brand mb-8">
               
          </div>
        </section>

        {/* Clean Thin Line Divider */}
        <div className="flex justify-center my-24 px-6">
          <div className="w-64 h-1 bg-brand rounded-full"></div>
        </div>

      

        {/* Featured Courses Section - Wider Display */}
        <section className="mb-16" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '2rem', paddingRight: '2rem' }}>
          <div className="text-center mb-12" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div className="flex items-center justify-center mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand to-brand max-w-16"></div>
              <h2 className="text-3xl font-serif text-brown-900 mx-6"> - - - - - Featured Courses - - - - - </h2>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-brand to-brand max-w-16"></div>
            </div>
          </div>
          <div className="relative fade-scroll-container" style={{ minHeight: '400px', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Left Navigation Button - Perfectly Round */}
            <button
              onClick={() => scrollCourses('left')}
              className="z-30 bg-white hover:bg-beige-50 border-2 border-brand flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Scroll left"
              style={{ 
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'auto',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 30
              }}
            >
              <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Right Navigation Button - Perfectly Round */}
            <button
              onClick={() => scrollCourses('right')}
              className="z-30 bg-white hover:bg-beige-50 border-2 border-brand flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Scroll right"
              style={{ 
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'auto',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 30
              }}
            >
              <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <div ref={coursesScrollRef} className="overflow-x-auto scrollbar-hide pb-4" style={{ position: 'relative', zIndex: 1 }}>
              <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
              {duplicatedCourses.map((c, index) => {
                // Handle both old and new pricing structure
                const originalPrice = c.original_price || c.price || 0
                const discountedPrice = c.discounted_price || originalPrice
                const hasDiscount = originalPrice > 0 && discountedPrice > 0 && originalPrice !== discountedPrice
                const discountPercentage = hasDiscount 
                  ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
                  : 0
                
                return (
                  <div key={`${c.id}-${index}`} className="bg-beige-50 border border-beige-200 rounded-lg hover:shadow-md transition-shadow duration-200 p-6 flex-shrink-0" style={{ width: '320px', maxWidth: 'calc(100vw - 3rem)' }}>
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
                  
                  {/* Enroll button */}
                  <Link href={`/course/${c.slug}`} className="btn btn-primary w-full text-center">
                    Enroll Now
                  </Link>
                </div>
              )
            })}
              </div>
            </div>
          </div>
          
          {/* Explore Courses Button */}
          <div className="text-center mt-8 mb-24">
            <Link href="/courses" className="btn btn-primary text-lg px-8 py-3 rounded-full shadow-md hover:scale-105 transition-transform duration-200">
              Explore All Courses
            </Link>
          </div>
        </section>

        {/* Decorative Divider Section */}
        <div className="my-16 py-12">
          <div className="flex justify-center items-center">
            <div className="text-2xl text-brand font-serif tracking-widest">
              * &mdash; * &mdash; * &mdash; * &mdash; * &mdash; *
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <section className="mb-16 max-w-4xl mx-auto px-6 mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-brown-900 mb-4">
              ✨ Why Choose ZenFlex Wellness?
            </h2>
            <p className="text-lg text-brown-700 leading-relaxed max-w-2xl mx-auto">
            Because your wellbeing deserves a mindful approach — body, mind &amp; lifestyle in harmony.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Highlight Cards */}
            <div className="bg-beige-50 border border-beige-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl mb-3">𖥸</div>
              <h3 className="text-xl font-serif text-brown-900 mb-2">Certified Yoga & Wellness Coach</h3>
              <p className="text-brown-600 leading-relaxed">
                Professional guidance to align movement, nutrition, and mindset.
              </p>
            </div>

            <div className="bg-beige-50 border border-beige-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl mb-3">🪶</div>
              <h3 className="text-xl font-serif text-brown-900 mb-2">Holistic Healing</h3>
              <p className="text-brown-600 leading-relaxed">
                Combining yoga, mindfulness, and balanced lifestyle practices.
              </p>
            </div>

            <div className="bg-beige-50 border border-beige-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl mb-3">🌞</div>
              <h3 className="text-xl font-serif text-brown-900 mb-2">Personalized Programs</h3>
              <p className="text-brown-600 leading-relaxed">
                Tailored sessions for stress relief, weight balance, and energy renewal.
              </p>
            </div>

            <div className="bg-beige-50 border border-beige-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl mb-3">🌿</div>
              <h3 className="text-xl font-serif text-brown-900 mb-2">Sustainable Transformation</h3>
              <p className="text-brown-600 leading-relaxed">
                Not a quick fix — a journey toward lifelong wellness.
              </p>
            </div>
          </div>

          {/* Closing Statement */}
          <div className="text-center bg-beige-100 rounded-lg p-8 border border-beige-200">
            <p className="text-lg text-brown-700 leading-relaxed italic max-w-2xl mx-auto">
              Discover a sanctuary for your mind and body.
            </p>
            <p className="text-base text-brown-600 leading-relaxed mt-4 max-w-2xl mx-auto">
              At ZenFlex, we blend ancient yoga wisdom with modern wellness to help you feel grounded, calm, and strong — every day.
            </p>
          </div>
        </section>
      </div>
      {/* Reviews Section */}
      <ReviewsSection />
      <QuoteSection />
    </div>
    </Layout>
    </>
  )
}

export async function getServerSideProps() {
  const { supabase } = await import('../lib/supabaseClient')
  
  const [{ data: courses, error: coursesError }, { data: heroSlides, error: slidesError }] = await Promise.all([
    supabase.from('courses').select('*').order('created_at', { ascending: false }).limit(6),
    supabase.from('hero_slides').select('*').order('sort_order', { ascending: true }).order('id', { ascending: true }),
  ])
  
  // Log errors if any (for debugging)
  if (coursesError) console.error('Error fetching courses:', coursesError)
  if (slidesError) console.error('Error fetching hero slides:', slidesError)
  
  return { 
    props: { 
      courses: courses || [], 
      heroSlides: heroSlides || [] 
    } 
  }
}
