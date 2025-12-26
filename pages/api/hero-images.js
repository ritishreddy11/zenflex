import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  const bucket = 'hero'

  if (req.method === 'GET') {
    const { data, error } = await supabase.storage.from(bucket).list('', { limit: 200 })
    if (error) return res.status(500).json({ error: error.message })
    const images = (data || [])
      .filter(it => it && it.name && !it.name.endsWith('/'))
      .map(it => {
        const { data: pub } = supabase.storage.from(bucket).getPublicUrl(it.name)
        return { name: it.name, url: pub.publicUrl }
      })
    return res.status(200).json({ images })
  }

  if (req.method === 'DELETE') {
    const { name } = req.body || {}
    if (!name) return res.status(400).json({ error: 'name required' })
    const { error } = await supabase.storage.from(bucket).remove([name])
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).end()
}


