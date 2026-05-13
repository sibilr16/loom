import { useEffect, useState } from "react";
import { useCompleteProfileMutation, useGetMeQuery } from "../services/auth.js";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../features/authSlice.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function CompleteProfileModal() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const { data } = useGetMeQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (data) {
      dispatch(setCredentials(data));
    }
  }, [data, dispatch]);

  const [CompleteProfile] = useCompleteProfileMutation();

  const { phoneNumber, isProfileCompleted } = useSelector(
    (state) => state?.auth?.user,
  );
  if (isProfileCompleted) navigate("/");
  const handleSubmit = async (e) => {
    e.preventDefault();
    await CompleteProfile({
      username: username,
      phoneNumber: phoneNumber,
      email: email,
    });
    toast.success("Account created");
    navigate("/");
  };

  return (
    <div className="flex w-full min-h-screen  items-center justify-center">
      <form
        className="flex flex-col min-w-sm mx-auto space-y-2 shadow-2xl p-10"
        onSubmit={handleSubmit}
        action=""
      >
        <h1 className="self-center mb-5 text-lg font-semibold uppercase text-gray-800">
          Complete Profile
        </h1>
        <input
          className="border border-gray-600 rounded-lg p-2"
          type="text"
          name="username"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border border-gray-600 rounded-lg p-2 disabled:text-gray-500 disabled:cursor-not-allowed"
          type="tel"
          placeholder="phoneNumber"
          name="phoneNumber"
          value={phoneNumber}
          disabled
          //   onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border border-gray-600 rounded-lg p-2"
          type="email"
          name="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="cursor-pointer border p-2 bg-gray-900 text-gray-50 border-gray-600 rounded-lg"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default CompleteProfileModal;
