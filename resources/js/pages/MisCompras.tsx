import { useEffect } from 'react'
import { usePurchases } from '../hooks/useTickets'
import { Calendar, Ticket, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MisCompras() {
  const { purchases, loading, fetch } = usePurchases()

  useEffect(() => { fetch() }, [fetch])

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
            <ShoppingBag size={20} style={{ color: '#C084FC' }} />
            <h2 style={{ margin: 0 }}>Mis Compras</h2>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
            Historial de todas tus transacciones
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      <div className="skeleton" style={{ height: 16, width: '60%' }} />
                      <div className="skeleton" style={{ height: 12, width: '40%' }} />
                    </div>
                    <div className="skeleton" style={{ height: 36, width: 100 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : purchases.length === 0 ? (
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
                <Ticket size={32} style={{ color: '#C084FC' }} />
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Sin compras</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                No has realizado ninguna compra aún.
              </p>
              <Link to="/" className="btn btn-primary">Explorar Eventos</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {purchases.map(ticket => (
                <div key={ticket.id} className="card ticket-row" style={{ padding: '1.25rem 1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.0625rem', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
                      {ticket.event_name}
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.875rem',
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-muted)',
                      alignItems: 'center',
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} style={{ color: '#C084FC' }} />
                        {new Date(ticket.event_date).toLocaleDateString('es-CO')}
                      </span>
                      <span>{ticket.category_name}</span>
                      {ticket.price > 0 && (
                        <span style={{ color: '#F59E0B', fontWeight: 600 }}>
                          ${ticket.price.toLocaleString('es-CO')}
                        </span>
                      )}
                      <span className={`badge ${
                        ticket.status === 'active'  ? 'badge-success' :
                        ticket.status === 'pending' ? 'badge-warning'  :
                        ticket.status === 'used'    ? 'badge-muted'    : 'badge-error'
                      }`}>
                        {ticket.status === 'active'  ? 'Activa'    :
                         ticket.status === 'pending' ? 'Pendiente' :
                         ticket.status === 'used'    ? 'Usada'     : 'Cancelada'}
                      </span>
                    </div>
                  </div>
                  <Link to="/mis-entradas" className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}>
                    Ver Entrada
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
