import React from "react";

function DashboardPage() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300 p-10">
      <div className="bg-white/40 backdrop-blur-xl shadow-2xl p-8 rounded-3xl max-w-md w-full text-center animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg mb-4">
          Dashboard ✨
        </h1>

        {user ? (
          <>
            <p className="mt-2 text-lg text-white">
              Selamat datang,{" "}
              <span className="font-bold underline">{user.nama}</span>
            </p>
            <p className="mt-1 text-white/90">Role: {user.role}</p>
          </>
        ) : (
          <p className="text-red-400 mt-2 font-semibold">
            User tidak ditemukan. Silakan login ulang.
          </p>
        )}

        {/* Kartu info tambahan */}
        <div className="mt-6 grid grid-cols-1 gap-4">
          <div className="bg-white/50 backdrop-blur-md rounded-xl p-4 shadow-lg hover:scale-105 transform transition-all">
            <h2 className="font-semibold text-gray-800">Presensi Hari Ini</h2>
            <p className="text-gray-700 mt-1">Belum melakukan check-in ✅</p>
          </div>
          <div className="bg-white/50 backdrop-blur-md rounded-xl p-4 shadow-lg hover:scale-105 transform transition-all">
            <h2 className="font-semibold text-gray-800">Laporan Mingguan</h2>
            <p className="text-gray-700 mt-1">Presensi lengkap minggu ini: 0/5</p>
          </div>
        </div>

        <button className="mt-6 bg-yellow-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-yellow-500 transition-all transform hover:scale-105">
          Lihat Presensi
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
