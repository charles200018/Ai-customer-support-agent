import jwt from 'jsonwebtoken'
import { createRequire } from 'module'
import { IncomingForm } from 'formidable'
import fs from 'fs'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse')

export const config = { api: { bodyParser: false } }

function getDb() {
	if (getApps().length === 0) {
		let privateKey = process.env.FIREBASE_PRIVATE_KEY || ''
		if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
			privateKey = privateKey.slice(1, -1)
		}
		privateKey = privateKey.replace(/\\n/g, '\n')
		initializeApp({
			credential: cert({
				projectId: process.env.FIREBASE_PROJECT_ID,
				clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
				privateKey
			})
		})
	}
	return getFirestore()
}

function splitIntoChunks(text, size = 400) {
	const words = text.split(/\s+/).filter(Boolean)
	const chunks = []
	for (let i = 0; i < words.length; i += size) {
		chunks.push(words.slice(i, i + size).join(' '))
	}
	return chunks
}

export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
	if (req.method === 'OPTIONS') return res.status(200).end()
	if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

	const authHeader = req.headers['authorization']
	if (!authHeader?.startsWith('Bearer ')) {
		return res.status(401).json({ error: 'No token provided' })
	}
	let decoded
	try {
		decoded = jwt.verify(authHeader.substring(7), process.env.JWT_SECRET)
	} catch (err) {
		return res.status(401).json({ error: 'Invalid token' })
	}
	const userId = decoded.userId

	const form = new IncomingForm({ maxFileSize: 10 * 1024 * 1024 })

	return new Promise((resolve) => {
		form.parse(req, async (err, fields, files) => {
			if (err) {
				res.status(400).json({ error: err.message })
				return resolve()
			}
			const file = Array.isArray(files.file) ? files.file[0] : files.file
			if (!file) {
				res.status(400).json({ error: 'No file uploaded' })
				return resolve()
			}
			try {
				let extractedText = ''
				const buffer = fs.readFileSync(file.filepath)
				if (file.mimetype === 'text/plain') {
					extractedText = buffer.toString('utf-8').trim()
				} else if (file.mimetype === 'application/pdf') {
					const result = await pdfParse(buffer)
					extractedText = result.text?.trim() || ''
				} else {
					res.status(400).json({ error: 'Only PDF and TXT files are allowed' })
					return resolve()
				}
				if (!extractedText) {
					res.status(422).json({ error: 'Unable to extract text from file' })
					return resolve()
				}
				const chunks = splitIntoChunks(extractedText)
				const db = getDb()
				const createdAt = new Date()
				const ref = await db.collection('documents').add({
					userId,
					filename: file.originalFilename,
					content: extractedText,
					chunks,
					file_type: file.mimetype,
					file_size: file.size,
					createdAt,
					updatedAt: createdAt
				})
				res.status(201).json({
					document: {
						id: ref.id,
						filename: file.originalFilename,
						file_type: file.mimetype,
						file_size: file.size,
						created_at: createdAt.toISOString()
					},
					message: 'File uploaded and saved successfully'
				})
				resolve()
			} catch (error) {
				console.error('Upload error:', error.message)
				res.status(500).json({ error: 'Failed to process file', details: error.message })
				resolve()
			}
		})
	})
}
// ...existing code...
