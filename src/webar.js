import * as THREE from 'three';

/* ==========================================================================
   ARCHEMY WEBAR ENGINE v6.0 - Rollercoaster Track & True AR
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
      MOLECULAR_JOURNEY: 'Tahan tombol GAS untuk meluncur!',
      REACTION_EVENT:    'Efektif! Terbentuk ikatan.',
      EXPERIMENT:        'Tekan tombol Heat.',
      REFLECTION:        'Sistem kembali seimbang.',
    },
    target_jenis: 'I2', target_pasangan: 'H2', produk: 'HI', tool: 'heat'
  },
  misi2: {
    judul: 'Misi 2: Smog Kota',
    persamaan: '2NO\u2082(g) \u21cc N\u2082O\u2084(g)',
    ai: {
      OVERVIEW:          'Gas NO\u2082 beracun.',
      INVESTIGATE:       'Masuk ke portal.',
      MOLECULAR_JOURNEY: 'Ikuti rel cahaya ke arah target.',
      REACTION_EVENT:    'Ikatan terbentuk!',
      EXPERIMENT:        'Tekan Compress.',
      REFLECTION:        'Sistem stabil.',
    },
    target_jenis: 'NO2', target_pasangan: 'NO2', produk: 'N2O4', tool: 'compress'
  },
  misi3: {
    judul: 'Misi 3: Pabrik Amonia',
    persamaan: 'N\u2082(g) + 3H\u2082(g) \u21cc 2NH\u2083(g)',
    ai: {
      OVERVIEW:          'Produksi amonia.',
      INVESTIGATE:       'Tap untuk masuk.',
      MOLECULAR_JOURNEY: 'Tancap gas mengikuti rel.',
      REACTION_EVENT:    'Amonia terbentuk!',
      EXPERIMENT:        'Tambahkan H\u2082.',
      REFLECTION:        'Reaksi bergeser.',
    },
    target_jenis: 'N2', target_pasangan: 'H2', produk: 'NH3', tool: 'add'
  }
};

export const AR_STATE = {
  SCAN: 'SCAN', REACTION_PORTAL: 'REACTION_PORTAL', OVERVIEW: 'OVERVIEW',
  INVESTIGATE: 'INVESTIGATE', PORTAL_ZOOM: 'PORTAL_ZOOM', MOLECULAR_JOURNEY: 'MOLECULAR_JOURNEY',
  REACTION_EVENT: 'REACTION_EVENT', EXPERIMENT: 'EXPERIMENT', REFLECTION: 'REFLECTION'
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
  const mat = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.08, roughness: 0.28, metalness: 0.12 });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 28), mat); mesh.castShadow = true; return mesh;
}
function buatBondMesh(p1, p2) {
  const dist = p1.distanceTo(p2); if (dist < 0.005) return null;
  const geo = new THREE.CylinderGeometry(0.011, 0.011, dist, 8);
  const mat = new THREE.MeshStandardMaterial({ color: 0xd4d4d4, roughness: 0.4, metalness: 0.1 });
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

// ---------------------------------------------------------------------------
// DEVICE ORIENTATION (TRUE AR CAMERA)
// ---------------------------------------------------------------------------
class CustomDeviceOrientationControls {
  constructor(camera) {
    this.camera = camera;
    this.enabled = true;
    this.deviceOrientation = {};
    this.screenOrientation = 0;
    this.alphaOffset = 0;

    const onDO = (e) => this.deviceOrientation = e;
    const onSO = () => this.screenOrientation = window.orientation || 0;

    window.addEventListener('orientationchange', onSO);
    window.addEventListener('deviceorientation', onDO);
    onSO();

    this.euler = new THREE.Euler();
    this.q0 = new THREE.Quaternion();
    this.q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
    this.zee = new THREE.Vector3(0, 0, 1);
  }

  update() {
    if (!this.enabled) return;
    const alpha = this.deviceOrientation.alpha ? THREE.MathUtils.degToRad(this.deviceOrientation.alpha) + this.alphaOffset : 0;
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
// ROLLERCOASTER DRIVING SYSTEM (Track & Chase Cam)
// ---------------------------------------------------------------------------
export class RollercoasterDrivingSystem {
  constructor(scene) {
    this.scene = scene;
    this.playerMolecule = null;
    this.targetMolecule = null;
    
    this.progress = 0; 
    this.velocity = 0; 
    this.isMoving = false;
    this.collisionEventFired = false;
    this.onCollision = null;

    this.curve = null;
    this.trackMesh = null;
  }

  initJourney(playerMol, targetMol, startPos) {
    this.playerMolecule = playerMol;
    this.targetMolecule = targetMol;
    this.collisionEventFired = false;
    this.isMoving = true;
    this.progress = 0;
    this.velocity = 0; 

    // Create a winding track
    const p0 = startPos.clone();
    const p1 = p0.clone().add(new THREE.Vector3(0, 0, -2));
    const p2 = p0.clone().add(new THREE.Vector3(3, 0, -5));
    const p3 = p0.clone().add(new THREE.Vector3(1, 0, -8));
    const p4 = p0.clone().add(new THREE.Vector3(-2, 0, -11));
    const p5 = p0.clone().add(new THREE.Vector3(0, 0, -14));

    this.curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4, p5]);
    
    // Draw Glowing Track
    if (this.trackMesh) this.scene.remove(this.trackMesh);
    
    const trackGeo = new THREE.TubeGeometry(this.curve, 100, 0.08, 12, false);
    const trackMat = new THREE.MeshBasicMaterial({ color: 0x0ea5e9, wireframe: true, transparent: true, opacity: 0.6 });
    this.trackMesh = new THREE.Mesh(trackGeo, trackMat);
    this.trackMesh.position.y = -0.28; // just above grid
    this.scene.add(this.trackMesh);

    this.playerMolecule.mesh.position.copy(p0);
    
    // Place target exactly at the end of the track
    if (this.targetMolecule) {
      this.targetMolecule.mesh.position.copy(p5);
      const beacon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 20, 8), 
        new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending})
      );
      this.targetMolecule.mesh.add(beacon);
    }
  }

  update(dt, input, cameraRig) {
    if (!this.isMoving || !this.playerMolecule || !this.curve) return;

    // Handle Gas
    if (input.gas) {
      this.velocity = Math.min(this.velocity + dt * 0.5, 0.15); // speed factor (0.15 is fast along curve 0-1)
    } else {
      this.velocity = Math.max(this.velocity - dt * 0.5, 0); // brake
    }

    this.progress += this.velocity * dt;
    if (this.progress > 0.98) this.progress = 0.98;

    // Position Molecule on Track
    const point = this.curve.getPointAt(this.progress);
    this.playerMolecule.mesh.position.copy(point);
    this.playerMolecule.mesh.position.y += 0.05 + Math.sin(Date.now() * 0.005) * 0.02; // hover effect

    // Rotate Molecule along Tangent
    const tangent = this.curve.getTangentAt(this.progress).normalize();
    const axis = new THREE.Vector3(0, 1, 0);
    const angle = Math.atan2(tangent.x, tangent.z);
    this.playerMolecule.mesh.rotation.y = angle;

    // Chase Camera Rig Update (Behind and slightly above)
    if (cameraRig) {
      // Offset behind (z+) and up (y+) relative to the molecule's forward direction
      const backOffset = tangent.clone().multiplyScalar(-1.2); 
      backOffset.y = 0.4; // height above
      
      const targetCamPos = point.clone().add(backOffset);
      cameraRig.position.lerp(targetCamPos, 0.1);
      
      // Make rig look slightly ahead of the molecule to see the road
      const lookAhead = this.curve.getPointAt(Math.min(1, this.progress + 0.1));
      // Manual lookAt interpolation for smoothness
      const m = new THREE.Matrix4().lookAt(cameraRig.position, lookAhead, new THREE.Vector3(0,1,0));
      const qTarget = new THREE.Quaternion().setFromRotationMatrix(m);
      cameraRig.quaternion.slerp(qTarget, 0.1);
    }

    // Collision at end of track
    if (this.progress >= 0.95 && !this.collisionEventFired) {
      this.collisionEventFired = true;
      if (this.onCollision) this.onCollision();
    }
  }
}

// ---------------------------------------------------------------------------
// IMMERSIVE 3D ROOM (Grid & Parallax)
// ---------------------------------------------------------------------------
class ImmersiveRoom {
  constructor(scene) {
    this.container = new THREE.Group();
    this.container.visible = false;
    scene.add(this.container);

    // Glowing Neon Floor
    const grid = new THREE.GridHelper(50, 50, 0x0ea5e9, 0x0284c7);
    grid.position.y = -0.3; 
    this.container.add(grid);

    // Space Sphere (Skybox)
    const skyGeo = new THREE.SphereGeometry(40, 32, 32);
    const skyMat = new THREE.MeshBasicMaterial({ color: 0x02040a, side: THREE.BackSide });
    this.container.add(new THREE.Mesh(skyGeo, skyMat));

    // Ambient Particles (Parallax)
    const pGeo = new THREE.BufferGeometry();
    const pCount = 800;
    const pPos = new Float32Array(pCount * 3);
    for(let i=0; i<pCount*3; i++) pPos[i] = (Math.random() - 0.5) * 30; 
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x7df9ff, size: 0.05, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
    this.particles = new THREE.Points(pGeo, pMat);
    this.container.add(this.particles);
  }
  
  setVisible(v) { this.container.visible = v; }
  update(dt) {
    if(!this.container.visible) return;
    this.particles.rotation.y += dt * 0.02; 
  }
}

export class MolecularPortal {
  constructor(scene) {
    this._t = 0; this.mesh = new THREE.Group();
    const ringGeo = new THREE.TorusGeometry(0.3, 0.008, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    this.ring = new THREE.Mesh(ringGeo, ringMat);
    this.ring.rotation.x = -Math.PI / 2;
    this.mesh.add(this.ring);
    this.mesh.visible = false;
    scene.add(this.mesh);
  }
  setPosition(pos) { this.mesh.position.copy(pos); }
  setVisible(v) { this.mesh.visible = v; }
  update(dt) {
    this._t += dt;
    this.ring.scale.setScalar(1 + Math.sin(this._t * 2) * 0.05);
  }
}

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
  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  const key = new THREE.DirectionalLight(0xffffff, 2.5);
  key.position.set(2, 5, 3); scene.add(key);

  // CAMERA RIG ARCHITECTURE (Chase Cam)
  const cameraRig = new THREE.Group();
  scene.add(cameraRig);
  
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.01, 100);
  cameraRig.add(camera);

  // AR Controls
  const deviceControls = new CustomDeviceOrientationControls(camera);
  
  // Drag Fallback for Desktop
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

  const portal = new MolecularPortal(scene);
  const room = new ImmersiveRoom(scene);
  const journey = new RollercoasterDrivingSystem(scene);
  const sm = new ARStateMachine();
  
  let berjalan = true;
  let portalPlaced = false;
  let playerMolecule = null;
  let targetMolecule = null;
  let misiData = MISI_DATA[misiId] || MISI_DATA['misi1'];

  const reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.08, 0.1, 32).rotateX(-Math.PI/2),
    new THREE.MeshBasicMaterial({ color: 0x7df9ff, transparent: true, opacity: 0.8 })
  );
  reticle.visible = false;
  scene.add(reticle);
  setTimeout(() => { if (!portalPlaced) reticle.visible = true; }, 2000);

  sm.on(AR_STATE.REACTION_PORTAL, () => {
    portalPlaced = true; reticle.visible = false;
    portal.setVisible(true); soundEngine.whoosh();
    setTimeout(() => sm.setState(AR_STATE.OVERVIEW), 1000);
  });

  sm.on(AR_STATE.OVERVIEW, () => {
    if (onStateChange) onStateChange(AR_STATE.OVERVIEW, misiData.ai.OVERVIEW);
    setTimeout(() => sm.setState(AR_STATE.INVESTIGATE), 2000);
  });

  sm.on(AR_STATE.INVESTIGATE, () => {
    if (onStateChange) onStateChange(AR_STATE.INVESTIGATE, misiData.ai.INVESTIGATE);
  });

  sm.on(AR_STATE.PORTAL_ZOOM, () => {
    soundEngine.whoosh();
    if (onStateChange) onStateChange(AR_STATE.PORTAL_ZOOM, '');
    
    room.setVisible(true);
    portal.setVisible(false);
    if (videoEl) videoEl.style.opacity = '0'; 
    
    playerMolecule = { mesh: buatMolekul(misiData.target_jenis), jenis: misiData.target_jenis };
    targetMolecule = { mesh: buatMolekul(misiData.target_pasangan), jenis: misiData.target_pasangan };
    scene.add(playerMolecule.mesh);
    scene.add(targetMolecule.mesh);

    const youSprite = createTextSprite("⭐ YOU", 0x7df9ff);
    youSprite.position.set(0, 0.18, 0);
    playerMolecule.mesh.add(youSprite);

    // Camera rig base pos
    cameraRig.position.set(0, 0.4, 1.5);
    
    journey.initJourney(playerMolecule, targetMolecule, new THREE.Vector3(0, 0, 0));
    journey.onCollision = () => { sm.setState(AR_STATE.REACTION_EVENT); };

    setTimeout(() => sm.setState(AR_STATE.MOLECULAR_JOURNEY), 1000);
  });

  sm.on(AR_STATE.MOLECULAR_JOURNEY, () => {
    if (onStateChange) onStateChange(AR_STATE.MOLECULAR_JOURNEY, misiData.ai.MOLECULAR_JOURNEY);
    if (window._updateHUDForm) window._updateHUDForm(false, misiData.target_jenis);
    if (window._updateHUDEq) window._updateHUDEq(50, 50);
  });

  sm.on(AR_STATE.REACTION_EVENT, () => {
    soundEngine.collision();
    journey.velocity = 0; 
    
    playerMolecule.mesh.children.forEach(c => c.material && c.material.emissive && c.material.emissive.setHex(0x7df9ff));
    if (onStateChange) onStateChange(AR_STATE.REACTION_EVENT, misiData.ai.REACTION_EVENT);
    
    setTimeout(() => {
      soundEngine.bondForm();
      buatBurst(scene, playerMolecule.mesh.position.clone());
      
      scene.remove(playerMolecule.mesh);
      scene.remove(targetMolecule.mesh);
      if (journey.trackMesh) scene.remove(journey.trackMesh);
      
      playerMolecule.mesh = buatMolekul(misiData.produk);
      playerMolecule.jenis = misiData.produk;
      playerMolecule.mesh.position.copy(targetMolecule.mesh.position); 
      scene.add(playerMolecule.mesh);
      
      const youSprite = createTextSprite("⭐ YOU", 0xfde047);
      youSprite.position.set(0, 0.18, 0);
      playerMolecule.mesh.add(youSprite);
      
      journey.playerMolecule = playerMolecule;
      journey.targetMolecule = null;

      if (window._updateHUDForm) window._updateHUDForm(true, misiData.produk);
      if (window._updateHUDEq) window._updateHUDEq(80, 20);

      setTimeout(() => sm.setState(AR_STATE.EXPERIMENT), 1500);
    }, 1000);
  });

  sm.on(AR_STATE.EXPERIMENT, () => {
    if (onStateChange) onStateChange(AR_STATE.EXPERIMENT, misiData.ai.EXPERIMENT);
  });

  sm.on(AR_STATE.REFLECTION, () => {
    soundEngine.missionComplete();
    if (onStateChange) onStateChange(AR_STATE.REFLECTION, misiData.ai.REFLECTION);
  });

  const tools = {
    triggerTool: (toolName) => {
      if (!sm.is(AR_STATE.EXPERIMENT)) return;
      if (toolName === misiData.tool) {
        if (window._updateHUDEq) window._updateHUDEq(20, 80);
        if (onStateChange) onStateChange(AR_STATE.EXPERIMENT, "Laju reaksi balik membesar.");
        
        setTimeout(() => {
          soundEngine.bondBreak();
          buatBurst(scene, playerMolecule.mesh.position.clone(), 0xff3333);
          
          scene.remove(playerMolecule.mesh);
          playerMolecule.mesh = buatMolekul(misiData.target_jenis);
          playerMolecule.jenis = misiData.target_jenis;
          scene.add(playerMolecule.mesh);
          
          const youSprite = createTextSprite("⭐ YOU", 0x7df9ff);
          youSprite.position.set(0, 0.18, 0);
          playerMolecule.mesh.add(youSprite);
          
          if (window._updateHUDForm) window._updateHUDForm(false, misiData.target_jenis);
          
          targetMolecule = { mesh: buatMolekul(misiData.target_pasangan), jenis: misiData.target_pasangan };
          scene.add(targetMolecule.mesh);
          
          journey.initJourney(playerMolecule, targetMolecule, playerMolecule.mesh.position);
          sm.setState(AR_STATE.REFLECTION);
        }, 1200);
      } else {
        if (onStateChange) onStateChange(AR_STATE.EXPERIMENT, "Coba alat yang lain.");
      }
    },
    hentikan: () => { berjalan = false; }
  };

  canvas.addEventListener('click', () => {
    if (!berjalan) return;
    if (!portalPlaced && reticle.visible) {
      portal.setPosition(reticle.position.clone());
      sm.setState(AR_STATE.REACTION_PORTAL);
    } else if (sm.is(AR_STATE.INVESTIGATE)) {
      sm.setState(AR_STATE.PORTAL_ZOOM);
    }
  });

  function createTextSprite(message, color) {
    const cvs = document.createElement('canvas');
    cvs.width = 256; cvs.height = 64;
    const ctx = cvs.getContext('2d');
    ctx.font = 'Bold 36px Poppins, Arial';
    ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(message, 128, 32);
    const tex = new THREE.CanvasTexture(cvs);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(0.6, 0.15, 1);
    return sprite;
  }

  function buatBurst(scene, position, color = 0x7df9ff, count = 25) {
    const p = [];
    for (let i=0; i<count; i++) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.015, 5, 5), new THREE.MeshBasicMaterial({ color, transparent: true }));
      m.position.copy(position); scene.add(m);
      p.push({ m, vel: new THREE.Vector3((Math.random()-0.5)*0.15, (Math.random()-0.5)*0.15, (Math.random()-0.5)*0.15), life: 0 });
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

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    if (!berjalan) return;
    const dt = clock.getDelta();

    if (!portalPlaced && reticle.visible) {
      reticle.position.set(0, -0.2, -1.2);
      reticle.rotation.z += dt * 1;
    }

    if (sm.is(AR_STATE.REACTION_PORTAL)) portal.update(dt);
    if (room.container.visible) room.update(dt);

    if (sm.is(AR_STATE.MOLECULAR_JOURNEY) || sm.is(AR_STATE.REACTION_EVENT)) {
      const input = window._getDrivingInput ? window._getDrivingInput() : { steer: 0, gas: false };
      journey.update(dt, input, cameraRig);
    }

    if (isTrueAR) {
      deviceControls.update();
    }

    renderer.render(scene, camera);
  });

  return tools;
}

export async function mulaiSesiWebXR(canvas, misiId, onStateChange) {
  return mulaiSesiARjs(canvas, document.createElement('video'), misiId, onStateChange);
}
