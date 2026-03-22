


import jwt from 'jsonwebtoken';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';


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



  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

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

  const db = getDb();

  if (req.method === 'GET') {
    try {
      const snapshot = await db
        .collection('documents')
        .where('userId', '==', userId)
        .get();
      const documents = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            filename: data.filename || null,
            file_type: data.file_type || null,
            file_size: Number.isFinite(data.file_size) ? data.file_size : null,
            created_at: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : null,
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
      if (data.userId !== userId) {
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
}
