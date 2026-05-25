import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserPlus, Star } from 'lucide-react'

export default function Register() {
  const { register, loginWithGoogle, loading } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    try {
      await register(name, email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse')
    }
  }

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: '#0A0A0F',
      overflow: 'hidden',
      padding: '3rem 1.5rem',
    }}>
      {/* Glow orbs */}
      <div style={{
        position: 'absolute',
        width: 550,
        height: 550,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.18) 0%, transparent 70%)',
        top: -120,
        left: -120,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
        bottom: -80,
        right: -80,
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            color: '#C084FC',
            textShadow: '0 0 24px rgba(192, 132, 252, 0.45)',
            marginBottom: '1.25rem',
          }}>
            <Star size={26} fill="currentColor" />
            NovaPass
          </div>
          <h2 style={{ marginBottom: '0.375rem', fontSize: '1.5rem' }}>Crear Cuenta</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
            Regístrate para comprar boletas y más
          </p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <button onClick={loginWithGoogle} className="btn btn-outline" style={{ width: '100%', marginBottom: '1.5rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
          }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(147, 51, 234, 0.2)' }} />
            <span>o con correo</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(147, 51, 234, 0.2)' }} />
          </div>

          {error && (
            <div style={{
              background: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid rgba(248, 113, 113, 0.25)',
              color: '#F87171',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1rem',
              fontSize: '0.875rem',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="name">Nombre completo</label>
              <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" required />
            </div>
            <div>
              <label htmlFor="email">Correo electrónico</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" required />
            </div>
            <div>
              <label htmlFor="password">Contraseña</label>
              <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '0.25rem' }}>
              {loading
                ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                : <><UserPlus size={18} /> Crear Cuenta</>
              }
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: '#C084FC' }}>Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
