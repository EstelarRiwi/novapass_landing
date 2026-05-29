import { Link } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'
import type { Event } from '../hooks/useEvents'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../hooks/useFavorites'
import { Heart } from 'lucide-react'
import { useEffect } from 'react'

function safeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null
  return url.startsWith('http://') || url.startsWith('https://') ? url : null
}

interface Props {
  event: Event
}

export function EventCard({ event }: Props) {
  const { user } = useAuth()
  const { favorites, toggle, fetch } = useFavorites()

  useEffect(() => {
    if (user) fetch()
  }, [user, fetch])

  const date = new Date(event.date).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const isFav = favorites.includes(event.id)
  const minPrice = Math.min(...event.categories.map(c => c.price))

  return (
    <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
      {/* Image */}
      <div style={{
        height: 190,
        background: safeImageUrl(event.image_url)
          ? `url(${safeImageUrl(event.image_url)}) center/cover`
          : 'linear-gradient(135deg, #2D1B69 0%, #1A1028 100%)',
        position: 'relative',
      }}>
        {/* Overlay gradient for readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%)',
        }} />

        {/* Top badges/actions */}
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
        }}>
          {event.status === 'active' && (
            <span className="badge badge-success">Disponible</span>
          )}
          {user && (
            <button
              onClick={(e) => { e.preventDefault(); toggle(event.id) }}
              style={{
                background: 'rgba(10, 10, 15, 0.75)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart size={16} fill={isFav ? '#F87171' : 'none'} color={isFav ? '#F87171' : '#7C7A99'} />
            </button>
          )}
        </div>

        {/* Price pill bottom-left */}
        <div style={{
          position: 'absolute',
          bottom: '0.75rem',
          left: '0.875rem',
        }}>
          <span style={{
            background: 'rgba(10, 10, 15, 0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 999,
            padding: '0.25rem 0.75rem',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: '#F59E0B',
          }}>
            Desde ${minPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', letterSpacing: '-0.01em', lineHeight: 1.35 }}>
          {event.name}
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.375rem',
          marginBottom: '1.125rem',
          fontSize: '0.8125rem',
          color: 'var(--color-text-muted)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Calendar size={13} style={{ color: '#C084FC', flexShrink: 0 }} /> {date}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <MapPin size={13} style={{ color: '#C084FC', flexShrink: 0 }} /> {event.location}
          </span>
        </div>
        <Link to={`/evento/${event.id}`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
          Ver Boletas
        </Link>
      </div>
    </div>
  )
}
