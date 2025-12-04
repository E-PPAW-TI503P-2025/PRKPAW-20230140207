import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 p-6">
      <div className="bg-white/30 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-lg border border-white/40">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-white drop-shadow-lg">
          Welcome Back ✨
        </h2>

        {error && (
          <p className="text-red-300 mb-4 text-center bg-red-900/30 py-2 rounded-xl border border-red-400/30">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-white font-semibold">Email</label>
            <input
              type="email"
              className="w-full mt-1 bg-white/70 text-gray-800 border border-white p-3 rounded-xl focus:ring-4 focus:ring-pink-300 focus:outline-none"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-white font-semibold">Password</label>
            <input
              type="password"
              className="w-full mt-1 bg-white/70 text-gray-800 border border-white p-3 rounded-xl focus:ring-4 focus:ring-blue-300 focus:outline-none"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-white text-lg shadow-lg bg-gradient-to-r from-yellow-400 to-pink-500 hover:scale-105 transition-all"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-white font-medium">
          Belum punya akun?
          <Link
            to="/register"
            className="ml-1 text-yellow-300 font-extrabold underline hover:text-yellow-200"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
