import { Link } from 'react-router-dom'
import { ArrowRight, Download, Users, BookOpen } from 'lucide-react'

const Home = ({ user }) => {
  const categories = [
    'Notes', 'Practicals', 'Termwork', 'Model Set', 
    'PYQs', 'Question Bank', 'Books', 'Syllabus'
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Notesphere
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Complete study materials for Diploma CSE students (SBTE) - Sem 1 to 6
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/files" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Browse Files <ArrowRight className="w-5 h-5" />
          </Link>
          {!user && (
            <Link 
              to="/register" 
              className="border-2 border-gray-200 hover:border-gray-300 text-gray-800 px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300">
          <Download className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">8+ Categories</h3>
          <p className="text-gray-600">Notes, Practicals, PYQs & more</p>
        </div>
        <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300">
          <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Semester 1-6</h3>
          <p className="text-gray-600">CSE only (SBTE syllabus)</p>
        </div>
        <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300">
          <BookOpen className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Admin Approved</h3>
          <p className="text-gray-600">Quality controlled content</p>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Available Categories</h2>
        <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link 
              key={category}
              to="/files" 
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border hover:border-blue-200 text-center group"
            >
              <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 mb-2">{category}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home

