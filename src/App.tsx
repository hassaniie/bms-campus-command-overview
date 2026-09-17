import { DashboardProvider } from '@/state/DashboardContext'
import { AppShell } from '@/components/layout/AppShell'

export default function App() {
  return (
    <DashboardProvider>
      <AppShell />
    </DashboardProvider>
  )
}
