import { useState, useRef, useEffect } from 'react'
import { Send, X, MessageCircle, Bot, Sparkles } from 'lucide-react'

export function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: 'bot', text: '¡Hola! Soy Nova, tu asistente de NovaPass. ¿En qué te puedo ayudar hoy?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const text = input.trim()
    setInput('')
    setMessages(p => [...p, { role: 'user', text }])
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chatbot`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ message: text }),
        }
      )
      const data = await res.json()
      setMessages(p => [...p, { role: 'bot', text: data.response || data.message }])
    } catch {
      setMessages(p => [...p, { role: 'bot', text: 'Lo siento, hubo un error. Intenta de nuevo.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* FAB with pulse rings */}
      <div style={{
        position: 'fixed',
        bottom: '1.75rem',
        right: '1.75rem',
        zIndex: 200,
      }}>
        {!open && (
          <>
            <div style={{
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              border: '2px solid rgba(147, 51, 234, 0.45)',
              animation: 'pulse-ring 2.2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              border: '2px solid rgba(147, 51, 234, 0.25)',
              animation: 'pulse-ring 2.2s cubic-bezier(0.215, 0.61, 0.355, 1) 0.6s infinite',
              pointerEvents: 'none',
            }} />
          </>
        )}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Cerrar asistente' : 'Abrir asistente'}
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: open
              ? 'rgba(30, 25, 50, 0.95)'
              : 'linear-gradient(135deg, #9333EA, #7C3AED)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: open
              ? '0 4px 20px rgba(0,0,0,0.5)'
              : '0 4px 24px rgba(147, 51, 234, 0.55), 0 0 0 1px rgba(147, 51, 234, 0.3)',
            border: '1px solid rgba(147, 51, 234, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        >
          {open ? <X size={22} /> : <MessageCircle size={22} />}
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '5.5rem',
          right: '1.75rem',
          width: 360,
          maxWidth: 'calc(100vw - 2rem)',
          height: 520,
          maxHeight: 'calc(100vh - 8rem)',
          background: 'rgba(12, 10, 22, 0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(147, 51, 234, 0.25)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(147, 51, 234, 0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 199,
          overflow: 'hidden',
          animation: 'slideUp 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        }}>

          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(124, 58, 237, 0.1))',
            borderBottom: '1px solid rgba(147, 51, 234, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #9333EA, #7C3AED)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(147, 51, 234, 0.5)',
              flexShrink: 0,
            }}>
              <Bot size={18} color="white" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'white' }}>Nova</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: '#4ADE80' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', flexShrink: 0 }} />
                Asistente NovaPass
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Sparkles size={14} color="#C084FC" />
              <span style={{ fontSize: '0.7rem', color: '#C084FC', fontWeight: 600 }}>IA</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(147,51,234,0.2) transparent',
          }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                  gap: '0.5rem',
                  alignItems: 'flex-end',
                  animation: 'slideInUp 0.25s ease forwards',
                }}
              >
                {m.role === 'bot' && (
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #9333EA, #7C3AED)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Bot size={14} color="white" />
                  </div>
                )}
                <div style={{
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg, #9333EA, #7C3AED)'
                    : 'rgba(255, 255, 255, 0.06)',
                  color: 'white',
                  padding: '0.625rem 0.875rem',
                  borderRadius: m.role === 'user'
                    ? '16px 16px 4px 16px'
                    : '16px 16px 16px 4px',
                  maxWidth: '80%',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  border: m.role === 'user'
                    ? 'none'
                    : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: m.role === 'user'
                    ? '0 4px 12px rgba(147, 51, 234, 0.35)'
                    : 'none',
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #9333EA, #7C3AED)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Bot size={14} color="white" />
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '0.75rem 1rem',
                  borderRadius: '16px 16px 16px 4px',
                  display: 'flex',
                  gap: 5,
                  alignItems: 'center',
                }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <span key={i} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#C084FC',
                      animation: `pulse-ring 1.2s ease-in-out ${delay}s infinite`,
                      display: 'inline-block',
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '0.875rem 1rem',
            borderTop: '1px solid rgba(147, 51, 234, 0.15)',
            display: 'flex',
            gap: '0.625rem',
            background: 'rgba(0,0,0,0.2)',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Escribe tu mensaje..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(147,51,234,0.2)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.625rem 0.875rem',
                fontSize: '0.875rem',
                color: 'white',
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-sm)',
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg, #9333EA, #7C3AED)'
                  : 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(147,51,234,0.3)',
                color: input.trim() && !loading ? 'white' : '#7C7A99',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                transition: 'all var(--transition-fast)',
                flexShrink: 0,
              }}
              aria-label="Enviar"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
