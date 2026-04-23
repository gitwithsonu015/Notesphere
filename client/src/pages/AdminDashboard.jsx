import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AdminDashboard = ({ user }) => {
  const [pendingFiles, setPendingFiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPendingFiles()
  }, [])

  const fetchPendingFiles = async () => {
    try {
      const { data } = await axios.get('/api/admin/pending')
      setPendingFiles(data)
    } catch (error) {
      toast.error('Failed to fetch pending files')
    } finally {
      setLoading(false)
    }
  }

  const approveFile = async (fileId) => {
    try {
      await axios.put(`/api/admin/approve/${fileId}`)
      toast.success('File approved!')
      fetchPendingFiles()
    } catch (error) {
      toast.error('Approval failed')
    }
  }

  const rejectFile = async (fileId) => {
    try {
      await axios.put(`/api/admin/reject/${fileId}`)
      toast.success('File rejected!')
      fetchPendingFiles()
    } catch (error) {
      toast.error('Rejection failed')
    }
  }

  const deleteFile = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return
    
    try {
      await axios.delete(`/api/admin/files/${fileId}`)
      toast.success('File deleted!')
      fetchPendingFiles()
    } catch (error) {
      toast.error('Deletion failed')
    }
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    </div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-xl text-gray-600 mt-2">
            Manage file approvals and moderation ({pendingFiles.length} pending)
          </p>
        </div>
        <button
          onClick={fetchPendingFiles}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Refresh
        </button>
      </div>

      {pendingFiles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
          <div className="text-6xl text-gray-300 mb-6">✅</div>
          <h3 className="text-2xl font-bold text-gray-600 mb-2">No pending files</h3>
          <p className="text-gray-500">All uploads are up to date!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingFiles.map(file => (
            <div key={file._id} className="bg-white rounded-2xl shadow-lg p-8 border-l-8 border-yellow-500 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{file.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Sem {file.semester} • {file.category}</span>
                    <span>{file.subject}</span>
                    <span>by {file.uploadedBy?.name || 'Unknown'}</span>
                  </div>
                </div>
                <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                  PENDING
                </span>
              </div>
              
              <p className="text-gray-700 mb-8 line-clamp-3">{file.description}</p>
              
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <a 
                  href={file.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Preview PDF
                </a>
                <button
                  onClick={() => approveFile(file._id)}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => rejectFile(file._id)}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => deleteFile(file._id)}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

