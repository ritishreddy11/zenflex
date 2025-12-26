import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('hero_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ data: data && data[0] ? data[0] : null })
  }

  if (req.method === 'POST') {
    const { image_url, h1, h2, h3, position } = req.body || {}

    // Read existing to allow partial update (image_url now optional)
    const { data: existing, error: readErr } = await supabase
      .from('hero_settings')
      .select('*')
      .eq('id', 1)
      .single()
    if (readErr && readErr.code !== 'PGRST116') {
      return res.status(500).json({ error: readErr.message })
    }

    const upsertPayload = {
      id: 1,
      image_url: image_url !== undefined ? image_url : (existing?.image_url || null),
      h1: h1 !== undefined ? h1 : (existing?.h1 || null),
      h2: h2 !== undefined ? h2 : (existing?.h2 || null),
      h3: h3 !== undefined ? h3 : (existing?.h3 || null),
      position: position !== undefined ? position : (existing?.position || 'top-left'),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('hero_settings')
      .upsert(upsertPayload, { onConflict: 'id' })
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ data })
  }

  return res.status(405).end()
}


