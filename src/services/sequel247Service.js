import { env } from "../config/env.js";
import sequelAxios from "../config/sequelAxios.js";

const isFalse = (value) => value === false || value === "false";

const resolveToken = (token) => token || env.SEQUEL_API_TOKEN;

const ensureToken = (token) => {
  if (!token) {
    throw new Error("SEQUEL_API_TOKEN is not configured");
  }
};

const post = async (path, payload, { token } = {}) => {
  const resolvedToken = resolveToken(token);
  ensureToken(resolvedToken);

  const response = await sequelAxios.post(path, {
    ...payload,
    token: resolvedToken,
  });
  return response;
};

const createAddress = (payload, options) =>
  post("/api/create_address", payload, options);

const calculateEDD = (payload, options) =>
  post("/api/shipment/calculateEDD", payload, options);

const cancelShipment = (payload, options) =>
  post("/api/cancel", payload, options);

const checkServiceability = (data = { pin_code: pinCode }, options) =>
  post("/api/checkServiceability", data, options);

const createShipment = (payload, options) =>
  post("/api/shipment/create", payload, options);

const downloadPOD = (payload, options) =>
  post("/api/podDownload", payload, options);

const track = (payload, options) => post("/api/track", payload, options);

const trackMultiple = (payload, options) =>
  post("/api/trackMultiple", payload, options);

export {
  createAddress,
  calculateEDD,
  cancelShipment,
  checkServiceability,
  createShipment,
  downloadPOD,
  track,
  trackMultiple,
};
