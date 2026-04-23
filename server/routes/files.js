import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import File from '../models/File.js'
import { verifyToken } from '../utils/auth.js'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() === '.pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed'))
    }
  }
})

// Get approved files (public for students)
router.get('/', async (req, res) => {
  try {
    const { category, semester, status = 'approved' } = req.query
    
    const query = {
      status: status,
      ...(category && category !== 'All' && { category }),
      ...(semester && { semester: Number(semester) })
    }

    const files = await File.find(query)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(50)

    res.json(files)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Upload file
router.post('/', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { title, description, category, semester, subject } = req.body
    const fileUrl = `/uploads/${req.file.filename}`

    const file = new File({
      title,
      description,
      category,
      semester: Number(semester),
      subject,
      fileUrl,
      uploadedBy: req.user.id,
      status: 'pending'
    })

    await file.save()
    res.status(201).json(file)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single file
router.get('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate('uploadedBy', 'name')
    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }
    res.json(file)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Download track
router.get('/:id/download', verifyToken, async (req, res) => {
  try {
    const file = await File.findById(req.params.id)
    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    // Increment download count
    file.downloads += 1
    await file.save()

    // Redirect to file URL
    res.redirect(file.fileUrl)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get user uploads
router.get('/my-uploads', verifyToken, async (req, res) => {
  try {
    const files = await File.find({ uploadedBy: req.user.id })
      .sort({ createdAt: -1 })
    res.json(files)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router

