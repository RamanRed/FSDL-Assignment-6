import express from "express";
import Doctor from "../models/Doctor.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors", error: error.message });
  }
});

export default router;
