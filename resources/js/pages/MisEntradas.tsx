import { useEffect, useState, useCallback } from 'react'
import { useTickets } from '../hooks/useTickets'
import type { Ticket } from '../hooks/useTickets'
import { Download, Calendar, MapPin, QrCode, Send, Ticket as TicketIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_HOST = API_BASE.replace(/\/api$/, '')

async function fetchAuthBlob(url: string): Promise<string | null> {
  const token = localStorage.getItem('token')
  try {
    const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    if (!res.ok) return null
    const blob = await res.blob()
    return URL.createObjectURL(blob)
  } catch {
    return null
  }
}

async function blobToBase64(url: string): Promise<string | null> {
  const token = localStorage.getItem('token')
  try {
    const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    if (!res.ok) return null
    const blob = await res.blob()
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

function printTicket58mm(ticket: Ticket, qrDataUrl: string) {
  const d = new Date(ticket.event_date)
  const dateStr = d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  const timeStr = d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
  const price = `$${ticket.price.toLocaleString('es-CO')}`
  const code = `NVP-${ticket.id.slice(0, 8).toUpperCase()}`
  const imgSrc = ticket.event_image_url ?? ''

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Entrada NovaPass</title>
<style>
  @page { size: 58mm auto; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { width: 58mm; font-family: Arial, sans-serif; background: #fff; }
  .ticket { width: 58mm; }
  .hero { width: 58mm; height: 34mm; position: relative; overflow: hidden; background: #2d1b69; }
  .hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(76,29,149,0.25) 0%, rgba(26,15,46,0.88) 100%); }
  .hero-body { position: absolute; bottom: 0; left: 0; right: 0; padding: 5px 7px 7px; color: #fff; }
  .brand { font-size: 6.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.85; }
  .ev-name { font-size: 10.5px; font-weight: 800; line-height: 1.18; margin-top: 2px; }
  .ev-venue { font-size: 6.8px; opacity: 0.82; margin-top: 1.5px; }
  .body { padding: 7px 8px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 8px; margin-bottom: 7px; }
  .lbl { font-size: 5.8px; text-transform: uppercase; letter-spacing: 0.09em; color: #888; font-weight: 800; }
  .val { font-size: 8px; font-weight: 700; color: #1a0f2e; margin-top: 1px; }
  .perf { height: 13px; position: relative; overflow: visible; margin: 2px 0; }
  .perf::before, .perf::after { content: ''; position: absolute; top: 50%; transform: translateY(-50%); width: 13px; height: 13px; border-radius: 50%; background: #f0f0f0; z-index: 2; }
  .perf::before { left: -6.5px; }
  .perf::after { right: -6.5px; }
  .perf-line { position: absolute; top: 50%; left: 10px; right: 10px; border-top: 1.5px dashed #ddd; }
  .qr-section { display: flex; flex-direction: column; align-items: center; padding: 5px 8px 4px; }
  .qr-img { width: 34mm; height: 34mm; }
  .qr-lbl { font-size: 6px; color: #999; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
  .perf2 { height: 13px; position: relative; overflow: visible; margin: 4px 0 2px; }
  .perf2::before, .perf2::after { content: ''; position: absolute; top: 50%; transform: translateY(-50%); width: 13px; height: 13px; border-radius: 50%; background: #f0f0f0; z-index: 2; }
  .perf2::before { left: -6.5px; }
  .perf2::after { right: -6.5px; }
  .perf2-line { position: absolute; top: 50%; left: 10px; right: 10px; border-top: 1.5px dashed #ddd; }
  .barcode-section { display: flex; flex-direction: column; align-items: center; padding: 5px 8px 8px; }
  .barcode-section svg { max-width: 100%; }
  .code-num { text-align: center; font-size: 6.5px; letter-spacing: 0.28em; color: #555; font-weight: 700; margin-top: 3px; }
</style>
<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>
</head>
<body>
<div class="ticket">
  <div class="hero">
    <div class="hero-overlay"></div>
    <div class="hero-body">
      <div class="brand">NovaPass · Entrada oficial</div>
      <div class="ev-name">${ticket.event_name}</div>
      <div class="ev-venue">${ticket.event_venue}</div>
    </div>
  </div>
  <div class="body">
    <div class="grid">
      <div><div class="lbl">Categoría</div><div class="val">${ticket.category_name}</div></div>
      <div><div class="lbl">Precio</div><div class="val">${price}</div></div>
      <div><div class="lbl">Fecha</div><div class="val">${dateStr}</div></div>
      <div><div class="lbl">Hora</div><div class="val">${timeStr}</div></div>
      ${ticket.seat ? `<div style="grid-column:1/-1"><div class="lbl">Ubicación</div><div class="val">${ticket.seat}</div></div>` : ''}
    </div>
  </div>
  <div class="perf"><div class="perf-line"></div></div>
  <div class="qr-section">
    <img class="qr-img" src="${qrDataUrl}">
    <div class="qr-lbl">Presenta este código en la entrada</div>
  </div>
  <div class="perf2"><div class="perf2-line"></div></div>
  <div class="barcode-section">
    <svg id="barcode"></svg>
    <div class="code-num">${code}</div>
  </div>
</div>
<script>
window.onload = () => {
  JsBarcode('#barcode', '${ticket.id.replace(/-/g, '').slice(0, 20).toUpperCase()}', {
    format: 'CODE128', width: 1.2, height: 28, displayValue: false, margin: 0, background: '#ffffff', lineColor: '#1a0f2e'
  });
};
</script>
</body>
</html>`

  const w = window.open('', '_blank', 'width=240,height=700')
  if (w) { w.document.write(html); w.document.close() }
}

export default function MisEntradas() {
  const { tickets, loading, fetch: fetchTickets } = useTickets()
  const [tab, setTab] = useState<'active' | 'used'>('active')
  const [qrBlobs, setQrBlobs] = useState<Record<string, string>>({})
  const [printing, setPrinting] = useState<string | null>(null)

  useEffect(() => { fetchTickets() }, [])

  useEffect(() => {
    tickets.forEach(t => {
      if (t.qr_path && !qrBlobs[t.id]) {
        fetchAuthBlob(t.qr_path).then(url => {
          if (url) setQrBlobs(prev => ({ ...prev, [t.id]: url }))
        })
      }
    })
  }, [tickets])

  const handlePrint = useCallback(async (ticket: Ticket) => {
    setPrinting(ticket.id)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API_BASE}/tickets/${ticket.id}/pdf`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) throw new Error('PDF no disponible')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `NovaPass-${ticket.id.slice(0, 8).toUpperCase()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('No se pudo descargar el PDF. Intenta de nuevo.')
    } finally {
      setPrinting(null)
    }
  }, [])

  const list = tickets.filter(t => tab === 'active' ? t.status === 'active' : t.status !== 'active')

  return (
    <>
      <section className="page-head">
        <div className="page-head-glow" />
        <div className="container container-wide page-head-inner">
          <span className="eyebrow"><span className="bar" />Tu cartera digital</span>
          <h1>Mis Entradas</h1>
          <p>Presenta el QR en la entrada del evento. Sin imprimir, sin filas.</p>
        </div>
      </section>

      <section className="section">
        <div className="container container-wide">
          <div className="tickets-tabs">
            <button className={`ttab ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>Activas</button>
            <button className={`ttab ${tab === 'used' ? 'active' : ''}`} onClick={() => setTab('used')}>Historial</button>
          </div>

          {loading ? (
            <div className="tickets-wrap">
              {[1, 2].map(i => (
                <div key={i} className="tstub">
                  <div className="tstub-main">
                    <div className="skeleton" style={{ width: 80, height: 80, borderRadius: 12, flexShrink: 0 }} />
                    <div className="tstub-main-in" style={{ flex: 1 }}>
                      <div className="skeleton" style={{ height: 18, borderRadius: 8, marginBottom: 10, width: '60%' }} />
                      <div className="skeleton" style={{ height: 14, borderRadius: 8, width: '40%' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="empty">
              <div className="empty-ic"><QrCode size={34} /></div>
              <h3>{tab === 'active' ? 'Sin entradas activas' : 'Sin historial'}</h3>
              <p>Cuando compres boletas aparecerán aquí, listas para escanear.</p>
              <Link to="/" className="btn btn-primary">Explorar Eventos</Link>
            </div>
          ) : (
            <div className="tickets-wrap">
              {list.map(ticket => {
                const used = ticket.status !== 'active'
                const d = new Date(ticket.event_date)
                const dateStr = d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'long' })
                const qrSrc = qrBlobs[ticket.id]
                return (
                  <div key={ticket.id} className={`tstub ${used ? 'tstub-used' : ''}`}>
                    <div className="tstub-main">
                      {ticket.event_image_url && (
                        <div className="tstub-img" style={{ backgroundImage: `url(${ticket.event_image_url})` }} />
                      )}
                      {used && <div className="used-stamp">Usada</div>}
                      <div className="tstub-main-in">
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.7rem' }}>
                          <span className={`badge ${used ? 'badge-error' : 'badge-success'}`}>{used ? 'Usada' : 'Activa'}</span>
                          <span className="badge badge-primary">{ticket.category_name}</span>
                        </div>
                        <h3 className="tstub-event">{ticket.event_name}</h3>
                        <div className="tstub-meta">
                          <div>
                            <div className="k">Fecha</div>
                            <div className="v"><Calendar size={14} /> {dateStr}</div>
                          </div>
                          <div>
                            <div className="k">Recinto</div>
                            <div className="v"><MapPin size={14} /> {ticket.event_venue || 'Por confirmar'}</div>
                          </div>
                          <div>
                            <div className="k">Categoría</div>
                            <div className="v"><TicketIcon size={14} /> {ticket.category_name}</div>
                          </div>
                          <div>
                            <div className="k">Precio</div>
                            <div className="v">${ticket.price.toLocaleString('es-CO')}</div>
                          </div>
                        </div>
                        <div className="tstub-actions">
                          <button
                            className="btn btn-outline btn-sm"
                            disabled={used || printing === ticket.id}
                            onClick={() => handlePrint(ticket)}
                          >
                            <Download size={15} />
                            {printing === ticket.id ? 'Preparando…' : 'Descargar PDF'}
                          </button>
                          <button className="btn btn-ghost btn-sm">
                            <Send size={15} /> Compartir
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="tstub-qr">
                      <div className="qr-box">
                        {qrSrc
                          ? <img src={qrSrc} alt="QR de la entrada" style={{ width: 130, height: 130 }} />
                          : <div style={{ width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <QrCode size={60} style={{ color: 'var(--color-primary)', opacity: 0.4 }} />
                            </div>
                        }
                      </div>
                      <div className="tstub-seat">#NVP-{ticket.id.slice(0, 8).toUpperCase()}</div>
                      <div className="tstub-scan">{used ? 'Entrada validada' : 'Escanea en el acceso'}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
