import admin from 'firebase-admin';

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
  // Expect JWT in Authorization header as 'Bearer <token>'
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getFirestore();
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

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
