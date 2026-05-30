import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Ticket } from 'lucide-react'
import { api } from '../api/client'

export default function PurchaseConfirmation() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const paymentId = searchParams.get('payment_id')
  const statusParam = searchParams.get('status')
  const ref = searchParams.get('ref') || searchParams.get('order_id')

  useEffect(() => {
    if (statusParam === 'approved' || statusParam === 'success') {
      setStatus('success')
    } else if (statusParam === 'failure' || statusParam === 'rejected') {
      setStatus('error')
    } else {
      setStatus('loading')
      if (paymentId) {
        api.get<{ status: string }>(`/tickets/payment/verify?payment_id=${paymentId}`)
          .then(data => setStatus(data.status === 'approved' ? 'success' : 'error'))
          .catch(() => setStatus('error'))
      }
    }
  }, [paymentId, statusParam])

  const ok = status === 'success'

  return (
    <div className="confirm-screen">
      <div
        className="confirm-glow"
        style={{
          background: ok ? 'rgba(34,197,94,0.3)' : status === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(124,58,237,0.3)',
          top: '-80px', right: '10%',
        }}
      />

      {status === 'loading' ? (
        <div className="confirm-card">
          <div className="confirm-ic ok">
            <span className="spinner" style={{ width: 44, height: 44, borderWidth: 4 }} />
          </div>
          <h1>Verificando tu pago…</h1>
          <p>Por favor espera mientras confirmamos tu transacción.</p>
        </div>
      ) : (
        <div className="confirm-card">
          <div className={`confirm-ic ${ok ? 'ok' : 'err'}`}>
            {ok ? <CheckCircle size={44} /> : <XCircle size={44} />}
          </div>
          <h1>{ok ? '¡Compra exitosa!' : 'Pago no completado'}</h1>
          <p>
            {ok
              ? 'Tus entradas fueron generadas y enviadas a tu correo. Ya están disponibles en Mis Entradas.'
              : 'El pago no pudo ser procesado. No se realizó ningún cobro. Puedes intentarlo de nuevo.'}
          </p>

          {ok && ref && (
            <div className="confirm-receipt">
              <div className="rr">
                <span>Orden</span>
                <b>{ref}</b>
              </div>
              {paymentId && (
                <div className="rr">
                  <span>Referencia de pago</span>
                  <b>{paymentId.slice(0, 12).toUpperCase()}</b>
                </div>
              )}
            </div>
          )}

          <div className="confirm-actions">
            {ok ? (
              <>
                <Link to="/mis-entradas" className="btn btn-cta btn-lg">
                  <Ticket size={18} /> Ver Mis Entradas
                </Link>
                <Link to="/" className="btn btn-outline btn-lg">Ver más eventos</Link>
              </>
            ) : (
              <>
                <Link to="/" className="btn btn-primary btn-lg">Intentar de nuevo</Link>
                <Link to="/mis-compras" className="btn btn-ghost btn-lg">Volver al inicio</Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
