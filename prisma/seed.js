const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database via node...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: "admin@saathi.in" },
    update: {
      name: "Sukoon Home Admin",
    },
    create: {
      email: "admin@saathi.in",
      name: "Sukoon Home Admin",
      password: hashedPassword,
      role: "ADMIN",
      phone: "+91 98230 11223",
    },
  });

  // 2. Create Family User: Priya Deshmukh (daughter)
  const familyUser = await prisma.user.upsert({
    where: { email: "family@saathi.in" },
    update: {
      name: "Priya Deshmukh (daughter)",
    },
    create: {
      email: "family@saathi.in",
      name: "Priya Deshmukh (daughter)",
      password: hashedPassword,
      role: "FAMILY",
      phone: "+91 98900 44556",
    },
  });

  // 3. Create Volunteer User: Suresh K. (volunteer)
  const volunteerUser = await prisma.user.upsert({
    where: { email: "volunteer@saathi.in" },
    update: {
      name: "Suresh K. (volunteer)",
    },
    create: {
      email: "volunteer@saathi.in",
      name: "Suresh K. (volunteer)",
      password: hashedPassword,
      role: "VOLUNTEER",
      phone: "+91 97654 32100",
      volunteer: {
        create: {
          fullName: "Suresh K.",
          phone: "+91 97654 32100",
          city: "Pune",
          locality: "Pune Circle",
          skills: "Companionship, Grocery runs, First aid",
          availability: "Flexible - Weekends & Evenings",
          idProofType: "Government ID",
          status: "VERIFIED",
        },
      },
    },
  });

  // 4. Create Senior Resident: Kamla Deshmukh (78, Sukoon Home, Room 204)
  const existingSenior = await prisma.seniorResident.findFirst({
    where: { name: "Kamla Deshmukh" },
  });

  const senior = existingSenior ?? await prisma.seniorResident.create({
    data: {
      name: "Kamla Deshmukh",
      age: 78,
      roomNumber: "204",
      emergencyContact: "+91 98900 44556 (Daughter: Priya Deshmukh)",
      status: "STABLE",
      medicalNotes: "Hypertension, mild arthritis. Morning Amlodipine 5mg with breakfast.",
      familyUserId: familyUser.id,
      careLogs: {
        create: [
          {
            title: "Morning Vitals Recorded",
            category: "VITALS",
            details: "BP: 124/82 mmHg | Pulse: 72 bpm | SpO2: 98%",
            status: "COMPLETED",
            recordedBy: "Floor Nurse",
          },
          {
            title: "Morning Dosage Taken",
            category: "MEDICATION",
            details: "Tab Amlodipine 5mg + Tab Multivitamin after breakfast",
            status: "COMPLETED",
            recordedBy: "Floor Nurse",
          },
          {
            title: "Veranda Walk & Sunning",
            category: "ACTIVITY",
            details: "Completed 20-minute morning garden stroll with walker support.",
            status: "COMPLETED",
            recordedBy: "Suresh K. (volunteer)",
          },
        ],
      },
      alerts: {
        create: [
          {
            message: "Scheduled evening physiotherapy check",
            severity: "MEDIUM",
            status: "ACTIVE",
          },
        ],
      },
    },
  });

  console.log("Database seeded successfully with authorized demo names!");
  console.log({
    admin: admin.email,
    family: familyUser.email,
    volunteer: volunteerUser.email,
    senior: senior.name,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
