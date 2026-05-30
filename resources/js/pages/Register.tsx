import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Star, User, Mail, Lock, Phone } from 'lucide-react'

function GoogleIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

export default function Register() {
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-aside">
        <div className="auth-aside-photo" />
        <div className="auth-aside-grad" />
        <div className="auth-aside-glow" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', position: 'relative', zIndex: 2 }}>
          <div className="nav-logo-mark"><Star size={22} fill="currentColor" strokeWidth={0} /></div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', color: '#fff' }}>
            Nova<b>Pass</b>
          </span>
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="auth-aside-quote">
            Empieza a vivir la <span className="accent">mejor música</span> hoy mismo.
          </div>
          <p style={{ opacity: 0.8, marginTop: '1rem', maxWidth: 420 }}>
            Crea tu cuenta gratis y accede a cientos de eventos en todo el país.
          </p>
        </div>
        <div className="auth-aside-foot" style={{ position: 'relative', zIndex: 2 }}>
          <div><div className="n">500+</div><div className="l">Eventos al año</div></div>
          <div><div className="n">Gratis</div><div className="l">Registro</div></div>
          <div><div className="n">100%</div><div className="l">Seguro</div></div>
        </div>
      </div>

      <div className="auth-main">
        <div className="auth-card">
          <h1>Crea tu cuenta</h1>
          <p className="sub">Regístrate en segundos y empieza a vivir la música en vivo.</p>

          <button className="auth-google" onClick={loginWithGoogle} type="button">
            <GoogleIcon /> Registrarme con Google
          </button>

          <div className="auth-divider"><hr /> o con tu correo <hr /></div>

          {error && <div className="alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div>
              <label className="form-label">Nombre completo</label>
              <div className="input-icon">
                <User size={17} />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre completo" required />
              </div>
            </div>
            <div>
              <label className="form-label">Correo electrónico</label>
              <div className="input-icon">
                <Mail size={17} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" required />
              </div>
            </div>
            <div>
              <label className="form-label">Teléfono (opcional)</label>
              <div className="input-icon">
                <Phone size={17} />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+57 300 000 0000" />
              </div>
            </div>
            <div>
              <label className="form-label">Contraseña</label>
              <div className="input-icon">
                <Lock size={17} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" required minLength={8} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
              {loading
                ? <span className="spinner" style={{ width: 20, height: 20 }} />
                : 'Crear cuenta gratis'
              }
            </button>
          </form>

          <div className="auth-foot">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
