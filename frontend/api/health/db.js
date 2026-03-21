// Vercel Serverless Function: /api/health/db
import { checkDbConnection } from '../../backend/config/database.js';
export default async function handler(req, res) {
  try {
    const result = await checkDbConnection();
    if (result.connected) {
      res.status(200).json({ status: 'connected' });
    } else {
      res.status(500).json({ status: 'disconnected', error: result.error });
    }
  } catch (error) {
    res.status(500).json({ status: 'disconnected', error: error.message });
  }
}
