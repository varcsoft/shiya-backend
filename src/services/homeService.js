import prisma from "../config/database.js";

const getLiveNotices = async () => {
  const notices = await prisma.notices.findFirst({
    where: {
      status: true,
    },
  });
  return notices;
};

export { getLiveNotices };
