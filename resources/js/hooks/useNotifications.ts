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

function storageKey(userId: string) {
  return `novapass_notifs_${userId}`
}

function loadStored(userId: string | null): Notification[] {
  if (!userId) return []
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) return []
    return (JSON.parse(raw) as Notification[]).map(n => ({
      ...n,
      receivedAt: new Date(n.receivedAt),
    }))
  } catch {
    return []
  }
}

export function useNotifications(wsBaseUrl: string | null, userId: string | null) {
  const [notifs, setNotifs] = useState<Notification[]>(() => loadStored(userId))
  const connectionRef = useRef<signalR.HubConnection | null>(null)

  useEffect(() => {
    setNotifs(loadStored(userId))
  }, [userId])

  useEffect(() => {
    if (!userId) return
    localStorage.setItem(storageKey(userId), JSON.stringify(notifs))
  }, [notifs, userId])

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

  const remove = useCallback((id: string) => {
    setNotifs(prev => prev.filter(n => n.id !== id))
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
