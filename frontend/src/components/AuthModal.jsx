import { useState } from "react";
import OtpModal from "./OtpModal";
import SendOtpModal from "./sendOtpModal";
import { closeAuth } from "../features/uiSlice";
import { useDispatch } from "react-redux";
import { VscChromeClose } from "react-icons/vsc";
import { IoCloseCircleSharp } from "react-icons/io5";

function AuthModal() {
  const [showOtp, setShowOtp] = useState(false);
  const dispatch = useDispatch();
  return (
    <div>
      {/* Backdrop */}
      <div
        // onClick={}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-500 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      <div
        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300
      `}
      >
        <div className="bg-gray-50 relative rounded-md p-8 max-w-2xl flex flex-col md:flex-row gap-4  ">
          <button
            onClick={() => dispatch(closeAuth())}
            className="absolute  top-2 right-2 cursor-pointer text-gray-900"
          >
            {/* <VscChromeClose /> */}
            <IoCloseCircleSharp size={20} />
          </button>
          <div className="max-w-xs h-48 ">
            <img
              src="/login-user.png"
              alt="image"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            {showOtp ? (
              <OtpModal />
            ) : (
              <SendOtpModal show={() => setShowOtp(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
