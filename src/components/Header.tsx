"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, profile, role, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const displayName = profile?.name || user?.displayName || user?.email?.split("@")[0] || "User";
  const displayRole = role
    ? role === "admin"
      ? "Care Home"
      : role === "volunteer"
      ? "Volunteer"
      : role === "platform_admin"
      ? "Platform Admin"
      : "Family"
    : "";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D8] shadow-sm">
      <div className="h-20 max-w-[1280px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img
            alt="Aastha Logo"
            className="h-9 w-auto object-contain"
            src="/aastha-logo.svg"
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-[#0F5F5C] tracking-tight leading-none">Aastha</span>
            <span className="text-xs font-semibold text-[#5A6563] leading-tight mt-0.5">Senior Community Care</span>
          </div>
        </Link>

        {/* Center / Navigation: Home link & Language toggle */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-sm font-bold text-[#5A6563] hover:text-[#0F5F5C] transition-colors"
          >
            Home
          </Link>

          {/* Language Toggle */}
          <div
            aria-label="Language selection"
            className="inline-flex items-center bg-white border border-[#E8E2D8] rounded-full p-1 shadow-sm"
          >
            <button
              className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold bg-[#0F5F5C] text-white transition-colors"
              type="button"
            >
              English
            </button>
            <button
              className="px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold text-[#5A6563] hover:text-[#1C2826] transition-colors"
              type="button"
            >
              हिंदी
            </button>
            <button
              className="px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold text-[#5A6563] hover:text-[#1C2826] transition-colors"
              type="button"
            >
              मराठी
            </button>
          </div>
        </div>

        {/* Right Action: Elderline 14567 & Auth State (User Name + Role + Log out OR Log in) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <a
            href="tel:14567"
            className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-[#0F5F5C] bg-white border border-[#E8E2D8] px-3 py-1.5 rounded-full hover:bg-[#F3EEE6] transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">phone_in_talk</span>
            <span>Elderline 14567</span>
          </a>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-xs font-bold text-[#1C2826] leading-tight">
                  {displayName}
                </span>
                {displayRole && (
                  <span className="text-[10px] font-bold text-[#0F5F5C] uppercase tracking-wider bg-[#E8F3EE] px-1.5 py-0.5 rounded mt-0.5">
                    {displayRole}
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="min-h-[42px] px-3.5 sm:px-4 bg-white hover:bg-[#FAF7F2] text-[#1C2826] border border-[#E8E2D8] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm focus:outline-none cursor-pointer"
                title="Log out"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-[#5A6563]">logout</span>
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="min-h-[42px] px-4 sm:px-5 bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm focus:outline-none"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
              <span>Log in</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
