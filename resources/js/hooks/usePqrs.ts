import { useState, useCallback } from 'react'
import { api } from '../api/client'

export interface PqrsRequest {
  id: string
  type: string
  message: string
  status: string
  created_at: string
  responses: { message: string; created_at: string }[]
}

function mapPqrs(raw: any): PqrsRequest {
  return {
    id: raw.id,
    type: raw.type,
    message: raw.message,
    status: raw.status,
    created_at: raw.createdAt || raw.created_at,
    responses: (raw.responses || []).map((r: any) => ({
      message: r.message,
      created_at: r.createdAt || r.created_at,
    })),
  }
}

export function usePqrs() {
  const [requests, setRequests] = useState<PqrsRequest[]>([])
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<any[]>('/pqrs/mine')
      setRequests(data.map(mapPqrs))
    } catch {
      // silently ignore — endpoint may not be available for regular users
    } finally {
      setLoading(false)
    }
  }, [])

  const create = useCallback(async (type: string, message: string) => {
    setLoading(true)
    try {
      await api.post('/pqrs', { type, message })
    } finally {
      setLoading(false)
    }
  }, [])

  return { requests, loading, fetch, create }
}
