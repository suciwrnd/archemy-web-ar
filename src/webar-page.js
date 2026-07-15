/* ==========================================================================
   ARCHEMY WEBAR PAGE v3.0 - Molecular Journey (Immersive Portal)
   ========================================================================== */

import {
  MISI_DATA,
  AR_STATE,
  deteksiModeAR,
  mulaiSesiWebXR,
  mulaiSesiARjs,
  requestSensorPermission,
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
        <div style="margin-top:8px;font-size:10px;color:#7c6fd2;">Masuki Molecular Portal untuk simulasi interaktif.</div>
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
   HALAMAN AR UTAMA (Immersive Journey HUD)
   -------------------------------------------------------------------------- */
export async function renderHalamanAR(container, misiId, onKeluar) {
  const misi = MISI_DATA[misiId];
  if (!misi) return;

  requestSensorPermission();

  container.innerHTML = `
    <div class="webar-stage" id="webarStage">
      <!-- Background transisi untuk Immersive World -->
      <div class="webar-bg-gradient" id="webarBgGradient"></div>

      <!-- Viewport (Kamera & WebGL) -->
      <div class="webar-viewport">
        <video id="webarVideo" playsinline muted style="display:none"></video>
        <canvas id="webarCanvas"></canvas>
      </div>

      <!-- Tombol Kembali Global -->
      <button class="webar-hud-back" id="webarKeluar">&#8592; Keluar</button>

      <!-- Scan Overlay (Awal) -->
      <div class="webar-scan-overlay" id="webarScanOverlay">
        <div class="scan-phone-icon"></div>
        <div class="webar-scan-title">Pindai Permukaan</div>
        <div class="webar-scan-desc">Arahkan kamera ke meja datar untuk memunculkan <b>Molecular Portal</b>.</div>
      </div>

      <!-- HUD Kiri Atas: Current Form -->
      <div class="hud-top-left" id="hudCurrentForm" style="display:none">
        <div class="form-label">Current Form</div>
        <div class="form-value" id="currentFormValue">&#128309; Reactant</div>
      </div>

      <!-- HUD Kanan Atas: Mission -->
      <div class="hud-top-right" id="hudMission" style="display:none">
        <div class="mission-label">Mission</div>
        <div class="mission-value" id="missionValue">Find ${misi.target_pasangan || 'Target'}</div>
      </div>

      <!-- HUD Bawah: Dynamic Equilibrium -->
      <div class="hud-bottom-center" id="hudEquilibrium" style="display:none">
        <div class="eq-title">&#9878; Dynamic Equilibrium</div>
        <div class="eq-bars">
          <div class="eq-row">
            <span class="eq-label">Reaction Rate &#10142;</span>
            <div class="eq-track"><div class="eq-fill forward" id="barForward" style="width:50%"></div></div>
          </div>
          <div class="eq-row">
            <span class="eq-label">&#11013; Reverse Rate</span>
            <div class="eq-track reverse"><div class="eq-fill backward" id="barReverse" style="width:50%"></div></div>
          </div>
        </div>
      </div>

      <!-- AI Speech Panel (Nintendo style) -->
      <div class="webar-ai-panel" id="webarAiPanel" style="display:none">
        <div class="ai-avatar">&#129302;</div>
        <div class="ai-speech" id="webarAiSpeech">...</div>
      </div>

      <!-- Action Bar / Experiment (Muncul saat Fase Eksperimen) -->
      <div class="webar-action-bar" id="webarActionBar" style="display:none">
        <button class="action-btn" id="btnHeat" data-tool="heat">&#128293;<span>Heat</span></button>
        <button class="action-btn" id="btnCool" data-tool="cool">&#10052;<span>Cool</span></button>
        <button class="action-btn" id="btnAdd" data-tool="add">&#10133;<span>Add</span></button>
        <button class="action-btn" id="btnCompress" data-tool="compress">&#128230;<span>Compress</span></button>
      </div>

      <!-- Success popup -->
      <div class="webar-success-popup" id="webarSuccessPopup" style="display:none">
        <div class="webar-success-card">
          <div class="success-icon">&#10024;</div>
          <h2>Kesetimbangan Tercapai</h2>
          <p id="webarSuccessInsight">Sistem telah stabil. Laju reaksi maju sama dengan laju reaksi balik.</p>
          <div class="webar-success-pts" id="webarSuccessPts">+50 XP</div>
          <button class="btn-primary" id="btnClaimWebar" style="width:100%;padding:12px;">Selesai</button>
        </div>
      </div>
    </div>`;

  // Element refs
  const canvas         = container.querySelector('#webarCanvas');
  const videoEl        = container.querySelector('#webarVideo');
  const bgGradient     = container.querySelector('#webarBgGradient');
  
  const scanOverlay    = container.querySelector('#webarScanOverlay');
  const hudForm        = container.querySelector('#hudCurrentForm');
  const formValue      = container.querySelector('#currentFormValue');
  const hudMission     = container.querySelector('#hudMission');
  const hudEq          = container.querySelector('#hudEquilibrium');
  const barForward     = container.querySelector('#barForward');
  const barReverse     = container.querySelector('#barReverse');
  
  const aiPanel        = container.querySelector('#webarAiPanel');
  const aiSpeech       = container.querySelector('#webarAiSpeech');
  const actionBar      = container.querySelector('#webarActionBar');
  const successPopup   = container.querySelector('#webarSuccessPopup');
  const successPts     = container.querySelector('#webarSuccessPts');

  // AI Text Typer (Nintendo Style)
  let typeTimeout;
  function setAI(text) {
    if(!text) { aiPanel.style.display = 'none'; return; }
    aiPanel.style.display = 'flex';
    aiSpeech.textContent = '';
    clearTimeout(typeTimeout);
    
    let i = 0;
    function typeChar() {
      if (i < text.length) {
        aiSpeech.textContent += text.charAt(i);
        i++;
        typeTimeout = setTimeout(typeChar, 30);
      }
    }
    typeChar();
  }

  // Global callbacks untuk webar.js
  window._updateHUDForm = (isProduct, namaPartikel) => {
    if (isProduct) {
      formValue.innerHTML = '&#128308; Product (' + namaPartikel + ')';
      formValue.className = 'form-value product';
    } else {
      formValue.innerHTML = '&#128309; Reactant (' + namaPartikel + ')';
      formValue.className = 'form-value reactant';
    }
  };

  window._updateHUDEq = (forwardPct, reversePct) => {
    barForward.style.width = forwardPct + '%';
    barReverse.style.width = reversePct + '%';
  };

  // State change handler
  function onStateChange(state, aiText) {
    if (aiText) setAI(aiText);

    // Scan overlay
    scanOverlay.style.display = (state === AR_STATE.SCAN) ? 'flex' : 'none';
    
    // Transisi background: jika masuk MOLECULAR_JOURNEY, background gelap
    if (state === AR_STATE.PORTAL_ZOOM || state === AR_STATE.MOLECULAR_JOURNEY || state === AR_STATE.REACTION_EVENT || state === AR_STATE.EXPERIMENT) {
      bgGradient.style.opacity = '1';
      hudForm.style.display = 'flex';
      hudMission.style.display = 'flex';
      hudEq.style.display = 'flex';
    } else {
      bgGradient.style.opacity = '0';
      hudForm.style.display = 'none';
      hudMission.style.display = 'none';
      hudEq.style.display = 'none';
    }

    // Action bar hanya saat EXPERIMENT
    if (state === AR_STATE.EXPERIMENT) {
      actionBar.style.display = 'flex';
    } else {
      actionBar.style.display = 'none';
    }

    if (state === AR_STATE.REFLECTION) {
      setTimeout(() => {
        const isAlreadyDone = window.state?.viewedMisi?.includes(misiId);
        successPts.textContent = '+' + (isAlreadyDone ? 10 : 50) + ' XP';
        successPopup.style.display = 'flex';
      }, 2000);
    }
  }

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

  try {
    if (modeARTerdeteksi === 'webxr') {
      sesiARAktif = await mulaiSesiWebXR(canvas, misiId, onStateChange);
    } else {
      videoEl.style.display = 'block';
      sesiARAktif = await mulaiSesiARjs(canvas, videoEl, misiId, onStateChange);
    }
  } catch (err) {
    setAI('Gagal akses kamera.');
    console.error('[ARChemy]', err);
    return;
  }

  // Action bar buttons
  ['heat', 'cool', 'add', 'compress'].forEach(tool => {
    const btn = container.querySelector('[data-tool="' + tool + '"]');
    if (btn) btn.addEventListener('click', () => {
      if (sesiARAktif?.triggerTool) sesiARAktif.triggerTool(tool);
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
      if (window.addPoints) window.addPoints(isAlreadyDone ? 10 : 50, 'Praktikum AR Selesai');
      if (window.saveState) window.saveState();
      hentikanSesiAR();
      onKeluar();
    });
  }

  container.querySelector('#webarKeluar').addEventListener('click', () => {
    hentikanSesiAR();
    onKeluar();
  });
}

export function hentikanSesiAR() {
  if (sesiARAktif) { sesiARAktif.hentikan(); sesiARAktif = null; }
  window._updateHUDForm = null;
  window._updateHUDEq = null;
}
