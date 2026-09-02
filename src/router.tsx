import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppLayout } from './layouts/AppLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { LoginPage } from './pages/LoginPage'
import { TimeClockPage } from './pages/TimeClockPage'
import { MyRecordsPage } from './pages/MyRecordsPage'
import { EmployeesPage } from './pages/admin/EmployeesPage'
import { TimeRecordsPage } from './pages/admin/TimeRecordsPage'
import { RequestsPage } from './pages/admin/RequestsPage'
import { NotFoundPage } from './pages/NotFoundPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute allowedRoles={['employee', 'admin', 'superadmin']} />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="time-clock" replace />} />
          <Route path="time-clock" element={<TimeClockPage />} />
          <Route path="my-records" element={<MyRecordsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="employees" replace />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="time-records" element={<TimeRecordsPage />} />
          <Route path="requests" element={<RequestsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
