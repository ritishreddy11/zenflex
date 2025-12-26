import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .limit(5)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ 
      courses: data,
      count: data?.length || 0,
      message: 'Courses fetched successfully'
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
