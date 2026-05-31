import { useState, useEffect, useRef, useCallback } from 'react'

export interface Notification {
  id: string
  type: 'preventa' | 'evento' | 'pqrs' | 'general'
  title: string
  desc: string
  time: string
  unread: boolean
  receivedAt: Date
}

export function useNotifications(wsUrl: string | null) {
  const [notifs, setNotifs] = useState<Notification[]>([])
  const connectionRef = useRef<any>(null)

  const addNotif = useCallback((payload: Omit<Notification, 'id' | 'unread' | 'receivedAt' | 'time'>) => {
    const notif: Notification = {
      ...payload,
      id: crypto.randomUUID(),
      unread: true,
      receivedAt: new Date(),
      time: 'Ahora',
    }
    setNotifs(prev => [notif, ...prev])
  }, [])

  const markAll = useCallback(() => {
    setNotifs(prev => prev.map(n => ({ ...n, unread: false })))
  }, [])

  const markOne = useCallback((id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n))
  }, [])

  useEffect(() => {
    if (!wsUrl) return
    // SignalR wired in next step
    return () => { connectionRef.current = null }
  }, [wsUrl, addNotif])

  const unreadCount = notifs.filter(n => n.unread).length

  return { notifs, unreadCount, markAll, markOne }
}
