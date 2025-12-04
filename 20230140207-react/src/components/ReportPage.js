import React, { useEffect, useState } from "react";
import axios from "axios";

function ReportPage() {
  const [data, setData] = useState([]);
  const [nama, setNama] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Untuk modal foto
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const token = localStorage.getItem("token");

  const loadData = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/presensi/daily", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat laporan");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tl from-blue-500 via-purple-500 to-pink-500 p-10">
      <div className="max-w-6xl mx-auto bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/40">

        <h1 className="text-4xl text-center font-extrabold text-white drop-shadow-lg">
          Laporan Presensi ✨
        </h1>

        {/* SEARCH INPUT */}
        <div className="mt-6 flex gap-3">
          <input
            type="text"
            placeholder="Cari nama..."
            className="w-full p-3 rounded-lg bg-white/40 text-gray-900 outline-none"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
          <button
            onClick={loadData}
            className="px-5 py-3 bg-white/40 text-white rounded-lg font-bold hover:bg-white/60 transition"
          >
            Cari
          </button>
        </div>

        {/* FILTER TANGGAL */}
        <div className="mt-4 flex gap-3">
          <input
            type="date"
            className="w-full p-3 rounded-lg bg-white/40 text-gray-900 outline-none"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="w-full p-3 rounded-lg bg-white/40 text-gray-900 outline-none"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            onClick={loadData}
            className="px-5 py-3 bg-white/40 text-white rounded-lg font-bold hover:bg-white/60 transition"
          >
            Filter
          </button>
        </div>

        {/* TABLE */}
        <table className="w-full mt-8 text-white">
          <thead>
            <tr className="bg-white/20 text-center">
              <th className="p-3">Nama</th>
              <th className="p-3">Check-In</th>
              <th className="p-3">Check-Out</th>
              <th className="p-3">Latitude</th>
              <th className="p-3">Longitude</th>
              <th className="p-3">Lokasi</th>
              <th className="p-3">Bukti Foto</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-white/80">
                  Tidak ada data ditemukan
                </td>
              </tr>
            ) : (
              data.map((item, i) => (
                <tr key={i} className="text-center bg-white/10">
                  <td className="p-3">{item.nama}</td>
                  <td className="p-3">{item.checkIn}</td>
                  <td className="p-3">{item.checkOut || "-"}</td>

                  {/* LATITUDE */}
                  <td className="p-3">{item.latitude || "-"}</td>

                  {/* LONGITUDE */}
                  <td className="p-3">{item.longitude || "-"}</td>

                  {/* GOOGLE MAP LINK */}
                  <td className="p-3">
                    {item.latitude && item.longitude ? (
                      <a
                        href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-blue-200 hover:text-white"
                      >
                        Buka Map
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* FOTO */}
                  <td className="p-3">
                    {item.buktiFoto ? (
                      <img
                        src={`http://localhost:3001/uploads/${item.buktiFoto}`}
                        alt="Bukti"
                        className="w-20 h-20 object-cover cursor-pointer rounded-lg border border-white/50"
                        onClick={() =>
                          setSelectedPhoto(
                            `http://localhost:3001/uploads/${item.buktiFoto}`
                          )
                        }
                      />
                    ) : (
                      <span className="text-white/70">Tidak ada foto</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FULL PHOTO */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 cursor-pointer"
        >
          <img
            src={selectedPhoto}
            alt="Foto Bukti"
            className="max-w-[90%] max-h-[90%] rounded-xl border-4 border-white shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}

export default ReportPage;
