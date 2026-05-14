import appConfig from "../config/app.js";
import { sendEmail } from "../config/reflectMail.js";
import dailyAnalyticsEmail from "../templates/mail/dailyAnalyticsEmail.js";
import orderStatusEmail from "../templates/mail/orderStatusEmail.js";

const data = "";

const periodEnd = new Date();
const periodStart = new Date(periodEnd.getTime() - 24 * 60 * 60 * 1000);

await sendEmail({
  from: appConfig.authEmail,
  to: "varcsoft@gmail.com",
  replyTo: appConfig.replyTo,
  subject: "Daily Analytics",
  html: dailyAnalyticsEmail({
    title: "Daily Analytics",
    timeZone: "Asia/Kolkata",
    periodStart,
    periodEnd,
    dashboardUrl: "https://admin.shiya.in/",
    summary: {
      newUsers: 18,
      newOrders: 9,
      pendingOrders: 4,
      paidTransactions: 7,
      pendingTransactions: 2,
      failedTransactions: 1,
      revenuePaid: 92450,
    },
    orders: {
      byStatus: [
        {
          status: "CREATED",
          count: 2,
        },
        {
          status: "CONFIRMED",
          count: 5,
        },
        {
          status: "CANCELLED",
          count: 1,
        },
        {
          status: "DELIVERED",
          count: 1,
        },
      ],
      recent: [
        {
          orderNumber: "INV-1054",
          orderStatus: "CONFIRMED",
          total: 22999,
          currency: "INR",
          createdAt: new Date(periodEnd.getTime() - 2 * 60 * 60 * 1000),
        },
        {
          orderNumber: "INV-1053",
          orderStatus: "CREATED",
          total: 14999,
          currency: "INR",
          createdAt: new Date(periodEnd.getTime() - 5 * 60 * 60 * 1000),
        },
        {
          orderNumber: "INV-1052",
          orderStatus: "DELIVERED",
          total: 38999,
          currency: "INR",
          createdAt: new Date(periodEnd.getTime() - 9 * 60 * 60 * 1000),
        },
      ],
    },
    transactions: {
      byStatus: [
        {
          status: "PAID",
          count: 7,
          amount: 92450,
          currency: "INR",
        },
        {
          status: "AUTHORIZED",
          count: 2,
          amount: 21500,
          currency: "INR",
        },
        {
          status: "FAILED",
          count: 1,
          amount: 4999,
          currency: "INR",
        },
      ],
      recent: [
        {
          id: "pay_Qm9X1abc123",
          status: "PAID",
          amount: 22999,
          currency: "INR",
          createdAt: new Date(periodEnd.getTime() - 2 * 60 * 60 * 1000),
        },
        {
          id: "pay_Qm9X1def456",
          status: "AUTHORIZED",
          amount: 21500,
          currency: "INR",
          createdAt: new Date(periodEnd.getTime() - 4 * 60 * 60 * 1000),
        },
        {
          id: "pay_Qm9X1ghi789",
          status: "FAILED",
          amount: 4999,
          currency: "INR",
          createdAt: new Date(periodEnd.getTime() - 7 * 60 * 60 * 1000),
        },
      ],
    },
    users: {
      byRole: [
        { role: "Customer", count: 16 },
        { role: "Admin", count: 1 },
        { role: "Guest", count: 1 },
      ],
      recent: [
        {
          firstName: "Aarav",
          lastName: "Sharma",
          email: "aarav.sharma@example.com",
          createdAt: new Date(periodEnd.getTime() - 90 * 60 * 1000),
        },
        {
          firstName: "Meera",
          lastName: "Iyer",
          email: "meera.iyer@example.com",
          createdAt: new Date(periodEnd.getTime() - 4.5 * 60 * 60 * 1000),
        },
      ],
    },
    productOfTheDay: {
      name: "Eternal Glow Pendant",
      sku: "SHIYA-PND-001",
      imageUrl: "https://shiya.in/fulllogo.svg",
      productUrl: "https://shiya.in/",
      price: 22999,
      currency: "INR",
      orders: 3,
      revenue: 68997,
    },
    topProducts: [
      {
        name: "Eternal Glow Pendant",
        productUrl: "https://shiya.in/",
        orders: 3,
        revenue: 68997,
        currency: "INR",
      },
      {
        name: "Moonlit Studs",
        productUrl: "https://shiya.in/",
        orders: 2,
        revenue: 19998,
        currency: "INR",
      },
      {
        name: "Aura Ring",
        productUrl: "https://shiya.in/",
        orders: 2,
        revenue: 34500,
        currency: "INR",
      },
    ],
    alerts: [
      {
        label: "Pending orders",
        value: "4 orders are still pending. Review fulfilment queue.",
        tone: "warn",
        tag: "Needs attention",
      },
      {
        label: "Failed payments",
        value: "1 transaction failed. Check gateway logs and retry flows.",
        tone: "bad",
        tag: "Investigate",
      },
      {
        label: "Revenue spike",
        value: "Paid revenue crossed ₹90k in the last 24 hours.",
        tone: "good",
        tag: "Great",
      },
    ],
  }),
});


await sendEmail({
  from: appConfig.authEmail,
  to: "varcsoft@gmail.com",
  replyTo: appConfig.replyTo,
  subject: "Order Status",
  html: orderStatusEmail({
    firstName: "Venky",
    customerName: "Venky",
    timeZone: "Asia/Kolkata",   
    orderId: "order_1234567890",
    orderNumber: "INV-1054",  
    status: "CONFIRMED",    
    statusMessage: "Order confirmed successfully.",
    updatedAt: "2023-12-01 12:00:00",
    expectedDeliveryDate: "2023-12-05",
    trackingNumber: "1234567890",
    courierName: "Delhivery",
    trackingUrl: "",
    orderUrl: "",
    currency: "",
    items: [],
    statusHistory: [],
  }),
});
export default data;
