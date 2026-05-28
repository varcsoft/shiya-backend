const analyticsEmail = ({
  generatedAt,
  lastLogin,

  totalUsers,
  totalSessions,

  liveOrders,
  testOrders,

  pendingOrders,

  liveRevenue,
  testRevenue,

  pendingCartItems,

  topPendingCartUsers,
}) => {
  return `
  <!DOCTYPE html>
  <html>

  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>24 Hour Analytics Report</title>
  </head>

  <body style="margin:0;padding:0;background:#000000;font-family:Arial,sans-serif;color:#ffffff;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0"
      style="background:#000000;padding:40px 20px;">

      <tr>
        <td align="center">

          <table width="620" cellpadding="0" cellspacing="0" border="0"
            style="background:#111111;border:1px solid #222222;border-radius:18px;padding:40px;max-width:620px;width:100%;">

            <!-- Header -->
            <tr>
              <td style="padding-bottom:30px;">

                <h1 style="margin:0;font-size:30px;font-weight:700;color:#ffffff;">
                  Last 24 Hours Report
                </h1>

                <p style="margin-top:14px;font-size:15px;line-height:28px;color:#bdbdbd;">

                  Hi,
                  <br /><br />

                  Here's everything that happened on your platform in the last 24 hours.

                </p>

              </td>
            </tr>

            <!-- Platform Metrics -->
            <tr>
              <td style="padding-bottom:35px;">

                <div style="font-size:18px;font-weight:600;margin-bottom:16px;">
                  Platform Metrics
                </div>

                <table width="100%" cellpadding="0" cellspacing="0" border="0">

                  <tr>
                    <td style="padding:12px 0;color:#8f8f8f;">
                      Total Users
                    </td>

                    <td align="right" style="padding:12px 0;color:#ffffff;">
                      ${totalUsers}
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:12px 0;color:#8f8f8f;">
                      Sessions Created
                    </td>

                    <td align="right" style="padding:12px 0;color:#ffffff;">
                      ${totalSessions}
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:12px 0;color:#8f8f8f;">
                      Live Orders
                    </td>

                    <td align="right" style="padding:12px 0;color:#00ff99;font-weight:600;">
                      ${liveOrders}
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:12px 0;color:#8f8f8f;">
                      Test Orders
                    </td>

                    <td align="right" style="padding:12px 0;color:#ffaa00;font-weight:600;">
                      ${testOrders}
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:12px 0;color:#8f8f8f;">
                      Pending Orders
                    </td>

                    <td align="right" style="padding:12px 0;color:#ffffff;">
                      ${pendingOrders}
                    </td>
                  </tr>

                </table>

              </td>
            </tr>

            <!-- Revenue -->
            <tr>
              <td style="padding-bottom:35px;">

                <div style="font-size:18px;font-weight:600;margin-bottom:16px;">
                  Revenue Breakdown
                </div>

                <table width="100%" cellpadding="0" cellspacing="0" border="0">

                  <tr>
                    <td style="padding:12px 0;color:#8f8f8f;">
                      Live Revenue
                    </td>

                    <td align="right"
                      style="padding:12px 0;color:#00ff99;font-size:16px;font-weight:700;">
                      ₹${liveRevenue}
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:12px 0;color:#8f8f8f;">
                      Test Revenue
                    </td>

                    <td align="right"
                      style="padding:12px 0;color:#ffaa00;font-size:16px;font-weight:700;">
                      ₹${testRevenue}
                    </td>
                  </tr>

                </table>

              </td>
            </tr>

            <!-- Cart Analytics -->
            <tr>
              <td style="padding-bottom:35px;">

                <div style="font-size:18px;font-weight:600;margin-bottom:16px;">
                  Pending Cart Analytics
                </div>

                <table width="100%" cellpadding="0" cellspacing="0" border="0">

                  <tr>
                    <td style="padding:12px 0;color:#8f8f8f;">
                      Total Pending Cart Items
                    </td>

                    <td align="right" style="padding:12px 0;color:#ffffff;">
                      ${pendingCartItems}
                    </td>
                  </tr>

                </table>

              </td>
            </tr>

            <!-- Top Cart Users -->
            <tr>
              <td style="padding-bottom:35px;">

                <div style="font-size:18px;font-weight:600;margin-bottom:18px;">
                  Users With Highest Pending Cart Items
                </div>

                ${topPendingCartUsers
                  .map(
                    (user) => `
                  <div style="padding:14px 18px;border:1px solid #222222;border-radius:12px;margin-bottom:12px;background:#151515;">

                    <div style="font-size:15px;font-weight:600;color:#ffffff;">
                      ${user.firstname}
                    </div>

                    <div style="font-size:13px;color:#8f8f8f;margin-top:4px;">
                      ${user.email}
                    </div>

                    <div style="margin-top:10px;color:#00ff99;font-weight:600;">
                      ${user.items} pending items
                    </div>

                  </div>
                `
                  )
                  .join("")}

              </td>
            </tr>

            <!-- Activity -->
            <tr>
              <td style="padding-bottom:20px;">

                <div style="font-size:18px;font-weight:600;margin-bottom:16px;">
                  Latest Activity
                </div>

                <p style="margin:0;color:#bdbdbd;line-height:30px;">

                  Last Login:
                  <span style="color:#ffffff;">
                    ${lastLogin}
                  </span>

                  <br />

                  Report Generated:
                  <span style="color:#ffffff;">
                    ${generatedAt}
                  </span>

                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding-top:30px;border-top:1px solid #222222;">

                <p style="margin:0;font-size:14px;line-height:26px;color:#7d7d7d;">
                  Varcsoft Analytics Engine
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>

    </table>

  </body>
  </html>
  `;
};

export default analyticsEmail;