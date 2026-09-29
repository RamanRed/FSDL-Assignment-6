import dotenv from "dotenv";
import { connectDB, pool } from "../config/db.js";
import Doctor from "../models/Doctor.js";

dotenv.config();

const doctors = [
  { name: "Dr. Priya Sharma", specialization: "Cardiologist" },
  { name: "Dr. Aman Verma", specialization: "Dentist" },
  { name: "Dr. Neha Iyer", specialization: "Dermatologist" },
  { name: "Dr. Rohan Kulkarni", specialization: "General Physician" }
];

const seed = async () => {
  try {
    await connectDB();
    await Doctor.deleteMany();
    await Doctor.insertMany(doctors);
    console.log("Doctors seeded successfully in PostgreSQL");
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seed();
