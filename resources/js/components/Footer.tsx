import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'

export function Footer() {
  return (
    <footer style={{
      background: '#050508',
      borderTop: '1px solid rgba(147, 51, 234, 0.12)',
      padding: '3rem 0 2rem',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              color: '#C084FC',
              marginBottom: '0.875rem',
              textShadow: '0 0 20px rgba(192, 132, 252, 0.35)',
            }}>
              <Star size={20} fill="currentColor" />
              NovaPass
            </div>
            <p style={{ fontSize: '0.875rem', color: '#7C7A99', lineHeight: 1.65 }}>
              Tu plataforma de confianza para la compra y gestión de boletas.
            </p>
          </div>

          <div>
            <h4 style={{
              fontWeight: 600,
              marginBottom: '1rem',
              fontSize: '0.8125rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#7C7A99',
            }}>
              Navegación
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { to: '/', label: 'Eventos' },
                { to: '/login', label: 'Iniciar Sesión' },
                { to: '/register', label: 'Registrarse' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} style={{
                  fontSize: '0.875rem',
                  color: '#7C7A99',
                  transition: 'color 150ms ease',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#C084FC')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#7C7A99')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{
              fontWeight: 600,
              marginBottom: '1rem',
              fontSize: '0.8125rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#7C7A99',
            }}>
              Contacto
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.875rem', color: '#7C7A99' }}>
              <span>soporte@novapass.app</span>
              <span>+57 1 234 5678</span>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(147, 51, 234, 0.1)',
          paddingTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.8125rem',
          color: '#4A4865',
        }}>
          &copy; {new Date().getFullYear()} NovaPass. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
