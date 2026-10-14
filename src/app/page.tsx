import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C2826] flex flex-col">
      {/* Shared Header */}
      <Header />

      {/* Main Content Area */}
      <main className="w-full pt-28 bg-[#FAF7F2]">
        <div className="flex flex-col w-full">
          {/* Top Hero Section */}
          <section className="w-full py-16 bg-[#FAF7F2]">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Hero Content */}
                <div className="lg:col-span-7 flex flex-col items-start gap-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E2D8] text-[#5A6563] text-xs font-semibold">
                    <span className="material-symbols-outlined text-[#0F5F5C] text-base leading-none">diversity_1</span>
                    <span>Community-Powered Senior Care in India</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C2826] tracking-tight leading-tight">
                    No senior should ever be left alone when they need care, comfort, or urgent help.
                  </h1>

                  <p className="text-base sm:text-lg text-[#5A6563] max-w-2xl leading-relaxed">
                    Aastha connects Indian elders with their loving family, trusted local neighbourhood volunteers, and essential welfare services. When a routine check-in or medicine is missed, our compassionate circle acts immediately.
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-1">
                    <Link
                      href="/register-organization"
                      className="min-h-[48px] px-6 bg-[#0F5F5C] hover:bg-[#0B4644] text-white font-bold text-sm rounded-xl inline-flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-lg">corporate_fare</span>
                      <span>For care homes &amp; NGOs</span>
                    </Link>

                    <Link
                      href="/login?role=family"
                      className="min-h-[48px] px-5 bg-white hover:bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C2826] font-bold text-sm rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-sm focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-lg text-[#0F5F5C]">family_restroom</span>
                      <span>I&apos;m a family member</span>
                    </Link>

                    {/* "Become a volunteer" → /volunteer/register */}
                    <Link
                      href="/volunteer/register"
                      className="min-h-[48px] px-5 bg-white hover:bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C2826] font-bold text-sm rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-sm focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-lg text-[#0F5F5C]">volunteer_activism</span>
                      <span>Become a volunteer</span>
                    </Link>
                  </div>

                  {/* Live Demo Text Link */}
                  <div className="pt-1">
                    <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0F5F5C] hover:underline">
                      <span>Try the live demo (Sign in)</span>
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </Link>
                  </div>

                  {/* Key Trust Badges */}
                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border-t border-[#E8E2D8] w-full">
                    <div className="flex items-center gap-2 text-[#1C2826] text-sm font-semibold">
                      <span className="material-symbols-outlined text-[#0F5F5C] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        verified_user
                      </span>
                      <span>Vetted local volunteers via [Partner NGO]</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#1C2826] text-sm font-semibold">
                      <span className="material-symbols-outlined text-[#0F5F5C] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        phone_in_talk
                      </span>
                      <span>Works with basic phones and landlines</span>
                    </div>
                  </div>
                </div>

                {/* Right Hero Media & Status Preview */}
                <div className="lg:col-span-5 relative mt-6 lg:mt-0">
                  <div className="relative rounded-2xl overflow-hidden bg-white border border-[#E8E2D8] shadow-sm">
                    <img
                      alt="Elderly Indian grandfather enjoying warm morning tea on a quiet veranda with his smiling daughter, reviewing daily wellness updates together"
                      className="w-full h-auto aspect-[4/3] object-cover block"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBav8hJRrqcX1_eP3vu7fZfJ3Qt1X3DVXwGBqILV_47FN0DyFpJEvEMLbCMCwsfSVEHbcQvj6pmHXkXBYyNr45ABBIMZGHuHY4NYSg1yrw_DBhAlU73A6CmETnB2rWmhlK1NynyoLNFkxKRB0B0oUC_PTvf7pitysG4u8a1fid-2C4y7NxbKULK-Ii0Oqadhev5cDGVE5H6KHFIZWKKKCqME_tVR_8fPGwgEUWSK3RyO6GuDWTyPL5jjw"
                    />
                    <div className="p-4 bg-white border-t border-[#E8E2D8]">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-[#D97706] text-2xl shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                          notifications_active
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#D97706] animate-pulse"></span>
                            <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider">Attention Required</span>
                          </div>
                          <p className="text-sm font-bold text-[#1C2826] leading-snug">
                            Missed 9:00 AM BP medicine – Kamla Deshmukh (78, Sukoon Home, Room 204).
                          </p>
                          <p className="text-xs text-[#5A6563] mt-1 leading-snug flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-[#0F5F5C]">check_circle</span>
                            Priya Deshmukh (daughter) &amp; volunteer Suresh K. notified.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3 Role Cards Section → /login?role=admin|family|volunteer */}
          <section id="for-families" className="w-full py-16 bg-[#FAF7F2] border-y border-[#E8E2D8]">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
              <div className="flex flex-col items-start gap-2 max-w-2xl mb-10">
                <span className="text-xs font-bold text-[#5A6563] uppercase tracking-wider">Serving The Entire Circle</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2826] tracking-tight">
                  Built for care homes, families, and compassionate neighbours
                </h2>
                <p className="text-base text-[#5A6563]">Choose your path to join our senior community care network.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Role Card 1: Care homes & NGOs */}
                <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#0F5F5C] mb-4">
                      <span className="material-symbols-outlined text-2xl">apartment</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#1C2826] mb-2">Care homes &amp; NGOs</h3>
                    <p className="text-sm text-[#5A6563] leading-relaxed mb-6">
                      Manage residents, medicines and emergencies in one place.
                    </p>
                  </div>
                  <Link
                    href="/login?role=admin"
                    className="min-h-[44px] px-5 bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Set up your home</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>
                </div>

                {/* Role Card 2: Families */}
                <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#0F5F5C] mb-4">
                      <span className="material-symbols-outlined text-2xl">family_restroom</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#1C2826] mb-2">Families</h3>
                    <p className="text-sm text-[#5A6563] leading-relaxed mb-6">
                      Get daily updates and instant alerts about your parent.
                    </p>
                  </div>
                  <Link
                    href="/login?role=family"
                    className="min-h-[44px] px-5 bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Join as family</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>
                </div>

                {/* Role Card 3: Volunteers */}
                <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#0F5F5C] mb-4">
                      <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#1C2826] mb-2">Volunteers</h3>
                    <p className="text-sm text-[#5A6563] leading-relaxed mb-6">
                      Help seniors near you after NGO verification.
                    </p>
                  </div>
                  <Link
                    href="/login?role=volunteer"
                    className="min-h-[44px] px-5 bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Register to help</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* "See it in action" Dashboard Demo Frame */}
          <section className="w-full py-16 bg-[#FAF7F2]">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
              <div className="flex flex-col items-start gap-2 max-w-3xl mb-8">
                <span className="text-xs font-bold text-[#5A6563] uppercase tracking-wider">Live Software Overview</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2826] tracking-tight">See it in action</h2>
                <p className="text-base text-[#5A6563]">
                  Unified command center designed for care home administrators, coordinators, and visiting volunteer circles.
                </p>
              </div>

              {/* Admin Dashboard Frame */}
              <div className="w-full bg-white border border-[#E8E2D8] rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-[#FAF7F2] border-b border-[#E8E2D8] px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#E8E2D8] inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-[#E8E2D8] inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-[#E8E2D8] inline-block"></span>
                    <span className="ml-2 text-xs font-mono text-[#5A6563] font-semibold">aastha-dashboard.demo/sukoon-home</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#E8E2D8] text-xs font-semibold text-[#0F5F5C]">
                    <span className="material-symbols-outlined text-sm">tv</span>
                    <span>Interactive Demo Mode</span>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8]">
                    <div>
                      <h3 className="text-lg font-bold text-[#1C2826]">Sukoon Senior Home – Resident Floor Monitor</h3>
                      <p className="text-xs text-[#5A6563] mt-0.5">Showing live check-ins and scheduled medication passes</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563]">Campus Wing</span>
                      <span className="px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563]">Floor 2</span>
                    </div>
                  </div>

                  {/* Dashboard Cards Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Attention Row 1: Kamla Deshmukh (78, Sukoon Home, Room 204) */}
                    <div className="p-4 rounded-xl bg-white border border-[#E8E2D8] flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
                          <span className="text-sm font-bold text-[#1C2826]">Kamla Deshmukh (78, Sukoon Home, Room 204)</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-white border border-[#D97706] text-[#D97706]">Attention Needed</span>
                      </div>
                      <div className="text-xs text-[#5A6563] space-y-1">
                        <p><strong className="text-[#1C2826]">Scheduled:</strong> 9:00 AM BP Medicine · Status: Unconfirmed</p>
                        <p><strong className="text-[#1C2826]">Primary contact:</strong> Priya Deshmukh (daughter)</p>
                        <p><strong className="text-[#1C2826]">Assigned helper:</strong> Suresh K. (volunteer)</p>
                      </div>
                      <div className="pt-2 border-t border-[#E8E2D8] flex items-center justify-between">
                        <span className="text-xs text-[#5A6563]">Escalation protocol: Step 3 active</span>
                        <button className="px-3 py-1 bg-[#0F5F5C] text-white text-xs font-bold rounded-lg hover:bg-[#0B4644] transition-colors" type="button">
                          Mark Resolved
                        </button>
                      </div>
                    </div>

                    {/* Normal Row 2: Ramesh Patil (72, lives alone) */}
                    <div className="p-4 rounded-xl bg-white border border-[#E8E2D8] flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0F5F5C]"></span>
                          <span className="text-sm font-bold text-[#1C2826]">Ramesh Patil (72, lives alone)</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-white border border-[#E8E2D8] text-[#5A6563]">Check-in OK</span>
                      </div>
                      <div className="text-xs text-[#5A6563] space-y-1">
                        <p><strong className="text-[#1C2826]">Scheduled:</strong> Morning wellness IVR greeting · Status: Confirmed</p>
                        <p><strong className="text-[#1C2826]">Mode:</strong> Proxy caregiver mode (managed by Suresh K.)</p>
                        <p><strong className="text-[#1C2826]">Support NGO:</strong> [Partner NGO]</p>
                      </div>
                      <div className="pt-2 border-t border-[#E8E2D8] flex items-center justify-between">
                        <span className="text-xs text-[#5A6563]">Next reminder: 2:00 PM</span>
                        <span className="text-xs font-semibold text-[#0F5F5C] flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">check</span> Routine Normal
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works: 4-Step Horizontal Escalation Flow */}
          <section id="how-it-works" className="w-full py-16 bg-[#FAF7F2] border-y border-[#E8E2D8]">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
              <div className="flex flex-col items-start gap-2 max-w-3xl mb-10">
                <span className="text-xs font-bold text-[#5A6563] uppercase tracking-wider">Peace of Mind Protocol</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2826] tracking-tight">How Care Escalation Works</h2>
                <p className="text-base text-[#5A6563]">
                  A reliable safety net that respects dignity and responds promptly. Every layer ensures comfort before escalating.
                </p>
              </div>

              {/* 4 Connected Steps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#0F5F5C] flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">calendar_today</span>
                    </span>
                    <span className="text-xl font-bold text-[#5A6563]/40">01</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1C2826] mb-2">1. Gentle Reminder &amp; Check-in</h3>
                  <p className="text-sm text-[#5A6563] leading-relaxed">
                    Daily morning call, automated IVR, or quick tap to confirm wellness and medication timing without disruption.
                  </p>
                </div>

                <div className="flex flex-col p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#D97706] flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                    </span>
                    <span className="text-xl font-bold text-[#D97706]/40">02</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1C2826] mb-2">2. Inactivity or Missed Alert</h3>
                  <p className="text-sm text-[#5A6563] leading-relaxed">
                    If no response within time window or if an SOS button is triggered, the system flags an attention state.
                  </p>
                </div>

                <div className="flex flex-col p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#0F5F5C] flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
                    </span>
                    <span className="text-xl font-bold text-[#5A6563]/40">03</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1C2826] mb-2">3. Family &amp; Helper Alerted</h3>
                  <p className="text-sm text-[#5A6563] leading-relaxed">
                    Instant alert sent to Priya Deshmukh (daughter) and Suresh K. (volunteer) verified through [Partner NGO].
                  </p>
                </div>

                <div className="flex flex-col p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#0F5F5C] flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">local_hospital</span>
                    </span>
                    <span className="text-xl font-bold text-[#0F5F5C]/40">04</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1C2826] mb-2">4. Rapid In-Person Assistance</h3>
                  <p className="text-sm text-[#5A6563] leading-relaxed">
                    Volunteer Suresh K. checks in at home; if medical intervention is needed, routing to [Nearest hospital] is initiated.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Core Features / For Volunteers Section */}
          <section id="for-volunteers" className="w-full py-16 bg-[#FAF7F2]">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
              <div className="flex flex-col items-start gap-2 max-w-3xl mb-10">
                <span className="text-xs font-bold text-[#5A6563] uppercase tracking-wider">Compassionate Capabilities</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2826] tracking-tight">Four Pillars of Daily Dignity</h2>
                <p className="text-base text-[#5A6563]">
                  Thoughtfully crafted around daily habits, physiological reassurance, and local community relationships.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1: SOS */}
                <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="px-3 py-1 rounded-full bg-white border border-[#E8E2D8] text-[#5A6563] text-xs font-semibold">
                        Urgent Response
                      </span>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DC2626] text-white text-xs font-bold shadow-sm">
                        <span className="material-symbols-outlined text-base">emergency_home</span>
                        <span>SOS Signal</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#1C2826] mb-2">One-Tap SOS &amp; Instant Alert</h3>
                    <p className="text-sm text-[#5A6563] leading-relaxed mb-6">
                      Physical button or simple phone trigger that sounds a distress beacon to designated contacts and emergency responders.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#1C2826]">Emergency Response Loop</span>
                    <span className="text-[#0F5F5C] flex items-center gap-1">
                      Active Support
                      <span className="material-symbols-outlined text-sm">check</span>
                    </span>
                  </div>
                </div>

                {/* Card 2: Medicine & Appointment Reminders */}
                <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="px-3 py-1 rounded-full bg-white border border-[#E8E2D8] text-[#5A6563] text-xs font-semibold">
                        Daily Wellness
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#0F5F5C]">
                        <span className="material-symbols-outlined text-2xl">medication</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#1C2826] mb-2">Medicine &amp; Appointment Reminders</h3>
                    <p className="text-sm text-[#5A6563] leading-relaxed mb-6">
                      Personalized reminders for elders like Kamla Deshmukh (78, Sukoon Home, Room 204). Tracks prescription refills and upcoming doctor visits with zero stress.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#1C2826]">Languages Supported</span>
                    <span className="text-[#5A6563]">Hindi · English · Marathi</span>
                  </div>
                </div>

                {/* Card 3: Verified Community Volunteers */}
                <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="px-3 py-1 rounded-full bg-white border border-[#E8E2D8] text-[#5A6563] text-xs font-semibold">
                        Local Trust
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#0F5F5C]">
                        <span className="material-symbols-outlined text-2xl">handshake</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#1C2826] mb-2">Verified Community Volunteers</h3>
                    <p className="text-sm text-[#5A6563] leading-relaxed mb-4">
                      Vetted helpers like Suresh K. (volunteer) ready to assist nearby elders with groceries, essential errands, or friendly social check-ins.
                    </p>
                    <div className="mb-4">
                      <Link
                        href="/volunteer/register"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F5F5C] hover:underline"
                      >
                        <span>Join as a volunteer companion</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#1C2826]">Proximity</span>
                    <span className="text-[#0F5F5C]">Walking Distance</span>
                  </div>
                </div>

                {/* Card 4: Welfare Guidance */}
                <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="px-3 py-1 rounded-full bg-white border border-[#E8E2D8] text-[#5A6563] text-xs font-semibold">
                        Senior Welfare Support
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#0F5F5C]">
                        <span className="material-symbols-outlined text-2xl">account_balance</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#1C2826] mb-2">Welfare &amp; Pension Scheme Guidance</h3>
                    <p className="text-sm text-[#5A6563] leading-relaxed mb-6">
                      Assistance facilitated by [Partner NGO] in accessing Senior Citizen health welfare programs and national elderly support initiatives.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#1C2826]">Assisted Paperwork</span>
                    <span className="text-[#5A6563]">Guidance Supported</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Simple Keypad Phone Section */}
          <section className="w-full py-16 bg-[#FAF7F2] border-y border-[#E8E2D8]">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
              <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm flex flex-col gap-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563] text-xs font-semibold mb-3">
                      <span className="material-symbols-outlined text-[#0F5F5C] text-sm">dialpad</span>
                      <span>Inclusive By Design</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2826] tracking-tight">
                      Designed for elders who prefer basic keypad phones or landlines
                    </h2>
                  </div>
                  <div className="shrink-0">
                    <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#0F5F5C] text-2xl">phone_iphone</span>
                      <div>
                        <p className="text-sm font-bold text-[#1C2826]">Zero App Dependency</p>
                        <p className="text-xs text-[#5A6563]">Simple calls and texts power full protection</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#0F5F5C]">
                          <span className="material-symbols-outlined text-2xl">record_voice_over</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563]">Coming next</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#1C2826] mb-2">Automated Voice Calls (IVR)</h3>
                      <p className="text-sm text-[#5A6563] leading-relaxed">
                        Seniors receive a simple daily greeting call in their language where pressing &ldquo;1&rdquo; confirms they are doing well.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#0F5F5C]">
                          <span className="material-symbols-outlined text-2xl">ring_volume</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563]">Coming next</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#1C2826] mb-2">SMS &amp; Missed Call Triggers</h3>
                      <p className="text-sm text-[#5A6563] leading-relaxed">
                        No internet connection needed. A missed ring to the verified circle automatically registers a morning check-in.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#0F5F5C]">
                          <span className="material-symbols-outlined text-2xl">supervisor_account</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0F5F5C] text-white">Available</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#1C2826] mb-2">Proxy Caregiver Mode</h3>
                      <p className="text-sm text-[#5A6563] leading-relaxed">
                        Family members like Priya Deshmukh (daughter) manage routines, alerts, and doctors from their device on the senior&apos;s behalf.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Safety & Privacy Section */}
          <section id="safety-and-privacy" className="w-full py-16 bg-[#FAF7F2]">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-bold text-[#5A6563] uppercase tracking-wider">Uncompromising Ethics</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2826] tracking-tight mt-1">
                  Dignity, Discretion &amp; Safety First
                </h2>
                <p className="text-base text-[#5A6563] mt-2">
                  We treat senior privacy with the same sanctity as family trust.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm flex flex-col items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#0F5F5C] flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">verified</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1C2826]">Verified Community Helpers</h3>
                  <p className="text-sm text-[#5A6563] leading-relaxed">
                    Every volunteer is checked and onboarded with identity checks and elder-sensitivity orientation through [Partner NGO].
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm flex flex-col items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#0F5F5C] flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">lock_open</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1C2826]">Permission-Based Family Alerts</h3>
                  <p className="text-sm text-[#5A6563] leading-relaxed">
                    Seniors maintain complete autonomy. Details are shared only with designated family members during flagged events.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm flex flex-col items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#0F5F5C] flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">shield</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1C2826]">Strict Non-Commercial Privacy</h3>
                  <p className="text-sm text-[#5A6563] leading-relaxed">
                    Personal profiles are used solely for senior reassurance and care communication. No commercial marketing or data sales.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Pre-Footer Call to Action Banner */}
          <section className="w-full pb-16 bg-[#FAF7F2]">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
              <div className="rounded-2xl bg-[#0F5F5C] p-8 sm:p-12 text-white shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="max-w-2xl flex flex-col gap-2">
                  <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
                    Community Senior Care Initiative
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    Bring peace of mind to your elders and family today.
                  </h2>
                  <p className="text-base text-white/80 max-w-xl">
                    Join the community circle for seniors living at home or in elder residences.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
                  <Link
                    href="/role"
                    className="min-h-[48px] px-6 bg-white hover:bg-[#FAF7F2] text-[#1C2826] text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-lg text-[#0F5F5C]">elderly</span>
                    <span>Enroll a Senior</span>
                  </Link>
                  {/* "Become a volunteer" → /volunteer/register */}
                  <Link
                    href="/volunteer/register"
                    className="min-h-[48px] px-6 bg-[#0B4644] hover:bg-black/20 text-white text-sm font-bold border border-white/20 rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-sm focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                    <span>Become a volunteer</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#FAF7F2] border-t border-[#E8E2D8] pt-12 pb-8">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          {/* Elderline Helpline Card */}
          <div className="mb-12 p-6 bg-white border border-[#E8E2D8] rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#0F5F5C] text-3xl">phone_in_talk</span>
              <div>
                <p className="text-lg font-bold text-[#1C2826] leading-tight">National Elder Support</p>
                <p className="text-sm text-[#5A6563] mt-1">Elderline 14567 (Govt. of India)</p>
              </div>
            </div>
            {/* "Call 14567" is a tel: link */}
            <a
              href="tel:14567"
              className="min-h-[44px] px-6 bg-[#0F5F5C] text-white hover:bg-[#0B4644] transition-colors text-sm font-bold rounded-xl inline-flex items-center justify-center self-stretch md:self-auto shadow-sm"
            >
              Call 14567
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#E8E2D8]">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <img
                  alt="Aastha Logo"
                  className="h-8 w-auto object-contain"
                  src="/aastha-logo.svg"
                />
                <span className="text-xl font-bold text-[#0F5F5C]">Aastha</span>
              </div>
              <p className="text-sm text-[#5A6563] leading-relaxed">
                Dignified, community-driven caregiving and daily reassurance for elders across neighborhoods in India.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#1C2826]">Community Navigation</h3>
              <ul className="space-y-2 text-sm text-[#5A6563]">
                <li>
                  <a href="#how-it-works" className="hover:text-[#0F5F5C] transition-colors">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#for-families" className="hover:text-[#0F5F5C] transition-colors">
                    For families &amp; guardians
                  </a>
                </li>
                <li>
                  {/* "Become a volunteer" → /volunteer/register */}
                  <Link href="/volunteer/register" className="hover:text-[#0F5F5C] transition-colors">
                    Join as a volunteer companion
                  </Link>
                </li>
                <li>
                  <a href="#safety-and-privacy" className="hover:text-[#0F5F5C] transition-colors">
                    Safety protocols &amp; screening
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#1C2826]">Trust &amp; Verification</h3>
              <p className="text-sm text-[#5A6563] leading-relaxed">
                Every Aastha companion undergoes identity validation and elder-sensitivity orientation via [Partner NGO].
              </p>
              <p className="text-sm font-bold text-[#5A6563]">Volunteer Neighborhood Network</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#1C2826]">Preferred Language / भाषा</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white border border-[#E8E2D8] rounded-full text-xs font-bold text-[#1C2826]">English</span>
                <span className="px-3 py-1 bg-white border border-[#E8E2D8] rounded-full text-xs font-bold text-[#1C2826]">हिंदी</span>
                <span className="px-3 py-1 bg-white border border-[#E8E2D8] rounded-full text-xs font-bold text-[#1C2826]">मराठी</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#5A6563]">
            <p>© 2026 Aastha Elder Care Initiative. Built with respect and dignity for seniors.</p>
            <div className="flex gap-6 font-semibold">
              <a href="#safety-and-privacy" className="hover:text-[#1C2826] transition-colors">
                Privacy Policy
              </a>
              <a href="#safety-and-privacy" className="hover:text-[#1C2826] transition-colors">
                Safety Pledge
              </a>
              <a href="#safety-and-privacy" className="hover:text-[#1C2826] transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
