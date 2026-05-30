import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents'
import { EventCard } from '../components/EventCard'
import { useAuth } from '../context/AuthContext'
import { ChevronRight, Music, Mic2, Drum, Guitar, Flame, ArrowRight, MapPin, Clock } from 'lucide-react'

const GENRES = [
  { label: 'Todos', icon: <Music size={16} /> },
  { label: 'Pop & Rock', icon: <Guitar size={16} /> },
  { label: 'Electrónica', icon: <Drum size={16} /> },
  { label: 'Urbano', icon: <Mic2 size={16} /> },
  { label: 'Festivales', icon: <Flame size={16} /> },
]

const MARQUEE_ARTISTS = ['Karol G', 'Coldplay', 'Feid', 'Tame Impala', 'Bad Bunny', 'Olivia Rodrigo', 'Bomba Estéreo', 'Andrés Cepeda', 'Blessd', 'The Blaze']

function MarqueeTicker() {
  const names = [...MARQUEE_ARTISTS, ...MARQUEE_ARTISTS]
  return (
    <div className="marquee">
      <div className="marquee-track">
        {names.map((nm, i) => (
          <span className="marquee-item" key={i}>
            {nm}
            <svg className="star" width={13} height={13} viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}

const FALLBACK_EVENT = {
  id: 'karolg-2026',
  name: 'Karol G · Mañana Será Bonito Tour',
  location: 'El Campín · Bogotá',
  date: '2026-09-20T21:00:00',
  image_url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=900&q=80',
  categories: [{ price: 180000 }],
}

export default function Home() {
  const { events, loading } = useEvents()
  const { user } = useAuth()
  const [activeGenre, setActiveGenre] = useState('Todos')
  const featured = events[0] ?? (!loading ? FALLBACK_EVENT : null)

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-photo" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1400&q=80)' }} />
        <div className="hero-scrim" />
        <div className="hero-glow a" />
        <div className="hero-glow b" />
        <div className="container container-wide">
          <div className="hero-inner">
            <div className="hero-copy">
              <span className="eyebrow on-dark">
                <span className="bar" />
                La música en vivo te espera
              </span>
              <h1 className="hero-title">
                Vive la <span className="accent">experiencia</span>
                <br />
                <span className="stroke">NovaPass</span>
              </h1>
              <p className="hero-sub">
                Descubre los mejores conciertos y festivales, asegura tus boletas en
                segundos y lleva tus entradas digitales siempre contigo.
              </p>
              <div className="hero-actions">
                <a
                  href="#eventos"
                  className="btn btn-cta btn-lg"
                  onClick={e => { e.preventDefault(); document.getElementById('eventos')?.scrollIntoView({ behavior: 'smooth' }) }}
                >
                  Explorar Eventos <ChevronRight size={20} />
                </a>
                {!user && (
                  <Link to="/register" className="btn btn-glass btn-lg">
                    Crear Cuenta
                  </Link>
                )}
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <div className="n">500<b>+</b></div>
                  <div className="l">Eventos al año</div>
                </div>
                <div className="hero-stat">
                  <div className="n">32</div>
                  <div className="l">Ciudades</div>
                </div>
                <div className="hero-stat">
                  <div className="n">1.2<b>M</b></div>
                  <div className="l">Asistentes felices</div>
                </div>
              </div>
            </div>

            {/* Spotlight card */}
            {featured && (() => {
              const isFallback = featured.id === FALLBACK_EVENT.id
              const inner = (
                <>
                  <div className="spotlight-img" style={featured.image_url ? { backgroundImage: `url(${featured.image_url})` } : { background: 'linear-gradient(135deg, #6D28D9, #4C1D95)' }} />
                  <div className="spotlight-grad" />
                  <div className="spotlight-top">
                    <span className="badge" style={{ background: 'rgba(249,115,22,0.92)', color: '#fff' }}>
                      <Flame size={12} fill="currentColor" strokeWidth={0} /> Evento destacado
                    </span>
                    <div className="datepill">
                      <div className="d">{new Date(featured.date).getDate()}</div>
                      <div className="m">{new Date(featured.date).toLocaleDateString('es-CO', { month: 'short' }).replace('.', '').toUpperCase()}</div>
                    </div>
                  </div>
                  <div className="spotlight-body">
                    <div className="city">{featured.location}</div>
                    <h3>{featured.name}</h3>
                    <div className="spotlight-meta">
                      <span><MapPin size={15} /> {featured.location}</span>
                      <span><Clock size={15} /> {new Date(featured.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="spotlight-cta">
                      <div className="spotlight-price">
                        <small>Boletas desde</small>
                        <b>${featured.categories.length > 0 ? Math.min(...featured.categories.map(c => c.price)).toLocaleString('es-CO') : '0'}</b>
                      </div>
                      <span className="btn btn-cta">Comprar <ArrowRight size={17} /></span>
                    </div>
                  </div>
                </>
              )
              return isFallback
                ? <div className="spotlight">{inner}</div>
                : <Link to={`/evento/${featured.id}`} className="spotlight" style={{ textDecoration: 'none' }}>{inner}</Link>
            })()}
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <MarqueeTicker />

      {/* ── Events grid ── */}
      <section className="section" id="eventos">
        <div className="container container-wide">
          <div className="section-head">
            <div>
              <span className="eyebrow"><span className="bar" /> Cartelera 2026</span>
              <h2 style={{ marginTop: '0.6rem' }}>Próximos eventos</h2>
            </div>
            <div className="chips">
              {GENRES.map(g => (
                <button
                  key={g.label}
                  className={`chip ${activeGenre === g.label ? 'active' : ''}`}
                  onClick={() => setActiveGenre(g.label)}
                >
                  {g.icon} {g.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="evgrid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="evcard">
                  <div className="skeleton" style={{ aspectRatio: '16/11' }} />
                  <div style={{ padding: '1.15rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                    <div className="skeleton" style={{ height: 22, borderRadius: 8 }} />
                    <div className="skeleton" style={{ height: 14, borderRadius: 8, width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="empty">
              <div className="empty-ic"><Music size={36} /></div>
              <h3>Sin eventos disponibles</h3>
              <p>Vuelve pronto para ver la cartelera actualizada.</p>
            </div>
          ) : (
            <div className="evgrid">
              {events.map((ev, i) => <EventCard key={ev.id} event={ev} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Feature banner (second event) ── */}
      {events[1] && (
        <section className="section-tight">
          <div className="container container-wide">
            <div className="feature-banner">
              <div
                className="feature-banner-img"
                style={events[1].image_url
                  ? { backgroundImage: `url(${events[1].image_url})` }
                  : { background: 'linear-gradient(135deg, #4C1D95, #6D28D9)' }
                }
              />
              <div className="feature-banner-grad" />
              <div className="feature-banner-body">
                <span className="eyebrow on-dark"><span className="bar" /> Evento especial</span>
                <h2>{events[1].name}</h2>
                <p>{events[1].description || 'Una experiencia única que no te puedes perder.'}</p>
                <div className="feature-lineup">
                  <span className="badge badge-glass">
                    <MapPin size={12} /> {events[1].location}
                  </span>
                  {events[1].categories.length > 0 && (
                    <span className="badge badge-cta" style={{ background: 'rgba(249,115,22,0.92)', color: '#fff' }}>
                      Desde ${Math.min(...events[1].categories.map(c => c.price)).toLocaleString('es-CO')}
                    </span>
                  )}
                </div>
                <Link to={`/evento/${events[1].id}`} className="btn btn-cta btn-lg">
                  Ver detalles <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── App / Newsletter CTA ── */}
      <section className="section-tight">
        <div className="container container-wide">
          <div className="appcta">
            <div className="appcta-glow" />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <span className="eyebrow on-dark"><span className="bar" /> NovaPass App</span>
              <h2>Tu entrada siempre <br />en tu bolsillo</h2>
              <p>Descarga la app y lleva todas tus entradas digitales contigo. Sin impresiones, sin complicaciones.</p>
              <div className="store-btns">
                <a href="#" className="store-btn">
                  <div>
                    <div className="sm">Disponible en</div>
                    <div className="lg">App Store</div>
                  </div>
                </a>
                <a href="#" className="store-btn">
                  <div>
                    <div className="sm">Disponible en</div>
                    <div className="lg">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
            <div className="newsletter" style={{ position: 'relative', zIndex: 2 }}>
              <h3 style={{ color: '#fff', marginBottom: '0.6rem' }}>Recibe novedades</h3>
              <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '1.2rem', fontSize: '0.9rem' }}>
                Sé el primero en enterarte de nuevos eventos.
              </p>
              <div className="newsletter-form">
                <input type="email" placeholder="tucorreo@ejemplo.com" />
                <button className="btn btn-cta btn-sm" style={{ flexShrink: 0 }}>Suscribirse</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
