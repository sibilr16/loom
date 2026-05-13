import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useSendOtpMutation } from "../services/auth.js";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice.js";
import { closeAuth } from "../features/uiSlice.js";

function OtpModal() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [sendOtp] = useSendOtpMutation();
  const phoneNumber = useSelector((state) => state?.phone?.phoneNumber);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(phoneNumber);

  const handleChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // auto focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const finalOtp = otp.join("");
      const user = await sendOtp({
        phoneOtp: finalOtp,
        phoneNumber: phoneNumber,
      }).unwrap();
      console.log(user);
      dispatch(setCredentials(user));
      console.log(user?.isProfileCompleted);
      if (!user?.isProfileCompleted) {
        navigate("/complete-profile");
        toast.success("OTP verified");
        dispatch(closeAuth());
      } else {
        navigate("/");
        toast.success("Login Successfully");
        dispatch(closeAuth());
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h1 className="my-4 mb-6 text-center text-gray-800 font-bold text-xl tracking-wide">
          VERIFY OTP
        </h1>
        <div className="flex gap-1 justify-center mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="
                w-8 h-8
                text-center
                text-xs
                border border-gray-300
                rounded-sm
                outline-none
                focus:ring-0
                focus:border-gray-500
              "
            />
          ))}
        </div>
        {/* <input
          name="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border p-2 mb-3"
          type="number"
        /> */}
        <button
          type="submit"
          className="uppercase text-xs cursor-pointer text-gray-100 py-2 bg-gray-900"
        >
          send otp
        </button>
      </form>
    </div>
  );
}

export default OtpModal;
