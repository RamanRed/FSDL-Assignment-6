import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true
    },
    patientEmail: {
      type: String,
      required: true,
      trim: true
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },
    date: {
      type: String,
      required: true
    },
    slot: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      default: "General Checkup"
    }
  },
  { timestamps: true }
);

appointmentSchema.index({ doctor: 1, date: 1, slot: 1 }, { unique: true });

export default mongoose.model("Appointment", appointmentSchema);
