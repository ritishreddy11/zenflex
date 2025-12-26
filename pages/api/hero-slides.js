import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ slides: data })
  }

  if (req.method === 'POST') {
    const { image_url, h1, h2, h3, position } = req.body || {}
    if (!image_url) return res.status(400).json({ error: 'image_url required' })
    const { data, error } = await supabase
      .from('hero_slides')
      .insert([{ image_url, h1, h2, h3, position }])
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ slide: data })
  }

  if (req.method === 'PATCH') {
    const { id, ...fields } = req.body || {}
    if (!id) return res.status(400).json({ error: 'id required' })
    const { data, error } = await supabase
      .from('hero_slides')
      .update(fields)
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ slide: data })
  }

  if (req.method === 'DELETE') {
    const { id } = req.body || {}
    if (!id) return res.status(400).json({ error: 'id required' })
    const { error } = await supabase.from('hero_slides').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).end()
}
