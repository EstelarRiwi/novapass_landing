import { useState, useCallback } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

export function useProfile() {
  const { updateUser } = useAuth()
  const [loading, setLoading] = useState(false)

function mapUser(raw: any) {
  return {
    id: raw.id,
    fullName: raw.fullName || raw.name || null,
    email: raw.email,
    avatarUrl: raw.avatarUrl || raw.photo_url || null,
    phone: raw.phone || null,
    role: raw.role,
  }
}

  const update = useCallback(async (data: { name?: string; email?: string }) => {
    setLoading(true)
    try {
      const raw = await api.put<any>('/auth/profile', data)
      updateUser(mapUser(raw))
    } finally {
      setLoading(false)
    }
  }, [updateUser])

  const uploadPhoto = useCallback(async (file: File) => {
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/profile/photo`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${api.getToken()}` },
          body: form,
        }
      )
      const raw = await res.json()
      updateUser(mapUser(raw))
    } finally {
      setLoading(false)
    }
  }, [updateUser])

  return { update, uploadPhoto, loading }
}
