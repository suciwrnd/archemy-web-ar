/* ==========================================================================
   ARCHEMY WEBAR MODULE — HYBRID (WebXR plane detection + AR.js fallback)
   Dipisah dari main.js supaya tidak menumpuk jadi satu file raksasa.
   ========================================================================== */

import * as THREE from 'three';

/* --------------------------------------------------------------------------
   1. DATA MISI
   Setiap misi cukup ganti partikel & parameter di sini, wadah 3D tetap satu
   model labu Erlenmeyer yang sama untuk semua misi.
   -------------------------------------------------------------------------- */
export const MISI_DATA = {
  misi1: {
    judul: 'Misi 1: Gas Iodin Reversibel',
    persamaan: 'H₂(g) + I₂(g) ⇌ 2HI(g)',
    parameterKunci: 'suhu',
    nilaiTarget: 50,
    satuan: '°C',
    rentang: [20, 100, 1],
    partikel: {
      jauhTarget: [
        { jenis: 'H2', jumlah: 3 },
        { jenis: 'I2', jumlah: 3 },
        { jenis: 'HI', jumlah: 1 }
      ],
      dekatTarget: [
        { jenis: 'H2', jumlah: 1 },
        { jenis: 'I2', jumlah: 1 },
        { jenis: 'HI', jumlah: 4 }
      ]
    }
  },
  misi2: {
    judul: 'Misi 2: Operasi Smog Kota',
    persamaan: '2NO₂(g) ⇌ N₂O₄(g)',
    parameterKunci: 'volume',
    nilaiTarget: 2.0,
    satuan: 'L',
    rentang: [1, 5, 0.1],
    partikel: {
      jauhTarget: [
        { jenis: 'NO2', jumlah: 5 },
        { jenis: 'N2O4', jumlah: 1 }
      ],
      dekatTarget: [
        { jenis: 'NO2', jumlah: 1 },
        { jenis: 'N2O4', jumlah: 4 }
      ]
    }
  }
};

/* --------------------------------------------------------------------------
   2. ATOM & WARNA (satu sumber kebenaran dipakai semua jenis molekul)
   -------------------------------------------------------------------------- */
const ATOM_WARNA = {
  H: 0xffffff,
  I: 0xa78bfa,
  N: 0x3c3489,
  O: 0xd85a30
};

const ATOM_RADIUS = {
  H: 0.026,
  I: 0.044,
  N: 0.038,
  O: 0.034
};

/* --------------------------------------------------------------------------
   3. DETEKSI KAPABILITAS DEVICE
   Menentukan mode mana yang dipakai: webxr | arjs | unsupported
   -------------------------------------------------------------------------- */
export async function deteksiModeAR() {
  if (navigator.xr) {
    try {
      const didukung = await navigator.xr.isSessionSupported('immersive-ar');
      if (didukung) return 'webxr';
    } catch (_) {
      /* device punya navigator.xr tapi sesi AR tidak tersedia, lanjut fallback */
    }
  }

  const adaKamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  if (adaKamera) return 'arjs';

  return 'unsupported';
}

/* --------------------------------------------------------------------------
   4. GEOMETRY LABU ERLENMEYER PRESISI (LatheGeometry)
   Profil 2D di-revolve 360° jadi bentuk solid yang halus, bukan gabungan
   cone+cylinder kasar seperti versi lama.
   -------------------------------------------------------------------------- */
export function buatGeometryErlenmeyer() {
  // titik profil setengah penampang labu, dari dasar ke leher (satuan meter)
  const profil = [
    new THREE.Vector2(0.0, -0.32),
    new THREE.Vector2(0.30, -0.32),
    new THREE.Vector2(0.30, -0.26),
    new THREE.Vector2(0.27, -0.10),
    new THREE.Vector2(0.20, 0.08),
    new THREE.Vector2(0.11, 0.22),
    new THREE.Vector2(0.085, 0.28),
    new THREE.Vector2(0.085, 0.42),
    new THREE.Vector2(0.10, 0.44),
    new THREE.Vector2(0.10, 0.46),
    new THREE.Vector2(0.085, 0.46)
  ];

  const geometry = new THREE.LatheGeometry(profil, 64);
  geometry.computeVertexNormals();
  return geometry;
}

export function buatMaterialKaca() {
  return new THREE.MeshPhysicalMaterial({
    color: 0xe8f0ff,
    transparent: true,
    opacity: 0.22,
    roughness: 0.05,
    metalness: 0,
    transmission: 0.85,
    thickness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    side: THREE.DoubleSide
  });
}

/* --------------------------------------------------------------------------
   5. PEMBUAT MOLEKUL (atom + ikatan, dipakai semua misi)
   -------------------------------------------------------------------------- */
function buatAtom(simbol) {
  const geo = new THREE.SphereGeometry(ATOM_RADIUS[simbol] || 0.03, 20, 20);
  const mat = new THREE.MeshStandardMaterial({
    color: ATOM_WARNA[simbol] || 0x888888,
    roughness: 0.25,
    metalness: 0.1
  });
  return new THREE.Mesh(geo, mat);
}

function buatIkatan(panjang, radius = 0.014) {
  const geo = new THREE.CylinderGeometry(radius, radius, panjang, 12);
  const mat = new THREE.MeshStandardMaterial({ color: 0x5f5e5a, roughness: 0.5, metalness: 0.2 });
  return new THREE.Mesh(geo, mat);
}

const RESEP_MOLEKUL = {
  H2: { atoms: ['H', 'H'], jarak: 0.07 },
  I2: { atoms: ['I', 'I'], jarak: 0.09 },
  HI: { atoms: ['H', 'I'], jarak: 0.07 },
  NO2: { atoms: ['N', 'O', 'O'], sudut: true },
  N2O4: { atoms: ['N', 'N', 'O', 'O', 'O', 'O'], dimer: true }
};

export function buatMolekul(jenis) {
  const resep = RESEP_MOLEKUL[jenis];
  if (!resep) return new THREE.Group();

  const grup = new THREE.Group();

  if (resep.atoms.length === 2) {
    const [a, b] = resep.atoms;
    const atomA = buatAtom(a);
    const atomB = buatAtom(b);
    const setengah = resep.jarak / 2;
    atomA.position.x = -setengah;
    atomB.position.x = setengah;
    const ikatan = buatIkatan(resep.jarak);
    ikatan.rotation.z = Math.PI / 2;
    grup.add(atomA, atomB, ikatan);
  } else if (resep.sudut) {
    // NO2 bentuk bengkok ~134 derajat
    const n = buatAtom('N');
    const o1 = buatAtom('O');
    const o2 = buatAtom('O');
    o1.position.set(-0.06, 0.04, 0);
    o2.position.set(0.06, 0.04, 0);
    grup.add(n, o1, o2, buatIkatan(0.07), buatIkatan(0.07));
    grup.children[3].position.set(-0.03, 0.02, 0);
    grup.children[3].rotation.z = Math.PI / 2.6;
    grup.children[4].position.set(0.03, 0.02, 0);
    grup.children[4].rotation.z = -Math.PI / 2.6;
  } else if (resep.dimer) {
    // N2O4 = dua unit NO2 bergandengan di tengah (ikatan N-N)
    const kiri = buatMolekul('NO2');
    const kanan = buatMolekul('NO2');
    kiri.position.x = -0.06;
    kanan.position.x = 0.06;
    kanan.rotation.y = Math.PI;
    const ikatanTengah = buatIkatan(0.05);
    ikatanTengah.rotation.z = Math.PI / 2;
    grup.add(kiri, kanan, ikatanTengah);
  }

  grup.userData.jenis = jenis;
  return grup;
}

/* --------------------------------------------------------------------------
   6. SISTEM PARTIKEL DI DALAM LABU
   Posisi dibatasi mengikuti radius profil labu per ketinggian, supaya
   partikel tidak menembus dinding kaca.
   -------------------------------------------------------------------------- */
export class SistemPartikel {
  constructor(scene) {
    this.scene = scene;
    this.grup = new THREE.Group();
    this.scene.add(this.grup);
    this.partikel = [];
  }

  bersihkan() {
    this.grup.clear();
    this.partikel = [];
  }

  isiDariMisi(misiId, dekatTarget) {
    this.bersihkan();
    const data = MISI_DATA[misiId];
    if (!data) return;

    const set = dekatTarget ? data.partikel.dekatTarget : data.partikel.jauhTarget;
    set.forEach(({ jenis, jumlah }) => {
      for (let i = 0; i < jumlah; i++) {
        this._tambah(jenis);
      }
    });
  }

  _tambah(jenis) {
    const mol = buatMolekul(jenis);
    const sudut = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.15;
    const tinggi = -0.2 + Math.random() * 0.35;

    mol.position.set(Math.cos(sudut) * r, tinggi, Math.sin(sudut) * r);
    mol.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

    this.grup.add(mol);
    this.partikel.push({
      mesh: mol,
      kecepatan: new THREE.Vector3(
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.003
      ),
      rotasiKecepatan: (Math.random() - 0.5) * 0.02
    });
  }

  /** radius labu pada ketinggian y tertentu, dipakai untuk batas tumbukan dinding */
  _radiusPadaTinggi(y) {
    if (y < -0.26) return 0.27;
    if (y > 0.20) return 0.08;
    const t = (y + 0.26) / (0.20 + 0.26);
    return 0.27 - t * 0.19;
  }

  perbarui(faktorKecepatan = 1) {
    this.partikel.forEach((p) => {
      const pos = p.mesh.position;
      pos.x += p.kecepatan.x * faktorKecepatan;
      pos.y += p.kecepatan.y * faktorKecepatan;
      pos.z += p.kecepatan.z * faktorKecepatan;

      const rLimit = this._radiusPadaTinggi(pos.y);
      const rSekarang = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
      if (rSekarang > rLimit) {
        p.kecepatan.x *= -1;
        p.kecepatan.z *= -1;
      }
      if (pos.y > 0.40 || pos.y < -0.30) p.kecepatan.y *= -1;

      p.mesh.rotation.y += p.rotasiKecepatan;
    });
  }
}

/* --------------------------------------------------------------------------
   7. SCENE FACTORY — dipakai sama oleh mode WebXR maupun AR.js
   -------------------------------------------------------------------------- */
export function buatSceneDasar() {
  const scene = new THREE.Scene();

  const cahayaAmbien = new THREE.AmbientLight(0xffffff, 0.7);
  const cahayaArah = new THREE.DirectionalLight(0xffffff, 0.9);
  cahayaArah.position.set(0.5, 1.5, 0.5);
  scene.add(cahayaAmbien, cahayaArah);

  const labu = new THREE.Mesh(buatGeometryErlenmeyer(), buatMaterialKaca());
  scene.add(labu);

  const partikel = new SistemPartikel(scene);

  return { scene, labu, partikel };
}

/* --------------------------------------------------------------------------
   8a. MODE WEBXR — plane detection + hit-test sungguhan
   -------------------------------------------------------------------------- */
export async function mulaiSesiWebXR(canvas, misiId, onLabuDitempatkan) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.xr.enabled = true;
  renderer.setPixelRatio(window.devicePixelRatio);

  const { scene, labu, partikel } = buatSceneDasar();
  labu.visible = false; // baru muncul setelah user tap untuk menempatkan

  const camera = new THREE.PerspectiveCamera();
  partikel.isiDariMisi(misiId, false);

  let hitTestSource = null;
  let viewerSpace = null;
  let sudahDitempatkan = false;

  const reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.08, 0.1, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0x7f77dd })
  );
  reticle.visible = false;
  scene.add(reticle);

  const session = await navigator.xr.requestSession('immersive-ar', {
    requiredFeatures: ['hit-test'],
    optionalFeatures: ['dom-overlay'],
    domOverlay: { root: document.body }
  });

  renderer.xr.setReferenceSpaceType('local');
  await renderer.xr.setSession(session);

  const referenceSpace = await session.requestReferenceSpace('local');
  viewerSpace = await session.requestReferenceSpace('viewer');
  hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

  session.addEventListener('select', () => {
    if (sudahDitempatkan || !reticle.visible) return;
    labu.position.copy(reticle.position);
    labu.visible = true;
    sudahDitempatkan = true;
    if (onLabuDitempatkan) onLabuDitempatkan();
  });

  renderer.setAnimationLoop((timestamp, frame) => {
    if (frame) {
      const hasil = frame.getHitTestResults(hitTestSource);
      if (hasil.length > 0 && !sudahDitempatkan) {
        const pose = hasil[0].getPose(referenceSpace);
        reticle.visible = true;
        reticle.position.set(pose.transform.position.x, pose.transform.position.y, pose.transform.position.z);
      } else if (!sudahDitempatkan) {
        reticle.visible = false;
      }
    }
    partikel.perbarui();
    renderer.render(scene, camera);
  });

  return {
    session,
    renderer,
    scene,
    labu,
    partikel,
    hentikan: () => {
      renderer.setAnimationLoop(null);
      session.end();
    }
  };
}

/* --------------------------------------------------------------------------
   8b. MODE AR.JS — fallback markerless sederhana (device-orientation based)
   Labu langsung tampil mengambang stabil di depan kamera, tidak mengunci ke
   bidang nyata, tapi jalan di hampir semua HP termasuk iPhone.
   -------------------------------------------------------------------------- */
export async function mulaiSesiARjs(canvas, videoEl, misiId) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' },
    audio: false
  });
  videoEl.srcObject = stream;
  await videoEl.play();

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.01, 20);
  camera.position.set(0, 0, 1.1);

  const { scene, labu, partikel } = buatSceneDasar();
  partikel.isiDariMisi(misiId, false);

  let berjalan = true;

  function loop() {
    if (!berjalan) return;
    partikel.perbarui();
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  loop();

  function urusResize() {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', urusResize);

  return {
    renderer,
    scene,
    labu,
    partikel,
    hentikan: () => {
      berjalan = false;
      window.removeEventListener('resize', urusResize);
      stream.getTracks().forEach((t) => t.stop());
    }
  };
}

/* --------------------------------------------------------------------------
   9. UPDATE VISUAL BERDASARKAN PARAMETER MISI (dipanggil saat slider digeser)
   -------------------------------------------------------------------------- */
export function perbaruiVisualMisi(sesiAR, misiId, nilaiSekarang) {
  const data = MISI_DATA[misiId];
  if (!data || !sesiAR) return false;

  const sudahTarget = Math.abs(nilaiSekarang - data.nilaiTarget) < (data.rentang[2] / 2);
  sesiAR.partikel.isiDariMisi(misiId, sudahTarget);

  const mat = sesiAR.labu.material;
  mat.color.set(sudahTarget ? 0xe1f5ee : 0xe8f0ff);

  return sudahTarget;
}
