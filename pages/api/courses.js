import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ courses: data })
  } 
  else if (req.method === 'POST') {
    const { 
      title, 
      slug, 
      description, 
      short_desc, 
      original_price, 
      discounted_price, 
      content, 
      image_url 
    } = req.body

    if (!title || !slug) {
      return res.status(400).json({ error: 'Title and slug are required' })
    }

    const { data, error } = await supabase
      .from('courses')
      .insert([{
        title,
        slug,
        description: description || '',
        short_desc: short_desc || (description || '').slice(0, 120),
        original_price: Number(original_price || 0),
        discounted_price: Number(discounted_price || 0),
        content: content || '',
        image_url: image_url || ''
      }])
      .select()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ course: data[0] })
  }
  else if (req.method === 'PUT') {
    const { 
      id, 
      title, 
      slug, 
      description, 
      short_desc, 
      original_price, 
      discounted_price, 
      content, 
      image_url 
    } = req.body

    if (!id) return res.status(400).json({ error: 'Course ID is required' })

    const updateData = {
      title,
      slug,
      description: description || '',
      short_desc: short_desc || (description || '').slice(0, 120),
      original_price: Number(original_price || 0),
      discounted_price: Number(discounted_price || 0),
      content: content || '',
      updated_at: new Date().toISOString()
    }

    if (image_url) updateData.image_url = image_url

    const { data, error } = await supabase
      .from('courses')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) return res.status(500).json({ error: error.message })
    if (!data || data.length === 0) return res.status(404).json({ error: 'Course not found' })
    return res.status(200).json({ course: data[0] })
  }
  else if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'Course ID is required' })

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)

    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }
  
  return res.status(405).end()
}
