import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useSendOtpMutation } from "../services/auth.js";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice.js";
import { closeAuth } from "../features/uiSlice.js";

function OtpModal() {
  const [otp, setOtp] = useState(0);
  const [sendOtp] = useSendOtpMutation();
  const phoneNumber = useSelector((state) => state?.phone?.phoneNumber);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(phoneNumber);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const user = await sendOtp({
        phoneOtp: otp,
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
        <h1 className="mb-4 text-center text-gray-800 font-bold text-2xl">
          VERIFY OTP
        </h1>
        <input
          name="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border p-2 mb-3"
          type="number"
        />
        <button
          type="submit"
          className="uppercase cursor-pointer text-gray-100 w-full py-2 bg-gray-900"
        >
          send otp
        </button>
      </form>
    </div>
  );
}

export default OtpModal;
