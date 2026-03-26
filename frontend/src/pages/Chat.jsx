import { useMemo, useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'

function Chat() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [messages, setMessages] = useState([{ id: 0, role: 'assistant', text: 'Welcome! Select a document and ask a question.' }])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [typing, setTyping] = useState(false)
  const [error, setError] = useState('')
  const [documents, setDocuments] = useState([])
  const [selectedDocId, setSelectedDocId] = useState('')
  const [docLoading, setDocLoading] = useState(true)
  const [docError, setDocError] = useState('')
  const nextIdRef = useRef(1)
  const chatEndRef = useRef()

  useEffect(() => {
    const fetchDocs = async () => {
      setDocLoading(true)
      try {
        const token = localStorage.getItem('authToken')
        const res = await axios.get('/api/documents', { headers: { Authorization: `Bearer ${token}` } })
        const docs = res.data.documents || []
        setDocuments(docs)
        if (docs.length > 0) setSelectedDocId(docs[0].id)
      } catch (err) {
        setDocError(err?.response?.data?.error || 'Failed to load documents')
      }
    }
    fetchDocs()
  }, [])
}

export default Chat
