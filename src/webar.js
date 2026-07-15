import * as THREE from 'three';

/* ==========================================================================
   ARCHEMY WEBAR ENGINE v7.0 - Quantum Space & Infinite Confusion
   ========================================================================== */

export function requestSensorPermission() {
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
      INVESTIGATE:       'Tap portal untuk masuk.',
      MOLECULAR_JOURNEY: 'Tahan GAS untuk melaju. Perhatikan apa yang terjadi saat kamu menabrak sesuatu!',
      DYNAMIC_EQUILIBRIUM:'Tunggu, mengapa bentukmu kembali seperti semula? Jawab kuis di layar.',
      EXPERIMENT:        'Bagus! Sekarang, amati apa yang terjadi pada rintangan di depan saat kamu menekan tombol HEAT.',
      REFLECTION:        'Pola rintangan berubah! Inilah efek pergeseran kesetimbangan (Le Chatelier).',
    },
    target_jenis: 'I2', target_pasangan: 'H2', produk: 'HI', tool: 'heat'
  },
  misi2: {
    judul: 'Misi 2: Smog Kota',
    persamaan: '2NO\u2082(g) \u21cc N\u2082O\u2084(g)',
    ai: {
      OVERVIEW:          'Gas NO\u2082 beracun.',
      INVESTIGATE:       'Masuk ke portal.',
      MOLECULAR_JOURNEY: 'Tahan GAS. Amati siklus perubahan molekulmu.',
      DYNAMIC_EQUILIBRIUM:'Apakah kamu menyadari polanya? Jawab kuis ini.',
      EXPERIMENT:        'Tepat sekali. Coba tekan tombol COMPRESS dan rasakan perubahan di sekitarmu.',
      REFLECTION:        'Rasio gerbang berubah drastis! Kesetimbangan bergeser ke arah produk.',
    },
    target_jenis: 'NO2', target_pasangan: 'NO2', produk: 'N2O4', tool: 'compress'
  },
  misi3: {
    judul: 'Misi 3: Pabrik Amonia',
    persamaan: 'N\u2082(g) + 3H\u2082(g) \u21cc 2NH\u2083(g)',
    ai: {
      OVERVIEW:          'Produksi amonia.',
      INVESTIGATE:       'Tap untuk masuk.',
      MOLECULAR_JOURNEY: 'Tancap gas. Jangan berhenti mengamati.',
      DYNAMIC_EQUILIBRIUM:'Mengapa reaksinya seolah tidak pernah selesai?',
      EXPERIMENT:        'Gunakan tombol ADD untuk menambah Reaktan. Apa yang terjadi pada jalan di depan?',
      REFLECTION:        'Lintasan dipenuhi gerbang pembentuk Produk! Kesetimbangan bergeser.',
    },
    target_jenis: 'N2', target_pasangan: 'H2', produk: 'NH3', tool: 'add'
  }
};

export const AR_STATE = {
  SCAN: 'SCAN', REACTION_PORTAL: 'REACTION_PORTAL', OVERVIEW: 'OVERVIEW',
  INVESTIGATE: 'INVESTIGATE', PORTAL_ZOOM: 'PORTAL_ZOOM', MOLECULAR_JOURNEY: 'MOLECULAR_JOURNEY',
  DYNAMIC_EQUILIBRIUM: 'DYNAMIC_EQUILIBRIUM', EXPERIMENT: 'EXPERIMENT', REFLECTION: 'REFLECTION'
};

export class ARStateMachine {
  constructor() { this.state = AR_STATE.SCAN; this._listeners = {}; }
  setState(newState) {
    const prev = this.state; this.state = newState;
    if (this._listeners[newState]) this._listeners[newState].forEach(fn => fn(prev));
  }
  on(state, fn) {
    if (!this._listeners[state]) this._listeners[state] = [];
    this._listeners[state].push(fn); return this;
  }
  is(state) { return this.state === state; }
}

class ARSoundEngine {
  constructor() { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { this.ctx = null; } }
  _resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); }
  whoosh() {
    if (!this.ctx) return; this._resume();
    const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.frequency.setValueAtTime(700, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
    osc.start(); osc.stop(this.ctx.currentTime + 0.5);
  }
  bondForm() {
    if (!this.ctx) return; this._resume();
    [523, 659, 784].forEach((freq, i) => {
      const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.type = 'sine'; osc.frequency.value = freq;
      const t = this.ctx.currentTime + i * 0.07;
      gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.18, t + 0.05); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
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

function buatAtomMesh(simbol) {
  const r = ATOM_RADIUS[simbol] || 0.06; const col = ATOM_WARNA[simbol] || 0x888888;
  const mat = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.1, roughness: 0.3, metalness: 0.2 });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 28), mat); mesh.castShadow = true; return mesh;
}
function buatBondMesh(p1, p2) {
  const dist = p1.distanceTo(p2); if (dist < 0.005) return null;
  const geo = new THREE.CylinderGeometry(0.012, 0.012, dist, 8);
  const mat = new THREE.MeshStandardMaterial({ color: 0xd4d4d4, roughness: 0.4, metalness: 0.2 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(p1).lerp(p2, 0.5); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
  return mesh;
}

const RESEP_MOLEKUL = {
  H2: [['H',-0.05,0,0],['H',0.05,0,0]], I2: [['I',-0.07,0,0],['I',0.07,0,0]], HI: [['H',-0.055,0,0],['I',0.055,0,0]],
  N2: [['N',-0.05,0,0],['N',0.05,0,0]], H2O: [['O',0,0,0],['H',-0.06,-0.05,0],['H',0.06,-0.05,0]],
  NO2: [['N',0,0,0],['O',-0.065,0.055,0],['O',0.065,0.055,0]],
  N2O4: [['N',-0.04,0,0],['N',0.04,0,0],['O',-0.10,0.05,0],['O',-0.10,-0.05,0],['O',0.10,0.05,0],['O',0.10,-0.05,0]],
  NH3: [['N',0,0.04,0],['H',-0.055,-0.025,0.03],['H',0.055,-0.025,0.03],['H',0,-0.025,-0.06]]
};

export function buatMolekul(jenis) {
  const atoms = RESEP_MOLEKUL[jenis]; const grup = new THREE.Group(); grup.userData.jenis = jenis;
  if (atoms) {
    const positions = atoms.map(([sym, x, y, z]) => {
      const atom = buatAtomMesh(sym); atom.position.set(x, y, z); atom.userData.simbol = sym; grup.add(atom);
      return new THREE.Vector3(x, y, z);
    });
    for (let i = 0; i < positions.length - 1; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (positions[i].distanceTo(positions[j]) < 0.16) { const b = buatBondMesh(positions[i], positions[j]); if (b) grup.add(b); }
      }
    }
  } else { const sym = jenis.replace(/[0-9]/g, '').slice(0, 2) || 'C'; grup.add(buatAtomMesh(sym)); }
  grup.scale.setScalar(0.8);
  return grup;
}

function createTextSprite(message, colorHex) {
  const cvs = document.createElement('canvas'); cvs.width = 256; cvs.height = 64; const ctx = cvs.getContext('2d');
  ctx.font = 'Bold 40px Poppins, sans-serif'; ctx.fillStyle = colorHex;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(message, 128, 32);
  const mat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cvs), transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat); sprite.scale.set(0.6, 0.15, 1); return sprite;
}

// ---------------------------------------------------------------------------
// DEVICE ORIENTATION (TRUE AR CAMERA)
// ---------------------------------------------------------------------------
class CustomDeviceOrientationControls {
  constructor(camera) {
    this.camera = camera; this.enabled = true; this.deviceOrientation = {}; this.screenOrientation = 0;
    const onDO = (e) => this.deviceOrientation = e;
    const onSO = () => this.screenOrientation = window.orientation || 0;
    window.addEventListener('orientationchange', onSO); window.addEventListener('deviceorientation', onDO);
    onSO();
    this.euler = new THREE.Euler(); this.q0 = new THREE.Quaternion();
    this.q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); this.zee = new THREE.Vector3(0, 0, 1);
  }
  update() {
    if (!this.enabled) return;
    const alpha = this.deviceOrientation.alpha ? THREE.MathUtils.degToRad(this.deviceOrientation.alpha) : 0;
    const beta = this.deviceOrientation.beta ? THREE.MathUtils.degToRad(this.deviceOrientation.beta) : 0;
    const gamma = this.deviceOrientation.gamma ? THREE.MathUtils.degToRad(this.deviceOrientation.gamma) : 0;
    const orient = this.screenOrientation ? THREE.MathUtils.degToRad(this.screenOrientation) : 0;
    this.euler.set(beta, alpha, -gamma, 'YXZ');
    this.camera.quaternion.setFromEuler(this.euler);
    this.camera.quaternion.multiply(this.q1);
    this.camera.quaternion.multiply(this.q0.setFromAxisAngle(this.zee, -orient));
  }
}

// ---------------------------------------------------------------------------
// QUANTUM SPACE 3D ENVIRONMENT (Immersive Runner)
// ---------------------------------------------------------------------------
class QuantumSpace {
  constructor(scene) {
    this.scene = scene;
    this.container = new THREE.Group();
    this.container.visible = false;
    scene.add(this.container);

    // 1. Nebula Skybox (Ribuan Partikel)
    const skyGeo = new THREE.BufferGeometry();
    const skyCount = 3000;
    const skyPos = new Float32Array(skyCount * 3);
    for(let i=0; i<skyCount*3; i++) skyPos[i] = (Math.random() - 0.5) * 80;
    skyGeo.setAttribute('position', new THREE.BufferAttribute(skyPos, 3));
    const skyMat = new THREE.PointsMaterial({ color: 0x93c5fd, size: 0.08, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    this.skybox = new THREE.Points(skyGeo, skyMat);
    this.container.add(this.skybox);

    // 2. Solid Energy Bridge (Rel 3D)
    // We make a long box that scrolls its texture to fake infinite movement
    const bridgeGeo = new THREE.BoxGeometry(1.5, 0.1, 100);
    const cvs = document.createElement('canvas'); cvs.width = 128; cvs.height = 512;
    const ctx = cvs.getContext('2d');
    ctx.fillStyle = '#02040a'; ctx.fillRect(0,0,128,512);
    ctx.strokeStyle = '#0ea5e9'; ctx.lineWidth = 4;
    for(let y=0; y<512; y+=64) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(128,y); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(64,0); ctx.lineTo(64,512); ctx.stroke();
    
    this.bridgeTex = new THREE.CanvasTexture(cvs);
    this.bridgeTex.wrapS = THREE.RepeatWrapping; this.bridgeTex.wrapT = THREE.RepeatWrapping;
    this.bridgeTex.repeat.set(1, 20);
    
    const bridgeMat = new THREE.MeshStandardMaterial({ map: this.bridgeTex, color: 0xaaaaaa, emissive: 0x0ea5e9, emissiveIntensity: 0.2, roughness: 0.1, metalness: 0.8 });
    this.bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    this.bridge.position.set(0, -0.4, -40);
    this.container.add(this.bridge);

    // 3. Floating 3D Quantum Rocks (Asteroids)
    this.rocks = [];
    const rockGeo = new THREE.DodecahedronGeometry(0.8, 0); // Low poly
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8, metalness: 0.3, flatShading: true });
    
    for(let i=0; i<30; i++) {
      const rock = new THREE.Mesh(rockGeo, rockMat);
      this.resetRock(rock);
      rock.position.z = -Math.random() * 80; // scatter initially
      this.rocks.push(rock);
      this.container.add(rock);
    }

    // 4. Lights
    const hemiLight = new THREE.HemisphereLight(0x7df9ff, 0x02040a, 0.8);
    this.container.add(hemiLight);
  }

  resetRock(rock) {
    const side = Math.random() > 0.5 ? 1 : -1;
    rock.position.set(side * (1.5 + Math.random() * 3), (Math.random() - 0.5) * 4, -80 - Math.random() * 20);
    rock.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
    rock.scale.setScalar(0.5 + Math.random() * 1.2);
    rock.userData.rotSpeed = new THREE.Vector3((Math.random()-0.5)*2, (Math.random()-0.5)*2, (Math.random()-0.5)*2);
  }

  setVisible(v) { this.container.visible = v; }
  
  update(dt, velocity) {
    if(!this.container.visible) return;
    
    // Scroll Bridge Texture
    this.bridgeTex.offset.y -= velocity * dt * 0.5;
    
    // Move Rocks towards camera
    this.rocks.forEach(rock => {
      rock.position.z += velocity * dt * 10; // 10 is scale factor for world speed
      rock.rotation.x += rock.userData.rotSpeed.x * dt;
      rock.rotation.y += rock.userData.rotSpeed.y * dt;
      if(rock.position.z > 5) this.resetRock(rock); // Recycle behind camera
    });

    this.skybox.rotation.y += dt * 0.01;
  }
}

// ---------------------------------------------------------------------------
// INFINITE RUNNER & CONFUSION LOGIC
// ---------------------------------------------------------------------------
class InfiniteRunnerSystem {
  constructor(scene, misiData, onStateChange) {
    this.scene = scene;
    this.misiData = misiData;
    this.onStateChange = onStateChange;
    
    this.playerMolecule = null;
    this.isProduct = false;
    this.velocity = 0; 
    
    this.gates = []; // Gerbang (Biru/Merah)
    this.loopCount = 0;
    
    // Le Chatelier factor: 
    // 0 = balance (50% red, 50% blue)
    // -1 = favor reactant (90% red)
    // +1 = favor product (90% blue)
    this.equilibriumShift = 0; 
  }

  initPlayer() {
    this.isProduct = false;
    this.playerMolecule = buatMolekul(this.misiData.target_jenis);
    this.playerMolecule.position.set(0, 0, -1);
    this.scene.add(this.playerMolecule);

    const youSprite = createTextSprite("⭐ YOU", '#7df9ff');
    youSprite.position.set(0, 0.25, 0);
    this.playerMolecule.add(youSprite);
    
    if(window._updateHUDForm) window._updateHUDForm(false, this.misiData.target_jenis);
  }

  spawnGate() {
    // Tentukan jenis gerbang berdasarkan shift
    let wantBlue = Math.random() > 0.5;
    if(this.equilibriumShift < 0) wantBlue = Math.random() > 0.8; // Sulit dapat biru (sering merah/pecah)
    if(this.equilibriumShift > 0) wantBlue = Math.random() > 0.2; // Sering biru (gabung)

    // Jika sedang Reaktan, kita butuh Biru untuk bergabung. Jika Merah, tidak terjadi apa-apa.
    // Jika sedang Produk, kita butuh Merah untuk pecah.
    // Agar produktif (selalu berubah), kita paksa spawn yang belawanan jika sedang mode Normal (shift=0).
    if(this.equilibriumShift === 0) {
      wantBlue = !this.isProduct; // Selalu paksa berubah bolak-balik
    }

    const isCombine = wantBlue;
    
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0, 0, -40); // Muncul jauh di depan
    gateGroup.userData = { isCombine, hit: false };

    // Visual Gerbang
    const color = isCombine ? 0x3b82f6 : 0xef4444;
    const ringGeo = new THREE.TorusGeometry(0.5, 0.03, 16, 50);
    const ringMat = new THREE.MeshBasicMaterial({ color, transparent:true, opacity: 0.8 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    gateGroup.add(ring);

    // Isi Gerbang
    if(isCombine) {
      const partner = buatMolekul(this.misiData.target_pasangan);
      gateGroup.add(partner);
    } else {
      // Energy barrier visual
      const barrier = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ color: 0xef4444, transparent:true, opacity: 0.4, side: THREE.DoubleSide })
      );
      gateGroup.add(barrier);
    }

    this.gates.push(gateGroup);
    this.scene.add(gateGroup);
  }

  triggerTransform(toProduct) {
    this.isProduct = toProduct;
    this.loopCount++;

    const pos = this.playerMolecule.position.clone();
    this.scene.remove(this.playerMolecule);

    const newJenis = toProduct ? this.misiData.produk : this.misiData.target_jenis;
    this.playerMolecule = buatMolekul(newJenis);
    this.playerMolecule.position.copy(pos);
    this.scene.add(this.playerMolecule);
    
    const color = toProduct ? '#fde047' : '#7df9ff';
    const youSprite = createTextSprite("⭐ YOU", color);
    youSprite.position.set(0, 0.25, 0);
    this.playerMolecule.add(youSprite);

    if(window._updateHUDForm) window._updateHUDForm(toProduct, newJenis);

    // Efek Transisi
    if(toProduct) {
      soundEngine.bondForm();
      buatBurst(this.scene, pos, 0x3b82f6);
    } else {
      soundEngine.bondBreak();
      buatBurst(this.scene, pos, 0xef4444);
    }

    // Productive Confusion Trigger
    if (this.loopCount === 3 && this.equilibriumShift === 0) {
      if (this.onStateChange) this.onStateChange(AR_STATE.DYNAMIC_EQUILIBRIUM, this.misiData.ai.DYNAMIC_EQUILIBRIUM);
    }
  }

  update(dt, input) {
    // Handle Gas
    if (input.gas) {
      this.velocity = Math.min(this.velocity + dt * 2, 1.0); // max speed 1.0
    } else {
      this.velocity = Math.max(this.velocity - dt * 2, 0);
    }

    if (this.velocity === 0) return;

    // Wobble molecule
    if(this.playerMolecule) {
      this.playerMolecule.position.y = (Math.sin(Date.now() * 0.005) * 0.05);
      this.playerMolecule.rotation.y = (Math.sin(Date.now() * 0.002) * 0.1);
    }

    // Spawn Gates randomly based on distance traveled
    if (Math.random() < this.velocity * dt * 0.8) {
      // Pastikan jarak antar gerbang cukup jauh
      if(this.gates.length === 0 || this.gates[this.gates.length-1].position.z > -30) {
        this.spawnGate();
      }
    }

    // Move Gates
    for(let i = this.gates.length - 1; i >= 0; i--) {
      const g = this.gates[i];
      g.position.z += this.velocity * dt * 10;
      
      // Collision Check (Molecule is at z = -1)
      if (!g.userData.hit && g.position.z > -1.2 && g.position.z < -0.8) {
        g.userData.hit = true;
        if(g.userData.isCombine && !this.isProduct) {
          this.triggerTransform(true);
        } else if(!g.userData.isCombine && this.isProduct) {
          this.triggerTransform(false);
        }
      }

      // Remove behind camera
      if(g.position.z > 2) {
        this.scene.remove(g);
        this.gates.splice(i, 1);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// HELPER EFFECTS
// ---------------------------------------------------------------------------
function buatBurst(scene, position, colorHex, count = 20) {
  const p = [];
  for (let i=0; i<count; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.015, 5, 5), new THREE.MeshBasicMaterial({ color: colorHex, transparent: true }));
    m.position.copy(position); scene.add(m);
    p.push({ m, vel: new THREE.Vector3((Math.random()-0.5)*0.2, (Math.random()-0.5)*0.2, (Math.random()-0.5)*0.2), life: 0 });
  }
  const t = setInterval(() => {
    let a = false;
    p.forEach(x => {
      x.life += 0.05; x.vel.y -= 0.001; x.m.position.addScaledVector(x.vel, 1); x.m.material.opacity = Math.max(0, 1 - x.life * 2);
      if (x.life < 0.5) a = true;
    });
    if (!a) { clearInterval(t); p.forEach(x => scene.remove(x.m)); }
  }, 16);
}

// ---------------------------------------------------------------------------
// MAIN SESSION
// ---------------------------------------------------------------------------
export async function mulaiSesiARjs(canvas, videoEl, misiId, onStateChange) {
  let isTrueAR = false;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    videoEl.srcObject = stream;
    videoEl.play().catch(e => console.warn('autoplay blocked:', e));
    isTrueAR = true;
  } catch(e) { console.warn('Camera unavailable.'); }

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const scene = new THREE.Scene();
  
  // Kamera
  const cameraRig = new THREE.Group();
  cameraRig.position.set(0, 0.5, 1.5); // Posisi bahu atas belakang
  scene.add(cameraRig);
  
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.01, 100);
  camera.rotation.x = -0.15; // Menunduk sedikit menatap rel
  cameraRig.add(camera);

  const deviceControls = new CustomDeviceOrientationControls(camera);
  
  // Drag Fallback
  let isDragging = false; let prevX = 0; let prevY = 0;
  canvas.addEventListener('mousedown', e => { isDragging = true; prevX = e.clientX; prevY = e.clientY; });
  canvas.addEventListener('mousemove', e => {
    if (!isDragging || isTrueAR) return;
    camera.rotation.y -= (e.clientX - prevX) * 0.005;
    camera.rotation.x -= (e.clientY - prevY) * 0.005;
    camera.rotation.order = 'YXZ';
    prevX = e.clientX; prevY = e.clientY;
  });
  window.addEventListener('mouseup', () => isDragging = false);

  const sm = new ARStateMachine();
  const misiData = MISI_DATA[misiId] || MISI_DATA['misi1'];
  
  const qSpace = new QuantumSpace(scene);
  const runner = new InfiniteRunnerSystem(scene, misiData, (newState, msg) => {
    sm.setState(newState);
  });
  
  let berjalan = true;

  // Initial State Flow
  setTimeout(() => sm.setState(AR_STATE.OVERVIEW), 1000);

  sm.on(AR_STATE.OVERVIEW, () => {
    if (onStateChange) onStateChange(AR_STATE.OVERVIEW, misiData.ai.OVERVIEW);
    setTimeout(() => sm.setState(AR_STATE.INVESTIGATE), 2000);
  });

  sm.on(AR_STATE.INVESTIGATE, () => {
    if (onStateChange) onStateChange(AR_STATE.INVESTIGATE, misiData.ai.INVESTIGATE);
    setTimeout(() => sm.setState(AR_STATE.PORTAL_ZOOM), 2000);
  });

  sm.on(AR_STATE.PORTAL_ZOOM, () => {
    soundEngine.whoosh();
    qSpace.setVisible(true);
    if (videoEl) videoEl.style.opacity = '0'; // Masuk ke Quantum Space (VR mode)
    runner.initPlayer();
    
    if (onStateChange) onStateChange(AR_STATE.PORTAL_ZOOM, '');
    setTimeout(() => sm.setState(AR_STATE.MOLECULAR_JOURNEY), 1500);
  });

  sm.on(AR_STATE.MOLECULAR_JOURNEY, () => {
    if (onStateChange) onStateChange(AR_STATE.MOLECULAR_JOURNEY, misiData.ai.MOLECULAR_JOURNEY);
  });

  sm.on(AR_STATE.DYNAMIC_EQUILIBRIUM, () => {
    // Saat kuis muncul, kecepatan ditahan
    runner.velocity = 0.1;
    if (onStateChange) onStateChange(AR_STATE.DYNAMIC_EQUILIBRIUM, misiData.ai.DYNAMIC_EQUILIBRIUM);
  });

  sm.on(AR_STATE.EXPERIMENT, () => {
    if (onStateChange) onStateChange(AR_STATE.EXPERIMENT, misiData.ai.EXPERIMENT);
  });

  sm.on(AR_STATE.REFLECTION, () => {
    soundEngine.missionComplete();
    if (onStateChange) onStateChange(AR_STATE.REFLECTION, misiData.ai.REFLECTION);
  });

  const tools = {
    onQuizAnswered: () => {
      sm.setState(AR_STATE.EXPERIMENT);
    },
    triggerTool: (toolName) => {
      if (!sm.is(AR_STATE.EXPERIMENT)) return;
      if (toolName === misiData.tool) {
        // Le Chatelier Shift: Misi 1 (Exo) + Heat = Shift Kiri (-1)
        // Agar visualnya jelas, kita buat jalurnya dipenuhi warna merah (pemecah)
        runner.equilibriumShift = -1; 
        sm.setState(AR_STATE.REFLECTION);
      } else {
        if (onStateChange) onStateChange(AR_STATE.EXPERIMENT, "Coba alat yang lain.");
      }
    },
    hentikan: () => { berjalan = false; }
  };

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    if (!berjalan) return;
    const dt = clock.getDelta();

    if (sm.is(AR_STATE.MOLECULAR_JOURNEY) || sm.is(AR_STATE.EXPERIMENT) || sm.is(AR_STATE.REFLECTION) || sm.is(AR_STATE.DYNAMIC_EQUILIBRIUM)) {
      const input = window._getDrivingInput ? window._getDrivingInput() : { steer: 0, gas: false };
      runner.update(dt, input);
      qSpace.update(dt, runner.velocity);
    }

    if (isTrueAR) {
      deviceControls.update();
    }

    renderer.render(scene, camera);
  });

  return tools;
}

export async function deteksiModeAR() {
  if (navigator.xr) { try { if (await navigator.xr.isSessionSupported('immersive-ar')) return 'webxr'; } catch(_) {} }
  return (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ? 'arjs' : 'unsupported';
}

export async function mulaiSesiWebXR(canvas, misiId, onStateChange) {
  return mulaiSesiARjs(canvas, document.createElement('video'), misiId, onStateChange);
}
