// frontend/api/documents.js (Vercel serverless handler)
import jwt from 'jsonwebtoken';
import { getDb } from '../../backend/config/database.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token', details: err.message });
    }

    try {
        const db = getDb();

        if (req.method === 'GET') {
            const snapshot = await db
                .collection('documents')
                .where('userId', '==', decoded.userId)
                .get();

            const documents = snapshot.docs.map((doc) => ({
                id: doc.id,
                filename: doc.data().filename || null,
                file_type: doc.data().file_type || null,
                file_size: doc.data().file_size || null,
                created_at: doc.data().createdAt?.toDate?.()?.toISOString() || null,
            }));

            return res.json({ documents });
        }

        if (req.method === 'DELETE') {
            const id = req.query.id;
            if (!id) return res.status(400).json({ error: 'Document id is required' });

            const docRef = db.collection('documents').doc(id);
            const snapshot = await docRef.get();
            if (!snapshot.exists) return res.status(404).json({ error: 'Document not found' });
            if (snapshot.data().userId !== decoded.userId) {
                return res.status(404).json({ error: 'Document not found' });
            }
            await docRef.delete();
            return res.json({ message: 'Document deleted' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('Documents handler error:', err.message);
        return res.status(500).json({ error: 'Server error', details: err.message });
    }
}
