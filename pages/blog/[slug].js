import { supabase } from '../../lib/supabaseClient'
import Layout from '../../components/Layout'
import ReactMarkdown from 'react-markdown'
import SEOHead from '../../components/SEOHead'
import { BreadcrumbSchema } from '../../components/StructuredData'

export default function BlogPost({ blog }) {
  if (!blog) {
    return (
      <Layout>
        <div className="main-card-page-bg min-h-[82vh]">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-serif mb-4 text-brown-900">Blog Post Not Found</h1>
              <p className="text-brown-700 mb-6">The blog post you're looking for doesn't exist.</p>
              <a href="/blog" className="btn btn-primary">Back to Blog</a>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <>
      <SEOHead 
        title={`${blog.title} - ZenFlex Blog`}
        description={blog.excerpt || blog.content?.substring(0, 160) || `Read ${blog.title} on ZenFlex wellness blog. Expert insights on yoga, meditation, and mindful living.`}
        keywords={`${blog.title}, ${blog.tags || 'yoga, wellness, meditation'}, mindful living, holistic health`}
        url={`/blog/${blog.slug}`}
        image={blog.image_url}
        article={true}
        publishedTime={blog.created_at}
        modifiedTime={blog.updated_at}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: blog.title, url: `/blog/${blog.slug}` }
      ]} />
      {/* Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.excerpt || blog.content?.substring(0, 160),
            "image": blog.image_url,
            "author": {
              "@type": "Organization",
              "name": "ZenFlex"
            },
            "publisher": {
              "@type": "Organization",
              "name": "ZenFlex",
              "logo": {
                "@type": "ImageObject",
                "url": "https://zenflex.club/logo.png"
              }
            },
            "datePublished": blog.created_at,
            "dateModified": blog.updated_at || blog.created_at,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://zenflex.club/blog/${blog.slug}`
            },
            "keywords": blog.tags,
            "articleSection": blog.category || "Wellness"
          })
        }}
      />
    <Layout>
      <div className="main-card-page-bg min-h-[82vh]">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Blog Image */}
          {blog.image_url && (
            <div className="mb-8">
              <img 
                src={blog.image_url} 
                alt={blog.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Blog Header */}
          <div className="mb-8">
            {blog.category && (
              <span className="inline-block text-sm bg-brand text-white px-4 py-2 rounded-full mb-4">
                {blog.category}
              </span>
            )}
            <h1 className="text-4xl font-serif mb-4 text-brown-900">{blog.title}</h1>
            <div className="flex items-center gap-4 text-sm text-brown-600 mb-4">
              <span>
                {new Date(blog.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              {blog.tags && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.split(',').map((tag, idx) => (
                    <span key={idx} className="bg-beige-200 text-brown-700 px-3 py-1 rounded-full text-xs">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Blog Content */}
          {blog.content && (
            <div className="mb-8">
              <div className="prose prose-lg text-brown-700 leading-relaxed max-w-none">
                <ReactMarkdown>
                  {blog.content}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Back to Blog Link */}
          <div className="text-center mt-12 pt-8 border-t border-beige-200">
            <a href="/blog" className="btn btn-primary">
              ← Back to Blog
            </a>
          </div>
        </div>
      </div>
    </Layout>
    </>
  )
}

export async function getServerSideProps(ctx) {
  const slug = ctx.params.slug
  
  // First try exact match
  let { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single()
  
  // If no exact match, try case-insensitive match
  if (!data && !error) {
    const { data: caseInsensitiveData } = await supabase
      .from('blogs')
      .select('*')
      .ilike('slug', slug)
      .single()
    data = caseInsensitiveData
  }
  
  // If still no match, try normalized slug
  if (!data && !error) {
    const normalizedSlug = slug.toLowerCase().replace(/\s+/g, '-').replace(/--+/g, '-').trim()
    const { data: normalizedData } = await supabase
      .from('blogs')
      .select('*')
      .ilike('slug', normalizedSlug)
      .single()
    data = normalizedData
  }
  
  return { props: { blog: data || null } }
}

