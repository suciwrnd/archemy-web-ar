import * as THREE from 'three';

const DEFAULT_WARN_WARNA = 0xffa500; // Reaktan
const DEFAULT_SUKSES_WARNA = 0x3b82f6; // Produk

export const sensorData = {
  gX: 0,
  gY: -0.001,
  gZ: 0,
  shake: 0,
  isSpilled: false,
  spillCallback: null
};

window.addEventListener('deviceorientation', (e) => {
  if (sensorData.isSpilled) return;
  const beta = e.beta || 0;
  const gamma = e.gamma || 0;
  // Map gravity realistically assuming default reading posture is ~60 degrees
  sensorData.gX = gamma * 0.00008;
  sensorData.gZ = (beta - 60) * 0.00008;
  
  // Spill if tilted upside down (beta > 135 or beta < -45, or gamma rolled too much)
  if (beta > 135 || beta < -45 || Math.abs(gamma) > 110) {
    sensorData.isSpilled = true;
    if (sensorData.spillCallback) sensorData.spillCallback();
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

const ATOM_WARNA = { H: 0xffffff, I: 0xa78bfa, N: 0x3b82f6, O: 0xef4444, C: 0xeab308 };
const ATOM_RADIUS = { H: 0.024, I: 0.042, N: 0.034, O: 0.028, C: 0.038 };

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
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.02,
    transmission: 1.0, // glass-like full transparency
    ior: 1.5, // index of refraction for glass
    thickness: 0.2, // volume refraction
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    transparent: true,
    opacity: 1.0,
    side: THREE.DoubleSide,
    depthWrite: false
  });
}

function buatAtom(simbol, jenisMol) {
  const isColorblind = document.body.classList.contains('colorblind-mode');
  
  // Produk biasanya sisi kanan reaksi (NH3, HI, N2O4, HCO3)
  const isProduk = ['NH3', 'HI', 'N2O4', 'HCO3'].includes(jenisMol);
  
  let geo;
  if (isColorblind && isProduk) {
    geo = new THREE.BoxGeometry(ATOM_RADIUS[simbol]*2, ATOM_RADIUS[simbol]*2, ATOM_RADIUS[simbol]*2);
  } else {
    geo = new THREE.SphereGeometry(ATOM_RADIUS[simbol] || 0.03, 16, 16);
  }

  // Warna khusus untuk colorblind (Biru vs Oranye)
  let baseColor = ATOM_WARNA[simbol] || 0x888888;
  if (isColorblind) {
    baseColor = isProduk ? 0x3b82f6 : 0xf59e0b; // Produk Biru, Reaktan Oranye
  }

  const mat = new THREE.MeshPhysicalMaterial({ 
    color: baseColor, 
    roughness: 0.1, 
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
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
  canvas.width = 128; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0)'; ctx.fillRect(0,0,128,64);
  ctx.fillStyle = 'white';
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = 'black'; ctx.shadowBlur = 4;
  ctx.fillText(text, 64, 32);
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(0.12, 0.06, 1);
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
  
  const label = buatLabelTeks(jenis);
  label.position.set(0, 0.08, 0);
  grup.add(label);

  // Add aura based on reactant/product and specific chemical properties
  const isProduk = ['HI', 'N2O4', 'NH3', 'HCO3'].includes(jenis);
  let auraColor = isProduk ? 0x3b82f6 : 0xe11d48; // Default: Blue for product, Red for reactant
  if (jenis === 'I2') auraColor = 0xa78bfa; // Purple
  if (jenis === 'NO2') auraColor = 0xf59e0b; // Orange/Brown
  if (['HI', 'H2', 'N2O4'].includes(jenis)) auraColor = 0x94a3b8; // Colorless/White-ish
  
  // Custom aura sprite (soft glow)
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.2, `rgba(${(auraColor>>16)&255}, ${(auraColor>>8)&255}, ${auraColor&255}, 0.8)`);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const auraTex = new THREE.CanvasTexture(canvas);
  const auraMat = new THREE.SpriteMaterial({ map: auraTex, color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const auraSprite = new THREE.Sprite(auraMat);
  auraSprite.scale.set(0.18, 0.18, 0.18);
  grup.add(auraSprite);

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
    set.forEach(({ jenis, jumlah }) => {
      for (let i = 0; i < jumlah; i++) this._tambah(jenis);
    });
  }
  _tambah(jenis) {
    const mol = buatMolekul(jenis); const sudut = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.12; const tinggi = -0.2 + Math.random() * 0.4;
    mol.position.set(Math.cos(sudut) * r, tinggi, Math.sin(sudut) * r);
    this.grup.add(mol);
    this.partikel.push({
      mesh: mol,
      kecepatan: new THREE.Vector3((Math.random()-0.5)*0.003, (Math.random()-0.5)*0.003, (Math.random()-0.5)*0.003),
      rotasiKecepatan: (Math.random() - 0.5) * 0.03
    });
  }
  _radiusPadaTinggi(y) {
    if (y < -0.24) return 0.17; 
    if (y > 0.20) return 0.035;
    const t = (y + 0.24) / 0.44; 
    return 0.17 - (t * 0.135);
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
        // Spilled! Gravity heavily downwards and outwards
        p.kecepatan.y -= 0.005;
        p.kecepatan.x *= 1.02;
        p.kecepatan.z *= 1.02;
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
            pA.mesh.children.forEach(c => { if(c.isMesh) { c.material.emissive.setHex(flashColor); setTimeout(() => c.material.emissive.setHex(0), 150); }});
            pB.mesh.children.forEach(c => { if(c.isMesh) { c.material.emissive.setHex(flashColor); setTimeout(() => c.material.emissive.setHex(0), 150); }});
            
            // Scale bounce effect
            pA.mesh.scale.set(1.3, 1.3, 1.3); setTimeout(() => pA.mesh.scale.set(1, 1, 1), 150);
            pB.mesh.scale.set(1.3, 1.3, 1.3); setTimeout(() => pB.mesh.scale.set(1, 1, 1), 150);

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
              pC.mesh.children.forEach(c => { if(c.isMesh) { c.material.emissive.setHex(flashColor); setTimeout(() => c.material.emissive.setHex(0), 150); }});
              pC.mesh.scale.set(1.3, 1.3, 1.3); setTimeout(() => pC.mesh.scale.set(1, 1, 1), 150);
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

  // Pendaran Grid Ring Neon Sian di Dasar Tabung
  const ringGeo = new THREE.RingGeometry(0.24, 0.26, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
  const ring = new THREE.Mesh(ringGeo, ringMat); ring.rotation.x = Math.PI / 2; ring.position.y = -0.32; scene.add(ring);

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
  
  const fluid = new THREE.Mesh(fluidGeo, fluidMat);
  fluid.userData.uniforms = fluidUniforms;
  scene.add(fluid);

  const labu = new THREE.Mesh(buatGeometryErlenmeyer(), buatMaterialKaca()); scene.add(labu);

  // Global toggle function for colorblind mode
  const partikelSys = new SistemPartikel(scene);
  window._toggleColorblindMode = (isActive) => {
    // Re-fill the system using the currently active mission state
    if (window._currentMisiId) {
      partikelSys.isiDariMisi(window._currentMisiId, window._isDekatTarget);
    }
  };

  return { scene, labu, partikel: partikelSys };
}

function buatEfekMuncul(scene, posisi) {
  const geo = new THREE.BufferGeometry();
  const count = 40;
  const positions = new Float32Array(count * 3);
  const velocities = [];
  for(let i=0; i<count; i++) {
    positions[i*3] = posisi.x;
    positions[i*3+1] = posisi.y + 0.1;
    positions[i*3+2] = posisi.z;
    velocities.push(new THREE.Vector3((Math.random()-0.5)*0.03, Math.random()*0.05, (Math.random()-0.5)*0.03));
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const canvas = document.createElement('canvas'); canvas.width = 32; canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(16,16,0,16,16,16);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.2, 'rgba(0,229,255,0.8)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad; ctx.fillRect(0,0,32,32);
  
  const mat = new THREE.PointsMaterial({ size: 0.06, map: new THREE.CanvasTexture(canvas), transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false });
  const points = new THREE.Points(geo, mat);
  scene.add(points);
  
  const startTime = performance.now();
  function animate() {
    const elapsed = (performance.now() - startTime) / 1000;
    if (elapsed > 1.5) { scene.remove(points); return; }
    
    const posAttr = geo.attributes.position;
    for(let i=0; i<count; i++) {
      posAttr.array[i*3] += velocities[i].x;
      posAttr.array[i*3+1] += velocities[i].y;
      posAttr.array[i*3+2] += velocities[i].z;
      velocities[i].y -= 0.001; // subtle gravity
    }
    posAttr.needsUpdate = true;
    mat.opacity = 1.0 - (elapsed / 1.5);
    requestAnimationFrame(animate);
  }
  animate();
}

export async function mulaiSesiWebXR(canvas, misiId, onLabuDitempatkan, dapatkanSuhuFunc) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.xr.enabled = true; renderer.setPixelRatio(window.devicePixelRatio);
  const { scene, labu, partikel } = buatSceneDasar(); labu.visible = false;
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
    labu.position.copy(reticle.position); 
    labu.visible = true; 
    sudahDitempatkan = true;
    labu.scale.set(0, 0, 0); // Reset for entrance animation
    labu.userData.spawnTime = performance.now();
    buatEfekMuncul(scene, labu.position);
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
    
    // Entrance Animation (Elastic scale)
    if (sudahDitempatkan && labu.userData.spawnTime) {
      const elapsed = (performance.now() - labu.userData.spawnTime) / 1000;
      if (elapsed < 1.0) {
        // Simple elastic formula
        const targetS = labu.userData.targetScale || 1.0;
        const s = targetS * (1 - Math.pow(2, -10 * elapsed) * Math.cos(elapsed * 6.28 * 3));
        labu.scale.set(s, s, s);
        partikel.grup.scale.set(s, s, s);
        if (elapsed < 0.2) labu.material.color.setHex(0x00e5ff); // flash cyan
        else if (elapsed < 0.25) labu.material.color.setHex(0xffffff);
      } else {
        labu.userData.spawnTime = null;
      }
    }

    // Mengambil faktor kalor suhu termal secara real-time dari input slider
    const speedFactor = dapatkanSuhuFunc ? dapatkanSuhuFunc() : 1;
    partikel.perbarui(speedFactor);

    // Animate fluid
    scene.children.forEach(c => {
      if (c.userData && c.userData.uniforms) {
        c.userData.uniforms.uTime.value = performance.now() / 1000;
      }
    });

    renderer.render(scene, camera);
  });

  return { session, renderer, scene, labu, partikel, hentikan: () => { renderer.setAnimationLoop(null); session.end(); } };
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

  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.01, 20);
  camera.position.set(0, 0, 0.9);
  const { scene, labu, partikel } = buatSceneDasar(); partikel.isiDariMisi(misiId, false);
  labu.visible = false; // Hidden at first for tap-to-place
  let berjalan = true;
  let sudahDitempatkan = false;

  // Fake reticle for aiming in fallback mode
  const reticleGeo = new THREE.RingGeometry(0.06, 0.08, 32);
  const reticleMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, opacity: 0.7, transparent: true });
  const fakeReticle = new THREE.Mesh(reticleGeo, reticleMat);
  fakeReticle.rotation.x = -Math.PI / 2;
  fakeReticle.position.set(0, -0.05, 0); // Positioned slightly higher to not be occluded by bottom slider
  fakeReticle.visible = false; // Hide until scan simulation finishes
  scene.add(fakeReticle);
  
  setTimeout(() => {
    if (!sudahDitempatkan) fakeReticle.visible = true;
  }, 2500);

  function onFirstTap() {
    if (sudahDitempatkan || !fakeReticle.visible) return;
    sudahDitempatkan = true;
    fakeReticle.visible = false; // Hide reticle after placing
    labu.visible = true;
    labu.position.copy(fakeReticle.position); // Spawn exactly at reticle
    labu.scale.set(0, 0, 0);
    labu.userData.spawnTime = performance.now();
    buatEfekMuncul(scene, labu.position);
    if (onLabuDitempatkan) onLabuDitempatkan();
  }
  window.addEventListener('pointerdown', onFirstTap);
  window.addEventListener('touchstart', onFirstTap, { passive: true });
  window.addEventListener('click', onFirstTap);
  document.body.addEventListener('click', onFirstTap); // iOS fallback
  canvas.addEventListener('click', onFirstTap); // iOS fallback

  function loop() {
    if (!berjalan) return;
    
    if (sudahDitempatkan && labu.userData.spawnTime) {
      const elapsed = (performance.now() - labu.userData.spawnTime) / 1000;
      if (elapsed < 1.0) {
        const targetS = labu.userData.targetScale || 1.0;
        const s = targetS * (1 - Math.pow(2, -10 * elapsed) * Math.cos(elapsed * 6.28 * 3));
        labu.scale.set(s, s, s);
        partikel.grup.scale.set(s, s, s);
        if (elapsed < 0.2) labu.material.color.setHex(0x00e5ff);
        else if (elapsed < 0.25) labu.material.color.setHex(0xffffff);
      } else {
        labu.userData.spawnTime = null;
      }
    }

    const speedFactor = dapatkanSuhuFunc ? dapatkanSuhuFunc() : 1;
    partikel.perbarui(speedFactor);
    
    // Animate fluid
    scene.children.forEach(c => {
      if (c.userData && c.userData.uniforms) {
        c.userData.uniforms.uTime.value = performance.now() / 1000;
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
    renderer, scene, labu, partikel,
    hentikan: () => { berjalan = false; window.removeEventListener('resize', urusResize); window.removeEventListener('pointerdown', onFirstTap); if (videoEl.srcObject) videoEl.srcObject.getTracks().forEach((t) => t.stop()); }
  };
}

export function perbaruiVisualMisi(sesiAR, misiId, nilaiSekarang) {
  const data = MISI_DATA[misiId]; if (!data || !sesiAR) return false;
  const sudahTarget = Math.abs(nilaiSekarang - data.nilaiTarget) < (data.rentang[2] / 2);
  
  // Track for colorblind toggle rebuild
  window._currentMisiId = misiId;
  window._isDekatTarget = sudahTarget;

  if (sesiAR.targetTerakhir !== sudahTarget) {
    sesiAR.partikel.isiDariMisi(misiId, sudahTarget);
    sesiAR.targetTerakhir = sudahTarget;
  }

  // Calculate average color from particles for fluid blending
  let r = 0, g = 0, b = 0, count = 0;
  sesiAR.partikel.partikel.forEach(p => {
    const jenis = p.mesh.userData.jenis;
    let col = new THREE.Color(0x94a3b8); // Default colorless/grey
    if (jenis === 'I2') col.setHex(0xa78bfa); // Purple
    else if (jenis === 'NO2') col.setHex(0xf59e0b); // Orange
    else if (jenis === 'NH3' || jenis === 'HCO3') col.setHex(0x3b82f6); // Blue
    
    r += col.r; g += col.g; b += col.b; count++;
  });
  
  if (count > 0) {
    const fluid = sesiAR.scene.children.find(c => c.userData && c.userData.uniforms);
    if (fluid) {
      fluid.material.color.setRGB(r/count, g/count, b/count);
      // Celebration glow when target reached
      if (sudahTarget) {
        fluid.material.emissive.setRGB((r/count)*0.4, (g/count)*0.4, (b/count)*0.4);
      } else {
        fluid.material.emissive.setHex(0x000000);
      }
    }
  }

  if (data.parameterKunci === 'volume') {
    const scale = Math.max(0.3, nilaiSekarang / 2.0);
    sesiAR.labu.userData.targetScale = scale; // Saved for spawn animation
    if (!sesiAR.labu.userData.spawnTime) {
      sesiAR.labu.scale.set(scale, scale, scale);
      sesiAR.partikel.grup.scale.set(scale, scale, scale);
    }
  }

  return sudahTarget;
}