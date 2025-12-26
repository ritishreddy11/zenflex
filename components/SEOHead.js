import Head from 'next/head'

export default function SEOHead({
  title = "ZenFlex - Yoga & Wellness Coaching | Mindful Living",
  description = "Transform your wellness journey with ZenFlex. Expert yoga instruction, holistic coaching, and mindful living practices. Online sessions available worldwide.",
  keywords = "yoga, wellness, meditation, holistic health, mindful living, yoga classes, wellness coaching, stress relief, balance, zen",
  image = "/og-image.jpg",
  url = "https://zenflex.club",
  type = "website",
  author = "ZenFlex Wellness",
  publishedTime,
  modifiedTime,
  article = false,
  course = null,
  review = null
}) {
  const fullTitle = title.includes('ZenFlex') ? title : `${title} | ZenFlex`
  const fullUrl = url.startsWith('http') ? url : `https://zenflex.club${url}`
  const fullImage = image.startsWith('http') ? image : `https://zenflex.club${image}`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="ZenFlex" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@zenflex_club" />
      <meta name="twitter:creator" content="@zenflex_club" />
      
      {/* Article specific meta tags */}
      {article && (
        <>
          <meta property="article:author" content={author} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          <meta property="article:section" content="Wellness" />
          <meta property="article:tag" content={keywords} />
        </>
      )}
      
      {/* Favicon and App Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#2d5a4a" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Structured Data for Course */}
      {course && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              "name": course.title,
              "description": course.description || course.short_desc,
              "image": course.image_url,
              "provider": {
                "@type": "Organization",
                "name": "ZenFlex",
                "url": "https://zenflex.club"
              },
              "offers": course.discounted_price ? {
                "@type": "Offer",
                "price": course.discounted_price,
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock"
              } : undefined,
              "courseMode": "online",
              "educationalLevel": "beginner",
              "teaches": "Yoga and Wellness"
            })
          }}
        />
      )}
      
      {/* Structured Data for Review */}
      {review && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Review",
              "reviewBody": review.text,
              "author": {
                "@type": "Person",
                "name": review.name,
                "image": review.photo_url
              },
              "itemReviewed": {
                "@type": "Organization",
                "name": "ZenFlex",
                "url": "https://zenflex.club"
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5",
                "bestRating": "5"
              }
            })
          }}
        />
      )}
    </Head>
  )
}
