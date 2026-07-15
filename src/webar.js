import * as THREE from 'three';

/* ==========================================================================
   ARCHEMY WEBAR ENGINE v12.0 — MACRO-MICRO-MACRO
   - Realistic Ball-and-Stick Models
   - Choreography: System (Macro) -> Zoom In -> Driving (Micro) -> Zoom Out
   - Glass Sphere Container (Closed System)
   - OrbitControls during Driving
   ========================================================================== */

export function requestSensorPermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission().catch(() => {});
  }
}

// ---------------------------------------------------------------------------
// STORYBOARD & MISSION DATA
// ---------------------------------------------------------------------------
export const MISI_DATA = {
  misi1: {
    judul: 'Reaksi Gas Iodin',
    persamaan: 'H₂(g) + I₂(g) ⇌ 2HI(g)',
    hook: 'Gurumu mengatakan reaksi sudah setimbang. Tapi... apakah reaksi benar-benar berhenti?',
    jenis: 'H2', pasangan: 'I2', produk: 'HI',
    deltaH: 'endoterm',
    tool_correct: 'heat',
    story: {
      CP0: "Mengamati sistem tertutup yang berisi gas H₂ dan I₂.",
      CP1: "Fokus ke satu molekul...",
      CP2: "Setiap molekul terus bergerak tiada henti.",
      CP3: "Tumbukan terjadi, tapi energi tidak cukup. Reaksi gagal.",
      CP4: "Tumbukan berhasil! Ikatan terbentuk menjadi produk HI.",
      CP5: "Produk dapat terurai kembali menjadi reaktan (Reversibel).",
      CP6: "Secara mikroskopis mereka terus berubah. Mari kita lihat sistem secara keseluruhan...",
      CP7: "Lihat grafik! Meski partikel terus bereaksi, persentase total stabil. Inilah Kesetimbangan Dinamis.",
      CP8: "Eksperimen Le Chatelier (Endoterm): Coba naikkan tekanan atau suhu!",
    },
    challenge_q: 'Untuk memperbanyak HI (reaksi endoterm), yang harus dilakukan adalah?',
    challenge_opts: [
      { text: 'Naikkan suhu', correct: true },
      { text: 'Turunkan suhu', correct: false },
      { text: 'Naikkan tekanan', correct: false },
    ],
    challenge_explanation: 'Benar! Reaksi endoterm menyerap panas. Menurut Le Chatelier, menaikkan suhu menggeser kesetimbangan ke kanan (produk).',
    reflection_q: 'Apakah reaksi pada keadaan setimbang benar-benar berhenti?',
    reflection_opts: [
      { text: 'Ya, konsentrasi tidak berubah.', correct: false },
      { text: 'Tidak, reaksi maju dan balik terjadi bersamaan.', correct: true },
    ],
    reflection_explanation: 'Tepat! Secara mikroskopis reaksi tidak pernah berhenti (dinamis).',
  }
  // Other missions omitted for brevity but they follow the same CP structure.
};

export const CHECKPOINT = {
  START: 0,        // CP0: Macro view
  ZOOMIN: 1,       // CP1: Tween camera to player
  DRIVING: 2,      // CP2: Moving forward
  FAIL_BUMP: 3,    // CP3: Failed collision
  SUCCESS: 4,      // CP4: Become product
  BREAK: 5,        // CP5: Break apart
  ZOOMOUT: 6,      // CP6: Tween camera back to macro
  EQUILIBRIUM: 7,  // CP7: Show Live Chart
  EXPERIMENT: 8,   // CP8: Enable controls
  CHALLENGE: 9,
  REFLECTION: 10
};

// ---------------------------------------------------------------------------
// SOUND ENGINE
// ---------------------------------------------------------------------------
class SoundEngine {
  constructor() { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { this.ctx = null; } }
  _r() { if (this.ctx?.state === 'suspended') this.ctx.resume(); }
  whoosh() {
    if (!this.ctx) return; this._r();
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.connect(g); g.connect(this.ctx.destination);
    o.frequency.setValueAtTime(300, this.ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 1.5);
    g.gain.setValueAtTime(0.2, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);
    o.start(); o.stop(this.ctx.currentTime + 1.5);
  }
  bounce() {
    if (!this.ctx) return; this._r();
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.connect(g); g.connect(this.ctx.destination);
    o.frequency.setValueAtTime(150, this.ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.3);
    g.gain.setValueAtTime(0.3, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    o.start(); o.stop(this.ctx.currentTime + 0.3);
  }
  bondForm() {
    if (!this.ctx) return; this._r();
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.connect(g); g.connect(this.ctx.destination);
    o.type = 'sine'; o.frequency.value = 800;
    g.gain.setValueAtTime(0, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
    o.start(); o.stop(this.ctx.currentTime + 0.5);
  }
  bondBreak() {
    if (!this.ctx) return; this._r();
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.connect(g); g.connect(this.ctx.destination);
    o.type = 'triangle'; o.frequency.value = 100;
    g.gain.setValueAtTime(0.2, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
    o.start(); o.stop(this.ctx.currentTime + 0.4);
  }
}
export const soundEngine = new SoundEngine();

// ---------------------------------------------------------------------------
// TRUE 3D PBR MOLECULE BUILDER (PROPER BALL-AND-STICK)
// ---------------------------------------------------------------------------
const ATOM_CFG = {
  H: { color: 0xffffff, r: 0.15 },
  I: { color: 0x8a2be2, r: 0.30 },
  N: { color: 0x2563eb, r: 0.25 },
  O: { color: 0xdc2626, r: 0.22 },
};

const MOLECULE_DEF = {
  H2:   [['H', -0.3, 0, 0], ['H', 0.3, 0, 0]],
  I2:   [['I', -0.5, 0, 0], ['I', 0.5, 0, 0]],
  HI:   [['H', -0.4, 0, 0], ['I', 0.4, 0, 0]],
  N2:   [['N', -0.35, 0, 0], ['N', 0.35, 0, 0]],
  NO2:  [['N', 0, 0, 0], ['O', -0.4, 0.4, 0], ['O', 0.4, 0.4, 0]],
  N2O4: [['N', -0.35, 0, 0], ['N', 0.35, 0, 0], 
         ['O', -0.6, 0.5, 0], ['O', -0.6, -0.5, 0], 
         ['O', 0.6, 0.5, 0], ['O', 0.6, -0.5, 0]],
  NH3:  [['N', 0, 0.2, 0], ['H', -0.35, -0.2, 0.2], ['H', 0.35, -0.2, 0.2], ['H', 0, -0.2, -0.4]],
};

const geoCache = {};
function getSphereGeo(r) {
  if (!geoCache[r]) geoCache[r] = new THREE.SphereGeometry(r, 64, 64);
  return geoCache[r];
}
const matCache = {};
function getAtomMat(colorHex) {
  if (!matCache[colorHex]) {
    matCache[colorHex] = new THREE.MeshPhysicalMaterial({
      color: colorHex, metalness: 0.3, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.2,
      envMapIntensity: 1.5 // Glossy
    });
  }
  return matCache[colorHex];
}
const bondGeo = new THREE.CylinderGeometry(0.04, 0.04, 1, 32);
const bondMat = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 0.7, roughness: 0.3, clearcoat: 0.8 });

export function makeMolecule(type) {
  const defs = MOLECULE_DEF[type] || MOLECULE_DEF.H2;
  const group = new THREE.Group();
  group.userData.molType = type;

  const pts = [];
  defs.forEach(([sym, x, y, z]) => {
    const cfg = ATOM_CFG[sym];
    const m = new THREE.Mesh(getSphereGeo(cfg.r), getAtomMat(cfg.color));
    m.position.set(x, y, z);
    group.add(m);
    pts.push(new THREE.Vector3(x, y, z));
  });

  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dist = pts[i].distanceTo(pts[j]);
      if (dist > 0.1 && dist < 1.3) {
        const bond = new THREE.Mesh(bondGeo, bondMat);
        bond.position.copy(pts[i]).lerp(pts[j], 0.5);
        bond.scale.y = dist;
        bond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), pts[j].clone().sub(pts[i]).normalize());
        group.add(bond);
      }
    }
  }
  return group;
}

// ---------------------------------------------------------------------------
// THE VOID ENGINE (Macro-Micro-Macro)
// ---------------------------------------------------------------------------
class CoreEngine {
  constructor(scene, camera, rig, misi, videoEl) {
    this.scene = scene;
    this.camera = camera;
    this.rig = rig; // Base rotation container for drag
    this.misi = misi;
    this.time = 0;
    this.videoEl = videoEl;
    
    // THE GLASS SPHERE (Closed System)
    const glassGeo = new THREE.SphereGeometry(15, 64, 64);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 0.1, roughness: 0.1,
      transmission: 0.9, thickness: 0.5, ior: 1.5,
      transparent: true, opacity: 0.3, side: THREE.BackSide
    });
    this.glassSphere = new THREE.Mesh(glassGeo, glassMat);
    this.scene.add(this.glassSphere);

    // SYSTEM MOLECULES (Macro)
    this.systemMols = new THREE.Group();
    this.mols = [];
    for (let i = 0; i < 50; i++) {
      const isProd = i < 20; // Start at 60% reactant, 40% product
      const mol = makeMolecule(isProd ? misi.produk : misi.jenis);
      mol.userData.isProd = isProd;
      mol.userData.vel = new THREE.Vector3((Math.random()-.5)*10, (Math.random()-.5)*10, (Math.random()-.5)*10);
      mol.position.set((Math.random()-.5)*20, (Math.random()-.5)*20, (Math.random()-.5)*20);
      mol.userData.rotVel = new THREE.Vector3((Math.random()-.5)*2, (Math.random()-.5)*2, (Math.random()-.5)*2);
      this.systemMols.add(mol);
      this.mols.push(mol);
    }
    this.scene.add(this.systemMols);

    // THE PLAYER MOLECULE (Micro Journey)
    this.player = new THREE.Group();
    this.scene.add(this.player);
    this.playerMol = makeMolecule(misi.jenis);
    this.player.add(this.playerMol);
    this.player.position.set(0, 0, 0); // Center of the sphere initially
    
    // Partner for collision
    this.partner = makeMolecule(misi.pasangan);
    this.partner.position.set(0, 0, -100);
    this.scene.add(this.partner);
    
    this.cp = CHECKPOINT.START;
    this.cpTime = 0;
    
    // Live Chart State
    this.reactantPct = 60;
    this.productPct = 40;
    this.targetReactantPct = 60;
    this.eqShiftRate = 0;
    this.sphereRadius = 15;
  }

  startJourney() {
    if (this.videoEl && this.videoEl.srcObject) {
      this.videoEl.srcObject.getTracks().forEach(t => t.stop());
      this.videoEl.srcObject = null;
    }
    this.scene.background = new THREE.Color(0x020308);
    this.scene.fog = new THREE.FogExp2(0x020308, 0.02);

    // Initial MACRO view
    this.camera.position.set(0, 0, 30);
    this.camera.lookAt(0, 0, 0);

    this.advanceTo(CHECKPOINT.START);
  }

  morphPlayer(toProd) {
    this.player.remove(this.playerMol);
    this.playerMol = makeMolecule(toProd ? this.misi.produk : this.misi.jenis);
    this.player.add(this.playerMol);
    if (toProd) soundEngine.bondForm();
    else soundEngine.bondBreak();
  }

  advanceTo(newCP) {
    this.cp = newCP;
    this.cpTime = 0;
    const msg = this.misi.story[`CP${newCP}`] || this.misi.story[`CP${newCP-1}`];
    if (window._onPhase) window._onPhase(newCP, msg);
  }

  update(dt) {
    this.time += dt;
    this.cpTime += dt;

    // 1. MACRO SYSTEM PHYSICS (always updating)
    let prodCount = 0;
    this.mols.forEach(m => {
      // Move
      m.position.addScaledVector(m.userData.vel, dt);
      m.rotation.x += m.userData.rotVel.x * dt;
      m.rotation.y += m.userData.rotVel.y * dt;
      m.rotation.z += m.userData.rotVel.z * dt;

      // Bounce off glass sphere (radius = this.sphereRadius)
      if (m.position.length() > this.sphereRadius - 1) {
        const n = m.position.clone().normalize();
        m.userData.vel.reflect(n);
        m.position.copy(n.multiplyScalar(this.sphereRadius - 1.1));
      }

      // Live Equilibrium Dynamic Swapping
      if (Math.random() < 0.02) { // 2% chance to swap per frame
        const goProd = Math.random() < (100 - this.targetReactantPct) / 100;
        if (!m.userData.isProd && goProd) {
          const nm = makeMolecule(this.misi.produk);
          nm.position.copy(m.position); nm.userData = m.userData; nm.userData.isProd = true;
          this.systemMols.remove(m); this.systemMols.add(nm);
          this.mols[this.mols.indexOf(m)] = nm;
        } else if (m.userData.isProd && !goProd) {
          const nm = makeMolecule(this.misi.jenis);
          nm.position.copy(m.position); nm.userData = m.userData; nm.userData.isProd = false;
          this.systemMols.remove(m); this.systemMols.add(nm);
          this.mols[this.mols.indexOf(m)] = nm;
        }
      }
      if (m.userData.isProd) prodCount++;
    });

    // Update Live Chart
    if (this.cp >= CHECKPOINT.EQUILIBRIUM) {
      // Smoothly approach target percentage
      this.reactantPct += (this.targetReactantPct - this.reactantPct) * dt * 0.5;
      this.productPct = 100 - this.reactantPct;
      if (window._updateHUDEq) window._updateHUDEq(this.reactantPct, this.productPct);
    }

    // Shrink/Expand sphere animation based on Le Chatelier
    if (this.glassSphere.scale.x !== this.sphereRadius / 15) {
      const s = THREE.MathUtils.lerp(this.glassSphere.scale.x, this.sphereRadius / 15, dt * 2);
      this.glassSphere.scale.set(s, s, s);
    }

    // 2. CHOREOGRAPHY
    switch (this.cp) {
      case CHECKPOINT.START:
        // Wait 4 seconds in Macro view
        if (this.cpTime > 4) this.advanceTo(CHECKPOINT.ZOOMIN);
        break;
        
      case CHECKPOINT.ZOOMIN:
        // Tween camera to player (0, 1.2, 4.5)
        this.camera.position.lerp(new THREE.Vector3(0, 1.2, 4.5), dt * 3);
        // Dim system molecules
        this.systemMols.children.forEach(m => {
          m.children.forEach(c => {
            if (c.material) {
              c.material.transparent = true;
              c.material.opacity = Math.max(0.1, c.material.opacity - dt);
            }
          });
        });
        if (this.cpTime > 3) this.advanceTo(CHECKPOINT.DRIVING);
        break;

      case CHECKPOINT.DRIVING:
        // Simulate forward movement by moving partner and dust (we are stationary in the sphere)
        this.playerMol.rotation.y += dt * 0.5;
        this.playerMol.position.x = Math.sin(this.time) * 0.3;
        this.playerMol.position.y = Math.cos(this.time * 0.8) * 0.3;
        if (this.cpTime > 4) {
          this.partner.position.set(0, 0, -15);
          this.advanceTo(CHECKPOINT.FAIL_BUMP);
        }
        break;

      case CHECKPOINT.FAIL_BUMP:
        this.playerMol.rotation.y += dt * 0.5;
        this.partner.position.z += 6 * dt; // Partner rushes at player
        if (this.partner.position.z > -1.5) {
          soundEngine.bounce();
          this.partner.position.x += 2;
          this.partner.position.z -= 100;
          this.advanceTo(CHECKPOINT.SUCCESS);
        }
        break;

      case CHECKPOINT.SUCCESS:
        this.playerMol.rotation.y += dt * 0.5;
        if (this.cpTime > 2 && this.partner.position.z < -20) {
          this.partner.position.set(0, 0, -15);
        }
        if (this.cpTime > 2) {
           this.partner.position.z += 6 * dt;
           if (this.partner.position.z > -1.0) {
             this.partner.position.z -= 100;
             this.morphPlayer(true);
             this.advanceTo(CHECKPOINT.BREAK);
           }
        }
        break;

      case CHECKPOINT.BREAK:
        this.playerMol.rotation.y += dt * 0.5;
        if (this.cpTime > 4) {
          this.morphPlayer(false);
          this.advanceTo(CHECKPOINT.ZOOMOUT);
        }
        break;

      case CHECKPOINT.ZOOMOUT:
        // Tween camera back to Z=30
        this.camera.position.lerp(new THREE.Vector3(0, 0, 30), dt * 1.5);
        this.rig.rotation.set(0,0,0); // reset drag
        // Un-dim system molecules
        this.systemMols.children.forEach(m => {
          m.children.forEach(c => {
            if (c.material) {
              c.material.opacity = Math.min(1.0, c.material.opacity + dt);
            }
          });
        });
        if (this.cpTime > 5) this.advanceTo(CHECKPOINT.EQUILIBRIUM);
        break;
        
      case CHECKPOINT.EQUILIBRIUM:
        // Let them watch the chart stabilize
        if (this.cpTime > 6) this.advanceTo(CHECKPOINT.EXPERIMENT);
        break;
        
      case CHECKPOINT.EXPERIMENT:
        // Wait for user to trigger Le Chatelier
        break;
    }
  }

  triggerTool(tool) {
    if (this.cp < CHECKPOINT.EXPERIMENT) return;
    
    // Le Chatelier logic
    if (tool === 'compress') {
      this.sphereRadius = 10; // Shrink physically
      this.mols.forEach(m => m.userData.vel.multiplyScalar(1.5)); // speed up
      this.targetReactantPct -= 20; // shift to products
    } else if (tool === 'heat') {
      this.mols.forEach(m => m.userData.vel.multiplyScalar(2.0)); // speed up
      this.targetReactantPct += (this.misi.deltaH === 'endoterm' ? -30 : 30);
    } else if (tool === 'cool') {
      this.mols.forEach(m => m.userData.vel.multiplyScalar(0.5)); // slow down
      this.targetReactantPct += (this.misi.deltaH === 'endoterm' ? 30 : -30);
    }
    
    // Clamp
    this.targetReactantPct = Math.max(10, Math.min(90, this.targetReactantPct));
    
    soundEngine.bondForm();
    if (window._onPhase) window._onPhase('TOOL', `Gangguan diberikan! Perhatikan respon Sistem untuk mengembalikan Kesetimbangan.`);
    
    if (this.cp === CHECKPOINT.EXPERIMENT) {
      setTimeout(() => this.advanceTo(CHECKPOINT.CHALLENGE), 6000);
    }
  }
}

// ---------------------------------------------------------------------------
// MAIN SESSION LAUNCHER
// ---------------------------------------------------------------------------
export async function mulaiSesiARjs(canvas, videoEl, misiId, callbacks) {
  const misi = MISI_DATA[misiId] || MISI_DATA.misi1;
  window._onPhase = callbacks.onPhase;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const scene = new THREE.Scene();
  
  const ambient = new THREE.AmbientLight(0x223344, 1.5);
  scene.add(ambient);
  const mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
  mainLight.position.set(5, 10, 5);
  scene.add(mainLight);
  const fillLight = new THREE.DirectionalLight(0x4fc3f7, 2.0); 
  fillLight.position.set(-5, 0, -5);
  scene.add(fillLight);
  const backLight = new THREE.DirectionalLight(0xf87171, 2.0); 
  backLight.position.set(0, -5, -10);
  scene.add(backLight);

  const cameraRig = new THREE.Group();
  scene.add(cameraRig);
  const camera = new THREE.PerspectiveCamera(70, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  cameraRig.add(camera);

  let isTrueAR = false;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    videoEl.srcObject = stream;
    await videoEl.play().catch(() => {});
    isTrueAR = true;
  } catch {
    scene.background = new THREE.Color(0x020308);
  }
  
  // DRAG TO LOOK (Orbit implementation for camera rig)
  let isDrag = false, dX = 0, dY = 0;
  canvas.addEventListener('mousedown', e => { isDrag = true; dX = e.clientX; dY = e.clientY; });
  canvas.addEventListener('mousemove', e => {
    if (!isDrag) return;
    const deltaX = (e.clientX - dX) * 0.005;
    const deltaY = (e.clientY - dY) * 0.005;
    dX = e.clientX; dY = e.clientY;
    
    // Rotate the rig
    cameraRig.rotation.y -= deltaX;
    cameraRig.rotation.x -= deltaY;
    // Clamp pitch
    cameraRig.rotation.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, cameraRig.rotation.x));
  });
  window.addEventListener('mouseup', () => isDrag = false);
  
  // Touch support for drag
  canvas.addEventListener('touchstart', e => { isDrag = true; dX = e.touches[0].clientX; dY = e.touches[0].clientY; }, {passive:false});
  canvas.addEventListener('touchmove', e => {
    if (!isDrag) return;
    const deltaX = (e.touches[0].clientX - dX) * 0.005;
    const deltaY = (e.touches[0].clientY - dY) * 0.005;
    dX = e.touches[0].clientX; dY = e.touches[0].clientY;
    cameraRig.rotation.y -= deltaX;
    cameraRig.rotation.x -= deltaY;
    cameraRig.rotation.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, cameraRig.rotation.x));
  }, {passive:false});
  canvas.addEventListener('touchend', () => isDrag = false);

  let engine = null;
  let running = true;
  const clock = new THREE.Clock();

  renderer.setAnimationLoop(() => {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    if (engine) engine.update(dt);
    renderer.render(scene, camera);
  });

  return {
    startJourney: () => {
      engine = new CoreEngine(scene, camera, cameraRig, misi, videoEl);
      engine.startJourney();
    },
    triggerTool: (tool) => engine?.triggerTool(tool),
    onChallengeAnswered: () => engine.advanceTo(CHECKPOINT.REFLECTION),
    hentikan: () => {
      running = false;
      renderer.setAnimationLoop(null);
      if (videoEl?.srcObject) { videoEl.srcObject.getTracks().forEach(t => t.stop()); videoEl.srcObject = null; }
    }
  };
}

export async function deteksiModeAR() {
  if (navigator.xr) { try { if (await navigator.xr.isSessionSupported('immersive-ar')) return 'webxr'; } catch {} }
  return navigator.mediaDevices?.getUserMedia ? 'arjs' : 'unsupported';
}

export async function mulaiSesiWebXR(canvas, misiId, callbacks) {
  return mulaiSesiARjs(canvas, document.createElement('video'), misiId, callbacks);
}
