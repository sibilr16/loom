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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
      <h1 className="md:mt-5 tracking-wide text-gray-800 font-bold text-xl">
        LOGIN OR SIGNUP
      </h1>
      <div className="flex flex-col max-w-42">
        <input
          className="
          border outline-none focus:outline-none
          focus:ring-0
          focus:border-gray-400 text-xs placeholder:text-sm rounded-md mb-1 text-gray-800 font-xs bg-none border-gray-400 px-2 py-2"
          type="tel"
          name="phoneNumber"
          value={phoneNumber}
          placeholder="Enter phone number"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button
          type="submit"
          className="uppercase max-w-20 text-xs rounded-md cursor-pointer text-gray-100 w-full py-2 bg-gray-900"
        >
          send otp
        </button>
      </div>
    </form>
  );
}

export default SendOtpModal;
