import { useState } from "react";
import { useSendPhoneNumberMutation } from "../services/auth.js";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setPhone } from "../features/phoneSlice.js";

function SendOtpModal({ show }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sendPhoneNumber] = useSendPhoneNumberMutation();

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await sendPhoneNumber({ phone: phoneNumber }).unwrap();
      dispatch(setPhone(phoneNumber));
      toast.success(res.message);
      show();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center"
    >
      <h1 className="mb-4 text-center text-gray-800 font-bold text-2xl">
        LOGIN OR SIGNUP
      </h1>

      <input
        className="border mb-2 text-base text-gray-800 font-xs bg-none border-gray-400 rounded-xs px-2 py-2"
        type="tel"
        name="phoneNumber"
        value={phoneNumber}
        placeholder=""
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button
        type="submit"
        className="uppercase cursor-pointer text-gray-100 w-full py-2 bg-gray-900"
      >
        send otp
      </button>
    </form>
  );
}

export default SendOtpModal;
