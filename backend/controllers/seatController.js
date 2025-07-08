import "dotenv/config"
import seatModel from "../modals/seat.js"
// import userModel from "../modals/userModel.js"
// import Seat from "../models/seatModel.js"

export const reserveSeat = async (req, res, next) => {
  console.log("test-1-backend")
  try {
    const { number } = req.body
    const userId = req.user?._id // depends on your auth middleware
    console.log("test-1-backend-userId", userId)
    if (!number) {
      return res.status(400).json({ message: "Seat number is required" })
    }

    // Check if seat already exists
    let seat = await seatModel.findOne({ number })

    if (seat) {
      if (seat.status === "occupied") {
        return res.status(400).json({ message: "Seat is already taken" })
      }

      // Update existing seat
      seat.status = "occupied"
      seat.assignedUser = userId || null
    } else {
      // Create new seat
      seat = new seatModel({
        number,
        status: "occupied",
        assignedUser: userId || null,
      })
    }

    const savedSeat = await seat.save()
    res.status(200).json({ message: "Seat reserved", seat: savedSeat })
  } catch (err) {
    next(err)
  }
}
