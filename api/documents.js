import jwt from 'jsonwebtoken';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getDb() {
	if (getApps().length === 0) {
		let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
		if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
			privateKey = privateKey.slice(1, -1);
		}
		privateKey = privateKey.replace(/\\n/g, '\n');
		initializeApp({
			credential: cert({
				projectId: process.env.FIREBASE_PROJECT_ID,
				clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
				privateKey,
			}),
		});
	}
	return getFirestore();
}

export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	if (req.method === 'OPTIONS') return res.status(200).end();

	const authHeader = req.headers['authorization'];
	   if (!authHeader?.startsWith('Bearer ')) {
		   console.error('No token provided. Headers:', req.headers);
		   return res.status(401).json({ error: 'No token provided' });
	   }

	   let decoded;
	   try {
		   decoded = jwt.verify(authHeader.substring(7), process.env.JWT_SECRET);
	   } catch (err) {
		   console.error('JWT verification failed:', err, 'Token:', authHeader.substring(7), 'Secret:', process.env.JWT_SECRET);
		   return res.status(401).json({ error: 'Invalid token' });
	   }

	try {
		const db = getDb();

		if (req.method === 'GET') {
			const snapshot = await db
				.collection('documents')
				.where('userId', '==', decoded.userId)
				.orderBy('createdAt', 'desc')
				.limit(50)
				.get();
			const documents = snapshot.docs.map((doc) => ({
				id: doc.id,
				filename: doc.data().filename || null,
				file_type: doc.data().file_type || null,
				file_size: doc.data().file_size || null,
				created_at: doc.data().createdAt?.toDate?.()?.toISOString() || null,
			}));
			return res.json({ documents });
		}

		if (req.method === 'DELETE') {
			const id = req.query.id;
			if (!id) return res.status(400).json({ error: 'Document id is required' });
			const docRef = db.collection('documents').doc(id);
			const snapshot = await docRef.get();
			if (!snapshot.exists || snapshot.data().userId !== decoded.userId) {
				return res.status(404).json({ error: 'Document not found' });
			}
			await docRef.delete();
			return res.json({ message: 'Document deleted' });
		}

		return res.status(405).json({ error: 'Method not allowed' });
	   } catch (err) {
		   console.error('Documents handler error:', err);
		   return res.status(500).json({ error: 'Server error', details: err.message, stack: err.stack });
	   }
}
