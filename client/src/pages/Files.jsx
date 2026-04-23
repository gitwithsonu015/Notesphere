import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Files = ({ user }) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    semester: '',
    status: 'approved'
  })

  useEffect(() => {
    fetchFiles()
  }, [filters])

  const fetchFiles = async () => {
    try {
      const params = new URLSearchParams(filters)
      const { data } = await axios.get(`/api/files?${params}`)
      setFiles(data)
    } catch (error) {
      toast.error('Failed to fetch files')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (fileId) => {
    try {
      await axios.get(`/api/files/${fileId}/download`, { 
        responseType: 'blob',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      // Note: In real app, use FileSaver.js or window.open(file.downloadUrl)
      toast.success('Download started!')
    } catch (error) {
      toast.error('Download failed')
    }
  }

  const categories = ['All', 'Notes', 'Practicals', 'Termwork', 'Model Set', 'PYQs', 'Question Bank', 'Books', 'Syllabus']

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Study Materials</h1>
        <p className="text-xl text-gray-600">Browse approved files for CSE (SBTE)</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
            <select
              value={filters.semester}
              onChange={(e) => setFilters({...filters, semester: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Semesters</option>
              {[1,2,3,4,5,6].map(s => <option key={s} value={s}>Sem {s}</option>)}
            </select>
          </div>
        </div>
        <button
          onClick={fetchFiles}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
        >
          Apply Filters
        </button>
      </div>

      {/* Files Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.length === 0 ? (
          <div className="md:col-span-3 text-center py-20">
            <div className="text-6xl text-gray-300 mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No files found</h3>
            <p className="text-gray-500">Try adjusting your filters or upload new materials</p>
          </div>
        ) : (
          files.map(file => (
            <div key={file._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    file.status === 'approved' ? 'bg-green-100 text-green-800' : 
                    file.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {file.status.toUpperCase()}
                  </span>
                  <span className="text-2xl font-bold text-gray-900">{file.downloads || 0} ↓</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{file.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{file.description}</p>
                <div className="space-y-1 text-sm text-gray-500 mb-6">
                  <div><span className="font-semibold">Category:</span> {file.category}</div>
                  <div><span className="font-semibold">Semester:</span> Sem {file.semester}</div>
                  <div><span className="font-semibold">Subject:</span> {file.subject}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(file._id)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    Download PDF
                  </button>
                  {file.status !== 'approved' && user.role === 'admin' && (
                    <button className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold">
                      Approve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Files

