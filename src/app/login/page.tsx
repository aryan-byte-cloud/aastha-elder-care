import React from 'react';

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: `<main class="w-full flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8"><div class="flex flex-col w-full max-w-xl mx-auto items-center">
<!-- Centered Auth Container -->
<div class="w-full bg-[#FFFFFF] rounded-2xl shadow-sm border border-[#E8E2D8] overflow-hidden transition-all duration-300">
<!-- Header with Brand Logo & Role Badge -->
<div class="px-6 sm:px-8 pt-7 pb-5 border-b border-[#E8E2D8] flex flex-col gap-4">
<div class="flex items-center justify-between">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-xl bg-[#0F5F5C] text-white flex items-center justify-center shadow-sm">
<span class="material-symbols-outlined text-[24px]">favorite</span>
</div>
<div>
<span class="font-headline-sm text-2xl font-bold text-[#0F5F5C] tracking-tight block">Saathi <span class="text-base text-secondary font-normal">| साथी</span></span>
<span class="font-label-sm text-xs text-on-surface-variant block">Eldercare &amp; Family Circle</span>
</div>
</div>
<!-- Role Badge with Switch Option -->
<button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#0F5F5C] hover:bg-[#EFE9DF] transition-colors text-xs font-semibold cursor-pointer" id="change-role-btn" title="Switch role" type="button">
<span class="material-symbols-outlined text-[16px]">groups</span>
<span id="role-display">Role: Family</span>
<span class="material-symbols-outlined text-[14px]">swap_horiz</span>
</button>
</div>
<!-- Collapsible Role Switcher Tray -->
<div class="hidden bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D8] transition-all" id="role-picker-drawer">
<div class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Select your role:</div>
<div class="grid grid-cols-3 gap-2">
<button class="role-option p-2 rounded-lg bg-white border border-[#E8E2D8] hover:border-[#0F5F5C] hover:bg-[#F2EFE8] transition flex flex-col items-center justify-center gap-1 text-center cursor-pointer" onclick="selectRole('Family', 'groups')" type="button">
<span class="material-symbols-outlined text-[#0F5F5C] text-[20px]">groups</span>
<span class="text-xs font-bold text-on-surface">Family</span>
</button>
<button class="role-option p-2 rounded-lg bg-white border border-[#E8E2D8] hover:border-[#0F5F5C] hover:bg-[#F2EFE8] transition flex flex-col items-center justify-center gap-1 text-center cursor-pointer" onclick="selectRole('Care home', 'home_health')" type="button">
<span class="material-symbols-outlined text-[#0F5F5C] text-[20px]">home_health</span>
<span class="text-xs font-bold text-on-surface">Care home</span>
</button>
<button class="role-option p-2 rounded-lg bg-white border border-[#E8E2D8] hover:border-[#0F5F5C] hover:bg-[#F2EFE8] transition flex flex-col items-center justify-center gap-1 text-center cursor-pointer" onclick="selectRole('Volunteer', 'volunteer_activism')" type="button">
<span class="material-symbols-outlined text-[#0F5F5C] text-[20px]">volunteer_activism</span>
<span class="text-xs font-bold text-on-surface">Volunteer</span>
</button>
</div>
</div>
</div>
<!-- Navigation Tabs (Log in and Sign up) -->
<div class="px-6 sm:px-8 pt-6">
<div class="grid grid-cols-2 bg-[#FAF7F2] p-1 rounded-xl border border-[#E8E2D8]">
<button class="h-11 rounded-lg font-bold text-sm transition-all text-center bg-white text-[#0F5F5C] shadow-sm flex items-center justify-center gap-2 cursor-pointer" id="tab-login" type="button">
<span class="material-symbols-outlined text-[18px]">login</span>
<span>Log in</span>
</button>
<button class="h-11 rounded-lg font-bold text-sm transition-all text-center text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-2 cursor-pointer" id="tab-signup" type="button">
<span class="material-symbols-outlined text-[18px]">person_add</span>
<span>Sign up</span>
</button>
</div>
</div>
<!-- Form Body -->
<div class="p-6 sm:p-8 pt-6">
<div class="mb-6">
<h1 class="text-xl sm:text-2xl font-bold text-on-surface tracking-tight" id="form-heading">Welcome back to Saathi</h1>
<p class="text-sm text-on-surface-variant mt-1" id="form-subheading">Sign in to coordinate care routines and check-ins.</p>
</div>
<form class="space-y-5" id="auth-form" onsubmit="event.preventDefault();">
<!-- Email / Mobile number input -->
<div class="flex flex-col space-y-1.5">
<label class="text-sm font-semibold text-on-surface flex items-center justify-between" for="identifier-input">
<span>Email / Mobile number</span>
<span class="text-xs text-on-surface-variant font-normal">ईमेल / मोबाइल नंबर</span>
</label>
<div class="relative">
<input autocomplete="username" class="w-full h-[52px] px-4 rounded-xl bg-white text-on-surface border border-[#E8E2D8] text-base placeholder:text-outline focus:outline-none focus:border-[#0F5F5C] focus:ring-1 focus:ring-[#0F5F5C] transition-colors" id="identifier-input" placeholder="e.g. name@example.com or +91 98765 43210" required="" type="text"/>
</div>
</div>
<!-- Password input with toggle show/hide -->
<div class="flex flex-col space-y-1.5">
<label class="text-sm font-semibold text-on-surface flex items-center justify-between" for="password-input">
<span>Password</span>
<span class="text-xs text-on-surface-variant font-normal">पासवर्ड</span>
</label>
<div class="relative flex items-center">
<input autocomplete="current-password" class="w-full h-[52px] pl-4 pr-12 rounded-xl bg-white text-on-surface border border-[#E8E2D8] text-base placeholder:text-outline focus:outline-none focus:border-[#0F5F5C] focus:ring-1 focus:ring-[#0F5F5C] transition-colors" id="password-input" placeholder="Enter your password" required="" type="password"/>
<button aria-label="Toggle password visibility" class="absolute right-2 h-10 w-10 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-[#0F5F5C] transition-colors focus:outline-none cursor-pointer" id="toggle-password" type="button">
<span class="material-symbols-outlined text-[20px]" id="password-icon">visibility</span>
</button>
</div>
</div>
<!-- Remember me and Forgot password? -->
<div class="flex items-center justify-between pt-1">
<label class="inline-flex items-center gap-2.5 cursor-pointer select-none">
<input checked="" class="rounded border-[#E8E2D8] text-[#0F5F5C] focus:ring-[#0F5F5C] w-4 h-4 cursor-pointer" id="remember-me" type="checkbox"/>
<span class="text-sm text-on-surface font-medium">Remember me</span>
</label>
<a class="text-sm text-[#0F5F5C] hover:underline font-semibold" href="#forgot">
          Forgot password?
        </a>
</div>
<!-- Primary 52px button: Log in in deep teal #0F5F5C -->
<div class="pt-2">
<button class="w-full h-[52px] rounded-xl bg-[#0F5F5C] text-white font-bold text-base hover:bg-[#0c4e4b] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer" id="submit-btn" type="submit">
<span class="material-symbols-outlined text-[20px]">login</span>
<span id="submit-text">Log in</span>
</button>
</div>
</form>
<!-- Visual divider -->
<div class="relative my-6 flex items-center justify-center">
<div class="w-full border-t border-[#E8E2D8]"></div>
<span class="absolute bg-white px-3 text-xs uppercase tracking-wider text-on-surface-variant">
        Or
      </span>
</div>
<!-- Secondary button: Get OTP on registered mobile -->
<div>
<button class="w-full h-[52px] rounded-xl bg-[#FAF7F2] text-[#0F5F5C] border border-[#E8E2D8] hover:bg-[#F2EFE8] active:scale-[0.99] font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 cursor-pointer" id="otp-btn" type="button">
<span class="material-symbols-outlined text-[20px]">sms</span>
<span>Get OTP on registered mobile</span>
</button>
</div>
</div>
</div>
<!-- Language Switcher Utility -->
<div class="mt-4 flex items-center gap-2 text-xs text-on-surface-variant">
<span class="flex items-center gap-1"><span class="material-symbols-outlined text-[15px]">translate</span> Language:</span>
<button class="px-2.5 py-1 rounded-full bg-[#0F5F5C] text-white font-semibold cursor-pointer" type="button">English</button>
<button class="px-2.5 py-1 rounded-full bg-white border border-[#E8E2D8] hover:bg-[#EFE9DF] text-on-surface transition cursor-pointer" type="button">हिंदी</button>
<button class="px-2.5 py-1 rounded-full bg-white border border-[#E8E2D8] hover:bg-[#EFE9DF] text-on-surface transition cursor-pointer" type="button">मराठी</button>
</div>
</div></main>
<!-- Footer note: Emergency support Elderline 14567 -->
<footer class="w-full py-4 px-6 border-t border-[#E8E2D8] bg-[#FAF7F2] text-center">
<p class="text-xs sm:text-sm text-on-surface-variant flex items-center justify-center gap-1.5 flex-wrap">
<span class="material-symbols-outlined text-[#0F5F5C] text-[18px]">support_agent</span>
<span>Need emergency support? Call Elderline <strong class="text-[#0F5F5C]">14567</strong> (Govt. of India)</span>
<span class="text-outline mx-1">•</span>
<span>English / हिंदी / मराठी</span>
</p>
</footer>
<script>
  // Password Visibility Toggle
  const togglePassBtn = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password-input');
  const passwordIcon = document.getElementById('password-icon');

  if (togglePassBtn && passwordInput && passwordIcon) {
    togglePassBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      passwordIcon.textContent = isPassword ? 'visibility_off' : 'visibility';
    });
  }

  // Role Drawer Toggle
  const changeRoleBtn = document.getElementById('change-role-btn');
  const rolePickerDrawer = document.getElementById('role-picker-drawer');
  const roleDisplay = document.getElementById('role-display');

  if (changeRoleBtn && rolePickerDrawer) {
    changeRoleBtn.addEventListener('click', () => {
      rolePickerDrawer.classList.toggle('hidden');
    });
  }

  function selectRole(roleName) {
    if (roleDisplay) {
      roleDisplay.textContent = 'Role: ' + roleName;
    }
    if (rolePickerDrawer) {
      rolePickerDrawer.classList.add('hidden');
    }
  }

  // Tab Switching (Log in vs Sign up)
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const formHeading = document.getElementById('form-heading');
  const formSubheading = document.getElementById('form-subheading');
  const submitText = document.getElementById('submit-text');

  if (tabLogin && tabSignup && formHeading && formSubheading && submitText) {
    tabSignup.addEventListener('click', () => {
      tabSignup.classList.add('bg-white', 'text-[#0F5F5C]', 'shadow-sm');
      tabSignup.classList.remove('text-on-surface-variant');
      tabLogin.classList.remove('bg-white', 'text-[#0F5F5C]', 'shadow-sm');
      tabLogin.classList.add('text-on-surface-variant');

      formHeading.textContent = 'Create your Saathi Account';
      formSubheading.textContent = 'Sign up to coordinate care routines and check-ins.';
      submitText.textContent = 'Sign up';
    });

    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('bg-white', 'text-[#0F5F5C]', 'shadow-sm');
      tabLogin.classList.remove('text-on-surface-variant');
      tabSignup.classList.remove('bg-white', 'text-[#0F5F5C]', 'shadow-sm');
      tabSignup.classList.add('text-on-surface-variant');

      formHeading.textContent = 'Welcome back to Saathi';
      formSubheading.textContent = 'Sign in to coordinate care routines and check-ins.';
      submitText.textContent = 'Log in';
    });
  }

  // OTP button micro-feedback
  const otpBtn = document.getElementById('otp-btn');
  if (otpBtn) {
    otpBtn.addEventListener('click', () => {
      const origText = otpBtn.innerHTML;
      otpBtn.innerHTML = '<span class="material-symbols-outlined text-[20px] animate-spin">sync</span><span>Sending OTP...</span>';
      setTimeout(() => {
        otpBtn.innerHTML = '<span class="material-symbols-outlined text-[20px] text-[#0F5F5C]">check</span><span>OTP sent! Check your SMS</span>';
        setTimeout(() => {
          otpBtn.innerHTML = origText;
        }, 3000);
      }, 800);
    });
  }
</script>` }} />;
}
