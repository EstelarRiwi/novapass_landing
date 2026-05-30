import { useState, useCallback } from 'react'
import { api } from '../api/client'
import type { Event } from './useEvents'

function mapFavEvent(raw: any): Event {
  const ev = raw.event || raw
  return {
    id: typeof ev.id === 'string' ? ev.id.trim() : ev.id,
    name: ev.title ?? ev.name ?? '',
    description: ev.description ?? '',
    date: ev.date ?? ev.event_date ?? '',
    location: ev.venue ?? ev.location ?? '',
    image_url: ev.imageUrl ?? ev.image_url ?? null,
    status: ev.status ?? 'active',
    categories: (ev.categories || []).map((c: any) => ({
      id: typeof c.id === 'string' ? c.id.trim() : c.id,
      name: c.name,
      price: c.price,
      capacity: c.total_capacity ?? c.totalCapacity ?? c.capacity ?? c.available ?? 0,
      available: c.available ?? c.available_capacity ?? 0,
    })),
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [favEvents, setFavEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const raw = await api.get<any>('/favorites')
      const list: any[] = raw.favorites || raw || []
      const ids: string[] = list.map((f: any) => {
        const id = f.event?.id ?? f.event_id ?? f.id
        return typeof id === 'string' ? id.trim() : String(id)
      })
      setFavorites(ids)
      setFavEvents(list.map(mapFavEvent))
    } catch {
      // favorites not critical
    } finally {
      setLoading(false)
    }
  }, [])

  const toggle = useCallback(async (eventId: string | number) => {
    const id = typeof eventId === 'string' ? eventId.trim() : String(eventId)
    const isFav = favorites.includes(id)
    try {
      if (isFav) {
        await api.delete(`/favorites/${id}`)
        setFavorites(p => p.filter(x => x !== id))
        setFavEvents(p => p.filter(e => String(e.id).trim() !== id))
      } else {
        await api.post(`/favorites`, { eventId: id })
        setFavorites(p => [...p, id])
      }
    } catch {
      // favorites not critical
    }
  }, [favorites])

  return { favorites, favEvents, loading, fetch, toggle }
}
