import { getDb } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

export default async function handler(req, res) {
  await authenticateToken(req, res, async () => {
    const db = getDb();
    if (req.method === 'GET') {
      try {
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
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Document id required' });
      }
      try {
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
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  });
}
