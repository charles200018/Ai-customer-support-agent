import jwt from 'jsonwebtoken'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

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
  const db = getDb()

  if (req.method === 'GET') {
    try {
      const snapshot = await db.collection('documents').where('userId', '==', userId).get()
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        filename: doc.data().filename || null,
        file_type: doc.data().file_type || null,
        file_size: doc.data().file_size || null,
        created_at: doc.data().createdAt?.toDate?.()?.toISOString() || null
      }))
      return res.json({ documents })
    } catch (error) {
      return res.status(500).json({ error: 'Failed to load documents' })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Document id required' })
    try {
      await db.collection('documents').doc(id).delete()
      return res.json({ message: 'Document deleted' })
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete document' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
