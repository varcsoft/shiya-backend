import prisma from "../../config/database.js";

const generateAnalytics = async () => {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalSessions,

    orderStats,

    revenueStats,

    pendingOrderStats,

    cartStats,

    latestSession,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.session.count({
      where: {
        timestamp: {
          gte: last24Hours,
        },
      },
    }),

    prisma.order.groupBy({
      by: ["orderType"],

      _count: {
        orderType: true,
      },

      where: {
        createdAt: {
          gte: last24Hours,
        },
      },
    }),

    prisma.transaction.groupBy({
      by: ["status"],

      _sum: {
        amount: true,
      },

      where: {
        createdAt: {
          gte: last24Hours,
        },

        status: "PAID",

        order: {
          orderType: {
            in: ["LIVE", "TEST"],
          },
        },
      },
    }),

    prisma.order.groupBy({
      by: ["orderStatus"],

      _count: {
        orderStatus: true,
      },

      where: {
        createdAt: {
          gte: last24Hours,
        },
      },
    }),

    prisma.cart.groupBy({
      by: ["userId"],

      _count: {
        userId: true,
      },

      orderBy: {
        _count: {
          userId: "desc",
        },
      },

      take: 10,
    }),

    prisma.session.findFirst({
      orderBy: {
        timestamp: "desc",
      },

      include: {
        user: true,
      },
    }),
  ]);

  // Orders
  const liveOrders =
    orderStats.find((o) => o.orderType === "LIVE")?._count?.orderType || 0;

  const testOrders =
    orderStats.find((o) => o.orderType === "TEST")?._count?.orderType || 0;

  // Pending Orders
  const pendingOrders =
    pendingOrderStats.find((o) => o.orderStatus === "PLACED")?._count
      ?.orderStatus || 0;

  // Revenue Split
  let liveRevenue = 0;
  let testRevenue = 0;

  const liveTransactions = await prisma.transaction.aggregate({
    _sum: {
      amount: true,
    },

    where: {
      createdAt: {
        gte: last24Hours,
      },

      status: "PAID",

      order: {
        orderType: "LIVE",
      },
    },
  });

  const testTransactions = await prisma.transaction.aggregate({
    _sum: {
      amount: true,
    },

    where: {
      createdAt: {
        gte: last24Hours,
      },

      status: "PAID",

      order: {
        orderType: "TEST",
      },
    },
  });

  liveRevenue = liveTransactions._sum.amount || 0;
  testRevenue = testTransactions._sum.amount || 0;

  // Cart Analytics
  const pendingCartItems = cartStats.reduce((acc, item) => {
    return acc + item._count.userId;
  }, 0);

  const topPendingCartUsers = await Promise.all(
    cartStats.map(async (item) => {
      const user = await prisma.user.findUnique({
        where: {
          id: item.userId,
        },

        select: {
          firstName: true,
          email: true,
        },
      });

      return {
        firstname: user?.firstName || "Unknown",
        email: user?.email || "Unknown",
        items: item._count.userId,
      };
    })
  );

  return {
    firstname: latestSession?.user?.firstName || "Admin",

    generatedAt: new Date().toLocaleString(),

    lastLogin: latestSession?.timestamp
      ? new Date(latestSession.timestamp).toLocaleString()
      : "N/A",

    totalUsers,

    totalSessions,

    liveOrders,
    testOrders,

    pendingOrders,

    liveRevenue,
    testRevenue,

    pendingCartItems,

    topPendingCartUsers,
  };
};

export { generateAnalytics };
