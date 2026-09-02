import type { Role } from '../types'

const roleSuffix: Partial<Record<Role, string>> = {
  admin: '· Admin',
  superadmin: '· Superadmin',
}

export function ShellBrand({ role }: { role: Role }) {
  const suffix = roleSuffix[role]

  return (
    <span className="shell-brand">
      <img
        src={`${import.meta.env.BASE_URL}logos/logo_letras.png`}
        alt="Rooflix TimeTracker"
        className="shell-logo"
      />
      {suffix && <span>{suffix}</span>}
    </span>
  )
}
