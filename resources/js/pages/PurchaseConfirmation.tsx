import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import { api } from '../api/client'

export default function PurchaseConfirmation() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const paymentId = searchParams.get('payment_id')
  const statusParam = searchParams.get('status')

  useEffect(() => {
    if (statusParam === 'approved' || statusParam === 'success') {
      setStatus('success')
    } else if (statusParam === 'failure' || statusParam === 'rejected') {
      setStatus('error')
    } else {
      setStatus('loading')
      if (paymentId) {
        api.get<any>(`/tickets/payment/verify?payment_id=${paymentId}`)
          .then(data => setStatus(data.status === 'approved' ? 'success' : 'error'))
          .catch(() => setStatus('error'))
      }
    }
  }, [paymentId, statusParam])

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0A0A0F',
      overflow: 'hidden',
      padding: '3rem 1.5rem',
    }}>
      {/* Background orbs */}
      {status === 'success' && (
        <div style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          animation: 'float 8s ease-in-out infinite',
        }} />
      )}
      {status === 'error' && (
        <div style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(248, 113, 113, 0.08) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />
      )}

      <div style={{
        width: '100%',
        maxWidth: 480,
        position: 'relative',
        zIndex: 1,
        animation: 'slideInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      }}>

        {/* Loading */}
        {status === 'loading' && (
          <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(147, 51, 234, 0.1)',
              border: '1px solid rgba(147, 51, 234, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <Loader size={32} style={{ color: '#C084FC', animation: 'spin 1s linear infinite' }} />
            </div>
            <h3 style={{ marginBottom: '0.625rem' }}>Verificando tu pago...</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
              Por favor espera mientras confirmamos tu transacción.
            </p>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 0 32px rgba(34, 197, 94, 0.2)',
            }}>
              <CheckCircle size={40} style={{ color: '#4ADE80' }} />
            </div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#4ADE80',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}>
              Pago aprobado
            </div>
            <h3 style={{ marginBottom: '0.625rem', fontSize: '1.5rem' }}>¡Compra Exitosa!</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '0.9375rem' }}>
              Tus boletas han sido generadas. Puedes verlas en Mis Entradas y descargar el PDF en cualquier momento.
            </p>
            <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/mis-entradas" className="btn btn-primary">Ver Mis Entradas</Link>
              <Link to="/" className="btn btn-outline">Ver Más Eventos</Link>
            </div>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid rgba(248, 113, 113, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 0 32px rgba(248, 113, 113, 0.15)',
            }}>
              <XCircle size={40} style={{ color: '#F87171' }} />
            </div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#F87171',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}>
              Pago rechazado
            </div>
            <h3 style={{ marginBottom: '0.625rem', fontSize: '1.5rem' }}>Pago no completado</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '0.9375rem' }}>
              El pago no pudo ser procesado. Puedes intentarlo de nuevo o contactar soporte.
            </p>
            <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/" className="btn btn-primary">Intentar de Nuevo</Link>
              <Link to="/mis-compras" className="btn btn-outline">Mis Compras</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
