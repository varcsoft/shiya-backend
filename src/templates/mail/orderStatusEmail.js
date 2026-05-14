import appConfig from "../../config/app.js";
import { env } from "../../config/env.js";

const safeString = (value) => (value == null ? "" : String(value)).trim();
const safeArray = (value) => (Array.isArray(value) ? value : []);

const formatDateTime = (value, timeZone) => {
  if (!value) return "-";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return safeString(value) || "-";
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    ...(timeZone ? { timeZone } : {}),
  }).format(d);
};

const formatCurrency = (value, currency = "INR") => {
  const n = Number(value);
  if (!Number.isFinite(n)) return safeString(value) || "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);
};

const normalizeStatus = (value) =>
  safeString(value).toUpperCase().replace(/[\s-]+/g, "_");

const getStatusMeta = (status) => {
  const s = normalizeStatus(status);
  const labels = {
    CREATED: "Order placed",
    PLACED: "Order placed",
    CONFIRMED: "Order confirmed",
    ACCEPTED: "Order confirmed",
    PROCESSING: "Processing",
    DISPATCHED: "Dispatched",
    SHIPPED: "Dispatched",
    OUT_FOR_DELIVERY: "Out for delivery",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    CANCELED: "Cancelled",
    RETURNED: "Returned",
    REFUNDED: "Refunded",
  };

  const tones = {
    DELIVERED: "good",
    OUT_FOR_DELIVERY: "warn",
    DISPATCHED: "neutral",
    SHIPPED: "neutral",
    PROCESSING: "neutral",
    CONFIRMED: "neutral",
    ACCEPTED: "neutral",
    CREATED: "neutral",
    PLACED: "neutral",
    CANCELLED: "bad",
    CANCELED: "bad",
    RETURNED: "bad",
    REFUNDED: "bad",
  };

  const label = labels[s] || (safeString(status) || "Update");
  const tone = tones[s] || "neutral";

  return { status: s, label, tone };
};

const renderTag = ({ label, tone = "neutral" }) => {
  const safeLabel = safeString(label) || "-";
  const colors = {
    neutral: { bg: "#f3f4f6", text: "#111827", border: "#e5e7eb" },
    good: { bg: "#fdf2f4", text: appConfig.logoColorPrimary, border: "#f6cbd3" },
    warn: { bg: "#f8fafc", text: "#0b1220", border: "#e5e7eb" },
    bad: { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" },
  };
  const c = colors[tone] || colors.neutral;
  return `<span style="display:inline-block;padding:5px 10px;border-radius:999px;border:1px solid ${c.border};background:${c.bg};color:${c.text};font-size:12px;line-height:1.2;white-space:nowrap;font-weight:700;letter-spacing:0.2px;">${safeLabel}</span>`;
};

const renderTable = ({ columns = [], rows = [], emptyText = "No data" }) => {
  const safeColumns = safeArray(columns).filter(Boolean);
  const safeRows = safeArray(rows).filter(Boolean);
  if (!safeColumns.length) return "";
  if (!safeRows.length) {
    return `<div class="muted">${safeString(emptyText) || "No data"}</div>`;
  }

  const thead = safeColumns
    .map((c) => `<th align="${c.align || "left"}">${safeString(c.label)}</th>`)
    .join("");

  const tbody = safeRows
    .map((r) => {
      const tds = safeColumns
        .map((c) => {
          const v =
            typeof c.render === "function"
              ? c.render(r)
              : safeString(r?.[c.key]);
          return `<td class="td" align="${c.align || "left"}">${v || "-"}</td>`;
        })
        .join("");
      return `<tr>${tds}</tr>`;
    })
    .join("");

  return `
  <div class="table-wrapper">
    <table class="table">
      <thead><tr>${thead}</tr></thead>
      <tbody>${tbody}</tbody>
    </table>
  </div>
  `;
};

const orderStatusEmail = (
  data = {
    firstName: "",
    customerName: "",
    timeZone: "",
    orderId: "",
    orderNumber: "",
    status: "",
    statusMessage: "",
    updatedAt: "",
    expectedDeliveryDate: "",
    trackingNumber: "",
    courierName: "",
    trackingUrl: "",
    orderUrl: "",
    currency: "INR",
    items: [],
    statusHistory: [],
  },
) => {
  const primary = appConfig.logoColorPrimary;
  const logoUrl = env.EMAIL_LOGO_URL || "https://shiya.in/fulllogo.svg";

  const timeZone = safeString(data.timeZone);
  const { status, label: statusLabel, tone } = getStatusMeta(data.status);

  const customerName = safeString(data.customerName);
  const firstName =
    safeString(data.firstName) ||
    (customerName ? customerName.split(" ")[0] : "there");

  const orderNumber = safeString(data.orderNumber || data.orderId);
  const updatedAt = data.updatedAt ? formatDateTime(data.updatedAt, timeZone) : "";
  const expectedDeliveryDate = data.expectedDeliveryDate
    ? formatDateTime(data.expectedDeliveryDate, timeZone)
    : "";

  const trackingUrl = safeString(data.trackingUrl);
  const trackingNumber = safeString(data.trackingNumber);
  const courierName = safeString(data.courierName);

  const orderUrl =
    safeString(data.orderUrl) ||
    (safeString(env.FRONTEND_URL)
      ? `${safeString(env.FRONTEND_URL)}/orders/${safeString(data.orderId)}`
      : "");

  const items = safeArray(data.items).slice(0, 12);
  const history = safeArray(data.statusHistory).slice(0, 8);

  const steps = [
    { key: "PLACED", label: "Placed" },
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "DISPATCHED", label: "Dispatched" },
    { key: "OUT_FOR_DELIVERY", label: "Out for delivery" },
    { key: "DELIVERED", label: "Delivered" },
  ];

  const getStepIndex = () => {
    if (status === "DELIVERED") return 4;
    if (status === "OUT_FOR_DELIVERY") return 3;
    if (status === "DISPATCHED" || status === "SHIPPED") return 2;
    if (status === "CONFIRMED" || status === "ACCEPTED" || status === "PROCESSING")
      return 1;
    if (status === "CANCELLED" || status === "CANCELED") return 1;
    return 0;
  };

  const activeIndex = getStepIndex();
  const isTerminalNegative =
    status === "CANCELLED" ||
    status === "CANCELED" ||
    status === "RETURNED" ||
    status === "REFUNDED";

  const statusMessage = safeString(data.statusMessage);

  const historyHtml = history.length
    ? history
        .map((h) => {
          const m = getStatusMeta(h?.status || h?.label);
          return `
            <div class="kv">
              <div class="k">${m.label}</div>
              <div class="v">${h?.at ? formatDateTime(h.at, timeZone) : "-"}</div>
            </div>
          `;
        })
        .join("")
    : `<div class="muted">No updates yet</div>`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeString(env.APP_NAME) || "Shiya"} • Order update</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      color: #0f172a;
    }

    .wrapper {
      width: 100%;
      background-color: #f3f4f6;
      padding: 24px 0;
    }

    .container {
      max-width: 680px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 10px 32px rgba(2, 8, 23, 0.14);
    }

    .hero {
      background-color: ${primary};
      padding: 22px 20px 18px 20px;
      text-align: center;
      color: #ffffff;
    }

    .logo {
      width: 76px;
      height: auto;
      margin-bottom: 10px;
      filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.22));
    }

    .brand-name {
      font-size: 24px;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #ffffff;
    }

    .hero-title {
      margin-top: 8px;
      font-size: 13px;
      letter-spacing: 0.9px;
      color: rgba(255, 255, 255, 0.95);
      text-transform: uppercase;
    }

    .content {
      padding: 22px 24px 10px 24px;
      line-height: 1.75;
      color: #111827;
      font-size: 14px;
    }

    .card {
      border: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: 16px;
      padding: 16px;
      margin: 0 0 12px 0;
      background: #ffffff;
      box-shadow: 0 8px 22px rgba(2, 8, 23, 0.06);
    }

    .card-title {
      font-size: 12px;
      font-weight: 900;
      color: #111827;
      margin: 0 0 10px 0;
      letter-spacing: 0.7px;
      text-transform: uppercase;
    }

    .muted {
      color: #6b7280;
      font-size: 13px;
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
      color: #6b7280;
      width: 58%;
      padding-right: 10px;
      vertical-align: top;
      word-break: break-word;
    }

    .v {
      display: table-cell;
      color: #111827;
      font-weight: 700;
      vertical-align: top;
      text-align: right;
      word-break: break-word;
    }

    .steps {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    .step-cell {
      text-align: center;
      vertical-align: top;
      padding: 0;
    }

    .line-cell {
      width: 26px;
      vertical-align: top;
      padding: 0;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 999px;
      margin: 0 auto;
      background: #e5e7eb;
      border: 2px solid #e5e7eb;
      box-shadow: 0 6px 16px rgba(2, 8, 23, 0.12);
    }

    .dot.done {
      background: ${primary};
      border-color: ${primary};
    }

    .dot.active {
      background: #0b1220;
      border-color: #0b1220;
    }

    .bar {
      height: 2px;
      margin-top: 7px;
      background: #e5e7eb;
      border-radius: 999px;
    }

    .bar.done {
      background: ${primary};
    }

    .step-label {
      margin-top: 8px;
      font-size: 11px;
      color: #475569;
      font-weight: 800;
      letter-spacing: 0.2px;
      text-transform: uppercase;
      padding: 0 6px;
      line-height: 1.2;
    }

    .step-label.active {
      color: #0b1220;
    }

    .banner {
      border-radius: 14px;
      padding: 12px 12px;
      background: #f8fafc;
      border: 1px solid rgba(15, 23, 42, 0.08);
    }

    .banner-title {
      font-weight: 900;
      color: #111827;
      margin: 0 0 6px 0;
      font-size: 14px;
    }

    .banner-sub {
      color: #6b7280;
      font-size: 13px;
      margin: 0;
    }

    .table-wrapper {
      width: 100%;
      overflow-x: auto;
      border: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: 14px;
      box-shadow: 0 10px 26px rgba(2, 8, 23, 0.06);
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      min-width: 520px;
      background: #ffffff;
    }

    .table th {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.95);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 10px 12px;
      background: ${primary};
      border-bottom: 1px solid rgba(255, 255, 255, 0.18);
      white-space: nowrap;
    }

    .td {
      padding: 10px 12px;
      border-bottom: 1px solid #f3f3f3;
      font-size: 13px;
      color: #111827;
      vertical-align: top;
    }

    .table tbody tr:nth-child(even) .td {
      background: rgba(2, 8, 23, 0.02);
    }

    .cta-section {
      padding: 0 24px 18px 24px;
      text-align: center;
    }

    .cta-button {
      display: inline-block;
      background: ${primary};
      color: #ffffff !important;
      padding: 11px 18px;
      border-radius: 999px;
      text-decoration: none;
      font-size: 13px;
      letter-spacing: 0.4px;
      box-shadow: 0 12px 26px rgba(2, 8, 23, 0.22);
      font-weight: 800;
    }

    .footer {
      padding: 16px 24px 22px 24px;
      border-top: 1px solid #f0f0f0;
      text-align: center;
      font-size: 12px;
      color: #777777;
      background-color: #fafafa;
    }

    .footer a {
      color: ${primary};
      text-decoration: none;
    }

    @media (max-width: 680px) {
      .container {
        margin: 0 16px;
      }
      .content {
        padding: 18px 18px 8px 18px;
      }
      .cta-section {
        padding: 0 18px 16px 18px;
      }
      .table {
        min-width: 440px;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="hero">
        <img src="${logoUrl}" alt="${safeString(env.APP_NAME) || "Logo"}" class="logo" />
        <div class="brand-name">${safeString(env.APP_NAME) || "Shiya"}</div>
        <div class="hero-title">Order status update</div>
      </div>

      <div class="content">
        <div class="card">
          <div class="banner">
            <div class="banner-title">Hi ${safeString(firstName)}, your order is ${safeString(statusLabel)}.</div>
            <p class="banner-sub">
              ${renderTag({ label: statusLabel, tone })}
              ${orderNumber ? `<span class="muted" style="margin-left:8px;">Order: <strong style="color:#111827;">#${orderNumber}</strong></span>` : ""}
              ${updatedAt ? `<span class="muted" style="margin-left:8px;">Updated: <strong style="color:#111827;">${updatedAt}</strong></span>` : ""}
            </p>
            ${statusMessage ? `<p class="muted" style="margin:10px 0 0 0;">${statusMessage}</p>` : ""}
          </div>

          ${
            isTerminalNegative
              ? `<div style="margin-top: 12px;">${renderTag({
                  label: "Please contact support if you need help",
                  tone: "neutral",
                })}</div>`
              : `
            <div style="height: 14px;"></div>
            <table class="steps" role="presentation" cellspacing="0" cellpadding="0">
              <tr>
                ${steps
                  .map((st, idx) => {
                    const isDone = idx < activeIndex;
                    const isActive = idx === activeIndex;
                    const dotClass = isActive ? "dot active" : isDone ? "dot done" : "dot";
                    const labelClass = isActive ? "step-label active" : "step-label";
                    const nextIsDone = idx < activeIndex;
                    const barClass = nextIsDone ? "bar done" : "bar";
                    const lineHtml =
                      idx === steps.length - 1
                        ? ""
                        : `<td class="line-cell"><div class="${barClass}"></div></td>`;
                    return `
                      <td class="step-cell">
                        <div class="${dotClass}"></div>
                        <div class="${labelClass}">${st.label}</div>
                      </td>
                      ${lineHtml}
                    `;
                  })
                  .join("")}
              </tr>
            </table>
          `
          }
        </div>

        <div class="card">
          <div class="card-title">Delivery details</div>
          <div class="kv">
            <div class="k">Current status</div>
            <div class="v">${renderTag({ label: statusLabel, tone })}</div>
          </div>
          ${expectedDeliveryDate ? `<div class="kv"><div class="k">Expected delivery</div><div class="v">${expectedDeliveryDate}</div></div>` : ""}
          ${courierName ? `<div class="kv"><div class="k">Courier</div><div class="v">${courierName}</div></div>` : ""}
          ${trackingNumber ? `<div class="kv"><div class="k">Tracking number</div><div class="v">${trackingNumber}</div></div>` : ""}
          ${
            trackingUrl
              ? `<div class="kv"><div class="k">Tracking link</div><div class="v"><a href="${trackingUrl}" target="_blank" style="color:${primary};text-decoration:none;font-weight:800;">Track shipment</a></div></div>`
              : ""
          }
        </div>

        ${
          items.length
            ? `
          <div class="card">
            <div class="card-title">Items</div>
            ${renderTable({
              columns: [
                {
                  key: "name",
                  label: "Item",
                  align: "left",
                  render: (r) => safeString(r?.name) || "-",
                },
                {
                  key: "quantity",
                  label: "Qty",
                  align: "center",
                  render: (r) =>
                    r?.quantity == null ? "-" : safeString(r.quantity) || "-",
                },
                {
                  key: "price",
                  label: "Price",
                  align: "right",
                  render: (r) =>
                    r?.price == null
                      ? "-"
                      : formatCurrency(r.price, safeString(data.currency) || "INR"),
                },
                {
                  key: "total",
                  label: "Total",
                  align: "right",
                  render: (r) =>
                    r?.total == null
                      ? "-"
                      : formatCurrency(r.total, safeString(data.currency) || "INR"),
                },
              ],
              rows: items,
              emptyText: "No items",
            })}
          </div>
        `
            : ""
        }

        <div class="card">
          <div class="card-title">Update history</div>
          ${historyHtml}
        </div>
      </div>

      ${
        orderUrl
          ? `
        <div class="cta-section">
          <a href="${orderUrl}" class="cta-button" target="_blank">
            View order
          </a>
        </div>
      `
          : ""
      }

      <div class="footer">
        <div><strong>${safeString(env.APP_NAME) || "Shiya"}</strong> • Order update</div>
        <div style="margin-top: 6px;">
          Need help? Email us at
          <a href="mailto:${safeString(env.REFLECT_SMTP_REPLY_TO)}">${safeString(env.REFLECT_SMTP_REPLY_TO)}</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;
};

export default orderStatusEmail;
