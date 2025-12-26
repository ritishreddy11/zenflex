import { useForm } from 'react-hook-form'
import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'
import ReviewsTab from '../components/ReviewsTab'

import AdminAuth from '../components/AdminAuth'

export default function Admin() {
  const { register, handleSubmit, reset } = useForm()
  const [msg, setMsg] = useState('')
  const [activeTab, setActiveTab] = useState('hero')
  
  // Hero slides state
  const [slides, setSlides] = useState([])
  const [slideMsg, setSlideMsg] = useState('')
  const [newSlidePreview, setNewSlidePreview] = useState('')
  const [newSlideImageFile, setNewSlideImageFile] = useState(null)
  const [editIndex, setEditIndex] = useState(null)
  const [editForm, setEditForm] = useState({})

  // Courses state
  const [courses, setCourses] = useState([])
  const [courseMsg, setCourseMsg] = useState('')
  const [coursePreview, setCoursePreview] = useState('')
  const [courseImageFile, setCourseImageFile] = useState(null)
  const [editCourseIndex, setEditCourseIndex] = useState(null)
  const [editCourseForm, setEditCourseForm] = useState({})

  // Blogs state
  const [blogs, setBlogs] = useState([])
  const [blogMsg, setBlogMsg] = useState('')
  const [blogPreview, setBlogPreview] = useState('')
  const [blogImageFile, setBlogImageFile] = useState(null)
  const [editBlogIndex, setEditBlogIndex] = useState(null)
  const [editBlogForm, setEditBlogForm] = useState({})

  // Load data
  useEffect(() => {
    refreshSlides()
    refreshCourses()
    refreshBlogs()
  }, [])

  // Hero slides functions
  async function refreshSlides() {
    const res = await fetch('/api/hero-slides')
    const j = await res.json()
    setSlides(j.slides || [])
  }

  function beginEdit(idx) {
    setEditIndex(idx)
    setEditForm({ ...slides[idx] })
  }

  function endEdit() { 
    setEditIndex(null)
    setEditForm({}) 
  }

  async function handleSlideUpdate(id) {
    setSlideMsg('Updating...')
    const res = await fetch('/api/hero-slides', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, id }),
    })
    const j = await res.json()
    if (res.ok) {
      setSlideMsg('Updated!')
      await refreshSlides()
      endEdit()
    } else {
      setSlideMsg('Error: ' + (j.error || 'unknown'))
    }
  }

  async function handleSlideDelete(id) {
    setSlideMsg('Deleting...')
    const res = await fetch('/api/hero-slides', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      await refreshSlides()
      setSlideMsg('Deleted!')
    } else {
      setSlideMsg('Delete failed')
    }
  }

  async function handleSlideImageReplace(idx, file) {
    if (!file) return
    setSlideMsg('Uploading image...')
    const path = `${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('hero').upload(path, file, { 
      upsert: false, 
      cacheControl: '3600', 
      contentType: file.type || 'application/octet-stream' 
    })
    if (error) { 
      setSlideMsg('Image upload error: ' + error.message)
      return 
    }
    const { data } = supabase.storage.from('hero').getPublicUrl(path)
    setEditForm((f) => ({ ...f, image_url: data.publicUrl }))
    setSlideMsg('Image uploaded! (Remember to Save)')
  }

  const [newSlide, setNewSlide] = useState({ h1: '', h2: '', h3: '', position: 'top-left' })
  async function handleNewSlideCreate(e) {
    e.preventDefault()
    if (!newSlideImageFile) { setSlideMsg('Pick an image'); return }
    
    setSlideMsg('Uploading...')
    const path = `${Date.now()}-${newSlideImageFile.name}`
    const { error } = await supabase.storage.from('hero').upload(path, newSlideImageFile, { 
      upsert: false, 
      cacheControl: '3600', 
      contentType: newSlideImageFile.type || 'application/octet-stream' 
    })
    if (error) { setSlideMsg('Upload error: ' + error.message); return }
    const { data } = supabase.storage.from('hero').getPublicUrl(path)
    
    const res = await fetch('/api/hero-slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newSlide, image_url: data.publicUrl }),
    })
    const j = await res.json()
    if (res.ok) {
      setSlideMsg('Created!')
      setNewSlide({ h1: '', h2: '', h3: '', position: 'top-left' })
      setNewSlidePreview('')
      setNewSlideImageFile(null)
      await refreshSlides()
    } else {
      setSlideMsg('Error: ' + (j.error || 'unknown'))
    }
  }

  // Courses functions
  async function refreshCourses() {
    const res = await fetch('/api/courses')
    const j = await res.json()
    setCourses(j.courses || [])
  }

  function beginEditCourse(idx) {
    setEditCourseIndex(idx)
    setEditCourseForm({ ...courses[idx] })
  }

  function endEditCourse() { 
    setEditCourseIndex(null)
    setEditCourseForm({}) 
  }

  async function handleCourseUpdate(id) {
    setCourseMsg('Updating...')
    const res = await fetch('/api/courses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editCourseForm, id }),
    })
    const j = await res.json()
    if (res.ok) {
      setCourseMsg('Updated!')
      await refreshCourses()
      endEditCourse()
    } else {
      setCourseMsg('Error: ' + (j.error || 'unknown'))
    }
  }

  async function handleCourseDelete(id) {
    setCourseMsg('Deleting...')
    const res = await fetch('/api/courses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      await refreshCourses()
      setCourseMsg('Deleted!')
    } else {
      setCourseMsg('Delete failed')
    }
  }

  async function handleCourseImageReplace(idx, file) {
    if (!file) return
    setCourseMsg('Uploading image...')
    const path = `${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('courses').upload(path, file, { 
      upsert: false, 
      cacheControl: '3600', 
      contentType: file.type || 'application/octet-stream' 
    })
    if (error) { 
      setCourseMsg('Image upload error: ' + error.message)
      return 
    }
    const { data } = supabase.storage.from('courses').getPublicUrl(path)
    setEditCourseForm((f) => ({ ...f, image_url: data.publicUrl }))
    setCourseMsg('Image uploaded! (Remember to Save)')
  }

  const [newCourse, setNewCourse] = useState({ 
    title: '', 
    slug: '', 
    description: '', 
    short_desc: '', 
    original_price: 0, 
    discounted_price: 0, 
    content: '' 
  })

  async function handleNewCourseCreate(e) {
    e.preventDefault()
    if (!courseImageFile) { setCourseMsg('Pick an image'); return }
    
    setCourseMsg('Uploading...')
    const path = `${Date.now()}-${courseImageFile.name}`
    const { error } = await supabase.storage.from('courses').upload(path, courseImageFile, { 
      upsert: false, 
      cacheControl: '3600', 
      contentType: courseImageFile.type || 'application/octet-stream' 
    })
    if (error) { setCourseMsg('Upload error: ' + error.message); return }
    const { data } = supabase.storage.from('courses').getPublicUrl(path)
    
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newCourse, image_url: data.publicUrl }),
    })
    const j = await res.json()
    if (res.ok) {
      setCourseMsg('Created!')
      setNewCourse({ 
        title: '', 
        slug: '', 
        description: '', 
        short_desc: '', 
        original_price: 0, 
        discounted_price: 0, 
        content: '' 
      })
      setCoursePreview('')
      setCourseImageFile(null)
      await refreshCourses()
    } else {
      setCourseMsg('Error: ' + (j.error || 'unknown'))
    }
  }

  // Blogs functions
  async function refreshBlogs() {
    const res = await fetch('/api/blogs')
    const j = await res.json()
    setBlogs(j.blogs || [])
  }

  function beginEditBlog(idx) {
    setEditBlogIndex(idx)
    setEditBlogForm({ ...blogs[idx] })
  }

  function endEditBlog() { 
    setEditBlogIndex(null)
    setEditBlogForm({}) 
  }

  async function handleBlogUpdate(id) {
    setBlogMsg('Updating...')
    const res = await fetch('/api/blogs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editBlogForm, id }),
    })
    const j = await res.json()
    if (res.ok) {
      setBlogMsg('Updated!')
      await refreshBlogs()
      endEditBlog()
    } else {
      setBlogMsg('Error: ' + (j.error || 'unknown'))
    }
  }

  async function handleBlogDelete(id) {
    setBlogMsg('Deleting...')
    const res = await fetch('/api/blogs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      await refreshBlogs()
      setBlogMsg('Deleted!')
    } else {
      setBlogMsg('Delete failed')
    }
  }

  async function handleBlogImageReplace(idx, file) {
    if (!file) return
    setBlogMsg('Uploading image...')
    const path = `${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('blogs').upload(path, file, { 
      upsert: false, 
      cacheControl: '3600', 
      contentType: file.type || 'application/octet-stream' 
    })
    if (error) { 
      setBlogMsg('Image upload error: ' + error.message)
      return 
    }
    const { data } = supabase.storage.from('blogs').getPublicUrl(path)
    setEditBlogForm((f) => ({ ...f, image_url: data.publicUrl }))
    setBlogMsg('Image uploaded! (Remember to Save)')
  }

  const [newBlog, setNewBlog] = useState({ 
    title: '', 
    slug: '', 
    content: '', 
    excerpt: '', 
    tags: '', 
    category: '' 
  })

  async function handleNewBlogCreate(e) {
    e.preventDefault()
    if (!blogImageFile) { setBlogMsg('Pick an image'); return }
    
    setBlogMsg('Uploading...')
    const path = `${Date.now()}-${blogImageFile.name}`
    const { error } = await supabase.storage.from('blogs').upload(path, blogImageFile, { 
      upsert: false, 
      cacheControl: '3600', 
      contentType: blogImageFile.type || 'application/octet-stream' 
    })
    if (error) { setBlogMsg('Upload error: ' + error.message); return }
    const { data } = supabase.storage.from('blogs').getPublicUrl(path)
    
    const res = await fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newBlog, image_url: data.publicUrl }),
    })
    const j = await res.json()
    if (res.ok) {
      setBlogMsg('Created!')
      setNewBlog({ 
        title: '', 
        slug: '', 
        content: '', 
        excerpt: '', 
        tags: '', 
        category: '' 
      })
      setBlogPreview('')
      setBlogImageFile(null)
      await refreshBlogs()
    } else {
      setBlogMsg('Error: ' + (j.error || 'unknown'))
    }
  }

  return (
    <AdminAuth>
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-serif text-brown-900 mb-8 text-center">Admin Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-beige-50 rounded-lg p-1 flex">
            <button 
              onClick={() => setActiveTab('hero')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'hero' ? 'bg-brand text-white' : 'text-brown-700 hover:bg-beige-100'
              }`}
            >
              Hero Slides
            </button>
            <button 
              onClick={() => setActiveTab('courses')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'courses' ? 'bg-brand text-white' : 'text-brown-700 hover:bg-beige-100'
              }`}
            >
              Courses
            </button>
            <button 
              onClick={() => setActiveTab('blogs')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'blogs' ? 'bg-brand text-white' : 'text-brown-700 hover:bg-beige-100'
              }`}
            >
              Blogs
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'reviews' ? 'bg-brand text-white' : 'text-brown-700 hover:bg-beige-100'
              }`}
            >
              Reviews
            </button>
          </div>
        </div>

        {/* Hero Slides Tab */}
        {activeTab === 'hero' && (
          <div>
            <h2 className="text-2xl font-serif text-brown-900 mb-6">Hero Slides Management</h2>
            
            {/* New slide form */}
            <div className="bg-beige-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-brown-900 mb-4">Add New Hero Slide</h3>
              <form onSubmit={handleNewSlideCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-2">Hero Image *</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    required 
                    className="w-full p-2 border border-beige-200 rounded bg-white"
                    onChange={e => {
                      if (e.target.files[0]) {
                        setNewSlideImageFile(e.target.files[0])
                        setNewSlidePreview(URL.createObjectURL(e.target.files[0]))
                      }
                    }}
                  />
                  {newSlidePreview && (
                    <img src={newSlidePreview} alt="preview" className="mt-3 rounded-lg shadow-sm" style={{maxWidth:'28rem', height:'12rem', objectFit:'cover'}} />
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">H1 Heading *</label>
                    <textarea 
                      value={newSlide.h1 || ''} 
                      onChange={e => setNewSlide(s => ({ ...s, h1: e.target.value }))} 
                      placeholder="Main heading" 
                      rows={2} 
                      required 
                      className="w-full p-2 border border-beige-200 rounded bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">H2 Heading</label>
                    <textarea 
                      value={newSlide.h2 || ''} 
                      onChange={e => setNewSlide(s => ({ ...s, h2: e.target.value }))} 
                      placeholder="Sub heading" 
                      rows={2} 
                      className="w-full p-2 border border-beige-200 rounded bg-white" 
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">H3 Heading</label>
                    <textarea 
                      value={newSlide.h3 || ''} 
                      onChange={e => setNewSlide(s => ({ ...s, h3: e.target.value }))} 
                      placeholder="Additional text" 
                      rows={2} 
                      className="w-full p-2 border border-beige-200 rounded bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">Text Position</label>
                    <select 
                      value={newSlide.position} 
                      onChange={e => setNewSlide(s => ({ ...s, position: e.target.value }))} 
                      className="w-full p-2 border border-beige-200 rounded bg-white"
                    >
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="center">Center</option>
                    </select>
                  </div>
                </div>
                
                <button type="submit" className="btn btn-primary">Add Hero Slide</button>
              </form>
            </div>

            {/* Existing slides */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-brown-900">Existing Hero Slides</h3>
              {slides.length === 0 && <div className="text-brown-600">No slides yet.</div>}
              {slides.map((slide, idx) => (
                <div key={slide.id} className="bg-white border border-beige-200 rounded-lg p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <img 
                      src={slide.image_url} 
                      alt="hero" 
                      className="rounded-lg shadow-sm" 
                      style={{width:'300px', height:'150px', objectFit:'cover'}} 
                    />
                    <div className="flex-1">
                      {editIndex === idx ? (
                        <div className="space-y-3">
                          <textarea 
                            className="w-full p-2 border border-beige-200 rounded bg-white" 
                            value={editForm.h1 || ''} 
                            onChange={e=>setEditForm(f=>({...f,h1:e.target.value}))} 
                            rows={2}
                            placeholder="H1 Heading"
                          />
                          <textarea 
                            className="w-full p-2 border border-beige-200 rounded bg-white" 
                            value={editForm.h2 || ''} 
                            onChange={e=>setEditForm(f=>({...f,h2:e.target.value}))} 
                            rows={2}
                            placeholder="H2 Heading"
                          />
                          <textarea 
                            className="w-full p-2 border border-beige-200 rounded bg-white" 
                            value={editForm.h3 || ''} 
                            onChange={e=>setEditForm(f=>({...f,h3:e.target.value}))} 
                            rows={2}
                            placeholder="H3 Heading"
                          />
                          <select 
                            className="w-full p-2 border border-beige-200 rounded bg-white" 
                            value={editForm.position || 'top-left'} 
                            onChange={e=>setEditForm(f=>({...f,position:e.target.value}))}
                          >
                            <option value="top-left">Top Left</option>
                            <option value="top-right">Top Right</option>
                            <option value="bottom-left">Bottom Left</option>
                            <option value="bottom-right">Bottom Right</option>
                            <option value="center">Center</option>
                          </select>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="w-full p-2 border border-beige-200 rounded bg-white" 
                            onChange={e => {
                              if (e.target.files[0]) handleSlideImageReplace(idx, e.target.files[0])
                            }} 
                          />
                          <div className="flex gap-2">
                            <button className="btn btn-primary" type="button" onClick={() => handleSlideUpdate(slide.id)}>Save</button>
                            <button className="btn btn-ghost" type="button" onClick={endEdit}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div><strong>H1:</strong> {slide.h1}</div>
                          <div><strong>H2:</strong> {slide.h2}</div>
                          <div><strong>H3:</strong> {slide.h3}</div>
                          <div><strong>Position:</strong> {slide.position}</div>
                          <div className="flex gap-2 mt-4">
                            <button className="btn btn-ghost" type="button" onClick={()=>beginEdit(idx)}>Edit</button>
                            <button className="btn btn-ghost text-red-600" type="button" onClick={()=>handleSlideDelete(slide.id)}>Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {slideMsg && <div className="mt-4 text-sm text-brown-700 bg-beige-50 p-3 rounded">{slideMsg}</div>}
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            <h2 className="text-2xl font-serif text-brown-900 mb-6">Courses Management</h2>
            
            {/* New course form */}
            <div className="bg-beige-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-brown-900 mb-4">Add New Course</h3>
              <form onSubmit={handleNewCourseCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-2">Course Image *</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    required 
                    className="w-full p-2 border border-beige-200 rounded bg-white"
                    onChange={e => {
                      if (e.target.files[0]) {
                        setCourseImageFile(e.target.files[0])
                        setCoursePreview(URL.createObjectURL(e.target.files[0]))
                      }
                    }}
                  />
                  {coursePreview && (
                    <img src={coursePreview} alt="preview" className="mt-3 rounded-lg shadow-sm" style={{maxWidth:'300px', height:'150px', objectFit:'cover'}} />
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">Course Title *</label>
                    <input 
                      type="text"
                      value={newCourse.title} 
                      onChange={e => {
                        const title = e.target.value
                        setNewCourse(s => ({ 
                          ...s, 
                          title,
                          slug: s.slug || title
                            .toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, '')
                            .replace(/\s+/g, '-')
                            .replace(/-+/g, '-')
                            .trim()
                        }))
                      }} 
                      placeholder="e.g., Yoga for Beginners" 
                      required 
                      className="w-full p-2 border border-beige-200 rounded bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">Slug *</label>
                    <input 
                      type="text"
                      value={newCourse.slug} 
                      onChange={e => {
                        const slug = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                          .replace(/\s+/g, '-') // Replace spaces with hyphens
                          .replace(/-+/g, '-') // Replace multiple hyphens with single
                          .trim()
                        setNewCourse(s => ({ ...s, slug }))
                      }}
                      placeholder="e.g., yoga-for-beginners" 
                      required 
                      className="w-full p-2 border border-beige-200 rounded bg-white" 
                    />
                    <p className="text-xs text-gray-500 mt-1">Slug will be auto-formatted (lowercase, hyphens only)</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-2">Short Description</label>
                  <textarea 
                    value={newCourse.short_desc} 
                    onChange={e => setNewCourse(s => ({ ...s, short_desc: e.target.value }))} 
                    placeholder="Brief description for course cards" 
                    rows={2} 
                    className="w-full p-2 border border-beige-200 rounded bg-white" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-2">Full Description</label>
                  <textarea 
                    value={newCourse.description} 
                    onChange={e => setNewCourse(s => ({ ...s, description: e.target.value }))} 
                    placeholder="Detailed course description" 
                    rows={4} 
                    className="w-full p-2 border border-beige-200 rounded bg-white" 
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">Original Price (₹)</label>
                    <input 
                      type="number"
                      value={newCourse.original_price} 
                      onChange={e => setNewCourse(s => ({ ...s, original_price: Number(e.target.value) }))} 
                      placeholder="2999" 
                      className="w-full p-2 border border-beige-200 rounded bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">Discounted Price (₹)</label>
                    <input 
                      type="number"
                      value={newCourse.discounted_price} 
                      onChange={e => setNewCourse(s => ({ ...s, discounted_price: Number(e.target.value) }))} 
                      placeholder="2399" 
                      className="w-full p-2 border border-beige-200 rounded bg-white" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-2">Course Content</label>
                  <textarea 
                    value={newCourse.content} 
                    onChange={e => setNewCourse(s => ({ ...s, content: e.target.value }))} 
                    placeholder="Detailed course content, modules, what students will learn..." 
                    rows={6} 
                    className="w-full p-2 border border-beige-200 rounded bg-white" 
                  />
                </div>
                
                <button type="submit" className="btn btn-primary">Add Course</button>
              </form>
            </div>

            {/* Existing courses */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-brown-900">Existing Courses</h3>
              {courses.length === 0 && <div className="text-brown-600">No courses yet.</div>}
              {courses.map((course, idx) => (
                <div key={course.id} className="bg-white border border-beige-200 rounded-lg p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <img 
                      src={course.image_url || '/placeholder-course.jpg'} 
                      alt="course" 
                      className="rounded-lg shadow-sm" 
                      style={{width:'200px', height:'120px', objectFit:'cover'}} 
                    />
                    <div className="flex-1">
                      {editCourseIndex === idx ? (
                        <div className="space-y-3">
                          <input 
                            type="text"
                            className="w-full p-2 border border-beige-200 rounded bg-white" 
                            value={editCourseForm.title || ''} 
                            onChange={e=>setEditCourseForm(f=>({...f,title:e.target.value}))} 
                            placeholder="Course Title"
                          />
                          <input 
                            type="text"
                            className="w-full p-2 border border-beige-200 rounded bg-white" 
                            value={editCourseForm.slug || ''} 
                            onChange={e=>setEditCourseForm(f=>({...f,slug:e.target.value}))} 
                            placeholder="Course Slug"
                          />
                          <textarea 
                            className="w-full p-2 border border-beige-200 rounded bg-white" 
                            value={editCourseForm.description || ''} 
                            onChange={e=>setEditCourseForm(f=>({...f,description:e.target.value}))} 
                            rows={3}
                            placeholder="Course Description"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="number"
                              className="w-full p-2 border border-beige-200 rounded bg-white" 
                              value={editCourseForm.original_price || ''} 
                              onChange={e=>setEditCourseForm(f=>({...f,original_price:Number(e.target.value)}))} 
                              placeholder="Original Price"
                            />
                            <input 
                              type="number"
                              className="w-full p-2 border border-beige-200 rounded bg-white" 
                              value={editCourseForm.discounted_price || ''} 
                              onChange={e=>setEditCourseForm(f=>({...f,discounted_price:Number(e.target.value)}))} 
                              placeholder="Discounted Price"
                            />
                          </div>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="w-full p-2 border border-beige-200 rounded bg-white" 
                            onChange={e => {
                              if (e.target.files[0]) handleCourseImageReplace(idx, e.target.files[0])
                            }} 
                          />
                          <div className="flex gap-2">
                            <button className="btn btn-primary" type="button" onClick={() => handleCourseUpdate(course.id)}>Save</button>
                            <button className="btn btn-ghost" type="button" onClick={endEditCourse}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <h4 className="text-lg font-semibold text-brown-900">{course.title}</h4>
                          <p className="text-brown-600">{course.description}</p>
                          <div className="flex gap-4 text-sm">
                            <span><strong>Original:</strong> ₹{course.original_price || 0}</span>
                            <span><strong>Discounted:</strong> ₹{course.discounted_price || 0}</span>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button className="btn btn-ghost" type="button" onClick={()=>beginEditCourse(idx)}>Edit</button>
                            <button className="btn btn-ghost text-red-600" type="button" onClick={()=>handleCourseDelete(course.id)}>Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {courseMsg && <div className="mt-4 text-sm text-brown-700 bg-beige-50 p-3 rounded">{courseMsg}</div>}
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === 'reviews' && <ReviewsTab />}

{activeTab === 'blogs' && (
          <div>
            <h2 className="text-2xl font-serif text-brown-900 mb-6">Blogs Management</h2>
            
            {/* New blog form */}
            <div className="bg-beige-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-brown-900 mb-4">Add New Blog Post</h3>
              <form onSubmit={handleNewBlogCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-2">Blog Image *</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    required 
                    className="w-full p-2 border border-beige-200 rounded bg-white"
                    onChange={e => {
                      if (e.target.files[0]) {
                        setBlogImageFile(e.target.files[0])
                        setBlogPreview(URL.createObjectURL(e.target.files[0]))
                      }
                    }}
                  />
                  {blogPreview && (
                    <img src={blogPreview} alt="preview" className="mt-3 rounded-lg shadow-sm" style={{maxWidth:'300px', height:'150px', objectFit:'cover'}} />
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">Blog Title *</label>
                    <input 
                      type="text"
                      value={newBlog.title} 
                      onChange={e => setNewBlog(s => ({ ...s, title: e.target.value }))} 
                      placeholder="e.g., 5 Benefits of Morning Yoga" 
                      required 
                      className="w-full p-2 border border-beige-200 rounded bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">Slug *</label>
                    <input 
                      type="text"
                      value={newBlog.slug} 
                      onChange={e => setNewBlog(s => ({ ...s, slug: e.target.value }))} 
                      placeholder="e.g., 5-benefits-morning-yoga" 
                      required 
                      className="w-full p-2 border border-beige-200 rounded bg-white" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-2">Excerpt</label>
                  <textarea 
                    value={newBlog.excerpt} 
                    onChange={e => setNewBlog(s => ({ ...s, excerpt: e.target.value }))} 
                    placeholder="Brief summary for blog cards" 
                    rows={2} 
                    className="w-full p-2 border border-beige-200 rounded bg-white" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-2">Blog Content *</label>
                  <textarea 
                    value={newBlog.content} 
                    onChange={e => setNewBlog(s => ({ ...s, content: e.target.value }))} 
                    placeholder="Full blog post content..." 
                    rows={8} 
                    required 
                    className="w-full p-2 border border-beige-200 rounded bg-white" 
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">Tags (comma separated)</label>
                    <input 
                      type="text"
                      value={newBlog.tags} 
                      onChange={e => setNewBlog(s => ({ ...s, tags: e.target.value }))} 
                      placeholder="yoga, wellness, meditation" 
                      className="w-full p-2 border border-beige-200 rounded bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">Category</label>
                    <input 
                      type="text"
                      value={newBlog.category} 
                      onChange={e => setNewBlog(s => ({ ...s, category: e.target.value }))} 
                      placeholder="Wellness, Lifestyle, Health" 
                      className="w-full p-2 border border-beige-200 rounded bg-white" 
                    />
                  </div>
                </div>
                
                <button type="submit" className="btn btn-primary">Add Blog Post</button>
              </form>
            </div>

            {/* Existing blogs */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-brown-900">Existing Blog Posts</h3>
              {blogs.length === 0 && <div className="text-brown-600">No blog posts yet.</div>}
              {blogs.map((blog, idx) => (
                <div key={blog.id} className="bg-white border border-beige-200 rounded-lg p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <img 
                      src={blog.image_url || '/placeholder-blog.jpg'} 
                      alt="blog" 
                      className="rounded-lg shadow-sm" 
                      style={{width:'200px', height:'120px', objectFit:'cover'}} 
                    />
                    <div className="flex-1">
                      {editBlogIndex === idx ? (
                        <div className="space-y-3">
                          <input 
                            type="text"
                            className="w-full p-2 border border-beige-200 rounded bg-white" 
                            value={editBlogForm.title || ''} 
                            onChange={e=>setEditBlogForm(f=>({...f,title:e.target.value}))} 
                            placeholder="Blog Title"
                          />
                          <input 
                            type="text"
                            className="w-full p-2 border border-beige-200 rounded bg-white" 
                            value={editBlogForm.slug || ''} 
                            onChange={e=>setEditBlogForm(f=>({...f,slug:e.target.value}))} 
                            placeholder="Blog Slug"
                          />
                          <textarea 
                            className="w-full p-2 border border-beige-200 rounded bg-white" 
                            value={editBlogForm.content || ''} 
                            onChange={e=>setEditBlogForm(f=>({...f,content:e.target.value}))} 
                            rows={4}
                            placeholder="Blog Content"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="text"
                              className="w-full p-2 border border-beige-200 rounded bg-white" 
                              value={editBlogForm.tags || ''} 
                              onChange={e=>setEditBlogForm(f=>({...f,tags:e.target.value}))} 
                              placeholder="Tags"
                            />
                            <input 
                              type="text"
                              className="w-full p-2 border border-beige-200 rounded bg-white" 
                              value={editBlogForm.category || ''} 
                              onChange={e=>setEditBlogForm(f=>({...f,category:e.target.value}))} 
                              placeholder="Category"
                            />
                          </div>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="w-full p-2 border border-beige-200 rounded bg-white" 
                            onChange={e => {
                              if (e.target.files[0]) handleBlogImageReplace(idx, e.target.files[0])
                            }} 
                          />
                          <div className="flex gap-2">
                            <button className="btn btn-primary" type="button" onClick={() => handleBlogUpdate(blog.id)}>Save</button>
                            <button className="btn btn-ghost" type="button" onClick={endEditBlog}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <h4 className="text-lg font-semibold text-brown-900">{blog.title}</h4>
                          <p className="text-brown-600">{blog.excerpt || blog.content?.substring(0, 100) + '...'}</p>
                          <div className="flex gap-4 text-sm text-brown-500">
                            {blog.category && <span><strong>Category:</strong> {blog.category}</span>}
                            {blog.tags && <span><strong>Tags:</strong> {blog.tags}</span>}
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button className="btn btn-ghost" type="button" onClick={()=>beginEditBlog(idx)}>Edit</button>
                            <button className="btn btn-ghost text-red-600" type="button" onClick={()=>handleBlogDelete(blog.id)}>Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {blogMsg && <div className="mt-4 text-sm text-brown-700 bg-beige-50 p-3 rounded">{blogMsg}</div>}
          </div>
        )}
      </div>
    </Layout>
    </AdminAuth>
  )
}