import React from 'react';

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: `<header class="fixed top-0 left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D8]"><div class="h-20 max-w-[1280px] mx-auto px-margin md:px-margin-desktop flex items-center justify-between gap-space-md"><div class="flex items-center gap-space-sm"><div class="w-10 h-10 rounded-xl bg-[#0F5F5C] flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary text-[24px]">handshake</span></div><div class="flex flex-col"><span class="font-headline-sm text-headline-sm text-[#0F5F5C] leading-tight tracking-tight">Saathi</span><span class="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline leading-none">Senior Community Care India</span></div></div><nav class="hidden xl:flex items-center gap-space-xs p-1 bg-white border border-[#E8E2D8] rounded-xl"><a class="px-space-md py-space-xs text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" data-path="home" href="#">Home</a><a class="px-space-md py-space-xs text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" data-path="role-selection" href="#">Role Selection</a><a class="px-space-md py-space-xs text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" data-path="family-dashboard" href="#">Family Dashboard</a><a class="px-space-md py-space-xs text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" data-path="volunteer-alerts" href="#">Volunteer Alerts</a><a aria-current="page" class="px-space-md py-space-xs transition-colors bg-[#0F5F5C] text-white font-bold rounded-xl" data-path="register-volunteer" href="#">Register Volunteer</a></nav><div class="flex items-center gap-space-md"><div class="hidden md:flex items-center gap-space-xs px-space-sm py-1 bg-white border border-[#E8E2D8] rounded-full text-on-surface-variant font-label-sm text-label-sm"><button class="hover:text-[#0F5F5C] font-semibold text-[#0F5F5C] transition-colors" type="button">English</button><span class="text-[#E8E2D8]">|</span><button class="hover:text-[#0F5F5C] transition-colors" type="button">हिंदी</button><span class="text-[#E8E2D8]">|</span><button class="hover:text-[#0F5F5C] transition-colors" type="button">मराठी</button></div><a class="flex items-center gap-space-xs text-on-surface-variant hover:text-[#0F5F5C] transition-colors" data-path="login" href="#"><div class="w-8 h-8 rounded-full bg-[#0F5F5C] flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-white text-[18px]">person</span></div><span class="hidden lg:inline font-label-md text-label-md">Log In</span></a></div></div></header><main class="w-full pt-20 bg-[#FAF7F2] min-h-[calc(100vh-80px)]"><div class="flex flex-col w-full">
<div class="relative w-full overflow-hidden bg-[#FAF7F2] py-space-xl border-b border-[#E8E2D8]">
<div class="max-w-[1280px] mx-auto px-margin md:px-margin-desktop relative z-10">
<div class="flex flex-wrap items-center justify-between gap-space-md mb-space-sm">
<div class="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-white border border-[#E8E2D8] text-on-surface">
<span class="material-symbols-outlined text-[#0F5F5C] text-[18px]" style="font-variation-settings: 'FILL' 1;">verified_user</span>
<span class="font-label-sm text-label-sm tracking-wide uppercase">Volunteer Network • Pune Circle</span>
</div>
<div class="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
<span class="inline-block w-2.5 h-2.5 rounded-full bg-[#0F5F5C]"></span>
<span>Neighbourhood Care Network [demo]</span>
</div>
</div>
<div class="max-w-3xl">
<h1 class="font-headline-lg text-headline-lg text-on-surface mb-space-xs tracking-tight">
          Volunteer Registration &amp; Neighbourhood Care Network
        </h1>
<p class="font-body-lg text-body-lg text-on-surface-variant">
          Join local care circles to assist elders with companionship, check-ins, and emergency support under partner NGO guidance.
        </p>
</div>
<div class="mt-space-lg grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
<div class="bg-white p-space-md rounded-xl border border-[#E8E2D8] shadow-sm flex items-center gap-space-sm">
<div class="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#0F5F5C] shrink-0">
<span class="material-symbols-outlined text-[24px]">policy</span>
</div>
<div>
<div class="font-headline-sm text-headline-sm text-on-surface leading-none">[demo]</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">NGO Vetting</div>
</div>
</div>
<div class="bg-white p-space-md rounded-xl border border-[#E8E2D8] shadow-sm flex items-center gap-space-sm">
<div class="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#0F5F5C] shrink-0">
<span class="material-symbols-outlined text-[24px]">support_agent</span>
</div>
<div>
<div class="font-headline-sm text-headline-sm text-on-surface leading-none">[demo]</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">Elderline Link</div>
</div>
</div>
<div class="bg-white p-space-md rounded-xl border border-[#E8E2D8] shadow-sm flex items-center gap-space-sm">
<div class="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#0F5F5C] shrink-0">
<span class="material-symbols-outlined text-[24px]">health_and_safety</span>
</div>
<div>
<div class="font-headline-sm text-headline-sm text-on-surface leading-none">[demo]</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">Civic Coverage</div>
</div>
</div>
<div class="bg-white p-space-md rounded-xl border border-[#E8E2D8] shadow-sm flex items-center gap-space-sm">
<div class="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#0F5F5C] shrink-0">
<span class="material-symbols-outlined text-[24px]">diversity_1</span>
</div>
<div>
<div class="font-headline-sm text-headline-sm text-on-surface leading-none">[demo]</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">Elders Guarded</div>
</div>
</div>
</div>
</div>
</div>
<div class="max-w-[1280px] mx-auto px-margin md:px-margin-desktop py-space-xl w-full">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
<div class="lg:col-span-7 flex flex-col gap-space-lg">
<form class="bg-white p-space-lg rounded-xl border border-[#E8E2D8] shadow-sm flex flex-col gap-space-lg" id="volunteer-reg-form" onsubmit="event.preventDefault(); triggerSubmitState();">
<div class="flex items-center justify-between pb-space-sm border-b border-[#E8E2D8]">
<div class="flex items-center gap-space-sm">
<span class="w-8 h-8 rounded-full bg-[#0F5F5C] text-white font-headline-sm text-headline-sm flex items-center justify-center text-[16px]">1</span>
<div>
<h2 class="font-headline-sm text-headline-sm text-on-surface">Volunteer Profile Form</h2>
<p class="font-label-sm text-label-sm text-on-surface-variant">Please submit authentic details as per your government ID</p>
</div>
</div>
<span class="text-[#0F5F5C] font-label-sm text-label-sm font-semibold flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">lock</span>
              Verified Portal
            </span>
</div>
<div class="flex flex-col gap-space-xs">
<label class="font-label-lg text-label-lg text-on-surface flex items-center gap-1" for="full-name">
              Full Name (पूरा नाम) <span class="text-error">*</span>
</label>
<div class="relative">
<input class="w-full h-[52px] px-space-md bg-white border border-[#E8E2D8] text-body-md font-body-md text-on-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5F5C] focus:border-transparent" id="full-name" name="full_name" placeholder="e.g. Suresh K." required="" type="text" value="Suresh K."/>
<span class="material-symbols-outlined absolute right-space-md top-1/2 -translate-y-1/2 text-outline text-[22px]">badge</span>
</div>
<p class="font-label-sm text-label-sm text-on-surface-variant">Enter full legal name matching government-issued ID.</p>
</div>
<div class="flex flex-col gap-space-xs">
<label class="font-label-lg text-label-lg text-on-surface flex items-center gap-1" for="phone-number">
              Phone Number (मोबाइल नंबर) <span class="text-error">*</span>
</label>
<div class="flex flex-col sm:flex-row items-stretch gap-space-xs">
<div class="relative flex-1">
<input class="w-full h-[52px] px-space-md bg-white border border-[#E8E2D8] text-body-md font-body-md text-on-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5F5C] focus:border-transparent" id="phone-number" name="phone" placeholder="+91 98220 XXXXX" required="" type="tel" value="+91 98220 84521"/>
<span class="material-symbols-outlined absolute right-space-md top-1/2 -translate-y-1/2 text-outline text-[22px]">smartphone</span>
</div>
<div class="h-[52px] px-space-md rounded-lg bg-[#FAF7F2] border border-[#E8E2D8] text-[#0F5F5C] flex items-center justify-center gap-space-xs shrink-0">
<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="font-label-md text-label-md font-bold">OTP Verified</span>
</div>
</div>
<p class="font-label-sm text-label-sm text-on-surface-variant">Linked to verified mobile number for emergency escalation and alerts.</p>
</div>
<div class="flex flex-col gap-space-xs">
<label class="font-label-lg text-label-lg text-on-surface flex items-center gap-1" for="colony-area">
              Residential Area / Colony (स्थानीय क्षेत्र) <span class="text-error">*</span>
</label>
<div class="relative">
<input class="w-full h-[52px] px-space-md bg-white border border-[#E8E2D8] text-body-md font-body-md text-on-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5F5C] focus:border-transparent" id="colony-area" name="residential_area" placeholder="Kothrud, Pune" required="" type="text" value="Kothrud, Pune"/>
<span class="material-symbols-outlined absolute right-space-md top-1/2 -translate-y-1/2 text-outline text-[22px]">home_pin</span>
</div>
<p class="font-label-sm text-label-sm text-on-surface-variant">You will only receive requests within your locality circle.</p>
</div>
<div class="flex flex-col gap-space-sm pt-space-xs">
<span class="font-label-lg text-label-lg text-on-surface flex items-center gap-1">
              Skills &amp; Availability Checkboxes (दक्षता और तत्परता) <span class="text-error">*</span>
</span>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
<label class="flex items-center gap-space-sm p-space-sm rounded-xl bg-white border border-[#E8E2D8] hover:border-[#0F5F5C] cursor-pointer transition-colors select-none">
<div class="relative w-6 h-6 flex items-center justify-center">
<input checked="" class="w-5 h-5 text-[#0F5F5C] accent-[#0F5F5C] rounded cursor-pointer border-[#E8E2D8]" name="skills" type="checkbox" value="first_aid"/>
</div>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface flex items-center gap-1">
<span class="material-symbols-outlined text-[18px] text-[#0F5F5C]">medical_services</span>
                    First Aid
                  </span>
<span class="font-label-sm text-label-sm text-on-surface-variant">CPR &amp; basic support</span>
</div>
</label>
<label class="flex items-center gap-space-sm p-space-sm rounded-xl bg-white border border-[#E8E2D8] hover:border-[#0F5F5C] cursor-pointer transition-colors select-none">
<div class="relative w-6 h-6 flex items-center justify-center">
<input class="w-5 h-5 text-[#0F5F5C] accent-[#0F5F5C] rounded cursor-pointer border-[#E8E2D8]" name="skills" type="checkbox" value="nursing"/>
</div>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface flex items-center gap-1">
<span class="material-symbols-outlined text-[18px] text-[#0F5F5C]">stethoscope</span>
                    Nursing
                  </span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Clinical care experience</span>
</div>
</label>
<label class="flex items-center gap-space-sm p-space-sm rounded-xl bg-white border border-[#E8E2D8] hover:border-[#0F5F5C] cursor-pointer transition-colors select-none">
<div class="relative w-6 h-6 flex items-center justify-center">
<input checked="" class="w-5 h-5 text-[#0F5F5C] accent-[#0F5F5C] rounded cursor-pointer border-[#E8E2D8]" name="skills" type="checkbox" value="driving"/>
</div>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface flex items-center gap-1">
<span class="material-symbols-outlined text-[18px] text-[#0F5F5C]">directions_car</span>
                    Driving
                  </span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Vehicle available for urgent trips</span>
</div>
</label>
<label class="flex items-center gap-space-sm p-space-sm rounded-xl bg-white border border-[#E8E2D8] hover:border-[#0F5F5C] cursor-pointer transition-colors select-none">
<div class="relative w-6 h-6 flex items-center justify-center">
<input checked="" class="w-5 h-5 text-[#0F5F5C] accent-[#0F5F5C] rounded cursor-pointer border-[#E8E2D8]" name="skills" type="checkbox" value="companionship"/>
</div>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface flex items-center gap-1">
<span class="material-symbols-outlined text-[18px] text-[#0F5F5C]">volunteer_activism</span>
                    Companionship
                  </span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Walks, conversations, check-ins</span>
</div>
</label>
</div>
</div>
<div class="flex flex-col gap-space-xs">
<label class="font-label-lg text-label-lg text-on-surface flex items-center gap-1" for="ngo-selection">
              Partner NGO Selection (सत्यापनकारी एनजीओ) <span class="text-error">*</span>
</label>
<div class="relative">
<select class="w-full h-[52px] px-space-md pr-10 bg-white border border-[#E8E2D8] text-body-md font-body-md text-on-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5F5C] focus:border-transparent appearance-none" id="ngo-selection" name="partner_ngo" required="">
<option selected="" value="partner_ngo">[Partner NGO]</option>
</select>
<span class="material-symbols-outlined absolute right-space-md top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[24px]">arrow_drop_down</span>
</div>
<p class="font-label-sm text-label-sm text-on-surface-variant">The designated partner NGO conducts verification and profile endorsement.</p>
</div>
<div class="flex flex-col gap-space-md pt-space-xs">
<div>
<span class="font-label-lg text-label-lg text-on-surface block mb-1">
                Document Upload Zone 1: Government ID <span class="text-error">*</span>
</span>
<div class="p-space-md rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex flex-col sm:flex-row items-center justify-between gap-space-md">
<div class="flex items-center gap-space-md w-full sm:w-auto">
<div class="w-12 h-12 rounded-lg bg-white border border-[#E8E2D8] text-[#0F5F5C] flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[28px]">picture_as_pdf</span>
</div>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface font-bold">Government_ID.pdf (Uploaded)</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">2.4 MB • Ready for review</span>
</div>
</div>
<div class="flex items-center gap-space-xs w-full sm:w-auto justify-end">
<button class="px-space-md py-1.5 rounded-lg bg-white border border-[#E8E2D8] hover:bg-[#FAF7F2] text-on-surface font-label-md text-label-md flex items-center gap-1 transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">visibility</span>
                    Preview
                  </button>
<button class="px-space-md py-1.5 rounded-lg bg-white border border-[#E8E2D8] hover:bg-[#FAF7F2] text-error font-label-md text-label-md flex items-center gap-1 transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">autorenew</span>
                    Replace
                  </button>
</div>
</div>
</div>
<div>
<span class="font-label-lg text-label-lg text-on-surface block mb-1">
                Document Upload Zone 2: Qualification or Experience Certificate
              </span>
<div class="p-space-lg rounded-xl bg-[#FAF7F2] border border-dashed border-[#E8E2D8] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white transition-colors">
<div class="w-12 h-12 rounded-full bg-white border border-[#E8E2D8] flex items-center justify-center text-[#0F5F5C] mb-space-xs">
<span class="material-symbols-outlined text-[28px]">cloud_upload</span>
</div>
<span class="font-label-md text-label-md text-on-surface font-bold">Drop your certificate here, or <span class="text-[#0F5F5C] underline">browse</span></span>
<span class="font-label-sm text-label-sm text-on-surface-variant mt-1">Accepts PDF, JPG, PNG up to 10MB</span>
</div>
</div>
</div>
<div class="pt-space-sm flex flex-col gap-space-sm">
<button class="w-full min-h-[48px] h-[48px] px-space-lg bg-[#0F5F5C] hover:bg-[#0c4e4b] text-white font-label-lg text-label-lg rounded-xl shadow-sm flex items-center justify-center gap-space-xs transition-all active:scale-[0.99]" type="submit">
<span class="material-symbols-outlined text-[22px]">assignment_turned_in</span>
              Submit Application for NGO Verification
            </button>
<p class="font-label-sm text-label-sm text-center text-on-surface-variant">
              By submitting, you agree to verification and code of ethics under Saathi Care Standards.
            </p>
</div>
</form>
</div>
<div class="lg:col-span-5 flex flex-col gap-space-lg">
<div class="bg-white p-space-lg rounded-xl border border-[#E8E2D8] shadow-sm flex flex-col gap-space-lg relative overflow-hidden">
<div class="absolute top-0 left-0 right-0 h-1 bg-[#0F5F5C]"></div>
<div class="flex items-start justify-between gap-space-sm">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-[#0F5F5C] font-bold uppercase tracking-wider">Live Tracker</span>
<h3 class="font-headline-sm text-headline-sm text-on-surface leading-tight mt-1">Application Status: Under Review</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant">Real-time status synced with partner verification desk</p>
</div>
<span class="px-space-sm py-1 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#834500] font-label-sm text-label-sm font-bold shrink-0 flex items-center gap-1">
<span class="w-2 h-2 rounded-full bg-[#834500]"></span>
              Reviewing
            </span>
</div>
<div class="p-space-md rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-between gap-space-md">
<div>
<span class="font-label-sm text-label-sm text-on-surface-variant block">Reference ID (संदर्भ संख्या)</span>
<span class="font-headline-sm text-headline-sm text-[#0F5F5C] tracking-wide">#VLT-2026-PN409</span>
</div>
<button class="h-9 px-space-sm rounded-lg bg-white border border-[#E8E2D8] hover:bg-[#FAF7F2] text-on-surface font-label-sm text-label-sm flex items-center gap-1 transition-colors" onclick="navigator.clipboard.writeText('#VLT-2026-PN409'); alert('Reference ID copied to clipboard');" type="button">
<span class="material-symbols-outlined text-[16px]">content_copy</span>
              Copy
            </button>
</div>
<div class="relative flex flex-col pl-4">
<div class="relative flex items-start gap-space-md pb-space-lg">
<div class="absolute left-4 top-8 bottom-0 w-0.5 bg-[#E8E2D8]"></div>
<div class="w-8 h-8 rounded-full bg-[#0F5F5C] text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">check</span>
</div>
<div class="flex flex-col">
<div class="flex items-center gap-space-xs">
<span class="font-label-lg text-label-lg text-on-surface font-bold">Step 1: Submitted</span>
<span class="px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#0F5F5C] font-label-sm text-label-sm font-semibold">Completed</span>
</div>
<p class="font-body-md text-body-md text-on-surface mt-1">
                  Form &amp; documents received on Oct 24
                </p>
<div class="mt-2 text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">schedule</span>
                  24 Oct 2026, 11:34 AM
                </div>
</div>
</div>
<div class="relative flex items-start gap-space-md pb-space-lg">
<div class="absolute left-4 top-8 bottom-0 w-0.5 bg-[#E8E2D8]"></div>
<div class="w-8 h-8 rounded-full bg-white border-2 border-[#0F5F5C] text-[#0F5F5C] flex items-center justify-center shrink-0 z-10 shadow-sm">
<span class="material-symbols-outlined text-[20px] animate-spin">sync</span>
</div>
<div class="flex flex-col">
<div class="flex items-center gap-space-xs">
<span class="font-label-lg text-label-lg text-on-surface font-bold">Step 2: NGO Review &amp; Interview</span>
<span class="px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#834500] font-label-sm text-label-sm font-semibold">In Progress</span>
</div>
<p class="font-body-md text-body-md text-on-surface mt-1">
                  [Partner NGO] verification officer reviewing credentials
                </p>
<div class="mt-2 p-space-sm rounded-lg bg-[#FAF7F2] border border-[#E8E2D8] flex items-center gap-space-sm">
<div class="w-8 h-8 rounded-full bg-[#0F5F5C] text-white flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[18px]">person_check</span>
</div>
<div>
<span class="font-label-sm text-label-sm text-on-surface font-bold block">[Partner NGO] Verification Team</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Scheduled Telephonic Screening</span>
</div>
</div>
</div>
</div>
<div class="relative flex items-start gap-space-md">
<div class="w-8 h-8 rounded-full bg-white border border-[#E8E2D8] text-outline flex items-center justify-center shrink-0 z-10">
<span class="material-symbols-outlined text-[20px]">verified</span>
</div>
<div class="flex flex-col">
<div class="flex items-center gap-space-xs">
<span class="font-label-lg text-label-lg text-outline font-bold">Step 3: Admin Approval &amp; Activation</span>
<span class="px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-outline font-label-sm text-label-sm">Upcoming</span>
</div>
<p class="font-body-md text-body-md text-outline mt-1">
                  Pending final admin clearance and badge issuance
                </p>
<span class="font-label-sm text-label-sm text-outline mt-1">
                  Caregiver status activated upon approval
                </span>
</div>
</div>
</div>
<div class="p-space-md rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-start gap-space-sm">
<span class="material-symbols-outlined text-[#0F5F5C] text-[24px] shrink-0 mt-0.5">sms</span>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface font-bold">SMS &amp; WhatsApp Notifications</span>
<p class="font-body-md text-body-md text-on-surface-variant mt-1">
                You will receive updates during the process. Average turnaround: <strong class="text-on-surface">48-72 hours [demo]</strong>.
              </p>
</div>
</div>
<div class="pt-space-xs flex flex-col gap-space-xs">
<a class="w-full h-11 px-space-md rounded-lg bg-white border border-[#E8E2D8] hover:bg-[#FAF7F2] text-[#0F5F5C] font-label-md text-label-md flex items-center justify-center gap-space-xs transition-colors" href="tel:14567">
<span class="material-symbols-outlined text-[20px]">support</span>
              Contact Elderline 14567 (Govt. of India)
            </a>
</div>
</div>
<div class="bg-white p-space-lg rounded-xl border border-[#E8E2D8] shadow-sm flex flex-col gap-space-md">
<div class="flex items-center gap-space-sm">
<span class="material-symbols-outlined text-[#0F5F5C] text-[24px]">verified</span>
<h4 class="font-headline-sm text-headline-sm text-on-surface">What to Expect During Verification</h4>
</div>
<ul class="flex flex-col gap-space-sm font-body-md text-body-md text-on-surface-variant">
<li class="flex items-start gap-space-xs">
<span class="material-symbols-outlined text-[#0F5F5C] text-[20px] shrink-0 mt-1">call</span>
<span><strong>10-min Intro Call:</strong> Understanding your preferred days, emergency mobility, and senior handling comfort.</span>
</li>
<li class="flex items-start gap-space-xs">
<span class="material-symbols-outlined text-[#0F5F5C] text-[20px] shrink-0 mt-1">home</span>
<span><strong>Neighbourhood Anchor Check:</strong> Society or neighbourhood verification.</span>
</li>
<li class="flex items-start gap-space-xs">
<span class="material-symbols-outlined text-[#0F5F5C] text-[20px] shrink-0 mt-1">badge</span>
<span><strong>Care Circle Pass:</strong> Digital volunteer verification pass issued upon completion.</span>
</li>
</ul>
</div>
</div>
</div>
</div>
<div class="w-full bg-[#FAF7F2] py-space-xl border-t border-[#E8E2D8]">
<div class="max-w-[1280px] mx-auto px-margin md:px-margin-desktop">
<div class="flex flex-col md:flex-row items-center justify-between gap-space-lg bg-white p-space-lg rounded-xl border border-[#E8E2D8] shadow-sm">
<div class="flex items-center gap-space-md">
<div class="w-14 h-14 rounded-2xl bg-[#0F5F5C] flex items-center justify-center text-white shrink-0">
<span class="material-symbols-outlined text-[32px]">shield</span>
</div>
<div>
<h3 class="font-headline-sm text-headline-sm text-on-surface">Volunteer Protection &amp; Ethics Charter</h3>
<p class="font-body-md text-body-md text-on-surface-variant">All volunteers operate under senior safety guidelines and institutional partner protocols.</p>
</div>
</div>
<div class="flex items-center gap-space-sm shrink-0">
<a class="px-space-md py-2.5 rounded-xl bg-white border border-[#E8E2D8] hover:bg-[#FAF7F2] text-on-surface font-label-md text-label-md transition-colors" href="#">
            Read Charter
          </a>
<a class="px-space-md py-2.5 rounded-xl bg-[#0F5F5C] text-white font-label-md text-label-md shadow-sm hover:bg-[#0c4e4b] transition-colors" href="#">
            Volunteer FAQ
          </a>
</div>
</div>
</div>
</div>
<script>
    function triggerSubmitState() {
      const btn = document.querySelector('#volunteer-reg-form button[type="submit"]');
      if (!btn) return;
      btn.innerHTML = '<span class="material-symbols-outlined text-[22px] animate-spin">refresh</span> Submitting Application...';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = '<span class="material-symbols-outlined text-[22px]" style="font-variation-settings: \'FILL\' 1;">check_circle</span> Application Lodged (#VLT-2026-PN409)';
        btn.classList.remove('bg-[#0F5F5C]');
        btn.classList.add('bg-[#2d5e56]');
      }, 1200);
    }
  </script>
</div></main><footer class="w-full bg-[#FAF7F2] border-t border-[#E8E2D8]"><div class="max-w-[1280px] mx-auto px-margin md:px-margin-desktop py-space-xl flex flex-col md:flex-row items-center justify-between gap-space-lg"><div class="flex flex-col sm:flex-row items-center gap-space-md text-center sm:text-left"><div class="w-12 h-12 rounded-full bg-white border border-[#E8E2D8] text-error flex items-center justify-center shrink-0 shadow-sm"><span class="material-symbols-outlined text-[28px]">emergency</span></div><div><p class="font-label-lg text-label-lg text-on-surface font-bold">Elderline 14567 (Govt. of India)</p><p class="font-label-sm text-label-sm text-on-surface-variant">Ministry of Social Justice &amp; Empowerment, Govt. of India Toll-Free Support</p></div></div><div class="flex flex-col sm:flex-row items-center gap-space-lg text-center sm:text-right"><div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant"><span class="font-semibold text-on-surface">Languages:</span><button class="hover:text-[#0F5F5C] text-[#0F5F5C] font-semibold transition-colors" type="button">English</button><span>•</span><button class="hover:text-[#0F5F5C] transition-colors" type="button">हिंदी</button><span>•</span><button class="hover:text-[#0F5F5C] transition-colors" type="button">मराठी</button></div><div class="flex items-center gap-space-md font-label-sm text-label-sm text-on-surface-variant"><a class="hover:text-[#0F5F5C] transition-colors" data-path="privacy-policy" href="#">Privacy Policy</a><span>•</span><a class="hover:text-[#0F5F5C] transition-colors" data-path="terms-of-care" href="#">Terms of Care</a></div><p class="font-label-sm text-label-sm text-on-surface-variant">© 2026 Saathi Senior Community Care India.</p></div></div></footer>` }} />;
}
