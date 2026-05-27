import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../hooks/useProfile'
import { User, Camera, UserCircle } from 'lucide-react'

export default function MiPerfil() {
  const { user } = useAuth()
  const { update, uploadPhoto, loading } = useProfile()
  const fileRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(user?.fullName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    await update({ name, email })
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await uploadPhoto(file)
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
            <UserCircle size={20} style={{ color: '#C084FC' }} />
            <h2 style={{ margin: 0 }}>Mi Perfil</h2>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
            Administra tu información personal
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: 520, margin: '0 auto' }}>
          <div className="card" style={{ padding: '2.25rem' }}>
            {/* Avatar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: '50%',
                  background: 'rgba(147, 51, 234, 0.12)',
                  border: '2px solid rgba(147, 51, 234, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: '0 0 24px rgba(147, 51, 234, 0.2)',
                  transition: 'box-shadow var(--transition-base)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget.style.boxShadow = '0 0 32px rgba(147, 51, 234, 0.4)')
                  const overlay = e.currentTarget.querySelector('[data-overlay]') as HTMLElement
                  if (overlay) overlay.style.opacity = '1'
                }}
                onMouseLeave={e => {
                  (e.currentTarget.style.boxShadow = '0 0 24px rgba(147, 51, 234, 0.2)')
                  const overlay = e.currentTarget.querySelector('[data-overlay]') as HTMLElement
                  if (overlay) overlay.style.opacity = '0'
                }}
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={40} style={{ color: '#C084FC' }} />
                )}
                <div
                  data-overlay
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.55)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity var(--transition-fast)',
                    borderRadius: '50%',
                  }}
                >
                  <Camera size={24} color="white" />
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                Haz clic para cambiar foto
              </span>
            </div>

            {success && (
              <div className="alert-success" style={{ marginBottom: '1.25rem', animation: 'slideInUp 0.3s ease forwards' }}>
                Perfil actualizado correctamente
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              <div>
                <label htmlFor="name">Nombre completo</label>
                <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="email">Correo electrónico</label>
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ width: '100%', marginTop: '0.25rem' }}
              >
                {loading
                  ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                  : 'Guardar Cambios'
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
