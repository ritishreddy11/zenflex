import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ reviews: data })
  }

  if (req.method === 'POST') {
    const { name, text, photo_url } = req.body
    if (!name || !text) return res.status(400).json({ error: 'Name and text are required' })
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ name, text, photo_url: photo_url || '' }])
      .select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ review: data[0] })
  }

  if (req.method === 'PUT') {
    const { id, name, text, photo_url } = req.body
    if (!id || !name || !text) return res.status(400).json({ error: 'Missing id, name, or text' })
    const { data, error } = await supabase
      .from('reviews')
      .update({ name, text, photo_url: photo_url || '' })
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ review: data })
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'Missing id' })
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  res.status(405).end()
}

