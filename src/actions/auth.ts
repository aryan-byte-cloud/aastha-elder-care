"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function signUpAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = (formData.get("email") as string)?.toLowerCase().trim();
    const password = formData.get("password") as string;
    const role = (formData.get("role") as string) || "FAMILY";
    const phone = formData.get("phone") as string;

    if (!email || !password) {
      return { error: "Email and password are required." };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name || email.split("@")[0],
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
        phone: phone || null,
      },
    });

    return {
      success: true,
      message: "Account created successfully. You can now log in.",
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
    };
  } catch (error) {
    console.error("signUpAction error:", error);
    return { error: "Failed to create account. Please try again." };
  }
}

export async function updateRoleAction(userId: string, role: string) {
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: role.toUpperCase() },
    });
    return { success: true, role: updated.role };
  } catch (error) {
    console.error("updateRoleAction error:", error);
    return { error: "Failed to update role." };
  }
}
