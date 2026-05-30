import { useState, useCallback } from 'react'
import { api } from '../api/client'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_HOST = API_BASE.replace(/\/api$/, '')

export interface Ticket {
  id: string
  event_id: string
  event_name: string
  event_date: string
  event_venue: string
  event_image_url: string | null
  category_name: string
  seat: string | null
  status: string
  qr_path: string | null
  price: number
}

function mapTicket(raw: any): Ticket {
  const ev = raw.event || {}
  const qrRaw = raw.qrUrl ?? raw.qr_url ?? null
  return {
    id: typeof raw.id === 'string' ? raw.id.trim() : raw.id,
    event_id: typeof ev.id === 'string' ? ev.id.trim() : ev.id,
    event_name: ev.title ?? ev.name ?? '',
    event_date: ev.date ?? ev.event_date ?? '',
    event_venue: ev.venue ?? '',
    event_image_url: ev.imageUrl ?? ev.image_url ?? null,
    category_name: raw.category ?? raw.category_name ?? '',
    seat: raw.seat ?? null,
    status: raw.status,
    qr_path: qrRaw ? (qrRaw.startsWith('http') ? qrRaw : `${API_HOST}${qrRaw}`) : null,
    price: raw.price ?? 0,
  }
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const raw = await api.get<any>('/tickets')
      const list: Ticket[] = (raw.tickets || raw || []).map(mapTicket)
      setTickets(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar entradas')
    } finally {
      setLoading(false)
    }
  }, [])

  return { tickets, loading, error, fetch }
}

export function usePurchases() {
  const [purchases, setPurchases] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const raw = await api.get<any>('/tickets/history')
      const list: Ticket[] = (raw.tickets || raw || []).map(mapTicket)
      setPurchases(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar compras')
    } finally {
      setLoading(false)
    }
  }, [])

  return { purchases, loading, error, fetch }
}

export function useCheckout() {
  const [loading, setLoading] = useState(false)

  const createPreference = useCallback(async (eventId: string, categoryId: string, quantity: number) => {
    setLoading(true)
    try {
      const data = await api.post<{ ticket_id: string }>('/tickets/checkout', {
        eventId,
        categoryId,
        quantity,
      })
      return data.ticket_id
    } finally {
      setLoading(false)
    }
  }, [])

  return { createPreference, loading }
}
