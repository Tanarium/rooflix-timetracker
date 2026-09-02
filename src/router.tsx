import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppLayout } from './layouts/AppLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { LoginPage } from './pages/LoginPage'
import { TimeClockPage } from './pages/TimeClockPage'
import { MyRecordsPage } from './pages/MyRecordsPage'
import { MyRequestsPage } from './pages/MyRequestsPage'
import { EmployeesPage } from './pages/admin/EmployeesPage'
import { TimeRecordsPage } from './pages/admin/TimeRecordsPage'
import { RequestsPage } from './pages/admin/RequestsPage'
import { NotFoundPage } from './pages/NotFoundPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute allowedRoles={['employee', 'admin']} />}>
        <Route element={<AppLayout />}>
          <Route path="/fichaje" element={<TimeClockPage />} />
          <Route path="/mis-registros" element={<MyRecordsPage />} />
          <Route path="/mis-solicitudes" element={<MyRequestsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/empleados" element={<EmployeesPage />} />
          <Route path="/registros" element={<TimeRecordsPage />} />
          <Route path="/solicitudes" element={<RequestsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
