import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("mahasiswa");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:3001/api/auth/register", {
        nama,
        email,
        password,
        role
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registrasi gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 p-6">
      <div className="bg-white/30 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-lg border border-white/40">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-white drop-shadow-lg">
          Create Account ✨
        </h2>

        {error && (
          <p className="text-red-300 mb-4 text-center bg-red-900/30 py-2 rounded-xl border border-red-400/30">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="text-white font-semibold">Nama</label>
            <input
              type="text"
              className="w-full bg-white/70 border border-white p-3 rounded-xl mt-1"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama"
            />
          </div>

          <div>
            <label className="text-white font-semibold">Email</label>
            <input
              type="email"
              className="w-full bg-white/70 border border-white p-3 rounded-xl mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
            />
          </div>

          <div>
            <label className="text-white font-semibold">Password</label>
            <input
              type="password"
              className="w-full bg-white/70 border border-white p-3 rounded-xl mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
            />
          </div>

          <div>
            <label className="text-white font-semibold">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-white/70 border border-white p-3 rounded-xl mt-1"
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className="w-full py-3 rounded-xl font-bold text-white text-lg shadow-lg bg-gradient-to-r from-yellow-400 to-pink-500 hover:scale-105 transition-all">
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-white font-medium">
          Sudah punya akun?  
          <Link
            to="/login"
            className="ml-1 text-yellow-300 font-extrabold underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
