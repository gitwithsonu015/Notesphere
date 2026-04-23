import mongoose from 'mongoose'

const fileSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Notes', 'Practicals', 'Termwork', 'Model Set', 'PYQs', 'Question Bank', 'Books', 'Syllabus']
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  subject: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  downloads: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
})

export default mongoose.model('File', fileSchema)

