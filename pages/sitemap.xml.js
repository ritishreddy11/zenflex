import { supabase } from '../lib/supabaseClient'

function generateSiteMap(courses, blogs) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Static pages -->
     <url>
       <loc>https://zenflex.club</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>https://zenflex.club/courses</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>https://zenflex.club/blog</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>https://zenflex.club/contact</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.6</priority>
     </url>
     <!-- Dynamic course pages -->
     ${courses
       .map((course) => {
         return `
       <url>
           <loc>https://zenflex.club/course/${course.slug}</loc>
           <lastmod>${new Date(course.updated_at || course.created_at).toISOString()}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.7</priority>
       </url>
     `;
       })
       .join('')}
     <!-- Dynamic blog pages -->
     ${blogs
       .map((blog) => {
         return `
       <url>
           <loc>https://zenflex.club/blog/${blog.slug}</loc>
           <lastmod>${new Date(blog.updated_at || blog.created_at).toISOString()}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.6</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // Fetch all courses and blogs
  const [coursesResult, blogsResult] = await Promise.all([
    supabase.from('courses').select('slug, created_at, updated_at').order('created_at', { ascending: false }),
    supabase.from('blogs').select('slug, created_at, updated_at').order('created_at', { ascending: false })
  ])

  const courses = coursesResult.data || []
  const blogs = blogsResult.data || []

  // Generate the XML sitemap
  const sitemap = generateSiteMap(courses, blogs)

  res.setHeader('Content-Type', 'text/xml')
  // Cache for 24 hours
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap
