import { useNavigate } from "react-router-dom";
import { useGetMeQuery, useLogoutMutation } from "../services/auth";
import { useDispatch } from "react-redux";
import { setCredentials, setLogout } from "../features/authSlice";
import toast from "react-hot-toast";
import { useState } from "react";

function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const { status, data: user } = useGetMeQuery();
  const [logout] = useLogoutMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (status === "fulfilled") console.log(user);

  const handleSubmit = () => {};

  const handleLogout = async (e) => {
    e.preventDefault();
    dispatch(setLogout());
    const res = await logout().unwrap();
    console.log(res);
    toast.success(res.message);
    navigate("/");
  };

  return (
    <div className="max-w-xs md:max-w-lg mx-auto mt-24  shadow-xs border border-gray-300 rounded-md">
      {status === "fulfilled" && user && (
        <div className="flex flex-col items-center justify-center">
          <form
            className="flex flex-col md:space-y-3 md:min-w-md min-w-xs mx-auto space-y-2  p-10"
            onSubmit={handleSubmit}
            action=""
          >
            <h1 className="self-center mb-5 text-lg font-semibold uppercase text-gray-800">
              Profile
            </h1>
            <div className="flex flex-col justify-between">
              <label htmlFor="">Name</label>
              <input
                className="border border-gray-600 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg p-2"
                type="text"
                name="username"
                placeholder="username"
                value={user.username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col justify-between">
              <label htmlFor="">Phone Number</label>
              <input
                className="border border-gray-600 rounded-lg p-2 disabled:text-gray-500 disabled:cursor-not-allowed"
                type="tel"
                placeholder="phoneNumber"
                name="phoneNumber"
                value={user.phoneNumber}
                disabled
                // onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col justify-between">
              <label htmlFor="">Email ID</label>
              <input
                className="border disabled:text-gray-500 disabled:cursor-not-allowed border-gray-600 rounded-lg p-2"
                type="email"
                name="email"
                placeholder="email"
                value={user.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              className="cursor-pointer mt-2  border p-2  bg-gray-900 text-gray-50 border-gray-600 rounded-lg"
              type="submit"
              disabled
            >
              Submit
            </button>
          </form>
          <button
            type=""
            onClick={handleLogout}
            className="mb-6 border px-3 py-2 rounded-md border-gray-400 hover:text-gray-50 hover:bg-gray-950 duration-300 cursor-pointer font-medium tracking-wide"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
