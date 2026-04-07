import prisma from "../config/db";

async function main() {
  const departments = [
    { name: "Computer Science" },
    { name: "Information Technology" },
    { name: "Electronics and Communication" },
    { name: "Electrical Engineering" },
    { name: "Mechanical Engineering" },
    { name: "Civil Engineering" },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { name: dept.name }, // 🔥 unique field
      update: {},
      create: dept,
    });
  }

  console.log("✅ Departments seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
