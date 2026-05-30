import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'

export interface Event {
  id: number
  name: string
  description: string
  date: string
  location: string
  image_url: string | null
  status: string
  categories: Category[]
  is_favorite?: boolean
}

export interface Category {
  id: number
  name: string
  price: number
  capacity: number
  available: number
}

function mapEvent(raw: any): Event {
  return {
    id: typeof raw.id === 'string' ? raw.id.trim() : raw.id,
    name: raw.title ?? raw.name,
    description: raw.description,
    date: raw.date ?? raw.event_date,
    location: raw.venue ?? raw.location,
    image_url: raw.imageUrl ?? raw.image_url ?? null,
    status: raw.status,
    categories: (raw.categories || []).map((c: any) => ({
      id: typeof c.id === 'string' ? c.id.trim() : c.id,
      name: c.name,
      price: c.price,
      capacity: c.total_capacity ?? c.totalCapacity ?? c.capacity ?? c.available ?? 0,
      available: c.available ?? c.available_capacity ?? 0,
    })),
  }
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const raw = await api.get<any>('/events')
      const list: Event[] = (raw.events || raw || []).map(mapEvent)
      setEvents(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { events, loading, error, refetch: fetch }
}

export function useEvent(id: number | string) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api.get<any>(`/events/${id}`)
      .then(raw => setEvent(mapEvent(raw)))
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load event'))
      .finally(() => setLoading(false))
  }, [id])

  return { event, loading, error }
}
