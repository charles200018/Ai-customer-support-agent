import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

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

function extractKeywords(question) {
	const stopwords = new Set(['the', 'and', 'for', 'are', 'with', 'that', 'this', 'from', 'have', 'your', 'what', 'when', 'where', 'which', 'will', 'would', 'could', 'should', 'into', 'about'])
	return [...new Set(question.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !stopwords.has(w)))]
}

function selectRelevantChunks(chunks, question, maxChunks = 3) {
	if (!chunks?.length) return []
	const keywords = extractKeywords(question)
	if (!keywords.length) return chunks.slice(0, maxChunks)
	const scored = chunks.map((chunk, i) => {
		const lower = chunk.toLowerCase()
		const score = keywords.reduce((s, kw) => s + (lower.split(kw).length - 1), 0)
		return { chunk, score, i }
	})
	return scored.filter(x => x.score > 0).sort((a, b) => b.score - a.score || a.i - b.i).slice(0, maxChunks).map(x => x.chunk)
}

export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
	if (req.method === 'OPTIONS') return res.status(200).end()
	if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

	const { userMessage, documentId } = req.body
	if (!userMessage) return res.status(400).json({ error: 'userMessage is required' })

	const groqApiKey = process.env.GROQ_API_KEY
	if (!groqApiKey) return res.status(500).json({ error: 'GROQ_API_KEY not set' })

	let systemPrompt = 'You are a helpful customer support agent.'

	if (documentId) {
		try {
			const db = getDb()
			const docSnap = await db.collection('documents').doc(documentId).get()
			if (docSnap.exists) {
				const chunks = docSnap.data().chunks || []
				const content = docSnap.data().content || ''
				const sourceChunks = chunks.length > 0 ? chunks : (content ? [content] : [])
				const relevant = selectRelevantChunks(sourceChunks, userMessage)
				if (relevant.length > 0) {
					systemPrompt = `You are a helpful customer support agent. Answer questions based on the document context below. If the answer is not in the context, say so.\n\nDocument context:\n${relevant.join('\n---\n')}`
				}
			}
		} catch (err) {
			console.error('Error fetching document:', err.message)
		}
	}

	try {
		const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${groqApiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'llama-3.1-8b-instant',
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: userMessage }
				]
			})
		})
		if (!groqRes.ok) {
			const err = await groqRes.text()
			return res.status(groqRes.status).json({ error: 'Groq API error', details: err })
		}
		const data = await groqRes.json()
		const answer = data.choices?.[0]?.message?.content || ''
		return res.json({ answer, reply: answer })
	} catch (err) {
		return res.status(500).json({ error: 'Internal server error', details: err.message })
	}
}
