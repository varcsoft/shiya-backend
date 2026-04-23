import { UAParser } from "ua-parser-js";

const getUserSysDetails = (req) => {
  const ipaddress = req.connection.remoteAddress || req.socket.remoteAddress;
  const useragent = req.get("User-Agent");
  const parser = new UAParser(useragent);
  const result = parser.getResult();
  const operatingsystem = result.os.name || "Unknown";
  const devicetype = result.device.type || "Unknown";
  const browser = result.browser.name || "Unknown";
  return { ipaddress, useragent, devicetype, operatingsystem, browser };
};
export { getUserSysDetails };
