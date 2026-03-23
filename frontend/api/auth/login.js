import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

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

  const { googleToken } = req.body
  if (!googleToken) return res.status(400).json({ error: 'googleToken is required' })

  try {
    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload()
    if (!payload?.email) return res.status(401).json({ error: 'Invalid Google token' })

    const db = getDb()
    const usersRef = db.collection('users')
    const existing = await usersRef.where('email', '==', payload.email).limit(1).get()

    let user
    if (!existing.empty) {
      const doc = existing.docs[0]
      user = { id: doc.id, email: doc.data().email, name: doc.data().name }
    } else {
      const now = new Date()
      const ref = await usersRef.add({
        google_id: payload.sub,
        email: payload.email,
        name: payload.name || null,
        picture_url: payload.picture || null,
        createdAt: now
      })
      user = { id: ref.id, email: payload.email, name: payload.name }
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    return res.json({ token, user })
  } catch (err) {
    return res.status(401).json({ error: 'Authentication failed', details: err.message })
  }
}
