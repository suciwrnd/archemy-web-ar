import * as THREE from 'three';

/* ==========================================================================
   ARCHEMY WEBAR ENGINE v9.0 — PhET-Grade 3D with Visible Route & Phased Learning
   
   Each phase has a clear purpose, duration, and educational content.
   The molecule travels along a visible glowing route — direction is always clear.
   ========================================================================== */

export function requestSensorPermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission().catch(() => {});
  }
}

// ---------------------------------------------------------------------------
// MISI DATA — Complete educational content per phase per mission
// ---------------------------------------------------------------------------
export const MISI_DATA = {
  misi1: {
    judul: 'Reaksi Gas Iodin',
    persamaan: 'H₂(g) + I₂(g) ⇌ 2HI(g)',
    hook: 'Gurumu mengatakan reaksi sudah setimbang. Tapi... apakah reaksi benar-benar berhenti?',
    jenis: 'H2', pasangan: 'I2', produk: 'HI',
    deltaH: 'endoterm',
    tool_correct: 'heat',
    
    phases: {
      ENTERING:    'Kamu adalah molekul H₂. Dalam toples tertutup ini, kamu tidak pernah sendirian — dan tidak pernah diam.',
      REACTION_1:  null, // Silent — let them notice
      AFTER_R1:    'Kamu baru saja bertumbukan dengan I₂ dan membentuk HI. Perhatikan bentukmu yang baru.',
      REACTION_2:  null, // Still silent
      AFTER_R2:    'Loh? Mengapa kamu bisa kembali menjadi H₂ dan I₂? Ikatan yang tadi terbentuk... putus begitu saja?',
      REACTION_3:  null,
      PAUSE:       'Kamu sudah berubah 3 kali. Bukan karena ada yang rusak — tapi karena reaksi maju dan balik terjadi bersamaan, terus-menerus.',
      ZOOMOUT:     'Lihat seluruh sistem. Setiap molekul H₂, I₂, dan HI terus bereaksi bolak-balik. Namun jumlah keseluruhannya... tetap sama. Inilah yang disebut Kesetimbangan Dinamis.',
      EXPERIMENT:  'Sekarang kamu bisa mengubah kondisi sistem. Reaksi H₂ + I₂ ⇌ 2HI bersifat endoterm — menyerap panas. Coba ubah suhunya, dan amati apa yang terjadi pada kesetimbangan.',
    },
    challenge_q: 'Reaksi H₂ + I₂ ⇌ 2HI adalah reaksi endoterm. Untuk memperbanyak HI, yang harus dilakukan adalah?',
    challenge_opts: [
      { text: '🔥 Naikkan suhu — reaksi endoterm menyerap panas, bergeser ke produk', correct: true },
      { text: '❄️ Turunkan suhu — supaya molekul bergerak lebih lambat', correct: false },
      { text: '📦 Naikkan tekanan — supaya molekul lebih sering bertumbukan', correct: false },
    ],
    challenge_explanation: 'Benar! Menurut Le Chatelier, menaikkan suhu pada reaksi endoterm menggeser kesetimbangan ke arah produk (HI), karena sistem "menyerap" kelebihan panas itu.',
    reflection_q: 'Kembali ke pertanyaan awal: Apakah reaksi pada sistem setimbang benar-benar berhenti?',
    reflection_opts: [
      { text: 'Ya, reaksi berhenti karena konsentrasi tidak berubah lagi.', correct: false },
      { text: 'Tidak — reaksi maju dan balik terus terjadi dengan laju yang sama.', correct: true },
      { text: 'Tidak — hanya reaksi ke kanan yang masih berlangsung.', correct: false },
    ],
    reflection_explanation: 'Tepat! Ini adalah inti dari Kesetimbangan Dinamis: reaksi tidak pernah berhenti, namun laju maju = laju balik, sehingga komposisi tampak tidak berubah.',
  },

  misi2: {
    judul: 'Smog Kota — Dinitrogen Tetroksida',
    persamaan: '2NO₂(g) ⇌ N₂O₄(g)',
    hook: 'Gas NO₂ berwarna coklat berbahaya memenuhi udara kota. Namun ada gas lain yang tidak terlihat di sekitarnya — N₂O₄. Mengapa keduanya selalu hadir bersama?',
    jenis: 'NO2', pasangan: 'NO2', produk: 'N2O4',
    deltaH: 'eksoterm',
    tool_correct: 'compress',
    
    phases: {
      ENTERING:    'Kamu adalah molekul NO₂ — gas coklat beracun penyebab smog. Kamu tidak sendirian di sini.',
      REACTION_1:  null,
      AFTER_R1:    'Kamu bertumbukan dengan NO₂ lain dan bersatu menjadi N₂O₄. Perhatikan warnamu yang berbeda — N₂O₄ tidak berwarna!',
      REACTION_2:  null,
      AFTER_R2:    'Ikatan N₂O₄ tadi putus kembali menjadi 2 NO₂. Mengapa bisa terjadi? Ternyata ikatan N–N di N₂O₄ tidak terlalu kuat...',
      REACTION_3:  null,
      PAUSE:       'Kamu baru saja mengalami bolak-balik 3 kali. Di udara kota yang nyata, proses ini terjadi jutaan kali per detik — itulah mengapa NO₂ dan N₂O₄ selalu ada berdampingan.',
      ZOOMOUT:     'Lihat semua molekul di sistem. NO₂ dan N₂O₄ terus saling berubah. Di suhu ruang, N₂O₄ sedikit lebih dominan. Namun ketika panas (di siang hari), NO₂ meningkat — itulah mengapa smog lebih parah saat cuaca panas!',
      EXPERIMENT:  'Reaksi 2NO₂ ⇌ N₂O₄ bersifat eksoterm — melepas panas saat membentuk produk. Coba ubah tekanan atau suhu, dan amati pergeseran kesetimbangan.',
    },
    challenge_q: 'Polutan NO₂ bisa dikurangi dengan menggeser kesetimbangan ke arah N₂O₄ (produk). Cara yang paling efektif adalah?',
    challenge_opts: [
      { text: '📦 Naikkan tekanan — sisi produk memiliki mol gas lebih sedikit (1 mol vs 2 mol)', correct: true },
      { text: '🔥 Naikkan suhu — reaksi eksoterm melepas panas ke lingkungan', correct: false },
      { text: '➕ Tambah NO₂ — supaya lebih banyak yang bereaksi', correct: false },
    ],
    challenge_explanation: 'Tepat! Menaikkan tekanan menggeser kesetimbangan ke arah yang memiliki mol gas lebih sedikit. Sisi produk (1 mol N₂O₄) lebih sedikit dari sisi reaktan (2 mol NO₂), sehingga N₂O₄ bertambah.',
    reflection_q: 'Mengapa udara kota selalu mengandung BOTH NO₂ dan N₂O₄ secara bersamaan — tidak pernah hanya salah satunya?',
    reflection_opts: [
      { text: 'Karena keduanya adalah zat berbeda yang tidak bisa saling berubah.', correct: false },
      { text: 'Karena sistem berada dalam kesetimbangan dinamis — keduanya terus terbentuk dan terurai secara bersamaan.', correct: true },
      { text: 'Karena NO₂ terlalu stabil untuk bereaksi sempurna.', correct: false },
    ],
    reflection_explanation: 'Benar! Kesetimbangan dinamis menjamin kedua zat selalu hadir. Rasionya bergantung pada kondisi (suhu, tekanan) — itulah mengapa smog bisa lebih buruk atau lebih baik tergantung cuaca.',
  },

  misi3: {
    judul: 'Sintesis Amonia — Proses Haber',
    persamaan: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g)',
    hook: 'Proses Haber menghasilkan amonia untuk pupuk yang memberi makan setengah miliar manusia. Tapi mengapa pabrik harus beroperasi pada 400°C dan 200 atm? Mengapa tidak suhu yang lebih rendah atau tekanan yang lebih kecil?',
    jenis: 'N2', pasangan: 'H2', produk: 'NH3',
    deltaH: 'eksoterm',
    tool_correct: 'compress',
    
    phases: {
      ENTERING:    'Kamu adalah molekul N₂ yang sangat stabil — ikatan rangkap tigamu sangat kuat. Butuh energi besar untuk memecahnya agar bisa bereaksi.',
      REACTION_1:  null,
      AFTER_R1:    'Kamu bereaksi dengan 3 H₂ dan berhasil menjadi 2 NH₃! Ini yang terjadi di pabrik Haber setiap detiknya — jutaan kali.',
      REACTION_2:  null,
      AFTER_R2:    'Mengejutkan — NH₃ yang baru terbentuk bisa terurai kembali menjadi N₂ dan H₂. Ini adalah reaksi balik yang terus bersaing dengan reaksi maju.',
      REACTION_3:  null,
      PAUSE:       'Di sinilah masalah insinyur Haber: bagaimana memaksa lebih banyak N₂ dan H₂ menjadi NH₃, dan mencegah NH₃ terurai kembali? Kondisi apa yang harus dipilih?',
      ZOOMOUT:     'Lihat sistem secara keseluruhan. N₂, H₂, dan NH₃ semua bereaksi bolak-balik. Pada 400°C dan 200 atm, Haber menemukan kompromi terbaik — cukup produk, cukup cepat. Inilah optimisasi Le Chatelier dalam industri nyata.',
      EXPERIMENT:  'Reaksi N₂ + 3H₂ ⇌ 2NH₃ bersifat eksoterm (melepas panas) dan menghasilkan mol gas lebih sedikit (2 mol vs 4 mol). Coba tekanan dan suhu yang berbeda untuk memaksimalkan NH₃!',
    },
    challenge_q: 'Di pabrik Haber, NH₃ yang terbentuk selalu dikeluarkan dari reaktor secara terus-menerus (kondensasi). Apa efeknya terhadap kesetimbangan?',
    challenge_opts: [
      { text: 'Kesetimbangan bergeser ke kanan (→), menghasilkan lebih banyak NH₃ untuk menggantikan yang diambil.', correct: true },
      { text: 'Reaksi berhenti karena produknya habis.', correct: false },
      { text: 'Kesetimbangan bergeser ke kiri (←), menghasilkan lebih banyak N₂ dan H₂.', correct: false },
    ],
    challenge_explanation: 'Tepat! Mengambil produk NH₃ menurunkan konsentrasinya. Sesuai Le Chatelier, sistem merespons dengan memproduksi lebih banyak NH₃. Inilah kunci efisiensi proses Haber!',
    reflection_q: 'Mengapa pabrik Haber memilih 400°C, padahal suhu rendah lebih menguntungkan secara termodinamika untuk reaksi eksoterm?',
    reflection_opts: [
      { text: 'Karena pada 400°C, katalis besi bekerja paling efektif — trade-off antara yield dan laju reaksi.', correct: true },
      { text: 'Karena 400°C membuat tekanan otomatis meningkat.', correct: false },
      { text: 'Karena suhu tinggi membantu N₂ dan H₂ bertumbukan lebih keras.', correct: false },
    ],
    reflection_explanation: 'Benar! Ini adalah trade-off nyata dalam industri: suhu rendah menggeser kesetimbangan ke produk (lebih banyak NH₃), tapi reaksinya terlalu lambat. Suhu tinggi mempercepat reaksi, tapi kesetimbangan bergeser ke reaktan. 400°C adalah kompromi optimal dengan katalis.',
  }
};

export const PHASE = {
  ENTERING:    'ENTERING',
  JOURNEY_1:   'JOURNEY_1',
  REACTION_1:  'REACTION_1',
  JOURNEY_2:   'JOURNEY_2',
  REACTION_2:  'REACTION_2',
  JOURNEY_3:   'JOURNEY_3',
  REACTION_3:  'REACTION_3',
  PAUSE:       'PAUSE',
  ZOOMOUT:     'ZOOMOUT',
  QUIZ:        'QUIZ',
  EXPERIMENT:  'EXPERIMENT',
  CHALLENGE:   'CHALLENGE',
  REFLECTION:  'REFLECTION',
};

// Phase durations (seconds) before auto-advancing
const PHASE_DURATION = {
  ENTERING:   5,
  JOURNEY_1:  6,
  REACTION_1: 4,
  JOURNEY_2:  6,
  REACTION_2: 5,
  JOURNEY_3:  5,
  REACTION_3: 4,
  PAUSE:      7,
  ZOOMOUT:    8,
};

// ---------------------------------------------------------------------------
// SOUND ENGINE
// ---------------------------------------------------------------------------
class SoundEngine {
  constructor() {
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { this.ctx = null; }
  }
  _r() { if (this.ctx?.state === 'suspended') this.ctx.resume(); }
  
  whoosh() {
    if (!this.ctx) return; this._r();
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.connect(g); g.connect(this.ctx.destination);
    o.frequency.setValueAtTime(600, this.ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.5);
    g.gain.setValueAtTime(0.18, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
    o.start(); o.stop(this.ctx.currentTime + 0.5);
  }
  bondForm() {
    if (!this.ctx) return; this._r();
    [523, 659, 784, 1047].forEach((f, i) => {
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.connect(g); g.connect(this.ctx.destination); o.type = 'sine'; o.frequency.value = f;
      const t = this.ctx.currentTime + i * 0.08;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.10, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      o.start(t); o.stop(t + 0.5);
    });
  }
  bondBreak() {
    if (!this.ctx) return; this._r();
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.1, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random()*2-1) * Math.pow(1-i/d.length, 1.5) * 0.12;
    const s = this.ctx.createBufferSource(); s.buffer = buf;
    const f2 = this.ctx.createBiquadFilter(); f2.type = 'highpass'; f2.frequency.value = 1500;
    s.connect(f2); f2.connect(this.ctx.destination); s.start();
  }
  success() {
    if (!this.ctx) return; this._r();
    [523, 659, 784, 1047, 1319].forEach((f, i) => {
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.connect(g); g.connect(this.ctx.destination); o.frequency.value = f;
      const t = this.ctx.currentTime + i * 0.12;
      g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
      o.start(t); o.stop(t + 0.8);
    });
  }
}
export const soundEngine = new SoundEngine();

// ---------------------------------------------------------------------------
// ATOM / MOLECULE FACTORY
// ---------------------------------------------------------------------------
const ATOM_CFG = {
  H:  { color: 0xe8e8e8, emissive: 0x222222, r: 0.06 },
  I:  { color: 0x9333ea, emissive: 0x3b0080, r: 0.10 },
  N:  { color: 0x3b82f6, emissive: 0x1a3a6f, r: 0.085 },
  O:  { color: 0xef4444, emissive: 0x6f1a1a, r: 0.075 },
};

const MOLECULE_DEF = {
  H2:   [['H',-0.065,0,0],['H',0.065,0,0]],
  I2:   [['I',-0.09,0,0],['I',0.09,0,0]],
  HI:   [['H',-0.07,0,0],['I',0.08,0,0]],
  N2:   [['N',-0.065,0,0],['N',0.065,0,0]],
  NO2:  [['N',0,0.01,0],['O',-0.075,0.065,0],['O',0.075,0.065,0]],
  N2O4: [['N',-0.055,0,0],['N',0.055,0,0],['O',-0.115,0.06,0],['O',-0.115,-0.06,0],['O',0.115,0.06,0],['O',0.115,-0.06,0]],
  NH3:  [['N',0,0.055,0],['H',-0.06,-0.025,0.045],['H',0.06,-0.025,0.045],['H',0,-0.025,-0.07]],
};

export function makeMolecule(type) {
  const defs = MOLECULE_DEF[type];
  const group = new THREE.Group();
  group.userData.molType = type;

  if (!defs) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.08, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3 }));
    group.add(m); group.scale.setScalar(0.9); return group;
  }

  const pts = [];
  defs.forEach(([sym, x, y, z]) => {
    const cfg = ATOM_CFG[sym] || { color: 0xaaaaaa, emissive: 0x333333, r: 0.07 };
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(cfg.r, 28, 28),
      new THREE.MeshStandardMaterial({ color: cfg.color, emissive: cfg.emissive, emissiveIntensity: 0.18, roughness: 0.15, metalness: 0.35 })
    );
    m.position.set(x, y, z);
    group.add(m);
    pts.push(new THREE.Vector3(x, y, z));
  });

  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      if (pts[i].distanceTo(pts[j]) < 0.22) {
        const dir = pts[j].clone().sub(pts[i]).normalize();
        const len = pts[i].distanceTo(pts[j]);
        const bond = new THREE.Mesh(
          new THREE.CylinderGeometry(0.012, 0.012, len, 10),
          new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.3, metalness: 0.4 })
        );
        bond.position.copy(pts[i]).lerp(pts[j], 0.5);
        bond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
        group.add(bond);
      }
    }
  }

  group.scale.setScalar(0.9);
  return group;
}

function makeLabel(text, color = '#7df9ff') {
  const c = document.createElement('canvas');
  c.width = 320; c.height = 72;
  const ctx = c.getContext('2d');
  ctx.font = 'bold 38px Inter, sans-serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 160, 36);
  const mat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthTest: false });
  const s = new THREE.Sprite(mat); s.scale.set(0.75, 0.17, 1); return s;
}

function burst(scene, pos, color = 0x4fc3f7, count = 18) {
  const ps = [];
  for (let i = 0; i < count; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.012, 5, 5), new THREE.MeshBasicMaterial({ color, transparent: true }));
    m.position.copy(pos); scene.add(m);
    ps.push({ m, v: new THREE.Vector3((Math.random()-.5)*.22,(Math.random()-.5)*.22,(Math.random()-.5)*.22), l: 0 });
  }
  const id = setInterval(() => {
    let alive = false;
    ps.forEach(p => {
      p.l += 0.05; p.v.y -= 0.0015; p.m.position.addScaledVector(p.v, 1);
      p.m.material.opacity = Math.max(0, 1 - p.l * 2.5);
      if (p.l < 0.4) alive = true;
    });
    if (!alive) { clearInterval(id); ps.forEach(p => scene.remove(p.m)); }
  }, 16);
}

// ---------------------------------------------------------------------------
// GYRO CONTROLS
// ---------------------------------------------------------------------------
class GyroControls {
  constructor(camera) {
    this.camera = camera;
    this.dO = {};
    this.sO = 0;
    this.q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
    this.zee = new THREE.Vector3(0, 0, 1);
    this.q0 = new THREE.Quaternion();
    window.addEventListener('deviceorientation', e => this.dO = e);
    window.addEventListener('orientationchange', () => this.sO = window.orientation || 0);
    this.sO = window.orientation || 0;
  }
  update() {
    const { alpha, beta, gamma } = this.dO;
    if (!alpha && !beta && !gamma) return;
    const e = new THREE.Euler(
      THREE.MathUtils.degToRad(beta || 0),
      THREE.MathUtils.degToRad(alpha || 0),
      -THREE.MathUtils.degToRad(gamma || 0), 'YXZ'
    );
    this.camera.quaternion.setFromEuler(e);
    this.camera.quaternion.multiply(this.q1);
    this.camera.quaternion.multiply(this.q0.setFromAxisAngle(this.zee, -THREE.MathUtils.degToRad(this.sO)));
  }
}

// ---------------------------------------------------------------------------
// GLOWING ROUTE — The visible path through molecular space
// ---------------------------------------------------------------------------
class MolecularRoute {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    scene.add(this.root);
    this.root.visible = false;

    // Define the 3D path (curves through space — cinematic and clear)
    // Waypoints at t ≈ 0.28 (reaction 1), t ≈ 0.55 (reaction 2), t ≈ 0.82 (reaction 3)
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0,   0,  0),
      new THREE.Vector3(-0.5, 0.2, -3),
      new THREE.Vector3(-1.0, 0,  -6),  // Reaction 1 ≈ t=0.28
      new THREE.Vector3(-0.5, 0.3,-9),
      new THREE.Vector3(0.5,  0,  -12), // Reaction 2 ≈ t=0.55
      new THREE.Vector3(1.0,  0.2,-15),
      new THREE.Vector3(0.5,  0,  -18), // Reaction 3 ≈ t=0.82
      new THREE.Vector3(0,    0.3,-21), // End / Zoom out point
    ]);

    // Tube geometry for the glowing route
    const tubeGeo = new THREE.TubeGeometry(this.curve, 80, 0.025, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.5 });
    this.tube = new THREE.Mesh(tubeGeo, tubeMat);
    this.root.add(this.tube);

    // Outer glow tube
    const glowGeo = new THREE.TubeGeometry(this.curve, 80, 0.06, 8, false);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.08, side: THREE.BackSide });
    this.glow = new THREE.Mesh(glowGeo, glowMat);
    this.root.add(this.glow);

    // Waypoint markers (glowing spheres at collision points)
    this.waypointTs = [0.28, 0.55, 0.82];
    this.waypointColors = [0x3b82f6, 0xfbbf24, 0x3b82f6];
    this.waypoints = this.waypointTs.map((t, i) => {
      const pt = this.curve.getPointAt(t);
      const mat = new THREE.MeshBasicMaterial({ color: this.waypointColors[i], transparent: true, opacity: 0.7 });
      const wp = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 20), mat);
      wp.position.copy(pt);
      wp.userData.baseScale = 1;
      this.root.add(wp);
      
      // Ring around waypoint
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.2, 0.012, 12, 50),
        new THREE.MeshBasicMaterial({ color: this.waypointColors[i], transparent: true, opacity: 0.5 })
      );
      ring.position.copy(pt);
      ring.rotation.x = Math.PI / 2;
      this.root.add(ring);
      
      return { mesh: wp, ring, t };
    });

    // Stars
    const sGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000 * 3; i++) sPos[i] = (Math.random() - 0.5) * 50;
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    this.stars = new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0x93c5fd, size: 0.07, transparent: true, opacity: 0.6 }));
    this.root.add(this.stars);

    // Background molecules (not on route — atmospheric)
    this.bgMols = [];
    const bgColors = [0x1e3a5f, 0x3b1f6f, 0x0f3f3f];
    for (let i = 0; i < 12; i++) {
      const r = 2 + Math.random() * 2;
      const ang = Math.random() * Math.PI * 2;
      const z = -(Math.random() * 20);
      const g = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.08 + Math.random() * 0.08, 1),
        new THREE.MeshStandardMaterial({ color: bgColors[i % 3], roughness: 0.7, flatShading: true })
      );
      g.position.set(Math.cos(ang) * r, (Math.random() - 0.5) * 1.5, z);
      g.userData.floatY = Math.random() * Math.PI * 2;
      this.root.add(g);
      this.bgMols.push(g);
    }

    // Lights
    const hemi = new THREE.HemisphereLight(0x1a4a7f, 0x02040a, 1.2);
    this.root.add(hemi);
    const dir = new THREE.DirectionalLight(0x7dd3fc, 3);
    dir.position.set(3, 5, 2);
    this.root.add(dir);
    const back = new THREE.DirectionalLight(0x818cf8, 1.5);
    back.position.set(-3, -1, -3);
    this.root.add(back);
  }

  getPointAt(t) { return this.curve.getPointAt(Math.min(t, 0.999)); }
  getTangentAt(t) { return this.curve.getTangentAt(Math.min(t, 0.999)); }

  setVisible(v) { this.root.visible = v; }

  update(dt, simTime) {
    this.stars.rotation.y += dt * 0.008;

    // Pulse waypoints
    this.waypoints.forEach((wp, i) => {
      const s = 1 + Math.sin(simTime * 2 + i * 1.2) * 0.15;
      wp.mesh.scale.setScalar(s);
      wp.ring.rotation.z += dt * (0.5 + i * 0.3);
    });

    // Float bg molecules
    this.bgMols.forEach(m => {
      m.userData.floatY += dt * 0.5;
      m.position.y += Math.sin(m.userData.floatY) * dt * 0.03;
      m.rotation.y += dt * 0.2;
    });
  }
}

// ---------------------------------------------------------------------------
// SYSTEM VIEW — For Zoom-Out phase (all molecules visible)
// ---------------------------------------------------------------------------
class SystemView {
  constructor(scene, misiData) {
    this.scene = scene;
    this.misiData = misiData;
    this.molecules = [];
    this.root = new THREE.Group();
    this.root.visible = false;
    scene.add(this.root);
    this.equilibriumShift = 0;
    this._buildSystem();
  }

  _buildSystem() {
    const total = 20;
    for (let i = 0; i < total; i++) {
      const isProduct = i < total * 0.5;
      const type = isProduct ? this.misiData.produk : this.misiData.jenis;
      const mesh = makeMolecule(type);
      const angle = (i / total) * Math.PI * 2;
      const r = 1.2 + Math.random() * 1.8;
      mesh.position.set(Math.cos(angle) * r, (Math.random() - 0.5) * 2, Math.sin(angle) * r - 4);
      mesh.userData.floatOffset = Math.random() * Math.PI * 2;
      mesh.userData.reactionTimer = Math.random() * 3;
      this.molecules.push({ mesh, isProduct });
      this.root.add(mesh);
    }
  }

  show() { this.root.visible = true; }
  hide() { this.root.visible = false; }

  getProductRatio() {
    const prods = this.molecules.filter(m => m.isProduct).length;
    return prods / this.molecules.length;
  }

  update(dt) {
    if (!this.root.visible) return;
    const fwdRate = 0.25 * (1 + this.equilibriumShift);
    const revRate = 0.25 * (1 - this.equilibriumShift);

    this.molecules.forEach((mol, idx) => {
      mol.mesh.userData.reactionTimer -= dt;
      if (mol.mesh.userData.reactionTimer <= 0) {
        const goProduct = Math.random() < fwdRate / (fwdRate + revRate);
        if (!mol.isProduct && goProduct) {
          const pos = mol.mesh.position.clone();
          this.root.remove(mol.mesh);
          mol.mesh = makeMolecule(this.misiData.produk);
          mol.mesh.position.copy(pos);
          mol.isProduct = true;
          this.root.add(mol.mesh);
          burst(this.scene, pos, 0x3b82f6, 8);
        } else if (mol.isProduct && !goProduct) {
          const pos = mol.mesh.position.clone();
          this.root.remove(mol.mesh);
          mol.mesh = makeMolecule(this.misiData.jenis);
          mol.mesh.position.copy(pos);
          mol.isProduct = false;
          this.root.add(mol.mesh);
          burst(this.scene, pos, 0xfbbf24, 8);
        }
        mol.mesh.userData.reactionTimer = 1.5 + Math.random() * 2;
      }

      const t = Date.now() * 0.001 + mol.mesh.userData.floatOffset;
      mol.mesh.position.y += Math.sin(t * 0.7) * dt * 0.04;
      mol.mesh.rotation.y += dt * 0.25;
    });
  }
}

// ---------------------------------------------------------------------------
// PHASE ENGINE — Manages the educational sequence
// ---------------------------------------------------------------------------
class PhaseEngine {
  constructor({ scene, route, systemView, misiData, camera, cameraRig, onPhaseChange }) {
    this.scene = scene;
    this.route = route;
    this.systemView = systemView;
    this.misiData = misiData;
    this.camera = camera;
    this.rig = cameraRig;
    this.onPhaseChange = onPhaseChange;

    this.phase = null;
    this.phaseTimer = 0;
    this.routeT = 0;          // 0..1 along the curve
    this.routeSpeed = 0.025;  // units of t per second
    this.journeyActive = false;
    this.reactionCount = 0;

    this.playerMesh = null;
    this.playerType = null;

    // Chase cam state
    this.rigTarget = new THREE.Vector3();
    this.simTime = 0;
  }

  initPlayer() {
    if (this.playerMesh) this.scene.remove(this.playerMesh);
    this.playerType = this.misiData.jenis;
    this.playerMesh = makeMolecule(this.misiData.jenis);
    const startPt = this.route.getPointAt(0);
    this.playerMesh.position.copy(startPt);
    this.scene.add(this.playerMesh);

    const label = makeLabel('⭐ YOU', '#7df9ff');
    label.position.set(0, 0.28, 0);
    this.playerMesh.add(label);
    
    if (window._updateHUDForm) window._updateHUDForm(false, this.misiData.jenis);
  }

  morphPlayer(toProduct) {
    const wasPos = this.playerMesh?.position.clone() || new THREE.Vector3();
    if (this.playerMesh) this.scene.remove(this.playerMesh);
    
    const newType = toProduct ? this.misiData.produk : this.misiData.jenis;
    this.playerType = newType;
    this.playerMesh = makeMolecule(newType);
    this.playerMesh.position.copy(wasPos);
    this.scene.add(this.playerMesh);

    const labelColor = toProduct ? '#fde68a' : '#7df9ff';
    const label = makeLabel('⭐ YOU', labelColor);
    label.position.set(0, 0.28, 0);
    this.playerMesh.add(label);

    if (window._updateHUDForm) window._updateHUDForm(toProduct, newType);

    if (toProduct) { soundEngine.bondForm(); burst(this.scene, wasPos, 0x3b82f6); }
    else { soundEngine.bondBreak(); burst(this.scene, wasPos, 0xef4444); }
  }

  setPhase(newPhase) {
    this.phase = newPhase;
    this.phaseTimer = 0;
    const msg = this.misiData.phases[newPhase] || null;
    if (this.onPhaseChange) this.onPhaseChange(newPhase, msg);
  }

  start() {
    this.route.setVisible(true);
    this.initPlayer();
    this.setPhase(PHASE.ENTERING);
  }

  update(dt) {
    this.simTime += dt;
    this.phaseTimer += dt;
    this.route.update(dt, this.simTime);

    // Journey phases: move molecule along route
    const isJourneyPhase = [PHASE.JOURNEY_1, PHASE.JOURNEY_2, PHASE.JOURNEY_3].includes(this.phase);
    
    if (isJourneyPhase && this.playerMesh) {
      this.routeT = Math.min(this.routeT + this.routeSpeed * dt, 0.999);
      const pt = this.route.getPointAt(this.routeT);
      const tan = this.route.getTangentAt(this.routeT);

      // Smooth molecule position
      this.playerMesh.position.lerp(pt, 0.12);
      // Face direction of travel
      const lookAt = pt.clone().add(tan);
      this.playerMesh.lookAt(lookAt);

      // Update chase cam
      const behindOffset = tan.clone().negate().multiplyScalar(0.8).add(new THREE.Vector3(0, 0.3, 0));
      this.rigTarget.copy(pt).add(behindOffset);
    } else if (this.playerMesh && !isJourneyPhase) {
      // Gentle float when stopped
      this.playerMesh.position.y += Math.sin(this.simTime * 0.8) * dt * 0.04;
      this.playerMesh.rotation.y += dt * 0.5;
    }

    // Smooth camera rig towards target
    if (isJourneyPhase) {
      this.rig.position.lerp(this.rigTarget, Math.min(dt * 4, 1));
    }

    // Auto-advance phases
    switch (this.phase) {
      case PHASE.ENTERING:
        if (this.phaseTimer >= PHASE_DURATION.ENTERING) this.setPhase(PHASE.JOURNEY_1);
        break;

      case PHASE.JOURNEY_1:
        if (this.routeT >= this.route.waypointTs[0]) {
          this.reactionCount = 1;
          this.morphPlayer(true); // → Product
          this.setPhase(PHASE.REACTION_1);
        }
        break;

      case PHASE.REACTION_1:
        if (this.phaseTimer >= PHASE_DURATION.REACTION_1) {
          this.setPhase(PHASE.JOURNEY_2);
        }
        break;

      case PHASE.JOURNEY_2:
        if (this.routeT >= this.route.waypointTs[1]) {
          this.reactionCount = 2;
          this.morphPlayer(false); // → Reactant (break back)
          this.setPhase(PHASE.REACTION_2);
        }
        break;

      case PHASE.REACTION_2:
        if (this.phaseTimer >= PHASE_DURATION.REACTION_2) {
          this.setPhase(PHASE.JOURNEY_3);
        }
        break;

      case PHASE.JOURNEY_3:
        if (this.routeT >= this.route.waypointTs[2]) {
          this.reactionCount = 3;
          this.morphPlayer(true); // → Product again
          this.setPhase(PHASE.REACTION_3);
        }
        break;

      case PHASE.REACTION_3:
        if (this.phaseTimer >= PHASE_DURATION.REACTION_3) {
          this.setPhase(PHASE.PAUSE);
        }
        break;

      case PHASE.PAUSE:
        if (this.phaseTimer >= PHASE_DURATION.PAUSE) {
          this.startZoomOut();
        }
        break;

      case PHASE.ZOOMOUT:
        this.systemView.update(dt);
        const ratio = this.systemView.getProductRatio();
        if (window._updateHUDEq) window._updateHUDEq(Math.round(ratio * 100), Math.round((1 - ratio) * 100));
        if (this.phaseTimer >= PHASE_DURATION.ZOOMOUT) {
          this.setPhase(PHASE.QUIZ);
        }
        break;

      case PHASE.EXPERIMENT:
        this.systemView.update(dt);
        const r2 = this.systemView.getProductRatio();
        if (window._updateHUDEq) window._updateHUDEq(Math.round(r2 * 100), Math.round((1 - r2) * 100));
        break;
    }
  }

  startZoomOut() {
    // Hide route, show system view
    this.route.setVisible(false);
    if (this.playerMesh) { this.scene.remove(this.playerMesh); this.playerMesh = null; }

    this.systemView.show();
    soundEngine.whoosh();

    // Animate camera to bird's-eye
    const startPos = this.rig.position.clone();
    const endPos = new THREE.Vector3(0, 3.5, 1.5);
    let t = 0;
    const dur = 2.5;
    const tick = setInterval(() => {
      t += 0.016;
      const p = Math.min(t / dur, 1);
      const eased = p < 0.5 ? 2*p*p : -1+(4-2*p)*p;
      this.rig.position.lerpVectors(startPos, endPos, eased);
      if (p >= 1) clearInterval(tick);
    }, 16);

    this.setPhase(PHASE.ZOOMOUT);
  }

  triggerTool(tool) {
    if (this.phase !== PHASE.EXPERIMENT) return;
    const misi = this.misiData;
    let shift = 0;
    let msg = '';
    
    if (tool === 'heat') {
      shift = misi.deltaH === 'endoterm' ? 0.5 : -0.5;
      msg = misi.deltaH === 'endoterm'
        ? 'Suhu naik → reaksi endoterm bergeser ke produk! Perhatikan bar kesetimbangan.'
        : 'Suhu naik → reaksi eksoterm bergeser ke reaktan. Produk berkurang.';
    } else if (tool === 'cool') {
      shift = misi.deltaH === 'endoterm' ? -0.5 : 0.5;
      msg = misi.deltaH === 'endoterm'
        ? 'Suhu turun → reaksi endoterm bergeser ke reaktan. Produk berkurang.'
        : 'Suhu turun → reaksi eksoterm bergeser ke produk! Perhatikan bar kesetimbangan.';
    } else if (tool === 'compress') {
      shift = 0.5; // Pressure increase → fewer moles side (usually product)
      msg = 'Tekanan naik → kesetimbangan bergeser ke sisi mol gas lebih sedikit (produk bertambah).';
    } else if (tool === 'add') {
      shift = 0.4;
      msg = 'Konsentrasi reaktan ditambah → kesetimbangan bergeser ke kanan, produk bertambah.';
    }

    this.systemView.equilibriumShift = shift;
    soundEngine.bondForm();
    if (this.onPhaseChange) this.onPhaseChange('TOOL_USED', msg);
  }
}

// ---------------------------------------------------------------------------
// MAIN SESSION
// ---------------------------------------------------------------------------
export async function mulaiSesiARjs(canvas, videoEl, misiId, callbacks) {
  const misi = MISI_DATA[misiId] || MISI_DATA.misi1;
  const _cb = callbacks || {};

  // Camera
  let isTrueAR = false;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    videoEl.srcObject = stream;
    await videoEl.play().catch(() => {});
    isTrueAR = true;
  } catch { /* virtual mode */ }

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const scene = new THREE.Scene();

  const cameraRig = new THREE.Group();
  cameraRig.position.set(0, 0.3, 0.8);
  scene.add(cameraRig);

  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.01, 100);
  camera.rotation.x = -0.1;
  cameraRig.add(camera);

  const gyro = new GyroControls(camera);

  // Drag fallback (desktop)
  let isDrag = false, dX = 0, dY = 0, camYaw = 0, camPitch = -0.1;
  canvas.addEventListener('mousedown', e => { isDrag = true; dX = e.clientX; dY = e.clientY; });
  canvas.addEventListener('mousemove', e => {
    if (!isDrag || isTrueAR) return;
    camYaw -= (e.clientX - dX) * 0.004; dX = e.clientX;
    camPitch -= (e.clientY - dY) * 0.004; dY = e.clientY;
    camPitch = Math.max(-1, Math.min(0.5, camPitch));
    camera.rotation.set(camPitch, camYaw, 0, 'YXZ');
  });
  window.addEventListener('mouseup', () => isDrag = false);

  const route = new MolecularRoute(scene);
  const systemView = new SystemView(scene, misi);

  let currentPhase = null;
  let phaseEngine = null;
  let running = true;

  function onPhaseChange(phase, msg) {
    currentPhase = phase;
    if (_cb.onPhase) _cb.onPhase(phase, msg);
  }

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    if (phaseEngine) phaseEngine.update(dt);
    if (isTrueAR) gyro.update();
    renderer.render(scene, camera);
  });

  return {
    startJourney: () => {
      phaseEngine = new PhaseEngine({
        scene, route, systemView, misiData: misi,
        camera, cameraRig,
        onPhaseChange,
      });
      phaseEngine.start();
    },
    triggerTool: (tool) => phaseEngine?.triggerTool(tool),
    onQuizAnswered: () => {
      if (phaseEngine) phaseEngine.phase = PHASE.EXPERIMENT;
      onPhaseChange(PHASE.EXPERIMENT, misi.phases.EXPERIMENT);
      if (_cb.onChallenge) _cb.onChallenge();
    },
    onChallengeAnswered: () => {
      onPhaseChange(PHASE.CHALLENGE, '');
      if (_cb.onReflection) _cb.onReflection();
    },
    hentikan: () => {
      running = false;
      renderer.setAnimationLoop(null);
      if (videoEl?.srcObject) { videoEl.srcObject.getTracks().forEach(t => t.stop()); videoEl.srcObject = null; }
    },
  };
}

export async function deteksiModeAR() {
  if (navigator.xr) { try { if (await navigator.xr.isSessionSupported('immersive-ar')) return 'webxr'; } catch {} }
  return navigator.mediaDevices?.getUserMedia ? 'arjs' : 'unsupported';
}

export async function mulaiSesiWebXR(canvas, misiId, callbacks) {
  return mulaiSesiARjs(canvas, document.createElement('video'), misiId, callbacks);
}
