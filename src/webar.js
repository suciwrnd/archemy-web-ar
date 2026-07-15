import * as THREE from 'three';

/* ==========================================================================
   ARCHEMY WEBAR ENGINE v2.0 - Game Edukasi Kimia
   Overhaul 7-Tahap: State Machine → Camera → Bubble → Reaction → UI → Molecule → Polish
   ========================================================================== */

// ---------------------------------------------------------------------------
// SENSOR DATA
// ---------------------------------------------------------------------------
export const sensorData = {
  gX: 0, gY: -0.001, gZ: 0,
  shake: 0, isSpilled: false,
  spillCallback: null, unspillCallback: null
};

window.addEventListener('deviceorientation', (e) => {
  const beta = e.beta || 0; const gamma = e.gamma || 0;
  const betaRad = beta * (Math.PI / 180); const gammaRad = gamma * (Math.PI / 180);
  sensorData.gX = Math.sin(gammaRad) * 0.003;
  sensorData.gY = -Math.sin(betaRad) * 0.003;
  sensorData.gZ = -Math.cos(betaRad) * Math.cos(gammaRad) * 0.003;
  if (!sensorData.isSpilled && (beta > 150 || beta < -80 || Math.abs(gamma) > 130)) {
    sensorData.isSpilled = true;
    if (sensorData.spillCallback) sensorData.spillCallback();
  } else if (sensorData.isSpilled && (beta > 20 && beta < 120 && Math.abs(gamma) < 60)) {
    sensorData.isSpilled = false;
    if (sensorData.unspillCallback) sensorData.unspillCallback();
  }
});

let lastShakeTime = 0;
window.addEventListener('devicemotion', (e) => {
  if (sensorData.isSpilled) return;
  const acc = e.acceleration || { x: 0, y: 0, z: 0 };
  const force = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
  if (force > 12) { sensorData.shake = force * 0.0002; lastShakeTime = performance.now(); }
  if (performance.now() - lastShakeTime > 500) sensorData.shake *= 0.9;
});

export function requestSensorPermission() {
  sensorData.isSpilled = false; sensorData.shake = 0;
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission().catch(() => {});
  }
}

// ---------------------------------------------------------------------------
// MISI DATA
// ---------------------------------------------------------------------------
export const MISI_DATA = {
  misi1: {
    judul: 'Misi 1: Gas Iodin',
    persamaan: 'H\u2082(g) + I\u2082(g) \u21cc 2HI(g)',
    ai: {
      OVERVIEW:          'Sistem belum setimbang.',
      INVESTIGATE:       'Pilih satu molekul I\u2082.',
      MOLECULAR_JOURNEY: 'Cari pasangan reaksimu (H\u2082).',
      REACTION_EVENT:    'Perhatikan ikatan.',
      EXPERIMENT:        'Naikkan suhu.',
      REFLECTION:        'Apa yang berubah?',
    },
    target_jenis: 'I2', target_pasangan: 'H2', produk: 'HI', tool: 'heat',
    parameterKunci: 'suhu', wujud: 'gas', nilaiTarget: 50,
    partikel: {
      jauhTarget: [{ jenis: 'H2', jumlah: 4 }, { jenis: 'I2', jumlah: 4 }, { jenis: 'HI', jumlah: 1 }],
      dekatTarget: [{ jenis: 'H2', jumlah: 2 }, { jenis: 'I2', jumlah: 2 }, { jenis: 'HI', jumlah: 5 }]
    }
  },
  misi2: {
    judul: 'Misi 2: Smog Kota',
    persamaan: '2NO\u2082(g) \u21cc N\u2082O\u2084(g)',
    ai: {
      OVERVIEW:          'Gas NO\u2082 memenuhi kota.',
      INVESTIGATE:       'Pilih satu molekul NO\u2082.',
      MOLECULAR_JOURNEY: 'Cari pasangan NO\u2082 lainnya.',
      REACTION_EVENT:    'Perhatikan ikatan terbentuk.',
      EXPERIMENT:        'Perkecil volume.',
      REFLECTION:        'NO\u2082 berkurang. Kenapa?',
    },
    target_jenis: 'NO2', target_pasangan: 'NO2', produk: 'N2O4', tool: 'compress',
    parameterKunci: 'volume', wujud: 'gas', nilaiTarget: 2.0,
    partikel: {
      jauhTarget: [{ jenis: 'NO2', jumlah: 6 }, { jenis: 'N2O4', jumlah: 1 }],
      dekatTarget: [{ jenis: 'NO2', jumlah: 2 }, { jenis: 'N2O4', jumlah: 3 }]
    }
  },
  misi3: {
    judul: 'Misi 3: Pabrik Amonia',
    persamaan: 'N\u2082(g) + 3H\u2082(g) \u21cc 2NH\u2083(g)',
    ai: {
      OVERVIEW:          'Produksi amonia terhambat.',
      INVESTIGATE:       'Pilih satu molekul N\u2082.',
      MOLECULAR_JOURNEY: 'Temukan molekul H\u2082.',
      REACTION_EVENT:    'Ikatan N-H terbentuk!',
      EXPERIMENT:        'Tambahkan reaktan.',
      REFLECTION:        'Lebih banyak produk. Kenapa?',
    },
    target_jenis: 'N2', target_pasangan: 'H2', produk: 'NH3', tool: 'add',
    parameterKunci: 'konsentrasi', wujud: 'gas', nilaiTarget: 1.0,
    partikel: {
      jauhTarget: [{ jenis: 'N2', jumlah: 2 }, { jenis: 'H2', jumlah: 2 }, { jenis: 'NH3', jumlah: 1 }],
      dekatTarget: [{ jenis: 'N2', jumlah: 1 }, { jenis: 'H2', jumlah: 3 }, { jenis: 'NH3', jumlah: 3 }]
    }
  },
  misi4: {
    judul: 'Misi 4: Buffer Darah',
    persamaan: 'CO\u2082(g) + H\u2082O(l) \u21cc H\u2082CO\u2083(aq)',
    ai: {
      OVERVIEW:          'pH darah tidak stabil.',
      INVESTIGATE:       'Pilih satu molekul CO\u2082.',
      MOLECULAR_JOURNEY: 'Temukan molekul H\u2082O.',
      REACTION_EVENT:    'Asam karbonat terbentuk!',
      EXPERIMENT:        'Kompres sistemnya.',
      REFLECTION:        'pH stabil. Bagaimana caranya?',
    },
    target_jenis: 'CO2', target_pasangan: 'H2O', produk: 'H2CO3', tool: 'compress',
    parameterKunci: 'tekanan', wujud: 'aqueous', nilaiTarget: 3.0,
    partikel: {
      jauhTarget: [{ jenis: 'CO2', jumlah: 4 }, { jenis: 'H2O', jumlah: 4 }, { jenis: 'H2CO3', jumlah: 1 }],
      dekatTarget: [{ jenis: 'CO2', jumlah: 1 }, { jenis: 'H2O', jumlah: 1 }, { jenis: 'H2CO3', jumlah: 4 }]
    }
  },
  misi5: {
    judul: 'Misi 5: Batu Kapur',
    persamaan: 'CaCO\u2083(s) \u21cc CaO(s) + CO\u2082(g)',
    ai: {
      OVERVIEW:          'Batu kapur sulit terurai.',
      INVESTIGATE:       'Pilih bongkahan CaCO\u2083.',
      MOLECULAR_JOURNEY: 'Tunggu energi panas.',
      REACTION_EVENT:    'Ikatan terputus!',
      EXPERIMENT:        'Naikkan suhu.',
      REFLECTION:        'CO\u2082 muncul. Ini endotermik.',
    },
    target_jenis: 'CaCO3', target_pasangan: null, produk: 'CO2', tool: 'heat',
    parameterKunci: 'suhu', wujud: 'heterogen', nilaiTarget: 80,
    partikel: {
      jauhTarget: [{ jenis: 'CaCO3', jumlah: 3 }, { jenis: 'CaO', jumlah: 1 }, { jenis: 'CO2', jumlah: 1 }],
      dekatTarget: [{ jenis: 'CaCO3', jumlah: 1 }, { jenis: 'CaO', jumlah: 3 }, { jenis: 'CO2', jumlah: 3 }]
    }
  }
};

// ---------------------------------------------------------------------------
// AR STATE MACHINE
// ---------------------------------------------------------------------------
export const AR_STATE = {
  SCAN:              'SCAN',
  REACTION_PORTAL:   'REACTION_PORTAL',
  OVERVIEW:          'OVERVIEW',
  INVESTIGATE:       'INVESTIGATE',
  PORTAL_ZOOM:       'PORTAL_ZOOM',
  MOLECULAR_JOURNEY: 'MOLECULAR_JOURNEY',
  REACTION_EVENT:    'REACTION_EVENT',
  EXPERIMENT:        'EXPERIMENT',
  REFLECTION:        'REFLECTION',
  EXIT_PORTAL:       'EXIT_PORTAL',
};

export class ARStateMachine {
  constructor() {
    this.state = AR_STATE.SCAN;
    this._listeners = {};
  }
  setState(newState) {
    const prev = this.state;
    this.state = newState;
    if (this._listeners[newState]) this._listeners[newState].forEach(fn => fn(prev));
    if (this._listeners['*']) this._listeners['*'].forEach(fn => fn(newState, prev));
  }
  on(state, fn) {
    if (!this._listeners[state]) this._listeners[state] = [];
    this._listeners[state].push(fn);
    return this;
  }
  is(state) { return this.state === state; }
}

// ---------------------------------------------------------------------------
// SOUND ENGINE
// ---------------------------------------------------------------------------
class ARSoundEngine {
  constructor() {
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { this.ctx = null; }
  }
  _resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); }

  whoosh() {
    if (!this.ctx) return; this._resume();
    const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.frequency.setValueAtTime(700, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
    osc.start(); osc.stop(this.ctx.currentTime + 0.5);
  }

  collision() {
    if (!this.ctx) return; this._resume();
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.08, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) * 0.25;
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    src.connect(this.ctx.destination); src.start();
  }

  bondForm() {
    if (!this.ctx) return; this._resume();
    [523, 659, 784].forEach((freq, i) => {
      const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.type = 'sine'; osc.frequency.value = freq;
      const t = this.ctx.currentTime + i * 0.07;
      gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.18, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.start(t); osc.stop(t + 0.5);
    });
  }

  bondBreak() {
    if (!this.ctx) return; this._resume();
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.12, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2) * 0.2;
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const filter = this.ctx.createBiquadFilter(); filter.type = 'highpass'; filter.frequency.value = 2000;
    src.connect(filter); filter.connect(this.ctx.destination); src.start();
  }

  missionComplete() {
    if (!this.ctx) return; this._resume();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.frequency.value = freq;
      const t = this.ctx.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0.22, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
      osc.start(t); osc.stop(t + 0.8);
    });
  }
}
export const soundEngine = new ARSoundEngine();

// ---------------------------------------------------------------------------
// ATOM COLORS & RADII
// ---------------------------------------------------------------------------
const ATOM_WARNA = { H: 0xe0e0e0, I: 0x9f1aff, N: 0x3b82f6, O: 0xef4444, C: 0x525252, Ca: 0x94a3b8 };
const ATOM_RADIUS = { H: 0.045, I: 0.085, N: 0.07, O: 0.06, C: 0.075, Ca: 0.095 };

// ---------------------------------------------------------------------------
// MOLECULE BUILDERS
// ---------------------------------------------------------------------------
function buatAtomMesh(simbol) {
  const r = ATOM_RADIUS[simbol] || 0.06;
  const col = ATOM_WARNA[simbol] || 0x888888;
  const mat = new THREE.MeshStandardMaterial({
    color: col, emissive: col, emissiveIntensity: 0.08,
    roughness: 0.28, metalness: 0.12,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 28), mat);
  mesh.castShadow = true;
  return mesh;
}

function buatBondMesh(p1, p2) {
  const dist = p1.distanceTo(p2);
  if (dist < 0.005) return null;
  const geo = new THREE.CylinderGeometry(0.011, 0.011, dist, 8);
  const mat = new THREE.MeshStandardMaterial({ color: 0xd4d4d4, roughness: 0.4, metalness: 0.1 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(p1).lerp(p2, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
  return mesh;
}

const RESEP_MOLEKUL = {
  H2:    [['H',-0.05,0,0],['H',0.05,0,0]],
  I2:    [['I',-0.07,0,0],['I',0.07,0,0]],
  HI:    [['H',-0.055,0,0],['I',0.055,0,0]],
  N2:    [['N',-0.05,0,0],['N',0.05,0,0]],
  H2O:   [['O',0,0,0],['H',-0.06,-0.05,0],['H',0.06,-0.05,0]],
  NO2:   [['N',0,0,0],['O',-0.065,0.055,0],['O',0.065,0.055,0]],
  N2O4:  [['N',-0.04,0,0],['N',0.04,0,0],['O',-0.10,0.05,0],['O',-0.10,-0.05,0],['O',0.10,0.05,0],['O',0.10,-0.05,0]],
  NH3:   [['N',0,0.04,0],['H',-0.055,-0.025,0.03],['H',0.055,-0.025,0.03],['H',0,-0.025,-0.06]],
  CO2:   [['O',-0.09,0,0],['C',0,0,0],['O',0.09,0,0]],
  H2CO3: [['C',0,0,0],['O',-0.07,0.05,0],['O',0.07,0.05,0],['O',0,-0.08,0]],
  CaCO3: [['Ca',0,0,0],['C',0,0.1,0],['O',-0.06,0.15,0],['O',0.06,0.15,0],['O',0,0.2,0]],
  CaO:   [['Ca',-0.065,0,0],['O',0.065,0,0]],
};

export function buatMolekul(jenis) {
  const atoms = RESEP_MOLEKUL[jenis];
  const grup = new THREE.Group();
  grup.userData.jenis = jenis;

  if (atoms) {
    const positions = atoms.map(([sym, x, y, z]) => {
      const atom = buatAtomMesh(sym);
      atom.position.set(x, y, z);
      atom.userData.simbol = sym;
      grup.add(atom);
      return new THREE.Vector3(x, y, z);
    });
    // Draw bonds
    for (let i = 0; i < positions.length - 1; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (positions[i].distanceTo(positions[j]) < 0.16) {
          const b = buatBondMesh(positions[i], positions[j]);
          if (b) grup.add(b);
        }
      }
    }
  } else {
    const sym = jenis.replace(/[0-9]/g, '').slice(0, 2) || 'C';
    grup.add(buatAtomMesh(sym));
  }

  grup.scale.setScalar(1.3);
  return grup;
}

// ---------------------------------------------------------------------------
// REACTION BUBBLE
// ---------------------------------------------------------------------------
export class ReactionBubble {
  constructor(scene, radius = 0.35) {
    this.radius = radius;
    this._t = 0;

    const geo = new THREE.SphereGeometry(radius, 32, 32);
    this.mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: 0x7dd3fc, transparent: true, opacity: 0.04,
      side: THREE.FrontSide, depthWrite: false,
    }));

    const ringGeo = new THREE.TorusGeometry(radius, 0.007, 12, 60);
    this.ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
      color: 0x38bdf8, transparent: true, opacity: 0.55
    }));

    scene.add(this.mesh);
    scene.add(this.ring);
  }

  setPosition(pos) { this.mesh.position.copy(pos); this.ring.position.copy(pos); }
  setVisible(v) { this.mesh.visible = v; this.ring.visible = v; }

  update(dt) {
    this._t += dt * 0.8;
    const pulse = 1 + Math.sin(this._t) * 0.018;
    this.mesh.scale.setScalar(pulse);
    this.ring.material.opacity = 0.3 + Math.sin(this._t) * 0.2;
    this.ring.rotation.y += dt * 0.3;
    this.ring.rotation.x += dt * 0.1;
  }

  constrain(p) {
    const center = this.mesh.position;
    const rel = p.mesh.position.clone().sub(center);
    const dist = rel.length();
    if (dist > this.radius * 0.88) {
      const normal = rel.normalize();
      p.mesh.position.copy(center).addScaledVector(normal, this.radius * 0.88);
      const dot = p.kecepatan.dot(normal);
      p.kecepatan.addScaledVector(normal, -1.7 * dot);
      p.kecepatan.multiplyScalar(0.72);
    }
  }
}

// ---------------------------------------------------------------------------
// SISTEM PARTIKEL
// ---------------------------------------------------------------------------
export class SistemPartikel {
  constructor(scene) {
    this.scene = scene;
    this.container = new THREE.Group();
    scene.add(this.container);
    this.partikel = [];
    this.bubble = null;
    this.timeScale = 1.0;
    this._targetTimeScale = 1.0;
  }

  setBubble(bubble) { this.bubble = bubble; }

  bersihkan() { this.container.clear(); this.partikel = []; }

  isiDariMisi(misiId, dekatTarget = false) {
    this.bersihkan();
    const data = MISI_DATA[misiId]; if (!data) return;
    this.wujud = data.wujud;
    const set = dekatTarget ? data.partikel.dekatTarget : data.partikel.jauhTarget;
    set.forEach(({ jenis, jumlah }) => {
      const batas = Math.min(jumlah, 4);
      for (let i = 0; i < batas; i++) this._tambah(jenis);
    });
  }

  _tambah(jenis) {
    const mol = buatMolekul(jenis);
    const isSolid = jenis === 'CaCO3' || jenis === 'CaO';
    const R = this.bubble ? this.bubble.radius * 0.72 : 0.22;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const rad = Math.cbrt(Math.random()) * R;
    const center = this.bubble ? this.bubble.mesh.position : new THREE.Vector3();
    mol.position.set(
      center.x + rad * Math.sin(phi) * Math.cos(theta),
      center.y + rad * Math.sin(phi) * Math.sin(theta),
      center.z + rad * Math.cos(phi)
    );
    this.container.add(mol);
    this.partikel.push({
      mesh: mol, isSolid, jenis,
      kecepatan: isSolid ? new THREE.Vector3() : new THREE.Vector3(
        (Math.random()-0.5)*0.004, (Math.random()-0.5)*0.004, (Math.random()-0.5)*0.004
      ),
      rotKec: isSolid ? 0 : (Math.random()-0.5)*0.02,
    });
  }

  slowMotion(duration = 0.8) {
    this._targetTimeScale = 0.25;
    setTimeout(() => { this._targetTimeScale = 1.0; }, duration * 1000);
  }

  perbarui(dt = 1/60) {
    this.timeScale += (this._targetTimeScale - this.timeScale) * 0.08;
    const eff = dt * this.timeScale * 60;
    let shakeBoost = 1;
    if (sensorData.shake > 0.0001) { shakeBoost += sensorData.shake * 80; sensorData.shake *= 0.95; }

    this.partikel.forEach(p => {
      if (p.isSolid) { p.mesh.rotation.y += 0.005 * eff; return; }
      const n = 0.0013;
      p.kecepatan.x += (Math.random()-0.5)*n;
      p.kecepatan.y += (Math.random()-0.5)*n;
      p.kecepatan.z += (Math.random()-0.5)*n;
      p.kecepatan.multiplyScalar(0.986);
      p.mesh.position.addScaledVector(p.kecepatan, eff * shakeBoost);
      if (this.bubble) this.bubble.constrain(p);
      p.mesh.rotation.y += p.rotKec * eff;
    });

    // Repulsion
    for (let i = 0; i < this.partikel.length; i++) {
      for (let j = i + 1; j < this.partikel.length; j++) {
        const pA = this.partikel[i]; const pB = this.partikel[j];
        const delta = pA.mesh.position.clone().sub(pB.mesh.position);
        const dSq = delta.lengthSq(); const minD = 0.17;
        if (dSq < minD * minD && dSq > 0.0001) {
          const dist = Math.sqrt(dSq); const f = (minD - dist) * 0.012;
          delta.normalize().multiplyScalar(f);
          if (!pA.isSolid) pA.kecepatan.add(delta);
          if (!pB.isSolid) pB.kecepatan.sub(delta);
        }
      }
    }
  }

  flashAll(color = 0xffffff, duration = 300) {
    this.partikel.forEach(p => {
      p.mesh.traverse(c => {
        if (c.isMesh && c.material?.emissive) {
          const old = c.material.emissive.getHex();
          c.material.emissive.setHex(color);
          setTimeout(() => { if (c.material) c.material.emissive.setHex(old); }, duration);
        }
      });
    });
  }
}

// ---------------------------------------------------------------------------
// CAMERA CONTROLLER
// ---------------------------------------------------------------------------
export class CameraController {
  constructor(camera) {
    this.camera = camera;
    this.mode = 'overview';
    this._targetPos = new THREE.Vector3(0, 0.25, 1.1);
    this._targetLookAt = new THREE.Vector3(0, 0, -0.3);
    this._shakeIntensity = 0; this._shakeDuration = 0; this._shakeTimer = 0;
    this._orbitEnabled = false; this._orbitAngle = 0; this._orbitRadius = 0.85;
    this._orbitCenter = new THREE.Vector3(0, 0, -0.3);
    this._followTarget = null;
  }

  setMode(mode, options = {}) {
    this.mode = mode;
    this._orbitEnabled = false;
    if (mode === 'overview') {
      this._targetPos.set(0, 0.25, 1.1);
      this._targetLookAt.set(0, 0, -0.3);
    } else if (mode === 'portal') {
      this._targetPos.set(0, 0.08, 0.5);
      this._targetLookAt.set(0, 0, -0.3);
    } else if (mode === 'shoulder') {
      this._followTarget = options.target || null;
    } else if (mode === 'orbit') {
      this._orbitEnabled = true;
      if (options.center) this._orbitCenter.copy(options.center);
      if (options.radius) this._orbitRadius = options.radius;
      this._orbitAngle = Math.atan2(
        this.camera.position.z - this._orbitCenter.z,
        this.camera.position.x - this._orbitCenter.x
      );
    } else if (mode === 'exit') {
      this._targetPos.set(0, 0.35, 1.6);
      this._targetLookAt.set(0, 0, -0.3);
    }
  }

  enableOrbitTouch(canvas) {
    let lastX = 0, lastY = 0, dragging = false;
    const onStart = (e) => {
      dragging = true;
      lastX = (e.touches?.[0] || e).clientX;
      lastY = (e.touches?.[0] || e).clientY;
    };
    const onMove = (e) => {
      if (!dragging || !this._orbitEnabled) return;
      const x = (e.touches?.[0] || e).clientX;
      this._orbitAngle += (x - lastX) * 0.007;
      lastX = x; lastY = (e.touches?.[0] || e).clientY;
    };
    const onEnd = () => { dragging = false; };
    canvas.addEventListener('touchstart', onStart, { passive: true });
    canvas.addEventListener('touchmove', onMove, { passive: true });
    canvas.addEventListener('touchend', onEnd);
    canvas.addEventListener('mousedown', onStart);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseup', onEnd);
  }

  shake(intensity = 0.007, duration = 0.45) {
    this._shakeIntensity = intensity;
    this._shakeDuration = duration;
    this._shakeTimer = 0;
  }

  update(dt) {
    const cam = this.camera;
    const alpha = Math.min(1, dt * 3.8);

    if (this.mode === 'shoulder' && this._followTarget) {
      const tp = this._followTarget.mesh.position;
      cam.position.lerp(tp.clone().add(new THREE.Vector3(0, 0.09, 0.24)), alpha);
      cam.lookAt(tp);
    } else if (this.mode === 'orbit' && this._orbitEnabled) {
      const tx = this._orbitCenter.x + Math.cos(this._orbitAngle) * this._orbitRadius;
      const tz = this._orbitCenter.z + Math.sin(this._orbitAngle) * this._orbitRadius;
      cam.position.lerp(new THREE.Vector3(tx, 0.22, tz), alpha);
      cam.lookAt(this._orbitCenter);
    } else {
      cam.position.lerp(this._targetPos, alpha);
      cam.lookAt(this._targetLookAt);
    }

    if (this._shakeDuration > 0) {
      this._shakeTimer += dt;
      if (this._shakeTimer < this._shakeDuration) {
        const decay = 1 - this._shakeTimer / this._shakeDuration;
        cam.position.x += (Math.random()-0.5) * this._shakeIntensity * decay;
        cam.position.y += (Math.random()-0.5) * this._shakeIntensity * decay;
      } else { this._shakeDuration = 0; }
    }
  }
}

// ---------------------------------------------------------------------------
// PARTICLE BURST FX
// ---------------------------------------------------------------------------
function buatBurst(scene, position, color = 0xfbbf24, count = 18) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.007, 5, 5),
      new THREE.MeshBasicMaterial({ color, transparent: true })
    );
    m.position.copy(position);
    scene.add(m);
    particles.push({
      mesh: m,
      vel: new THREE.Vector3((Math.random()-0.5)*0.045, (Math.random()-0.5)*0.045, (Math.random()-0.5)*0.045),
      life: 0
    });
  }
  function tick() {
    let alive = false;
    particles.forEach(p => {
      p.life += 0.05; p.vel.y -= 0.0004;
      p.mesh.position.addScaledVector(p.vel, 1);
      p.mesh.material.opacity = Math.max(0, 1 - p.life * 2.2);
      if (p.life < 0.45) alive = true;
    });
    if (alive) requestAnimationFrame(tick);
    else particles.forEach(p => scene.remove(p.mesh));
  }
  tick();
}

// ---------------------------------------------------------------------------
// SCENE BUILDER
// ---------------------------------------------------------------------------
function buatSceneDasar() {
  const scene = new THREE.Scene();

  scene.add(new THREE.AmbientLight(0xffffff, 1.0));
  const key = new THREE.DirectionalLight(0xffffff, 2.8);
  key.position.set(3, 6, 4); key.castShadow = true;
  key.shadow.mapSize.width = 1024; key.shadow.mapSize.height = 1024;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x93c5fd, 1.2);
  rim.position.set(-4, 2, -3); scene.add(rim);

  const fill = new THREE.DirectionalLight(0xfef3c7, 0.6);
  fill.position.set(1, -1, 2); scene.add(fill);

  // Environment map
  const envCvs = document.createElement('canvas');
  envCvs.width = 256; envCvs.height = 256;
  const envCtx = envCvs.getContext('2d');
  const g = envCtx.createLinearGradient(0,0,0,256);
  g.addColorStop(0, '#1e293b'); g.addColorStop(1, '#0f172a');
  envCtx.fillStyle = g; envCtx.fillRect(0,0,256,256);
  envCtx.fillStyle='rgba(255,255,255,0.9)'; envCtx.shadowColor='#fff'; envCtx.shadowBlur=30;
  envCtx.fillRect(30,40,60,120); envCtx.fillRect(180,60,50,90);
  const envTex = new THREE.CanvasTexture(envCvs);
  envTex.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = envTex;

  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2,2),
    new THREE.ShadowMaterial({ opacity: 0.18 })
  );
  shadowPlane.rotation.x = -Math.PI/2;
  shadowPlane.position.y = -0.38;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  const portalGrup = new THREE.Group();
  scene.add(portalGrup);
  const partikelSys = new SistemPartikel(scene);
  return { scene, portalGrup, partikel: partikelSys };
}

// ---------------------------------------------------------------------------
// DETECT AR MODE
// ---------------------------------------------------------------------------
export async function deteksiModeAR() {
  if (navigator.xr) {
    try { if (await navigator.xr.isSessionSupported('immersive-ar')) return 'webxr'; } catch(_) {}
  }
  return (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ? 'arjs' : 'unsupported';
}

// ---------------------------------------------------------------------------
// MAIN SESSION — mulaiSesiARjs
// ---------------------------------------------------------------------------
export async function mulaiSesiARjs(canvas, videoEl, misiId, onStateChange) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    videoEl.srcObject = stream;
    videoEl.play().catch(e => console.warn('autoplay blocked:', e));
  } catch(e) { console.warn('Camera unavailable.', e); }

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const camera = new THREE.PerspectiveCamera(58, canvas.clientWidth / canvas.clientHeight, 0.01, 30);
  camera.position.set(0, 0.25, 1.1);

  const { scene, partikel } = buatSceneDasar();
  const sm = new ARStateMachine();
  const bubble = new ReactionBubble(scene, 0.35);
  bubble.setPosition(new THREE.Vector3(0, 0, -0.3));
  bubble.setVisible(false);
  partikel.setBubble(bubble);

  const camCtrl = new CameraController(camera);
  camCtrl.enableOrbitTouch(canvas);

  let berjalan = true;
  let portalPlaced = false;
  let playerMolecule = null;
  let targetMolecule = null;
  let reactionDone = false;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let raycasterEnabled = false;

  const reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.055, 0.075, 40).rotateX(-Math.PI/2),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 })
  );
  reticle.visible = false;
  scene.add(reticle);
  setTimeout(() => { if (!portalPlaced) reticle.visible = true; }, 2200);

  // STATE HANDLERS
  sm.on(AR_STATE.REACTION_PORTAL, () => {
    portalPlaced = true; reticle.visible = false;
    bubble.setVisible(true);
    partikel.isiDariMisi(misiId, false);
    soundEngine.whoosh();
    let s = 0;
    const pop = () => { s += 0.055; if (s>=1){s=1; bubble.mesh.scale.setScalar(1); bubble.ring.scale.setScalar(1); sm.setState(AR_STATE.OVERVIEW); return;} bubble.mesh.scale.setScalar(s); bubble.ring.scale.setScalar(s); requestAnimationFrame(pop); };
    bubble.mesh.scale.setScalar(0); bubble.ring.scale.setScalar(0); pop();
  });

  sm.on(AR_STATE.OVERVIEW, () => {
    camCtrl.setMode('overview');
    if (onStateChange) onStateChange(AR_STATE.OVERVIEW, MISI_DATA[misiId].ai.OVERVIEW);
  });

  sm.on(AR_STATE.INVESTIGATE, () => {
    raycasterEnabled = true;
    camCtrl.setMode('overview');
    if (onStateChange) onStateChange(AR_STATE.INVESTIGATE, MISI_DATA[misiId].ai.INVESTIGATE);
  });

  sm.on(AR_STATE.PORTAL_ZOOM, () => {
    raycasterEnabled = false;
    camCtrl.setMode('portal');
    soundEngine.whoosh();
    if (onStateChange) onStateChange(AR_STATE.PORTAL_ZOOM, '');
    setTimeout(() => sm.setState(AR_STATE.MOLECULAR_JOURNEY), 1000);
  });

  sm.on(AR_STATE.MOLECULAR_JOURNEY, () => {
    camCtrl.setMode('shoulder', { target: playerMolecule });
    if (onStateChange) onStateChange(AR_STATE.MOLECULAR_JOURNEY, MISI_DATA[misiId].ai.MOLECULAR_JOURNEY);
    const misiData = MISI_DATA[misiId];
    const candidates = partikel.partikel.filter(p => p.jenis === misiData.target_pasangan && p !== playerMolecule);
    targetMolecule = candidates[Math.floor(Math.random() * candidates.length)] || null;
    if (window._setNavigatorTarget) window._setNavigatorTarget(targetMolecule, camera, scene);
  });

  sm.on(AR_STATE.REACTION_EVENT, () => {
    soundEngine.collision();
    partikel.slowMotion(0.8);
    camCtrl.shake(0.007, 0.5);
    if (onStateChange) onStateChange(AR_STATE.REACTION_EVENT, MISI_DATA[misiId].ai.REACTION_EVENT);
    partikel.flashAll(0xfbbf24, 500);
    setTimeout(() => {
      soundEngine.bondForm();
      if (playerMolecule) buatBurst(scene, playerMolecule.mesh.position.clone(), 0xfbbf24, 18);
      camCtrl.shake(0.004, 0.3);
    }, 420);
    setTimeout(() => sm.setState(AR_STATE.EXPERIMENT), 1700);
  });

  sm.on(AR_STATE.EXPERIMENT, () => {
    partikel.isiDariMisi(misiId, true);
    playerMolecule = null; targetMolecule = null; reactionDone = false;
    if (window._setNavigatorTarget) window._setNavigatorTarget(null, null, null);
    camCtrl.setMode('orbit', { center: bubble.mesh.position.clone(), radius: 0.85 });
    if (onStateChange) onStateChange(AR_STATE.EXPERIMENT, MISI_DATA[misiId].ai.EXPERIMENT);
  });

  sm.on(AR_STATE.REFLECTION, () => {
    soundEngine.missionComplete();
    camCtrl.setMode('overview');
    if (onStateChange) onStateChange(AR_STATE.REFLECTION, MISI_DATA[misiId].ai.REFLECTION);
  });

  sm.on(AR_STATE.EXIT_PORTAL, () => {
    soundEngine.whoosh();
    camCtrl.setMode('exit');
    bubble.setVisible(false);
    setTimeout(() => { if (window._onMissionComplete) window._onMissionComplete(); }, 1200);
  });

  // FIRST TAP
  function onFirstTap(e) {
    if (portalPlaced || !reticle.visible) return;
    // Prevent also triggering canvas tap
    e.stopPropagation && e.stopPropagation();
    bubble.setPosition(reticle.position.clone());
    sm.setState(AR_STATE.REACTION_PORTAL);
  }
  window.addEventListener('pointerdown', onFirstTap, { once: true });

  // MOLECULE PICKING
  function onCanvasTap(e) {
    if (!raycasterEnabled || !berjalan) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.changedTouches?.[0]?.clientX ?? e.clientX;
    const cy = e.changedTouches?.[0]?.clientY ?? e.clientY;
    mouse.x = ((cx - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((cy - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(partikel.container.children, true);
    if (hits.length > 0) {
      const misiData = MISI_DATA[misiId];
      for (const p of partikel.partikel) {
        let isHit = false;
        hits[0].object.traverseAncestors(a => { if (a === p.mesh) isHit = true; });
        if (isHit || hits[0].object === p.mesh) {
          if (p.jenis === misiData.target_jenis) {
            playerMolecule = p;
            soundEngine.collision();
            sm.setState(AR_STATE.PORTAL_ZOOM);
          }
          break;
        }
      }
    }
  }
  canvas.addEventListener('click', onCanvasTap);
  canvas.addEventListener('touchend', onCanvasTap, { passive: true });

  // ANIMATION LOOP
  let lastTime = performance.now();
  function loop() {
    if (!berjalan) return;
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    partikel.perbarui(dt);
    bubble.update(dt);
    camCtrl.update(dt);

    if (!portalPlaced) {
      const t = now * 0.001;
      reticle.position.set(Math.sin(t*0.5)*0.07, -0.3, -0.25 + Math.cos(t*0.33)*0.04);
    }

    // Approach / collision detection
    if (sm.is(AR_STATE.MOLECULAR_JOURNEY) && playerMolecule && targetMolecule && !reactionDone) {
      const dist = playerMolecule.mesh.position.distanceTo(targetMolecule.mesh.position);
      if (window._updateNavDistance) window._updateNavDistance(dist);

      const approachGlow = dist < 0.22 ? Math.min(0.8, (0.22 - dist) / 0.1) : 0.08;
      playerMolecule.mesh.traverse(c => {
        if (c.isMesh && c.material?.emissive) c.material.emissiveIntensity = approachGlow;
      });

      if (dist < 0.13) {
        reactionDone = true;
        sm.setState(AR_STATE.REACTION_EVENT);
      }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  loop();

  window.addEventListener('resize', () => {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  });

  return {
    sm, renderer, scene, partikel, bubble, camCtrl,
    triggerTool: (tool) => {
      soundEngine.bondBreak();
      partikel.flashAll(0x93c5fd, 400);
      camCtrl.shake(0.004, 0.3);
      setTimeout(() => sm.setState(AR_STATE.REFLECTION), 800);
    },
    startInvestigate: () => { if (sm.is(AR_STATE.OVERVIEW)) sm.setState(AR_STATE.INVESTIGATE); },
    exitPortal: () => sm.setState(AR_STATE.EXIT_PORTAL),
    hentikan: () => {
      berjalan = false;
      if (videoEl.srcObject) videoEl.srcObject.getTracks().forEach(t => t.stop());
    }
  };
}

// ---------------------------------------------------------------------------
// WebXR SESSION
// ---------------------------------------------------------------------------
export async function mulaiSesiWebXR(canvas, misiId, onStateChange) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.xr.enabled = true;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const { scene, partikel } = buatSceneDasar();
  const camera = new THREE.PerspectiveCamera();
  const sm = new ARStateMachine();

  const bubble = new ReactionBubble(scene, 0.35);
  bubble.setPosition(new THREE.Vector3(0, 0, -0.5));
  bubble.setVisible(false);
  partikel.setBubble(bubble);

  const session = await navigator.xr.requestSession('immersive-ar', {
    requiredFeatures: ['hit-test'],
    optionalFeatures: ['dom-overlay'],
    domOverlay: { root: document.body }
  });
  await renderer.xr.setSession(session);
  const refSpace = await session.requestReferenceSpace('local');
  const viewerSpace = await session.requestReferenceSpace('viewer');
  const hitSrc = await session.requestHitTestSource({ space: viewerSpace });

  const reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.055, 0.075, 40).rotateX(-Math.PI/2),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
  );
  reticle.visible = false; scene.add(reticle);

  let placed = false;

  sm.on(AR_STATE.REACTION_PORTAL, () => {
    placed = true; reticle.visible = false;
    bubble.setVisible(true); partikel.isiDariMisi(misiId, false);
    soundEngine.whoosh();
    let s = 0;
    const pop = () => { s += 0.055; if(s>=1){s=1; bubble.mesh.scale.setScalar(1); bubble.ring.scale.setScalar(1); sm.setState(AR_STATE.OVERVIEW); return;} bubble.mesh.scale.setScalar(s); bubble.ring.scale.setScalar(s); requestAnimationFrame(pop); };
    bubble.mesh.scale.setScalar(0); bubble.ring.scale.setScalar(0); pop();
  });

  sm.on(AR_STATE.OVERVIEW, () => {
    if (onStateChange) onStateChange(AR_STATE.OVERVIEW, MISI_DATA[misiId].ai.OVERVIEW);
  });

  sm.on(AR_STATE.EXPERIMENT, () => {
    partikel.isiDariMisi(misiId, true);
    if (onStateChange) onStateChange(AR_STATE.EXPERIMENT, MISI_DATA[misiId].ai.EXPERIMENT);
  });

  sm.on(AR_STATE.REFLECTION, () => {
    soundEngine.missionComplete();
    if (onStateChange) onStateChange(AR_STATE.REFLECTION, MISI_DATA[misiId].ai.REFLECTION);
  });

  session.addEventListener('select', () => {
    if (placed || !reticle.visible) return;
    bubble.setPosition(reticle.position.clone());
    sm.setState(AR_STATE.REACTION_PORTAL);
  });

  renderer.setAnimationLoop((ts, frame) => {
    if (frame && !placed) {
      const hits = frame.getHitTestResults(hitSrc);
      if (hits.length > 0) {
        reticle.visible = true;
        const p = hits[0].getPose(refSpace).transform.position;
        reticle.position.set(p.x, p.y, p.z);
      } else { reticle.visible = false; }
    }
    partikel.perbarui(1/60); bubble.update(1/60);
    renderer.render(scene, camera);
  });

  return {
    sm, renderer, scene, partikel, bubble,
    triggerTool: () => { soundEngine.bondBreak(); setTimeout(() => sm.setState(AR_STATE.REFLECTION), 800); },
    startInvestigate: () => { if (sm.is(AR_STATE.OVERVIEW)) sm.setState(AR_STATE.INVESTIGATE); },
    exitPortal: () => sm.setState(AR_STATE.EXIT_PORTAL),
    hentikan: () => { renderer.setAnimationLoop(null); session.end(); }
  };
}

// Legacy stubs
export function perbaruiVisualMisi() { return true; }
