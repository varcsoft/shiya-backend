const SENSITIVE_KEYS = [
  "password",
  "secret",
  "token",
  "apiKey",
  "authorization",
  "firebaseUid",
];

const sanitize = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => sanitize(item));
  } else if (data instanceof Date) {
    return data; // Preserve Date objects
  } else if (data && typeof data === "object") {
    const sanitized = {};
    for (const key in data) {
      if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
        sanitized[key] = ""; // or null
      } else if (typeof data[key] === "object") {
        sanitized[key] = sanitize(data[key]); // recursive
      } else if (typeof data[key] === "string") {
        // Example: strip <script> tags
        sanitized[key] = data[key].replace(/<script.*?>.*?<\/script>/gi, "");
      } else {
        sanitized[key] = data[key];
        
      }
    }
    return sanitized;
  }
  return data;
};

export { sanitize };
