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
        </div>
        <button class="webar-keluar" id="webarKeluar" aria-label="Keluar dari mode AR">
          <i class="ti ti-x"></i>
        </button>
        <div class="webar-tap-hint" id="webarTapHint" style="display:none">
          Ketuk layar untuk menempatkan labu di permukaan datar
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

  try {
    if (modeARTerdeteksi === 'webxr') {
      statusEl.textContent = 'Mode AR penuh aktif — arahkan ke permukaan datar.';
      tapHint.style.display = 'block';
      sesiARAktif = await mulaiSesiWebXR(canvas, misiId, () => {
        tapHint.style.display = 'none';
      });
    } else {
      statusEl.textContent = 'Mode kamera sederhana aktif (perangkat tidak mendukung AR penuh).';
      videoEl.style.display = 'block';
      sesiARAktif = await mulaiSesiARjs(canvas, videoEl, misiId);
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
  const [min, max, step] = misi.rentang;
  const nilaiAwal = min + (max - min) / 3;

  container.innerHTML = `
    <div class="webar-control-card">
      <div class="control-head">
        <b>${labelParameter(misi.parameterKunci)}</b>
        <span id="webarNilai">${nilaiAwal.toFixed(step < 1 ? 1 : 0)} ${misi.satuan}</span>
      </div>
      <input type="range" id="webarSlider" min="${min}" max="${max}" step="${step}" value="${nilaiAwal}">
    </div>
    <div class="webar-feedback" id="webarFeedback"></div>`;

  const slider = container.querySelector('#webarSlider');
  const nilaiEl = container.querySelector('#webarNilai');
  const feedbackEl = container.querySelector('#webarFeedback');

  slider.addEventListener('input', () => {
    const nilai = Number(slider.value);
    nilaiEl.textContent = `${nilai.toFixed(misi.rentang[2] < 1 ? 1 : 0)} ${misi.satuan}`;

    const tercapai = perbaruiVisualMisi(sesiARAktif, misiId, nilai);
    feedbackEl.textContent = tercapai
      ? 'Kesetimbangan tercapai — perhatikan komposisi molekul di dalam labu.'
      : `Sesuaikan ${labelParameter(misi.parameterKunci).toLowerCase()} mendekati ${misi.nilaiTarget} ${misi.satuan}.`;
    feedbackEl.classList.toggle('sukses', tercapai);
  });

  slider.dispatchEvent(new Event('input'));
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
