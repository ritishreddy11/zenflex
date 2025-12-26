import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  try {
    // Fix the existing course slug
    const { data, error } = await supabase
      .from('courses')
      .update({ 
        slug: 'yoga-for-beginners' // Clean slug
      })
      .eq('id', 2) // Update the course with id 2
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ 
      message: 'Course slug fixed successfully',
      course: data[0]
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
