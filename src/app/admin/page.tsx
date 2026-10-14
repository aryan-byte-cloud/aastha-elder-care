import ProtectedRoute from "@/components/ProtectedRoute";
import AdminDashboard from "./AdminDashboard";

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  );
}
