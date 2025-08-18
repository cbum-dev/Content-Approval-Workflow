import React, { useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/auth/signup", { email, password, role: "user" });
      navigate("/login");
    } catch {
      setError("Signup failed. Try another email.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow w-full max-w-xs" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-6">Signup</h2>
        <input
          className="border p-2 rounded w-full mb-3"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="border p-2 rounded w-full mb-3"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">Signup</button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <h4 className="flex gap-2 my-2">
          <p>Already have account? </p>
          <Link to="/login" className="text-blue-500 hover:text-blue-700">
            Login
          </Link>
        </h4>
      </form>
    </div>
  );
};

export default Signup;
