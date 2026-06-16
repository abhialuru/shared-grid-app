import "dotenv/config";
import { PrismaClient } from "./generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding 600 cells...");

  await prisma.cell.createMany({
    data: Array.from({ length: 600 }, (_, i) => ({
      id: i, // 0, 1, 2, ... 599
      ownerId: null,
      ownerName: null,
      ownerColor: null,
      capturedAt: null,
    })),
    skipDuplicates: true, // if you run seed again, don't crash — just skip
  });

  console.log("600 cells seeded!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
