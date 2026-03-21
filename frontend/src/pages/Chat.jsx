import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'

function Chat() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: 'Welcome. This is the basic chat UI for Phase 5. Ask anything to see a mock response.',
    },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const nextIdRef = useRef(2)

  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending])

  const handleSend = async (event) => {
    event.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    const userMessage = { id: nextIdRef.current++, role: 'user', text }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setError('')
    setSending(true)

    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.post(
        '/api/chat',
        { message: text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const assistantMessage = {
        id: nextIdRef.current++,
        role: 'assistant',
        text: response.data.reply,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1>Basic Chat</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button type="button" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', minHeight: 360 }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              marginBottom: '0.75rem',
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '75%',
                padding: '0.6rem 0.8rem',
                borderRadius: 8,
                background: message.role === 'user' ? '#007bff' : '#f1f3f5',
                color: message.role === 'user' ? '#fff' : '#222',
                whiteSpace: 'pre-wrap',
              }}
            >
              {message.text}
            </div>
          </div>
        ))}

        {sending ? (
          <div
            style={{
              marginBottom: '0.75rem',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '75%',
                padding: '0.6rem 0.8rem',
                borderRadius: 8,
                background: '#f1f3f5',
                color: '#222',
                fontStyle: 'italic',
              }}
            >
              AI is typing...
            </div>
          </div>
        ) : null}
      </div>

      {error ? (
        <div style={{ marginTop: '0.75rem', color: '#900', background: '#fee', padding: '0.75rem', borderRadius: 8 }}>
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSend} style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message"
          style={{ flex: 1, padding: '0.65rem', border: '1px solid #ccc', borderRadius: 8 }}
          disabled={sending}
        />
        <button type="submit" disabled={!canSend}>
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

export default Chat
