export default function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '')
	res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
	if (req.method === 'OPTIONS') return res.status(200).end()
	return res.json({ message: 'Logged out successfully' })
}
// ...existing code...
