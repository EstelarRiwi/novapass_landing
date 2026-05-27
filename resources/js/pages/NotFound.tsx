import { useNavigate } from 'react-router-dom'
import { Home, Compass } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <>
      <div className="section">
        <div className="container" style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              fontSize: 'clamp(6rem, 20vw, 9rem)',
              fontFamily: 'var(--font-heading)',
              lineHeight: 1,
              background: 'linear-gradient(135deg, #9333EA 0%, #C084FC 60%, #F59E0B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '1.5rem',
              filter: 'drop-shadow(0 0 32px rgba(147, 51, 234, 0.35))',
            }}
          >
            404
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
            <Compass size={20} style={{ color: '#C084FC' }} />
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Página no encontrada</h2>
          </div>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            La URL que buscas no existe o fue movida.
          </p>

          <button
            onClick={() => navigate('/')}
            className="btn btn-primary btn-lg"
            style={{ gap: '0.5rem' }}
          >
            <Home size={18} />
            Volver al inicio
          </button>
        </div>
      </div>
    </>
  )
}
