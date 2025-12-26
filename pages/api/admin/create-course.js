import { supabase } from '../../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { title, slug, price, description } = req.body
  if (!title || !slug) return res.status(400).json({ error: 'title and slug required' })

  const short_desc = (description || '').slice(0, 120)

  const { data, error } = await supabase
    .from('courses')
    .insert([{ title, slug, price: Number(price || 0), description, short_desc }])

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ data })
}
