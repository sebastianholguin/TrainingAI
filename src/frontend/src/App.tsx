import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { Toaster } from '@/components/ui/sonner'
import { EmployeeDirectory } from '@/pages/EmployeeDirectory'
import { EmployeeForm } from '@/pages/EmployeeForm'

function Dashboard() {
  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p className="mt-1 text-muted-foreground">
        Not part of Session 1 — the Employees screen is where the work happens.
      </p>
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/employees" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeeDirectory />} />
          <Route path="/employees/new" element={<EmployeeForm />} />
          <Route path="/employees/:id/edit" element={<EmployeeForm />} />
        </Routes>
      </AppShell>
      <Toaster richColors position="top-right" />
    </Router>
  )
}
