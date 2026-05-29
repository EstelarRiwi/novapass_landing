import { useState, useCallback } from 'react'
import { api } from '../api/client'

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<{ event_id: number }[]>('/favorites')
      setFavorites(data.map(f => f.event_id))
    } catch {
      // Silently ignore — favorites are not critical
    } finally {
      setLoading(false)
    }
  }, [])

  const toggle = useCallback(async (eventId: number) => {
    const isFav = favorites.includes(eventId)
    try {
      if (isFav) {
        await api.delete(`/favorites/${eventId}`)
        setFavorites(p => p.filter(id => id !== eventId))
      } else {
        await api.post(`/favorites`, { event_id: eventId })
        setFavorites(p => [...p, eventId])
      }
    } catch {
      // silently ignore — favorites are not critical
    }
  }, [favorites])

  return { favorites, loading, fetch, toggle }
}
