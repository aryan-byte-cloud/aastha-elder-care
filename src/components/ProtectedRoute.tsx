"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user || !role) {
      router.replace(`/login?role=${allowedRole}`);
      return;
    }

    if (role !== allowedRole) {
      // Wrong role → redirect to user's own dashboard
      if (role === "admin") {
        router.replace("/admin");
      } else if (role === "volunteer") {
        router.replace("/volunteer");
      } else if (role === "platform_admin") {
        router.replace("/platform");
      } else {
        router.replace("/family");
      }
    }
  }, [user, role, loading, allowedRole, router]);

  // While checking login state, show a loading spinner (no flash of the wrong page)
  if (loading || !user || !role || role !== allowedRole) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 rounded-2xl bg-[#0F5F5C] text-white flex items-center justify-center shadow-sm mb-4">
          <span className="material-symbols-outlined text-[26px] animate-spin">
            progress_activity
          </span>
        </div>
        <p className="text-sm font-bold text-[#0F5F5C]">Verifying access permissions...</p>
        <p className="text-xs text-[#5A6563] mt-1">Aastha Senior Community Care</p>
      </div>
    );
  }

  return <>{children}</>;
}
