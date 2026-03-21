import express from 'express';
import { getDb } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { splitContentIntoChunks } from '../utils/rag.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', async (req, res) => {
  const { filename, content, fileType, fileSize } = req.body;

  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ error: 'filename is required' });
  }

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'content is required' });
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
    return res.status(500).json({ error: 'Failed to store document' });
  }
});

router.get('/', async (req, res) => {
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

    return res.json({ documents });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load documents' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const db = getDb();
    const docRef = db.collection('documents').doc(id);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const data = snapshot.data();
    if (data.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await docRef.delete();

    return res.json({ message: 'Document deleted' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;
