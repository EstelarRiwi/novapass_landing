import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container container-wide">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div className="nav-logo-mark" style={{ width: 32, height: 32 }}>
                <Star size={18} fill="currentColor" strokeWidth={0} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>
                Nova<b style={{ color: 'var(--color-cta)' }}>Pass</b>
              </span>
            </div>
            <p>La plataforma #1 para comprar boletas a los mejores conciertos y festivales de Colombia.</p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a href="#" aria-label="YouTube">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4>Eventos</h4>
            <div className="footer-links">
              <Link to="/">Próximos eventos</Link>
              <Link to="/">Conciertos</Link>
              <Link to="/">Festivales</Link>
              <Link to="/">Teatro</Link>
            </div>
          </div>
          <div>
            <h4>Mi cuenta</h4>
            <div className="footer-links">
              <Link to="/mis-entradas">Mis Entradas</Link>
              <Link to="/mis-compras">Mis Compras</Link>
              <Link to="/mis-favoritos">Favoritos</Link>
              <Link to="/mi-perfil">Mi Perfil</Link>
            </div>
          </div>
          <div>
            <h4>Ayuda</h4>
            <div className="footer-links">
              <Link to="/pqrs">PQRS</Link>
              <a href="#">Términos y condiciones</a>
              <a href="#">Política de privacidad</a>
              <a href="#">Contacto</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} NovaPass. Todos los derechos reservados.</span>
          <span>Hecho con ♥ en Colombia</span>
        </div>
      </div>
    </footer>
  )
}
