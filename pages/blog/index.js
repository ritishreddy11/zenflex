import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'
import Layout from '../../components/Layout'
import ReactMarkdown from 'react-markdown'
import SEOHead from '../../components/SEOHead'
import { BreadcrumbSchema } from '../../components/StructuredData'

export default function Blog({ blogs }) {
  return (
    <>
      <SEOHead 
        title="Wellness Blog - ZenFlex"
        description="Discover insights on yoga, meditation, wellness, and mindful living. Expert tips and guidance for your wellness journey from ZenFlex."
        keywords="wellness blog, yoga tips, meditation guide, mindful living, holistic health, wellness articles"
        url="/blog"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog" }
      ]} />
    <Layout>
      <div className="main-card-page-bg min-h-[82vh]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-serif mb-8 text-brown-900 text-center">Blog</h1>
          
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-brown-700 text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8">
              {blogs.map(blog => (
                <Link 
                  key={blog.id} 
                  href={`/blog/${blog.slug}`}
                  className="block bg-beige-50 border border-beige-200 rounded-lg hover:shadow-lg transition-all duration-300 overflow-hidden"
                  style={{ textDecoration: 'none' }}
                >
                  {blog.image_url && (
                    <div className="w-full h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={blog.image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col">
                    {/* Title - Prominent and Highlighted (First line after image) */}
                    <h2 className="text-2xl font-serif mb-4 leading-tight" style={{ 
                      color: '#7a4f3a',
                      fontWeight: 700,
                      letterSpacing: '0.01em',
                      backgroundColor: '#f7efe8',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.375rem',
                      display: 'inline-block',
                      width: '100%',
                      textDecoration: 'none !important'
                    }}>
                      {blog.title}
                    </h2>
                    
                    {/* Excerpt - Clear Content with Better Spacing */}
                    {blog.excerpt && (
                      <div className="text-sm text-brown-600 mb-5 leading-relaxed line-clamp-3 flex-grow" style={{
                        fontSize: '0.9375rem',
                        lineHeight: '1.75',
                        textDecoration: 'none'
                      }}>
                        <ReactMarkdown
                          components={{
                            p: ({children}) => <p style={{ marginBottom: '0.5rem', textDecoration: 'none' }}>{children}</p>,
                            a: ({children, ...props}) => <a {...props} style={{ textDecoration: 'none', color: 'inherit' }}>{children}</a>,
                            strong: ({children}) => <strong style={{ textDecoration: 'none' }}>{children}</strong>,
                            em: ({children}) => <em style={{ textDecoration: 'none' }}>{children}</em>,
                          }}
                        >
                          {blog.excerpt}
                        </ReactMarkdown>
                      </div>
                    )}
                    
                    {/* Date - Bottom Section */}
                    <div className="mt-auto pt-4 border-t border-beige-200">
                      <div className="text-xs text-brown-500 font-medium mb-3" style={{ textDecoration: 'none' }}>
                        {new Date(blog.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      
                      {/* Tags - Very Bottom with Comma Separation */}
                      {blog.tags && (
                        <div className="text-xs text-brown-600" style={{ textDecoration: 'none' }}>
                          {blog.tags.split(',').map((tag, idx, array) => (
                            <span key={idx} style={{ textDecoration: 'none' }}>
                              <span className="bg-beige-200 text-brown-700 px-2 py-1 rounded font-medium" style={{ textDecoration: 'none' }}>
                                {tag.trim()}
                              </span>
                              {idx < array.length - 1 && <span className="mx-1" style={{ textDecoration: 'none' }}>,</span>}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
    </>
  )
}

export async function getServerSideProps() {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching blogs:', error)
    return { props: { blogs: [] } }
  }
  
  return { props: { blogs: data || [] } }
}

