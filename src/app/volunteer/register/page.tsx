"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { registerVolunteerAction } from "@/actions/volunteer";

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from "firebase/firestore";

export default function VolunteerRegisterPage() {
  // Empty form fields - placeholders only, no prefilled data
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [approvedOrgs, setApprovedOrgs] = useState<{ id: string; name: string }[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("sukoon-home");

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
      setSelectedOrgId((curr) => {
        if (list.some((o) => o.id === curr)) return curr;
        return list[0]?.id || "sukoon-home";
      });
    });
    return () => unsub();
  }, []);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    fullName: string;
    phone: string;
    email: string;
    area: string;
    skills: string[];
    partnerNgo: string;
  } | null>(null);

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("locality", area);
    formData.append("skills", skills.join(", "));
    formData.append("availability", "Flexible - Weekends & Evenings");
    formData.append("idProofType", "Government ID");

    try {
      const chosenOrg = approvedOrgs.find((o) => o.id === selectedOrgId) || {
        id: "sukoon-home",
        name: "Sukoon Home",
      };

      // 1. Save directly to Firestore users collection with verified: false and selected orgId
      await addDoc(collection(db, "users"), {
        name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        area: area.trim(),
        skills: skills.join(", "),
        role: "volunteer",
        orgId: chosenOrg.id,
        verified: false,
        verificationStatus: "pending",
        createdAt: serverTimestamp(),
      });

      // 2. Also run action for backward-compatibility
      await registerVolunteerAction(formData);

      setSubmittedData({
        fullName,
        phone,
        email,
        area,
        skills,
        partnerNgo: chosenOrg.name,
      });
      setIsSubmitted(true);
    } catch {
      setErrorMsg("An unexpected error occurred while submitting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C2826] flex flex-col">
      {/* Shared Header */}
      <Header />

      <main className="w-full pt-28 pb-16 bg-[#FAF7F2] flex-grow flex items-center justify-center px-6">
        {/* SEPARATE STATUS VIEW AFTER SUBMISSION */}
        {isSubmitted && submittedData ? (
          <div className="max-w-2xl w-full bg-white rounded-2xl border border-[#E8E2D8] shadow-sm p-8 md:p-10 flex flex-col gap-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-[#E8F3EE] text-[#0F5F5C] border border-[#BDE0D1] flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[36px]">verified</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F3EE] text-[#0F5F5C] text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-[#0F5F5C]"></span>
                <span>Application Submitted</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#1C2826] tracking-tight">
                Volunteer Verification Tracker
              </h1>
              <p className="text-sm text-[#5A6563] max-w-md">
                Thank you, <strong className="text-[#1C2826]">{submittedData.fullName}</strong>. Your registration has been received and routed through the neighborhood verification pipeline.
              </p>
            </div>

            {/* 3-Step Verification Progression: Submitted → [Partner NGO] review → Admin approval */}
            <div className="bg-[#FAF7F2] border border-[#E8E2D8] rounded-2xl p-6 md:p-8 flex flex-col gap-6">
              <span className="text-xs uppercase tracking-wider text-[#5A6563] font-bold">
                Verification Pipeline Status
              </span>

              <div className="flex flex-col gap-6 relative pl-4 before:absolute before:left-7 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#E8E2D8]">
                {/* Step 1: Submitted (Active/Done) */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-[#0F5F5C] text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">done</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1C2826]">1. Submitted</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#E8F3EE] text-[#0F5F5C]">Completed</span>
                    </div>
                    <p className="text-xs text-[#5A6563] mt-0.5">
                      Application submitted with Government ID acknowledgment.
                    </p>
                  </div>
                </div>

                {/* Step 2: [Partner NGO] Review (Current / In Progress) */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-[#D97706] text-white flex items-center justify-center shrink-0 z-10 shadow-sm animate-pulse">
                    <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1C2826]">2. [Partner NGO] Review</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-[#D97706]">In Review</span>
                    </div>
                    <p className="text-xs text-[#5A6563] mt-0.5">
                      Elder-sensitivity orientation and local circle screening via {submittedData.partnerNgo}.
                    </p>
                  </div>
                </div>

                {/* Step 3: Admin Approval (Pending) */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E8E2D8] text-[#5A6563] flex items-center justify-center shrink-0 z-10">
                    <span className="material-symbols-outlined text-[18px]">shield_person</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#5A6563]">3. Admin Approval</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563]">Pending</span>
                    </div>
                    <p className="text-xs text-[#5A6563] mt-0.5">
                      Final community circle activation and dispatch alert assignment.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Summary Box */}
            <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl flex flex-col gap-2 text-xs">
              <div className="flex justify-between text-[#5A6563]">
                <span>Registered Name:</span>
                <span className="font-bold text-[#1C2826]">{submittedData.fullName}</span>
              </div>
              <div className="flex justify-between text-[#5A6563]">
                <span>Contact Number:</span>
                <span className="font-bold text-[#1C2826]">{submittedData.phone}</span>
              </div>
              <div className="flex justify-between text-[#5A6563]">
                <span>Locality:</span>
                <span className="font-bold text-[#1C2826]">{submittedData.area}</span>
              </div>
              <div className="flex justify-between text-[#5A6563]">
                <span>Assigned Desk:</span>
                <span className="font-bold text-[#0F5F5C]">{submittedData.partnerNgo}</span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/volunteer"
                className="flex-1 h-12 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                <span>Go to Volunteer Alerts</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setFullName("");
                  setPhone("");
                  setEmail("");
                  setArea("");
                  setSkills([]);
                }}
                className="flex-1 h-12 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C2826] text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">refresh</span>
                <span>New Application</span>
              </button>
            </div>
          </div>
        ) : (
          /* CLEAN STANDALONE FORM PAGE (NO STATUS PANEL) */
          <div className="max-w-2xl w-full bg-white rounded-2xl border border-[#E8E2D8] shadow-sm p-6 sm:p-10 flex flex-col gap-6">
            <div className="flex flex-col gap-2 border-b border-[#E8E2D8] pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#0F5F5C] text-xs font-bold w-fit">
                <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                <span>Join Volunteer Circle</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2826] tracking-tight">
                Volunteer Registration
              </h1>
              <p className="text-sm text-[#5A6563]">
                Offer local companionship, welfare visits, and urgent support under verified care organisation guidance.
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm font-semibold rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-red-600">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1C2826]" htmlFor="full-name">
                  Full Name (पूरा नाम) <span className="text-red-600">*</span>
                </label>
                <input
                  id="full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Suresh K."
                  required
                  className="w-full h-[52px] px-4 bg-white border border-[#E8E2D8] text-base text-[#1C2826] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5F5C] placeholder:text-[#5A6563]/50"
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1C2826]" htmlFor="phone-number">
                  Phone Number (मोबाइल नंबर) <span className="text-red-600">*</span>
                </label>
                <input
                  id="phone-number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 90000 00000"
                  required
                  className="w-full h-[52px] px-4 bg-white border border-[#E8E2D8] text-base text-[#1C2826] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5F5C] placeholder:text-[#5A6563]/50"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1C2826]" htmlFor="email-address">
                  Email Address (ईमेल)
                </label>
                <input
                  id="email-address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. volunteer@example.com"
                  className="w-full h-[52px] px-4 bg-white border border-[#E8E2D8] text-base text-[#1C2826] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5F5C] placeholder:text-[#5A6563]/50"
                />
              </div>

              {/* Residential Locality */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1C2826]" htmlFor="colony-area">
                  Residential Locality (स्थानीय क्षेत्र) <span className="text-red-600">*</span>
                </label>
                <input
                  id="colony-area"
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Pune Circle / Kothrud"
                  required
                  className="w-full h-[52px] px-4 bg-white border border-[#E8E2D8] text-base text-[#1C2826] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5F5C] placeholder:text-[#5A6563]/50"
                />
              </div>

              {/* Skills Checkboxes */}
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-sm font-semibold text-[#1C2826]">
                  Skills &amp; Support Areas (दक्षता और तत्परता)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    onClick={() => toggleSkill("first_aid")}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${
                      skills.includes("first_aid")
                        ? "bg-white border-[#0F5F5C] ring-1 ring-[#0F5F5C]"
                        : "bg-white border-[#E8E2D8]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={skills.includes("first_aid")}
                      onChange={() => {}}
                      className="w-4 h-4 accent-[#0F5F5C]"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1C2826]">First Aid</span>
                      <span className="text-[11px] text-[#5A6563]">Basic care</span>
                    </div>
                  </label>

                  <label
                    onClick={() => toggleSkill("driving")}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${
                      skills.includes("driving")
                        ? "bg-white border-[#0F5F5C] ring-1 ring-[#0F5F5C]"
                        : "bg-white border-[#E8E2D8]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={skills.includes("driving")}
                      onChange={() => {}}
                      className="w-4 h-4 accent-[#0F5F5C]"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1C2826]">Driving</span>
                      <span className="text-[11px] text-[#5A6563]">Vehicle trips</span>
                    </div>
                  </label>

                  <label
                    onClick={() => toggleSkill("companionship")}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${
                      skills.includes("companionship")
                        ? "bg-white border-[#0F5F5C] ring-1 ring-[#0F5F5C]"
                        : "bg-white border-[#E8E2D8]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={skills.includes("companionship")}
                      onChange={() => {}}
                      className="w-4 h-4 accent-[#0F5F5C]"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1C2826]">Companionship</span>
                      <span className="text-[11px] text-[#5A6563]">Walks &amp; visits</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Partner NGO Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1C2826]" htmlFor="ngo-selection">
                  Partner Care Organisation / NGO Desk <span className="text-red-600">*</span>
                </label>
                <select
                  id="ngo-selection"
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="w-full h-[52px] px-4 bg-white border border-[#E8E2D8] text-base text-[#1C2826] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
                >
                  {approvedOrgs.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] px-6 bg-[#0F5F5C] hover:bg-[#0B4644] text-white font-bold text-base rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer mt-2"
              >
                <span className="material-symbols-outlined text-[22px]">assignment_turned_in</span>
                <span>{loading ? "Submitting Application..." : "Submit Volunteer Application"}</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#FAF7F2] border-t border-[#E8E2D8] py-8">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-[#5A6563]">
          <p>© 2026 Aastha Senior Community Care India</p>
          <a href="tel:14567" className="hover:text-[#0F5F5C] transition-colors font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">phone_in_talk</span>
            <span>Elderline 14567 (Govt. of India)</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
