import { useEffect } from 'react'
import { useFavorites } from '../hooks/useFavorites'
import { EventCard } from '../components/EventCard'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MisFavoritos() {
  const { favEvents, loading, fetch: fetchFavs } = useFavorites()

  useEffect(() => { fetchFavs() }, [])

  return (
    <>
      <section className="page-head">
        <div className="page-head-glow" />
        <div className="container container-wide page-head-inner">
          <span className="eyebrow"><span className="bar" />Tu selección</span>
          <h1>Mis Favoritos</h1>
          <p>Los eventos que quieres vivir. Te avisamos antes de que se agoten.</p>
        </div>
      </section>

      <section className="section">
        <div className="container container-wide">
          {loading ? (
            <div className="evgrid">
              {[1, 2, 3].map(i => (
                <div key={i} className="evcard">
                  <div className="skeleton" style={{ aspectRatio: '16/11' }} />
                  <div className="evcard-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                    <div className="skeleton" style={{ height: 22, borderRadius: 8 }} />
                    <div className="skeleton" style={{ height: 14, borderRadius: 8, width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : favEvents.length === 0 ? (
            <div className="empty">
              <div className="empty-ic"><Heart size={34} /></div>
              <h3>Aún no tienes favoritos</h3>
              <p>Toca el corazón en cualquier evento para guardarlo aquí.</p>
              <Link to="/" className="btn btn-primary">Explorar Eventos</Link>
            </div>
          ) : (
            <div className="evgrid">
              {favEvents.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
