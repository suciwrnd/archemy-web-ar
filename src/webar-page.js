/* ==========================================================================
   ARCHEMY WEBAR PAGE v2.0
   UI: Mission HUD, AI Navigator, Action Bar, State-driven layout
   ========================================================================== */

import {
  MISI_DATA,
  AR_STATE,
  deteksiModeAR,
  mulaiSesiWebXR,
  mulaiSesiARjs,
  requestSensorPermission,
  sensorData,
} from './webar.js';
import './webar.css';

let sesiARAktif = null;
let modeARTerdeteksi = null;

/* --------------------------------------------------------------------------
   HALAMAN PILIH MISI
   -------------------------------------------------------------------------- */
export function renderPilihMisi(container, onPilihMisi, recommendedIds = []) {
  const viewedMisi = window.state?.viewedMisi || [];
  const kartu = Object.entries(MISI_DATA).map(([id, misi]) => {
    const isRec = recommendedIds.includes(id);
    const isDone = viewedMisi.includes(id);
    return `
      <button class="misi-card ${isRec ? 'misi-recommended' : ''} ${isDone ? 'misi-done' : ''}" data-misi="${id}">
        ${isRec ? '<div class="misi-ai-badge">Prioritas AI</div>' : ''}
        ${isDone ? '<div class="misi-done-badge">&#10003; Selesai</div>' : ''}
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
          <h3 class="misi-judul">${misi.judul}</h3>
        </div>
        <code class="misi-persamaan">${misi.persamaan}</code>
        <div style="margin-top:8px;font-size:10px;color:#7c6fd2;">Selidiki kesetimbangan kimia secara langsung!</div>
      </button>`;
  }).join('');

  container.innerHTML = `
    <div class="webar-pilih-misi">
      <h1 class="page-title">Lab AR Kimia</h1>
      <p class="page-subtitle">Pilih misi dan masuki dunia molekul.</p>
      ${recommendedIds.length > 0 ? `<div class="misi-rec-banner">AI merekomendasikan ${recommendedIds.length} misi untukmu</div>` : ''}
      <div class="misi-grid">${kartu}</div>
    </div>`;

  container.querySelectorAll('.misi-card').forEach(btn =>
    btn.addEventListener('click', () => onPilihMisi(btn.dataset.misi))
  );
}

/* --------------------------------------------------------------------------
   HALAMAN AR UTAMA
   -------------------------------------------------------------------------- */
export async function renderHalamanAR(container, misiId, onKeluar) {
  const misi = MISI_DATA[misiId];
  if (!misi) return;

  requestSensorPermission();

  container.innerHTML = `
    <div class="webar-stage" id="webarStage">

      <!-- HUD Atas -->
      <div class="webar-hud-top" id="webarHudTop">
        <button class="webar-hud-back" id="webarKeluar">&#8592; Kembali</button>
        <div class="webar-hud-center">
          <span class="webar-misi-label">${misi.judul}</span>
          <code class="webar-eq-label">${misi.persamaan}</code>
        </div>
        <button class="webar-colorblind-btn" id="webarColorblindBtn">Buta Warna</button>
      </div>

      <!-- Mission HUD (progress) -->
      <div class="webar-mission-hud" id="webarMissionHud">
        <div class="mission-label" id="missionLabel">SCAN PERMUKAAN</div>
        <div class="mission-bar-wrap"><div class="mission-bar" id="missionBar" style="width:0%"></div></div>
      </div>

      <!-- Equilibrium badge -->
      <div class="webar-eq-badge" id="webarEqBadge" style="display:none">
        <div class="eq-dot" id="eqDot"></div>
        <span id="eqText">Belum Setimbang</span>
      </div>

      <!-- Viewport -->
      <div class="webar-viewport">
        <video id="webarVideo" playsinline muted style="display:none"></video>
        <canvas id="webarCanvas"></canvas>

        <!-- Scan overlay -->
        <div class="webar-scan-overlay" id="webarScanOverlay">
          <div class="scan-phone-icon"></div>
          <div class="webar-scan-title">Pindai Permukaan</div>
          <div class="webar-scan-desc">Arahkan kamera ke meja atau lantai, lalu <b>KETUK</b> untuk membuka Portal Reaksi.</div>
        </div>

        <!-- AI Navigator arrow -->
        <div class="webar-nav-arrow" id="webarNavArrow" style="display:none">
          <div class="nav-arrow-icon" id="navArrowIcon">&#10148;</div>
          <div class="nav-distance" id="navDistance">&#8212;</div>
          <div class="nav-target-label" id="navTargetLabel"></div>
        </div>

        <!-- Success popup -->
        <div class="webar-success-popup" id="webarSuccessPopup" style="display:none">
          <div class="webar-success-card">
            <div class="success-icon">&#9878;</div>
            <h2>Misi Selesai!</h2>
            <p id="webarSuccessInsight">Kesetimbangan berhasil dicapai.</p>
            <div class="webar-success-pts" id="webarSuccessPts">+50 XP</div>
            <button class="btn-primary" id="btnClaimWebar" style="width:100%;padding:12px;">Klaim &amp; Kembali</button>
          </div>
        </div>
      </div>

      <!-- AI Speech Panel -->
      <div class="webar-ai-panel" id="webarAiPanel">
        <div class="ai-avatar">&#129302;</div>
        <div class="ai-speech" id="webarAiSpeech">Menginisialisasi&#8230;</div>
      </div>

      <!-- Action Bar (hanya saat EXPERIMENT) -->
      <div class="webar-action-bar" id="webarActionBar" style="display:none">
        <button class="action-btn" id="btnHeat" data-tool="heat">&#128293;<span>Heat</span></button>
        <button class="action-btn" id="btnCool" data-tool="cool">&#10052;<span>Cool</span></button>
        <button class="action-btn" id="btnAdd" data-tool="add">&#10133;<span>Add</span></button>
        <button class="action-btn" id="btnCompress" data-tool="compress">&#128230;<span>Compress</span></button>
      </div>

      <!-- CTA Overlay (Investigate button) -->
      <div class="webar-cta-overlay" id="webarCtaOverlay" style="display:none">
        <button class="cta-btn" id="btnInvestigate">&#128269; Selidiki Molekul</button>
      </div>

    </div>`;

  // Element refs
  const canvas         = container.querySelector('#webarCanvas');
  const videoEl        = container.querySelector('#webarVideo');
  const scanOverlay    = container.querySelector('#webarScanOverlay');
  const missionLabel   = container.querySelector('#missionLabel');
  const missionBar     = container.querySelector('#missionBar');
  const aiSpeech       = container.querySelector('#webarAiSpeech');
  const actionBar      = container.querySelector('#webarActionBar');
  const ctaOverlay     = container.querySelector('#webarCtaOverlay');
  const navArrow       = container.querySelector('#webarNavArrow');
  const navDistance    = container.querySelector('#navDistance');
  const navTargetLabel = container.querySelector('#navTargetLabel');
  const eqBadge        = container.querySelector('#webarEqBadge');
  const eqDot          = container.querySelector('#eqDot');
  const eqText         = container.querySelector('#eqText');
  const successPopup   = container.querySelector('#webarSuccessPopup');
  const successPts     = container.querySelector('#webarSuccessPts');
  const successInsight = container.querySelector('#webarSuccessInsight');

  // Mission progress config
  const STATE_PROGRESS = {
    [AR_STATE.SCAN]:              { label: 'SCAN PERMUKAAN',   pct: 0 },
    [AR_STATE.REACTION_PORTAL]:   { label: 'PORTAL TERBUKA',  pct: 12 },
    [AR_STATE.OVERVIEW]:          { label: 'AMATI SISTEM',    pct: 25 },
    [AR_STATE.INVESTIGATE]:       { label: 'PILIH MOLEKUL',   pct: 38 },
    [AR_STATE.PORTAL_ZOOM]:       { label: 'MEMASUKI PORTAL', pct: 50 },
    [AR_STATE.MOLECULAR_JOURNEY]: { label: 'CARI PASANGAN',   pct: 62 },
    [AR_STATE.REACTION_EVENT]:    { label: 'REAKSI!',         pct: 75 },
    [AR_STATE.EXPERIMENT]:        { label: 'EKSPERIMEN',      pct: 85 },
    [AR_STATE.REFLECTION]:        { label: 'REFLEKSI',        pct: 95 },
    [AR_STATE.EXIT_PORTAL]:       { label: 'SELESAI',         pct: 100 },
  };

  function updateMissionHUD(state) {
    const cfg = STATE_PROGRESS[state] || { label: state, pct: 0 };
    missionLabel.textContent = cfg.label;
    missionBar.style.width = cfg.pct + '%';
  }

  function setAI(text) {
    aiSpeech.classList.remove('ai-appear');
    void aiSpeech.offsetWidth;
    aiSpeech.textContent = text;
    aiSpeech.classList.add('ai-appear');
  }

  function showActionBar(show) {
    actionBar.style.display = show ? 'flex' : 'none';
    if (show) {
      actionBar.classList.remove('action-bar-enter');
      void actionBar.offsetWidth;
      actionBar.classList.add('action-bar-enter');
    }
  }

  function showCTA(show, text) {
    ctaOverlay.style.display = show ? 'flex' : 'none';
    if (show && text) container.querySelector('.cta-btn').textContent = text;
  }

  // State change handler called by webar.js
  function onStateChange(state, aiText) {
    updateMissionHUD(state);
    if (aiText) setAI(aiText);

    scanOverlay.style.display = (state === AR_STATE.SCAN) ? 'flex' : 'none';
    showActionBar(state === AR_STATE.EXPERIMENT);
    eqBadge.style.display = (state !== AR_STATE.SCAN && state !== AR_STATE.REACTION_PORTAL) ? 'flex' : 'none';

    if (state === AR_STATE.OVERVIEW) {
      setTimeout(() => {
        if (sesiARAktif?.sm?.is(AR_STATE.OVERVIEW)) showCTA(true, '\uD83D\uDD0D Selidiki Molekul');
      }, 3500);
    } else {
      showCTA(false);
    }

    if (state === AR_STATE.MOLECULAR_JOURNEY) {
      navTargetLabel.textContent = MISI_DATA[misiId].target_pasangan || '';
      navArrow.style.display = 'flex';
    } else {
      navArrow.style.display = 'none';
    }

    if (state === AR_STATE.REFLECTION) {
      eqDot.className = 'eq-dot seimbang';
      eqBadge.className = 'webar-eq-badge seimbang';
      eqText.textContent = 'Setimbang!';
      setTimeout(() => {
        const isAlreadyDone = window.state?.viewedMisi?.includes(misiId);
        const reward = isAlreadyDone ? 10 : 50;
        successPts.textContent = '+' + reward + ' XP';
        successInsight.textContent = MISI_DATA[misiId].ai.REFLECTION;
        successPopup.style.display = 'flex';
      }, 2200);
    }
  }

  // AI Navigator callbacks (called by webar.js every frame)
  window._setNavigatorTarget = (target, camera) => {
    window._navTarget = target;
    window._navCamera = camera;
  };

  window._updateNavDistance = (dist) => {
    if (dist === null || dist === undefined) { navDistance.textContent = '\u2014'; return; }
    const nm = (dist * 10).toFixed(1);
    if (dist < 0.14) {
      navDistance.textContent = 'Reaction Ready!';
      navDistance.style.color = '#4ade80';
    } else {
      navDistance.textContent = nm + ' nm';
      navDistance.style.color = '';
    }
    // Update arrow direction from projected 2D position
    if (window._navTarget && window._navCamera) {
      try {
        const pos = window._navTarget.mesh.position.clone();
        pos.project(window._navCamera);
        const angle = Math.atan2(pos.y, pos.x);
        const icon = container.querySelector('#navArrowIcon');
        if (icon) icon.style.transform = 'rotate(' + (-angle) + 'rad)';
      } catch(_) {}
    }
  };

  window._onMissionComplete = () => {};

  // Resize canvas
  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width  = rect.width  || window.innerWidth;
    canvas.height = rect.height || window.innerHeight;
  }
  resizeCanvas();

  // Detect mode
  modeARTerdeteksi = await deteksiModeAR();
  setAI('Menginisialisasi kamera\u2026');
  updateMissionHUD(AR_STATE.SCAN);

  try {
    if (modeARTerdeteksi === 'webxr') {
      sesiARAktif = await mulaiSesiWebXR(canvas, misiId, onStateChange);
      setAI('Arahkan ke permukaan lalu ketuk.');
    } else {
      videoEl.style.display = 'block';
      sesiARAktif = await mulaiSesiARjs(canvas, videoEl, misiId, onStateChange);
      setAI('Arahkan ke meja atau lantai lalu ketuk.');
    }
  } catch (err) {
    setAI('Gagal akses kamera. Periksa izin browser.');
    console.error('[ARChemy]', err);
    return;
  }

  // Investigate button
  const btnInv = container.querySelector('#btnInvestigate');
  if (btnInv) {
    btnInv.addEventListener('click', () => {
      showCTA(false);
      if (sesiARAktif?.startInvestigate) sesiARAktif.startInvestigate();
    });
  }

  // Action bar buttons
  ['heat', 'cool', 'add', 'compress'].forEach(tool => {
    const btn = container.querySelector('[data-tool="' + tool + '"]');
    if (btn) btn.addEventListener('click', () => {
      if (sesiARAktif?.triggerTool) sesiARAktif.triggerTool(tool);
      showActionBar(false);
    });
  });

  // Claim & back
  const btnClaim = container.querySelector('#btnClaimWebar');
  if (btnClaim) {
    btnClaim.addEventListener('click', () => {
      window.state = window.state || {};
      window.state.viewedMisi = window.state.viewedMisi || [];
      const isAlreadyDone = window.state.viewedMisi.includes(misiId);
      if (!isAlreadyDone) window.state.viewedMisi.push(misiId);
      const reward = isAlreadyDone ? 10 : 50;
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
  });
}

/* --------------------------------------------------------------------------
   CLEANUP
   -------------------------------------------------------------------------- */
export function hentikanSesiAR() {
  if (sesiARAktif) { sesiARAktif.hentikan(); sesiARAktif = null; }
  window._setNavigatorTarget = null;
  window._updateNavDistance = null;
  window._onMissionComplete = null;
  window._navTarget = null;
  window._navCamera = null;
}
