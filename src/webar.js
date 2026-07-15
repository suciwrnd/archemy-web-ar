import * as THREE from 'three';

/* ==========================================================================
   ARCHEMY WEBAR ENGINE v10.0 — PBR 3D Storytelling Experience
   - True 3D Materials (Physical, Clearcoat, Reflections)
   - Real 3D Flow Field (Particles), no 2D flat ribbons
   - Choreographed Storytelling (Failed Collision, Reversible, Zoom Out)
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
      CP1: "Semua molekul bergerak dan bertumbukan secara acak di dalam sistem tertutup ini.",
      CP2: "Bump! Tidak semua tumbukan menghasilkan reaksi. Energi harus cukup.",
      CP3: "", // Silent on success
      CP4: "", // Break apart
      CP5: "", // Loop
      CP6: "Walaupun molekul-molekul individual terus berubah bentuk bolak-balik, perbandingan jumlah H₂, I₂, dan HI secara keseluruhan tetap. Inilah Kesetimbangan Dinamis.",
      CP7: "Eksperimen Asas Le Chatelier: Reaksi pembentukan HI bersifat endotermik (menyerap panas). Coba ubah suhu atau tekanan untuk menggeser kesetimbangan!",
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
      CP1: "Kamu adalah NO₂ (gas beracun penyebab smog). Molekul lain bergerak di sekitarmu.",
      CP2: "Bump! Tabrakan terjadi, namun ikatan gagal terbentuk.",
      CP3: "", 
      CP4: "", 
      CP5: "", 
      CP6: "Sistem mencapai Kesetimbangan Dinamis. 2NO₂ dan N₂O₄ terus-menerus saling terbentuk dan terurai pada laju yang sama.",
      CP7: "Eksperimen Asas Le Chatelier: Reaksi ini eksotermik (melepas panas). Coba manipulasi tekanan atau suhu kota ini!",
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
      CP1: "N₂ memiliki ikatan rangkap tiga yang sangat kuat. Memecahnya sangat sulit.",
      CP2: "Bump! Energi aktivasi tidak cukup. Reaksi gagal.",
      CP3: "", 
      CP4: "", 
      CP5: "", 
      CP6: "Kesetimbangan tercapai. Laju N₂ + 3H₂ → 2NH₃ sama dengan laju 2NH₃ → N₂ + 3H₂.",
      CP7: "Eksperimen Asas Le Chatelier: Dalam industri Haber, reaksi ini eksotermik. Kondisi apa yang paling optimal?",
    },
    challenge_q: 'Mengambil NH₃ secara terus menerus dari reaktor akan mengakibatkan?',
    challenge_opts: [
      { text: 'Kesetimbangan bergeser ke kanan (produk bertambah)', correct: true },
      { text: 'Kesetimbangan bergeser ke kiri (reaktan bertambah)', correct: false },
    ],
    challenge_explanation: 'Benar! Sesuai Le Chatelier, membuang produk akan memaksa sistem untuk memproduksi produk tersebut kembali.',
    reflection_q: 'Suhu rendah menguntungkan produk eksoterm, tapi mengapa Haber memakai 400°C?',
    reflection_opts: [
      { text: 'Katalis besi baru bekerja optimal, kompromi antara yield dan kecepatan.', correct: true },
      { text: 'Suhu tinggi selalu menghasilkan produk lebih banyak.', correct: false },
    ],
    reflection_explanation: 'Tepat! Ini adalah kompromi kinetika vs termodinamika di dunia industri.',
  }
};

export const CHECKPOINT = {
  START: 0,
  OBSERVE: 1,      // CP1: Brownian motion
  FAIL_BUMP: 2,    // CP2: Failed collision
  SUCCESS: 3,      // CP3: Become product
  BREAK: 4,        // CP4: Loh? Break apart
  LOOP: 5,         // CP5: Loop again
  ZOOMOUT: 6,      // CP6: See the system
  EXPERIMENT: 7,   // CP7: Le Chatelier
  CHALLENGE: 8,
  REFLECTION: 9
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
    o.frequency.setValueAtTime(400, this.ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.5);
    g.gain.setValueAtTime(0.1, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
    o.start(); o.stop(this.ctx.currentTime + 0.5);
  }
  bounce() {
    if (!this.ctx) return; this._r();
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.connect(g); g.connect(this.ctx.destination);
    o.frequency.setValueAtTime(200, this.ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.2);
    g.gain.setValueAtTime(0.2, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    o.start(); o.stop(this.ctx.currentTime + 0.2);
  }
  bondForm() {
    if (!this.ctx) return; this._r();
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.connect(g); g.connect(this.ctx.destination);
    o.type = 'sine'; o.frequency.value = 600;
    g.gain.setValueAtTime(0, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
    o.start(); o.stop(this.ctx.currentTime + 0.4);
  }
  bondBreak() {
    if (!this.ctx) return; this._r();
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.connect(g); g.connect(this.ctx.destination);
    o.type = 'triangle'; o.frequency.value = 150;
    g.gain.setValueAtTime(0.15, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    o.start(); o.stop(this.ctx.currentTime + 0.3);
  }
}
export const soundEngine = new SoundEngine();

// ---------------------------------------------------------------------------
// TRUE 3D PBR MOLECULE BUILDER
// ---------------------------------------------------------------------------
const ATOM_CFG = {
  H: { color: 0xffffff, r: 0.12 },
  I: { color: 0x8a2be2, r: 0.22 },
  N: { color: 0x2563eb, r: 0.18 },
  O: { color: 0xdc2626, r: 0.16 },
};

const MOLECULE_DEF = {
  H2:   [['H',-0.12,0,0],['H',0.12,0,0]],
  I2:   [['I',-0.2,0,0],['I',0.2,0,0]],
  HI:   [['H',-0.15,0,0],['I',0.15,0,0]],
  N2:   [['N',-0.14,0,0],['N',0.14,0,0]],
  NO2:  [['N',0,0,0],['O',-0.16,0.14,0],['O',0.16,0.14,0]],
  N2O4: [['N',-0.12,0,0],['N',0.12,0,0],['O',-0.24,0.14,0],['O',-0.24,-0.14,0],['O',0.24,0.14,0],['O',0.24,-0.14,0]],
  NH3:  [['N',0,0.1,0],['H',-0.13,-0.05,0.1],['H',0.13,-0.05,0.1],['H',0,-0.05,-0.15]],
};

// Reusable geometries and materials for performance
const geoCache = {};
function getSphereGeo(r) {
  if (!geoCache[r]) geoCache[r] = new THREE.SphereGeometry(r, 32, 32);
  return geoCache[r];
}
const matCache = {};
function getAtomMat(colorHex) {
  if (!matCache[colorHex]) {
    // Premium 3D material: glossy plastic / glass look
    matCache[colorHex] = new THREE.MeshPhysicalMaterial({
      color: colorHex,
      metalness: 0.1,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
  }
  return matCache[colorHex];
}
const bondGeo = new THREE.CylinderGeometry(0.03, 0.03, 1, 16);
const bondMat = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.5, roughness: 0.3, clearcoat: 0.5 });

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
    m.castShadow = true; m.receiveShadow = true;
    group.add(m);
    pts.push(new THREE.Vector3(x, y, z));
  });

  // Bonds
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dist = pts[i].distanceTo(pts[j]);
      if (dist < 0.45) { // Threshold for bonding
        const bond = new THREE.Mesh(bondGeo, bondMat);
        bond.position.copy(pts[i]).lerp(pts[j], 0.5);
        bond.scale.y = dist;
        bond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), pts[j].clone().sub(pts[i]).normalize());
        bond.castShadow = true; bond.receiveShadow = true;
        group.add(bond);
      }
    }
  }
  return group;
}

// 3D Text Marker instead of 2D Sprite
function create3DMarker(scene) {
  const group = new THREE.Group();
  const pointerGeo = new THREE.ConeGeometry(0.06, 0.15, 4);
  const pointerMat = new THREE.MeshPhysicalMaterial({ color: 0xffdd00, emissive: 0x443300, roughness: 0.2 });
  const pointer = new THREE.Mesh(pointerGeo, pointerMat);
  pointer.rotation.x = Math.PI; // point down
  pointer.position.y = 0.5;
  group.add(pointer);
  
  // Animation loop attached to userData
  group.userData.update = (time) => {
    pointer.position.y = 0.5 + Math.sin(time * 5) * 0.05;
    pointer.rotation.y = time * 2;
  };
  return group;
}

// ---------------------------------------------------------------------------
// GYRO CONTROLS
// ---------------------------------------------------------------------------
class GyroControls {
  constructor(camera) {
    this.camera = camera;
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
    this.camera.quaternion.setFromEuler(e).multiply(this.q1).multiply(this.q0.setFromAxisAngle(this.zee, -THREE.MathUtils.degToRad(this.sO)));
  }
}

// ---------------------------------------------------------------------------
// FLOW FIELD ENGINE (No roads/lines, just 3D motion and choreography)
// ---------------------------------------------------------------------------
class CoreEngine {
  constructor(scene, camera, rig, misi) {
    this.scene = scene;
    this.camera = camera;
    this.rig = rig;
    this.misi = misi;
    this.time = 0;
    
    this.player = new THREE.Group();
    this.scene.add(this.player);
    this.playerMol = makeMolecule(misi.jenis);
    this.player.add(this.playerMol);
    this.marker = create3DMarker(this.scene);
    this.player.add(this.marker);

    // Flow particles (3D dust indicating forward movement)
    this.dust = new THREE.Group();
    const pGeo = new THREE.BoxGeometry(0.02, 0.02, 0.1);
    const pMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.3 });
    for (let i = 0; i < 200; i++) {
      const m = new THREE.Mesh(pGeo, pMat);
      m.position.set((Math.random()-.5)*15, (Math.random()-.5)*15, -Math.random()*30);
      m.userData.speed = 2 + Math.random() * 3;
      this.dust.add(m);
    }
    this.scene.add(this.dust);

    // Other molecules in the system
    this.systemMols = [];
    for (let i = 0; i < 24; i++) {
      const isProd = i < 8; // 33% product initially
      const mol = makeMolecule(isProd ? misi.produk : misi.jenis);
      mol.userData.isProd = isProd;
      // Position them along a deep Z corridor
      mol.position.set((Math.random()-.5)*8, (Math.random()-.5)*4, -5 - Math.random()*40);
      mol.userData.basePos = mol.position.clone();
      mol.userData.phase = Math.random() * 10;
      this.systemMols.push(mol);
      this.scene.add(mol);
    }

    // Choreography State
    this.cp = CHECKPOINT.START;
    this.cpTime = 0;
    this.forwardSpeed = 2.0;
    this.camTargetZ = 2.0;
    this.camTargetY = 0.8;
    this.playerTarget = misi.pasangan;
    
    // Partner for collision choreo
    this.partner = makeMolecule(misi.pasangan);
    this.partner.position.set(0, 0, -100);
    this.scene.add(this.partner);
    
    this.systemEqShift = 0; // For Le Chatelier
  }

  morphPlayer(toProd) {
    this.player.remove(this.playerMol);
    this.playerMol = makeMolecule(toProd ? this.misi.produk : this.misi.jenis);
    this.player.add(this.playerMol);
    if (toProd) soundEngine.bondForm(); else soundEngine.bondBreak();
    if (window._updateHUDForm) window._updateHUDForm(toProd, this.playerMol.userData.molType);
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

    // Smooth camera rig follow
    this.rig.position.x += (this.player.position.x - this.rig.position.x) * dt * 2;
    this.rig.position.y += (this.player.position.y + this.camTargetY - this.rig.position.y) * dt * 2;
    this.rig.position.z += (this.player.position.z + this.camTargetZ - this.rig.position.z) * dt * 2;

    this.marker.userData.update(this.time);

    // Natural wobble
    if (this.cp < CHECKPOINT.ZOOMOUT) {
      this.player.position.x = Math.sin(this.time * 0.5) * 0.5;
      this.player.position.y = Math.sin(this.time * 0.7) * 0.3;
      this.playerMol.rotation.y += dt * 0.5;
      this.playerMol.rotation.z = Math.sin(this.time) * 0.2;
    }

    // Move player forward through space
    if (this.cp >= CHECKPOINT.OBSERVE && this.cp < CHECKPOINT.ZOOMOUT) {
      this.player.position.z -= this.forwardSpeed * dt;
    }

    // Dust flow relative to player
    this.dust.children.forEach(d => {
      d.position.z += d.userData.speed * dt;
      if (d.position.z > this.player.position.z + 5) {
        d.position.z -= 30;
        d.position.x = this.player.position.x + (Math.random()-.5)*15;
        d.position.y = this.player.position.y + (Math.random()-.5)*15;
      }
    });

    // Update system molecules (Brownian motion)
    const fwdRate = 0.2 * (1 + this.systemEqShift);
    const revRate = 0.2 * (1 - this.systemEqShift);
    let prodCount = 0;

    this.systemMols.forEach(m => {
      m.userData.phase += dt;
      m.position.x = m.userData.basePos.x + Math.sin(m.userData.phase * 0.5) * 0.5;
      m.position.y = m.userData.basePos.y + Math.cos(m.userData.phase * 0.4) * 0.5;
      m.rotation.x += dt * 0.3;
      m.rotation.y += dt * 0.4;
      
      // If passed by player, wrap around to the front (endless corridor)
      if (m.position.z > this.player.position.z + 5) {
        m.position.z -= 40;
        m.userData.basePos.z -= 40;
      }

      // Reactions for system molecules (only after zoomout)
      if (this.cp >= CHECKPOINT.ZOOMOUT) {
        if (Math.random() < 0.01) { // checking periodically
          const goProd = Math.random() < fwdRate / (fwdRate + revRate);
          if (!m.userData.isProd && goProd) {
            this.scene.remove(m);
            const nm = makeMolecule(this.misi.produk);
            nm.position.copy(m.position); nm.userData = m.userData; nm.userData.isProd = true;
            this.systemMols[this.systemMols.indexOf(m)] = nm;
            this.scene.add(nm);
          } else if (m.userData.isProd && !goProd) {
            this.scene.remove(m);
            const nm = makeMolecule(this.misi.jenis);
            nm.position.copy(m.position); nm.userData = m.userData; nm.userData.isProd = false;
            this.systemMols[this.systemMols.indexOf(m)] = nm;
            this.scene.add(nm);
          }
        }
      }
      if (m.userData.isProd) prodCount++;
    });

    // HUD Eq update
    if (this.cp >= CHECKPOINT.ZOOMOUT && window._updateHUDEq) {
      window._updateHUDEq(Math.round((prodCount/24)*100), Math.round((1-prodCount/24)*100));
    }

    // CHOREOGRAPHY LOGIC
    switch (this.cp) {
      case CHECKPOINT.START:
        if (this.cpTime > 2) this.advanceTo(CHECKPOINT.OBSERVE);
        break;
      case CHECKPOINT.OBSERVE:
        if (this.cpTime > 5) {
          // Setup failed bump
          this.partner.position.copy(this.player.position);
          this.partner.position.z -= 5;
          this.advanceTo(CHECKPOINT.FAIL_BUMP);
        }
        break;
      case CHECKPOINT.FAIL_BUMP:
        this.partner.position.z += 2 * dt; // Coming towards player
        if (this.partner.position.distanceTo(this.player.position) < 0.6) {
          soundEngine.bounce();
          this.partner.position.x += 1; // Bounce away
          this.partner.position.z -= 100; // Remove from path
          this.advanceTo(CHECKPOINT.SUCCESS);
        }
        break;
      case CHECKPOINT.SUCCESS:
        if (this.cpTime > 3 && this.partner.position.z < this.player.position.z - 20) {
          this.partner.position.copy(this.player.position);
          this.partner.position.z -= 4; // Spawn in front
        }
        if (this.cpTime > 3) {
           this.partner.position.z += 1.5 * dt;
           if (this.partner.position.distanceTo(this.player.position) < 0.5) {
             this.partner.position.z -= 100;
             this.morphPlayer(true); // Become product
             this.advanceTo(CHECKPOINT.BREAK);
           }
        }
        break;
      case CHECKPOINT.BREAK:
        // Fly as product for a bit, then break
        if (this.cpTime > 4.5) {
          this.morphPlayer(false);
          this.advanceTo(CHECKPOINT.LOOP);
        }
        break;
      case CHECKPOINT.LOOP:
        // Do one more quick success & break loop
        if (this.cpTime > 2 && this.cpTime < 3) {
          this.partner.position.copy(this.player.position);
          this.partner.position.z -= 2;
          this.cpTime = 4; // skip ahead
        }
        if (this.cpTime > 4 && this.cpTime < 5) {
          this.partner.position.z += 2*dt;
          if (this.partner.position.distanceTo(this.player.position) < 0.5) {
             this.partner.position.z -= 100;
             this.morphPlayer(true);
             this.cpTime = 6;
          }
        }
        if (this.cpTime > 8) {
          this.morphPlayer(false);
          this.advanceTo(CHECKPOINT.ZOOMOUT);
        }
        break;
      case CHECKPOINT.ZOOMOUT:
        if (this.cpTime === dt) {
          // Trigger cinematic zoom out
          this.forwardSpeed = 0; // Stop moving forward
          this.camTargetY = 3.5;
          this.camTargetZ = 6.0;
          this.player.remove(this.marker); // Hide marker
          // Gather system molecules into a cluster in front of camera
          this.systemMols.forEach((m, i) => {
            const angle = (i / 24) * Math.PI * 2;
            const r = 2 + Math.random() * 3;
            m.userData.basePos.set(
              this.player.position.x + Math.cos(angle) * r,
              this.player.position.y + (Math.random()-.5)*2,
              this.player.position.z - 3 + Math.sin(angle) * r
            );
          });
        }
        if (this.cpTime > 8) this.advanceTo(CHECKPOINT.EXPERIMENT);
        break;
    }
  }

  triggerTool(tool) {
    if (this.cp < CHECKPOINT.EXPERIMENT) return;
    let shift = 0;
    if (tool === 'heat') shift = this.misi.deltaH === 'endoterm' ? 0.6 : -0.6;
    else if (tool === 'cool') shift = this.misi.deltaH === 'endoterm' ? -0.6 : 0.6;
    else if (tool === 'compress') shift = 0.5;
    else if (tool === 'add') shift = 0.4;
    
    this.systemEqShift = shift;
    soundEngine.bondForm();
    if (window._onPhase) window._onPhase('TOOL', `Mengubah kondisi... kesetimbangan bergeser!`);
    
    // Unlock challenge after a tool is used
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

  // Setup renderer for high-quality PBR
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  
  // High quality lighting setup (Studio style)
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);
  
  const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
  dirLight.position.set(5, 8, 5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0x88bbff, 1.5);
  fillLight.position.set(-5, -2, -5);
  scene.add(fillLight);

  const cameraRig = new THREE.Group();
  scene.add(cameraRig);

  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  cameraRig.add(camera);

  // Camera feed handling
  let isTrueAR = false;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    videoEl.srcObject = stream;
    await videoEl.play().catch(() => {});
    isTrueAR = true;
  } catch {
    // Fallback virtual background if camera denied
    scene.background = new THREE.Color(0x050a14);
  }

  const gyro = new GyroControls(camera);
  
  // Desktop fallback controls
  let isDrag = false, dX = 0, dY = 0, camYaw = 0, camPitch = 0;
  canvas.addEventListener('mousedown', e => { isDrag = true; dX = e.clientX; dY = e.clientY; });
  canvas.addEventListener('mousemove', e => {
    if (!isDrag || isTrueAR) return;
    camYaw -= (e.clientX - dX) * 0.005; dX = e.clientX;
    camPitch -= (e.clientY - dY) * 0.005; dY = e.clientY;
    camPitch = Math.max(-Math.PI/4, Math.min(Math.PI/4, camPitch));
    camera.rotation.set(camPitch, camYaw, 0, 'YXZ');
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
      engine = new CoreEngine(scene, camera, cameraRig, misi);
      if (window._updateHUDForm) window._updateHUDForm(false, misi.jenis);
      engine.advanceTo(CHECKPOINT.START);
    },
    triggerTool: (tool) => engine?.triggerTool(tool),
    onQuizAnswered: () => {
      // Unused in this version, auto-advances
    },
    onChallengeAnswered: () => {
      engine.advanceTo(CHECKPOINT.REFLECTION);
      if (callbacks.onReflection) callbacks.onReflection();
    },
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
