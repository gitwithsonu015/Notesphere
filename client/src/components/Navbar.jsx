import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Upload, FileText, Shield } from 'lucide-react'

const Navbar = ({ user, logout }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-lg backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Notesphere
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/files" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              <FileText className="w-5 h-5" />
              Files
            </Link>
            
            <Link 
              to="/upload" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              <Upload className="w-5 h-5" />
              Upload
            </Link>

            {user.role === 'admin' && (
              <Link 
                to="/admin" 
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium shadow-md"
              >
                <Shield className="w-5 h-5" />
                Admin
              </Link>
            )}
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">{user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

