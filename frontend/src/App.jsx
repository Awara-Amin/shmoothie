import React, { useEffect } from "react"
// import React from 'react';
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home"
import Cart from "./pages/Cart/Cart"
import SignUp from "./components/SignUp/SignUp"
import ContactPage from "./pages/ContactPage/ContactPage"
import CheckoutPage from "./pages/Checkout/Checkout"
import AboutPage from "./pages/AboutPage/AboutPage"
import Menu from "./pages/Menu/Menu"
import PrivateRoute from "./components/PrivateRoute/PrivateRoute"

import MyOrders from "./pages/MyOredrs/MyOrders"
import VerifyPaymentPage from "./pages/VerifyPaymentPage/VerifyPaymentPage"

//AAA
import Cookies from "js-cookie"
import "./i18n"

// AAA
const languages = [
  {
    code: "en",
    name: "English",
    country_code: "gb",
    dir: "ltr",
  },
  {
    code: "ar",
    name: "عربي",
    country_code: "ar",
    dir: "rtl",
  },
]
function App() {
  // AAA
  const currentLanguageCode = Cookies.get("i18next") || "en"
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  useEffect(() => {
    document.body.dir = currentLanguage.dir || "rtl"
    // document.title = t('main.main_title');
  }, [currentLanguage])

  return (
    <Routes>
      {/* Public */}
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/" element={<Menu />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Home />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/menu" element={<Menu />} />

      {/* Payment verification */}
      <Route path="/myorder/verify" element={<VerifyPaymentPage />} />

      {/* Protected */}
      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        }
      />

      {/* The actual orders list */}
      <Route
        path="/myorder"
        element={
          <PrivateRoute>
            <MyOrders />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App
