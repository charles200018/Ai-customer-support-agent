// Vercel Serverless Function: /api/documents
// Handles POST, GET, DELETE for user documents

import { getDb } from '../../backend/config/database.js';
import { authenticateToken } from '../../backend/middleware/auth.js';
import { splitContentIntoChunks } from '../../backend/utils/rag.js';

export default async function handler(req, res) {
  await authenticateToken(req, res, async () => {
    if (req.method === 'POST') {
      const { filename, content, fileType, fileSize } = req.body;
      if (!filename || typeof filename !== 'string') {
        res.status(400).json({ error: 'filename is required' });
        return;
      }
      if (!content || typeof content !== 'string') {
        res.status(400).json({ error: 'content is required' });
        return;
      }
      try {
        const db = getDb();
        const createdAt = new Date();
        const chunks = splitContentIntoChunks(content);
        const payload = {
          userId: req.user.userId,
          filename: filename.trim(),
          content,
          chunks,
          file_type: fileType || null,
          file_size: Number.isFinite(fileSize) ? fileSize : null,
          createdAt,
          updatedAt: createdAt,
        };
        const ref = await db.collection('documents').add(payload);
        res.status(201).json({
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
        res.status(500).json({ error: 'Failed to store document' });
      }
      return;
    }
    if (req.method === 'GET') {
      try {
        const db = getDb();
        const snapshot = await db
          .collection('documents')
          .where('userId', '==', req.user.userId)
          .get();
        const documents = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              filename: data.filename || null,
              file_type: data.file_type || null,
              file_size: Number.isFinite(data.file_size) ? data.file_size : null,
              created_at: data.createdAt?.toDate?.().toISOString?.() || null,
            };
          })
          .sort((a, b) => {
            const aTime = a.created_at ? Date.parse(a.created_at) : 0;
            const bTime = b.created_at ? Date.parse(b.created_at) : 0;
            return bTime - aTime;
          });
        res.json({ documents });
      } catch (error) {
        res.status(500).json({ error: 'Failed to load documents' });
      }
      return;
    }
    if (req.method === 'DELETE') {
      const { id } = req.query;
      try {
        const db = getDb();
        const docRef = db.collection('documents').doc(id);
        const snapshot = await docRef.get();
        if (!snapshot.exists) {
          res.status(404).json({ error: 'Document not found' });
          return;
        }
        const data = snapshot.data();
        if (data.userId !== req.user.userId) {
          res.status(404).json({ error: 'Document not found' });
          return;
        }
        await docRef.delete();
        res.json({ message: 'Document deleted' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete document' });
      }
      return;
    }
    res.status(405).json({ error: 'Method not allowed' });
  });
}
