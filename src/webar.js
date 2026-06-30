import * as THREE from 'three';

export const MISI_DATA = {
  misi1: {
    judul: 'Misi 1: Gas Iodin Reversibel',
    persamaan: 'H₂(g) + I₂(g) ⇌ 2HI(g)',
    ceritaAwal: 'Halo! Reaksi ini bersifat eksotermik. Sistem saat ini kekurangan produk HI. Temukan Suhu yang tepat agar kesetimbangan bergeser ke kanan!',
    ceritaSukses: 'Luar biasa! Pada suhu 50°C, reaksi mencapai kesetimbangan optimal menghasilkan banyak HI.',
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
    ceritaAwal: 'Gas NO₂ yang beracun mencemari udara. Reaksi ini mengubah gas tersebut menjadi N₂O₄. Atur Volume tabung untuk memanipulasi tekanan ruang!',
    ceritaSukses: 'Kerja bagus! Volume kecil (2.0L) memperbesar tekanan sehingga gas bergeser ke jumlah mol terkecil (N₂O₄).',
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
    ceritaAwal: 'Pabrik ini butuh pupuk amonia (NH₃). Tambahkan Konsentrasi reaktan untuk mendorong produksi ke arah kanan!',
    ceritaSukses: 'Sempurna! Penambahan konsentrasi reaktan secara konsisten menggeser kesetimbangan ke arah produk.',
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
    ceritaAwal: 'Darah pasien terlalu asam! Tekanan gas CO₂ dalam paru-paru harus diatur untuk menjaga pH (Tekanan 3.0 atm).',
    ceritaSukses: 'Penyelamatan berhasil! Tekanan gas CO₂ yang tepat menjaga konsentrasi ion H⁺ tetap stabil.',
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
    new THREE.Vector2(0.0, -0.32), new THREE.Vector2(0.26, -0.32),
    new THREE.Vector2(0.26, -0.24), new THREE.Vector2(0.22, -0.05),
    new THREE.Vector2(0.16, 0.12), new THREE.Vector2(0.08, 0.24),
    new THREE.Vector2(0.07, 0.42), new THREE.Vector2(0.08, 0.44),
    new THREE.Vector2(0.07, 0.44)
  ];
  const geometry = new THREE.LatheGeometry(profil, 48);
  geometry.computeVertexNormals();
  return geometry;
}

export function buatMaterialKaca() {
  return new THREE.MeshPhysicalMaterial({
    color: 0xffffff, transparent: true, opacity: 0.25,
    roughness: 0.02, metalness: 0.1, transmission: 0.9,
    thickness: 0.2, clearcoat: 1.0, side: THREE.DoubleSide
  });
}

function buatAtom(simbol) {
  const geo = new THREE.SphereGeometry(ATOM_RADIUS[simbol] || 0.03, 16, 16);
  const mat = new THREE.MeshStandardMaterial({ color: ATOM_WARNA[simbol] || 0x888888, roughness: 0.15, metalness: 0.2 });
  return new THREE.Mesh(geo, mat);
}

function buatIkatan(panjang, radius = 0.012) {
  const geo = new THREE.CylinderGeometry(radius, radius, panjang, 8);
  const mat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.1 });
  return new THREE.Mesh(geo, mat);
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

export function buatMolekul(jenis) {
  const resep = RESEP_MOLEKUL[jenis]; if (!resep) return new THREE.Group();
  const grup = new THREE.Group();

  if (resep.atoms.length === 2) {
    const atomA = buatAtom(resep.atoms[0]); const atomB = buatAtom(resep.atoms[1]);
    atomA.position.x = -resep.jarak/2; atomB.position.x = resep.jarak/2;
    const ikatan = buatIkatan(resep.jarak); ikatan.rotation.z = Math.PI/2;
    grup.add(atomA, atomB, ikatan);
  } else if (resep.sudut) {
    const n = buatAtom('N'); const o1 = buatAtom('O'); const o2 = buatAtom('O');
    o1.position.set(-0.05, 0.03, 0); o2.position.set(0.05, 0.03, 0);
    const ik1 = buatIkatan(0.06); ik1.position.set(-0.025, 0.015, 0); ik1.rotation.z = Math.PI/3;
    const ik2 = buatIkatan(0.06); ik2.position.set(0.025, 0.015, 0); ik2.rotation.z = -Math.PI/3;
    grup.add(n, o1, o2, ik1, ik2);
  } else if (resep.dimer) {
    const k1 = buatMolekul('NO2'); const k2 = buatMolekul('NO2');
    k1.position.x = -0.05; k2.position.x = 0.05; k2.rotation.y = Math.PI;
    const ik = buatIkatan(0.05); ik.rotation.z = Math.PI/2;
    grup.add(k1, k2, ik);
  } else if (resep.piramida) {
    const n = buatAtom('N'); grup.add(n);
    for(let i=0; i<3; i++) {
      const h = buatAtom('H'); const angle = (i * Math.PI * 2) / 3;
      h.position.set(Math.cos(angle)*0.05, -0.03, Math.sin(angle)*0.05);
      const ik = buatIkatan(0.06); ik.position.set(Math.cos(angle)*0.025, -0.015, Math.sin(angle)*0.025);
      ik.rotation.x = angle; ik.rotation.z = Math.PI/4;
      grup.add(h, ik);
    }
  } else if (resep.kompleks) {
    const c = buatAtom('C'); grup.add(c);
    for(let i=0; i<resep.atoms.length-1; i++) {
      const o = buatAtom('O'); const angle = (i * Math.PI * 2) / 3;
      o.position.set(Math.cos(angle)*0.06, Math.sin(angle)*0.06, 0);
      const ik = buatIkatan(0.06); ik.position.set(Math.cos(angle)*0.03, Math.sin(angle)*0.03, 0);
      ik.rotation.z = angle + Math.PI/2;
      grup.add(o, ik);
    }
  }
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
    if (y < -0.24) return 0.20; 
    if (y > 0.20) return 0.04;
    const t = (y + 0.24) / 0.44; 
    return 0.20 - (t * 0.15);
  }
  perbarui(faktorKecepatan = 1) {
    this.partikel.forEach((p) => {
      const pos = p.mesh.position;
      pos.x += p.kecepatan.x * faktorKecepatan;
      pos.y += p.kecepatan.y * faktorKecepatan;
      pos.z += p.kecepatan.z * faktorKecepatan;
      const rLimit = this._radiusPadaTinggi(pos.y);
      const rSekarang = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
      if (rSekarang > rLimit) { p.kecepatan.x *= -1; p.kecepatan.z *= -1; }
      if (pos.y > 0.38 || pos.y < -0.28) p.kecepatan.y *= -1;
      p.mesh.rotation.y += p.rotasiKecepatan * faktorKecepatan;
      p.mesh.rotation.x += 0.01 * faktorKecepatan;
    });
  }
}

export function buatSceneDasar() {
  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const light = new THREE.DirectionalLight(0xffffff, 0.9); light.position.set(1, 3, 1); scene.add(light);
  
  // Pendaran Grid Ring Neon Sian di Dasar Tabung
  const ringGeo = new THREE.RingGeometry(0.24, 0.26, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
  const ring = new THREE.Mesh(ringGeo, ringMat); ring.rotation.x = Math.PI / 2; ring.position.y = -0.32; scene.add(ring);

  const labu = new THREE.Mesh(buatGeometryErlenmeyer(), buatMaterialKaca()); scene.add(labu);
  return { scene, labu, partikel: new SistemPartikel(scene) };
}

export async function mulaiSesiWebXR(canvas, misiId, onLabuDitempatkan, dapatkanSuhuFunc) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.xr.enabled = true; renderer.setPixelRatio(window.devicePixelRatio);
  const { scene, labu, partikel } = buatSceneDasar(); labu.visible = false;
  const camera = new THREE.PerspectiveCamera(); partikel.isiDariMisi(misiId, false);
  let hitTestSource = null; let viewerSpace = null; let sudahDitempatkan = false;

  const reticle = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.08, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x00e5ff }));
  reticle.visible = false; scene.add(reticle);

  const session = await navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['hit-test'] });
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
    renderer.render(scene, camera);
  });

  return { session, renderer, scene, labu, partikel, hentikan: () => { renderer.setAnimationLoop(null); session.end(); } };
}

export async function mulaiSesiARjs(canvas, videoEl, misiId, dapatkanSuhuFunc) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    videoEl.srcObject = stream; await videoEl.play();
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
  fakeReticle.position.set(0, -0.3, 0); // Positioned slightly down to simulate floor
  scene.add(fakeReticle);

  window.addEventListener('pointerdown', function onFirstTap() {
    if (sudahDitempatkan) return;
    sudahDitempatkan = true;
    fakeReticle.visible = false; // Hide reticle after placing
    labu.visible = true;
    labu.position.copy(fakeReticle.position); // Spawn exactly at reticle
    labu.scale.set(0, 0, 0);
    labu.userData.spawnTime = performance.now();
    // Simulate placing event
    const tapHint = document.getElementById('webarTapHint');
    if (tapHint) tapHint.style.display = 'none';
  });

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
    hentikan: () => { berjalan = false; window.removeEventListener('resize', urusResize); if (videoEl.srcObject) videoEl.srcObject.getTracks().forEach((t) => t.stop()); }
  };
}

export function perbaruiVisualMisi(sesiAR, misiId, nilaiSekarang) {
  const data = MISI_DATA[misiId]; if (!data || !sesiAR) return false;
  const sudahTarget = Math.abs(nilaiSekarang - data.nilaiTarget) < (data.rentang[2] / 2);
  
  if (sesiAR.targetTerakhir !== sudahTarget) {
    sesiAR.partikel.isiDariMisi(misiId, sudahTarget);
    sesiAR.labu.material.color.setHex(sudahTarget ? 0xd1fae5 : 0xffffff);
    sesiAR.labu.material.opacity = sudahTarget ? 0.35 : 0.22;
    sesiAR.targetTerakhir = sudahTarget;
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