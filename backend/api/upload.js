




import formidable from 'formidable';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import jwt from 'jsonwebtoken';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export const config = {
  api: {
    bodyParser: false,
  },
};


function getDb() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    })
  }
  return getFirestore()
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

  // --- Begin new JWT auth check ---
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  console.log('Auth header present:', !!authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No bearer token found');
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);
  console.log('JWT_SECRET present:', !!process.env.JWT_SECRET);
  console.log('Token length:', token.length);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully:', decoded.userId);
  } catch (err) {
    console.log('JWT verify error:', err.message);
    return res.status(401).json({ error: 'Invalid token', details: err.message });
  }
  const userId = decoded.userId;
  // --- End new JWT auth check ---

  const form = new formidable();
  form.maxFileSize = 10 * 1024 * 1024;
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
        extractedText = file.filepath ? fs.readFileSync(file.filepath, 'utf-8') : file.buffer.toString('utf-8');
      } else if (file.mimetype === 'application/pdf') {
        const buffer = file.filepath ? fs.readFileSync(file.filepath) : file.buffer;
        const result = await pdfParse(buffer);
        extractedText = (result.text || '').trim();
      } else {
        return res.status(400).json({ error: 'Unsupported file type' });
      }
      if (!extractedText) {
        return res.status(422).json({ error: 'Unable to extract text from this file' });
      }
      const db = getDb();
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


  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // --- Begin new JWT auth check ---
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  console.log('Auth header present:', !!authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No bearer token found');
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);
  console.log('JWT_SECRET present:', !!process.env.JWT_SECRET);
  console.log('Token length:', token.length);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully:', decoded.userId);
  } catch (err) {
    console.log('JWT verify error:', err.message);
    return res.status(401).json({ error: 'Invalid token', details: err.message });
  }
  const userId = decoded.userId;
  // --- End new JWT auth check ---

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
      const db = getDb();
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
import jwt from 'jsonwebtoken'
import fs from 'fs'
import { IncomingForm } from 'formidable'
import pdfParse from 'pdf-parse'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export const config = { api: { bodyParser: false } }

function getDb() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, '\n')
      })
    })
  }
  return getFirestore()
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }
  const token = authHeader.substring(7)
  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
  const userId = decoded.userId

  const form = new IncomingForm({ maxFileSize: 10 * 1024 * 1024 })
  
  return new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400).json({ error: err.message })
        return resolve()
      }
      const file = Array.isArray(files.file) ? files.file[0] : files.file
      if (!file) {
        res.status(400).json({ error: 'No file uploaded' })
        return resolve()
      }

      try {
        let extractedText = ''
        const buffer = fs.readFileSync(file.filepath)
        if (file.mimetype === 'text/plain') {
          extractedText = buffer.toString('utf-8')
        } else if (file.mimetype === 'application/pdf') {
          const result = await pdfParse(buffer)
          extractedText = result.text?.trim() || ''
        } else {
          res.status(400).json({ error: 'Only PDF and TXT files are allowed' })
          return resolve()
        }

        if (!extractedText) {
          res.status(422).json({ error: 'Unable to extract text from file' })
          return resolve()
        }

        const db = getDb()
        const createdAt = new Date()
        const ref = await db.collection('documents').add({
          userId,
          filename: file.originalFilename,
          content: extractedText,
          file_type: file.mimetype,
          file_size: file.size,
          createdAt,
          updatedAt: createdAt
        })

        res.status(201).json({
          document: {
            id: ref.id,
            filename: file.originalFilename,
            file_type: file.mimetype,
            file_size: file.size,
            created_at: createdAt.toISOString()
          }
        })
        resolve()
      } catch (error) {
        res.status(500).json({ error: 'Failed to process file', details: error.message })
        resolve()
      }
    })
  })
}
import jwt from 'jsonwebtoken'
import fs from 'fs'
import { IncomingForm } from 'formidable'
import pdfParse from 'pdf-parse'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export const config = { api: { bodyParser: false } }

function getDb() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, '\n')
      })
    })
  }
  return getFirestore()
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }
  const token = authHeader.substring(7)
  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
  const userId = decoded.userId

  const form = new IncomingForm({ maxFileSize: 10 * 1024 * 1024 })

  return new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400).json({ error: err.message })
        return resolve()
      }
      const file = Array.isArray(files.file) ? files.file[0] : files.file
      if (!file) {
        res.status(400).json({ error: 'No file uploaded' })
        return resolve()
      }
      try {
        let extractedText = ''
        const buffer = fs.readFileSync(file.filepath)
        if (file.mimetype === 'text/plain') {
          extractedText = buffer.toString('utf-8')
        } else if (file.mimetype === 'application/pdf') {
          const result = await pdfParse(buffer)
          extractedText = result.text?.trim() || ''
        } else {
          res.status(400).json({ error: 'Only PDF and TXT files are allowed' })
          return resolve()
        }
        if (!extractedText) {
          res.status(422).json({ error: 'Unable to extract text from file' })
          return resolve()
        }
        const db = getDb()
        const createdAt = new Date()
        const ref = await db.collection('documents').add({
          userId,
          filename: file.originalFilename,
          content: extractedText,
          file_type: file.mimetype,
          file_size: file.size,
          createdAt,
          updatedAt: createdAt
        })
        res.status(201).json({
          document: {
            id: ref.id,
            filename: file.originalFilename,
            file_type: file.mimetype,
            file_size: file.size,
            created_at: createdAt.toISOString()
          }
        })
        resolve()
      } catch (error) {
        res.status(500).json({ error: 'Failed to process file', details: error.message })
        resolve()
      }
    })
  })
}
import jwt from 'jsonwebtoken'
import fs from 'fs'
import { IncomingForm } from 'formidable'
import pdfParse from 'pdf-parse'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export const config = { api: { bodyParser: false } }

function getDb() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, '\n')
      })
    })
  }
  return getFirestore()
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }
  const token = authHeader.substring(7)
  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
  const userId = decoded.userId

  const form = new IncomingForm({ maxFileSize: 10 * 1024 * 1024 })

  return new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400).json({ error: err.message })
        return resolve()
      }
      const file = Array.isArray(files.file) ? files.file[0] : files.file
      if (!file) {
        res.status(400).json({ error: 'No file uploaded' })
        return resolve()
      }
      try {
        let extractedText = ''
        const buffer = fs.readFileSync(file.filepath)
        if (file.mimetype === 'text/plain') {
          extractedText = buffer.toString('utf-8')
        } else if (file.mimetype === 'application/pdf') {
          const result = await pdfParse(buffer)
          extractedText = result.text?.trim() || ''
        } else {
          res.status(400).json({ error: 'Only PDF and TXT files are allowed' })
          return resolve()
        }
        if (!extractedText) {
          res.status(422).json({ error: 'Unable to extract text from file' })
          return resolve()
        }
        const db = getDb()
        const createdAt = new Date()
        const ref = await db.collection('documents').add({
          userId,
          filename: file.originalFilename,
          content: extractedText,
          file_type: file.mimetype,
          file_size: file.size,
          createdAt,
          updatedAt: createdAt
        })
        res.status(201).json({
          document: {
            id: ref.id,
            filename: file.originalFilename,
            file_type: file.mimetype,
            file_size: file.size,
            created_at: createdAt.toISOString()
          }
        })
        resolve()
      } catch (error) {
        res.status(500).json({ error: 'Failed to process file', details: error.message })
        resolve()
      }
    })
  })
}
