import pkg from "@prisma/client";
const { TransactionStatus } = pkg;
import prisma, { generateUUID } from "../config/database.js";
import { sendEmail } from "../config/reflectMail.js";
import orderConfirmationEmail from "../templates/mail/orderConfirmationEmail.js";

const createTransaction = async ({
  userId,
  gatewayOrderId,
  amount,
  currency = "INR",
}) => {
  return prisma.transaction.create({
    data: {
      id: generateUUID(),
      userId,
      gateway_order_id: gatewayOrderId,
      amount,
      currency,
      status: TransactionStatus.CREATED,
    },
  });
};

// payment.authorized webhook
const markAuthorized = async ({
  gatewayOrderId,
  method,
  vpa,
  email,
  contact,
}) => {
  return prisma.transaction.update({
    where: { gateway_order_id: gatewayOrderId },
    data: {
      status: TransactionStatus.AUTHORIZED,
      authorizedAt: new Date(),
      method,
      vpa,
      email,
      contact,
    },
  });
};

// payment.captured webhook (MOST IMPORTANT)
const markCaptured = async ({
  gatewayOrderId,
  gatewayPaymentId,
  fee,
  tax,
  baseAmount,
}) => {
  const transaction = await prisma.transaction.findUnique({
    where: { gateway_order_id: gatewayOrderId },
    include: {
      user: true,
      order: {
        include: {
          address: true,
          productorders: true,
        },
      },
    },
  });
  if (!transaction.order) {
    throw new Error("Transaction not found");
  }
  console.log("transaction productorders", transaction.order.productorders);

  await sendEmail(
    transaction.user.email,
    "Order Confirmation - SiriJewelz",
    "",
    orderConfirmationEmail({
      orderId: transaction.order.id,
      customerName: transaction.user.firstName,
      customerEmail: transaction.user.email,
      customerPhone: transaction.user.phone,
      orderNumber: transaction.order.invoiceNumber,
      orderDate: transaction.createdAt,
      items: transaction.order.productorders.map((item) => ({
        name: item.product_name,
        quantity: item.quantity,
        price: item.offer_price / 100 || item.product_price / 100,
        total: item.totalPrice / 100,
      })),
      subtotal: transaction.order.subtotal / 100,
      shipping: transaction.order.shipping / 100,
      total: transaction.order.total / 100,
      paymentStatus: "PAID",
      paymentMethod: transaction.method,
      transactionId: transaction.id,
      billNumber: true,
      bisHallmark: true,
      certificateAvailable: true,
      shippingAddress:
        transaction.order.address.addressline1 +
        transaction.order.address.addressline2 +
        transaction.order.address.city +
        transaction.order.address.state +
        transaction.order.address.pinCode,
    }),
  );
  return prisma.transaction.update({
    where: { gateway_order_id: gatewayOrderId },
    data: {
      gateway_payment_id: gatewayPaymentId,
      status: TransactionStatus.PAID,
      captured: true,
      capturedAt: new Date(),
      fee,
      tax,
      base_amount: baseAmount,
    },
  });
};

const markFailed = async ({ gatewayOrderId }) => {
  return prisma.transaction.update({
    where: { gateway_order_id: gatewayOrderId },
    data: {
      status: TransactionStatus.FAILED,
    },
  });
};

export { createTransaction, markAuthorized, markCaptured, markFailed };
