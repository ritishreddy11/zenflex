import { useState, useEffect } from 'react'

export default function ReviewsTab() {
  const [reviews, setReviews] = useState([])
  const [msg, setMsg] = useState('')
  const [newReview, setNewReview] = useState({ name: '', text: '', photo_url: '' })
  const [photoFile, setPhotoFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingIdx, setEditingIdx] = useState(null)
  const [edit, setEdit] = useState({})

  useEffect(() => { fetchReviews() }, [])

  async function fetchReviews() {
    setLoading(true)
    const res = await fetch('/api/reviews')
    const data = await res.json()
    setReviews(data.reviews || [])
    setLoading(false)
  }

  async function uploadPhoto(file) {
    const formData = new FormData()
    const fileName = `${Date.now()}-${file.name}`
    formData.append('file', file, fileName)
    // Use Supabase Storage API
    const { supabase } = await import('../lib/supabaseClient')
    const { data, error } = await supabase.storage.from('reviews').upload(fileName, file, { upsert: false, cacheControl: '3600', contentType: file.type })
    if (error) { setMsg('Image upload error: ' + error.message); return '' }
    const link = supabase.storage.from('reviews').getPublicUrl(fileName).data.publicUrl
    return link
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg('')
    let photo_url = newReview.photo_url
    if (photoFile) {
      photo_url = await uploadPhoto(photoFile)
      if (!photo_url) return
    }
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newReview, photo_url }),
    })
    if (res.ok) {
      setMsg('Review added!')
      setNewReview({ name: '', text: '', photo_url: '' })
      setPhotoFile(null)
      setPreview('')
      fetchReviews()
    } else {
      const j = await res.json()
      setMsg(j.error || 'Error adding review')
    }
  }

  function beginEdit(idx) {
    setEditingIdx(idx)
    setEdit({ ...reviews[idx] })
    setPreview(reviews[idx].photo_url)
  }
  function endEdit() {
    setEditingIdx(null); setEdit({}); setPreview('')
  }
  async function handleUpdate(id) {
    setMsg('Saving...')
    let photo_url = edit.photo_url
    if (photoFile) {
      photo_url = await uploadPhoto(photoFile)
      if (!photo_url) return
    }
    const res = await fetch('/api/reviews', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...edit, id, photo_url }),
    })
    if (res.ok) {
      setMsg('Review updated!')
      setEditingIdx(null)
      setEdit({})
      setPhotoFile(null)
      setPreview('')
      fetchReviews()
    } else {
      const j = await res.json()
      setMsg(j.error || 'Update error')
    }
  }
  async function handleDelete(id) {
    if (!window.confirm('Delete this review?')) return
    setMsg('Deleting...')
    const res = await fetch('/api/reviews', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    if (res.ok) {
      setMsg('Deleted!'); fetchReviews()
    } else {
      setMsg('Delete failed')
    }
  }

  return (
    <div className="max-w-xl mx-auto pb-32">
      <h2 className="text-2xl font-serif font-semibold mb-6 text-brown-900 text-center">Add New Review</h2>
      <form className="bg-beige-50 rounded-lg p-6 mb-8 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-2 font-medium">Name *</label>
          <input className="w-full border p-2 rounded" value={newReview.name} onChange={e => setNewReview(s => ({ ...s, name: e.target.value }))} required />
        </div>
        <div>
          <label className="block mb-2 font-medium">Review *</label>
          <textarea className="w-full border p-2 rounded" value={newReview.text} onChange={e => setNewReview(s => ({ ...s, text: e.target.value }))} required rows={4} />
        </div>
        <div>
          <label className="block mb-2 font-medium">Photo (optional, round image)</label>
          <input type="file" accept="image/*" className="block" onChange={e => {
            setPhotoFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0]))
          }} />
          {preview && <img src={preview} alt="preview" className="mt-2 rounded-full w-20 h-20 object-cover border shadow" />}
        </div>
        <button className="btn btn-primary mt-2">Add Review</button>
      </form>
      {msg && <div className="mb-6 text-brown-700 bg-beige-50 p-3 rounded text-center">{msg}</div>}
      <h3 className="text-lg font-bold text-brown-900 mt-8 mb-4">Existing Reviews</h3>
      {loading && <div>Loading...</div>}
      <div className="space-y-6">
        {reviews.map((rev, idx) => (
          <div key={rev.id} className="bg-white border border-beige-200 rounded-lg p-4 flex gap-4 items-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border border-brand/20 shadow-sm flex-shrink-0">
              {rev.photo_url ? (
                <img src={rev.photo_url} alt="photo" className="w-full h-full object-cover rounded-full" />
              ) : <span className="text-3xl text-brand w-full h-full flex items-center justify-center">😊</span>}
            </div>
            <div className="flex-1">
              {editingIdx === idx ? (
                <>
                  <input className="w-full border-b p-1 mb-2" value={edit.name} onChange={e => setEdit(s => ({ ...s, name: e.target.value }))} />
                  <textarea className="w-full border p-2 mb-2" value={edit.text} rows={3} onChange={e => setEdit(s => ({ ...s, text: e.target.value }))} />
                  <input type="file" accept="image/*" className="mb-2" onChange={e => {
                    setPhotoFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0]))
                  }} />
                  {preview && <img src={preview} alt="preview" className="mb-2 rounded-full w-12 h-12 object-cover" />}
                  <div className="flex gap-2">
                    <button className="btn btn-primary btn-sm" type="button" onClick={() => handleUpdate(rev.id)}>Save</button>
                    <button className="btn btn-ghost btn-sm" type="button" onClick={endEdit}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="font-bold text-brown-900">{rev.name}</div>
                  <div className="italic text-brown-800 text-[15px]">{rev.text}</div>
                  <div className="text-xs text-gray-500 mt-1">{rev.created_at ? new Date(rev.created_at).toLocaleDateString() : ''}</div>
                  <div className="flex gap-2 mt-1">
                    <button className="btn btn-ghost btn-sm" type="button" onClick={() => beginEdit(idx)}>Edit</button>
                    <button className="btn btn-ghost btn-sm text-red-600" type="button" onClick={() => handleDelete(rev.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

