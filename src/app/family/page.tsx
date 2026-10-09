import React from 'react';

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: `<header class="fixed top-0 left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D8]"><div class="h-20 max-w-[1280px] mx-auto px-margin md:px-margin-desktop flex items-center justify-between gap-space-md"><div class="flex items-center gap-space-sm"><div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary text-[24px]">handshake</span></div><div class="flex flex-col"><span class="font-headline-sm text-headline-sm text-primary leading-tight tracking-tight">Saathi</span><span class="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline leading-none">Senior Community Care India</span></div></div><nav class="hidden xl:flex items-center gap-space-xs p-1 bg-[#F3EEE6] border border-[#E8E2D8] rounded-xl"><a class="px-space-md py-space-xs text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" data-path="home" href="#">Home</a><a class="px-space-md py-space-xs text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" data-path="role-selection" href="#">Role Selection</a><a aria-current="page" class="px-space-md py-space-xs transition-colors bg-primary text-on-primary font-bold rounded-xl shadow-sm" data-path="family-dashboard" href="#">Family Dashboard</a><a class="px-space-md py-space-xs text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" data-path="volunteer-alerts" href="#">Volunteer Alerts</a><a class="px-space-md py-space-xs text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" data-path="register-volunteer" href="#">Register Volunteer</a></nav><div class="flex items-center gap-space-md"><div class="hidden md:flex items-center gap-space-xs px-space-sm py-1 bg-[#F3EEE6] border border-[#E8E2D8] rounded-full text-on-surface-variant font-label-sm text-label-sm"><button class="hover:text-primary font-semibold text-primary transition-colors" type="button">English</button><span class="text-[#D5CEBF]">|</span><button class="hover:text-primary transition-colors" type="button">हिंदी</button><span class="text-[#D5CEBF]">|</span><button class="hover:text-primary transition-colors" type="button">मराठी</button></div><a class="flex items-center gap-space-xs text-on-surface-variant hover:text-primary transition-colors" data-path="login" href="#"><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div><span class="hidden lg:inline font-label-md text-label-md">Log In</span></a></div></div></header><main class="w-full pt-20 bg-[#FAF7F2] min-h-[calc(100vh-80px)]"><div class="flex flex-col w-full">
<div class="max-w-[1280px] w-full mx-auto px-margin md:px-margin-desktop py-space-lg flex flex-col gap-space-lg">
<!-- Top Senior Header Profile Card -->
<section class="w-full bg-[#FFFFFF] rounded-xl border border-[#E8E2D8] shadow-sm p-space-md md:p-space-lg relative overflow-hidden">
<div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg">
<!-- Elder Persona & Location Details -->
<div class="flex flex-col sm:flex-row items-start sm:items-center gap-space-md">
<div class="relative shrink-0">
<img class="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-sm bg-[#F3EEE6] border border-[#E8E2D8]" data-alt="Warm and dignified portrait photograph of an elderly Indian grandmother, 78-year-old Kamla Deshmukh, wearing an elegant soft cotton saree with gentle smile, seated in a sunlit veranda with potted tulsi plants in background. Natural morning lighting, high-contrast crisp portrait." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDDMpmrqR43cJ0axFQu6t-8P-KkY-AGzj-wH2VTK68kulcNkBd52Jg4sIH9sB68oULXH2j-vbU7I-T_wEvztfVZtAq6JHhz5zmHP-FXV-wVpIWhIBD5H3PxpDO4BTj0yF6wPy01MaRDwhe04heQNZxWiqt08MwEqchiSEoyOB3n6uCuY3x9m9wrY4akS4Grnjlls9IrmriWnznVwA4m1oj4DUukNNsqPawVjnaztYCgl1wnkPFIC6K-g"/>
<span class="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#E5F2EC] text-secondary border border-[#C2DFD2] flex items-center justify-center shadow-sm">
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">check</span>
</span>
</div>
<div class="flex flex-col gap-space-xs">
<div class="flex flex-wrap items-center gap-space-sm">
<h1 class="font-headline-lg text-headline-lg text-on-surface">Kamla Deshmukh, 78, Sukoon Home, Room 204</h1>
<!-- Large Reassuring Status Badge -->
<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8F3EE] text-primary border border-[#BDE0D1] font-label-md text-label-md shadow-sm">
<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">favorite</span>
<span class="font-bold">Doing Well &amp; Rested</span>
</div>
</div>
<div class="flex flex-wrap items-center gap-y-1 gap-x-space-md text-on-surface-variant font-body-md text-body-md">
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[20px] text-primary">apartment</span>
                Sukoon Home, Room 204, Pune
              </span>
<span class="hidden sm:inline text-[#D5CEBF]">•</span>
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[20px] text-primary">schedule</span>
                Last checked: 10:15 AM today [demo]
              </span>
</div>
<div class="flex items-center gap-space-xs mt-1">
<span class="px-2 py-0.5 rounded bg-[#F3EEE6] border border-[#E8E2D8] text-on-surface-variant font-label-sm text-label-sm">Care Protocol: Tier A</span>
<span class="px-2 py-0.5 rounded bg-[#E8F3EE] border border-[#BDE0D1] text-primary font-label-sm text-label-sm font-bold">Sukoon Verified</span>
</div>
</div>
</div>
<!-- Primary Action: Deep Teal Call Sukoon Home -->
<div class="flex flex-col sm:flex-row w-full lg:w-auto items-stretch sm:items-center gap-space-sm shrink-0">
<a class="h-[52px] px-space-md bg-primary hover:bg-[#003634] text-on-primary rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-all shadow-sm active:scale-[0.98]" href="#caregivers-section">
<span class="material-symbols-outlined text-[22px]">phone_in_talk</span>
<span>Call Sukoon Home</span>
</a>
<button class="h-[52px] px-space-md bg-[#F3EEE6] hover:bg-[#EAE4D9] text-on-surface border border-[#E8E2D8] rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-all active:scale-[0.98]" onclick="document.getElementById('caregivers-section').scrollIntoView({behavior: 'smooth'})" type="button">
<span class="material-symbols-outlined text-[22px] text-primary">support_agent</span>
<span>Contact Care Supervisor</span>
</button>
</div>
</div>
</section>
<!-- Live Alert Card: Amber Border & Background Accent -->
<section class="w-full bg-[#FFFDF7] rounded-xl border-2 border-amber-400/80 shadow-sm p-space-md md:p-space-lg flex flex-col gap-space-md">
<div class="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
<div class="flex items-center gap-space-sm">
<div class="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[24px]">priority_high</span>
</div>
<div>
<div class="flex items-center gap-2">
<span class="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-label-sm text-label-sm font-bold uppercase">Resolved Alert</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Log Reference [demo]</span>
</div>
<h2 class="font-headline-sm text-headline-sm text-on-surface mt-0.5">Morning BP medicine delay acknowledged and resolved</h2>
</div>
</div>
<div class="inline-flex items-center gap-1.5 self-start md:self-auto px-space-sm py-1 rounded-full bg-[#E8F3EE] text-primary border border-[#BDE0D1] font-label-sm text-label-sm font-bold">
<span class="material-symbols-outlined text-[18px]">check_circle</span>
          Resolved at 9:20 AM
</div>
</div>
<!-- Escalation Stepper -->
<div class="w-full bg-[#F3EEE6] border border-[#E8E2D8] rounded-xl p-space-md">
<div class="grid grid-cols-1 md:grid-cols-4 gap-space-md relative">
<!-- Step 1 -->
<div class="flex flex-col gap-1.5 relative">
<div class="flex items-center gap-space-xs">
<span class="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center text-label-sm font-label-sm shrink-0 font-bold">1</span>
<span class="font-label-md text-label-md text-on-surface font-bold">Step 1: Alert Raised</span>
</div>
<p class="font-body-md text-body-md text-primary font-bold ml-9">9:15 AM</p>
<p class="font-label-sm text-label-sm text-on-surface-variant ml-9">Automated dose window reminder logged by system.</p>
</div>
<!-- Step 2 -->
<div class="flex flex-col gap-1.5 relative">
<div class="flex items-center gap-space-xs">
<span class="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center text-label-sm font-label-sm shrink-0 font-bold">2</span>
<span class="font-label-md text-label-md text-on-surface font-bold">Step 2: Family Notified</span>
</div>
<p class="font-body-md text-body-md text-on-surface font-bold ml-9">9:16 AM</p>
<p class="font-label-sm text-label-sm text-on-surface-variant ml-9">Priya Deshmukh via WhatsApp &amp; SMS notification.</p>
</div>
<!-- Step 3 -->
<div class="flex flex-col gap-1.5 relative">
<div class="flex items-center gap-space-xs">
<span class="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center text-label-sm font-label-sm shrink-0 font-bold">3</span>
<span class="font-label-md text-label-md text-on-surface font-bold">Step 3: Staff in Motion</span>
</div>
<p class="font-body-md text-body-md text-on-surface font-bold ml-9">9:18 AM</p>
<p class="font-label-sm text-label-sm text-on-surface-variant ml-9">Nurse Anjali &amp; Suresh K. acknowledged on floor pager.</p>
</div>
<!-- Step 4 -->
<div class="flex flex-col gap-1.5 relative">
<div class="flex items-center gap-space-xs">
<span class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-label-sm font-label-sm shrink-0 shadow-sm font-bold">
<span class="material-symbols-outlined text-[18px]">done_all</span>
</span>
<span class="font-label-md text-label-md text-primary font-bold">Step 4: Resolved</span>
</div>
<p class="font-body-md text-body-md text-primary font-bold ml-9">Administered at 9:20 AM</p>
<p class="font-label-sm text-label-sm text-on-surface-variant ml-9">Dose completed with water by Nurse Anjali. Confirmed settled.</p>
</div>
</div>
</div>
</section>
<!-- Main Asymmetric Bento: Left is Today's Medicines, Right is Health Timeline & Vitals -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
<!-- Left Column: Medicines Management (7 cols) -->
<div class="lg:col-span-7 flex flex-col gap-space-lg">
<!-- Medicines Header Card -->
<div class="bg-[#FFFFFF] rounded-xl border border-[#E8E2D8] shadow-sm p-space-md md:p-space-lg flex flex-col gap-space-md">
<div class="flex items-center justify-between">
<div>
<span class="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Daily Regimen</span>
<h2 class="font-headline-md text-headline-md text-on-surface">Today's Medicines</h2>
</div>
<span class="px-space-sm py-1 rounded-full bg-[#F3EEE6] border border-[#E8E2D8] text-on-surface-variant font-label-sm text-label-sm">
              Today's Schedule [demo]
            </span>
</div>
<!-- Medication Item Cards -->
<div class="flex flex-col gap-space-sm">
<!-- Card 1: Given (Amlodipine 5mg - 9:20 AM) -->
<div class="p-space-md bg-[#F3EEE6] border border-[#E8E2D8] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
<div class="flex items-center gap-space-md">
<div class="w-12 h-12 rounded-xl bg-[#E8F3EE] border border-[#BDE0D1] text-primary flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[26px]">medication</span>
</div>
<div>
<div class="flex items-center gap-2">
<span class="font-label-sm text-label-sm text-on-surface font-bold">Morning (9:20 AM)</span>
<span class="w-1.5 h-1.5 rounded-full bg-[#D5CEBF]"></span>
<span class="font-label-sm text-label-sm text-primary">Blood Pressure</span>
</div>
<h3 class="font-headline-sm text-headline-sm text-on-surface">Amlodipine 5mg</h3>
<p class="font-body-md text-body-md text-on-surface-variant">Post-breakfast routine</p>
</div>
</div>
<div class="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0">
<div class="inline-flex items-center gap-1 px-3 py-1 bg-[#E8F3EE] text-primary border border-[#BDE0D1] rounded-full font-label-md text-label-md font-bold shadow-sm">
<span class="material-symbols-outlined text-[18px]">check_circle</span>
<span>Given (9:20 AM)</span>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant mt-1">Confirmed by Nurse Anjali</span>
</div>
</div>
<!-- Card 2: Pending (Calcium D3) -->
<div class="p-space-md bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
<div class="flex items-center gap-space-md">
<div class="w-12 h-12 rounded-xl bg-[#F3EEE6] border border-[#E8E2D8] text-on-surface-variant flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[26px]">pill</span>
</div>
<div>
<div class="flex items-center gap-2">
<span class="font-label-sm text-label-sm text-on-surface-variant font-bold">1:00 PM (Afternoon)</span>
<span class="w-1.5 h-1.5 rounded-full bg-[#D5CEBF]"></span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Bone Health</span>
</div>
<h3 class="font-headline-sm text-headline-sm text-on-surface">Calcium D3</h3>
<p class="font-body-md text-body-md text-on-surface-variant">Prescribed dietary supplement • Post-lunch</p>
</div>
</div>
<div class="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0">
<div class="inline-flex items-center gap-1 px-3 py-1 bg-[#F3EEE6] border border-[#E8E2D8] text-on-surface-variant rounded-full font-label-md text-label-md">
<span class="material-symbols-outlined text-[18px]">schedule</span>
<span>Pending</span>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant mt-1">Scheduled post-lunch</span>
</div>
</div>
<!-- Card 3: Pending (Metformin) -->
<div class="p-space-md bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
<div class="flex items-center gap-space-md">
<div class="w-12 h-12 rounded-xl bg-[#F3EEE6] border border-[#E8E2D8] text-on-surface-variant flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[26px]">medication_liquid</span>
</div>
<div>
<div class="flex items-center gap-2">
<span class="font-label-sm text-label-sm text-on-surface-variant font-bold">8:00 PM (Evening)</span>
<span class="w-1.5 h-1.5 rounded-full bg-[#D5CEBF]"></span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Metabolic Support</span>
</div>
<h3 class="font-headline-sm text-headline-sm text-on-surface">Metformin</h3>
<p class="font-body-md text-body-md text-on-surface-variant">Blood sugar regulation • With evening meal</p>
</div>
</div>
<div class="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0">
<div class="inline-flex items-center gap-1 px-3 py-1 bg-[#F3EEE6] border border-[#E8E2D8] text-on-surface-variant rounded-full font-label-md text-label-md">
<span class="material-symbols-outlined text-[18px]">schedule</span>
<span>Pending</span>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant mt-1">Scheduled with dinner</span>
</div>
</div>
</div>
</div>
<!-- Vital Statistics Sparkline & Reassurance Metric -->
<div class="bg-[#FFFFFF] rounded-xl border border-[#E8E2D8] shadow-sm p-space-md md:p-space-lg flex flex-col gap-space-md">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
<div>
<span class="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Clinical Baseline</span>
<h2 class="font-headline-md text-headline-md text-on-surface">Recent Vitals Trend</h2>
</div>
<span class="px-space-sm py-1 bg-[#E8F3EE] border border-[#BDE0D1] text-primary font-label-sm text-label-sm rounded-full self-start font-bold">
              Stable Condition
            </span>
</div>
<div class="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
<div class="p-space-md bg-[#F3EEE6] border border-[#E8E2D8] rounded-xl flex flex-col gap-1">
<span class="font-label-sm text-label-sm text-on-surface-variant">Blood Pressure</span>
<p class="font-headline-md text-headline-md text-on-surface">128 / 82</p>
<span class="font-label-sm text-label-sm text-primary font-bold flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">check</span> Stable reading [demo]
</span>
</div>
<div class="p-space-md bg-[#F3EEE6] border border-[#E8E2D8] rounded-xl flex flex-col gap-1">
<span class="font-label-sm text-label-sm text-on-surface-variant">Pulse Rate</span>
<p class="font-headline-md text-headline-md text-on-surface">74 <span class="font-body-md text-body-md font-normal text-on-surface-variant">bpm</span></p>
<span class="font-label-sm text-label-sm text-primary font-bold flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">check</span> Steady [demo]
</span>
</div>
<div class="p-space-md bg-[#F3EEE6] border border-[#E8E2D8] rounded-xl flex flex-col gap-1">
<span class="font-label-sm text-label-sm text-on-surface-variant">SpO2 Oxygen</span>
<p class="font-headline-md text-headline-md text-on-surface">98 <span class="font-body-md text-body-md font-normal text-on-surface-variant">%</span></p>
<span class="font-label-sm text-label-sm text-primary font-bold flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">check</span> Normal [demo]
</span>
</div>
</div>
<!-- Trend curve card -->
<div class="w-full bg-[#F3EEE6] border border-[#E8E2D8] rounded-xl p-space-md flex flex-col gap-2">
<div class="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
<span>Weekly Systolic BP Trend [demo]</span>
<span>Observation Range</span>
</div>
<div class="w-full h-16 flex items-center justify-center">
<svg class="w-full h-full overflow-visible" fill="none" viewbox="0 0 500 50">
<line class="text-[#D5CEBF]" stroke="currentColor" stroke-dasharray="4 4" x1="0" x2="500" y1="25" y2="25"></line>
<polyline class="text-primary" fill="none" points="20,32 90,26 170,28 250,22 330,24 410,21 480,24" stroke="currentColor" stroke-width="3"></polyline>
<circle class="text-primary" cx="20" cy="32" fill="currentColor" r="4"></circle>
<circle class="text-primary" cx="90" cy="26" fill="currentColor" r="4"></circle>
<circle class="text-primary" cx="170" cy="28" fill="currentColor" r="4"></circle>
<circle class="text-primary" cx="250" cy="22" fill="currentColor" r="4"></circle>
<circle class="text-primary" cx="330" cy="24" fill="currentColor" r="4"></circle>
<circle class="text-primary" cx="410" cy="21" fill="currentColor" r="4"></circle>
<circle class="text-primary" cx="480" cy="24" fill="currentColor" r="5"></circle>
</svg>
</div>
<div class="flex justify-between text-on-surface-variant font-label-sm text-label-sm">
<span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span class="font-bold text-primary">Today (128/82)</span>
</div>
</div>
</div>
</div>
<!-- Right Column: Staff Updates Feed & Activities (5 cols) -->
<div class="lg:col-span-5 flex flex-col gap-space-lg">
<!-- Staff Health-Update Timeline (Feed) -->
<div class="bg-[#FFFFFF] rounded-xl border border-[#E8E2D8] shadow-sm p-space-md md:p-space-lg flex flex-col gap-space-md">
<div class="flex items-center justify-between">
<div>
<span class="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Direct Observation</span>
<h2 class="font-headline-md text-headline-md text-on-surface">Staff Care Timeline</h2>
</div>
<span class="w-8 h-8 rounded-full bg-[#F3EEE6] border border-[#E8E2D8] flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[18px]">notes</span>
</span>
</div>
<!-- Chronological List with Vertical Connector -->
<div class="relative flex flex-col gap-space-lg pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E8E2D8]">
<!-- Update 1: BP reading 128/82 -->
<div class="relative flex flex-col gap-1">
<span class="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-primary ring-4 ring-[#FFFFFF]"></span>
<div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
<span class="font-bold text-primary">10:15 AM Today</span>
<span>•</span>
<span>Routine Round</span>
</div>
<p class="font-body-md text-body-md text-on-surface mt-1">
                "Vitals Check: BP 128/82 mmHg, Pulse 74 bpm. Normal and stable."
              </p>
<div class="flex items-center gap-2 mt-1">
<span class="w-6 h-6 rounded-full bg-[#E8F3EE] text-primary flex items-center justify-center font-label-sm text-[12px] font-bold">A</span>
<span class="font-label-sm text-label-sm text-primary font-bold">Nurse Anjali</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Floor Nurse</span>
</div>
</div>
<!-- Update 2: Morning walk with Suresh K. -->
<div class="relative flex flex-col gap-1">
<span class="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-secondary ring-4 ring-[#FFFFFF]"></span>
<div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
<span class="font-bold text-secondary">09:30 AM Today</span>
<span>•</span>
<span>Mobility &amp; Garden</span>
</div>
<p class="font-body-md text-body-md text-on-surface mt-1">
                "Morning walk in garden with Suresh K. Kamla Deshmukh was in cheerful spirits, enjoyed warm ginger tea and relaxed in the veranda."
              </p>
<div class="mt-2 w-full rounded-xl overflow-hidden border border-[#E8E2D8] relative">
<img class="w-full h-36 object-cover bg-[#F3EEE6]" data-alt="Serene senior care courtyard garden in Pune India, with blooming marigolds, paved gentle walking pathways, seated elder drinking morning tea under shady banyan tree with warm sunbeams." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAepk63dB-4Sma5A-Hg99MqcfcjTLBqTltpatmUqjNXm-vZQ73s5k05d2_colKihVgLy5IwfzrbGHn88Evj1l1befTVSW9WGGeb93s73r4OqOFbCb-qE0H9sDbV_p3pbvB51IXkE7GagvWnsrb7o_C0GFyabu_tkUg02krAFnTvt-QjWIEIrXaVCKe20VafzboKJHE3innqxyxO7PW349FFZZ7lRq0etxYDD5XNvSBA1MWeyrqms12qjw"/>
<span class="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#FFFFFF]/90 border border-[#E8E2D8] font-label-sm text-label-sm text-on-surface backdrop-blur-sm">Sukoon Courtyard Walkway</span>
</div>
<div class="flex items-center gap-2 mt-2">
<span class="w-6 h-6 rounded-full bg-[#E8F3EE] text-primary flex items-center justify-center font-label-sm text-[12px] font-bold">S</span>
<span class="font-label-sm text-label-sm text-primary font-bold">Suresh K.</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Care Team Companion</span>
</div>
</div>
<!-- Update 3: Staff notes -->
<div class="relative flex flex-col gap-1">
<span class="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-[#A89F91] ring-4 ring-[#FFFFFF]"></span>
<div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
<span>Yesterday Evening</span>
<span>•</span>
<span>Staff notes</span>
</div>
<p class="font-body-md text-body-md text-on-surface mt-1">
                "Staff notes: Kamla Deshmukh participated in evening recreation, ate scheduled dinner comfortably, and rested peacefully."
              </p>
<div class="flex items-center gap-2 mt-1">
<span class="w-6 h-6 rounded-full bg-[#F3EEE6] border border-[#E8E2D8] text-on-surface-variant flex items-center justify-center font-label-sm text-[12px] font-bold">R</span>
<span class="font-label-sm text-label-sm text-on-surface-variant font-bold">Ramesh Patil</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Evening Staff</span>
</div>
</div>
</div>
<!-- Note input -->
<div class="mt-space-sm p-space-sm bg-[#F3EEE6] border border-[#E8E2D8] rounded-xl flex flex-col gap-space-xs">
<label class="font-label-sm text-label-sm text-on-surface-variant font-bold" for="family-note-input">Send Note to Room 204 Care Team</label>
<div class="flex gap-2">
<input class="w-full h-[48px] px-space-sm rounded-xl bg-[#FFFFFF] border border-[#E8E2D8] text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary" id="family-note-input" placeholder="e.g. Visiting this afternoon..." type="text"/>
<button class="h-[48px] px-space-md bg-primary hover:bg-[#003634] text-on-primary rounded-xl font-label-md text-label-md shrink-0 flex items-center justify-center gap-1 shadow-sm" onclick="alert('Message noted for Nurse Anjali.')" type="button">
<span class="material-symbols-outlined text-[18px]">send</span>
<span class="hidden sm:inline">Send</span>
</button>
</div>
</div>
</div>
<!-- Meal & Rest Summary Card -->
<div class="bg-[#FFFFFF] rounded-xl border border-[#E8E2D8] shadow-sm p-space-md flex flex-col gap-space-sm">
<div class="flex items-center justify-between">
<span class="font-headline-sm text-headline-sm text-on-surface">Weekly Meal &amp; Rest Report</span>
<span class="material-symbols-outlined text-primary text-[24px]">restaurant</span>
</div>
<p class="font-body-md text-body-md text-on-surface-variant">Daily dietary intake and rest monitored by campus staff.</p>
<div class="grid grid-cols-2 gap-space-sm mt-1">
<div class="p-space-sm bg-[#F3EEE6] border border-[#E8E2D8] rounded-xl">
<span class="font-label-sm text-label-sm text-on-surface-variant">Hydration</span>
<p class="font-headline-sm text-headline-sm text-primary">Adequate [demo]</p>
<span class="font-label-sm text-label-sm text-primary font-bold">On Schedule</span>
</div>
<div class="p-space-sm bg-[#F3EEE6] border border-[#E8E2D8] rounded-xl">
<span class="font-label-sm text-label-sm text-on-surface-variant">Sleep Rest</span>
<p class="font-headline-sm text-headline-sm text-primary">Restful [demo]</p>
<span class="font-label-sm text-label-sm text-primary font-bold">Uninterrupted</span>
</div>
</div>
</div>
</div>
</div>
<!-- Bottom Details Section: Caregivers on Duty & Emergency Tie-Up -->
<section class="w-full bg-[#FFFFFF] rounded-xl border border-[#E8E2D8] shadow-sm p-space-md md:p-space-lg flex flex-col gap-space-lg" id="caregivers-section">
<div class="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
<div>
<span class="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Staff Care Team</span>
<h2 class="font-headline-md text-headline-md text-on-surface">Caregivers On Duty &amp; Emergency Tie-Up</h2>
</div>
<div class="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
<span class="w-3 h-3 rounded-full bg-primary"></span>
<span>Active Shift (08:00 - 20:00)</span>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
<!-- Staff Member 1: Nurse Anjali -->
<div class="p-space-md bg-[#F3EEE6] border border-[#E8E2D8] rounded-xl flex flex-col justify-between gap-space-md">
<div class="flex items-start gap-space-sm">
<img class="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#FFFFFF] border border-[#E8E2D8]" data-alt="Portrait of Nurse Anjali, compassionate Indian registered nurse in modern clean teal scrubs, holding medical clipboard, smiling warmly against a brightly lit senior care hallway." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcJKtXw8cAq8fNijaZRnnf_CuF_OTiK3uTzZzB4bSZgCUGB5ogELeudN-iDvV5v-LGhoCqc2Pc_GVRN2IHnXD2wyIgMKHFj9NtsaychiwLf6rKgj7QjPhXL-4wfJA0gem3EuOGLlTZ7R_ckkdaltFpP4YXHQsr2Mi6h2Xi5-WxbOV7gOcoMCt5EhA5s5pgejnmAP3jMFfT4YKSqb2EEU0_3QgHDHuCTqSw6ZcLp8xwgSJZAzCdiuvkrA"/>
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-primary font-bold">Floor Nurse On Duty</span>
<h3 class="font-headline-sm text-headline-sm text-on-surface">Nurse Anjali</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant">Floor In-charge</p>
</div>
</div>
<div class="flex flex-col gap-2">
<div class="text-on-surface-variant font-body-md text-body-md flex items-center gap-1.5">
<span class="material-symbols-outlined text-[18px] text-primary">badge</span>
<span>Direct Extension: Room 204 Terminal</span>
</div>
<div class="h-[46px] w-full px-space-md bg-[#FFFFFF] border border-[#E8E2D8] text-primary font-label-md text-label-md rounded-xl flex items-center justify-center gap-2 shadow-sm">
<span class="material-symbols-outlined text-[20px]">support_agent</span>
<span>Nurse Anjali on Floor</span>
</div>
</div>
</div>
<!-- Staff Member 2: Care Supervisor Rajiv Sharma -->
<div class="p-space-md bg-[#F3EEE6] border border-[#E8E2D8] rounded-xl flex flex-col justify-between gap-space-md">
<div class="flex items-start gap-space-sm">
<img class="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#FFFFFF] border border-[#E8E2D8]" data-alt="Portrait of Care Supervisor Rajiv Sharma, professional Indian man in mid-40s wearing smart casual khakis and teal badge, smiling reassuringly in comfortable elder community office." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgWNzi_L4_ZYmUPSgISAY_crVK6miw2L5hOMBhjOccKTQXfqWBReFExZHftDgaIt_BA0G9N7yREnWbPFdQESiBbtyJq135fXka92hCNYw66vgvAbmw63F6gMzpYImgqEgVwbr_1i2OrbtLiIWcazwxVwyfCTO_lHtLy8JbCnTHvpqzKMaSCc-dxo5CianZCRDnEAkujvbLCgj1of-ZS4b7pr926SyysKbfS5HzxrX0Vf0MzlCVtOvUiQ"/>
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-primary font-bold">Campus Care Supervisor</span>
<h3 class="font-headline-sm text-headline-sm text-on-surface">Supervisor Rajiv Sharma</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant">Sukoon Campus Resident Welfare</p>
</div>
</div>
<div class="flex flex-col gap-2">
<div class="text-on-surface-variant font-body-md text-body-md flex items-center gap-1.5">
<span class="material-symbols-outlined text-[18px] text-primary">schedule</span>
<span>Campus Duty: Day Shift</span>
</div>
<div class="h-[46px] w-full px-space-md bg-[#FFFFFF] border border-[#E8E2D8] text-primary font-label-md text-label-md rounded-xl flex items-center justify-center gap-2 shadow-sm">
<span class="material-symbols-outlined text-[20px]">person</span>
<span>Supervisor Rajiv Sharma</span>
</div>
</div>
</div>
<!-- Emergency Hospital Card: [Nearest hospital] -->
<div class="p-space-md bg-[#FFF5F5] border border-[#F8D2D2] text-[#93000A] rounded-xl flex flex-col justify-between gap-space-md">
<div class="flex items-start gap-space-sm">
<div class="w-14 h-14 rounded-xl bg-[#BA1A1A] text-white flex items-center justify-center shrink-0 shadow-sm">
<span class="material-symbols-outlined text-[28px]">local_hospital</span>
</div>
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-[#BA1A1A] font-bold uppercase tracking-wider">Emergency Hospital Tie-Up</span>
<h3 class="font-headline-sm text-headline-sm text-on-surface">[Nearest hospital]</h3>
<p class="font-label-sm text-label-sm text-[#733030]">Designated hospital network for Room 204</p>
</div>
</div>
<div class="flex flex-col gap-2">
<div class="text-[#733030] font-label-sm text-label-sm flex items-center gap-1.5">
<span class="material-symbols-outlined text-[18px]">health_and_safety</span>
<span>Medical dossier and records on campus file</span>
</div>
<div class="h-[46px] w-full px-space-md bg-[#BA1A1A] text-white font-label-md text-label-md rounded-xl flex items-center justify-center gap-2 shadow-sm">
<span class="material-symbols-outlined text-[20px]">medical_services</span>
<span>[Nearest hospital] Emergency Protocol</span>
</div>
</div>
</div>
</div>
<!-- Care Records Export Card -->
<div class="w-full p-space-md bg-[#F3EEE6] border border-[#E8E2D8] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-space-sm text-center sm:text-left">
<div class="flex items-center gap-space-sm">
<div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0">
<span class="material-symbols-outlined text-[22px]">description</span>
</div>
<div>
<p class="font-label-md text-label-md text-on-surface font-bold">Care Summary Record</p>
<p class="font-label-sm text-label-sm text-on-surface-variant">Medication history and caregiver notes available for family access (Priya Deshmukh).</p>
</div>
</div>
<button class="h-[46px] px-space-md bg-[#FFFFFF] border border-[#E8E2D8] hover:bg-[#FAF7F2] text-primary rounded-xl font-label-md text-label-md shrink-0 flex items-center justify-center gap-2 shadow-sm" onclick="alert('Downloading health summary for Kamla Deshmukh [demo].')" type="button">
<span class="material-symbols-outlined text-[20px]">download</span>
<span>Download Health Summary [demo]</span>
</button>
</div>
</section>
</div>
</div></main><footer class="w-full bg-[#F3EEE6] border-t border-[#E8E2D8] mt-space-xl"><div class="max-w-[1280px] mx-auto px-margin md:px-margin-desktop py-space-xl flex flex-col md:flex-row items-center justify-between gap-space-lg"><div class="flex flex-col sm:flex-row items-center gap-space-md text-center sm:text-left"><div class="w-12 h-12 rounded-full bg-[#FFEAE6] text-[#BA1A1A] border border-[#F8C8C0] flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[28px]">emergency</span></div><div><p class="font-label-lg text-label-lg text-on-surface font-bold">Elderline 14567 (Govt. of India)</p><p class="font-label-sm text-label-sm text-on-surface-variant">National helpline for senior citizens</p></div></div><div class="flex flex-col sm:flex-row items-center gap-space-lg text-center sm:text-right"><div class="flex items-center gap-space-md font-label-sm text-label-sm text-on-surface-variant"><a class="hover:text-primary transition-colors" data-path="privacy-policy" href="#">Privacy Policy</a><span>•</span><a class="hover:text-primary transition-colors" data-path="accessibility" href="#">Accessibility Mandate</a><span>•</span><a class="hover:text-primary transition-colors" data-path="terms-of-care" href="#">Terms of Care</a></div><p class="font-label-sm text-label-sm text-on-surface-variant">© 2026 Saathi Senior Community Care India. All rights reserved.</p></div></div></footer>` }} />;
}
