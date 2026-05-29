import { useState, useEffect } from 'react'
import { usePqrs } from '../hooks/usePqrs'
import { Send, MessageCircle, FileText } from 'lucide-react'

const TYPES = [
  { value: 'question', label: 'Pregunta' },
  { value: 'complaint', label: 'Queja' },
  { value: 'claim', label: 'Reclamo' },
  { value: 'suggestion', label: 'Sugerencia' },
]

const STATUS_MAP: Record<string, string> = {
  pending: 'Pendiente',
  in_progress: 'En gestión',
  resolved: 'Resuelto',
  closed: 'Cerrado',
}

export default function PQRS() {
  const { requests, loading, fetch, create } = usePqrs()
  const [type, setType] = useState('question')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetch() }, [fetch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await create(type, message)
      setSubmitted(true)
      setMessage('')
      fetch()
      setTimeout(() => setSubmitted(false), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar')
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
            <FileText size={20} style={{ color: '#C084FC' }} />
            <h2 style={{ margin: 0 }}>PQRS</h2>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
            Preguntas, quejas, reclamos y sugerencias
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="grid-pqrs">
            {/* Form */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.0625rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
                Enviar Solicitud
              </h3>

              {submitted && (
                <div className="alert-success" style={{ marginBottom: '1rem', animation: 'slideInUp 0.3s ease forwards' }}>
                  Solicitud enviada correctamente
                </div>
              )}

              {error && (
                <div className="alert-error" style={{ marginBottom: '1rem' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label htmlFor="type">Tipo de solicitud</label>
                  <select id="type" value={type} onChange={e => setType(e.target.value)}>
                    {TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="message">Mensaje</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Describe tu solicitud en detalle..."
                    required
                    style={{ resize: 'vertical', minHeight: 120 }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !message.trim()}
                  style={{ opacity: !message.trim() ? 0.5 : 1 }}
                >
                  {loading
                    ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                    : <><Send size={16} /> Enviar Solicitud</>
                  }
                </button>
              </form>
            </div>

            {/* List */}
            <div>
              <h3 style={{ fontSize: '1.0625rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
                Mis Solicitudes
              </h3>
              {requests.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'rgba(147, 51, 234, 0.1)',
                    border: '1px solid rgba(147, 51, 234, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                  }}>
                    <MessageCircle size={24} style={{ color: '#C084FC' }} />
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    No has enviado solicitudes
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {requests.map(req => (
                    <div key={req.id} className="card" style={{ padding: '1rem 1.25rem' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.625rem',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                      }}>
                        <span className="badge badge-primary">
                          {TYPES.find(t => t.value === req.type)?.label || req.type}
                        </span>
                        <span className={`badge ${
                          req.status === 'resolved' || req.status === 'closed'
                            ? 'badge-success'
                            : 'badge-primary'
                        }`}>
                          {STATUS_MAP[req.status] || req.status}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text)',
                        marginBottom: '0.5rem',
                        lineHeight: 1.55,
                      }}>
                        {req.message.length > 120 ? req.message.substring(0, 120) + '…' : req.message}
                      </p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {new Date(req.created_at).toLocaleDateString('es-CO')}
                      </span>
                      {req.responses.length > 0 && (
                        <div style={{
                          marginTop: '0.875rem',
                          paddingTop: '0.875rem',
                          borderTop: '1px solid rgba(147, 51, 234, 0.15)',
                        }}>
                          <div style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#C084FC',
                            marginBottom: '0.375rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                          }}>
                            Respuesta
                          </div>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                            {req.responses[req.responses.length - 1].message.substring(0, 120)}
                            {req.responses[req.responses.length - 1].message.length > 120 ? '…' : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
