/* ==========================================================================
   ARCHEMY WEBAR PAGE — UI + orkestrasi pemanggilan webar.js
   Import ini di main.js, lalu panggil renderWebARPage(state, container)
   ========================================================================== */

import {
  MISI_DATA,
  deteksiModeAR,
  mulaiSesiWebXR,
  mulaiSesiARjs,
  perbaruiVisualMisi,
  requestSensorPermission,
  sensorData
} from './webar.js';
import './webar.css';

let sesiARAktif = null;
let modeARTerdeteksi = null;

/* --------------------------------------------------------------------------
   HALAMAN PILIH MISI
   -------------------------------------------------------------------------- */
export function renderPilihMisi(container, onPilihMisi) {
  const ikonMisi = { misi1: '🔬', misi2: '🏭', misi3: '🌱', misi4: '🩸' };
  const kartu = Object.entries(MISI_DATA)
    .map(
      ([id, misi]) => `
      <button class="misi-card" data-misi="${id}">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
          <span style="font-size:22px;">${ikonMisi[id]||'🧪'}</span>
          <h3 class="misi-judul">${misi.judul}</h3>
        </div>
        <code class="misi-persamaan">${misi.persamaan}</code>
        <div style="margin-top:8px;font-size:10px;color:#7c6fd2;display:flex;gap:6px;flex-wrap:wrap;">
          <span>🎯 Target: ${misi.parameterKunci} = ${misi.nilaiTarget}</span>
        </div>
      </button>`
    )
    .join('');

  container.innerHTML = `
    <div class="webar-pilih-misi">
      <h1 class="page-title">🔬 Lab WebAR</h1>
      <p class="page-subtitle">Pilih misi simulasi kesetimbangan kimia.</p>
      <div class="misi-grid">${kartu}</div>
      <div class="webar-legend" style="margin-top:16px;padding:10px;background:rgba(107,54,207,0.06);border-radius:12px;">
        <div class="webar-legend-item"><span class="webar-legend-color reaktan"></span><span>Reaktan</span></div>
        <div class="webar-legend-item"><span class="webar-legend-color produk"></span><span>Produk</span></div>
        <span style="font-size:10px;color:#9d9bc4;margin-left:auto;">Ring merah=belum seimbang, hijau=seimbang</span>
      </div>
    </div>`;

  container.querySelectorAll('.misi-card').forEach((btn) => {
    btn.addEventListener('click', () => onPilihMisi(btn.dataset.misi));
  });
}

/* --------------------------------------------------------------------------
   HALAMAN KAMERA AR — entry point hybrid
   -------------------------------------------------------------------------- */
export async function renderHalamanAR(container, misiId, onKeluar) {
  const misi = MISI_DATA[misiId];
  if (!misi) return;

  requestSensorPermission();

  container.innerHTML = `
    <div class="webar-stage">

      <!-- HUD Atas Super Compact -->
      <div class="webar-hud-top" id="webarHudTop">
        <button class="webar-hud-back" id="webarKeluar">← Kembali</button>
        <div class="webar-hud-center">
          <span class="webar-misi-label">${misi.judul}</span>
          <code class="webar-eq-label">${misi.persamaan}</code>
        </div>
        <button class="webar-colorblind-btn" id="webarColorblindBtn">👁️</button>
      </div>

      <!-- Viewport Kamera (area terbesar) -->
      <div class="webar-viewport">
        <video id="webarVideo" playsinline muted style="display:none"></video>
        <canvas id="webarCanvas"></canvas>

        <!-- Status bar kecil -->
        <div class="webar-status" id="webarStatus">Memeriksa kemampuan perangkat…</div>

        <!-- Scan Overlay -->
        <div class="webar-scan-overlay" id="webarScanOverlay">
          <div class="scan-phone-icon"></div>
          <div class="webar-scan-title">Pindai Bidang Datar</div>
          <div class="webar-scan-desc">Arahkan kamera ke meja/lantai hingga ring muncul, lalu <b>KETUK</b> layar.</div>
        </div>

        <!-- Tap hint -->
        <div class="webar-tap-hint" id="webarTapHint" style="display:none">
          👆 Ketuk permukaan untuk memunculkan labu
        </div>

        <!-- Indikator kesetimbangan -->
        <div class="webar-eq-indicator" id="webarEqIndicator" style="display:none">
          <div class="eq-dot" id="eqDot"></div>
          <span id="eqText">Belum Setimbang</span>
        </div>

        <!-- Overlay info molekul: selalu tampil saat labu sudah ditempatkan -->
        <div class="webar-mol-overlay" id="webarMolOverlay" style="display:none">
          <div class="mol-row" id="molReaktan"></div>
          <div class="mol-arrow" id="molArrow">⇌</div>
          <div class="mol-row" id="molProduk"></div>
        </div>

        <!-- Story box mengambang di bawah viewport -->
        <div class="webar-story-overlay">
          <div class="webar-story-box" id="webarStoryBox">
            <span class="story-avatar">🤖</span>
            <span class="story-text" id="webarStoryText">Memuat...</span>
            <button class="story-toggle" id="webarStoryToggle">▼</button>
          </div>
        </div>
      </div>

      <!-- Panel Kontrol Bawah -->
      <div class="webar-controls" id="webarControls"></div>
    </div>`;

  const statusEl = container.querySelector('#webarStatus');
  const canvas = container.querySelector('#webarCanvas');
  const videoEl = container.querySelector('#webarVideo');
  const tapHint = container.querySelector('#webarTapHint');
  const controlsEl = container.querySelector('#webarControls');
  const scanOverlay = container.querySelector('#webarScanOverlay');
  const hudTop = container.querySelector('#webarHudTop');
  const colorblindBtn = container.querySelector('#webarColorblindBtn');
  const storyToggleBtn = container.querySelector('#webarStoryToggle');
  const storyBox = container.querySelector('#webarStoryBox');
  const eqIndicator = container.querySelector('#webarEqIndicator');
  const eqDot = container.querySelector('#eqDot');
  const eqText = container.querySelector('#eqText');
  const molOverlay = container.querySelector('#webarMolOverlay');
  const molReaktanEl = container.querySelector('#molReaktan');
  const molProdukEl = container.querySelector('#molProduk');
  const molArrowEl = container.querySelector('#molArrow');

  // Cerita toggle
  storyToggleBtn.addEventListener('click', () => {
    storyBox.classList.toggle('minimized');
    storyToggleBtn.textContent = storyBox.classList.contains('minimized') ? '▲' : '▼';
  });

  // Keluar
  container.querySelector('#webarKeluar').addEventListener('click', () => {
    document.body.classList.remove('colorblind-mode');
    hentikanSesiAR();
    onKeluar();
  });

  // Colorblind toggle
  colorblindBtn.addEventListener('click', () => {
    document.body.classList.toggle('colorblind-mode');
    if (window._toggleColorblindMode) window._toggleColorblindMode(document.body.classList.contains('colorblind-mode'));
  });

  modeARTerdeteksi = await deteksiModeAR();

  if (modeARTerdeteksi === 'unsupported') {
    statusEl.textContent = 'Perangkat tidak mendukung kamera. Coba di HP dengan kamera belakang.';
    return;
  }

  resizeCanvasKeViewport(canvas);

  const getSpeedFactor = () => {
    const slider = document.getElementById('slider-suhu');
    if (!slider) return 1;
    return Number(slider.value) / 40;
  };

  sensorData.spillCallback = () => {
    const storyText = document.getElementById('webarStoryText');
    if (storyText) {
      storyText.innerHTML = `<span style="color:#f87171"><b>Waduh, labunya tumpah!</b> Berdirikan kembali ponsel Anda untuk mereset reaksi.</span>`;
    }
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  };

  sensorData.unspillCallback = () => {
    const storyText = document.getElementById('webarStoryText');
    const misiData = MISI_DATA[misiId];
    if (storyText) storyText.textContent = misiData.ceritaAwal;
    if (sesiARAktif) {
      const valVolume = Number(document.querySelector('#slider-volume')?.value || 3.0);
      const valKunci = Number(document.querySelector('#slider-' + misiData.parameterKunci)?.value || misiData.nilaiTarget);
      perbaruiVisualMisi(sesiARAktif, misiId, valKunci, valVolume);
    }
  };

  // Callback saat labu berhasil ditempatkan
  const onLabuDitempatkan = () => {
    tapHint.style.display = 'none';
    scanOverlay.style.display = 'none';
    if (eqIndicator) eqIndicator.style.display = 'flex';
    if (molOverlay) molOverlay.style.display = 'flex';
    // Render info awal molekul
    updateMolOverlay(misiId, false, molReaktanEl, molProdukEl, molArrowEl);
  };

  try {
    if (modeARTerdeteksi === 'webxr') {
      statusEl.textContent = 'AR aktif — arahkan ke permukaan datar, lalu ketuk.';
      tapHint.style.display = 'block';
      scanOverlay.style.display = 'none';
      sesiARAktif = await mulaiSesiWebXR(canvas, misiId, onLabuDitempatkan, getSpeedFactor);
    } else {
      statusEl.textContent = 'Kamera aktif (mode simulasi).';
      videoEl.style.display = 'block';
      const scanDesc = scanOverlay.querySelector('.webar-scan-desc');
      if (scanDesc) scanDesc.innerHTML = `Mendeteksi permukaan... Mohon tunggu.`;
      setTimeout(() => {
        if (scanDesc) scanDesc.innerHTML = `Ring biru muncul! <br><b>KETUK</b> layar untuk meletakkan labu.`;
      }, 2500);
      sesiARAktif = await mulaiSesiARjs(canvas, videoEl, misiId, getSpeedFactor, onLabuDitempatkan);
    }
    setTimeout(() => { if (statusEl) statusEl.style.opacity = '0'; }, 2500);
  } catch (err) {
    statusEl.textContent = 'Gagal mengakses kamera. Periksa izin kamera pada browser.';
    console.error('[ARChemy WebAR]', err);
    return;
  }

  renderKontrolMisi(controlsEl, misiId, hudTop, eqDot, eqText, molReaktanEl, molProdukEl, molArrowEl);
}

function resizeCanvasKeViewport(canvas) {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width || window.innerWidth;
  canvas.height = rect.height || window.innerHeight;
}

/* --------------------------------------------------------------------------
   UPDATE OVERLAY MOLEKUL 2D
   -------------------------------------------------------------------------- */
function updateMolOverlay(misiId, dekatTarget, reaktanEl, produkEl, arrowEl) {
  if (!reaktanEl || !produkEl) return;
  const data = MISI_DATA[misiId]; if (!data) return;
  const set = dekatTarget ? data.partikel.dekatTarget : data.partikel.jauhTarget;
  // Pisahkan reaktan dan produk
  const produkJenis = { HI: true, N2O4: true, NH3: true, HCO3: true };
  const reaktan = set.filter(s => !produkJenis[s.jenis]);
  const produk = set.filter(s => produkJenis[s.jenis]);
  const renderPill = (arr) => arr.map(s =>
    `<span class="mol-pill">${s.jenis}<sub style="font-size:9px">${s.jumlah}</sub></span>`
  ).join('');
  reaktanEl.innerHTML = renderPill(reaktan);
  produkEl.innerHTML = renderPill(produk);
  if (arrowEl) arrowEl.className = 'mol-arrow' + (dekatTarget ? ' seimbang' : '');
}

/* --------------------------------------------------------------------------
   KONTROL SLIDER PARAMETER MISI
   -------------------------------------------------------------------------- */
function renderKontrolMisi(container, misiId, hudTop, eqDot, eqText, molReaktanEl, molProdukEl, molArrowEl) {
  const misi = MISI_DATA[misiId];
  const indikators = [
    { id: 'suhu',         icon: '🌡️', label: 'Suhu' },
    { id: 'volume',       icon: '📦', label: 'Volume' },
    { id: 'tekanan',      icon: '🗜️', label: 'Tekanan' },
    { id: 'konsentrasi',  icon: '🧪', label: 'Konsentrasi' }
  ];

  // Cari parameter kunci untuk ditampilkan pertama
  const kunciIdx = indikators.findIndex(i => i.id === misi.parameterKunci);
  const kunciInd = indikators[kunciIdx];
  const kunciRentang = misi.rentang[kunciInd.id];

  // Susun: parameter kunci di atas, tab untuk yang lain
  let html = `
    <!-- Parameter Kunci: selalu tampil -->
    <div class="webar-key-param">
      <span class="webar-key-label">${kunciInd.icon} ${kunciInd.label}</span>
      <div style="display:flex;align-items:center;gap:8px;">
        <span class="webar-key-value" id="val-key-${kunciInd.id}">${kunciRentang[3].toFixed(kunciRentang[2] < 1 ? 1 : 0)} ${kunciRentang[4]}</span>
        <span class="webar-target-badge">🎯 ${misi.nilaiTarget} ${kunciRentang[4]}</span>
      </div>
    </div>
    <input type="range" id="slider-${kunciInd.id}" min="${kunciRentang[0]}" max="${kunciRentang[1]}" step="${kunciRentang[2]}" value="${kunciRentang[3]}" style="width:100%;accent-color:#7f77dd;margin-bottom:10px;">

    <!-- Legenda -->
    <div class="webar-legend" style="margin-bottom:10px;">
      <div class="webar-legend-item"><span class="webar-legend-color reaktan"></span><span>Reaktan</span></div>
      <div class="webar-legend-item"><span class="webar-legend-color produk"></span><span>Produk</span></div>
    </div>

    <!-- Tab untuk parameter lain -->
    <div class="webar-tabs" id="webarTabs">`;
  indikators.filter(i => i.id !== misi.parameterKunci).forEach((ind, i) => {
    html += `<button class="webar-tab-btn ${i===0?'active':''}" data-tab="${ind.id}">${ind.icon} ${ind.label}</button>`;
  });
  html += `</div><div class="webar-sliders-container">`;
  indikators.filter(i => i.id !== misi.parameterKunci).forEach((ind, i) => {
    const rentang = misi.rentang[ind.id];
    html += `
      <div class="webar-slider-panel ${i===0?'active':''}" id="panel-${ind.id}">
        <div class="control-head">
          <b>${ind.label}</b>
          <span id="val-${ind.id}">${rentang[3].toFixed(rentang[2] < 1 ? 1 : 0)} ${rentang[4]}</span>
        </div>
        <input type="range" id="slider-${ind.id}" min="${rentang[0]}" max="${rentang[1]}" step="${rentang[2]}" value="${rentang[3]}">
      </div>`;
  });
  html += `</div>`;

  container.innerHTML = html;

  const storyText = document.getElementById('webarStoryText');
  if (storyText) storyText.textContent = misi.ceritaAwal;

  // Tab switching (parameter non-kunci)
  const tabBtns = container.querySelectorAll('.webar-tab-btn');
  const panels = container.querySelectorAll('.webar-slider-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      container.querySelector('#panel-' + btn.dataset.tab).classList.add('active');
    });
  });

  // Helper untuk update visual
  const doUpdate = () => {
    const valVolume = Number(container.querySelector('#slider-volume')?.value || 3.0);
    const valKunci = Number(container.querySelector('#slider-' + misi.parameterKunci).value);
    const tercapai = perbaruiVisualMisi(sesiARAktif, misiId, valKunci, valVolume);

    // Update overlay molekul 2D
    updateMolOverlay(misiId, tercapai, molReaktanEl, molProdukEl, molArrowEl);

    // Update indikator kesetimbangan di viewport
    if (eqDot && eqText) {
      if (tercapai) {
        eqDot.classList.add('seimbang');
        eqText.textContent = '⚖️ Setimbang!';
      } else {
        eqDot.classList.remove('seimbang');
        eqText.textContent = 'Belum Setimbang';
      }
    }

    return tercapai;
  };

  // Slider parameter kunci
  const kunciSlider = container.querySelector('#slider-' + kunciInd.id);
  const kunciValEl = container.querySelector('#val-key-' + kunciInd.id);
  kunciSlider.addEventListener('input', () => {
    const nilai = Number(kunciSlider.value);
    kunciValEl.textContent = `${nilai.toFixed(kunciRentang[2] < 1 ? 1 : 0)} ${kunciRentang[4]}`;
    const tercapai = doUpdate();
    if (storyText) {
      storyText.textContent = tercapai ? misi.ceritaSukses : `Atur ${kunciInd.label} → 🎯 ${misi.nilaiTarget} ${kunciRentang[4]}`;
    }
    if (hudTop) hudTop.classList.toggle('sukses', tercapai);
  });

  // Slider parameter lainnya
  indikators.filter(i => i.id !== misi.parameterKunci).forEach(ind => {
    const slider = container.querySelector('#slider-' + ind.id);
    const valEl = container.querySelector('#val-' + ind.id);
    const rentang = misi.rentang[ind.id];
    slider.addEventListener('input', () => {
      const nilai = Number(slider.value);
      valEl.textContent = `${nilai.toFixed(rentang[2] < 1 ? 1 : 0)} ${rentang[4]}`;
      doUpdate();
      if (storyText) {
        storyText.textContent = `Mengubah ${ind.label} tidak berpengaruh pada misi ini. Fokus pada ${labelParameter(misi.parameterKunci)}!`;
      }
    });
  });

  // Init visual
  if (sesiARAktif) doUpdate();
}

function labelParameter(kunci) {
  const peta = { suhu: 'Suhu', volume: 'Volume', tekanan: 'Tekanan', konsentrasi: 'Konsentrasi' };
  return peta[kunci] || kunci;
}

/* --------------------------------------------------------------------------
   CLEANUP
   -------------------------------------------------------------------------- */
export function hentikanSesiAR() {
  if (sesiARAktif) {
    sesiARAktif.hentikan();
    sesiARAktif = null;
  }
}
