import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSendOtpMutation } from "../services/auth.js";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice.js";
import { closeAuth } from "../features/uiSlice.js";

function OtpModal() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [sendOtp, { isLoading }] = useSendOtpMutation();
  const phoneNumber = useSelector((state) => state?.phone?.phoneNumber);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // On backspace, clear current and focus previous
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");
    if (finalOtp.length < 6) {
      toast.error("Please enter the complete OTP");
      return;
    }

    try {
      const user = await sendOtp({
        phoneOtp: finalOtp,
        phoneNumber,
      }).unwrap();

      dispatch(setCredentials(user));
      dispatch(closeAuth());

      if (!user?.isProfileCompleted) {
        navigate("/complete-profile");
        toast.success("OTP verified");
      } else {
        navigate("/");
        toast.success("Login successful");
      }
    } catch (error) {
      toast.error(error?.data?.message ?? "Invalid OTP. Please try again.");
      // Clear OTP on wrong entry
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0").focus();
    }
  };

  const isComplete = otp.every((d) => d !== "");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-bold text-xl text-gray-900 tracking-wide">
          Verify OTP
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-gray-600">+91 {phoneNumber}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* OTP inputs */}
        <div className="flex gap-2 justify-between">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`w-11 h-11 text-center text-sm font-semibold border rounded-lg outline-none transition-colors
                ${
                  digit
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-300 focus:border-gray-600"
                }`}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading || !isComplete}
          className="w-full py-2.5 rounded-lg bg-gray-900 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
}

export default OtpModal;
