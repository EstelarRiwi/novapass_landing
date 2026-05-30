import { useEffect, useState } from 'react'
import { useTickets } from '../hooks/useTickets'
import { Download, Calendar, MapPin, QrCode, Send, Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MisEntradas() {
  const { tickets, loading, fetch: fetchTickets } = useTickets()
  const [tab, setTab] = useState<'active' | 'used'>('active')

  useEffect(() => { fetchTickets() }, [])

  const list = tickets.filter(t => tab === 'active' ? t.status === 'active' : t.status !== 'active')

  const downloadPdf = async (ticketId: string) => {
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
      <section className="page-head">
        <div className="page-head-glow" />
        <div className="container container-wide page-head-inner">
          <span className="eyebrow"><span className="bar" />Tu cartera digital</span>
          <h1>Mis Entradas</h1>
          <p>Presenta el QR en la entrada del evento. Sin imprimir, sin filas.</p>
        </div>
      </section>

      <section className="section">
        <div className="container container-wide">
          <div className="tickets-tabs">
            <button className={`ttab ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>
              Activas
            </button>
            <button className={`ttab ${tab === 'used' ? 'active' : ''}`} onClick={() => setTab('used')}>
              Historial
            </button>
          </div>

          {loading ? (
            <div className="tickets-wrap">
              {[1, 2].map(i => (
                <div key={i} className="tstub">
                  <div className="tstub-main">
                    <div className="skeleton" style={{ width: 80, height: 80, borderRadius: 12, flexShrink: 0 }} />
                    <div className="tstub-main-in" style={{ flex: 1 }}>
                      <div className="skeleton" style={{ height: 18, borderRadius: 8, marginBottom: 10, width: '60%' }} />
                      <div className="skeleton" style={{ height: 14, borderRadius: 8, width: '40%' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="empty">
              <div className="empty-ic"><QrCode size={34} /></div>
              <h3>{tab === 'active' ? 'Sin entradas activas' : 'Sin historial'}</h3>
              <p>Cuando compres boletas aparecerán aquí, listas para escanear.</p>
              <Link to="/" className="btn btn-primary">Explorar Eventos</Link>
            </div>
          ) : (
            <div className="tickets-wrap">
              {list.map(ticket => {
                const used = ticket.status !== 'active'
                const d = new Date(ticket.event_date)
                const dateStr = d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'long' })
                return (
                  <div key={ticket.id} className={`tstub ${used ? 'tstub-used' : ''}`}>
                    <div className="tstub-main">
                      <div className="tstub-main-in">
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.7rem' }}>
                          <span className={`badge ${used ? 'badge-error' : 'badge-success'}`}>
                            {used ? 'Usada' : 'Activa'}
                          </span>
                          <span className="badge badge-primary">{ticket.category_name}</span>
                        </div>
                        <h3 className="tstub-event">{ticket.event_name}</h3>
                        <div className="tstub-meta">
                          <div>
                            <div className="k">Fecha</div>
                            <div className="v"><Calendar size={14} /> {dateStr}</div>
                          </div>
                          <div>
                            <div className="k">Ubicación</div>
                            <div className="v"><MapPin size={14} /> {ticket.seat || 'General'}</div>
                          </div>
                          <div>
                            <div className="k">Categoría</div>
                            <div className="v"><Ticket size={14} /> {ticket.category_name}</div>
                          </div>
                          <div>
                            <div className="k">Precio</div>
                            <div className="v">${ticket.price.toLocaleString('es-CO')}</div>
                          </div>
                        </div>
                        <div className="tstub-actions">
                          <button
                            className="btn btn-outline btn-sm"
                            disabled={used}
                            onClick={() => downloadPdf(ticket.id)}
                          >
                            <Download size={15} /> Descargar PDF
                          </button>
                          <button className="btn btn-ghost btn-sm">
                            <Send size={15} /> Compartir
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="tstub-qr">
                      <div className="qr-box">
                        {ticket.qr_url ? (
                          <img src={ticket.qr_url} alt="QR de la entrada" style={{ width: 130, height: 130 }} />
                        ) : (
                          <QrCode size={80} style={{ color: 'var(--color-primary)' }} />
                        )}
                      </div>
                      <div className="tstub-seat">#NVP-{ticket.id.slice(0, 8).toUpperCase()}</div>
                      <div className="tstub-scan">{used ? 'Entrada validada' : 'Escanea en el acceso'}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
