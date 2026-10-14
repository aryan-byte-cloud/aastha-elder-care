"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  updateDoc,
  doc,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { OrganizationInfo, OrgDocument } from "@/app/admin/types";
import { formatTelHref } from "@/lib/utils";

export default function PlatformAdminPage() {
  const { user, profile, role, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [orgs, setOrgs] = useState<OrganizationInfo[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");

  // Selected Org Details Modal
  const [selectedOrg, setSelectedOrg] = useState<OrganizationInfo | null>(null);
  const [orgDocs, setOrgDocs] = useState<OrgDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  // Reject Modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // Auth & Role check: strictly platform_admin only
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (role !== "platform_admin") {
      if (role === "admin") router.replace("/admin");
      else if (role === "volunteer") router.replace("/volunteer");
      else router.replace("/family");
    }
  }, [user, role, authLoading, router]);

  // Real-time listener for organizations
  useEffect(() => {
    setLoadingOrgs(true);
    const unsub = onSnapshot(collection(db, "organizations"), (snapshot) => {
      const list: OrganizationInfo[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          name: data.name || "Unnamed Organisation",
          type: data.type || "Old age home",
          registrationNumber: data.registrationNumber || "N/A",
          darpanId: data.darpanId || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          phone: data.phone || "",
          approxResidents: data.approxResidents || 0,
          contactName: data.contactName || "",
          email: data.email || "",
          status: (data.status as "pending" | "approved" | "rejected") || "pending",
          rejectionReason: data.rejectionReason || "",
          submittedBy: data.submittedBy || "",
          reviewedBy: data.reviewedBy || "",
          reviewedAt: data.reviewedAt,
          createdAt: data.createdAt,
        });
      });
      setOrgs(list);
      setLoadingOrgs(false);
    });

    return () => unsub();
  }, []);

  // Fetch documents when opening an organisation
  const handleOpenOrgDetails = async (orgItem: OrganizationInfo) => {
    setSelectedOrg(orgItem);
    setLoadingDocs(true);
    try {
      const qDocs = query(collection(db, "orgDocuments"), where("orgId", "==", orgItem.id));
      const snap = await getDocs(qDocs);
      const docsList: OrgDocument[] = [];
      snap.forEach((d) => {
        const data = d.data();
        docsList.push({
          id: d.id,
          orgId: data.orgId,
          kind: data.kind || "document",
          kindLabel: data.kindLabel || "Verification Document",
          fileName: data.fileName || "document",
          mimeType: data.mimeType || "application/pdf",
          dataBase64: data.dataBase64 || "",
          uploadedAt: data.uploadedAt,
        });
      });
      setOrgDocs(docsList);
    } catch (err) {
      console.error("Error loading org documents:", err);
    } finally {
      setLoadingDocs(false);
    }
  };

  // View document in new tab (decoding base64 to Blob URL)
  const handleViewDocument = (docItem: OrgDocument) => {
    try {
      if (!docItem.dataBase64) {
        alert("Document content is empty.");
        return;
      }
      const byteCharacters = atob(docItem.dataBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: docItem.mimeType });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (err) {
      console.error("Error opening document in new tab:", err);
      alert("Could not open document preview. File format might be corrupted.");
    }
  };

  // Action: Approve Organisation
  const handleApproveOrg = async (orgItem: OrganizationInfo) => {
    if (!confirm(`Approve ${orgItem.name} for the Aastha platform?`)) return;
    setProcessing(true);

    try {
      const reviewerName = profile?.name || user?.displayName || user?.email || "Platform Admin";
      await updateDoc(doc(db, "organizations", orgItem.id), {
        status: "approved",
        rejectionReason: "",
        reviewedBy: reviewerName,
        reviewedAt: serverTimestamp(),
      });

      showToast(`${orgItem.name} approved successfully.`);
      setSelectedOrg(null);
    } catch (err) {
      console.error("Error approving organisation:", err);
      alert("Failed to approve organisation.");
    } finally {
      setProcessing(false);
    }
  };

  // Action: Confirm Rejection with required reason
  const handleConfirmReject = async () => {
    if (!selectedOrg) return;
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    setProcessing(true);

    try {
      const reviewerName = profile?.name || user?.displayName || user?.email || "Platform Admin";
      await updateDoc(doc(db, "organizations", selectedOrg.id), {
        status: "rejected",
        rejectionReason: rejectReason.trim(),
        reviewedBy: reviewerName,
        reviewedAt: serverTimestamp(),
      });

      showToast(`${selectedOrg.name} marked as rejected.`);
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedOrg(null);
    } catch (err) {
      console.error("Error rejecting organisation:", err);
      alert("Failed to reject organisation.");
    } finally {
      setProcessing(false);
    }
  };

  // Counts
  const pendingOrgs = orgs.filter((o) => o.status === "pending");
  const approvedOrgs = orgs.filter((o) => o.status === "approved");
  const rejectedOrgs = orgs.filter((o) => o.status === "rejected");

  const displayedOrgs =
    activeTab === "pending"
      ? pendingOrgs
      : activeTab === "approved"
      ? approvedOrgs
      : rejectedOrgs;

  const formatDate = (ts: unknown) => {
    if (!ts) return "—";
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
      return "—";
    }
  };

  if (authLoading || (loadingOrgs && orgs.length === 0)) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-[#0F5F5C] border-t-transparent animate-spin mb-4"></div>
        <p className="text-sm font-bold text-[#5A6563]">Loading Platform Admin Console...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C2826] flex flex-col font-sans">
      {/* Toast Feedback */}
      {actionFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F5F5C] text-white px-5 py-3 rounded-xl shadow-lg border border-[#0B4644] flex items-center gap-2 animate-fade-in text-sm font-semibold">
          <span className="material-symbols-outlined text-[20px] text-[#A7F3D0]">check_circle</span>
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E2D8] px-6 lg:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#0F5F5C] text-white flex items-center justify-center font-black text-xl shadow-sm">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-[#1C2826] tracking-tight leading-none">
                Aastha Platform
              </span>
              <span className="text-xs font-bold text-[#0F5F5C] leading-tight mt-0.5">
                Owner Administration Console
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-bold text-[#1C2826]">{profile?.name || "Platform Admin"}</span>
            <span className="text-[10px] font-bold text-[#0F5F5C] uppercase tracking-wider bg-[#E8F3EE] px-1.5 py-0.5 rounded">
              platform_admin
            </span>
          </div>

          <button
            type="button"
            onClick={() => logout().then(() => router.push("/login"))}
            className="h-10 px-3.5 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563] hover:text-[#1C2826] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Log out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1280px] w-full mx-auto px-6 lg:px-12 py-10 flex flex-col gap-8 flex-grow">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E2D8]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2826] tracking-tight">
              Care Organisations Directory
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6563] mt-1">
              Verify legal credentials, view submitted proof documents, and activate care facilities.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-white border border-[#E8E2D8] rounded-xl text-xs font-bold self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "pending"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-[#5A6563] hover:text-[#1C2826]"
              }`}
            >
              <span>Pending</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === "pending" ? "bg-amber-800 text-white" : "bg-amber-100 text-amber-900"
              }`}>
                {pendingOrgs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("approved")}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "approved"
                  ? "bg-[#0F5F5C] text-white shadow-xs"
                  : "text-[#5A6563] hover:text-[#1C2826]"
              }`}
            >
              <span>Approved</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === "approved" ? "bg-[#0B4644] text-white" : "bg-[#E8F3EE] text-[#0F5F5C]"
              }`}>
                {approvedOrgs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("rejected")}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "rejected"
                  ? "bg-red-700 text-white shadow-xs"
                  : "text-[#5A6563] hover:text-[#1C2826]"
              }`}
            >
              <span>Rejected</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === "rejected" ? "bg-red-900 text-white" : "bg-red-100 text-red-900"
              }`}>
                {rejectedOrgs.length}
              </span>
            </button>
          </div>
        </div>

        {/* Organisations List */}
        {displayedOrgs.length === 0 ? (
          <div className="py-16 bg-white border border-[#E8E2D8] rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-[48px] text-[#5A6563]/60">inbox</span>
            <h3 className="text-base font-bold text-[#1C2826]">
              No {activeTab} organisations found
            </h3>
            <p className="text-xs text-[#5A6563]">
              Organisations registered through /register-organization will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedOrgs.map((orgItem) => (
              <div
                key={orgItem.id}
                className="bg-white border border-[#E8E2D8] hover:border-[#0F5F5C] rounded-2xl p-6 shadow-sm transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-base text-[#1C2826] leading-tight">
                        {orgItem.name}
                      </h3>
                      <span className="text-xs text-[#5A6563] font-medium">
                        {orgItem.type} • {orgItem.city || "Pune"}, {orgItem.state || "MH"}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${
                        orgItem.status === "approved"
                          ? "bg-[#E8F3EE] text-[#0F5F5C]"
                          : orgItem.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {(orgItem.status || "pending").toUpperCase()}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex flex-col gap-1 text-xs text-[#5A6563]">
                    <div className="flex items-center justify-between">
                      <span>Reg No:</span>
                      <strong className="text-[#1C2826] font-mono">{orgItem.registrationNumber}</strong>
                    </div>
                    {orgItem.darpanId && (
                      <div className="flex items-center justify-between">
                        <span>Darpan ID:</span>
                        <strong className="text-[#1C2826] font-mono">{orgItem.darpanId}</strong>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Contact:</span>
                      <strong className="text-[#1C2826] truncate max-w-[150px]">{orgItem.contactName}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Phone:</span>
                      <a
                        href={formatTelHref(orgItem.phone)}
                        className="text-[#0F5F5C] font-mono hover:underline"
                      >
                        {orgItem.phone}
                      </a>
                    </div>
                  </div>

                  {orgItem.status === "rejected" && orgItem.rejectionReason && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
                      <strong>Rejection note:</strong> {orgItem.rejectionReason}
                    </div>
                  )}

                  {orgItem.reviewedBy && (
                    <span className="text-[11px] text-[#5A6563]">
                      Reviewed by {orgItem.reviewedBy} on {formatDate(orgItem.reviewedAt)}
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-[#E8E2D8] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenOrgDetails(orgItem)}
                    className="flex-1 h-10 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EEE6] border border-[#E8E2D8] text-[#1C2826] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#0F5F5C]">visibility</span>
                    <span>View &amp; Verify</span>
                  </button>

                  {orgItem.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => handleApproveOrg(orgItem)}
                      className="h-10 px-4 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Approve</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* DETAILS & DOCUMENTS MODAL */}
      {selectedOrg && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-2xl max-w-2xl w-full p-6 sm:p-8 animate-scale-up max-h-[90vh] overflow-y-auto flex flex-col gap-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E8E2D8]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-[#1C2826]">{selectedOrg.name}</h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      selectedOrg.status === "approved"
                        ? "bg-[#E8F3EE] text-[#0F5F5C]"
                        : selectedOrg.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {(selectedOrg.status || "pending").toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-[#5A6563] mt-0.5">
                  ID: <code className="font-mono text-[#0F5F5C]">{selectedOrg.id}</code> • Registered on {formatDate(selectedOrg.createdAt)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrg(null)}
                className="text-[#5A6563] hover:text-[#1C2826] p-1.5 rounded-lg hover:bg-[#FAF7F2] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D8]">
              <div>
                <span className="text-[#5A6563] block">Organisation Type:</span>
                <strong className="text-[#1C2826]">{selectedOrg.type}</strong>
              </div>
              <div>
                <span className="text-[#5A6563] block">Registration Number:</span>
                <strong className="text-[#1C2826] font-mono">{selectedOrg.registrationNumber}</strong>
              </div>
              <div>
                <span className="text-[#5A6563] block">NGO Darpan ID:</span>
                <strong className="text-[#1C2826] font-mono">{selectedOrg.darpanId || "Not provided"}</strong>
              </div>
              <div>
                <span className="text-[#5A6563] block">Approx. Residents:</span>
                <strong className="text-[#1C2826]">{selectedOrg.approxResidents || "N/A"}</strong>
              </div>
              <div>
                <span className="text-[#5A6563] block">Contact Person:</span>
                <strong className="text-[#1C2826]">{selectedOrg.contactName}</strong>
              </div>
              <div>
                <span className="text-[#5A6563] block">Contact Email:</span>
                <strong className="text-[#1C2826]">{selectedOrg.email}</strong>
              </div>
              <div>
                <span className="text-[#5A6563] block">Desk Phone:</span>
                <a href={formatTelHref(selectedOrg.phone)} className="text-[#0F5F5C] font-mono hover:underline font-bold">
                  {selectedOrg.phone}
                </a>
              </div>
              <div>
                <span className="text-[#5A6563] block">Address:</span>
                <strong className="text-[#1C2826]">{selectedOrg.address}, {selectedOrg.city}, {selectedOrg.state}</strong>
              </div>
            </div>

            {/* Verification Documents List */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-[#1C2826] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#0F5F5C] text-[20px]">folder</span>
                <span>Uploaded Verification Documents ({orgDocs.length})</span>
              </h3>

              {loadingDocs ? (
                <div className="py-8 text-center text-xs text-[#5A6563]">Loading uploaded files...</div>
              ) : orgDocs.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#5A6563] bg-[#FAF7F2] rounded-xl border border-[#E8E2D8]">
                  No verification documents were attached with this registration.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {orgDocs.map((docItem) => (
                    <div
                      key={docItem.id}
                      className="p-3 bg-white rounded-xl border border-[#E8E2D8] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="material-symbols-outlined text-[#0F5F5C] text-[22px] shrink-0">
                          {docItem.mimeType.includes("pdf") ? "picture_as_pdf" : "image"}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-[#1C2826] truncate">{docItem.kindLabel}</span>
                          <span className="text-[11px] text-[#5A6563] truncate">
                            {docItem.fileName} ({docItem.mimeType.split("/")[1]?.toUpperCase()})
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleViewDocument(docItem)}
                        className="h-8 px-3 rounded-lg bg-[#E8F3EE] hover:bg-[#d8ece2] text-[#0F5F5C] font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                        <span>View Document</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E2D8]">
              <button
                type="button"
                onClick={() => setSelectedOrg(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A6563] hover:bg-[#FAF7F2] cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => setShowRejectModal(true)}
                disabled={processing}
                className="px-4 py-2 rounded-xl bg-white border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold cursor-pointer transition-colors"
              >
                Reject Organisation
              </button>

              <button
                type="button"
                onClick={() => handleApproveOrg(selectedOrg)}
                disabled={processing || selectedOrg.status === "approved"}
                className="px-5 py-2.5 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-xs font-bold cursor-pointer shadow-sm disabled:opacity-50 transition-colors"
              >
                {selectedOrg.status === "approved" ? "Already Approved" : "Approve Organisation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT PROMPT MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-2xl max-w-md w-full p-6 animate-scale-up flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-700 text-[24px]">gpp_bad</span>
                <h3 className="text-base font-bold text-[#1C2826]">Reject Registration</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="text-[#5A6563] hover:text-[#1C2826] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#5A6563]">
              Please provide a clear reason for rejecting <strong>{selectedOrg?.name}</strong>. The applicant will see this reason on their pending status screen and will have an option to resubmit.
            </p>

            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-bold text-[#1C2826]">Rejection Reason *</label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Uploaded registration deed was blurry. Please upload a clear scanned PDF."
                required
                className="p-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A6563] hover:bg-[#FAF7F2] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={processing || !rejectReason.trim()}
                className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                {processing ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
