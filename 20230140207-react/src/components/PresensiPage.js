import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function PresensiPage() {
  const [message, setMessage] = useState("");
  const [coords, setCoords] = useState(null); // {lat, lng}
  const [error, setError] = useState(""); // untuk menampilkan error lokasi

  const token = localStorage.getItem("token");

  // Fungsi untuk mendapatkan lokasi pengguna
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          setError("Gagal mendapatkan lokasi: " + err.message);
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
    }
  };

  // Ambil lokasi saat komponen dimuat
  useEffect(() => {
    getLocation();
  }, []);

  const checkIn = async () => {
    try {
      if (!coords) {
        setError(
          "Lokasi belum didapatkan. Mohon izinkan akses lokasi."
        );
        return;
      }

      const res = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        {
          latitude: coords.lat,
          longitude: coords.lng, // kirim ke backend
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message);
    }
  };

  const checkOut = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-blue-500 via-purple-500 to-pink-500 p-10">
      
      {/* Peta */}
      {coords && (
        <div className="my-4 border rounded-lg overflow-hidden">
          <MapContainer
            center={[coords.lat, coords.lng]}
            zoom={15}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[coords.lat, coords.lng]}>
              <Popup>Lokasi Presensi Anda</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      <div className="max-w-xl mx-auto bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/40">

        <h1 className="text-4xl font-extrabold text-white text-center drop-shadow-lg">
          Presensi ✨
        </h1>

        {error && (
          <p className="mt-4 bg-red-400/30 p-3 rounded-xl text-center font-bold text-white backdrop-blur-xl">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-6 bg-white/40 p-3 rounded-xl text-center font-bold text-white backdrop-blur-xl">
            {message}
          </p>
        )}

        <div className="flex flex-col gap-6 mt-10">
          <button
            onClick={checkIn}
            className="bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-bold py-3 rounded-xl hover:scale-105 transition-all shadow-lg"
          >
            Check-In
          </button>

          <button
            onClick={checkOut}
            className="bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold py-3 rounded-xl hover:scale-105 transition-all shadow-lg"
          >
            Check-Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;
