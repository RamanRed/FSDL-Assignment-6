import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    specialization: {
      type: String,
      required: true
    },
    availableSlots: {
      type: [String],
      default: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
