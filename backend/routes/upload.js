const express = require('express');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth.js');
const { extractTextFromFile, isSupportedFile } = require('../utils/extractText.js');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
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

    return res.json({
      message: 'File processed successfully',
      file: {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
      extractedText,
      preview: extractedText.slice(0, 1000),
      extractedChars: extractedText.length,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to process file' });
  }
});

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum allowed size is 10MB' });
  }
  return next(error);
});

module.exports = router;
