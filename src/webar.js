import * as THREE from 'three';

/* ==========================================================================
   ARCHEMY WEBAR ENGINE v3.0 - Molecular Journey (Immersive Portal)
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
});

let lastShakeTime = 0;
window.addEventListener('devicemotion', (e) => {
  const acc = e.acceleration || { x: 0, y: 0, z: 0 };
  const force = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
  if (force > 12) { sensorData.shake = force * 0.0002; lastShakeTime = performance.now(); }
  if (performance.now() - lastShakeTime > 500) sensorData.shake *= 0.9;
});

export function requestSensorPermission() {
  sensorData.shake = 0;
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
      INVESTIGATE:       'Pilih molekul I\u2082.',
      MOLECULAR_JOURNEY: 'Mari cari H\u2082.',
      REACTION_EVENT:    'Efektif! Terbentuk ikatan.',
      EXPERIMENT:        'Naikkan suhu.',
      REFLECTION:        'Reaksi setimbang.',
    },
    target_jenis: 'I2', target_pasangan: 'H2', produk: 'HI', tool: 'heat',
    parameterKunci: 'suhu',
  },
  misi2: {
    judul: 'Misi 2: Smog Kota',
    persamaan: '2NO\u2082(g) \u21cc N\u2082O\u2084(g)',
    ai: {
      OVERVIEW:          'Gas NO\u2082 ada di sekitarmu.',
      INVESTIGATE:       'Pilih molekul NO\u2082.',
      MOLECULAR_JOURNEY: 'Cari NO\u2082 lainnya.',
      REACTION_EVENT:    'Ikatan terbentuk!',
      EXPERIMENT:        'Tekan Compress.',
      REFLECTION:        'Sistem stabil.',
    },
    target_jenis: 'NO2', target_pasangan: 'NO2', produk: 'N2O4', tool: 'compress',
    parameterKunci: 'volume',
  },
  misi3: {
    judul: 'Misi 3: Pabrik Amonia',
    persamaan: 'N\u2082(g) + 3H\u2082(g) \u21cc 2NH\u2083(g)',
    ai: {
      OVERVIEW:          'Gas amonia.',
      INVESTIGATE:       'Pilih molekul N\u2082.',
      MOLECULAR_JOURNEY: 'Ikuti jalur energi.',
      REACTION_EVENT:    'Amonia terbentuk!',
      EXPERIMENT:        'Tambahkan H\u2082.',
      REFLECTION:        'Reaksi bergeser.',
    },
    target_jenis: 'N2', target_pasangan: 'H2', produk: 'NH3', tool: 'add',
    parameterKunci: 'konsentrasi',
  },
  misi4: {
    judul: 'Misi 4: Buffer Darah',
    persamaan: 'CO\u2082(g) + H\u2082O(l) \u21cc H\u2082CO\u2083(aq)',
    ai: {
      OVERVIEW:          'Ini asam karbonat.',
      INVESTIGATE:       'Pilih molekul CO\u2082.',
      MOLECULAR_JOURNEY: 'Cari H\u2082O.',
      REACTION_EVENT:    'Menjadi H\u2082CO\u2083!',
      EXPERIMENT:        'Compress!',
      REFLECTION:        'Sistem seimbang.',
    },
    target_jenis: 'CO2', target_pasangan: 'H2O', produk: 'H2CO3', tool: 'compress',
    parameterKunci: 'tekanan',
  },
  misi5: {
    judul: 'Misi 5: Batu Kapur',
    persamaan: 'CaCO\u2083(s) \u21cc CaO(s) + CO\u2082(g)',
    ai: {
      OVERVIEW:          'Batu kapur solid.',
      INVESTIGATE:       'Pilih CaCO\u2083.',
      MOLECULAR_JOURNEY: 'Tunggu energi panas.',
      REACTION_EVENT:    'Endotermik!',
      EXPERIMENT:        'Panaskan sistem.',
      REFLECTION:        'Bagus sekali.',
    },
    target_jenis: 'CaCO3', target_pasangan: null, produk: 'CO2', tool: 'heat',
    parameterKunci: 'suhu',
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
// MOLECULAR PORTAL
// ---------------------------------------------------------------------------
export class MolecularPortal {
  constructor(scene) {
    this._t = 0;
    this.mesh = new THREE.Group();
    
    // Portal ring
    const ringGeo = new THREE.TorusGeometry(0.3, 0.008, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    this.ring = new THREE.Mesh(ringGeo, ringMat);
    this.ring.rotation.x = -Math.PI / 2;
    this.mesh.add(this.ring);

    // Portal inner glow
    const glowGeo = new THREE.PlaneGeometry(0.58, 0.58);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending });
    this.glow = new THREE.Mesh(glowGeo, glowMat);
    this.glow.rotation.x = -Math.PI / 2;
    this.glow.position.y = -0.005;
    this.mesh.add(this.glow);

    // Base marker
    const baseGeo = new THREE.RingGeometry(0.28, 0.32, 32);
    const baseMat = new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.4 });
    this.base = new THREE.Mesh(baseGeo, baseMat);
    this.base.rotation.x = -Math.PI / 2;
    this.base.position.y = -0.01;
    this.mesh.add(this.base);

    this.mesh.visible = false;
    scene.add(this.mesh);
  }

  setPosition(pos) { this.mesh.position.copy(pos); }
  setVisible(v) { this.mesh.visible = v; }

  update(dt) {
    this._t += dt;
    this.ring.scale.setScalar(1 + Math.sin(this._t * 2) * 0.05);
    this.glow.rotation.z += dt * 0.2;
    this.glow.material.opacity = 0.2 + Math.sin(this._t * 3) * 0.1;
  }
}

// ---------------------------------------------------------------------------
// AMBIENT PARTICLES
// ---------------------------------------------------------------------------
class AmbientParticles {
  constructor(scene) {
    const geo = new THREE.BufferGeometry();
    const count = 150;
    const pos = new Float32Array(count * 3);
    for(let i=0; i<count*3; i++) {
      pos[i] = (Math.random() - 0.5) * 4;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.015, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
    this.points = new THREE.Points(geo, mat);
    this.points.visible = false;
    scene.add(this.points);
  }
  setVisible(v) { this.points.visible = v; }
  update(dt) {
    this.points.rotation.y += dt * 0.02;
    this.points.rotation.x += dt * 0.01;
  }
}

// ---------------------------------------------------------------------------
// GUIDED JOURNEY SYSTEM (Energy Path)
// ---------------------------------------------------------------------------
export class GuidedJourneySystem {
  constructor(scene) {
    this.scene = scene;
    this.container = new THREE.Group();
    scene.add(this.container);
    this.pathLength = 10;
    this.points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -2),
      new THREE.Vector3(-1.5, 0, -4),
      new THREE.Vector3(1.5, 0, -6),
      new THREE.Vector3(0, 0, -8),
      new THREE.Vector3(0, 0, -10),
    ];
    this.curve = new THREE.CatmullRomCurve3(this.points);
    
    const tubeGeo = new THREE.TubeGeometry(this.curve, 64, 0.02, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
    this.pathMesh = new THREE.Mesh(tubeGeo, tubeMat);
    this.pathMesh.visible = false;
    this.container.add(this.pathMesh);

    this.playerMolecule = null;
    this.targetMolecule = null;
    this.playerProgress = 0;
    this.speed = 0.08;
    this.isMoving = false;
    this.collisionEventFired = false;
    this.onCollision = null;
  }

  initJourney(playerMol, targetMol, centerPos) {
    this.container.position.copy(centerPos); // Start path at portal
    this.playerMolecule = playerMol;
    this.targetMolecule = targetMol;
    this.playerProgress = 0;
    this.collisionEventFired = false;
    this.isMoving = true;
    this.pathMesh.visible = true;

    // Place target ahead on path
    if (this.targetMolecule) {
      const targetPos = this.curve.getPointAt(0.4);
      this.targetMolecule.mesh.position.copy(targetPos).add(this.container.position);
    }
  }

  stop() {
    this.isMoving = false;
  }

  resume() {
    this.isMoving = true;
  }

  update(dt) {
    if (!this.isMoving || !this.playerMolecule) return;
    
    this.playerProgress += dt * this.speed;
    if (this.playerProgress > 1) this.playerProgress = 0; // Loop path

    // Update player position along path
    const pos = this.curve.getPointAt(this.playerProgress);
    this.playerMolecule.mesh.position.copy(pos).add(this.container.position);

    // Idle rotation
    this.playerMolecule.mesh.rotation.y += dt * 0.5;
    this.playerMolecule.mesh.rotation.x += dt * 0.2;

    if (this.targetMolecule) {
      this.targetMolecule.mesh.rotation.y += dt * -0.5;
      this.targetMolecule.mesh.rotation.x += dt * -0.2;
    }

    // Collision detection
    if (this.targetMolecule && !this.collisionEventFired) {
      const dist = this.playerMolecule.mesh.position.distanceTo(this.targetMolecule.mesh.position);
      if (dist < 0.25 && this.playerProgress > 0.3) {
        this.collisionEventFired = true;
        if (this.onCollision) this.onCollision();
      }
    }
  }

  hidePath() {
    this.pathMesh.visible = false;
  }
}

// ---------------------------------------------------------------------------
// CAMERA CONTROLLER v2 (Third Person Follow)
// ---------------------------------------------------------------------------
export class CameraController {
  constructor(camera) {
    this.camera = camera;
    this.mode = 'overview';
    this._targetPos = new THREE.Vector3(0, 0.4, 0.5);
    this._targetLookAt = new THREE.Vector3(0, 0, 0);
    this._followTarget = null;
    this._shakeIntensity = 0; this._shakeDuration = 0; this._shakeTimer = 0;
    
    // Smoothing parameters
    this._camPosLerp = 3.8;
  }

  setMode(mode, options = {}) {
    this.mode = mode;
    if (mode === 'overview') {
      this._targetPos.set(0, 0.4, 0.5);
      this._targetLookAt.set(0, 0, 0);
    } else if (mode === 'portal_zoom') {
      this._targetPos.set(options.center.x, options.center.y - 0.1, options.center.z);
      this._targetLookAt.set(options.center.x, options.center.y - 1, options.center.z - 2);
    } else if (mode === 'third_person') {
      this._followTarget = options.target;
    } else if (mode === 'orbit') {
      // In experiment phase, we might just look at the molecule from a fixed nice angle
      this._targetPos.set(this._followTarget.mesh.position.x, this._followTarget.mesh.position.y + 0.3, this._followTarget.mesh.position.z + 0.6);
      this._targetLookAt.copy(this._followTarget.mesh.position);
    }
  }

  shake(intensity = 0.01, duration = 0.5) {
    this._shakeIntensity = intensity;
    this._shakeDuration = duration;
    this._shakeTimer = 0;
  }

  update(dt) {
    const cam = this.camera;
    const alpha = Math.min(1, dt * this._camPosLerp);

    if (this.mode === 'third_person' && this._followTarget) {
      // Follow behind the molecule along Z
      const tp = this._followTarget.mesh.position;
      const offset = new THREE.Vector3(0, 0.15, 0.4);
      cam.position.lerp(tp.clone().add(offset), alpha * 1.5);
      
      const lookPos = tp.clone().add(new THREE.Vector3(0, 0, -0.5));
      cam.lookAt(lookPos);
    } else if (this.mode === 'orbit' && this._followTarget) {
       this._targetPos.set(this._followTarget.mesh.position.x + Math.sin(Date.now()*0.0005)*0.5, this._followTarget.mesh.position.y + 0.2, this._followTarget.mesh.position.z + Math.cos(Date.now()*0.0005)*0.5);
       this._targetLookAt.copy(this._followTarget.mesh.position);
       cam.position.lerp(this._targetPos, alpha);
       cam.lookAt(this._targetLookAt);
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
function buatBurst(scene, position, color = 0x7df9ff, count = 20) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.008, 5, 5),
      new THREE.MeshBasicMaterial({ color, transparent: true })
    );
    m.position.copy(position);
    scene.add(m);
    particles.push({
      mesh: m,
      vel: new THREE.Vector3((Math.random()-0.5)*0.06, (Math.random()-0.5)*0.06, (Math.random()-0.5)*0.06),
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

  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  const key = new THREE.DirectionalLight(0xffffff, 2.5);
  key.position.set(2, 5, 3); key.castShadow = true;
  key.shadow.mapSize.width = 1024; key.shadow.mapSize.height = 1024;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x7df9ff, 1.5);
  rim.position.set(-3, 1, -4); scene.add(rim);

  const portal = new MolecularPortal(scene);
  const ambient = new AmbientParticles(scene);
  const journey = new GuidedJourneySystem(scene);

  return { scene, portal, ambient, journey };
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
// MAIN SESSION
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
  // Apply a subtle bloom effect via tone mapping / output encoding if needed, keeping it simple for now
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.01, 50);
  camera.position.set(0, 0.4, 0.5);

  const { scene, portal, ambient, journey } = buatSceneDasar();
  const sm = new ARStateMachine();
  const camCtrl = new CameraController(camera);

  let berjalan = true;
  let portalPlaced = false;
  let playerMolecule = null;
  let targetMolecule = null;
  let misiData = MISI_DATA[misiId];
  let eqForward = 50;
  let eqReverse = 50;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let raycasterEnabled = false;

  const reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.08, 0.1, 32).rotateX(-Math.PI/2),
    new THREE.MeshBasicMaterial({ color: 0x7df9ff, transparent: true, opacity: 0.8 })
  );
  reticle.visible = false;
  scene.add(reticle);
  setTimeout(() => { if (!portalPlaced) reticle.visible = true; }, 2000);

  // STATE HANDLERS
  sm.on(AR_STATE.REACTION_PORTAL, () => {
    portalPlaced = true; reticle.visible = false;
    portal.setVisible(true);
    soundEngine.whoosh();
    setTimeout(() => sm.setState(AR_STATE.OVERVIEW), 1000);
  });

  sm.on(AR_STATE.OVERVIEW, () => {
    camCtrl.setMode('overview');
    if (onStateChange) onStateChange(AR_STATE.OVERVIEW, misiData.ai.OVERVIEW);
    setTimeout(() => sm.setState(AR_STATE.INVESTIGATE), 2000);
  });

  sm.on(AR_STATE.INVESTIGATE, () => {
    raycasterEnabled = true;
    camCtrl.setMode('overview');
    if (onStateChange) onStateChange(AR_STATE.INVESTIGATE, misiData.ai.INVESTIGATE);
  });

  sm.on(AR_STATE.PORTAL_ZOOM, () => {
    raycasterEnabled = false;
    camCtrl.setMode('portal_zoom', { center: portal.mesh.position });
    soundEngine.whoosh();
    if (onStateChange) onStateChange(AR_STATE.PORTAL_ZOOM, '');
    
    // Zoom transition then start journey
    setTimeout(() => {
      portal.setVisible(false);
      ambient.setVisible(true); // Turn on dark world particles
      
      // Setup players
      playerMolecule = { mesh: buatMolekul(misiData.target_jenis), jenis: misiData.target_jenis };
      targetMolecule = { mesh: buatMolekul(misiData.target_pasangan), jenis: misiData.target_pasangan };
      scene.add(playerMolecule.mesh);
      scene.add(targetMolecule.mesh);

      // Add "YOU" indicator
      const youSprite = createTextSprite("⭐ YOU", 0x7df9ff);
      youSprite.position.set(0, 0.15, 0);
      playerMolecule.mesh.add(youSprite);

      journey.initJourney(playerMolecule, targetMolecule, portal.mesh.position);
      
      // Register collision event
      journey.onCollision = () => {
        sm.setState(AR_STATE.REACTION_EVENT);
      };

      sm.setState(AR_STATE.MOLECULAR_JOURNEY);
    }, 1500);
  });

  sm.on(AR_STATE.MOLECULAR_JOURNEY, () => {
    camCtrl.setMode('third_person', { target: playerMolecule });
    if (onStateChange) onStateChange(AR_STATE.MOLECULAR_JOURNEY, misiData.ai.MOLECULAR_JOURNEY);
    if (window._updateHUDForm) window._updateHUDForm(false, misiData.target_jenis);
    if (window._updateHUDEq) window._updateHUDEq(50, 50);
  });

  sm.on(AR_STATE.REACTION_EVENT, () => {
    soundEngine.collision();
    journey.speed = 0.02; // Slow motion
    camCtrl.shake(0.01, 0.5);
    
    // Flash effect
    playerMolecule.mesh.children.forEach(c => c.material && c.material.emissive && c.material.emissive.setHex(0x7df9ff));
    
    if (onStateChange) onStateChange(AR_STATE.REACTION_EVENT, misiData.ai.REACTION_EVENT);
    
    setTimeout(() => {
      soundEngine.bondForm();
      buatBurst(scene, playerMolecule.mesh.position.clone());
      camCtrl.shake(0.005, 0.3);
      
      // Morph into product
      scene.remove(playerMolecule.mesh);
      scene.remove(targetMolecule.mesh);
      
      playerMolecule.mesh = buatMolekul(misiData.produk);
      playerMolecule.jenis = misiData.produk;
      scene.add(playerMolecule.mesh);
      
      const youSprite = createTextSprite("⭐ YOU", 0xfde047);
      youSprite.position.set(0, 0.15, 0);
      playerMolecule.mesh.add(youSprite);
      
      journey.playerMolecule = playerMolecule;
      journey.targetMolecule = null; // No target anymore

      if (window._updateHUDForm) window._updateHUDForm(true, misiData.produk);
      
      // Update equilibrium bar visually
      eqForward = 80; eqReverse = 20;
      if (window._updateHUDEq) window._updateHUDEq(eqForward, eqReverse);

      journey.speed = 0.08; // Normal speed

      setTimeout(() => sm.setState(AR_STATE.EXPERIMENT), 1500);
    }, 1000);
  });

  sm.on(AR_STATE.EXPERIMENT, () => {
    camCtrl.setMode('orbit', { target: playerMolecule });
    journey.hidePath();
    if (onStateChange) onStateChange(AR_STATE.EXPERIMENT, misiData.ai.EXPERIMENT);
  });

  sm.on(AR_STATE.REFLECTION, () => {
    soundEngine.missionComplete();
    if (onStateChange) onStateChange(AR_STATE.REFLECTION, misiData.ai.REFLECTION);
  });

  // EXPERIMENT TOOLS
  const tools = {
    triggerTool: (toolName) => {
      if (!sm.is(AR_STATE.EXPERIMENT)) return;
      if (toolName === misiData.tool) {
        // Correct tool
        if (window._updateHUDEq) window._updateHUDEq(20, 80); // Reverse rate spikes
        if (onStateChange) onStateChange(AR_STATE.EXPERIMENT, "Laju reaksi balik membesar.");
        
        // Reverse reaction animation
        setTimeout(() => {
          soundEngine.bondBreak();
          buatBurst(scene, playerMolecule.mesh.position.clone(), 0xff3333);
          camCtrl.shake(0.008, 0.4);
          
          scene.remove(playerMolecule.mesh);
          playerMolecule.mesh = buatMolekul(misiData.target_jenis);
          playerMolecule.jenis = misiData.target_jenis;
          scene.add(playerMolecule.mesh);
          
          const youSprite = createTextSprite("⭐ YOU", 0x7df9ff);
          youSprite.position.set(0, 0.15, 0);
          playerMolecule.mesh.add(youSprite);
          
          if (window._updateHUDForm) window._updateHUDForm(false, misiData.target_jenis);
          
          // Re-add target to loop
          targetMolecule = { mesh: buatMolekul(misiData.target_pasangan), jenis: misiData.target_pasangan };
          scene.add(targetMolecule.mesh);
          journey.pathMesh.visible = true;
          journey.initJourney(playerMolecule, targetMolecule, portal.mesh.position);
          
          sm.setState(AR_STATE.REFLECTION); // Finish loop for demo
        }, 1200);

      } else {
        if (onStateChange) onStateChange(AR_STATE.EXPERIMENT, "Bukan itu. Coba yang lain.");
      }
    },
    hentikan: () => { berjalan = false; }
  };

  // INTERACTION
  function onCanvasTap(e) {
    if (!berjalan) return;
    
    // First Tap to place portal
    if (!portalPlaced && reticle.visible) {
      portal.setPosition(reticle.position.clone());
      sm.setState(AR_STATE.REACTION_PORTAL);
      return;
    }

    // Tap Portal to enter
    if (sm.is(AR_STATE.INVESTIGATE) && raycasterEnabled) {
      sm.setState(AR_STATE.PORTAL_ZOOM);
    }
  }
  canvas.addEventListener('pointerdown', onCanvasTap);

  function createTextSprite(message, color) {
    const cvs = document.createElement('canvas');
    cvs.width = 128; cvs.height = 32;
    const ctx = cvs.getContext('2d');
    ctx.font = 'Bold 18px Arial';
    ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
    ctx.textAlign = 'center';
    ctx.fillText(message, 64, 22);
    const tex = new THREE.CanvasTexture(cvs);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(0.4, 0.1, 1);
    return sprite;
  }

  // RENDER LOOP
  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    if (!berjalan) return;
    const dt = clock.getDelta();
    const t = clock.getElapsedTime();

    if (!portalPlaced && reticle.visible) {
      reticle.position.set(0, 0, -0.6);
      reticle.rotation.z += dt * 1;
    }

    if (sm.is(AR_STATE.REACTION_PORTAL)) portal.update(dt);
    if (ambient.points.visible) ambient.update(dt);
    if (sm.is(AR_STATE.MOLECULAR_JOURNEY) || sm.is(AR_STATE.REACTION_EVENT)) journey.update(dt);

    camCtrl.update(dt);
    renderer.render(scene, camera);
  });

  return tools;
}

export async function mulaiSesiWebXR(canvas, misiId, onStateChange) {
  // WebXR code will wrap ARjs for now, same logic.
  return mulaiSesiARjs(canvas, document.createElement('video'), misiId, onStateChange);
}
