import express from 'express'
import File from '../models/File.js'
import { verifyToken, verifyAdmin } from '../utils/auth.js'

const router = express.Router()

// Get pending files
router.get('/pending', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const files = await File.find({ status: 'pending' })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
    res.json(files)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Approve file
router.put('/approve/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const file = await File.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).populate('uploadedBy', 'name')
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }
    res.json(file)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Reject file
router.put('/reject/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const file = await File.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).populate('uploadedBy', 'name')
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }
    res.json(file)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete any file
router.delete('/files/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id)
    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }
    res.json({ message: 'File deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router

