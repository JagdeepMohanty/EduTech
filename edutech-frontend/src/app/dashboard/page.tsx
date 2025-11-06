import Dashboard from '@/components/Dashboard';
import Protected from '@/components/Protected';

/**
 * Dashboard page — accessible only to authenticated users.
 * Wrap the dashboard component in a Protected wrapper to ensure auth.
 */
export default function DashboardPage() {
  return (
    <Protected>
      <Dashboard />
    </Protected>
  );
}
