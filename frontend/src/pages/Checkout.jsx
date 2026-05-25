import { useSelector } from "react-redux";
import { getNames } from "country-list";
import { useGetCartQuery } from "../services/cart";
import { useState } from "react";
import CheckoutCard from "../components/CheckoutCard";
import {
  useMakePaymentMutation,
  useVerifyPaymentMutation,
} from "../services/payment";
import { loadRazorpayScript } from "../utils/loadRazorpay";
import { useSaveAddressMutation } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin } from "lucide-react";
import toast from "react-hot-toast";

import { useGetMeQuery } from "../services/auth.js";

function Checkout() {
  const [useDifferentAddress, setUseDifferentAddress] = useState(false);

  const user = useSelector((state) => state?.auth?.user);
  const { data: freshUser } = useGetMeQuery();
  const savedAddress = freshUser?.addresses?.[0];
  const navigate = useNavigate();
  const countries = getNames();

  const [formData, setFormData] = useState({
    country: "India",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pinCode: "",
    phoneNumber: user?.phoneNumber || "",
    saveInfo: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const { data: cartItems } = useGetCartQuery();
  const [saveAddress] = useSaveAddressMutation();
  const [makePayment, { isLoading: isCreatingOrder }] =
    useMakePaymentMutation();
  const [verifyPayment, { isLoading: isVerifying }] =
    useVerifyPaymentMutation();

  const cartTotal = cartItems?.items?.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const isProcessing = isCreatingOrder || isVerifying;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveAddress(formData);
      const data = await makePayment({ amount: cartTotal }).unwrap();

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Razorpay failed to load. Check your connection.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RZP_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Loom",
        description: "Order Payment",
        order_id: data.order_id,
        handler: async function (output) {
          await verifyPayment({
            ...output,
            cartItems: cartItems.items,
            totalAmount: cartTotal,
          }).unwrap();
          navigate("/orders");
        },
        theme: { color: "#111827" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      console.error(error);
    }
  };

  const inputClass =
    "w-full border border-gray-200 bg-gray-50 px-3 py-2.5 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors";

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors cursor-pointer mb-6"
      >
        <ChevronLeft size={14} />
        Back
      </button>

      <div className="flex flex-col md:flex-row-reverse gap-8">
        {/* Right — Order summary */}
        <div className="md:w-2/5">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden sticky top-24">
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Order Summary
              </p>
            </div>
            <ul className="divide-y divide-gray-100">
              {cartItems?.items?.map((item) => (
                <li key={`${item.product._id}-${item.size}`}>
                  <CheckoutCard item={item} />
                </li>
              ))}
            </ul>
            <div className="px-4 py-3 border-t border-gray-200 flex flex-col gap-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Shipping</span>
                <span className="text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Left — Delivery form */}
        <div className="md:w-3/5">
          {/* Contact */}
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              Contact
            </p>
            <div className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
              <p className="text-sm text-gray-700">
                {freshUser?.email ?? freshUser?.phoneNumber}
              </p>
            </div>
          </div>

          {/* Delivery */}
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            Delivery
          </p>

          {savedAddress && !useDifferentAddress ? (
            // Show saved address
            <div className="mb-4">
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex items-start gap-3">
                <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {savedAddress.firstName} {savedAddress.lastName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {[
                      savedAddress.address,
                      savedAddress.apartment,
                      savedAddress.city,
                      savedAddress.state,
                      savedAddress.pinCode,
                      savedAddress.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>

              {/* Toggle to use different address */}
              <button
                type="button"
                onClick={() => setUseDifferentAddress(true)}
                className="mt-2 text-xs text-gray-500 hover:text-gray-800 underline underline-offset-2 transition-colors cursor-pointer"
              >
                Use a different address
              </button>
            </div>
          ) : (
            // Show form
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Show "back to saved" option if they have a saved address */}
              {savedAddress && (
                <button
                  type="button"
                  onClick={() => setUseDifferentAddress(false)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors cursor-pointer self-start"
                >
                  <ChevronLeft size={12} />
                  Use saved address
                </button>
              )}
              {/* Country */}
              <div className="border border-gray-200 rounded-lg bg-gray-50 px-3 py-2 focus-within:border-gray-400 transition-colors">
                <p className="text-[10px] text-gray-400 mb-0.5">Country</p>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full text-sm text-gray-800 bg-transparent focus:outline-none"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  type="text"
                  className={inputClass}
                  placeholder="First name"
                />
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  type="text"
                  className={inputClass}
                  placeholder="Last name"
                />
              </div>

              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={inputClass}
                type="text"
                placeholder="Address"
              />
              <input
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                className={inputClass}
                type="text"
                placeholder="Apartment, suite, etc. (optional)"
              />

              {/* City / State / PIN */}
              <div className="grid grid-cols-3 gap-3">
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClass}
                  type="text"
                  placeholder="City"
                />
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={inputClass}
                  type="text"
                  placeholder="State"
                />
                <input
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  className={inputClass}
                  type="text"
                  placeholder="PIN code"
                />
              </div>

              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={inputClass}
                type="tel"
                placeholder="Phone number"
              />

              <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  name="saveInfo"
                  checked={formData.saveInfo}
                  onChange={handleChange}
                  className="rounded"
                />
                Save this information for next time
              </label>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold tracking-wide hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
              >
                {isProcessing ? "Processing..." : `Pay ₹${cartTotal}`}
              </button>
            </form>
          )}

          {/* Pay button for saved address — only when not using different address */}

          {savedAddress && !useDifferentAddress && (
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold tracking-wide hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {isProcessing ? "Processing..." : `Pay ₹${cartTotal}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
