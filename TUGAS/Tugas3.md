# 📝 Tugas 3 - Endpoint API

## 👋 POST /api/presensi/check-in
Melakukan check-in karyawan.
![Check-In](./SS/check-in.png)

---

## 🔁 POST /api/presensi/check-in (lebih dari 1 kali)
Cek validasi: tidak boleh check-in lebih dari sekali.
![Check-In Duplicate](./SS/check-in%202%20kali.png)

---

## 👋 POST /api/presensi/check-out
Melakukan check-out karyawan.
![Check-Out](./SS/check-out.png)

---

## ⛔ POST /api/presensi/check-out (belum check-in)
Cek validasi: tidak bisa check-out sebelum melakukan check-in.
![Check-Out Before Check-In](./SS/check-out%20blm%20check-in.png)

---

## 📊 GET /api/reports/daily (hanya admin)
Menampilkan laporan presensi harian untuk admin.
![Reports Daily](./SS/reports%20(hanya%20admin).png)
