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
	res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	if (req.method === 'OPTIONS') return res.status(200).end();

	const authHeader = req.headers['authorization'];
	if (!authHeader?.startsWith('Bearer ')) {
		return res.status(401).json({ error: 'No token provided' });
	}

	let decoded;
	try {
		decoded = jwt.verify(authHeader.substring(7), process.env.JWT_SECRET);
	} catch (err) {
		return res.status(401).json({ error: 'Invalid token' });
	}

	try {
		// Fetch full user record from Firestore so AuthContext gets all fields
		const db = getDb();
		const snapshot = await db.collection('users').doc(decoded.userId).get();
		if (!snapshot.exists) {
			return res.status(404).json({ error: 'User not found' });
		}
		const data = snapshot.data();
		const user = {
			id: snapshot.id,
			email: data.email,
			name: data.name || null,
			picture_url: data.picture_url || null,
			created_at: data.createdAt?.toDate?.()?.toISOString() || null,
			role: data.role || 'User'
		};
		return res.json({ user });
	} catch (err) {
		console.error('Verify error:', err);
		return res.status(500).json({ error: 'Failed to verify session' });
	}
}
