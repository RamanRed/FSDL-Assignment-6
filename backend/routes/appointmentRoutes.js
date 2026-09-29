import express from "express";
import Appointment from "../models/Appointment.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.doctorId) {
      filter.doctor = req.query.doctorId;
    }

    if (req.query.date) {
      filter.date = req.query.date;
    }

    const appointments = await Appointment.find(filter);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { patientName, patientEmail, doctor, date, slot, reason } = req.body;

    if (!patientName || !patientEmail || !doctor || !date || !slot) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const saved = await Appointment.create({
      patientName,
      patientEmail,
      doctor,
      date,
      slot,
      reason
    });

    res.status(201).json(saved);
  } catch (error) {
    // 23505 is PostgreSQL unique violation code
    if (error.code === "23505" || error.code === 11000) {
      return res.status(409).json({ message: "This slot is already booked" });
    }

    res.status(500).json({ message: "Failed to create appointment", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel appointment", error: error.message });
  }
});

export default router;
