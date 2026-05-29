import { useEffect, useState } from 'react'
import { useTickets } from '../hooks/useTickets'
import { Download, Calendar, QrCode, Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MisEntradas() {
  const { tickets, loading, fetch: fetchTickets } = useTickets()
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => { fetchTickets() }, [fetchTickets])

  const downloadPdf = async (ticketId: number) => {
    const token = localStorage.getItem('token')
    const res = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/tickets/${ticketId}/pdf`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    )
    if (!res.ok) return
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    URL.revokeObjectURL(url)
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
              {tickets.map(ticket => (
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
                        <span className={`badge ${ticket.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                          {ticket.status === 'active' ? 'Activa' : 'Usada'}
                        </span>
                      </div>
                      <button onClick={() => downloadPdf(ticket.id)} className="btn btn-outline btn-sm">
                        <Download size={14} /> Descargar PDF
                      </button>
                    </div>

                    {/* QR button */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                      <button
                        onClick={() => setSelected(selected === ticket.id ? null : ticket.id)}
                        style={{
                          width: 100,
                          height: 100,
                          background: selected === ticket.id
                            ? 'rgba(147, 51, 234, 0.15)'
                            : 'rgba(255, 255, 255, 0.04)',
                          border: `1px solid ${selected === ticket.id
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
                        <QrCode size={28} style={{ color: '#C084FC' }} />
                        <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                          {selected === ticket.id ? 'Ocultar QR' : 'Ver QR'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* QR expanded */}
                  {selected === ticket.id && ticket.qr_url && (
                    <div style={{
                      padding: '1.5rem',
                      borderTop: '1px solid rgba(147, 51, 234, 0.15)',
                      display: 'flex',
                      justifyContent: 'center',
                      background: 'rgba(0, 0, 0, 0.2)',
                      animation: 'slideInUp 0.3s ease forwards',
                    }}>
                      <div style={{
                        background: 'white',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: '0 0 0 1px rgba(147,51,234,0.3), 0 8px 32px rgba(0,0,0,0.4)',
                      }}>
                        <img src={ticket.qr_url} alt="QR de la boleta" style={{ width: 180, height: 180, display: 'block' }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
