import { useState, useEffect, useRef, useCallback } from 'react'
import * as signalR from '@microsoft/signalr'

export interface Notification {
  id: string
  type: 'preventa' | 'evento' | 'pqrs' | 'general'
  title: string
  desc: string
  time: string
  unread: boolean
  receivedAt: Date
}

interface RawPayload {
  title: string
  desc: string
  type: string
  timestamp: string
}

export function useNotifications(wsBaseUrl: string | null) {
  const [notifs, setNotifs] = useState<Notification[]>([])
  const connectionRef = useRef<signalR.HubConnection | null>(null)

  const addNotif = useCallback((raw: RawPayload) => {
    const notif: Notification = {
      id: crypto.randomUUID(),
      type: (raw.type as Notification['type']) ?? 'general',
      title: raw.title,
      desc: raw.desc,
      time: 'Ahora',
      unread: true,
      receivedAt: new Date(raw.timestamp),
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
    if (!wsBaseUrl) return

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${wsBaseUrl}/hubs/notifications`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    connectionRef.current = conn
    conn.on('ReceiveNotification', (payload: RawPayload) => addNotif(payload))
    conn.start().catch(err => console.warn('SignalR connect failed:', err))

    return () => { conn.stop() }
  }, [wsBaseUrl, addNotif])

  const unreadCount = notifs.filter(n => n.unread).length

  return { notifs, unreadCount, markAll, markOne }
}
