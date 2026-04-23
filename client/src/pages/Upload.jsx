import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const Upload = ({ user }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    semester: '',
    subject: ''
  })
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()

  const categories = ['Notes', 'Practicals', 'Termwork', 'Model Set', 'PYQs', 'Question Bank', 'Books', 'Syllabus']

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      toast.error('Please select a PDF file')
      return
    }

    const uploadData = new FormData()
    uploadData.append('title', formData.title)
    uploadData.append('description', formData.description)
    uploadData.append('category', formData.category)
    uploadData.append('semester', formData.semester)
    uploadData.append('subject', formData.subject)
    uploadData.append('file', file)

    setUploading(true)
    setProgress(0)

    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/files', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setProgress(percent)
        }
      })

      toast.success('File uploaded successfully! Awaiting admin approval.')
      navigate('/files')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Study Material</h1>
        <p className="text-gray-600 mb-8">Share your notes with fellow CSE students</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. DBMS Notes Sem 4"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              placeholder="Brief description of the content..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester *</label>
              <select
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                value={formData.semester}
                onChange={(e) => setFormData({...formData, semester: e.target.value})}
              >
                <option value="">Select semester</option>
                {[1,2,3,4,5,6].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Microprocessor, Data Structure"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PDF File * (Max 10MB)
            </label>
            <input
              type="file"
              required
              accept=".pdf"
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          {uploading && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">Uploading...</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                {progress === 0 ? 'Preparing...' : `${progress}% complete`}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Uploaded files go through admin approval before becoming publicly available.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Upload

