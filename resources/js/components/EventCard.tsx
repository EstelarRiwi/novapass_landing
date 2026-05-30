import { Link } from 'react-router-dom'
import { Calendar, MapPin, Heart } from 'lucide-react'
import type { Event } from '../hooks/useEvents'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../hooks/useFavorites'
import { useEffect } from 'react'

interface Props {
  event: Event
  index?: number
}

export function EventCard({ event, index = 0 }: Props) {
  const { user } = useAuth()
  const { favorites, toggle, fetch } = useFavorites()

  useEffect(() => { if (user) fetch() }, [user])

  const d = new Date(event.date)
  const day = d.getDate()
  const mon = d.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '').toUpperCase()
  const dateStr = d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'long' })
  const isFav = favorites.includes(event.id)
  const price = event.categories.length > 0 ? Math.min(...event.categories.map(c => c.price)) : 0

  return (
    <div className="evcard reveal" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="evcard-media">
        <div
          className="evcard-img"
          style={event.image_url
            ? { backgroundImage: `url(${event.image_url})` }
            : { background: 'linear-gradient(135deg, #7C3AED, #4C1D95)' }
          }
        />
        <div className="evcard-grad" />
        <div className="evcard-top">
          {event.status === 'active' && (
            <span className="badge badge-glass evcard-genre">Disponible</span>
          )}
          {user && (
            <button
              className="evcard-fav"
              onClick={(e) => { e.stopPropagation(); toggle(event.id) }}
              aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart
                size={17}
                fill={isFav ? '#EF4444' : 'none'}
                style={{ color: isFav ? '#EF4444' : '#7C3AED' }}
              />
            </button>
          )}
        </div>
        <div className="evcard-date">
          <div className="d">{day}</div>
          <div className="m">{mon}</div>
        </div>
      </div>
      <div className="evcard-body">
        <h3>{event.name}</h3>
        <div className="evcard-meta">
          <span><Calendar size={14} /> {dateStr}</span>
          <span><MapPin size={14} /> {event.location}</span>
        </div>
        <div className="evcard-foot">
          <div className="evcard-price">
            <small>Desde</small>
            <b>${price.toLocaleString('es-CO')}</b>
          </div>
          <Link
            to={`/evento/${event.id}`}
            className="btn btn-primary btn-sm"
            onClick={e => e.stopPropagation()}
          >
            Ver Boletas
          </Link>
        </div>
      </div>
    </div>
  )
}
