/* ==========================================================================
   ARCHEMY MAIN ENGINE - VITE COMPATIBLE SINGLE PAGE APPLICATION (SPA)
   ========================================================================== */

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
};

const quizBank = [
  { id:'qs1', topic:'Konsep Dasar Kesetimbangan',
    tier1:{ question:'Suatu reaksi dikatakan berada dalam keadaan setimbang apabila...',
      options:['Reaksi telah berhenti sepenuhnya dan tidak ada perubahan','Laju reaksi maju sama dengan laju reaksi balik','Semua reaktan telah habis bereaksi membentuk produk','Konsentrasi reaktan selalu lebih besar dari konsentrasi produk'], answer:1 },
    tier3:{ question:'Alasan ilmiah yang mendukung jawaban Anda adalah...',
      options:['Pada keadaan setimbang, laju pembentukan produk sama dengan laju penguraian produk kembali menjadi reaktan, sehingga konsentrasi tampak tetap','Kesetimbangan tercapai karena semua molekul berhenti bergerak','Kesetimbangan hanya terjadi jika suhu dan tekanan sistem adalah nol','Pada kesetimbangan, energi kinetik semua partikel menjadi sama besar'], answer:0 }
  },
  { id:'qs2', topic:'Kesetimbangan Dinamis',
    tier1:{ question:'Pada kesetimbangan dinamis, pernyataan yang paling tepat adalah...',
      options:['Reaksi maju dan balik sudah berhenti sama sekali','Konsentrasi reaktan dan produk terus berubah secara drastis','Reaksi maju dan balik tetap berlangsung dengan laju yang sama sehingga komposisi campuran tetap','Hanya reaksi ke arah produk yang masih berlangsung'], answer:2 },
    tier3:{ question:'Dasar ilmiah yang menjelaskan kesetimbangan dinamis adalah...',
      options:['On a molecular level, collisions between particles still occur and forward-reverse reactions proceed simultaneously, but the net change in concentration is zero','Molekul berhenti bergerak begitu sistem mencapai kesetimbangan','Energi kinetik rata-rata semua molekul menjadi nol pada keadaan setimbang','Kesetimbangan dinamis hanya dapat terjadi pada tekanan sangat tinggi'], answer:0 }
  },
  { id:'qs3', topic:'Pengaruh Konsentrasi',
    tier1:{ question:'Pada reaksi: N₂(g) + 3H₂(g) ⇌ 2NH₃(g), jika konsentrasi N₂ ditambah, kesetimbangan akan...',
      options:['Bergeser ke kiri (arah reaktan)','Bergeser ke kanan (arah produk)','Tidak mengalami pergeseran','Reaksi langsung berhenti'], answer:1 },
    tier3:{ question:'Alasan ilmiah dari pergeseran kesetimbangan tersebut adalah...',
      options:['Sesuai Asas Le Chatelier, penambahan konsentrasi reaktan mendorong sistem bergeser ke arah produk untuk mengurangi gangguan','Penambahan N₂ menurunkan energi aktivasi reaksi maju saja','Gas N₂ yang ditambahkan langsung terurai menjadi atom nitrogen bebas','Konsentrasi reaktan tidak pernah mempengaruhi posisi kesetimbangan'], answer:0 }
  },
  { id:'qs4', topic:'Pengaruh Tekanan dan Volume',
    tier1:{ question:'Pada reaksi: 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), jika tekanan dinaikkan, kesetimbangan akan...',
      options:['Bergeser ke kiri karena mol gas reaktan lebih sedikit','Bergeser ke kanan karena mol gas produk lebih sedikit','Tidak berubah karena tekanan tidak mempengaruhi kesetimbangan gas','Bergeser ke kiri karena SO₃ lebih berat dari SO₂'], answer:1 },
    tier3:{ question:'Prinsip yang mendasari pengaruh tekanan ini adalah...',
      options:['Peningkatan tekanan menggeser sistem ke sisi dengan jumlah mol gas lebih sedikit (3 mol → 2 mol) sesuai Asas Le Chatelier','Tekanan tinggi selalu menguntungkan produk pada semua reaksi','Tekanan hanya mempengaruhi reaksi fase cair','Peningkatan tekanan selalu menghentikan reaksi kesetimbangan'], answer:0 }
  },
  { id:'qs5', topic:'Pengaruh Suhu',
    tier1:{ question:'Reaksi: N₂O₄(g) ⇌ 2NO₂(g), ΔH = +57 kJ/mol. Jika suhu dinaikkan, kesetimbangan akan...',
      options:['Bergeser ke kiri sehingga N₂O₄ bertambah','Bergeser ke kanan sehingga NO₂ bertambah','Tidak mengalami pergeseran','Reaksi berubah menjadi ireversibel'], answer:1 },
    tier3:{ question:'Dasar ilmiah pengaruh suhu pada kesetimbangan ini adalah...',
      options:['Kenaikan suhu menyediakan kalor yang dimanfaatkan reaksi endoterm (ke kanan) untuk menyerap kelebihan kalor sesuai Asas Le Chatelier','Suhu tinggi selalu mempercepat semua reaksi ke arah produk','Perubahan suhu hanya mempengaruhi laju reaksi, tidak mengubah tetapan kesetimbangan','Kenaikan suhu menurunkan energi aktivasi reaksi balik saja'], answer:0 }
  },
  { id:'qs6', topic:'Peran Katalis',
    tier1:{ question:'Penambahan katalis pada sistem kesetimbangan akan...',
      options:['Menggeser kesetimbangan ke arah produk','Menggeser kesetimbangan ke arah reaktan','Mempercepat tercapainya kesetimbangan tanpa mengubah posisi kesetimbangan','Menghentikan reaksi balik sepenuhnya'], answer:2 },
    tier3:{ question:'Alasan katalis tidak mengubah posisi kesetimbangan adalah...',
      options:['Katalis menurunkan energi aktivasi reaksi maju dan balik secara proporsional sama, sehingga perbandingan laju tidak berubah','Katalis hanya mempengaruhi warna larutan','Katalis menambah jumlah mol produk melalui reaksi samping','Katalis menyerap seluruh energi kinetik molekul gas'], answer:0 }
  },
  { id:'qs7', topic:'Tetapan Kesetimbangan Kc',
    tier1:{ question:'Untuk reaksi: 2A(g) + B(g) ⇌ 3C(g), ekspresi Kc yang benar adalah...',
      options:['Kc = [A]²[B] / [C]³','Kc = [C]³ / ([A]²[B])','Kc = [C] / ([A][B])','Kc = ([A] + [B]) / [C]'], answer:1 },
    tier3:{ question:'Prinsip penulisan ekspresi Kc tersebut didasarkan pada...',
      options:['Kc merupakan perbandingan konsentrasi produk berpangkat koefisien dibagi konsentrasi reaktan berpangkat koefisien','Nilai Kc selalu sama dengan 1','Koefisien reaksi tidak mempengaruhi ekspresi Kc','Kc dihitung dari penjumlahan konsentrasi semua zat'], answer:0 }
  },
  { id:'qs8', topic:'Hubungan Kp dan Kc',
    tier1:{ question:'Hubungan antara Kp and Kc dinyatakan oleh rumus...',
      options:['Kp = Kc × (RT)^Δn','Kp = Kc / (RT)','Kp = Kc + RT','Kp = Kc × R'], answer:0 },
    tier3:{ question:'Makna Δn dalam hubungan Kp = Kc(RT)^Δn adalah...',
      options:['Selisih jumlah koefisien mol gas produk dikurangi koefisien mol gas reaktan','Jumlah total mol semua zat','Jumlah mol reaktan saja','Δn selalu bernilai positif untuk setiap reaksi'], answer:0 }
  },
  { id:'qs9', topic:'Kesetimbangan Heterogen',
    tier1:{ question:'Pada reaksi: CaCO₃(s) ⇌ CaO(s) + CO₂(g), ekspresi Kc yang benar adalah...',
      options:['Kc = [CaO][CO₂] / [CaCO₃]','Kc = [CO₂]','Kc = 1 / [CO₂]','Kc = [CaCO₃] / ([CaO][CO₂])'], answer:1 },
    tier3:{ question:'Alasan ilmiah zat padat tidak dimasukkan ke ekspresi Kc adalah...',
      options:['Konsentrasi zat padat murni bersifat konstan dan sudah termasuk dalam nilai Kc','Zat padat tidak ikut bereaksi','Zat padat selalu habis bereaksi','Zat padat tidak memiliki massa molar'], answer:0 }
  },
  { id:'qs10', topic:'Aplikasi Industri (Proses Haber)',
    tier1:{ question:'Dalam proses Haber: N₂(g) + 3H₂(g) ⇌ 2NH₃(g), ΔH = −92 kJ/mol. Kondisi yang menguntungkan pembentukan NH₃ adalah...',
      options:['Suhu tinggi dan tekanan rendah','Suhu rendah dan tekanan tinggi','Suhu tinggi dan tekanan tinggi','Suhu rendah dan tekanan rendah'], answer:1 },
    tier3:{ question:'Namun dalam praktik industri digunakan suhu sedang (~450°C) karena...',
      options:['Suhu rendah menguntungkan kesetimbangan namun laju reaksi sangat lambat; suhu sedang dengan katalis besi dipilih sebagai kompromi','Suhu rendah merusak peralatan pabrik','Suhu tinggi diperlukan agar katalis tidak teroksidasi','Pada suhu rendah gas nitrogen membeku'], answer:0 }
  }
];

const defaultModules = [
  { id:'m1', type:'file', title:'Pengantar Kesetimbangan Kimia', meta:'Dokumen • 18 halaman', summary:'Materi ini menjelaskan konsep reaksi bolak-balik, keadaan setimbang, serta ciri sistem ketika laju reaksi maju dan balik sudah sama.', points:['Kesetimbangan bersifat dinamis.','Konsentrasi zat tampak tetap pada keadaan setimbang.','Sistem tertutup membantu reaksi mencapai setimbang.'], tips:['Fokus pada perbedaan reaksi satu arah dan reaksi reversibel.','Gunakan tabel ICE untuk memahami perubahan konsentrasi.'], difficulty:'Rendah', time:'10 Menit', prereq:'Reaksi Kimia Dasar' },
  { id:'m2', type:'file', title:'Kesetimbangan Kimia Dinamis', meta:'Dokumen • 22 halaman', summary:'Membahas keadaan saat reaksi tetap berlangsung dua arah, tetapi perubahan makroskopis tidak terlihat karena laju reaksi maju sama dengan laju reaksi balik.', points:['Laju maju = laju balik.','Jumlah partikel dapat tetap walaupun reaksi tetap terjadi.','Kesetimbangan hanya terjadi pada sistem tertutup.'], tips:['Bayangkan dua arah reaksi berjalan bersamaan.','Perhatikan tanda panah bolak-balik pada persamaan reaksi.'], difficulty:'Sedang', time:'12 Menit', prereq:'Konsep Reaksi Reversibel' },
  { id:'m3', type:'video', title:'Rahasia Partikel Tak Terlihat: Apa Itu Kesetimbangan Dinamis?', meta:'Video • 15 menit', summary:'Video memperlihatkan ilustrasi partikel yang terus bergerak dalam reaksi bolak-balik, sehingga siswa dapat memahami bahwa kesetimbangan bukan berarti reaksi berhenti.', points:['Partikel tetap bergerak.','Reaksi maju dan balik terjadi bersamaan.','Perubahan terlihat stabil secara makroskopis.'], tips:['Pause pada bagian animasi partikel.','Catat contoh reaksi yang digunakan dalam video.'], difficulty:'Sedang', time:'15 Menit', prereq:'Kesetimbangan Dinamis' },
  { id:'m4', type:'file', title:'Asas Le Chatelier', meta:'Dokumen • 25 halaman', summary:'Sistem kesetimbangan akan bergeser untuk mengurangi pengaruh perubahan yang diberikan, seperti perubahan konsentrasi, tekanan, volume, atau suhu.', points:['Konsentrasi naik → bergeser menjauhi zat yang ditambah.','Tekanan naik → bergeser ke sisi mol gas lebih kecil.','Suhu naik → bergeser ke arah reaksi endoterm.','Katalis tidak menggeser kesetimbangan.'], tips:['Ingat konsep "melawan perubahan".','Bedakan pengaruh suhu, tekanan, volume, dan katalis.','Gunakan simulasi WebAR untuk melihat pergeseran.'], difficulty:'Tinggi', time:'12 Menit', prereq:'Kesetimbangan Kimia Dasar' },
  { id:'m5', type:'video', title:'Trik Asas Le Chatelier: Cara Pabrik Kimia Memaksa Reaksi Terus Berjalan', meta:'Video • 15 menit', summary:'Video menjelaskan bagaimana industri memanfaatkan Asas Le Chatelier dengan mengatur suhu, tekanan, and konsentrasi agar reaksi menghasilkan produk lebih banyak.', points:['Tekanan dapat memengaruhi jumlah produk gas.','Suhu dipilih berdasarkan jenis reaksi.','Konsentrasi reaktan dapat diatur untuk mendorong produk.'], tips:['Hubungkan materi dengan proses Haber.','Perhatikan contoh perubahan tekanan dan suhu.'], difficulty:'Rendah', time:'17 Menit', prereq:'Asas Le Chatelier' },
  { id:'m6', type:'file', title:'Pengaruh Parameter Suhu (Termal) & Konsentrasi Le Chatelier', meta:'Dokumen • 20 halaman', summary:'Materi ini membahas cara suhu dan konsentrasi mengubah arah pergeseran kesetimbangan pada reaksi kimia.', points:['Penambahan reaktan mendorong pembentukan produk.','Suhu tinggi menguntungkan arah endoterm.','Suhu rendah menguntungkan arah eksoterm.'], tips:['Tentukan dulu reaksi eksoterm atau endoterm.','Perhatikan sisi mana yang menerima penambahan zat.'], difficulty:'Tinggi', time:'16 Menit', prereq:'Asas Le Chatelier' },
  { id:'m7', type:'file', title:'Mekanika Tekanan-Volume & Peran Katalisator', meta:'Dokumen • 19 halaman', summary:'Materi membahas bagaimana perubahan tekanan and volume mempengaruhi kesetimbangan gas serta peran katalis.', points:['Tekanan naik → ke arah mol gas lebih sedikit.','Volume naik → ke arah mol gas lebih banyak.','Katalis mempercepat, bukan menggeser.'], tips:['Hitung jumlah mol gas di tiap sisi.','Ingat katalis menurunkan Ea maju and balik sama besar.'], difficulty:'Sedang', time:'14 Menit', prereq:'Asas Le Chatelier' },
  { id:'m8', type:'link', title:'Bank Contoh Soal Kc dan Qc', meta:'Link • Latihan soal', summary:'Kumpulan contoh soal untuk membedakan nilai Kc dan Qc serta memprediksi arah reaksi menuju keadaan setimbang.', points:['Kc menunjukkan keadaan setimbang.','Qc digunakan untuk melihat arah reaksi.','Jika Qc < Kc, reaksi bergeser ke produk.'], tips:['Tuliskan rumus Kc sesuai koefisien.','Bandingkan Qc dan Kc secara perlahan.'], difficulty:'Tinggi', time:'18 Menit', prereq:'Rumus Tetapan Kesetimbangan' }
];

const defaultClasses = [
  { id:'c1', name:'XII IPA 1', code:'KIM-137', students:36, progress:74, quiz:8,
    roster: [
      { name: 'Adi Wijaya', score: 40, status: 'Kritis', category: 'Miskonsepsi' },
      { name: 'Syela Cantika', score: 55, status: 'Perhatian', category: 'Menebak' },
      { name: 'Fajar Mahendra', score: 88, status: 'Aman', category: 'Paham Konsep' },
      { name: 'Rafa Pratama', score: 95, status: 'Aman', category: 'Paham Konsep' },
      { name: 'Intan Maulida', score: 72, status: 'Aman', category: 'Paham Konsep' }
    ]
  },
  { id:'c2', name:'XII IPA 2', code:'KIM-138', students:35, progress:66, quiz:7,
    roster: [
      { name: 'Dimas Arga', score: 60, status: 'Perhatian', category: 'Menebak' },
      { name: 'Nabila Putri', score: 92, status: 'Aman', category: 'Paham Konsep' },
      { name: 'Budi Santoso', score: 42, status: 'Kritis', category: 'Miskonsepsi' }
    ]
  }
];

const defaultQuestions = quizBank.flatMap(s => [
  { id:s.id+'_t1', tier:1, type:s.topic, question:s.tier1.question, options:s.tier1.options, answer:s.tier1.answer, reason:'' },
  { id:s.id+'_t3', tier:3, type:s.topic, question:s.tier3.question, options:s.tier3.options, answer:s.tier3.answer, reason:'' }
]);

const defaultState = {
  role:'siswa', page:'login', joinedClass:false, selectedClassIndex:0,
  activeModuleFilter:'all', activeModule:null, arStage:'pilih_misi', activeMission:'misi1',
  currentSetIndex:0, currentTier:1, quizResults:[], selectedOption:null, confidence:null,
  quizTimeLeft:600, quizTimerActive:false, colorblind:false,
  profile:{
    siswa:{ name:'Suci Ramadhani', email:'suci@student.archemy.id', school:'SMA Negeri 1 Kimia', className:'XI IPA 1', password:'123456' },
    guru:{ name:'Ibu Misnawati S.Pd', email:'misnawati@guru.archemy.id', school:'SMA Negeri 1 Kimia', className:'Guru Kimia', password:'123456' }
  },
  modules: defaultModules, questions: defaultQuestions, classes: defaultClasses,
  teacherEditingQuestionId:null, ar:{ suhu:25, tekanan:2.2, konsentrasi:0.8, volume:2.0 }
};

let state = loadState();
const app = document.getElementById('app');
const toastEl = document.getElementById('toast');
let toastTimer, quizInterval = null, arParticles = [];

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem('archemyState'));
    if (!saved) return structuredClone(defaultState);
    if (saved.classes && saved.classes.some(c => !c.roster)) {
      localStorage.removeItem('archemyState');
      return structuredClone(defaultState);
    }
    return {
      ...structuredClone(defaultState), ...saved,
      profile:{ ...structuredClone(defaultState.profile), ...(saved.profile||{}) },
      modules: saved.modules?.length ? saved.modules : structuredClone(defaultModules),
      questions: saved.questions?.length ? saved.questions : structuredClone(defaultQuestions),
      classes: saved.classes?.length ? saved.classes : structuredClone(defaultClasses),
      ar:{ ...structuredClone(defaultState.ar), ...(saved.ar||{}) }
    };
  } catch { return structuredClone(defaultState); }
}

function saveState() { localStorage.setItem('archemyState', JSON.stringify(state)); }
function toast(msg) { clearTimeout(toastTimer); toastEl.textContent=msg; toastEl.classList.add('show'); toastTimer=setTimeout(()=>toastEl.classList.remove('show'),2200); }
function setRole(r) { state.role=r; saveState(); render(); }
function go(page) {
  state.page=page;
  if (!['studentQuiz', 'studentQuizPage'].includes(page)) { state.selectedOption=null; state.confidence=null; }
  saveState(); render();
  requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'instant'}));
}
function profile() { return state.profile[state.role]; }
function activeClass() { return state.classes[state.selectedClassIndex]||state.classes[0]; }
function hasBottomNav() { return !['login','register','joinClass','teacherClasses'].includes(state.page); }
function goHome() { if (state.role==='siswa') go(state.joinedClass?'studentDashboard':'joinClass'); else go('teacherClasses'); }
function previousPage() { return state.role==='siswa'?'studentDashboard':'teacherClasses'; }

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

function header({back=false,titleBackPage=null,coins=true}={}) {
  const starIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.1 6.6.9-4.8 4.7 1.1 6.6L12 17.3l-5.8 3 1.1-6.6L2.5 9l6.6-.9z"/></svg>`;
  const gemIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 2h11l4.5 6-10 14L2 8zm.5 2L4 8h4.5l2-4zm5 0 2 4H14l-1.5-4zm6.5 2h-2.5l-2-4H16zM5.5 10l4.5 9.5L5 10zm6.5 9.5L16.5 10H8zm5-9.5h-4.5l4.5 9.5z"/></svg>`;
  return `<div class="topbar">
    <button class="logo ${back?'back-logo':''}" onclick="window.${back?`go('${titleBackPage||previousPage()}')`:'goHome()'}" aria-label="ARChemy">
      ${back?'<span class="back">‹</span>':''}<b>ARC</b>hemy
    </button>
    <div class="topbar-right">
      <div class="header-actions">
        <button class="header-icon" onclick="window.toast('Belum ada notifikasi baru')" aria-label="notifikasi">${ICONS.bell}</button>
        <button class="header-icon" onclick="window.go('profile')" aria-label="profil">${ICONS.user}</button>
      </div>
      ${coins&&state.role==='siswa'?`<div class="coins"><span class="coin xp">${starIcon} 25</span><span class="coin gem">${gemIcon} 70</span></div>`:''}
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
function pageWrap(content, opts={}) { app.innerHTML = `<section class="screen ${opts.noNav?'no-nav':''}">${content}</section>${bottomNav()}`; document.body.classList.toggle('colorblind', state.colorblind); }

/* ========== AUTH CONTEXT ========== */
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
  state.profile[state.role].email=email; saveState(); toast('Login berhasil');
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
  saveState(); toast('Akun berhasil dibuat'); if (state.role==='siswa') go('joinClass'); else go('teacherClasses');
}

/* ========== STUDENT JOIN CLASS ========== */
function renderJoinClass() {
  pageWrap(`${header({coins:false})}
    <h1 class="page-title">Masukkan Kode Kelas</h1><p class="page-subtitle">Gunakan kode yang diberikan oleh guru kimia kamu untuk bergabung ke kelas.</p>
    <div class="glass-card hero-topic" style="min-height:170px"><span class="label">Kode contoh</span><h2>KIM-137</h2><button class="hero-action" onclick="window.fillCode()">Gunakan kode</button></div>
    <div class="card"><div class="field"><label>Kode kelas</label><input id="classCode" class="input" placeholder="Contoh: KIM-137"></div><button class="btn full" onclick="window.joinClass()">Gabung Kelas</button></div>`,{noNav:true});
}
function fillCode() { document.getElementById('classCode').value='KIM-137'; }
function joinClass() {
  const code=document.getElementById('classCode').value.trim().toUpperCase(); const cls=state.classes.find(c=>c.code===code); if (!cls) return toast('Kode kelas belum ditemukan');
  state.joinedClass=true; state.profile.siswa.className=cls.name; state.selectedClassIndex=state.classes.indexOf(cls); saveState(); toast(`Berhasil bergabung ke ${cls.name}`); go('studentDashboard');
}

/* ========== STUDENT DASHBOARD ========== */
function renderStudentDashboard() {
  const p=state.profile.siswa;
  pageWrap(`${header()}
    <h1 class="page-title">Halo ${firstName(p.name)}!</h1><p class="page-subtitle">Siap berpetualang bersama Chemy?</p>
    <div class="glass-card hero-topic"><span class="label">Topik Terakhir</span><h2>Kesetimbangan Kimia</h2><button class="hero-action" onclick="window.go('studentModules')">Lanjutkan</button></div>
    <div class="card activity-card"><div class="flask"></div><div><h3 style="margin:0 0 12px">Progres Aktivitas</h3>${progressRow('Modul yang sudah dipelajari',20)}${progressRow('Kuis yang sudah dikerjakan',10)}${progressRow('WebAR yang sudah disimulasikan',40)}</div></div>
    <div class="card activity-card"><div class="flask"></div><div><h3 style="margin:0 0 12px">Kemampuan</h3>${progressRow('Pemahaman baik',60)}${progressRow('Pemahaman kurang',40)}<button class="btn small-btn" style="float:right;margin-top:8px" onclick="window.go('studentResult')">Lihat detail</button></div></div>
    <section class="leaderboard-wrap"><div class="podium">${podiumUser('Tiara Yanti','first')}${podiumUser('Joshua Den','second')}${podiumUser('Ambar','third')}<div class="podium-number">1</div></div><div class="rank-list">${['Suci Ramadhani','Rafa Pratama','Nabila Putri','Dimas Arga','Intan Maulida'].map((n,i)=>`<div class="rank-row"><span>${i+4}.</span><span class="avatar-sm">${ICONS.user}</span><span>${n}</span></div>`).join('')}</div></section>`);
}

function podiumUser(name,pos) { return `<div class="podium-user ${pos}"><div class="avatar">${ICONS.user}</div><b>${name}</b></div>`; }
function progressRow(label,pct,cls='') { return `<div class="progress-row"><span class="label">${label}</span><span class="pct">${pct}%</span><div class="bar"><div class="bar-fill ${cls}" style="--w:${pct}%"></div></div></div>`; }

/* ========== MODULES ENGINE ========== */
function renderStudentModules() {
  const filter=state.activeModuleFilter; const modules=state.modules.filter(m=>filter==='all'||m.type===filter);
  pageWrap(`${header()}<h1 class="page-title">Modul Pembelajaran</h1><div class="tabs">${tab('all','Semua')}${tab('file','File')}${tab('video','Video')}${tab('link','Link')}</div><div class="module-list">${modules.map(moduleCard).join('')||`<div class="empty-state">Belum ada modul.</div>`}</div>${state.activeModule?moduleSheet(state.modules.find(m=>m.id===state.activeModule)):''}`);
}
function tab(id,label) { return `<button class="tab ${state.activeModuleFilter===id?'active':''}" onclick="window.setModuleFilter('${id}')">${label}</button>`; }
function setModuleFilter(f) { state.activeModuleFilter=f; state.activeModule=null; saveState(); render(); }
function moduleIcon(type) { if (type==='video') return `<div class="module-icon video">${ICONS.play}</div>`; if (type==='link') return `<div class="module-icon link">${ICONS.link}</div>`; return `<div class="module-icon">${ICONS.file}</div>`; }
function typeLabel(type) { return type==='file'?'Dokumen':type==='video'?'Video':'Link'; }
function typePillClass(type) { return type==='file'?'type-doc':type==='video'?'type-video':'type-link'; }
function moduleCard(m) { return `<button class="module-card fold" onclick="window.openModule('${m.id}')"><div class="module-icon-wrap">${moduleIcon(m.type)}</div><h3 class="module-title">${escapeHtml(m.title)}</h3><div class="module-meta"><span class="pill ${typePillClass(m.type)}">${typeLabel(m.type)}</span><span class="pill ai">✦ Ringkasan AI</span></div></button>`; }
function openModule(id) { state.activeModule=id; saveState(); render(); }
function closeModule() { state.activeModule=null; saveState(); render(); }
function moduleSheet(m) {
  if (!m) return '';
  return `<div class="sheet"><div class="sheet-title"><h3>✦ Ringkasan AI</h3><span class="pill">${typeLabel(m.type)}</span></div><div class="module-card" style="box-shadow:none;min-height:70px;margin-bottom:10px">${moduleIcon(m.type)}<div><h3 class="module-title">${escapeHtml(m.title)}</h3><p class="small muted" style="margin:0">${escapeHtml(m.meta)}</p></div></div><div class="sheet-block"><h4>Ringkasan</h4><div class="summary-card">${escapeHtml(m.summary)}</div></div><div class="sheet-block"><h4>Poin Penting</h4><div class="summary-card"><ul style="padding-left:18px;margin:0">${m.points.map(p=>`<li>${escapeHtml(p)}</li>`).join('')}</ul></div></div><div class="sheet-block"><h4>Tips Belajars</h4><div class="summary-card"><ul style="padding-left:18px;margin:0">${m.tips.map(t=>`<li>${escapeHtml(t)}</li>`).join('')}</ul></div></div><div class="sheet-block"><h4>AI Insight</h4><div class="insight-card"><div class="insight-row"><span>▣ Tingkat Kesulitan</span><span class="tag">${escapeHtml(m.difficulty)}</span></div><div class="insight-row"><span>◉ Estimasi Waktu</span><span class="tag">${escapeHtml(m.time)}</span></div></div></div><div class="actions-row" style="margin-top:12px"><button class="btn" onclick="window.closeModule()">Tutup</button></div></div>`;
}

/* ========== ADAPTIVE QUIZ CONTEXT ========== */
function startQuiz() { state.currentSetIndex=0; state.currentTier=1; state.quizResults=[]; state.selectedOption=null; state.confidence=null; state.quizTimeLeft=600; state.quizTimerActive=true; saveState(); startTimer(); go('studentQuizPage'); }
function startTimer() { clearInterval(quizInterval); quizInterval = setInterval(()=>{ if (state.quizTimeLeft<=0) { executeQuizEnd(); return; } state.quizTimeLeft--; const el=document.getElementById('quizTimer'); if (el) { const m=Math.floor(state.quizTimeLeft/60); const s=state.quizTimeLeft%60; el.textContent=`⏱ ${String(m).padStart(2,'0')} : ${String(s).padStart(2,'0')}`; } },1000); }
function renderStudentQuiz() {
  if (!state.quizTimerActive && state.quizResults.length===0) {
    pageWrap(`${header()}<h1 class="page-title">Kuis Adaptif 4-Tier</h1><p class="page-subtitle">Uji pemahamanmu tentang kesetimbangan kimia secara berlapis!</p><div class="glass-card hero-topic" style="min-height:180px"><span class="label">Kesetimbangan Kimia</span><h2>10 Set Soal • Evaluasi Diagnostik</h2><button class="hero-action" onclick="window.startQuiz()">Mulai Kuis</button></div>`); return;
  }
}
function renderStudentQuizPage() {
  const set = quizBank[state.currentSetIndex]; if(!set) return executeQuizEnd();
  const tier = state.currentTier; const currentStep=(state.currentSetIndex*4)+(tier); const progress=Math.round((currentStep/40)*100); const m=Math.floor(state.quizTimeLeft/60); const s=state.quizTimeLeft%60; const tierClasses=[1,2,3,4].map(t=>{ if(t<tier) return 'done'; if(t===tier) return 'active'; return ''; });
  let questionContent='';
  if (tier===1||tier===3) {
    const q=tier===1?set.tier1:set.tier3;
    questionContent=`<div class="quiz-card"><h3>${tier===1?'Tier 1 — Jawaban Konsep':'Tier 3 — Alasan Ilmiah'}: ${escapeHtml(q.question)}</h3><div class="option-list">${q.options.map((o,i)=>`<button class="option ${state.selectedOption===i?'selected':''}" onclick="window.selectOption(${i})"><b>${String.fromCharCode(65+i)}.</b><span>${escapeHtml(o)}</span></button>`).join('')}</div></div>`;
  } else {
    questionContent=`<div class="confidence-card"><h4>Seberapa yakin dengan argumentasi Anda?</h4><div class="conf-grid">${['Tidak Yakin','Yakin','Sangat Yakin'].map(c=>`<button class="conf-btn ${state.confidence===c?'active':''}" onclick="window.selectConfidence('${c}')">${c}</button>`).join('')}</div></div>`;
  }
  pageWrap(`${header()}<div class="quiz-head"><div><h1 class="page-title">Kuis Adaptif</h1></div><span class="timer" id="quizTimer">⏱ ${String(m).padStart(2,'0')} : ${String(s).padStart(2,'0')}</span></div><div class="quiz-progress"><div class="fill" style="--w:${progress}%"></div></div><div class="tier-tabs">${[1,2,3,4].map((t,i)=>`<button class="tier ${tierClasses[i]}">Tier ${t}</button>`).join('')}</div>${questionContent}<button class="btn full" style="margin-top:16px" onclick="window.saveAndNext()">Simpan & Lanjut</button>`);
}

function selectOption(i) { state.selectedOption=i; saveState(); render(); }
function selectConfidence(c) { state.confidence=c; saveState(); render(); }

function saveAndNext() {
  const tier = state.currentTier; const setIdx = state.currentSetIndex; const currentSet = quizBank[setIdx]; if (!currentSet) return executeQuizEnd();
  if (tier === 1 || tier === 3) { if (state.selectedOption === null) return toast('Pilih opsi jawaban dulu!'); } else { if (!state.confidence) return toast('Pilih tingkat keyakinan dulu!'); }
  let result = state.quizResults.find(r => r.topic === currentSet.topic); if (!result) { result = { topic: currentSet.topic, setIndex: setIdx }; state.quizResults.push(result); }
  if (tier === 1) { result.tier1Answer = state.selectedOption; result.tier1Correct = state.selectedOption === currentSet.tier1.answer; }
  else if (tier === 2) { result.tier2Confidence = state.confidence; }
  else if (tier === 3) { result.tier3Answer = state.selectedOption; result.tier3Correct = state.selectedOption === currentSet.tier3.answer; }
  else if (tier === 4) {
    result.tier4Confidence = state.confidence; const isConf = c => c === 'Yakin' || c === 'Sangat Yakin';
    if (result.tier1Correct && isConf(result.tier2Confidence) && result.tier3Correct && isConf(result.tier4Confidence)) result.category = 'Paham Konsep';
    else if (result.tier1Correct && !isConf(result.tier2Confidence)) result.category = 'Menebak';
    else if (!result.tier1Correct && isConf(result.tier2Confidence) && !result.tier3Correct && isConf(result.tier4Confidence)) result.category = 'Miskonsepsi';
    else result.category = 'Tidak Paham';
  }
  state.selectedOption = null; state.confidence = null;
  if (tier < 4) { state.currentTier = tier + 1; saveState(); render(); } else {
    if (result.category === 'Miskonsepsi') {
      saveState(); let reqMisi = currentSet.topic === 'Pengaruh Tekanan dan Volume' ? 'misi2' : 'misi1';
      openModal('🚨 Diagnosis AI: Deteksi Miskonsepsi!', `<p style="font-size:13px; line-height:1.5;">Sistem mendeteksi kamu mengalami <b>Miskonsepsi Sejati</b> pada topik ${escapeHtml(currentSet.topic)}.</p>`, `<button class="btn full" onclick="window.closeModal(); state.arStage='mulai_ar'; state.activeMission='${reqMisi}'; window.saveState(); window.go('studentWebAR');">📱 Pergi ke Lab WebAR</button><button class="btn ghost full" onclick="window.closeModal(); window.jalankanLompatanAdaptif('${currentSet.topic}', false);">Lewati & Lanjut</button>`);
    } else { jalankanLompatanAdaptif(currentSet.topic, true); }
  }
}

function jalankanLompatanAdaptif(currentTopic, isSuccess) {
  const routing = TOPIC_ROUTING[currentTopic]; const nextTopicTarget = isSuccess ? routing.nextOnSuccess : routing.nextOnFail;
  if (nextTopicTarget === 'END') { executeQuizEnd(); } else { const nextTargetIdx = quizBank.findIndex(q => q.topic === nextTopicTarget); if (nextTargetIdx >= 0) { state.currentSetIndex = nextTargetIdx; state.currentTier = 1; saveState(); render(); } else { executeQuizEnd(); } }
}
function executeQuizEnd() { clearInterval(quizInterval); quizInterval = null; state.quizTimerActive = false; saveState(); go('studentResult'); }
function resetQuiz() { clearInterval(quizInterval); quizInterval = null; state.currentSetIndex = 0; state.currentTier = 1; state.quizResults = []; saveState(); go('studentQuiz'); }

function generateAIDiagnosisPayload(results) { const miskonsepsiTopik = results.filter(r => r.category === 'Miskonsepsi').map(r => r.topic); if (miskonsepsiTopik.length > 0) return { title: "✦ Hasil Evaluasi Gemini AI", text: "Sistem mendeteksi struktur Miskonsepsi Sejati pada ingatan kognitif Anda.", actionText: "Sembuhkan Miskonsepsi via AR" }; return { title: "✦ Hasil Evaluasi Gemini AI", text: "Pemahaman konsep kesetimbangan kimia Anda sudah sangat kokoh dan bebas miskonsepsi.", actionText: "Eksplorasi Lab AR" }; }
function renderStudentResult() {
  const results = state.quizResults; const total = results.length; const correct = results.filter(r => r.tier1Correct).length; const score = total ? Math.round((correct / total) * 100) : 0; const circumference = 2 * Math.PI * 45; const offset = circumference - (score / 100) * circumference; const aiPayload = generateAIDiagnosisPayload(results);
  pageWrap(`${header({ back: true })}<h1 class="page-title">Hasil Kuis 4-Tier</h1><div class="glass-card" style="border-radius:26px; text-align:center; margin-bottom:14px; padding: 15px;"><div class="score-circle-wrap" style="position:relative; width:100px; height:100px; margin:0 auto 10px;"><svg viewBox="0 0 100 100" style="transform: rotate(-90deg); width:100%; height:100%;"><circle cx="50" cy="50" r="45" fill="none" stroke="#eee" stroke-width="8"/><circle cx="50" cy="50" r="45" fill="none" stroke="var(--purple)" stroke-width="8" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/></svg><div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:22px; font-weight:bold;">${score}%</div></div></div><div style="background:#1e1b4b; padding: 16px; border-radius: 20px; color: white; margin-bottom: 14px;"><h4 style="margin:0 0 6px; color: #00E5FF;">${aiPayload.title}</h4><p style="font-size:12px; opacity:0.9;">${aiPayload.text}</p><button class="btn full" style="margin-top:10px;" onclick="window.go('studentWebAR')">${aiPayload.actionText}</button></div><div class="actions-row"><button class="btn" onclick="window.resetQuiz()">Ulangi Kuis</button></div>`);
}

/* ========== LABORATORIUM WEBAR 4 QUEST INTERAKTIF ========== */
/* ==========================================================================
   🎮 GAME QUEST ENGINE: SIMPLE & FUN FOR HIGH SCHOOL STUDENTS (ANGKA BULAT)
   ========================================================================== */
function evaluasiSkenarioMisi() {
  const ar = state.ar;
  let title = ""; let story = ""; let feedback = ""; let statusColor = "#ff4a4a";

  switch (state.activeMission) {
    case 'misi1':
      title = "🧪 Misi 1: Menyetarakan Reaksi Gas Iodin (H₂ + I₂ ⇌ 2HI)";
      if (ar.suhu === 50) {
        story = "<b>🎉 KEREN! KAMU BERHASIL MENCAPAI TITIK SETIMBANG!</b><br>Laju pembentukan produk bening dan penguraian reaktan ungu sudah sama cepat.";
        feedback = "🎯 <b>Status:</b> Pada suhu pas 50°C, partikel H₂ and I₂ menyatu kaku membentuk gas HI secara konstan. Warna ungu memudar stabil, tandanya sistem seimbang!";
        statusColor = "#06d6a0"; // Hijau Sukses
      } else if (ar.suhu < 50) {
        story = "<b>Tantangan:</b> Tabung terlalu dingin! Reaksi lambat and gas masih berwarna ungu pekat.<br>🎯 <b>Tugas:</b> Geser slider Suhu naik secara perlahan sampai **tepat di angka 50°C**.";
        feedback = "⏳ Gas HI gagal terbentuk karena molekul kekurangan energi panas untuk saling bertumbukan.";
        statusColor = "#ff4a4a"; // Merah Gagal
      } else {
        story = "<b>⚠️ ALERT: REAKTOR OVERHEAT (KELEBIHAN PANAS)!</b><br>Suhu terlalu tinggi merusak kestabilan produk.";
        feedback = "📢 Panas berlebih membuat molekul HI pecah kembali jadi gas reaktan. Turunkan slider lagi ke **50°C**!";
        statusColor = "#ffb703"; // Kuning Warning
      }
      break;

    case 'misi2':
      title = "🏭 Misi 2: Redam Kabut Polusi Cokelat (2NO₂ ⇌ N₂O₄)";
      if (ar.volume === 2.0) {
        story = "<b>🎉 BERHASIL! KABUT COKELAT BERHASIL DIREDAM!</b><br>Tekanan ruang menyempit memaksa partikel berpasangan.";
        feedback = "🎯 <b>Status:</b> Volume sempit (2.0 L) menaikkan tekanan reaktor. Sesuai hukum kimia, molekul NO₂ cokelat berpasangan menjadi N₂O₄ yang jernih!";
        statusColor = "#06d6a0";
      } else {
        story = "<b>Tantangan:</b> Ruangan reaktor terlalu longgar! Gas polusi cokelat menyebar bebas.<br>🎯 <b>Tugas:</b> Perkecil boks reaktor dengan menggeser slider Volume **pas ke angka 2.0 L**.";
        feedback = "⏳ Tekanan terlalu rendah membiarkan gas polutan NO₂ bergerak bebas mengotori udara kota virtual.";
        statusColor = "#ff4a4a";
      }
      break;

    case 'misi3':
      title = "🌋 Misi 3: Pabrik Pupuk Amonia Maksimal (N₂ + 3H₂ ⇌ 2NH₃)";
      if (ar.konsentrasi === 1.0) {
        story = "<b>🎉 MANTAP! PRODUKSI PUPUK MENCAPAI TITIK PUNCAK!</b><br>Suntikan konsentrasi bahan baku berada di posisi seimbang.";
        feedback = "🎯 <b>Status:</b> Kadar reaktan menyentuh 1.0 M mendorong kesetimbangan bergeser maju ke arah kanan (produk amonia) secara kontinu and efisien!";
        statusColor = "#06d6a0";
      } else {
        story = "<b>Tantangan:</b> Pabrik pupuk mogok karena pasokan gas hidrogen menipis.<br>🎯 <b>Tugas:</b> Tambahkan pasokan gas reaktan dengan menggeser slider Konsentrasi **ke angka 1.0 M**.";
        feedback = "⏳ Yield amonia merah hambar karena peluang molekul untuk saling bertumbukan terlalu sedikit.";
        statusColor = "#ff4a4a";
      }
      break;

    case 'misi4':
      title = "🩸 Misi 4: Menyetabilkan Sel Buffer Darah Tubuh";
      if (ar.tekanan === 3.0) {
        story = "<b>🎉 HOMEOSTASIS TERCAPAI! pH DARAH KEMBALI NORMAL (7.4)!</b><br>Sistem buffer bikarbonat sukses mengunci keseimbangan darah.";
        feedback = "🎯 <b>Status:</b> Tekanan skala 3.0 atm mengunci laju asam karbonat and ion penetralnya berjalan seimbang, melindungi tubuh dari asidosis klinis.";
        statusColor = "#06d6a0";
      } else {
        story = "<b>Tantangan:</b> Tubuh kekurangan oksigen and membuang gas CO₂ berlebih (Alkalosis).<br>🎯 <b>Tugas:</b> Atur ritme napas dengan memosisikan slider Tekanan **pas di angka 3.0 atm**.";
        feedback = "⏳ Kondisi kritis! Kadar asam darah anjlok drastis membuat sistem pertahanan tubuh virtual tidak stabil.";
        statusColor = "#ff4a4a";
      }
      break;
  }
  return { title, story, feedback, statusColor };
}

/* ==========================================================================
   📱 PREMIUM VIEWPORT: FULL SCREEN CAMERA, ERLENMEYER 3D, LASER GRID HOLOGRAM
   ========================================================================== */
/* ==========================================================================
   📱 RENDER WEBAR PREMIUM: FULL-SCREEN CAMERA, SCI-FI BOOM TRANSITION & HUD
   ========================================================================== */
function renderStudentWebAR() {
  if (!state.arStage || state.page !== 'studentWebAR') { state.arStage = 'pilih_misi'; }
  const ar = state.ar; 
  const narasi = evaluasiSkenarioMisi();

  if (state.arStage === 'pilih_misi') {
    pageWrap(`${header()}
      <h1 class="page-title">Laboratorium WebAR</h1>
      <p class="page-subtitle">Pilih skenario simulasi sub-mikroskopik kesetimbangan kimia.</p>
      <div class="mission-selector-grid" style="display:grid; gap:14px; margin-top:16px;">
        <div class="card" style="border-left: 6px solid #ff4a4a; cursor:pointer; padding:16px;" onclick="window.pilihMisiAr('misi1')">
          <h3 style="margin:0 0 6px; font-size:14px;">🧪 Misi 1: Gas Iodin Reversibel</h3>
          <p class="small muted" style="margin:0;">Faktor suhu pada reaksi H₂ + I₂ ⇌ 2HI.</p>
        </div>
        <div class="card" style="border-left: 6px solid #9d4edd; cursor:pointer; padding:16px;" onclick="window.pilihMisiAr('misi2')">
          <h3 style="margin:0 0 6px; font-size:14px;">🏭 Misi 2: Operasi Smog Kota</h3>
          <p class="small muted" style="margin:0;">Faktor tekanan ruang pada reaksi 2NO₂ ⇌ N₂O₄.</p>
        </div>
      </div>`);
  } 
  else if (state.arStage === 'mulai_ar') {
    pageWrap(`${header({back: true, titleBackPage: 'studentWebAR'})}
      
      <div id="boom-flash-overlay" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:#00e5ff; z-index:99999; opacity:0; pointer-events:none; transition: opacity 0.15s ease-out;"></div>
      
      <div class="ar-viewport-container" style="position:relative; width:100%; height:460px; border-radius:28px; overflow:hidden; background:#000; box-shadow: 0 20px 50px rgba(0,0,0,0.5); margin-bottom:12px;">
        
        <video id="ar-camera-feed" autoplay playsinline style="position:absolute; width:100%; height:100%; object-fit:cover; z-index:1; pointer-events:none;"></video>
        
        <div style="position:absolute; top:12px; left:12px; z-index:99; background:rgba(15,23,42,0.85); backdrop-filter:blur(8px); padding:8px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.15); box-shadow:0 8px 32px rgba(0,0,0,0.3);">
          <span style="font-size:9px; color:#00e5ff; font-weight:800; text-transform:uppercase; display:block; margin-bottom:2px;">Persamaan Reaksi Spasial</span>
          <code id="hud-chemical-equation" style="font-size:12px; font-weight:bold; color:#fff; font-family:monospace;">
            ${state.activeMission==='misi1' ? 'H₂ + I₂ ⇌ 2HI' : '2NO₂ ⇌ N₂O₄'}
          </code>
        </div>

        <div style="position:absolute; top:12px; right:12px; z-index:99; background:rgba(255,255,255,0.92); backdrop-filter:blur(8px); padding:8px 12px; border-radius:12px; font-size:10px; display:flex; flex-direction:column; gap:4px; box-shadow:0 8px 24px rgba(0,0,0,0.25); min-width:105px;">
          <span style="font-weight:800; color:var(--purple); font-size:9px; text-transform:uppercase; margin-bottom:2px;">🔑 Legenda Zat</span>
          <div style="display:flex; align-items:center; gap:6px;"><span style="width:8px; height:8px; background:#ffffff; border:1px solid #94a3b8; border-radius:50%;"></span><span><b>H₂</b> (Reaktan)</span></div>
          <div style="display:flex; align-items:center; gap:6px;"><span style="width:8px; height:8px; background:#a78bfa; border-radius:50%;"></span><span><b>I₂</b> (Reaktan)</span></div>
          <div style="display:flex; align-items:center; gap:6px;"><span style="width:8px; height:8px; background:linear-gradient(90deg, #fff 50%, #a78bfa 50%); border-radius:50%;"></span><span><b>HI</b> (Produk)</span></div>
        </div>

        <a-scene embedded vr-mode-ui="enabled: false" renderer="alpha: true; antialias: true; colorManagement: true;" style="position:absolute; width:100%; height:100%; z-index:2;">
          <a-entity camera position="0 0 0"></a-entity>
          
          <a-entity light="type: ambient; intensity: 0.6;"></a-entity>
          <a-entity light="type: directional; intensity: 0.8; position: 1 3 1;"></a-entity>
          
          <a-entity id="ar-world-anchor" position="0 -0.22 -0.8">
            <a-ring color="#00e5ff" radius-inner="0.32" radius-outer="0.34" rotation="-90 0 0" position="0 -0.45 0" material="opacity:0.7; transparent:true; shader:flat;"></a-ring>
            <a-circle color="#00e5ff" radius="0.33" rotation="-90 0 0" position="0 -0.44 0" material="wireframe:true; opacity:0.25; transparent:true; shader:flat;"></a-circle>

            <a-cone id="visual-tabung-bawah" radius-bottom="0.32" radius-top="0.09" height="0.65" position="0 -0.12 0" color="${ar.suhu === 50 && state.activeMission==='misi1' ? '#f8fafc' : '#8a2be2'}" material="opacity: 0.25; transparent: true; roughness:0.05; metalness:0.4; side:double;"></a-cone>
            <a-cylinder id="visual-tabung-atas" radius="0.09" height="0.3" position="0 0.25 0" color="${ar.suhu === 50 && state.activeMission==='misi1' ? '#f8fafc' : '#8a2be2'}" material="opacity: 0.25; transparent: true; roughness:0.05; metalness:0.4; side:double;"></a-cylinder>

            <a-sphere id="ar-collision-flash" position="0 -0.1 0" radius="0.01" color="#ffff00" material="shader:flat; opacity:0; transparent:true;"></a-sphere>

            <a-entity id="particle-cloud" position="0 -0.12 0"></a-entity>
          </a-entity>
        </a-scene>

        <div id="live-feedback-box" style="position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); z-index: 99; width: 92%; background: rgba(255, 255, 255, 0.95); padding: 12px; border-radius: 16px; border-left: 6px solid ${narasi.statusColor}; font-size: 11px; line-height: 1.4; color:#0f172a; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
          <div id="live-feedback-text">${narasi.feedback}</div>
        </div>
      </div>

      <h3 class="section-title" style="margin-top:4px; margin-bottom:8px; font-size:12px; text-transform:uppercase; color:var(--ink); letter-spacing:0.5px;">🎛️ Modifikasi Parameter Kesetimbangan</h3>
      <div class="controls-layout" style="display:grid; grid-template-columns:1fr 1fr; gap:8px; width:100%;">
        ${control('suhu', '🌡️ Kalor (Suhu)', '°C', ar.suhu, 20, 100, 1)}
        ${control('volume', '🧪 Vol Ruang', 'L', ar.volume, 1, 5, 0.1)}
        ${control('tekanan', '🎛️ Kompresor', 'atm', ar.tekanan, 1, 5, 0.1)}
        ${control('konsentrasi', '💧 Kadar Zat', 'M', ar.konsentrasi, 0.1, 2, 0.1)}
      </div>
      
      <button class="btn ghost full" style="margin-top:14px" onclick="window.keluarMisiAr()">← Keluar Halaman Kamera</button>`);

    initArCamera();
    pemicuEfekBoomSciFi(); // Jalankan efek transisi kilatan saat pertama kali masuk portal kamera!
    const sceneEl = document.querySelector('a-scene');
    if (sceneEl) { if (sceneEl.hasLoaded) initArParticles(); else sceneEl.addEventListener('loaded', initArParticles); }
  }
}

// 💥 FUNGSI EFEX BOOM TRANSISI HOLOGRAPHIC PORTAL
function pemicuEfekBoomSciFi() {
  const flash = document.getElementById('boom-flash-overlay');
  if (!flash) return;
  flash.style.opacity = '0.9';
  setTimeout(() => { flash.style.opacity = '0'; }, 200);
}

function pilihMisiAr(idMisi) { state.arStage = 'mulai_ar'; state.activeMission = idMisi; saveState(); render(); }
function keluarMisiAr() { state.arStage = 'pilih_misi'; saveState(); render(); }

function initArCamera() {
  const video = document.getElementById('ar-camera-feed'); if(!video) return;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
    .then(stream => { video.srcObject = stream; })
    .catch(() => { navigator.mediaDevices.getUserMedia({ video: true }).then(s => video.srcObject = s).catch(()=>{}); });
}

function initArParticles() {
  const cloud = document.getElementById('particle-cloud'); if (!cloud) return;
  cloud.innerHTML = ''; arParticles = [];
  const s = state.ar.suhu;
  const v = state.ar.volume;
  const k = state.ar.konsentrasi;
  const p = state.ar.tekanan;

  if (state.activeMission === 'misi1') {
    if (s < 45) {
      buatKlusterMolekulKaku(cloud, 'H2'); buatKlusterMolekulKaku(cloud, 'H2'); buatKlusterMolekulKaku(cloud, 'H2');
      buatKlusterMolekulKaku(cloud, 'I2'); buatKlusterMolekulKaku(cloud, 'I2'); buatKlusterMolekulKaku(cloud, 'I2');
      buatKlusterMolekulKaku(cloud, 'HI');
    } else if (s === 45) {
      buatKlusterMolekulKaku(cloud, 'H2'); buatKlusterMolekulKaku(cloud, 'I2');
      buatKlusterMolekulKaku(cloud, 'HI'); buatKlusterMolekulKaku(cloud, 'HI'); buatKlusterMolekulKaku(cloud, 'HI'); buatKlusterMolekulKaku(cloud, 'HI');
    } else {
      buatKlusterMolekulKaku(cloud, 'H2'); buatKlusterMolekulKaku(cloud, 'I2');
      buatKlusterMolekulKaku(cloud, 'HI'); buatKlusterMolekulKaku(cloud, 'HI'); buatKlusterMolekulKaku(cloud, 'HI'); buatKlusterMolekulKaku(cloud, 'HI'); buatKlusterMolekulKaku(cloud, 'HI');
    }
  } else if (state.activeMission === 'misi2') {
    if (v > 2.0) {
      buatKlusterMolekulKaku(cloud, 'N2'); buatKlusterMolekulKaku(cloud, 'N2');
      buatKlusterMolekulKaku(cloud, 'H2'); buatKlusterMolekulKaku(cloud, 'H2');
      buatKlusterMolekulKaku(cloud, 'NH3');
    } else {
      buatKlusterMolekulKaku(cloud, 'N2');
      buatKlusterMolekulKaku(cloud, 'NH3'); buatKlusterMolekulKaku(cloud, 'NH3'); buatKlusterMolekulKaku(cloud, 'NH3'); buatKlusterMolekulKaku(cloud, 'NH3');
    }
  } else if (state.activeMission === 'misi3') {
    if (k < 0.8) {
      buatKlusterMolekulKaku(cloud, 'SO2'); buatKlusterMolekulKaku(cloud, 'SO2');
      buatKlusterMolekulKaku(cloud, 'O2'); buatKlusterMolekulKaku(cloud, 'O2');
    } else {
      buatKlusterMolekulKaku(cloud, 'SO2'); buatKlusterMolekulKaku(cloud, 'O2');
      buatKlusterMolekulKaku(cloud, 'SO3'); buatKlusterMolekulKaku(cloud, 'SO3'); buatKlusterMolekulKaku(cloud, 'SO3');
    }
  } else if (state.activeMission === 'misi4') {
    if (p < 3.0) {
      buatKlusterMolekulKaku(cloud, 'H2CO3'); buatKlusterMolekulKaku(cloud, 'H2CO3');
      buatKlusterMolekulKaku(cloud, 'HCO3');
    } else {
      buatKlusterMolekulKaku(cloud, 'H2CO3');
      buatKlusterMolekulKaku(cloud, 'HCO3'); buatKlusterMolekulKaku(cloud, 'HCO3'); buatKlusterMolekulKaku(cloud, 'HCO3');
    }
  }

  loopArSimulation();
}

function buatKlusterMolekulKaku(parent, jenis) {
  const molekulInti = document.createElement('a-entity');
  
  // Sebaran koordinat dibatasi agar partikel rapi berkumpul di perut Erlenmeyer
  const px = (Math.random() - 0.5) * 0.18; 
  const py = (Math.random() - 0.5) * 0.35; 
  const pz = (Math.random() - 0.5) * 0.18;
  molekulInti.setAttribute('position', `${px} ${py} ${pz}`);
  
  // Rotasi lambat konstan biar juri bisa melihat struktur 3D dari segala sisi secara mewah
  molekulInti.setAttribute('animation', 'property: rotation; to: 360 360 0; loop: true; dur: 7000; easing: linear');

  if (jenis === 'H2') {
    // Dua atom hidrogen putih kaku terikat stik abu-abu
    tambahBolaAtom3D(molekulInti, '-0.035 0 0', '0.026', '#ffffff');
    tambahBolaAtom3D(molekulInti, '0.035 0 0', '0.026', '#ffffff');
    tambahIkatanStik3D(molekulInti, '0 0 0', '0 0 90', '0.07', '0.016', '#64748b'); 
  } 
  else if (jenis === 'I2') {
    // Dua atom iodin besar ungu metalik terikat stik tebal
    tambahBolaAtom3D(molekulInti, '-0.045 0 0', '0.044', '#a78bfa');
    tambahBolaAtom3D(molekulInti, '0.045 0 0', '0.044', '#a78bfa');
    tambahIkatanStik3D(molekulInti, '0 0 0', '0 0 90', '0.09', '0.022', '#475569');
  } 
  else if (jenis === 'HI') {
    // 1 Putih + 1 Ungu menyatu kokoh menandakan produk senyawa baru
    tambahBolaAtom3D(molekulInti, '-0.035 0 0', '0.026', '#ffffff');
    tambahBolaAtom3D(molekulInti, '0.035 0 0', '0.044', '#a78bfa');
    tambahIkatanStik3D(molekulInti, '0 0 0', '0 0 90', '0.07', '0.018', '#475569');
  }

  parent.appendChild(molekulInti);
  arParticles.push({
    el: molekulInti,
    jenis: jenis,
    vx: (Math.random() - 0.5) * 0.003,
    vy: (Math.random() - 0.5) * 0.003,
    vz: (Math.random() - 0.5) * 0.003
  });
}

function tambahBolaAtom3D(parent, posisi, radius, warna) {
  const atom = document.createElement('a-sphere');
  atom.setAttribute('position', posisi); atom.setAttribute('radius', radius); atom.setAttribute('color', warna);
  atom.setAttribute('material', 'roughness: 0.25; metalness: 0.1'); parent.appendChild(atom);
}
function tambahIkatanStik3D(parent, posisi, rotasi, panjang, radius, warna) {
  const stick = document.createElement('a-cylinder');
  stick.setAttribute('position', posisi); stick.setAttribute('rotation', rotasi); stick.setAttribute('height', panjang); stick.setAttribute('radius', radius); stick.setAttribute('color', warna);
  stick.setAttribute('material', 'roughness: 0.5; metalness: 0.2'); parent.appendChild(stick);
}

/* ==========================================================================
   🔬 QUANTUM VECTOR ENGINE: AUTOMATIC PARABOLIC ACCURATE WALL BOUNCING
   ========================================================================== */
/* ==========================================================================
   🔬 QUANTUM VECTOR ENGINE: AUTOMATIC PARABOLIC ACCURATE WALL BOUNCING
   ========================================================================== */
function loopArSimulation() {
  const cloud = document.getElementById('particle-cloud');
  if(!cloud || state.page !== 'studentWebAR') return;
  
  const factorSuhu = 1 + (state.ar.suhu - 25) * 0.05;
  
  arParticles.forEach((p, idx) => {
    let curr = p.el.getAttribute('position');
    let nx = curr.x + (p.vx * factorSuhu);
    let ny = curr.y + (p.vy * factorSuhu);
    let nz = curr.z + (p.vz * factorSuhu);

    // KONTROL DINDING PARABOLIK: Menghitung radius kerucut Erlenmeyer agar partikel tidak tembus keluar kaca
    const heightPct = (ny - (-0.3)) / 0.6;
    let currentRadiusLimit = 0.22 - (heightPct * 0.15);
    
    if (ny > 0.3) currentRadiusLimit = 0.07;
    if (ny < -0.3) currentRadiusLimit = 0.23;

    // Deteksi batas dinding miring
    if (Math.abs(nx) > currentRadiusLimit) { p.vx *= -1; nx = Math.sign(nx) * currentRadiusLimit; }
    if (Math.abs(nz) > currentRadiusLimit) { p.vz *= -1; nz = Math.sign(nz) * currentRadiusLimit; }
    if (ny > 0.45 || ny < -0.3) p.vy *= -1;

    p.el.setAttribute('position', `${nx} ${ny} ${nz}`);

    // INTERAKSI REAL-TIME: Simulasi Tumbukan "BOOM" antar molekul acak
    if (idx % 2 === 0 && Math.random() < 0.015 && state.ar.suhu > 20) {
      const flash = document.getElementById('ar-collision-flash');
      if (flash) {
        // Posisikan kilatan kuning di koordinat partikel yang sedang bertabrakan
        flash.setAttribute('position', `${nx} ${ny} ${nz}`);
        flash.setAttribute('material', 'opacity: 0.9');
        // Skala denyut partikel membesar instan menandakan reaksi kaku terjadi
        p.el.setAttribute('scale', '1.3 1.3 1.3');
        
        setTimeout(() => {
          if(flash) flash.setAttribute('material', 'opacity: 0');
          if(p.el) p.el.setAttribute('scale', '1 1 1');
        }, 80);
      }
    }
  });
  
  requestAnimationFrame(loopArSimulation);
}

function control(key, label, unit, value, min, max, step = 1) {
  const isLockedM1 = (state.activeMission === 'misi1' && state.ar.suhu === 45 && key === 'suhu');
  const isLockedM2 = (state.activeMission === 'misi2' && state.ar.volume === 2.0 && key === 'volume');
  const isLockedM3 = (state.activeMission === 'misi3' && state.ar.konsentrasi === 0.8 && key === 'konsentrasi');
  const isLockedM4 = (state.activeMission === 'misi4' && state.ar.tekanan === 3.0 && key === 'tekanan');
  const disabledAttr = (isLockedM1 || isLockedM2 || isLockedM3 || isLockedM4) ? 'disabled' : '';

  return `<div class="card control-card" style="padding:14px 16px; width: 100%; box-sizing: border-box; display: block; margin-bottom: 4px; opacity: ${disabledAttr?'0.75':'1'}">
    <div class="control-head" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
      <b style="font-size:13px; color:var(--ink);">${label}</b>
      <span id="${key}Val" style="font-size:13px; font-weight:bold; color:var(--purple); background:rgba(107,54,207,0.08); padding:3px 10px; border-radius:8px;">${value} ${unit} ${disabledAttr?'🔒 SETIMBANG':''}</span>
    </div>
    <div class="range-wrap" style="width: 100%; display: block;">
      <input type="range" min="${min}" max="${max}" step="${step}" value="${value}" ${disabledAttr} oninput="window.updateAr('${key}',this.value,'${unit}')" style="width: 100%; display: block; margin: 0; padding: 0; cursor: pointer;">
    </div>
  </div>`;
}

function updateAr(key, value, unit) {
  const n = Number(value); state.ar[key] = Number.isInteger(n) ? n : Number(n.toFixed(1));
  const el = document.getElementById(`${key}Val`); if (el) el.textContent = `${state.ar[key]} ${unit}`; saveState();
  
  const narasi = evaluasiSkenarioMisi();
  const storyTxt = document.getElementById('live-story-text'); const fbBox = document.getElementById('live-feedback-box'); const fbTxt = document.getElementById('live-feedback-text'); const tabung = document.getElementById('visual-tabung');
  if (storyTxt) storyTxt.innerHTML = narasi.story; if (fbTxt) fbTxt.innerHTML = narasi.feedback; if (fbBox) fbBox.style.borderLeftColor = narasi.statusColor;
  
  if (tabung) {
    if (state.activeMission === 'misi1') {
      tabung.setAttribute('color', state.ar.suhu > 45 ? '#e0e9f5' : '#8a2be2');
      tabung.setAttribute('material', `opacity: ${state.ar.suhu > 45 ? '0.12' : '0.25'}; transparent: true;`);
    } else if (state.activeMission === 'misi2') {
      tabung.setAttribute('color', state.ar.volume === 2.0 ? '#06d6a0' : '#4cc3c3');
    } else if (state.activeMission === 'misi3') {
      tabung.setAttribute('color', state.ar.konsentrasi === 0.8 ? '#06d6a0' : '#f59e0b');
    } else if (state.activeMission === 'misi4') {
      tabung.setAttribute('color', state.ar.tekanan === 3.0 ? '#06d6a0' : '#ef4444');
    }
  }

  if (state.activeMission === 'misi1' && state.ar.suhu === 45) {
    render();
    openModal('🔬 AI Post-Lab Debriefing: Misi 1 Sukses!', `<div style="font-size:12px; line-height:1.5; color:#334155; text-align:left;"><p><b>Selamat, Eksperimenmu Berhasil!</b> Ini analisis ilmiah tiga level representasi kimianya:</p><ul style="padding-left:16px; margin:8px 0;"><li><b>Makroskopis (Warna):</b> Gas Iodin (I₂) ungu pekat memudar jernih stabil karena reaksi pembentukan HI menyerap panas (Endoterm) saat diatur ke 45°C.</li><li><b>Sub-Mikroskopis (Partikel):</b> Molekul reaktan H₂ dan I₂ pecah menabrak satu sama lain secara efektif, menyusun ikatan kaku baru berbentuk produk HI.</li><li><b>Dinamis Kesetimbangan:</b> Di titik ini, jumlah reaktan yang berubah menjadi produk sama cepatnya dengan produk yang kembali pecah terurai menjadi reaktan!</li></ul></div>`, `<button class="btn full" onclick="window.closeModal(); window.go('studentDashboard');">🎮 Kembali ke Beranda Game</button>`);
  } else if (state.activeMission === 'misi2' && state.ar.volume === 2.0) {
    render();
    openModal('🔬 AI Post-Lab Debriefing: Misi 2 Sukses!', `<div style="font-size:12px; line-height:1.5; color:#334155; text-align:left;"><p><b>Boom! Gas Amonia Berhasil Di-Sintesis!</b> Ini ringkasan teorinya:</p><ul style="padding-left:16px; margin:8px 0;"><li><b>Faktor Tekanan:</b> Memperkecil Volume ke 2.0 L memicu tekanan reaktor melonjak. Sesuai hukum Le Chatelier, sistem geser ke arah total mol terkecil.</li><li><b>Pergeseran:</b> Sisi reaktan punya 4 mol (N₂ + 3H₂) dan sisi produk cuma punya 2 mol (NH₃). Kesetimbangan bergeser maju drastis ke kanan memproduksi amonia.</li></ul></div>`, `<button class="btn full" onclick="window.closeModal(); window.go('studentDashboard');">🎮 Kembali ke Beranda Game</button>`);
  } else if (state.activeMission === 'misi3' && state.ar.konsentrasi === 0.8) {
    render();
    openModal('🔬 AI Post-Lab Debriefing: Misi 3 Sukses!', `<div style="font-size:12px; line-height:1.5; color:#334155; text-align:left;"><p><b>Katalis & Konsentrasi Berhasil Disetarakan!</b></p><ul style="padding-left:16px; margin:8px 0;"><li><b>Hukum Kadar Zat:</b> Saat reaktan disuntik melimpah ke skala 0.8 M, sistem terdorong bergerak menjauhi area penumpukan tersebut (geser maju ke produk SO₃).</li></ul></div>`, `<button class="btn full" onclick="window.closeModal(); window.go('studentDashboard');">🎮 Kembali ke Beranda Game</button>`);
  } else if (state.activeMission === 'misi4' && state.ar.tekanan === 3.0) {
    render();
    openModal('🔬 AI Post-Lab Debriefing: Misi 4 Sukses!', `<div style="font-size:12px; line-height:1.5; color:#334155; text-align:left;"><p><b>Homeostasis Buffer Tubuh Stabil!</b></p><ul style="padding-left:16px; margin:8px 0;"><li><b>Buffer Bikarbonat:</b> Kestabilan laju ion karbonat terkunci kaku, mengamankan kadar asam-basa dari ancaman asidosis maupun alkalosis klinis.</li></ul></div>`, `<button class="btn full" onclick="window.closeModal(); window.go('studentDashboard');">🎮 Kembali ke Beranda Game</button>`);
  }
}

function toggleColorblind() { state.colorblind=!state.colorblind; saveState(); render(); }

/* ========== GURU CONTEXT: MANAGEMENT KELAS ========== */
function renderTeacherClasses() {
  pageWrap(`
    <div style="text-align:center; padding-top:20px;"><h1 class="page-title">Pilih Kelas</h1><p class="page-subtitle">Sistem Pemantauan Analitik Guru</p></div>
    <div class="coverflow-wrap">
      <button class="coverflow-btn prev" onclick="window.moveCoverflow(-1)">‹</button>
      <div class="coverflow-track" id="coverflowTrack">
        ${state.classes.map((cls,i)=>`<div class="coverflow-slide" onclick="window.selectCoverflowClass(${i}, '${cls.id}')"><div class="coverflow-content"><h3>${escapeHtml(cls.name)}</h3><span>${cls.students} Siswa • Kode: ${escapeHtml(cls.code)}</span></div><button class="btn full">Masuk Dasbor</button></div>`).join('')}
      </div>
      <button class="coverflow-btn next" onclick="window.moveCoverflow(1)">›</button>
    </div>
    <div style="padding:0 28px; margin-top:20px;"><button class="btn ghost full" onclick="window.showAddClassModal()">+ Buat Kelas Baru</button></div>`, {noNav:true});
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
function selectCoverflowClass(idx, id) { state.selectedClassIndex = idx; saveState(); go('teacherDashboard'); }

function renderTeacherDashboard() {
  const c=activeClass();
  pageWrap(`${header({coins:false, back:true, titleBackPage:'teacherClasses'})}
    <h1 class="page-title">Dasbor Kelas</h1>
    <div class="glass-card teacher-hero" style="padding:15px;">
      <span class="class-tag" style="background:rgba(255,255,255,0.25); padding:3px 8px; border-radius:8px;">${escapeHtml(c.name)}</span>
      <div style="margin-top:10px; font-weight:bold;">${escapeHtml(state.profile.guru.name)}</div>
      <div class="stat-grid"><div class="stat-mini"><b>${c.students}</b><span>Siswa</span></div><div class="stat-mini"><b>${c.progress}%</b><span>Progres</span></div><div class="stat-mini"><b>${c.quiz} Soal</b><span>Kuis</span></div></div>
    </div>
    <div class="two-stat" style="margin-top:14px;">
      <button class="stat-card" onclick="window.go('teacherClassDetail')"><strong>Siswa</strong><span>Daftar & Nilai</span></button>
      <button class="stat-card" onclick="window.go('teacherModules')"><strong>Modul</strong><span>Materi</span></button>
    </div>`);
}

function showAddClassModal() { openModal('Buat Kelas Baru', '<div class="field"><label>Nama Kelas Baru</label><input id="newClassName" class="input" placeholder="Contoh: XI IPA 4"></div>', '<button class="btn full" onclick="window.addClass()">Buat Kelas</button><button class="btn ghost full" onclick="window.closeModal()">Batal</button>'); }
function addClass() {
  const name=document.getElementById('newClassName').value.trim(); if(!name) return toast('Isi nama kelas!');
  const code=`KIM-${Math.floor(140+Math.random()*850)}`; state.classes.push({id:`c${Date.now()}`,name,code,students:32,progress:0,quiz:10,roster:[]});
  state.selectedClassIndex=state.classes.length-1; saveState(); closeModal(); render(); toast(`Kelas baru ${code} aktif!`);
}

function renderTeacherClassDetail() {
  const c = activeClass();
  pageWrap(`${header({coins:false, back:true, titleBackPage:'teacherDashboard'})}
    <h1 class="page-title">Kelola Kelas</h1><p class="page-subtitle">Informasi manajemen data siswa & rekapitulasi nilai.</p>
    <div class="glass-card" style="padding: 18px; margin-bottom: 16px; min-height: auto;"><h3 style="margin:0 0 4px;">${escapeHtml(c.name)}</h3><p class="small" style="margin:0; opacity:0.9;">Kode Gabung: <b>${escapeHtml(c.code)}</b> | Total: ${c.students} Siswa</p></div>
    <h3 class="section-title">Daftar Murid & Capaian</h3>
    <div class="info-list">
      ${c.roster.map(s => `<div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:12px; margin-bottom:10px;"><div style="display:flex; align-items:center; gap:10px;"><span class="avatar-sm">${ICONS.user}</span><div><b style="font-size:13px; display:block;">${escapeHtml(s.name)}</b><span class="small muted">${s.category}</span></div></div><div style="text-align:right;"><b style="font-size:16px; color:var(--purple); display:block;">${s.score}</b><span class="badge ${s.status==='Kritis'?'miskonsepsi':s.status==='Perhatian'?'menebak':'paham'}" style="font-size:9px; padding:2px 6px;">${s.status}</span></div></div>`).join('')}
    </div>`);
}

function renderTeacherModules() {
  pageWrap(`${header({coins:false, back:true, titleBackPage:'teacherDashboard'})}<h1 class="page-title">Kelola Modul</h1><div class="card add-panel"><div class="field"><label>Judul Modul</label><input id="moduleTitle" class="input" placeholder="Ketik judul"></div><div class="field"><label>Ringkasan</label><textarea id="moduleSummary" class="textarea" placeholder="Isi draf ringkasan"></textarea></div><button class="btn full" onclick="window.addModule()">Unggah Materi</button></div><div class="module-list" style="margin-top:14px;">${state.modules.map(m=>`<div class="card"><b>${escapeHtml(m.title)}</b></div>`).join('')}</div>`);
}
function addModule() {
  const title=document.getElementById('moduleTitle').value.trim(); const summary=document.getElementById('moduleSummary').value.trim(); if(!title||!summary) return toast('Judul & Ringkasan wajib diisi!');
  state.modules.unshift({id:`m${Date.now()}`,type:'file',title,meta:'Dokumen Baru',summary,points:['Materi baru.'],tips:['Baca teliti.'],difficulty:'Sedang',time:'10 Menit',prereq:'Dasar'});
  saveState(); toast('Materi terunggah!'); render();
}

function renderTeacherQuiz() {
  pageWrap(`${header({coins:false, back:true, titleBackPage:'teacherDashboard'})}<h1 class="page-title">Kelola Kuis</h1><p class="page-subtitle">Silahkan buat dan kelola kuis kognitif berjenjang.</p><button class="btn" style="min-height:36px; padding:0 14px; border-radius:999px; margin-bottom:18px;" onclick="window.newQuestion()"><span style="font-size:16px; font-weight:bold;">+</span> Buat Kuis</button><div class="quiz-history-list"><div class="card" style="padding:14px; margin-bottom:14px; border-radius:18px;"><div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:10px;"><div style="flex:1;"><h4 style="margin:0; font-size:14px; color:var(--ink);">Kuis Diagnostik Topik 3</h4><span class="small muted">Karakteristik Sistem Homogen dan Heterogen</span></div><span class="badge paham" style="background:var(--purple); color:white; font-size:9px; padding:2px 8px;">Aktif</span></div><div class="tier-tabs" style="display:grid; grid-template-columns:repeat(4,1fr); gap:4px; margin-bottom:10px;"><span style="background:var(--soft); text-align:center; font-size:10px; padding:3px; border-radius:4px; font-weight:600; color:var(--purple)">Tier 1</span><span style="background:var(--soft); text-align:center; font-size:10px; padding:3px; border-radius:4px; font-weight:600; color:var(--purple)">Tier 2</span><span style="background:var(--soft); text-align:center; font-size:10px; padding:3px; border-radius:4px; font-weight:600; color:var(--purple)">Tier 3</span><span style="background:var(--soft); text-align:center; font-size:10px; padding:3px; border-radius:4px; font-weight:600; color:var(--purple)">Tier 4</span></div><div style="display:flex; justify-content:space-between; text-align:center; background:#fbfaff; padding:8px; border-radius:10px; margin-bottom:10px; border:1px solid #f0ecf8;"><div><b style="font-size:15px; display:block;">28</b><span class="small muted">selesai</span></div><div><b style="font-size:15px; display:block;">8</b><span class="small muted">belum</span></div><div><b style="font-size:15px; display:block; color:var(--purple);">78%</b><span class="small muted">rata-rata</span></div></div><div style="display:flex; justify-content:space-between; align-items:center;"><button class="btn ghost small-btn" onclick="window.editQuestion('qs3')">📝 Edit</button><span class="small" style="color:var(--danger); font-weight:600;">Tenggat: 2 hari 3 jam</span></div></div><div class="card" style="padding:14px; margin-bottom:14px; border-radius:18px;"><div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:10px;"><div style="flex:1;"><h4 style="margin:0; font-size:14px; color:var(--ink);">Kuis Diagnostik Topik 2</h4><span class="small muted">Kesetimbangan Kimia Dinamis</span></div><span class="badge tidak-paham" style="font-size:9px; padding:2px 8px;">Selesai</span></div><div style="display:flex; justify-content:space-between; text-align:center; background:#fbfaff; padding:8px; border-radius:10px; margin-bottom:10px; border:1px solid #f0ecf8;"><div><b style="font-size:15px; display:block;">36</b><span class="small muted">selesai</span></div><div><b style="font-size:15px; display:block;">0</b><span class="small muted">belum</span></div><div><b style="font-size:15px; display:block; color:var(--success);">90%</b><span class="small muted">rata-rata</span></div></div><button class="btn plain small-btn" style="width:100%" onclick="window.go('teacherAnalysis')">📊 Lihat Hasil Analisis</button></div></div>`);
}

function newQuestion() { state.teacherEditingQuestionId = null; saveState(); go('teacherEditQuiz'); }
function editQuestion(id) { state.teacherEditingQuestionId = id; saveState(); go('teacherEditQuiz'); }
function renderTeacherEditQuiz() {
  const isEdit = state.teacherEditingQuestionId !== null;
  let qData = { question: 'Karakteristik Sistem Homogen dan Heterogen...', type: 'Topik 3', tier: 1, optA: 'Sistem homogen fasa sama', optB: 'Sistem heterogen fasa beda', optC: 'Semua benar', optD: 'Semua salah', ans: 0 };
  pageWrap(`${header({back:true, titleBackPage:'teacherQuiz', coins:false})}<h1 class="page-title">${isEdit ? 'Edit Parameter Kuis' : 'Buat Kuis Baru'}</h1><p class="page-subtitle">Formulir pengaturan butir soal instan diagnostic 4-Tier.</p><div class="card"><div class="field"><label>Judul / Topik Kuis</label><input id="qType" class="input" value="${escapeHtml(qData.type)}"></div><div class="field"><label>Target Evaluasi</label><select id="qTier" class="select"><option value="1">Tier 1 & 2 (Pernyataan Konsep & Keyakinan)</option><option value="3">Tier 3 & 4 (Alasan Ilmiah & Keyakinan)</option></select></div><div class="field"><label>Teks Pertanyaan Utama</label><textarea id="qText" class="textarea">${escapeHtml(qData.question)}</textarea></div><div class="form-grid"><div class="field"><label>Pilihan Jawaban A</label><input id="qOpt0" class="input" value="${escapeHtml(qData.optA)}"></div><div class="field"><label>Pilihan Jawaban B</label><input id="qOpt1" class="input" value="${escapeHtml(qData.optB)}"></div><div class="field"><label>Pilihan Jawaban C</label><input id="qOpt2" class="input" value="${escapeHtml(qData.optC)}"></div><div class="field"><label>Pilihan Jawaban D</label><input id="qOpt3" class="input" value="${escapeHtml(qData.optD)}"></div></div><button class="btn full" style="margin-top:14px;" onclick="window.saveQuestion()">Simpan Perubahan Kuis</button></div>`);
}

function saveQuestion() {
  const type = document.getElementById('qType').value.trim(); const tier = parseInt(document.getElementById('qTier').value); const question = document.getElementById('qText').value.trim(); const options = [document.getElementById('qOpt0').value.trim(), document.getElementById('qOpt1').value.trim(), document.getElementById('qOpt2').value.trim(), document.getElementById('qOpt3').value.trim()]; const qAnsEl = document.getElementById('qAns'); const answer = qAnsEl ? parseInt(qAnsEl.value) : 0;
  if(!type || !question || !options[0] || !options[1]) return toast('Mohon lengkapi parameter soal!');
  if (state.teacherEditingQuestionId !== null) { const idx = state.questions.findIndex(q => q.id === state.teacherEditingQuestionId); if(idx >= 0) state.questions[idx] = { id: state.teacherEditingQuestionId, tier, type, question, options, answer, reason:'' }; } else { state.questions.unshift({ id: `q_${Date.now()}`, tier, type, question, options, answer, reason:'' }); }
  saveState(); toast('Bank soal berhasil diperbarui!'); go('teacherQuiz');
}

function renderTeacherAnalysis() {
  const c = activeClass();
  pageWrap(`${header({back:true,titleBackPage:'teacherDashboard',coins:false})}<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;"><div><h1 class="page-title" style="margin:0;">Analisis Kognitif</h1><p class="page-subtitle" style="margin:0;">${escapeHtml(c.name)} - Real-Time</p></div><button class="btn small-btn" style="background:#10b981;" onclick="window.eksporLaporanPDF()">📥 Cetak PDF</button></div><div id="area-cetak-laporan" style="padding:5px; background:#fff;"><div class="pdf-only-header" style="margin-bottom:15px; border-bottom:2px solid #6b36cf; padding-bottom:5px;"><h3 style="margin:0; color:#6b36cf;">ARChemy - Learning Analytics Report</h3><p style="margin:0; font-size:11px; color:#555;">Rapor Diagnosis Kombinasi Evaluasi Kuis 4-Tier Kelas ${escapeHtml(c.name)}</p></div><div class="card"><b>🚨 Capaian Rasio Salah Terbesar Kelas</b><br><br>${progressRow('Parameter Efek Kalor Suhu Termal',80,'red')}${progressRow('Mekanika Kerapatan Ruang Volume',40,'yellow')}</div><h3 class="section-title">Daftar Siswa Butuh Perhatian (Watchlist)</h3><div class="card">${studentAttention('Adi Wijaya', 40, 'Kritis')}${studentAttention('Syela Cantika', 55, 'Perhatian')}</div></div>`);
}
function studentAttention(name,score,status) { return `<div class="student-row" style="margin-bottom:8px; display:flex; justify-content:space-between; padding:8px; border:1px solid #eee; border-radius:10px;"><span><b>${name}</b> (${score}%)</span> <span class="badge ${status==='Kritis'?'miskonsepsi':'menebak'}">${status}</span></div>`; }
function eksporLaporanPDF() {
  const element = document.getElementById('area-cetak-laporan'); const nameKls = state.classes[state.selectedClassIndex]?.name || 'Kelas'; toast('⏳ Memproses draf cetak PDF...');
  const opsi = { margin: [15, 12, 15, 12], filename: `Laporan_ARChemy_${nameKls}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true, logging: false }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
  html2pdf().set(opsi).from(element).save().then(() => { toast('🎉 PDF Berhasil diunduh!'); }).catch(() => { toast('✘ Gagal ekspor PDF.'); });
}

/* ========== PROFIL SYSTEM ========== */
function renderProfile() {
  const p=profile();
  pageWrap(`${header({back:true,titleBackPage:state.role==='siswa'?'studentDashboard':'teacherDashboard',coins:state.role==='siswa'})}<div class="glass-card profile-hero" style="text-align:center;"><h2>${escapeHtml(p.name)}</h2><p>${state.role==='siswa'?'Siswa':'Guru'} • ${escapeHtml(p.school)}</p></div><div class="card info-list" style="margin-top:14px;"><div class="info-row"><b>Email</b><span>${escapeHtml(p.email)}</span></div><div class="info-row"><b>Instansi</b><span>${escapeHtml(p.school)}</span></div></div><div class="actions-row" style="margin-top:14px;"><button class="btn danger full" onclick="window.logout()">Logout Akun</button></div>`);
}
function logout() { state.page='login'; state.joinedClass=false; state.arStage='pilih_misi'; clearInterval(quizInterval); saveState(); render(); toast('Keluar akun sukses'); }

/* ========== ENGINE RUNNERS & UTILITIES ========== */
function firstName(name) { return (name||'').split(' ')[0]||'User'; }
function escapeHtml(str) { return String(str??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s])); }

function render() {
  const routes = {
    login:renderLogin, register:renderRegister, joinClass:renderJoinClass,
    studentDashboard:renderStudentDashboard, studentModules:renderStudentModules,
    studentQuiz:renderStudentQuiz, studentQuizPage:renderStudentQuizPage, studentResult:renderStudentResult, studentWebAR:renderStudentWebAR,
    teacherClasses:renderTeacherClasses, teacherDashboard:renderTeacherDashboard,
    teacherModules:renderTeacherModules, teacherQuiz:renderTeacherQuiz,
    teacherEditQuiz:renderTeacherEditQuiz, teacherAnalysis:renderTeacherAnalysis, profile:renderProfile,
    teacherClassDetail: renderTeacherClassDetail,
  };
  (routes[state.page]||renderLogin)();
}

/* ==========================================================================
   BULLETPROOF BRIDGE ENGINE: MENGIKAT SELURUH SISTEM KE GLOBAL WINDOW
   ========================================================================== */
if (typeof window !== 'undefined') {
  window.state = state; window.saveState = saveState; window.toast = toast; window.go = go; window.goHome = goHome; window.setRole = setRole; window.logout = logout; window.closeModal = closeModal; window.submitLogin = submitLogin; window.submitRegister = submitRegister; window.fillCode = fillCode; window.joinClass = joinClass; window.setModuleFilter = setModuleFilter; window.openModule = openModule; window.closeModule = closeModule; window.startQuiz = startQuiz; window.selectOption = selectOption; window.selectConfidence = selectConfidence; window.saveAndNext = saveAndNext; window.resetQuiz = resetQuiz; window.jalankanLompatanAdaptif = jalankanLompatanAdaptif; window.executeQuizEnd = executeQuizEnd; window.pilihMisiAr = pilihMisiAr; window.keluarMisiAr = keluarMisiAr; window.updateAr = updateAr; window.toggleColorblind = toggleColorblind; window.moveCoverflow = moveCoverflow; window.selectCoverflowClass = selectCoverflowClass; window.showAddClassModal = showAddClassModal; window.addClass = addClass; window.addModule = addModule; window.newQuestion = newQuestion; window.saveQuestion = saveQuestion; window.eksporLaporanPDF = eksporLaporanPDF; window.editQuestion = editQuestion;
}

render();