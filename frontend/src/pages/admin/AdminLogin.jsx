import { useState } from "react";

function AdminLogin() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
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
