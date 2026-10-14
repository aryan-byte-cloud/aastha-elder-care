"use server";

import { prisma } from "@/lib/prisma";

export async function registerVolunteerAction(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const email = (formData.get("email") as string)?.toLowerCase().trim();
    const city = (formData.get("city") as string) || "Pune";
    const locality = formData.get("locality") as string;
    const skills = formData.get("skills") as string;
    const availability = formData.get("availability") as string;
    const idProofType = formData.get("idProofType") as string;
    const emergencyContact = formData.get("emergencyContact") as string;

    if (!fullName || !phone) {
      return { error: "Full Name and Phone Number are required." };
    }

    // Find or create user
    let user = email ? await prisma.user.findUnique({ where: { email } }) : null;

    if (!user && email) {
      user = await prisma.user.create({
        data: {
          name: fullName,
          email,
          role: "VOLUNTEER",
          phone,
        },
      });
    }

    if (!user) {
      // Create guest or standalone volunteer user
      const dummyEmail = `volunteer_${Date.now()}@saathi.local`;
      user = await prisma.user.create({
        data: {
          name: fullName,
          email: dummyEmail,
          role: "VOLUNTEER",
          phone,
        },
      });
    }

    const volunteer = await prisma.volunteerProfile.upsert({
      where: { userId: user.id },
      update: {
        fullName,
        phone,
        city,
        locality: locality || "Pune Circle",
        skills: skills || "Companionship, Daily check-ins",
        availability: availability || "Flexible",
        idProofType: idProofType || "Government ID",
        emergencyContact,
        status: "PENDING",
      },
      create: {
        userId: user.id,
        fullName,
        phone,
        city,
        locality: locality || "Pune Circle",
        skills: skills || "Companionship, Daily check-ins",
        availability: availability || "Flexible",
        idProofType: idProofType || "Government ID",
        emergencyContact,
        status: "PENDING",
      },
    });

    return {
      success: true,
      message: "Application submitted successfully! Your NGO vetting is in progress.",
      volunteer,
    };
  } catch (error) {
    console.error("registerVolunteerAction error:", error);
    return { error: "Failed to submit volunteer application. Please try again." };
  }
}
