import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Webcam from "react-webcam";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix icon leaflet
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
  const [coords, setCoords] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Kamera
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  const token = localStorage.getItem("token");

  // -------------------------------
  // Ambil Lokasi GPS
  // -------------------------------
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Browser tidak mendukung Geolocation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setError("Gagal mengambil lokasi: " + err.message);
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  // -------------------------------
  // Ambil Foto dari Webcam
  // -------------------------------
  const capture = useCallback(() => {
    const imgSrc = webcamRef.current.getScreenshot();
    setImage(imgSrc);
  }, [webcamRef]);

  // -------------------------------
  // CHECK-IN
  // -------------------------------
  const handleCheckIn = async () => {
    if (!coords) {
      setError("Lokasi belum ditemukan!");
      return;
    }

    if (!image) {
      setError("Foto selfie wajib diambil!");
      return;
    }

    try {
      // Base64 → Blob
      const blob = await (await fetch(image)).blob();

      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("buktiFoto", blob, "selfie.jpg"); // FIX


      const res = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error check-in");
    }
  };

  // -------------------------------
  // CHECK-OUT
  // -------------------------------
  const handleCheckOut = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error check-out");
    }
  };

  // -------------------------------
  // UI PAGE
  // -------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-bl from-blue-500 via-purple-500 to-pink-500 p-10">

      {/* Peta Lokasi */}
      {coords && (
        <div className="my-4 border rounded-lg overflow-hidden">
          <MapContainer
            center={[coords.lat, coords.lng]}
            zoom={15}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[coords.lat, coords.lng]}>
              <Popup>Lokasi Anda Sekarang</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      <div className="max-w-xl mx-auto bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/40">

        <h1 className="text-4xl font-extrabold text-white text-center drop-shadow-lg">
          Presensi Kamera + Lokasi 📸📍
        </h1>

        {error && (
          <p className="mt-4 bg-red-500/30 p-3 rounded-xl text-center text-white font-bold">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-4 bg-green-500/30 p-3 rounded-xl text-center text-white font-bold">
            {message}
          </p>
        )}

        {/* Kamera */}
        <div className="my-4 border rounded-lg overflow-hidden bg-black">
          {!image ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full"
            />
          ) : (
            <img src={image} alt="Selfie" className="w-full" />
          )}
        </div>

        <div className="mb-4">
          {!image ? (
            <button
              onClick={capture}
              className="bg-blue-500 text-white w-full py-3 rounded-xl"
            >
              Ambil Foto 📸
            </button>
          ) : (
            <button
              onClick={() => setImage(null)}
              className="bg-gray-500 text-white w-full py-3 rounded-xl"
            >
              Foto Ulang 🔄
            </button>
          )}
        </div>

        {/* Tombol Check In / Out */}
        <div className="flex flex-col gap-4 mt-6">
          <button
            onClick={handleCheckIn}
            className="bg-yellow-500 text-white font-bold py-3 rounded-xl"
          >
            Check-In
          </button>

          <button
            onClick={handleCheckOut}
            className="bg-purple-600 text-white font-bold py-3 rounded-xl"
          >
            Check-Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;
