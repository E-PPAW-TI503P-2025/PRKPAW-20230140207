import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let user = null;

  if (token) {
    try {
      user = jwtDecode(token);
    } catch {
      user = null;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <div className="space-x-4">

        {/* Dashboard User atau Admin */}
        {user?.role === "admin" ? (
          <Link to="/dashboard-admin" className="font-bold">Dashboard Admin</Link>
        ) : (
          <Link to="/dashboard" className="font-bold">Dashboard</Link>
        )}

        {/* Presensi untuk semua role */}
        {user && <Link to="/presensi">Presensi</Link>}

        {/* Report Admin */}
        {user?.role === "admin" && (
          <Link to="/reports">Report Admin</Link>
        )}

      </div>

      {user && (
        <div>
          <span className="mr-4">Halo, {user.nama}</span>
          <button onClick={handleLogout} className="bg-red-500 px-2 py-1 rounded">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
