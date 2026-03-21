const DEFAULT_CHUNK_WORDS = 400
const MIN_KEYWORD_LENGTH = 3
const MAX_CONTEXT_CHUNKS = 3

const STOPWORDS = new Set([
  'the', 'and', 'for', 'are', 'with', 'that', 'this', 'from', 'have', 'your', 'what',
  'when', 'where', 'which', 'will', 'would', 'could', 'should', 'into', 'about',
  'their', 'there', 'them', 'they', 'been', 'was', 'were', 'not', 'but', 'you',
  'our', 'out', 'who', 'how', 'why', 'can', 'all', 'any', 'per', 'its', 'his',
  'her', 'she', 'him', 'had', 'has', 'did', 'does', 'too', 'very', 'more', 'than',
])

function normalizeWord(word) {
  return word.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function splitContentIntoChunks(content, chunkWordSize = DEFAULT_CHUNK_WORDS) {
  if (!content || typeof content !== 'string') {
    return []
  }

  const words = content.split(/\s+/).filter(Boolean)
  if (words.length === 0) {
    return []
  }

  const chunks = []
  for (let i = 0; i < words.length; i += chunkWordSize) {
    const chunk = words.slice(i, i + chunkWordSize).join(' ').trim()
    if (chunk) {
      chunks.push(chunk)
    }
  }

  return chunks
}

export function extractKeywords(question) {
  if (!question || typeof question !== 'string') {
    return []
  }

  const unique = new Set()
  const words = question.split(/\s+/)

  for (const rawWord of words) {
    const word = normalizeWord(rawWord)
    if (!word) continue
    if (word.length < MIN_KEYWORD_LENGTH) continue
    if (STOPWORDS.has(word)) continue
    unique.add(word)
  }

  return Array.from(unique)
}

export function selectRelevantChunks(chunks, question, maxChunks = MAX_CONTEXT_CHUNKS) {
  if (!Array.isArray(chunks) || chunks.length === 0) {
    return []
  }

  const keywords = extractKeywords(question)
  if (keywords.length === 0) {
    return chunks.slice(0, Math.max(1, Math.min(maxChunks, 5)))
  }

  const scored = chunks.map((chunk, index) => {
    const normalizedChunk = String(chunk || '').toLowerCase()
    let score = 0

    for (const keyword of keywords) {
      if (!keyword) continue
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const matches = normalizedChunk.match(new RegExp(`\\b${escaped}\\b`, 'g'))
      if (matches) {
        score += matches.length
      }
    }

    return { chunk: String(chunk || ''), score, index }
  })

  const filtered = scored
    .filter((item) => item.score > 0 && item.chunk.trim().length > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, Math.max(1, Math.min(maxChunks, 5)))

  return filtered.map((item) => item.chunk)
}
