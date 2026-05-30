import { useEffect, useState, useCallback } from 'react'
import { useTickets, usePurchases } from '../hooks/useTickets'
import type { Ticket } from '../hooks/useTickets'
import { Download, Calendar, MapPin, QrCode, Send, Ticket as TicketIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import JsBarcode from 'jsbarcode'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

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

async function generateTicketPDF(ticket: Ticket, qrBlobUrl: string): Promise<void> {
  const d = new Date(ticket.event_date)
  const dateStr = d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  const timeStr = d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
  const price = `$${ticket.price.toLocaleString('es-CO')}`
  const code = `NVP-${ticket.id.slice(0, 8).toUpperCase()}`
  const barcodeValue = ticket.id.replace(/-/g, '').slice(0, 20).toUpperCase()

  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;left:-9999px;top:0;width:220px;background:#fff;font-family:Arial,sans-serif;'

  container.innerHTML = `
    <div style="width:220px;background:#fff;">
      <div style="background:linear-gradient(135deg,#4C1D95,#7C3AED);padding:16px 20px 14px;color:#fff;">
        <div style="font-size:8px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;opacity:0.85;margin-bottom:6px;">NovaPass &middot; Entrada oficial</div>
        <div style="font-size:16px;font-weight:800;line-height:1.2;margin-bottom:3px;">${ticket.event_name}</div>
        <div style="font-size:10px;opacity:0.82;">${ticket.event_venue}</div>
      </div>
      <div style="padding:14px 18px 10px;display:grid;grid-template-columns:1fr 1fr;gap:10px 14px;">
        <div>
          <div style="font-size:7px;text-transform:uppercase;letter-spacing:0.09em;color:#888;font-weight:800;">Categoria</div>
          <div style="font-size:12px;font-weight:700;color:#1a0f2e;margin-top:2px;">${ticket.category_name}</div>
        </div>
        <div>
          <div style="font-size:7px;text-transform:uppercase;letter-spacing:0.09em;color:#888;font-weight:800;">Precio</div>
          <div style="font-size:12px;font-weight:700;color:#1a0f2e;margin-top:2px;">${price}</div>
        </div>
        <div>
          <div style="font-size:7px;text-transform:uppercase;letter-spacing:0.09em;color:#888;font-weight:800;">Fecha</div>
          <div style="font-size:10px;font-weight:700;color:#1a0f2e;margin-top:2px;">${dateStr}</div>
        </div>
        <div>
          <div style="font-size:7px;text-transform:uppercase;letter-spacing:0.09em;color:#888;font-weight:800;">Hora</div>
          <div style="font-size:12px;font-weight:700;color:#1a0f2e;margin-top:2px;">${timeStr}</div>
        </div>
        ${ticket.seat ? `<div style="grid-column:1/-1"><div style="font-size:7px;text-transform:uppercase;letter-spacing:0.09em;color:#888;font-weight:800;">Ubicacion</div><div style="font-size:12px;font-weight:700;color:#1a0f2e;margin-top:2px;">${ticket.seat}</div></div>` : ''}
      </div>
      <div style="border-top:2px dashed #e5e7eb;margin:4px 16px;"></div>
      <div style="display:flex;flex-direction:column;align-items:center;padding:14px 20px 10px;">
        <img id="qr-img" src="${qrBlobUrl}" style="width:130px;height:130px;display:block;">
        <div style="font-size:8px;color:#999;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin-top:6px;">Presenta este codigo en la entrada</div>
      </div>
      <div style="border-top:2px dashed #e5e7eb;margin:4px 16px;"></div>
      <div style="display:flex;flex-direction:column;align-items:center;padding:10px 20px 14px;">
        <canvas id="barcode-canvas"></canvas>
        <div style="font-size:8px;letter-spacing:0.28em;color:#555;font-weight:700;margin-top:4px;">${code}</div>
      </div>
    </div>
  `

  document.body.appendChild(container)

  const barcodeCanvas = container.querySelector('#barcode-canvas') as HTMLCanvasElement
  JsBarcode(barcodeCanvas, barcodeValue, {
    format: 'CODE128', width: 1.5, height: 40, displayValue: false, margin: 0, background: '#ffffff', lineColor: '#1a0f2e',
  })

  await new Promise<void>(resolve => {
    const img = container.querySelector('#qr-img') as HTMLImageElement
    if (img.complete) resolve()
    else { img.onload = () => resolve(); img.onerror = () => resolve() }
  })

  const canvas = await html2canvas(container.firstElementChild as HTMLElement, {
    scale: 3, useCORS: true, backgroundColor: '#ffffff', logging: false,
  })

  document.body.removeChild(container)

  const imgData = canvas.toDataURL('image/png')
  const pdfW = 58
  const pdfH = (canvas.height / canvas.width) * pdfW
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfW, pdfH] })
  pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH)
  pdf.save(`NovaPass-${code}.pdf`)
}

export default function MisEntradas() {
  const { tickets: activeTickets, loading: loadingActive, fetch: fetchActive } = useTickets()
  const { purchases: historyTickets, loading: loadingHistory, fetch: fetchHistory } = usePurchases()
  const [tab, setTab] = useState<'active' | 'used'>('active')
  const [qrBlobs, setQrBlobs] = useState<Record<string, string>>({})
  const [printing, setPrinting] = useState<string | null>(null)
  const [qrModal, setQrModal] = useState<string | null>(null)

  const loading = tab === 'active' ? loadingActive : loadingHistory

  useEffect(() => { fetchActive() }, [])
  useEffect(() => { if (tab === 'used') fetchHistory() }, [tab])

  const allTickets = tab === 'active' ? activeTickets : historyTickets

  useEffect(() => {
    allTickets.forEach(t => {
      if (t.qr_path && !qrBlobs[t.id]) {
        fetchAuthBlob(t.qr_path).then(url => {
          if (url) setQrBlobs(prev => ({ ...prev, [t.id]: url }))
        })
      }
    })
  }, [allTickets])

  const handleDownload = useCallback(async (ticket: Ticket) => {
    const qrUrl = qrBlobs[ticket.id]
    if (!qrUrl) return
    setPrinting(ticket.id)
    try {
      await generateTicketPDF(ticket, qrUrl)
    } catch {
      alert('No se pudo generar el PDF. Intenta de nuevo.')
    } finally {
      setPrinting(null)
    }
  }, [qrBlobs])

  const list = allTickets

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
                            disabled={used || printing === ticket.id || !qrSrc}
                            onClick={() => handleDownload(ticket)}
                          >
                            <Download size={15} />
                            {printing === ticket.id ? 'Generando…' : 'Descargar PDF'}
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
                          ? <img
                              src={qrSrc}
                              alt="QR de la entrada"
                              style={{ width: 130, height: 130, cursor: 'zoom-in' }}
                              onClick={() => setQrModal(qrSrc)}
                            />
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

      {qrModal && (
        <div
          onClick={() => setQrModal(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 16, padding: '1.5rem',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            }}
          >
            <img src={qrModal} alt="QR de la entrada" style={{ width: 260, height: 260, display: 'block' }} />
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Presenta este código en la entrada
            </p>
            <button
              onClick={() => setQrModal(null)}
              style={{ background: 'none', border: 'none', fontSize: '0.85rem', color: '#9333EA', fontWeight: 700, cursor: 'pointer', padding: '0.25rem 0.5rem' }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
