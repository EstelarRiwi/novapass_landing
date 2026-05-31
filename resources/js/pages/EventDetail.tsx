import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEvent } from '../hooks/useEvents'
import { useAuth } from '../context/AuthContext'
import { useCheckout } from '../hooks/useTickets'
import { useFavorites } from '../hooks/useFavorites'
import { ARTIST_PHOTOS, type Artist } from '../data/eventArtists'
import { Calendar, MapPin, ChevronLeft, Clock, Building2, Heart, Minus, Plus, ShieldCheck } from 'lucide-react'

const AVATAR_COLORS = [
  ['#7C3AED','#4C1D95'], ['#DB2777','#9D174D'], ['#0891B2','#164E63'],
  ['#D97706','#92400E'], ['#059669','#065F46'], ['#DC2626','#7F1D1D'],
]

function ArtistCard({ artist, index }: { artist: Artist; index: number }) {
  const [r, g] = AVATAR_COLORS[index % AVATAR_COLORS.length]
  const photo = artist.photo ?? ARTIST_PHOTOS[artist.name]
  const initials = artist.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div className="artist-card">
      <div className="artist-photo">
        {photo
          ? <img src={photo} alt={artist.name} />
          : <div className="artist-photo-placeholder" style={{ background: `linear-gradient(135deg, ${r}, ${g})` }}>{initials}</div>
        }
      </div>
      <div>
        <div className="artist-name">{artist.name}</div>
        <div className="artist-role">{artist.role}</div>
      </div>
    </div>
  )
}

function useArtists(eventId: string) {
  const [artists, setArtists] = useState<Artist[]>([])
  useEffect(() => {
    if (!eventId) return
    fetch(`/api-local/events/${encodeURIComponent(eventId)}/artists`)
      .then(r => r.ok ? r.json() : [])
      .then((data: Artist[]) => setArtists(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [eventId])
  return artists
}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { event, loading } = useEvent(id ?? '')
  const { createPreference, loading: checkoutLoading } = useCheckout()
  const { favorites, toggle } = useFavorites()
  const artists = useArtists(id ?? '')

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="empty">
            <h3>Evento no encontrado</h3>
            <p>Este evento no existe o ya no está disponible.</p>
            <Link to="/" className="btn btn-primary">Volver a Eventos</Link>
          </div>
        </div>
      </div>
    )
  }

  const category = event.categories.find(c => c.id === selectedCategory)
  const fee = category ? Math.round(category.price * quantity * 0.08) : 0
  const subtotal = category ? category.price * quantity : 0
  const total = subtotal + fee
  const isFav = favorites.includes(event.id)
  const d = new Date(event.date)

  const handleBuy = async () => {
    if (!user) { navigate('/login'); return }
    if (!selectedCategory) { setError('Selecciona una categoría para continuar'); return }
    setError('')
    try {
      await createPreference(event.id, selectedCategory, quantity)
      navigate('/mis-entradas')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la compra')
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="detail-hero">
        <div
          className="detail-hero-img"
          style={event.image_url
            ? { backgroundImage: `url(${event.image_url})` }
            : { background: 'linear-gradient(135deg, #4C1D95, #6D28D9)' }
          }
        />
        <div className="detail-hero-grad" />
        <div className="detail-hero-glow" />
        <div className="detail-hero-inner">
          <div className="container container-wide">
            <Link to="/" className="detail-back">
              <ChevronLeft size={17} /> Volver a Eventos
            </Link>
            <div className="detail-tags">
              {event.status === 'active' && <span className="badge badge-glass">Disponible</span>}
            </div>
            <h1 className="detail-title">{event.name}</h1>
            <div className="detail-meta">
              <span><Calendar size={19} />
                {d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span><Clock size={19} /> {d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })} hrs</span>
              <span><MapPin size={19} /> {event.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="container container-wide">
        <div className="detail-layout">
          {/* Left column */}
          <div>
            <div className="info-pills">
              <div className="info-pill">
                <div className="ic"><Calendar size={20} /></div>
                <div className="lb">Fecha</div>
                <div className="vl">{d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
              <div className="info-pill">
                <div className="ic"><Building2 size={20} /></div>
                <div className="lb">Recinto</div>
                <div className="vl">{event.location}</div>
              </div>
              <div className="info-pill">
                <div className="ic"><Clock size={20} /></div>
                <div className="lb">Hora</div>
                <div className="vl">{d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>

            <div className="detail-block">
              <h3 className="detail-section-title">Sobre el evento</h3>
              <p className="detail-desc">{event.description || 'Una experiencia única que no te puedes perder.'}</p>
            </div>

            {artists.length > 0 && (
              <div className="detail-block">
                <h3 className="detail-section-title">Artistas</h3>
                <div className="artist-grid">
                  {artists.map((artist, i) => (
                    <ArtistCard key={artist.name} artist={artist} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Buy card */}
          <div>
            <div className="buycard">
              <div className="buycard-head">
                <h3>Compra tus boletas</h3>
                {user && (
                  <button
                    className="evcard-fav"
                    style={{ boxShadow: 'none', background: 'var(--color-bg-alt)' }}
                    onClick={() => toggle(event.id)}
                    aria-label={isFav ? 'Quitar favorito' : 'Agregar favorito'}
                  >
                    <Heart size={18} fill={isFav ? '#EF4444' : 'none'} style={{ color: isFav ? '#EF4444' : '#7C3AED' }} />
                  </button>
                )}
              </div>

              {error && <div className="buy-error">{error}</div>}

              <span className="buycard-label">Categoría</span>
              <div className="cat-list" style={{ marginBottom: '1.3rem' }}>
                {event.categories.map(cat => {
                  const out = cat.available === 0
                  const low = cat.available > 0 && cat.available <= 25
                  return (
                    <button
                      key={cat.id}
                      disabled={out}
                      className={`cat-opt ${selectedCategory === cat.id ? 'sel' : ''}`}
                      onClick={() => { if (!out) { setSelectedCategory(cat.id); setError(''); setQuantity(1) } }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="cat-radio" />
                        <div>
                          <div className="cnm">{cat.name}</div>
                          <div className={`cav ${out ? 'out' : low ? 'low' : ''}`}>
                            {out ? 'Agotado' : low ? `¡Solo ${cat.available}!` : `${cat.available} disponibles`}
                          </div>
                        </div>
                      </div>
                      <div className="cpr">${cat.price.toLocaleString('es-CO')}</div>
                    </button>
                  )
                })}
              </div>

              {category && (
                <div className="qty-row">
                  <span className="buycard-label" style={{ marginBottom: 0 }}>Cantidad</span>
                  <div className="qty-ctrl">
                    <button className="qty-btn" disabled={quantity <= 1} onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                      <Minus size={18} />
                    </button>
                    <span className="qty-num">{quantity}</span>
                    <button className="qty-btn" disabled={quantity >= Math.min(category.available, 10)} onClick={() => setQuantity(q => Math.min(category.available, 10, q + 1))}>
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              )}

              {category && (
                <div className="buy-summary">
                  <div className="buy-row">
                    <span>{category.name} × {quantity}</span>
                    <span>${subtotal.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="buy-row">
                    <span>Cargo por servicio (8%)</span>
                    <span>${fee.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="buy-row total">
                    <span>Total</span>
                    <span>${total.toLocaleString('es-CO')}</span>
                  </div>
                </div>
              )}

              <button
                className="btn btn-cta btn-lg btn-block"
                onClick={handleBuy}
                disabled={checkoutLoading || !category}
              >
                {checkoutLoading
                  ? <span className="spinner" style={{ width: 20, height: 20, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
                  : category ? 'Comprar ahora' : 'Selecciona una categoría'
                }
              </button>

              <div className="buy-trust">
                <ShieldCheck size={15} /> Pago 100% seguro
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
