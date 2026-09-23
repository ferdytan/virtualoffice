# Virtual Office AI (Fullstack 3D + CrewAI)

Aplikasi ruang kantor virtual 3D interaktif yang menggabungkan visualisasi spasial 3D bergaya **claymorphism monochrome matte** (React Three Fiber + Drei + Tailwind CSS) dengan sistem multi-agen otonom **CrewAI** (FastAPI).

---

## 🏢 Fitur Utama

1. **3D Virtual Office Environment**
   - Estetika serba putih minimalis / claymorphic monochrome matte (terinspirasi dari antarmuka *"The Delegation"*).
   - Lantai putih dengan grid isometrik halus dan bayangan lembut (*soft shadows & contact shadows*).
   - Workstation modular matte (`roughness: 0.8`), monitor, partisi akustik, dan tanaman kantor.
   - Kontrol kamera orbit halus dengan pembatasan sudut isometrik yang elegan.

2. **3 Karakter Agen CrewAI**
   - **Nara** (Biru Muda `#38bdf8`): *CS & Offline Unit Reminder*. Memantau telemetri perangkat dan unit sistem, mendeteksi unit mati/offline, serta mengirim eskalasi darurat.
   - **Velocia** (Merah Solid `#ef4444`): *Marketing Strategist & Lead*. Merancang kampanye pemasaran pertumbuhan tinggi dan mendelegasikan riset pasar ke agen lain.
   - **Scout** (Hijau Solid `#22c55e`): *News Researcher & Writer*. Meriset tren industri terkini seputar AI dan menulis draf editorial/blog.

3. **Interaksi 3D & UI Overlay**
   - **Floating Hover Badge (Pill Badge)**: Mengarahkan kursor ke agen memunculkan badge hitam dengan dot merah berkedip (`animate-ping`) dan judul peran spesifik.
   - **Agent Focus & Sidebar**: Mengklik agen menggerakkan fokus kamera dan membuka sidebar kanan berisikan profil, model LLM, task execution log, dan form brief tugas.
   - **📞 Call Agent (Voice Call Session)**: Tombol panggilan dua arah dengan visualizer gelombang suara animasi (*dynamic waveform*), transkrip dialog suara, dan kontrol mute / hang up.
   - **Workflow Kanban Bar**: Baris horizontal 4 kolom di bagian bawah (`SCHEDULED`, `ON HOLD`, `IN PROGRESS`, `DONE`) yang otomatis diperbarui secara real-time saat tugas dieksekusi.

---

## 📁 Struktur Direktori

```text
virtual-office-ai/
├── frontend/                     # React + Vite + Tailwind CSS + Three.js
│   ├── public/models/            # Folder aset 3D (.glb) opsional
│   ├── src/
│   │   ├── components/
│   │   │   ├── OfficeScene.jsx   # Scene 3D Three.js & claymorphic workstations
│   │   │   ├── AgentAvatar.jsx   # Karakter chibi 3D & hover pill badge
│   │   │   ├── Sidebar.jsx       # Profil agen, task brief log, tombol Call
│   │   │   ├── KanbanBar.jsx     # Horizontal task status bar 4 kolom
│   │   │   └── CallModal.jsx     # Sesi panggilan suara interaktif & visualizer
│   │   ├── App.jsx               # Main container & state synchronization
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── backend/                      # Python FastAPI + CrewAI
│   ├── crew/
│   │   ├── __init__.py
│   │   ├── agents.py             # Definisi agen CrewAI (Nara, Velocia, Scout)
│   │   └── tasks.py              # Runner tugas & response synthesis
│   ├── server.py                 # FastAPI backend server & CORS wrapper
│   ├── requirements.txt
│   └── .env                      # Konfigurasi OpenAI API Key & port
├── package.json                  # Root runner dengan concurrently
├── .gitignore
└── README.md
```

---

## 🚀 Cara Menjalankan Proyek

### 1. Menjalankan Sekaligus (Frontend + Backend)
Dari folder root `virtual-office-ai`, jalankan:
```bash
npm run dev
```
*(Di Windows PowerShell jika script policy aktif, gunakan `npm.cmd run dev`)*

Perintah ini akan menjalankan:
- **Backend FastAPI**: `http://localhost:8000` (Swagger docs di `http://localhost:8000/docs`)
- **Frontend Vite**: `http://localhost:5173`

### 2. Menjalankan Terpisah (Opsional)

**Backend:**
```bash
python -m uvicorn server:app --reload --port 8000 --app-dir backend
```

**Frontend:**
```bash
npm run dev --prefix frontend
```

---

## 🔑 Konfigurasi LLM / CrewAI (`backend/.env`)

File `backend/.env` telah disediakan. Jika Anda memiliki OpenAI API Key:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL_NAME=gpt-4o-mini
```
*Catatan: Jika API key belum diisi, backend secara otomatis beralih ke mode **Simulated Agent Mode** dengan karakter cerdas dan respons realistis sehingga aplikasi tetap berfungsi 100% tanpa error!*

---

## 🎮 Kontrol & Navigasi 3D

- **Klik Kiri + Geser**: Memutar sudut pandang kamera (Orbit rotation).
- **Klik Kanan + Geser**: Menggeser posisi ruang kantor (Pan).
- **Scroll Mouse**: Zoom in & Zoom out.
- **Hover ke Karakter**: Menampilkan pill badge hitam dan dot merah berkedip.
- **Klik Karakter**: Memfokuskan kamera ke agen dan membuka sidebar interaktif di kanan.
- **Tombol Reset Kamera**: Tombol rotasi di header atas untuk mengembalikan posisi isometrik awal.
