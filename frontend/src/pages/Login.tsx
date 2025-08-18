import React, { useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      navigate(res.data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded shadow w-full max-w-xs"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-6">Login</h2>
        <input
          className="border p-2 rounded w-full mb-3"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="border p-2 rounded w-full mb-3"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">
          Login
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <h4 className="flex gap-2 my-2">
          <p>Don't have account? </p>
          <Link to="/signup" className="text-blue-500 hover:text-blue-700">
            Signup
          </Link>
        </h4>
      </form>
    </div>
  );
};

export default Login;

