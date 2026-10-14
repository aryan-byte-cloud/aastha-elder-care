"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth, UserRole } from "@/context/AuthContext";

function getFriendlyAuthErrorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null && "code" in err) {
    const code = (err as { code: string }).code;
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
      case "auth/invalid-login-credentials":
        return "Incorrect email or password. Please try again.";
      case "auth/email-already-in-use":
        return "This email is already registered. Please log in instead.";
      case "auth/weak-password":
        return "Password is too weak. Please use at least 6 characters.";
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please wait a moment and try again.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      default:
        return (err as { message?: string }).message || "Authentication failed. Please try again.";
    }
  }
  return err instanceof Error ? err.message : "An unexpected error occurred.";
}

// 3 Fixed Demo Accounts
const DEMO_ACCOUNTS = [
  {
    email: "priya@saathi.demo",
    role: "family" as UserRole,
    name: "Priya Deshmukh",
    phone: "+91 90000 00002 (demo)",
    label: "Demo: Family",
    subLabel: "Priya Deshmukh (daughter)",
    icon: "family_restroom",
  },
  {
    email: "admin@saathi.demo",
    role: "admin" as UserRole,
    name: "Sukoon Home Admin",
    phone: "+91 90000 00001 (demo)",
    label: "Demo: Admin",
    subLabel: "Sukoon Home Admin",
    icon: "corporate_fare",
  },
  {
    email: "suresh@saathi.demo",
    role: "volunteer" as UserRole,
    name: "Suresh K.",
    phone: "+91 90000 00003 (demo)",
    label: "Demo: Volunteer",
    subLabel: "Suresh K. (volunteer)",
    icon: "volunteer_activism",
  },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, role: userRole, loading: authLoading, refreshProfile, authError } = useAuth();

  // Mode: 'login' | 'signup'
  const [mode, setMode] = useState<"login" | "signup">("login");

  // Sync authError into login error message
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // Public sign-up is strictly restricted to 'family' or 'volunteer'
  const [signupRole, setSignupRole] = useState<"family" | "volunteer">("family");
  const [roleDrawerOpen, setRoleDrawerOpen] = useState(false);
  const [approvedOrgs, setApprovedOrgs] = useState<{ id: string; name: string }[]>([]);
  const [volunteerOrgId, setVolunteerOrgId] = useState<string>("sukoon-home");

  useEffect(() => {
    const qOrgs = query(collection(db, "organizations"), where("status", "==", "approved"));
    const unsub = onSnapshot(qOrgs, (snap) => {
      const list: { id: string; name: string }[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({ id: d.id, name: data.name || d.id });
      });
      if (list.length === 0) {
        list.push({ id: "sukoon-home", name: "Sukoon Home" });
      }
      setApprovedOrgs(list);
      setVolunteerOrgId((curr) => {
        if (list.some((o) => o.id === curr)) return curr;
        return list[0]?.id || "sukoon-home";
      });
    });
    return () => unsub();
  }, []);

  // Read URL query parameter: ?role=admin|family|volunteer
  // Use ?role= ONLY to pre-select the sign-up role (admin is never self-registered)
  useEffect(() => {
    const roleParam = searchParams.get("role")?.toLowerCase();
    if (roleParam === "volunteer") {
      setSignupRole("volunteer");
    } else {
      setSignupRole("family");
    }
  }, [searchParams]);

  // If already logged in, redirect by role immediately
  useEffect(() => {
    if (!authLoading && user && userRole) {
      if (userRole === "platform_admin") {
        router.replace("/platform");
      } else if (userRole === "admin") {
        if (profile?.orgStatus && profile.orgStatus !== "approved") {
          router.replace("/pending");
        } else {
          router.replace("/admin");
        }
      } else if (userRole === "volunteer") {
        router.replace("/volunteer");
      } else {
        router.replace("/family");
      }
    }
  }, [user, userRole, profile, authLoading, router]);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // UI status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const redirectByRole = (targetRole: UserRole, targetOrgStatus?: string) => {
    if (targetRole === "platform_admin") {
      router.push("/platform");
    } else if (targetRole === "admin") {
      if (targetOrgStatus && targetOrgStatus !== "approved") {
        router.push("/pending");
      } else {
        router.push("/admin");
      }
    } else if (targetRole === "volunteer") {
      router.push("/volunteer");
    } else {
      router.push("/family");
    }
  };

  // 1-Click Demo Logins — Sign in directly without writing or overwriting roles
  const handleDemoLogin = async (demo: typeof DEMO_ACCOUNTS[0]) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "DemoPass123!";

    try {
      const userCredential = await signInWithEmailAndPassword(auth, demo.email, demoPassword);
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      let storedRole = demo.role;
      let orgStatus = "approved";
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        storedRole = (data.role || demo.role) as UserRole;
      }

      await refreshProfile();
      redirectByRole(storedRole, orgStatus);
    } catch (err: unknown) {
      setError(getFriendlyAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        if (!name.trim()) {
          setError("Please enter your full name.");
          setLoading(false);
          return;
        }

        // 1. Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);

        // 2. Role is written ONCE on account creation (admin cannot be self-registered)
        // Write users/{uid} immediately so profile exists when auth listeners trigger
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          role: signupRole,
          ...(signupRole === "volunteer" ? { orgId: volunteerOrgId, verified: false } : {}),
          createdAt: serverTimestamp(),
        });

        // 3. Update Firebase Auth display name
        await updateProfile(userCredential.user, { displayName: name.trim() });

        await refreshProfile();
        redirectByRole(signupRole);
      } else {
        // 1. Firebase Auth sign in
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);

        // 2. Login must NEVER write or overwrite the role in Firestore.
        // ONLY READ users/{uid} and redirect based on the stored role.
        const userDocRef = doc(db, "users", userCredential.user.uid);
        const userDocSnap = await getDoc(userDocRef);

        const VALID_ROLES: UserRole[] = ["admin", "family", "volunteer", "platform_admin"];
        const data = userDocSnap.data();
        const r = (data?.role as string)?.toLowerCase();

        if (!userDocSnap.exists() || !r || !VALID_ROLES.includes(r as UserRole)) {
          await signOut(auth);
          setError("Your account setup is incomplete – please contact support");
          setLoading(false);
          return;
        }

        const storedRole = (r === "platform_admin" ? "platform_admin" : r) as UserRole;
        const storedOrgId = data?.orgId || "sukoon-home";

        let orgStatus = "approved";
        if (storedRole === "admin" && storedOrgId !== "sukoon-home") {
          const orgSnap = await getDoc(doc(db, "organizations", storedOrgId));
          if (orgSnap.exists()) {
            orgStatus = orgSnap.data()?.status || "pending";
          } else {
            orgStatus = "pending";
          }
        }

        await refreshProfile();
        redirectByRole(storedRole, orgStatus);
      }
    } catch (err: unknown) {
      setError(getFriendlyAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const roleParam = searchParams.get("role")?.toLowerCase();

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto items-center">
      {/* Header / Back Home */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-semibold text-[#0F5F5C] hover:underline"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Home
        </Link>
        <a
          href="tel:14567"
          className="text-xs text-[#0F5F5C] font-bold hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">phone_in_talk</span>
          Elderline 14567 (Govt. of India)
        </a>
      </div>

      {/* Centered Auth Card */}
      <div className="w-full bg-white rounded-2xl shadow-sm border border-[#E8E2D8] overflow-hidden transition-all duration-300">
        {/* Brand Header */}
        <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-[#E8E2D8] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F5F5C] text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[24px]">favorite</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-[#0F5F5C] tracking-tight block">
                  Aastha <span className="text-base text-[#5A6563] font-normal">| आस्था</span>
                </span>
                <span className="text-xs text-[#5A6563] block">
                  Eldercare &amp; Community Circle
                </span>
              </div>
            </div>

            {/* In sign-up mode: show selected role with "Change role". In login mode: show portal indicator */}
            {mode === "signup" ? (
              <button
                onClick={() => setRoleDrawerOpen(!roleDrawerOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#0F5F5C] hover:bg-[#F3EEE6] transition-colors text-xs font-semibold cursor-pointer"
                title="Change role for registration"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {signupRole === "volunteer" ? "volunteer_activism" : "family_restroom"}
                </span>
                <span>Role: {signupRole === "volunteer" ? "Volunteer" : "Family"}</span>
                <span className="text-[#5A6563] font-normal ml-0.5">• Change role</span>
                <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563] text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px] text-[#0F5F5C]">lock</span>
                <span>Secure Sign In</span>
              </div>
            )}
          </div>

          {/* Role Switcher for Sign-up: Strictly Family or Volunteer (No Admin in public sign up) */}
          {mode === "signup" && roleDrawerOpen && (
            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D8] transition-all">
              <div className="text-xs font-bold text-[#5A6563] uppercase tracking-wider mb-2">
                Select registration type:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSignupRole("family");
                    setRoleDrawerOpen(false);
                  }}
                  className={`p-2.5 rounded-lg border transition flex flex-col items-center justify-center gap-1 text-center cursor-pointer ${
                    signupRole === "family"
                      ? "bg-[#0F5F5C] text-white border-[#0F5F5C]"
                      : "bg-white border-[#E8E2D8] hover:border-[#0F5F5C]"
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">family_restroom</span>
                  <span className="text-xs font-bold">Family Member</span>
                </button>
                <button
                  onClick={() => {
                    setSignupRole("volunteer");
                    setRoleDrawerOpen(false);
                  }}
                  className={`p-2.5 rounded-lg border transition flex flex-col items-center justify-center gap-1 text-center cursor-pointer ${
                    signupRole === "volunteer"
                      ? "bg-[#0F5F5C] text-white border-[#0F5F5C]"
                      : "bg-white border-[#E8E2D8] hover:border-[#0F5F5C]"
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
                  <span className="text-xs font-bold">Volunteer</span>
                </button>
              </div>
              <p className="text-[11px] text-[#5A6563] mt-2 text-center">
                Admin accounts are provisioned exclusively through NGO verification or the Demo console.
              </p>
            </div>
          )}

          {/* Note if ?role=admin was in the URL on the sign-up tab */}
          {mode === "signup" && roleParam === "admin" && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-xl text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-600">info</span>
              <span>Admin accounts cannot be self-registered. Use the <strong>Demo: Admin</strong> button below or contact the Sukoon Home administrator.</span>
            </div>
          )}
        </div>

        {/* Navigation Tabs (Log in and Sign up) */}
        <div className="px-6 sm:px-8 pt-6">
          <div className="grid grid-cols-2 bg-[#FAF7F2] p-1 rounded-xl border border-[#E8E2D8]">
            <button
              onClick={() => {
                setMode("login");
                setError(null);
                setSuccess(null);
              }}
              className={`h-11 rounded-lg font-bold text-sm transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                mode === "login"
                  ? "bg-white text-[#0F5F5C] shadow-sm"
                  : "text-[#5A6563] hover:text-[#1C2826]"
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>Log in</span>
            </button>
            <button
              onClick={() => {
                setMode("signup");
                setError(null);
                setSuccess(null);
              }}
              className={`h-11 rounded-lg font-bold text-sm transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                mode === "signup"
                  ? "bg-white text-[#0F5F5C] shadow-sm"
                  : "text-[#5A6563] hover:text-[#1C2826]"
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Sign up</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 pt-6">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1C2826] tracking-tight">
              {mode === "login"
                ? "Welcome back to Aastha"
                : signupRole === "volunteer"
                ? "Sign up as a Volunteer"
                : "Sign up as a Family Member"}
            </h1>
            <p className="text-sm text-[#5A6563] mt-1">
              {mode === "login"
                ? "Enter your credentials to access your dashboard. Your role is loaded automatically."
                : signupRole === "volunteer"
                ? "Join the neighborhood care circle. Volunteer accounts are activated upon verification."
                : "Monitor care routines, daily assurance calls, and check-ins for your parent."}
            </p>
          </div>

          {/* Error & Success Banners */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-red-600 shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-emerald-600 shrink-0">check_circle</span>
              <span>{success}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <>
                {/* Full Name */}
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-semibold text-[#1C2826]" htmlFor="name-input">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Deshmukh"
                    required
                    className="w-full h-[50px] px-4 rounded-xl bg-white text-[#1C2826] border border-[#E8E2D8] text-base focus:outline-none focus:border-[#0F5F5C] focus:ring-1 focus:ring-[#0F5F5C] transition-colors"
                  />
                </div>

                {/* Mobile Number */}
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-semibold text-[#1C2826]" htmlFor="phone-input">
                    Mobile Number
                  </label>
                  <input
                    id="phone-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full h-[50px] px-4 rounded-xl bg-white text-[#1C2826] border border-[#E8E2D8] text-base focus:outline-none focus:border-[#0F5F5C] focus:ring-1 focus:ring-[#0F5F5C] transition-colors"
                  />
                </div>

                {/* Partner NGO Selection for Volunteers */}
                {signupRole === "volunteer" && (
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-semibold text-[#1C2826]" htmlFor="login-ngo-select">
                      Partner Care Organisation / NGO <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="login-ngo-select"
                      value={volunteerOrgId}
                      onChange={(e) => setVolunteerOrgId(e.target.value)}
                      className="w-full h-[50px] px-4 rounded-xl bg-white text-[#1C2826] border border-[#E8E2D8] text-base focus:outline-none focus:border-[#0F5F5C] focus:ring-1 focus:ring-[#0F5F5C] transition-colors"
                    >
                      {approvedOrgs.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Email */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-semibold text-[#1C2826] flex items-center justify-between" htmlFor="email-input">
                <span>Email address <span className="text-red-600">*</span></span>
                <span className="text-xs text-[#5A6563] font-normal">ईमेल</span>
              </label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@example.com"
                required
                className="w-full h-[50px] px-4 rounded-xl bg-white text-[#1C2826] border border-[#E8E2D8] text-base focus:outline-none focus:border-[#0F5F5C] focus:ring-1 focus:ring-[#0F5F5C] transition-colors"
              />
            </div>

            {/* Password (min 6 chars) */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-semibold text-[#1C2826] flex items-center justify-between" htmlFor="password-input">
                <span>Password (min 6 characters) <span className="text-red-600">*</span></span>
                <span className="text-xs text-[#5A6563] font-normal">पासवर्ड</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full h-[50px] pl-4 pr-12 rounded-xl bg-white text-[#1C2826] border border-[#E8E2D8] text-base focus:outline-none focus:border-[#0F5F5C] focus:ring-1 focus:ring-[#0F5F5C] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 h-10 w-10 rounded-lg flex items-center justify-center text-[#5A6563] hover:text-[#0F5F5C] transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white font-bold text-base active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {mode === "login" ? "login" : "how_to_reg"}
                </span>
                <span>{loading ? "Processing..." : mode === "login" ? "Log in" : "Create Account"}</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Logins Section with 3 Buttons labeled "Demo" */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-[#E8E2D8]"></div>
            <span className="absolute bg-white px-3 text-xs uppercase tracking-wider text-[#5A6563] font-bold">
              1-Click Demo Logins
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((demo) => (
              <button
                key={demo.email}
                type="button"
                disabled={loading}
                onClick={() => handleDemoLogin(demo)}
                className="px-3 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] hover:bg-[#F3EEE6] text-left transition text-xs flex flex-col gap-0.5 cursor-pointer disabled:opacity-60"
              >
                <div className="flex items-center gap-1 text-[#0F5F5C] font-bold">
                  <span className="material-symbols-outlined text-[16px]">{demo.icon}</span>
                  <span>{demo.label}</span>
                </div>
                <span className="text-[11px] text-[#5A6563] truncate">{demo.subLabel}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Header />
      <main className="w-full flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8 pt-28 bg-[#FAF7F2]">
        <Suspense fallback={<div className="text-sm font-semibold text-[#5A6563]">Loading Aastha portal...</div>}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
