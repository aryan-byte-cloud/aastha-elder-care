export type ResidentStatus = "stable" | "attention" | "sos";

export interface Resident {
  id: string;
  name: string;
  age: number;
  room: string;
  orgId: string;
  bloodGroup: string;
  conditions: string;
  allergies: string;
  status: ResidentStatus;
  attentionReason?: string;
  familyUserIds: string[];
  inviteCode: string;
  photoUrl?: string;
  createdAt?: unknown;
}

export interface Medicine {
  id: string;
  residentId: string;
  orgId: string;
  name: string;
  dose: string;
  time: string; // "HH:MM" 24h format
  instructions: string;
}

export interface DoseLog {
  id: string;
  medicineId: string;
  residentId: string;
  orgId: string;
  date: string; // "YYYY-MM-DD"
  status: "given";
  givenAt: unknown;
  givenBy: string;
}

export type AlertType = "missed_dose" | "sos" | string;
export type AlertStatus = "open" | "accepted" | "arrived" | "resolved" | "escalated";

export interface AlertTimelineStep {
  step: string;
  by: string;
  at: string;
}

export interface CareAlert {
  id: string;
  residentId: string;
  orgId: string;
  type: AlertType;
  medicineId?: string;
  status: AlertStatus;
  message?: string;
  createdBy?: string;
  acceptedBy?: {
    uid: string;
    name: string;
    phone?: string;
  };
  declinedBy?: string[];
  escalateAt?: number; // timestamp in ms (now + 60000)
  timeline: AlertTimelineStep[];
  createdAt?: unknown;
}

export interface HealthUpdate {
  id: string;
  residentId: string;
  orgId: string;
  bp: string;
  pulse: string;
  mood: string;
  note: string;
  byName: string;
  createdAt?: unknown;
}

export interface VolunteerUser {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: "volunteer";
  orgId: string;
  verified: boolean;
  verificationStatus?: "pending" | "verified" | "rejected";
  skills?: string;
  area?: string;
  createdAt?: unknown;
}

export interface FamilyRequest {
  id: string;
  residentId: string;
  orgId: string;
  userId: string;
  name: string;
  phone: string;
  relationship: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: unknown;
}

export type OrgStatus = "pending" | "approved" | "rejected";

export interface OrganizationInfo {
  id: string;
  name: string;
  type?: string;
  registrationNumber?: string;
  darpanId?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  approxResidents?: number;
  contactName?: string;
  email?: string;
  status?: OrgStatus;
  rejectionReason?: string;
  submittedBy?: string;
  reviewedBy?: string;
  reviewedAt?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface OrgDocument {
  id: string;
  orgId: string;
  kind: string;
  kindLabel: string;
  fileName: string;
  mimeType: string;
  dataBase64: string;
  uploadedAt?: unknown;
}

