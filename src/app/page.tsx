import React from 'react';

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: `<header class="fixed top-0 w-full z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D8] shadow-sm"><div class="h-20 max-w-[1280px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-6"><div class="flex items-center gap-3"><img alt="Saathi Logo" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnd9TgbTksH_49u9G4hi13Q6I8yjsuVuOYE16NhgdtlmAaooUK6mZA-QR5oUm-YLTlr2MMQHPhgXqWZqHltSZQ3_MNI2IWFowQEDKbOe4cHcFHb27IPS08Frybl8EjifZ11iccLGp3FqRV7v_Jl4eooM-3NCh_oDu2r2y4NY09tHTMPxmop7HSAWAN65junG07LfrDKQ8K2FOlUKqTlz_Cut5oj57vF6swJP0BeDBS3hvnhYJvPCml2g"/><div class="flex flex-col"><span class="text-xl font-bold text-brand-teal tracking-tight leading-none">Saathi</span><span class="text-xs font-semibold text-neutral-muted leading-tight mt-0.5">Senior Community Care</span></div></div><nav class="hidden xl:flex items-center gap-6"><a aria-current="page" class="text-sm font-bold text-brand-teal bg-[#F3EEE6] border border-[#E8E2D8] rounded-lg px-3 py-1.5 transition-colors" data-path="how-it-works" href="#">How it works</a><a class="text-sm font-semibold text-neutral-muted hover:text-neutral-text transition-colors py-2" data-path="for-families" href="#">For families</a><a class="text-sm font-semibold text-neutral-muted hover:text-neutral-text transition-colors py-2" data-path="for-volunteers" href="#">For volunteers</a><a class="text-sm font-semibold text-neutral-muted hover:text-neutral-text transition-colors py-2" data-path="safety-and-privacy" href="#">Safety &amp; privacy</a></nav><div class="flex items-center gap-4"><div aria-label="Language selection" class="hidden sm:inline-flex items-center bg-[#FFFFFF] border border-[#E8E2D8] rounded-full p-1" role="group"><button aria-pressed="true" class="px-3 py-1 rounded-full text-xs font-semibold bg-brand-teal text-white transition-colors" type="button">English</button><button aria-pressed="false" class="px-3 py-1 rounded-full text-xs font-semibold text-neutral-muted hover:text-neutral-text transition-colors" type="button">हिंदी</button><button aria-pressed="false" class="px-3 py-1 rounded-full text-xs font-semibold text-neutral-muted hover:text-neutral-text transition-colors" type="button">मराठी</button></div><a class="min-h-[44px] px-5 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold rounded-xl flex items-center justify-center transition-colors shadow-sm focus:outline-none" data-path="get-started" href="#">Get started</a><div class="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[18px]">person</span></div></div></div></header><main class="w-full pt-20 bg-[#FAF7F2]"><div class="flex flex-col w-full">
<!-- Top Ambient Banner & Hero Section -->
<section class="w-full py-16 bg-[#FAF7F2]">
<div class="max-w-[1280px] mx-auto px-6 lg:px-12">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
<!-- Left Hero Content (7 Cols) -->
<div class="lg:col-span-7 flex flex-col items-start gap-5">
<!-- Category Pill -->
<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E8E2D8] text-neutral-muted text-xs font-semibold">
<span class="material-symbols-outlined text-brand-teal text-base leading-none">diversity_1</span>
<span>Community-Powered Senior Care in India</span>
</div>
<!-- Hero Headline -->
<h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-text tracking-tight leading-tight">
            No senior should ever be left alone when they need care, comfort, or urgent help.
          </h1>
<!-- Hero Subheadline -->
<p class="text-base sm:text-lg text-neutral-muted max-w-2xl leading-relaxed">
            Saathi connects Indian elders with their loving family, trusted local neighbourhood volunteers, and essential welfare services. When a routine check-in or medicine is missed, our compassionate circle acts immediately.
          </p>
<!-- Action Buttons -->
<div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-1">
<a class="min-h-[48px] px-6 bg-brand-teal hover:bg-brand-teal-hover text-white font-bold text-sm rounded-xl inline-flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none" data-path="for-care-homes" href="#">
<span class="material-symbols-outlined text-lg">corporate_fare</span>
<span>For care homes &amp; NGOs</span>
</a>
<a class="min-h-[48px] px-5 bg-[#FFFFFF] hover:bg-[#F3EEE6] border border-[#E8E2D8] text-neutral-text font-bold text-sm rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-sm focus:outline-none" data-path="for-families" href="#">
<span class="material-symbols-outlined text-lg text-brand-teal">family_restroom</span>
<span>I'm a family member</span>
</a>
<a class="min-h-[48px] px-5 bg-[#FFFFFF] hover:bg-[#F3EEE6] border border-[#E8E2D8] text-neutral-text font-bold text-sm rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-sm focus:outline-none" data-path="for-volunteers" href="#">
<span class="material-symbols-outlined text-lg text-brand-teal">volunteer_activism</span>
<span>Become a volunteer</span>
</a>
</div>
<!-- Live Demo Text Link -->
<div class="pt-1">
<a class="inline-flex items-center gap-1.5 text-sm font-bold text-brand-teal hover:underline" href="#admin-demo">
<span>Try the live demo</span>
<span class="material-symbols-outlined text-base">arrow_forward</span>
</a>
</div>
<!-- Key Trust Badges -->
<div class="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border-t border-[#E8E2D8] w-full">
<div class="flex items-center gap-2 text-neutral-text text-sm font-semibold">
<span class="material-symbols-outlined text-brand-teal text-lg" style="font-variation-settings: 'FILL' 1;">verified_user</span>
<span>NGO-verified local volunteers</span>
</div>
<div class="flex items-center gap-2 text-neutral-text text-sm font-semibold">
<span class="material-symbols-outlined text-brand-teal text-lg" style="font-variation-settings: 'FILL' 1;">phone_in_talk</span>
<span>Works with basic phones and landlines</span>
</div>
</div>
</div>
<!-- Right Hero Media & Status Preview (5 Cols) -->
<div class="lg:col-span-5 relative mt-6 lg:mt-0">
<div class="relative rounded-2xl overflow-hidden bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm">
<img alt="Elderly Indian grandfather enjoying warm morning tea on a quiet veranda with his smiling daughter and granddaughter, reviewing daily wellness updates together" class="w-full h-auto aspect-[4/3] object-cover block" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBav8hJRrqcX1_eP3vu7fZfJ3Qt1X3DVXwGBqILV_47FN0DyFpJEvEMLbCMCwsfSVEHbcQvj6pmHXkXBYyNr45ABBIMZGHuHY4NYSg1yrw_DBhAlU73A6CmETnB2rWmhlK1NynyoLNFkxKRB0B0oUC_PTvf7pitysG4u8a1fid-2C4y7NxbKULK-Ii0Oqadhev5cDGVE5H6KHFIZWKKKCqME_tVR_8fPGwgEUWSK3RyO6GuDWTyPL5jjw"/>
<!-- Status Badge as per requirement -->
<div class="p-4 bg-[#FFFFFF] border-t border-[#E8E2D8]">
<div class="flex items-start gap-3">
<span class="material-symbols-outlined text-alert-amber text-2xl shrink-0 mt-0.5" style="font-variation-settings: 'FILL' 1;">notifications_active</span>
<div class="min-w-0">
<div class="flex items-center gap-1.5 mb-1">
<span class="inline-block w-2 h-2 rounded-full bg-alert-amber animate-pulse"></span>
<span class="text-xs font-bold text-alert-amber uppercase tracking-wider">Attention Required</span>
</div>
<p class="text-sm font-bold text-neutral-text leading-snug">
                    Missed 9:00 AM BP medicine – Kamla ji, Sukoon Home.
                  </p>
<p class="text-xs text-neutral-muted mt-1 leading-snug flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-brand-teal">check_circle</span>
                    Admin, daughter Priya &amp; volunteer Suresh notified.
                  </p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- 3 Role Cards Section -->
<section class="w-full py-16 bg-[#F3EEE6] border-y border-[#E8E2D8]">
<div class="max-w-[1280px] mx-auto px-6 lg:px-12">
<div class="flex flex-col items-start gap-2 max-w-2xl mb-10">
<span class="text-xs font-bold text-neutral-muted uppercase tracking-wider">Serving The Entire Circle</span>
<h2 class="text-2xl sm:text-3xl font-extrabold text-neutral-text tracking-tight">Built for care homes, families, and compassionate neighbours</h2>
<p class="text-base text-neutral-muted">Choose your path to join our senior community care network.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<!-- Role Card 1: Care homes & NGOs -->
<div class="p-6 rounded-card bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div>
<div class="w-12 h-12 rounded-xl bg-[#F3EEE6] border border-[#E8E2D8] flex items-center justify-center text-brand-teal mb-4">
<span class="material-symbols-outlined text-2xl">apartment</span>
</div>
<h3 class="text-xl font-bold text-neutral-text mb-2">Care homes &amp; NGOs</h3>
<p class="text-sm text-neutral-muted leading-relaxed mb-6">
          Manage residents, medicines and emergencies in one place.
        </p>
</div>
<a class="min-h-[44px] px-5 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-colors" data-path="setup-home" href="#">
<span>Set up your home</span>
<span class="material-symbols-outlined text-base">arrow_forward</span>
</a>
</div>
<!-- Role Card 2: Families -->
<div class="p-6 rounded-card bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div>
<div class="w-12 h-12 rounded-xl bg-[#F3EEE6] border border-[#E8E2D8] flex items-center justify-center text-brand-teal mb-4">
<span class="material-symbols-outlined text-2xl">family_restroom</span>
</div>
<h3 class="text-xl font-bold text-neutral-text mb-2">Families</h3>
<p class="text-sm text-neutral-muted leading-relaxed mb-6">
          Get daily updates and instant alerts about your parent.
        </p>
</div>
<a class="min-h-[44px] px-5 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-colors" data-path="join-family" href="#">
<span>Join as family</span>
<span class="material-symbols-outlined text-base">arrow_forward</span>
</a>
</div>
<!-- Role Card 3: Volunteers -->
<div class="p-6 rounded-card bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div>
<div class="w-12 h-12 rounded-xl bg-[#F3EEE6] border border-[#E8E2D8] flex items-center justify-center text-brand-teal mb-4">
<span class="material-symbols-outlined text-2xl">volunteer_activism</span>
</div>
<h3 class="text-xl font-bold text-neutral-text mb-2">Volunteers</h3>
<p class="text-sm text-neutral-muted leading-relaxed mb-6">
          Help seniors near you after NGO verification.
        </p>
</div>
<a class="min-h-[44px] px-5 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-colors" data-path="register-volunteer" href="#">
<span>Register to help</span>
<span class="material-symbols-outlined text-base">arrow_forward</span>
</a>
</div>
</div>
</div>
</section>
<!-- "See it in action" Dashboard Placeholder Frame -->
<section class="w-full py-16 bg-[#FAF7F2]" id="admin-demo">
<div class="max-w-[1280px] mx-auto px-6 lg:px-12">
<div class="flex flex-col items-start gap-2 max-w-3xl mb-8">
<span class="text-xs font-bold text-neutral-muted uppercase tracking-wider">Live Software Overview</span>
<h2 class="text-2xl sm:text-3xl font-extrabold text-neutral-text tracking-tight">See it in action</h2>
<p class="text-base text-neutral-muted">
          Unified command center designed for care home administrators, coordinators, and visiting volunteer circles.
        </p>
</div>
<!-- Admin Dashboard Frame -->
<div class="w-full bg-[#FFFFFF] border border-[#E8E2D8] rounded-card-lg shadow-sm overflow-hidden">
<!-- Browser / Window Header -->
<div class="bg-[#F3EEE6] border-b border-[#E8E2D8] px-5 py-3 flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="w-3 h-3 rounded-full bg-[#E8E2D8] inline-block"></span>
<span class="w-3 h-3 rounded-full bg-[#E8E2D8] inline-block"></span>
<span class="w-3 h-3 rounded-full bg-[#E8E2D8] inline-block"></span>
<span class="ml-2 text-xs font-mono text-neutral-muted font-semibold">saathi-dashboard.demo/sukoon-home</span>
</div>
<div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFFFFF] border border-[#E8E2D8] text-xs font-semibold text-brand-teal">
<span class="material-symbols-outlined text-sm">tv</span>
<span>Interactive Demo Mode</span>
</div>
</div>
<!-- Dashboard Body Mockup -->
<div class="p-6 md:p-8 space-y-6">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8]">
<div>
<h3 class="text-lg font-bold text-neutral-text">Sukoon Senior Home – Resident Floor Monitor</h3>
<p class="text-xs text-neutral-muted mt-0.5">Showing live check-ins and scheduled medication passes</p>
</div>
<div class="flex items-center gap-2 text-xs font-bold">
<span class="px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#E8E2D8] text-neutral-muted">Resident Count: [demo]</span>
<span class="px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#E8E2D8] text-neutral-muted">Floor 2</span>
</div>
</div>
<!-- Dashboard Cards Grid -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
<!-- Attention Row 1: Kamla Deshmukh -->
<div class="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex flex-col gap-3">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-full bg-alert-amber"></span>
<span class="text-sm font-bold text-neutral-text">Kamla Deshmukh (78, Sukoon Home, Room 204)</span>
</div>
<span class="px-2 py-0.5 rounded text-xs font-bold bg-[#FFFFFF] border border-alert-amber text-alert-amber">Attention Needed</span>
</div>
<div class="text-xs text-neutral-muted space-y-1">
<p><strong class="text-neutral-text">Scheduled:</strong> 9:00 AM BP Medicine · Status: Unconfirmed</p>
<p><strong class="text-neutral-text">Primary contact:</strong> Priya Deshmukh (daughter)</p>
<p><strong class="text-neutral-text">Assigned helper:</strong> Suresh K. (verified volunteer)</p>
</div>
<div class="pt-2 border-t border-[#E8E2D8] flex items-center justify-between">
<span class="text-xs text-neutral-muted">Escalation protocol: Step 3 active</span>
<button class="px-3 py-1 bg-brand-teal text-white text-xs font-bold rounded-lg hover:bg-brand-teal-hover transition-colors" type="button">Mark Resolved</button>
</div>
</div>
<!-- Normal Row 2: Ramesh Patil -->
<div class="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex flex-col gap-3">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-full bg-brand-teal"></span>
<span class="text-sm font-bold text-neutral-text">Ramesh Patil (72, lives alone at home)</span>
</div>
<span class="px-2 py-0.5 rounded text-xs font-bold bg-[#FFFFFF] border border-[#E8E2D8] text-neutral-muted">Check-in OK</span>
</div>
<div class="text-xs text-neutral-muted space-y-1">
<p><strong class="text-neutral-text">Scheduled:</strong> Morning wellness IVR greeting · Status: Confirmed [demo]</p>
<p><strong class="text-neutral-text">Mode:</strong> Proxy caregiver mode (managed by Suresh K.)</p>
<p><strong class="text-neutral-text">Support NGO:</strong> [Partner NGO]</p>
</div>
<div class="pt-2 border-t border-[#E8E2D8] flex items-center justify-between">
<span class="text-xs text-neutral-muted">Next reminder: 2:00 PM</span>
<span class="text-xs font-semibold text-brand-teal flex items-center gap-1"><span class="material-symbols-outlined text-sm">check</span> Routine Normal</span>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- How It Works: 4-Step Horizontal Escalation Flow -->
<section class="w-full py-16 bg-[#F3EEE6] border-y border-[#E8E2D8]">
<div class="max-w-[1280px] mx-auto px-6 lg:px-12">
<!-- Section Header -->
<div class="flex flex-col items-start gap-2 max-w-3xl mb-10">
<span class="text-xs font-bold text-neutral-muted uppercase tracking-wider">Peace of Mind Protocol</span>
<h2 class="text-2xl sm:text-3xl font-extrabold text-neutral-text tracking-tight">How Care Escalation Works</h2>
<p class="text-base text-neutral-muted">
          A reliable safety net that respects dignity and responds within minutes. Every layer ensures comfort before escalating.
        </p>
</div>
<!-- 4 Connected Steps Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<!-- Step 1 -->
<div class="flex flex-col p-6 rounded-card bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm">
<div class="flex items-center justify-between mb-4">
<span class="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-brand-teal flex items-center justify-center">
<span class="material-symbols-outlined text-2xl">calendar_today</span>
</span>
<span class="text-xl font-bold text-neutral-muted/40">01</span>
</div>
<h3 class="text-lg font-bold text-neutral-text mb-2">1. Gentle Reminder &amp; Check-in</h3>
<p class="text-sm text-neutral-muted leading-relaxed">
            Daily morning call, automated IVR, or quick tap to confirm wellness and medication timing without disruption.
          </p>
</div>
<!-- Step 2 -->
<div class="flex flex-col p-6 rounded-card bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm">
<div class="flex items-center justify-between mb-4">
<span class="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-alert-amber flex items-center justify-center">
<span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">warning</span>
</span>
<span class="text-xl font-bold text-alert-amber/40">02</span>
</div>
<h3 class="text-lg font-bold text-neutral-text mb-2">2. Inactivity or Missed Alert</h3>
<p class="text-sm text-neutral-muted leading-relaxed">
            If no response within time window [demo] or if an SOS button is triggered, the system flags an attention state.
          </p>
</div>
<!-- Step 3 -->
<div class="flex flex-col p-6 rounded-card bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm">
<div class="flex items-center justify-between mb-4">
<span class="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-brand-teal flex items-center justify-center">
<span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">group</span>
</span>
<span class="text-xl font-bold text-neutral-muted/40">03</span>
</div>
<h3 class="text-lg font-bold text-neutral-text mb-2">3. Family &amp; Helper Alerted</h3>
<p class="text-sm text-neutral-muted leading-relaxed">
            Instant alert sent to daughter Priya Deshmukh and volunteer Suresh K. verified through [Partner NGO].
          </p>
</div>
<!-- Step 4 -->
<div class="flex flex-col p-6 rounded-card bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm">
<div class="flex items-center justify-between mb-4">
<span class="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-brand-teal flex items-center justify-center">
<span class="material-symbols-outlined text-2xl">local_hospital</span>
</span>
<span class="text-xl font-bold text-brand-teal/40">04</span>
</div>
<h3 class="text-lg font-bold text-neutral-text mb-2">4. Rapid In-Person Assistance</h3>
<p class="text-sm text-neutral-muted leading-relaxed">
            Volunteer checks in at home; if medical intervention is needed, routing to [Nearest hospital] is initiated.
          </p>
</div>
</div>
</div>
</section>
<!-- Core Features Grid (4 Cards) -->
<section class="w-full py-16 bg-[#FAF7F2]">
<div class="max-w-[1280px] mx-auto px-6 lg:px-12">
<div class="flex flex-col items-start gap-2 max-w-3xl mb-10">
<span class="text-xs font-bold text-neutral-muted uppercase tracking-wider">Compassionate Capabilities</span>
<h2 class="text-2xl sm:text-3xl font-extrabold text-neutral-text tracking-tight">Four Pillars of Daily Dignity</h2>
<p class="text-base text-neutral-muted">
          Thoughtfully crafted around daily habits, physiological reassurance, and local community relationships.
        </p>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<!-- Card 1: SOS -->
<div class="p-6 rounded-card bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
<div>
<div class="flex items-center justify-between gap-4 mb-4">
<span class="px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E8E2D8] text-neutral-muted text-xs font-semibold">
                Urgent Response
              </span>
<!-- Strict Red Emergency Component -->
<div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emergency-red text-white text-xs font-bold shadow-sm">
<span class="material-symbols-outlined text-base">emergency_home</span>
<span>SOS Signal</span>
</div>
</div>
<h3 class="text-xl font-bold text-neutral-text mb-2">
              One-Tap SOS &amp; Instant Alert
            </h3>
<p class="text-sm text-neutral-muted leading-relaxed mb-6">
              Physical button or simple phone trigger that sounds a distress beacon to designated contacts and emergency responders instantly.
            </p>
</div>
<div class="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-between text-xs font-semibold">
<span class="text-neutral-text">Emergency Response Loop</span>
<span class="text-brand-teal flex items-center gap-1">
              Active Support
              <span class="material-symbols-outlined text-sm">check</span>
</span>
</div>
</div>
<!-- Card 2: Medicine & Appointment Reminders -->
<div class="p-6 rounded-card bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
<div>
<div class="flex items-center justify-between gap-4 mb-4">
<span class="px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E8E2D8] text-neutral-muted text-xs font-semibold">
                Daily Wellness
              </span>
<div class="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-brand-teal">
<span class="material-symbols-outlined text-2xl">medication</span>
</div>
</div>
<h3 class="text-xl font-bold text-neutral-text mb-2">
              Medicine &amp; Appointment Reminders
            </h3>
<p class="text-sm text-neutral-muted leading-relaxed mb-6">
              Personalized reminders for elders like Kamla Deshmukh. Tracks prescription refills and upcoming doctor visits with zero stress.
            </p>
</div>
<div class="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-between text-xs font-semibold">
<span class="text-neutral-text">Languages Supported</span>
<span class="text-neutral-muted">Hindi · English · Marathi</span>
</div>
</div>
<!-- Card 3: Verified Community Volunteers -->
<div class="p-6 rounded-card bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
<div>
<div class="flex items-center justify-between gap-4 mb-4">
<span class="px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E8E2D8] text-neutral-muted text-xs font-semibold">
                Local Trust
              </span>
<div class="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-brand-teal">
<span class="material-symbols-outlined text-2xl">handshake</span>
</div>
</div>
<h3 class="text-xl font-bold text-neutral-text mb-2">
              Verified Community Volunteers
            </h3>
<p class="text-sm text-neutral-muted leading-relaxed mb-6">
              Vetted helpers like Suresh K. ready to assist nearby elders with groceries, essential errands, or friendly social check-ins.
            </p>
</div>
<div class="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-between text-xs font-semibold">
<span class="text-neutral-text">Proximity</span>
<span class="text-brand-teal">Walking Distance</span>
</div>
</div>
<!-- Card 4: Welfare & Pension Scheme Guidance -->
<div class="p-6 rounded-card bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
<div>
<div class="flex items-center justify-between gap-4 mb-4">
<span class="px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E8E2D8] text-neutral-muted text-xs font-semibold">
                Senior Welfare Support
              </span>
<div class="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-brand-teal">
<span class="material-symbols-outlined text-2xl">account_balance</span>
</div>
</div>
<h3 class="text-xl font-bold text-neutral-text mb-2">
              Welfare &amp; Pension Scheme Guidance
            </h3>
<p class="text-sm text-neutral-muted leading-relaxed mb-6">
              Assistance facilitated by [Partner NGO] in accessing Senior Citizen health welfare programs and national elderly support initiatives.
            </p>
</div>
<div class="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-between text-xs font-semibold">
<span class="text-neutral-text">Assisted Paperwork</span>
<span class="text-neutral-muted">Guidance Supported</span>
</div>
</div>
</div>
</div>
</section>
<!-- High-Empathy Section: Works Even Without a Smartphone -->
<section class="w-full py-16 bg-[#F3EEE6] border-y border-[#E8E2D8]">
<div class="max-w-[1280px] mx-auto px-6 lg:px-12">
<div class="p-8 sm:p-10 rounded-card-lg bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm flex flex-col gap-8">
<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
<div class="max-w-2xl">
<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-neutral-muted text-xs font-semibold mb-3">
<span class="material-symbols-outlined text-brand-teal text-sm">dialpad</span>
<span>Inclusive By Design</span>
</div>
<h2 class="text-2xl sm:text-3xl font-extrabold text-neutral-text tracking-tight">
              Designed for elders who prefer basic keypad phones or landlines
            </h2>
</div>
<div class="shrink-0">
<div class="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center gap-3">
<span class="material-symbols-outlined text-brand-teal text-2xl">phone_iphone</span>
<div>
<p class="text-sm font-bold text-neutral-text">Zero App Dependency</p>
<p class="text-xs text-neutral-muted">Simple calls and texts power full protection</p>
</div>
</div>
</div>
</div>
<!-- 3 Pillars Grid -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<!-- Pill 1: IVR (Coming next) -->
<div class="p-6 rounded-card bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-4">
<div class="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-brand-teal">
<span class="material-symbols-outlined text-2xl">record_voice_over</span>
</div>
<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF7F2] border border-[#E8E2D8] text-neutral-muted">Coming next</span>
</div>
<h3 class="text-lg font-bold text-neutral-text mb-2">Automated Voice Calls (IVR)</h3>
<p class="text-sm text-neutral-muted leading-relaxed">
              Seniors receive a simple daily greeting call in their language where pressing "1" confirms they are doing well.
            </p>
</div>
</div>
<!-- Pill 2: SMS & Missed Call (Coming next) -->
<div class="p-6 rounded-card bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-4">
<div class="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-brand-teal">
<span class="material-symbols-outlined text-2xl">ring_volume</span>
</div>
<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF7F2] border border-[#E8E2D8] text-neutral-muted">Coming next</span>
</div>
<h3 class="text-lg font-bold text-neutral-text mb-2">SMS &amp; Missed Call Triggers</h3>
<p class="text-sm text-neutral-muted leading-relaxed">
              No internet connection needed. A missed ring to the verified circle automatically registers a morning check-in.
            </p>
</div>
</div>
<!-- Pill 3: Proxy Caregiver Mode (Available) -->
<div class="p-6 rounded-card bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-4">
<div class="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-brand-teal">
<span class="material-symbols-outlined text-2xl">supervisor_account</span>
</div>
<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-teal text-white">Available</span>
</div>
<h3 class="text-lg font-bold text-neutral-text mb-2">Proxy Caregiver Mode</h3>
<p class="text-sm text-neutral-muted leading-relaxed">
              Family members like Priya Deshmukh manage routines, alerts, and doctors from their device on the senior's behalf.
            </p>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Safety & Privacy Section -->
<section class="w-full py-16 bg-[#FAF7F2]">
<div class="max-w-[1280px] mx-auto px-6 lg:px-12">
<div class="text-center max-w-2xl mx-auto mb-10">
<span class="text-xs font-bold text-neutral-muted uppercase tracking-wider">Uncompromising Ethics</span>
<h2 class="text-2xl sm:text-3xl font-extrabold text-neutral-text tracking-tight mt-1">
          Dignity, Discretion &amp; Safety First
        </h2>
<p class="text-base text-neutral-muted mt-2">
          We treat senior privacy with the same sanctity as family trust.
        </p>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<div class="p-6 rounded-card bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm flex flex-col items-start gap-3">
<div class="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-brand-teal flex items-center justify-center">
<span class="material-symbols-outlined text-2xl">verified</span>
</div>
<h3 class="text-lg font-bold text-neutral-text">Verified Community Helpers</h3>
<p class="text-sm text-neutral-muted leading-relaxed">
            Every volunteer is checked and onboarded with identity checks and elder-sensitivity orientation through [Partner NGO].
          </p>
</div>
<div class="p-6 rounded-card bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm flex flex-col items-start gap-3">
<div class="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-brand-teal flex items-center justify-center">
<span class="material-symbols-outlined text-2xl">lock_open</span>
</div>
<h3 class="text-lg font-bold text-neutral-text">Permission-Based Family Alerts</h3>
<p class="text-sm text-neutral-muted leading-relaxed">
            Seniors maintain complete autonomy. Details are shared only with designated family members during flagged events.
          </p>
</div>
<div class="p-6 rounded-card bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm flex flex-col items-start gap-3">
<div class="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-brand-teal flex items-center justify-center">
<span class="material-symbols-outlined text-2xl">shield</span>
</div>
<h3 class="text-lg font-bold text-neutral-text">Strict Non-Commercial Privacy</h3>
<p class="text-sm text-neutral-muted leading-relaxed">
            Personal profiles are used solely for senior reassurance and care communication. No commercial marketing or data sales.
          </p>
</div>
</div>
</div>
</section>
<!-- Pre-Footer High-Impact CTA Banner (Teal Banner) -->
<section class="w-full pb-16 bg-[#FAF7F2]">
<div class="max-w-[1280px] mx-auto px-6 lg:px-12">
<div class="rounded-card-lg bg-brand-teal p-8 sm:p-12 text-white shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
<div class="max-w-2xl flex flex-col gap-2">
<span class="text-xs font-bold text-white/80 uppercase tracking-widest">
            Pilot launching in [City]
          </span>
<h2 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Bring peace of mind to your elders and family today.
          </h2>
<p class="text-base text-white/80 max-w-xl">
            Join the community circle for seniors living at home or in elder residences.
          </p>
</div>
<div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
<a class="min-h-[48px] px-6 bg-[#FFFFFF] hover:bg-[#F3EEE6] text-neutral-text text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none" data-path="enroll-senior" href="#">
<span class="material-symbols-outlined text-lg text-brand-teal">elderly</span>
<span>Enroll a Senior</span>
</a>
<a class="min-h-[48px] px-6 bg-brand-teal-hover hover:bg-black/20 text-white text-sm font-bold border border-white/20 rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-sm focus:outline-none" data-path="register-volunteer" href="#">
<span class="material-symbols-outlined text-lg">volunteer_activism</span>
<span>Register as Volunteer</span>
</a>
</div>
</div>
</div>
</section>
</div></main><footer class="w-full bg-[#F3EEE6] border-t border-[#E8E2D8] pt-12 pb-8"><div class="max-w-[1280px] mx-auto px-6 lg:px-12"><div class="mb-12 p-6 bg-[#FFFFFF] border border-[#E8E2D8] rounded-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"><div class="flex items-center gap-4"><span class="material-symbols-outlined text-brand-teal text-3xl">phone_in_talk</span><div><p class="text-lg font-bold text-neutral-text leading-tight">National Elder Support</p><p class="text-sm text-neutral-muted mt-1">Elderline 14567 (Govt. of India)</p></div></div><a class="min-h-[44px] px-6 bg-brand-teal text-white hover:bg-brand-teal-hover transition-colors text-sm font-bold rounded-xl inline-flex items-center justify-center self-stretch md:self-auto" href="tel:14567">Call 14567</a></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#E8E2D8]"><div class="space-y-3"><div class="flex items-center gap-2"><img alt="Saathi Logo" class="h-7 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnd9TgbTksH_49u9G4hi13Q6I8yjsuVuOYE16NhgdtlmAaooUK6mZA-QR5oUm-YLTlr2MMQHPhgXqWZqHltSZQ3_MNI2IWFowQEDKbOe4cHcFHb27IPS08Frybl8EjifZ11iccLGp3FqRV7v_Jl4eooM-3NCh_oDu2r2y4NY09tHTMPxmop7HSAWAN65junG07LfrDKQ8K2FOlUKqTlz_Cut5oj57vF6swJP0BeDBS3hvnhYJvPCml2g"/><span class="text-xl font-bold text-brand-teal">Saathi</span></div><p class="text-sm text-neutral-muted leading-relaxed">Dignified, community-driven caregiving and daily reassurance for elders across neighborhoods in India.</p></div><div class="space-y-3"><h3 class="text-sm font-bold text-neutral-text">Community Navigation</h3><ul class="space-y-2 text-sm text-neutral-muted"><li><a class="hover:text-brand-teal transition-colors" data-path="how-it-works" href="#">How it works</a></li><li><a class="hover:text-brand-teal transition-colors" data-path="for-families" href="#">For families &amp; guardians</a></li><li><a class="hover:text-brand-teal transition-colors" data-path="for-volunteers" href="#">Join as a volunteer companion</a></li><li><a class="hover:text-brand-teal transition-colors" data-path="safety-and-privacy" href="#">Safety protocols &amp; screening</a></li></ul></div><div class="space-y-3"><h3 class="text-sm font-bold text-neutral-text">Trust &amp; Verification</h3><p class="text-sm text-neutral-muted leading-relaxed">Every Saathi companion undergoes identity validation and elder-sensitivity orientation via [Partner NGO].</p><p class="text-sm font-bold text-neutral-muted">Volunteer Neighborhood Network</p></div><div class="space-y-3"><h3 class="text-sm font-bold text-neutral-text">Preferred Language / भाषा</h3><div class="flex flex-wrap gap-2"><span class="px-3 py-1 bg-[#FFFFFF] border border-[#E8E2D8] rounded-full text-xs font-bold text-neutral-text">English</span><span class="px-3 py-1 bg-[#FFFFFF] border border-[#E8E2D8] rounded-full text-xs font-bold text-neutral-text">हिंदी</span><span class="px-3 py-1 bg-[#FFFFFF] border border-[#E8E2D8] rounded-full text-xs font-bold text-neutral-text">मराठी</span></div></div></div><div class="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-muted"><p>© 2026 Saathi Elder Care Initiative. Built with respect and dignity for seniors.</p><div class="flex gap-6 font-semibold"><a class="hover:text-neutral-text transition-colors" data-path="safety-and-privacy" href="#">Privacy Policy</a><a class="hover:text-neutral-text transition-colors" data-path="safety-and-privacy" href="#">Safety Pledge</a><a class="hover:text-neutral-text transition-colors" data-path="terms-of-service" href="#">Terms of Service</a></div></div></div></footer>` }} />;
}
