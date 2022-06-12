import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
});

// issue: https://github.com/prisma/prisma/issues/13766
async function main() {
  const ordersNum = await prisma.order.count();
  console.log("Orders into database: " + ordersNum);

  if (ordersNum == 0) {
    console.log("Create a new order");
    const order = await prisma.order.create({
      data: {
        orderId: 1,
        paid: false,
        statusMilestones: {
          create: {
            status: "NEW",
          },
        },
      },
    });
    console.log(order);
  }

  console.log("Update Order with id 1");
  const updatedOrder = await prisma.order.update({
    where: {
      orderId: 1,
    },
    data: {
      paid: true,
    },
  });
  console.log(updatedOrder);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// The problem occurs from the onUpdate: Restrict
//   order                Order       @relation(fields: [orderId], references: [orderId], onUpdate: Restrict, onDelete: Cascade)
// 28 console.log("Update Order with id 1");
// → 29 const updatedOrder = await prisma.order.update(
//   The change you are trying to make would violate the required relation 'OrderToOrderStatusHistory' between the `Order` and `OrderStatusHistory` models.
//     at RequestHandler.request (C:\Users\manol\Desktop\prisma-playground\node_modules\@prisma\client\runtime\index.js:49022:15)
//     at async PrismaClient._request (C:\Users\manol\Desktop\prisma-playground\node_modules\@prisma\client\runtime\index.js:49919:18)
//     at async main (C:\Users\manol\Desktop\prisma-playground\index2.ts:29:24) {
//   code: 'P2014',
//   clientVersion: '3.15.1',
//   meta: {
//     relation_name: 'OrderToOrderStatusHistory',
//     model_a_name: 'Order',
//     model_b_name: 'OrderStatusHistory'
//   }
// }
