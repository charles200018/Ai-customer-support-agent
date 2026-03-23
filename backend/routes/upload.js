// backend/routes/upload.js
// POST /api/upload – authenticated file upload, text extraction, Firestore storage

import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.js';
import { extractTextFromFile, isSupportedFile } from '../utils/extractText.js';
import { getDb } from '../config/database.js';
import { splitContentIntoChunks } from '../utils/rag.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!isSupportedFile(req.file)) {
      return res.status(400).json({ error: 'Only PDF and TXT files are allowed' });
    }

    const extractedText = await extractTextFromFile(req.file);
    if (!extractedText) {
      return res.status(422).json({ error: 'Unable to extract text from this file' });
    }

    // Split into RAG chunks so chat can retrieve context
    const chunks = splitContentIntoChunks(extractedText);

    const db = getDb();
    const createdAt = new Date();
    const ref = await db.collection('documents').add({
      userId: req.user.userId,
      filename: req.file.originalname,
      content: extractedText,
      chunks,
      file_type: req.file.mimetype,
      file_size: req.file.size,
      createdAt,
      updatedAt: createdAt,
    });

    return res.status(201).json({
      document: {
        id: ref.id,
        filename: req.file.originalname,
        file_type: req.file.mimetype,
        file_size: req.file.size,
        created_at: createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to process file', details: error.message });
  }
});

// Multer-specific error handler
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum allowed size is 10MB' });
  }
  return next(error);
});

export default router;
