import * as THREE from 'three';

/* ==========================================================================
   ARCHEMY WEBAR ENGINE v11.1 — GLOSSY 3D & PROCEDURAL BEAUTY
   - Realistic Ball-and-Stick Models
   - Glossy PBR with Multi-Lighting (No GLB needed)
   - Soft particles & bloom simulation
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
      CP1: "Setiap molekul terus bergerak tanpa henti.",
      CP2: "Tumbukan terjadi, tapi energimu tidak cukup untuk bereaksi.",
      CP3: "", // Silent on success
      CP4: "Kamu bereaksi! Ikatan terbentuk.",
      CP5: "", // Break apart silently
      CP6: "Inilah Kesetimbangan Dinamis. Semua molekul terus berubah bolak-balik dalam laju yang sama.",
      CP7: "Eksperimen Le Chatelier: Reaksi ini menyerap panas. Coba ubah suhu atau tekanan!",
    },
    challenge_q: 'Untuk memperbanyak HI (reaksi endoterm), yang harus dilakukan adalah?',
    challenge_opts: [
      { text: 'Naikkan suhu', correct: true },
      { text: 'Turunkan suhu', correct: false },
      { text: 'Naikkan tekanan', correct: false },
    ],
    challenge_explanation: 'Benar! Reaksi endoterm menyerap panas. Menurut Le Chatelier, menaikkan suhu akan menggeser kesetimbangan ke arah yang menyerap panas (ke kanan/produk).',
    reflection_q: 'Apakah reaksi pada keadaan setimbang benar-benar berhenti?',
    reflection_opts: [
      { text: 'Ya, konsentrasi tidak berubah.', correct: false },
      { text: 'Tidak, reaksi maju dan balik terjadi bersamaan.', correct: true },
    ],
    reflection_explanation: 'Tepat! Secara mikroskopis reaksi tidak pernah berhenti (dinamis).',
  },
  misi2: {
    judul: 'Smog Kota — Dinitrogen Tetroksida',
    persamaan: '2NO₂(g) ⇌ N₂O₄(g)',
    hook: 'Gas NO₂ coklat berbahaya memenuhi kota. Gas tak berwarna N₂O₄ juga ada. Mengapa mereka selalu hadir bersama?',
    jenis: 'NO2', pasangan: 'NO2', produk: 'N2O4',
    deltaH: 'eksoterm',
    tool_correct: 'compress',
    story: {
      CP1: "Kamu adalah gas beracun penyebab smog.",
      CP2: "Tumbukan gagal. Orientasi tidak tepat.",
      CP3: "", 
      CP4: "Berhasil! Kamu bergabung menjadi N₂O₄ yang tak berwarna.", 
      CP5: "", 
      CP6: "Kesetimbangan Dinamis: 2NO₂ dan N₂O₄ terus-menerus saling terbentuk dan terurai.",
      CP7: "Eksperimen Le Chatelier: Reaksi ini melepas panas. Eksperimenkan kondisinya!",
    },
    challenge_q: 'Sisi produk (N₂O₄) memiliki mol gas lebih sedikit. Untuk menggeser ke produk, kita harus?',
    challenge_opts: [
      { text: 'Naikkan tekanan', correct: true },
      { text: 'Naikkan suhu', correct: false },
      { text: 'Turunkan tekanan', correct: false },
    ],
    challenge_explanation: 'Tepat! Menaikkan tekanan menggeser kesetimbangan ke sisi dengan jumlah mol gas yang lebih sedikit (1 mol N₂O₄ vs 2 mol NO₂).',
    reflection_q: 'Mengapa NO₂ dan N₂O₄ selalu ada bersamaan?',
    reflection_opts: [
      { text: 'Karena sistem berada dalam kesetimbangan dinamis.', correct: true },
      { text: 'Karena reaksi belum selesai.', correct: false },
    ],
    reflection_explanation: 'Benar! Keduanya terus terbentuk dan terurai. Rasionya yang menentukan keparahan smog.',
  },
  misi3: {
    judul: 'Sintesis Amonia — Proses Haber',
    persamaan: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g)',
    hook: 'Mengapa pabrik pupuk harus beroperasi pada 400°C dan tekanan sangat tinggi 200 atm?',
    jenis: 'N2', pasangan: 'H2', produk: 'NH3',
    deltaH: 'eksoterm',
    tool_correct: 'compress',
    story: {
      CP1: "Ikatan N₂ sangat kuat, memecahnya sangat sulit.",
      CP2: "Tumbukan gagal. Energi aktivasi tidak cukup.",
      CP3: "", 
      CP4: "Reaksi terjadi! Kamu menjadi Amonia (NH₃).", 
      CP5: "", 
      CP6: "Kesetimbangan tercapai. Laju pembentukan sama dengan laju penguraian.",
      CP7: "Eksperimen Le Chatelier: Dalam industri Haber, reaksi ini eksotermik. Uji kondisi optimalnya!",
    },
    challenge_q: 'Kondisi paling ideal untuk menghasilkan NH3 (reaksi eksoterm, mol produk lebih sedikit) adalah?',
    challenge_opts: [
      { text: 'Suhu rendah, tekanan tinggi', correct: true },
      { text: 'Suhu tinggi, tekanan rendah', correct: false },
    ],
    challenge_explanation: 'Benar! Suhu rendah mendukung produk eksoterm, dan tekanan tinggi mendukung sisi bermol kecil.',
    reflection_q: 'Suhu rendah menguntungkan produk eksoterm, tapi mengapa Haber memakai 400°C?',
    reflection_opts: [
      { text: 'Katalis besi baru bekerja optimal, kompromi antara termodinamika dan kinetika.', correct: true },
      { text: 'Suhu tinggi selalu menghasilkan produk lebih banyak.', correct: false },
    ],
    reflection_explanation: 'Tepat! Ini adalah kompromi kecepatan reaksi (kinetika) vs jumlah produk (termodinamika) di dunia industri.',
  }
};

export const CHECKPOINT = {
  START: 0,
  OBSERVE: 1,      // CP1: Brownian motion
  FAIL_BUMP: 2,    // CP2: Failed collision
  SUCCESS: 3,      // CP3: Become product
  BECOME_PROD: 4,  // CP4: Explain product
  BREAK: 5,        // CP5: Break apart
  ZOOMOUT: 6,      // CP6: See the system
  EXPERIMENT: 7,   // CP7: Le Chatelier
  CHALLENGE: 8,
  REFLECTION: 9
};

// ---------------------------------------------------------------------------
// SOUND ENGINE (Slightly deeper/ethereal for void)
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
  H: { color: 0xffffff, r: 0.18 },
  I: { color: 0x8a2be2, r: 0.35 },
  N: { color: 0x2563eb, r: 0.28 },
  O: { color: 0xdc2626, r: 0.25 },
};

// Properly spaced coordinates for a realistic look
const MOLECULE_DEF = {
  H2:   [['H', -0.25, 0, 0], ['H', 0.25, 0, 0]],
  I2:   [['I', -0.4, 0, 0], ['I', 0.4, 0, 0]],
  HI:   [['H', -0.35, 0, 0], ['I', 0.35, 0, 0]],
  N2:   [['N', -0.3, 0, 0], ['N', 0.3, 0, 0]],
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
      color: colorHex, metalness: 0.4, roughness: 0.2, clearcoat: 1.0, clearcoatRoughness: 0.1,
      envMapIntensity: 2.0 // Makes it super glossy under lighting
    });
  }
  return matCache[colorHex];
}
const bondGeo = new THREE.CylinderGeometry(0.06, 0.06, 1, 32);
const bondMat = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 0.8, roughness: 0.2, clearcoat: 1.0 });

export function makeMolecule(type) {
  const defs = MOLECULE_DEF[type];
  const group = new THREE.Group();
  group.userData.molType = type;

  if (!defs) return group;

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
      // Connect atoms if they are close enough (threshold up to 1.5 units)
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
// UTILITIES: SOFT GLOW TEXTURE
// ---------------------------------------------------------------------------
function createSoftCircleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.5, 'rgba(255,255,255,0.3)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

// ---------------------------------------------------------------------------
// GYRO CONTROLS (VR Look around)
// ---------------------------------------------------------------------------
class GyroControls {
  constructor(cameraRig) {
    this.rig = cameraRig;
    this.dO = {}; this.sO = window.orientation || 0;
    this.q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
    this.zee = new THREE.Vector3(0, 0, 1);
    this.q0 = new THREE.Quaternion();
    window.addEventListener('deviceorientation', e => this.dO = e);
    window.addEventListener('orientationchange', () => this.sO = window.orientation || 0);
  }
  update() {
    const { alpha, beta, gamma } = this.dO;
    if (!alpha && !beta && !gamma) return;
    const e = new THREE.Euler(
      THREE.MathUtils.degToRad(beta || 0),
      THREE.MathUtils.degToRad(alpha || 0),
      -THREE.MathUtils.degToRad(gamma || 0), 'YXZ'
    );
    this.rig.quaternion.setFromEuler(e).multiply(this.q1).multiply(this.q0.setFromAxisAngle(this.zee, -THREE.MathUtils.degToRad(this.sO)));
  }
}

// ---------------------------------------------------------------------------
// THE VOID ENGINE (Choreographed Storytelling)
// ---------------------------------------------------------------------------
class CoreEngine {
  constructor(scene, camera, rig, misi, videoEl) {
    this.scene = scene;
    this.camera = camera;
    this.rig = rig;
    this.misi = misi;
    this.time = 0;
    this.videoEl = videoEl;
    
    // Setup isolated focus
    this.player = new THREE.Group();
    this.scene.add(this.player);
    this.playerMol = makeMolecule(misi.jenis);
    this.player.add(this.playerMol);
    
    // Proper circular soft glow beneath player
    const softTex = createSoftCircleTexture();
    const glowMat = new THREE.MeshBasicMaterial({ 
      map: softTex, color: 0x4fc3f7, transparent: true, opacity: 0.4, 
      blending: THREE.AdditiveBlending, depthWrite: false 
    });
    this.playerGlow = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), glowMat);
    this.playerGlow.rotation.x = -Math.PI/2;
    this.playerGlow.position.y = -0.5;
    this.player.add(this.playerGlow);

    // Flow particles (Arus Energi ✨✨✨)
    this.dust = new THREE.Group();
    const pGeo = new THREE.BufferGeometry();
    const pCount = 200;
    const pPos = new Float32Array(pCount * 3);
    for(let i=0; i<pCount*3; i+=3) {
      pPos[i] = (Math.random()-.5)*20;
      pPos[i+1] = (Math.random()-.5)*20;
      pPos[i+2] = -Math.random()*50;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ 
      map: softTex, color: 0x3b82f6, size: 0.4, 
      transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false 
    });
    this.dustPoints = new THREE.Points(pGeo, pMat);
    this.dust.add(this.dustPoints);
    this.scene.add(this.dust);

    // System molecules (Hidden initially to maintain focus)
    this.systemMols = new THREE.Group();
    for (let i = 0; i < 40; i++) {
      const isProd = i < 15;
      const mol = makeMolecule(isProd ? misi.produk : misi.jenis);
      mol.userData.isProd = isProd;
      mol.userData.basePos = new THREE.Vector3((Math.random()-.5)*15, (Math.random()-.5)*10, -5 - Math.random()*20);
      mol.userData.phase = Math.random() * 10;
      mol.position.copy(mol.userData.basePos);
      this.systemMols.add(mol);
    }
    this.systemMols.visible = false;
    this.scene.add(this.systemMols);

    this.cp = CHECKPOINT.START;
    this.cpTime = 0;
    this.forwardSpeed = 2.5;
    
    // Partner for collision choreo
    this.partner = makeMolecule(misi.pasangan);
    this.partner.position.set(0, 0, -100);
    this.scene.add(this.partner);
    
    this.systemEqShift = 0;
  }

  startJourney() {
    // FADE TO VOID
    if (this.videoEl && this.videoEl.srcObject) {
      this.videoEl.srcObject.getTracks().forEach(t => t.stop());
      this.videoEl.srcObject = null;
    }
    // Deep dark blue-black void
    this.scene.background = new THREE.Color(0x020308);
    this.scene.fog = new THREE.FogExp2(0x020308, 0.04);

    // Setup 3rd Person Camera (fixed behind player)
    this.camera.position.set(0, 1.2, 4.5);
    this.camera.lookAt(0, 0, -5);

    this.advanceTo(CHECKPOINT.START);
  }

  morphPlayer(toProd) {
    this.player.remove(this.playerMol);
    this.playerMol = makeMolecule(toProd ? this.misi.produk : this.misi.jenis);
    this.player.add(this.playerMol);
    if (toProd) {
      soundEngine.bondForm();
      this.dustPoints.material.color.setHex(0xfbbf24); 
      this.playerGlow.material.color.setHex(0xfbbf24);
    } else {
      soundEngine.bondBreak();
      this.dustPoints.material.color.setHex(0x3b82f6);
      this.playerGlow.material.color.setHex(0x4fc3f7);
    }
  }

  advanceTo(newCP) {
    this.cp = newCP;
    this.cpTime = 0;
    const msg = this.misi.story[`CP${newCP}`];
    if (window._onPhase) window._onPhase(newCP, msg);
  }

  update(dt) {
    this.time += dt;
    this.cpTime += dt;

    // Player wobble
    if (this.cp < CHECKPOINT.ZOOMOUT) {
      this.player.position.x = Math.sin(this.time * 0.8) * 0.4;
      this.player.position.y = Math.sin(this.time * 0.6) * 0.2;
      this.playerMol.rotation.y += dt * 0.5;
      this.playerMol.rotation.z = Math.sin(this.time) * 0.2;
      
      // Move camera rig forward through space to simulate player movement
      this.rig.position.z -= this.forwardSpeed * dt;
      this.player.position.z = this.rig.position.z - 2;
    } else {
      this.playerMol.rotation.y += dt * 0.5;
    }

    // Particle flow loop
    const posAttr = this.dustPoints.geometry.attributes.position;
    for(let i=2; i<posAttr.count*3; i+=3) {
      posAttr.array[i] += this.forwardSpeed * 2 * dt;
      if (posAttr.array[i] > this.rig.position.z + 5) {
        posAttr.array[i] -= 50;
        posAttr.array[i-2] = this.rig.position.x + (Math.random()-.5)*20; // x
        posAttr.array[i-1] = this.rig.position.y + (Math.random()-.5)*20; // y
      }
    }
    posAttr.needsUpdate = true;

    // System molecules (Brownian motion during ZoomOut)
    if (this.cp >= CHECKPOINT.ZOOMOUT) {
      const fwdRate = 0.2 * (1 + this.systemEqShift);
      const revRate = 0.2 * (1 - this.systemEqShift);

      this.systemMols.children.forEach(m => {
        m.userData.phase += dt;
        m.position.x = this.rig.position.x + m.userData.basePos.x + Math.sin(m.userData.phase * 0.5) * 0.5;
        m.position.y = this.rig.position.y + m.userData.basePos.y + Math.cos(m.userData.phase * 0.4) * 0.5;
        m.position.z = this.rig.position.z + m.userData.basePos.z;
        m.rotation.x += dt * 0.3;
        m.rotation.y += dt * 0.4;

        if (Math.random() < 0.01) {
          const goProd = Math.random() < fwdRate / (fwdRate + revRate);
          if (!m.userData.isProd && goProd) {
            const nm = makeMolecule(this.misi.produk);
            nm.position.copy(m.position); nm.userData = m.userData; nm.userData.isProd = true;
            this.systemMols.remove(m); this.systemMols.add(nm);
          } else if (m.userData.isProd && !goProd) {
            const nm = makeMolecule(this.misi.jenis);
            nm.position.copy(m.position); nm.userData = m.userData; nm.userData.isProd = false;
            this.systemMols.remove(m); this.systemMols.add(nm);
          }
        }
      });
    }

    // CHOREOGRAPHY LOGIC
    switch (this.cp) {
      case CHECKPOINT.START:
        if (this.cpTime > 2) this.advanceTo(CHECKPOINT.OBSERVE);
        break;
      case CHECKPOINT.OBSERVE:
        if (this.cpTime > 5) {
          this.partner.position.copy(this.player.position);
          this.partner.position.z -= 8;
          this.advanceTo(CHECKPOINT.FAIL_BUMP);
        }
        break;
      case CHECKPOINT.FAIL_BUMP:
        this.partner.position.z += 3 * dt;
        if (this.partner.position.distanceTo(this.player.position) < 0.8) {
          soundEngine.bounce();
          this.partner.position.x += 1;
          this.partner.position.z -= 100;
          this.advanceTo(CHECKPOINT.SUCCESS);
        }
        break;
      case CHECKPOINT.SUCCESS:
        if (this.cpTime > 3 && this.partner.position.z < this.player.position.z - 20) {
          this.partner.position.copy(this.player.position);
          this.partner.position.z -= 5;
        }
        if (this.cpTime > 3) {
           this.partner.position.z += 2 * dt;
           if (this.partner.position.distanceTo(this.player.position) < 0.8) {
             this.partner.position.z -= 100;
             this.morphPlayer(true);
             this.advanceTo(CHECKPOINT.BECOME_PROD);
           }
        }
        break;
      case CHECKPOINT.BECOME_PROD:
        if (this.cpTime > 6) {
          this.morphPlayer(false);
          this.advanceTo(CHECKPOINT.BREAK);
        }
        break;
      case CHECKPOINT.BREAK:
        if (this.cpTime > 4) {
          this.advanceTo(CHECKPOINT.ZOOMOUT);
        }
        break;
      case CHECKPOINT.ZOOMOUT:
        if (this.cpTime === dt) {
          this.forwardSpeed = 0;
          this.systemMols.visible = true; 
        }
        if (this.cpTime < 5) {
           this.camera.position.z += dt * 1.5;
           this.camera.position.y += dt * 0.5;
        }
        if (this.cpTime > 10) this.advanceTo(CHECKPOINT.EXPERIMENT);
        break;
    }
  }

  triggerTool(tool) {
    if (this.cp < CHECKPOINT.EXPERIMENT) return;
    let shift = 0;
    if (tool === 'heat') shift = this.misi.deltaH === 'endoterm' ? 0.6 : -0.6;
    else if (tool === 'cool') shift = this.misi.deltaH === 'endoterm' ? -0.6 : 0.6;
    else if (tool === 'compress') shift = 0.5;
    
    this.systemEqShift = shift;
    soundEngine.bondForm();
    if (window._onPhase) window._onPhase('TOOL', `Kondisi diubah, keseimbangan bergeser!`);
    
    if (this.cp === CHECKPOINT.EXPERIMENT) {
      setTimeout(() => this.advanceTo(CHECKPOINT.CHALLENGE), 4000);
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
  
  // Create beautiful multi-directional lighting for PBR reflections
  const ambient = new THREE.AmbientLight(0x223344, 1.0);
  scene.add(ambient);
  
  const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
  mainLight.position.set(5, 10, 5);
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0x4fc3f7, 1.5); // Blue rim light
  fillLight.position.set(-5, 0, -5);
  scene.add(fillLight);
  
  const backLight = new THREE.DirectionalLight(0xf87171, 1.5); // Red rim light
  backLight.position.set(0, -5, -10);
  scene.add(backLight);

  const cameraRig = new THREE.Group();
  scene.add(cameraRig);
  const camera = new THREE.PerspectiveCamera(70, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  cameraRig.add(camera);

  // Initial Reality State
  let isTrueAR = false;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    videoEl.srcObject = stream;
    await videoEl.play().catch(() => {});
    isTrueAR = true;
  } catch {
    scene.background = new THREE.Color(0x020308);
  }

  const gyro = new GyroControls(cameraRig);
  
  // Desktop Drag
  let isDrag = false, dX = 0, dY = 0, camYaw = 0, camPitch = 0;
  canvas.addEventListener('mousedown', e => { isDrag = true; dX = e.clientX; dY = e.clientY; });
  canvas.addEventListener('mousemove', e => {
    if (!isDrag || isTrueAR) return;
    camYaw -= (e.clientX - dX) * 0.005; dX = e.clientX;
    camPitch -= (e.clientY - dY) * 0.005; dY = e.clientY;
    camPitch = Math.max(-Math.PI/4, Math.min(Math.PI/4, camPitch));
    cameraRig.quaternion.setFromEuler(new THREE.Euler(camPitch, camYaw, 0, 'YXZ'));
  });
  window.addEventListener('mouseup', () => isDrag = false);

  let engine = null;
  let running = true;
  const clock = new THREE.Clock();

  renderer.setAnimationLoop(() => {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    if (engine) engine.update(dt);
    if (isTrueAR) gyro.update();
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
