import { AdminAuthGuard } from "@/components/admin-auth-guard"
import AdminShell from '@/components/admin-shell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <AdminShell>{children}</AdminShell>
    </AdminAuthGuard>
  )
}
