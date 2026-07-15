/* ==========================================================================
   ARCHEMY WEBAR PAGE - Orkestrasi UI + webar.js
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
export function renderPilihMisi(container, onPilihMisi, recommendedIds = []) {
    const ikonMisi = { misi1: '1.', misi2: '2.', misi3: '3.', misi4: '4.', misi5: '5.' };

  // Dapatkan misi yang sudah diselesaikan dari state
  const viewedMisi = window.state?.viewedMisi || [];

  const kartu = Object.entries(MISI_DATA)
    .map(([id, misi]) => {
      const isRec  = recommendedIds.includes(id);
      const isDone = viewedMisi.includes(id);
      const badgeHtml = isRec
        ? `<div class="misi-ai-badge">Prioritas AI</div>`
        : '';
      return `
        <button class="misi-card ${isRec ? 'misi-recommended' : ''}" data-misi="${id}">
          ${badgeHtml}
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
            <span style="font-size:18px; font-weight:700;">${ikonMisi[id]||'>'}</span>
            <h3 class="misi-judul">${misi.judul}</h3>
          </div>
          <code class="misi-persamaan">${misi.persamaan}</code>
          <div style="margin-top:8px;font-size:10px;color:#7c6fd2;">
            Temukan keadaan setimbang!
          </div>
        </button>`;
    })
    .join('');

  container.innerHTML = `
    <div class="webar-pilih-misi">
      <h1 class="page-title">Lab AR Kimia</h1>
      <p class="page-subtitle">Pilih misi dan pelajari kesetimbangan kimia secara langsung.</p>
      ${recommendedIds.length > 0 ? `<div class="misi-rec-banner">AI merekomendasikan ${recommendedIds.length} misi berdasarkan hasil diagnosismu</div>` : ''}
      <div class="misi-grid">${kartu}</div>
      <div class="webar-legend" style="margin-top:14px;background:rgba(83,74,183,0.06);padding:10px;border-radius:12px;">
        <div class="webar-legend-item"><span class="webar-legend-color reaktan"></span><span>Reaktan</span></div>
        <div class="webar-legend-item"><span class="webar-legend-color produk"></span><span>Produk</span></div>
        <span style="font-size:10px;color:#9d9bc4;margin-left:auto;">Ring merah → belum setimbang • hijau → setimbang</span>
      </div>
    </div>`;

  container.querySelectorAll('.misi-card').forEach(btn =>
    btn.addEventListener('click', () => onPilihMisi(btn.dataset.misi))
  );
}

/* --------------------------------------------------------------------------
   HALAMAN KAMERA AR
   -------------------------------------------------------------------------- */
export async function renderHalamanAR(container, misiId, onKeluar) {
  const misi = MISI_DATA[misiId];
  if (!misi) return;

  requestSensorPermission();

  container.innerHTML = `
    <div class="webar-stage">

      <!-- HUD Atas tipis -->
      <div class="webar-hud-top" id="webarHudTop">
        <button class="webar-hud-back" id="webarKeluar">← Kembali</button>
        <div class="webar-hud-center">
          <span class="webar-misi-label">${misi.judul}</span>
          <code class="webar-eq-label">${misi.persamaan}</code>
        </div>
        <button class="webar-colorblind-btn" id="webarColorblindBtn" title="Mode buta warna"><span style="font-size:11px; font-weight:600;">Mode Buta Warna</span></button>
      </div>

      <!-- Viewport bersih - TIDAK ada kotak teks di sini -->
      <div class="webar-viewport">
        <video id="webarVideo" playsinline muted style="display:none"></video>
        <canvas id="webarCanvas"></canvas>

        <!-- Scan Overlay -->
        <div class="webar-scan-overlay" id="webarScanOverlay">
          <div class="scan-phone-icon"></div>
          <div class="webar-scan-title">Pindai Permukaan</div>
          <div class="webar-scan-desc">Arahkan kamera ke meja atau lantai, lalu <b>KETUK</b> untuk meletakkan labu.</div>
        </div>

        <!-- Status - fade out setelah 3 detik -->
        <div class="webar-status" id="webarStatus">Memeriksa kamera…</div>

        <!-- Tap hint - muncul setelah scan -->
        <div class="webar-tap-hint" id="webarTapHint" style="display:none">
          Ketuk untuk meletakkan labu
        </div>

        <!-- Badge kesetimbangan - pojok kanan atas, sangat kecil -->
        <div class="webar-eq-badge" id="webarEqBadge">
          <div class="eq-dot" id="eqDot"></div>
          <span id="eqText">Belum Setimbang</span>
        </div>
        
        <!-- Popup Sukses (Hidden default) -->
        <div class="webar-success-popup" id="webarSuccessPopup" style="display:none;">
          <div class="webar-success-card">
            <h2>Misi Selesai!</h2>
            <p>Kesetimbangan berhasil dicapai.</p>
            <div class="webar-success-pts" id="webarSuccessPts">+50 XP</div>
            <button class="btn-primary" id="btnClaimWebar" style="width:100%; padding:12px;">Klaim & Kembali</button>
          </div>
        </div>
      </div>

      <!-- Panel Kontrol Bawah - semua teks & info di sini -->
      <div class="webar-controls" id="webarControls"></div>
    </div>`;

  const statusEl    = container.querySelector('#webarStatus');
  const canvas      = container.querySelector('#webarCanvas');
  const videoEl     = container.querySelector('#webarVideo');
  const tapHint     = container.querySelector('#webarTapHint');
  const controlsEl  = container.querySelector('#webarControls');
  const scanOverlay = container.querySelector('#webarScanOverlay');
  const hudTop      = container.querySelector('#webarHudTop');
  const eqBadge     = container.querySelector('#webarEqBadge');
  const eqDot       = container.querySelector('#eqDot');
  const eqText      = container.querySelector('#eqText');

  const btnClaim = container.querySelector('#btnClaimWebar');
  const ptsEl    = container.querySelector('#webarSuccessPts');
  if (btnClaim) {
    const isAlreadyDone = window.state?.viewedMisi?.includes(misiId);
    const reward = isAlreadyDone ? 10 : 50;
    if (ptsEl) ptsEl.textContent = `+${reward} XP`;
    btnClaim.addEventListener('click', () => {
      window.state = window.state || {};
      window.state.viewedMisi = window.state.viewedMisi || [];
      if (!isAlreadyDone) window.state.viewedMisi.push(misiId);
      if (window.addPoints) window.addPoints(reward, 'Praktikum AR Selesai');
      if (window.saveState) window.saveState();
      
      document.body.classList.remove('colorblind-mode');
      hentikanSesiAR();
      onKeluar();
    });
  }

  container.querySelector('#webarKeluar').addEventListener('click', () => {
    document.body.classList.remove('colorblind-mode');
    hentikanSesiAR();
    onKeluar();
  });

  container.querySelector('#webarColorblindBtn').addEventListener('click', () => {
    document.body.classList.toggle('colorblind-mode');
    if (window._toggleColorblindMode)
      window._toggleColorblindMode(document.body.classList.contains('colorblind-mode'));
  });

  modeARTerdeteksi = await deteksiModeAR();
  if (modeARTerdeteksi === 'unsupported') {
    statusEl.textContent = 'Perangkat tidak mendukung kamera. Coba di HP.';
    return;
  }

  resizeCanvasKeViewport(canvas);

  const getSpeedFactor = () => {
    const s = document.getElementById('slider-suhu');
    return s ? Number(s.value) / 40 : 1;
  };

  sensorData.spillCallback = () => {
    const t = document.getElementById('panelStoryText');
    if (t) t.innerHTML = `<span style="color:#f87171"><b>Waduh, labunya tumpah!</b> Tegakkan kembali ponsel untuk mereset.</span>`;
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  };
  sensorData.unspillCallback = () => {
    const t = document.getElementById('panelStoryText');
    const m = MISI_DATA[misiId];
    if (t) t.textContent = m.ceritaAwal;
    if (sesiARAktif) {
      const p = {
        vol: Number(document.querySelector('#slider-volume')?.value || 3.0),
        tek: Number(document.querySelector('#slider-tekanan')?.value || 1.0),
        kon: Number(document.querySelector('#slider-konsentrasi')?.value || 1.0),
        suh: Number(document.querySelector('#slider-suhu')?.value || 40.0)
      };
      const val = Number(document.querySelector('#slider-' + m.parameterKunci)?.value || m.nilaiTarget);
      perbaruiVisualMisi(sesiARAktif, misiId, val, p);
    }
  };

  const onLabuDitempatkan = () => {
    tapHint.style.display = 'none';
    scanOverlay.style.display = 'none';
    eqBadge.style.display = 'flex';
  };

  try {
    if (modeARTerdeteksi === 'webxr') {
      statusEl.textContent = 'AR aktif - arahkan ke permukaan datar.';
      tapHint.style.display = 'block';
      scanOverlay.style.display = 'none';
      sesiARAktif = await mulaiSesiWebXR(canvas, misiId, onLabuDitempatkan, getSpeedFactor);
    } else {
      statusEl.textContent = 'Mode kamera aktif.';
      videoEl.style.display = 'block';
      const desc = scanOverlay.querySelector('.webar-scan-desc');
      setTimeout(() => {
        if (desc && !sesiARAktif?.sudahDitempatkan)
          desc.innerHTML = `Permukaan terdeteksi! <b>KETUK</b> layar untuk meletakkan labu.`;
      }, 2500);
      sesiARAktif = await mulaiSesiARjs(canvas, videoEl, misiId, getSpeedFactor, onLabuDitempatkan);
    }
    setTimeout(() => { if (statusEl) statusEl.style.opacity = '0'; }, 3000);
  } catch (err) {
    statusEl.textContent = 'Gagal akses kamera. Periksa izin browser.';
    console.error('[ARChemy]', err);
    return;
  }

  renderPanelKontrol(controlsEl, misiId, hudTop, eqBadge, eqDot, eqText);
}

function resizeCanvasKeViewport(canvas) {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width  = rect.width  || window.innerWidth;
  canvas.height = rect.height || window.innerHeight;
}

/* --------------------------------------------------------------------------
   PANEL KONTROL - semua info edukatif & slider di sini
   -------------------------------------------------------------------------- */
function renderPanelKontrol(container, misiId, hudTop, eqBadge, eqDot, eqText) {
  const misi = MISI_DATA[misiId];

  container.innerHTML = `
    <!-- AI Instruction Bubble -->
    <div class="webar-ai-bubble" id="aiBubble">
      <span id="aiBubbleText"><b>AI:</b> ${misi.ceritaAwal}</span>
    </div>

    <!-- Action Toolbar (Right Vertical) -->
    <div class="webar-action-toolbar">
      <button class="webar-action-btn" id="btn-heat" title="Heat">🔥</button>
      <button class="webar-action-btn" id="btn-cool" title="Cool">❄</button>
      <button class="webar-action-btn" id="btn-add" title="Add Reactant">➕</button>
      <button class="webar-action-btn" id="btn-compress" title="Compress">📦</button>
      <div style="height:1px;background:rgba(255,255,255,0.2);margin:4px 0;"></div>
      <button class="webar-action-btn" id="btn-follow" title="Follow Mode">👁</button>
    </div>`;

  const aiText = container.querySelector('#aiBubbleText');
  let popupTimeout;
  let misiSelesai = false;

  const showSuccess = () => {
    aiText.innerHTML = `<b>AI:</b> ${misi.ceritaSukses}`;
    if (eqDot && eqText && eqBadge) {
      eqDot.className = 'eq-dot seimbang';
      eqBadge.className = 'webar-eq-badge seimbang';
      eqText.textContent = 'Status: Setimbang!';
    }
    if (hudTop) hudTop.classList.add('sukses');
    
    if (!misiSelesai) {
      misiSelesai = true;
      popupTimeout = setTimeout(() => {
        const pop = document.getElementById('webarSuccessPopup');
        if (pop) pop.style.display = 'flex';
      }, 3500); // Tunda agar user menikmati free exploration
    }
  };

  // Button Events mapping to new logic in webar.js
  const tools = ['heat', 'cool', 'add', 'compress', 'follow'];
  tools.forEach(tool => {
    const btn = container.querySelector('#btn-' + tool);
    if (btn) {
      btn.addEventListener('click', () => {
        // Toggle visual active state (optional)
        tools.forEach(t => container.querySelector('#btn-'+t)?.classList.remove('active-tool'));
        btn.classList.add('active-tool');
        setTimeout(() => btn.classList.remove('active-tool'), 300);

        if (sesiARAktif && sesiARAktif.triggerAction) {
          const tercapai = sesiARAktif.triggerAction(tool, misiId);
          if (tercapai) showSuccess();
        }
      });
    }
  });
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
