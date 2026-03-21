import formidable from 'formidable';
import { getDb } from '../config/database.js';
import { splitContentIntoChunks } from '../utils/rag.js';
import { isSupportedFile, extractTextFromFile } from '../utils/extractText.js';
import { authenticateToken } from '../middleware/auth.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await authenticateToken(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    const form = new formidable.IncomingForm({ maxFileSize: 10 * 1024 * 1024 });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      const file = files.file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      if (!isSupportedFile(file)) {
        return res.status(400).json({ error: 'Only PDF and TXT files are allowed' });
      }
      try {
        const extractedText = await extractTextFromFile(file);
        if (!extractedText) {
          return res.status(422).json({ error: 'Unable to extract text from this file' });
        }
        const db = getDb();
        const createdAt = new Date();
        const chunks = splitContentIntoChunks(extractedText);
        const payload = {
          userId: req.user.userId,
          filename: file.originalFilename,
          content: extractedText,
          chunks,
          file_type: file.mimetype,
          file_size: file.size,
          createdAt,
          updatedAt: createdAt,
        };
        const ref = await db.collection('documents').add(payload);
        return res.status(201).json({
          document: {
            id: ref.id,
            user_id: payload.userId,
            filename: payload.filename,
            file_type: payload.file_type,
            file_size: payload.file_size,
            created_at: createdAt.toISOString(),
          },
        });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to process and store file', details: error.message });
      }
    });
  });
}
