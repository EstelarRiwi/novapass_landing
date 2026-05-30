import { useEffect } from 'react'
import { usePurchases } from '../hooks/useTickets'
import { Calendar, Ticket, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MisCompras() {
  const { purchases, loading, fetch } = usePurchases()

  useEffect(() => { fetch() }, [])

  return (
    <>
      <section className="page-head">
        <div className="page-head-glow" />
        <div className="container container-wide page-head-inner">
          <span className="eyebrow"><span className="bar" />Historial</span>
          <h1>Mis Compras</h1>
          <p>Todas tus órdenes y su estado en un solo lugar.</p>
        </div>
      </section>

      <section className="section">
        <div className="container container-wide">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 820, margin: '0 auto' }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="card" style={{ display: 'flex', gap: '1.2rem', padding: '1.1rem 1.3rem' }}>
                  <div className="skeleton" style={{ width: 76, height: 76, borderRadius: 14, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="skeleton" style={{ height: 18, borderRadius: 8, width: '50%' }} />
                    <div className="skeleton" style={{ height: 14, borderRadius: 8, width: '30%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : purchases.length === 0 ? (
            <div className="empty">
              <div className="empty-ic"><ShoppingBag size={34} /></div>
              <h3>Sin compras</h3>
              <p>No has realizado ninguna compra aún.</p>
              <Link to="/" className="btn btn-primary">Explorar Eventos</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 820, margin: '0 auto' }}>
              {purchases.map(ticket => {
                const used = ticket.status !== 'active'
                return (
                  <div key={ticket.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1.1rem 1.3rem' }}>
                    <div
                      style={{
                        width: 76, height: 76, borderRadius: 14,
                        background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Ticket size={28} style={{ color: 'rgba(255,255,255,0.7)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                        <span className={`badge ${used ? 'badge-error' : 'badge-success'}`}>
                          {used ? 'Usada' : 'Activa'}
                        </span>
                        <span className="badge badge-primary">{ticket.category_name}</span>
                      </div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>{ticket.event_name}</h3>
                      <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={14} />
                          {new Date(ticket.event_date).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Ticket size={14} /> {ticket.seat || 'General'}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                        ${ticket.price.toLocaleString('es-CO')}
                      </div>
                      <Link to="/mis-entradas" className="btn btn-outline btn-sm">Ver Entrada</Link>
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
