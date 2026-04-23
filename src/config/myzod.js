import response from "./response.js";
import { z } from "zod";

const verifySchema = (schema) => async (req, res, next) => {
  try {
    console.log("Incoming Body:", req.body);
    // Use parseAsync if your schema has async refinements, else parse is fine
    const result = schema.safeParse(req.body);

    if (result.success) {
      next();
      return;
    }

    console.log("Validation Error:", result.error);
    if (!result.success) {
      const flattenError = z.flattenError(result.error);
      const keys = Object.keys(flattenError.fieldErrors);
      if (keys.length == 0) {
        response.sendError(res, 400, 1007, {
          user: "Unrecognized fields",
        });
        return;
      }
      return response.sendError(res, 400, 1007, {
        user: flattenError.fieldErrors[keys[0]][0],
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return response.sendError(res, 500, 1000);
  }
};

export default verifySchema;
