import React from 'react';

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: `<!-- Header --><header class="w-full bg-[#FAF7F2] border-b border-[#E8E2D8] sticky top-0 z-50"><div class="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between"><div class="flex items-center gap-3"><div class="w-11 h-11 rounded-xl bg-[#0F5F5C] flex items-center justify-center text-white shadow-sm"><span class="material-symbols-outlined text-[26px]">handshake</span></div><div class="flex flex-col"><span class="font-bold text-2xl text-[#0F5F5C] leading-none tracking-tight">Saathi</span><span class="text-xs text-on-surface-variant font-medium mt-0.5">Senior Community Care India</span></div></div><div class="flex items-center gap-6"><div class="flex items-center gap-2 bg-[#F3EEE6] border border-[#E8E2D8] px-3 py-1.5 rounded-full text-xs font-semibold text-on-surface-variant"><button class="text-[#0F5F5C] font-bold transition-colors hover:opacity-80" type="button">English</button><span class="text-[#E8E2D8]">|</span><button class="hover:text-[#0F5F5C] transition-colors" type="button">हिंदी</button><span class="text-[#E8E2D8]">|</span><button class="hover:text-[#0F5F5C] transition-colors" type="button">मराठी</button></div><a class="flex items-center gap-2 text-sm font-bold text-[#0F5F5C] hover:text-[#0a4442] transition-colors" data-path="login" href="#"><div class="w-8 h-8 rounded-full bg-[#0F5F5C]/10 flex items-center justify-center text-[#0F5F5C]"><span class="material-symbols-outlined text-[20px]">person</span></div><span>Log in</span></a></div></div></header><!-- Main Content --><main class="w-full flex-grow py-12 md:py-16 bg-[#FAF7F2]"><div class="max-w-6xl mx-auto px-6"><div class="text-center max-w-2xl mx-auto mb-12"><h1 class="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-3">
        How would you like to join Saathi?
      </h1>
<p class="text-lg text-on-surface-variant">
        Select your role to access dedicated tools and support designed for senior dignity and community care.
      </p>
</div>
<!-- 3 Large Prominent Cards -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-12">
<!-- Card 1: Care home / NGO admin -->
<div class="flex flex-col justify-between p-8 bg-white rounded-[14px] border border-[#E8E2D8] shadow-sm hover:shadow-md transition-shadow">
<div>
<div class="w-14 h-14 rounded-xl bg-[#0F5F5C]/10 text-[#0F5F5C] flex items-center justify-center mb-6">
<span class="material-symbols-outlined text-[32px]">corporate_fare</span>
</div>
<h2 class="text-2xl font-bold text-on-surface mb-3">
            Care home / NGO admin
          </h2>
<p class="text-base text-on-surface-variant leading-relaxed mb-8">
            Manage residents, medicine tracking, floor staff and volunteer escalation
          </p>
</div>
<a class="w-full h-12 min-h-[48px] px-6 rounded-xl bg-[#0F5F5C] hover:bg-[#0a4442] active:bg-[#083533] text-white font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-sm" data-path="admin-dashboard" href="#">
<span>Continue</span>
<span class="material-symbols-outlined text-[20px]">arrow_forward</span>
</a>
</div>
<!-- Card 2: Family member -->
<div class="flex flex-col justify-between p-8 bg-white rounded-[14px] border border-[#E8E2D8] shadow-sm hover:shadow-md transition-shadow">
<div>
<div class="w-14 h-14 rounded-xl bg-[#0F5F5C]/10 text-[#0F5F5C] flex items-center justify-center mb-6">
<span class="material-symbols-outlined text-[32px]">family_restroom</span>
</div>
<h2 class="text-2xl font-bold text-on-surface mb-3">
            Family member
          </h2>
<p class="text-base text-on-surface-variant leading-relaxed mb-8">
            Track your parent's daily care, medicine compliance, vitals and alerts
          </p>
</div>
<a class="w-full h-12 min-h-[48px] px-6 rounded-xl bg-[#0F5F5C] hover:bg-[#0a4442] active:bg-[#083533] text-white font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-sm" data-path="family-dashboard" href="#">
<span>Continue</span>
<span class="material-symbols-outlined text-[20px]">arrow_forward</span>
</a>
</div>
<!-- Card 3: Volunteer -->
<div class="flex flex-col justify-between p-8 bg-white rounded-[14px] border border-[#E8E2D8] shadow-sm hover:shadow-md transition-shadow">
<div>
<div class="w-14 h-14 rounded-xl bg-[#0F5F5C]/10 text-[#0F5F5C] flex items-center justify-center mb-6">
<span class="material-symbols-outlined text-[32px]">volunteer_activism</span>
</div>
<h2 class="text-2xl font-bold text-on-surface mb-3">
            Volunteer
          </h2>
<p class="text-base text-on-surface-variant leading-relaxed mb-8">
            Offer local companionship, wellness visits and emergency support after NGO vetting
          </p>
</div>
<a class="w-full h-12 min-h-[48px] px-6 rounded-xl bg-[#0F5F5C] hover:bg-[#0a4442] active:bg-[#083533] text-white font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-sm" data-path="volunteer-dashboard" href="#">
<span>Continue</span>
<span class="material-symbols-outlined text-[20px]">arrow_forward</span>
</a>
</div>
</div>
<!-- Bottom Link -->
<div class="text-center pt-2">
<p class="text-base text-on-surface-variant">
        Already have an account? 
        <a class="text-[#0F5F5C] font-bold hover:underline ml-1" data-path="login" href="#">Log in</a>
</p>
</div>
</div>
</main><!-- Footer --><footer class="w-full bg-[#F3EEE6] border-t border-[#E8E2D8] py-8"><div class="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[22px]">phone_in_talk</span></div><div><p class="text-base font-bold text-on-surface">Elderline 14567 (Govt. of India)</p><p class="text-xs text-on-surface-variant">National toll-free helpline for senior citizens</p></div></div><p class="text-xs text-on-surface-variant">© 2026 Saathi Senior Community Care India</p></div></footer>` }} />;
}
