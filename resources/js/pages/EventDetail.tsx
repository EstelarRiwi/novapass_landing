import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function safeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null
  return url.startsWith('http://') || url.startsWith('https://') ? url : null
}
import { useEvent } from '../hooks/useEvents'
import { useAuth } from '../context/AuthContext'
import { useCheckout } from '../hooks/useTickets'
import { Calendar, MapPin, ChevronLeft, ShoppingCart, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { event, loading } = useEvent(Number(id))
  const { createPreference, loading: checkoutLoading } = useCheckout()

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')

  if (loading) {
    return (
      <div style={{ padding: '5rem 0', display: 'flex', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 44, height: 44, borderWidth: 4 }} />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: '0.75rem' }}>Evento no encontrado</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Este evento no existe o ya no está disponible.
          </p>
          <Link to="/" className="btn btn-primary">Volver a Eventos</Link>
        </div>
      </div>
    )
  }

  const category = event.categories.find(c => c.id === selectedCategory)
  const total = category ? category.price * quantity : 0

  const handleBuy = async () => {
    if (!user) { navigate('/login'); return }
    if (!selectedCategory) { setError('Selecciona una categoría'); return }
    setError('')
    try {
      const url = await createPreference(event.id, selectedCategory, quantity)
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la compra')
    }
  }

  const date = new Date(event.date).toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      {/* Back nav */}
      <div style={{
        borderBottom: '1px solid rgba(147, 51, 234, 0.1)',
        padding: '1rem 0',
      }}>
        <div className="container">
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
              fontWeight: 500,
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#C084FC')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          >
            <ChevronLeft size={16} /> Volver a Eventos
          </Link>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: 960 }}>
          {/* Hero image */}
          <div style={{
            height: 'clamp(220px, 40vw, 360px)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: '2rem',
            position: 'relative',
            background: safeImageUrl(event.image_url)
              ? `url(${safeImageUrl(event.image_url)}) center/cover`
              : 'linear-gradient(135deg, #2D1B69 0%, #1A1028 100%)',
            border: '1px solid rgba(147, 51, 234, 0.2)',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(10,10,15,0.7) 0%, rgba(10,10,15,0.1) 50%, transparent 100%)',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '1.75rem',
            }}>
              {event.status === 'active' && (
                <span className="badge badge-success">Disponible</span>
              )}
            </div>
          </div>

          {/* Content grid */}
          <div className="grid-detail">
            {/* Event info */}
            <div>
              <h1 style={{ marginBottom: '1.25rem', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', letterSpacing: '-0.02em' }}>
                {event.name}
              </h1>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.625rem',
                fontSize: '0.9375rem',
                color: 'var(--color-text-muted)',
                marginBottom: '2rem',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} style={{ color: '#C084FC', flexShrink: 0 }} /> {date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} style={{ color: '#C084FC', flexShrink: 0 }} /> {event.location}
                </span>
              </div>

              {event.description && (
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(147,51,234,0.12)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                }}>
                  <p style={{ lineHeight: 1.75, color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
                    {event.description}
                  </p>
                </div>
              )}
            </div>

            {/* Ticket purchase card */}
            <div className="card" style={{ position: 'sticky', top: '5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem',
              }}>
                <Tag size={18} style={{ color: '#C084FC' }} />
                <h2 style={{ fontSize: '1.0625rem' }}>Compra tus boletas</h2>
              </div>

              {error && (
                <div className="alert-error" style={{ marginBottom: '1rem' }}>
                  {error}
                </div>
              )}

              {/* Categories */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ marginBottom: '0.625rem' }}>Categoría</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {event.categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setError('') }}
                      disabled={cat.available === 0}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.875rem 1rem',
                        border: `1px solid ${selectedCategory === cat.id
                          ? 'rgba(147, 51, 234, 0.6)'
                          : 'rgba(147, 51, 234, 0.18)'}`,
                        borderRadius: 'var(--radius-sm)',
                        background: selectedCategory === cat.id
                          ? 'rgba(147, 51, 234, 0.12)'
                          : 'rgba(255, 255, 255, 0.03)',
                        cursor: cat.available === 0 ? 'not-allowed' : 'pointer',
                        opacity: cat.available === 0 ? 0.5 : 1,
                        transition: 'all var(--transition-fast)',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ fontWeight: 500, fontSize: '0.9375rem', color: 'var(--color-text)' }}>
                        {cat.name}
                      </span>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: '#F59E0B', fontSize: '1rem' }}>
                          ${cat.price.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: cat.available > 0 ? 'var(--color-text-muted)' : '#F87171' }}>
                          {cat.available > 0 ? `${cat.available} disponibles` : 'Agotado'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              {selectedCategory && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ marginBottom: '0.625rem' }}>Cantidad</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="btn btn-outline btn-sm"
                      style={{ width: 40, height: 40, padding: 0, flexShrink: 0 }}
                    >
                      −
                    </button>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '1.375rem',
                      minWidth: 40,
                      textAlign: 'center',
                      fontFamily: 'var(--font-heading)',
                      color: 'white',
                    }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(category?.available || 10, quantity + 1))}
                      className="btn btn-outline btn-sm"
                      style={{ width: 40, height: 40, padding: 0, flexShrink: 0 }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Total */}
              {total > 0 && (
                <div style={{
                  padding: '0.875rem 0',
                  borderTop: '1px solid rgba(147, 51, 234, 0.15)',
                  borderBottom: '1px solid rgba(147, 51, 234, 0.15)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Total</span>
                  <span style={{ fontWeight: 700, color: '#F59E0B', fontSize: '1.125rem' }}>
                    ${total.toLocaleString()}
                  </span>
                </div>
              )}

              <button
                onClick={handleBuy}
                disabled={!selectedCategory || checkoutLoading}
                className="btn btn-cta btn-lg"
                style={{
                  width: '100%',
                  opacity: !selectedCategory ? 0.5 : 1,
                  cursor: !selectedCategory ? 'not-allowed' : 'pointer',
                }}
              >
                {checkoutLoading
                  ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                  : <><ShoppingCart size={18} /> {user ? 'Comprar Ahora' : 'Iniciar Sesión para Comprar'}</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
