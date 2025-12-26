import Head from 'next/head'

// Organization Schema for the business
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ZenFlex",
    "alternateName": "ZenFlex Wellness",
    "url": "https://zenflex.club",
    "logo": "https://zenflex.club/logo.png",
    "description": "Expert yoga instruction, holistic coaching, and mindful living practices. Transform your wellness journey with ZenFlex.",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-63608-66107",
      "contactType": "customer service",
      "availableLanguage": ["English", "Hindi"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.instagram.com/zenflex_club",
      "https://wa.me/916360866107"
    ],
    "offers": {
      "@type": "Offer",
      "category": "Yoga and Wellness Services"
    }
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  )
}

// Website Schema
export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ZenFlex",
    "url": "https://zenflex.club",
    "description": "Yoga & Wellness Coaching | Mindful Living",
    "publisher": {
      "@type": "Organization",
      "name": "ZenFlex"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://zenflex.club/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  )
}

// Local Business Schema
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ZenFlex",
    "image": "https://zenflex.club/logo.png",
    "telephone": "+91-63608-66107",
    "email": "support@zenflex.club",
    "url": "https://zenflex.club",
    "description": "Professional yoga instruction and wellness coaching. Online sessions available worldwide, in-person sessions by appointment.",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "28.6139",
      "longitude": "77.2090"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday", 
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "06:00",
      "closes": "22:00"
    },
    "serviceArea": {
      "@type": "Country",
      "name": "Worldwide"
    }
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  )
}

// Breadcrumb Schema
export function BreadcrumbSchema({ items }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://zenflex.club${item.url}`
    }))
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  )
}

// FAQ Schema (for common questions)
export function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What types of yoga classes does ZenFlex offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ZenFlex offers various yoga styles including Hatha, Vinyasa, and restorative yoga, along with meditation and wellness coaching sessions."
        }
      },
      {
        "@type": "Question", 
        "name": "Are online yoga sessions available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, ZenFlex offers online yoga and wellness sessions available worldwide. In-person sessions are also available by appointment."
        }
      },
      {
        "@type": "Question",
        "name": "How can I contact ZenFlex?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can contact ZenFlex via email at support@zenflex.club, WhatsApp at +91 63608 66107, or through our contact form on the website."
        }
      }
    ]
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  )
}
