import express from "express";
import response from "../config/response.js";
import seeddb from "../config/seeder.js";

const router = express.Router();

router.get("/", (req, res) => {
  response.sendSuccess(res, 200, { message: "OK" });
});
router.put("/seeddb", async (req, res) => {
  try {
    // await seeddb();
    response.sendSuccess(res, 200, { message: "OK" });
  } catch (error) {
    response.sendError(res, 500, { message: error.message });
  }
});

export default router;
