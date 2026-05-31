import { useRef, useEffect } from 'react'
import { Bell, Zap, Calendar, CheckCircle, Info, X } from 'lucide-react'
import { Notification } from '../hooks/useNotifications'

const ICON_MAP: Record<string, React.ReactNode> = {
  preventa: <Zap size={17} />,
  evento:   <Calendar size={17} />,
  pqrs:     <CheckCircle size={17} />,
  general:  <Info size={17} />,
}

interface Props {
  open: boolean
  setOpen: (v: boolean) => void
  notifs: Notification[]
  unreadCount: number
  markAll: () => void
  markOne: (id: string) => void
  remove: (id: string) => void
}

export function NotifBell({ open, setOpen, notifs, unreadCount, markAll, markOne, remove }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [setOpen])

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button
        className="notif-btn"
        onClick={() => setOpen(!open)}
        aria-label="Notificaciones"
      >
        <Bell size={21} />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-panel">
          <div className="notif-head">
            <h4>Notificaciones</h4>
            {unreadCount > 0 && (
              <button onClick={markAll}>Marcar todas como leídas</button>
            )}
          </div>
          <div className="notif-list">
            {notifs.length === 0 ? (
              <div className="notif-empty">No tienes notificaciones</div>
            ) : (
              notifs.map(n => (
                <div
                  key={n.id}
                  className={`notif-row ${n.unread ? 'unread' : ''}`}
                  onMouseEnter={() => markOne(n.id)}
                >
                  <div className={`notif-ic ${n.type}`}>{ICON_MAP[n.type]}</div>
                  <div style={{ flex: 1 }}>
                    <div className="nt">{n.title}</div>
                    <div className="nd">{n.desc}</div>
                    <div className="ntime">{n.time}</div>
                  </div>
                  {n.unread && <div className="notif-unread-dot" />}
                  <button
                    className="notif-del"
                    onClick={e => { e.stopPropagation(); remove(n.id) }}
                    aria-label="Eliminar notificación"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
