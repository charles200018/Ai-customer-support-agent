import admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()

let app

export function getFirebaseApp() {
  if (admin.apps.length > 0) {
    return admin.app()
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  let privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase credentials in environment variables')
  }

  if (
    projectId.includes('your-firebase-project-id') ||
    clientEmail.includes('your-service-account-client-email') ||
    privateKey.includes('YOUR_PRIVATE_KEY')
  ) {
    throw new Error('Firebase credentials are placeholders. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY from a real service account key.')
  }

  // If the key was wrapped in quotes manually, remove them.
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1)
  }

  // Handle escaped newlines in private key
  privateKey = privateKey.replace(/\\n/g, '\n')

  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  })

  return app
}

export function getFirestore() {
  const firebaseApp = getFirebaseApp()
  return admin.firestore(firebaseApp)
}
export function getAuth() {
  const firebaseApp = getFirebaseApp()
  return admin.auth(firebaseApp)
}