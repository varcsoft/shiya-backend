import appConfig from "../../config/app.js";
import { env } from "../../config/env.js";

const safeString = (value) => (value == null ? "" : String(value)).trim();
const safeNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};
const safeArray = (value) => (Array.isArray(value) ? value : []);

const formatInteger = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    safeNumber(value),
  );

const formatCurrency = (value, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(safeNumber(value));

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

const renderTag = ({ label, tone = "neutral" }) => {
  const safeLabel = safeString(label) || "-";
  const colors = {
    neutral: { bg: "#f3f4f6", text: "#111827", border: "#e5e7eb" },
    good: { bg: "#fdf2f4", text: "#6a151f", border: "#f6cbd3" },
    warn: { bg: "#fffbeb", text: "#92400e", border: "#fde68a" },
    bad: { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" },
  };
  const c = colors[tone] || colors.neutral;
  return `<span style="display:inline-block;padding:4px 10px;border-radius:999px;border:1px solid ${c.border};background:${c.bg};color:${c.text};font-size:12px;line-height:1.2;white-space:nowrap;">${safeLabel}</span>`;
};

const renderKeyValueRows = (rows = []) => {
  const safeRows = safeArray(rows).filter(Boolean);
  if (!safeRows.length) {
    return `<div class="muted">No data</div>`;
  }
  return safeRows
    .map(
      (row) => `
      <div class="kv">
        <div class="k">${safeString(row.key) || "-"}</div>
        <div class="v">${safeString(row.value) || "-"}</div>
      </div>
    `,
    )
    .join("");
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

const dailyAnalyticsEmail = (
  data = {
    title: "",
    timeZone: "",
    periodStart: "",
    periodEnd: "",
    dashboardUrl: "",
    summary: {
      newUsers: 0,
      newOrders: 0,
      pendingOrders: 0,
      paidTransactions: 0,
      pendingTransactions: 0,
      failedTransactions: 0,
      revenuePaid: 0,
    },
    orders: {
      byStatus: [],
      recent: [],
    },
    transactions: {
      byStatus: [],
      recent: [],
    },
    users: {
      byRole: [],
      recent: [],
    },
    productOfTheDay: null,
    topProducts: [],
    alerts: [],
  },
) => {
  const logoUrl = env.EMAIL_LOGO_URL || "https://shiya.in/fulllogo.svg";
  const primary = appConfig.logoColorPrimary;
  const accent = "#0b1220";
  const metricAccents = [
    primary,
    accent,
    "#111827",
    "#1f2937",
    "#374151",
    "#4b5563",
    "#6b7280",
  ];

  const timeZone = safeString(data.timeZone);
  const periodStart = data.periodStart || "";
  const periodEnd = data.periodEnd || "";

  const title =
    safeString(data.title) || `${safeString(env.APP_NAME) || "System"} • Daily Analytics`;

  const dashboardUrl =
    safeString(data.dashboardUrl) ||
    `${safeString(env.FRONTEND_URL) || safeString(env.API_URL) || ""}`.trim();

  const summary = data.summary || {};

  const summaryCards = [
    { label: "New users", value: formatInteger(summary.newUsers) },
    { label: "New orders", value: formatInteger(summary.newOrders) },
    { label: "Orders pending", value: formatInteger(summary.pendingOrders) },
    { label: "Transactions paid", value: formatInteger(summary.paidTransactions) },
    {
      label: "Transactions pending",
      value: formatInteger(summary.pendingTransactions),
    },
    { label: "Transactions failed", value: formatInteger(summary.failedTransactions) },
    { label: "Revenue (paid)", value: formatCurrency(summary.revenuePaid) },
  ];

  const ordersByStatus = safeArray(data?.orders?.byStatus).map((x) => ({
    status: safeString(x?.status || x?.orderStatus) || "-",
    count: safeNumber(x?.count ?? x?._count?.orderStatus ?? x?._count?.status),
  }));

  const transactionsByStatus = safeArray(data?.transactions?.byStatus).map((x) => ({
    status: safeString(x?.status) || "-",
    count: safeNumber(x?.count ?? x?._count?.status),
    amount: x?.amount != null ? safeNumber(x.amount) : null,
    currency: safeString(x?.currency) || "INR",
  }));

  const recentOrders = safeArray(data?.orders?.recent).slice(0, 10);
  const recentTransactions = safeArray(data?.transactions?.recent).slice(0, 10);
  const recentUsers = safeArray(data?.users?.recent).slice(0, 10);

  const productOfTheDay = data.productOfTheDay || null;
  const topProducts = safeArray(data.topProducts).slice(0, 10);
  const alerts = safeArray(data.alerts).slice(0, 15);

  const alertsHtml = alerts.length
    ? alerts
        .map((a) => {
          const label = safeString(a?.label || a?.title || a) || "-";
          const value = safeString(a?.value) || "";
          const tone = safeString(a?.tone) || "neutral";
          return `
            <div class="alert-row">
              <div class="alert-left">
                <div class="alert-title">${label}</div>
                ${value ? `<div class="muted" style="margin-top: 2px;">${value}</div>` : ""}
              </div>
              <div class="alert-right">${renderTag({ label: safeString(a?.tag || tone), tone })}</div>
            </div>
          `;
        })
        .join("")
    : `<div class="muted">No alerts</div>`;

  const usersByRoleRows = safeArray(data?.users?.byRole).map((x) => ({
    role: safeString(x?.role || x?.roleId || x?.name) || "-",
    count: safeNumber(x?.count ?? x?._count?._all),
  }));

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      color: #222222;
    }

    .wrapper {
      width: 100%;
      background-color: #f3f4f6;
      padding: 26px 0;
    }

    .container {
      max-width: 720px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 36px rgba(2, 8, 23, 0.18);
    }

    .hero {
      background-color: ${primary};
      padding: 22px 20px 18px 20px;
      text-align: center;
      color: #ffffff;
    }

    .logo {
      width: 72px;
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

    .header-title {
      margin-top: 10px;
      font-size: 13px;
      letter-spacing: 0.9px;
      color: rgba(255, 255, 255, 0.95);
      text-transform: uppercase;
    }

    .meta {
      margin-top: 8px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.5;
    }

    .pill {
      display: inline-block;
      margin-top: 12px;
      padding: 7px 12px;
      border-radius: 999px;
      background: rgba(17, 24, 39, 0.18);
      border: 1px solid rgba(255, 255, 255, 0.28);
      color: rgba(255, 255, 255, 0.98);
      font-size: 12px;
      letter-spacing: 0.2px;
      backdrop-filter: blur(8px);
    }

    .content {
      padding: 22px 24px 12px 24px;
      line-height: 1.75;
      color: #333333;
      font-size: 14px;
      background: #ffffff;
    }

    .card {
      border: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: 16px;
      padding: 16px;
      margin: 0 0 12px 0;
      background: #ffffff;
      box-shadow: 0 8px 22px rgba(2, 8, 23, 0.06);
    }

    .card--summary {
      border-top: 5px solid ${primary};
    }

    .card--orders {
      border-top: 5px solid ${primary};
    }

    .card--transactions {
      border-top: 5px solid #111827;
    }

    .card--users {
      border-top: 5px solid #1f2937;
    }

    .card--product {
      border-top: 5px solid #374151;
    }

    .card--alerts {
      border-top: 5px solid #4b5563;
    }

    .card-title {
      font-size: 12px;
      font-weight: 800;
      color: #111827;
      margin: 0 0 10px 0;
      letter-spacing: 0.7px;
      text-transform: uppercase;
    }

    .muted {
      color: #6b7280;
      font-size: 13px;
    }

    .summary-grid {
      font-size: 0;
      margin: -6px;
    }

    .metric {
      display: inline-block;
      vertical-align: top;
      width: calc(50% - 12px);
      margin: 6px;
      border-radius: 14px;
      padding: 12px 12px;
      background: linear-gradient(180deg, #ffffff 0%, rgba(2, 8, 23, 0.02) 100%);
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 10px 24px rgba(2, 8, 23, 0.06);
    }

    .metric .label {
      font-size: 12px;
      color: #64748b;
      letter-spacing: 0.2px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .metric .value {
      margin-top: 6px;
      font-size: 20px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: 0.2px;
    }

    .metric .sub {
      margin-top: 2px;
      font-size: 12px;
      color: #64748b;
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
      width: 55%;
      padding-right: 10px;
      vertical-align: top;
      word-break: break-word;
    }

    .v {
      display: table-cell;
      color: #111827;
      font-weight: 600;
      vertical-align: top;
      text-align: right;
      word-break: break-word;
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
      font-weight: 800;
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

    .td small {
      color: #6b7280;
      font-weight: 500;
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

    .product-row {
      display: table;
      width: 100%;
      table-layout: fixed;
    }

    .product-left {
      display: table-cell;
      width: 92px;
      vertical-align: top;
      padding-right: 12px;
    }

    .product-right {
      display: table-cell;
      vertical-align: top;
    }

    .product-img {
      width: 92px;
      height: 92px;
      object-fit: cover;
      border-radius: 12px;
      border: 1px solid #f0f0f0;
      background: #ffffff;
      display: block;
    }

    .product-name {
      font-size: 15px;
      font-weight: 800;
      color: #111827;
      margin: 0;
    }

    .alert-row {
      display: table;
      width: 100%;
      table-layout: fixed;
      padding: 10px 0;
      border-top: 1px solid #f3f3f3;
    }

    .alert-row:first-child {
      border-top: none;
      padding-top: 0;
    }

    .alert-left {
      display: table-cell;
      vertical-align: top;
      padding-right: 10px;
    }

    .alert-right {
      display: table-cell;
      width: 130px;
      vertical-align: top;
      text-align: right;
    }

    .alert-title {
      font-weight: 700;
      color: #111827;
      font-size: 13px;
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
      .summary-grid {
        margin: -6px;
      }
      .metric {
        width: calc(100% - 12px);
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
        <div class="brand-name">${safeString(env.APP_NAME) || "System"}</div>
        <div class="header-title">Daily analytics (last 24 hours)</div>
        <div class="meta">
          <div><strong>Period:</strong> ${formatDateTime(periodStart, timeZone)} → ${formatDateTime(periodEnd, timeZone)}</div>
          <div><strong>Generated:</strong> ${formatDateTime(new Date(), timeZone)}${timeZone ? ` (${timeZone})` : ""}</div>
        </div>
        <div class="pill">Snapshot of growth, orders, payments and product performance</div>
      </div>

      <div class="content">
        <div class="card card--summary">
          <div class="card-title">Summary</div>
          <div class="summary-grid">
            ${summaryCards
              .map(
                (m, idx) => `
              <div class="metric" style="border-left:5px solid ${metricAccents[idx % metricAccents.length]};">
                <div class="label">${safeString(m.label)}</div>
                <div class="value">${safeString(m.value)}</div>
                <div class="sub">Last 24 hours</div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>

        <div class="card card--orders">
          <div class="card-title">Orders</div>
          ${renderTable({
            columns: [
              { key: "status", label: "Status", align: "left" },
              {
                key: "count",
                label: "Count",
                align: "right",
                render: (r) => formatInteger(r.count),
              },
            ],
            rows: ordersByStatus.sort((a, b) => b.count - a.count),
            emptyText: "No order status breakdown",
          })}
          ${
            recentOrders.length
              ? `
            <div style="height: 12px;"></div>
            <div class="muted" style="margin-bottom: 8px;">Recent orders</div>
            ${renderTable({
              columns: [
                {
                  key: "orderNumber",
                  label: "Order",
                  align: "left",
                  render: (r) => safeString(r.orderNumber || r.invoiceNumber || r.id),
                },
                {
                  key: "status",
                  label: "Status",
                  align: "left",
                  render: (r) => safeString(r.orderStatus || r.status),
                },
                {
                  key: "total",
                  label: "Total",
                  align: "right",
                  render: (r) =>
                    r.total != null
                      ? formatCurrency(r.total, safeString(r.currency) || "INR")
                      : "-",
                },
                {
                  key: "createdAt",
                  label: "Created",
                  align: "right",
                  render: (r) => formatDateTime(r.createdAt, timeZone),
                },
              ],
              rows: recentOrders,
              emptyText: "No recent orders",
            })}
          `
              : `<div class="muted" style="margin-top: 10px;">No recent orders</div>`
          }
        </div>

        <div class="card card--transactions">
          <div class="card-title">Transactions</div>
          ${renderTable({
            columns: [
              { key: "status", label: "Status", align: "left" },
              {
                key: "count",
                label: "Count",
                align: "right",
                render: (r) => formatInteger(r.count),
              },
              {
                key: "amount",
                label: "Amount",
                align: "right",
                render: (r) =>
                  r.amount == null ? "-" : formatCurrency(r.amount, r.currency || "INR"),
              },
            ],
            rows: transactionsByStatus.sort((a, b) => b.count - a.count),
            emptyText: "No transaction status breakdown",
          })}
          ${
            recentTransactions.length
              ? `
            <div style="height: 12px;"></div>
            <div class="muted" style="margin-bottom: 8px;">Recent transactions</div>
            ${renderTable({
              columns: [
                {
                  key: "id",
                  label: "Transaction",
                  align: "left",
                  render: (r) => safeString(r.id || r.gateway_payment_id || r.gateway_order_id),
                },
                {
                  key: "status",
                  label: "Status",
                  align: "left",
                  render: (r) => safeString(r.status),
                },
                {
                  key: "amount",
                  label: "Amount",
                  align: "right",
                  render: (r) =>
                    r.amount != null
                      ? formatCurrency(r.amount, safeString(r.currency) || "INR")
                      : "-",
                },
                {
                  key: "createdAt",
                  label: "Created",
                  align: "right",
                  render: (r) => formatDateTime(r.createdAt, timeZone),
                },
              ],
              rows: recentTransactions,
              emptyText: "No recent transactions",
            })}
          `
              : `<div class="muted" style="margin-top: 10px;">No recent transactions</div>`
          }
        </div>

        <div class="card card--users">
          <div class="card-title">Users</div>
          ${renderTable({
            columns: [
              { key: "role", label: "Role", align: "left" },
              {
                key: "count",
                label: "Count",
                align: "right",
                render: (r) => formatInteger(r.count),
              },
            ],
            rows: usersByRoleRows.sort((a, b) => b.count - a.count),
            emptyText: "No user breakdown",
          })}
          ${
            recentUsers.length
              ? `
            <div style="height: 12px;"></div>
            <div class="muted" style="margin-bottom: 8px;">Recent users</div>
            ${renderTable({
              columns: [
                {
                  key: "name",
                  label: "Name",
                  align: "left",
                  render: (r) =>
                    safeString(r.firstName || r.name) +
                    (safeString(r.lastName) ? ` ${safeString(r.lastName)}` : ""),
                },
                {
                  key: "email",
                  label: "Email",
                  align: "left",
                  render: (r) => safeString(r.email),
                },
                {
                  key: "createdAt",
                  label: "Created",
                  align: "right",
                  render: (r) => formatDateTime(r.createdAt, timeZone),
                },
              ],
              rows: recentUsers,
              emptyText: "No recent users",
            })}
          `
              : `<div class="muted" style="margin-top: 10px;">No recent users</div>`
          }
        </div>

        <div class="card card--product">
          <div class="card-title">Product of the day</div>
          ${
            productOfTheDay
              ? `
            <div class="product-row">
              <div class="product-left">
                ${
                  safeString(productOfTheDay.imageUrl)
                    ? `<img class="product-img" src="${safeString(productOfTheDay.imageUrl)}" alt="${safeString(productOfTheDay.name) || "Product"}" />`
                    : `<div class="product-img" style="display:flex;align-items:center;justify-content:center;color:#6b7280;font-size:12px;">No image</div>`
                }
              </div>
              <div class="product-right">
                <p class="product-name" style="margin-bottom: 2px;">
                  ${
                    safeString(productOfTheDay.productUrl)
                      ? `<a href="${safeString(productOfTheDay.productUrl)}" style="color:#111827;text-decoration:none;">${safeString(productOfTheDay.name) || "-"}</a>`
                      : `${safeString(productOfTheDay.name) || "-"}`
                  }
                </p>
                <div class="muted" style="margin-bottom: 10px;">
                  ${safeString(productOfTheDay.sku) ? `SKU: ${safeString(productOfTheDay.sku)} • ` : ""}${
                    productOfTheDay.price != null
                      ? `Price: ${formatCurrency(productOfTheDay.price, safeString(productOfTheDay.currency) || "INR")}`
                      : ""
                  }
                </div>
                ${renderKeyValueRows([
                  {
                    key: "Orders in last 24h",
                    value: formatInteger(productOfTheDay.orders),
                  },
                  {
                    key: "Revenue in last 24h",
                    value:
                      productOfTheDay.revenue != null
                        ? formatCurrency(
                            productOfTheDay.revenue,
                            safeString(productOfTheDay.currency) || "INR",
                          )
                        : "-",
                  },
                ])}
              </div>
            </div>
          `
              : `<div class="muted">No product of the day</div>`
          }
          ${
            topProducts.length
              ? `
            <div style="height: 12px;"></div>
            <div class="muted" style="margin-bottom: 8px;">Top products</div>
            ${renderTable({
              columns: [
                {
                  key: "name",
                  label: "Product",
                  align: "left",
                  render: (r) =>
                    safeString(r.productUrl)
                      ? `<a href="${safeString(r.productUrl)}" style="color:#111827;text-decoration:none;">${safeString(r.name) || "-"}</a>`
                      : safeString(r.name) || "-",
                },
                {
                  key: "orders",
                  label: "Orders",
                  align: "right",
                  render: (r) => formatInteger(r.orders),
                },
                {
                  key: "revenue",
                  label: "Revenue",
                  align: "right",
                  render: (r) =>
                    r.revenue == null
                      ? "-"
                      : formatCurrency(r.revenue, safeString(r.currency) || "INR"),
                },
              ],
              rows: topProducts,
              emptyText: "No top products",
            })}
          `
              : ""
          }
        </div>

        <div class="card card--alerts">
          <div class="card-title">Alerts</div>
          ${alertsHtml}
        </div>
      </div>

      ${
        dashboardUrl
          ? `
        <div class="cta-section">
          <a href="${dashboardUrl}" class="cta-button" target="_blank">
            Open dashboard
          </a>
        </div>
      `
          : ""
      }

      <div class="footer">
        <div><strong>${safeString(env.APP_NAME) || "System"}</strong> • Daily analytics email</div>
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

export default dailyAnalyticsEmail;
