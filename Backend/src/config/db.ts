import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? [
          {
            emit: "event",
            level: "query",
          },
        ]
      : [],
});

if (process.env.NODE_ENV === "development") {
  prisma.$on("query", (e) => {
    console.log("\n🧾 Prisma Query:");
    console.log("Query:", e.query);
    console.log("Params:", e.params);
    console.log("Duration:", e.duration, "ms");
  });
}

export default prisma;
