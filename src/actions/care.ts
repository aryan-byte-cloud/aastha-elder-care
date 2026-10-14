"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFamilyDashboardData() {
  try {
    const senior = await prisma.seniorResident.findFirst({
      include: {
        careLogs: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        alerts: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    return { senior };
  } catch (error) {
    console.error("getFamilyDashboardData error:", error);
    return { senior: null };
  }
}

export async function getAdminDashboardData() {
  try {
    const [seniors, alerts, volunteers, users] = await Promise.all([
      prisma.seniorResident.findMany({
        include: { careLogs: { take: 3, orderBy: { createdAt: "desc" } } },
      }),
      prisma.emergencyAlert.findMany({
        where: { status: "ACTIVE" },
        include: { senior: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.volunteerProfile.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.user.findMany({
        select: { id: true, name: true, role: true, email: true },
      }),
    ]);

    return {
      residentsCount: seniors.length,
      activeAlertsCount: alerts.length,
      volunteersCount: volunteers.length,
      seniors,
      alerts,
      volunteers,
      users,
    };
  } catch (error) {
    console.error("getAdminDashboardData error:", error);
    return {
      residentsCount: 0,
      activeAlertsCount: 0,
      volunteersCount: 0,
      seniors: [],
      alerts: [],
      volunteers: [],
      users: [],
    };
  }
}

export async function addCareLogAction(seniorId: string, title: string, category: string, details: string) {
  try {
    const newLog = await prisma.careLog.create({
      data: {
        seniorId,
        title,
        category,
        details,
        recordedBy: "Caregiver (Mobile App)",
      },
    });
    revalidatePath("/family");
    revalidatePath("/admin");
    return { success: true, log: newLog };
  } catch (error) {
    console.error("addCareLogAction error:", error);
    return { error: "Failed to create care log." };
  }
}

export async function triggerEmergencyAlertAction(seniorId?: string, message?: string) {
  try {
    const alert = await prisma.emergencyAlert.create({
      data: {
        seniorId: seniorId || null,
        message: message || "EMERGENCY SOS Triggered from Resident Console",
        severity: "CRITICAL",
        status: "ACTIVE",
      },
    });
    revalidatePath("/family");
    revalidatePath("/admin");
    return { success: true, alert };
  } catch (error) {
    console.error("triggerEmergencyAlertAction error:", error);
    return { error: "Failed to trigger emergency alert." };
  }
}
