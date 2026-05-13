import { useNavigate } from "react-router-dom";
import { useGetMeQuery, useLogoutMutation } from "../services/auth";
import { useDispatch } from "react-redux";
import { setCredentials, setLogout } from "../features/authSlice";
import toast from "react-hot-toast";

function Profile() {
  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  const { status, data: user } = useGetMeQuery();
  const [logout] = useLogoutMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (status === "fulfilled") console.log(user);

  const handleSubmit = () => {};

  const handleLogout = async (e) => {
    e.preventDefault();
    dispatch(setCredentials(logout()));
    const res = await setLogout().unwrap();
    toast.success(res.message);
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto mt-24  shadow-2xl">
      {status === "fulfilled" && user && (
        <div className="flex flex-col items-center justify-center">
          <form
            className="flex flex-col min-w-sm mx-auto space-y-2  p-10"
            onSubmit={handleSubmit}
            action=""
          >
            <h1 className="self-center mb-5 text-lg font-semibold uppercase text-gray-800">
              Profile
            </h1>
            <input
              className="border border-gray-600 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg p-2"
              type="text"
              name="username"
              placeholder="username"
              value={user.username}
              // onChange={(e) => setUsername(e.target.value)}
              disabled
            />
            <input
              className="border border-gray-600 rounded-lg p-2 disabled:text-gray-500 disabled:cursor-not-allowed"
              type="tel"
              placeholder="phoneNumber"
              name="phoneNumber"
              value={user.phoneNumber}
              disabled
              // onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="border disabled:text-gray-500 disabled:cursor-not-allowed border-gray-600 rounded-lg p-2"
              type="email"
              name="email"
              placeholder="email"
              value={user.email}
              // onChange={(e) => setEmail(e.target.value)}
              disabled
            />

            <button
              className="cursor-pointer  border p-2 disabled:cursor-not-allowed disabled:bg-gray-500  bg-gray-900 text-gray-50 border-gray-600 rounded-lg"
              type="submit"
              disabled
            >
              Submit
            </button>
          </form>
          <button
            type=""
            onClick={handleLogout}
            className="mb-6 border min-w-xs p-2 rounded-md border-gray-400 hover:text-gray-50 hover:bg-gray-950 duration-300 cursor-pointer font-medium tracking-wide"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
