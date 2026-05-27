import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Star, ArrowLeft, CheckCircle } from 'lucide-react'
import { api } from '../api/client'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') ?? ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/login'), 2500)
      return () => clearTimeout(timer)
    }
  }, [success, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, newPassword })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al restablecer la contraseña')
    } finally {
      setLoading(false)
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
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.18) 0%, transparent 70%)',
        top: -100,
        right: -100,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
        bottom: -80,
        left: -80,
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
          <h1 style={{ marginBottom: '0.375rem', fontSize: '1.5rem' }}>Nueva Contraseña</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
            Elige una contraseña segura para tu cuenta
          </p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {/* No token in URL */}
          {!token && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'rgba(248, 113, 113, 0.1)',
                border: '1px solid rgba(248, 113, 113, 0.25)',
                color: '#F87171',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
              }}>
                Enlace inválido o expirado. Solicita uno nuevo.
              </div>
              <Link to="/recuperar-contrasena" className="btn btn-primary" style={{ display: 'inline-flex', gap: '0.5rem' }}>
                Solicitar nuevo enlace
              </Link>
            </div>
          )}

          {/* Success state */}
          {token && success && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}>
                <CheckCircle size={24} color="var(--color-success)" />
              </div>
              <p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>¡Contraseña actualizada!</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Redirigiendo al inicio de sesión...
              </p>
              <Link to="/login" className="btn btn-outline" style={{ display: 'inline-flex', gap: '0.5rem' }}>
                <ArrowLeft size={16} />
                Ir al inicio de sesión
              </Link>
            </div>
          )}

          {/* Form */}
          {token && !success && (
            <>
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
                  {error.toLowerCase().includes('invalid') || error.toLowerCase().includes('expired') ? (
                    <span> <Link to="/recuperar-contrasena" style={{ color: '#F87171', textDecoration: 'underline' }}>Solicitar nuevo enlace</Link>.</span>
                  ) : null}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label htmlFor="newPassword">Nueva contraseña</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword">Confirmar contraseña</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '0.25rem' }}>
                  {loading
                    ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                    : <><Lock size={18} /> Guardar contraseña</>
                  }
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-text-muted)', textDecoration: 'underline' }}>
                  <ArrowLeft size={14} />
                  Volver al inicio de sesión
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
