/* ==========================================================================
   ARCHEMY MAIN ENGINE - CLOSED-LOOP ADAPTIVE LEARNING SPA
   Versi baru: semua siklus tertutup (diagnosis → personalisasi → pembelajaran
   → evaluasi → analitik guru) tersambung.
   ========================================================================== */

import { renderPilihMisi, renderHalamanAR, renderHook, hentikanSesiAR } from './webar-page.js';
import { MISI_DATA } from './webar.js';

/* --------------------------------------------------------------------------
   ICON LIBRARY
   -------------------------------------------------------------------------- */
const ICONS = {
  bell: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22a2.7 2.7 0 0 0 2.65-2.15h-5.3A2.7 2.7 0 0 0 12 22Zm7-6.4-1.45-1.95V9.2A5.56 5.56 0 0 0 13 3.75V2h-2v1.75A5.56 5.56 0 0 0 6.45 9.2v4.45L5 15.6V18h14v-2.4Z"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.7-4.2 5-6 8-6s6.3 1.8 8 6"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V21h13V10.5"/><path d="M9.3 21v-6h5.4v6"/></svg>`,
  checklist: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3.8" width="16" height="16.4" rx="2"/><path d="m8 8 1.5 1.5L12 7"/><path d="M14 8.5h2.5"/><path d="m8 14 1.5 1.5L12 13"/><path d="M14 14.5h2.5"/></svg>`,
  ar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/><circle cx="12" cy="12" r="3"/><path d="M12 9V6m0 12v-3m3-3h3m-12 0h3"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z"/><path d="M4 19.5A3.5 3.5 0 0 1 7.5 16H20"/></svg>`,
  file: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h8.2L20 7.8V22H6V2Zm8 1.7V8h4.3L14 3.7Z"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 4.8A2.8 2.8 0 0 1 7.8 2h8.4A2.8 2.8 0 0 1 19 4.8v14.4a2.8 2.8 0 0 1-2.8 2.8H7.8A2.8 2.8 0 0 1 5 19.2V4.8Zm5 4v6.4l5.4-3.2L10 8.8Z"/></svg>`,
  link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10 13.5a4 4 0 0 0 5.6.4l2.3-2.3a4 4 0 1 0-5.7-5.7l-1.3 1.3"/><path d="M14 10.5a4 4 0 0 0-5.6-.4l-2.3 2.3a4 4 0 0 0 5.7 5.7l1.3-1.3"/></svg>`,
  people: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="8" r="3"/><path d="M3 19c1.1-3.2 3.4-5 6-5s4.9 1.8 6 5"/><circle cx="17" cy="9" r="2.3"/><path d="M15.5 14.7c2.4.2 4.2 1.7 5.2 4.3"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"/><path d="m14 8 2 2"/></svg>`,
  logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10 4H5v16h5"/><path d="M14 8l4 4-4 4"/><path d="M8 12h10"/></svg>`,
  brain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.7A3.5 3.5 0 0 0 8.5 18H9V4Z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.7A3.5 3.5 0 0 1 15.5 18H15V4Z"/><path d="M9 8c-1.4 0-2.5.8-3 2M15 8c1.4 0 2.5.8 3 2M9 14c-1.2.2-2 .9-2.5 2M15 14c1.2.2 2 .9 2.5 2"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.1 6.6.9-4.8 4.7 1.1 6.6L12 17.3l-5.8 3 1.1-6.6L2.5 9l6.6-.9z"/></svg>`,
  gem: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 2h11l4.5 6-10 14L2 8zm.5 2L4 8h4.5l2-4zm5 0 2 4H14l-1.5-4zm6.5 2h-2.5l-2-4H16zM5.5 10l4.5 9.5L5 10zm6.5 9.5L16.5 10H8zm5-9.5h-4.5l4.5 9.5z"/></svg>`,
  trophy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 21h8M12 17v4"/><path d="M5 3H3v5a4 4 0 0 0 4 4h1"/><path d="M19 3h2v5a4 4 0 0 1-4 4h-1"/><rect x="6" y="3" width="12" height="11" rx="1"/></svg>`,
  map: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3 7 6-3 6 3 6-3v13l-6 3-6-3-6 3V7z"/><path d="M9 4v13M15 7v13"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18"/><path d="m7 11 4-4 4 4 4-4"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6 9 17l-5-5"/></svg>`,
};

/* --------------------------------------------------------------------------
   QUIZ BANK dengan Bloom Level per soal
   -------------------------------------------------------------------------- */
const quizBank = [
  { id:'qs1', topic:'Konsep Dasar Kesetimbangan', bloomLevel: 1, bloomLabel: 'C1 - Mengingat',
    tier1:{ question:'Suatu reaksi dikatakan berada dalam keadaan setimbang apabila...',
      options:['Reaksi telah berhenti sepenuhnya dan tidak ada perubahan','Laju reaksi maju sama dengan laju reaksi balik','Semua reaktan telah habis bereaksi membentuk produk','Konsentrasi reaktan selalu lebih besar dari konsentrasi produk'], answer:1 },
    tier3:{ question:'Alasan ilmiah yang mendukung jawaban Anda adalah...',
      options:['Pada keadaan setimbang, laju pembentukan produk sama dengan laju penguraian produk kembali menjadi reaktan, sehingga konsentrasi tampak tetap','Kesetimbangan tercapai karena semua molekul berhenti bergerak','Kesetimbangan hanya terjadi jika suhu dan tekanan sistem adalah nol','Pada kesetimbangan, energi kinetik semua partikel menjadi sama besar'], answer:0 }
  },
  { id:'qs2', topic:'Kesetimbangan Dinamis', bloomLevel: 2, bloomLabel: 'C2 - Memahami',
    tier1:{ question:'Pada kesetimbangan dinamis, pernyataan yang paling tepat adalah...',
      options:['Reaksi maju dan balik sudah berhenti sama sekali','Konsentrasi reaktan dan produk terus berubah secara drastis','Reaksi maju dan balik tetap berlangsung dengan laju yang sama sehingga komposisi campuran tetap','Hanya reaksi ke arah produk yang masih berlangsung'], answer:2 },
    tier3:{ question:'Dasar ilmiah yang menjelaskan kesetimbangan dinamis adalah...',
      options:['On a molecular level, collisions between particles still occur and forward-reverse reactions proceed simultaneously, but the net change in concentration is zero','Molekul berhenti bergerak begitu sistem mencapai kesetimbangan','Energi kinetik rata-rata semua molekul menjadi nol pada keadaan setimbang','Kesetimbangan dinamis hanya dapat terjadi pada tekanan sangat tinggi'], answer:0 }
  },
  { id:'qs3', topic:'Pengaruh Konsentrasi', bloomLevel: 3, bloomLabel: 'C3 - Mengaplikasikan',
    tier1:{ question:'Pada reaksi: N₂(g) + 3H₂(g) ⇌ 2NH₃(g), jika konsentrasi N₂ ditambah, kesetimbangan akan...',
      options:['Bergeser ke kiri (arah reaktan)','Bergeser ke kanan (arah produk)','Tidak mengalami pergeseran','Reaksi langsung berhenti'], answer:1 },
    tier3:{ question:'Alasan ilmiah dari pergeseran kesetimbangan tersebut adalah...',
      options:['Sesuai Asas Le Chatelier, penambahan konsentrasi reaktan mendorong sistem bergeser ke arah produk untuk mengurangi gangguan','Penambahan N₂ menurunkan energi aktivasi reaksi maju saja','Gas N₂ yang ditambahkan langsung terurai menjadi atom nitrogen bebas','Konsentrasi reaktan tidak pernah mempengaruhi posisi kesetimbangan'], answer:0 }
  },
  { id:'qs4', topic:'Pengaruh Tekanan dan Volume', bloomLevel: 3, bloomLabel: 'C3 - Mengaplikasikan',
    tier1:{ question:'Pada reaksi: 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), jika tekanan dinaikkan, kesetimbangan akan...',
      options:['Bergeser ke kiri karena mol gas reaktan lebih sedikit','Bergeser ke kanan karena mol gas produk lebih sedikit','Tidak berubah karena tekanan tidak mempengaruhi kesetimbangan gas','Bergeser ke kiri karena SO₃ lebih berat dari SO₂'], answer:1 },
    tier3:{ question:'Prinsip yang mendasari pengaruh tekanan ini adalah...',
      options:['Peningkatan tekanan menggeser sistem ke sisi dengan jumlah mol gas lebih sedikit (3 mol → 2 mol) sesuai Asas Le Chatelier','Tekanan tinggi selalu menguntungkan produk pada semua reaksi','Tekanan hanya mempengaruhi reaksi fase cair','Peningkatan tekanan selalu menghentikan reaksi kesetimbangan'], answer:0 }
  },
  { id:'qs5', topic:'Pengaruh Suhu', bloomLevel: 3, bloomLabel: 'C3 - Mengaplikasikan',
    tier1:{ question:'Reaksi: N₂O₄(g) ⇌ 2NO₂(g), ΔH = +57 kJ/mol. Jika suhu dinaikkan, kesetimbangan akan...',
      options:['Bergeser ke kiri sehingga N₂O₄ bertambah','Bergeser ke kanan sehingga NO₂ bertambah','Tidak mengalami pergeseran','Reaksi berubah menjadi ireversibel'], answer:1 },
    tier3:{ question:'Dasar ilmiah pengaruh suhu pada kesetimbangan ini adalah...',
      options:['Kenaikan suhu menyediakan kalor yang dimanfaatkan reaksi endoterm (ke kanan) untuk menyerap kelebihan kalor sesuai Asas Le Chatelier','Suhu tinggi selalu mempercepat semua reaksi ke arah produk','Perubahan suhu hanya mempengaruhi laju reaksi, tidak mengubah tetapan kesetimbangan','Kenaikan suhu menurunkan energi aktivasi reaksi balik saja'], answer:0 }
  },
  { id:'qs6', topic:'Peran Katalis', bloomLevel: 2, bloomLabel: 'C2 - Memahami',
    tier1:{ question:'Penambahan katalis pada sistem kesetimbangan akan...',
      options:['Menggeser kesetimbangan ke arah produk','Menggeser kesetimbangan ke arah reaktan','Mempercepat tercapainya kesetimbangan tanpa mengubah posisi kesetimbangan','Menghentikan reaksi balik sepenuhnya'], answer:2 },
    tier3:{ question:'Alasan katalis tidak mengubah posisi kesetimbangan adalah...',
      options:['Katalis menurunkan energi aktivasi reaksi maju dan balik secara proporsional sama, sehingga perbandingan laju tidak berubah','Katalis hanya mempengaruhi warna larutan','Katalis menambah jumlah mol produk melalui reaksi samping','Katalis menyerap seluruh energi kinetik molekul gas'], answer:0 }
  },
  { id:'qs7', topic:'Tetapan Kesetimbangan Kc', bloomLevel: 4, bloomLabel: 'C4 - Menganalisis',
    tier1:{ question:'Untuk reaksi: 2A(g) + B(g) ⇌ 3C(g), ekspresi Kc yang benar adalah...',
      options:['Kc = [A]²[B] / [C]³','Kc = [C]³ / ([A]²[B])','Kc = [C] / ([A][B])','Kc = ([A] + [B]) / [C]'], answer:1 },
    tier3:{ question:'Prinsip penulisan ekspresi Kc tersebut didasarkan pada...',
      options:['Kc merupakan perbandingan konsentrasi produk berpangkat koefisien dibagi konsentrasi reaktan berpangkat koefisien','Nilai Kc selalu sama dengan 1','Koefisien reaksi tidak mempengaruhi ekspresi Kc','Kc dihitung dari penjumlahan konsentrasi semua zat'], answer:0 }
  },
  { id:'qs8', topic:'Hubungan Kp dan Kc', bloomLevel: 4, bloomLabel: 'C4 - Menganalisis',
    tier1:{ question:'Hubungan antara Kp and Kc dinyatakan oleh rumus...',
      options:['Kp = Kc × (RT)^Δn','Kp = Kc / (RT)','Kp = Kc + RT','Kp = Kc × R'], answer:0 },
    tier3:{ question:'Makna Δn dalam hubungan Kp = Kc(RT)^Δn adalah...',
      options:['Selisih jumlah koefisien mol gas produk dikurangi koefisien mol gas reaktan','Jumlah total mol semua zat','Jumlah mol reaktan saja','Δn selalu bernilai positif untuk setiap reaksi'], answer:0 }
  },
  { id:'qs9', topic:'Kesetimbangan Heterogen', bloomLevel: 4, bloomLabel: 'C4 - Menganalisis',
    tier1:{ question:'Pada reaksi: CaCO₃(s) ⇌ CaO(s) + CO₂(g), ekspresi Kc yang benar adalah...',
      options:['Kc = [CaO][CO₂] / [CaCO₃]','Kc = [CO₂]','Kc = 1 / [CO₂]','Kc = [CaCO₃] / ([CaO][CO₂])'], answer:1 },
    tier3:{ question:'Alasan ilmiah zat padat tidak dimasukkan ke ekspresi Kc adalah...',
      options:['Konsentrasi zat padat murni bersifat konstan dan sudah termasuk dalam nilai Kc','Zat padat tidak ikut bereaksi','Zat padat selalu habis bereaksi','Zat padat tidak memiliki massa molar'], answer:0 }
  },
  { id:'qs10', topic:'Aplikasi Industri (Proses Haber)', bloomLevel: 5, bloomLabel: 'C5 - Mengevaluasi',
    tier1:{ question:'Dalam proses Haber: N₂(g) + 3H₂(g) ⇌ 2NH₃(g), ΔH = −92 kJ/mol. Kondisi yang menguntungkan pembentukan NH₃ adalah...',
      options:['Suhu tinggi dan tekanan rendah','Suhu rendah dan tekanan tinggi','Suhu tinggi dan tekanan tinggi','Suhu rendah dan tekanan rendah'], answer:1 },
    tier3:{ question:'Namun dalam praktik industri digunakan suhu sedang (~450°C) karena...',
      options:['Suhu rendah menguntungkan kesetimbangan namun laju reaksi sangat lambat; suhu sedang dengan katalis besi dipilih sebagai kompromi','Suhu rendah merusak peralatan pabrik','Suhu tinggi diperlukan agar katalis tidak teroksidasi','Pada suhu rendah gas nitrogen membeku'], answer:0 }
  }
];

/* --------------------------------------------------------------------------
   ADAPTIVE TOPIC → MODULE → MISI MAPPING
   -------------------------------------------------------------------------- */
const TOPIC_MAP = {
  'Konsep Dasar Kesetimbangan':       { moduleId: 'm1', misiId: null,    reason: 'Pelajari pengantar kesetimbangan kimia terlebih dahulu.' },
  'Kesetimbangan Dinamis':            { moduleId: 'm2', misiId: 'misi1', reason: 'Visualisasikan kesetimbangan dinamis di Lab AR.' },
  'Pengaruh Konsentrasi':             { moduleId: 'm6', misiId: 'misi3', reason: 'Misi ini akan memperlihatkan bagaimana konsentrasi mempengaruhi reaksi.' },
  'Pengaruh Tekanan dan Volume':      { moduleId: 'm7', misiId: 'misi2', reason: 'Misi Operasi Smog akan menunjukkan pergeseran karena tekanan.' },
  'Pengaruh Suhu':                    { moduleId: 'm6', misiId: 'misi1', reason: 'Misi Gas Iodin akan memperlihatkan efek perubahan suhu secara visual.' },
  'Peran Katalis':                    { moduleId: 'm7', misiId: null,    reason: 'Baca modul Mekanika Tekanan-Volume & Peran Katalisator.' },
  'Tetapan Kesetimbangan Kc':         { moduleId: 'm8', misiId: null,    reason: 'Bank soal Kc/Qc akan membantu memahami ekspresi kesetimbangan.' },
  'Hubungan Kp dan Kc':               { moduleId: 'm8', misiId: null,    reason: 'Pahami hubungan Kp dan Kc melalui contoh soal.' },
  'Kesetimbangan Heterogen':          { moduleId: 'm1', misiId: null,    reason: 'Baca ulang modul pengantar mengenai zat padat dalam kesetimbangan.' },
  'Aplikasi Industri (Proses Haber)': { moduleId: 'm5', misiId: 'misi4', reason: 'Misi Industri akan mensimulasikan kondisi optimal proses Haber.' },
};

/* --------------------------------------------------------------------------
   MODUL DATA
   -------------------------------------------------------------------------- */
const defaultModules = [
  { id:'m1', type:'file', title:'Pengantar Kesetimbangan Kimia', meta:'Dokumen • 18 halaman', summary:'Materi ini menjelaskan konsep reaksi bolak-balik, keadaan setimbang, serta ciri sistem ketika laju reaksi maju dan balik sudah sama.', points:['Kesetimbangan bersifat dinamis.','Konsentrasi zat tampak tetap pada keadaan setimbang.','Sistem tertutup membantu reaksi mencapai setimbang.'], tips:['Fokus pada perbedaan reaksi satu arah dan reaksi reversibel.','Gunakan tabel ICE untuk memahami perubahan konsentrasi.'], difficulty:'Rendah', time:'10 Menit', prereq:'Reaksi Kimia Dasar' },
  { id:'m2', type:'file', title:'Kesetimbangan Kimia Dinamis', meta:'Dokumen • 22 halaman', summary:'Membahas keadaan saat reaksi tetap berlangsung dua arah, tetapi perubahan makroskopis tidak terlihat karena laju reaksi maju sama dengan laju reaksi balik.', points:['Laju maju = laju balik.','Jumlah partikel dapat tetap walaupun reaksi tetap terjadi.','Kesetimbangan hanya terjadi pada sistem tertutup.'], tips:['Bayangkan dua arah reaksi berjalan bersamaan.','Perhatikan tanda panah bolak-balik pada persamaan reaksi.'], difficulty:'Sedang', time:'12 Menit', prereq:'Konsep Reaksi Reversibel' },
  { id:'m3', type:'video', title:'Rahasia Partikel Tak Terlihat: Apa Itu Kesetimbangan Dinamis?', meta:'Video • 15 menit', summary:'Video memperlihatkan ilustrasi partikel yang terus bergerak dalam reaksi bolak-balik.', points:['Partikel tetap bergerak.','Reaksi maju dan balik terjadi bersamaan.','Perubahan terlihat stabil secara makroskopis.'], tips:['Pause pada bagian animasi partikel.','Catat contoh reaksi yang digunakan dalam video.'], difficulty:'Sedang', time:'15 Menit', prereq:'Kesetimbangan Dinamis' },
  { id:'m4', type:'file', title:'Asas Le Chatelier', meta:'Dokumen • 25 halaman', summary:'Sistem kesetimbangan akan bergeser untuk mengurangi pengaruh perubahan yang diberikan.', points:['Konsentrasi naik → bergeser menjauhi zat yang ditambah.','Tekanan naik → bergeser ke sisi mol gas lebih kecil.','Suhu naik → bergeser ke arah reaksi endoterm.','Katalis tidak menggeser kesetimbangan.'], tips:['Ingat konsep "melawan perubahan".','Bedakan pengaruh suhu, tekanan, volume, dan katalis.','Gunakan simulasi WebAR untuk melihat pergeseran.'], difficulty:'Tinggi', time:'12 Menit', prereq:'Kesetimbangan Kimia Dasar' },
  { id:'m5', type:'video', title:'Trik Asas Le Chatelier: Cara Pabrik Kimia Memaksa Reaksi Terus Berjalan', meta:'Video • 15 menit', summary:'Video menjelaskan bagaimana industri memanfaatkan Asas Le Chatelier.', points:['Tekanan dapat memengaruhi jumlah produk gas.','Suhu dipilih berdasarkan jenis reaksi.','Konsentrasi reaktan dapat diatur untuk mendorong produk.'], tips:['Hubungkan materi dengan proses Haber.','Perhatikan contoh perubahan tekanan dan suhu.'], difficulty:'Rendah', time:'17 Menit', prereq:'Asas Le Chatelier' },
  { id:'m6', type:'file', title:'Pengaruh Parameter Suhu (Termal) & Konsentrasi Le Chatelier', meta:'Dokumen • 20 halaman', summary:'Materi ini membahas cara suhu dan konsentrasi mengubah arah pergeseran kesetimbangan.', points:['Penambahan reaktan mendorong pembentukan produk.','Suhu tinggi menguntungkan arah endoterm.','Suhu rendah menguntungkan arah eksoterm.'], tips:['Tentukan dulu reaksi eksoterm atau endoterm.','Perhatikan sisi mana yang menerima penambahan zat.'], difficulty:'Tinggi', time:'16 Menit', prereq:'Asas Le Chatelier' },
  { id:'m7', type:'file', title:'Mekanika Tekanan-Volume & Peran Katalisator', meta:'Dokumen • 19 halaman', summary:'Materi membahas bagaimana perubahan tekanan dan volume mempengaruhi kesetimbangan gas serta peran katalis.', points:['Tekanan naik → ke arah mol gas lebih sedikit.','Volume naik → ke arah mol gas lebih banyak.','Katalis mempercepat, bukan menggeser.'], tips:['Hitung jumlah mol gas di tiap sisi.','Ingat katalis menurunkan Ea maju dan balik sama besar.'], difficulty:'Sedang', time:'14 Menit', prereq:'Asas Le Chatelier' },
  { id:'m8', type:'link', title:'Bank Contoh Soal Kc dan Qc', meta:'Link • Latihan soal', summary:'Kumpulan contoh soal untuk membedakan nilai Kc dan Qc.', points:['Kc menunjukkan keadaan setimbang.','Qc digunakan untuk melihat arah reaksi.','Jika Qc < Kc, reaksi bergeser ke produk.'], tips:['Tuliskan rumus Kc sesuai koefisien.','Bandingkan Qc dan Kc secara perlahan.'], difficulty:'Tinggi', time:'18 Menit', prereq:'Rumus Tetapan Kesetimbangan' }
];

const defaultClasses = [
  { id:'c1', name:'XII IPA 1', code:'KIM-137', students:36, progress:74, quiz:8,
    roster: [
      { name: 'Adi Wijaya', score: 40, status: 'Kritis', category: 'Miskonsepsi', topics: ['Pengaruh Tekanan dan Volume','Pengaruh Suhu'] },
      { name: 'Syela Cantika', score: 55, status: 'Perhatian', category: 'Menebak', topics: ['Tetapan Kesetimbangan Kc'] },
      { name: 'Fajar Mahendra', score: 88, status: 'Aman', category: 'Paham Konsep', topics: [] },
      { name: 'Rafa Pratama', score: 95, status: 'Aman', category: 'Paham Konsep', topics: [] },
      { name: 'Intan Maulida', score: 72, status: 'Aman', category: 'Paham Konsep', topics: ['Pengaruh Konsentrasi'] }
    ]
  },
  { id:'c2', name:'XII IPA 2', code:'KIM-138', students:35, progress:66, quiz:7,
    roster: [
      { name: 'Dimas Arga', score: 60, status: 'Perhatian', category: 'Menebak', topics: ['Pengaruh Suhu'] },
      { name: 'Nabila Putri', score: 92, status: 'Aman', category: 'Paham Konsep', topics: [] },
      { name: 'Budi Santoso', score: 42, status: 'Kritis', category: 'Miskonsepsi', topics: ['Pengaruh Konsentrasi','Kesetimbangan Heterogen'] }
    ]
  }
];

const defaultQuestions = quizBank.flatMap(s => [
  { id:s.id+'_t1', tier:1, type:s.topic, question:s.tier1.question, options:s.tier1.options, answer:s.tier1.answer, reason:'' },
  { id:s.id+'_t3', tier:3, type:s.topic, question:s.tier3.question, options:s.tier3.options, answer:s.tier3.answer, reason:'' }
]);

/* --------------------------------------------------------------------------
   ADAPTIVE BLOOM ROUTING
   -------------------------------------------------------------------------- */
const TOPIC_ROUTING = {
  'Konsep Dasar Kesetimbangan':       { nextOnSuccess: 'Kesetimbangan Dinamis',         nextOnFail: 'Kesetimbangan Dinamis' },
  'Kesetimbangan Dinamis':            { nextOnSuccess: 'Pengaruh Konsentrasi',          nextOnFail: 'Pengaruh Konsentrasi' },
  'Pengaruh Konsentrasi':             { nextOnSuccess: 'Pengaruh Tekanan dan Volume',   nextOnFail: 'Pengaruh Tekanan dan Volume' },
  'Pengaruh Tekanan dan Volume':      { nextOnSuccess: 'Pengaruh Suhu',                 nextOnFail: 'Pengaruh Suhu' },
  'Pengaruh Suhu':                    { nextOnSuccess: 'Peran Katalis',                 nextOnFail: 'Peran Katalis' },
  'Peran Katalis':                    { nextOnSuccess: 'Tetapan Kesetimbangan Kc',      nextOnFail: 'Tetapan Kesetimbangan Kc' },
  'Tetapan Kesetimbangan Kc':         { nextOnSuccess: 'Hubungan Kp dan Kc',            nextOnFail: 'Hubungan Kp dan Kc' },
  'Hubungan Kp dan Kc':               { nextOnSuccess: 'Kesetimbangan Heterogen',       nextOnFail: 'Kesetimbangan Heterogen' },
  'Kesetimbangan Heterogen':          { nextOnSuccess: 'Aplikasi Industri (Proses Haber)', nextOnFail: 'Aplikasi Industri (Proses Haber)' },
  'Aplikasi Industri (Proses Haber)': { nextOnSuccess: 'END', nextOnFail: 'END' }
};

/* --------------------------------------------------------------------------
   BADGE DEFINITIONS
   -------------------------------------------------------------------------- */
const BADGE_DEFS = {
  first_ar:     { emoji: '', name: 'Ilmuwan Pemula',      desc: 'Selesaikan misi WebAR pertama' },
  le_chatelier: { emoji: '️', name: 'Ahli Le Chatelier',   desc: 'Jawab benar semua soal suhu, tekanan & konsentrasi' },
  no_misconc:   { emoji: '', name: 'Bebas Miskonsepsi',   desc: 'Selesaikan kuis tanpa miskonsepsi' },
  speed_demon:  { emoji: '', name: 'Kilat',               desc: 'Selesaikan kuis dalam waktu < 5 menit' },
  perfect:      { emoji: '', name: 'Sempurna',            desc: 'Jawab semua soal dengan benar' },
  ar_explorer:  { emoji: '', name: 'Penjelajah AR',       desc: 'Selesaikan semua misi WebAR' },
};

/* --------------------------------------------------------------------------
   DEFAULT STATE
   -------------------------------------------------------------------------- */
const defaultState = {
  role:'siswa', page:'login', joinedClass:false, selectedClassIndex:0,
  activeModuleFilter:'all', activeModule:null,
  webarMisiAktif:null, webarHookMisi:null, viewedMisi:[],
  currentSetIndex:0, currentTier:1, currentBloomLevel:1, quizResults:[], selectedOption:null, confidence:null,
  quizTimeLeft:600, quizTimerActive:false, colorblind:false,
  // Gamification
  points: 0, gems: 0,
  badges: [],
  // AI adaptive recommendations (generated after quiz)
  aiRecommendations: [],
  profile: {
    siswa:{ name:'Suci Ramadhani', email:'suci@student.archemy.id', school:'SMA Negeri 5 Banda Aceh', className:'XI IPA 1', password:'123456' },
    guru:{ name:'Ibu Misnawati S.Pd', email:'misnawati@guru.archemy.id', school:'SMA Negeri 5 Banda Aceh', className:'Guru Kimia', password:'123456' }
  },
  modules: defaultModules, questions: defaultQuestions, classes: defaultClasses,
  teacherEditingQuestionId:null
};

let state = loadState();
const app = document.getElementById('app');
const toastEl = document.getElementById('toast');
let toastTimer, quizInterval = null;

/* --------------------------------------------------------------------------
   STATE MANAGEMENT
   -------------------------------------------------------------------------- */
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem('archemyState'));
    if (!saved) return structuredClone(defaultState);
    if (saved.classes && saved.classes.some(c => !c.roster)) {
      localStorage.removeItem('archemyState');
      return structuredClone(defaultState);
    }
    const merged = {
      ...structuredClone(defaultState), ...saved,
      profile:{ ...structuredClone(defaultState.profile), ...(saved.profile||{}) },
      modules: saved.modules?.length ? saved.modules : structuredClone(defaultModules),
      questions: saved.questions?.length ? saved.questions : structuredClone(defaultQuestions),
      classes: saved.classes?.length ? saved.classes : structuredClone(defaultClasses),
      badges: saved.badges || [],
      points: saved.points || 0,
      gems: saved.gems || 0,
      aiRecommendations: saved.aiRecommendations || [],
      viewedMisi: saved.viewedMisi || [],
    };
    if (merged.webarMisiAktif) {
      merged.webarMisiAktif = null;
      merged.page = 'studentDashboard';
    }
    
    // Force migration of school name for existing cached profiles
    if (merged.profile.siswa.school === 'SMA Negeri 1 Kimia' || merged.profile.siswa.school === 'SMA Negeri 1 Banda Aceh') {
      merged.profile.siswa.school = 'SMA Negeri 5 Banda Aceh';
    }
    if (merged.profile.guru.school === 'SMA Negeri 1 Kimia' || merged.profile.guru.school === 'SMA Negeri 1 Banda Aceh') {
      merged.profile.guru.school = 'SMA Negeri 5 Banda Aceh';
    }

    return merged;
  } catch { return structuredClone(defaultState); }
}
function saveState() { localStorage.setItem('archemyState', JSON.stringify(state)); }
function toast(msg) { clearTimeout(toastTimer); toastEl.textContent=msg; toastEl.classList.add('show'); toastTimer=setTimeout(()=>toastEl.classList.remove('show'),2500); }
function setRole(r) { state.role=r; saveState(); render(); }
function go(page) {
  if (state.page === 'studentWebAR' && page !== 'studentWebAR') hentikanSesiAR();
  state.page=page;
  if (!['studentQuiz', 'studentQuizPage'].includes(page)) { state.selectedOption=null; state.confidence=null; }
  saveState(); render();
  requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'instant'}));
}
function profile() { return state.profile[state.role]; }
function activeClass() { return state.classes[state.selectedClassIndex]||state.classes[0]; }
function hasBottomNav() { return !['login','register','joinClass','teacherClasses'].includes(state.page) && state.page !== 'studentWebAR'; }
function goHome() { if (state.role==='siswa') go(state.joinedClass?'studentDashboard':'joinClass'); else go('teacherClasses'); }
function previousPage() { return state.role==='siswa'?'studentDashboard':'teacherClasses'; }

/* --------------------------------------------------------------------------
   GAMIFICATION ENGINE
   -------------------------------------------------------------------------- */
function awardPoints(amount, reason='') {
  state.points = (state.points || 0) + amount;
  state.gems = (state.gems || 0) + Math.floor(amount / 5);
  saveState();
  toast(`+${amount} XP ${reason ? '- ' + reason : ''}`);
}

function awardBadge(badgeId) {
  if (!state.badges) state.badges = [];
  if (state.badges.includes(badgeId)) return;
  const bd = BADGE_DEFS[badgeId];
  if (!bd) return;
  state.badges.push(badgeId);
  saveState();
  openModal(
    `${bd.emoji} Badge Baru Diraih!`,
    `<div style="text-align:center;padding:10px 0;">
       <div style="font-size:52px;margin-bottom:8px;animation:bounceIn 0.5s ease-out;">${bd.emoji}</div>
       <h3 style="margin:0 0 4px;color:var(--purple);">${bd.name}</h3>
       <p style="font-size:12px;color:var(--muted);margin:0;">${bd.desc}</p>
     </div>`,
    `<button class="btn full" onclick="window.closeModal()">Lanjutkan </button>`
  );
}

function checkAndAwardBadges(context='quiz') {
  if (context === 'quiz') {
    const results = state.quizResults;
    if (!results.length) return;
    // Bebas miskonsepsi
    if (results.every(r => r.category !== 'Miskonsepsi')) setTimeout(() => awardBadge('no_misconc'), 800);
    // Kecepatan
    const elapsed = 600 - state.quizTimeLeft;
    if (elapsed < 300) setTimeout(() => awardBadge('speed_demon'), 1200);
    // Sempurna
    if (results.every(r => r.tier1Correct && r.tier3Correct)) setTimeout(() => awardBadge('perfect'), 1600);
    // Le Chatelier topics
    const leTopics = ['Pengaruh Suhu','Pengaruh Tekanan dan Volume','Pengaruh Konsentrasi'];
    const leResults = results.filter(r => leTopics.includes(r.topic));
    if (leResults.length === leTopics.length && leResults.every(r => r.tier1Correct && r.tier3Correct)) {
      setTimeout(() => awardBadge('le_chatelier'), 2000);
    }
  }
  if (context === 'ar') {
    if (!state.viewedMisi) state.viewedMisi = [];
    // Pertama kali AR
    if (state.viewedMisi.length === 1) setTimeout(() => awardBadge('first_ar'), 500);
    // Semua misi
    if (Object.keys(MISI_DATA).every(k => state.viewedMisi.includes(k))) {
      setTimeout(() => awardBadge('ar_explorer'), 900);
    }
  }
}

/* --------------------------------------------------------------------------
   AI RECOMMENDATIONS ENGINE (simulasi analitik berbasis hasil kuis)
   -------------------------------------------------------------------------- */
function generateAdaptiveLearningPath(results) {
  const recommendations = [];
  const seenModules = new Set();
  const seenMisi = new Set();

  results.forEach(r => {
    if (r.category === 'Miskonsepsi' || r.category === 'Tidak Paham') {
      const map = TOPIC_MAP[r.topic];
      if (map) {
        if (map.moduleId && !seenModules.has(map.moduleId)) {
          seenModules.add(map.moduleId);
          recommendations.push({ topic: r.topic, type: 'module', id: map.moduleId, reason: map.reason, priority: 'high', category: r.category });
        }
        if (map.misiId && !seenMisi.has(map.misiId)) {
          seenMisi.add(map.misiId);
          recommendations.push({ topic: r.topic, type: 'misi', id: map.misiId, reason: map.reason, priority: 'high', category: r.category });
        }
      }
    } else if (r.category === 'Menebak') {
      const map = TOPIC_MAP[r.topic];
      if (map && map.moduleId && !seenModules.has(map.moduleId)) {
        seenModules.add(map.moduleId);
        recommendations.push({ topic: r.topic, type: 'module', id: map.moduleId, reason: 'Perkuat pemahamanmu dengan membaca ulang modul ini.', priority: 'medium', category: r.category });
      }
    }
  });

  return recommendations;
}

/* --------------------------------------------------------------------------
   MODAL ENGINE
   -------------------------------------------------------------------------- */
let modalState = { isOpen: false, title: '', content: '', actions: '' };
function renderModal() {
  let root = document.getElementById('modalRoot'); if (!root) { root = document.createElement('div'); root.id = 'modalRoot'; document.body.appendChild(root); }
  if (modalState.isOpen) {
    root.innerHTML = `<div class="modal-overlay"><div class="modal"><h3 class="modal-title">${escapeHtml(modalState.title)}</h3><div class="modal-body">${modalState.content}</div><div class="modal-actions">${modalState.actions}</div></div></div>`;
    void root.offsetWidth; root.querySelector('.modal-overlay').classList.add('show');
  } else {
    const overlay = root.querySelector('.modal-overlay'); if (overlay) { overlay.classList.remove('show'); setTimeout(() => { root.innerHTML = ''; }, 300); } else { root.innerHTML = ''; }
  }
}
function openModal(title, content, actions) { modalState = { isOpen: true, title, content, actions }; renderModal(); }
function closeModal() { modalState.isOpen = false; renderModal(); }

/* --------------------------------------------------------------------------
   HEADER & NAV
   -------------------------------------------------------------------------- */
function header({back=false,titleBackPage=null,coins=true}={}) {
  const pts = state.points || 0;
  const gms = state.gems || 0;
  return `<div class="topbar">
    <button class="logo ${back?'back-logo':''}" onclick="window.${back?`go('${titleBackPage||previousPage()}')`:'goHome()'}" aria-label="ARChemy">
      ${back?'<span class="back">‹</span>':''}<b>ARC</b>hemy
    </button>
    <div class="topbar-right">
      <div class="header-actions">
        <button class="header-icon" onclick="window.toast('Belum ada notifikasi baru')" aria-label="notifikasi">${ICONS.bell}</button>
        <button class="header-icon" onclick="window.go('profile')" aria-label="profil">${ICONS.user}</button>
      </div>
      ${coins&&state.role==='siswa'?`<div class="coins"><span class="coin xp">${ICONS.star} ${pts}</span><span class="coin gem">${ICONS.gem} ${gms}</span></div>`:''}
      ${coins&&state.role==='guru'?`<div class="role-switch" title="Mode guru"></div>`:''}
    </div>
  </div>`;
}

function bottomNav() {
  if (!hasBottomNav()) return '';
  const items = state.role==='siswa'
    ? [['studentDashboard',ICONS.home,'Beranda'],['studentQuiz',ICONS.checklist,'Kuis'],['studentWebAR',ICONS.ar,'WebAR'],['studentModules',ICONS.book,'Modul']]
    : [['teacherDashboard',ICONS.home,'Dasbor'],['teacherQuiz',ICONS.checklist,'Kuis'],['teacherModules',ICONS.book,'Modul']];
  return `<nav class="bottom-nav ${state.role==='guru'?'three-items':''}">${items.map(([p,icon,label])=>`<button class="nav-item ${state.page===p?'active':''}" onclick="window.go('${p}')" aria-label="${label}">${icon}</button>`).join('')}</nav>`;
}
function pageWrap(content, opts={}) { app.innerHTML = `<section class="screen ${opts.noNav?'no-nav':''}">${content}</section>${bottomNav()}`; document.body.classList.toggle('colorblind-mode', state.colorblind); }

/* --------------------------------------------------------------------------
   AUTH
   -------------------------------------------------------------------------- */
function renderLogin() {
  app.innerHTML = `<section class="auth-screen">
    <div class="auth-hero"><div class="logo"><b>ARC</b>hemy</div><h1>Masuk ke ruang belajar kesetimbangan kimia.</h1><p>Pilih role akun, lalu akses fitur pembelajaran atau pengelolaan kelas.</p></div>
    <div class="card auth-card">
      <div class="role-tabs">
        <button class="role-tab ${state.role==='siswa'?'active':''}" onclick="window.setRole('siswa')">Siswa</button>
        <button class="role-tab ${state.role==='guru'?'active':''}" onclick="window.setRole('guru')">Guru</button>
      </div>
      <div class="field"><label>Email</label><input id="loginEmail" class="input" value="${profile().email}" placeholder="email@archemy.id"></div>
      <div class="field"><label>Password</label><input id="loginPass" class="input" type="password" value="${profile().password}" placeholder="Masukkan password"></div>
      <button class="btn full" onclick="window.submitLogin()">Login sebagai ${state.role==='siswa'?'Siswa':'Guru'}</button>
      <p class="small" style="text-align:center;margin:14px 0 0">Belum punya akun? <button class="link-btn" onclick="window.go('register')">Daftar</button></p>
    </div></section>`;
}
function submitLogin() {
  const email=document.getElementById('loginEmail').value.trim(); if (!email) return toast('Email tidak boleh kosong');
  state.profile[state.role].email=email; saveState(); toast('Login berhasil ');
  if (state.role==='siswa') go(state.joinedClass?'studentDashboard':'joinClass'); else go('teacherClasses');
}
function renderRegister() {
  app.innerHTML = `<section class="auth-screen">
    <div class="auth-hero"><div class="logo"><b>ARC</b>hemy</div><h1>Buat akun ARChemy.</h1><p>Data ini tersimpan di browser sebagai frontend demo.</p></div>
    <div class="card auth-card">
      <div class="role-tabs">
        <button class="role-tab ${state.role==='siswa'?'active':''}" onclick="window.setRole('siswa')">Siswa</button>
        <button class="role-tab ${state.role==='guru'?'active':''}" onclick="window.setRole('guru')">Guru</button>
      </div>
      <div class="field"><label>Nama lengkap</label><input id="regName" class="input" value="${profile().name}" placeholder="Nama lengkap"></div>
      <div class="field"><label>Email</label><input id="regEmail" class="input" value="${profile().email}" placeholder="email@archemy.id"></div>
      <div class="field"><label>Sekolah</label><input id="regSchool" class="input" value="${profile().school}" placeholder="Nama sekolah"></div>
      <div class="field"><label>Password</label><input id="regPass" class="input" type="password" value="${profile().password}" placeholder="Buat password"></div>
      <button class="btn full" onclick="window.submitRegister()">Daftar</button>
      <p class="small" style="text-align:center;margin:14px 0 0">Sudah punya akun? <button class="link-btn" onclick="window.go('login')">Login</button></p>
    </div></section>`;
}
function submitRegister() {
  const p=state.profile[state.role]; p.name=document.getElementById('regName').value.trim()||p.name; p.email=document.getElementById('regEmail').value.trim()||p.email; p.school=document.getElementById('regSchool').value.trim()||p.school; p.password=document.getElementById('regPass').value.trim()||p.password;
  saveState(); toast('Akun berhasil dibuat '); if (state.role==='siswa') go('joinClass'); else go('teacherClasses');
}

/* --------------------------------------------------------------------------
   STUDENT JOIN CLASS
   -------------------------------------------------------------------------- */
function renderJoinClass() {
  pageWrap(`${header({coins:false})}
    <h1 class="page-title">Masukkan Kode Kelas</h1><p class="page-subtitle">Gunakan kode yang diberikan oleh guru kimia kamu untuk bergabung ke kelas.</p>
    <div class="glass-card hero-topic" style="min-height:170px"><span class="label">Kode contoh</span><h2>KIM-137</h2><button class="hero-action" onclick="window.fillCode()">Gunakan kode</button></div>
    <div class="card"><div class="field"><label>Kode kelas</label><input id="classCode" class="input" placeholder="Contoh: KIM-137"></div><button class="btn full" onclick="window.joinClass()">Gabung Kelas</button></div>`,{noNav:true});
}
function fillCode() { document.getElementById('classCode').value='KIM-137'; }
function joinClass() {
  const code=document.getElementById('classCode').value.trim().toUpperCase(); const cls=state.classes.find(c=>c.code===code); if (!cls) return toast('Kode kelas belum ditemukan');
  state.joinedClass=true; state.profile.siswa.className=cls.name; state.selectedClassIndex=state.classes.indexOf(cls); saveState(); toast(`Berhasil bergabung ke ${cls.name} `); go('studentDashboard');
}

/* --------------------------------------------------------------------------
   STUDENT DASHBOARD
   -------------------------------------------------------------------------- */
function renderStudentDashboard() {
  const p=state.profile.siswa;
  const viewedModulesCount = state.modules.filter(m => state.quizResults.some(r => r.topic)).length;
  const modulPct = Math.min(100, Math.round((viewedModulesCount / Math.max(state.modules.length,1))*100));
  const kuisPct  = Math.min(100, Math.round((state.quizResults.length / Math.max(quizBank.length,1))*100));
  const totalMisi = Object.keys(MISI_DATA).length;
  const webarPct  = state.viewedMisi?.length ? Math.round((state.viewedMisi.length / totalMisi) * 100) : 0;
  const paham     = state.quizResults.filter(r => r.category === 'Paham Konsep').length;
  const totalRes  = state.quizResults.length || 1;
  const pemahamanBaik  = Math.round((paham / totalRes) * 100);
  const pemahamanKurang = 100 - pemahamanBaik;
  const hasRec = state.aiRecommendations?.length > 0;

  // Dynamic leaderboard: put current user in position based on points
  const pts = state.points || 0;
  const leaderboardUsers = [
    { name: 'Tiara Yanti', pts: 420 },
    { name: 'Joshua Den', pts: 380 },
    { name: 'Ambar', pts: 310 },
    { name: firstName(p.name), pts: pts, isSelf: true },
    { name: 'Rafa Pratama', pts: Math.max(pts - 15, 50) },
    { name: 'Nabila Putri', pts: Math.max(pts - 40, 30) },
    { name: 'Dimas Arga', pts: Math.max(pts - 70, 10) },
  ].sort((a,b) => b.pts - a.pts);

  const topThree = leaderboardUsers.slice(0,3);
  const rest = leaderboardUsers.slice(3);

  const badgesHtml = state.badges?.length > 0
    ? state.badges.map(b => BADGE_DEFS[b] ? `<span class="badge-chip" title="${BADGE_DEFS[b].desc}">${BADGE_DEFS[b].emoji}</span>` : '').join('')
    : '<span class="small muted">Belum ada badge. Selesaikan kuis untuk mendapatkan badge! </span>';

  pageWrap(`${header()}
    <h1 class="page-title">Halo ${firstName(p.name)}! </h1><p class="page-subtitle">Siap berpetualang bersama Chemy?</p>

    ${hasRec ? `<div class="adaptive-alert" onclick="window.go('studentAdaptivePath')">
      <span class="adaptive-alert-icon"></span>
      <div>
        <b>AI telah memetakan jalur belajarmu!</b>
        <span>${state.aiRecommendations.length} rekomendasi tersedia</span>
      </div>
      <span class="adaptive-alert-arrow">›</span>
    </div>` : ''}

    <div class="glass-card hero-topic"><span class="label">Topik Terakhir</span><h2>Kesetimbangan Kimia</h2><button class="hero-action" onclick="window.go('studentModules')">Lanjutkan</button></div>

    <div class="card activity-card"><div class="flask"></div><div><h3 style="margin:0 0 12px">Progres Aktivitas</h3>${progressRow('Modul yang sudah dipelajari',modulPct)}${progressRow('Kuis yang sudah dikerjakan',kuisPct)}${progressRow('WebAR yang sudah disimulasikan',webarPct)}</div></div>

    <div class="card" style="margin-top:14px;"><h3 style="margin:0 0 10px">Kemampuan & Badge</h3>${progressRow('Pemahaman baik',pemahamanBaik)}${progressRow('Pemahaman kurang',pemahamanKurang,'red')}<div class="badge-row">${badgesHtml}</div><button class="btn small-btn ghost" style="margin-top:12px" onclick="window.go('studentResult')">Lihat detail kuis</button></div>

    <section class="leaderboard-wrap"><div class="podium">
      ${podiumUser(topThree[1]?.name||'-','second',topThree[1]?.pts||0)}
      ${podiumUser(topThree[0]?.name||'-','first',topThree[0]?.pts||0)}
      ${podiumUser(topThree[2]?.name||'-','third',topThree[2]?.pts||0)}
    </div><div class="rank-list">${rest.map((u,i)=>`<div class="rank-row${u.isSelf?' top':''}"><span>${i+4}.</span><span class="avatar-sm">${ICONS.user}</span><span>${u.name}${u.isSelf?' (Kamu)':''}</span><span style="margin-left:auto;font-size:11px;opacity:.7">${u.pts} XP</span></div>`).join('')}</div></section>`);
}

function podiumUser(name, pos, pts) {
  return `<div class="podium-user ${pos}"><div class="avatar">${ICONS.user}</div><b>${firstName(name)}</b><span style="font-size:9px;opacity:.7">${pts} XP</span></div>`;
}
function progressRow(label,pct,cls='') { return `<div class="progress-row"><span class="label">${label}</span><span class="pct">${pct}%</span><div class="bar"><div class="bar-fill ${cls}" style="--w:${pct}%"></div></div></div>`; }

/* --------------------------------------------------------------------------
   HALAMAN ADAPTIVE LEARNING PATH - BARU
   -------------------------------------------------------------------------- */
function renderStudentAdaptivePath() {
  const recs = state.aiRecommendations || [];
  const results = state.quizResults || [];

  const pahamTopics    = results.filter(r => r.category === 'Paham Konsep');
  const menebakTopics  = results.filter(r => r.category === 'Menebak');
  const miskonsepsi    = results.filter(r => r.category === 'Miskonsepsi');
  const tidakPaham     = results.filter(r => r.category === 'Tidak Paham');

  const moduleRecs = recs.filter(r => r.type === 'module');
  const misiRecs   = recs.filter(r => r.type === 'misi');

  const catSection = (title, arr, icon, cls) => arr.length === 0 ? '' : `
    <div class="ap-section">
      <h4 class="ap-section-title ${cls}">${icon} ${title} (${arr.length} topik)</h4>
      ${arr.map(r => `<div class="ap-topic-chip ${cls}">${escapeHtml(r.topic)}</div>`).join('')}
    </div>`;

  const recModuleCard = (rec) => {
    const m = state.modules.find(mod => mod.id === rec.id);
    if (!m) return '';
    return `<div class="ap-rec-card priority-${rec.priority}" onclick="window.openModuleFromPath('${m.id}')">
      <div class="ap-rec-icon">${rec.priority==='high'?'':''}</div>
      <div>
        <b style="font-size:12px">${escapeHtml(m.title)}</b>
        <span class="small muted" style="display:block">${escapeHtml(rec.reason)}</span>
        <span class="ap-topic-pill">${escapeHtml(rec.topic)}</span>
      </div>
      <span class="ap-arrow">›</span>
    </div>`;
  };

  const MISI_LABEL = { misi1:'Gas Iodin Reversibel', misi2:'Operasi Smog Kota', misi3:'Amonia Gas', misi4:'Proses Haber' };
  const MISI_EMOJI = { misi1:'', misi2:'', misi3:'', misi4:'' };
  const recMisiCard = (rec) => {
    const label = MISI_LABEL[rec.id] || rec.id;
    return `<div class="ap-rec-card priority-${rec.priority}" onclick="window.goToMisi('${rec.id}')">
      <div class="ap-rec-icon">${MISI_EMOJI[rec.id]||''}</div>
      <div>
        <b style="font-size:12px">Misi: ${label}</b>
        <span class="small muted" style="display:block">${escapeHtml(rec.reason)}</span>
        <span class="ap-topic-pill misi">${escapeHtml(rec.topic)}</span>
      </div>
      <span class="ap-arrow">›</span>
    </div>`;
  };

  const emptyState = recs.length === 0 ? `<div class="empty-state" style="padding:28px;">
    <div style="font-size:40px;margin-bottom:10px"></div>
    <b>Belum ada rekomendasi</b>
    <p class="small muted" style="margin-top:6px">Selesaikan kuis diagnostik 4-tier terlebih dahulu untuk mendapatkan jalur belajar personal.</p>
    <button class="btn" style="margin-top:14px" onclick="window.go('studentQuiz')">Mulai Kuis Sekarang</button>
  </div>` : '';

  pageWrap(`${header({back:true,titleBackPage:'studentDashboard'})}
    <h1 class="page-title">Jalur Belajarmu </h1>
    <p class="page-subtitle">Dipersonalisasi oleh AI berdasarkan hasil kuis diagnostikmu.</p>

    ${emptyState}

    ${recs.length > 0 ? `
    <!-- Status diagnosis -->
    <div class="ap-diagnosis-card">
      <div class="ap-diag-header"> Ringkasan Diagnosis AI</div>
      <div class="ap-diag-grid">
        <div class="ap-diag-stat paham"><b>${pahamTopics.length}</b><span>Paham</span></div>
        <div class="ap-diag-stat menebak"><b>${menebakTopics.length}</b><span>Menebak</span></div>
        <div class="ap-diag-stat miskonsepsi"><b>${miskonsepsi.length}</b><span>Miskonsepsi</span></div>
        <div class="ap-diag-stat tidak-paham"><b>${tidakPaham.length}</b><span>Kurang</span></div>
      </div>
    </div>

    <!-- Analisis per kategori -->
    ${catSection('Sudah Paham', pahamTopics, '', 'paham')}
    ${catSection('Perlu Diperhatikan', menebakTopics, '️', 'menebak')}
    ${catSection('Ada Miskonsepsi', miskonsepsi, '', 'miskonsepsi')}
    ${catSection('Perlu Dipelajari', tidakPaham, '', 'tidak-paham')}

    <!-- Rekomendasi Modul -->
    ${moduleRecs.length > 0 ? `
    <h3 class="section-title"> Modul yang Direkomendasikan</h3>
    <div class="ap-rec-list">${moduleRecs.map(recModuleCard).join('')}</div>` : ''}

    <!-- Rekomendasi Misi WebAR -->
    ${misiRecs.length > 0 ? `
    <h3 class="section-title"> Misi WebAR yang Direkomendasikan</h3>
    <div class="ap-rec-list">${misiRecs.map(recMisiCard).join('')}</div>` : ''}

    <div class="actions-row" style="margin-top:16px;">
      <button class="btn ghost" onclick="window.go('studentModules')">Semua Modul</button>
      <button class="btn" onclick="window.go('studentWebAR')">Lab WebAR</button>
    </div>
    ` : ''}
  `);
}

function openModuleFromPath(moduleId) {
  state.activeModule = moduleId;
  saveState();
  go('studentModules');
}

function goToMisi(misiId) {
  state.webarMisiAktif = misiId;
  if (!state.viewedMisi) state.viewedMisi = [];
  if (!state.viewedMisi.includes(misiId)) state.viewedMisi.push(misiId);
  saveState();
  go('studentWebAR');
}

/* --------------------------------------------------------------------------
   MODULES ENGINE
   -------------------------------------------------------------------------- */
function renderStudentModules() {
  const filter = state.activeModuleFilter;
  const modules = state.modules.filter(m => filter==='all'||m.type===filter);
  const recModuleIds = (state.aiRecommendations||[]).filter(r=>r.type==='module').map(r=>r.id);

  pageWrap(`${header()}<h1 class="page-title">Modul Pembelajaran</h1>
    <div class="tabs">${tab('all','Semua')}${tab('file','File')}${tab('video','Video')}${tab('link','Link')}</div>
    ${recModuleIds.length > 0 ? `<div class="rec-banner"> ${recModuleIds.length} modul direkomendasikan AI untuk kamu</div>` : ''}
    <div class="module-list">${modules.map(m => moduleCard(m, recModuleIds)).join('')||`<div class="empty-state">Belum ada modul.</div>`}</div>
    ${state.activeModule?moduleSheet(state.modules.find(m=>m.id===state.activeModule)):''}
  `);
}
function tab(id,label) { return `<button class="tab ${state.activeModuleFilter===id?'active':''}" onclick="window.setModuleFilter('${id}')">${label}</button>`; }
function setModuleFilter(f) { state.activeModuleFilter=f; state.activeModule=null; saveState(); render(); }
function moduleIcon(type) { if (type==='video') return `<div class="module-icon video">${ICONS.play}</div>`; if (type==='link') return `<div class="module-icon link">${ICONS.link}</div>`; return `<div class="module-icon">${ICONS.file}</div>`; }
function typeLabel(type) { return type==='file'?'Dokumen':type==='video'?'Video':'Link'; }
function typePillClass(type) { return type==='file'?'type-doc':type==='video'?'type-video':'type-link'; }
function moduleCard(m, recIds=[]) {
  const isRec = recIds.includes(m.id);
  return `<button class="module-card fold ${isRec?'rec-highlight':''}" onclick="window.openModule('${m.id}')">
    ${isRec ? '<div class="rec-badge-module"> Direkomendasikan AI</div>' : ''}
    <div class="module-icon-wrap">${moduleIcon(m.type)}</div>
    <h3 class="module-title">${escapeHtml(m.title)}</h3>
    <div class="module-meta"><span class="pill ${typePillClass(m.type)}">${typeLabel(m.type)}</span><span class="pill ai"> Ringkasan AI</span></div>
  </button>`;
}
function openModule(id) { state.activeModule=id; saveState(); render(); }
function closeModule() { state.activeModule=null; saveState(); render(); }
function moduleSheet(m) {
  if (!m) return '';
  return `<div class="sheet"><div class="sheet-title"><h3> Ringkasan AI</h3><span class="pill">${typeLabel(m.type)}</span></div>
    <div class="module-card" style="box-shadow:none;min-height:70px;margin-bottom:10px">${moduleIcon(m.type)}<div><h3 class="module-title">${escapeHtml(m.title)}</h3><p class="small muted" style="margin:0">${escapeHtml(m.meta)}</p></div></div>
    <div class="sheet-block"><h4>Ringkasan</h4><div class="summary-card">${escapeHtml(m.summary)}</div></div>
    <div class="sheet-block"><h4>Poin Penting</h4><div class="summary-card"><ul style="padding-left:18px;margin:0">${m.points.map(p=>`<li>${escapeHtml(p)}</li>`).join('')}</ul></div></div>
    <div class="sheet-block"><h4>Tips Belajar</h4><div class="summary-card"><ul style="padding-left:18px;margin:0">${m.tips.map(t=>`<li>${escapeHtml(t)}</li>`).join('')}</ul></div></div>
    <div class="sheet-block"><h4>AI Insight</h4><div class="insight-card">
      <div class="insight-row"><span>▣ Tingkat Kesulitan</span><span class="tag">${escapeHtml(m.difficulty)}</span></div>
      <div class="insight-row"><span>◉ Estimasi Waktu</span><span class="tag">${escapeHtml(m.time)}</span></div>
      <div class="insight-row"><span> Prasyarat</span><span class="tag">${escapeHtml(m.prereq||'-')}</span></div>
    </div></div>
    <div class="actions-row" style="margin-top:12px"><button class="btn" onclick="window.closeModule()">Tutup</button></div>
  </div>`;
}

/* --------------------------------------------------------------------------
   ADAPTIVE QUIZ ENGINE
   -------------------------------------------------------------------------- */
function startQuiz() {
  state.currentSetIndex=0; state.currentTier=1; state.currentBloomLevel=1;
  state.quizResults=[]; state.selectedOption=null; state.confidence=null;
  state.quizTimeLeft=600; state.quizTimerActive=true;
  state.aiRecommendations=[]; state.questionStartTime = Date.now();
  saveState(); startTimer(); go('studentQuizPage');
}
function startTimer() {
  clearInterval(quizInterval);
  quizInterval = setInterval(()=>{
    if (state.quizTimeLeft<=0) { executeQuizEnd(); return; }
    state.quizTimeLeft--;
    const el=document.getElementById('quizTimer');
    if (el) {
      const m=Math.floor(state.quizTimeLeft/60); const s=state.quizTimeLeft%60;
      el.textContent=` ${String(m).padStart(2,'0')} : ${String(s).padStart(2,'0')}`;
      el.classList.toggle('warning', state.quizTimeLeft < 60);
    }
  },1000);
}

function renderStudentQuiz() {
  if (state.quizTimerActive) { go('studentQuizPage'); return; }
  if (state.quizResults.length > 0) { go('studentResult'); return; }
  pageWrap(`${header()}<h1 class="page-title">Kuis Adaptif 4-Tier</h1><p class="page-subtitle">Uji pemahamanmu tentang kesetimbangan kimia secara berlapis!</p>
    <div class="glass-card hero-topic" style="min-height:180px">
      <span class="label">Kesetimbangan Kimia</span>
      <h2>10 Set Soal • Evaluasi Diagnostik</h2>
      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
        <span class="bloom-badge" style="background:rgba(255,255,255,0.2);color:#fff;font-size:10px;padding:4px 10px;border-radius:999px;">C1→C5 Bloom Taxonomy</span>
        <span class="bloom-badge" style="background:rgba(255,255,255,0.2);color:#fff;font-size:10px;padding:4px 10px;border-radius:999px;"> 10 Menit</span>
      </div>
      <button class="hero-action" onclick="window.startQuiz()">Mulai Kuis</button>
    </div>
    <div class="card" style="margin-top:14px">
      <h4 style="margin:0 0 10px">Cara Kerja Kuis 4-Tier</h4>
      <div class="tier-explain-list">
        <div class="tier-explain-item"><span class="tier-num">1</span><span>Jawaban konsep</span></div>
        <div class="tier-explain-item"><span class="tier-num">2</span><span>Keyakinan terhadap jawaban</span></div>
        <div class="tier-explain-item"><span class="tier-num">3</span><span>Alasan ilmiah</span></div>
        <div class="tier-explain-item"><span class="tier-num">4</span><span>Keyakinan terhadap alasan</span></div>
      </div>
    </div>`);
}

function renderStudentQuizPage() {
  const set = quizBank[state.currentSetIndex]; if(!set) return executeQuizEnd();
  const tier = state.currentTier;
  const currentStep=(state.currentSetIndex*4)+(tier-1);
  const progress=Math.round((currentStep/40)*100);
  const m=Math.floor(state.quizTimeLeft/60); const s=state.quizTimeLeft%60;
  const tierClasses=[1,2,3,4].map(t=>{ if(t<tier) return 'done'; if(t===tier) return 'active'; return ''; });
  const bloomLabel = set.bloomLabel || 'C1 - Mengingat';
  const bloomColor = set.bloomLevel >= 4 ? '#ff6b6b' : set.bloomLevel >= 3 ? '#ffa500' : '#6b36cf';

  let questionContent='';
  if (tier===1||tier===3) {
    const q=tier===1?set.tier1:set.tier3;
    questionContent=`<div class="quiz-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="font-size:10px;background:rgba(255,255,255,0.2);padding:3px 8px;border-radius:999px;">${tier===1?'Tier 1 - Jawaban Konsep':'Tier 3 - Alasan Ilmiah'}</span>
        <span style="font-size:10px;background:rgba(255,255,255,0.15);padding:3px 8px;border-radius:999px;color:#fff;">${bloomLabel}</span>
      </div>
      <h3>${escapeHtml(q.question)}</h3>
      <div class="option-list">${q.options.map((o,i)=>`<button class="option ${state.selectedOption===i?'selected':''}" onclick="window.selectOption(${i})"><b>${String.fromCharCode(65+i)}.</b><span>${escapeHtml(o)}</span></button>`).join('')}</div>
    </div>`;
  } else {
    const confLabel = tier===2 ? 'Seberapa yakin dengan jawaban Anda?' : 'Seberapa yakin dengan alasan Anda?';
    questionContent=`<div class="confidence-card">
      <h4>${confLabel}</h4>
      <div class="conf-grid">${['Tidak Yakin','Yakin','Sangat Yakin'].map(c=>`<button class="conf-btn ${state.confidence===c?'active':''}" onclick="window.selectConfidence('${c}')">${c}</button>`).join('')}</div>
    </div>`;
  }

  pageWrap(`${header()}
    <div class="quiz-head">
      <div>
        <h1 class="page-title" style="margin:0">Kuis Adaptif</h1>
        <span style="font-size:10px;color:var(--muted)">Topik ${state.currentSetIndex+1}/${quizBank.length}: ${escapeHtml(set.topic)}</span>
      </div>
      <span class="timer" id="quizTimer"> ${String(m).padStart(2,'0')} : ${String(s).padStart(2,'0')}</span>
    </div>
    <div class="quiz-progress"><div class="fill" style="--w:${progress}%"></div></div>
    <div class="tier-tabs">${[1,2,3,4].map((t,i)=>`<button class="tier ${tierClasses[i]}">Tier ${t}</button>`).join('')}</div>
    ${questionContent}
    <button class="btn full" style="margin-top:16px" onclick="window.saveAndNext()">Simpan & Lanjut</button>
  `);
}

function selectOption(i) { state.selectedOption=i; saveState(); render(); }
function selectConfidence(c) { state.confidence=c; saveState(); render(); }

function saveAndNext() {
  const tier = state.currentTier; const setIdx = state.currentSetIndex; const currentSet = quizBank[setIdx]; if (!currentSet) return executeQuizEnd();
  if (tier === 1 || tier === 3) { if (state.selectedOption === null) return toast('Pilih opsi jawaban dulu!'); }
  else { if (!state.confidence) return toast('Pilih tingkat keyakinan dulu!'); }

  let result = state.quizResults.find(r => r.topic === currentSet.topic);
  if (!result) { result = { topic: currentSet.topic, setIndex: setIdx, bloomLevel: currentSet.bloomLevel }; state.quizResults.push(result); }

  if (tier === 1) { result.tier1Answer = state.selectedOption; result.tier1Correct = state.selectedOption === currentSet.tier1.answer; }
  else if (tier === 2) { result.tier2Confidence = state.confidence; }
  else if (tier === 3) { result.tier3Answer = state.selectedOption; result.tier3Correct = state.selectedOption === currentSet.tier3.answer; }
  else if (tier === 4) {
    result.tier4Confidence = state.confidence;
    result.timeTaken = Math.round((Date.now() - (state.questionStartTime || Date.now())) / 1000);
    const isConf = c => c === 'Yakin' || c === 'Sangat Yakin';
    if (result.tier1Correct && isConf(result.tier2Confidence) && result.tier3Correct && isConf(result.tier4Confidence))  result.category = 'Paham Konsep';
    else if (result.tier1Correct && !isConf(result.tier2Confidence)) result.category = 'Menebak';
    else if (!result.tier1Correct && isConf(result.tier2Confidence) && !result.tier3Correct && isConf(result.tier4Confidence)) result.category = 'Miskonsepsi';
    else result.category = 'Tidak Paham';
  }

  state.selectedOption = null; state.confidence = null;

  if (tier < 4) { state.currentTier = tier + 1; saveState(); render(); }
  else {
    // Adaptif: naik/turun bloom level
    const bloomNow = currentSet.bloomLevel || 1;
    if (result.category === 'Paham Konsep') state.currentBloomLevel = Math.min(6, bloomNow + 1);
    else if (result.category === 'Miskonsepsi') state.currentBloomLevel = Math.max(1, bloomNow - 1);

    // Poin per soal
    if (result.tier1Correct) awardPoints(10, 'jawaban benar');

    if (result.category === 'Miskonsepsi') {
      saveState();
      const reqMisi = currentSet.topic === 'Pengaruh Tekanan dan Volume' ? 'misi2' : 'misi1';
      openModal(
        ' AI Mendeteksi Miskonsepsi!',
        `<div style="font-size:13px;line-height:1.6;">
           <p><b>Topik:</b> ${escapeHtml(currentSet.topic)}</p>
           <p>Sistem mendeteksi <b>Miskonsepsi Sejati</b>: kamu menjawab salah namun sangat yakin dengan jawabanmu.</p>
           <p style="color:var(--purple)"> Rekomendasi: Visualisasikan konsep ini di Lab WebAR sebelum melanjutkan.</p>
         </div>`,
        `<button class="btn full" onclick="window.closeModal(); window.goToMisi('${reqMisi}');"> Pergi ke Lab AR</button>
         <button class="btn ghost full" onclick="window.closeModal(); window.jalankanLompatanAdaptif('${currentSet.topic}', false);">Lewati & Lanjut</button>`
      );
    } else { jalankanLompatanAdaptif(currentSet.topic, true); }
  }
}

function jalankanLompatanAdaptif(currentTopic, isSuccess) {
  const routing = TOPIC_ROUTING[currentTopic];
  if (!routing) return executeQuizEnd();
  const nextTopicTarget = isSuccess ? routing.nextOnSuccess : routing.nextOnFail;
  if (nextTopicTarget === 'END') { executeQuizEnd(); }
  else {
    const nextIdx = quizBank.findIndex(q => q.topic === nextTopicTarget);
    if (nextIdx >= 0) { state.currentSetIndex = nextIdx; state.currentTier = 1; state.questionStartTime = Date.now(); saveState(); render(); }
    else { executeQuizEnd(); }
  }
}

async function fetchGeminiAnalysis(payload) {
  return new Promise((resolve, reject) => {
    // Simulasi delay jaringan API 2.5 detik
    setTimeout(() => {
      // 90% success rate to simulate real network
      if (Math.random() > 0.1) {
        // Build mock recommendations based on the payload analysis
        const miskCount = payload.results.filter(r => r.category === 'Miskonsepsi').length;
        const total = payload.results.length;
        const pahamCount = payload.results.filter(r => r.category === 'Paham Konsep').length;

        let classification = 'Perlu Pendampingan Dasar';
        if (pahamCount === total) classification = 'Sangat Mahir';
        else if (pahamCount > total / 2 && miskCount === 0) classification = 'Pemahaman Baik';
        else if (miskCount > 0) classification = 'Terdeteksi Miskonsepsi';

        let recom = [];
        if (miskCount > 0) {
          recom.push({ text: `Penting: AI mendeteksi ${miskCount} miskonsepsi. Disarankan mencoba Lab WebAR untuk memvisualisasikan konsep.`, action: "window.go('studentWebAR')" });
        }
        if (pahamCount < total) {
          recom.push({ text: 'Pelajari ulang teori dasar pada modul yang direkomendasikan AI.', action: "window.go('studentModules')" });
        }
        if (recom.length === 0) {
          recom.push({ text: 'Luar biasa! Pemahaman Anda sangat baik. AI menyarankan Anda melanjutkan ke latihan soal tingkat lanjut.', action: null });
        }
        
        resolve({
          status: 'success',
          analysis: { classification, recommendations: recom }
        });
      } else {
        reject(new Error('Gemini API sedang tidak tersedia (simulasi error)'));
      }
    }, 2500);
  });
}

async function executeQuizEnd() {
  clearInterval(quizInterval); quizInterval = null; state.quizTimerActive = false;
  
  // Show Loading state
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; text-align:center;">
        <div style="width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #6b36cf;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:20px;"></div>
        <h3 style="margin:0;color:#1e293b;">Menganalisis Jawaban...</h3>
        <p style="color:#64748b;font-size:14px;">Mengirim data 4-tier ke AI Assistant (Gemini API)</p>
      </div>
      <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    `;
  }

  // Construct Payload
  const payload = {
    userId: 'student123',
    timestamp: new Date().toISOString(),
    totalTimeTaken: 600 - state.quizTimeLeft,
    results: state.quizResults.map(r => ({
      topic: r.topic,
      bloomLevel: r.bloomLevel,
      tier1Answer: r.tier1Answer,
      tier1Correct: r.tier1Correct,
      tier2Confidence: r.tier2Confidence,
      tier3Answer: r.tier3Answer,
      tier3Correct: r.tier3Correct,
      tier4Confidence: r.tier4Confidence,
      category: r.category,
      timeTaken: r.timeTaken
    }))
  };

  try {
    const aiResponse = await fetchGeminiAnalysis(payload);
    state.aiRecommendations = aiResponse.analysis.recommendations;
    state.aiClassification = aiResponse.analysis.classification;
    // Save to history
    state.aiAnalysisHistory = state.aiAnalysisHistory || [];
    state.aiAnalysisHistory.push({ date: new Date().toISOString(), payload, analysis: aiResponse.analysis });
  } catch (err) {
    console.warn("AI Fallback triggered:", err);
    state.aiRecommendations = generateAdaptiveLearningPath(state.quizResults);
    state.aiClassification = 'Analisis AI Tidak Tersedia (Fallback)';
    toast('Gagal terhubung ke AI, menggunakan analisis standar.');
  }

  // Bonus poin jika paham
  const pahamCount = state.quizResults.filter(r => r.category === 'Paham Konsep').length;
  if (pahamCount > 0) awardPoints(pahamCount * 20, 'bonus pemahaman');
  saveState();
  checkAndAwardBadges('quiz');
  go('studentResult');
}

function resetQuiz() {
  clearInterval(quizInterval); quizInterval = null;
  state.currentSetIndex = 0; state.currentTier = 1; state.currentBloomLevel = 1;
  state.quizResults = []; state.aiRecommendations = [];
  saveState(); go('studentQuiz');
}

/* --------------------------------------------------------------------------
   STUDENT RESULT - Diagnosis AI Lengkap
   -------------------------------------------------------------------------- */
function renderStudentResult() {
  const results = state.quizResults;
  const total   = results.length;
  const correct = results.filter(r => r.tier1Correct).length;
  const score   = total ? Math.round((correct / total) * 100) : 0;
  const circumference = 2 * Math.PI * 45;
  const offset  = circumference - (score / 100) * circumference;
  const totalTime = 600 - state.quizTimeLeft;
  const tMin = Math.floor(totalTime / 60); const tSec = totalTime % 60;

  const pahamCount   = results.filter(r => r.category === 'Paham Konsep').length;
  const menebakCount = results.filter(r => r.category === 'Menebak').length;
  const miskCount    = results.filter(r => r.category === 'Miskonsepsi').length;
  const tidakCount   = results.filter(r => r.category === 'Tidak Paham').length;

  const hasRec = state.aiRecommendations?.length > 0;

  const catBadge = (cat) => {
    const m = {'Paham Konsep':'paham','Menebak':'menebak','Miskonsepsi':'miskonsepsi','Tidak Paham':'tidak-paham'};
    const icon = {'Paham Konsep':'','Menebak':'️','Miskonsepsi':'','Tidak Paham':''};
    return `<span class="badge ${m[cat]||''}" style="font-size:9px;padding:2px 6px;">${icon[cat]||''} ${escapeHtml(cat||'-')}</span>`;
  };

  const reviewHtml = results.map((r,i) => {
    const set = quizBank[r.setIndex]; if(!set) return '';
    const miskDetail = r.category === 'Miskonsepsi' ?
      `<div class="misconception-detail">️ <b>Letak miskonsepsi:</b> Kamu yakin dengan jawaban yang salah. ${escapeHtml(set.tier3.options[set.tier3.answer].substring(0,80))}...</div>` : '';
    return `<div class="result-topic-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <b style="font-size:12px">${i+1}. ${escapeHtml(r.topic)}</b>
        ${catBadge(r.category)}
      </div>
      <div style="font-size:11px;color:var(--muted);line-height:1.6;">
        <div>Tier 1: ${r.tier1Correct?' Benar':' Salah'} | Keyakinan: ${escapeHtml(r.tier2Confidence||'-')}</div>
        <div>Tier 3: ${r.tier3Correct?' Benar':' Salah'} | Keyakinan: ${escapeHtml(r.tier4Confidence||'-')}</div>
        <div style="margin-top:2px;opacity:.7">Level Bloom: ${escapeHtml(set.bloomLabel||'C1')}</div>
      </div>
      ${miskDetail}
    </div>`;
  }).join('');

  const aiColor = (state.aiClassification && state.aiClassification.includes('Miskonsepsi')) ? '#1e1b4b' : '#0f2d1a';
  const aiMsg   = state.aiClassification 
    ? `Klasifikasi AI: <b style="color:#2dd4bf;">${escapeHtml(state.aiClassification)}</b>` 
    : (miskCount > 0 ? `Terdeteksi <b>${miskCount} topik miskonsepsi</b>.` : `Pemahaman kamu sudah baik.`);

  pageWrap(`${header({back:true})}
    <h1 class="page-title">Hasil Kuis 4-Tier</h1>

    <!-- Score circle -->
    <div class="glass-card" style="border-radius:26px;text-align:center;margin-bottom:14px;padding:18px;">
      <div class="score-circle-wrap" style="width:100px;height:100px;margin:0 auto 10px;">
        <svg viewBox="0 0 100 100" style="transform:rotate(-90deg);width:100%;height:100%;">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="8"/>
          <circle cx="50" cy="50" r="45" fill="none" stroke="#9af5dc" stroke-width="8" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
        </svg>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:22px;font-weight:bold;">${score}%</div>
      </div>
      <p class="small muted" style="margin:4px 0 0;"> Waktu: ${tMin}m ${tSec}s | ${total} topik dinilai</p>
    </div>

    <!-- Stats grid -->
    <div class="result-stat-grid">
      <div class="result-stat-item paham"><b>${pahamCount}</b><span>Paham</span></div>
      <div class="result-stat-item menebak"><b>${menebakCount}</b><span>Menebak</span></div>
      <div class="result-stat-item miskonsepsi"><b>${miskCount}</b><span>Miskonsepsi</span></div>
      <div class="result-stat-item tidak-paham"><b>${tidakCount}</b><span>Kurang</span></div>
    </div>

    <!-- AI Diagnosis -->
    <div style="background:${aiColor};padding:16px;border-radius:20px;color:white;margin-bottom:14px;">
      <h4 style="margin:0 0 6px;color:#00E5FF;"> Diagnosis Gemini AI</h4>
      <p style="font-size:12px;opacity:.9;margin:0 0 12px;">${aiMsg}</p>
      ${hasRec ? `<button class="btn full" style="background:linear-gradient(135deg,#7c3fd4,#28d4c8)" onclick="window.go('studentAdaptivePath')"> Lihat Jalur Belajarmu</button>` : `<button class="btn full" style="margin-top:4px" onclick="window.go('studentWebAR')"> Eksplorasi Lab AR</button>`}
    </div>

    <!-- Per-topic review -->
    <h3 class="section-title">Review Per Topik</h3>
    <div style="display:grid;gap:10px;">${reviewHtml}</div>

    <div class="actions-row" style="margin-top:16px;">
      <button class="btn ghost" onclick="window.resetQuiz()">Ulangi Kuis</button>
      ${hasRec ? `<button class="btn" onclick="window.go('studentAdaptivePath')">Jalur Belajar</button>` : ''}
    </div>
  `);
}

/* --------------------------------------------------------------------------
   WEBAR - AR LAB
   -------------------------------------------------------------------------- */
function renderStudentWebARPage() {
  const recMisiIds = (state.aiRecommendations||[]).filter(r=>r.type==='misi').map(r=>r.id);

  if (!state.webarMisiAktif && !state.webarHookMisi) {
    // Step 1: Pilih Misi
    pageWrap(`${header({back:true,titleBackPage:'studentDashboard',coins:false})}<div id="webarContainer"></div>`, {noNav:true});
    const container = document.getElementById('webarContainer');
    renderPilihMisi(container, (misiId) => {
      state.webarHookMisi = misiId;
      saveState(); render();
    }, recMisiIds);
  } else if (state.webarHookMisi && !state.webarMisiAktif) {
    // Step 2: Hook Screen (Curiosity Question)
    app.innerHTML = '';
    renderHook(app, state.webarHookMisi, () => {
      state.webarMisiAktif = state.webarHookMisi;
      state.webarHookMisi = null;
      if (!state.viewedMisi) state.viewedMisi = [];
      if (!state.viewedMisi.includes(state.webarMisiAktif)) state.viewedMisi.push(state.webarMisiAktif);
      saveState(); render();
    });
  } else {
    // Step 3: AR Session
    app.innerHTML = '';
    renderHalamanAR(app, state.webarMisiAktif, (result) => {
      if (result?.completed) {
        awardPoints(50, 'misi WebAR selesai');
        checkAndAwardBadges('ar');
      }
      state.webarMisiAktif = null;
      state.webarHookMisi = null;
      saveState(); render();
    });
  }
}

function toggleColorblind() { state.colorblind=!state.colorblind; document.body.classList.toggle('colorblind-mode', state.colorblind); saveState(); render(); }

/* --------------------------------------------------------------------------
   GURU: KELAS
   -------------------------------------------------------------------------- */
function renderTeacherClasses() {
  pageWrap(`
    <div style="text-align:center;padding-top:20px;"><h1 class="page-title">Pilih Kelas</h1><p class="page-subtitle">Sistem Pemantauan Analitik Guru</p></div>
    <div class="coverflow-wrap">
      <button class="coverflow-btn prev" onclick="window.moveCoverflow(-1)">‹</button>
      <div class="coverflow-track" id="coverflowTrack">
        ${state.classes.map((cls,i)=>`<div class="coverflow-slide" onclick="window.selectCoverflowClass(${i}, '${cls.id}')"><div class="coverflow-content"><h3>${escapeHtml(cls.name)}</h3><span>${cls.students} Siswa • Kode: ${escapeHtml(cls.code)}</span></div><button class="btn full">Masuk Dasbor</button></div>`).join('')}
      </div>
      <button class="coverflow-btn next" onclick="window.moveCoverflow(1)">›</button>
    </div>
    <div style="padding:0 28px;margin-top:20px;"><button class="btn ghost full" onclick="window.showAddClassModal()">+ Buat Kelas Baru</button></div>`, {noNav:true});
  setTimeout(initCoverflow, 60);
}

let coverflowIndex = 0;
function initCoverflow() { coverflowIndex = state.selectedClassIndex || 0; updateCoverflow(); }
function updateCoverflow() {
  const track = document.getElementById('coverflowTrack'); if(!track) return;
  const cards = track.querySelectorAll('.coverflow-slide'); const len = cards.length;
  cards.forEach((card, i) => {
    let offset = i - coverflowIndex; if (len > 2) { if (offset > Math.floor(len/2)) offset -= len; if (offset < -Math.floor(len/2)) offset += len; }
    const absOffset = Math.abs(offset); const direction = Math.sign(offset);
    let scale = absOffset === 0 ? 1.05 : 0.85; let translateX = absOffset === 0 ? 0 : direction * 140;
    card.style.transform = `translateX(${translateX}px) scale(${scale})`; card.style.zIndex = absOffset === 0 ? 100 : 50; card.style.opacity = absOffset === 0 ? 1 : 0.4; card.style.pointerEvents = absOffset === 0 ? 'auto' : 'none';
  });
}
function moveCoverflow(dir) { const len = state.classes.length; if (len === 0) return; coverflowIndex = (coverflowIndex + dir + len) % len; updateCoverflow(); }
function selectCoverflowClass(idx) { state.selectedClassIndex = idx; saveState(); go('teacherDashboard'); }

function renderTeacherDashboard() {
  const c=activeClass();
  pageWrap(`${header({coins:false,back:true,titleBackPage:'teacherClasses'})}
    <h1 class="page-title">Dasbor Kelas</h1>
    <div class="glass-card teacher-hero" style="padding:15px;">
      <span class="class-tag" style="background:rgba(255,255,255,.25);padding:3px 8px;border-radius:8px;">${escapeHtml(c.name)}</span>
      <div style="margin-top:10px;font-weight:bold;">${escapeHtml(state.profile.guru.name)}</div>
      <div class="stat-grid">
        <div class="stat-mini"><b>${c.students}</b><span>Siswa</span></div>
        <div class="stat-mini"><b>${c.progress}%</b><span>Progres</span></div>
        <div class="stat-mini"><b>${c.quiz} Soal</b><span>Kuis</span></div>
      </div>
    </div>
    <div class="two-stat" style="margin-top:14px;">
      <button class="stat-card" onclick="window.go('teacherClassDetail')"><strong>Siswa</strong><span>Daftar & Nilai</span></button>
      <button class="stat-card" onclick="window.go('teacherModules')"><strong>Modul</strong><span>Materi</span></button>
    </div>
    <div class="two-stat" style="margin-top:12px;">
      <button class="stat-card" onclick="window.go('teacherAnalysis')"><strong>Analitik</strong><span>Diagnosis AI</span></button>
      <button class="stat-card" onclick="window.go('teacherQuiz')"><strong>Kuis</strong><span>Bank Soal</span></button>
    </div>`);
}

function showAddClassModal() {
  openModal('Buat Kelas Baru',
    '<div class="field"><label>Nama Kelas Baru</label><input id="newClassName" class="input" placeholder="Contoh: XI IPA 4"></div>',
    '<button class="btn full" onclick="window.addClass()">Buat Kelas</button><button class="btn ghost full" onclick="window.closeModal()">Batal</button>');
}
function addClass() {
  const name=document.getElementById('newClassName').value.trim(); if(!name) return toast('Isi nama kelas!');
  const code=`KIM-${Math.floor(140+Math.random()*850)}`; state.classes.push({id:`c${Date.now()}`,name,code,students:32,progress:0,quiz:10,roster:[]});
  state.selectedClassIndex=state.classes.length-1; saveState(); closeModal(); render(); toast(`Kelas baru ${code} aktif! `);
}

function renderTeacherClassDetail() {
  const c = activeClass();
  pageWrap(`${header({coins:false,back:true,titleBackPage:'teacherDashboard'})}
    <h1 class="page-title">Kelola Kelas</h1><p class="page-subtitle">Informasi manajemen data siswa & rekapitulasi nilai.</p>
    <div class="glass-card" style="padding:18px;margin-bottom:16px;min-height:auto;"><h3 style="margin:0 0 4px;">${escapeHtml(c.name)}</h3><p class="small" style="margin:0;opacity:.9;">Kode Gabung: <b>${escapeHtml(c.code)}</b> | Total: ${c.students} Siswa</p></div>
    <h3 class="section-title">Daftar Murid & Capaian</h3>
    <div class="info-list">
      ${c.roster.map(s => `<div class="card" style="display:flex;justify-content:space-between;align-items:center;padding:12px;margin-bottom:10px;">
        <div style="display:flex;align-items:center;gap:10px;"><span class="avatar-sm">${ICONS.user}</span>
          <div><b style="font-size:13px;display:block;">${escapeHtml(s.name)}</b>
            <span class="small muted">${s.category}</span>
            ${s.topics?.length > 0 ? `<div style="margin-top:2px;">${s.topics.map(t=>`<span style="font-size:9px;background:rgba(255,79,109,.1);color:#c73e5a;padding:1px 5px;border-radius:4px;margin-right:2px;">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
          </div>
        </div>
        <div style="text-align:right;"><b style="font-size:16px;color:var(--purple);display:block;">${s.score}</b>
          <span class="badge ${s.status==='Kritis'?'miskonsepsi':s.status==='Perhatian'?'menebak':'paham'}" style="font-size:9px;padding:2px 6px;">${s.status}</span>
        </div>
      </div>`).join('')}
    </div>`);
}

/* --------------------------------------------------------------------------
   TEACHER MODULES - dengan AI Summary Generator
   -------------------------------------------------------------------------- */
function renderTeacherModules() {
  pageWrap(`${header({coins:false,back:true,titleBackPage:'teacherDashboard'})}
    <h1 class="page-title">Kelola Modul</h1>
    <div class="card add-panel">
      <h4 style="margin:0 0 12px;">Unggah Materi Baru</h4>
      <div class="field"><label>Judul Modul</label><input id="moduleTitle" class="input" placeholder="Ketik judul modul"></div>
      <div class="field"><label>Tipe Materi</label>
        <select id="moduleType" class="select">
          <option value="file"> Dokumen (PDF/PPT)</option>
          <option value="video"> Video</option>
          <option value="link"> Tautan</option>
        </select>
      </div>
      <div class="field"><label>Deskripsi Singkat</label><textarea id="moduleSummary" class="textarea" placeholder="Tuliskan deskripsi singkat materi..."></textarea></div>
      <div class="field"><label>Tingkat Kesulitan</label>
        <select id="moduleDifficulty" class="select">
          <option value="Rendah">Rendah</option>
          <option value="Sedang" selected>Sedang</option>
          <option value="Tinggi">Tinggi</option>
        </select>
      </div>
      <button class="btn full" id="uploadModuleBtn" onclick="window.addModuleWithAI()"> Unggah & Generate Ringkasan AI</button>
    </div>
    <h3 class="section-title">Modul Tersedia (${state.modules.length})</h3>
    <div class="module-list">${state.modules.map(m=>`<div class="card" style="display:flex;justify-content:space-between;align-items:center;padding:12px;margin-bottom:8px;"><div><b style="font-size:13px">${escapeHtml(m.title)}</b><div style="margin-top:4px;"><span class="pill ${typePillClass(m.type)}">${typeLabel(m.type)}</span><span class="pill ai" style="margin-left:4px;"> AI</span></div></div><button class="icon-btn danger" onclick="window.deleteModule('${m.id}')">${ICONS.trash}</button></div>`).join('')}</div>`);
}

function addModuleWithAI() {
  const title = document.getElementById('moduleTitle').value.trim();
  const summary = document.getElementById('moduleSummary').value.trim();
  const type = document.getElementById('moduleType').value;
  const difficulty = document.getElementById('moduleDifficulty').value;
  if (!title || !summary) return toast('Judul & Deskripsi wajib diisi!');

  // Simulate AI processing
  const btn = document.getElementById('uploadModuleBtn');
  btn.textContent = ' AI sedang membuat ringkasan...';
  btn.disabled = true;

  setTimeout(() => {
    // AI-generated points & tips from summary
    const words = summary.split(' ');
    const aiPoints = [
      `${words.slice(0,4).join(' ')}...`,
      'Konsep ini berkaitan dengan Asas Le Chatelier.',
      'Pelajari persamaan reaksi yang diberikan.',
    ];
    const aiTips = [
      'Baca pelan-pelan dan catat kata kunci.',
      'Hubungkan dengan simulasi WebAR untuk pemahaman visual.',
    ];

    state.modules.unshift({
      id:`m${Date.now()}`,
      type,
      title,
      meta: `${typeLabel(type)} • Baru ditambahkan`,
      summary: `[Ringkasan AI] ${summary}`,
      points: aiPoints,
      tips: aiTips,
      difficulty,
      time: '12 Menit',
      prereq: 'Kesetimbangan Kimia Dasar'
    });
    saveState();
    toast(' Materi terunggah dengan Ringkasan AI!');
    render();
  }, 1800);
}

function deleteModule(id) {
  state.modules = state.modules.filter(m => m.id !== id);
  saveState(); render(); toast('Modul dihapus.');
}

/* --------------------------------------------------------------------------
   TEACHER QUIZ
   -------------------------------------------------------------------------- */
function renderTeacherQuiz() {
  pageWrap(`${header({coins:false,back:true,titleBackPage:'teacherDashboard'})}
    <h1 class="page-title">Kelola Kuis</h1><p class="page-subtitle">Buat dan kelola kuis kognitif berjenjang.</p>
    <button class="btn" style="min-height:36px;padding:0 14px;border-radius:999px;margin-bottom:18px;" onclick="window.newQuestion()"><span style="font-size:16px;font-weight:bold;">+</span> Aktifkan Kuis Baru</button>
    <div class="quiz-history-list">
      <div class="card" style="padding:14px;margin-bottom:14px;border-radius:18px;">
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px;"><div style="flex:1;"><h4 style="margin:0;font-size:14px;color:var(--ink);">Kuis Diagnostik Topik 3</h4><span class="small muted">Karakteristik Sistem Homogen dan Heterogen</span></div><span class="badge paham" style="background:var(--purple);color:white;font-size:9px;padding:2px 8px;">Aktif</span></div>
        <div class="tier-tabs" style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:10px;">${[1,2,3,4].map(n=>`<span style="background:var(--soft);text-align:center;font-size:10px;padding:3px;border-radius:4px;font-weight:600;color:var(--purple)">Tier ${n}</span>`).join('')}</div>
        <div style="display:flex;justify-content:space-between;text-align:center;background:#fbfaff;padding:8px;border-radius:10px;margin-bottom:10px;border:1px solid #f0ecf8;">
          <div><b style="font-size:15px;display:block;">28</b><span class="small muted">selesai</span></div>
          <div><b style="font-size:15px;display:block;">8</b><span class="small muted">belum</span></div>
          <div><b style="font-size:15px;display:block;color:var(--purple);">78%</b><span class="small muted">rata-rata</span></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;"><button class="btn ghost small-btn" onclick="window.editQuestion('qs3_t1')"> Edit</button><span class="small" style="color:var(--danger);font-weight:600;">Tenggat: 2 hari 3 jam</span></div>
      </div>
      <div class="card" style="padding:14px;margin-bottom:14px;border-radius:18px;">
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px;"><div style="flex:1;"><h4 style="margin:0;font-size:14px;color:var(--ink);">Kuis Diagnostik Topik 2</h4><span class="small muted">Kesetimbangan Kimia Dinamis</span></div><span class="badge tidak-paham" style="font-size:9px;padding:2px 8px;">Selesai</span></div>
        <div style="display:flex;justify-content:space-between;text-align:center;background:#fbfaff;padding:8px;border-radius:10px;margin-bottom:10px;border:1px solid #f0ecf8;">
          <div><b style="font-size:15px;display:block;">36</b><span class="small muted">selesai</span></div>
          <div><b style="font-size:15px;display:block;">0</b><span class="small muted">belum</span></div>
          <div><b style="font-size:15px;display:block;color:var(--success);">90%</b><span class="small muted">rata-rata</span></div>
        </div>
        <button class="btn plain small-btn" style="width:100%" onclick="window.go('teacherAnalysis')"> Lihat Hasil Analisis</button>
      </div>
    </div>`);
}

function newQuestion() { state.teacherEditingQuestionId = null; saveState(); go('teacherEditQuiz'); }
function editQuestion(id) { state.teacherEditingQuestionId = id; saveState(); go('teacherEditQuiz'); }
function renderTeacherEditQuiz() {
  const isEdit = state.teacherEditingQuestionId !== null;
  let qData = { question:'', type:'', tier:1, optA:'', optB:'', optC:'', optD:'', ans:0 };
  if (isEdit) {
    const q = state.questions.find(x => x.id === state.teacherEditingQuestionId) || state.questions[0];
    qData = { question:q.question, type:q.type, tier:q.tier, optA:q.options[0]||'', optB:q.options[1]||'', optC:q.options[2]||'', optD:q.options[3]||'', ans:q.answer };
  }
  pageWrap(`${header({back:true,titleBackPage:'teacherQuiz',coins:false})}
    <h1 class="page-title">${isEdit ? 'Edit Parameter Kuis' : 'Buat Kuis Baru'}</h1>
    <p class="page-subtitle">Formulir pengaturan butir soal diagnostik 4-Tier.</p>
    <div class="card">
      <div class="field"><label>Judul / Topik Kuis</label><input id="qType" class="input" value="${escapeHtml(qData.type)}"></div>
      <div class="field"><label>Target Evaluasi</label><select id="qTier" class="select"><option value="1" ${qData.tier===1?'selected':''}>Tier 1 & 2 (Jawaban & Keyakinan)</option><option value="3" ${qData.tier===3?'selected':''}>Tier 3 & 4 (Alasan & Keyakinan)</option></select></div>
      <div class="field"><label>Teks Pertanyaan</label><textarea id="qText" class="textarea">${escapeHtml(qData.question)}</textarea></div>
      <div class="form-grid">
        <div class="field"><label>Pilihan A</label><input id="qOpt0" class="input" value="${escapeHtml(qData.optA)}"></div>
        <div class="field"><label>Pilihan B</label><input id="qOpt1" class="input" value="${escapeHtml(qData.optB)}"></div>
        <div class="field"><label>Pilihan C</label><input id="qOpt2" class="input" value="${escapeHtml(qData.optC)}"></div>
        <div class="field"><label>Pilihan D</label><input id="qOpt3" class="input" value="${escapeHtml(qData.optD)}"></div>
      </div>
      <div class="field"><label>Kunci Jawaban</label><select id="qAns" class="select"><option value="0" ${qData.ans===0?'selected':''}>A</option><option value="1" ${qData.ans===1?'selected':''}>B</option><option value="2" ${qData.ans===2?'selected':''}>C</option><option value="3" ${qData.ans===3?'selected':''}>D</option></select></div>
      <button class="btn full" style="margin-top:14px;" onclick="window.saveQuestion()">Simpan Perubahan Kuis</button>
    </div>`);
}

function saveQuestion() {
  const type = document.getElementById('qType').value.trim(); const tier = parseInt(document.getElementById('qTier').value); const question = document.getElementById('qText').value.trim();
  const options = [0,1,2,3].map(i => document.getElementById(`qOpt${i}`).value.trim()); const answer = parseInt(document.getElementById('qAns').value);
  if(!type || !question || !options[0] || !options[1]) return toast('Mohon lengkapi parameter soal!');
  if (state.teacherEditingQuestionId !== null) {
    const idx = state.questions.findIndex(q => q.id === state.teacherEditingQuestionId);
    if(idx >= 0) state.questions[idx] = { id: state.teacherEditingQuestionId, tier, type, question, options, answer, reason:'' };
  } else { state.questions.unshift({ id:`q_${Date.now()}`, tier, type, question, options, answer, reason:'' }); }
  saveState(); toast('Bank soal berhasil diperbarui!'); go('teacherQuiz');
}

/* --------------------------------------------------------------------------
   TEACHER ANALYSIS - Analitik Lengkap dengan Distribusi & Rekomendasi
   -------------------------------------------------------------------------- */
function renderTeacherAnalysis() {
  const c = activeClass();
  const roster = c.roster || [];
  const total = roster.length || 1;

  // Distribusi kategori kelas
  const pahamCount   = roster.filter(s => s.category === 'Paham Konsep').length;
  const menebakCount = roster.filter(s => s.category === 'Menebak').length;
  const miskCount    = roster.filter(s => s.category === 'Miskonsepsi').length;
  const pahamPct   = Math.round((pahamCount/total)*100);
  const menebakPct = Math.round((menebakCount/total)*100);
  const miskPct    = Math.round((miskCount/total)*100);

  // Agregasi Topik
  const topicList = Object.keys(TOPIC_MAP);
  const topicStats = topicList.map(topic => {
    const misk = roster.filter(s => s.category === 'Miskonsepsi' && (s.topics||[]).includes(topic)).length;
    const menebak = roster.filter(s => s.category === 'Menebak' && (s.topics||[]).includes(topic)).length;
    const paham = total - misk - menebak;
    return { topic, misk, menebak, paham, miskPct: Math.round((misk/total)*100), menebakPct: Math.round((menebak/total)*100), pahamPct: Math.round((paham/total)*100) };
  }).sort((a,b) => a.pahamPct - b.pahamPct);

  pageWrap(`${header({back:true,titleBackPage:'teacherDashboard',coins:false})}
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
      <div><h1 class="page-title" style="margin:0;">Analisis Kognitif</h1><p class="page-subtitle" style="margin:0;">${escapeHtml(c.name)} - Real-Time</p></div>
      <button class="btn small-btn" style="background:#10b981;" onclick="window.eksporLaporanPDF()"> PDF</button>
    </div>

    <div id="area-cetak-laporan" style="padding:5px;background:#fff;">
      <div class="pdf-only-header" style="margin-bottom:15px;border-bottom:2px solid #6b36cf;padding-bottom:5px;"><h3 style="margin:0;color:#6b36cf;">ARChemy Learning Analytics Report</h3><p style="margin:0;font-size:11px;color:#555;">Rapor Diagnosis Kelas ${escapeHtml(c.name)}</p></div>

      <!-- Distribusi Kelas -->
      <div class="card" style="margin-bottom:14px;">
        <h4 style="margin:0 0 12px;"> Distribusi Pemahaman Kelas</h4>
        <div class="dist-chart">
          <div class="dist-bar-wrap">
            <div class="dist-bar-label">Paham Konsep</div>
            <div class="dist-bar-track"><div class="dist-bar paham" style="width:${pahamPct}%">${pahamPct}%</div></div>
            <span class="dist-count">${pahamCount}</span>
          </div>
          <div class="dist-bar-wrap">
            <div class="dist-bar-label">Menebak</div>
            <div class="dist-bar-track"><div class="dist-bar menebak" style="width:${menebakPct}%">${menebakPct}%</div></div>
            <span class="dist-count">${menebakCount}</span>
          </div>
          <div class="dist-bar-wrap">
            <div class="dist-bar-label">Miskonsepsi</div>
            <div class="dist-bar-track"><div class="dist-bar miskonsepsi" style="width:${miskPct}%">${miskPct}%</div></div>
            <span class="dist-count">${miskCount}</span>
          </div>
        </div>
      </div>

      <!-- Daftar Analisis Materi -->
      <h3 class="section-title" style="margin-top:20px;"> Daftar Analisis Materi</h3>
      <p class="page-subtitle" style="margin-bottom:14px;">Pilih materi untuk melihat detail siswa.</p>
      <div class="card" style="margin-bottom:14px;">
        ${topicStats.map(t => `
          <div class="topic-error-row" style="cursor:pointer; display:block; padding:12px;" onclick="window.teacherTopicDetail('${escapeHtml(t.topic)}')">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <b style="font-size:13px;">${escapeHtml(t.topic)}</b>
              <span class="ap-arrow">›</span>
            </div>
            <div class="dist-bar-track" style="height:10px; border-radius:5px; display:flex;">
              <div class="dist-bar paham" style="width:${t.pahamPct}%; height:100%; position:relative;"></div>
              <div class="dist-bar menebak" style="width:${t.menebakPct}%; height:100%; position:relative;"></div>
              <div class="dist-bar miskonsepsi" style="width:${t.miskPct}%; height:100%; position:relative;"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:10px; margin-top:6px; color:var(--muted);">
              <span><span style="color:#10b981; font-weight:600;">${t.pahamPct}%</span> Paham</span>
              <span><span style="color:#f59e0b; font-weight:600;">${t.menebakPct}%</span> Menebak</span>
              <span><span style="color:#ef4444; font-weight:600;">${t.miskPct}%</span> Miskonsepsi</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Detail Siswa (Hanya untuk PDF / Tersembunyi di UI) -->
      <div class="pdf-only-section" style="display:none;">
        <h3 style="margin-top:20px; color:#6b36cf; border-bottom:1px solid #eee; padding-bottom:5px;">Detail Evaluasi per Materi</h3>
        ${topicStats.map(t => {
          const critical = roster.filter(s => (s.topics||[]).includes(t.topic) && s.category !== 'Paham Konsep').sort((a,b) => a.category === 'Miskonsepsi' ? -1 : 1);
          if (critical.length === 0) return '';
          return `
          <div style="margin-bottom:15px;">
            <b style="font-size:14px; display:block; margin-bottom:5px;">${escapeHtml(t.topic)}</b>
            <table style="width:100%; border-collapse:collapse; font-size:11px;">
              <tr style="background:#f1f5f9;"><th style="padding:5px; text-align:left; border:1px solid #ddd;">Nama Siswa</th><th style="padding:5px; text-align:left; border:1px solid #ddd;">Status</th></tr>
              ${critical.map(s => `<tr><td style="padding:5px; border:1px solid #ddd;">${escapeHtml(s.name)}</td><td style="padding:5px; border:1px solid #ddd; color:${s.category==='Miskonsepsi'?'#ef4444':'#d97706'}">${escapeHtml(s.category)}</td></tr>`).join('')}
            </table>
          </div>`;
        }).join('')}
      </div>
    </div>`);
}

function renderTeacherTopicDetail() {
  const c = activeClass();
  const roster = c.roster || [];
  const topic = state.activeTopic;
  if (!topic) return go('teacherAnalysis');

  const total = roster.length || 1;
  const miskCount = roster.filter(s => s.category === 'Miskonsepsi' && (s.topics||[]).includes(topic)).length;
  const menebakCount = roster.filter(s => s.category === 'Menebak' && (s.topics||[]).includes(topic)).length;
  const pahamCount = total - miskCount - menebakCount;
  const pahamPct = Math.round((pahamCount/total)*100);

  const students = roster.map(s => {
    let stat = 'Paham Konsep';
    if ((s.topics||[]).includes(topic)) {
      stat = s.category === 'Miskonsepsi' ? 'Miskonsepsi' : 'Menebak';
    }
    return { ...s, topicStat: stat };
  });

  const criticalStudents = students.filter(s => s.topicStat !== 'Paham Konsep').sort((a,b) => a.topicStat === 'Miskonsepsi' ? -1 : 1);
  const goodStudents = students.filter(s => s.topicStat === 'Paham Konsep');

  let aiRec = '';
  if (miskCount > 0) aiRec = `Rekomendasi AI: Terdapat ${miskCount} siswa yang mengalami miskonsepsi. Disarankan menggunakan simulasi WebAR untuk memvisualisasikan kembali konsep ini secara interaktif.`;
  else if (menebakCount > 0) aiRec = `Rekomendasi AI: ${menebakCount} siswa masih menebak. Berikan latihan soal terstruktur untuk memperkuat penalaran kognitif mereka.`;
  else aiRec = `Rekomendasi AI: Seluruh kelas sudah menguasai topik ini. Anda dapat melanjutkan ke materi berikutnya atau memberikan soal evaluasi lanjutan.`;

  pageWrap(`${header({back:true,titleBackPage:'teacherAnalysis',coins:false})}
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
      <div><h1 class="page-title" style="margin:0;font-size:18px;">Detail Materi</h1><p class="page-subtitle" style="margin:0;">${escapeHtml(topic)}</p></div>
    </div>

    <div class="card" style="margin-bottom:14px;">
      <h4 style="margin:0 0 10px;">Ringkasan Topik</h4>
      <div style="display:flex; gap:10px; margin-bottom:12px;">
        <div style="flex:1; background:rgba(16, 185, 129, 0.1); color:#10b981; padding:10px; border-radius:8px; text-align:center;"><b>${pahamPct}%</b><br><span style="font-size:10px">Paham</span></div>
        <div style="flex:1; background:rgba(245, 158, 11, 0.1); color:#d97706; padding:10px; border-radius:8px; text-align:center;"><b>${Math.round((menebakCount/total)*100)}%</b><br><span style="font-size:10px">Menebak</span></div>
        <div style="flex:1; background:rgba(239, 68, 68, 0.1); color:#ef4444; padding:10px; border-radius:8px; text-align:center;"><b>${Math.round((miskCount/total)*100)}%</b><br><span style="font-size:10px">Miskonsepsi</span></div>
      </div>
      <div class="ai-strategy-row" style="margin:0; background:var(--bg);">
        <p class="ai-strategy-text" style="font-size:12px;">${aiRec}</p>
      </div>
    </div>

    <h3 class="section-title"> Daftar Siswa</h3>
    <div class="card" style="margin-bottom:14px;">
      ${criticalStudents.length > 0 ? `<div style="font-size:11px; font-weight:bold; color:var(--muted); margin-bottom:8px; text-transform:uppercase;">Butuh Perhatian (${criticalStudents.length})</div>` : ''}
      ${criticalStudents.map(s => `
        <div class="student-row" style="margin-bottom:8px; background:${s.topicStat==='Miskonsepsi'?'rgba(239, 68, 68, 0.05)':'rgba(245, 158, 11, 0.05)'}; border:1px solid ${s.topicStat==='Miskonsepsi'?'rgba(239, 68, 68, 0.2)':'rgba(245, 158, 11, 0.2)'};">
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="avatar-sm">${ICONS.user}</span>
            <b style="font-size:13px">${escapeHtml(s.name)}</b>
          </div>
          <span class="badge ${s.topicStat==='Miskonsepsi'?'miskonsepsi':'menebak'}">${escapeHtml(s.topicStat)}</span>
        </div>`).join('')}

      ${goodStudents.length > 0 ? `<div style="font-size:11px; font-weight:bold; color:var(--muted); margin:16px 0 8px; text-transform:uppercase;">Paham Konsep (${goodStudents.length})</div>` : ''}
      ${goodStudents.map(s => `
        <div class="student-row" style="margin-bottom:8px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="avatar-sm" style="background:#f0f9ff; color:#0ea5e9;">${ICONS.user}</span>
            <b style="font-size:13px">${escapeHtml(s.name)}</b>
          </div>
          <span class="badge" style="background:rgba(16, 185, 129, 0.1); color:#10b981;">Paham Konsep</span>
        </div>`).join('')}
    </div>
  `);
}

function studentAttention(name,score,status) { return `<div class="student-row" style="margin-bottom:8px;display:flex;justify-content:space-between;padding:8px;border:1px solid #eee;border-radius:10px;"><span><b>${escapeHtml(name)}</b> (${score}%)</span> <span class="badge ${status==='Kritis'?'miskonsepsi':'menebak'}">${escapeHtml(status)}</span></div>`; }
function eksporLaporanPDF() {
  if (typeof html2pdf === 'undefined') { toast(' Library PDF belum dimuat.'); return; }
  const element = document.getElementById('area-cetak-laporan'); 
  const nameKls = state.classes[state.selectedClassIndex]?.name || 'Kelas'; 
  toast(' Memproses PDF...');
  
  // Unhide pdf-only sections for html2pdf rendering
  const hiddenElements = element.querySelectorAll('.pdf-only-section');
  hiddenElements.forEach(el => el.style.display = 'block');

  const opsi = { margin:[15,12,15,12], filename:`Laporan_ARChemy_${nameKls}.pdf`, image:{type:'jpeg',quality:.98}, html2canvas:{scale:2,useCORS:true,logging:false}, jsPDF:{unit:'mm',format:'a4',orientation:'portrait'} };
  
  try { 
    html2pdf().set(opsi).from(element).save().then(() => {
      toast('PDF Berhasil diunduh!');
      hiddenElements.forEach(el => el.style.display = 'none');
    }).catch(() => {
      toast('Gagal ekspor PDF.');
      hiddenElements.forEach(el => el.style.display = 'none');
    }); 
  } catch(e) { 
    toast('Gagal: '+e.message); 
    hiddenElements.forEach(el => el.style.display = 'none');
  }
}

/* --------------------------------------------------------------------------
   PROFIL
   -------------------------------------------------------------------------- */
function renderProfile() {
  const p=profile();
  const myBadges = (state.badges||[]).map(b => BADGE_DEFS[b] ? `<div class="badge-card"><span class="badge-emoji">${BADGE_DEFS[b].emoji}</span><div><b>${BADGE_DEFS[b].name}</b><span class="small muted" style="display:block">${BADGE_DEFS[b].desc}</span></div></div>` : '').join('');

  pageWrap(`${header({back:true,titleBackPage:state.role==='siswa'?'studentDashboard':'teacherDashboard',coins:state.role==='siswa'})}
    <div class="glass-card profile-hero" style="text-align:center;"><h2>${escapeHtml(p.name)}</h2><p>${state.role==='siswa'?'Siswa':'Guru'} • ${escapeHtml(p.school)}</p></div>
    ${state.role==='siswa' ? `
    <div class="card" style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:center;">
      <div><b style="font-size:24px;color:var(--purple)">${state.points||0}</b><div class="small muted">Total XP</div></div>
      <div><b style="font-size:24px;color:#16a8a0">${state.gems||0}</b><div class="small muted">Gems</div></div>
    </div>` : ''}
    <div class="card info-list" style="margin-top:14px;">
      <div class="info-row"><b>Email</b><span>${escapeHtml(p.email)}</span></div>
      <div class="info-row"><b>Instansi</b><span>${escapeHtml(p.school)}</span></div>
      <div class="info-row" style="cursor:pointer;" onclick="window.toggleColorblind()"><b>Mode Buta Warna</b><span>${state.colorblind?' Aktif':'Nonaktif'}</span></div>
    </div>
    ${state.role==='siswa' && (state.badges||[]).length > 0 ? `
    <h3 class="section-title">Badge Kamu </h3>
    <div class="card">${myBadges}</div>` : ''}
    <div class="actions-row" style="margin-top:14px;"><button class="btn danger full" onclick="window.logout()">Logout Akun</button></div>`);
}

function logout() {
  hentikanSesiAR();
  state.page='login'; state.joinedClass=false; state.webarMisiAktif=null;
  clearInterval(quizInterval); saveState(); render(); toast('Keluar akun sukses');
}

/* --------------------------------------------------------------------------
   UTILITIES
   -------------------------------------------------------------------------- */
function firstName(name) { return (name||'').split(' ')[0]||'User'; }
function escapeHtml(str) { return String(str??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s])); }

/* --------------------------------------------------------------------------
   ROUTER
   -------------------------------------------------------------------------- */
function render() {
  const routes = {
    login:renderLogin, register:renderRegister, joinClass:renderJoinClass,
    studentDashboard:renderStudentDashboard, studentModules:renderStudentModules,
    studentQuiz:renderStudentQuiz, studentQuizPage:renderStudentQuizPage, studentResult:renderStudentResult,
    studentWebAR:renderStudentWebARPage, studentAdaptivePath:renderStudentAdaptivePath,
    teacherClasses:renderTeacherClasses, teacherDashboard:renderTeacherDashboard,
    teacherModules:renderTeacherModules, teacherQuiz:renderTeacherQuiz,
    teacherEditQuiz:renderTeacherEditQuiz, teacherAnalysis:renderTeacherAnalysis, teacherTopicDetail:renderTeacherTopicDetail, profile:renderProfile,
    teacherClassDetail:renderTeacherClassDetail,
  };
  try {
    (routes[state.page]||renderLogin)();
  } catch (err) {
    console.error('[ARChemy Render Error]', err);
    app.innerHTML = `<section class="screen" style="text-align:center;padding-top:80px;"><h2 style="color:var(--danger);">Terjadi Kesalahan</h2><p class="muted" style="font-size:13px;">${escapeHtml(err.message)}</p><button class="btn" style="margin-top:16px;" onclick="window.state.page='login';window.render();">Kembali ke Login</button><button class="btn ghost" style="margin-top:8px;" onclick="localStorage.removeItem('archemyState');location.reload();">Reset Data</button></section>`;
  }
}

/* --------------------------------------------------------------------------
   WINDOW BRIDGE
   -------------------------------------------------------------------------- */
if (typeof window !== 'undefined') {
  window.state = state; window.saveState = saveState; window.toast = toast; window.go = go; window.goHome = goHome;
  window.setRole = setRole; window.logout = logout; window.closeModal = closeModal;
  window.submitLogin = submitLogin; window.submitRegister = submitRegister;
  window.fillCode = fillCode; window.joinClass = joinClass;
  window.setModuleFilter = setModuleFilter; window.openModule = openModule; window.closeModule = closeModule;
  window.openModuleFromPath = openModuleFromPath; window.goToMisi = goToMisi;
  window.startQuiz = startQuiz; window.selectOption = selectOption; window.selectConfidence = selectConfidence;
  window.saveAndNext = saveAndNext; window.resetQuiz = resetQuiz;
  window.jalankanLompatanAdaptif = jalankanLompatanAdaptif; window.executeQuizEnd = executeQuizEnd;
  window.toggleColorblind = toggleColorblind;
  window.moveCoverflow = moveCoverflow; window.selectCoverflowClass = selectCoverflowClass;
  window.showAddClassModal = showAddClassModal; window.addClass = addClass;
  window.addModuleWithAI = addModuleWithAI; window.deleteModule = deleteModule;
  window.newQuestion = newQuestion; window.saveQuestion = saveQuestion;
  window.eksporLaporanPDF = eksporLaporanPDF; window.editQuestion = editQuestion;
  window.teacherTopicDetail = (topic) => { state.activeTopic = topic; go('teacherTopicDetail'); };
  window.render = render;
}

render();