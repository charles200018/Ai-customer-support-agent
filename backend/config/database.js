import { getFirestore } from './firebase.js'

function getDbErrorDetail(error) {
  if (!error) return 'Unknown database error'
  if (error.code) return error.code
  if (error.message) return error.message
  if (Array.isArray(error.errors) && error.errors.length > 0) {
    const firstError = error.errors[0]
    return firstError?.code || firstError?.message || String(firstError)
  }
  return String(error)
}

export function getDb() {
  return getFirestore()
}

export async function checkDbConnection() {
  try {
    const db = getDb()
    // Simple read to verify Firestore connectivity
    await db.collection('_health').limit(1).get()
    console.log('Database connection check: success (Firebase)')
    return { connected: true }
  } catch (error) {
    const detail = getDbErrorDetail(error)
    console.error('Database connection check: failed', detail)
    return { connected: false, error: detail }
  }
}

export async function initializeDatabase() {
  try {
    // Ensure Firestore can be initialized
    getDb()
    console.log('Database initialization complete (Firebase)')
  } catch (error) {
    console.error('Database initialization failed:', getDbErrorDetail(error))
  }
}
