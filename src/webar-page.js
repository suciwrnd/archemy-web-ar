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
  const kartu = Object.entries(MISI_DATA)
    .map(
      ([id, misi]) => `
      <button class="misi-card" data-misi="${id}">
        <h3 class="misi-judul">${misi.judul}</h3>
        <code class="misi-persamaan">${misi.persamaan}</code>
      </button>`
    )
    .join('');

  container.innerHTML = `
    <div class="webar-pilih-misi">
      <h1 class="page-title">Laboratorium WebAR</h1>
      <p class="page-subtitle">Pilih misi simulasi kesetimbangan kimia.</p>
      <div class="misi-grid">${kartu}</div>
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
  sensorData.spillCallback = () => {
    const storyText = document.getElementById('webarStoryText');
    if (storyText) storyText.innerHTML = `<b>Yah tumpahh!</b> Reaksi berantakan karena tabung terbalik.<br><br><button onclick="window.go('studentDashboard')" style="margin-top:8px; padding:6px 12px; background:#e11d48; color:#fff; border:none; border-radius:12px; font-weight:bold; cursor:pointer;">🔄 Ulangi Misi</button>`;
  };

  container.innerHTML = `
    <div class="webar-stage">
      <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: #00e5ff; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; z-index: 9999;">v700</div>
      <div class="webar-status" id="webarStatus">Memeriksa kemampuan perangkat…</div>
      <div class="webar-viewport">
        <video id="webarVideo" playsinline muted style="display:none"></video>
        <canvas id="webarCanvas"></canvas>

        <div class="webar-scan-overlay" id="webarScanOverlay">
          <div class="scan-phone-icon"></div>
          <div class="webar-scan-title">Pindai Bidang Datar</div>
          <div class="webar-scan-desc">Arahkan kamera ke meja/lantai hingga ring biru muncul, lalu <b>KETUK</b> layar untuk meletakkan labu.</div>
        </div>

        <button class="webar-keluar" id="webarKeluar" aria-label="Keluar dari mode AR">
          ⬅️ Kembali
        </button>
        <button class="webar-colorblind-btn" id="webarColorblindBtn">
          👁️ Mode Buta Warna
        </button>

        <div class="webar-hud-top">
          <span class="webar-misi-label">${misi.judul}</span>
          <code class="webar-eq-label">${misi.persamaan}</code>
          
          <div class="webar-legend">
            <div class="webar-legend-item">
              <span class="webar-legend-color reaktan"></span>
              <span>Reaktan</span>
            </div>
            <div class="webar-legend-item">
              <span class="webar-legend-color produk"></span>
              <span>Produk</span>
            </div>
          </div>

          <div class="webar-story-box" id="webarStoryBox">
            <div class="story-avatar">🤖</div>
            <div class="story-text" id="webarStoryText">Memuat...</div>
            <button class="story-toggle" id="webarStoryToggle" aria-label="Minimize">▼</button>
          </div>
        </div>

        <div class="webar-tap-hint" id="webarTapHint" style="display:none">
          Ketuk layar/permukaan datar untuk memunculkan labu
        </div>
      </div>
      <div class="webar-controls" id="webarControls"></div>
    </div>`;

  const statusEl = container.querySelector('#webarStatus');
  const canvas = container.querySelector('#webarCanvas');
  const videoEl = container.querySelector('#webarVideo');
  const tapHint = container.querySelector('#webarTapHint');
  const controlsEl = container.querySelector('#webarControls');
  const scanOverlay = container.querySelector('#webarScanOverlay');
  const colorblindBtn = container.querySelector('#webarColorblindBtn');
  const storyToggleBtn = container.querySelector('#webarStoryToggle');
  const storyBox = container.querySelector('#webarStoryBox');

  if (storyToggleBtn) {
    storyToggleBtn.addEventListener('click', () => {
      storyBox.classList.toggle('minimized');
      storyToggleBtn.textContent = storyBox.classList.contains('minimized') ? '▲' : '▼';
    });
  }

  container.querySelector('#webarKeluar').addEventListener('click', () => {
    document.body.classList.remove('colorblind-mode');
    hentikanSesiAR();
    onKeluar();
  });

  colorblindBtn.addEventListener('click', () => {
    document.body.classList.toggle('colorblind-mode');
    // Memicu rendering ulang bentuk senyawa di webar.js jika sesi aktif
    if (window._toggleColorblindMode) window._toggleColorblindMode(document.body.classList.contains('colorblind-mode'));
  });

  modeARTerdeteksi = await deteksiModeAR();

  if (modeARTerdeteksi === 'unsupported') {
    statusEl.textContent = 'Perangkat tidak mendukung kamera. Coba buka di HP dengan kamera belakang.';
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
      storyText.innerHTML = `<span style="color:#ef4444"><b>Waduh, labunya tumpah!</b> Berdirikan kembali ponsel Anda untuk mereset reaksi.</span>`;
    }
    // Haptic feedback if supported
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  };

  sensorData.unspillCallback = () => {
    const storyText = document.getElementById('webarStoryText');
    const misi = MISI_DATA[misiId];
    if (storyText) storyText.textContent = misi.ceritaAwal;
    
    // Reset visual
    if (sesiARAktif) {
      const valVolume = Number(document.querySelector('#slider-volume')?.value || 3.0);
      const valKunci = Number(document.querySelector('#slider-' + misi.parameterKunci)?.value || misi.nilaiTarget);
      perbaruiVisualMisi(sesiARAktif, misiId, valKunci, valVolume);
    }
  };

  try {
    if (modeARTerdeteksi === 'webxr') {
      statusEl.textContent = 'Mode AR penuh aktif — arahkan ke permukaan datar.';
      tapHint.style.display = 'block';
      scanOverlay.style.display = 'none'; // Sembunyikan overlay besar di WebXR
      sesiARAktif = await mulaiSesiWebXR(canvas, misiId, () => {
        tapHint.style.display = 'none';
      }, getSpeedFactor);
    } else {
      statusEl.textContent = 'Mode kamera sederhana aktif (perangkat tidak mendukung AR penuh).';
      videoEl.style.display = 'block';
      
      const scanDesc = scanOverlay.querySelector('.webar-scan-desc');
      if (scanDesc) scanDesc.innerHTML = `Mensimulasikan pelacakan bidang datar... Mohon tunggu.`;
      
      setTimeout(() => {
        if (scanDesc) scanDesc.innerHTML = `Bidang ditemukan! <br>Arahkan ring biru, lalu <b>KETUK</b> layar untuk meletakkan labu.`;
      }, 2500);

      sesiARAktif = await mulaiSesiARjs(canvas, videoEl, misiId, getSpeedFactor, () => {
        scanOverlay.style.opacity = '0';
        setTimeout(() => scanOverlay.style.display = 'none', 500);
      });
    }
    setTimeout(() => {
      if (statusEl) statusEl.style.opacity = '0';
    }, 2500);
  } catch (err) {
    statusEl.textContent = 'Gagal mengakses kamera. Periksa izin kamera pada browser.';
    console.error('[ARChemy WebAR]', err);
    return;
  }

  renderKontrolMisi(controlsEl, misiId);
}

function resizeCanvasKeViewport(canvas) {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width || window.innerWidth;
  canvas.height = rect.height || window.innerHeight;
}

/* --------------------------------------------------------------------------
   KONTROL SLIDER PARAMETER MISI
   -------------------------------------------------------------------------- */
function renderKontrolMisi(container, misiId) {
  const misi = MISI_DATA[misiId];
  const indikators = [
    { id: 'suhu', icon: '🌡️', label: 'Suhu' },
    { id: 'volume', icon: '📦', label: 'Volume' },
    { id: 'tekanan', icon: '🗜️', label: 'Tekanan' },
    { id: 'konsentrasi', icon: '🧪', label: 'Konsentrasi' }
  ];

  let tabHTML = `<div class="webar-tabs">`;
  indikators.forEach((ind, i) => {
    tabHTML += `<button class="webar-tab-btn ${i===0?'active':''}" data-tab="${ind.id}">${ind.icon} ${ind.label}</button>`;
  });
  tabHTML += `</div>`;

  let slidersHTML = `<div class="webar-sliders-container">`;
  indikators.forEach((ind, i) => {
    const rentang = misi.rentang[ind.id];
    let isTarget = (ind.id === misi.parameterKunci);
    let targetHtml = isTarget ? `<div class="webar-target-info">🎯 Target: ${misi.nilaiTarget} ${rentang[4]}</div>` : '';

    slidersHTML += `
      <div class="webar-slider-panel ${i===0?'active':''}" id="panel-${ind.id}">
        <div class="control-head">
          <b>${ind.label}</b>
          <span id="val-${ind.id}">${rentang[3].toFixed(rentang[2] < 1 ? 1 : 0)} ${rentang[4]}</span>
        </div>
        <input type="range" id="slider-${ind.id}" min="${rentang[0]}" max="${rentang[1]}" step="${rentang[2]}" value="${rentang[3]}">
        ${targetHtml}
      </div>
    `;
  });
  slidersHTML += `</div>`;

  container.innerHTML = tabHTML + slidersHTML;

  const storyText = document.getElementById('webarStoryText');
  if (storyText) storyText.textContent = misi.ceritaAwal;

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

  indikators.forEach(ind => {
    const slider = container.querySelector('#slider-' + ind.id);
    const valEl = container.querySelector('#val-' + ind.id);
    const rentang = misi.rentang[ind.id];

    slider.addEventListener('input', () => {
      const nilai = Number(slider.value);
      valEl.textContent = `${nilai.toFixed(rentang[2] < 1 ? 1 : 0)} ${rentang[4]}`;
      
      const valVolume = Number(container.querySelector('#slider-volume').value);
      const valKunci = Number(container.querySelector('#slider-' + misi.parameterKunci).value);
      const tercapai = perbaruiVisualMisi(sesiARAktif, misiId, valKunci, valVolume);

      if (ind.id === misi.parameterKunci) {
        if (tercapai) {
          if (storyText) storyText.textContent = misi.ceritaSukses;
          document.querySelector('.webar-hud-top').classList.add('sukses');
        } else {
          document.querySelector('.webar-hud-top').classList.remove('sukses');
          if (storyText) storyText.textContent = `Arahkan ${ind.label} mendekati target agar tercapai!`;
        }
      } else {
        if (storyText) storyText.textContent = `Hmm... Mengubah ${ind.label} sepertinya tidak berpengaruh pada misi ini. Fokus pada ${labelParameter(misi.parameterKunci)}!`;
      }
    });
  });

  // Initialize visual state immediately so baseScale is applied before first tap
  if (sesiARAktif) {
    const valVolume = Number(container.querySelector('#slider-volume').value);
    const valKunci = Number(container.querySelector('#slider-' + misi.parameterKunci).value);
    perbaruiVisualMisi(sesiARAktif, misiId, valKunci, valVolume);
  }
}

function labelParameter(kunci) {
  const peta = { suhu: 'Suhu', volume: 'Volume ruang', tekanan: 'Tekanan', konsentrasi: 'Konsentrasi' };
  return peta[kunci] || kunci;
}

/* --------------------------------------------------------------------------
   CLEANUP — wajib dipanggil saat keluar halaman supaya kamera/animasi berhenti
   -------------------------------------------------------------------------- */
export function hentikanSesiAR() {
  if (sesiARAktif) {
    sesiARAktif.hentikan();
    sesiARAktif = null;
  }
}
