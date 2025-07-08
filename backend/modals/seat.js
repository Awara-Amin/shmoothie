import mongoose from "mongoose"

const seatSchema = new mongoose.Schema(
  {
    number: {
      type: String, // Change to Number if needed
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["available", "occupied"],
      default: "available",
    },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
  },
  { timestamps: true }
)

const seatModel = mongoose.models.seat || mongoose.model("seat", seatSchema)

export default seatModel
