import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');  
    navigate('/login'); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-300 to-green-500 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center w-full max-w-lg">

        <h1 className="text-4xl font-bold text-green-700 mb-4">
          Login Berhasil! 🎉
        </h1>

        <p className="text-lg text-gray-700 mb-8">
          Selamat Datang di Dashboard Kamu.
        </p>

        <button
          onClick={handleLogout}
          className="py-2 px-6 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default DashboardPage;
