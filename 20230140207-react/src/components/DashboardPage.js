import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center w-full max-w-lg">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Dashboard
        </h1>

        <p className="text-gray-700 text-lg mb-8">
          Selamat datang! Anda berhasil login.
        </p>

        <button
          onClick={handleLogout}
          className="py-2 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
