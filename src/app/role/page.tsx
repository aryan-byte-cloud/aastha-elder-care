import React from "react";
import Link from "next/link";
import Header from "@/components/Header";

export default function RolePickerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C2826]">
      {/* Shared Header */}
      <Header />

      {/* Main Content */}
      <main className="w-full flex-grow pt-28 pb-16 bg-[#FAF7F2]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1C2826] tracking-tight mb-3">
              How would you like to join Aastha?
            </h1>
            <p className="text-lg text-[#5A6563]">
              Select your role to access dedicated tools and support designed for senior dignity and community care.
            </p>
          </div>

          {/* 3 Large Role Cards → /login?role=admin|family|volunteer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-12">
            {/* Card 1: Care home / NGO admin */}
            <div className="flex flex-col justify-between p-8 bg-white rounded-2xl border border-[#E8E2D8] shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="w-14 h-14 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#0F5F5C] flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[32px]">corporate_fare</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1C2826] mb-3">
                  Care home / NGO admin
                </h2>
                <p className="text-base text-[#5A6563] leading-relaxed mb-8">
                  Manage residents, medicine tracking, floor staff and volunteer escalation for senior homes.
                </p>
              </div>
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/login?role=admin"
                  className="w-full h-12 min-h-[48px] px-6 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] active:bg-[#083533] text-white font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Sign in as Admin</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
                <Link
                  href="/register-organization"
                  className="w-full h-11 px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EEE6] border border-[#E8E2D8] text-[#0F5F5C] font-bold text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">add_business</span>
                  <span>Register your organisation</span>
                </Link>
              </div>
            </div>

            {/* Card 2: Family member */}
            <div className="flex flex-col justify-between p-8 bg-white rounded-2xl border border-[#E8E2D8] shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="w-14 h-14 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#0F5F5C] flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[32px]">family_restroom</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1C2826] mb-3">
                  Family member
                </h2>
                <p className="text-base text-[#5A6563] leading-relaxed mb-8">
                  Track your parent&apos;s daily care, medicine compliance, vitals, and live alerts.
                </p>
              </div>
              <Link
                href="/login?role=family"
                className="w-full h-12 min-h-[48px] px-6 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] active:bg-[#083533] text-white font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Continue as Family</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
            </div>

            {/* Card 3: Volunteer */}
            <div className="flex flex-col justify-between p-8 bg-white rounded-2xl border border-[#E8E2D8] shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="w-14 h-14 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#0F5F5C] flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[32px]">volunteer_activism</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1C2826] mb-3">
                  Volunteer
                </h2>
                <p className="text-base text-[#5A6563] leading-relaxed mb-8">
                  Offer local companionship, wellness visits and emergency support under [Partner NGO] vetting.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href="/login?role=volunteer"
                  className="w-full h-12 min-h-[48px] px-6 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] active:bg-[#083533] text-white font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Sign in as Volunteer</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
                <Link
                  href="/volunteer/register"
                  className="w-full py-2 text-center text-xs font-bold text-[#0F5F5C] hover:underline"
                >
                  Become a volunteer (Register here)
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Link */}
          <div className="text-center pt-2">
            <p className="text-base text-[#5A6563]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#0F5F5C] font-bold hover:underline ml-1">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#FAF7F2] border-t border-[#E8E2D8] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <a
            href="tel:14567"
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">phone_in_talk</span>
            </div>
            <div>
              <p className="text-base font-bold text-[#1C2826]">Elderline 14567 (Govt. of India)</p>
              <p className="text-xs text-[#5A6563]">National toll-free helpline for senior citizens</p>
            </div>
          </a>
          <p className="text-xs text-[#5A6563]">© 2026 Aastha Senior Community Care India</p>
        </div>
      </footer>
    </div>
  );
}
