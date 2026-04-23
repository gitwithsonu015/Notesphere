import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Files from './pages/Files'
import Upload from './pages/Upload'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import toast from 'react-hot-toast'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const userData = JSON.parse(localStorage.getItem('user'))
        setUser(userData)
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    toast.success('Welcome to Notesphere!')
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully!')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {user && <Navbar user={user} logout={logout} />}
      
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={user ? <Navigate to="/files" /> : <Login login={login} />} />
        <Route path="/register" element={user ? <Navigate to="/files" /> : <Register login={login} />} />
        <Route path="/files" element={<ProtectedRoute user={user}><Files user={user} /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute user={user}><Upload user={user} /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute user={user}><AdminDashboard user={user} /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App

