import { useState, useCallback } from 'react'
import { api } from '../api/client'

export interface Ticket {
  id: string
  event_id: string
  event_name: string
  event_date: string
  category_name: string
  seat: string | null
  status: string
  qr_url: string | null
  price: number
}

function mapTicket(raw: any): Ticket {
  const ev = raw.event || {}
  return {
    id: raw.id,
    event_id: ev.id,
    event_name: ev.title,
    event_date: ev.date,
    category_name: raw.category,
    seat: raw.seat ?? null,
    status: raw.status,
    qr_url: raw.qrUrl ?? null,
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
