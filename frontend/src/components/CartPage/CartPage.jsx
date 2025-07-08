import React, { useState } from "react"
import { useCart } from "../../CartContext/CartContext"
import { Link } from "react-router-dom"
import { FaMinus, FaPlus, FaTrash, FaTimes } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import axios from "axios"

// Base URL for serving uploaded images
const API_URL = "http://localhost:4000"
// const API_URL = "https://shmoothie-backend.onrender.com"

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalAmount } = useCart()
  const [selectedImage, setSelectedImage] = useState(null)
  const [seatNumber, setSeatNumber] = useState("")

  const navigate = useNavigate()

  const token = localStorage.getItem("authToken")
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  const goToCheckout = () => {
    if (!seatNumber) {
      alert("Please enter a seat number before checkout.")
      return
    }
    // Optional loading and error state if needed
    // const [loading, setLoading] = useState(false)
    // const [error, setError] = useState("")
    console.log("test-1-frontend")
    // Reserve the seat
    axios
      .post(
        "http://localhost:4000/api/seats/reserve", // or production endpoint
        { number: seatNumber },
        { headers: authHeaders }
      )
      .then(({ data }) => {
        console.log("Seat reserved:", data)
        // Navigate to checkout after success
        navigate("/checkout", { state: { seatNumber } })
      })
      .catch((err) => {
        console.error("Seat reservation error:", err)
        alert("Seat reservation failed. Try another number or contact support.")
      })
  }

  // Helper to construct full image URL
  const buildImageUrl = (path) => {
    if (!path) return ""
    return path.startsWith("http")
      ? path
      : `${API_URL}/uploads/${path.replace(/^\/uploads\//, "")}`
  }

  return (
    <div className="min-h-screen overflow-x-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12">
          <span className="font-dancingscript block text-5xl sm:text-6xl md:text-7xl mb-2 bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
            Your Cart
          </span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-amber-100/80 text-xl mb-4">Your cart is empty</p>
            <Link
              to="/menu"
              className="bg-amber-900/40 px-6 py-2 rounded-full font-cinzel text-sm uppercase hover:bg-amber-800/50 transition duration-300 text-amber-100 inline-flex items-center gap-2"
            >
              Browse All Items
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cartItems
                .filter((ci) => ci.item)
                .map(({ _id, item, quantity }) => (
                  <div
                    key={_id}
                    className="group bg-amber-900/20 p-4 rounded-2xl border-4 border-dashed border-amber-500 backdrop-blur-sm flex flex-col items-center gap-4 transition-all duration-300 hover:border-solid hover:shadow-xl hover:shadow-amber-900/10 transform hover:-translate-y-1"
                  >
                    <div
                      className="w-24 h-24 flex-shrink-0 cursor-pointer relative overflow-hidden rounded-lg transition-transform duration-300"
                      onClick={() =>
                        setSelectedImage(
                          buildImageUrl(item.imageUrl || item.image)
                        )
                      }
                    >
                      <img
                        src={buildImageUrl(item?.imageUrl || item?.image)}
                        alt={item?.name || "Item"}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="w-full text-center">
                      <h3 className="text-xl font-dancingscript text-amber-100">
                        {item.name}
                      </h3>
                      <p className="text-amber-100/80 font-cinzel mt-1">
                        {Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(_id, Math.max(1, quantity - 1))
                        }
                        className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50 transition duration-200 active:scale-95"
                      >
                        <FaMinus className="w-4 h-4 text-amber-100" />
                      </button>
                      <span className="w-8 text-center text-amber-100 font-cinzel">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(_id, quantity + 1)}
                        className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50 transition duration-200 active:scale-95"
                      >
                        <FaPlus className="w-4 h-4 text-amber-100" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between w-full">
                      <button
                        onClick={() => removeFromCart(_id)}
                        className="bg-amber-900/40 px-3 py-1 rounded-full font-cinzel text-xs uppercase transition duration-300 hover:bg-amber-800/50 flex items-center gap-1 active:scale-95"
                      >
                        <FaTrash className="w-4 h-4 text-amber-100" />
                        <span className="text-amber-100">Remove</span>
                      </button>
                      <p className="text-sm font-dancingscript text-amber-300">
                        {(Number(item.price) * quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/* <div className="mt-12 pt-8 border-t border-amber-800/30">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
                <Link
                  to="/menu"
                  className="bg-amber-900/40 px-8 py-3 rounded-full font-cinzel uppercase tracking-wider hover:bg-amber-800/50 transition duration-300 text-amber-100 inline-flex items-center gap-2 active:scale-95"
                >
                  Continue Shopping
                </Link>
                <div className="flex items-center gap-8">
                  <h2 className="text-3xl font-dancingscript text-amber-100">
                    Total:IQD {totalAmount.toFixed(2)}
                  </h2>
                  <Link
                    to="/checkout"
                    className="bg-amber-900/40 px-8 py-3 rounded-full font-cinzel uppercase tracking-wider hover:bg-amber-800/50 transition duration-300 text-amber-100 flex items-center gap-2 active:scale-95"
                  >
                    Checkout Now
                  </Link>
                </div>
              </div>
            </div> */}
            <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
              {/* Total Amount */}
              <h2 className="text-3xl font-dancingscript text-amber-100 text-center sm:text-left">
                Total: {totalAmount.toFixed(2)}
              </h2>

              {/* Seat Number Input */}
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <label
                  htmlFor="seat-count"
                  className="text-amber-100 font-cinzel text-sm"
                >
                  Seat No:
                </label>
                <input
                  type="number"
                  id="seat-count"
                  name="seat-count"
                  min={1}
                  value={seatNumber}
                  onChange={(e) => setSeatNumber(e.target.value)}
                  className="w-20 px-2 py-1 rounded-md bg-amber-900/40 text-amber-100 border border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center"
                  placeholder="e.g. 5"
                />
              </div>

              {/* Checkout Button */}
              {/* <Link
                to="/checkout"
                className="bg-amber-900/40 px-8 py-3 rounded-full font-cinzel uppercase tracking-wider hover:bg-amber-800/50 transition duration-300 text-amber-100 flex items-center gap-2 active:scale-95"
              >
                Checkout Now
              </Link> */}

              <button
                onClick={goToCheckout}
                className="bg-amber-900/40 px-8 py-3 rounded-full font-cinzel uppercase tracking-wider hover:bg-amber-800/50 transition duration-300 text-amber-100 flex items-center gap-2 active:scale-95"
              >
                Checkout Now
              </button>
            </div>
          </>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-amber-900/40 bg-opacity-75 backdrop-blur-sm p-4 overflow-auto"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={selectedImage}
              alt="Full view"
              className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-1 right-1 bg-amber-900/80 rounded-full p-2 text-black hover:bg-amber-800/90 transition duration-200 active:scale-90"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage
