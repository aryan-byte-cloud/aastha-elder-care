"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
  runTransaction,
} from "firebase/firestore";
import { CareAlert, Resident } from "@/app/admin/types";

function format12HourTime(d: Date = new Date()): string {
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatTelHref(phone?: string): string {
  if (!phone) return "tel:108";
  const cleaned = phone.replace(/[^\d+]/g, "");
  return `tel:${cleaned}`;
}

export default function VolunteerAlertsPage() {
  const { user, profile } = useAuth();
  const orgId = profile?.orgId || "sukoon-home";

  const [dutyAvailable, setDutyAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "urgent" | "checkin" | "completed">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Firestore Data State
  const [alerts, setAlerts] = useState<CareAlert[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [orgName, setOrgName] = useState<string>("Sukoon Home");
  const [orgPhone, setOrgPhone] = useState<string>("+91 90000 00000");
  const [loading, setLoading] = useState(true);

  // Modal for resolving an alert with a short note
  const [resolvingAlert, setResolvingAlert] = useState<CareAlert | null>(null);
  const [resolutionNote, setResolutionNote] = useState("Senior safe and resting comfortably.");
  const [submittingResolution, setSubmittingResolution] = useState(false);
  const [acceptingAlertId, setAcceptingAlertId] = useState<string | null>(null);
  const [markingArrivedId, setMarkingArrivedId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // 1. Real-time Listeners for Alerts & Residents (Verified Volunteers only)
  useEffect(() => {
    setLoading(true);

    const unsubOrg = onSnapshot(doc(db, "organizations", orgId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setOrgName(data.name || "Sukoon Home");
        setOrgPhone(data.phone || "+91 90000 00000");
      }
    });

    // Only verified volunteers have read permission on alerts and residents
    if (!profile || profile.verified !== true) {
      setAlerts([]);
      setResidents([]);
      setLoading(false);
      return () => unsubOrg();
    }

    const qAlerts = query(collection(db, "alerts"), where("orgId", "==", orgId));
    const unsubAlerts = onSnapshot(qAlerts, (snap) => {
      const list: CareAlert[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          residentId: data.residentId || "",
          orgId: data.orgId || orgId,
          type: data.type || "sos",
          medicineId: data.medicineId,
          status: data.status || "open",
          message: data.message || "",
          createdBy: data.createdBy,
          acceptedBy: data.acceptedBy,
          declinedBy: data.declinedBy || [],
          escalateAt: data.escalateAt,
          timeline: data.timeline || [],
          createdAt: data.createdAt,
        });
      });
      setAlerts(list);
      setLoading(false);
    });

    const qResidents = query(collection(db, "residents"), where("orgId", "==", orgId));
    const unsubResidents = onSnapshot(qResidents, (snap) => {
      const list: Resident[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          name: data.name || "",
          age: data.age || 75,
          room: data.room || "",
          orgId: data.orgId || orgId,
          bloodGroup: data.bloodGroup || "O+",
          conditions: data.conditions || "",
          allergies: data.allergies || "",
          status: data.status || "stable",
          familyUserIds: data.familyUserIds || [],
          inviteCode: data.inviteCode || "",
          createdAt: data.createdAt,
        });
      });
      setResidents(list);
    });

    return () => {
      unsubAlerts();
      unsubResidents();
      unsubOrg();
    };
  }, [orgId, profile?.verified]);

  // Fallback Escalation Checker (Runs ONCE per alert via Firestore Transaction)
  const escalationAttemptedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!profile || profile.verified !== true || alerts.length === 0) return;

    alerts.forEach((alert) => {
      if (alert.type !== "sos" || alert.status !== "open") return;
      if (escalationAttemptedRef.current.has(alert.id)) return;

      escalationAttemptedRef.current.add(alert.id);

      // Determine creation time in milliseconds
      let createdMs = Date.now();
      if (alert.createdAt && typeof (alert.createdAt as any).toMillis === "function") {
        createdMs = (alert.createdAt as any).toMillis();
      } else if (alert.createdAt && typeof (alert.createdAt as any).seconds === "number") {
        createdMs = (alert.createdAt as any).seconds * 1000;
      } else if (alert.escalateAt) {
        createdMs = alert.escalateAt - 60000;
      }

      // 61s delay ensures request.time > createdAt + 60s passes security rules
      const triggerTime = createdMs + 61000;
      const delay = Math.max(0, triggerTime - Date.now());

      setTimeout(async () => {
        try {
          await runTransaction(db, async (transaction) => {
            const alertRef = doc(db, "alerts", alert.id);
            const snap = await transaction.get(alertRef);
            if (!snap.exists()) return;
            const data = snap.data();

            if (data.status === "open") {
              const now12h = format12HourTime(new Date());
              transaction.update(alertRef, {
                status: "escalated",
                timeline: [
                  ...(data.timeline || []),
                  {
                    step: "Escalated (108 call required)",
                    by: "Automated Escalation System",
                    at: now12h,
                  },
                ],
              });
            }
          });
        } catch (err) {
          // If already accepted, escalated, or error, stop silently
          console.log("Volunteer fallback escalation stopped silently:", err);
        }
      }, delay);
    });
  }, [alerts, profile]);



  // Filter alerts: hide if declined by this volunteer
  const visibleAlerts = useMemo(() => {
    if (!user) return [];
    return alerts.filter((a) => !a.declinedBy?.includes(user.uid));
  }, [alerts, user]);

  // Client timer to re-evaluate 60s escalation window in real time without extra Firestore writes
  const [clientNow, setClientNow] = useState(0);
  useEffect(() => {
    setClientNow(Date.now());
    const timer = setInterval(() => setClientNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getAlertCreatedMs = (alert: any): number => {
    if (alert.createdAt && typeof alert.createdAt.toMillis === "function") {
      return alert.createdAt.toMillis();
    }
    if (alert.createdAt && typeof alert.createdAt.seconds === "number") {
      return alert.createdAt.seconds * 1000;
    }
    if (alert.createdAt) {
      const parsed = new Date(alert.createdAt).getTime();
      if (!isNaN(parsed)) return parsed;
    }
    if (alert.escalateAt) {
      return alert.escalateAt - 60000;
    }
    return 0;
  };

  const isAlertOverdueOrEscalated = (alert: any): boolean => {
    if (alert.type !== "sos") return false;
    if (alert.status === "escalated") return true;
    if (alert.status === "open" && clientNow > 0) {
      const createdMs = getAlertCreatedMs(alert);
      return createdMs > 0 && clientNow - createdMs >= 60000;
    }
    return false;
  };

  const escalatedAlerts = useMemo(() => {
    return visibleAlerts.filter(isAlertOverdueOrEscalated);
  }, [visibleAlerts, clientNow]);

  // Tab Filtering
  const filteredAlerts = useMemo(() => {
    if (activeTab === "urgent") {
      return visibleAlerts.filter((a) => a.type === "sos" && a.status !== "resolved");
    }
    if (activeTab === "checkin") {
      return visibleAlerts.filter((a) => a.type !== "sos" && a.status !== "resolved");
    }
    if (activeTab === "completed") {
      return visibleAlerts.filter((a) => a.status === "resolved");
    }
    return visibleAlerts;
  }, [visibleAlerts, activeTab]);

  // ACTION 1: Accept & Go (Strict Transaction: Only ONE volunteer can accept)
  const handleAcceptAlert = async (alert: CareAlert, residentName: string) => {
    if (!user) return;
    setAcceptingAlertId(alert.id);
    try {
      await runTransaction(db, async (transaction) => {
        const alertRef = doc(db, "alerts", alert.id);
        const snap = await transaction.get(alertRef);
        if (!snap.exists()) {
          throw new Error("This care alert is no longer available.");
        }
        const data = snap.data();

        // Only open alerts can be accepted under security rules
        if (data.status !== "open") {
          if (data.status === "escalated") {
            throw new Error("This emergency incident has been escalated (108 call required).");
          }
          const accepterName = data.acceptedBy?.name || "another volunteer";
          throw new Error(`Already accepted by ${accepterName}`);
        }

        const now12h = format12HourTime(new Date());
        const volunteerName = profile?.name || user.displayName || "Suresh K.";
        const volunteerPhone = profile?.phone || "+91 90000 00003 (demo)";

        transaction.update(alertRef, {
          status: "accepted",
          acceptedBy: {
            uid: user.uid,
            name: volunteerName,
            phone: volunteerPhone,
          },
          timeline: [
            ...(data.timeline || []),
            {
              step: "Accepted by volunteer",
              by: volunteerName,
              at: now12h,
            },
          ],
        });
      });

      showToast(`Emergency dispatch confirmed for ${residentName}. En route.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to accept alert.";
      showToast(msg);
    } finally {
      setAcceptingAlertId(null);
    }
  };

  // ACTION 2: Can't Go (Store UID in declinedBy array to hide from this volunteer only)
  const handleDeclineAlert = async (alertId: string, residentName: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "alerts", alertId), {
        declinedBy: arrayUnion(user.uid),
      });
      showToast(`Alert for ${residentName} rerouted to other volunteers in Pune Circle.`);
    } catch (err) {
      console.error("Error declining alert:", err);
      showToast("Could not dismiss alert.");
    }
  };

  // ACTION 3: Mark as Arrived on scene
  const handleMarkArrived = async (alert: CareAlert) => {
    if (!user) return;
    setMarkingArrivedId(alert.id);
    try {
      const now12h = format12HourTime(new Date());
      const volunteerName = profile?.name || user.displayName || "Volunteer";

      await updateDoc(doc(db, "alerts", alert.id), {
        status: "arrived",
        timeline: [
          ...alert.timeline,
          {
            step: "Volunteer arrived on scene",
            by: volunteerName,
            at: now12h,
          },
        ],
      });
      showToast("Doorstep arrival logged. Please verify senior wellbeing.");
    } catch (err) {
      console.error("Error updating arrival:", err);
      showToast("Failed to update arrival status.");
    } finally {
      setMarkingArrivedId(null);
    }
  };

  // ACTION 4: Mark as Resolved with note & restore resident status to stable
  const handleConfirmResolve = async () => {
    if (!user || !resolvingAlert) return;
    setSubmittingResolution(true);

    try {
      const now12h = format12HourTime(new Date());
      const volunteerName = profile?.name || user.displayName || "Volunteer";
      const cleanNote = resolutionNote.trim() || "Senior verified safe and comfortable.";

      await updateDoc(doc(db, "alerts", resolvingAlert.id), {
        status: "resolved",
        timeline: [
          ...resolvingAlert.timeline,
          {
            step: `Resolved: ${cleanNote}`,
            by: volunteerName,
            at: now12h,
          },
        ],
      });

      showToast("Incident successfully resolved.");
      setResolvingAlert(null);
      setResolutionNote("Senior safe and resting comfortably.");
    } catch (err) {
      console.error("Error resolving alert:", err);
      showToast("Failed to resolve alert.");
    } finally {
      setSubmittingResolution(false);
    }
  };

  // Metric counts
  const criticalSosCount = visibleAlerts.filter((a) => a.type === "sos" && a.status !== "resolved").length;
  const checkinCount = visibleAlerts.filter((a) => a.type !== "sos" && a.status !== "resolved").length;
  const completedCount = visibleAlerts.filter((a) => a.status === "resolved").length;

  return (
    <ProtectedRoute allowedRole="volunteer">
      <div className="min-h-screen bg-[#FAF7F2] text-[#1C2826] flex flex-col font-sans">
        {/* Shared Header */}
        <Header />

        {/* Floating Action / Feedback Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#0F5F5C] text-white px-5 py-3.5 rounded-xl shadow-lg border border-[#0B4644] flex items-center gap-3 animate-fade-in">
            <span className="material-symbols-outlined text-[22px] text-[#A7F3D0]">check_circle</span>
            <p className="text-sm font-semibold">{toastMessage}</p>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-auto text-white/80 hover:text-white"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        {/* MAIN BODY */}
        <main className="w-full pt-28 pb-16 bg-[#FAF7F2] flex-grow">
          <div className="max-w-[1280px] w-full mx-auto px-6 lg:px-12 flex flex-col gap-8">
            {/* 1. Verification Gate for Non-Verified Volunteers */}
            {profile && profile.verified !== true ? (
              profile.verificationStatus === "rejected" ? (
                <div className="bg-white rounded-2xl p-10 border border-red-300 shadow-sm flex flex-col items-center text-center max-w-lg mx-auto gap-4 my-8">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[36px]">cancel</span>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-[#1C2826]">Application Not Approved</h2>
                    <p className="text-sm text-[#5A6563] leading-relaxed">
                      Your application was not approved by {orgName || "the organization administration"}. Please contact the care desk if you believe this was in error.
                    </p>
                  </div>
                  <div className="pt-2 w-full flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/"
                      className="w-full h-11 px-4 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C2826] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Back Home</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-10 border border-amber-300 shadow-sm flex flex-col items-center text-center max-w-lg mx-auto gap-4 my-8">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[36px]">hourglass_top</span>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-[#1C2826]">Verification Pending</h2>
                    <p className="text-sm text-[#5A6563] leading-relaxed">
                      Your account is awaiting verification by {orgName}. Once approved by the local coordinator, live emergency alerts and neighborhood check-ins in your circle will appear here.
                    </p>
                  </div>
                  <div className="pt-2 w-full flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/volunteer/register"
                      className="flex-1 h-11 px-4 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                      <span>Check Registration Status</span>
                    </Link>
                    <Link
                      href="/"
                      className="flex-1 h-11 px-4 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C2826] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Back Home</span>
                    </Link>
                  </div>
                </div>
              )
            ) : (
              <>
                {/* 2. CRITICAL ESCALATED SOS RED BANNER */}
                {escalatedAlerts.length > 0 && (
                  <div className="bg-red-700 text-white px-6 py-4 rounded-2xl shadow-lg border border-red-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[32px] text-white">emergency_home</span>
                      <div>
                        <h4 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                          <span>CRITICAL ESCALATION: No volunteer responded in 60s</span>
                        </h4>
                        <p className="text-xs text-red-100">
                          No volunteer responded in 60s. Care desk must call 108 now.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href="tel:108"
                        className="px-4 py-2 bg-white text-red-700 font-bold text-xs rounded-xl hover:bg-red-50 transition-colors shrink-0 shadow-sm flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">call</span>
                        <span>Call 108 Ambulance</span>
                      </a>
                      <a
                        href={formatTelHref(orgPhone)}
                        className="px-4 py-2 bg-red-900/60 border border-red-400 text-white font-bold text-xs rounded-xl hover:bg-red-900 transition-colors shrink-0 shadow-sm flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">phone</span>
                        <span>Care Desk: {orgPhone}</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* 3. Top Dispatch Control Bar */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#E8E2D8] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[#0F5F5C] text-xs font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[18px]">near_me</span>
                      <span>LIVE DISPATCH NETWORK • PUNE CIRCLE</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2826] tracking-tight">
                      Active Volunteer Care Alerts
                    </h1>
                    <p className="text-sm text-[#5A6563]">
                      Assigned requests within your local neighbourhood (<strong className="text-[#1C2826]">Pune Circle</strong>) • {profile?.name || user?.displayName || "Suresh K."}
                    </p>
                  </div>

                  {/* Volunteer Duty Status Card */}
                  <div className="flex items-center gap-4 bg-[#FAF7F2] border border-[#E8E2D8] px-5 py-3.5 rounded-2xl self-start lg:self-center">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-3.5 w-3.5">
                        {dutyAvailable ? (
                          <>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0F5F5C] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#0F5F5C]"></span>
                          </>
                        ) : (
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gray-400"></span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#1C2826] leading-tight">
                          {dutyAvailable ? "Available for requests" : "Duty Paused"}
                        </span>
                        <span className="text-xs text-[#5A6563]">
                          {dutyAvailable ? "Status: Priority Responder" : "Status: Off Duty"}
                        </span>
                      </div>
                    </div>
                    <button
                      aria-pressed={dutyAvailable}
                      onClick={() => setDutyAvailable(!dutyAvailable)}
                      className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none p-0.5 ${
                        dutyAvailable ? "bg-[#0F5F5C]" : "bg-gray-300"
                      }`}
                      title="Toggle Duty Status"
                      type="button"
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                          dutyAvailable ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* 4. Real-time Metrics Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">fmd_bad</span>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-[#1C2826] leading-none">{criticalSosCount}</p>
                      <p className="text-xs font-semibold text-[#5A6563] mt-1">Critical SOS</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#E8F3EE] text-[#0F5F5C] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">partner_exchange</span>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-[#1C2826] leading-none">{checkinCount}</p>
                      <p className="text-xs font-semibold text-[#5A6563] mt-1">Check-in Visit</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#0F5F5C] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">near_me</span>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-[#1C2826] leading-none">650 m</p>
                      <p className="text-xs font-semibold text-[#5A6563] mt-1">Avg. Radius</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#E8F3EE] text-[#0F5F5C] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">task_alt</span>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-[#1C2826] leading-none">{completedCount}</p>
                      <p className="text-xs font-semibold text-[#5A6563] mt-1">Completed Today</p>
                    </div>
                  </div>
                </div>

                {/* 5. Filter Tab Bar */}
                <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-[#E8E2D8] rounded-2xl w-fit" role="tablist">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      activeTab === "all"
                        ? "bg-[#0F5F5C] text-white shadow-sm"
                        : "text-[#5A6563] hover:text-[#1C2826]"
                    }`}
                    type="button"
                  >
                    All Alerts ({visibleAlerts.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("urgent")}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "urgent"
                        ? "bg-red-700 text-white shadow-sm"
                        : "text-red-700 hover:bg-red-50"
                    }`}
                    type="button"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    Urgent SOS ({criticalSosCount})
                  </button>
                  <button
                    onClick={() => setActiveTab("checkin")}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      activeTab === "checkin"
                        ? "bg-[#0F5F5C] text-white shadow-sm"
                        : "text-[#5A6563] hover:text-[#1C2826]"
                    }`}
                    type="button"
                  >
                    Check-in Visits ({checkinCount})
                  </button>
                  <button
                    onClick={() => setActiveTab("completed")}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      activeTab === "completed"
                        ? "bg-[#0F5F5C] text-white shadow-sm"
                        : "text-[#5A6563] hover:text-[#1C2826]"
                    }`}
                    type="button"
                  >
                    Completed ({completedCount})
                  </button>
                </div>

                {/* 6. Real Alert Cards Container */}
                <div className="flex flex-col gap-6">
                  {filteredAlerts.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 border border-[#E8E2D8] text-center flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#E8F3EE] text-[#0F5F5C] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[28px]">task_alt</span>
                      </div>
                      <h3 className="text-base font-bold text-[#1C2826]">
                        No care alerts in this queue
                      </h3>
                      <p className="text-xs text-[#5A6563] max-w-sm">
                        All seniors in Pune Circle are currently safe and checked in. Live dispatches will appear here automatically.
                      </p>
                    </div>
                  ) : (
                    filteredAlerts.map((alert) => {
                      const res = residents.find((r) => r.id === alert.residentId);
                      const isSos = alert.type === "sos";
                      const isAcceptedByMe = alert.acceptedBy?.uid === user?.uid;
                      const isAcceptedByOther = alert.acceptedBy && alert.acceptedBy.uid !== user?.uid;
                      const mapsQuery = res?.room?.includes("home")
                        ? "Model Colony Pune"
                        : `${orgName} Pune`;

                      return (
                        <article
                          key={alert.id}
                          className={`bg-white rounded-2xl p-6 md:p-8 border-2 transition-all shadow-sm ${
                            alert.status === "resolved"
                              ? "opacity-80 border-[#E8E2D8] bg-[#FAF7F2]/50"
                              : alert.status === "escalated"
                              ? "border-red-600 ring-2 ring-red-600/20 bg-red-50/10"
                              : isSos
                              ? "border-red-400 hover:border-red-500"
                              : isAcceptedByMe
                              ? "border-[#0F5F5C] ring-2 ring-[#0F5F5C]/20"
                              : "border-[#E8E2D8] hover:border-[#0F5F5C]"
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
                            {/* Left Info Column */}
                            <div className="flex flex-col gap-4 flex-1 min-w-0">
                              {/* Badge Strip */}
                              <div className="flex flex-wrap items-center gap-2">
                                {isSos ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-extrabold">
                                    <span className="material-symbols-outlined text-[16px] animate-pulse">emergency</span>
                                    Urgent SOS Alert (simulated)
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
                                    <span className="material-symbols-outlined text-[16px]">accessibility_new</span>
                                    Care Request
                                  </span>
                                )}

                                {isAlertOverdueOrEscalated(alert) && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-700 text-white rounded-full text-xs font-black animate-pulse">
                                    <span className="material-symbols-outlined text-[15px]">emergency</span>
                                    Escalated (108 call required)
                                  </span>
                                )}

                                {alert.status === "resolved" ? (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E8F3EE] text-[#0F5F5C] rounded-full text-xs font-bold">
                                    <span className="material-symbols-outlined text-[15px]">task_alt</span>
                                    Resolved
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563] rounded-full text-xs font-semibold">
                                    <span className="material-symbols-outlined text-[15px]">schedule</span>
                                    {alert.timeline[0]?.at || "Just now"}
                                  </span>
                                )}

                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E8F3EE] text-[#0F5F5C] text-xs font-bold rounded-full">
                                  <span className="material-symbols-outlined text-[15px]">verified</span>
                                  {orgName} Circle
                                </span>
                              </div>

                              {/* Profile & Proximity */}
                              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 pt-1">
                                <h2 className="text-2xl font-extrabold text-[#1C2826]">
                                  {res?.name || "Senior Resident"} ({res?.age || 75} yrs)
                                </h2>
                                <span className="text-[#5A6563] text-sm flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[#0F5F5C] text-[18px]">location_on</span>
                                  <strong className="text-[#1C2826]">{res?.room || "Pune Circle"}</strong>
                                </span>
                              </div>

                              {/* Medical & Situation Context Box */}
                              <div
                                className={`border p-4 rounded-xl flex items-start gap-3 ${
                                  isSos ? "bg-red-50/70 border-red-200" : "bg-[#FAF7F2] border-[#E8E2D8]"
                                }`}
                              >
                                <span
                                  className={`material-symbols-outlined text-[24px] shrink-0 mt-0.5 ${
                                    isSos ? "text-red-600" : "text-[#0F5F5C]"
                                  }`}
                                >
                                  {isSos ? "medical_information" : "health_and_safety"}
                                </span>
                                <div className="flex flex-col gap-0.5">
                                  <span
                                    className={`text-xs font-extrabold uppercase tracking-wider ${
                                      isSos ? "text-red-800" : "text-[#1C2826]"
                                    }`}
                                  >
                                    {isSos ? "Critical Emergency Advisory" : "Care & Visit Details"}
                                  </span>
                                  <p
                                    className={`text-sm leading-relaxed ${
                                      isSos ? "text-red-900 font-medium" : "text-[#5A6563]"
                                    }`}
                                  >
                                    {alert.message ||
                                      (isSos
                                        ? "Senior triggered emergency SOS button. Requesting doorstep volunteer verification and wellbeing confirmation."
                                        : "Routine health welfare verification.")}
                                  </p>
                                </div>
                              </div>

                              {/* Medical Details Badges */}
                              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                                <span className="px-3 py-1 bg-[#FAF7F2] border border-[#E8E2D8] rounded-lg font-semibold text-[#5A6563] flex items-center gap-1">
                                  <span>Blood Group:</span>
                                  <strong className="text-[#1C2826]">{res?.bloodGroup || "O+"}</strong>
                                </span>
                                <span className="px-3 py-1 bg-[#FAF7F2] border border-[#E8E2D8] rounded-lg font-semibold text-[#5A6563] flex items-center gap-1">
                                  <span>Conditions:</span>
                                  <strong className="text-[#1C2826]">{res?.conditions || "Routine care"}</strong>
                                </span>
                                <a
                                  href={`https://maps.google.com/?q=${encodeURIComponent(mapsQuery)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0F5F5C] hover:underline bg-[#E8F3EE] px-3 py-1 rounded-lg"
                                >
                                  <span className="material-symbols-outlined text-[16px]">map</span>
                                  <span>Open in Google Maps</span>
                                </a>
                              </div>

                              {/* Timeline progression display */}
                              {alert.timeline.length > 0 && (
                                <div className="pt-2 border-t border-[#E8E2D8]/80 flex flex-col gap-1.5">
                                  <span className="text-[11px] font-bold text-[#5A6563] uppercase tracking-wider">
                                    Incident Timeline
                                  </span>
                                  <div className="flex flex-wrap gap-2 text-xs text-[#5A6563]">
                                    {alert.timeline.map((step, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E8E2D8] text-[11px]"
                                      >
                                        <span className="material-symbols-outlined text-[14px] text-[#0F5F5C]">check</span>
                                        <strong className="text-[#1C2826]">{step.step}</strong> ({step.at})
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Right Action Panel */}
                            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-64 shrink-0 pt-2 lg:pt-0">
                              {/* State A: Open (Volunteer can Accept & go or Can't go) */}
                              {alert.status === "open" && !isAlertOverdueOrEscalated(alert) && (
                                <>
                                  <button
                                    onClick={() => handleAcceptAlert(alert, res?.name || "Resident")}
                                    disabled={acceptingAlertId === alert.id}
                                    className={`h-12 w-full px-5 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50 ${
                                      isSos ? "bg-red-700 hover:bg-red-800" : "bg-[#0F5F5C] hover:bg-[#0B4644]"
                                    }`}
                                    type="button"
                                  >
                                    <span className="material-symbols-outlined text-[20px]">directions_run</span>
                                    <span>{acceptingAlertId === alert.id ? "Accepting..." : "Accept & go"}</span>
                                  </button>

                                  <button
                                    onClick={() => handleDeclineAlert(alert.id, res?.name || "Resident")}
                                    className="h-12 w-full px-5 bg-white border border-[#E8E2D8] hover:bg-[#FAF7F2] text-[#5A6563] font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    type="button"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                    <span>Can&apos;t go</span>
                                  </button>

                                  <a
                                    href={formatTelHref(orgPhone)}
                                    className="h-10 w-full px-3 bg-[#FAF7F2] border border-[#E8E2D8] text-[#0F5F5C] hover:bg-[#F3EEE6] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">call</span>
                                    <span>Call Care Desk: {orgPhone}</span>
                                  </a>
                                </>
                              )}

                              {/* State A2: Escalated (108 call required) */}
                              {(alert.status === "escalated" || (alert.status === "open" && isAlertOverdueOrEscalated(alert))) && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex flex-col items-center text-center gap-2">
                                  <span className="material-symbols-outlined text-[24px] text-red-700">emergency_home</span>
                                  <span className="text-xs font-bold text-red-900">
                                    Escalated (108 call required)
                                  </span>
                                  <span className="text-[11px] text-red-700">
                                    No volunteer responded in 60s. Care desk must call 108 now.
                                  </span>
                                  <div className="flex flex-col w-full gap-2 mt-1">
                                    <a
                                      href="tel:108"
                                      className="h-10 w-full px-3 bg-red-700 text-white hover:bg-red-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                      <span className="material-symbols-outlined text-[16px]">call</span>
                                      <span>Call 108 Ambulance</span>
                                    </a>
                                    <a
                                      href={formatTelHref(orgPhone)}
                                      className="h-10 w-full px-3 bg-white border border-red-300 text-red-800 hover:bg-red-50 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                      <span className="material-symbols-outlined text-[16px]">phone</span>
                                      <span>Care Desk: {orgPhone}</span>
                                    </a>
                                  </div>
                                </div>
                              )}

                              {/* State B: Accepted by Current Volunteer */}
                              {alert.status === "accepted" && isAcceptedByMe && (
                                <div className="p-4 bg-[#E8F3EE] border border-[#BDE0D1] rounded-xl flex flex-col items-center text-center gap-3">
                                  <div className="flex items-center gap-2 text-[#0F5F5C]">
                                    <span className="material-symbols-outlined text-[24px]">navigation</span>
                                    <span className="text-sm font-bold">En Route to Senior</span>
                                  </div>
                                  <p className="text-xs text-[#5A6563]">
                                    You have accepted this dispatch. Click below once you reach the senior&apos;s location.
                                  </p>
                                  <button
                                    onClick={() => handleMarkArrived(alert)}
                                    disabled={markingArrivedId === alert.id}
                                    className="w-full h-11 bg-[#0F5F5C] hover:bg-[#0B4644] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                                    type="button"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">pin_drop</span>
                                    <span>{markingArrivedId === alert.id ? "Updating..." : "Arrived at Location"}</span>
                                  </button>
                                </div>
                              )}

                              {/* State C: Accepted by ANOTHER volunteer */}
                              {alert.status === "accepted" && isAcceptedByOther && (
                                <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl flex flex-col items-center text-center gap-2">
                                  <span className="material-symbols-outlined text-[24px] text-[#5A6563]">how_to_reg</span>
                                  <span className="text-xs font-bold text-[#1C2826]">
                                    Already accepted by {alert.acceptedBy?.name}
                                  </span>
                                  <span className="text-[11px] text-[#5A6563]">
                                    Responder is currently en route to resident.
                                  </span>
                                </div>
                              )}

                              {/* State D: Arrived on Scene (Current Volunteer) */}
                              {alert.status === "arrived" && isAcceptedByMe && (
                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col items-center text-center gap-3">
                                  <div className="flex items-center gap-2 text-amber-900">
                                    <span className="material-symbols-outlined text-[24px]">contact_phone</span>
                                    <span className="text-sm font-bold">On Scene with Senior</span>
                                  </div>
                                  <p className="text-xs text-amber-800">
                                    Confirm resident wellbeing and check essentials. When done, mark as resolved.
                                  </p>
                                  <button
                                    onClick={() => setResolvingAlert(alert)}
                                    className="w-full h-11 bg-[#0F5F5C] hover:bg-[#0B4644] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                    type="button"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                    <span>Mark as Resolved</span>
                                  </button>
                                </div>
                              )}

                              {/* State E: Arrived on Scene (Another Volunteer) */}
                              {alert.status === "arrived" && isAcceptedByOther && (
                                <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl flex flex-col items-center text-center gap-2">
                                  <span className="material-symbols-outlined text-[24px] text-[#0F5F5C]">pin_drop</span>
                                  <span className="text-xs font-bold text-[#1C2826]">
                                    {alert.acceptedBy?.name} is on scene
                                  </span>
                                  <span className="text-[11px] text-[#5A6563]">
                                    Wellbeing check in progress.
                                  </span>
                                </div>
                              )}

                              {/* State F: Resolved */}
                              {alert.status === "resolved" && (
                                <div className="p-4 bg-[#E8F3EE] border border-[#BDE0D1] rounded-xl flex flex-col items-center text-center gap-1.5">
                                  <span className="material-symbols-outlined text-[#0F5F5C] text-[24px]">verified</span>
                                  <span className="text-xs font-bold text-[#0F5F5C]">Incident Completed</span>
                                  <span className="text-[11px] text-[#5A6563]">
                                    Logged to community care register.
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>

                {/* 7. Safety & Protocol Reminder Banner */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#E8E2D8] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[28px]">shield</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-base font-bold text-[#1C2826]">
                        Volunteer Safety &amp; Emergency Protocol Reminder
                      </h4>
                      <p className="text-sm text-[#5A6563] leading-relaxed max-w-2xl">
                        Remember: Never administer prescription medications without certified nursing authorization. In life-threatening emergencies, dial{" "}
                        <strong className="text-red-700 font-bold">112 / 108</strong> immediately.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0 self-stretch md:self-auto">
                    <a
                      href="tel:112"
                      className="flex-1 md:flex-initial h-11 px-4 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">emergency</span>
                      <span>Dial 112 (Police/Fire)</span>
                    </a>
                    <a
                      href="tel:108"
                      className="flex-1 md:flex-initial h-11 px-4 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">ambulance</span>
                      <span>Dial 108 (Ambulance)</span>
                    </a>
                    <Link
                      href="/volunteer/register"
                      className="flex-1 md:flex-initial h-11 px-4 bg-white hover:bg-[#FAF7F2] border border-[#E8E2D8] text-[#0F5F5C] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                      <span>Registration Status</span>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>

        {/* MODAL: Resolve Alert with short note */}
        {resolvingAlert && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-xl max-w-md w-full p-6 animate-scale-up flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0F5F5C] text-[24px]">task_alt</span>
                  <h3 className="text-base font-bold text-[#1C2826]">Resolve Care Incident</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setResolvingAlert(null)}
                  className="text-[#5A6563] hover:text-[#1C2826] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <p className="text-xs text-[#5A6563]">
                Provide a short resolution note for the care log. This will restore the resident&apos;s status to stable.
              </p>

              <div className="flex flex-col gap-1.5 text-xs">
                <label className="font-bold text-[#1C2826]">Resolution Note *</label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="e.g. Senior safe, blood pressure stable, resting comfortably."
                  required
                  className="p-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C] resize-none"
                />
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setResolutionNote("Senior safe and resting comfortably.")}
                  className="px-2.5 py-1 bg-[#FAF7F2] border border-[#E8E2D8] rounded-lg text-[#5A6563] hover:text-[#1C2826]"
                >
                  Resting comfortably
                </button>
                <button
                  type="button"
                  onClick={() => setResolutionNote("Vitals verified stable, caregiver on site.")}
                  className="px-2.5 py-1 bg-[#FAF7F2] border border-[#E8E2D8] rounded-lg text-[#5A6563] hover:text-[#1C2826]"
                >
                  Vitals verified stable
                </button>
                <button
                  type="button"
                  onClick={() => setResolutionNote("False alarm confirmed. Senior is well.")}
                  className="px-2.5 py-1 bg-[#FAF7F2] border border-[#E8E2D8] rounded-lg text-[#5A6563] hover:text-[#1C2826]"
                >
                  False alarm / Senior well
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResolvingAlert(null)}
                  disabled={submittingResolution}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A6563] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResolve}
                  disabled={submittingResolution || !resolutionNote.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {submittingResolution ? "Saving..." : "Confirm & Resolve"}
                </button>
              </div>
            </div>
          </div>
        )}

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
