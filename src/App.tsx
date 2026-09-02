import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { EmployeesProvider } from './context/EmployeesContext'
import { TimeEntriesProvider } from './context/TimeEntriesContext'
import { CorrectionRequestsProvider } from './context/CorrectionRequestsContext'
import { AppRouter } from './router'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EmployeesProvider>
          <TimeEntriesProvider>
            <CorrectionRequestsProvider>
              <AppRouter />
            </CorrectionRequestsProvider>
          </TimeEntriesProvider>
        </EmployeesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
