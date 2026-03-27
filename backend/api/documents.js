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
  // Test response first
  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    if (req.method === 'OPTIONS') return res.status(200).end()

    // Debug env vars
    const envDebug = {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? '[set]' : '[missing]',
      JWT_SECRET: process.env.JWT_SECRET ? '[set]' : '[missing]'
    }
    console.log('ENV DEBUG:', envDebug)

    const authHeader = req.headers['authorization']
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No token provided')
      return res.status(401).json({ error: 'No token provided' })
    }
    const token = authHeader.substring(7)
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      console.error('JWT verification failed:', err)
      return res.status(401).json({ 
        error: 'Invalid token', 
        jwtSecretExists: !!process.env.JWT_SECRET,
        details: err.message 
      })
    }

    // Test Firebase init
    let db
    try {
      db = getDb()
      console.log('Firebase initialized successfully')
    } catch (fbErr) {
      console.error('Firebase init error:', fbErr)
      return res.status(500).json({ 
        error: 'Firebase init failed', 
        details: fbErr.message,
        envDebug
      })
    }

    if (req.method === 'GET') {
      const snapshot = await db.collection('documents')
        .where('userId', '==', decoded.userId).get()
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        filename: doc.data().filename || null,
        file_type: doc.data().file_type || null,
        file_size: doc.data().file_size || null,
        created_at: doc.data().createdAt?.toDate?.()?.toISOString() || null
      }))
      return res.json({ documents })
    }

    return res.status(405).json({ error: 'Method not allowed' })

  } catch (globalErr) {
    console.log('Global error:', globalErr.message)
    return res.status(500).json({ 
      error: 'Server error', 
      details: globalErr.message 
    })
  }
}
