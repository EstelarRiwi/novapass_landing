import { useEffect } from 'react'
import { useEvents } from '../hooks/useEvents'
import { useFavorites } from '../hooks/useFavorites'
import { EventCard } from '../components/EventCard'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MisFavoritos() {
  const { events, loading } = useEvents()
  const { favorites, fetch: fetchFavs } = useFavorites()

  useEffect(() => { fetchFavs() }, [])

  const favEvents = events.filter(e => favorites.includes(e.id))

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
            <Heart size={20} style={{ color: '#F87171' }} />
            <h2 style={{ margin: 0 }}>Mis Favoritos</h2>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
            Eventos que guardaste para no perderte
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: 1000 }}>
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div className="skeleton" style={{ height: 190 }} />
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="skeleton" style={{ height: 16, width: '70%' }} />
                    <div className="skeleton" style={{ height: 12, width: '50%' }} />
                    <div className="skeleton" style={{ height: 36 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : favEvents.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <div style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'rgba(248, 113, 113, 0.1)',
                border: '1px solid rgba(248, 113, 113, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <Heart size={32} style={{ color: '#F87171' }} />
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Sin favoritos</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                Explora eventos y guarda los que más te gusten.
              </p>
              <Link to="/" className="btn btn-primary">Explorar Eventos</Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}>
              {favEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
