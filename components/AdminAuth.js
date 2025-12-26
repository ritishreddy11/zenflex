import { useState } from 'react'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'changeme123'

export default function AdminAuth({ children }) {
  const [entered, setEntered] = useState(false)
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (pass.trim() === ADMIN_PASSWORD) {
      setEntered(true)
      setError('')
    } else {
      setError('Incorrect password')
      setPass('')
    }
  }
  function handleLogout() {
    setEntered(false)
    setPass('')
    setError('')
  }

  if (!entered) return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-md w-96 border border-beige-200 flex flex-col items-center">
        <h2 className="mb-6 text-2xl font-bold text-brand">Admin Login</h2>
        <input
          type="password"
          className="mb-4 w-full p-3 border border-beige-200 rounded focus:outline-brand text-lg"
          placeholder="Enter admin password"
          value={pass}
          autoFocus
          onChange={e => setPass(e.target.value)}
        />
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button type="submit" className="btn btn-primary w-full py-2 text-lg font-semibold">Login</button>
      </form>
    </div>
  )

  return (
    <div>
      <div className="text-right max-w-5xl mx-auto mt-2 pr-4">
        <button className="text-xs bg-beige-100 hover:bg-beige-200 px-3 py-1 rounded border border-beige-300 text-brown-700" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {children}
    </div>
  )
}

