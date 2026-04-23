import prisma, { generateUUID } from "../config/database.js";

const createSession = async (sysDetails) => {
  await prisma.session.create({
    data: {
      id: generateUUID(),
      user_id: sysDetails.userID,
      token: sysDetails.token,
      ipaddress: sysDetails.ipaddress,
      useragent: sysDetails.useragent,
      devicetype: sysDetails.devicetype,
      operatingsystem: sysDetails.operatingsystem,
      browser: sysDetails.browser,
      sessionType: sysDetails.sessionType,
    },
  });
};
const getAllSessions = async (userid) => {
  return await prisma.session.findMany({
    where: {
      user_id: userid,
    },
    orderBy: {
      timestamp: "desc",
    },
  });
};
const deleteSessionById = async (id) => {
  return await prisma.session.delete({
    where: {
      id: id,
    },
  });
};
const validateSessionId = async (token, userID, sessionType) => {
  return await prisma.session.findFirst({
    where: {
      AND: [
        {
          user_id: userID,
        },
        {
          token: token,
        },
        {
          sessionType: sessionType,
        },
      ],
    },
    select: {
      user: true,
    },
  });
};
export { createSession, getAllSessions, deleteSessionById, validateSessionId };
