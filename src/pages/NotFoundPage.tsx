import { Link } from 'react-router-dom'
import '../styles/shared.css'

export function NotFoundPage() {
  return (
    <div className="page" style={{ textAlign: 'center' }}>
      <h1>Página no encontrada</h1>
      <p>
        <Link to="/login">Volver al inicio</Link>
      </p>
    </div>
  )
}
