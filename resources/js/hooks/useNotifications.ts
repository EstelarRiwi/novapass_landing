import { useState, useEffect, useRef, useCallback } from 'react'
import * as signalR from '@microsoft/signalr'
import { api } from '../api/client'

export interface Notification {
  id: string
  type: 'preventa' | 'evento' | 'pqrs' | 'general'
  title: string
  desc: string
  time: string
  unread: boolean
  receivedAt: Date
}

interface ApiNotification {
  id: string
  title: string
  desc: string
  type: string
  isRead: boolean
  createdAt: string
}

interface RawPayload {
  id: string
  title: string
  desc: string
  type: string
  timestamp: string
}

function formatTime(dt: string | Date): string {
  const diff = Date.now() - new Date(dt).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Ahora'
  if (mins < 60) return `Hace ${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Hace ${hours}h`
  return `Hace ${Math.floor(hours / 24)}d`
}

function fromApi(n: ApiNotification): Notification {
  return {
    id: n.id,
    type: (n.type as Notification['type']) ?? 'general',
    title: n.title,
    desc: n.desc,
    time: formatTime(n.createdAt),
    unread: !n.isRead,
    receivedAt: new Date(n.createdAt),
  }
}

export function useNotifications(wsBaseUrl: string | null, userId: string | null) {
  const [notifs, setNotifs] = useState<Notification[]>([])
  const connectionRef = useRef<signalR.HubConnection | null>(null)

  const fetchNotifs = useCallback(async () => {
    if (!userId) { setNotifs([]); return }
    try {
      const data = await api.get<ApiNotification[]>('/notifications')
      setNotifs(data.map(fromApi))
    } catch { }
  }, [userId])

  useEffect(() => {
    fetchNotifs()
  }, [fetchNotifs])

  const addNotif = useCallback((raw: RawPayload) => {
    const notif: Notification = {
      id: raw.id || crypto.randomUUID(),
      type: (raw.type as Notification['type']) ?? 'general',
      title: raw.title,
      desc: raw.desc,
      time: 'Ahora',
      unread: true,
      receivedAt: new Date(raw.timestamp),
    }
    setNotifs(prev => {
      const next = [notif, ...prev]
      return next.slice(0, 10)
    })
  }, [])

  const markAll = useCallback(async () => {
    setNotifs(prev => prev.map(n => ({ ...n, unread: false })))
    try { await api.patch('/notifications/mark-all') } catch { }
  }, [])

  const markOne = useCallback(async (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n))
    try { await api.patch(`/notifications/${id}/read`) } catch { }
  }, [])

  const remove = useCallback(async (id: string) => {
    setNotifs(prev => prev.filter(n => n.id !== id))
    try { await api.delete(`/notifications/${id}`) } catch { }
  }, [])

  useEffect(() => {
    if (!wsBaseUrl || !userId) return

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${wsBaseUrl}/hubs/notifications`, {
        accessTokenFactory: () => localStorage.getItem('token') ?? ''
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    connectionRef.current = conn
    conn.on('ReceiveNotification', (payload: RawPayload) => addNotif(payload))
    conn.start().catch(err => console.warn('SignalR connect failed:', err))

    return () => { conn.stop() }
  }, [wsBaseUrl, userId, addNotif])

  const unreadCount = notifs.filter(n => n.unread).length

  return { notifs, unreadCount, markAll, markOne, remove }
}
