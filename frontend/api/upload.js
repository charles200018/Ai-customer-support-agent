// Vercel Serverless Function: /api/upload
// Handles file upload and text extraction

import multer from 'multer';
import { authenticateToken } from '../../backend/middleware/auth.js';
import { extractTextFromFile, isSupportedFile } from '../../backend/utils/extractText.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await authenticateToken(req, res, () => {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({ error: 'File too large. Maximum allowed size is 10MB' });
          return;
        }
        res.status(500).json({ error: 'Failed to process file' });
        return;
      }
      try {
        if (!req.file) {
          res.status(400).json({ error: 'No file uploaded' });
          return;
        }
        if (!isSupportedFile(req.file)) {
          res.status(400).json({ error: 'Only PDF and TXT files are allowed' });
          return;
        }
        const extractedText = await extractTextFromFile(req.file);
        if (!extractedText) {
          res.status(422).json({ error: 'Unable to extract text from this file' });
          return;
        }
        res.json({
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
        res.status(500).json({ error: 'Failed to process file' });
      }
    });
  });
}
