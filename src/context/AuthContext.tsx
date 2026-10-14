"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type UserRole = "admin" | "family" | "volunteer" | "platform_admin";

export interface UserProfile {
  uid: string;
  name: string;
  phone?: string;
  email: string;
  role: UserRole;
  orgId?: string;
  orgStatus?: "pending" | "approved" | "rejected";
  verified?: boolean;
  verificationStatus?: "pending" | "verified" | "rejected";
  createdAt?: unknown;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  authError: null,
  clearAuthError: () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchProfile = async (firebaseUser: User) => {
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      let userSnap = await getDoc(userRef);

      // If document does not exist yet, allow a brief grace period (up to 4 retries, 500ms each)
      // for newly created accounts where setDoc or batch.commit is still in flight
      if (!userSnap.exists()) {
        const createdTime = firebaseUser.metadata.creationTime
          ? new Date(firebaseUser.metadata.creationTime).getTime()
          : 0;
        const isRecentAccount = Date.now() - createdTime < 20000; // created within last 20 seconds

        if (isRecentAccount) {
          for (let attempt = 1; attempt <= 4; attempt++) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            userSnap = await getDoc(userRef);
            if (userSnap.exists()) break;
          }
        }
      }

      if (userSnap.exists()) {
        const data = userSnap.data();
        const rawRole = (data.role as string)?.toLowerCase();
        const VALID_ROLES: UserRole[] = ["admin", "family", "volunteer", "platform_admin"];

        // If user has no valid role, sign them out and show incomplete setup message
        if (!rawRole || !VALID_ROLES.includes(rawRole as UserRole)) {
          console.warn("User has invalid or missing role in users doc. Signing out.");
          await signOut(auth);
          setUser(null);
          setProfile(null);
          setRole(null);
          setAuthError("Your account setup is incomplete – please contact support");
          return;
        }

        const normalizedRole = rawRole as UserRole;

        const isSureshDemo = firebaseUser.email === "suresh@saathi.demo";
        const isVerified =
          data.verified !== undefined
            ? Boolean(data.verified)
            : isSureshDemo
            ? true
            : false;

        const userOrgId = data.orgId || (normalizedRole === "family" || normalizedRole === "platform_admin" ? undefined : "sukoon-home");

        // Read organization status if admin
        let orgStatus: "pending" | "approved" | "rejected" = "approved";
        if (normalizedRole === "admin" && userOrgId && userOrgId !== "sukoon-home") {
          const orgRef = doc(db, "organizations", userOrgId);
          const orgSnap = await getDoc(orgRef);
          if (orgSnap.exists()) {
            orgStatus = (orgSnap.data()?.status as "pending" | "approved" | "rejected") || "pending";
          } else {
            orgStatus = "pending";
          }
        }

        const userProfile: UserProfile = {
          uid: firebaseUser.uid,
          name: data.name || firebaseUser.displayName || "User",
          phone: data.phone || "",
          email: data.email || firebaseUser.email || "",
          role: normalizedRole,
          ...(userOrgId ? { orgId: userOrgId } : {}),
          orgStatus: orgStatus,
          verified: isVerified,
          createdAt: data.createdAt,
        };
        setProfile(userProfile);
        setRole(normalizedRole);
        setAuthError(null);
      } else {
        // If a logged-in user has no users document in Firestore, sign them out
        console.warn("Logged-in user has no users document in Firestore. Signing out.");
        await signOut(auth);
        setUser(null);
        setProfile(null);
        setRole(null);
        setAuthError("Your account setup is incomplete – please contact support");
        return;
      }
    } catch (err) {
      console.error("Error reading user profile from Firestore:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await fetchProfile(firebaseUser);
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  const clearAuthError = () => setAuthError(null);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
      setRole(null);
      setAuthError(null);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        authError,
        clearAuthError,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
