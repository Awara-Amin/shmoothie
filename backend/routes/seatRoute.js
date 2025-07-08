import express from "express"
import { reserveSeat } from "../controllers/seatController.js"
import authMiddleware from "../middleware/auth.js"

const seatRouter = express.Router()

// Public routes
// seatRouter.get("/all", getAllSeats)
// seatRouter.get("/:number", getSeatByNumber)

// Protected routes (requires login)
seatRouter.use(authMiddleware)
seatRouter.post("/reserve", authMiddleware, reserveSeat)

export default seatRouter
