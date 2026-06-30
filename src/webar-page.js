/* ==========================================================================
   ARCHEMY WEBAR PAGE — UI + orkestrasi pemanggilan webar.js
   Import ini di main.js, lalu panggil renderWebARPage(state, container)
   ========================================================================== */

import {
  MISI_DATA,
  deteksiModeAR,
  mulaiSesiWebXR,
  mulaiSesiARjs,
  perbaruiVisualMisi
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

  container.innerHTML = `
    <div class="webar-stage">
      <div class="webar-status" id="webarStatus">Memeriksa kemampuan perangkat…</div>
      <div class="webar-viewport">
        <video id="webarVideo" playsinline muted style="display:none"></video>
        <canvas id="webarCanvas"></canvas>
        <div class="webar-hud-top">
          <span class="webar-misi-label">${misi.judul}</span>
          <code class="webar-eq-label">${misi.persamaan}</code>
          <div class="webar-story-box" id="webarStoryBox">
            <div class="story-avatar">🤖</div>
            <div class="story-text" id="webarStoryText">Memuat...</div>
          </div>
        </div>
        <button class="webar-keluar" id="webarKeluar" aria-label="Keluar dari mode AR">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;"><path d="M18 6L6 18M6 6l12 12"></path></svg>
        </button>
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

  container.querySelector('#webarKeluar').addEventListener('click', () => {
    hentikanSesiAR();
    onKeluar();
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

  try {
    if (modeARTerdeteksi === 'webxr') {
      statusEl.textContent = 'Mode AR penuh aktif — arahkan ke permukaan datar.';
      tapHint.style.display = 'block';
      sesiARAktif = await mulaiSesiWebXR(canvas, misiId, () => {
        tapHint.style.display = 'none';
      }, getSpeedFactor);
    } else {
      statusEl.textContent = 'Mode kamera sederhana aktif (perangkat tidak mendukung AR penuh).';
      videoEl.style.display = 'block';
      sesiARAktif = await mulaiSesiARjs(canvas, videoEl, misiId, getSpeedFactor);
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
  canvas.width = rect.width;
  canvas.height = rect.height;
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
    slidersHTML += `
      <div class="webar-slider-panel ${i===0?'active':''}" id="panel-${ind.id}">
        <div class="control-head">
          <b>${ind.label}</b>
          <span id="val-${ind.id}">${rentang[3].toFixed(rentang[2] < 1 ? 1 : 0)} ${rentang[4]}</span>
        </div>
        <input type="range" id="slider-${ind.id}" min="${rentang[0]}" max="${rentang[1]}" step="${rentang[2]}" value="${rentang[3]}">
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
