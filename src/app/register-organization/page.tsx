"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser,
  fetchSignInMethodsForEmail,
  User,
} from "firebase/auth";
import {
  doc,
  collection,
  serverTimestamp,
  writeBatch,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

const MAX_FILE_SIZE_BYTES = 700 * 1024; // 700 KB
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

interface UploadedDoc {
  kind: "registration_certificate" | "address_proof" | "authorised_id";
  kindLabel: string;
  file: File | null;
  fileName: string;
  mimeType: string;
  base64: string;
  error?: string | null;
}

export default function RegisterOrganizationPage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();

  // Current Step: 1 | 2 | 3
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Account Info
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2: Organisation Info
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState<"Old age home" | "NGO" | "Other care organisation">("Old age home");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [darpanId, setDarpanId] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Pune");
  const [state, setState] = useState("Maharashtra");
  const [orgPhone, setOrgPhone] = useState("");
  const [approxResidents, setApproxResidents] = useState("25");

  // Step 3: Documents
  const [regCert, setRegCert] = useState<UploadedDoc>({
    kind: "registration_certificate",
    kindLabel: "Registration Certificate",
    file: null,
    fileName: "",
    mimeType: "",
    base64: "",
    error: null,
  });

  const [addrProof, setAddrProof] = useState<UploadedDoc>({
    kind: "address_proof",
    kindLabel: "Address Proof",
    file: null,
    fileName: "",
    mimeType: "",
    base64: "",
    error: null,
  });

  const [authId, setAuthId] = useState<UploadedDoc>({
    kind: "authorised_id",
    kindLabel: "Authorised Person's ID",
    file: null,
    fileName: "",
    mimeType: "",
    base64: "",
    error: null,
  });

  const [globalError, setGlobalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // File Upload Processor
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<UploadedDoc>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setter((prev) => ({
        ...prev,
        file: null,
        fileName: "",
        mimeType: "",
        base64: "",
        error: "Invalid file format. Please upload PDF, JPG, or PNG only.",
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeKb = (file.size / 1024).toFixed(0);
      setter((prev) => ({
        ...prev,
        file: null,
        fileName: "",
        mimeType: "",
        base64: "",
        error: `File size (${sizeKb} KB) exceeds the 700 KB limit. Please choose a smaller file.`,
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract pure base64 data after comma
      const commaIndex = result.indexOf(",");
      const base64Data = commaIndex >= 0 ? result.substring(commaIndex + 1) : result;

      setter((prev) => ({
        ...prev,
        file: file,
        fileName: file.name,
        mimeType: file.type,
        base64: base64Data,
        error: null,
      }));
    };
    reader.onerror = () => {
      setter((prev) => ({
        ...prev,
        file: null,
        fileName: "",
        mimeType: "",
        base64: "",
        error: "Failed to read file. Please try again.",
      }));
    };
    reader.readAsDataURL(file);
  };

  // Step 1 Validation & Proceed
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    if (!contactName.trim() || !contactPhone.trim() || !email.trim() || !password) {
      setGlobalError("Please fill out all required contact and account fields.");
      return;
    }
    if (password.length < 6) {
      setGlobalError("Password must be at least 6 characters.");
      return;
    }
    setCurrentStep(2);
  };

  // Step 2 Validation & Proceed
  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    if (
      !orgName.trim() ||
      !registrationNumber.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !orgPhone.trim()
    ) {
      setGlobalError("Please fill out all required organisation details.");
      return;
    }
    setCurrentStep(3);
  };

  // Step 3 Final Submit
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    // 1. Comprehensive pre-validation of all organisation data before touching auth
    if (!contactName.trim() || !contactPhone.trim() || !email.trim() || !password) {
      setGlobalError("Please fill out all required contact and account fields.");
      setCurrentStep(1);
      return;
    }
    if (password.length < 6) {
      setGlobalError("Password must be at least 6 characters.");
      setCurrentStep(1);
      return;
    }
    if (
      !orgName.trim() ||
      !registrationNumber.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !orgPhone.trim()
    ) {
      setGlobalError("Please fill out all required organisation details.");
      setCurrentStep(2);
      return;
    }
    if (!regCert.base64) {
      setGlobalError("Please upload the Registration Certificate (max 700 KB).");
      return;
    }
    if (!addrProof.base64) {
      setGlobalError("Please upload the Address Proof (max 700 KB).");
      return;
    }
    if (!authId.base64) {
      setGlobalError("Please upload the Authorised Person's ID (max 700 KB).");
      return;
    }

    setSubmitting(true);
    const emailLower = email.trim().toLowerCase();

    // Organisation IDs must be random auto-generated Firestore IDs, NOT based on the name.
    // Two organisations may have the same name in different cities.
    const orgDocRef = doc(collection(db, "organizations"));
    const orgId = orgDocRef.id;

    let createdAuthUser: User | null = null;

    try {
      // 4. Create Firebase Auth user for the administrator
      const userCredential = await createUserWithEmailAndPassword(auth, emailLower, password);
      createdAuthUser = userCredential.user;
      await updateProfile(createdAuthUser, { displayName: contactName.trim() });
      const uid = createdAuthUser.uid;

      // 5. Create the organisation document, user document, and uploaded documents together in a batch
      const batch = writeBatch(db);

      // A. organizations/{orgId}
      batch.set(orgDocRef, {
        id: orgId,
        name: orgName.trim(),
        type: orgType,
        registrationNumber: registrationNumber.trim(),
        darpanId: darpanId.trim() || "",
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        phone: orgPhone.trim(),
        approxResidents: Number(approxResidents) || 0,
        contactName: contactName.trim(),
        email: emailLower,
        status: "pending", // strictly pending review by platform owner
        submittedBy: uid,
        createdAt: serverTimestamp(),
      });

      // B. users/{uid} document with role "admin" and that orgId (never left without a role)
      const userDocRef = doc(db, "users", uid);
      batch.set(userDocRef, {
        name: contactName.trim(),
        phone: contactPhone.trim(),
        email: emailLower,
        role: "admin",
        orgId: orgId,
        createdAt: serverTimestamp(),
      });

      // C. orgDocuments collection
      const documentsToSave = [regCert, addrProof, authId];
      for (const d of documentsToSave) {
        const docRef = doc(collection(db, "orgDocuments"));
        batch.set(docRef, {
          orgId: orgId,
          kind: d.kind,
          kindLabel: d.kindLabel,
          fileName: d.fileName,
          mimeType: d.mimeType,
          dataBase64: d.base64,
          uploadedAt: serverTimestamp(),
        });
      }

      // Commit all documents together atomically
      await batch.commit();

      // 6. Refresh AuthContext profile and redirect to /pending
      await refreshProfile();
      router.push("/pending");
    } catch (err: unknown) {
      console.error("Organisation registration error:", err);

      // If any step failed after creating the Firebase Auth user, delete the newly created user
      // so we never leave an account without a role or an orphaned login
      if (createdAuthUser) {
        try {
          await deleteUser(createdAuthUser);
        } catch (deleteErr) {
          console.error("Failed to delete user on registration rollback:", deleteErr);
        }
      }

      const code = (err as { code?: string })?.code;
      if (code === "auth/email-already-in-use") {
        setGlobalError("This email address is already registered. Please log in or use another email.");
      } else if (code === "auth/weak-password") {
        setGlobalError("Password is too weak. Please use at least 6 characters.");
      } else {
        setGlobalError(err instanceof Error ? err.message : "Failed to register organisation. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C2826] flex flex-col font-sans">
      <Header />

      <main className="w-full pt-28 pb-16 px-6 flex-grow flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-3xl border border-[#E8E2D8] shadow-sm p-6 sm:p-10 flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2 border-b border-[#E8E2D8] pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F3EE] border border-[#BDE0D1] text-[#0F5F5C] text-xs font-bold w-fit">
              <span className="material-symbols-outlined text-[18px]">domain_add</span>
              <span>Organisation Onboarding</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2826] tracking-tight">
              Register your care home or NGO
            </h1>
            <p className="text-sm text-[#5A6563]">
              Join the Aastha community care network. Every organisation is verified by platform administrators to ensure elder dignity and care safety.
            </p>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#E8E2D8] z-0"></div>
            <div
              className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#0F5F5C] transition-all duration-300 z-0"
              style={{
                width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
              }}
            ></div>

            {/* Step 1 Circle */}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  currentStep >= 1
                    ? "bg-[#0F5F5C] text-white shadow-sm"
                    : "bg-[#FAF7F2] text-[#5A6563] border border-[#E8E2D8]"
                }`}
              >
                1
              </div>
              <span className="text-[11px] font-bold text-[#1C2826]">Account</span>
            </div>

            {/* Step 2 Circle */}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  currentStep >= 2
                    ? "bg-[#0F5F5C] text-white shadow-sm"
                    : "bg-white text-[#5A6563] border-2 border-[#E8E2D8]"
                }`}
              >
                2
              </div>
              <span className="text-[11px] font-bold text-[#1C2826]">Organisation</span>
            </div>

            {/* Step 3 Circle */}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  currentStep === 3
                    ? "bg-[#0F5F5C] text-white shadow-sm"
                    : "bg-white text-[#5A6563] border-2 border-[#E8E2D8]"
                }`}
              >
                3
              </div>
              <span className="text-[11px] font-bold text-[#1C2826]">Documents</span>
            </div>
          </div>

          {/* Global Error Banner */}
          {globalError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm font-semibold rounded-2xl flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-red-600 shrink-0 mt-0.5">error</span>
              <span>{globalError}</span>
            </div>
          )}

          {/* STEP 1: ACCOUNT FORM */}
          {currentStep === 1 && (
            <form onSubmit={handleNextStep1} className="flex flex-col gap-5">
              <h2 className="text-base font-bold text-[#1C2826] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F5F5C]">person</span>
                <span>Contact Person &amp; Login Details</span>
              </h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1C2826]">Contact Person Name *</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Kulkarni"
                  required
                  className="h-12 px-4 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C2826]">Contact Mobile Phone *</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. +91 90000 00000"
                    required
                    className="h-12 px-4 rounded-xl border border-[#E8E2D8] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C2826]">Admin Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. contact@sukoonhome.org"
                    required
                    className="h-12 px-4 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1C2826]">Set Admin Password (min 6 characters) *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  minLength={6}
                  className="h-12 px-4 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E8E2D8]">
                <Link
                  href="/role"
                  className="text-xs font-bold text-[#5A6563] hover:text-[#1C2826] flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Back to Role Selection</span>
                </Link>

                <button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white font-bold text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
                >
                  <span>Continue to Organisation</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: ORGANISATION DETAILS */}
          {currentStep === 2 && (
            <form onSubmit={handleNextStep2} className="flex flex-col gap-5">
              <h2 className="text-base font-bold text-[#1C2826] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F5F5C]">apartment</span>
                <span>Organisation Profile &amp; Location</span>
              </h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1C2826]">Organisation Legal Name *</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Sukoon Home Elder Care Society"
                  required
                  className="h-12 px-4 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C2826]">Organisation Type *</label>
                  <select
                    value={orgType}
                    onChange={(e) => setOrgType(e.target.value as typeof orgType)}
                    required
                    className="h-12 px-4 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5F5C] bg-white"
                  >
                    <option value="Old age home">Old age home</option>
                    <option value="NGO">NGO</option>
                    <option value="Other care organisation">Other care organisation</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C2826]">Government Registration Number *</label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. MH-PUN-2021-9481"
                    required
                    className="h-12 px-4 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C2826]">NGO Darpan ID (Optional)</label>
                  <input
                    type="text"
                    value={darpanId}
                    onChange={(e) => setDarpanId(e.target.value)}
                    placeholder="e.g. MH/2021/029148"
                    className="h-12 px-4 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C2826]">Organisation Desk Phone *</label>
                  <input
                    type="tel"
                    value={orgPhone}
                    onChange={(e) => setOrgPhone(e.target.value)}
                    placeholder="e.g. +91 90000 00001"
                    required
                    className="h-12 px-4 rounded-xl border border-[#E8E2D8] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1C2826]">Facility Street Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Plot 42, Model Colony, Shivajinagar"
                  required
                  className="h-12 px-4 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C2826]">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Pune"
                    required
                    className="h-12 px-4 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C2826]">State *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    required
                    className="h-12 px-4 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C2826]">Approx. Seniors *</label>
                  <input
                    type="number"
                    min={1}
                    value={approxResidents}
                    onChange={(e) => setApproxResidents(e.target.value)}
                    placeholder="e.g. 25"
                    required
                    className="h-12 px-4 rounded-xl border border-[#E8E2D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-[#5A6563] hover:text-[#1C2826] flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Back to Account</span>
                </button>

                <button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white font-bold text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
                >
                  <span>Continue to Documents</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: DOCUMENT UPLOADS */}
          {currentStep === 3 && (
            <form onSubmit={handleFinalSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-bold text-[#1C2826] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0F5F5C]">file_present</span>
                  <span>Verification Documents Upload</span>
                </h2>
                <p className="text-xs text-[#5A6563]">
                  All 3 documents are required for platform verification. Allowed formats: PDF, JPG, PNG (maximum 700 KB each).
                </p>
              </div>

              {/* Doc 1: Registration Certificate */}
              <div className="p-4 rounded-2xl border border-[#E8E2D8] bg-[#FAF7F2] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1C2826]">
                    1. Registration Certificate (Trust / Society / 12A) *
                  </label>
                  {regCert.file && (
                    <span className="text-[11px] font-bold text-[#0F5F5C] flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      <span>Selected ({(regCert.file.size / 1024).toFixed(0)} KB)</span>
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  required
                  onChange={(e) => handleFileChange(e, setRegCert)}
                  className="text-xs text-[#5A6563] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0F5F5C] file:text-white hover:file:bg-[#0B4644] cursor-pointer"
                />
                {regCert.error && (
                  <p className="text-xs text-red-600 font-semibold">{regCert.error}</p>
                )}
              </div>

              {/* Doc 2: Address Proof */}
              <div className="p-4 rounded-2xl border border-[#E8E2D8] bg-[#FAF7F2] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1C2826]">
                    2. Address Proof (Utility Bill / Rent Agreement / Lease) *
                  </label>
                  {addrProof.file && (
                    <span className="text-[11px] font-bold text-[#0F5F5C] flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      <span>Selected ({(addrProof.file.size / 1024).toFixed(0)} KB)</span>
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  required
                  onChange={(e) => handleFileChange(e, setAddrProof)}
                  className="text-xs text-[#5A6563] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0F5F5C] file:text-white hover:file:bg-[#0B4644] cursor-pointer"
                />
                {addrProof.error && (
                  <p className="text-xs text-red-600 font-semibold">{addrProof.error}</p>
                )}
              </div>

              {/* Doc 3: Authorised Person's ID */}
              <div className="p-4 rounded-2xl border border-[#E8E2D8] bg-[#FAF7F2] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1C2826]">
                    3. Authorised Person&apos;s ID (Aadhaar / Passport / PAN) *
                  </label>
                  {authId.file && (
                    <span className="text-[11px] font-bold text-[#0F5F5C] flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      <span>Selected ({(authId.file.size / 1024).toFixed(0)} KB)</span>
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  required
                  onChange={(e) => handleFileChange(e, setAuthId)}
                  className="text-xs text-[#5A6563] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0F5F5C] file:text-white hover:file:bg-[#0B4644] cursor-pointer"
                />
                {authId.error && (
                  <p className="text-xs text-red-600 font-semibold">{authId.error}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={submitting}
                  className="text-xs font-bold text-[#5A6563] hover:text-[#1C2826] flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Back to Organisation</span>
                </button>

                <button
                  type="submit"
                  disabled={submitting || !regCert.base64 || !addrProof.base64 || !authId.base64}
                  className="h-12 px-7 rounded-xl bg-[#0F5F5C] hover:bg-[#0B4644] text-white font-bold text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  <span>{submitting ? "Submitting Application..." : "Submit Registration for Review"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
