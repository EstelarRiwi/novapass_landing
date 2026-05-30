import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../hooks/useProfile'
import { Camera, CheckCircle } from 'lucide-react'

export default function MiPerfil() {
  const { user } = useAuth()
  const { update, uploadPhoto, loading } = useProfile()
  const fileRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(user?.fullName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [success, setSuccess] = useState(false)

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

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
      <section className="page-head">
        <div className="page-head-glow" />
        <div className="container container-wide page-head-inner">
          <span className="eyebrow"><span className="bar" />Tu cuenta</span>
          <h1>Mi Perfil</h1>
          <p>Gestiona tu información y mantén tus entradas a tu nombre.</p>
        </div>
      </section>

      <section className="section">
        <div className="container container-wide">
          <div className="profile-layout">
            {/* Side card */}
            <div className="profile-side">
              <div className="profile-cover">
                <div className="profile-cover-glow" />
              </div>
              <div className="profile-av-wrap">
                <div className="profile-av" onClick={() => fileRef.current?.click()} style={{ cursor: 'pointer' }}>
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt=""
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    initials
                  )}
                  <div className="cam">
                    <Camera size={18} style={{ color: '#fff' }} />
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
                <div className="profile-name">{user?.fullName || 'Usuario'}</div>
                <div className="profile-email">{user?.email}</div>
              </div>
            </div>

            {/* Form */}
            <div className="profile-main">
              <h3>Información personal</h3>

              {success && (
                <div className="form-success">
                  <CheckCircle size={18} /> Perfil actualizado correctamente
                </div>
              )}

              <form onSubmit={handleSubmit} className="form-grid">
                <div>
                  <label className="form-label">Nombre completo</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Correo electrónico</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div>
                    <label className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+57 300 000 0000"
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? <span className="spinner" style={{ width: 20, height: 20 }} /> : 'Guardar Cambios'}
                  </button>
                  <a href="/mis-entradas" className="btn btn-ghost btn-lg">Ver mis entradas</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
