import { useEffect, useState, useRef } from 'react'

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([])
  const scrollRef = useRef(null)
  const isScrollingRef = useRef(false)
  const CARD_WIDTH = 320 + 24 // like courses

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data.reviews || []))
  }, [])

  // Smooth infinite scroll logic, exactly like featured courses
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer || reviews.length === 0) return
    const handleScroll = () => {
      if (isScrollingRef.current) return
      const scrollLeft = scrollContainer.scrollLeft
      const cardsWidth = reviews.length * CARD_WIDTH
      // Infinite scroll jump: end to start
      if (scrollLeft >= cardsWidth * 2 - 100) {
        isScrollingRef.current = true
        const offset = scrollLeft - cardsWidth * 2
        scrollContainer.scrollLeft = cardsWidth + offset
        setTimeout(() => { isScrollingRef.current = false }, 50)
      } else if (scrollLeft <= 100) {
        isScrollingRef.current = true
        scrollContainer.scrollLeft = cardsWidth + scrollLeft
        setTimeout(() => { isScrollingRef.current = false }, 50)
      }
    }
    scrollContainer.addEventListener('scroll', handleScroll)
    setTimeout(() => {
      if (scrollContainer.scrollLeft < reviews.length * CARD_WIDTH) {
        scrollContainer.scrollLeft = reviews.length * CARD_WIDTH
      }
    }, 100)
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [reviews.length])

  const duplicatedReviews = reviews.length > 0 ? [...reviews, ...reviews, ...reviews] : []
  function scrollReviews(direction) {
    if (!scrollRef.current || isScrollingRef.current) return
    const scrollAmount = CARD_WIDTH
    const currentScroll = scrollRef.current.scrollLeft
    const newScroll = direction === 'left'
      ? currentScroll - scrollAmount
      : currentScroll + scrollAmount
    scrollRef.current.scrollTo({ left: newScroll, behavior: 'smooth' })
  }

  if (!reviews.length) return null
  return (
    <section className="mt-28 mb-16" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '2rem', paddingRight: '2rem' }}>
      <div className="text-center mb-10" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="flex items-center justify-center mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand to-brand max-w-16"></div>
          <h2 className="text-3xl font-serif text-brown-900 mx-6">- - - - - Featured Reviews - - - - -</h2>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-brand to-brand max-w-16"></div>
        </div>
        <p className="text-brown-700 text-lg mt-1">What our students & community say</p>
      </div>
      <div className="relative fade-scroll-container" style={{ minHeight: '400px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Left Nav Button */}
        <button
          onClick={() => scrollReviews('left')}
          className="z-30 bg-white hover:bg-beige-50 border-2 border-brand flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Scroll left"
          style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'auto', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}>
          <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {/* Cards */}
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide pb-4"
          style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
            {duplicatedReviews.map((r, index) => (
              <div
                key={`${r.id}-${index}`}
                className="review-card bg-beige-50 border border-beige-200 rounded-lg hover:shadow-md transition-shadow duration-200 p-6 flex-shrink-0 flex flex-col items-center relative group"
                style={{ width: '320px', maxWidth: 'calc(100vw - 3rem)', minHeight: '430px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="w-full h-32 mb-3 flex items-center justify-center">
                  <div className="rounded-full overflow-hidden border-4 border-brand/80 group-hover:border-[#36a688] shadow-md bg-white/80" style={{ width: '78px', height: '78px', position:'relative' }}>
                    <div className="absolute -top-2 -right-2 bg-gradient-to-tr from-brand to-[#36a688] rounded-full shadow text-white p-1 text-xs font-bold border-2 border-white animate-bounce min-w-[24px] min-h-[24px] flex items-center justify-center" title="Verified Review">★</div>
                    {r.photo_url ? (
                      <img src={r.photo_url} alt={r.name} className="w-full h-full object-cover" style={{ borderRadius: '50%', width: '100%', height: '100%' }} />
                    ) : (
                      <span className="text-2xl text-brand flex items-center justify-center h-full">😊</span>
                    )}
                  </div>
                </div>
                <h3 className="font-bold text-brand mb-2 text-[19px] text-center whitespace-nowrap overflow-hidden text-ellipsis" style={{minHeight:'28px', width:'100%'}}>{r.name}</h3>
                <div className="italic text-brown-900 text-center text-[17px] leading-tight mb-2 line-clamp-4 min-h-[75px]" style={{maxWidth:'92%', margin:'26px auto 14px auto', background:'#fef7ea', borderRadius:'18px', padding:'1.2rem 1.25rem', boxShadow:'0 3px 18px #ede3cf15', border:'1.5px solid #ede3cf'}}>
                  <span className="text-brand text-lg mr-2">❝</span>{r.text}<span className="text-brand text-lg ml-1">❞</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Right Nav Button */}
        <button
          onClick={() => scrollReviews('right')}
          className="z-30 bg-white hover:bg-beige-50 border-2 border-brand flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Scroll right"
          style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'auto', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}>
          <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  )
}
