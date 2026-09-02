import { useContext } from 'react'
import { EmployeesContext } from './employees-context'

export function useEmployees() {
  const context = useContext(EmployeesContext)
  if (!context) {
    throw new Error('useEmployees debe usarse dentro de un EmployeesProvider')
  }
  return context
}
