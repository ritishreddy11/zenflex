import { supabase } from '../../lib/supabaseClient'

export const config = {
  api: { bodyParser: false },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  // Simple streaming file upload using FormData boundary parsing through Next.js request
  // To keep it simple and reliable, we expect a single file uploaded via client to Supabase directly
  // Here we proxy: read the raw buffer and store to Supabase Storage

  const contentType = req.headers['content-type'] || ''
  const boundaryMatch = contentType.match(/boundary=(.*)$/)
  if (!boundaryMatch) return res.status(400).json({ error: 'Invalid multipart/form-data' })

  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const buffer = Buffer.concat(chunks)

  // Naive parse: find filename and file content by boundaries (sufficient for single file uploads)
  const boundary = `--${boundaryMatch[1]}`
  const parts = buffer.toString('binary').split(boundary)
  const filePart = parts.find(p => p.includes('filename="'))
  if (!filePart) return res.status(400).json({ error: 'No file' })

  const nameMatch = filePart.match(/filename="([^\"]+)"/)
  const filename = nameMatch ? nameMatch[1] : `upload-${Date.now()}`
  const headerEndIndex = filePart.indexOf('\r\n\r\n')
  const fileBinary = filePart.substring(headerEndIndex + 4, filePart.lastIndexOf('\r\n'))
  const fileBuffer = Buffer.from(fileBinary, 'binary')

  const bucket = 'hero'
  const path = `${Date.now()}-${filename}`
  const { error } = await supabase.storage.from(bucket).upload(path, fileBuffer, {
    contentType: 'image/jpeg',
    upsert: false,
  })
  if (error) return res.status(500).json({ error: error.message })

  const publicUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
  return res.status(200).json({ name: path, url: publicUrl })
}


