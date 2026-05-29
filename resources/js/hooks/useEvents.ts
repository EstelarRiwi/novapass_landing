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
    id: raw.id,
    name: raw.title,
    description: raw.description,
    date: raw.date,
    location: raw.venue,
    image_url: raw.image_url,
    status: raw.status,
    categories: (raw.categories || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      price: c.price,
      capacity: c.total_capacity ?? c.capacity ?? c.available,
      available: c.available,
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
