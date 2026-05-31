import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect, useRef } from 'react'
import { Ticket, User, ShoppingBag, FileText, Heart, LogOut, Star, Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useNotifications } from '../hooks/useNotifications'
import { NotifBell } from './NotifBell'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [ddOpen, setDdOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const ddRef = useRef<HTMLDivElement>(null)
  const { theme, toggle } = useTheme()
  const { notifs, unreadCount, markAll, markOne } = useNotifications(
    import.meta.env.VITE_WS_URL ?? null
  )

  const transparent = location.pathname === '/' || location.pathname.startsWith('/evento/')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) setDdOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const navClass = `nav ${transparent && !scrolled ? 'is-top' : 'is-scrolled'}`
  const initials = user
    ? user.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : ''

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); setDdOpen(false) }

  return (
    <nav className={navClass}>
      <div className="container container-wide">
        <div className="nav-inner">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-mark">
              <Star size={22} fill="currentColor" strokeWidth={0} />
            </div>
            <span className="nav-logo-text">Nova<b>Pass</b></span>
          </Link>

          <div className="nav-menu desktop">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Eventos
            </Link>
            {user && (
              <Link to="/mis-entradas" className={`nav-link ${location.pathname === '/mis-entradas' ? 'active' : ''}`}>
                <Ticket size={16} /> Mis Entradas
              </Link>
            )}
            {user && (
              <Link to="/mis-favoritos" className={`nav-link ${location.pathname === '/mis-favoritos' ? 'active' : ''}`}>
                <Heart size={16} /> Favoritos
              </Link>
            )}
            <button className="theme-btn" onClick={toggle} aria-label="Cambiar tema" title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
              {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {user && (
              <NotifBell
                open={notifOpen}
                setOpen={setNotifOpen}
                notifs={notifs}
                unreadCount={unreadCount}
                markAll={markAll}
                markOne={markOne}
              />
            )}

            {user ? (
              <div className="nav-account" ref={ddRef}>
                <div className="nav-avatar" onClick={() => setDdOpen(!ddOpen)} title={user.fullName}>
                  {user.avatarUrl
                    ? <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    : initials}
                </div>
                {ddOpen && (
                  <div className="nav-dropdown">
                    <div className="dd-head">
                      <div className="nm">{user.fullName}</div>
                      <div className="em">{user.email}</div>
                    </div>
                    <Link to="/mis-entradas" onClick={() => setDdOpen(false)}><Ticket size={17} /> Mis Entradas</Link>
                    <Link to="/mi-perfil" onClick={() => setDdOpen(false)}><User size={17} /> Mi Perfil</Link>
                    <Link to="/mis-compras" onClick={() => setDdOpen(false)}><ShoppingBag size={17} /> Mis Compras</Link>
                    <Link to="/pqrs" onClick={() => setDdOpen(false)}><FileText size={17} /> PQRS</Link>
                    <button className="logout" onClick={handleLogout}><LogOut size={17} /> Cerrar sesión</button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Link to="/login" className="nav-link">Iniciar Sesión</Link>
                <Link to="/register" className="btn btn-cta btn-sm">Registrarse</Link>
              </div>
            )}
          </div>

          <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Menú">
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {open && (
          <div className="nav-mobile">
            <Link to="/" className="nav-link" onClick={() => setOpen(false)}>Eventos</Link>
            {user && (
              <Link to="/mis-entradas" className="nav-link" onClick={() => setOpen(false)}>
                <Ticket size={18} /> Mis Entradas
              </Link>
            )}
            {user && (
              <Link to="/mis-favoritos" className="nav-link" onClick={() => setOpen(false)}>
                <Heart size={18} /> Favoritos
              </Link>
            )}
            {user && (
              <Link to="/mi-perfil" className="nav-link" onClick={() => setOpen(false)}>
                <User size={18} /> Mi Perfil
              </Link>
            )}
            {user ? (
              <button className="btn btn-outline btn-block" style={{ marginTop: '0.6rem' }} onClick={handleLogout}>
                Cerrar sesión
              </button>
            ) : (
              <button className="btn btn-cta btn-block" style={{ marginTop: '0.6rem' }} onClick={() => { setOpen(false); navigate('/login') }}>
                Iniciar Sesión
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
