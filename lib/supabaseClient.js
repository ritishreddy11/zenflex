// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wbrmxrfyvwoukyztetsv.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indicm14cmZ5dndvdWt5enRldHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTA3OTYsImV4cCI6MjA3NjM4Njc5Nn0.kb82mFjcU3KYMrmCuF90-M-8BGY8UMQwSUawGu_BHOk'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
