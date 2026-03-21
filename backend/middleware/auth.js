import jwt from 'jsonwebtoken'

export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Access token is required' })
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'Server JWT configuration is missing' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    return next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
