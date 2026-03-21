import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { getDb } from '../config/database.js'

dotenv.config()

async function main() {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set in environment. Please configure it before running this script.')
    process.exit(1)
  }

  try {
    const db = getDb()

    const email = 'test.rag@example.com'
    const name = 'Test RAG User'

    // Find or create user
    const existingSnapshot = await db.collection('users').where('email', '==', email).limit(1).get()
    let user

    if (existingSnapshot.empty) {
      const now = new Date()
      const insertUser = await db.collection('users').add({
        google_id: 'test-rag-google-id',
        email,
        name,
        picture_url: null,
        createdAt: now,
        updatedAt: now,
      })
      user = { id: insertUser.id, email }
      console.log('Created test user:', user)
    } else {
      const doc = existingSnapshot.docs[0]
      user = { id: doc.id, email: doc.data().email }
      console.log('Reusing existing test user:', user)
    }

    // Insert test document
    const sampleContent = [
      'Acme Corp Refund Policy:',
      'Customers may request a refund within 30 days of purchase,',
      'provided they have a valid receipt or proof of purchase.',
      'Refunds are processed to the original payment method.',
      '',
      'Support Contact:',
      'If you have questions about your refund, contact support@acme.test.',
    ].join(' ')

    const now = new Date()
    const insertDoc = await db.collection('documents').add({
      userId: user.id,
      filename: 'test-refund-policy.txt',
      content: sampleContent,
      file_type: 'txt',
      file_size: sampleContent.length,
      createdAt: now,
      updatedAt: now,
    })

    const document = {
      id: insertDoc.id,
      filename: 'test-refund-policy.txt',
      created_at: now.toISOString(),
    }
    console.log('Created test document:', document)

    // Generate JWT for this user
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    console.log('\n=== Test Data for Phase 6 ===')
    console.log('User ID:      ', user.id)
    console.log('Document ID:  ', document.id)
    console.log('JWT (token):  ', token)

    console.log('\nSample /chat request (through backend, no /api proxy):')
    console.log('POST http://localhost:5000/chat')
    console.log('Headers: Authorization: Bearer <token>')
    console.log('Body:')
    console.log(JSON.stringify({
      question: 'What is the refund policy?',
      documentId: document.id,
    }, null, 2))

    console.log('\nSample frontend-proxy request (if using Vite proxy):')
    console.log('POST http://localhost:5173/api/chat')
  } catch (error) {
    console.error('Failed to seed test data:', error.message || error)
  }
}

main().catch((err) => {
  console.error('Unexpected error in seedTestDocument:', err)
  process.exit(1)
})
