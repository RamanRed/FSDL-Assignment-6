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
