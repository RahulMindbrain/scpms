import prisma from "../config/db";

async function seedSkills() {
  const skills = [
    { name: "Java" },
    { name: "C" },
    { name: "C++" },
    { name: "Python" },
    { name: "Django" },
    { name: "Flask" },
    { name: "Node" },
    { name: "Spring/Spring-Boot" },
    { name: "Playright" },
    { name: "Selenium" },
    { name: "Unit-Testing" },
    { name: "Regression-Testing" },
    { name: "Load-Testing" },
    { name: "Express" },
    { name: "Nest" },
    { name: "Pytorch" },
    { name: "MySQL" },
    { name: "NoSQL" },
    { name: "PostgresSQL" },
    { name: "AWS" },
    { name: "GCP" },
    { name: "React" },
    { name: "Angular" },
    { name: "Graffana" },
    { name: "Prometheus" },
    { name: "Prisma" },
    { name: "Mongoose" },
    { name: "Type-ORM" },
  ];

  await prisma.skill.deleteMany({});

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    });
  }
  console.log("🎉 Skills Seeded Successfully");
}

seedSkills()
  .catch((e) => {
    console.log("💀 Seeding failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
