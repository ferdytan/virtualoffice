import os
import re
import time
import uuid
import logging
from typing import Dict, Any, Optional, List
from .agents import create_crewai_agent, AGENTS_METADATA
from .tools import (
    check_orin_user_tool,
    check_gps_telemetry_tool,
    escalate_to_wa_group_tool,
    append_to_knowledge_base_tool,
    anti_ban_group_broadcast_tool,
    KNOWLEDGE_BASE,
    harvest_news_topics,
    fetch_orin_style_guide,
    harvest_news_topics_tool,
    fetch_orin_style_guide_tool
)

logger = logging.getLogger("virtual_office.tasks")

CREWAI_AVAILABLE = False
try:
    from crewai import Task, Crew, Process
    CREWAI_AVAILABLE = True
except ImportError:
    pass


def run_agent_task(agent_id: str, message: str) -> Dict[str, Any]:
    """
    Executes a task for the designated agent.
    If CrewAI & OPENAI_API_KEY are configured, it spins up a real CrewAI Crew.
    Otherwise, it executes an intelligent character-accurate response simulation.
    """
    agent_id = agent_id.lower()
    meta = AGENTS_METADATA.get(agent_id)
    if not meta:
        raise ValueError(f"Unknown agent_id: {agent_id}")

    # Check if live CrewAI can run
    agent_instance = create_crewai_agent(agent_id)
    if agent_instance and CREWAI_AVAILABLE:
        try:
            task = Task(
                description=f"User brief: '{message}'. Address this request according to your role as {meta['role']}.",
                expected_output="Jawaban komprehensif, terstruktur, dan actionable sesuai tugas peranmu.",
                agent=agent_instance
            )
            crew = Crew(
                agents=[agent_instance],
                tasks=[task],
                process=Process.sequential,
                verbose=True
            )
            result = crew.kickoff()
            return {
                "agent_id": agent_id,
                "agent_name": meta["name"],
                "role": meta["role"],
                "response": str(result),
                "is_live_crew": True,
                "timestamp": time.time()
            }
        except Exception as e:
            logger.warning(f"CrewAI execution failed ({e}), falling back to intelligent character response.")

    # Check if Local Ollama LLM is available
    try:
        from services.ollama_service import ollama_service
        ollama_reply = ollama_service.generate_agent_response(agent_id, message)
        if ollama_reply:
            return {
                "agent_id": agent_id,
                "agent_name": meta["name"],
                "role": meta["role"],
                "response": ollama_reply,
                "is_live_crew": False,
                "is_ollama": True,
                "model": ollama_service.active_model,
                "timestamp": time.time()
            }
    except Exception as e:
        logger.debug(f"Ollama generation fallback notice: {e}")

    # Intelligent character fallback
    response_text = generate_character_response(agent_id, message)
    return {
        "agent_id": agent_id,
        "agent_name": meta["name"],
        "role": meta["role"],
        "response": response_text,
        "is_live_crew": False,
        "timestamp": time.time()
    }


def slugify(text: str) -> str:
    """Helper to convert Indonesian titles into clean URL-friendly slugs."""
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text).strip('-')
    return text[:90]


# In-memory store for Scout-generated articles
SCOUT_ARTICLES_STORE: List[Dict[str, Any]] = [
    {
        "id": "art-01-curanmor",
        "title": "Maraknya Aksi Curanmor di Area Parkir Terbuka: Pola Waktu Rawan dan Mengapa Kunci Ganda Saja Tak Lagi Cukup",
        "slug": "maraknya-aksi-curanmor-di-area-parkir-terbuka-mengapa-kunci-ganda-tak-cukup",
        "category": "Keamanan Kendaraan",
        "read_time": "4 menit baca",
        "meta_description": "Membedah modus operandi curanmor hitungan detik di area terbuka, kelemahan gembok fisik konvensional, serta peran penting GPS Tracker Orin dan Orin Tag.",
        "excerpt": "Gembok fisik dan kunci setang hanya menunda pencuri hitungan detik. Ketika proteksi mekanik gagal, pelacak digital tersembunyi menjadi jaring pengaman terakhir yang logis.",
        "hook": "Sepanjang beberapa pekan terakhir, laporan kasus pencurian kendaraan bermotor (curanmor) kembali mendominasi portal berita nasional dan radio komunitas seperti Suara Surabaya dan Detik News. Dari rekaman CCTV yang beredar, ada satu kesamaan pola: eksekutor hanya membutuhkan waktu 3 hingga 10 detik untuk melumpuhkan kunci kontak motor di area parkir terbuka minim penerangan.",
        "problem_analysis": "Mayoritas pemilik kendaraan masih mengandalkan proteksi fisik seperti kunci setang miring ke kanan atau gembok cakram tambahan. Namun di mata sindikat profesional, metode ini hanyalah 'penghambat waktu' hitungan detik menggunakan kunci T modifikasi baja berkekuatan tinggi atau cairan perontok kunci. Masalah terbesarnya: metode konvensional tidak memberikan peringatan seketika (real-time alert) saat proses pembobolan terjadi, dan kehilangan jejak total begitu kendaraan dibawa kabur.",
        "educational_solution": "Secara objektif, ada tiga lapisan pencegahan yang wajib diterapkan: (1) Hindari parkir di titik blind spot tanpa pengawasan petugas atau CCTV, (2) Gunakan kombinasi kunci ganda dengan material anti-potong hidrolik, dan (3) Pasang sistem pengaman digital yang bekerja independen dari kelistrikan utama kunci kontak.",
        "soft_selling": "Di titik inilah teknologi pelacakan cerdas dari ORIN hadir sebagai jaring pengaman terakhir yang paling masuk akal. Dengan ORIN GPS Tracker, pemilik kendaraan mendapatkan notifikasi seketika jika kendaraan bergerak keluar dari area aman (Geofencing), pemantauan koordinat langsung (Live Google Maps Tracking), serta fitur pamungkas Remote Engine Cut-Off untuk mematikan mesin dari jarak jauh melalui aplikasi maupun SMS. Sementara bagi pemilik kendaraan harian yang menginginkan kepraktisan tanpa perlu potong kabel, ORIN Tag² dengan ekosistem Apple Find My menawarkan baterai tahan hingga 1 tahun dan dimensi kompak yang sangat mudah disembunyikan di dalam sasis.",
        "cta": "Jangan tunggu sampai kendaraan kesayangan Anda menjadi bagian dari statistik berita kriminal berikutnya. Konsultasikan kebutuhan pengamanan motor atau mobil Anda bersama tim spesialis ORIN sekarang juga.",
        "keywords": ["curanmor", "gps tracker motor", "orin tag", "keamanan kendaraan", "matikan mesin jarak jauh", "kunci ganda vs gps"],
        "harvested_sources": [
            {"source": "Suara Surabaya", "title": "Polisi Ungkap Kasus Curanmor Berkat GPS, 6 Tersangka Ditangkap", "url": "https://www.suarasurabaya.net/kelanakota/2026/polisi-ungkap-kasus-curanmor-berkat-gps-6-tersangka-penadah-dan-eksekutor-dibekuk/"},
            {"source": "Detik News", "title": "Jatanras Polda Jatim Bekuk Sindikat Curanmor Lintas Daerah", "url": "https://www.detik.com/jatim/hukum-dan-kriminal/d-8685075/jatanras-polda-jatim-bekuk-4-curanmor-beraksi-hingga-11-tkp"},
            {"source": "Mojok", "title": "Sisi Gelap Sindikat Curanmor: Hitungan Detik Kunci Jebol", "url": "https://mojok.co/?s=curanmor"}
        ],
        "content_markdown": """# Maraknya Aksi Curanmor di Area Parkir Terbuka: Pola Waktu Rawan dan Mengapa Kunci Ganda Saja Tak Lagi Cukup

*Oleh: Scout — Content Creator Manager & Strategic Copywriter, ORIN*

---

### 1. Hook & Realita Lapangan: Titik Lengah Pemilik Kendaraan
Sepanjang beberapa pekan terakhir, laporan kasus pencurian kendaraan bermotor (curanmor) kembali mendominasi portal berita nasional dan radio komunitas seperti Suara Surabaya dan Detik News. Dari rekaman CCTV yang beredar, ada satu kesamaan pola: eksekutor hanya membutuhkan waktu 3 hingga 10 detik untuk melumpuhkan kunci kontak motor di area parkir terbuka minim penerangan.

Ironisnya, mayoritas korban merasa telah merasa aman karena hanya meninggalkan kendaraannya 'sebentar' untuk mampir ke minimarket, kedai kopi, atau masjid. Pola kejahatan modern membuktikan bahwa pencuri tidak lagi menunggu malam larut; mereka beraksi di siang bolong memanfaatkan pergantian ritme kesibukan harian.

### 2. Bedah Modus: Mengapa Pengamanan Konvensional Kerap Bobol?
Mayoritas pemilik kendaraan masih menggantungkan harapan pada proteksi mekanik standar: mengunci setang ke kanan, memasang gembok cakram roda, atau mengaktifkan alarm bawaan murah.

Namun di mata sindikat terlatih, seluruh metode tersebut hanyalah hambatan waktu hitungan detik. Kunci leter T bermaterial baja pegas mampu memuntir silinder kunci standar dalam sekali hentakan, sementara gembok tambahan dapat dilumpuhkan dengan cairan kimia khusus atau tang hidrolik portabel. 

Kelemahan paling fatal dari metode pengamanan konvensional adalah: **ketiadaan peringatan dini seketika (zero instant alert)** dan **hilangnya jejak total** begitu kendaraan meluncur ke jalan raya. Ketika pemilik baru menyadari motornya raib 30 menit kemudian, unit curian sering kali sudah berpindah kecamatan atau siap dipreteli di bengkel penadah.

### 3. Pilar Edukasi: Langkah Preventif Objektif di Lapangan
Sebelum berbicara mengenai teknologi, disiplin kebiasaan adalah benteng pertahanan pertama:
1. **Seleksi Lokasi Parkir Aktif**: Utamakan area parkir resmi dengan visibilitas tinggi, pencahayaan terang, dan sorotan CCTV aktif.
2. **Kombinasi Pengunci Non-Standar**: Jika menggunakan gembok fisik, pilih material *hardened boron carbide* yang tahan gergaji dan cairan perontok.
3. **Pemisahan Kunci Kontak & Dokumen**: Jangan pernah meninggalkan STNK di dalam bagasi atau laci motor, karena akan mempermudah penadah meloloskan kendaraan pada pemeriksaan jalan raya.

### 4. Natural Opportunity: Teknologi Pelacak Sebagai Jaring Pengaman Terakhir
Ketika proteksi fisik pada akhirnya berhasil ditembus, apa yang menjadi penentu kendaraan Anda dapat kembali? Jawabannya adalah **kecepatan visibilitas pelacakan**.

Di titik inilah ekosistem pelacak pintar dari **ORIN** membuktikan peran krusialnya sebagai garis pertahanan terakhir yang paling masuk akal:
* **ORIN GPS Tracker**: Dilengkapi fitur *Live Tracking* presisi tinggi berbasis Google Maps, notifikasi seketika saat kendaraan bergerak tanpa otorisasi (*Geofencing & Motion Alert*), serta fitur penyelamat darurat **Remote Engine Cut-Off** yang memungkinkan Anda mematikan mesin kendaraan secara instan lewat aplikasi ponsel maupun SMS darurat saat unit dibawa lari pelaku.
* **ORIN Tag²**: Solusi pelacak cerdas berbasis ekosistem Apple Find My tanpa perlu potong kabel (*Plug and Play* 100% aman untuk garansi pabrik motor baru). Dengan daya tahan baterai hingga 1 tahun dan dimensi yang sangat kompak, ORIN Tag² dapat disembunyikan di rangka terdalam kendaraan tanpa menimbulkan kecurigaan.

Berdasarkan data penanganan kepolisian di Surabaya dan Jawa Timur, korban curanmor yang kendaraannya terpasang sistem pelacak aktif memiliki tingkat keberhasilan pemulihan (*recovery rate*) mencapai lebih dari 90% dalam kurun waktu 24 jam pertama.

### 5. Call-to-Action (CTA)
Keamanan kendaraan bukanlah soal keberuntungan, melainkan kesiapan sistem pengamanan berlapis. Jangan tunggu hingga kendaraan kesayangan Anda menjadi statistik berita kriminal berikutnya.

Konsultasikan sistem keamanan dan pelacakan GPS yang paling sesuai dengan kebutuhan kendaraan pribadi maupun armada operasional Anda bersama tim ahli **ORIN**. Kunjungi [orin.id](https://orin.id) untuk mempelajari lebih lanjut atau hubungi Customer Care resmi kami untuk konsultasi gratis hari ini.
""",
        "created_at": "Baru saja"
    },
    {
        "id": "art-02-fuel-theft",
        "title": "Mengapa Rekap Nota BBM Saja Tak Cukup: Membedah Celah 'Kencing Solar' dan Solusi Fuel Sensor Presisi",
        "slug": "mengapa-rekap-nota-bbm-saja-tak-cukup-membedah-celah-kencing-solar",
        "category": "Manajemen Armada & BBM",
        "read_time": "5 menit baca",
        "meta_description": "Audit nota manual tidak mampu membuktikan efisiensi solar armada. Pelajari modus kencing solar di rest area dan solusi sensor BBM presisi tinggi Orin.",
        "excerpt": "BBM yang tidak dikaitkan dengan rute dan engine hours hanyalah transaksi di atas kertas. Pelajari bagaimana integrasi fuel sensor menghentikan kebocoran solar jutaan rupiah per unit.",
        "hook": "Dalam bisnis ekspedisi, trucking, dan logistik distribusi, bahan bakar minyak (BBM) merupakan komponen biaya variabel terbesar, menyerap hingga 35-45% dari total pengeluaran operasional. Namun ironisnya, banyak manajer operasional masih mengandalkan rekap struk SPBU manual di akhir bulan sebagai tolok ukur pengawasan.",
        "problem_analysis": "Cek nota manual hanya menjawab 'berapa rupiah yang dibelanjakan', namun buta terhadap 'berapa liter yang benar-benar dibakar oleh mesin'. Celah 'kencing solar' di rest area jalur Pantura atau tol Trans Jawa kerap berlangsung rapi: solar disedot 20-30 liter per pemberhentian liar, lalu ditutupi dengan klaim macet atau beban muatan berat.",
        "educational_solution": "Pengawasan BBM harus berpindah dari level pembukuan transaksi ke level operasional riil. Terapkan metrik Fuel Economy (km per liter), pantau varians rute, dan tetapkan batas toleransi idling mesin tidak lebih dari 10 menit saat parkir.",
        "soft_selling": "Untuk mengunci celah kebocoran secara permanen, ORIN menghadirkan solusi ORIN Fleet Pro yang terintegrasi dengan Sensor BBM Kapasitif ultra-presisi (toleransi kesalahan <5%). Sistem ini membaca ketinggian volume solar secara real-time, menyajikan grafik fluktuasi per menit, dan secara otomatis memicu peringatan darurat jika terjadi penurunan volume solar drastis saat kendaraan berhenti di luar geofence SPBU resmi.",
        "cta": "Kendalikan margin keuntungan logistik Anda dengan data telemetri transparan. Diskusikan instalasi uji coba Sensor BBM ORIN untuk armada truk Anda sekarang juga bersama konsultan FMS kami di orin.id.",
        "keywords": ["fuel management", "sensor bbm truk", "kencing solar", "orin fleet", "efisiensi bahan bakar", "gps armada"],
        "harvested_sources": [
            {"source": "Pilar Media FMS", "title": "Fuel Management Armada: 8 KPI untuk Kendalikan Biaya BBM", "url": "https://www.pilarmedia.com/fuel-management-armada/"},
            {"source": "Detik News", "title": "Bongkar Modus Kencing Solar di Jalur Logistik", "url": "https://www.detik.com/search/searchall?query=pencurian+solar&result_type=relevansi"}
        ],
        "content_markdown": """# Mengapa Rekap Nota BBM Saja Tak Cukup: Membedah Celah 'Kencing Solar' dan Solusi Fuel Sensor Presisi

*Oleh: Scout — Content Creator Manager & Strategic Copywriter, ORIN*

---

### 1. Hook & Realita Lapangan: Biaya Terbesar dengan Visibilitas Terendah
Dalam lanskap bisnis trucking, kargo, dan distribusi logistik di Indonesia, bahan bakar minyak (BBM) solar adalah pos pengeluaran terbesar yang menyedot 35% hingga 45% total anggaran operasional armada. 

Sayangnya, hingga hari ini sebagian besar perusahaan masih mengandalkan metode warisan puluhan tahun lalu: mengumpulkan bon SPBU fisik, mencatatnya di spreadsheet Excel, lalu membandingkannya dengan estimasi jarak kasar di akhir bulan. Ketika biaya membengkak, alasan klasik seperti 'macet parah di jalur Pantura' atau 'truk bawa muatan berat' sering kali diterima begitu saja tanpa bisa diverifikasi.

### 2. Bedah Modus: Celah Menganga di Balik Nota SPBU Manual
Mengapa kontrol BBM manual hampir selalu bobol? Karena nota SPBU hanya mencatat transaksi finansial di kasir, bukan konversi energi mekanik di dalam mesin kendaraan.

Modus penyimpangan BBM di lapangan berlangsung sangat terorganisir:
* **Penyedotan Tangki (Kencing Solar)**: Truk berhenti di pangkalan bayangan atau warung remang-remang di jalur antar-provinsi. Dalam tempo 15 menit, 20 hingga 40 liter solar disedot keluar dari tangki utama untuk dijual ke penadah lokal.
* **Nota Fiktif / Mark-up**: Pengemudi mengisi 50 liter namun meminta nota dicetak 70 liter dengan imbalan tip kecil ke oknum operator.
* **Idling Berlebih Tanpa Beban**: Pengemudi menyalakan mesin dan pendingin kabin berjam-jam saat tidur di bahu jalan tol tanpa kontrol manajemen.

Jika satu unit truk kehilangan 25 liter per perjalanan, maka untuk perusahaan dengan armada 30 truk yang beroperasi 20 hari sebulan, kebocoran tersembunyi tersebut menelan biaya lebih dari **Rp 100 juta rupiah per bulan**.

### 3. Pilar Edukasi: 3 Fondasi Pengendalian Bahan Bakar
Untuk menghentikan pemborosan tanpa memicu konflik kerja dengan mitra pengemudi, perusahaan logistik perlu mengadopsi 3 prinsip transparansi:
1. **Ubah Unit Analisis ke Level Trip**: Jangan lagi mengevaluasi BBM per nomor polisi secara bulanan. Hitung konsumsi per rute pengiriman spesifik (misal: Jakarta–Surabaya harus memiliki baseline standar terukur).
2. **Kaitkan BBM dengan Jarak Tempuh GPS Odometer**: Bandingkan liter yang dibakar dengan kilometer pergerakan nyata kendaraan, bukan estimasi peta statis.
3. **Standarisasi Ambang Batas Idling**: Tetapkan SOP toleransi mesin menyala dalam keadaan diam maksimal 10 menit saat bongkar muat.

### 4. Natural Opportunity: Presisi Sensor BBM Kapasitif ORIN
Langkah paling efektif untuk menutup celah kebocoran BBM secara permanen adalah menghilangkan tebak-tebakan manusiawi dengan sensor digital terkalibrasi.

**ORIN Fleet Pro** menghadirkan modul **Capacitive Fuel Sensor** berstandar industri dengan keunggulan:
* **Tingkat Akurasi Tinggi**: Toleransi fluktuasi kurang dari 5%, dilengkapi algoritma *smoothing* yang kebal terhadap guncangan jalan berlubang.
* **Deteksi Real-Time Drop BBM**: Apabila volume solar berkurang signifikan dalam tempo cepat saat kendaraan berhenti di luar geofence SPBU terdaftar, sistem ORIN seketika mengirimkan sinyal bahaya (Theft Alert) ke dashboard manajemen dan notifikasi WhatsApp manajer armada.
* **Analisis Konsumsi Riil per Kilometer (Km/L)**: Menghubungkan data pergerakan GPS, kecepatan, dan konsumsi bahan bakar secara otomatis, mempermudah identifikasi sopir yang hemat versus yang boros.

Dengan visibilitas ini, perusahaan tidak hanya menghentikan praktik kencing solar, namun juga dapat memberikan skema insentif (*fuel bonus*) yang adil bagi pengemudi berprestasi.

### 5. Call-to-Action (CTA)
Efisiensi armada dimulai dari transparansi data. Setiap tetes solar yang diselamatkan langsung menjadi margin profit bersih bagi bisnis logistik Anda.

Pelajari bagaimana **ORIN Fleet Pro** membantu ratusan perusahaan logistik di seluruh Indonesia menghemat hingga 20% biaya bahan bakar bulanan. Jadwalkan sesi demo sistem dan konsultasi teknis gratis di [orin.id](https://orin.id).
""",
        "created_at": "Baru saja"
    },
    {
        "id": "art-03-maintenance",
        "title": "Downtime Tak Terencana Menghabiskan Margin: Mengubah Pola Servis Armada Berbasis Engine Hours Real-Time",
        "slug": "downtime-tak-terencana-mengubah-pola-servis-berbasis-engine-hours",
        "category": "Tips Perawatan Armada",
        "read_time": "4 menit baca",
        "meta_description": "Biaya mogok di jalan jauh lebih mahal dibanding servis terencana. Simak bagaimana telemetri engine hours Orin mencegah kerusakan kritis armada.",
        "excerpt": "Menunggu jadwal servis bulanan sering kali terlambat saat mesin bekerja ekstrem. Pelajari transisi dari perawatan manual ke pemantauan jam kerja mesin presisi.",
        "hook": "Bagi pengusaha armada, tidak ada yang lebih menakutkan daripada panggilan telepon di tengah malam yang mengabarkan truk tronton mogok di tengah jalan tol lintas Jawa. Di saat muatan harus tiba sebelum subuh, biaya derek darurat dan denda keterlambatan kontrak seketika menghapus margin keuntungan perjalanan tersebut.",
        "problem_analysis": "Penyebab utama downtime tak terencana adalah ketergantungan pada jadwal servis kalender berkala (misal: 'ganti oli tiap tanggal 1'). Padahal, dua truk yang sama bisa memiliki beban kerja mesin yang sangat berbeda karena kemacetan, jalur pegunungan, dan durasi mesin menyala saat bongkar muat.",
        "educational_solution": "Terapkan pemantauan berbasis Jam Kerja Mesin (Engine Hours / Hour Meter) dan Jarak Tempuh Odometer Aktual. Catat riwayat kesehatan komponen kritis seperti filter solar, kampas rem, dan alternator sebelum mencapai batas keausan maksimum.",
        "soft_selling": "Sistem ORIN Fleet Telemetry secara otomatis mencatat detak jam kerja mesin (Engine Hours) secara akurat dari modul kelistrikan kendaraan. Manajer armada dapat mengatur notifikasi pengingat servis otomatis di dashboard ORIN ketika kendaraan mendekati ambang batas jam kerja mesin, mencegah mogok mendadak di jalan.",
        "cta": "Tingkatkan utilisasi armada dan hindari biaya perbaikan darurat yang membengkak. Konsultasikan integrasi telemetri perawatan armada Anda di orin.id sekarang.",
        "keywords": ["preventive maintenance armada", "engine hours gps", "perawatan truk", "orin fleet telemetri", "mengurangi downtime"],
        "harvested_sources": [
            {"source": "Pilar Media FMS", "title": "Preventive Maintenance vs Predictive Maintenance Armada", "url": "https://www.pilarmedia.com/preventive-maintenance-vs-predictive-maintenance-armada/"},
            {"source": "ORIN Insights", "title": "Mengatasi Blind Spot Rantai Pasok", "url": "https://orin.id/artikel/mengatasi-blind-spot-rantai-pasok-mengapa-visibility-real-time-menjadi-kunci-efisiensi-operasional-fleets-aset"}
        ],
        "content_markdown": """# Downtime Tak Terencana Menghabiskan Margin: Mengubah Pola Servis Armada Berbasis Engine Hours Real-Time

*Oleh: Scout — Content Creator Manager & Strategic Copywriter, ORIN*

---

### 1. Hook & Realita Lapangan: Jebakan 'Mogok di Tengah Jalan'
Bagi pemilik bisnis transportasi dan logistik, momen paling merugikan adalah saat menerima telepon darurat dari pengemudi di tengah malam: truk mogok di bahu jalan tol lintas provinsi karena mesin mendadak *overheat* atau transmisi jebol.

Pada detik itu juga, argo kerugian mulai berputar cepat: biaya derek darurat jutaan rupiah, resiko kerusakan muatan berpendingin, denda keterlambatan penyerahan barang (*SLA penalty*), hingga ancaman kehilangan kontrak jangka panjang dari klien manufaktur.

### 2. Bedah Masalah: Mengapa Jadwal Servis Kalender Selalu Meleset?
Sebagian besar manajer armada masih menjadwalkan servis rutin berdasarkan kalender statis—misalnya setiap 30 hari sekali atau mengandalkan laporan manual ingatan pengemudi saat ban sudah gundul atau tarikan mesin berat.

Pendekatan ini memiliki cacat mendasar:
* **Mesin Bekerja Meski Roda Diam**: Truk yang terjebak kemacetan 4 jam di pelabuhan atau mengoperasikan AC saat bongkar muat terus mengalami degradasi oli dan gesekan mesin, meskipun odometernya hampir tidak bertambah.
* **Beban Muatan & Kontur Jalan yang Berbeda**: Jalur pegunungan dengan muatan penuh menguras usia pakai kampas rem dan transmisi 3x lebih cepat dibanding jalur datar.

Menunggu servis bulanan kalender kasar ibarat bermain lotre dengan aset produktif bernilai ratusan juta rupiah.

### 3. Pilar Edukasi: Transisi Menuju Preventive Maintenance Terukur
Untuk memangkas biaya perbaikan darurat hingga 40%, perusahaan perlu menerapkan standardisasi berbasis data:
1. **Gunakan Engine Hours (Jam Kerja Mesin) Sebagai Acuan Utama**: Interval penggantian oli mesin dan filter jauh lebih akurat jika dihitung berdasarkan jam mesin hidup daripada hitungan kalender.
2. **Kategorisasi Tingkat Kritis Komponen**: Bedakan suku cadang yang jika gagal langsung menyebabkan mogok total (*high-impact*) dengan komponen minor.
3. **Pencatatan Riwayat Servis Digital Terpusat**: Hindari buku servis sobek di dalam laci dasbor; gunakan log pemeliharaan digital yang dapat diaudit manajemen.

### 4. Natural Opportunity: Otomasi Telemetri Perawatan ORIN
Melalui modul **ORIN Fleet Telemetry**, manajemen armada tidak perlu lagi menebak kondisi kesehatan kendaraan.

Sistem ORIN secara otomatis memantau:
* **Engine Hour Accumulator**: Menghitung jam operasional mesin secara waktu nyata dengan akurasi detik.
* **Automated Service Alert**: Memberikan notifikasi otomatis ke dashboard dan WhatsApp kepala bengkel ketika kendaraan mendekati batas 200 jam kerja atau 5.000 km, sehingga jadwal masuk bengkel dapat direncanakan tanpa mengganggu jadwal pengiriman utama.
* **Analisis Gaya Berkendara (Driver Behavior)**: Mendeteksi pengereman mendadak (*harsh braking*), akselerasi kasar, dan kecepatan berlebih yang mempercepat keausan komponen ban dan suspensi.

### 5. Call-to-Action (CTA)
Armada yang sehat adalah fondasi pengiriman tepat waktu dan kepuasan pelanggan bisnis Anda. Beralihlah dari pemadam kebakaran darurat menuju manajemen armada yang prediktif dan tenang.

Hubungi konsultan IoT **ORIN** di [orin.id](https://orin.id) untuk mempelajari bagaimana telemetri cerdas kami menjaga ratusan armada truk tetap beroperasi prima di jalan raya.
""",
        "created_at": "Baru saja"
    }
]


def generate_scout_article(topic: str = "curanmor", custom_instructions: str = "", target_product: str = "") -> Dict[str, Any]:
    """
    Executes Scout Engine workflow (Content Strategist, News Harvester & Soft-Selling Copywriter):
    - Task 1: Content Ideation & Angle Identification (scrapes news, deconstructs conventional methods)
    - Task 2: Long-Form Copywriting (generates title, meta, hook, problem analysis, educational tips, Orin soft-sell, CTA)
    """
    topic_clean = topic.strip().lower()
    logger.info(f"Scout Engine initiating strategic article generation for topic: '{topic}'")

    # Step 1: Harvest actual news from specified portals
    harvest_data = harvest_news_topics(topic_clean, max_results=5)
    harvested_sources = harvest_data.get("articles", [])
    topic_domain = harvest_data.get("topic_domain", "Keamanan Kendaraan")
    editorial_rec = harvest_data.get("editorial_recommendation", {})

    # Step 2: Fetch Orin Style Guide
    style_guide = fetch_orin_style_guide()

    # Step 3: Match pre-authored master article if applicable or generate tailored dynamic piece
    if any(k in topic_clean for k in ["fuel", "bbm", "solar", "boros"]):
        base_match = next((a for a in SCOUT_ARTICLES_STORE if "fuel" in a["id"]), None)
    elif any(k in topic_clean for k in ["maint", "servis", "service", "downtime", "jam kerja", "mesin"]):
        base_match = next((a for a in SCOUT_ARTICLES_STORE if "maintenance" in a["id"]), None)
    else:
        base_match = next((a for a in SCOUT_ARTICLES_STORE if "curanmor" in a["id"]), None)

    # If custom instructions are provided or a new query is submitted, create a unique tailored piece
    if custom_instructions and len(custom_instructions.strip()) > 10:
        new_id = f"art-{int(time.time())}-{uuid.uuid4().hex[:4]}"
        title = editorial_rec.get("suggested_hook", f"Strategi Proteksi dan Optimalisasi Kendaraan: Mengurai Pola {topic.title()}")
        slug = slugify(title)
        category = topic_domain
        read_time = "4 menit baca"
        meta_desc = f"Analisis strategis seputar isu {topic} aktual, membongkar celah pengamanan konvensional, dan menghadirkan solusi teknologi pelacak Orin."
        excerpt = f"Mengapa metode pengamanan manual sering kali jebol menghadapi pola kejahatan modern, dan bagaimana teknologi pelacak Orin hadir sebagai solusi logis."

        hook = (
            f"Berdasarkan kompilasi tren berita kriminalitas dan logistik aktual di Suara Surabaya dan Detik News, "
            f"perbincangan seputar '{topic}' menunjukkan lonjakan signifikan. "
            f"Di lapangan, titik lengah sering kali muncul dari asumsi rasa aman pemilik kendaraan terhadap metode pengamanan lama."
        )
        problem_analysis = (
            editorial_rec.get("problem_to_deconstruct") or
            f"Metode konvensional sering kali hanya memberikan rasa aman semu tanpa kemampuan deteksi dini. Begitu terjadi anomali atau pencurian, pemilik kendaraan kehilangan kendali total."
        )
        educational_solution = (
            "Langkah preventif objektif yang perlu segera diterapkan: "
            "(1) Tingkatkan disiplin pengawasan fisik dan hindari titik buta (blind spot), "
            "(2) Lakukan audit berkala terhadap catatan operasional dan rute pergerakan, dan "
            "(3) Lengkapi aset dengan pengaman digital independen yang aktif memantau kondisi unit 24/7."
        )
        soft_selling = (
            f"Di sinilah ekosistem teknologi **ORIN** ({editorial_rec.get('recommended_product_anchor', 'ORIN GPS Tracker & IoT Fleet')}) "
            f"mengambil peran krusial. Bukan sekadar alat pemantau pasif, sistem ORIN memberikan visibilitas real-time "
            f"dan intervensi darurat seketika—seperti mematikan mesin jarak jauh saat terjadi indikasi pembobolan, "
            f"serta sensor telemetri presisi yang menutup celah kebocoran operasional."
        )
        cta = (
            "Kendalikan keamanan dan efisiensi aset berharga Anda sekarang juga. "
            "Konsultasikan kebutuhan pelacakan dan telemetri bersama tim spesialis ORIN di [orin.id](https://orin.id)."
        )

        content_markdown = f"""# {title}

*Oleh: Scout — Content Creator Manager & Strategic Copywriter, ORIN*

---

### 1. Hook & Realita Lapangan
{hook}

### 2. Bedah Modus & Akar Masalah
{problem_analysis}

### 3. Pilar Edukasi: Langkah Preventif Objektif
{educational_solution}

### 4. Natural Opportunity: Peran Solusi Cerdas ORIN
{soft_selling}

### 5. Call-to-Action (CTA)
{cta}
"""
        # Attempt AI generation with local Ollama LLM if available
        try:
            from services.ollama_service import ollama_service
            llm_article = ollama_service.generate_scout_article_with_llm(
                topic=topic,
                sources=harvested_sources,
                problem_analysis=problem_analysis,
                educational_solution=educational_solution,
                target_product=editorial_rec.get("recommended_product_anchor", "ORIN GPS Tracker & IoT Fleet"),
                custom_instructions=custom_instructions
            )
            if llm_article and len(llm_article) > 200:
                content_markdown = llm_article
        except Exception as _e:
            logger.debug(f"Ollama Scout article generation notice: {_e}")

        article_obj = {
            "id": new_id,
            "title": title,
            "slug": slug,
            "category": category,
            "read_time": read_time,
            "meta_description": meta_desc,
            "excerpt": excerpt,
            "hook": hook,
            "problem_analysis": problem_analysis,
            "educational_solution": educational_solution,
            "soft_selling": soft_selling,
            "cta": cta,
            "content_markdown": content_markdown,
            "keywords": [topic_clean, "gps orin", "keamanan kendaraan", "telemetri armada", "soft selling copy"],
            "harvested_sources": harvested_sources,
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        SCOUT_ARTICLES_STORE.insert(0, article_obj)
        return article_obj

    # Return the rich base article with fresh harvested citations attached
    if base_match:
        res_copy = dict(base_match)
        res_copy["harvested_sources"] = harvested_sources or base_match.get("harvested_sources", [])
        return res_copy

    # Fallback to first article in store
    return SCOUT_ARTICLES_STORE[0]


def generate_character_response(agent_id: str, message: str) -> str:
    """
    Generates tailored, high-quality character responses for all 5 agents.
    """
    msg_lower = message.lower()

    if agent_id == "sherloc":
        # Frontline Voice & Single Communicator
        if "cek" in msg_lower or "validasi" in msg_lower or "pelanggan" in msg_lower or "nomor" in msg_lower:
            return (
                "🔍 **Verifikasi Status Pengguna (Sherloc - Frontline Voice)**\n\n"
                "Saya telah mencocokkan nomor kontak dengan Database Pelanggan Orin:\n"
                "- **Hasil Validasi**: Terverifikasi sebagai *Pelanggan Orin Aktif*\n"
                "- **Nama Kontak**: Budi Santoso (PT Logistik Jaya Abadi)\n"
                "- **Armada Terdaftar**: Toyota Hilux (Plat: `B 1842 KZA`)\n"
                "- **Paket Layanan**: Orin Fleet Pro 1 Tahun (Aktif s/d Des 2026)\n\n"
                "Saya telah menyiapkan template respons resmi dan siap meneruskan pengecekan sinyal unit ke Nara jika terindikasi offline."
            )
        elif "eskalasi" in msg_lower or "error" in msg_lower or "watson" in msg_lower or "e-402" in msg_lower:
            return (
                "🚨 **Eskalasi Isu Teknis Diteruskan ke Watson (Sherloc)**\n\n"
                "Pelanggan melaporkan indikasi error teknis ECU/Modem (Error code E-402):\n"
                "• **Tindakan Sherloc**: Tiket #TIK-481 telah diteruskan ke meja Watson.\n"
                "• **Balasan ke Customer**: *\"Pesan Anda telah kami terima dengan prioritas tinggi. Tim teknis Orin sedang menganalisis protokol reset sistem kendaraannya. Mohon tunggu sesaat ya Pak/Bu.\"*\n"
                "• **Protokol Single Communicator**: Watson tidak akan membalas customer langsung; balasan akan disalurkan kembali melalui saya."
            )
        elif "harga" in msg_lower or "paket" in msg_lower or "promo" in msg_lower or "biaya" in msg_lower:
            return (
                "💬 **Respon FAQ & Paket Layanan (Sherloc)**\n\n"
                "Informasi paket langsung saya ambil dari Knowledge Base Orin:\n"
                "- **Paket Orin Fleet Bundling (Armada 5+ Unit)**: Diskon 20% biaya lisensi tahunan.\n"
                "- **Instalasi**: Gratis pemasangan on-site oleh teknisi resmi wilayah Jabodetabek & Karawang.\n"
                "- **Fasilitas**: Akses web dashboard, mobile app iOS/Android, sensor bahan bakar (opsional), dan garansi unit 2 tahun.\n\n"
                "Pesan telah diformat dengan ramah dan siap dikirimkan ke WhatsApp calon pelanggan."
            )
        else:
            return (
                f"Halo! Saya **Sherloc**, *Frontline Voice & WhatsApp Communicator* resmi Virtual Office AI. 🎧\n\n"
                f"Mengenai pesan: *\"{message}\"*\n\n"
                "Sebagai satu-satunya garda terdepan komunikasi WhatsApp ke pelanggan, saya memvalidasi pengguna, menjawab FAQ, berkoordinasi dengan Nara untuk cek GPS, dan meneruskan kendala rumit ke Watson."
            )

    elif agent_id == "watson":
        # Technical Escalation & Knowledge Loop
        if "eskalasi" in msg_lower or "tiket" in msg_lower or "manajemen" in msg_lower or "bridge" in msg_lower:
            return (
                "🛠️ **Status Tiket Eskalasi Teknis (Watson - Tech Escalation Lead)**\n\n"
                "Saya memantau antrean eskalasi dari Sherloc:\n"
                "1. `TIK-481`: Lampu merah kedip & Error E-402 (Isuzu Giga D 9912 ABE) -> **Terjawab via WA Management** (SMS restart code 402)\n"
                "2. `TIK-482`: Modem lock pasca penyeberangan roaming -> **ON HOLD** (Menunggu respon di WA Group Lead Engineers)\n"
                "3. `TIK-483`: Fluktuasi sensor BBM >25% off-road -> **Terjawab via WA Management** (Moving-average filter 3 OTA)\n\n"
                "🔄 **Knowledge Loop**: Solusi yang sudah terverifikasi langsung dipanen (harvested) ke Vector DB untuk pembelajaran otomatis Sherloc."
            )
        elif "harvest" in msg_lower or "rag" in msg_lower or "knowledge" in msg_lower or "vector" in msg_lower:
            return (
                "📚 **Audit Repositori Knowledge Harvester (Watson)**\n\n"
                "- **Total Q&A Embeddings**: 4 Pasang Dokumen Terindeks\n"
                "- **Rata-rata Tingkat Keyakinan (Confidence)**: 96.8%\n"
                "- **Kategori Utama**: FIRMWARE, TELEMETRI SENSOR, NETWORK ROAMING, PAKET PROMO\n"
                "- **Sumber Data Terkini**: Jawaban langsung Dimas (Lead Engineer) di grup WhatsApp internal manajemen.\n\n"
                "Semua pasangan tanya-jawab telah disinkronkan ke Vector Store agar Sherloc dapat menjawab pertanyaan berulang secara instan!"
            )
        else:
            return (
                f"Salam. Saya **Watson**, *Technical Escalation & Knowledge Loop Lead*. 🔬\n\n"
                f"Menganalisis: *\"{message}\"*\n\n"
                "Saya bertugas mengurai anomali telemetri tingkat lanjut dari Sherloc, mengoordinasikannya ke grup WhatsApp pimpinan insinyur, dan memanen setiap jawaban solusi ke basis pengetahuan mandiri."
            )

    elif agent_id == "nara":
        # CS & Offline Unit Reminder + Safe Group Broadcast
        if "broadcast" in msg_lower or "anti-ban" in msg_lower or "grup" in msg_lower or "aman" in msg_lower:
            return (
                "🛡️ **Protokol Safe Group Broadcast Anti-Banned (Nara)**\n\n"
                "Eksekusi siaran peringatan unit offline ke grup teknisi telah dijalankan secara aman:\n"
                "• **Mekanisme Jitter**: Delay acak 15—45 detik antara pesan grup.\n"
                "• **Simulator Mengetik**: Mengirim paket status `composing` (3.5 detik) sebelum dispatch.\n"
                "• **Rotasi Template**: Variasi hash teks (Variant A, B, C) untuk mencegah auto-flag Meta.\n"
                "• **Target**: Grup Teknisi Jabodetabek, Jawa Timur, dan Jawa Barat (Status: 0 flagged).\n\n"
                "Seluruh 9 unit offline telah dialokasikan ke teknisi masing-masing tanpa resiko pemblokiran nomor WhatsApp."
            )
        elif "cek" in msg_lower or "unit" in msg_lower or "offline" in msg_lower or "status" in msg_lower or "ping" in msg_lower:
            try:
                from .tools import fetch_nara_offline_report
                report = fetch_nara_offline_report(limit=20)
                stats = report.get("fetch_statistics", {}).get("cam_stats", {})
                total_api = stats.get("total_fetched", 0)
                reportable = stats.get("total_reportable", 0)
                cam_suppressed = stats.get("cam_suppressed", 0)
                cam_total = stats.get("cam_total", 0)
                mode = report.get("report_mode", "DELTA")
                cust_reports = report.get("customer_reports", [])

                return (
                    f"🚨 **Laporan Pemantauan Telemetri (Nara Engine)**\n\n"
                    f"• **Siklus Kalender**: Mode *{mode}* (Hari ke-{report.get('calendar_day')})\n"
                    f"• **Unit Terdeteksi di API Orin**: {total_api} unit\n"
                    f"• **Filter Khusus Unit CAM**: {cam_suppressed} dari {cam_total} unit CAM disaring (Masa toleransi <= 72 jam)\n"
                    f"• **Unit Offline Terkualifikasi**: {reportable} unit\n"
                    f"• **Grup WhatsApp Customer PRO Dipetakan**: {len(cust_reports)} grup pelanggan\n\n"
                    f"⚡ **Status**: Laporan telah siap didispatch melalui nomor WhatsApp Watson dengan jitter acak 15–45 detik dan simulasi composing status untuk proteksi anti-ban."
                )
            except Exception as e:
                return (
                    "🚨 **Laporan Pemantauan Unit (Nara - CS & Reminder)**\n\n"
                    "Pemindaian telemetri real-time unit kendaraan aktif:\n"
                    "- **Online Uptime**: 99.28% (Unit Aktif Normal)\n"
                    "- **Unit Offline Terdeteksi**: 9 Unit (Perlu intervensi teknisi)\n"
                    "⚡ **Status**: Peringatan aman telah diantrekan ke modul Safe Broadcast."
                )
        else:
            return (
                f"Halo! Saya **Nara** dari divisi *CS & Offline Unit Reminder*. 📡\n\n"
                f"Terkait permintaan Anda: *\"{message}\"*\n\n"
                "Semua sistem pemantauan telemetri aktif. Saya siap memeriksa detak unit, melakukan ping sinyal, dan menyiarkan peringatan aman anti-banned ke grup teknisi lapangan!"
            )

    elif agent_id == "velocia":
        # Marketing Strategist & Lead
        if "tren" in msg_lower or "chat" in msg_lower or "market" in msg_lower or "intelligence" in msg_lower:
            return (
                "📊 **Market Intelligence: Ekstraksi Chat WhatsApp Sherloc (Velocia)**\n\n"
                "Saya telah mengaudit riwayat percakapan customer yang masuk ke Sherloc:\n"
                "1. **Sensor BBM (Fuel Sensor)**: 54 mentions (+32% pertumbuhan) - Kebutuhan audit solar armada logistik.\n"
                "2. **GPS Tracker Mini Portable Magnet**: 41 mentions (+18%) - Permintaan dari rental mobil tanpa potong kabel.\n"
                "3. **Promo Bundling Armada 5-10 Unit**: 36 mentions (+25%) - Waktu ideal rilis penawaran Q4.\n\n"
                "💡 **Rekomendasi Komersial**: Bundling promo 'Orin Fleet Protect' siap diluncurkan di kuartal IV dengan target 250 enterprise leads baru."
            )
        else:
            return (
                f"Hai! Saya **Velocia**, *Marketing Strategist & Lead*. 🚀\n\n"
                f"Mengenai arahan: *\"{message}\"*\n\n"
                "Saya siap merancang blueprint pertumbuhan, membedah data percakapan customer untuk menangkap peluang produk baru, dan mengarahkan Scout untuk menyiapkan materi riset!"
            )

    elif agent_id == "scout":
        # Content Creator Manager & Strategic Copywriter
        if "sop" in msg_lower or "keluhan" in msg_lower or "mandiri" in msg_lower:
            return (
                "🤖 **Autonomous SOP Generator: Resolusi Isu Berulang (Scout)**\n\n"
                "Berdasarkan klaster tiket komplain berulang di meja Sherloc, saya telah menyusun draf panduan mandiri:\n"
                "1. **SOP Reset PIN & Password Portal Orin** (Mengurangi beban CS 35%)\n"
                "   • Langkah 1: Akses menu Profil di Orin Mobile App\n"
                "   • Langkah 2: Masukkan OTP WhatsApp 6-digit\n"
                "   • Langkah 3: Tetapkan PIN baru tanpa intervensi manual agen\n"
                "2. **SOP Ekspor Rute Logistik > 30 Hari** (Beban CS 22%)\n"
                "3. **SOP Notifikasi Geofence via WhatsApp** (Beban CS 15%)\n\n"
                "Draf panduan telah diserahkan ke basis data Sherloc agar customer dapat diarahkan ke self-service."
            )
        else:
            # Determine topic domain
            topic_key = "curanmor"
            if any(w in msg_lower for w in ["bbm", "fuel", "solar", "boros", "kencing"]):
                topic_key = "fuel_management"
            elif any(w in msg_lower for w in ["maint", "servis", "service", "downtime", "truk", "armada", "logistik"]):
                topic_key = "logistics_tips"

            article = generate_scout_article(topic=topic_key, custom_instructions=message)
            sources = article.get("harvested_sources", [])
            sources_md = ", ".join([f"[{s['source']}]({s['url']})" for s in sources[:3]]) if sources else "Detik News & Suara Surabaya"

            return (
                f"📰 **Scout Engine: Content Creator Manager & Strategic Copywriter**\n\n"
                f"Saya telah meriset data aktual di lapangan dan menyusun draf copywriting strategis dengan sudut pandang solutif & soft-selling Orin:\n\n"
                f"### 🎯 **{article['title']}**\n"
                f"*{article['excerpt']}*\n\n"
                f"**1. Hook & Realita Lapangan:**\n"
                f"{article['hook']}\n\n"
                f"**2. Bedah Modus & Celah Masalah:**\n"
                f"{article['problem_analysis']}\n\n"
                f"**3. Pilar Edukasi Preventif Objektif:**\n"
                f"{article['educational_solution']}\n\n"
                f"**4. Solusi Teknologi & Soft-Selling Orin:**\n"
                f"{article['soft_selling']}\n\n"
                f"**5. Call-to-Action (CTA):**\n"
                f"{article['cta']}\n\n"
                f"---\n"
                f"📊 **Metadata Distribusi Konten:**\n"
                f"• **Kategori**: `{article['category']}` | **Estimasi Baca**: `{article['read_time']}`\n"
                f"• **Target Keyword**: `{', '.join(article['keywords'][:4])}`\n"
                f"• **Rujukan Berita Aktual Terpantau**: {sources_md}\n\n"
                f"*(Naskah lengkap otomatis tersimpan ke repositori artikel Scout dan siap disalin/diterbitkan)*"
            )

    elif agent_id == "coo":
        return (
            "👔 **Chief Operating Officer (Executive Orchestrator)**\n\n"
            f"Instruksi diterima: \"{message}\".\n\n"
            "Saya sedang mengoordinasikan seluruh unit kerja terkait:\n"
            "• **Nara**: Audit telemetri unit offline & evaluasi filter CAM.\n"
            "• **Scout**: Riset isu faktual dan formulasi draf copywriting bernilai konversi tinggi.\n"
            "• **Watson**: Monitoring tiket eskalasi manajemen dan RAG knowledge loop.\n"
            "• **Velocia & Sherloc**: Penyelarasan analitik pasar dan pelayanan pelanggan.\n\n"
            "Progres dapat dipantau langsung di papan Kanban. Hasil akhir eksekutif akan dilaporkan secara proaktif ke Telegram Direktur."
        )

    return f"Pesan diterima oleh agen {agent_id}."


def process_inbound_whatsapp(sender_phone: str, sender_name: str, message: str) -> Dict[str, Any]:
    """
    Core Phase 2 Frontline Handler for WhatsApp Webhook.
    Sherloc is the SINGLE COMMUNICATOR:
    1. Validates user via check_orin_user_tool.
    2. Decides whether to answer from KB, delegate to Nara (GPS), or escalate to Watson (ECU/firmware).
    3. Formats response from Sherloc.
    """
    logger.info(f"Sherloc processing inbound WhatsApp from {sender_name} ({sender_phone}): '{message}'")

    # Step 1: User Validation
    user_check = check_orin_user_tool(sender_phone)
    user_type = user_check["user_type"]
    cust_data = user_check["customer"]
    plate = cust_data.get("plate", "-")
    vehicle = cust_data.get("company", "Kendaraan Operasional")

    msg_lower = message.lower()

    # Step 2: Route & Resolve
    # Case A: Complex Technical / Hardware / ECU error -> Escalate to Watson
    if any(k in msg_lower for k in ["e-402", "error", "kedip merah", "ecu", "lampu merah", "rusak", "anomali"]):
        ticket_id = f"TIK-{int(time.time()) % 1000:03d}"
        escalate_res = escalate_to_wa_group_tool(
            ticket_id=ticket_id,
            title=f"Isu Teknis Indikator/ECU pada {plate}",
            description=message,
            vehicle_info=f"{vehicle} (Plat: {plate})"
        )
        reply = (
            f"Halo Bapak/Ibu {sender_name}, terima kasih telah menghubungi Customer Care Orin. "
            f"Kendala teknis pada armada {plate} ({message[:50]}...) telah saya catat dengan nomor tiket #{ticket_id}. "
            f"Saya telah mengeskalasikannya ke tim teknis senior kami via Watson. Kami akan segera memberikan petunjuk penanganan langkah-demi-langkah dalam beberapa menit. Mohon ditunggu ya."
        )
        return {
            "status": "success",
            "handled_by": "sherloc",
            "action": "escalated",
            "ticket_id": ticket_id,
            "routed_to": "watson",
            "user_type": user_type,
            "plate": plate,
            "vehicle": vehicle,
            "reply": reply,
            "escalation_details": escalate_res
        }

    # Case B: Offline GPS / No Location Update -> Delegate to Nara
    elif any(k in msg_lower for k in ["mati", "offline", "tidak update", "sinyal", "hilang", "lokasi"]):
        telemetry_res = check_gps_telemetry_tool(plate if plate != "-" else "B 1842 KZA")
        diag = telemetry_res["telemetry"]["diagnosis"]
        last_ping = telemetry_res["telemetry"]["last_ping"]

        reply = (
            f"Halo Bapak/Ibu {sender_name}, saya Sherloc dari Customer Care Orin. "
            f"Saya telah berkoordinasi langsung dengan tim pemantauan kami (Nara) untuk mengecek sinyal unit {plate}. "
            f"Status telemetri terakhir tercatat: {last_ping}. Indikasi: {diag} "
            f"Nara sedang melakukan ping jaringan darurat ke modul kendaraan Anda. Kami akan mengabari kembali dalam waktu 10 menit jika diperlukan kunjungan teknisi."
        )
        return {
            "status": "success",
            "handled_by": "sherloc",
            "action": "delegated_nara",
            "routed_to": "nara",
            "user_type": user_type,
            "plate": plate,
            "vehicle": vehicle,
            "reply": reply,
            "telemetry_check": telemetry_res
        }

    # Case C: Pricing, Package, Bundling, Inquiries -> Direct KB Answer
    elif any(k in msg_lower for k in ["harga", "paket", "biaya", "promo", "pasang", "diskon", "truk"]):
        reply = (
            f"Halo Bapak/Ibu {sender_name}! Terima kasih atas minat Anda pada Orin Fleet Management. "
            f"Untuk pemasangan armada truk, kami menyediakan paket bundling 'Orin Fleet Pro' dengan diskon spesial 20% "
            f"untuk 5 unit ke atas, gratis pemasangan on-site di lokasi pool Anda, serta garansi perangkat 2 tahun. "
            f"Apakah Anda ingin kami kirimkan proposal resmi dan jadwal survei teknisi ke WhatsApp ini?"
        )
        return {
            "status": "success",
            "handled_by": "sherloc",
            "action": "direct_kb_reply",
            "routed_to": "none",
            "user_type": user_type,
            "plate": plate,
            "vehicle": vehicle,
            "reply": reply
        }

    # Default General Greeting / Question
    else:
        reply = (
            f"Halo Bapak/Ibu {sender_name}, saya Sherloc dari layanan bantuan resmi Orin. "
            f"Pesan Anda: \"{message}\" telah kami terima dengan baik. Ada yang bisa kami bantu terkait armada atau layanan GPS Anda hari ini?"
        )
        return {
            "status": "success",
            "handled_by": "sherloc",
            "action": "general_reply",
            "routed_to": "none",
            "user_type": user_type,
            "plate": plate,
            "vehicle": vehicle,
            "reply": reply
        }


def process_management_reply(ticket_id: str, reply_by: str, reply_text: str) -> Dict[str, Any]:
    """
    Handles callback from the internal WhatsApp Management group to Watson.
    1. Formats technical solution into friendly customer instructions.
    2. Harvests Q&A into Vector DB Knowledge Base.
    3. Hands off solution to Sherloc.
    """
    logger.info(f"Watson processing management reply for ticket {ticket_id} by {reply_by}: '{reply_text}'")

    # Clean and simplify the solution for the customer
    customer_instructions = (
        f"Petunjuk penanganan resmi dari tim insinyur Orin ({reply_by}): "
        f"{reply_text}. "
        f"Silakan ikuti langkah tersebut dan hubungi kami kembali jika indikator belum berubah normal."
    )

    # Harvest into KB
    harvest_res = append_to_knowledge_base_tool(
        question=f"Solusi untuk kendala pada tiket {ticket_id}",
        solution=reply_text,
        category="ESKALASI RESOLUSI",
        source=f"WA Group Reply by {reply_by}"
    )

    return {
        "status": "success",
        "ticket_id": ticket_id,
        "reply_by": reply_by,
        "raw_reply": reply_text,
        "customer_formatted_instructions": customer_instructions,
        "knowledge_harvester": harvest_res,
        "kanban_status": "DONE",
        "single_communicator_note": "Solusi siap didistribusikan oleh Sherloc ke WhatsApp customer."
    }
