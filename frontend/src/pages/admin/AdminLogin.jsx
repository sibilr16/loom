import { useState } from "react";
import { useAdminLoginMutation } from "../../services/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [adminLogin] = useAdminLoginMutation();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await adminLogin({
        email: email,
        password: password,
      }).unwrap();

      console.log(res);
    } catch (error) {
      console.log(error);
    }

    toast.success("Login Success");
    navigate("/pro");
  };

  return (
    <div className="flex bg-slate-100 min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="shadow-lg rounded-md bg-gray-50 p-6 min-w-xs"
        action=""
      >
        <h1 className="text-lg mb-5 tracking-wide font-medium text-gray-800">
          Admin Login Form
        </h1>
        <div className="flex flex-col text-sm">
          <label className="mb-1" htmlFor="">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Email address"
            className="border mb-3 border-gray-400 rounded-sm p-1 placeholder:text-sm"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="mb-1" htmlFor="">
            Password
          </label>
          <input
            className="border mb-3 border-gray-400 rounded-sm p-1 placeholder:text-sm"
            type="text"
            value={password}
            name="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="text-sm bg-gray-900 text-gray-50 px-2 py-1 rounded-sm"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
