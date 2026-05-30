import { useState, useEffect } from 'react'
import { usePqrs } from '../hooks/usePqrs'
import { Send, FileText, Flame, Shield, Sparkles, CheckCircle, Clock } from 'lucide-react'

const PQRS_TYPES = [
  { id: 'question', label: 'Pregunta', icon: FileText, ds: 'Resuelve una duda' },
  { id: 'complaint', label: 'Queja', icon: Flame, ds: 'Reporta una molestia' },
  { id: 'claim', label: 'Reclamo', icon: Shield, ds: 'Exige una solución' },
  { id: 'suggestion', label: 'Sugerencia', icon: Sparkles, ds: 'Ayúdanos a mejorar' },
]

function statusBadge(s: string) {
  if (s === 'resolved' || s === 'closed') return 'badge-success'
  if (s === 'in_progress') return 'badge-primary'
  return 'badge-muted'
}

function statusLabel(s: string) {
  if (s === 'resolved') return 'Resuelto'
  if (s === 'closed') return 'Cerrado'
  if (s === 'in_progress') return 'En proceso'
  return 'Recibido'
}

export default function PQRS() {
  const { requests, loading, fetch, create } = usePqrs()
  const [tab, setTab] = useState<'new' | 'mine'>('new')
  const [type, setType] = useState('question')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetch() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const fullMessage = subject ? `[${subject}] ${message}` : message
      await create(type, fullMessage)
      setSent(true)
      setSubject('')
      setMessage('')
      fetch()
      setTimeout(() => setSent(false), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar')
    }
  }

  return (
    <>
      <section className="page-head">
        <div className="page-head-glow" />
        <div className="container container-wide page-head-inner">
          <span className="eyebrow"><span className="bar" />Soporte</span>
          <h1>PQRS</h1>
          <p>Peticiones, Quejas, Reclamos y Sugerencias. Te respondemos en menos de 48 horas.</p>
        </div>
      </section>

      <section className="section">
        <div className="container container-wide" style={{ maxWidth: 760 }}>
          <div className="tickets-tabs" style={{ justifyContent: 'flex-start' }}>
            <button className={`ttab ${tab === 'new' ? 'active' : ''}`} onClick={() => setTab('new')}>
              Nueva solicitud
            </button>
            <button className={`ttab ${tab === 'mine' ? 'active' : ''}`} onClick={() => setTab('mine')}>
              Mis solicitudes{requests.length > 0 ? ` (${requests.length})` : ''}
            </button>
          </div>

          {tab === 'new' ? (
            <div className="card" style={{ padding: '2rem' }}>
              {sent && (
                <div className="form-success">
                  <CheckCircle size={18} /> Tu solicitud fue radicada. Te notificaremos por correo.
                </div>
              )}
              {error && <div className="alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}
              <form onSubmit={handleSubmit}>
                <label className="form-label" style={{ marginBottom: '0.8rem' }}>Tipo de solicitud</label>
                <div className="pqrs-type-grid">
                  {PQRS_TYPES.map(t => {
                    const Icon = t.icon
                    return (
                      <button
                        key={t.id}
                        type="button"
                        className={`pqrs-type ${type === t.id ? 'sel' : ''}`}
                        onClick={() => setType(t.id)}
                      >
                        <div className="pt-ic"><Icon size={19} /></div>
                        <div className="pt-nm">{t.label}</div>
                        <div className="pt-ds">{t.ds}</div>
                      </button>
                    )
                  })}
                </div>
                <div style={{ marginBottom: '1.1rem' }}>
                  <label className="form-label">Asunto</label>
                  <input
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Resume tu solicitud"
                    required
                  />
                </div>
                <div style={{ marginBottom: '1.4rem' }}>
                  <label className="form-label">Mensaje</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Cuéntanos los detalles…"
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <button type="submit" className="btn btn-cta btn-lg" disabled={loading || !message.trim()}>
                  {loading
                    ? <span className="spinner" style={{ width: 20, height: 20 }} />
                    : <><Send size={17} /> Enviar solicitud</>
                  }
                </button>
              </form>
            </div>
          ) : (
            <div className="pqrs-list">
              {requests.length === 0 ? (
                <div className="empty">
                  <div className="empty-ic"><FileText size={34} /></div>
                  <h3>Sin solicitudes</h3>
                  <p>No has enviado ninguna solicitud aún.</p>
                </div>
              ) : (
                requests.map(req => (
                  <div key={req.id} className="pqrs-item">
                    <div className="pqrs-item-head">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <span className="badge badge-primary">
                          {PQRS_TYPES.find(t => t.id === req.type)?.label || req.type}
                        </span>
                      </div>
                      <span className={`badge ${statusBadge(req.status)}`}>
                        {statusLabel(req.status)}
                      </span>
                    </div>
                    <div className="msg">{req.message.substring(0, 200)}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
                      {new Date(req.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    {req.responses.length > 0 ? (
                      <div className="reply">
                        <b style={{ color: 'var(--color-primary)' }}>Respuesta NovaPass · </b>
                        {req.responses[req.responses.length - 1].message.substring(0, 200)}
                      </div>
                    ) : (
                      <div style={{ marginTop: '0.7rem', fontSize: '0.8rem', color: 'var(--color-cta)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={14} /> En espera de respuesta del equipo
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
