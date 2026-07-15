import * as THREE from 'three';

/* ==========================================================================
   ARCHEMY WEBAR ENGINE v8.0 — PhET-Grade 3D Molecular Simulator
   
   Philosophy: Students EXPERIENCE equilibrium, not just watch it.
   Architecture: Scene-managed, state-driven, pedagogically sequenced.
   ========================================================================== */

export function requestSensorPermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' && 
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission().catch(() => {});
  }
}

// ---------------------------------------------------------------------------
// MISI DATA — Rich pedagogical content
// ---------------------------------------------------------------------------
export const MISI_DATA = {
  misi1: {
    judul: 'Reaksi Gas Iodin',
    persamaan: 'H₂(g) + I₂(g) ⇌ 2HI(g)',
    hook: 'Gurumu mengatakan reaksi sudah setimbang. Tapi... apakah reaksi benar-benar berhenti?',
    ai_journey: 'Perhatikan apa yang terjadi...',
    ai_zoomout: 'Walaupun setiap molekul terus berubah, jumlah keseluruhan tetap sama. Inilah kesetimbangan dinamis.',
    ai_experiment: 'Sekarang kamu bisa mengubah kondisi sistem. Apa yang terjadi jika suhu dinaikkan?',
    challenge_q: 'Reaksi H₂ + I₂ ⇌ 2HI bersifat endoterm. Bagaimana cara memperbanyak produk HI?',
    challenge_opts: [
      { text: '🔥 Naikkan suhu', correct: true },
      { text: '❄️ Turunkan suhu', correct: false },
      { text: '📦 Tambah tekanan', correct: false },
    ],
    challenge_explanation: 'Karena reaksi endoterm menyerap panas, menaikkan suhu menggeser kesetimbangan ke arah produk sesuai Asas Le Chatelier.',
    reflection_q: 'Setelah semua yang kamu alami tadi, apakah reaksi pada sistem setimbang benar-benar berhenti?',
    reflection_opts: [
      { text: 'Ya, reaksi berhenti karena sudah setimbang', correct: false },
      { text: 'Tidak, reaksi maju dan balik terus berlangsung dengan laju yang sama', correct: true },
      { text: 'Tidak, tapi hanya reaksi maju yang berlangsung', correct: false },
    ],
    reflection_explanation: 'Kesetimbangan dinamis berarti reaksi maju dan balik terus berlangsung secara bersamaan, namun dengan laju yang sama sehingga konsentrasi tampak tidak berubah.',
    jenis: 'H2', pasangan: 'I2', produk: 'HI',
    deltaH: 'endoterm', // affects Le Chatelier direction
    tool_correct: 'heat',
  },
  misi2: {
    judul: 'Smog Kota — Dinitrogen Tetroksida',
    persamaan: '2NO₂(g) ⇌ N₂O₄(g)',
    hook: 'Gas NO₂ menyebabkan smog berbahaya. Dapatkah kita menguranginya tanpa menghilangkannya?',
    ai_journey: 'Kamu adalah molekul NO₂. Amati apa yang terjadi padamu...',
    ai_zoomout: 'Kamu melihat sistem secara utuh. Forward rate dan reverse rate seimbang — inilah kesetimbangan dinamis.',
    ai_experiment: 'Reaksi ini eksoterm. Jika tekanan dinaikkan, kemana kesetimbangan akan bergeser?',
    challenge_q: 'Reaksi 2NO₂ ⇌ N₂O₄ menghasilkan produk yang memiliki lebih sedikit mol gas. Untuk memperbanyak N₂O₄, caranya adalah?',
    challenge_opts: [
      { text: '📦 Naikkan tekanan', correct: true },
      { text: '🔥 Naikkan suhu', correct: false },
      { text: '❄️ Turunkan suhu dan turunkan tekanan', correct: false },
    ],
    challenge_explanation: 'Menaikkan tekanan menggeser kesetimbangan ke arah yang memiliki mol gas lebih sedikit (produk N₂O₄), sesuai Asas Le Chatelier.',
    reflection_q: 'Mengapa jumlah NO₂ dan N₂O₄ tidak berubah meski reaksinya terus berlangsung?',
    reflection_opts: [
      { text: 'Karena reaksinya sudah berhenti total', correct: false },
      { text: 'Karena laju pembentukan sama dengan laju penguraian', correct: true },
      { text: 'Karena molekulnya terlalu kecil untuk bergerak', correct: false },
    ],
    reflection_explanation: 'Pada kesetimbangan dinamis, laju reaksi maju (pembentukan N₂O₄) sama persis dengan laju reaksi balik (penguraian N₂O₄), sehingga jumlah keduanya tampak tetap.',
    jenis: 'NO2', pasangan: 'NO2', produk: 'N2O4',
    deltaH: 'eksoterm',
    tool_correct: 'compress',
  },
  misi3: {
    judul: 'Sintesis Amonia — Proses Haber',
    persamaan: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g)',
    hook: 'Proses Haber menghasilkan pupuk untuk seluruh dunia. Bagaimana setengah miliar manusia bisa hidup dari satu reaksi kimia?',
    ai_journey: 'Kamu adalah molekul N₂. Ikuti perjalananmu...',
    ai_zoomout: 'Di pabrik Haber nyata, juta-juta molekul sepertimu bereaksi setiap detik. Dan selalu setimbang.',
    ai_experiment: 'Reaksi ini eksoterm dan menghasilkan lebih sedikit mol gas. Bagaimana kondisi optimal?',
    challenge_q: 'Pabrik Haber beroperasi pada 400-500°C dan 200 atm. Mengapa tekanan tinggi dipilih untuk memperbanyak NH₃?',
    challenge_opts: [
      { text: 'Karena sisi produk memiliki lebih sedikit mol gas (2 mol vs 4 mol)', correct: true },
      { text: 'Karena tekanan tinggi membuat molekul lebih cepat', correct: false },
      { text: 'Karena NH₃ lebih stabil pada tekanan tinggi', correct: false },
    ],
    challenge_explanation: 'Menurut Le Chatelier, tekanan tinggi menggeser kesetimbangan ke sisi dengan mol gas lebih sedikit. Sisi produk (2 mol NH₃) lebih sedikit dari sisi reaktan (4 mol N₂ + H₂), maka produk bertambah.',
    reflection_q: 'Di pabrik Haber, hasil NH₃ selalu dikeluarkan dari reaktor secara kontinyu. Ini menyebabkan?',
    reflection_opts: [
      { text: 'Reaksi berhenti karena produknya habis', correct: false },
      { text: 'Kesetimbangan bergeser ke kanan, menghasilkan lebih banyak NH₃', correct: true },
      { text: 'Reaktan habis terpakai tanpa bisa diregenerasi', correct: false },
    ],
    reflection_explanation: 'Mengambil produk berarti konsentrasi produk berkurang. Sistem merespons dengan menggeser kesetimbangan ke kanan (membuat lebih banyak produk) — prinsip inilah yang membuat proses Haber efisien.',
    jenis: 'N2', pasangan: 'H2', produk: 'NH3',
    deltaH: 'eksoterm',
    tool_correct: 'compress',
  }
};

export const AR_STATE = {
  SCAN:          'SCAN',
  HOOK:          'HOOK',
  PORTAL:        'PORTAL',
  ENTERING:      'ENTERING',
  JOURNEY:       'JOURNEY',
  ZOOMOUT:       'ZOOMOUT',
  EXPERIMENT:    'EXPERIMENT',
  CHALLENGE:     'CHALLENGE',
  REFLECTION:    'REFLECTION',
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
    o.frequency.setValueAtTime(800, this.ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.6);
    g.gain.setValueAtTime(0.2, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
    o.start(); o.stop(this.ctx.currentTime + 0.6);
  }
  
  bondForm() {
    if (!this.ctx) return; this._r();
    [523, 659, 784, 1047].forEach((f, i) => {
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.connect(g); g.connect(this.ctx.destination);
      o.type = 'sine'; o.frequency.value = f;
      const t = this.ctx.currentTime + i * 0.08;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.12, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      o.start(t); o.stop(t + 0.5);
    });
  }
  
  bondBreak() {
    if (!this.ctx) return; this._r();
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.1, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random()*2-1) * Math.pow(1-i/d.length, 1.5) * 0.15;
    const s = this.ctx.createBufferSource(); s.buffer = buf;
    const f = this.ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1500;
    s.connect(f); f.connect(this.ctx.destination); s.start();
  }
  
  success() {
    if (!this.ctx) return; this._r();
    [523, 659, 784, 1047, 1319].forEach((f, i) => {
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.connect(g); g.connect(this.ctx.destination);
      o.frequency.value = f;
      const t = this.ctx.currentTime + i * 0.12;
      g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
      o.start(t); o.stop(t + 0.8);
    });
  }
}
export const soundEngine = new SoundEngine();

// ---------------------------------------------------------------------------
// MOLECULE FACTORY — Chemically accurate 3D structures
// ---------------------------------------------------------------------------
const ATOM_CONFIG = {
  H:  { color: 0xe8e8e8, emissive: 0x333333, r: 0.06  },
  I:  { color: 0x9333ea, emissive: 0x4a0080, r: 0.10  },
  N:  { color: 0x3b82f6, emissive: 0x1e3a5f, r: 0.085 },
  O:  { color: 0xef4444, emissive: 0x5f1e1e, r: 0.075 },
  Cl: { color: 0x22c55e, emissive: 0x0f3f1e, r: 0.08  },
};

const MOLECULE_GEOMETRY = {
  H2:   [['H',-0.065,0,0],['H',0.065,0,0]],
  I2:   [['I',-0.09,0,0],['I',0.09,0,0]],
  HI:   [['H',-0.07,0,0],['I',0.08,0,0]],
  N2:   [['N',-0.065,0,0],['N',0.065,0,0]],
  NO2:  [['N',0,0,0],['O',-0.075,0.065,0],['O',0.075,0.065,0]],
  N2O4: [['N',-0.055,0,0],['N',0.055,0,0],['O',-0.115,0.06,0],['O',-0.115,-0.06,0],['O',0.115,0.06,0],['O',0.115,-0.06,0]],
  NH3:  [['N',0,0.055,0],['H',-0.06,-0.025,0.045],['H',0.06,-0.025,0.045],['H',0,-0.025,-0.07]],
};

function makeMoleculeMesh(type) {
  const defs = MOLECULE_GEOMETRY[type];
  const group = new THREE.Group();
  group.userData.type = type;
  
  if (!defs) {
    // Fallback: single sphere
    const sym = type.replace(/\d/g, '').slice(0, 2);
    const cfg = ATOM_CONFIG[sym] || { color: 0xaaaaaa, emissive: 0x333333, r: 0.07 };
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(cfg.r, 32, 32),
      new THREE.MeshStandardMaterial({ color: cfg.color, emissive: cfg.emissive, roughness: 0.2, metalness: 0.3 })
    );
    group.add(m);
    return group;
  }
  
  const positions = [];
  defs.forEach(([sym, x, y, z]) => {
    const cfg = ATOM_CONFIG[sym] || { color: 0xaaaaaa, emissive: 0x333333, r: 0.07 };
    const mat = new THREE.MeshStandardMaterial({
      color: cfg.color, emissive: cfg.emissive, emissiveIntensity: 0.15,
      roughness: 0.15, metalness: 0.4,
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(cfg.r, 32, 32), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    group.add(mesh);
    positions.push({ pos: new THREE.Vector3(x, y, z), sym });
  });
  
  // Draw bonds
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const dist = positions[i].pos.distanceTo(positions[j].pos);
      if (dist < 0.22) {
        const dir = positions[j].pos.clone().sub(positions[i].pos).normalize();
        const mid = positions[i].pos.clone().lerp(positions[j].pos, 0.5);
        const mat = new THREE.MeshStandardMaterial({ color: 0xb0b0b0, roughness: 0.3, metalness: 0.5 });
        const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, dist, 10), mat);
        bond.position.copy(mid);
        bond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
        group.add(bond);
      }
    }
  }
  
  group.scale.setScalar(0.85);
  return group;
}

function makeLabelSprite(text, color = '#7df9ff') {
  const c = document.createElement('canvas');
  c.width = 300; c.height = 70;
  const ctx = c.getContext('2d');
  ctx.font = 'bold 38px Inter, sans-serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 150, 35);
  const mat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthTest: false });
  const s = new THREE.Sprite(mat);
  s.scale.set(0.7, 0.16, 1);
  return s;
}

function burstEffect(scene, pos, color = 0x4fc3f7, count = 20) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.012, 6, 6),
      new THREE.MeshBasicMaterial({ color, transparent: true })
    );
    m.position.copy(pos);
    scene.add(m);
    const vel = new THREE.Vector3(
      (Math.random()-0.5) * 0.25,
      (Math.random()-0.5) * 0.25,
      (Math.random()-0.5) * 0.25
    );
    particles.push({ m, vel, life: 0 });
  }
  const id = setInterval(() => {
    let alive = false;
    particles.forEach(p => {
      p.life += 0.04;
      p.vel.y -= 0.002;
      p.m.position.addScaledVector(p.vel, 1);
      p.m.material.opacity = Math.max(0, 1 - p.life * 2.5);
      if (p.life < 0.4) alive = true;
    });
    if (!alive) { clearInterval(id); particles.forEach(p => scene.remove(p.m)); }
  }, 16);
}

// ---------------------------------------------------------------------------
// DEVICE ORIENTATION CONTROLS
// ---------------------------------------------------------------------------
class DeviceOrientationControls {
  constructor(camera) {
    this.camera = camera;
    this.enabled = true;
    this.deviceOrientation = {};
    this.screenOrientation = 0;
    this.q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
    this.zee = new THREE.Vector3(0, 0, 1);
    this.q0 = new THREE.Quaternion();
    
    const onDO = e => this.deviceOrientation = e;
    const onSO = () => this.screenOrientation = window.orientation || 0;
    window.addEventListener('deviceorientation', onDO);
    window.addEventListener('orientationchange', onSO);
    onSO();
  }
  update() {
    if (!this.enabled) return;
    const { alpha, beta, gamma } = this.deviceOrientation;
    const a = alpha ? THREE.MathUtils.degToRad(alpha) : 0;
    const b = beta  ? THREE.MathUtils.degToRad(beta)  : 0;
    const g = gamma ? THREE.MathUtils.degToRad(gamma) : 0;
    const o = THREE.MathUtils.degToRad(this.screenOrientation);
    const e = new THREE.Euler(b, a, -g, 'YXZ');
    this.camera.quaternion.setFromEuler(e);
    this.camera.quaternion.multiply(this.q1);
    this.camera.quaternion.multiply(this.q0.setFromAxisAngle(this.zee, -o));
  }
}

// ---------------------------------------------------------------------------
// MOLECULAR WORLD — The 3D simulation environment
// ---------------------------------------------------------------------------
class MolecularWorld {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    this.root.visible = false;
    scene.add(this.root);
    
    // Ambient particles (background molecules)
    this._buildBackground();
    
    // Molecule pool for system simulation
    this.systemMolecules = [];
    this.playerMesh = null;
    this.playerLabel = null;
    this.playerType = null;
    
    // Simulation state
    this.simTime = 0;
    this.equilibriumShift = 0; // -1 to +1 (negative = more reactant)
    this.isSystemView = false;
  }
  
  _buildBackground() {
    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 60;
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xaac4ff, size: 0.06, transparent: true, opacity: 0.7 });
    this.stars = new THREE.Points(starGeo, starMat);
    this.root.add(this.stars);
    
    // Ambient floating dust particles
    const dustGeo = new THREE.BufferGeometry();
    const dustCount = 300;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i++) dustPos[i] = (Math.random() - 0.5) * 8;
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x4fc3f7, size: 0.025, transparent: true, opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    this.dust = new THREE.Points(dustGeo, dustMat);
    this.root.add(this.dust);
    
    // Subtle grid floor
    const grid = new THREE.GridHelper(20, 20, 0x0c2a3a, 0x0c1f2a);
    grid.position.y = -1.5;
    this.root.add(grid);
    
    // Lights
    this.root.add(new THREE.AmbientLight(0x334466, 1.2));
    const kl = new THREE.DirectionalLight(0x7dd3fc, 3);
    kl.position.set(3, 5, 2); kl.castShadow = true;
    this.root.add(kl);
    const fl = new THREE.DirectionalLight(0x818cf8, 1.5);
    fl.position.set(-3, -1, -3);
    this.root.add(fl);
    const pl = new THREE.PointLight(0x4fc3f7, 2, 8);
    pl.position.set(0, 2, 0);
    this.root.add(pl);
  }
  
  setVisible(v) { this.root.visible = v; }
  
  initPlayer(misiData) {
    if (this.playerMesh) this.root.remove(this.playerMesh);
    this.playerType = misiData.jenis;
    this.playerMesh = makeMoleculeMesh(misiData.jenis);
    this.playerMesh.position.set(0, 0, -0.8);
    this.root.add(this.playerMesh);
    
    this.playerLabel = makeLabelSprite('⭐ YOU', '#7df9ff');
    this.playerLabel.position.set(0, 0.3, 0);
    this.playerMesh.add(this.playerLabel);
  }
  
  morphPlayer(newType, scene) {
    const wasPos = this.playerMesh ? this.playerMesh.position.clone() : new THREE.Vector3(0,0,-0.8);
    if (this.playerMesh) this.root.remove(this.playerMesh);
    
    this.playerType = newType;
    this.playerMesh = makeMoleculeMesh(newType);
    this.playerMesh.position.copy(wasPos);
    this.root.add(this.playerMesh);
    
    const labelColor = (newType !== CURRENT_MISI_DATA?.jenis) ? '#fde68a' : '#7df9ff';
    this.playerLabel = makeLabelSprite('⭐ YOU', labelColor);
    this.playerLabel.position.set(0, 0.3, 0);
    this.playerMesh.add(this.playerLabel);
    
    return wasPos;
  }
  
  // Spawn background molecules for system simulation view
  initSystemView(misiData, forwardRatio = 0.5) {
    this.systemMolecules.forEach(m => this.root.remove(m.mesh));
    this.systemMolecules = [];
    
    const total = 18;
    for (let i = 0; i < total; i++) {
      const isProduct = i / total < forwardRatio;
      const type = isProduct ? misiData.produk : misiData.jenis;
      const mesh = makeMoleculeMesh(type);
      
      const angle = (i / total) * Math.PI * 2;
      const r = 1.5 + Math.random() * 2;
      mesh.position.set(
        Math.cos(angle) * r,
        (Math.random() - 0.5) * 2,
        Math.sin(angle) * r - 2
      );
      mesh.userData.floatOffset = Math.random() * Math.PI * 2;
      mesh.userData.type = type;
      mesh.userData.isProduct = isProduct;
      mesh.userData.reactionTimer = Math.random() * 4; // stagger reactions
      
      this.systemMolecules.push({ mesh, type, isProduct });
      this.root.add(mesh);
    }
  }
  
  updateSystemMolecules(dt, misiData, shift) {
    // Probabilistic reaction loop — Leaping to equilibrium
    const baseRate = 0.3; // reactions per second
    const fwdRate = baseRate * (1 + shift);    // forward (reactant → product)
    const revRate = baseRate * (1 - shift);    // reverse (product → reactant)
    
    this.systemMolecules.forEach((mol, idx) => {
      mol.mesh.userData.reactionTimer -= dt;
      
      if (mol.mesh.userData.reactionTimer <= 0) {
        const toProduct = Math.random() < fwdRate / (fwdRate + revRate);
        
        if (!mol.isProduct && toProduct) {
          // React forward
          this.root.remove(mol.mesh);
          mol.type = misiData.produk;
          mol.isProduct = true;
          mol.mesh = makeMoleculeMesh(misiData.produk);
          mol.mesh.position.copy(this.systemMolecules[idx].mesh?.position || new THREE.Vector3());
          this.root.add(mol.mesh);
          burstEffect(this.scene, mol.mesh.position.clone(), 0x3b82f6, 8);
        } else if (mol.isProduct && !toProduct) {
          // React backward
          this.root.remove(mol.mesh);
          mol.type = misiData.jenis;
          mol.isProduct = false;
          mol.mesh = makeMoleculeMesh(misiData.jenis);
          mol.mesh.position.copy(this.systemMolecules[idx].mesh?.position || new THREE.Vector3());
          this.root.add(mol.mesh);
          burstEffect(this.scene, mol.mesh.position.clone(), 0xfbbf24, 8);
        }
        
        mol.mesh.userData.reactionTimer = 1.5 + Math.random() * 2.5;
      }
      
      // Float animation
      const t = Date.now() * 0.001 + mol.mesh.userData.floatOffset;
      mol.mesh.position.y += Math.sin(t * 0.8) * dt * 0.05;
      mol.mesh.rotation.y += dt * 0.3;
    });
  }
  
  // Count products in system
  getProductRatio() {
    if (this.systemMolecules.length === 0) return 0.5;
    const products = this.systemMolecules.filter(m => m.isProduct).length;
    return products / this.systemMolecules.length;
  }
  
  update(dt) {
    if (!this.root.visible) return;
    this.simTime += dt;
    
    // Rotate stars slowly
    this.stars.rotation.y += dt * 0.01;
    this.stars.rotation.x += dt * 0.003;
    
    // Animate dust
    this.dust.rotation.y += dt * 0.05;
    
    // Float player
    if (this.playerMesh && !this.isSystemView) {
      this.playerMesh.position.y = Math.sin(this.simTime * 0.8) * 0.04;
      this.playerMesh.rotation.y += dt * 0.3;
    }
  }
}

// ---------------------------------------------------------------------------
// MOLECULAR JOURNEY — The pedagogical core
// ---------------------------------------------------------------------------
class MolecularJourney {
  constructor(scene, world, misiData, onStateChange) {
    this.scene = scene;
    this.world = world;
    this.misiData = misiData;
    this.onStateChange = onStateChange;
    
    this.collisionCount = 0;
    this.maxCollisions = 3; // Confuse them 3 times, then reveal truth
    this.isTransforming = false;
    
    // Nearby molecules (partners that will react with us)
    this.nearbyMolecules = [];
    this._spawnNearby();
  }
  
  _spawnNearby() {
    // Spawn a few background molecules near player to give sense of system
    const positions = [
      [-0.6, 0.2, -2], [0.6, -0.1, -2.5], [-0.3, -0.3, -3],
      [0.8, 0.3, -1.5], [-0.8, 0.1, -1.8]
    ];
    positions.forEach(([x, y, z]) => {
      const type = Math.random() > 0.5 ? this.misiData.jenis : this.misiData.produk;
      const m = makeMoleculeMesh(type);
      m.position.set(x, y, z);
      m.userData.floatOffset = Math.random() * Math.PI * 2;
      m.userData.type = type;
      this.nearbyMolecules.push(m);
      this.world.root.add(m);
    });
  }
  
  // Called on collision with another molecule (auto-triggered)
  triggerCollision(cb_onComplete) {
    if (this.isTransforming) return;
    this.isTransforming = true;
    this.collisionCount++;
    
    const wasReactant = this.world.playerType === this.misiData.jenis;
    const newType = wasReactant ? this.misiData.produk : this.misiData.jenis;
    const pos = this.world.morphPlayer(newType, this.scene);
    
    if (wasReactant) {
      soundEngine.bondForm();
      burstEffect(this.scene, pos, 0x3b82f6);
    } else {
      soundEngine.bondBreak();
      burstEffect(this.scene, pos, 0xef4444);
    }
    
    if (window._updateHUDForm) {
      window._updateHUDForm(!wasReactant, newType);
    }
    
    setTimeout(() => {
      this.isTransforming = false;
      if (cb_onComplete) cb_onComplete(this.collisionCount);
    }, 800);
  }
  
  update(dt) {
    // Animate nearby molecules
    this.nearbyMolecules.forEach(m => {
      const t = Date.now() * 0.001 + m.userData.floatOffset;
      m.rotation.y += dt * 0.4;
      m.position.y += Math.sin(t * 0.6) * dt * 0.04;
      
      // Slow drift
      m.position.x += Math.sin(t * 0.2 + m.userData.floatOffset) * dt * 0.02;
      m.position.z += Math.cos(t * 0.15 + m.userData.floatOffset) * dt * 0.02;
    });
  }
  
  cleanup() {
    this.nearbyMolecules.forEach(m => this.world.root.remove(m));
    this.nearbyMolecules = [];
  }
}

// ---------------------------------------------------------------------------
// CAMERA MANAGER — Chase cam + Zoom Out sequence
// ---------------------------------------------------------------------------
class CameraManager {
  constructor(camera, cameraRig) {
    this.camera = camera;
    this.rig = cameraRig;
    this.mode = 'follow'; // 'follow' | 'zoomout' | 'free'
    
    // Chase cam config: behind and above the molecule
    this.followOffset = new THREE.Vector3(0, 0.35, 1.0);
    this.target = new THREE.Vector3(0, 0, -1);
    this._t = 0;
  }
  
  setFollowMode() {
    this.mode = 'follow';
  }
  
  zoomOut(onComplete) {
    this.mode = 'zoomout';
    const startPos = this.rig.position.clone();
    const endPos = new THREE.Vector3(0, 3.5, 2);
    let t = 0;
    const dur = 3.0;
    
    const tick = setInterval(() => {
      t += 0.016;
      const p = Math.min(t / dur, 1);
      const eased = p < 0.5 ? 2*p*p : -1+(4-2*p)*p;
      this.rig.position.lerpVectors(startPos, endPos, eased);
      if (p >= 1) {
        clearInterval(tick);
        if (onComplete) onComplete();
      }
    }, 16);
  }
  
  update(dt, playerPos) {
    if (this.mode === 'follow' && playerPos) {
      // Smooth chase: position rig behind/above player
      const targetPos = playerPos.clone().add(this.followOffset);
      this.rig.position.lerp(targetPos, Math.min(1, dt * 5));
      
      // Camera looks at player molecule
      const worldTarget = playerPos.clone();
      const camWorldPos = new THREE.Vector3();
      this.camera.getWorldPosition(camWorldPos);
      const lookDir = worldTarget.sub(camWorldPos).normalize();
      // Don't force lookAt during gyro mode — gyro handles it
    }
  }
}

// ---------------------------------------------------------------------------
// MAIN AR SESSION
// ---------------------------------------------------------------------------
let CURRENT_MISI_DATA = null;

export async function mulaiSesiARjs(canvas, videoEl, misiId, callbacks) {
  CURRENT_MISI_DATA = MISI_DATA[misiId] || MISI_DATA.misi1;
  const misi = CURRENT_MISI_DATA;
  
  // Camera access
  let isTrueAR = false;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    videoEl.srcObject = stream;
    await videoEl.play().catch(() => {});
    isTrueAR = true;
  } catch { console.warn('Camera not available — using virtual environment.'); }
  
  // THREE.js setup
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  
  const scene = new THREE.Scene();
  
  // Camera Rig (Physical position) + Camera (Rotation from gyro/drag)
  const cameraRig = new THREE.Group();
  cameraRig.position.set(0, 0.35, 1.0);
  scene.add(cameraRig);
  
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.01, 100);
  cameraRig.add(camera);
  
  const gyroControls = new DeviceOrientationControls(camera);
  
  // Drag fallback for desktop/laptop
  let isDrag = false, dragX = 0, dragY = 0;
  let camYaw = 0, camPitch = -0.1;
  canvas.addEventListener('mousedown', e => { isDrag = true; dragX = e.clientX; dragY = e.clientY; });
  canvas.addEventListener('mousemove', e => {
    if (!isDrag || isTrueAR) return;
    camYaw   -= (e.clientX - dragX) * 0.004; dragX = e.clientX;
    camPitch -= (e.clientY - dragY) * 0.004; dragY = e.clientY;
    camPitch = Math.max(-Math.PI/3, Math.min(Math.PI/3, camPitch));
    camera.rotation.set(camPitch, camYaw, 0, 'YXZ');
  });
  window.addEventListener('mouseup', () => isDrag = false);
  
  // Portal
  const portalGroup = new THREE.Group();
  scene.add(portalGroup);
  const portalRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.015, 16, 100),
    new THREE.MeshBasicMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.9 })
  );
  portalRing.rotation.x = -Math.PI / 2;
  portalGroup.add(portalRing);
  let portalPlaced = false;
  portalGroup.visible = false;

  // Reticle
  const reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.06, 0.08, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.8 })
  );
  scene.add(reticle);

  // Molecular World
  const world = new MolecularWorld(scene);
  
  // Camera Manager
  const camMgr = new CameraManager(camera, cameraRig);
  
  // State Machine
  let state = AR_STATE.SCAN;
  let journey = null;
  let collisionTimer = 0;
  const COLLISION_INTERVAL = 2.8; // seconds between auto-collisions
  
  // Equilibrium bars state
  let eqFwd = 50, eqRev = 50;
  let systemViewActive = false;
  let berjalan = true;
  
  const _cb = callbacks || {};
  
  function setState(newState, aiMsg) {
    state = newState;
    if (_cb.onState) _cb.onState(newState, aiMsg);
  }
  
  function enterPortal() {
    portalGroup.visible = false;
    reticle.visible = false;
    world.setVisible(true);
    if (videoEl) { videoEl.style.transition = 'opacity 1s'; videoEl.style.opacity = '0'; }
    soundEngine.whoosh();
    
    world.initPlayer(misi);
    journey = new MolecularJourney(scene, world, misi, null);
    camMgr.setFollowMode();
    
    if (window._updateHUDForm) window._updateHUDForm(false, misi.jenis);
    
    setState(AR_STATE.JOURNEY, misi.ai_journey);
  }
  
  function doZoomOut() {
    journey?.cleanup();
    
    // Show all system molecules
    world.isSystemView = true;
    world.initSystemView(misi, 0.5);
    if (window._updateHUDEq) window._updateHUDEq(50, 50);
    systemViewActive = true;
    
    camMgr.zoomOut(() => {
      setState(AR_STATE.ZOOMOUT, misi.ai_zoomout);
      // After 3.5s of seeing the system, open experiment
      setTimeout(() => setState(AR_STATE.EXPERIMENT, misi.ai_experiment), 4000);
    });
  }
  
  // Tap to place portal / enter
  canvas.addEventListener('click', () => {
    if (state === AR_STATE.SCAN && !portalPlaced) {
      portalGroup.position.copy(reticle.position);
      portalGroup.visible = true;
      portalPlaced = true;
      setState(AR_STATE.PORTAL, 'Portal terbuka! Tap lagi untuk masuk.');
    } else if (state === AR_STATE.PORTAL) {
      enterPortal();
    }
  });
  
  // Touch for mobile
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    if (state === AR_STATE.SCAN && !portalPlaced) {
      portalGroup.position.copy(reticle.position);
      portalGroup.visible = true;
      portalPlaced = true;
      setState(AR_STATE.PORTAL, 'Portal terbuka! Tap lagi untuk masuk.');
    } else if (state === AR_STATE.PORTAL) {
      enterPortal();
    }
  }, { passive: false });
  
  const clock = new THREE.Clock();
  let portalT = 0;
  
  renderer.setAnimationLoop(() => {
    if (!berjalan) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    
    // Reticle wobble (before portal placed)
    if (!portalPlaced) {
      reticle.position.set(0, -0.3, -1.2);
      reticle.rotation.z += dt * 1.5;
    }
    
    // Portal pulse
    if (portalGroup.visible) {
      portalT += dt;
      portalRing.scale.setScalar(1 + Math.sin(portalT * 2.5) * 0.06);
    }
    
    // World update
    world.update(dt);
    
    // Journey auto-collision loop (AI is silent — let them be confused)
    if (state === AR_STATE.JOURNEY && journey) {
      journey.update(dt);
      collisionTimer += dt;
      
      if (collisionTimer >= COLLISION_INTERVAL && !journey.isTransforming) {
        collisionTimer = 0;
        journey.triggerCollision((count) => {
          if (count >= journey.maxCollisions) {
            // All 3 confusions done — Zoom Out for revelation!
            setTimeout(() => doZoomOut(), 1200);
          }
        });
      }
    }
    
    // System simulation (after zoom out)
    if (systemViewActive) {
      world.updateSystemMolecules(dt, misi, world.equilibriumShift);
      const ratio = world.getProductRatio();
      const fwd = Math.round(ratio * 100);
      const rev = 100 - fwd;
      if (window._updateHUDEq) window._updateHUDEq(fwd, rev);
    }
    
    // Chase cam
    if (world.playerMesh && state === AR_STATE.JOURNEY) {
      camMgr.update(dt, world.playerMesh.position);
    }
    
    // Gyro update
    if (isTrueAR) gyroControls.update();
    
    renderer.render(scene, camera);
  });
  
  return {
    startJourney: () => {
      // Called by MULAI button — skip portal placement, go straight to journey
      soundEngine.whoosh();
      world.setVisible(true);
      if (videoEl && videoEl.style) { videoEl.style.transition = 'opacity 1s'; videoEl.style.opacity = '0.3'; }
      world.initPlayer(misi);
      journey = new MolecularJourney(scene, world, misi, null);
      camMgr.setFollowMode();
      if (window._updateHUDForm) window._updateHUDForm(false, misi.jenis);
      setState(AR_STATE.JOURNEY, misi.ai_journey);
    },
    triggerTool: (tool) => {
      if (state !== AR_STATE.EXPERIMENT) return;
      
      let shift = 0;
      if (tool === misi.tool_correct) {
        shift = misi.deltaH === 'endoterm' ? 0.6 : -0.6;
        if (tool === 'compress') shift = 0.6;
        if (tool === 'add') shift = 0.6;
        soundEngine.bondForm();
      } else {
        shift = -0.3;
        soundEngine.bondBreak();
      }
      
      world.equilibriumShift = shift;
      const newFwd = Math.round((0.5 + shift * 0.4) * 100);
      const newRev = 100 - newFwd;
      if (window._updateHUDEq) window._updateHUDEq(newFwd, newRev);
    },
    onQuizAnswered: () => {
      setState(AR_STATE.CHALLENGE, '');
      if (_cb.onChallenge) _cb.onChallenge();
    },
    onChallengeAnswered: () => {
      setState(AR_STATE.REFLECTION, '');
      if (_cb.onReflection) _cb.onReflection();
    },
    hentikan: () => {
      berjalan = false;
      renderer.setAnimationLoop(null);
      if (videoEl?.srcObject) {
        videoEl.srcObject.getTracks().forEach(t => t.stop());
        videoEl.srcObject = null;
      }
    }
  };
}


export async function deteksiModeAR() {
  if (navigator.xr) {
    try { if (await navigator.xr.isSessionSupported('immersive-ar')) return 'webxr'; } catch {}
  }
  return navigator.mediaDevices?.getUserMedia ? 'arjs' : 'unsupported';
}

export async function mulaiSesiWebXR(canvas, misiId, callbacks) {
  return mulaiSesiARjs(canvas, document.createElement('video'), misiId, callbacks);
}
