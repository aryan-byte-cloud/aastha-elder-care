"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import ResidentWelfareView from "@/components/ResidentWelfareView";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  Resident,
  Medicine,
  DoseLog,
  CareAlert,
  HealthUpdate,
  FamilyRequest,
  OrganizationInfo,
} from "@/app/admin/types";
import { formatTelHref } from "@/lib/utils";

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.includes(":")) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function convert24to12(timeStr: string): string {
  if (!timeStr || !timeStr.includes(":")) return timeStr;
  const [h, m] = timeStr.split(":").map(Number);
  const period = (h || 0) >= 12 ? "PM" : "AM";
  const displayH = (h || 0) % 12 === 0 ? 12 : (h || 0) % 12;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(displayH)}:${pad(m || 0)} ${period}`;
}

function formatDateTime(ts: unknown): string {
  if (!ts) return "Today";
  try {
    let d: Date;
    if (typeof ts === "object" && ts !== null && "toDate" in ts) {
      d = (ts as { toDate: () => Date }).toDate();
    } else if (ts instanceof Date) {
      d = ts;
    } else if (typeof ts === "number") {
      d = new Date(ts);
    } else {
      return String(ts);
    }
    const dateStr = d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    return `${dateStr}, ${timeStr}`;
  } catch {
    return "Today";
  }
}

export default function FamilyPage() {
  const { user, profile } = useAuth();

  // Data states
  const [allResidents, setAllResidents] = useState<Resident[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([]);
  const [alerts, setAlerts] = useState<CareAlert[]>([]);
  const [healthUpdates, setHealthUpdates] = useState<HealthUpdate[]>([]);
  const [myRequests, setMyRequests] = useState<FamilyRequest[]>([]);
  const [orgInfo, setOrgInfo] = useState<OrganizationInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Selected resident (if linked to multiple)
  const [selectedResidentId, setSelectedResidentId] = useState<string>("");

  // Sub-navigation view tab: Daily Care & Telemetry vs Pensions & Welfare Schemes
  const [familyViewTab, setFamilyViewTab] = useState<"care" | "welfare">("care");

  // Request form state (Approval required, no instant link)
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [relationshipInput, setRelationshipInput] = useState("Daughter");
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestSentNotice, setRequestSentNotice] = useState<string | null>(null);

  // Family note input
  const [familyNoteInput, setFamilyNoteInput] = useState("");
  const [sendingNote, setSendingNote] = useState(false);

  // In-app alert toast: stays visible for at least 8.5 seconds, with close button
  const [alertToast, setAlertToast] = useState<string | null>(null);
  const initialAlertsLoaded = useRef(false);
  const knownAlertIds = useRef<Set<string>>(new Set());

  const showToast = (msg: string) => {
    setAlertToast(msg);
    setTimeout(() => setAlertToast(null), 8500);
  };

  // Pre-populate family member name and phone
  useEffect(() => {
    if (user) {
      setNameInput(profile?.name || user.displayName || "Priya Deshmukh");
      setPhoneInput(profile?.phone || (user.email === "priya@saathi.demo" ? "+91 90000 00002 (demo)" : ""));
      if (user.email === "priya@saathi.demo" && !inviteCodeInput) {
        setInviteCodeInput("KAMLA204");
      }
    }
  }, [user, profile]);

  // Current day and minutes updated in useEffect to avoid SSR / prerender mismatch
  const [todayStr, setTodayStr] = useState("");
  const [currentMinutes, setCurrentMinutes] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      setTodayStr(`${y}-${m}-${day}`);
      setCurrentMinutes(d.getHours() * 60 + d.getMinutes());
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // 1. Real-time Listeners for Residents & Requests
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Residents: Query ONLY residents where this user is linked (satisfies rules)
    const qResidents = query(
      collection(db, "residents"),
      where("familyUserIds", "array-contains", user.uid)
    );
    const unsubResidents = onSnapshot(qResidents, (snap) => {
      const list: Resident[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          name: data.name || "",
          age: data.age || 0,
          room: data.room || "",
          orgId: data.orgId || "",
          bloodGroup: data.bloodGroup || "O+",
          conditions: data.conditions || "",
          allergies: data.allergies || "",
          status: data.status || "stable",
          attentionReason: data.attentionReason || "",
          familyUserIds: data.familyUserIds || [],
          inviteCode: data.inviteCode || "",
          createdAt: data.createdAt,
        });
      });
      setAllResidents(list);
      setLoading(false);
    });

    // My Family Requests (filtered by userId to satisfy rules)
    const qReq = query(
      collection(db, "familyRequests"),
      where("userId", "==", user.uid)
    );
    const unsubRequests = onSnapshot(qReq, (snap) => {
      const reqList: FamilyRequest[] = [];
      snap.forEach((d) => {
        const data = d.data();
        reqList.push({
          id: d.id,
          residentId: data.residentId || "",
          orgId: data.orgId || "",
          userId: data.userId || "",
          name: data.name || "",
          phone: data.phone || "",
          relationship: data.relationship || "Family",
          status: data.status || "pending",
          createdAt: data.createdAt,
        });
      });
      setMyRequests(reqList);
    });

    return () => {
      unsubResidents();
      unsubRequests();
    };
  }, [user]);

  // Linked residents for this logged-in family user
  const linkedResidents = useMemo(() => {
    if (!user) return [];
    return allResidents.filter((r) => r.familyUserIds?.includes(user.uid));
  }, [allResidents, user]);

  // Selected Active Resident
  const activeResident = useMemo(() => {
    if (linkedResidents.length === 0) return null;
    if (selectedResidentId) {
      const found = linkedResidents.find((r) => r.id === selectedResidentId);
      if (found) return found;
    }
    return linkedResidents[0];
  }, [linkedResidents, selectedResidentId]);

  // Organization doc listener: scopes to activeResident's organization
  useEffect(() => {
    if (!activeResident?.orgId) {
      setOrgInfo(null);
      return;
    }

    const unsubOrg = onSnapshot(
      doc(db, "organizations", activeResident.orgId),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setOrgInfo({
            id: snap.id,
            name: d.name || "Sukoon Home",
            phone: d.phone ? d.phone : undefined,
            address: d.address || "Model Colony, Pune Circle",
          });
        } else {
          setOrgInfo(null);
        }
      },
      (err) => {
        console.error("Error fetching organization:", err);
        setOrgInfo(null);
      }
    );

    return () => unsubOrg();
  }, [activeResident?.orgId]);

  // Listeners for active resident telemetry (medicines, logs, alerts, health updates)
  useEffect(() => {
    if (!activeResident?.id) {
      setMedicines([]);
      setDoseLogs([]);
      setAlerts([]);
      setHealthUpdates([]);
      return;
    }

    const currentResidentId = activeResident.id;

    // Medicines: Scoped to activeResident.id (passes isLinkedFamilyForResident rule)
    const qMeds = query(
      collection(db, "medicines"),
      where("residentId", "==", currentResidentId)
    );
    const unsubMeds = onSnapshot(qMeds, (snap) => {
      const list: Medicine[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          residentId: data.residentId || "",
          orgId: data.orgId || activeResident.orgId || "",
          name: data.name || "",
          dose: data.dose || "",
          time: data.time || "09:00",
          instructions: data.instructions || "",
        });
      });
      setMedicines(list);
    });

    // Dose Logs: Scoped to activeResident.id
    const qLogs = query(
      collection(db, "doseLogs"),
      where("residentId", "==", currentResidentId)
    );
    const unsubLogs = onSnapshot(qLogs, (snap) => {
      const list: DoseLog[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          medicineId: data.medicineId || "",
          residentId: data.residentId || "",
          orgId: data.orgId || activeResident.orgId || "",
          date: data.date || "",
          status: "given",
          givenAt: data.givenAt,
          givenBy: data.givenBy || "",
        });
      });
      setDoseLogs(list);
    });

    // Alerts: Scoped to activeResident.id
    const qAlerts = query(
      collection(db, "alerts"),
      where("residentId", "==", currentResidentId)
    );
    const unsubAlerts = onSnapshot(qAlerts, (snap) => {
      const list: CareAlert[] = [];
      const currentIds = new Set<string>();

      snap.forEach((d) => {
        const data = d.data();
        const alertObj: CareAlert = {
          id: d.id,
          residentId: data.residentId || "",
          orgId: data.orgId || activeResident.orgId || "",
          type: data.type || "missed_dose",
          medicineId: data.medicineId,
          status: data.status || "open",
          message: data.message || "",
          createdBy: data.createdBy,
          acceptedBy: data.acceptedBy,
          declinedBy: data.declinedBy || [],
          escalateAt: data.escalateAt,
          timeline: data.timeline || [],
          createdAt: data.createdAt,
        };
        list.push(alertObj);
        currentIds.add(d.id);

        // Show toast with at least 8.5s duration when a new alert arrives while page is open
        if (initialAlertsLoaded.current && !knownAlertIds.current.has(d.id)) {
          showToast(`⚠️ New Care Notice: ${alertObj.message || "New care event flagged for senior."}`);
        }
      });

      knownAlertIds.current = currentIds;
      initialAlertsLoaded.current = true;
      setAlerts(list);
    });

    // Health Updates: Scoped to activeResident.id
    const qHealth = query(
      collection(db, "healthUpdates"),
      where("residentId", "==", currentResidentId)
    );
    const unsubHealth = onSnapshot(qHealth, (snap) => {
      const list: HealthUpdate[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          residentId: data.residentId || "",
          orgId: data.orgId || activeResident.orgId || "",
          bp: data.bp || "",
          pulse: data.pulse || "",
          mood: data.mood || "Calm",
          note: data.note || "",
          byName: data.byName || "Staff Nurse",
          createdAt: data.createdAt,
        });
      });
      setHealthUpdates(list);
    });

    return () => {
      unsubMeds();
      unsubLogs();
      unsubAlerts();
      unsubHealth();
    };
  }, [activeResident?.id, activeResident?.orgId]);

  // Active pending request for this user (if not linked yet)
  const pendingRequest = useMemo(() => {
    return myRequests.find((r) => r.status === "pending");
  }, [myRequests]);

  const pendingResident = useMemo(() => {
    if (!pendingRequest) return null;
    return allResidents.find((r) => r.id === pendingRequest.residentId);
  }, [pendingRequest, allResidents]);

  // Active SOS alert for linked resident (if any)
  const activeSosAlert = useMemo(() => {
    if (!activeResident) return null;
    return alerts.find(
      (a) => a.residentId === activeResident.id && a.type === "sos" && a.status !== "resolved"
    );
  }, [activeResident, alerts]);

  // Client timer to re-evaluate 60s escalation window in real time without extra Firestore writes
  const [clientNow, setClientNow] = useState(0);
  useEffect(() => {
    setClientNow(Date.now());
    const timer = setInterval(() => setClientNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isSosOverdueOrEscalated = useMemo(() => {
    if (!activeSosAlert) return false;
    if (activeSosAlert.status === "escalated") return true;
    if (activeSosAlert.status === "open" && clientNow > 0) {
      let createdMs = 0;
      if (activeSosAlert.createdAt && typeof (activeSosAlert.createdAt as any).toMillis === "function") {
        createdMs = (activeSosAlert.createdAt as any).toMillis();
      } else if (activeSosAlert.createdAt && typeof (activeSosAlert.createdAt as any).seconds === "number") {
        createdMs = (activeSosAlert.createdAt as any).seconds * 1000;
      } else if (activeSosAlert.createdAt) {
        const parsed = new Date(activeSosAlert.createdAt as any).getTime();
        if (!isNaN(parsed)) createdMs = parsed;
      } else if (activeSosAlert.escalateAt) {
        createdMs = activeSosAlert.escalateAt - 60000;
      }
      return createdMs > 0 && clientNow - createdMs >= 60000;
    }
    return false;
  }, [activeSosAlert, clientNow]);

  // Today's Medicines for linked resident
  const residentMedicines = useMemo(() => {
    if (!activeResident) return [];
    return medicines
      .filter((m) => m.residentId === activeResident.id)
      .map((med) => {
        const medMins = parseTimeToMinutes(med.time);
        const givenLog = doseLogs.find(
          (log) => log.medicineId === med.id && log.date === todayStr && log.status === "given"
        );
        const isOverdue = !givenLog && currentMinutes > medMins + 15;
        const overdueMinutes = isOverdue ? currentMinutes - medMins : 0;

        return {
          med,
          medMins,
          givenLog,
          isOverdue,
          overdueMinutes,
        };
      })
      .sort((a, b) => a.medMins - b.medMins);
  }, [activeResident, medicines, doseLogs, todayStr, currentMinutes]);

  // Alerts for linked resident (last 7 days)
  const residentAlerts = useMemo(() => {
    if (!activeResident) return [];
    return alerts.filter((a) => a.residentId === activeResident.id);
  }, [activeResident, alerts]);

  // Health updates for linked resident
  const residentHealthUpdates = useMemo(() => {
    if (!activeResident) return [];
    return healthUpdates.filter((h) => h.residentId === activeResident.id);
  }, [activeResident, healthUpdates]);

  // ACTION: Submit link request (Requires Admin Approval via inviteCodes collection)
  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const cleanCode = inviteCodeInput.trim().toUpperCase();
    if (!cleanCode) {
      setInviteError("Please enter an 8-character invite code.");
      return;
    }

    setSubmittingRequest(true);
    setInviteError(null);

    try {
      // Look up invite code directly (satisfies firestore rules for signed-in users)
      const codeRef = doc(db, "inviteCodes", cleanCode);
      const codeSnap = await getDoc(codeRef);

      if (!codeSnap.exists()) {
        setInviteError("Invite code not found. Please verify with care administration.");
        setSubmittingRequest(false);
        return;
      }

      const codeData = codeSnap.data();
      const targetResidentId = codeData.residentId;
      const targetOrgId = codeData.orgId || "";

      // Check if already linked
      if (allResidents.some((r) => r.id === targetResidentId)) {
        setInviteError("You are already linked to this senior's care circle.");
        setSubmittingRequest(false);
        return;
      }

      // Check if request already pending
      if (myRequests.some((r) => r.residentId === targetResidentId && r.status === "pending")) {
        setInviteError("An access request for this resident is already awaiting approval.");
        setSubmittingRequest(false);
        return;
      }

      // Create a pending request in familyRequests (approval required)
      await addDoc(collection(db, "familyRequests"), {
        residentId: targetResidentId,
        orgId: targetOrgId,
        userId: user.uid,
        name: nameInput.trim() || profile?.name || "Family Member",
        phone: phoneInput.trim() || profile?.phone || "+91 90000 00002 (demo)",
        relationship: relationshipInput,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setInviteCodeInput("");
      setRequestSentNotice(
        "Request sent – waiting for care administration to approve access."
      );
      showToast("Request submitted. Care administration notified for approval.");
    } catch (err) {
      console.error("Error creating family request:", err);
      setInviteError("Failed to submit request. Please try again.");
    } finally {
      setSubmittingRequest(false);
    }
  };



  return (
    <ProtectedRoute allowedRole="family">
      <div className="min-h-screen bg-[#FAF7F2] text-[#1C2826] flex flex-col font-sans">
        {/* Shared Header */}
        <Header />

        {/* Floating In-App Toast (Visible for at least 8.5 seconds, with close button) */}
        {alertToast && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#0F5F5C] text-white px-5 py-4 rounded-xl shadow-xl border border-[#0B4644] flex items-center gap-3 animate-fade-in">
            <span className="material-symbols-outlined text-[24px] text-[#A7F3D0] shrink-0">
              notifications_active
            </span>
            <p className="text-sm font-semibold flex-1 leading-snug">{alertToast}</p>
            <button
              onClick={() => setAlertToast(null)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              type="button"
              title="Close notification"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        )}

        <main className="w-full pt-28 pb-16 bg-[#FAF7F2] flex-grow">
          <div className="max-w-[1280px] w-full mx-auto px-6 lg:px-12 flex flex-col gap-8">
            {/* VIEW 1: NO LINKED RESIDENT */}
            {!loading && linkedResidents.length === 0 && (
              familyViewTab === "welfare" ? (
                <ResidentWelfareView
                  resident={null}
                  orgName={orgInfo?.name || "Sukoon Home"}
                  context="family"
                  onBack={() => setFamilyViewTab("care")}
                />
              ) : (
                <div className="max-w-lg w-full mx-auto my-8 bg-white rounded-2xl border border-[#E8E2D8] shadow-sm p-8 md:p-10 flex flex-col items-center text-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#E8F3EE] text-[#0F5F5C] flex items-center justify-center border border-[#BDE0D1]">
                    <span className="material-symbols-outlined text-[36px]">family_restroom</span>
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-2xl font-black text-[#1C2826] tracking-tight">
                      Join your parent&apos;s care circle
                    </h1>
                    <p className="text-sm text-[#5A6563] leading-relaxed">
                      For patient safety and medical privacy, entering an invite code requires care administration approval before vital telemetry is unlocked.
                    </p>
                  </div>

                  {/* Status Notice if request is pending */}
                  {(pendingRequest || requestSentNotice) && (
                    <div className="w-full bg-amber-50 border border-amber-300 rounded-xl p-4 text-left flex items-start gap-3">
                      <span className="material-symbols-outlined text-amber-700 text-[22px] shrink-0 mt-0.5">
                        hourglass_top
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Pending Administration Approval
                        </span>
                        <p className="text-xs text-amber-800">
                          {requestSentNotice ||
                            `Request sent for ${pendingResident?.name || "resident"} (${pendingRequest?.relationship}) – waiting for care administration to approve.`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Request Form */}
                  <form onSubmit={handleRequestLink} className="w-full flex flex-col gap-4 text-left text-xs">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-[#1C2826] uppercase tracking-wider">
                        8-Character Invite Code *
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        value={inviteCodeInput}
                        onChange={(e) => {
                          setInviteCodeInput(e.target.value.toUpperCase());
                          setInviteError(null);
                        }}
                        placeholder="e.g. 7KQ4XM2P"
                        required
                        className="h-12 px-4 rounded-xl border border-[#E8E2D8] text-base font-mono font-bold tracking-widest text-[#1C2826] focus:outline-none focus:border-[#0F5F5C] uppercase placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400"
                      />
                      {inviteError && (
                        <p className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">error</span>
                          <span>{inviteError}</span>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-[#1C2826]">Relationship *</label>
                        <select
                          value={relationshipInput}
                          onChange={(e) => setRelationshipInput(e.target.value)}
                          className="h-11 px-3 rounded-xl border border-[#E8E2D8] text-sm font-semibold bg-white text-[#1C2826] focus:outline-none focus:border-[#0F5F5C]"
                        >
                          <option value="Daughter">Daughter</option>
                          <option value="Son">Son</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Other">Other Family</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-[#1C2826]">Your Phone *</label>
                        <input
                          type="text"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="e.g. +91 90000 00002 (demo)"
                          required
                          className="h-11 px-3 rounded-xl border border-[#E8E2D8] text-sm text-[#1C2826] focus:outline-none focus:border-[#0F5F5C]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-[#1C2826]">Your Full Name *</label>
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="e.g. Priya Deshmukh"
                        required
                        className="h-11 px-3 rounded-xl border border-[#E8E2D8] text-sm text-[#1C2826] focus:outline-none focus:border-[#0F5F5C]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingRequest || !inviteCodeInput.trim()}
                      className="h-12 w-full mt-2 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[20px]">send</span>
                      <span>{submittingRequest ? "Sending Request..." : "Request Access"}</span>
                    </button>
                  </form>

                  <div className="pt-2 border-t border-[#E8E2D8] w-full flex items-center justify-center gap-2 text-xs text-[#5A6563]">
                    <span>Need an invite code? Contact your care desk:</span>
                    {orgInfo?.phone ? (
                      <a href={formatTelHref(orgInfo.phone)} className="text-[#0F5F5C] font-bold hover:underline">
                        {orgInfo.phone}
                      </a>
                    ) : (
                      <span className="text-[#888] font-medium">Care desk number not available</span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#E8E2D8] w-full flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setFamilyViewTab("welfare")}
                      className="text-xs font-bold text-[#0F5F5C] hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">assignment_turned_in</span>
                      <span>Explore Resident Welfare &amp; Pension Schemes [demo]</span>
                    </button>
                  </div>
                </div>
              )
            )}

            {/* VIEW 2: LINKED RESIDENT EXISTS -> LIVE FAMILY DASHBOARD */}
            {activeResident && (
              <>
                {/* 1. LARGE RED ACTIVE SOS BANNER */}
                {activeSosAlert && (
                  <div className="bg-red-700 text-white px-6 py-5 rounded-2xl shadow-xl border border-red-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-pulse">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="w-13 h-13 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[32px] text-white">emergency</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-white text-red-700 text-xs font-black uppercase">
                            Emergency Incident Active
                          </span>
                          <span className="text-xs text-red-100 font-mono">
                            SOS raised at {activeSosAlert.timeline[0]?.at || "recently"}
                          </span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-black text-white">
                          SOS raised for {activeResident.name}
                        </h2>
                        <p className="text-xs sm:text-sm text-red-100">
                          {isSosOverdueOrEscalated && "No volunteer responded in 60s. Care desk must call 108 now."}
                          {!isSosOverdueOrEscalated && activeSosAlert.status === "open" && "Awaiting local volunteer dispatch in Pune Circle."}
                          {!isSosOverdueOrEscalated && activeSosAlert.status === "accepted" && `${activeSosAlert.acceptedBy?.name} accepted – on the way.`}
                          {!isSosOverdueOrEscalated && activeSosAlert.status === "arrived" && `${activeSosAlert.acceptedBy?.name} arrived on scene.`}
                        </p>

                        {/* Show volunteer name and phone ONLY while incident is active */}
                        {activeSosAlert.acceptedBy && (
                          <div className="mt-2 inline-flex items-center gap-3 bg-red-900/60 border border-red-400/40 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white w-fit">
                            <span className="material-symbols-outlined text-[18px]">person</span>
                            <span>Responder: {activeSosAlert.acceptedBy.name}</span>
                            <span>•</span>
                            <a
                              href={formatTelHref(activeSosAlert.acceptedBy.phone || "+91 90000 00003")}
                              className="hover:underline flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[16px]">phone</span>
                              <span>{activeSosAlert.acceptedBy.phone || "+91 90000 00003 (demo)"}</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0 self-stretch md:self-auto">
                      {isSosOverdueOrEscalated && (
                        <a
                          href="tel:108"
                          className="flex-1 md:flex-initial h-11 px-4 bg-white text-red-700 font-extrabold text-xs rounded-xl hover:bg-red-50 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[18px]">call</span>
                          <span>Call 108 Ambulance</span>
                        </a>
                      )}
                      {orgInfo?.phone ? (
                        <a
                          href={formatTelHref(orgInfo.phone)}
                          className={`flex-1 md:flex-initial h-11 px-5 font-extrabold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 ${
                            isSosOverdueOrEscalated
                              ? "bg-red-900/60 border border-red-400 text-white hover:bg-red-900"
                              : "bg-white text-red-700 hover:bg-red-50"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">phone</span>
                          <span>Call {orgInfo.name || "Care Desk"}</span>
                        </a>
                      ) : (
                        <span
                          className={`flex-1 md:flex-initial h-11 px-4 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 ${
                            isSosOverdueOrEscalated
                              ? "bg-red-900/60 border border-red-400 text-red-200"
                              : "bg-white/20 text-white"
                          }`}
                        >
                          Care desk number not available
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Sub-Navigation Tabs: Daily Care & Telemetry vs Pensions & Welfare Schemes */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFamilyViewTab("care")}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      familyViewTab === "care"
                        ? "bg-[#0F5F5C] text-white shadow-sm"
                        : "bg-white text-[#5A6563] border border-[#E8E2D8] hover:bg-[#FAF7F2] hover:text-[#1C2826]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">monitor_heart</span>
                    <span>Daily Care &amp; Telemetry</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFamilyViewTab("welfare")}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      familyViewTab === "welfare"
                        ? "bg-[#0F5F5C] text-white shadow-sm"
                        : "bg-white text-[#5A6563] border border-[#E8E2D8] hover:bg-[#FAF7F2] hover:text-[#1C2826]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                    <span>Pensions &amp; Welfare Schemes</span>
                  </button>
                </div>

                {familyViewTab === "welfare" ? (
                  <ResidentWelfareView
                    resident={activeResident}
                    orgName={orgInfo?.name || "Sukoon Home"}
                    context="family"
                    onBack={() => setFamilyViewTab("care")}
                  />
                ) : (
                  <>
                    {/* 2. Top Resident Profile Strip & Multi-Resident Selector */}
                    <section className="w-full bg-white rounded-2xl border border-[#E8E2D8] shadow-sm p-6 md:p-8 flex flex-col gap-6">
                  {linkedResidents.length > 1 && (
                    <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
                      <span className="text-xs font-bold text-[#5A6563] uppercase tracking-wider">
                        Switch Senior Care Circle:
                      </span>
                      <select
                        value={activeResident.id}
                        onChange={(e) => setSelectedResidentId(e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] text-sm font-bold text-[#1C2826] focus:outline-none focus:border-[#0F5F5C]"
                      >
                        {linkedResidents.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.room})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                      {activeResident.photoUrl ? (
                        <img
                          src={activeResident.photoUrl}
                          alt={activeResident.name}
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-[#E8E2D8] shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#0F5F5C] flex items-center justify-center text-3xl font-black shrink-0 shadow-sm">
                          {activeResident.name.charAt(0)}
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-3">
                          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1C2826] tracking-tight">
                            {activeResident.name}
                          </h1>

                          {activeResident.status === "sos" ? (
                            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-300 text-xs font-black shadow-sm">
                              <span className="material-symbols-outlined text-[16px] animate-pulse">emergency</span>
                              <span>SOS Active</span>
                            </div>
                          ) : activeResident.status === "attention" ? (
                            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-sm">
                              <span className="material-symbols-outlined text-[16px]">warning</span>
                              <span>Needs Attention</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8F3EE] text-[#0F5F5C] border border-[#BDE0D1] text-xs font-bold shadow-sm">
                              <span className="material-symbols-outlined text-[16px]">check_circle</span>
                              <span>Stable &amp; Rested</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[#5A6563] text-sm">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px] text-[#0F5F5C]">apartment</span>
                            {orgInfo?.name || "Care Facility"}, {activeResident.room}
                          </span>
                          <span>•</span>
                          <span>Age {activeResident.age}</span>
                          <span>•</span>
                          <span>Blood Group: <strong>{activeResident.bloodGroup || "O+"}</strong></span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="px-2.5 py-0.5 rounded bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563] text-xs font-semibold">
                            Conditions: {activeResident.conditions}
                          </span>
                          <span className="px-2.5 py-0.5 rounded bg-[#E8F3EE] border border-[#BDE0D1] text-[#0F5F5C] text-xs font-bold font-mono">
                            Code: {activeResident.inviteCode}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row w-full lg:w-auto items-stretch sm:items-center gap-3 shrink-0">
                      {orgInfo?.phone ? (
                        <a
                          href={formatTelHref(orgInfo.phone)}
                          className="h-12 px-6 bg-[#0F5F5C] hover:bg-[#0B4644] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
                          <span>Call {orgInfo.name || "Care Desk"} ({orgInfo.phone})</span>
                        </a>
                      ) : (
                        <div className="h-12 px-6 bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563] rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
                          <span>Care desk number not available</span>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* 3. Bento Grid: Medicines (Left) & Staff Health Updates (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Today's Medicines & Incidents (7 Cols) */}
                  <div className="lg:col-span-7 flex flex-col gap-8">
                    {/* A. TODAY'S MEDICINES */}
                    <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-sm p-6 md:p-8 flex flex-col gap-6">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D8]">
                        <div>
                          <span className="text-xs uppercase tracking-wider text-[#0F5F5C] font-bold">
                            Live Dosage Telemetry
                          </span>
                          <h2 className="text-xl font-bold text-[#1C2826]">Today&apos;s Medicines</h2>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563] text-xs font-semibold">
                          {activeResident.room} Queue
                        </span>
                      </div>

                      {residentMedicines.length === 0 ? (
                        <p className="text-xs text-[#5A6563] py-4 text-center">
                          No prescription doses scheduled for today.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {residentMedicines.map(({ med, givenLog, isOverdue, overdueMinutes }) => (
                            <div
                              key={med.id}
                              className={`p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                                isOverdue
                                  ? "bg-amber-50/50 border-amber-300"
                                  : givenLog
                                  ? "bg-[#E8F3EE]/40 border-[#BDE0D1]"
                                  : "bg-white border-[#E8E2D8]"
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                                    givenLog
                                      ? "bg-[#E8F3EE] text-[#0F5F5C] border border-[#BDE0D1]"
                                      : isOverdue
                                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                                      : "bg-[#FAF7F2] text-[#5A6563] border border-[#E8E2D8]"
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-2xl">medication</span>
                                </div>

                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-[#1C2826]">
                                      {convert24to12(med.time)}
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8E2D8]"></span>
                                    <span className="text-xs text-[#0F5F5C] font-semibold">{med.dose}</span>
                                  </div>
                                  <h3 className="text-lg font-bold text-[#1C2826]">{med.name}</h3>
                                  <p className="text-xs text-[#5A6563]">{med.instructions || "Standard dose"}</p>
                                </div>
                              </div>

                              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0">
                                {givenLog ? (
                                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#E8F3EE] text-[#0F5F5C] border border-[#BDE0D1] rounded-full text-xs font-bold shadow-sm">
                                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                    <span>Given Today</span>
                                  </div>
                                ) : isOverdue ? (
                                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold">
                                    <span className="material-symbols-outlined text-[16px]">warning</span>
                                    <span>Overdue (+{overdueMinutes}m)</span>
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563] rounded-full text-xs font-semibold">
                                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                                    <span>Pending</span>
                                  </div>
                                )}
                                <span className="text-[11px] text-[#5A6563] mt-1">
                                  {givenLog ? `Logged by: ${givenLog.givenBy}` : "Supervised by floor nurse"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* B. SAFETY TIMELINE (LAST 7 DAYS) */}
                    <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-sm p-6 md:p-8 flex flex-col gap-6">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D8]">
                        <div>
                          <span className="text-xs uppercase tracking-wider text-[#0F5F5C] font-bold">
                            Safety Timeline
                          </span>
                          <h2 className="text-xl font-bold text-[#1C2826]">Recent Care Alerts &amp; Stepper</h2>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563] text-xs font-semibold">
                          Past 7 Days
                        </span>
                      </div>

                      {residentAlerts.length === 0 ? (
                        <div className="p-8 text-center flex flex-col items-center gap-2">
                          <span className="material-symbols-outlined text-3xl text-[#0F5F5C]">verified_user</span>
                          <p className="text-sm font-bold text-[#1C2826]">No incidents recorded</p>
                          <p className="text-xs text-[#5A6563]">
                            All care protocols and dosage schedules have been verified without escalation.
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-6">
                          {residentAlerts.map((alert) => (
                            <div
                              key={alert.id}
                              className={`p-5 rounded-2xl border flex flex-col gap-4 ${
                                alert.type === "sos"
                                  ? "bg-red-50/50 border-red-200"
                                  : "bg-amber-50/50 border-amber-200"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-wider text-[#5A6563]">
                                  {alert.type === "sos" ? "Emergency SOS Incident" : "Missed Dose Notice"}
                                </span>
                                <span
                                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                    alert.status === "resolved"
                                      ? "bg-[#E8F3EE] text-[#0F5F5C]"
                                      : alert.status === "escalated"
                                      ? "bg-red-700 text-white"
                                      : "bg-amber-200 text-amber-900"
                                  }`}
                                >
                                  {alert.status === "escalated"
                                    ? "ESCALATED (108 CALL REQUIRED)"
                                    : alert.status.toUpperCase()}
                                </span>
                              </div>

                              <p className="text-sm font-bold text-[#1C2826]">
                                {alert.message || "Care notice logged for resident."}
                              </p>

                              {/* Stepper matching Admin */}
                              <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 flex flex-col gap-3">
                                <span className="text-[11px] font-bold text-[#5A6563] uppercase tracking-wider">
                                  Incident Progression Steps
                                </span>

                                <div className="flex flex-col gap-3 relative pl-3 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8E2D8]">
                                  {alert.timeline.map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-3 relative">
                                      <div className="w-6 h-6 rounded-full bg-[#0F5F5C] text-white flex items-center justify-center text-xs shrink-0 z-10 shadow-sm">
                                        <span className="material-symbols-outlined text-[14px]">check</span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-xs font-bold text-[#1C2826]">{step.step}</span>
                                        <span className="text-[10px] text-[#5A6563]">
                                          By: {step.by} • {step.at}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {alert.status === "escalated" && (
                                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-red-200">
                                    <a
                                      href="tel:108"
                                      className="px-3 py-1.5 bg-red-700 text-white rounded-lg text-xs font-bold hover:bg-red-800 transition-colors flex items-center gap-1 shadow-sm"
                                    >
                                      <span className="material-symbols-outlined text-[14px]">call</span>
                                      <span>Call 108 Ambulance</span>
                                    </a>
                                    {orgInfo?.phone ? (
                                      <a
                                        href={formatTelHref(orgInfo.phone)}
                                        className="px-3 py-1.5 bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C2826] rounded-lg text-xs font-bold hover:bg-[#F3EEE6] transition-colors flex items-center gap-1 shadow-sm"
                                      >
                                        <span className="material-symbols-outlined text-[14px]">phone</span>
                                        <span>Care Desk: {orgInfo.phone}</span>
                                      </a>
                                    ) : (
                                      <span className="px-3 py-1.5 bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563] rounded-lg text-xs font-medium">
                                        Care desk number not available
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Staff Health Updates (With Date & Time) (5 Cols) */}
                  <div className="lg:col-span-5 flex flex-col gap-8">
                    <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-sm p-6 md:p-8 flex flex-col gap-6">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D8]">
                        <div>
                          <span className="text-xs uppercase tracking-wider text-[#0F5F5C] font-bold">
                            Direct Observation
                          </span>
                          <h2 className="text-xl font-bold text-[#1C2826]">Staff Health Updates</h2>
                        </div>
                        <span className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#0F5F5C]">
                          <span className="material-symbols-outlined text-[18px]">vital_signs</span>
                        </span>
                      </div>

                      {residentHealthUpdates.length === 0 ? (
                        <p className="text-xs text-[#5A6563] py-4 text-center">
                          No vitals updates posted today yet. Staff will log morning observations shortly.
                        </p>
                      ) : (
                        <div className="relative flex flex-col gap-6 pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E8E2D8]">
                          {residentHealthUpdates.map((update) => (
                            <div key={update.id} className="relative flex flex-col gap-1.5">
                              <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-[#0F5F5C] ring-4 ring-white"></span>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A6563]">
                                {/* Showing DATE AND TIME on each health update */}
                                <span className="font-bold text-[#1C2826]">
                                  {formatDateTime(update.createdAt)}
                                </span>
                                <span>•</span>
                                <span className="font-bold text-[#0F5F5C]">Mood: {update.mood}</span>
                                {update.bp && update.bp !== "N/A" && (
                                  <>
                                    <span>•</span>
                                    <span>BP: <strong>{update.bp}</strong></span>
                                  </>
                                )}
                                {update.pulse && update.pulse !== "N/A" && (
                                  <>
                                    <span>•</span>
                                    <span>Pulse: <strong>{update.pulse}</strong></span>
                                  </>
                                )}
                              </div>
                              <p className="text-sm text-[#1C2826] font-medium leading-relaxed">
                                {update.note}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5 text-xs text-[#5A6563]">
                                <span className="material-symbols-outlined text-[15px] text-[#0F5F5C]">badge</span>
                                <span>Logged by {update.byName}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Direct Care Desk Contact */}
                      <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl flex flex-col gap-2.5">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-[#0F5F5C]">support_agent</span>
                          <span className="text-xs text-[#1C2826] font-bold">
                            Direct Contact: {activeResident.room} Floor Care Desk
                          </span>
                        </div>
                        <p className="text-xs text-[#5A6563] leading-relaxed">
                          For special requests, medication updates, or daily coordination, contact the on-duty floor nursing team:
                        </p>
                        {orgInfo?.phone ? (
                          <a
                            href={formatTelHref(orgInfo.phone)}
                            className="h-10 px-4 bg-[#0F5F5C] hover:bg-[#0B4644] text-white rounded-xl text-xs font-bold shrink-0 flex items-center justify-center gap-2 shadow-sm transition-all"
                          >
                            <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
                            <span>Call {orgInfo.name || "Care Desk"} ({orgInfo.phone})</span>
                          </a>
                        ) : (
                          <div className="h-10 px-4 bg-[#E8E2D8]/50 text-[#5A6563] rounded-xl text-xs font-semibold shrink-0 flex items-center justify-center gap-2">
                            <span>Care desk number not available</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full bg-[#FAF7F2] border-t border-[#E8E2D8] py-8">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-[#5A6563]">
            <p>© 2026 Aastha Senior Community Care India</p>
            <a
              href="tel:14567"
              className="hover:text-[#0F5F5C] transition-colors font-bold flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">phone_in_talk</span>
              <span>Elderline 14567 (Govt. of India)</span>
            </a>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
