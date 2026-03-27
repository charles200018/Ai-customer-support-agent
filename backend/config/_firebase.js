// Extracted shared getDb() for Firebase access
import { getFirestore } from './firebase.js'

export function getDb() {
  return getFirestore()
}
