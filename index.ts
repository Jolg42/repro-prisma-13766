console.log("Prisma");
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
});

// issue https://github.com/prisma/prisma/issues/13242
async function main() {
  const result = await prisma.orderStatusHistory.create({
    data: {
      status: "NEW",
      orderId: 1000,
    },
  });

  console.log(result);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
