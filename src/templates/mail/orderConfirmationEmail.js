import appConfig from "../../config/app.js";
import { env } from "../../config/env.js";

const formatCurrency = (value) => {
  if (typeof value !== "number") {
    return value;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
};

const orderConfirmationEmail = (
  data = {
    orderId: "",
    firstName: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    orderNumber: "",
    orderDate: "",
    products: [],
    stonesEnabled: false,
    stoneType: "",
    stoneCount: 0,
    stoneCarat: 0,
    goldRatePerGram: 0,
    makingCharges: 0,
    makingIsPercent: false,
    stoneCharges: 0,
    gstPercent: 3,
    subtotal: 0,
    shipping: 0,
    total: 0,
    paymentStatus: "",
    paymentMethod: "",
    transactionId: "",
    advancePaid: 0,
    deliveryMethod: "",
    shippingAddress: "",
    expectedDeliveryDate: "",
    customInstructions: "",
    items: [],
  },
) => {
  const logoUrl = env.EMAIL_LOGO_URL

  const safeString = (value) => (value == null ? "" : String(value)).trim();
  const safeNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };
  const yesNo = (value) => (value ? "Yes" : "No");
  const customerName = safeString(data.customerName);
  const customerPhone = safeString(data.customerPhone);
  const customerEmail = safeString(data.customerEmail);

  const firstName =
    safeString(data.firstName) ||
    (customerName ? customerName.split(" ")[0] : "Customer");

  const orderNumber = safeString(data.orderNumber || data.orderId);
  const orderDate = safeString(data.orderDate);

  const itemsInput = Array.isArray(data.items) ? data.items : [];


  const paymentStatus = safeString(data.paymentStatus);
  const paymentMethod = safeString(data.paymentMethod);
  const transactionId = safeString(data.transactionId);

  const itemsRows = itemsInput
    .map(
      (item) => `
      <tr>
        <td class="td">${safeString(item?.name) || "-"}</td>
        <td class="td" align="center">${
          item?.quantity != null ? safeString(item.quantity) : "-"
        }</td>
        <td class="td" align="right">${
          item?.price != null ? formatCurrency(safeNumber(item.price)) : "-"
        }</td>
        <td class="td" align="right">${
          item?.total != null ? formatCurrency(safeNumber(item.total)) : "-"
        }</td>
      </tr>
    `,
    )
    .join("");
console.log(itemsRows)
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${env.APP_NAME} Order Confirmation ${orderNumber ? `#${orderNumber}` : ""}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      color: #222222;
    }

    .wrapper {
      width: 100%;
      background-color: #efefef;
      padding: 24px 0;
    }

    .container {
      max-width: 640px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
    }

    .header {
      background-color: #ffffff;
      padding: 24px 20px;
      text-align: center;
      color: #ffffff;
    }

    .logo {
      width: 72px;
      height: auto;
      margin-bottom: 10px;
    }

    .brand-name {
      font-size: 24px;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: ${appConfig.logoColorPrimary};
    }

    .tagline {
      font-size: 11px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: ${appConfig.logoColorPrimary};
      margin-top: 6px;
    }

    .header-title {
      margin-top: 10px;
      font-size: 14px;
      letter-spacing: 0.6px;
      color: rgba(0, 0, 0, 1);
      text-transform: uppercase;
    }

    .content {
      padding: 24px 26px 10px 26px;
      line-height: 1.7;
      color: #333333;
      font-size: 14px;
    }

    .content p {
      margin: 0 0 14px 0;
    }

    .highlight {
      color: ${appConfig.logoColorPrimary};
      font-weight: 600;
    }

    .order-meta {
      font-size: 12px;
      color: rgba(0, 0, 0, 1);
      margin-top: 4px;
    }

    .card {
      border: 1px solid #f0f0f0;
      border-radius: 12px;
      padding: 14px;
      margin: 0 0 12px 0;
      background: #ffffff;
    }

    .card-title {
      font-size: 13px;
      font-weight: 600;
      color: #222222;
      margin: 0 0 10px 0;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .kv {
      display: table;
      width: 100%;
      table-layout: fixed;
      border-top: 1px solid #f3f3f3;
      padding-top: 8px;
      margin-top: 8px;
      font-size: 13px;
    }

    .kv:first-child {
      border-top: none;
      padding-top: 0;
      margin-top: 0;
    }

    .k {
      display: table-cell;
      width: 46%;
      color: #777777;
      padding-right: 12px;
    }

    .v {
      display: table-cell;
      width: 54%;
      color: #222222;
      text-align: right;
      max-width: none;
      word-break: break-word;
    }

    .table-wrapper {
      padding: 0;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
    }

    .items-table th {
      font-size: 12px;
      color: #777777;
      font-weight: 600;
      padding-bottom: 6px;
      border-bottom: 1px solid #f0f0f0;
    }

    .td {
      padding: 8px 0;
      font-size: 13px;
      color: #333333;
      border-bottom: 1px solid #f3f3f3;
      vertical-align: top;
    }

    .totals {
      margin-top: 12px;
      font-size: 13px;
      color: #333333;
    }

    .totals-row {
      display: table;
      width: 100%;
      table-layout: fixed;
      margin-bottom: 4px;
    }

    .totals-row strong {
      font-weight: 600;
    }

    .totals-row span,
    .totals-row strong {
      display: table-cell;
      width: 50%;
    }

    .totals-row span:last-child,
    .totals-row strong:last-child {
      text-align: right;
    }

    .address-box {
      padding: 0;
      font-size: 13px;
      color: #555555;
    }

    .address-label {
      font-weight: 600;
      margin-bottom: 4px;
      color: #333333;
    }

    .cta-section {
      padding: 0 26px 20px 26px;
      text-align: center;
    }

    .cta-button {
      display: inline-block;
      margin-top: 4px;
      background-color: ${appConfig.logoColorPrimary};
      color: #ffffff !important;
      padding: 10px 26px;
      border-radius: 999px;
      text-decoration: none;
      font-size: 13px;
      letter-spacing: 0.5px;
    }

    .footer {
      padding: 18px 24px 22px 24px;
      border-top: 1px solid #f0f0f0;
      text-align: center;
      font-size: 12px;
      color: #ffffff;
      background-color: ${appConfig.logoColorPrimary};
    }

    .footer a {
      color: ${appConfig.logoColorPrimary};
      text-decoration: none;
    }

    @media (max-width: 640px) {
      .container {
        margin: 0 16px;
      }

      .content,
      .cta-section {
        padding-left: 18px;
        padding-right: 18px;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <img
          src="${logoUrl}"
          alt="${env.APP_NAME} Logo"
          class="logo"
        />
        <div class="header-title">${env.APP_NAME} Order Confirmation</div>
        <div class="order-meta">${orderNumber ? `Order Number: <strong>#${orderNumber}</strong>` : ""}</div>
      </div>

      <div class="content">
        <p>Hi <span class="highlight">${firstName}</span>,</p>
        <p>
          Here are the details of your order with <strong>${env.APP_NAME}</strong>.
        </p>

        <div class="card">
          <div class="card-title">Customer Details</div>
          <div class="grid">
            <div class="kv">
              <div class="k">Customer Name</div>
              <div class="v">${customerName || "-"}</div>
            </div>
            <div class="kv">
              <div class="k">Phone Number</div>
              <div class="v">${customerPhone || "-"}</div>
            </div>
            <div class="kv">
              <div class="k">Email</div>
              <div class="v">${customerEmail || "-"}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-title">Order Details</div>
          <div class="grid">
            <div class="kv">
              <div class="k">Order Date</div>
              <div class="v">${orderDate || "-"}</div>
            </div>
            <div class="kv">
              <div class="k">Order Number</div>
              <div class="v">${orderNumber ? `#${orderNumber}` : "-"}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-title">Payment</div>
          <div class="grid">
            <div class="kv">
              <div class="k">Payment Status</div>
              <div class="v">${paymentStatus || "-"}</div>
            </div>
            <div class="kv">
              <div class="k">Payment Method</div>
              <div class="v">${paymentMethod || "-"}</div>
            </div>
            <div class="kv">
              <div class="k">Transaction ID</div>
              <div class="v">${transactionId || "-"}</div>
            </div>
          </div>
        </div>
      </div>

      ${
        itemsRows
          ? `<div class="content" style="padding-top: 0;">
        <div class="card">
          <div class="card-title">Items</div>
          <div class="table-wrapper">
            <table class="items-table">
              <thead>
                <tr>
                  <th align="left">Item</th>
                  <th align="center">Qty</th>
                  <th align="right">Price</th>
                  <th align="right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>`
          : ""
      }

      <div class="cta-section">
        <a
          href="${env.FRONTEND_URL}/orders/${data.orderId}"
          class="cta-button"
          target="_blank"
        >
          View your order
        </a>
      </div>

      <div class="footer">
        <div>With warmth,</div>
        <div><strong>${env.APP_NAME} Team</strong></div>
        <div style="margin-top: 8px;">
          Need help? Email us at
          <a href="mailto:${env.REFLECT_SMTP_REPLY_TO}">${env.REFLECT_SMTP_REPLY_TO}</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;
};

export default orderConfirmationEmail;
