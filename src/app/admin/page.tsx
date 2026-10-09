import React from 'react';

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: `<aside class="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="flex flex-col"><div class="h-20 px-space-lg flex items-center gap-space-sm"><div class="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary"><span class="material-symbols-outlined text-[24px]">cottage</span></div><div class="flex flex-col"><span class="font-headline-sm text-headline-sm text-primary tracking-tight leading-none">Sukoon Home</span><span class="font-label-sm text-label-sm text-on-surface-variant leading-none mt-1">Admin Care Portal</span></div></div><div class="px-space-md py-space-sm"><div class="p-space-sm rounded-xl bg-error-container/40 flex items-center justify-between gap-space-xs"><div class="flex items-center gap-space-xs text-error"><span class="material-symbols-outlined text-[22px]">emergency_home</span><span class="font-label-md text-label-md text-on-surface font-bold">Emergency Line</span></div><span class="font-label-sm text-label-sm bg-error text-on-error px-space-xs py-0.5 rounded-full font-bold">Active</span></div></div><nav class="flex flex-col gap-space-xs px-space-md py-space-sm" data-active-classes="bg-primary-container text-on-primary font-bold shadow-sm"><a aria-current="page" class="flex items-center gap-space-sm px-space-md py-3 rounded-xl transition-all bg-primary-container text-on-primary font-bold shadow-sm" data-path="dashboard" href="#"><span class="material-symbols-outlined text-[24px]">dashboard</span><span class="font-label-lg text-label-lg">Dashboard</span></a><a class="flex items-center gap-space-sm px-space-md py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all" data-path="residents" href="#"><span class="material-symbols-outlined text-[24px]">elderly</span><span class="font-label-lg text-label-lg">Residents</span></a><a class="flex items-center gap-space-sm px-space-md py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all" data-path="medicines" href="#"><span class="material-symbols-outlined text-[24px]">medication</span><span class="font-label-lg text-label-lg">Medicines</span></a><a class="flex items-center gap-space-sm px-space-md py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all" data-path="sos-and-alerts" href="#"><span class="material-symbols-outlined text-[24px]">notifications_active</span><span class="font-label-lg text-label-lg">SOS &amp; Alerts</span></a><a class="flex items-center gap-space-sm px-space-md py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all" data-path="volunteer-approvals" href="#"><span class="material-symbols-outlined text-[24px]">how_to_reg</span><span class="font-label-lg text-label-lg">Volunteer Approvals</span></a><a class="flex items-center gap-space-sm px-space-md py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all" data-path="family-updates" href="#"><span class="material-symbols-outlined text-[24px]">family_restroom</span><span class="font-label-lg text-label-lg">Family Updates</span></a></nav></div><div class="p-space-md"><div class="p-space-sm rounded-xl bg-surface-container-low flex items-center gap-space-sm"><div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container"><span class="material-symbols-outlined text-[18px]">shield_person</span></div><div class="flex flex-col"><span class="font-label-sm text-label-sm text-on-surface font-bold leading-tight">Care Station 01</span><span class="font-label-sm text-label-sm text-on-surface-variant leading-tight">Shift Duty: Dr. Rao</span></div></div></div></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 h-20 bg-surface-container-lowest/90 backdrop-blur-md z-40 shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="w-full h-full px-space-lg flex items-center justify-between"><div class="flex items-center gap-space-md"><div class="flex items-center gap-space-xs bg-surface-container-low px-space-md py-2 rounded-xl"><span class="material-symbols-outlined text-[20px] text-primary">schedule</span><span class="font-label-md text-label-md text-on-surface font-bold">10:45 AM IST</span></div><button class="flex items-center gap-space-xs bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md px-space-md py-2 rounded-xl transition-colors cursor-pointer" type="button"><span class="material-symbols-outlined text-[18px]">fast_forward</span><span>+15 min Demo</span></button></div><div class="flex items-center gap-space-lg"><div class="flex items-center bg-surface-container-low p-1 rounded-xl gap-1"><button class="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary font-label-sm text-label-sm font-bold shadow-sm" type="button">English</button><button class="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm" type="button">हिंदी</button><button class="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm" type="button">मराठी</button></div><div class="flex items-center gap-space-sm"><div class="flex flex-col text-right"><span class="font-label-md text-label-md text-on-surface font-bold leading-tight">Anita Deshmukh</span><span class="font-label-sm text-label-sm text-on-surface-variant leading-tight">Lead Administrator</span></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></div></header><main class="w-full pt-20 px-space-lg pb-space-xl bg-surface"><div class="flex flex-col w-full gap-space-lg">
<!-- Dashboard Context & KPI Strip Header -->
<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
<div>
<div class="flex items-center gap-space-xs text-secondary mb-1">
<span class="material-symbols-outlined text-[18px]">verified_user</span>
<span class="font-label-sm text-label-sm uppercase tracking-wider font-bold">Campus Supervisor Console • Pune West</span>
</div>
<h1 class="font-headline-lg text-headline-lg text-primary tracking-tight">Sukoon Home Care Dashboard</h1>
</div>
<!-- Live Telemetry Quick Badge & Emergency Gov Info -->
<div class="flex items-center flex-wrap gap-space-sm">
<div class="flex items-center gap-space-xs px-3 py-2 bg-surface-container-lowest shadow-sm rounded-xl text-on-surface">
<span class="material-symbols-outlined text-primary text-[20px]">phone_in_talk</span>
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface-variant leading-none">Emergency Helpline</span>
<span class="font-label-md text-label-md text-primary font-bold leading-tight">Elderline 14567 (Govt. of India)</span>
</div>
</div>
<button class="flex items-center gap-space-xs px-4 py-2.5 bg-surface-container hover:bg-surface-container-high text-primary rounded-xl transition-all cursor-pointer shadow-sm" type="button">
<span class="material-symbols-outlined text-[18px]">update</span>
<span class="font-label-md text-label-md font-bold">Demo clock: +15 min</span>
</button>
</div>
</div>
<!-- KPI Summary Strip (Values marked with [demo]) -->
<div class="grid grid-cols-2 md:grid-cols-4 gap-space-md">
<!-- Residents KPI -->
<div class="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex items-center justify-between">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Total Residents</span>
<span class="font-headline-md text-headline-md text-on-surface tracking-tight mt-0.5">24 <span class="text-on-surface-variant font-label-sm text-label-sm font-normal">[demo]</span></span>
<span class="font-label-sm text-label-sm text-secondary flex items-center gap-1 mt-1">
<span class="material-symbols-outlined text-[16px]">check_circle</span> 22 in campus
        </span>
</div>
<div class="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[26px]">groups</span>
</div>
</div>
<!-- Medicines Due KPI -->
<div class="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex items-center justify-between">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Meds in Next Hour</span>
<span class="font-headline-md text-headline-md text-on-surface tracking-tight mt-0.5">3 due <span class="text-on-surface-variant font-label-sm text-label-sm font-normal">[demo]</span></span>
<span class="font-label-sm text-label-sm text-tertiary-container flex items-center gap-1 mt-1 font-bold">
<span class="material-symbols-outlined text-[16px]">schedule_send</span> 1 overdue alert
        </span>
</div>
<div class="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
<span class="material-symbols-outlined text-[26px]">medication</span>
</div>
</div>
<!-- Active Alerts KPI -->
<div class="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex items-center justify-between">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Active Care Alerts</span>
<span class="font-headline-md text-headline-md text-tertiary-container tracking-tight mt-0.5">1 alert <span class="text-on-surface-variant font-label-sm text-label-sm font-normal">[demo]</span></span>
<span class="font-label-sm text-label-sm text-tertiary-container flex items-center gap-1 mt-1">
<span class="material-symbols-outlined text-[16px]">priority_high</span> Level 2 Escalation
        </span>
</div>
<div class="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
<span class="material-symbols-outlined text-[26px]">warning</span>
</div>
</div>
<!-- Volunteers on Duty KPI -->
<div class="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex items-center justify-between">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Volunteers on Duty</span>
<span class="font-headline-md text-headline-md text-on-surface tracking-tight mt-0.5">4 active <span class="text-on-surface-variant font-label-sm text-label-sm font-normal">[demo]</span></span>
<span class="font-label-sm text-label-sm text-secondary flex items-center gap-1 mt-1">
<span class="material-symbols-outlined text-[16px]">how_to_reg</span> Suresh K. on station
        </span>
</div>
<div class="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[26px]">volunteer_activism</span>
</div>
</div>
</div>
<!-- Primary Split View: Residents Visibility (Left/Center) & Escalation Panel (Right) -->
<div class="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
<!-- Left Section: 6 Residents Care Status Grid (8 Cols on XL) -->
<div class="xl:col-span-8 flex flex-col gap-space-md">
<div class="flex items-center justify-between">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-primary text-[24px]">contacts</span>
<h2 class="font-headline-sm text-headline-sm text-on-surface">Resident Care State Status</h2>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full font-bold">Shift: 08:00 - 16:00 IST</span>
</div>
<!-- Grid of 6 Residents -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
<!-- RESIDENT 1: Kamla Deshmukh (ATTENTION HIGHLIGHT: OBVIOUS WITHIN 3 SECONDS) -->
<div class="col-span-1 md:col-span-2 bg-surface-container-lowest rounded-xl shadow-md p-space-md bg-gradient-to-r from-tertiary-fixed/30 to-surface-container-lowest relative overflow-hidden">
<div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md pb-space-sm">
<div class="flex items-center gap-space-md">
<div class="relative">
<img class="w-20 h-20 rounded-2xl object-cover shadow-sm" data-alt="Portrait of Kamla Deshmukh, an 78-year-old Indian grandmother with silver hair in a simple maroon saree, gentle expression, indoor warm ambient daylight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSb3A57B4qDMsjB7GqbM9bjuhPCWDpE-8hMJW5NUbZ50eqFzcuveU6aZX_yA_ekO8UUvPTaxOkanFMJx8_3iMI-TpRFmdBk6ZhVyi9Uy64XPrh0YgNIJ-H5ngpMRYjyo5j1DauJXpy8ibt56mUXfQK3nNyoBvPgRAqp9iTICicYJKcfBtDmF0bNHCM94Hc5gZxw5qmL2BhhhV5dmwKPFqoVDfZz4qGwmdz0AfzftGml3eZxxRrqqhEzw"/>
<span class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center text-[14px] shadow-sm">
<span class="material-symbols-outlined text-[14px]">warning</span>
</span>
</div>
<div class="flex flex-col">
<div class="flex items-center gap-space-xs">
<h3 class="font-headline-sm text-headline-sm text-on-surface">Kamla Deshmukh</h3>
<span class="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">priority_high</span> Needs Attention
                  </span>
</div>
<span class="font-body-md text-body-md text-on-surface-variant">Age 78 • Sukoon Home • Room 204 (East Wing)</span>
<span class="font-label-sm text-label-sm text-secondary mt-0.5">Emergency Contact: Priya Deshmukh (Daughter)</span>
</div>
</div>
<!-- Overdue Badge & Countdown -->
<div class="bg-surface-container-lowest px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-space-sm">
<span class="material-symbols-outlined text-tertiary text-[26px]">alarm_on</span>
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">Urgent Notice</span>
<span class="font-label-md text-label-md text-tertiary font-bold">9:00 AM BP medicine not marked as given</span>
<span class="font-label-sm text-label-sm text-error font-bold flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">timer</span> 15 min overdue
                </span>
</div>
</div>
</div>
<!-- Immediate Action Bar with Prescribed Minimum 48-54px targets -->
<div class="mt-space-sm pt-space-sm bg-surface-container-low/60 rounded-xl p-space-sm flex flex-wrap items-center justify-between gap-space-sm">
<div class="flex items-center gap-space-xs text-on-surface-variant">
<span class="material-symbols-outlined text-[20px] text-primary">medication_liquid</span>
<span class="font-label-md text-label-md font-bold text-on-surface">Prescription: Amlodipine 5mg (Post-breakfast)</span>
</div>
<div class="flex items-center flex-wrap gap-space-xs">
<button class="h-[48px] px-space-md bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md rounded-xl font-bold flex items-center gap-space-xs shadow-sm cursor-pointer transition-colors" type="button">
<span class="material-symbols-outlined text-[20px]">check</span>
<span>Mark as given</span>
</button>
<button class="h-[48px] px-space-md bg-surface-container-lowest hover:bg-surface-container text-primary font-label-md text-label-md rounded-xl font-bold flex items-center gap-space-xs shadow-sm cursor-pointer transition-colors" type="button">
<span class="material-symbols-outlined text-[20px]">person_pin_circle</span>
<span>Check on resident</span>
</button>
<button class="h-[48px] px-space-md bg-error hover:bg-on-error-container text-on-error font-label-md text-label-md rounded-xl font-bold flex items-center gap-space-xs shadow-sm cursor-pointer transition-colors" type="button">
<span class="material-symbols-outlined text-[20px]">e911_emergency</span>
<span>Trigger SOS</span>
</button>
</div>
</div>
</div>
<!-- RESIDENT 2: Ramesh Patil -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col justify-between">
<div class="flex items-start gap-space-md">
<img class="w-16 h-16 rounded-xl object-cover shadow-sm" data-alt="Portrait of Ramesh Patil, a 72-year-old retired Indian clerk wearing spectacles and white kurta, looking calm and composed indoors" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmSDQeNUcWAazNqYu3rUATjden2le-UoF9P9IjxXah8VVQxH_Bh85x8ZEvhKnb3r27JUCJEAiPi9N9ri-IOcoghS9lppPkd24Zbu3wLMc4OH8MYX9m2eDkWG9DJ5OpOtCdVGRhoFyRcV1nVsG65M_ByzVZiLymNG6eekLIDYYzLmTAZl6bF1EP9z54EM3309hwIrTI59ZcNqExK2yrpBuTdQ_QrBnXOoejtXIkELKxESv5e9B1-g95Yg"/>
<div class="flex flex-col flex-1 min-w-0">
<div class="flex items-center justify-between gap-space-xs">
<h3 class="font-label-lg text-label-lg text-on-surface truncate">Ramesh Patil</h3>
<span class="px-2 py-0.5 rounded-full bg-secondary-container text-secondary font-label-sm text-label-sm font-bold flex items-center gap-1 shrink-0">
<span class="material-symbols-outlined text-[14px]">check_circle</span> Stable
                </span>
</div>
<span class="font-body-md text-body-md text-on-surface-variant">Age 72 • Room 102 (Lives alone)</span>
<span class="font-label-sm text-label-sm text-secondary mt-1">Morning walking cycle: Completed</span>
</div>
</div>
<div class="mt-space-md pt-space-xs flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-lg">
<span class="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">vital_signs</span> Pulse 74 bpm • BP 124/82
            </span>
<button class="font-label-sm text-label-sm text-primary font-bold hover:underline cursor-pointer" type="button">Profile</button>
</div>
</div>
<!-- RESIDENT 3: Sunita Kelkar -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col justify-between">
<div class="flex items-start gap-space-md">
<img class="w-16 h-16 rounded-xl object-cover shadow-sm" data-alt="Portrait of Sunita Kelkar, an 80-year-old Indian woman with warm smile, gray hair tied back, wearing a floral cotton dress in a sunlit lounge" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLX6rHNoT74ZGJp2eRA1scoeiDnhaULc1Ssu9-PJqK3Zi74LMbq1cHIuMIrybibJj-lYLgLAckqZtq4SUcChbhb3xYSPmD3MKpXMB_Gv9UkGZlfnOh4gVfQ3NGO75NvKkqjLcea_e4oV3XTWwO9xZH34qC-wquoNAdoWWO5pRsHHBXy8nnzvo_flhYnEIHrvdYUck7ZA592DkV5BD4DKPcDLcX6eUQ2WyGlfBqtWOvU9evkgiSI82JgQ"/>
<div class="flex flex-col flex-1 min-w-0">
<div class="flex items-center justify-between gap-space-xs">
<h3 class="font-label-lg text-label-lg text-on-surface truncate">Sunita Kelkar</h3>
<span class="px-2 py-0.5 rounded-full bg-secondary-container text-secondary font-label-sm text-label-sm font-bold flex items-center gap-1 shrink-0">
<span class="material-symbols-outlined text-[14px]">check_circle</span> Stable
                </span>
</div>
<span class="font-body-md text-body-md text-on-surface-variant">Age 80 • Room 108</span>
<span class="font-label-sm text-label-sm text-secondary mt-1">Hydration target: 4/6 glasses</span>
</div>
</div>
<div class="mt-space-md pt-space-xs flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-lg">
<span class="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">restaurant</span> Breakfast logged: 08:30 AM
            </span>
<button class="font-label-sm text-label-sm text-primary font-bold hover:underline cursor-pointer" type="button">Profile</button>
</div>
</div>
<!-- RESIDENT 4: Madhav Joshi -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col justify-between">
<div class="flex items-start gap-space-md">
<img class="w-16 h-16 rounded-xl object-cover shadow-sm" data-alt="Portrait of Madhav Joshi, an 84-year-old Indian grandfather reading a Marathi newspaper on an armchair with soft natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAAOXOYSAQINt61KLJtnR3qLzfe0DBG90-bmeXwJfUZfQcGOW_lP9S2evFCcOPFfJkLnT98MtQSYfJoYz95nH--D_aVYGUYd9AD8kIYjF3RZlBDt1JPAf47oh2JKA8FKZhvNDN0odleWNrVykhVUg-bMVKibXxL0WM2w739iX3HxJLK5p-7G2ySK4WvtU2iNi4J7NQ_TqxqohoLNuAkA64WpLPIdAYUpcprf4Kq6BwZJqkFcWsix_r6Q"/>
<div class="flex flex-col flex-1 min-w-0">
<div class="flex items-center justify-between gap-space-xs">
<h3 class="font-label-lg text-label-lg text-on-surface truncate">Madhav Joshi</h3>
<span class="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold flex items-center gap-1 shrink-0">
<span class="material-symbols-outlined text-[14px]">notifications</span> Needs Attention
                </span>
</div>
<span class="font-body-md text-body-md text-on-surface-variant">Age 84 • Room 114</span>
<span class="font-label-sm text-label-sm text-tertiary font-bold mt-1">Routine vitals check due (11:00 AM)</span>
</div>
</div>
<div class="mt-space-md pt-space-xs flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-lg">
<span class="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">stethoscope</span> Nurse assigned: Sister Maya
            </span>
<button class="font-label-sm text-label-sm text-primary font-bold hover:underline cursor-pointer" type="button">Schedule</button>
</div>
</div>
<!-- RESIDENT 5: Vimala Sen -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col justify-between">
<div class="flex items-start gap-space-md">
<img class="w-16 h-16 rounded-xl object-cover shadow-sm" data-alt="Portrait of Vimala Sen, a 76-year-old Indian grandmother sitting in veranda garden with potted plants, gentle kind eyes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5MHDCn4uYVBZGCV7pkJWNaIlv9jqE2hqzcfXXfYTt5hqGpTQhFUdvPT4LmS-9Gzaza25TL-HPOR3qFgjcmM9MNz-ceGJ4kWvv6xs1Zx0dbdCF6FzWUu15X2wlslm4-5A8L0r02FuC4m8gRwT0ekgyvlEdDSiHX-9omF6tGIiv0tGFyyaeb5DugeJ2L93l8EmHBwVmUqsrEMk-tZJJ5ioG2P0u8I9J5glhcArVLQMywILKf77vXOVP8A"/>
<div class="flex flex-col flex-1 min-w-0">
<div class="flex items-center justify-between gap-space-xs">
<h3 class="font-label-lg text-label-lg text-on-surface truncate">Vimala Sen</h3>
<span class="px-2 py-0.5 rounded-full bg-secondary-container text-secondary font-label-sm text-label-sm font-bold flex items-center gap-1 shrink-0">
<span class="material-symbols-outlined text-[14px]">check_circle</span> Stable
                </span>
</div>
<span class="font-body-md text-body-md text-on-surface-variant">Age 76 • Room 201</span>
<span class="font-label-sm text-label-sm text-secondary mt-1">Eye drops due: 10:30 AM</span>
</div>
</div>
<div class="mt-space-md pt-space-xs flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-lg">
<span class="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">visibility</span> Post-cataract regimen
            </span>
<button class="font-label-sm text-label-sm text-primary font-bold hover:underline cursor-pointer" type="button">Profile</button>
</div>
</div>
<!-- RESIDENT 6: Anand Rao -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col justify-between">
<div class="flex items-start gap-space-md">
<img class="w-16 h-16 rounded-xl object-cover shadow-sm" data-alt="Portrait of Anand Rao, an 81-year-old gentleman with gray beard and beige cardigan, smiling serenely by an indoor library shelf" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAHulTrF0QO60EOuSPMdRnJzZWyn4WcscyO3p-oU4EtfZLG2aGUgN1pJVEaRgwGB5NYSaMpRv8cCGyw0l-DZjhU1C4OWJwReWNp75J9Rhj1YSlHbg6Fs9FsixSYd3HCLgxdbO43lAbc51lE_1mHH2RPhR8CJiRReELwCgRmSGumYpg9WWj3yLxFQ_7h-WaFIxNVHeCAvlu_lPZAFhe6BkwXfjudv3LJaaUGrWAG407LS4dGnZM7-cKLA"/>
<div class="flex flex-col flex-1 min-w-0">
<div class="flex items-center justify-between gap-space-xs">
<h3 class="font-label-lg text-label-lg text-on-surface truncate">Anand Rao</h3>
<span class="px-2 py-0.5 rounded-full bg-secondary-container text-secondary font-label-sm text-label-sm font-bold flex items-center gap-1 shrink-0">
<span class="material-symbols-outlined text-[14px]">check_circle</span> Stable
                </span>
</div>
<span class="font-body-md text-body-md text-on-surface-variant">Age 81 • Room 210</span>
<span class="font-label-sm text-label-sm text-secondary mt-1">Calcium 500mg due: 10:00 AM</span>
</div>
</div>
<div class="mt-space-md pt-space-xs flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-lg">
<span class="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">menu_book</span> Reading club in Library
            </span>
<button class="font-label-sm text-label-sm text-primary font-bold hover:underline cursor-pointer" type="button">Profile</button>
</div>
</div>
</div>
</div>
<!-- Right Section: Live Escalation Stepper Panel (4 Cols on XL) -->
<div class="xl:col-span-4 flex flex-col gap-space-md">
<div class="bg-surface-container-lowest rounded-xl shadow-md p-space-md flex flex-col">
<div class="flex items-center justify-between pb-space-sm">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-tertiary text-[22px]">hub</span>
<h2 class="font-headline-sm text-headline-sm text-on-surface">Live Alert Escalation</h2>
</div>
<span class="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed-variant px-2.5 py-0.5 rounded-full font-bold">Priority High</span>
</div>
<!-- Resident Details for Active Escalation -->
<div class="bg-surface-container-low p-space-sm rounded-xl mt-space-xs flex items-center justify-between">
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface font-bold">Kamla Deshmukh (Room 204)</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Missed Morning Blood Pressure Dose</span>
</div>
<span class="font-label-sm text-label-sm text-tertiary font-bold px-2 py-1 bg-surface-container-lowest rounded-lg shadow-sm">Step 2 of 4</span>
</div>
<!-- 4-Step Vertical Escalation Stepper -->
<div class="flex flex-col my-space-md relative pl-2">
<!-- Step 1: Completed -->
<div class="flex items-start gap-space-md relative pb-6">
<div class="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 z-10 shadow-sm">
<span class="material-symbols-outlined text-[16px]">done</span>
</div>
<div class="flex flex-col pt-0.5">
<div class="flex items-center gap-2">
<span class="font-label-md text-label-md text-on-surface font-bold">Step 1: Alert Raised</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">09:15 AM</span>
</div>
<span class="font-body-md text-body-md text-on-surface-variant">Automated pill schedule overdue triggered.</span>
</div>
<div class="absolute left-3.5 top-7 bottom-0 w-0.5 bg-secondary"></div>
</div>
<!-- Step 2: Active (Current Step) -->
<div class="flex items-start gap-space-md relative pb-6">
<div class="w-7 h-7 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center shrink-0 z-10 shadow-sm animate-pulse">
<span class="material-symbols-outlined text-[16px]">priority_high</span>
</div>
<div class="flex flex-col pt-0.5">
<div class="flex items-center gap-2">
<span class="font-label-md text-label-md text-tertiary-container font-bold">Step 2: Family Notified</span>
<span class="font-label-sm text-label-sm text-tertiary-container font-bold">09:18 AM (Active)</span>
</div>
<span class="font-body-md text-body-md text-on-surface font-semibold">Priya Deshmukh (Daughter) alerted via WhatsApp &amp; SMS.</span>
<span class="font-label-sm text-label-sm text-on-surface-variant mt-0.5 flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">done_all</span> Delivered to +91 98230 •••••
              </span>
</div>
<div class="absolute left-3.5 top-7 bottom-0 w-0.5 bg-outline-variant"></div>
</div>
<!-- Step 3: Pending/In Progress -->
<div class="flex items-start gap-space-md relative pb-6">
<div class="w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0 z-10">
<span class="material-symbols-outlined text-[16px]">radio_button_unchecked</span>
</div>
<div class="flex flex-col pt-0.5">
<div class="flex items-center gap-2">
<span class="font-label-md text-label-md text-on-surface font-bold">Step 3: Volunteer Accepted</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Queued</span>
</div>
<span class="font-body-md text-body-md text-on-surface-variant">Suresh K. notified (verified volunteer on floor duty).</span>
</div>
<div class="absolute left-3.5 top-7 bottom-0 w-0.5 bg-outline-variant"></div>
</div>
<!-- Step 4: Final Step -->
<div class="flex items-start gap-space-md relative">
<div class="w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0 z-10">
<span class="material-symbols-outlined text-[16px]">check_circle_outline</span>
</div>
<div class="flex flex-col pt-0.5">
<div class="flex items-center gap-2">
<span class="font-label-md text-label-md text-on-surface-variant font-semibold">Step 4: Resolved</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Pending</span>
</div>
<span class="font-body-md text-body-md text-on-surface-variant">Medicine administered &amp; supervisor sign-off recorded.</span>
</div>
</div>
</div>
<!-- Quick Response Action Targets -->
<div class="flex flex-col gap-space-xs mt-space-sm pt-space-sm">
<button class="h-[52px] w-full bg-primary hover:bg-primary-container text-on-primary rounded-xl font-label-md text-label-md font-bold flex items-center justify-center gap-space-xs shadow-sm cursor-pointer transition-colors" type="button">
<span class="material-symbols-outlined text-[20px]">call</span>
<span>Call Floor Nurse (Station 01)</span>
</button>
<button class="h-[52px] w-full bg-surface-container hover:bg-surface-container-high text-primary rounded-xl font-label-md text-label-md font-bold flex items-center justify-center gap-space-xs cursor-pointer transition-colors" type="button">
<span class="material-symbols-outlined text-[20px]">history_edu</span>
<span>View Escalation Log</span>
</button>
</div>
<div class="mt-space-md p-space-sm rounded-xl bg-surface-container-low flex items-center gap-space-sm">
<span class="material-symbols-outlined text-secondary text-[22px]">policy</span>
<p class="font-label-sm text-label-sm text-on-surface-variant">Automated alerts follow campus protocol 4A approved by Chief Medical Officer.</p>
</div>
</div>
</div>
</div>
<!-- Bottom Section: Medicine Schedule Table for Next 2 Hours -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-md">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
<div>
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-primary text-[24px]">calendar_clock</span>
<h2 class="font-headline-sm text-headline-sm text-on-surface">Medicine Schedule (Next 2 Hours)</h2>
</div>
<p class="font-body-md text-body-md text-on-surface-variant">Active monitoring between 09:00 AM – 11:00 AM IST</p>
</div>
<div class="flex items-center gap-space-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-lg flex items-center gap-1">
<span class="material-symbols-outlined text-tertiary text-[18px]">error</span> 1 Missed / Overdue
        </span>
<span class="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-lg flex items-center gap-1">
<span class="material-symbols-outlined text-secondary text-[18px]">pending</span> 2 Pending
        </span>
</div>
</div>
<!-- Responsive Table -->
<div class="overflow-x-auto w-full">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase">
<th class="p-space-md rounded-l-xl">Time</th>
<th class="p-space-md">Resident Name</th>
<th class="p-space-md">Room</th>
<th class="p-space-md">Medicine &amp; Dose</th>
<th class="p-space-md">Caregiver / Staff</th>
<th class="p-space-md">Status</th>
<th class="p-space-md text-right rounded-r-xl">Action</th>
</tr>
</thead>
<tbody class="divide-y divide-surface-container font-body-md text-body-md text-on-surface">
<!-- Overdue Row: Kamla Deshmukh -->
<tr class="bg-tertiary-fixed/20 hover:bg-tertiary-fixed/30 transition-colors">
<td class="p-space-md font-label-md text-label-md text-tertiary font-bold">
              09:00 AM
              <span class="block font-label-sm text-label-sm text-error font-bold">15m late</span>
</td>
<td class="p-space-md">
<div class="flex flex-col">
<span class="font-label-lg text-label-lg font-bold text-on-surface">Kamla Deshmukh</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Age 78</span>
</div>
</td>
<td class="p-space-md font-label-md text-label-md font-bold">Room 204</td>
<td class="p-space-md">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-bold text-on-surface">Amlodipine 5mg</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Oral tablet • Post-breakfast</span>
</div>
</td>
<td class="p-space-md">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-primary text-[20px]">person_check</span>
<span class="font-label-md text-label-md font-bold">Nurse Maya</span>
</div>
</td>
<td class="p-space-md">
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-error font-label-sm text-label-sm font-bold">
<span class="material-symbols-outlined text-[16px]">error</span> Missed / Overdue
              </span>
</td>
<td class="p-space-md text-right">
<button class="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm font-bold rounded-lg cursor-pointer transition-colors shadow-sm" type="button">
                Mark Given
              </button>
</td>
</tr>
<!-- Pending Row 1: Anand Rao (10:00 AM) -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="p-space-md font-label-md text-label-md text-on-surface font-bold">10:00 AM</td>
<td class="p-space-md">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-bold text-on-surface">Anand Rao</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Age 81</span>
</div>
</td>
<td class="p-space-md font-label-md text-label-md">Room 210</td>
<td class="p-space-md">
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface">Calcium Carbonate 500mg</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Oral chewable • With water</span>
</div>
</td>
<td class="p-space-md">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-secondary text-[20px]">volunteer_activism</span>
<span class="font-label-md text-label-md">Suresh K. (Volunteer)</span>
</div>
</td>
<td class="p-space-md">
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold">
<span class="material-symbols-outlined text-[16px]">schedule</span> Pending (in 30 min)
              </span>
</td>
<td class="p-space-md text-right">
<button class="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm font-bold rounded-lg cursor-pointer transition-colors" type="button">
                Dispense
              </button>
</td>
</tr>
<!-- Pending Row 2: Vimala Sen (10:30 AM) -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="p-space-md font-label-md text-label-md text-on-surface font-bold">10:30 AM</td>
<td class="p-space-md">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-bold text-on-surface">Vimala Sen</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Age 76</span>
</div>
</td>
<td class="p-space-md font-label-md text-label-md">Room 201</td>
<td class="p-space-md">
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface">Carboxymethylcellulose 0.5% Eye Drops</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">2 drops each eye</span>
</div>
</td>
<td class="p-space-md">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-primary text-[20px]">person_check</span>
<span class="font-label-md text-label-md">Nurse Maya</span>
</div>
</td>
<td class="p-space-md">
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold">
<span class="material-symbols-outlined text-[16px]">schedule</span> Pending (in 60 min)
              </span>
</td>
<td class="p-space-md text-right">
<button class="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm font-bold rounded-lg cursor-pointer transition-colors" type="button">
                Dispense
              </button>
</td>
</tr>
<!-- Completed Row: Ramesh Patil (08:30 AM) -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="p-space-md font-label-md text-label-md text-on-surface-variant">08:30 AM</td>
<td class="p-space-md">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-bold text-on-surface">Ramesh Patil</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Age 72</span>
</div>
</td>
<td class="p-space-md font-label-md text-label-md">Room 102</td>
<td class="p-space-md">
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface">Telmisartan 40mg</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Oral tablet • Morning dose</span>
</div>
</td>
<td class="p-space-md">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-secondary text-[20px]">volunteer_activism</span>
<span class="font-label-md text-label-md">Suresh K. (Volunteer)</span>
</div>
</td>
<td class="p-space-md">
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-secondary font-label-sm text-label-sm font-bold">
<span class="material-symbols-outlined text-[16px]">check_circle</span> Given at 08:35 AM
              </span>
</td>
<td class="p-space-md text-right">
<span class="font-label-sm text-label-sm text-secondary font-bold flex items-center justify-end gap-1">
<span class="material-symbols-outlined text-[16px]">verified</span> Verified
              </span>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Table Footer Compliance and Emergency Callout -->
<div class="flex flex-col md:flex-row items-center justify-between gap-space-sm pt-space-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant">Showing active 2-hour window records • Updated continuously</span>
<div class="flex items-center gap-space-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant">Immediate medical query?</span>
<span class="font-label-md text-label-md text-primary font-bold">Elderline 14567 (Govt. of India)</span>
</div>
</div>
</div>
</div></main></div>` }} />;
}
