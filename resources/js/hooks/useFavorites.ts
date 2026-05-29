import { useState, useCallback } from 'react'
import { api } from '../api/client'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const raw = await api.get<any>('/favorites')
      const list: string[] = (raw.favorites || raw || []).map((f: any) => f.event?.id ?? f.event_id ?? f.id)
      setFavorites(list)
    } catch {
      // Silently ignore — favorites are not critical
    } finally {
      setLoading(false)
    }
  }, [])

  const toggle = useCallback(async (eventId: string) => {
    const isFav = favorites.includes(eventId)
    try {
      if (isFav) {
        await api.delete(`/favorites/${eventId}`)
        setFavorites(p => p.filter(id => id !== eventId))
      } else {
        await api.post(`/favorites`, { eventId })
        setFavorites(p => [...p, eventId])
      }
    } catch {
      // silently ignore — favorites are not critical
    }
  }, [favorites])

  return { favorites, loading, fetch, toggle }
}
