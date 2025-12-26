import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ blogs: data })
  } 
  else if (req.method === 'POST') {
    const { 
      title, 
      slug, 
      content, 
      excerpt, 
      tags, 
      category, 
      image_url 
    } = req.body

    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug, and content are required' })
    }

    const { data, error } = await supabase
      .from('blogs')
      .insert([{
        title,
        slug,
        content,
        excerpt: excerpt || content.slice(0, 200) + '...',
        tags: tags || '',
        category: category || '',
        image_url: image_url || ''
      }])
      .select()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ blog: data[0] })
  }
  else if (req.method === 'PUT') {
    const { 
      id, 
      title, 
      slug, 
      content, 
      excerpt, 
      tags, 
      category, 
      image_url 
    } = req.body

    if (!id) return res.status(400).json({ error: 'Blog ID is required' })

    const updateData = {
      title,
      slug,
      content,
      excerpt: excerpt || content.slice(0, 200) + '...',
      tags: tags || '',
      category: category || '',
      updated_at: new Date().toISOString()
    }

    if (image_url) updateData.image_url = image_url

    const { data, error } = await supabase
      .from('blogs')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) return res.status(500).json({ error: error.message })
    if (!data || data.length === 0) return res.status(404).json({ error: 'Blog not found' })
    return res.status(200).json({ blog: data[0] })
  }
  else if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'Blog ID is required' })

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)

    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }
  
  return res.status(405).end()
}
