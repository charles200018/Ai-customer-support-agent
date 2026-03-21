
import formidable from 'formidable';
import admin from 'firebase-admin';
import pdfParse from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
  },
};

function getFirestore() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  return admin.firestore();
}

function getUserId(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.split(' ')[1];
  if (!token) return null;
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.userId;
  } catch {
    return null;
  }
}

function splitContentIntoChunks(content, chunkWordSize = 400) {
  if (!content || typeof content !== 'string') return [];
  const words = content.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkWordSize) {
    const chunk = words.slice(i, i + chunkWordSize).join(' ').trim();
    if (chunk) chunks.push(chunk);
  }
  return chunks;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const form = new formidable.IncomingForm({ maxFileSize: 10 * 1024 * 1024 });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    if (!['application/pdf', 'text/plain'].includes(file.mimetype)) {
      return res.status(400).json({ error: 'Only PDF and TXT files are allowed' });
    }
    let extractedText = '';
    try {
      if (file.mimetype === 'text/plain') {
        extractedText = file.filepath ? require('fs').readFileSync(file.filepath, 'utf-8') : file.buffer.toString('utf-8');
      } else if (file.mimetype === 'application/pdf') {
        const buffer = file.filepath ? require('fs').readFileSync(file.filepath) : file.buffer;
        const result = await pdfParse(buffer);
        extractedText = (result.text || '').trim();
      } else {
        return res.status(400).json({ error: 'Unsupported file type' });
      }
      if (!extractedText) {
        return res.status(422).json({ error: 'Unable to extract text from this file' });
      }
      const db = getFirestore();
      const createdAt = new Date();
      const chunks = splitContentIntoChunks(extractedText);
      const payload = {
        userId,
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
}
