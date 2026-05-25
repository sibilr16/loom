import { useState } from "react";
import { useSendPhoneNumberMutation } from "../services/auth.js";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setPhone } from "../features/phoneSlice.js";

function SendOtpModal({ show }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sendPhoneNumber, { isLoading }] = useSendPhoneNumberMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    try {
      const res = await sendPhoneNumber({ phone: phoneNumber }).unwrap();
      dispatch(setPhone(phoneNumber));
      toast.success(res.message);
      show();
    } catch (error) {
      toast.error(error?.data?.message ?? "Failed to send OTP");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <h1 className="font-bold text-xl text-gray-900 tracking-wide">
          Login or Signup
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          We'll send a one-time password to your number
        </p>
      </div>

      {/* Phone input with +91 prefix */}
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-gray-600 transition-colors">
        <span className="px-3 py-2.5 text-xs text-gray-500 bg-gray-50 border-r border-gray-300">
          +91
        </span>
        <input
          type="tel"
          name="phoneNumber"
          value={phoneNumber}
          maxLength={10}
          placeholder="Enter phone number"
          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
          className="flex-1 px-3 py-2.5 text-xs text-gray-800 focus:outline-none bg-white"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || phoneNumber.length !== 10}
        className="w-full py-2.5 rounded-lg bg-gray-900 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Sending..." : "Send OTP"}
      </button>
    </form>
  );
}

export default SendOtpModal;
