"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { OrganizationInfo } from "@/app/admin/types";
import Header from "@/components/Header";

const MAX_FILE_SIZE_BYTES = 700 * 1024;
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

export default function PendingApprovalPage() {
  const { user, profile, role, loading: authLoading, logout, refreshProfile } = useAuth();
  const router = useRouter();

  const [org, setOrg] = useState<OrganizationInfo | null>(null);
  const [loadingOrg, setLoadingOrg] = useState(true);

  // Resubmit modal state
  const [showResubmit, setShowResubmit] = useState(false);
  const [resubmitAddress, setResubmitAddress] = useState("");
  const [resubmitPhone, setResubmitPhone] = useState("");
  const [resubmitNotes, setResubmitNotes] = useState("");
  const [resubmitDocFile, setResubmitDocFile] = useState<File | null>(null);
  const [resubmitDocBase64, setResubmitDocBase64] = useState<string>("");
  const [resubmitDocError, setResubmitDocError] = useState<string | null>(null);
  const [savingResubmit, setSavingResubmit] = useState(false);

  // Authentication & Role Gate
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (role === "platform_admin") {
      router.replace("/platform");
      return;
    }

    if (role === "volunteer") {
      router.replace("/volunteer");
      return;
    }

    if (role === "family") {
      router.replace("/family");
      return;
    }
  }, [user, role, authLoading, router]);

  // Real-time Organization Listener
  useEffect(() => {
    if (!profile?.orgId) {
      setLoadingOrg(false);
      return;
    }

    const unsub = onSnapshot(doc(db, "organizations", profile.orgId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const orgData: OrganizationInfo = {
          id: snap.id,
          name: data.name || "Organisation",
          type: data.type || "Old age home",
          registrationNumber: data.registrationNumber || "N/A",
          darpanId: data.darpanId,
          address: data.address || "",
          city: data.city || "Pune",
          state: data.state || "Maharashtra",
          phone: data.phone || "",
          approxResidents: data.approxResidents || 0,
          contactName: data.contactName || "",
          email: data.email || "",
          status: data.status || "pending",
          rejectionReason: data.rejectionReason,
          createdAt: data.createdAt,
        };

        setOrg(orgData);
        setResubmitAddress(orgData.address || "");
        setResubmitPhone(orgData.phone || "");

        // If approved by platform admin, automatically transition to /admin
        if (orgData.status === "approved") {
          refreshProfile().then(() => router.replace("/admin"));
        }
      } else {
        setOrg(null);
      }
      setLoadingOrg(false);
    });

    return () => unsub();
  }, [profile?.orgId, refreshProfile, router]);

  const handleResubmitFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setResubmitDocError("Please upload a PDF, JPG, or PNG document.");
      setResubmitDocFile(null);
      setResubmitDocBase64("");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setResubmitDocError(`File size (${(file.size / 1024).toFixed(0)} KB) exceeds the 700 KB limit.`);
      setResubmitDocFile(null);
      setResubmitDocBase64("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const commaIndex = result.indexOf(",");
      const base64Data = commaIndex >= 0 ? result.substring(commaIndex + 1) : result;
      setResubmitDocFile(file);
      setResubmitDocBase64(base64Data);
      setResubmitDocError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmResubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;

    setSavingResubmit(true);
    try {
      if (resubmitDocFile && resubmitDocBase64) {
        await addDoc(collection(db, "orgDocuments"), {
          orgId: org.id,
          kind: "resubmitted_proof",
          kindLabel: "Updated Verification Proof",
          fileName: resubmitDocFile.name,
          mimeType: resubmitDocFile.type,
          dataBase64: resubmitDocBase64,
          uploadedAt: serverTimestamp(),
        });
      }

      if (resubmitPhone.trim() && resubmitPhone.trim() !== org.phone) {
        await updateDoc(doc(db, "organizations", org.id), {
          phone: resubmitPhone.trim(),
        });
      }

      setShowResubmit(false);
      setResubmitDocFile(null);
      setResubmitDocBase64("");
      alert("Updated verification documents uploaded successfully for platform review.");
    } catch (err) {
      console.error("Resubmit error:", err);
      alert("Failed to resubmit. Please try again.");
    } finally {
      setSavingResubmit(false);
    }
  };

  if (authLoading || loadingOrg) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-[#0F5F5C] border-t-transparent animate-spin mb-4"></div>
        <p className="text-sm font-bold text-[#5A6563]">Loading organisation status...</p>
      </div>
    );
  }

  const formatSubmittedDate = (ts: unknown) => {
    if (!ts) return "Recently submitted";
    try {
      const d = (ts as { toDate?: () => Date }).toDate ? (ts as { toDate: () => Date }).toDate() : new Date();
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recently submitted";
    }
  };

  const isRejected = org?.status === "rejected";

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C2826] flex flex-col font-sans">
      <Header />

      <main className="w-full pt-28 pb-16 px-6 flex-grow flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl border border-[#E8E2D8] shadow-sm p-6 sm:p-10 flex flex-col gap-6">
          {/* Status Badge & Icon */}
          <div className="flex flex-col items-center text-center gap-3">
            <div
              className={`w-18 h-18 rounded-2xl flex items-center justify-center shadow-sm ${
                isRejected
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              <span className="material-symbols-outlined text-[42px]">
                {isRejected ? "gpp_bad" : "pending_actions"}
              </span>
            </div>

            <div
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isRejected
                  ? "bg-red-100 text-red-900 border border-red-200"
                  : "bg-amber-100 text-amber-950 border border-amber-200"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isRejected ? "bg-red-600" : "bg-amber-500 animate-ping"
                }`}
              ></span>
              <span>{isRejected ? "Registration Rejected" : "Review in Progress"}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2826] tracking-tight">
              {isRejected ? "Registration Requires Attention" : "Your registration is under review"}
            </h1>

            <p className="text-sm text-[#5A6563] max-w-md">
              {isRejected
                ? "The platform review team has requested revisions before your organisation can be activated."
                : "Thank you for joining Aastha. Our platform administrators are reviewing your documents and government registration details."}
            </p>
          </div>

          {/* Rejection Notice Box */}
          {isRejected && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex flex-col gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-red-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">report_problem</span>
                <span>Reason for Rejection</span>
              </span>
              <p className="text-xs text-red-800 font-medium leading-relaxed">
                {org?.rejectionReason || "Uploaded documents were unclear or could not be verified with authorities. Please resubmit clear copies."}
              </p>
            </div>
          )}

          {/* Application Summary Box */}
          <div className="bg-[#FAF7F2] border border-[#E8E2D8] rounded-2xl p-5 flex flex-col gap-3 text-xs">
            <span className="text-[11px] font-bold text-[#5A6563] uppercase tracking-wider border-b border-[#E8E2D8] pb-1.5">
              Registration Summary
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[#5A6563] block">Organisation:</span>
                <strong className="text-[#1C2826] block text-sm">{org?.name}</strong>
              </div>
              <div>
                <span className="text-[#5A6563] block">Type:</span>
                <strong className="text-[#1C2826] block">{org?.type || "Old age home"}</strong>
              </div>
              <div>
                <span className="text-[#5A6563] block">Reg. Number:</span>
                <span className="font-mono font-bold text-[#1C2826] block">{org?.registrationNumber}</span>
              </div>
              <div>
                <span className="text-[#5A6563] block">Submitted Date:</span>
                <span className="font-medium text-[#1C2826] block">{formatSubmittedDate(org?.createdAt)}</span>
              </div>
              <div>
                <span className="text-[#5A6563] block">Location:</span>
                <span className="font-medium text-[#1C2826] block">{org?.city}, {org?.state}</span>
              </div>
              <div>
                <span className="text-[#5A6563] block">Contact Desk:</span>
                <span className="font-mono text-[#1C2826] block">{org?.phone}</span>
              </div>
            </div>
          </div>

          {/* Action Options */}
          <div className="flex flex-col gap-3 pt-2">
            {isRejected ? (
              <button
                type="button"
                onClick={() => setShowResubmit(true)}
                className="w-full h-12 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">refresh</span>
                <span>Resubmit Documents &amp; Information</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#E8F3EE] border border-[#BDE0D1] flex items-center gap-3 text-xs text-[#0F5F5C]">
                <span className="material-symbols-outlined text-[22px] shrink-0">sync</span>
                <span>
                  Check this page for updates – it refreshes automatically when your organisation is approved.
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => logout().then(() => router.push("/login"))}
              className="w-full h-11 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563] hover:text-[#1C2826] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Log out</span>
            </button>
          </div>
        </div>
      </main>

      {/* RESUBMISSION MODAL */}
      {showResubmit && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-xl max-w-md w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F5F5C] text-[24px]">edit_document</span>
                <h3 className="text-base font-bold text-[#1C2826]">Resubmit Registration</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowResubmit(false)}
                className="text-[#5A6563] hover:text-[#1C2826] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmResubmit} className="pt-4 flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1C2826]">Updated Street Address</label>
                <input
                  type="text"
                  value={resubmitAddress}
                  onChange={(e) => setResubmitAddress(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1C2826]">Organisation Contact Phone</label>
                <input
                  type="tel"
                  value={resubmitPhone}
                  onChange={(e) => setResubmitPhone(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm font-mono focus:outline-none focus:border-[#0F5F5C]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1C2826]">Upload Revised Document (PDF / JPG / PNG, max 700 KB)</label>
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  onChange={handleResubmitFileChange}
                  className="text-xs text-[#5A6563] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0F5F5C] file:text-white hover:file:bg-[#0B4644] cursor-pointer"
                />
                {resubmitDocError && <p className="text-xs text-red-600 font-semibold">{resubmitDocError}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1C2826]">Clarification Note for Platform Reviewer</label>
                <textarea
                  rows={2}
                  value={resubmitNotes}
                  onChange={(e) => setResubmitNotes(e.target.value)}
                  placeholder="e.g. Attached clearer scan of NGO trust registration deed..."
                  className="p-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResubmit(false)}
                  disabled={savingResubmit}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A6563] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingResubmit}
                  className="px-5 py-2.5 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {savingResubmit ? "Submitting..." : "Submit for Re-review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
