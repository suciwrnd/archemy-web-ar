import * as THREE from 'three';

const DEFAULT_WARN_WARNA = 0xffa500; // Reaktan
const DEFAULT_SUKSES_WARNA = 0x3b82f6; // Produk

export const sensorData = {
  gX: 0,
  gY: -0.001,
  gZ: 0,
  shake: 0,
  isSpilled: false,
  spillCallback: null,
  unspillCallback: null
};

window.addEventListener('deviceorientation', (e) => {
  const beta = e.beta || 0;
  const gamma = e.gamma || 0;
  const betaRad = beta * (Math.PI / 180);
  const gammaRad = gamma * (Math.PI / 180);
  
  // Real physical gravity mapping to device axes
  sensorData.gX = Math.sin(gammaRad) * 0.003;
  sensorData.gY = -Math.sin(betaRad) * 0.003;
  sensorData.gZ = -Math.cos(betaRad) * Math.cos(gammaRad) * 0.003;
  
  // Spill if tilted severely upside down (beta > 150 or beta < -80, or gamma rolled too much)
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
  const acc = e.acceleration || { x:0, y:0, z:0 };
  const force = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
  if (force > 12) {
    sensorData.shake = force * 0.0002;
    lastShakeTime = performance.now();
  }
  if (performance.now() - lastShakeTime > 500) sensorData.shake *= 0.9;
});

export function requestSensorPermission() {
  sensorData.isSpilled = false;
  sensorData.shake = 0;
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission().catch(() => {});
  }
}

export const MISI_DATA = {
  misi1: {
    judul: 'Misi 1: Gas Iodin Reversibel',
    persamaan: 'H₂(g) + I₂(g) ⇌ 2HI(g)',
    ceritaAwal: 'Halo! Reaksi di labu ini belum setimbang. Laju reaksi pembentukan produk dan penguraian reaktan masih berbeda. Atur Suhu mencapai 🎯 Target 50°C untuk menyeimbangkannya!',
    ceritaSukses: 'Luar biasa! Kesetimbangan tercapai. Ingat, ini Kesetimbangan Dinamis: Secara statis warnanya tetap, tapi secara mikroskopis molekul H₂, I₂, dan HI terus bereaksi bolak-balik dengan laju yang sama!',
    parameterKunci: 'suhu',
    nilaiTarget: 50,
    rentang: {
      suhu: [20, 100, 1, 30, '°C'],
      volume: [1, 5, 0.1, 3.0, 'L'],
      tekanan: [1, 5, 0.1, 1.0, 'atm'],
      konsentrasi: [0.1, 2, 0.1, 1.0, 'M']
    },
    partikel: {
      jauhTarget: [{ jenis: 'H2', jumlah: 4 }, { jenis: 'I2', jumlah: 4 }, { jenis: 'HI', jumlah: 1 }],
      dekatTarget: [{ jenis: 'H2', jumlah: 1 }, { jenis: 'I2', jumlah: 1 }, { jenis: 'HI', jumlah: 5 }]
    }
  },
  misi2: {
    judul: 'Misi 2: Operasi Smog Kota',
    persamaan: '2NO₂(g) ⇌ N₂O₄(g)',
    ceritaAwal: 'Gas NO₂ beracun! Sistem belum setimbang. Sesuai asas Le Chatelier, perkecil Volume labu ke 🎯 Target 2.0L untuk meningkatkan tekanan dan menggeser reaksi ke jumlah mol gas yang lebih kecil (N₂O₄).',
    ceritaSukses: 'Hebat! Volume kecil memperbesar tekanan, menggeser reaksi ke arah N₂O₄. Secara dinamis, molekul NO₂ dan N₂O₄ masih terus terbentuk dan terurai tanpa henti di dalam sistem!',
    parameterKunci: 'volume',
    nilaiTarget: 2.0,
    rentang: {
      suhu: [20, 100, 1, 50, '°C'],
      volume: [1, 5, 0.1, 4.0, 'L'],
      tekanan: [1, 5, 0.1, 1.0, 'atm'],
      konsentrasi: [0.1, 2, 0.1, 1.0, 'M']
    },
    partikel: {
      jauhTarget: [{ jenis: 'NO2', jumlah: 6 }, { jenis: 'N2O4', jumlah: 1 }],
      dekatTarget: [{ jenis: 'NO2', jumlah: 1 }, { jenis: 'N2O4', jumlah: 4 }]
    }
  },
  misi3: {
    judul: 'Misi 3: Pabrik Pupuk Amonia',
    persamaan: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g)',
    ceritaAwal: 'Pabrik butuh NH₃. Sistem belum setimbang. Tambahkan Konsentrasi reaktan H₂ mencapai 🎯 Target 1.0 M untuk mendorong kesetimbangan ke arah produk (kanan)!',
    ceritaSukses: 'Sempurna! Asas Le Chatelier terbukti: penambahan konsentrasi reaktan menggeser reaksi ke produk. Meskipun jumlah amonia tampak statis, reaksi mikroskopis tetap berjalan bolak-balik (dinamis)!',
    parameterKunci: 'konsentrasi',
    nilaiTarget: 1.0,
    rentang: {
      suhu: [20, 100, 1, 50, '°C'],
      volume: [1, 5, 0.1, 3.0, 'L'],
      tekanan: [1, 5, 0.1, 1.0, 'atm'],
      konsentrasi: [0.1, 2, 0.1, 0.2, 'M']
    },
    partikel: {
      jauhTarget: [{ jenis: 'H2', jumlah: 6 }, { jenis: 'NH3', jumlah: 1 }],
      dekatTarget: [{ jenis: 'H2', jumlah: 2 }, { jenis: 'NH3', jumlah: 4 }]
    }
  },
  misi4: {
    judul: 'Misi 4: Buffer Darah',
    persamaan: 'H₂CO₃(aq) ⇌ HCO₃⁻(aq) + H⁺(aq)',
    ceritaAwal: 'pH darah pasien tidak seimbang! Atur Tekanan gas paru-paru mencapai 🎯 Target 3.0 atm untuk memulihkan kesetimbangan asam karbonat!',
    ceritaSukses: 'Penyelamatan berhasil! Darah kini dalam keadaan kesetimbangan dinamis. Reaksi ionisasi dan asosiasi terus terjadi di dalam plasma darah dengan laju yang seimbang.',
    parameterKunci: 'tekanan',
    nilaiTarget: 3.0,
    rentang: {
      suhu: [20, 100, 1, 37, '°C'],
      volume: [1, 5, 0.1, 3.0, 'L'],
      tekanan: [1, 5, 0.1, 1.5, 'atm'],
      konsentrasi: [0.1, 2, 0.1, 1.0, 'M']
    },
    partikel: {
      jauhTarget: [{ jenis: 'H2CO3', jumlah: 4 }, { jenis: 'HCO3', jumlah: 1 }],
      dekatTarget: [{ jenis: 'H2CO3', jumlah: 1 }, { jenis: 'HCO3', jumlah: 4 }]
    }
  }
};

const ATOM_WARNA = { H: 0xdbeafe, I: 0xd946ef, N: 0x3b82f6, O: 0xef4444, C: 0xfbbf24 };
const ATOM_RADIUS = { H: 0.055, I: 0.09, N: 0.075, O: 0.065, C: 0.08 };

export async function deteksiModeAR() {
  if (navigator.xr) {
    try {
      const didukung = await navigator.xr.isSessionSupported('immersive-ar');
      if (didukung) return 'webxr';
    } catch (_) {}
  }
  return (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ? 'arjs' : 'unsupported';
}

export function buatGeometryErlenmeyer() {
  const profil = [
    // Outer wall
    new THREE.Vector2(0.0, -0.32),
    new THREE.Vector2(0.26, -0.32),
    new THREE.Vector2(0.26, -0.24),
    new THREE.Vector2(0.22, -0.05),
    new THREE.Vector2(0.16, 0.12),
    new THREE.Vector2(0.08, 0.24),
    new THREE.Vector2(0.07, 0.42),
    // Rim
    new THREE.Vector2(0.09, 0.44),
    new THREE.Vector2(0.09, 0.45),
    new THREE.Vector2(0.07, 0.46),
    new THREE.Vector2(0.06, 0.45),
    // Inner wall
    new THREE.Vector2(0.06, 0.42),
    new THREE.Vector2(0.07, 0.24),
    new THREE.Vector2(0.15, 0.12),
    new THREE.Vector2(0.21, -0.05),
    new THREE.Vector2(0.25, -0.24),
    new THREE.Vector2(0.25, -0.31),
    new THREE.Vector2(0.0, -0.31)
  ];
  const geometry = new THREE.LatheGeometry(profil, 48);
  geometry.computeVertexNormals();
  return geometry;
}

export function buatMaterialKaca() {
  return new THREE.MeshPhysicalMaterial({
    color: 0xbfdbfe,
    metalness: 0.0,
    roughness: 0.05,
    transmission: 0.95,
    ior: 1.4,
    thickness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
    depthWrite: false
  });
}

function buatAtom(simbol, jenisMol) {
  const isColorblind = document.body.classList.contains('colorblind-mode');
  const isProduk = ['NH3', 'HI', 'N2O4', 'HCO3'].includes(jenisMol);
  
  let geo;
  const r = ATOM_RADIUS[simbol] || 0.04;
  if (isColorblind && isProduk) {
    geo = new THREE.BoxGeometry(r*2.2, r*2.2, r*2.2);
  } else {
    geo = new THREE.SphereGeometry(r, 20, 20);
  }

  let baseColor = ATOM_WARNA[simbol] || 0x888888;
  if (isColorblind) {
    baseColor = isProduk ? 0x3b82f6 : 0xf59e0b;
  }

  const mat = new THREE.MeshPhysicalMaterial({ 
    color: baseColor, 
    roughness: 0.25, 
    metalness: 0.15,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    emissive: new THREE.Color(baseColor).multiplyScalar(0.3),
    emissiveIntensity: 1.0
  });
  return new THREE.Mesh(geo, mat);
}

function buatIkatan(panjang, radius = 0.012) {
  const geo = new THREE.CylinderGeometry(radius, radius, panjang, 8);
  const mat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.1 });
  return new THREE.Mesh(geo, mat);
}

function buatIkatanKe(p1, p2, radius = 0.012) {
  const distance = p1.distanceTo(p2);
  const geo = new THREE.CylinderGeometry(radius, radius, distance, 12);
  const mat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.1 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(p1).lerp(p2, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
  return mesh;
}

const RESEP_MOLEKUL = {
  H2: { atoms: ['H', 'H'], jarak: 0.06 },
  I2: { atoms: ['I', 'I'], jarak: 0.08 },
  HI: { atoms: ['H', 'I'], jarak: 0.07 },
  NO2: { atoms: ['N', 'O', 'O'], sudut: true },
  N2O4: { atoms: ['N', 'N', 'O', 'O', 'O', 'O'], dimer: true },
  NH3: { atoms: ['N', 'H', 'H', 'H'], piramida: true },
  H2CO3: { atoms: ['C', 'O', 'O', 'O'], kompleks: true },
  HCO3: { atoms: ['C', 'O', 'O'], kompleks: true }
};
function buatLabelTeks(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 180; canvas.height = 80;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 180, 80);
  // Background pill
  ctx.fillStyle = 'rgba(15, 10, 30, 0.75)';
  ctx.beginPath(); ctx.roundRect(4, 12, 172, 56, 20); ctx.fill();
  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 90, 40);
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(0.22, 0.1, 1);
  return sprite;
}

export function buatMolekul(jenis) {
  const resep = RESEP_MOLEKUL[jenis]; if (!resep) return new THREE.Group();
  const grup = new THREE.Group();

  if (resep.atoms.length === 2) {
    const atomA = buatAtom(resep.atoms[0], jenis); const atomB = buatAtom(resep.atoms[1], jenis);
    atomA.position.set(-resep.jarak/2, 0, 0); atomB.position.set(resep.jarak/2, 0, 0);
    grup.add(atomA, atomB, buatIkatanKe(atomA.position, atomB.position));
  } else if (resep.sudut) {
    // Bentuk V (Bent) untuk NO2
    const n = buatAtom('N', jenis); const o1 = buatAtom('O', jenis); const o2 = buatAtom('O', jenis);
    n.position.set(0, 0, 0);
    o1.position.set(-0.04, 0.03, 0); o2.position.set(0.04, 0.03, 0);
    grup.add(n, o1, o2, buatIkatanKe(n.position, o1.position), buatIkatanKe(n.position, o2.position));
  } else if (resep.dimer) {
    // Planar N2O4
    const n1 = buatAtom('N', jenis); const n2 = buatAtom('N', jenis);
    n1.position.set(-0.03, 0, 0); n2.position.set(0.03, 0, 0);
    const o1 = buatAtom('O', jenis); const o2 = buatAtom('O', jenis);
    const o3 = buatAtom('O', jenis); const o4 = buatAtom('O', jenis);
    o1.position.set(-0.06, 0.04, 0); o2.position.set(-0.06, -0.04, 0);
    o3.position.set(0.06, 0.04, 0); o4.position.set(0.06, -0.04, 0);
    grup.add(n1, n2, o1, o2, o3, o4);
    grup.add(buatIkatanKe(n1.position, n2.position));
    grup.add(buatIkatanKe(n1.position, o1.position), buatIkatanKe(n1.position, o2.position));
    grup.add(buatIkatanKe(n2.position, o3.position), buatIkatanKe(n2.position, o4.position));
  } else if (resep.piramida) {
    // Trigonal Pyramidal untuk NH3
    const n = buatAtom('N', jenis); n.position.set(0, 0.02, 0); grup.add(n);
    for(let i=0; i<3; i++) {
      const h = buatAtom('H', jenis); const angle = (i * Math.PI * 2) / 3;
      h.position.set(Math.cos(angle)*0.04, -0.02, Math.sin(angle)*0.04);
      grup.add(h, buatIkatanKe(n.position, h.position));
    }
  } else if (resep.kompleks) {
    // Planar segitiga untuk karbonat
    const c = buatAtom('C', jenis); c.position.set(0, 0, 0); grup.add(c);
    for(let i=0; i<resep.atoms.length-1; i++) {
      const o = buatAtom('O', jenis); const angle = (i * Math.PI * 2) / 3;
      o.position.set(Math.cos(angle)*0.05, Math.sin(angle)*0.05, 0);
      grup.add(o, buatIkatanKe(c.position, o.position));
    }
  }
  
  // Label hanya muncul sekali per grup molekul, tidak di setiap atom
  const label = buatLabelTeks(jenis);
  label.position.set(0, 0.1, 0);
  grup.add(label);

  grup.userData.jenis = jenis; return grup;
}

export class SistemPartikel {
  constructor(scene) {
    this.scene = scene; this.grup = new THREE.Group(); this.scene.add(this.grup); this.partikel = [];
  }
  bersihkan() { this.grup.clear(); this.partikel = []; }
  isiDariMisi(misiId, dekatTarget) {
    this.bersihkan(); const data = MISI_DATA[misiId]; if (!data) return;
    const set = dekatTarget ? data.partikel.dekatTarget : data.partikel.jauhTarget;
    // Batasi maks 2 per jenis agar tidak penuh & tetap terlihat jelas
    set.forEach(({ jenis, jumlah }) => {
      const batas = Math.min(jumlah, 2);
      for (let i = 0; i < batas; i++) this._tambah(jenis);
    });
  }
  _tambah(jenis) {
    const mol = buatMolekul(jenis); const sudut = Math.random() * Math.PI * 2;
    // Posisi lebih ke tengah dan lebih jauh dari dinding agar jelas
    const r = Math.random() * 0.09;
    const tinggi = -0.18 + Math.random() * 0.32;
    mol.position.set(Math.cos(sudut) * r, tinggi, Math.sin(sudut) * r);
    this.grup.add(mol);
    this.partikel.push({
      mesh: mol,
      kecepatan: new THREE.Vector3((Math.random()-0.5)*0.002, (Math.random()-0.5)*0.002, (Math.random()-0.5)*0.002),
      rotasiKecepatan: (Math.random() - 0.5) * 0.025
    });
  }
  _radiusPadaTinggi(y) {
    if (y < -0.24) return 0.19; 
    if (y > 0.20) return 0.01;
    // Linear interpolation from y=-0.24 (r=0.19) to y=0.20 (r=0.01)
    const t = (y + 0.24) / 0.44; 
    return 0.19 - (t * 0.18);
  }
  perbarui(faktorKecepatan = 1) {
    if (sensorData.shake > 0.0001) {
      faktorKecepatan += (sensorData.shake * 100);
      sensorData.shake *= 0.95;
    }

    this.partikel.forEach((p) => {
      // Apply gravity/tilt
      if (!sensorData.isSpilled) {
        p.kecepatan.x += sensorData.gX;
        p.kecepatan.z += sensorData.gZ;
        p.kecepatan.y += sensorData.gY;
      } else {
        // Spilled! Let them fall out using real gravity towards the mouth
        p.kecepatan.x += sensorData.gX * 2;
        p.kecepatan.y += sensorData.gY * 2;
        p.kecepatan.z += sensorData.gZ * 2;
        
        // Spread out slightly
        p.kecepatan.x *= 1.01;
        p.kecepatan.z *= 1.01;
      }
      
      // Apply drag
      p.kecepatan.multiplyScalar(0.98);

      const pos = p.mesh.position;
      pos.x += p.kecepatan.x * faktorKecepatan;
      pos.y += p.kecepatan.y * faktorKecepatan;
      pos.z += p.kecepatan.z * faktorKecepatan;

      if (!sensorData.isSpilled) {
        const rLimit = this._radiusPadaTinggi(pos.y);
        const rSekarang = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
        if (rSekarang > rLimit) { 
          p.kecepatan.x *= -0.5; p.kecepatan.z *= -0.5;
          if (rSekarang > 0) {
            const scale = rLimit / rSekarang;
            pos.x *= scale; pos.z *= scale;
          }
        }
        if (pos.y < -0.28) { pos.y = -0.28; p.kecepatan.y *= -0.5; }
        if (pos.y > 0.38) { pos.y = 0.38; p.kecepatan.y *= -0.5; }
      }
      
      p.mesh.rotation.y += p.rotasiKecepatan * faktorKecepatan;
      p.mesh.rotation.x += 0.01 * faktorKecepatan;
      
      // Make sprites always face camera
      p.mesh.children.forEach(c => {
        if (c.isSprite) c.quaternion.copy(p.mesh.quaternion).invert();
      });
    });

    // Collision logic for reactions
    for (let i = 0; i < this.partikel.length; i++) {
      for (let j = i + 1; j < this.partikel.length; j++) {
        const pA = this.partikel[i];
        const pB = this.partikel[j];
        const dist = pA.mesh.position.distanceTo(pB.mesh.position);
        if (dist < 0.08) {
          const dir = new THREE.Vector3().subVectors(pA.mesh.position, pB.mesh.position).normalize();
          pA.kecepatan.add(dir.clone().multiplyScalar(0.001));
          pB.kecepatan.sub(dir.clone().multiplyScalar(0.001));
          
          if (Math.random() < 0.05) {
            // Flash effect
            const flashColor = 0xffffff;
            pA.mesh.children.forEach(c => { if(c.isMesh) { c.material.emissive.setHex(flashColor); setTimeout(() => { if(c.material) c.material.emissive.setHex(0); }, 150); }});
            pB.mesh.children.forEach(c => { if(c.isMesh) { c.material.emissive.setHex(flashColor); setTimeout(() => { if(c.material) c.material.emissive.setHex(0); }, 150); }});
            
            // Scale bounce effect
            pA.mesh.scale.set(1.3, 1.3, 1.3); setTimeout(() => { if(pA.mesh) pA.mesh.scale.set(1, 1, 1); }, 150);
            pB.mesh.scale.set(1.3, 1.3, 1.3); setTimeout(() => { if(pB.mesh) pB.mesh.scale.set(1, 1, 1); }, 150);

            // Dynamic Equilibrium Simulation: Identity Swap!
            const pC_index = Math.floor(Math.random() * this.partikel.length);
            const pC = this.partikel[pC_index];
            if (pC !== pA && pC !== pB && pC.mesh.userData.jenis !== pA.mesh.userData.jenis) {
              const meshA = pA.mesh;
              const meshC = pC.mesh;
              // Swap the references
              pA.mesh = meshC;
              pC.mesh = meshA;
              // Swap their 3D positions so they don't teleport visually
              const tempPos = meshA.position.clone();
              meshA.position.copy(meshC.position);
              meshC.position.copy(tempPos);
              
              // Add flash to the swapped distant particle to show it reacted too
              pC.mesh.children.forEach(c => { if(c.isMesh) { c.material.emissive.setHex(flashColor); setTimeout(() => { if(c.material) c.material.emissive.setHex(0); }, 150); }});
              pC.mesh.scale.set(1.3, 1.3, 1.3); setTimeout(() => { if(pC.mesh) pC.mesh.scale.set(1, 1, 1); }, 150);
            }
          }
        }
      }
    }
  }
}

export function buatSceneDasar() {
  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const light = new THREE.DirectionalLight(0xffffff, 0.9); light.position.set(1, 3, 1); scene.add(light);
  
  // Procedural Environment Map for realistic glass reflections
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 512; envCanvas.height = 512;
  const envCtx = envCanvas.getContext('2d');
  const gradient = envCtx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, '#1a202c');
  gradient.addColorStop(1, '#2d3748');
  envCtx.fillStyle = gradient; envCtx.fillRect(0, 0, 512, 512);
  // Add some bright "studio lights" windows
  envCtx.fillStyle = '#ffffff';
  envCtx.shadowColor = '#ffffff';
  envCtx.shadowBlur = 20;
  envCtx.fillRect(100, 100, 100, 200);
  envCtx.fillRect(350, 150, 80, 150);
  const envTex = new THREE.CanvasTexture(envCanvas);
  envTex.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = envTex;
  
  // PointLight dari dalam labu agar menyatu
  const innerLight = new THREE.PointLight(0x00e5ff, 0.5, 1.0);
  innerLight.position.set(0, -0.1, 0);
  scene.add(innerLight);

  // Soft shadow plane di bawah labu
  const shadowGeo = new THREE.PlaneGeometry(0.8, 0.8);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.3,
    depthWrite: false
  });
  // Create a soft radial gradient for the shadow
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128; shadowCanvas.height = 128;
  const shadowCtx = shadowCanvas.getContext('2d');
  const shadowGrad = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
  shadowGrad.addColorStop(0.2, 'rgba(0,0,0,1)');
  shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
  shadowCtx.fillStyle = shadowGrad; shadowCtx.fillRect(0, 0, 128, 128);
  shadowMat.map = new THREE.CanvasTexture(shadowCanvas);
  
  const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -0.31; // Just below the flask base
  scene.add(shadowPlane);

  // Indikator kesetimbangan: ring di bawah labu, warna merah=belum seimbang, hijau=seimbang
  const ringGeo = new THREE.RingGeometry(0.30, 0.34, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2; ring.position.y = -0.33;
  ring.userData.isEquilibriumRing = true;
  scene.add(ring);

  // Cairan pelarut dengan bentuk mengikuti labu
  const fluidPoints = [];
  fluidPoints.push(new THREE.Vector2(0, -0.29)); // Bottom center
  fluidPoints.push(new THREE.Vector2(0.24, -0.29)); // Bottom edge
  fluidPoints.push(new THREE.Vector2(0.24, -0.2)); // Taper start
  fluidPoints.push(new THREE.Vector2(0.16, 0.0)); // Taper end (surface)
  fluidPoints.push(new THREE.Vector2(0, 0.0)); // Surface center
  const fluidGeo = new THREE.LatheGeometry(fluidPoints, 32);
  
  const fluidMat = new THREE.MeshPhongMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.65, shininess: 90, specular: 0xffffff, side: THREE.DoubleSide });
  // Add wave animation shader
  const fluidUniforms = { uTime: { value: 0 } };
  fluidMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = fluidUniforms.uTime;
    shader.vertexShader = `
      uniform float uTime;
      ${shader.vertexShader}
    `.replace(
      `#include <begin_vertex>`,
      `
      #include <begin_vertex>
      // Hanya gerakkan vertex yang ada di permukaan atas (y >= -0.01)
      if (position.y >= -0.01) {
        transformed.y += sin(position.x * 10.0 + uTime * 3.0) * 0.015 + cos(position.z * 10.0 + uTime * 2.5) * 0.015;
      }
      `
    );
  };
  
  const labuGrup = new THREE.Group();
  scene.add(labuGrup);

  const fluid = new THREE.Mesh(fluidGeo, fluidMat);
  fluid.userData.uniforms = fluidUniforms;
  labuGrup.add(fluid);

  const labu = new THREE.Mesh(buatGeometryErlenmeyer(), buatMaterialKaca()); 
  labuGrup.add(labu);

  // Global toggle function for colorblind mode
  const partikelSys = new SistemPartikel(labuGrup);
  window._toggleColorblindMode = (isActive) => {
    // Re-fill the system using the currently active mission state
    if (window._currentMisiId) {
      partikelSys.isiDariMisi(window._currentMisiId, window._isDekatTarget);
    }
  };

  return { scene, labuGrup, labu, fluid, partikel: partikelSys };
}

function buatEfekMuncul(objekGrup, labuMesh) {
  const targetS = labuMesh && labuMesh.userData.targetScale ? labuMesh.userData.targetScale : 1.0;
  objekGrup.scale.set(0, 0, 0);
  
  let rafId;
  const startTime = performance.now();
  function animate() {
    const elapsed = (performance.now() - startTime) / 1000;
    if (elapsed > 1.2) { 
      objekGrup.scale.set(targetS, targetS, targetS);
      objekGrup.rotation.y = 0;
      if (labuMesh && labuMesh.material) labuMesh.material.color.setHex(0xffffff);
      return; 
    }
    
    // Elastic scale
    const s = targetS * (1 - Math.pow(2, -10 * elapsed) * Math.cos(elapsed * 6.28 * 2.5));
    objekGrup.scale.set(s, s, s);
    
    // Rotation spin
    const easeOut = 1 - Math.pow(1 - (elapsed/1.2), 3);
    objekGrup.rotation.y = (1 - easeOut) * Math.PI * 4; // spin 2 times
    
    // Color flash
    if (labuMesh && labuMesh.material) {
      if (elapsed < 0.2) labuMesh.material.color.setHex(0x00e5ff);
      else if (elapsed < 0.25) labuMesh.material.color.setHex(0xffffff);
    }
    
    rafId = requestAnimationFrame(animate);
  }
  animate();
}

export async function mulaiSesiWebXR(canvas, misiId, onLabuDitempatkan, dapatkanSuhuFunc) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.xr.enabled = true; renderer.setPixelRatio(window.devicePixelRatio);
  const { scene, labuGrup, labu, partikel } = buatSceneDasar(); labuGrup.visible = false;
  const camera = new THREE.PerspectiveCamera(); partikel.isiDariMisi(misiId, false);
  let hitTestSource = null; let viewerSpace = null; let sudahDitempatkan = false;

  const reticle = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.08, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x00e5ff }));
  reticle.visible = false; scene.add(reticle);

  const session = await navigator.xr.requestSession('immersive-ar', { 
    requiredFeatures: ['hit-test'],
    optionalFeatures: ['dom-overlay'],
    domOverlay: { root: document.getElementById('webarApp') || document.body }
  });
  await renderer.xr.setSession(session);
  const referenceSpace = await session.requestReferenceSpace('local');
  viewerSpace = await session.requestReferenceSpace('viewer');
  hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

  session.addEventListener('select', () => {
    if (sudahDitempatkan || !reticle.visible) return;
    labuGrup.position.copy(reticle.position); 
    labuGrup.visible = true; 
    sudahDitempatkan = true;
    labuGrup.scale.set(0, 0, 0);
    buatEfekMuncul(labuGrup, labu);
    if (onLabuDitempatkan) onLabuDitempatkan();
  });

  renderer.setAnimationLoop((timestamp, frame) => {
    if (frame && !sudahDitempatkan) {
      const hasil = frame.getHitTestResults(hitTestSource);
      if (hasil.length > 0) {
        const pose = hasil[0].getPose(referenceSpace); reticle.visible = true;
        reticle.position.set(pose.transform.position.x, pose.transform.position.y, pose.transform.position.z);
      } else { reticle.visible = false; }
    }
    
    // Entrance Animation handled by buatEfekMuncul

    // Mengambil faktor kalor suhu termal secara real-time dari input slider
    const speedFactor = dapatkanSuhuFunc ? dapatkanSuhuFunc() : 1;
    partikel.perbarui(speedFactor);

    // Animate fluid and apply spill visibility
    labuGrup.children.forEach(c => {
      if (c.userData && c.userData.uniforms) {
        c.userData.uniforms.uTime.value = performance.now() / 1000;
        if (sensorData.isSpilled) {
          c.visible = false;
        } else {
          c.visible = true;
          c.scale.y = 1.0;
        }
      }
    });

    renderer.render(scene, camera);
  });

  return { session, renderer, scene, labuGrup, labu, partikel, hentikan: () => { renderer.setAnimationLoop(null); session.end(); } };
}

export async function mulaiSesiARjs(canvas, videoEl, misiId, dapatkanSuhuFunc, onLabuDitempatkan) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    videoEl.srcObject = stream; 
    // Do NOT await videoEl.play() because on iOS/Safari it might hang indefinitely if blocked by autoplay policies
    videoEl.play().catch(e => console.warn("video.play() terblokir autoplay:", e));
  } catch (err) {
    console.warn("Kamera tidak tersedia, menjalankan mode 3D fallback saja.", err);
  }
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio); renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.01, 20);
  camera.position.set(0, 0.2, 1.2);
  const { scene, labuGrup, labu, partikel } = buatSceneDasar(); partikel.isiDariMisi(misiId, false);
  labuGrup.visible = false; // Hidden at first for tap-to-place
  let berjalan = true;
  let sudahDitempatkan = false;

  // Fake reticle for aiming in fallback mode
  const reticleGeo = new THREE.RingGeometry(0.06, 0.08, 32);
  const reticleMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, opacity: 0.7, transparent: true });
  const fakeReticle = new THREE.Mesh(reticleGeo, reticleMat);
  fakeReticle.rotation.x = -Math.PI / 2;
  fakeReticle.position.set(0, -0.35, -0.2); // Di permukaan depan kamera
  fakeReticle.visible = false;
  scene.add(fakeReticle);
  
  // Labu ditempatkan di depan kamera pada jarak natural
  const defaultLabuPos = new THREE.Vector3(0, -0.15, -0.3);
  
  setTimeout(() => {
    if (!sudahDitempatkan) fakeReticle.visible = true;
  }, 2500);

  function onFirstTap() {
    if (sudahDitempatkan || !fakeReticle.visible) return;
    sudahDitempatkan = true;
    fakeReticle.visible = false;
    labuGrup.visible = true;
    labuGrup.position.copy(defaultLabuPos); // Tempatkan di depan kamera
    labuGrup.rotation.y = 0;
    labuGrup.scale.set(0, 0, 0);
    buatEfekMuncul(labuGrup, labu);
    if (onLabuDitempatkan) onLabuDitempatkan();
  }
  window.addEventListener('pointerdown', onFirstTap);
  window.addEventListener('touchstart', onFirstTap, { passive: true });
  window.addEventListener('click', onFirstTap);
  document.body.addEventListener('click', onFirstTap); // iOS fallback
  canvas.addEventListener('click', onFirstTap); // iOS fallback

  function loop() {
    if (!berjalan) return;
    
    // Entrance Animation handled by buatEfekMuncul

    const speedFactor = dapatkanSuhuFunc ? dapatkanSuhuFunc() : 1;
    partikel.perbarui(speedFactor);
    
    // Animate fluid and apply spill visibility
    labuGrup.children.forEach(c => {
      if (c.userData && c.userData.uniforms) {
        c.userData.uniforms.uTime.value = performance.now() / 1000;
        if (sensorData.isSpilled) {
          c.visible = false;
        } else {
          c.visible = true;
          c.scale.y = 1.0;
        }
      }
    });

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  loop();

  function urusResize() {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    camera.aspect = canvas.clientWidth / canvas.clientHeight; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', urusResize);

  return {
    renderer, scene, labuGrup, labu, partikel,
    hentikan: () => { berjalan = false; window.removeEventListener('resize', urusResize); window.removeEventListener('pointerdown', onFirstTap); window.removeEventListener('touchstart', onFirstTap); window.removeEventListener('click', onFirstTap); document.body.removeEventListener('click', onFirstTap); canvas.removeEventListener('click', onFirstTap); if (videoEl.srcObject) videoEl.srcObject.getTracks().forEach((t) => t.stop()); }
  };
}

export function perbaruiVisualMisi(sesiAR, misiId, nilaiSekarang, nilaiVolume) {
  const data = MISI_DATA[misiId]; if (!data || !sesiAR) return false;
  const toleransi = Math.abs(data.nilaiTarget) * 0.08 || 0.08;
  const sudahTarget = Math.abs(nilaiSekarang - data.nilaiTarget) <= toleransi;
  
  window._currentMisiId = misiId;
  window._isDekatTarget = sudahTarget;

  if (sesiAR.targetTerakhir !== sudahTarget) {
    sesiAR.partikel.isiDariMisi(misiId, sudahTarget);
    sesiAR.targetTerakhir = sudahTarget;

    // Update equilibrium ring color
    const ring = sesiAR.scene ? sesiAR.scene.children.find(c => c.userData && c.userData.isEquilibriumRing) : null;
    if (ring) {
      ring.material.color.setHex(sudahTarget ? 0x22c55e : 0xef4444);
      ring.material.opacity = sudahTarget ? 1.0 : 0.85;
      // Pulse animation when equilibrium achieved
      if (sudahTarget) {
        const startPulse = performance.now();
        const pulseLoop = () => {
          const elapsed = (performance.now() - startPulse) / 1000;
          if (elapsed > 2.0) { ring.scale.set(1, 1, 1); return; }
          const pulse = 1.0 + Math.sin(elapsed * Math.PI * 4) * 0.15;
          ring.scale.set(pulse, 1, pulse);
          requestAnimationFrame(pulseLoop);
        };
        pulseLoop();
      }
    }
  }

  // Hitung warna cairan berdasarkan komposisi partikel
  let r = 0, g = 0, b = 0, count = 0;
  sesiAR.partikel.partikel.forEach(p => {
    const jenis = p.mesh.userData.jenis;
    let col = new THREE.Color(0x94a3b8);
    if (jenis === 'I2') col.setHex(0xa78bfa);
    else if (jenis === 'NO2') col.setHex(0xf59e0b);
    else if (jenis === 'NH3' || jenis === 'HCO3') col.setHex(0x3b82f6);
    else if (jenis === 'HI') col.setHex(0xfde68a);
    r += col.r; g += col.g; b += col.b; count++;
  });
  
  if (count > 0) {
    const fluid = sesiAR.labuGrup ? sesiAR.labuGrup.children.find(c => c.userData && c.userData.uniforms) : null;
    if (fluid) {
      fluid.material.color.setRGB(r/count, g/count, b/count);
      if (sudahTarget) {
        fluid.material.emissive.setRGB((r/count)*0.5, (g/count)*0.5, (b/count)*0.5);
        fluid.material.emissiveIntensity = 1.0;
      } else {
        fluid.material.emissive.setHex(0x000000);
        fluid.material.emissiveIntensity = 0;
      }
    }
  }

  // Dynamic Volume Scaling — baseScale 2.5 agar labu cukup besar & molekul terlihat
  const targetVolume = (nilaiVolume !== undefined) ? nilaiVolume : (data.parameterKunci === 'volume' ? nilaiSekarang : 3.0);
  const baseScale = 2.5;
  const scale = Math.max(0.5, targetVolume / 3.0) * baseScale;
  if (sesiAR.labu) sesiAR.labu.userData.targetScale = scale;
  
  if (sesiAR.labu && sesiAR.labu.userData.spawnTime && (performance.now() - sesiAR.labu.userData.spawnTime) > 800) {
    if (sesiAR.labuGrup) sesiAR.labuGrup.scale.set(scale, scale, scale);
  }

  return sudahTarget;
}