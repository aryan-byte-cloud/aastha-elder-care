"use client";

import React, { useState, useEffect } from "react";
import { Resident } from "@/app/admin/types";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface ResidentWelfareViewProps {
  resident?: Resident | null;
  orgName?: string;
  onBack?: () => void;
  context?: "admin" | "family";
}

export default function ResidentWelfareView({
  resident,
  orgName = "Sukoon Home",
  onBack,
  context = "family",
}: ResidentWelfareViewProps) {
  // Active demo action feedbacks
  const [remindVolunteerSent, setRemindVolunteerSent] = useState(false);
  const [activeModal, setActiveModal] = useState<
    | null
    | "passbook"
    | "hospitalCard"
    | "preAuth"
    | "uploadCert"
    | "aidMaintenance"
    | "guidelines"
    | "delayedCredit"
    | "statusModal"
  >(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Photo management state
  const [currentPhoto, setCurrentPhoto] = useState<string>(resident?.photoUrl || "");

  useEffect(() => {
    if (resident?.photoUrl) {
      setCurrentPhoto(resident.photoUrl);
    } else {
      setCurrentPhoto("");
    }
  }, [resident?.id, resident?.photoUrl]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Photo too large. Please select an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (!base64) return;
      setCurrentPhoto(base64);

      if (resident?.id) {
        try {
          await updateDoc(doc(db, "residents", resident.id), {
            photoUrl: base64,
          });
          showToast(`Photo uploaded and saved for ${displayName}!`);
        } catch (err) {
          console.error("Error saving resident photo:", err);
          showToast(`Photo updated locally for ${displayName} [preview]`);
        }
      } else {
        showToast(`Photo updated for ${displayName} [demo]`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemindVolunteer = () => {
    setRemindVolunteerSent(true);
    showToast("Notification dispatched: Suresh K. reminded to collect bus pass [demo]");
    setTimeout(() => {
      setRemindVolunteerSent(false);
    }, 3500);
  };

  // Resolved resident details (fallback to Kamla Deshmukh from Stitch mockup)
  const displayName = resident?.name || "Kamla Deshmukh";
  const displayAge = resident?.age || 78;
  const displayRoom = resident?.room || "Room 204";
  const displayRoomBadge = displayRoom.toUpperCase().includes("ROOM")
    ? displayRoom.toUpperCase().replace("ROOM", "RM")
    : displayRoom;
  const displayFacilityId = resident?.id
    ? `#SKN-${resident.id.slice(0, 4).toUpperCase()}`
    : "#SKN-204-KD";

  // Portrait image from Stitch design
  const defaultKamlaPortraitUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCRE2s54cf7D1hJCoaX_XbvDNJYxsIZa0s_eRLGHdDfFfdEuR4cJSK5RIISdEgO7Q3UgurXvN9ieqj9wzaw9ZtZieD_pw2aPOzcT_jsUPwSVJoICm6dGkZnLVuzmJABl0GH73RHlKl9by3UJfn2kv6F1lqSt8bmZO0rWMdlcBuwEYj68J1G3oC7vygMJD9s1yXFGZcSzt_FES7QkflKQ9gKm_G9GxGX57dLGbgc-TBljmZmASe-Gl6yzw";

  const isKamla = !resident || displayName.toLowerCase().includes("kamla");
  const photoToDisplay = currentPhoto || (isKamla ? defaultKamlaPortraitUrl : "");

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1E2624] flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#0F5F5C] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-[#0B4644] flex items-center gap-3 animate-fade-in text-sm font-semibold">
          <span className="material-symbols-outlined text-[22px] text-[#A7F3D0]">check_circle</span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-auto text-white/80 hover:text-white"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Top Breadcrumb & Quick Reference Header */}
      <div className="w-full bg-[#FAF7F2] border-b border-[#E8E2D8]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#4E5A57] font-semibold">
            <div className="flex items-center flex-wrap gap-2">
              {onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="hover:text-[#0F5F5C] cursor-pointer transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>{context === "admin" ? "Admin Dashboard" : "Family Dashboard"}</span>
                </button>
              ) : (
                <span className="text-[#4E5A57]">
                  {context === "admin" ? "Admin Dashboard" : "Family Dashboard"}
                </span>
              )}
              <span className="text-[#D5CEBF]">/</span>
              <span className="text-[#4E5A57]">Resident Records</span>
              <span className="text-[#D5CEBF]">/</span>
              <span className="text-[#1E2624] font-bold">{displayName}</span>
              <span className="text-[#D5CEBF]">/</span>
              <span className="text-[#0F5F5C] font-extrabold">Pensions &amp; Welfare Schemes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#2E7D32]"></span>
              <span className="text-[#1E2624] font-medium">Record Synchronized [demo]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resident Identity Strip */}
      <div className="w-full bg-[#FAF7F2]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-6">
          <div className="bg-white rounded-2xl p-5 md:p-7 shadow-sm border border-[#E8E2D8] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative shrink-0 group">
                {photoToDisplay ? (
                  <img
                    className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-2 border-[#E8E2D8] shadow-sm"
                    alt={`Portrait of ${displayName}`}
                    src={photoToDisplay}
                  />
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#FAF7F2] border-2 border-[#E8E2D8] flex flex-col items-center justify-center text-[#0F5F5C] shadow-sm">
                    <span className="material-symbols-outlined text-[36px]">elderly</span>
                    <span className="text-xs font-bold mt-0.5">{displayName.charAt(0)}</span>
                  </div>
                )}

                {/* Hover overlay to change photo */}
                <label
                  htmlFor="welfare-photo-upload"
                  className="absolute inset-0 rounded-2xl bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-[11px] font-bold gap-1 shadow-sm"
                  title="Upload or change resident photo"
                >
                  <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                  <span>Change</span>
                </label>
                <input
                  id="welfare-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <span className="absolute -bottom-2 -right-2 bg-[#0F5F5C] text-white text-[11px] font-bold px-2 py-0.5 rounded-full tracking-wide shadow-sm z-10">
                  {displayRoomBadge}
                </span>
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl md:text-3xl text-[#1E2624] font-extrabold tracking-tight">
                    {displayName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E1ECE7] text-[#0F5F5C] text-xs font-bold">
                    {displayAge} Years
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F3EEE6] text-[#4E5A57] text-xs font-semibold">
                    Protocol Tier A
                  </span>
                </div>
                <p className="text-sm md:text-base text-[#4E5A57] mt-1 font-medium">
                  {orgName} • {displayRoom} • ID:{" "}
                  <span className="font-mono text-[#1E2624] font-bold">{displayFacilityId}</span>
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[#4E5A57] text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#0F5F5C]">
                      family_restroom
                    </span>
                    <span>
                      Primary Kin: <strong className="text-[#1E2624]">Priya Deshmukh (Daughter)</strong>
                    </span>
                  </span>
                  <span className="hidden sm:inline text-[#D5CEBF]">•</span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#0F5F5C]">
                      volunteer_activism
                    </span>
                    <span>
                      Case Liaison: <strong className="text-[#1E2624]">Suresh K. (Sukoon Volunteer)</strong>
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 lg:pt-0 shrink-0">
              <label
                htmlFor="welfare-photo-upload"
                className="h-12 px-4 rounded-xl bg-white border border-[#E8E2D8] hover:bg-[#F3EEE6] text-[#1E2624] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                title="Select photo from device"
              >
                <span className="material-symbols-outlined text-[#0F5F5C] text-[20px]">photo_camera</span>
                <span>Upload Photo</span>
              </label>
              <button
                type="button"
                onClick={() => showToast("Summary PDF generated & downloaded [demo]")}
                className="h-12 px-5 rounded-xl bg-white border border-[#E8E2D8] hover:bg-[#F3EEE6] text-[#1E2624] text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[#0F5F5C] text-[20px]">download</span>
                <span>Download Summary [demo]</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  showToast("Liaison notification queued with Partner NGO support desk [demo]")
                }
                className="h-12 px-5 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
                <span>Liaison with [Partner NGO]</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Metric Strip */}
      <div className="w-full bg-[#FAF7F2]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-sm text-[#4E5A57] font-bold">Active Welfare Schemes</span>
                <div className="w-9 h-9 rounded-xl bg-[#E1ECE7] flex items-center justify-center text-[#0F5F5C] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl text-[#0F5F5C] font-black">3</span>
                  <span className="text-sm text-[#4E5A57] font-semibold">Enrolled [demo]</span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#2E7D32]"></span>
                  <span>All Verified</span>
                </div>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-sm text-[#4E5A57] font-bold">Monthly DBT Disbursals</span>
                <div className="w-9 h-9 rounded-xl bg-[#E1ECE7] flex items-center justify-center text-[#0F5F5C] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl text-[#1E2624] font-black">₹1,500</span>
                  <span className="text-sm text-[#4E5A57] font-semibold">/ mo [demo]</span>
                </div>
                <p className="text-xs text-[#4E5A57] mt-2 flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-[#2E7D32]">
                    check_circle
                  </span>
                  <span>Credited to DBT Bank A/c</span>
                </p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-sm text-[#4E5A57] font-bold">Senior Healthcare Cover</span>
                <div className="w-9 h-9 rounded-xl bg-[#E1ECE7] flex items-center justify-center text-[#0F5F5C] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">medical_services</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl text-[#1E2624] font-black">Active</span>
                  <span className="text-sm text-[#4E5A57] font-semibold">[demo]</span>
                </div>
                <p className="text-xs text-[#4E5A57] mt-2 truncate font-semibold">
                  Linked: <strong className="text-[#1E2624] font-bold">[Nearest hospital]</strong>
                </p>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-sm text-[#4E5A57] font-bold">Document Vault Readiness</span>
                <div className="w-9 h-9 rounded-xl bg-[#E1ECE7] flex items-center justify-center text-[#0F5F5C] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl text-[#1E2624] font-black">4 of 4</span>
                  <span className="text-sm text-[#4E5A57] font-semibold">Valid [demo]</span>
                </div>
                <p className="text-xs text-[#2E7D32] mt-2 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <span>Life Cert Valid (4 mos left)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Grid + Sidebar) */}
      <div className="w-full bg-[#FAF7F2] pb-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Primary Column: Schemes & Applications (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl md:text-2xl text-[#1E2624] font-extrabold tracking-tight">
                  Enrolled Government &amp; Community Schemes
                </h2>
                <p className="text-xs sm:text-sm text-[#4E5A57] mt-0.5">
                  Verified social security benefits, monthly allowances, and civic welfare
                  entitlements.
                </p>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-[#F3EEE6] border border-[#E8E2D8] text-[#1E2624] text-xs font-bold shrink-0">
                Status: Active Profile [demo]
              </span>
            </div>

            {/* SCHEME CARD 1: IGNOAPS / State Pension */}
            <div className="bg-white rounded-2xl p-5 md:p-7 border border-[#E8E2D8] shadow-sm transition-all hover:border-[#4A7A6D]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E1ECE7] flex items-center justify-center text-[#0F5F5C] shrink-0">
                    <span className="material-symbols-outlined text-[24px]">savings</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl text-[#1E2624] font-bold">
                      Indira Gandhi National Old Age Pension Scheme
                    </h3>
                    <p className="text-xs text-[#4E5A57] font-semibold mt-0.5">
                      IGNOAPS &amp; State Social Security Scheme • Beneficiary ID:{" "}
                      <span className="font-mono text-[#1E2624] font-bold">#PEN-MH-84920 [demo]</span>
                    </p>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#2E7D32]"></span>
                    <span>Active &amp; Disbursed [demo]</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 bg-[#FAF7F2] rounded-xl px-4 my-4 border border-[#E8E2D8]">
                <div>
                  <span className="text-xs text-[#4E5A57] font-bold block">Disbursal Amount</span>
                  <strong className="text-xl text-[#0F5F5C] font-extrabold">
                    ₹1,500 <span className="text-xs font-normal text-[#4E5A57]">/ month [demo]</span>
                  </strong>
                  <span className="text-[11px] text-[#4E5A57] block mt-0.5">Direct Benefit Transfer</span>
                </div>
                <div>
                  <span className="text-xs text-[#4E5A57] font-bold block">Bank Account</span>
                  <strong className="text-sm text-[#1E2624] font-bold block">State Bank of India</strong>
                  <span className="font-mono text-xs text-[#4E5A57]">DBT Linked •••• 4819</span>
                </div>
                <div>
                  <span className="text-xs text-[#4E5A57] font-bold block">Last Credited</span>
                  <strong className="text-sm text-[#1E2624] font-bold block">1st of This Month</strong>
                  <span className="text-xs text-[#2E7D32] font-bold block">₹1,500 Credited [demo]</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#4E5A57] text-xs font-semibold pt-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#0F5F5C]">
                    calendar_month
                  </span>
                  <span>
                    Next Life Certificate (Jeevan Pramaan) Submission Due:{" "}
                    <strong className="text-[#1E2624]">In 4 months [demo]</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#0F5F5C]">
                    person_pin
                  </span>
                  <span>Liaison: Sukoon Care Desk &amp; Suresh K.</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 mt-3 border-t border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={() => setActiveModal("passbook")}
                  className="h-11 px-4 rounded-xl bg-white border border-[#E8E2D8] hover:bg-[#F3EEE6] text-[#1E2624] text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#0F5F5C] text-[18px]">
                    receipt_long
                  </span>
                  <span>View Disbursal Passbook [demo]</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal("uploadCert")}
                  className="h-11 px-4 rounded-xl bg-[#E1ECE7] border border-[#4A7A6D] text-[#0F5F5C] hover:bg-[#0F5F5C] hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">fingerprint</span>
                  <span>Upload Life Certificate</span>
                </button>
              </div>
            </div>

            {/* SCHEME CARD 2: Senior Healthcare Coverage */}
            <div className="bg-white rounded-2xl p-5 md:p-7 border border-[#E8E2D8] shadow-sm transition-all hover:border-[#4A7A6D]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E1ECE7] flex items-center justify-center text-[#0F5F5C] shrink-0">
                    <span className="material-symbols-outlined text-[24px]">local_hospital</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl text-[#1E2624] font-bold">
                      Senior Citizen Health Protection Scheme
                    </h3>
                    <p className="text-xs text-[#4E5A57] font-semibold mt-0.5">
                      National Senior Healthcare Entitlement • Card ID:{" "}
                      <span className="font-mono text-[#1E2624] font-bold">#SCH-2024-9182 [demo]</span>
                    </p>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#2E7D32]"></span>
                    <span>Active [demo]</span>
                  </span>
                </div>
              </div>

              <div className="py-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8]">
                    <span className="text-xs text-[#4E5A57] font-bold block">
                      Designated Hospital Tie-Up
                    </span>
                    <strong className="text-sm text-[#1E2624] block mt-1">
                      [Nearest hospital]
                    </strong>
                    <p className="text-xs text-[#4E5A57] mt-0.5">
                      Includes secondary &amp; tertiary public geriatric units
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8]">
                    <span className="text-xs text-[#4E5A57] font-bold block">
                      Emergency Pre-Authorization Kin
                    </span>
                    <strong className="text-sm text-[#1E2624] block mt-1">
                      Priya Deshmukh (Daughter)
                    </strong>
                    <p className="text-xs text-[#4E5A57] mt-0.5">
                      Co-authorized with Sukoon Supervisor Rajiv Sharma
                    </p>
                  </div>
                </div>
                <div className="bg-[#F3EEE6] p-3.5 rounded-xl">
                  <span className="text-xs text-[#1E2624] font-bold block mb-2">
                    Covered Diagnostic &amp; Treatment Categories:
                  </span>
                  <div className="flex flex-wrap gap-2 text-[#4E5A57] text-xs font-semibold">
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-[#E8E2D8]">
                      Hypertension chronic care
                    </span>
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-[#E8E2D8]">
                      Ophthalmic cataract evaluation
                    </span>
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-[#E8E2D8]">
                      Routine geriatric vitals screening
                    </span>
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-[#E8E2D8]">
                      Emergency ambulance liaison
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={() => setActiveModal("hospitalCard")}
                  className="h-11 px-4 rounded-xl bg-white border border-[#E8E2D8] hover:bg-[#F3EEE6] text-[#1E2624] text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#0F5F5C] text-[18px]">badge</span>
                  <span>View Hospital Card [demo]</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal("preAuth")}
                  className="h-11 px-4 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">checklist_rtl</span>
                  <span>Pre-Authorize Treatment [demo]</span>
                </button>
              </div>
            </div>

            {/* SCHEME CARD 3: Rashtriya Vayoshri Yojana (RVY) */}
            <div className="bg-white rounded-2xl p-5 md:p-7 border border-[#E8E2D8] shadow-sm transition-all hover:border-[#4A7A6D]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E1ECE7] flex items-center justify-center text-[#0F5F5C] shrink-0">
                    <span className="material-symbols-outlined text-[24px]">accessibility_new</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl text-[#1E2624] font-bold">
                      Senior Assistive Devices Scheme (RVY)
                    </h3>
                    <p className="text-xs text-[#4E5A57] font-semibold mt-0.5">
                      Rashtriya Vayoshri Yojana • Physical Mobility Support
                    </p>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#2E7D32]"></span>
                    <span>Aids Received &amp; Recorded [demo]</span>
                  </span>
                </div>
              </div>

              <div className="py-4">
                <span className="text-xs text-[#4E5A57] block mb-2.5 font-bold">
                  Sanctioned &amp; Delivered Geriatric Aids:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#0F5F5C] text-[22px]">
                      assist_walker
                    </span>
                    <div>
                      <strong className="text-xs text-[#1E2624] font-bold block">Walking Stick</strong>
                      <span className="text-[11px] text-[#4E5A57]">Quad-base ergonomic grip</span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#0F5F5C] text-[22px]">
                      visibility
                    </span>
                    <div>
                      <strong className="text-xs text-[#1E2624] font-bold block">
                        Prescription Glasses
                      </strong>
                      <span className="text-[11px] text-[#4E5A57]">Reading bifocals (+2.25)</span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#0F5F5C] text-[22px]">
                      medication
                    </span>
                    <div>
                      <strong className="text-xs text-[#1E2624] font-bold block">
                        Pill Organizer
                      </strong>
                      <span className="text-[11px] text-[#4E5A57]">7-day tactile braille box</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#4E5A57] mt-3 leading-relaxed">
                  Distribution certified via{" "}
                  <strong className="text-[#1E2624]">[Partner NGO]</strong> community screening camp.
                  Free maintenance or wear-and-tear replacement is eligible after 12 months [demo].
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={() => setActiveModal("aidMaintenance")}
                  className="h-11 px-4 rounded-xl bg-white border border-[#E8E2D8] hover:bg-[#F3EEE6] text-[#1E2624] text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#0F5F5C] text-[18px]">build</span>
                  <span>Report Aid Maintenance</span>
                </button>
              </div>
            </div>

            {/* SCHEME CARD 4: Municipal Elder Utility & Travel Concession */}
            <div className="bg-white rounded-2xl p-5 md:p-7 border border-[#E8E2D8] shadow-sm transition-all hover:border-[#4A7A6D]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8E1] flex items-center justify-center text-[#B78103] shrink-0">
                    <span className="material-symbols-outlined text-[24px]">directions_bus</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl text-[#1E2624] font-bold">
                      Municipal Senior Travel &amp; Utility Concession
                    </h3>
                    <p className="text-xs text-[#4E5A57] font-semibold mt-0.5">
                      Urban Public Transit Pass &amp; Utility Discount
                    </p>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E1] text-[#B78103] text-xs font-bold">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#B78103]"></span>
                    <span>Verification in Progress [demo]</span>
                  </span>
                </div>
              </div>

              <div className="py-4 space-y-2">
                <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#B78103] text-[22px] mt-0.5 shrink-0">
                    pending_actions
                  </span>
                  <div className="text-xs text-[#4E5A57] leading-relaxed">
                    <strong className="text-[#1E2624] block font-bold text-sm mb-0.5">
                      Awaiting Physical Smart-Pass Delivery
                    </strong>
                    Application submitted and approved at ward level. Assigned Sukoon volunteer{" "}
                    <strong className="text-[#1E2624]">Suresh K.</strong> is scheduled to collect physical bus pass
                    badge from the Municipal Ward Office.
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={() => setActiveModal("statusModal")}
                  className="h-11 px-4 rounded-xl bg-white border border-[#E8E2D8] hover:bg-[#F3EEE6] text-[#1E2624] text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#0F5F5C] text-[18px]">
                    track_changes
                  </span>
                  <span>Check Status [demo]</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemindVolunteer}
                  className={`h-11 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    remindVolunteerSent
                      ? "bg-[#E8F5E9] text-[#2E7D32] border border-[#2E7D32]/30"
                      : "bg-[#F3EEE6] hover:bg-[#E8E2D8] text-[#1E2624]"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      remindVolunteerSent ? "text-[#2E7D32]" : "text-[#4E5A57]"
                    }`}
                  >
                    {remindVolunteerSent ? "check" : "notifications"}
                  </span>
                  <span>
                    {remindVolunteerSent
                      ? "Reminder Sent to Suresh K. [demo]"
                      : "Remind Assigned Volunteer"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Column: Documents, Verification Vault & Elderline Support (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Document & Life Certificate Vault */}
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#E8E2D8] shadow-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#E8E2D8]">
                <span className="material-symbols-outlined text-[#0F5F5C] text-[24px]">
                  folder_special
                </span>
                <div>
                  <h2 className="text-base md:text-lg text-[#1E2624] font-bold">Document Readiness</h2>
                  <span className="text-xs text-[#4E5A57] font-semibold">
                    Verified Scheme Compliance
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                {/* Doc 1 */}
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#2E7D32] text-[18px] mt-0.5">
                      task_alt
                    </span>
                    <div>
                      <strong className="text-xs text-[#1E2624] block leading-snug">
                        Digital Life Certificate
                      </strong>
                      <span className="text-[11px] text-[#4E5A57]">Jeevan Pramaan Token #8291</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#E8F5E9] text-[#2E7D32] font-bold shrink-0">
                    Valid [demo]
                  </span>
                </div>

                {/* Doc 2 */}
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#2E7D32] text-[18px] mt-0.5">
                      task_alt
                    </span>
                    <div>
                      <strong className="text-xs text-[#1E2624] block leading-snug">
                        Age &amp; Residence Proof
                      </strong>
                      <span className="text-[11px] text-[#4E5A57]">Sukoon Home Care Attestation</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#E8F5E9] text-[#2E7D32] font-bold shrink-0">
                    On File
                  </span>
                </div>

                {/* Doc 3 */}
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#2E7D32] text-[18px] mt-0.5">
                      task_alt
                    </span>
                    <div>
                      <strong className="text-xs text-[#1E2624] block leading-snug">
                        Bank DBT Mandate
                      </strong>
                      <span className="text-[11px] text-[#4E5A57]">State Bank Linked Account</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#E8F5E9] text-[#2E7D32] font-bold shrink-0">
                    Linked
                  </span>
                </div>

                {/* Doc 4 */}
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#2E7D32] text-[18px] mt-0.5">
                      task_alt
                    </span>
                    <div>
                      <strong className="text-xs text-[#1E2624] block leading-snug">
                        Family Non-Dependency
                      </strong>
                      <span className="text-[11px] text-[#4E5A57]">Certified by [Partner NGO]</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#E8F5E9] text-[#2E7D32] font-bold shrink-0">
                    Verified
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={() => setActiveModal("uploadCert")}
                  className="w-full h-12 px-4 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">face</span>
                  <span>Submit Life Cert via Face App [demo]</span>
                </button>
                <p className="text-[11px] text-[#4E5A57] text-center mt-2 leading-relaxed font-medium">
                  Assisted submission with Jeevan Pramaan Face Recognition conducted bi-annually by
                  Sukoon staff.
                </p>
              </div>
            </div>

            {/* Caregiver & NGO Liaison Details */}
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#E8E2D8] shadow-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#E8E2D8]">
                <span className="material-symbols-outlined text-[#0F5F5C] text-[24px]">groups</span>
                <div>
                  <h3 className="text-base md:text-lg text-[#1E2624] font-bold">Assisting Care Team</h3>
                  <span className="text-xs text-[#4E5A57] font-semibold">
                    Assigned Community Advocates
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#F3EEE6] border border-[#E8E2D8] flex items-center justify-center text-[#0F5F5C] shrink-0">
                    <span className="material-symbols-outlined text-[24px]">volunteer_activism</span>
                  </div>
                  <div>
                    <strong className="text-xs text-[#1E2624] block font-bold">Suresh K.</strong>
                    <span className="text-xs text-[#4E5A57] block">
                      Verified Sukoon Volunteer Liaison
                    </span>
                    <span className="text-[11px] text-[#0F5F5C] font-semibold">
                      Ward Office Liaison Desk
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <div className="w-11 h-11 rounded-xl bg-[#F3EEE6] border border-[#E8E2D8] flex items-center justify-center text-[#0F5F5C] shrink-0">
                    <span className="material-symbols-outlined text-[24px]">corporate_fare</span>
                  </div>
                  <div>
                    <strong className="text-xs text-[#1E2624] block font-bold">[Partner NGO]</strong>
                    <span className="text-xs text-[#4E5A57] block">Senior Welfare Support Unit</span>
                    <span className="text-[11px] text-[#4E5A57]">Pensions &amp; Medical Advocacy</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D8] text-[#4E5A57] text-xs leading-relaxed">
                Sukoon Home caseworkers and volunteers manage physical file submissions directly
                with the Social Welfare Commissionerate to relieve family members of bureau visits.
              </div>
            </div>

            {/* Official Elderline Support Callout */}
            <div className="bg-[#FFF8F6] rounded-2xl p-5 md:p-6 border border-[#F8C8C0] shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-[#FFEAE6] text-[#BA1A1A] border border-[#F8C8C0] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">call</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#BA1A1A] uppercase tracking-wider block">
                    Official Support Helpline
                  </span>
                  <h4 className="text-lg text-[#BA1A1A] font-extrabold">Elderline 14567</h4>
                  <p className="text-xs text-[#4E5A57] mt-1 leading-snug">
                    Toll-free national helpline by the Ministry of Social Justice &amp; Empowerment
                    (Govt. of India) for pension grievances, elder abuse, and rescue.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <a
                  className="w-full h-12 px-4 rounded-xl bg-[#BA1A1A] hover:bg-[#93000A] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  href="tel:14567"
                >
                  <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
                  <span>Call Elderline 14567 (Govt. of India)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Information Bar on Pension Rights & Advocacy */}
      <div className="w-full bg-[#F3EEE6] border-t border-[#E8E2D8] py-6">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E2D8] flex items-center justify-center text-[#0F5F5C] shrink-0">
                <span className="material-symbols-outlined text-[22px]">info</span>
              </div>
              <div>
                <h5 className="text-xs md:text-sm text-[#1E2624] font-bold">
                  Senior Citizen Welfare Transparency Note
                </h5>
                <p className="text-xs text-[#4E5A57] mt-0.5">
                  Pension disbursements are credited directly to beneficiary bank accounts via
                  National Electronic Funds Transfer (NEFT/DBT). Sukoon Home does not charge
                  facilitation fees for government schemes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setActiveModal("guidelines")}
                className="h-10 px-4 rounded-xl bg-white border border-[#E8E2D8] hover:bg-[#FAF7F2] text-[#1E2624] text-xs font-semibold transition-all cursor-pointer shadow-sm"
              >
                Disbursal Guidelines [demo]
              </button>
              <button
                type="button"
                onClick={() => setActiveModal("delayedCredit")}
                className="h-10 px-4 rounded-xl bg-white border border-[#E8E2D8] hover:bg-[#FAF7F2] text-[#0F5F5C] text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Report Delayed Credit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DEMO ACTION MODALS */}
      {/* 1. Passbook Modal */}
      {activeModal === "passbook" && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E2D8] shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F5F5C]">receipt_long</span>
                <h3 className="text-lg font-bold text-[#1E2624]">DBT Passbook Ledger [demo]</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-[#4E5A57] hover:text-[#1E2624]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 bg-[#FAF7F2] rounded-xl flex items-center justify-between">
                <div>
                  <strong className="block text-[#1E2624]">IGNOAPS Monthly Disbursal</strong>
                  <span className="text-[#4E5A57]">1st of Current Month • SBI •••• 4819</span>
                </div>
                <span className="text-emerald-700 font-bold text-sm">+ ₹1,500</span>
              </div>
              <div className="p-3 bg-[#FAF7F2] rounded-xl flex items-center justify-between">
                <div>
                  <strong className="block text-[#1E2624]">IGNOAPS Monthly Disbursal</strong>
                  <span className="text-[#4E5A57]">1st of Last Month • SBI •••• 4819</span>
                </div>
                <span className="text-emerald-700 font-bold text-sm">+ ₹1,500</span>
              </div>
              <div className="p-3 bg-[#FAF7F2] rounded-xl flex items-center justify-between">
                <div>
                  <strong className="block text-[#1E2624]">IGNOAPS Monthly Disbursal</strong>
                  <span className="text-[#4E5A57]">1st of Previous Month • SBI •••• 4819</span>
                </div>
                <span className="text-emerald-700 font-bold text-sm">+ ₹1,500</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-10 px-5 bg-[#0F5F5C] text-white rounded-xl text-xs font-bold"
              >
                Close Passbook
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Hospital Card Modal */}
      {activeModal === "hospitalCard" && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E2D8] shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F5F5C]">badge</span>
                <h3 className="text-lg font-bold text-[#1E2624]">Senior Health Card [demo]</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-[#4E5A57] hover:text-[#1E2624]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#0F5F5C] to-[#083E3C] text-white space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#A7F3D0]">
                    Senior Health Protection
                  </span>
                  <h4 className="text-base font-bold">{displayName}</h4>
                </div>
                <span className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded">#SCH-2024-9182</span>
              </div>
              <div className="text-xs space-y-1 text-white/90">
                <p>DOB / Age: {displayAge} Years • Room: {displayRoom}</p>
                <p>Tie-up Facility: [Nearest hospital]</p>
                <p>Pre-Auth Contact: Priya Deshmukh (Daughter)</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-10 px-5 bg-[#0F5F5C] text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. General Feedback Modal for remaining actions */}
      {(activeModal === "preAuth" ||
        activeModal === "uploadCert" ||
        activeModal === "aidMaintenance" ||
        activeModal === "guidelines" ||
        activeModal === "delayedCredit" ||
        activeModal === "statusModal") && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E2D8] shadow-2xl animate-fade-in text-center">
            <div className="w-12 h-12 rounded-full bg-[#E1ECE7] text-[#0F5F5C] flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <h3 className="text-lg font-bold text-[#1E2624] capitalize">
              {activeModal === "preAuth" && "Pre-Authorization Portal"}
              {activeModal === "uploadCert" && "Jeevan Pramaan Face Submission"}
              {activeModal === "aidMaintenance" && "Report Aid Maintenance"}
              {activeModal === "guidelines" && "Govt DBT Disbursal Guidelines"}
              {activeModal === "delayedCredit" && "Grievance Redressal Form"}
              {activeModal === "statusModal" && "Municipal Transit Pass Status"}
            </h3>
            <p className="text-xs text-[#4E5A57] mt-2 leading-relaxed">
              {activeModal === "preAuth" &&
                "Treatment pre-authorization request submitted to Sukoon supervisor and [Nearest hospital] liaison desk."}
              {activeModal === "uploadCert" &&
                "Face biometric token scheduled for bi-annual verification during the upcoming volunteer rounds."}
              {activeModal === "aidMaintenance" &&
                "Maintenance ticket logged with [Partner NGO] mobility support desk for quad-base walking stick & assistive aids."}
              {activeModal === "guidelines" &&
                "Under Ministry guidelines, IGNOAPS direct payments are credited into Aadhaar-seeded accounts on the 1st week of each calendar month."}
              {activeModal === "delayedCredit" &&
                "Grievance filed with District Social Welfare Officer via Sukoon administrative liaison."}
              {activeModal === "statusModal" &&
                "Smart-Pass card printed at Pune Ward Office. Assigned volunteer Suresh K. will deliver the pass during the afternoon visit."}
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-10 px-6 bg-[#0F5F5C] hover:bg-[#0B4644] text-white rounded-xl text-xs font-bold transition-all"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
