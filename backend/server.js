import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import Doctor from "./models/Doctor.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Doctor Appointment API" });
});

// Kitchen Service Integration (Assignment 5)
app.get("/api/kitchen-status", async (_req, res) => {
  try {
    const kitchenUrl = process.env.KITCHEN_SERVICE_URL || "http://kitchen-service:3003";
    const response = await fetch(`${kitchenUrl}/health`);
    const data = await response.json();
    res.json({ backend: "connected", kitchen: data });
  } catch (error) {
    res.status(502).json({ error: "Failed to connect to kitchen service", details: error.message });
  }
});

app.post("/api/kitchen/prepare", async (req, res) => {
  try {
    const kitchenUrl = process.env.KITCHEN_SERVICE_URL || "http://kitchen-service:3003";
    const response = await fetch(`${kitchenUrl}/prepare`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(502).json({ error: "Failed to forward order to kitchen service", details: error.message });
  }
});

app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);

const ensureSeedDoctors = async () => {
  const existing = await Doctor.countDocuments();

  if (existing === 0) {
    await Doctor.insertMany([
      { name: "Dr. Priya Sharma", specialization: "Cardiologist" },
      { name: "Dr. Aman Verma", specialization: "Dentist" },
      { name: "Dr. Neha Iyer", specialization: "Dermatologist" }
    ]);
    console.log("Default doctors added");
  }
};

const startServer = async () => {
  await connectDB();
  await ensureSeedDoctors();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
