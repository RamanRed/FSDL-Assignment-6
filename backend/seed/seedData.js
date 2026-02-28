import dotenv from "dotenv";
import mongoose from "mongoose";
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
    await mongoose.connect(process.env.MONGO_URI);
    await Doctor.deleteMany();
    await Doctor.insertMany(doctors);
    console.log("Doctors seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seed();
