import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { EmployeesProvider } from './context/EmployeesContext'
import { TimeEntriesProvider } from './context/TimeEntriesContext'
import { CorrectionRequestsProvider } from './context/CorrectionRequestsContext'
import { AppRouter } from './router'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
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
    </ThemeProvider>
  )
}

export default App
