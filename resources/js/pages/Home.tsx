import { useEvents } from '../hooks/useEvents'
import { EventCard } from '../components/EventCard'
import { Calendar, ChevronRight, Shield, Ticket, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { events, loading } = useEvents()
  const { user } = useAuth()

  return (
    <>
      {/* ── Hero ── */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: '#0A0A0F',
        padding: '7rem 0 5rem',
      }}>
        {/* Animated orbs */}
        <div style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.22) 0%, transparent 65%)',
          top: -180,
          left: -180,
          pointerEvents: 'none',
          animation: 'float 12s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 65%)',
          bottom: -100,
          right: -80,
          pointerEvents: 'none',
          animation: 'float-reverse 10s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(192, 132, 252, 0.1) 0%, transparent 65%)',
          top: '40%',
          right: '20%',
          pointerEvents: 'none',
          animation: 'float 15s ease-in-out 2s infinite',
        }} />

        {/* Grid texture */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: [
            'linear-gradient(rgba(147, 51, 234, 0.04) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(147, 51, 234, 0.04) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '64px 64px',
          pointerEvents: 'none',
        }} />

        {/* Diagonal line accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: '15%',
          width: 1,
          height: '100%',
          background: 'linear-gradient(to bottom, transparent, rgba(147,51,234,0.2), transparent)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            {/* Eyebrow tag */}
            <div
              className="slide-in-up"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(147, 51, 234, 0.1)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                borderRadius: 999,
                padding: '0.375rem 1rem',
                marginBottom: '1.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#C084FC',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                opacity: 0,
              }}
            >
              <Zap size={13} fill="currentColor" /> Tu plataforma de boletas en Colombia
            </div>

            {/* Headline */}
            <h1
              style={{
                color: 'white',
                marginBottom: '1.5rem',
                lineHeight: 1.05,
                fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)',
                letterSpacing: '-0.025em',
                opacity: 0,
                animation: 'slideInUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s forwards',
              }}
            >
              Vive la{' '}
              <span style={{
                background: 'linear-gradient(135deg, #C084FC 0%, #9333EA 45%, #F59E0B 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 5s ease infinite',
              }}>
                experiencia
              </span>
              <br />
              NovaPass
            </h1>

            {/* Subtext */}
            <p style={{
              fontSize: '1.125rem',
              color: '#7C7A99',
              marginBottom: '2.5rem',
              lineHeight: 1.75,
              maxWidth: 500,
              opacity: 0,
              animation: 'slideInUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.25s forwards',
            }}>
              Descubre los mejores eventos, compra tus boletas de forma segura y
              guarda tus entradas digitales en un solo lugar.
            </p>

            {/* CTAs */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '3.5rem',
              opacity: 0,
              animation: 'slideInUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s forwards',
            }}>
              {!user && (
                <Link to="/register" className="btn btn-cta btn-lg">
                  Crear Cuenta <ChevronRight size={20} />
                </Link>
              )}
              <a href="#eventos" className="btn btn-outline btn-lg">
                Explorar Eventos
              </a>
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              gap: '2.5rem',
              flexWrap: 'wrap',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(147, 51, 234, 0.15)',
              opacity: 0,
              animation: 'slideInUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.55s forwards',
            }}>
              {[
                { value: '500+', label: 'Eventos activos' },
                { value: '50K+', label: 'Usuarios activos' },
                { value: '100%', label: 'Pago seguro' },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{
                    fontSize: '1.875rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-heading)',
                    color: 'white',
                    lineHeight: 1,
                    marginBottom: '0.25rem',
                  }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#7C7A99' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#C084FC',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.875rem',
            }}>
              ¿Por qué NovaPass?
            </div>
            <h2 style={{ marginBottom: '0.75rem' }}>Todo lo que necesitas</h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 440, margin: '0 auto', fontSize: '0.9375rem', lineHeight: 1.7 }}>
              Compra, guarda y presenta tus entradas sin complicaciones.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}>
            {[
              {
                icon: <Shield size={22} />,
                title: 'Compra Segura',
                desc: 'Pagos protegidos con Mercado Pago y entradas con QR firmado digitalmente.',
                color: '#C084FC',
              },
              {
                icon: <Calendar size={22} />,
                title: 'Cartelera Completa',
                desc: 'Explora todos los eventos disponibles y guarda tus favoritos con un clic.',
                color: '#F59E0B',
              },
              {
                icon: <Ticket size={22} />,
                title: 'Entradas Digitales',
                desc: 'Tus boletas siempre en tu teléfono. Sin papel, sin filas, sin complicaciones.',
                color: '#4ADE80',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="card"
                style={{
                  textAlign: 'center',
                  padding: '2.25rem 1.75rem',
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: `${f.color}18`,
                  border: `1px solid ${f.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: f.color,
                  margin: '0 auto 1.375rem',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.0625rem', marginBottom: '0.625rem', letterSpacing: '-0.01em' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Events Grid ── */}
      <section id="eventos" className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            gap: '1rem',
            flexWrap: 'wrap',
          }}>
            <div>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#C084FC',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}>
                Disponibles ahora
              </div>
              <h2 style={{ marginBottom: 0 }}>Cartelera</h2>
            </div>
          </div>

          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.25rem',
            }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div className="skeleton" style={{ height: 190 }} />
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="skeleton" style={{ height: 16, width: '75%' }} />
                    <div className="skeleton" style={{ height: 12, width: '50%' }} />
                    <div className="skeleton" style={{ height: 12, width: '40%' }} />
                    <div className="skeleton" style={{ height: 36, marginTop: '0.25rem' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
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
                <Calendar size={32} style={{ color: '#C084FC' }} />
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Próximamente</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>No hay eventos disponibles. Vuelve pronto.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.25rem',
            }}>
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
