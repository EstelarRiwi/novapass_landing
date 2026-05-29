import { useEffect, useState } from 'react'
import { useTickets } from '../hooks/useTickets'
import { Download, Calendar, QrCode, Ticket, Loader } from 'lucide-react'
import { Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function getToken() { return localStorage.getItem('token') ?? '' }

function statusBadge(status: string) {
  if (status === 'active')  return { cls: 'badge-success', label: 'Activa' }
  if (status === 'pending') return { cls: 'badge-warning', label: 'Pendiente' }
  if (status === 'used')    return { cls: 'badge-muted',   label: 'Usada' }
  return { cls: 'badge-error', label: 'Cancelada' }
}

export default function MisEntradas() {
  const { tickets, loading, fetch: fetchTickets } = useTickets()
  const [selected, setSelected] = useState<string | null>(null)
  const [qrBlobs, setQrBlobs] = useState<Record<string, string>>({})
  const [qrLoading, setQrLoading] = useState<Record<string, boolean>>({})
  const [pdfLoading, setPdfLoading] = useState<Record<string, boolean>>({})

  useEffect(() => { fetchTickets() }, [fetchTickets])

  const downloadPdf = async (ticketId: string) => {
    if (pdfLoading[ticketId]) return
    setPdfLoading(p => ({ ...p, [ticketId]: true }))
    try {
      const res = await fetch(`${API_BASE}/tickets/${ticketId}/pdf`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!res.ok) return
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ticket-${ticketId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } finally {
      setPdfLoading(p => ({ ...p, [ticketId]: false }))
    }
  }

  const toggleQr = async (ticketId: string) => {
    const next = selected === ticketId ? null : ticketId
    setSelected(next)
    if (!next || qrBlobs[ticketId]) return
    setQrLoading(p => ({ ...p, [ticketId]: true }))
    try {
      const res = await fetch(`${API_BASE}/tickets/${ticketId}/qr`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (res.ok) {
        const blob = await res.blob()
        setQrBlobs(p => ({ ...p, [ticketId]: URL.createObjectURL(blob) }))
      }
    } finally {
      setQrLoading(p => ({ ...p, [ticketId]: false }))
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
            <Ticket size={20} style={{ color: '#C084FC' }} />
            <h2 style={{ margin: 0 }}>Mis Entradas</h2>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
            Tus boletas activas y pasadas
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[1, 2].map(i => (
                <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="skeleton" style={{ height: 18, width: '55%' }} />
                    <div className="skeleton" style={{ height: 12, width: '40%' }} />
                    <div className="skeleton" style={{ height: 32, width: 140 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <div style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'rgba(147, 51, 234, 0.1)',
                border: '1px solid rgba(147, 51, 234, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <QrCode size={32} style={{ color: '#C084FC' }} />
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Sin entradas</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                No tienes entradas disponibles.
              </p>
              <Link to="/" className="btn btn-primary">Explorar Eventos</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {tickets.map(ticket => {
                const badge = statusBadge(ticket.status)
                const isSelected = selected === ticket.id
                return (
                  <div key={ticket.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="ticket-row" style={{ padding: '1.5rem', gap: '1rem' }}>
                      {/* Info */}
                      <div>
                        <h3 style={{ fontSize: '1.0625rem', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
                          {ticket.event_name}
                        </h3>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.75rem',
                          fontSize: '0.8125rem',
                          color: 'var(--color-text-muted)',
                          marginBottom: '1rem',
                          alignItems: 'center',
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Calendar size={13} style={{ color: '#C084FC' }} />
                            {new Date(ticket.event_date).toLocaleDateString('es-CO')}
                          </span>
                          <span>{ticket.category_name}</span>
                          {ticket.seat && <span>Puesto: {ticket.seat}</span>}
                          <span className={`badge ${badge.cls}`}>{badge.label}</span>
                        </div>
                        <button
                          onClick={() => downloadPdf(ticket.id)}
                          className="btn btn-outline btn-sm"
                          disabled={pdfLoading[ticket.id]}
                        >
                          {pdfLoading[ticket.id]
                            ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                            : <Download size={14} />}
                          Descargar PDF
                        </button>
                      </div>

                      {/* QR button */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <button
                          onClick={() => toggleQr(ticket.id)}
                          style={{
                            width: 100,
                            height: 100,
                            background: isSelected
                              ? 'rgba(147, 51, 234, 0.15)'
                              : 'rgba(255, 255, 255, 0.04)',
                            border: `1px solid ${isSelected
                              ? 'rgba(147, 51, 234, 0.4)'
                              : 'rgba(147, 51, 234, 0.18)'}`,
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.375rem',
                            transition: 'all var(--transition-fast)',
                          }}
                          aria-label="Mostrar QR"
                        >
                          {qrLoading[ticket.id]
                            ? <Loader size={28} style={{ color: '#C084FC', animation: 'spin 1s linear infinite' }} />
                            : <QrCode size={28} style={{ color: '#C084FC' }} />}
                          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                            {isSelected ? 'Ocultar QR' : 'Ver QR'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* QR expanded */}
                    {isSelected && (
                      <div style={{
                        padding: '1.5rem',
                        borderTop: '1px solid rgba(147, 51, 234, 0.15)',
                        display: 'flex',
                        justifyContent: 'center',
                        background: 'rgba(0, 0, 0, 0.2)',
                        animation: 'slideInUp 0.3s ease forwards',
                      }}>
                        {qrBlobs[ticket.id] ? (
                          <div style={{
                            background: 'white',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: '0 0 0 1px rgba(147,51,234,0.3), 0 8px 32px rgba(0,0,0,0.4)',
                          }}>
                            <img
                              src={qrBlobs[ticket.id]}
                              alt="QR de la boleta"
                              style={{ width: 180, height: 180, display: 'block' }}
                            />
                          </div>
                        ) : qrLoading[ticket.id] ? (
                          <Loader size={32} style={{ color: '#C084FC', animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
                            QR no disponible. Se genera al confirmar el pago.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
