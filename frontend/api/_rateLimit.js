// Simple in-memory rate limiter for Vercel serverless (stateless, per-instance)
// Usage: import rateLimit from './_rateLimit'
// Call rateLimit(req, res, { windowMs, max, keyFn }) at the top of your handler

const buckets = new Map()

export default function rateLimit(req, res, opts = {}) {
  const windowMs = opts.windowMs || 60 * 1000 // 1 minute
  const max = opts.max || 10
  const keyFn = opts.keyFn || (r => r.headers['x-forwarded-for'] || r.connection?.remoteAddress || 'anon')
  const now = Date.now()
  const key = keyFn(req)
  let bucket = buckets.get(key)
  if (!bucket || now - bucket.start > windowMs) {
    bucket = { count: 1, start: now }
  } else {
    bucket.count++
  }
  buckets.set(key, bucket)
  if (bucket.count > max) {
    res.setHeader('Retry-After', Math.ceil((bucket.start + windowMs - now) / 1000))
    res.status(429).json({ error: 'Too many requests' })
    return false
  }
  return true
}
