"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { formatTelHref } from "@/lib/utils";
import ResidentWelfareView from "@/components/ResidentWelfareView";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs,
  runTransaction,
  setDoc,
  arrayUnion,
  arrayRemove,
  writeBatch,
} from "firebase/firestore";
import {
  Resident,
  Medicine,
  DoseLog,
  CareAlert,
  ResidentStatus,
  HealthUpdate,
  VolunteerUser,
  FamilyRequest,
  OrganizationInfo,
} from "./types";

function generateInviteCode(): string {
  // 8-character random code without confusing characters (no 0, O, 1, I)
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

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

export default function AdminDashboard() {
  const { user, profile, role, logout } = useAuth();
  const router = useRouter();
  const orgId = profile?.orgId || "sukoon-home";

  // Route protection: Non-approved admins must be redirected to /pending (Requirement 2)
  useEffect(() => {
    if (role === "admin" && profile?.orgStatus && profile.orgStatus !== "approved") {
      router.replace("/pending");
    }
  }, [role, profile, router]);

  // Data states from real-time listeners
  const [residents, setResidents] = useState<Resident[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([]);
  const [alerts, setAlerts] = useState<CareAlert[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerUser[]>([]);
  const [familyRequests, setFamilyRequests] = useState<FamilyRequest[]>([]);
  const [orgUsers, setOrgUsers] = useState<Record<string, { name: string; phone?: string; email?: string }>>({});
  const [orgInfo, setOrgInfo] = useState<OrganizationInfo>({
    id: orgId,
    name: "Sukoon Home",
    phone: "+91 90000 00001 (demo)",
    address: "Model Colony, Shivajinagar, Pune 411016",
  });
  const [showEditOrgModal, setShowEditOrgModal] = useState(false);
  const [editOrgPhone, setEditOrgPhone] = useState("+91 90000 00001 (demo)");
  const [savingOrgPhone, setSavingOrgPhone] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Demo Clock State (simulated offset in minutes)
  const [demoOffsetMinutes, setDemoOffsetMinutes] = useState(0);
  const [baseTime, setBaseTime] = useState<Date>(new Date());

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "residents" | "medicines" | "alerts" | "volunteers" | "welfare"
  >("dashboard");
  const [selectedWelfareResidentId, setSelectedWelfareResidentId] = useState<string>("");
  const [residentFilter, setResidentFilter] = useState<"all" | "attention" | "stable">("all");
  const [volunteerFilter, setVolunteerFilter] = useState<"all" | "pending" | "verified">("all");

  const [showAddResidentModal, setShowAddResidentModal] = useState(false);
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Health Update Modal
  const [healthUpdateResident, setHealthUpdateResident] = useState<Resident | null>(null);
  const [updateBp, setUpdateBp] = useState("120/80 mmHg");
  const [updatePulse, setUpdatePulse] = useState("72 bpm");
  const [updateMood, setUpdateMood] = useState("Happy / Calm");
  const [updateNote, setUpdateNote] = useState("Resting comfortably, morning meal completed.");
  const [savingHealthUpdate, setSavingHealthUpdate] = useState(false);

  // Edit Resident Modal
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editRoom, setEditRoom] = useState("");
  const [editBlood, setEditBlood] = useState("B+");
  const [editConditions, setEditConditions] = useState("");
  const [editAllergies, setEditAllergies] = useState("");
  const [editPhoto, setEditPhoto] = useState("");
  const [savingEditResident, setSavingEditResident] = useState(false);

  // Resolve Alert Modal (Admin flow requiring short note)
  const [resolvingAlert, setResolvingAlert] = useState<CareAlert | null>(null);
  const [resolveNote, setResolveNote] = useState("Senior verified safe and well by care administrator.");
  const [savingResolveAlert, setSavingResolveAlert] = useState(false);

  // Button disabled saving states to prevent double submission
  const [savingResident, setSavingResident] = useState(false);
  const [savingMedicine, setSavingMedicine] = useState(false);

  // SOS Countdown state (10s countdown on Trigger SOS)
  const [sosCountdownResident, setSosCountdownResident] = useState<Resident | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState(10);

  // Add Resident Form
  const [newResName, setNewResName] = useState("");
  const [newResAge, setNewResAge] = useState("");
  const [newResRoom, setNewResRoom] = useState("");
  const [newResBlood, setNewResBlood] = useState("B+");
  const [newResConditions, setNewResConditions] = useState("");
  const [newResAllergies, setNewResAllergies] = useState("None reported");
  const [newResPhoto, setNewResPhoto] = useState("");

  const handlePhotoFileToDataUrl = (
    file: File,
    onSuccess: (url: string) => void,
    onError?: (err: string) => void
  ) => {
    if (file.size > 2 * 1024 * 1024) {
      if (onError) onError("Photo must be under 2MB");
      showToast("Photo must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      if (res) onSuccess(res);
    };
    reader.readAsDataURL(file);
  };

  // Add Medicine Form
  const [newMedResidentId, setNewMedResidentId] = useState("");
  const [newMedName, setNewMedName] = useState("");
  const [newMedDose, setNewMedDose] = useState("");
  const [newMedTime, setNewMedTime] = useState("09:00");
  const [newMedInstructions, setNewMedInstructions] = useState("");

  const showToast = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // Clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setBaseTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const simulatedDate = useMemo(() => {
    return new Date(baseTime.getTime() + demoOffsetMinutes * 60000);
  }, [baseTime, demoOffsetMinutes]);

  const currentDayStr = useMemo(() => {
    const y = simulatedDate.getFullYear();
    const m = String(simulatedDate.getMonth() + 1).padStart(2, "0");
    const d = String(simulatedDate.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [simulatedDate]);

  const currentMinutesOfDay = useMemo(() => {
    return simulatedDate.getHours() * 60 + simulatedDate.getMinutes();
  }, [simulatedDate]);

  // Demo Time String: used for ALL timeline entries so events stay strictly chronological
  const formattedSimulatedTime = useMemo(() => {
    const h = simulatedDate.getHours();
    const m = simulatedDate.getMinutes();
    const pad = (n: number) => String(n).padStart(2, "0");
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${pad(displayH)}:${pad(m)} ${period}`;
  }, [simulatedDate]);

  // Real-time Firestore Listeners
  useEffect(() => {
    setLoadingData(true);

    const qResidents = query(collection(db, "residents"), where("orgId", "==", orgId));
    const unsubResidents = onSnapshot(qResidents, (snapshot) => {
      const resList: Resident[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        resList.push({
          id: d.id,
          name: data.name || "",
          age: data.age || 0,
          room: data.room || "",
          orgId: data.orgId || orgId,
          bloodGroup: data.bloodGroup || "O+",
          conditions: data.conditions || "",
          allergies: data.allergies || "",
          status: (data.status as ResidentStatus) || "stable",
          attentionReason: data.attentionReason || "",
          familyUserIds: data.familyUserIds || [],
          inviteCode: data.inviteCode || "",
          createdAt: data.createdAt,
        });
      });
      setResidents(resList);
      setLoadingData(false);
    });

    const qMedicines = query(collection(db, "medicines"), where("orgId", "==", orgId));
    const unsubMedicines = onSnapshot(qMedicines, (snapshot) => {
      const medList: Medicine[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        medList.push({
          id: d.id,
          residentId: data.residentId || "",
          orgId: data.orgId || orgId,
          name: data.name || "",
          dose: data.dose || "",
          time: data.time || "09:00",
          instructions: data.instructions || "",
        });
      });
      setMedicines(medList);
    });

    const qDoseLogs = query(collection(db, "doseLogs"), where("orgId", "==", orgId));
    const unsubDoseLogs = onSnapshot(qDoseLogs, (snapshot) => {
      const logsList: DoseLog[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        logsList.push({
          id: d.id,
          medicineId: data.medicineId || "",
          residentId: data.residentId || "",
          orgId: data.orgId || orgId,
          date: data.date || "",
          status: "given",
          givenAt: data.givenAt,
          givenBy: data.givenBy || "",
        });
      });
      setDoseLogs(logsList);
    });

    const qAlerts = query(collection(db, "alerts"), where("orgId", "==", orgId));
    const unsubAlerts = onSnapshot(qAlerts, (snapshot) => {
      const alertList: CareAlert[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        alertList.push({
          id: d.id,
          residentId: data.residentId || "",
          orgId: data.orgId || orgId,
          type: data.type || "missed_dose",
          medicineId: data.medicineId,
          status: data.status || "open",
          message: data.message || "",
          createdBy: data.createdBy,
          acceptedBy: data.acceptedBy,
          declinedBy: data.declinedBy,
          escalateAt: data.escalateAt,
          timeline: data.timeline || [],
          createdAt: data.createdAt,
        });
      });
      setAlerts(alertList);
    });

    // Volunteers in this org
    const qVolunteers = query(
      collection(db, "users"),
      where("orgId", "==", orgId),
      where("role", "==", "volunteer")
    );
    const unsubVolunteers = onSnapshot(qVolunteers, (snapshot) => {
      const volList: VolunteerUser[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        volList.push({
          uid: d.id,
          name: data.name || "Volunteer",
          email: data.email || "",
          phone: data.phone || "",
          role: "volunteer",
          orgId: data.orgId || orgId,
          verified: Boolean(data.verified),
          skills: data.skills || "Companionship, Daily check-ins",
          area: data.area || "Pune Circle",
          createdAt: data.createdAt,
        });
      });
      setVolunteers(volList);
    });

    // Organization info
    const unsubOrg = onSnapshot(doc(db, "organizations", orgId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setOrgInfo({
          id: snapshot.id,
          name: data.name || "Sukoon Home",
          phone: data.phone || "+91 90000 00001 (demo)",
          address: data.address || "Pune Circle",
        });
        setEditOrgPhone(data.phone || "+91 90000 00001 (demo)");
      } else {
        setOrgInfo({
          id: orgId,
          name: "Sukoon Home",
          phone: "+91 90000 00001 (demo)",
          address: "Pune Circle",
        });
        setEditOrgPhone("+91 90000 00001 (demo)");
      }
    });

    // Family requests in this org
    const qFamilyRequests = query(
      collection(db, "familyRequests"),
      where("orgId", "==", orgId)
    );
    const unsubFamilyRequests = onSnapshot(qFamilyRequests, (snapshot) => {
      const list: FamilyRequest[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          residentId: data.residentId || "",
          orgId: data.orgId || orgId,
          userId: data.userId || "",
          name: data.name || "Family Member",
          phone: data.phone || "",
          relationship: data.relationship || "Family",
          status: data.status || "pending",
          createdAt: data.createdAt,
        });
      });
      setFamilyRequests(list);
    });

    // All users in this org (to look up family member details)
    const qAllUsers = query(
      collection(db, "users"),
      where("orgId", "==", orgId)
    );
    const unsubAllUsers = onSnapshot(qAllUsers, (snapshot) => {
      const map: Record<string, { name: string; phone?: string; email?: string }> = {};
      snapshot.forEach((d) => {
        const data = d.data();
        map[d.id] = {
          name: data.name || "Family Member",
          phone: data.phone || "",
          email: data.email || "",
        };
      });
      setOrgUsers(map);
    });

    return () => {
      unsubResidents();
      unsubMedicines();
      unsubDoseLogs();
      unsubAlerts();
      unsubVolunteers();
      unsubOrg();
      unsubFamilyRequests();
      unsubAllUsers();
    };
  }, [orgId]);

  // Automated Missed-Dose Detection (Runs every 30s)
  useEffect(() => {
    if (loadingData) return;

    const checkMissedDoses = async () => {
      for (const med of medicines) {
        const medMins = parseTimeToMinutes(med.time);
        const overdueMins = currentMinutesOfDay - medMins;

        if (overdueMins > 15) {
          const alreadyGiven = doseLogs.some(
            (log) => log.medicineId === med.id && log.date === currentDayStr && log.status === "given"
          );

          const hasOpenAlert = alerts.some(
            (a) => a.medicineId === med.id && a.type === "missed_dose" && a.status === "open"
          );

          if (!alreadyGiven && !hasOpenAlert) {
            const resident = residents.find((r) => r.id === med.residentId);
            const residentName = resident?.name || "Resident";
            const overdueMsg = `${convert24to12(med.time)} ${med.name} (${med.dose}) not given – ${overdueMins} min overdue`;

            const timelineSteps = [
              {
                step: "Missed dose detected (15+ min overdue)",
                by: "Automated Telemetry",
                at: formattedSimulatedTime,
              },
            ];

            // Add "Family notified (in-app)" if resident has linked family members
            if (resident?.familyUserIds && resident.familyUserIds.length > 0) {
              timelineSteps.push({
                step: "Family notified (in-app)",
                by: "Automated Dispatch",
                at: formattedSimulatedTime,
              });
            }

            timelineSteps.push({
              step: "Care desk flagged for follow-up",
              by: "System Dispatch",
              at: formattedSimulatedTime,
            });

            try {
              await addDoc(collection(db, "alerts"), {
                residentId: med.residentId,
                orgId: orgId,
                type: "missed_dose",
                medicineId: med.id,
                status: "open",
                message: `${residentName}: ${overdueMsg}`,
                timeline: timelineSteps,
                createdAt: serverTimestamp(),
              });

              await updateDoc(doc(db, "residents", med.residentId), {
                status: "attention",
                attentionReason: overdueMsg,
              });
            } catch (err) {
              console.error("Error creating missed dose alert:", err);
            }
          }
        }
      }
    };

    checkMissedDoses();
    const interval = setInterval(checkMissedDoses, 30000);
    return () => clearInterval(interval);
  }, [
    currentMinutesOfDay,
    currentDayStr,
    formattedSimulatedTime,
    medicines,
    doseLogs,
    alerts,
    residents,
    loadingData,
    orgId,
  ]);

  // Escalation Checker (Transaction: runs once when escalateAt passes)
  useEffect(() => {
    const checkEscalations = async () => {
      const now = Date.now();
      const openSosAlerts = alerts.filter(
        (a) => a.type === "sos" && a.status === "open" && a.escalateAt && a.escalateAt <= now
      );

      for (const alert of openSosAlerts) {
        try {
          await runTransaction(db, async (transaction) => {
            const alertRef = doc(db, "alerts", alert.id);
            const snap = await transaction.get(alertRef);
            if (!snap.exists()) return;
            const data = snap.data();
            if (data.status === "open" && data.escalateAt && data.escalateAt <= Date.now()) {
              transaction.update(alertRef, {
                status: "escalated",
                timeline: [
                  ...(data.timeline || []),
                  {
                    step: "Escalated (108 call required)",
                    by: "Automated Escalation System",
                    at: formattedSimulatedTime,
                  },
                ],
              });
            }
          });
        } catch (err) {
          console.error("Escalation check error:", err);
        }
      }
    };

    const timer = setInterval(checkEscalations, 2000);
    return () => clearInterval(timer);
  }, [alerts, formattedSimulatedTime]);

  // Auto-sync resident status back to stable when all alerts are resolved (e.g. by volunteer)
  useEffect(() => {
    if (loadingData || !user || residents.length === 0) return;

    residents.forEach(async (res) => {
      if (res.status === "sos" || res.status === "attention") {
        const hasOpenAlert = alerts.some(
          (a) => a.residentId === res.id && a.status !== "resolved"
        );
        if (!hasOpenAlert) {
          try {
            await updateDoc(doc(db, "residents", res.id), {
              status: "stable",
              attentionReason: "",
            });
          } catch (err) {
            console.error("Auto-sync resident status error:", err);
          }
        }
      }
    });
  }, [alerts, residents, loadingData, user]);

  // Full-Screen SOS Countdown Logic
  useEffect(() => {
    if (!sosCountdownResident) return;

    if (countdownSeconds <= 0) {
      finalizeTriggerSos(sosCountdownResident);
      return;
    }

    const timer = setTimeout(() => {
      setCountdownSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [sosCountdownResident, countdownSeconds]);

  const startSosCountdown = (resident: Resident) => {
    setSosCountdownResident(resident);
    setCountdownSeconds(10);
  };

  const cancelSosCountdown = () => {
    setSosCountdownResident(null);
    setCountdownSeconds(10);
    showToast("SOS cancelled – false alarm.");
  };

  const finalizeTriggerSos = async (resident: Resident) => {
    setSosCountdownResident(null);
    setCountdownSeconds(10);
    try {
      const now = Date.now();
      const creatorName = profile?.name || user?.displayName || `${orgInfo.name} Admin`;

      const timelineSteps = [
        {
          step: "SOS raised",
          by: creatorName,
          at: formattedSimulatedTime,
        },
      ];

      // Add "Family notified (in-app)" if resident has linked family members
      if (resident.familyUserIds && resident.familyUserIds.length > 0) {
        timelineSteps.push({
          step: "Family notified (in-app)",
          by: "Automated Emergency Dispatch",
          at: formattedSimulatedTime,
        });
      }

      await addDoc(collection(db, "alerts"), {
        type: "sos",
        residentId: resident.id,
        orgId: orgId,
        status: "open",
        createdBy: creatorName,
        createdAt: serverTimestamp(),
        escalateAt: now + 60000,
        timeline: timelineSteps,
      });

      await updateDoc(doc(db, "residents", resident.id), {
        status: "sos",
        attentionReason: "Emergency SOS triggered by care admin (simulated)",
      });

      showToast(`SOS alert raised for ${resident.name}. Volunteer circle dispatched.`);
    } catch (err) {
      console.error("Error creating SOS alert:", err);
      showToast("Failed to trigger SOS alert.");
    }
  };

  // Action: Mark Dose as Given (using formattedSimulatedTime for consistent order)
  const handleMarkAsGiven = async (med: Medicine) => {
    try {
      await addDoc(collection(db, "doseLogs"), {
        medicineId: med.id,
        residentId: med.residentId,
        orgId: orgId,
        date: currentDayStr,
        status: "given",
        givenAt: serverTimestamp(),
        givenBy: user?.displayName || user?.email?.split("@")[0] || "Care Admin",
      });

      const relatedAlert = alerts.find((a) => a.medicineId === med.id && a.status === "open");
      if (relatedAlert) {
        await updateDoc(doc(db, "alerts", relatedAlert.id), {
          status: "resolved",
          timeline: [
            ...relatedAlert.timeline,
            {
              step: "Dose verified & administered",
              by: user?.displayName || "Care Admin",
              at: formattedSimulatedTime,
            },
          ],
        });
      }

      const otherOpenAlerts = alerts.filter(
        (a) => a.residentId === med.residentId && a.id !== relatedAlert?.id && a.status !== "resolved"
      );

      if (otherOpenAlerts.length === 0) {
        await updateDoc(doc(db, "residents", med.residentId), {
          status: "stable",
          attentionReason: "",
        });
      }

      showToast(`Logged ${med.name} (${med.dose}) as given.`);
    } catch (err) {
      console.error("Error marking dose as given:", err);
      showToast("Error updating medication log.");
    }
  };

  // Action: Open Resolve Alert Modal
  const openResolveAlertModal = (alert: CareAlert) => {
    setResolvingAlert(alert);
    setResolveNote("Senior verified safe and well by care administrator.");
  };

  // Action: Confirm Resolve Incident with required short note
  const handleConfirmResolveIncident = async () => {
    if (!resolvingAlert) return;
    setSavingResolveAlert(true);

    try {
      const cleanNote = resolveNote.trim() || "Senior verified safe by care administrator.";
      await updateDoc(doc(db, "alerts", resolvingAlert.id), {
        status: "resolved",
        timeline: [
          ...resolvingAlert.timeline,
          {
            step: `Resolved: ${cleanNote}`,
            by: profile?.name || user?.displayName || "Care Admin",
            at: formattedSimulatedTime,
          },
        ],
      });

      const otherOpen = alerts.filter(
        (a) => a.residentId === resolvingAlert.residentId && a.id !== resolvingAlert.id && a.status !== "resolved"
      );
      if (otherOpen.length === 0) {
        await updateDoc(doc(db, "residents", resolvingAlert.residentId), {
          status: "stable",
          attentionReason: "",
        });
      }

      showToast("Incident successfully resolved.");
      setResolvingAlert(null);
    } catch (err) {
      console.error("Error resolving incident:", err);
      showToast("Failed to resolve incident.");
    } finally {
      setSavingResolveAlert(false);
    }
  };

  // Action: Copy Invite Code to Clipboard
  const handleCopyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Invite code ${code} copied to clipboard!`);
  };

  // Action: Regenerate random 8-character invite code
  const handleRegenerateInviteCode = async (res: Resident) => {
    try {
      const newCode = generateInviteCode();
      const batch = writeBatch(db);
      if (res.inviteCode) {
        batch.delete(doc(db, "inviteCodes", res.inviteCode));
      }
      batch.set(doc(db, "inviteCodes", newCode), {
        residentId: res.id,
        orgId: orgId,
        createdAt: serverTimestamp(),
      });
      batch.update(doc(db, "residents", res.id), {
        inviteCode: newCode,
      });
      await batch.commit();
      showToast(`Regenerated invite code for ${res.name}: ${newCode}`);
    } catch (err) {
      console.error("Error regenerating invite code:", err);
      showToast("Failed to regenerate invite code.");
    }
  };

  // Action: Approve Family Request (adds user to familyUserIds via arrayUnion)
  const handleApproveFamilyRequest = async (req: FamilyRequest, res: Resident) => {
    try {
      await updateDoc(doc(db, "residents", res.id), {
        familyUserIds: arrayUnion(req.userId),
      });
      await updateDoc(doc(db, "familyRequests", req.id), {
        status: "approved",
      });
      showToast(`Approved ${req.name} for ${res.name}'s care circle.`);
    } catch (err) {
      console.error("Error approving family request:", err);
      showToast("Failed to approve request.");
    }
  };

  // Action: Reject Family Request
  const handleRejectFamilyRequest = async (req: FamilyRequest) => {
    try {
      await updateDoc(doc(db, "familyRequests", req.id), {
        status: "rejected",
      });
      showToast(`Rejected care circle request from ${req.name}.`);
    } catch (err) {
      console.error("Error rejecting family request:", err);
      showToast("Failed to reject request.");
    }
  };

  // Action: Remove Linked Family Member from Resident
  const handleRemoveFamilyMember = async (res: Resident, userId: string) => {
    const memberName = orgUsers[userId]?.name || "this family member";
    if (!confirm(`Are you sure you want to remove ${memberName} from ${res.name}'s care circle?`)) return;
    try {
      await updateDoc(doc(db, "residents", res.id), {
        familyUserIds: arrayRemove(userId),
      });
      showToast(`Removed ${memberName} from ${res.name}'s care circle.`);
    } catch (err) {
      console.error("Error removing family member:", err);
      showToast("Failed to remove family member.");
    }
  };

  // Action: Update Organization Phone in Firestore
  const handleSaveOrgPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editOrgPhone.trim()) return;
    setSavingOrgPhone(true);
    try {
      await updateDoc(doc(db, "organizations", orgId), {
        phone: editOrgPhone.trim(),
      });
      setShowEditOrgModal(false);
      showToast("Organization contact phone updated successfully.");
    } catch (err) {
      console.error("Error saving organization phone:", err);
      showToast("Failed to update organization phone.");
    } finally {
      setSavingOrgPhone(false);
    }
  };

  // Action: Open Post Health Update Modal
  const openHealthUpdateModal = (res: Resident) => {
    setHealthUpdateResident(res);
    setUpdateBp("120/80 mmHg");
    setUpdatePulse("72 bpm");
    setUpdateMood("Happy / Calm");
    setUpdateNote("Resting comfortably, vitals verified normal.");
  };

  // Action: Submit Health Update
  const handleSubmitHealthUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!healthUpdateResident) return;
    setSavingHealthUpdate(true);

    try {
      await addDoc(collection(db, "healthUpdates"), {
        residentId: healthUpdateResident.id,
        orgId: orgId,
        bp: updateBp.trim() || "N/A",
        pulse: updatePulse.trim() || "N/A",
        mood: updateMood,
        note: updateNote.trim() || "Routine observation completed.",
        byName: profile?.name || user?.displayName || "Care Administrator",
        createdAt: serverTimestamp(),
      });

      showToast(`Health update posted for ${healthUpdateResident.name}.`);
      setHealthUpdateResident(null);
    } catch (err) {
      console.error("Error posting health update:", err);
      showToast("Failed to post health update.");
    } finally {
      setSavingHealthUpdate(false);
    }
  };

  // Action: Open Edit Resident Modal
  const openEditResidentModal = (res: Resident) => {
    setEditingResident(res);
    setEditName(res.name);
    setEditAge(String(res.age));
    setEditRoom(res.room);
    setEditBlood(res.bloodGroup || "B+");
    setEditConditions(res.conditions);
    setEditAllergies(res.allergies || "None reported");
    setEditPhoto(res.photoUrl || "");
  };

  // Action: Submit Edit Resident
  const handleSubmitEditResident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResident) return;
    setSavingEditResident(true);

    try {
      await updateDoc(doc(db, "residents", editingResident.id), {
        name: editName.trim(),
        age: Number(editAge) || editingResident.age,
        room: editRoom.trim() || editingResident.room,
        bloodGroup: editBlood,
        conditions: editConditions.trim(),
        allergies: editAllergies.trim(),
        photoUrl: editPhoto,
      });

      showToast(`Resident ${editName} updated successfully.`);
      setEditingResident(null);
    } catch (err) {
      console.error("Error updating resident:", err);
      showToast("Failed to update resident.");
    } finally {
      setSavingEditResident(false);
    }
  };

  // Action: Delete Resident & associated medicines
  const handleDeleteResident = async (res: Resident) => {
    if (
      !confirm(
        `Are you sure you want to delete ${res.name}? This will permanently remove their records, medicine schedule, and alerts.`
      )
    )
      return;

    try {
      if (res.inviteCode) {
        try {
          await deleteDoc(doc(db, "inviteCodes", res.inviteCode));
        } catch {
          // ignore if doc already removed
        }
      }
      await deleteDoc(doc(db, "residents", res.id));

      const qM = query(collection(db, "medicines"), where("residentId", "==", res.id));
      const mDocs = await getDocs(qM);
      for (const d of mDocs.docs) await deleteDoc(d.ref);

      const qD = query(collection(db, "doseLogs"), where("residentId", "==", res.id));
      const dDocs = await getDocs(qD);
      for (const d of dDocs.docs) await deleteDoc(d.ref);

      const qA = query(collection(db, "alerts"), where("residentId", "==", res.id));
      const aDocs = await getDocs(qA);
      for (const d of aDocs.docs) await deleteDoc(d.ref);

      showToast(`Resident ${res.name} and associated records deleted.`);
    } catch (err) {
      console.error("Error deleting resident:", err);
      showToast("Failed to delete resident.");
    }
  };

  // Action: Volunteer Verification Status toggle
  const handleToggleVolunteerStatus = async (vol: VolunteerUser, approve: boolean) => {
    try {
      await updateDoc(doc(db, "users", vol.uid), {
        verified: approve,
        verificationStatus: approve ? "verified" : "rejected",
      });
      showToast(`Volunteer ${vol.name} marked as ${approve ? "Verified" : "Rejected"}.`);
    } catch (err) {
      console.error("Error updating volunteer status:", err);
      showToast("Failed to update volunteer verification.");
    }
  };

  // Action: Add Resident
  const handleAddResidentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResName.trim()) return;
    setSavingResident(true);

    try {
      const inviteCode = generateInviteCode();
      const resDocRef = doc(collection(db, "residents"));
      const batch = writeBatch(db);

      batch.set(resDocRef, {
        name: newResName.trim(),
        age: Number(newResAge) || 75,
        room: newResRoom.trim() || "Room 101",
        orgId: orgId,
        bloodGroup: newResBlood,
        conditions: newResConditions.trim() || "Routine care",
        allergies: newResAllergies.trim() || "None reported",
        status: "stable" as ResidentStatus,
        familyUserIds: [],
        inviteCode: inviteCode,
        photoUrl: newResPhoto.trim() || "",
        createdAt: serverTimestamp(),
      });

      batch.set(doc(db, "inviteCodes", inviteCode), {
        residentId: resDocRef.id,
        orgId: orgId,
        createdAt: serverTimestamp(),
      });

      await batch.commit();

      setShowAddResidentModal(false);
      setNewResName("");
      setNewResAge("");
      setNewResRoom("");
      setNewResConditions("");
      setNewResPhoto("");
      showToast(`Resident ${newResName} added with invite code ${inviteCode}.`);
    } catch (err) {
      console.error("Error adding resident:", err);
      showToast("Failed to add resident.");
    } finally {
      setSavingResident(false);
    }
  };

  // Action: Add Medicine
  const handleAddMedicineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedResidentId || !newMedName.trim()) return;
    setSavingMedicine(true);

    try {
      await addDoc(collection(db, "medicines"), {
        residentId: newMedResidentId,
        orgId: orgId,
        name: newMedName.trim(),
        dose: newMedDose.trim() || "1 tablet",
        time: newMedTime,
        instructions: newMedInstructions.trim() || "Take with water",
      });

      setShowAddMedicineModal(false);
      setNewMedName("");
      setNewMedDose("");
      setNewMedInstructions("");
      showToast(`Scheduled ${newMedName} for ${convert24to12(newMedTime)}.`);
    } catch (err) {
      console.error("Error adding medicine:", err);
      showToast("Failed to schedule medicine.");
    } finally {
      setSavingMedicine(false);
    }
  };

  // Action: Seed / Load Demo Data (automatically links priya@saathi.demo to Kamla Deshmukh)
  const handleLoadDemoData = async () => {
    setLoadingData(true);
    try {
      const pad = (n: number) => String(n).padStart(2, "0");
      const fiveMinsAgoMins = ((currentMinutesOfDay - 5) % 1440 + 1440) % 1440;
      const kamlaTime = `${pad(Math.floor(fiveMinsAgoMins / 60))}:${pad(fiveMinsAgoMins % 60)}`;

      const timeInOffset = (offsetMins: number) => {
        const target = ((currentMinutesOfDay + offsetMins) % 1440 + 1440) % 1440;
        return `${pad(Math.floor(target / 60))}:${pad(target % 60)}`;
      };

      // Look up Priya's uid if a family request already exists for this org (satisfies rules)
      let priyaUid = "";
      try {
        const qPriyaReq = query(
          collection(db, "familyRequests"),
          where("orgId", "==", orgId)
        );
        const priyaReqSnap = await getDocs(qPriyaReq);
        const existingPriya = priyaReqSnap.docs.find((d) =>
          d.data().name?.toLowerCase().includes("priya")
        );
        if (existingPriya) {
          priyaUid = existingPriya.data().userId;
        }
      } catch (e) {
        console.error("Checking family requests error:", e);
      }

      // 1. Kamla Deshmukh (Room 204) - Deterministic demo invite code KAMLA204
      const kamlaCode = "KAMLA204";
      const kamlaDoc = await addDoc(collection(db, "residents"), {
        name: "Kamla Deshmukh",
        age: 78,
        room: "Room 204",
        orgId: orgId,
        bloodGroup: "B+",
        conditions: "Hypertension, mild vertigo",
        allergies: "None reported",
        status: "stable" as ResidentStatus,
        photoUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCRE2s54cf7D1hJCoaX_XbvDNJYxsIZa0s_eRLGHdDfFfdEuR4cJSK5RIISdEgO7Q3UgurXvN9ieqj9wzaw9ZtZieD_pw2aPOzcT_jsUPwSVJoICm6dGkZnLVuzmJABl0GH73RHlKl9by3UJfn2kv6F1lqSt8bmZO0rWMdlcBuwEYj68J1G3oC7vygMJD9s1yXFGZcSzt_FES7QkflKQ9gKm_G9GxGX57dLGbgc-TBljmZmASe-Gl6yzw",
        familyUserIds: priyaUid ? [priyaUid] : [],
        inviteCode: kamlaCode,
        createdAt: serverTimestamp(),
      });
      await setDoc(doc(db, "inviteCodes", kamlaCode), {
        residentId: kamlaDoc.id,
        orgId: orgId,
        createdAt: serverTimestamp(),
      });
      await addDoc(collection(db, "medicines"), {
        residentId: kamlaDoc.id,
        orgId: orgId,
        name: "Amlodipine (BP)",
        dose: "5mg",
        time: kamlaTime,
        instructions: "Take 1 tablet after breakfast with water",
      });

      // Seed an initial health update for Kamla
      await addDoc(collection(db, "healthUpdates"), {
        residentId: kamlaDoc.id,
        orgId: orgId,
        bp: "128/82 mmHg",
        pulse: "74 bpm",
        mood: "Calm & Cheerful",
        note: "Morning ginger tea enjoyed on veranda. Vitals verified stable.",
        byName: "Floor Nurse Duty",
        createdAt: serverTimestamp(),
      });

      // Seed pre-approved family request for Priya so request history matches
      if (priyaUid) {
        await addDoc(collection(db, "familyRequests"), {
          residentId: kamlaDoc.id,
          orgId: orgId,
          userId: priyaUid,
          name: "Priya Deshmukh",
          phone: "+91 90000 00002 (demo)",
          relationship: "Daughter",
          status: "approved",
          createdAt: serverTimestamp(),
        });
      }

      // 2. Anand Verma (Room 108) - Random 8-character invite code
      const anandCode = generateInviteCode();
      const anandDoc = await addDoc(collection(db, "residents"), {
        name: "Anand Verma",
        age: 81,
        room: "Room 108",
        orgId: orgId,
        bloodGroup: "O+",
        conditions: "Type 2 Diabetes",
        allergies: "Penicillin",
        status: "stable" as ResidentStatus,
        familyUserIds: [],
        inviteCode: anandCode,
        createdAt: serverTimestamp(),
      });
      await setDoc(doc(db, "inviteCodes", anandCode), {
        residentId: anandDoc.id,
        orgId: orgId,
        createdAt: serverTimestamp(),
      });
      await addDoc(collection(db, "medicines"), {
        residentId: anandDoc.id,
        orgId: orgId,
        name: "Metformin",
        dose: "500mg",
        time: timeInOffset(45),
        instructions: "Take 1 tablet with or after meal",
      });

      // 3. Shanti Joshi (Room 302) - Random 8-character invite code
      const shantiCode = generateInviteCode();
      const shantiDoc = await addDoc(collection(db, "residents"), {
        name: "Shanti Joshi",
        age: 76,
        room: "Room 302",
        orgId: orgId,
        bloodGroup: "A+",
        conditions: "High Cholesterol",
        allergies: "None reported",
        status: "stable" as ResidentStatus,
        familyUserIds: [],
        inviteCode: shantiCode,
        createdAt: serverTimestamp(),
      });
      await setDoc(doc(db, "inviteCodes", shantiCode), {
        residentId: shantiDoc.id,
        orgId: orgId,
        createdAt: serverTimestamp(),
      });
      await addDoc(collection(db, "medicines"), {
        residentId: shantiDoc.id,
        orgId: orgId,
        name: "Atorvastatin",
        dose: "10mg",
        time: timeInOffset(90),
        instructions: "Take 1 tablet with plain water",
      });

      // 4. Gopal Kulkarni (Room 215) - Random 8-character invite code
      const gopalCode = generateInviteCode();
      const gopalDoc = await addDoc(collection(db, "residents"), {
        name: "Gopal Kulkarni",
        age: 83,
        room: "Room 215",
        orgId: orgId,
        bloodGroup: "AB+",
        conditions: "Joint mobility, mild arthritis",
        allergies: "Sulfa drugs",
        status: "stable" as ResidentStatus,
        familyUserIds: [],
        inviteCode: gopalCode,
        createdAt: serverTimestamp(),
      });
      await setDoc(doc(db, "inviteCodes", gopalCode), {
        residentId: gopalDoc.id,
        orgId: orgId,
        createdAt: serverTimestamp(),
      });
      await addDoc(collection(db, "medicines"), {
        residentId: gopalDoc.id,
        orgId: orgId,
        name: "Calcium D3 & Vitamin Tab",
        dose: "1 tablet",
        time: timeInOffset(120),
        instructions: "Take 1 tablet after food with water or milk",
      });

      // 5. Ramesh Patil (Lives at home) - Random 8-character invite code
      const rameshCode = generateInviteCode();
      const rameshDoc = await addDoc(collection(db, "residents"), {
        name: "Ramesh Patil",
        age: 72,
        room: "Lives at home (Model Colony)",
        orgId: orgId,
        bloodGroup: "O+",
        conditions: "Hypertension, lives alone",
        allergies: "None",
        status: "stable" as ResidentStatus,
        familyUserIds: [],
        inviteCode: rameshCode,
        createdAt: serverTimestamp(),
      });
      await setDoc(doc(db, "inviteCodes", rameshCode), {
        residentId: rameshDoc.id,
        orgId: orgId,
        createdAt: serverTimestamp(),
      });
      await addDoc(collection(db, "medicines"), {
        residentId: rameshDoc.id,
        orgId: orgId,
        name: "Telmisartan (BP)",
        dose: "40mg",
        time: timeInOffset(180),
        instructions: "Take 1 tablet daily with water, monitor blood pressure",
      });

      showToast("Demo data loaded with random 8-character invite codes and pre-approved Priya Deshmukh.");
    } catch (err) {
      console.error("Error creating demo data:", err);
      showToast("Failed to initialize demo data.");
    } finally {
      setLoadingData(false);
    }
  };

  // Action: Reset Demo Data
  const handleResetDemoData = async () => {
    if (!confirm("Reset all residents, medicines, dose logs, family requests, and alerts for this organization?")) return;
    setLoadingData(true);

    try {
      const qRes = query(collection(db, "residents"), where("orgId", "==", orgId));
      const resDocs = await getDocs(qRes);
      for (const d of resDocs.docs) {
        const rData = d.data();
        if (rData.inviteCode) {
          try {
            await deleteDoc(doc(db, "inviteCodes", rData.inviteCode));
          } catch {
            // ignore if doc already removed
          }
        }
        await deleteDoc(d.ref);
      }

      const qMed = query(collection(db, "medicines"), where("orgId", "==", orgId));
      const medDocs = await getDocs(qMed);
      for (const d of medDocs.docs) await deleteDoc(d.ref);

      const qLogs = query(collection(db, "doseLogs"), where("orgId", "==", orgId));
      const logDocs = await getDocs(qLogs);
      for (const d of logDocs.docs) await deleteDoc(d.ref);

      const qAlt = query(collection(db, "alerts"), where("orgId", "==", orgId));
      const altDocs = await getDocs(qAlt);
      for (const d of altDocs.docs) await deleteDoc(d.ref);

      const qHealth = query(collection(db, "healthUpdates"), where("orgId", "==", orgId));
      const hDocs = await getDocs(qHealth);
      for (const d of hDocs.docs) await deleteDoc(d.ref);

      const qReqs = query(collection(db, "familyRequests"), where("orgId", "==", orgId));
      const reqDocs = await getDocs(qReqs);
      for (const d of reqDocs.docs) await deleteDoc(d.ref);

      setDemoOffsetMinutes(0);
      showToast("All data cleared. Reloading fresh demo set...");
      await handleLoadDemoData();
    } catch (err) {
      console.error("Error resetting demo data:", err);
      showToast("Failed to reset data.");
      setLoadingData(false);
    }
  };

  // SUMMARY COUNTS
  const totalResidentsCount = residents.length;

  const dueNextHourCount = useMemo(() => {
    return medicines.filter((m) => {
      const medMins = parseTimeToMinutes(m.time);
      const isWithinNextHour = medMins >= currentMinutesOfDay && medMins <= currentMinutesOfDay + 60;
      const alreadyGiven = doseLogs.some(
        (log) => log.medicineId === m.id && log.date === currentDayStr && log.status === "given"
      );
      return isWithinNextHour && !alreadyGiven;
    }).length;
  }, [medicines, currentMinutesOfDay, doseLogs, currentDayStr]);

  const activeIncidents = useMemo(() => {
    return alerts.filter((a) => a.status !== "resolved");
  }, [alerts]);

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
    return alerts.filter(isAlertOverdueOrEscalated);
  }, [alerts, clientNow]);

  const filteredResidents = useMemo(() => {
    if (residentFilter === "attention") {
      return residents.filter((r) => r.status === "attention" || r.status === "sos");
    }
    if (residentFilter === "stable") {
      return residents.filter((r) => r.status === "stable");
    }
    return residents;
  }, [residents, residentFilter]);

  const welfareResident = useMemo(() => {
    if (selectedWelfareResidentId) {
      const found = residents.find((r) => r.id === selectedWelfareResidentId);
      if (found) return found;
    }
    const kamla = residents.find((r) => r.name.toLowerCase().includes("kamla"));
    if (kamla) return kamla;
    return residents[0] || null;
  }, [residents, selectedWelfareResidentId]);

  const filteredVolunteers = useMemo(() => {
    if (volunteerFilter === "pending") {
      return volunteers.filter((v) => !v.verified && v.verificationStatus !== "rejected");
    }
    if (volunteerFilter === "verified") {
      return volunteers.filter((v) => v.verified);
    }
    return volunteers;
  }, [volunteers, volunteerFilter]);

  // Medicines for next 2 hours table
  const nextTwoHoursMedicines = useMemo(() => {
    return medicines
      .map((m) => {
        const medMins = parseTimeToMinutes(m.time);
        const resident = residents.find((r) => r.id === m.residentId);
        const givenLog = doseLogs.find(
          (log) => log.medicineId === m.id && log.date === currentDayStr && log.status === "given"
        );

        const isOverdue = !givenLog && currentMinutesOfDay > medMins + 15;
        const diffMinutes = currentMinutesOfDay - medMins;

        return {
          med: m,
          resident,
          medMins,
          givenLog,
          isOverdue,
          overdueMinutes: isOverdue ? diffMinutes : 0,
        };
      })
      .sort((a, b) => a.medMins - b.medMins);
  }, [medicines, residents, doseLogs, currentDayStr, currentMinutesOfDay]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C2826] flex font-sans">
      {/* Toast Feedback */}
      {actionFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F5F5C] text-white px-5 py-3 rounded-xl shadow-lg border border-[#0B4644] flex items-center gap-2 animate-fade-in text-sm font-semibold">
          <span className="material-symbols-outlined text-[20px] text-[#A7F3D0]">check_circle</span>
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* FULL-SCREEN 10-SECOND COUNTDOWN OVERLAY ON TRIGGER SOS */}
      {sosCountdownResident && (
        <div className="fixed inset-0 z-50 bg-[#1C2826]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="w-24 h-24 rounded-full bg-red-600/20 border-4 border-red-500 flex items-center justify-center animate-pulse mb-6">
            <span className="material-symbols-outlined text-[48px] text-red-500">emergency</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>Emergency SOS Countdown (simulated)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white max-w-lg">
            Triggering Emergency Dispatch for {sosCountdownResident.name}
          </h2>
          <p className="text-sm text-gray-300 mt-2 max-w-md">
            {sosCountdownResident.room} • {sosCountdownResident.conditions}
          </p>

          <div className="my-8 flex flex-col items-center">
            <div className="text-8xl sm:text-9xl font-black text-red-500 font-mono tracking-tight drop-shadow-lg">
              {countdownSeconds}s
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Dispatching Pune Circle volunteer network and 60-second escalation timer...
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            <button
              type="button"
              onClick={cancelSosCountdown}
              className="w-full h-16 rounded-2xl bg-white hover:bg-gray-100 text-red-700 font-extrabold text-lg shadow-2xl transition-all cursor-pointer flex items-center justify-center gap-3 active:scale-95 border-2 border-red-200"
            >
              <span className="material-symbols-outlined text-[28px]">cancel</span>
              <span>Cancel – false alarm</span>
            </button>

            <button
              type="button"
              onClick={() => finalizeTriggerSos(sosCountdownResident)}
              className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
            >
              Trigger immediately (skip countdown)
            </button>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <aside className="w-72 bg-white border-r border-[#E8E2D8] flex flex-col justify-between fixed top-0 bottom-0 left-0 z-40">
        <div className="flex flex-col">
          <div className="p-6 border-b border-[#E8E2D8] flex flex-col gap-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-[#0F5F5C] text-white flex items-center justify-center font-black text-lg shadow-sm">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-[#1C2826] group-hover:text-[#0F5F5C] transition-colors">
                  Aastha Care Admin
                </span>
                <span className="text-[11px] text-[#5A6563] font-medium">
                  {orgInfo.name} • {orgInfo.city ? `${orgInfo.city} Circle` : "Pune Circle"}
                </span>
              </div>
            </Link>
          </div>

          <nav className="p-4 flex flex-col gap-1 text-sm font-bold">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-[#0F5F5C] text-white shadow-sm"
                  : "text-[#5A6563] hover:bg-[#FAF7F2] hover:text-[#1C2826]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[22px]">dashboard</span>
                <span>Dashboard</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("residents")}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "residents"
                  ? "bg-[#0F5F5C] text-white shadow-sm"
                  : "text-[#5A6563] hover:bg-[#FAF7F2] hover:text-[#1C2826]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[22px]">groups</span>
                <span>Residents</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563]">
                {residents.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("medicines")}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "medicines"
                  ? "bg-[#0F5F5C] text-white shadow-sm"
                  : "text-[#5A6563] hover:bg-[#FAF7F2] hover:text-[#1C2826]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[22px]">medication</span>
                <span>Medicines</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563]">
                {medicines.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("alerts")}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "alerts"
                  ? "bg-[#0F5F5C] text-white shadow-sm"
                  : "text-[#5A6563] hover:bg-[#FAF7F2] hover:text-[#1C2826]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[22px]">emergency</span>
                <span>Alerts</span>
              </div>
              {activeIncidents.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 font-bold">
                  {activeIncidents.length}
                </span>
              )}
            </button>

            {/* REAL VOLUNTEERS TAB */}
            <button
              onClick={() => setActiveTab("volunteers")}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "volunteers"
                  ? "bg-[#0F5F5C] text-white shadow-sm"
                  : "text-[#5A6563] hover:bg-[#FAF7F2] hover:text-[#1C2826]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[22px]">volunteer_activism</span>
                <span>Volunteers</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563]">
                {volunteers.length}
              </span>
            </button>

            {/* WELFARE & SCHEMES TAB */}
            <button
              onClick={() => setActiveTab("welfare")}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "welfare"
                  ? "bg-[#0F5F5C] text-white shadow-sm"
                  : "text-[#5A6563] hover:bg-[#FAF7F2] hover:text-[#1C2826]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[22px]">assignment_turned_in</span>
                <span>Welfare & Schemes</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E1ECE7] text-[#0F5F5C] font-bold">
                Govt DBT
              </span>
            </button>

            {/* Coming Next items */}
            <div className="pt-4 border-t border-[#E8E2D8] mt-2 flex flex-col gap-1">
              <span className="px-4 text-[11px] font-bold text-[#5A6563] uppercase tracking-wider mb-1">
                Coming Next
              </span>
              <div className="flex items-center justify-between px-4 py-2 text-xs text-[#5A6563] opacity-60">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">diversity_1</span>
                  <span>Partner NGO Mesh</span>
                </div>
                <span className="text-[10px] bg-[#FAF7F2] border border-[#E8E2D8] px-1.5 py-0.5 rounded">Coming</span>
              </div>
            </div>
          </nav>
        </div>

        <div className="p-4 border-t border-[#E8E2D8] flex flex-col gap-3">
          {/* Organization Contact Desk in Firestore */}
          <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1C2826] truncate">{orgInfo.name} Desk</span>
              <button
                type="button"
                onClick={() => {
                  setEditOrgPhone(orgInfo.phone || "+91 90000 00001 (demo)");
                  setShowEditOrgModal(true);
                }}
                className="text-[11px] font-bold text-[#0F5F5C] hover:underline cursor-pointer"
                title="Edit organization phone stored in Firestore"
              >
                Edit
              </button>
            </div>
            <a
              href={formatTelHref(orgInfo.phone)}
              className="flex items-center gap-1.5 text-[#5A6563] hover:text-[#0F5F5C] font-mono text-[11px] font-medium"
            >
              <span className="material-symbols-outlined text-[14px] text-[#0F5F5C]">call</span>
              <span className="truncate">{orgInfo.phone}</span>
            </a>
          </div>

          <a
            href="tel:14567"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-xs font-bold text-[#0F5F5C] hover:bg-[#F3EEE6] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
            <span>Elderline 14567</span>
          </a>

          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#1C2826] truncate max-w-[150px]">
                {profile?.name || user?.displayName || "Care Admin"}
              </span>
              <span className="text-[11px] text-[#5A6563]">{orgInfo.name} Admin</span>
            </div>
            <button
              onClick={() => logout()}
              title="Log out"
              className="w-8 h-8 rounded-lg text-[#5A6563] hover:text-red-700 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="pl-72 w-full flex flex-col min-h-screen">
        {/* TOP BAR WITH DEMO CLOCK & ACTIONS */}
        <header className="sticky top-0 z-30 h-20 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E2D8] px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E8E2D8] shadow-sm">
              <span className="material-symbols-outlined text-[#0F5F5C] text-[20px]">schedule</span>
              <span className="text-sm font-extrabold text-[#1C2826]">
                {formattedSimulatedTime}
              </span>
              {demoOffsetMinutes !== 0 && (
                <span className="text-[11px] font-bold text-[#D97706] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  +{demoOffsetMinutes}m simulated
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDemoOffsetMinutes((prev) => prev + 15)}
                className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                title="Advance app simulated time by 15 minutes"
              >
                <span className="material-symbols-outlined text-[16px]">fast_forward</span>
                <span>+15 min</span>
              </button>

              {demoOffsetMinutes !== 0 && (
                <button
                  type="button"
                  onClick={() => setDemoOffsetMinutes(0)}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563] text-xs font-semibold transition-colors cursor-pointer"
                  title="Reset to live system clock"
                >
                  Reset clock
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAddMedicineModal(true)}
              className="h-10 px-3.5 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C2826] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#0F5F5C]">add_circle</span>
              <span>Add Medicine</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddResidentModal(true)}
              className="h-10 px-4 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Add Resident</span>
            </button>

            {residents.length > 0 && (
              <button
                type="button"
                onClick={handleResetDemoData}
                className="h-10 px-3 rounded-xl bg-white hover:bg-red-50 border border-[#E8E2D8] text-red-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Clear and reset demo residents"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                <span>Reset Demo</span>
              </button>
            )}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-8 flex flex-col gap-8 flex-grow">
          {/* CRITICAL ESCALATION BANNER - 108 CALL REQUIRED */}
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
                  href={formatTelHref(orgInfo.phone)}
                  className="px-4 py-2 bg-red-900/60 border border-red-400 text-white font-bold text-xs rounded-xl hover:bg-red-900 transition-colors shrink-0 shadow-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">phone</span>
                  <span>Care Desk: {orgInfo.phone}</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB VIEW 1: VOLUNTEERS TAB */}
          {activeTab === "volunteers" ? (
            <section className="bg-white border border-[#E8E2D8] rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E8E2D8]">
                <div>
                  <h2 className="text-xl font-extrabold text-[#1C2826] tracking-tight">
                    Volunteer Desk &amp; NGO Verification Roster
                  </h2>
                  <p className="text-xs text-[#5A6563]">
                    Review and approve community volunteers in Pune Circle.
                  </p>
                </div>

                <div className="flex items-center gap-2 p-1 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setVolunteerFilter("all")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      volunteerFilter === "all" ? "bg-[#0F5F5C] text-white" : "text-[#5A6563]"
                    }`}
                  >
                    All ({volunteers.length})
                  </button>
                  <button
                    onClick={() => setVolunteerFilter("pending")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      volunteerFilter === "pending" ? "bg-amber-600 text-white" : "text-amber-800"
                    }`}
                  >
                    Pending ({volunteers.filter((v) => !v.verified && v.verificationStatus !== "rejected").length})
                  </button>
                  <button
                    onClick={() => setVolunteerFilter("verified")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      volunteerFilter === "verified" ? "bg-[#0F5F5C] text-white" : "text-[#5A6563]"
                    }`}
                  >
                    Verified ({volunteers.filter((v) => v.verified).length})
                  </button>
                </div>
              </div>

              {filteredVolunteers.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#5A6563]">
                  No volunteers found in this category. Volunteers who register at /volunteer/register appear here automatically.
                </div>
              ) : (
                <div className="overflow-x-auto -mx-6 px-6">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#E8E2D8] text-[#5A6563] uppercase tracking-wider">
                        <th className="py-3 px-3 font-bold">Volunteer</th>
                        <th className="py-3 px-3 font-bold">Contact</th>
                        <th className="py-3 px-3 font-bold">Locality / Area</th>
                        <th className="py-3 px-3 font-bold">Skills</th>
                        <th className="py-3 px-3 font-bold">Status</th>
                        <th className="py-3 px-3 text-right font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E2D8]/60">
                      {filteredVolunteers.map((vol) => (
                        <tr key={vol.uid} className="hover:bg-[#FAF7F2] transition-colors">
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <span className="font-bold text-[#1C2826] block">{vol.name}</span>
                            <span className="text-[11px] text-[#5A6563]">{vol.email}</span>
                          </td>
                          <td className="py-3.5 px-3 whitespace-nowrap font-mono text-[#5A6563]">
                            {vol.phone || "Not specified"}
                          </td>
                          <td className="py-3.5 px-3 text-[#1C2826] font-semibold">
                            {vol.area || "Pune Circle"}
                          </td>
                          <td className="py-3.5 px-3 text-[#5A6563] max-w-xs truncate">
                            {vol.skills || "Companionship, Daily check-ins"}
                          </td>
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            {vol.verified ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E8F3EE] text-[#0F5F5C] font-bold text-[11px]">
                                <span className="material-symbols-outlined text-[14px]">verified</span>
                                <span>Verified</span>
                              </span>
                            ) : vol.verificationStatus === "rejected" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-900 font-bold text-[11px]">
                                <span className="material-symbols-outlined text-[14px]">cancel</span>
                                <span>Rejected</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px]">
                                <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
                                <span>Pending Approval</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              {!vol.verified ? (
                                <button
                                  type="button"
                                  onClick={() => handleToggleVolunteerStatus(vol, true)}
                                  className="px-3 py-1.5 rounded-lg bg-[#0F5F5C] hover:bg-[#0B4644] text-white font-bold text-xs shadow-sm cursor-pointer"
                                >
                                  {vol.verificationStatus === "rejected" ? "Re-Approve" : "Approve"}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleToggleVolunteerStatus(vol, false)}
                                  className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-800 hover:bg-amber-50 font-bold text-xs cursor-pointer"
                                >
                                  Suspend
                                </button>
                              )}
                              {vol.verificationStatus !== "rejected" && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleVolunteerStatus(vol, false)}
                                  className="px-2.5 py-1.5 rounded-lg text-red-700 hover:bg-red-50 text-xs font-semibold cursor-pointer"
                                >
                                  Reject
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ) : activeTab === "welfare" ? (
            <div className="flex flex-col gap-6">
              {residents.length > 1 && (
                <div className="bg-white rounded-2xl p-4 border border-[#E8E2D8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0F5F5C] text-[20px]">switch_account</span>
                    <span className="text-xs font-bold text-[#5A6563] uppercase tracking-wider">
                      Select Resident Record:
                    </span>
                  </div>
                  <select
                    value={welfareResident?.id || ""}
                    onChange={(e) => setSelectedWelfareResidentId(e.target.value)}
                    className="h-10 px-3.5 rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] text-xs sm:text-sm font-bold text-[#1C2826] focus:outline-none focus:border-[#0F5F5C]"
                  >
                    {residents.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.room})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <ResidentWelfareView
                resident={welfareResident}
                orgName={orgInfo.name}
                context="admin"
                onBack={() => setActiveTab("dashboard")}
              />
            </div>
          ) : (
            /* DEFAULT DASHBOARD & RESIDENTS VIEW */
            <>
              {/* SUMMARY STRIP */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 shadow-sm flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-[#5A6563] uppercase tracking-wider">
                      Total Residents
                    </span>
                    <span className="text-3xl font-extrabold text-[#1C2826] tracking-tight">
                      {totalResidentsCount}
                    </span>
                    <span className="text-xs text-[#5A6563]">
                      Enrolled under {orgInfo.name}
                    </span>
                  </div>
                  <div className="w-13 h-13 rounded-2xl bg-[#E8F3EE] text-[#0F5F5C] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">groups</span>
                  </div>
                </div>

                <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 shadow-sm flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-[#5A6563] uppercase tracking-wider">
                      Doses Due (Next 1h)
                    </span>
                    <span className="text-3xl font-extrabold text-[#1C2826] tracking-tight">
                      {dueNextHourCount}
                    </span>
                    <span className="text-xs text-[#5A6563]">
                      Scheduled within next 60 minutes
                    </span>
                  </div>
                  <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">medication</span>
                  </div>
                </div>

                <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 shadow-sm flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-[#5A6563] uppercase tracking-wider">
                      Active Care Incidents
                    </span>
                    <span
                      className={`text-3xl font-extrabold tracking-tight ${
                        activeIncidents.length > 0 ? "text-red-700" : "text-[#0F5F5C]"
                      }`}
                    >
                      {activeIncidents.length}
                    </span>
                    <span className="text-xs text-[#5A6563]">
                      {activeIncidents.length > 0 ? "Require care administrator attention" : "All seniors safe & stable"}
                    </span>
                  </div>
                  <div
                    className={`w-13 h-13 rounded-2xl flex items-center justify-center ${
                      activeIncidents.length > 0
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-[#E8F3EE] text-[#0F5F5C]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[28px]">
                      {activeIncidents.length > 0 ? "warning" : "verified_user"}
                    </span>
                  </div>
                </div>
              </section>

              {/* EMPTY STATE BANNER */}
              {residents.length === 0 && !loadingData && (
                <div className="bg-white border-2 border-dashed border-[#E8E2D8] rounded-2xl p-10 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#E8F3EE] text-[#0F5F5C] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[36px]">folder_open</span>
                  </div>
                  <div className="max-w-md">
                    <h3 className="text-lg font-bold text-[#1C2826]">No residents enrolled yet</h3>
                    <p className="text-xs text-[#5A6563] mt-1">
                      Load the interactive demo dataset with Kamla Deshmukh, Ramesh Patil, and {orgInfo.name} seniors to test missed dose detection, escalation timelines, and volunteer routing.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleLoadDemoData}
                      className="px-5 py-2.5 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">dataset</span>
                      <span>Load Demo Data (5 Seniors)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddResidentModal(true)}
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C2826] text-xs font-bold transition-colors cursor-pointer"
                    >
                      Add Custom Resident
                    </button>
                  </div>
                </div>
              )}

              {/* 2-COLUMN LAYOUT */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* LEFT COLUMN: RESIDENTS & MEDICINE QUEUE */}
                <div className="xl:col-span-8 flex flex-col gap-8">
                  {/* RESIDENT CARDS SECTION */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E2D8]">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-extrabold text-[#1C2826] tracking-tight">
                        Resident Wellness &amp; Vitals Roster
                      </h2>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E8F3EE] text-[#0F5F5C]">
                        {residents.length} Active
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E8E2D8] rounded-xl text-xs font-bold">
                      <button
                        onClick={() => setResidentFilter("all")}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          residentFilter === "all" ? "bg-[#0F5F5C] text-white" : "text-[#5A6563] hover:text-[#1C2826]"
                        }`}
                      >
                        All ({residents.length})
                      </button>
                      <button
                        onClick={() => setResidentFilter("attention")}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                          residentFilter === "attention"
                            ? "bg-amber-600 text-white"
                            : "text-amber-800 hover:bg-amber-50"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        <span>Needs Attention</span>
                      </button>
                      <button
                        onClick={() => setResidentFilter("stable")}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          residentFilter === "stable" ? "bg-[#0F5F5C] text-white" : "text-[#5A6563] hover:text-[#1C2826]"
                        }`}
                      >
                        Stable
                      </button>
                    </div>
                  </div>

                  {/* Grid of Resident Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredResidents.map((res) => {
                      const resMeds = medicines.filter((m) => m.residentId === res.id);
                      const firstPendingOrOverdue = resMeds.find((m) => {
                        const alreadyGiven = doseLogs.some(
                          (log) => log.medicineId === m.id && log.date === currentDayStr && log.status === "given"
                        );
                        return !alreadyGiven;
                      });
                      const pendingRequestsForRes = familyRequests.filter(
                        (r) => r.residentId === res.id && r.status === "pending"
                      );
                      const linkedMembers = res.familyUserIds || [];

                      return (
                        <article
                          key={res.id}
                          className={`bg-white rounded-2xl p-6 border transition-all shadow-sm flex flex-col justify-between ${
                            res.status === "sos"
                              ? "border-red-500 ring-2 ring-red-500/20 bg-red-50/20"
                              : res.status === "attention"
                              ? "border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20"
                              : "border-[#E8E2D8] hover:border-[#0F5F5C]"
                          }`}
                        >
                          <div className="flex flex-col gap-4">
                            {/* Card Header: Name, Room, Status Badge */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                {res.photoUrl ? (
                                  <img
                                    src={res.photoUrl}
                                    alt={res.name}
                                    className="w-11 h-11 rounded-xl object-cover border border-[#E8E2D8] shadow-sm shrink-0"
                                  />
                                ) : (
                                  <div className="w-11 h-11 rounded-xl bg-[#E6F4F1] text-[#0F5F5C] font-bold text-base flex items-center justify-center border border-[#0F5F5C]/20 shrink-0">
                                    {res.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="flex flex-col min-w-0">
                                  <h3 className="text-lg font-extrabold text-[#1C2826] tracking-tight truncate">
                                    {res.name}
                                  </h3>
                                  <span className="text-xs font-semibold text-[#5A6563]">
                                    Age {res.age} • {res.room}
                                  </span>
                                </div>
                              </div>

                              {res.status === "sos" ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-800 border border-red-300">
                                  <span className="material-symbols-outlined text-[16px] animate-pulse">emergency</span>
                                  <span>SOS Active</span>
                                </span>
                              ) : res.status === "attention" ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                  <span className="material-symbols-outlined text-[16px]">warning</span>
                                  <span>Needs Attention</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F3EE] text-[#0F5F5C] border border-[#BDE0D1]">
                                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                  <span>Stable</span>
                                </span>
                              )}
                            </div>

                            {/* Medical Summary & Tags */}
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563] font-semibold">
                                Blood: <strong className="text-[#1C2826]">{res.bloodGroup || "O+"}</strong>
                              </span>
                              <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563] font-semibold truncate max-w-[200px]">
                                {res.conditions}
                              </span>
                              <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8] text-[#0F5F5C] font-mono font-bold">
                                Code: {res.inviteCode}
                              </span>
                            </div>

                            {/* Attention / SOS Callout Box */}
                            {res.status === "sos" && (
                              <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 flex items-start gap-2.5">
                                <span className="material-symbols-outlined text-red-700 text-[20px] shrink-0 mt-0.5 animate-pulse">
                                  emergency
                                </span>
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-red-900">
                                    Emergency SOS Active (simulated)
                                  </span>
                                  <span className="text-xs text-red-800 mt-0.5">
                                    Volunteer network dispatched. 60-second escalation timer running.
                                  </span>
                                </div>
                              </div>
                            )}

                            {res.status === "attention" && res.attentionReason && (
                              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-2.5">
                                <span className="material-symbols-outlined text-amber-700 text-[20px] shrink-0 mt-0.5">
                                  alarm_on
                                </span>
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-amber-950">
                                    {res.attentionReason}
                                  </span>
                                  <span className="text-xs text-amber-800 mt-1">
                                    Check vital signs and mark dose as given below once verified.
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* FAMILY CIRCLE MANAGEMENT SECTION */}
                            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex flex-col gap-2.5">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-[#0F5F5C] text-[18px]">family_restroom</span>
                                  <span className="text-xs font-bold text-[#1C2826]">
                                    Family Members ({linkedMembers.length})
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-white border border-[#E8E2D8] text-[#0F5F5C]"
                                    title="8-character invite code"
                                  >
                                    {res.inviteCode}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyInviteCode(res.inviteCode)}
                                    className="p-1 rounded hover:bg-white text-[#5A6563] hover:text-[#1C2826] cursor-pointer"
                                    title="Copy invite code"
                                  >
                                    <span className="material-symbols-outlined text-[15px]">content_copy</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRegenerateInviteCode(res)}
                                    className="px-2 py-1 rounded bg-white hover:bg-gray-100 border border-[#E8E2D8] text-[11px] font-bold text-[#0F5F5C] hover:text-[#0B4644] flex items-center gap-0.5 transition-colors cursor-pointer"
                                    title="Generate a new random 8-character invite code"
                                  >
                                    <span className="material-symbols-outlined text-[13px]">refresh</span>
                                    <span>Regenerate code</span>
                                  </button>
                                </div>
                              </div>

                              {/* Pending Family Approval Requests */}
                              {pendingRequestsForRes.length > 0 && (
                                <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                                    <span>Pending Requests ({pendingRequestsForRes.length})</span>
                                  </div>
                                  {pendingRequestsForRes.map((req) => (
                                    <div
                                      key={req.id}
                                      className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-amber-200 text-xs"
                                    >
                                      <div className="flex flex-col min-w-0">
                                        <span className="font-bold text-[#1C2826] truncate">
                                          {req.name}{" "}
                                          <span className="text-[10px] text-[#5A6563]">({req.relationship})</span>
                                        </span>
                                        <span className="text-[11px] text-[#5A6563] font-mono">
                                          {req.phone || "No phone"}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => handleApproveFamilyRequest(req, res)}
                                          className="px-2.5 py-1 rounded-md bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-[11px] font-bold shadow-xs cursor-pointer"
                                        >
                                          Approve
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleRejectFamilyRequest(req)}
                                          className="px-2.5 py-1 rounded-md bg-white border border-red-300 text-red-700 hover:bg-red-50 text-[11px] font-bold cursor-pointer"
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Linked Family Members */}
                              {linkedMembers.length > 0 ? (
                                <div className="flex flex-col gap-1.5">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6563]">
                                    Linked Members
                                  </span>
                                  {linkedMembers.map((uid) => {
                                    const u = orgUsers[uid];
                                    const displayName = u?.name || "Priya Deshmukh";
                                    const displayPhone = u?.phone || (displayName === "Priya Deshmukh" ? "+91 90000 00002 (demo)" : "Verified");

                                    return (
                                      <div
                                        key={uid}
                                        className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-[#E8E2D8] text-xs"
                                      >
                                        <div className="flex flex-col min-w-0">
                                          <span className="font-bold text-[#1C2826] truncate">{displayName}</span>
                                          <span className="text-[11px] text-[#5A6563] font-mono">{displayPhone}</span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveFamilyMember(res, uid)}
                                          className="px-2 py-1 rounded text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 text-[11px] font-bold transition-colors cursor-pointer shrink-0"
                                          title="Remove from care circle"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-[11px] text-[#5A6563]">
                                  No family members linked yet. Family can enter invite code{" "}
                                  <strong className="font-mono text-[#1C2826]">{res.inviteCode}</strong> at /family to request access.
                                </p>
                              )}
                            </div>

                            {/* ADMIN CONTROLS: Post Health Update, Edit, Delete */}
                            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                              <button
                                type="button"
                                onClick={() => openHealthUpdateModal(res)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#E8F3EE] hover:bg-[#d8ece2] text-[#0F5F5C] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Log BP, pulse, and daily observation note"
                              >
                                <span className="material-symbols-outlined text-[16px]">vital_signs</span>
                                <span>Post Health Update</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => openEditResidentModal(res)}
                                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Edit senior profile"
                              >
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                <span>Edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedWelfareResidentId(res.id);
                                  setActiveTab("welfare");
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EEE6] border border-[#E8E2D8] text-[#0F5F5C] font-bold flex items-center gap-1 transition-colors cursor-pointer text-xs"
                                title="View government welfare and pension schemes"
                              >
                                <span className="material-symbols-outlined text-[16px]">assignment_turned_in</span>
                                <span>Welfare Schemes</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteResident(res)}
                                className="px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ml-auto"
                                title="Delete senior and medication schedules"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>

                          {/* Card Actions (Mark as Given & Trigger SOS) */}
                          <div className="pt-4 border-t border-[#E8E2D8] mt-4 flex flex-wrap items-center justify-between gap-2">
                            {firstPendingOrOverdue ? (
                              <button
                                type="button"
                                onClick={() => handleMarkAsGiven(firstPendingOrOverdue)}
                                className="h-10 px-4 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                <span>Mark as given ({firstPendingOrOverdue.name})</span>
                              </button>
                            ) : (
                              <span className="text-xs text-[#5A6563] font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px] text-[#0F5F5C]">task_alt</span>
                                <span>All current doses given</span>
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => startSosCountdown(res)}
                              className="h-10 px-3.5 rounded-xl border border-red-300 hover:bg-red-50 text-red-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Trigger SOS alert for resident"
                            >
                              <span className="material-symbols-outlined text-[18px]">notification_important</span>
                              <span>Trigger SOS</span>
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {/* MEDICINE TABLE (NEXT 2 HOURS) */}
                  <section className="bg-white border border-[#E8E2D8] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E8E2D8]">
                      <div>
                        <h3 className="text-lg font-bold text-[#1C2826]">
                          Medicine Schedule (Next 2 Hours Queue)
                        </h3>
                        <p className="text-xs text-[#5A6563]">
                          Auto-monitored dosage schedule with 15-minute overdue detection.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#0F5F5C] bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-1 rounded-full self-start sm:self-auto">
                        Live Telemetry: Auto-refresh 30s
                      </span>
                    </div>

                    {nextTwoHoursMedicines.length === 0 ? (
                      <div className="py-8 text-center text-xs text-[#5A6563]">
                        No medicines scheduled in this window. Click &quot;Add Medicine&quot; above to create a schedule.
                      </div>
                    ) : (
                      <div className="overflow-x-auto -mx-6 px-6">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-[#E8E2D8] text-[#5A6563] uppercase tracking-wider">
                              <th className="py-3 px-3 font-bold">Time</th>
                              <th className="py-3 px-3 font-bold">Resident &amp; Room</th>
                              <th className="py-3 px-3 font-bold">Medication &amp; Dose</th>
                              <th className="py-3 px-3 font-bold">Instructions</th>
                              <th className="py-3 px-3 font-bold">Status</th>
                              <th className="py-3 px-3 text-right font-bold">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E8E2D8]/60">
                            {nextTwoHoursMedicines.map(({ med, resident, isOverdue, overdueMinutes, givenLog }) => (
                              <tr
                                key={med.id}
                                className={`transition-colors ${
                                  isOverdue ? "bg-amber-50/50 hover:bg-amber-50" : "hover:bg-[#FAF7F2]"
                                }`}
                              >
                                <td className="py-3.5 px-3 font-extrabold text-[#1C2826] whitespace-nowrap">
                                  {convert24to12(med.time)}
                                </td>
                                <td className="py-3.5 px-3 whitespace-nowrap">
                                  <span className="font-bold text-[#1C2826] block">{resident?.name || "Unknown"}</span>
                                  <span className="text-[11px] text-[#5A6563]">{resident?.room}</span>
                                </td>
                                <td className="py-3.5 px-3">
                                  <span className="font-semibold text-[#1C2826] block">{med.name}</span>
                                  <span className="text-[11px] text-[#5A6563]">{med.dose}</span>
                                </td>
                                <td className="py-3.5 px-3 text-[#5A6563] max-w-[180px] truncate">
                                  {med.instructions || "Standard dose"}
                                </td>
                                <td className="py-3.5 px-3 whitespace-nowrap">
                                  {givenLog ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E8F3EE] text-[#0F5F5C] font-bold text-[11px]">
                                      <span className="material-symbols-outlined text-[14px]">task_alt</span>
                                      <span>Given</span>
                                    </span>
                                  ) : isOverdue ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px]">
                                      <span className="material-symbols-outlined text-[14px]">warning</span>
                                      <span>Overdue (+{overdueMinutes}m)</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#5A6563] font-semibold text-[11px]">
                                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                                      <span>Pending</span>
                                    </span>
                                  )}
                                </td>
                                <td className="py-3.5 px-3 text-right whitespace-nowrap">
                                  {!givenLog ? (
                                    <button
                                      type="button"
                                      onClick={() => handleMarkAsGiven(med)}
                                      className="px-3 py-1.5 rounded-lg bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                                    >
                                      Mark as given
                                    </button>
                                  ) : (
                                    <span className="text-[11px] text-[#5A6563] font-semibold">
                                      Logged
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                </div>

                {/* RIGHT COLUMN: LIVE ESCALATION TRACKER */}
                <aside className="xl:col-span-4 flex flex-col gap-6 sticky top-28">
                  <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          {activeIncidents.length > 0 ? (
                            <>
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                            </>
                          ) : (
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0F5F5C]"></span>
                          )}
                        </span>
                        <h3 className="text-base font-extrabold text-[#1C2826] tracking-tight">
                          Live Escalation Tracker
                        </h3>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          activeIncidents.length > 0 ? "bg-red-100 text-red-900" : "bg-[#E8F3EE] text-[#0F5F5C]"
                        }`}
                      >
                        {activeIncidents.length} Active Incident{activeIncidents.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    {/* Open Incidents List with Live Stepper */}
                    {activeIncidents.length === 0 ? (
                      <div className="py-8 text-center flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-[#E8F3EE] text-[#0F5F5C] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[22px]">verified</span>
                        </div>
                        <span className="text-xs font-bold text-[#1C2826]">All Clear</span>
                        <p className="text-[11px] text-[#5A6563] max-w-xs">
                          All resident doses are up-to-date and no SOS emergency incidents are active.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-6">
                        {activeIncidents.map((alert) => {
                          const res = residents.find((r) => r.id === alert.residentId);
                          const relatedMed = medicines.find((m) => m.id === alert.medicineId);
                          const isSos = alert.type === "sos";

                          return (
                            <div
                              key={alert.id}
                              className={`p-4 rounded-xl border flex flex-col gap-3 ${
                                isSos
                                  ? "bg-red-50/70 border-red-300"
                                  : "bg-amber-50/70 border-amber-300"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A6563]">
                                  INCIDENT #{alert.id.slice(0, 6).toUpperCase()}
                                </span>
                                <span
                                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                    alert.status === "escalated"
                                      ? "bg-red-700 text-white"
                                      : alert.status === "accepted"
                                      ? "bg-blue-100 text-blue-900"
                                      : alert.status === "arrived"
                                      ? "bg-[#E8F3EE] text-[#0F5F5C]"
                                      : "bg-amber-200 text-amber-900"
                                  }`}
                                >
                                  {alert.status.toUpperCase()}
                                </span>
                              </div>

                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#1C2826]">
                                  {res?.name} ({res?.room})
                                </span>
                                <p className="text-xs text-[#1C2826] font-medium mt-0.5">
                                  {alert.message || (isSos ? "Emergency SOS triggered" : "Care Alert")}
                                </p>
                              </div>

                              {/* SOS 4-STAGE LIVE STEPPER */}
                              {isSos ? (
                                <div className="flex flex-col gap-2.5 pt-2 border-t border-red-200">
                                  <span className="text-[11px] font-bold text-[#5A6563] uppercase tracking-wider">
                                    SOS Progression (simulated)
                                  </span>

                                  <div className="flex flex-col gap-2.5 relative pl-3 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-red-300">
                                    {/* Stage 1: Raised */}
                                    <div className="flex items-start gap-3 relative">
                                      <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shrink-0 z-10 shadow-sm">
                                        <span className="material-symbols-outlined text-[14px]">check</span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-xs font-bold text-[#1C2826]">SOS Raised</span>
                                        <span className="text-[10px] text-[#5A6563]">
                                          By: {alert.createdBy || "Admin"} • {alert.timeline[0]?.at || formattedSimulatedTime}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Escalated Branch */}
                                    {alert.status === "escalated" && (
                                      <div className="flex flex-col gap-2 p-2.5 bg-red-50 border border-red-200 rounded-xl relative">
                                        <div className="flex items-start gap-3 relative">
                                          <div className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center text-xs shrink-0 z-10 shadow-sm">
                                            <span className="material-symbols-outlined text-[14px]">emergency</span>
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-xs font-black text-red-800">
                                              Escalated (108 call required)
                                            </span>
                                            <span className="text-[10px] text-red-600">
                                              No volunteer responded in 60s. Care desk must call 108 now.
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-1.5 ml-9">
                                          <a
                                            href="tel:108"
                                            className="px-2.5 py-1 bg-red-700 text-white text-[10px] font-bold rounded-lg hover:bg-red-800 flex items-center gap-1 shadow-sm"
                                          >
                                            <span className="material-symbols-outlined text-[12px]">call</span>
                                            Call 108
                                          </a>
                                          <a
                                            href={formatTelHref(orgInfo.phone)}
                                            className="px-2.5 py-1 bg-white border border-red-300 text-red-800 text-[10px] font-bold rounded-lg hover:bg-red-50 flex items-center gap-1 shadow-sm"
                                          >
                                            <span className="material-symbols-outlined text-[12px]">phone</span>
                                            Desk: {orgInfo.phone}
                                          </a>
                                        </div>
                                      </div>
                                    )}

                                    {/* Stage 2: Accepted by Volunteer */}
                                    <div className="flex items-start gap-3 relative">
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 z-10 shadow-sm ${
                                          alert.acceptedBy
                                            ? "bg-[#0F5F5C] text-white"
                                            : "bg-white border-2 border-gray-300 text-gray-400"
                                        }`}
                                      >
                                        <span className="material-symbols-outlined text-[14px]">
                                          {alert.acceptedBy ? "check" : "person"}
                                        </span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-xs font-bold text-[#1C2826]">
                                          {alert.acceptedBy
                                            ? `Accepted by ${alert.acceptedBy.name}`
                                            : "Volunteer Response Pending"}
                                        </span>
                                        <span className="text-[10px] text-[#5A6563]">
                                          {alert.acceptedBy
                                            ? `En route to resident`
                                            : alert.status === "open"
                                            ? "Awaiting acceptance in Pune Circle..."
                                            : "Bypassed"}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Stage 3: Arrived */}
                                    <div className="flex items-start gap-3 relative">
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 z-10 shadow-sm ${
                                          alert.status === "arrived" || alert.status === "resolved"
                                            ? "bg-[#0F5F5C] text-white"
                                            : "bg-white border-2 border-gray-300 text-gray-400"
                                        }`}
                                      >
                                        <span className="material-symbols-outlined text-[14px]">
                                          {alert.status === "arrived" || alert.status === "resolved"
                                            ? "check"
                                            : "location_on"}
                                        </span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-xs font-bold text-[#1C2826]">Arrived on Scene</span>
                                        <span className="text-[10px] text-[#5A6563]">
                                          {alert.status === "arrived" || alert.status === "resolved"
                                            ? "Volunteer confirmed doorstep arrival"
                                            : "Pending arrival"}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Stage 4: Resolved */}
                                    <div className="flex items-start gap-3 relative">
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 z-10 shadow-sm ${
                                          alert.status === "resolved"
                                            ? "bg-[#0F5F5C] text-white"
                                            : "bg-white border-2 border-gray-300 text-gray-400"
                                        }`}
                                      >
                                        <span className="material-symbols-outlined text-[14px]">
                                          {alert.status === "resolved" ? "check" : "task_alt"}
                                        </span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-xs font-bold text-[#1C2826]">Resolved</span>
                                        <span className="text-[10px] text-[#5A6563]">
                                          {alert.status === "resolved"
                                            ? "Incident completed and resident safe"
                                            : "In progress"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                /* Regular Missed Dose Timeline */
                                <div className="flex flex-col gap-3 pt-2 border-t border-amber-200">
                                  <span className="text-[11px] font-bold text-[#5A6563] uppercase tracking-wider">
                                    Incident Progression
                                  </span>
                                  <div className="flex flex-col gap-3 relative pl-3 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-300">
                                    {alert.timeline.map((step, idx) => (
                                      <div key={idx} className="flex items-start gap-3 relative">
                                        <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs shrink-0 z-10 shadow-sm">
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
                                </div>
                              )}

                              {/* Action buttons */}
                              {relatedMed && (
                                <button
                                  type="button"
                                  onClick={() => handleMarkAsGiven(relatedMed)}
                                  className="w-full h-9 rounded-lg bg-[#0F5F5C] hover:bg-[#0B4644] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm mt-1"
                                >
                                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                  <span>Mark as given &amp; resolve alert</span>
                                </button>
                              )}

                              {isSos && alert.status !== "resolved" && (
                                <button
                                  type="button"
                                  onClick={() => openResolveAlertModal(alert)}
                                  className="w-full h-9 rounded-lg bg-white border border-[#E8E2D8] hover:bg-[#FAF7F2] text-[#1C2826] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm mt-1"
                                >
                                  <span className="material-symbols-outlined text-[16px] text-[#0F5F5C]">task_alt</span>
                                  <span>Resolve incident</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </aside>
              </div>
            </>
          )}
        </main>
      </div>

      {/* MODAL: POST HEALTH UPDATE */}
      {healthUpdateResident && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-xl max-w-md w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F5F5C] text-[24px]">vital_signs</span>
                <h3 className="text-base font-bold text-[#1C2826]">
                  Post Health Update ({healthUpdateResident.name})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setHealthUpdateResident(null)}
                className="text-[#5A6563] hover:text-[#1C2826] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitHealthUpdate} className="pt-4 flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1C2826]">Blood Pressure (BP)</label>
                  <input
                    type="text"
                    value={updateBp}
                    onChange={(e) => setUpdateBp(e.target.value)}
                    placeholder="e.g. 120/80 mmHg"
                    className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1C2826]">Pulse / Heart Rate</label>
                  <input
                    type="text"
                    value={updatePulse}
                    onChange={(e) => setUpdatePulse(e.target.value)}
                    placeholder="e.g. 72 bpm"
                    className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1C2826]">Mood / Demeanor</label>
                <select
                  value={updateMood}
                  onChange={(e) => setUpdateMood(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C] bg-white"
                >
                  <option value="Happy / Calm">Happy / Calm</option>
                  <option value="Resting comfortably">Resting comfortably</option>
                  <option value="Cheerful & Active">Cheerful &amp; Active</option>
                  <option value="Mildly Fatigued">Mildly Fatigued</option>
                  <option value="Anxious">Anxious</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1C2826]">Observation / Nursing Note *</label>
                <textarea
                  rows={3}
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  placeholder="e.g. Vitals verified normal, had lunch on time."
                  required
                  className="p-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setHealthUpdateResident(null)}
                  disabled={savingHealthUpdate}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A6563] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingHealthUpdate || !updateNote.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {savingHealthUpdate ? "Posting..." : "Post Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT RESIDENT */}
      {editingResident && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-xl max-w-md w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F5F5C] text-[24px]">edit</span>
                <h3 className="text-base font-bold text-[#1C2826]">Edit Resident Profile</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingResident(null)}
                className="text-[#5A6563] hover:text-[#1C2826] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitEditResident} className="pt-4 flex flex-col gap-4 text-xs">
              {/* Photo Upload */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8]">
                {editPhoto ? (
                  <div className="relative group shrink-0">
                    <img
                      src={editPhoto}
                      alt="Preview"
                      className="w-14 h-14 rounded-xl object-cover border border-[#E8E2D8] shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setEditPhoto("")}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[12px] shadow-sm hover:bg-red-700"
                      title="Remove photo"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-white border border-[#E8E2D8] flex items-center justify-center text-[#5A6563] shrink-0">
                    <span className="material-symbols-outlined text-[24px]">person</span>
                  </div>
                )}
                <div className="flex flex-col gap-1 grow">
                  <span className="font-bold text-[#1C2826]">Resident Photo</span>
                  <span className="text-[11px] text-[#5A6563]">JPG, PNG or WebP up to 2MB</span>
                  <label className="mt-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#0F5F5C]/30 text-[#0F5F5C] font-bold text-xs hover:bg-[#E6F4F1] cursor-pointer w-fit transition-colors">
                    <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                    <span>{editPhoto ? "Change Photo" : "Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handlePhotoFileToDataUrl(file, (url) => setEditPhoto(url));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1C2826]">Full Name *</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1C2826]">Age</label>
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1C2826]">Room / Address</label>
                  <input
                    type="text"
                    value={editRoom}
                    onChange={(e) => setEditRoom(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1C2826]">Blood Group</label>
                  <select
                    value={editBlood}
                    onChange={(e) => setEditBlood(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C] bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1C2826]">Allergies</label>
                  <input
                    type="text"
                    value={editAllergies}
                    onChange={(e) => setEditAllergies(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1C2826]">Health Conditions</label>
                <input
                  type="text"
                  value={editConditions}
                  onChange={(e) => setEditConditions(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingResident(null)}
                  disabled={savingEditResident}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A6563] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEditResident || !editName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {savingEditResident ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESOLVE INCIDENT (Admin flow requiring short note) */}
      {resolvingAlert && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-xl max-w-md w-full p-6 animate-scale-up flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F5F5C] text-[24px]">task_alt</span>
                <h3 className="text-base font-bold text-[#1C2826]">Resolve Incident</h3>
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
              Enter a brief resolution note for the care log. This will resolve the alert and restore the resident to stable status.
            </p>

            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-bold text-[#1C2826]">Resolution Note *</label>
              <textarea
                rows={3}
                value={resolveNote}
                onChange={(e) => setResolveNote(e.target.value)}
                placeholder="e.g. Senior verified safe by care administrator."
                required
                className="p-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResolvingAlert(null)}
                disabled={savingResolveAlert}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A6563] hover:bg-[#FAF7F2] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResolveIncident}
                disabled={savingResolveAlert || !resolveNote.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                {savingResolveAlert ? "Saving..." : "Confirm & Resolve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD RESIDENT */}
      {showAddResidentModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-xl max-w-md w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F5F5C] text-[24px]">person_add</span>
                <h3 className="text-base font-bold text-[#1C2826]">Add Resident</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddResidentModal(false)}
                className="text-[#5A6563] hover:text-[#1C2826] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddResidentSubmit} className="pt-4 flex flex-col gap-4 text-xs">
              {/* Photo Upload */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8]">
                {newResPhoto ? (
                  <div className="relative group shrink-0">
                    <img
                      src={newResPhoto}
                      alt="Preview"
                      className="w-14 h-14 rounded-xl object-cover border border-[#E8E2D8] shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setNewResPhoto("")}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[12px] shadow-sm hover:bg-red-700"
                      title="Remove photo"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-white border border-[#E8E2D8] flex items-center justify-center text-[#5A6563] shrink-0">
                    <span className="material-symbols-outlined text-[24px]">person</span>
                  </div>
                )}
                <div className="flex flex-col gap-1 grow">
                  <span className="font-bold text-[#1C2826]">Resident Photo (Optional)</span>
                  <span className="text-[11px] text-[#5A6563]">JPG, PNG or WebP up to 2MB</span>
                  <label className="mt-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#0F5F5C]/30 text-[#0F5F5C] font-bold text-xs hover:bg-[#E6F4F1] cursor-pointer w-fit transition-colors">
                    <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                    <span>{newResPhoto ? "Change Photo" : "Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handlePhotoFileToDataUrl(file, (url) => setNewResPhoto(url));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1C2826]">Full Name *</label>
                <input
                  type="text"
                  value={newResName}
                  onChange={(e) => setNewResName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  required
                  className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1C2826]">Age</label>
                  <input
                    type="number"
                    value={newResAge}
                    onChange={(e) => setNewResAge(e.target.value)}
                    placeholder="e.g. 78"
                    className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1C2826]">Room / Address</label>
                  <input
                    type="text"
                    value={newResRoom}
                    onChange={(e) => setNewResRoom(e.target.value)}
                    placeholder="e.g. Room 204"
                    className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1C2826]">Blood Group</label>
                  <select
                    value={newResBlood}
                    onChange={(e) => setNewResBlood(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C] bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1C2826]">Known Allergies</label>
                  <input
                    type="text"
                    value={newResAllergies}
                    onChange={(e) => setNewResAllergies(e.target.value)}
                    placeholder="e.g. Penicillin"
                    className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1C2826]">Health Conditions</label>
                <input
                  type="text"
                  value={newResConditions}
                  onChange={(e) => setNewResConditions(e.target.value)}
                  placeholder="e.g. Hypertension, Diabetes"
                  className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddResidentModal(false)}
                  disabled={savingResident}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A6563] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingResident || !newResName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {savingResident ? "Saving..." : "Save Resident"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MEDICINE */}
      {showAddMedicineModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-xl max-w-md w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F5F5C] text-[24px]">medication</span>
                <h3 className="text-base font-bold text-[#1C2826]">Schedule Medicine</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddMedicineModal(false)}
                className="text-[#5A6563] hover:text-[#1C2826] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddMedicineSubmit} className="pt-4 flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1C2826]">Resident *</label>
                <select
                  value={newMedResidentId}
                  onChange={(e) => setNewMedResidentId(e.target.value)}
                  required
                  className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C] bg-white"
                >
                  <option value="">Select a resident...</option>
                  {residents.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.room})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1C2826]">Medicine Name *</label>
                  <input
                    type="text"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    placeholder="e.g. Amlodipine"
                    required
                    className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#1C2826]">Dose *</label>
                  <input
                    type="text"
                    value={newMedDose}
                    onChange={(e) => setNewMedDose(e.target.value)}
                    placeholder="e.g. 5mg or 1 tab"
                    required
                    className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1C2826]">Scheduled Time (24h HH:MM) *</label>
                <input
                  type="time"
                  value={newMedTime}
                  onChange={(e) => setNewMedTime(e.target.value)}
                  required
                  className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1C2826]">Instructions</label>
                <input
                  type="text"
                  value={newMedInstructions}
                  onChange={(e) => setNewMedInstructions(e.target.value)}
                  placeholder="e.g. Take with water after breakfast"
                  className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#0F5F5C]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMedicineModal(false)}
                  disabled={savingMedicine}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A6563] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingMedicine || !newMedName.trim() || !newMedResidentId}
                  className="px-5 py-2.5 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {savingMedicine ? "Saving..." : "Save Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ORGANIZATION PHONE */}
      {showEditOrgModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-xl max-w-md w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F5F5C] text-[24px]">call</span>
                <h3 className="text-base font-bold text-[#1C2826]">Edit Care Desk Contact Phone</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditOrgModal(false)}
                className="text-[#5A6563] hover:text-[#1C2826] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveOrgPhone} className="pt-4 flex flex-col gap-4 text-xs">
              <p className="text-xs text-[#5A6563]">
                This phone number is saved in Firestore (<code>organizations/{orgId}</code>) and is displayed across all family and volunteer portals for direct communication with the care desk.
              </p>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1C2826]">Organization Phone Number *</label>
                <input
                  type="text"
                  value={editOrgPhone}
                  onChange={(e) => setEditOrgPhone(e.target.value)}
                  placeholder="e.g. +91 90000 00001 (demo)"
                  required
                  className="h-10 px-3 rounded-xl border border-[#E8E2D8] text-sm font-mono focus:outline-none focus:border-[#0F5F5C]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditOrgModal(false)}
                  disabled={savingOrgPhone}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A6563] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingOrgPhone || !editOrgPhone.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {savingOrgPhone ? "Saving..." : "Save Phone Number"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
