/* ==========================================================================
   ARCHEMY WEBAR PAGE v7.0 - Interactive Confusion
   ========================================================================== */

import { MISI_DATA, AR_STATE, deteksiModeAR, mulaiSesiWebXR, mulaiSesiARjs, requestSensorPermission } from './webar.js';
import './webar.css';

let sesiARAktif = null;

export function renderPilihMisi(container, onPilihMisi, recommendedIds = []) {
  const viewedMisi = window.state?.viewedMisi || [];
  const kartu = Object.entries(MISI_DATA).map(([id, misi]) => {
    const isRec = recommendedIds.includes(id);
    const isDone = viewedMisi.includes(id);
    return `
      <div class="misi-card" data-misi="${id}">
        <div class="misi-badge-container">
          ${isRec ? '<div class="misi-ai-badge">Prioritas AI</div>' : ''}
          ${isDone ? '<div class="misi-done-badge">&#10003; Selesai</div>' : ''}
        </div>
        <h3 class="misi-judul">${misi.judul}</h3>
        <code class="misi-persamaan">${misi.persamaan}</code>
      </div>`;
  }).join('');

  container.innerHTML = `
    <div class="webar-pilih-misi">
      <h1 class="page-title">Lab AR Kimia</h1>
      <div class="misi-grid">${kartu}</div>
    </div>`;

  container.querySelectorAll('.misi-card').forEach(btn =>
    btn.addEventListener('click', () => onPilihMisi(btn.dataset.misi))
  );
}

export async function renderHalamanAR(container, misiId, onKeluar) {
  const misi = MISI_DATA[misiId];
  if (!misi) return;

  requestSensorPermission();

  container.innerHTML = `
    <div class="webar-stage" id="webarStage">
      <div class="webar-viewport">
        <video id="webarVideo" playsinline muted style="display:none"></video>
        <canvas id="webarCanvas"></canvas>
      </div>

      <button class="webar-hud-back" id="webarKeluar">&#8592; Keluar</button>

      <div class="webar-scan-overlay" id="webarScanOverlay">
        <div class="scan-phone-icon"></div>
        <div class="webar-scan-title">Pindai Permukaan</div>
      </div>

      <!-- Kiri Tengah -->
      <div class="hud-mid-left" id="hudCurrentForm" style="display:none">
        <div class="form-label">Current Form</div>
        <div class="form-value reactant" id="currentFormValue">&#128309; Loading...</div>
      </div>

      <!-- Kanan Atas (Misi Teks Baru) -->
      <div class="hud-top-right" id="hudMission" style="display:none">
        <div class="mission-label">Mission</div>
        <div class="mission-value" id="missionValue">Temukan mengapa molekulmu tidak pernah berhenti berubah.</div>
      </div>

      <!-- Status Tengah Atas (Loading / Dynamic Equilibrium) -->
      <div class="hud-status-top" id="hudStatusTop" style="display:none">
        Reaction Status: Loading...
      </div>

      <!-- AI Panel -->
      <div class="webar-ai-panel" id="webarAiPanel" style="display:none">
        <div class="ai-avatar">&#129302;</div>
        <div class="ai-speech" id="webarAiSpeech">...</div>
      </div>

      <!-- Kuis Overlay (Momen Eureka) -->
      <div class="webar-quiz-overlay" id="webarQuizOverlay" style="display:none">
        <div class="quiz-card">
          <div class="quiz-question">Menurutmu, mengapa molekulmu terus berubah bolak-balik tanpa henti?</div>
          <div class="quiz-options">
            <button class="quiz-btn" data-ans="A">Reaksi belum selesai dan sedang mencari bentuk akhir.</button>
            <button class="quiz-btn" data-ans="B">Molekul bergerak acak tanpa pola pasti.</button>
            <button class="quiz-btn" data-ans="C">Reaksi telah mencapai kesetimbangan, laju maju & balik sama.</button>
            <button class="quiz-btn" data-ans="D">Bentuk produk selalu lebih stabil daripada reaktan.</button>
          </div>
        </div>
      </div>

      <!-- Kiri Bawah: Action Bar (Le Chatelier) -->
      <div class="webar-action-bar" id="webarActionBar" style="display:none">
        <button class="action-btn" id="btnHeat" data-tool="heat">&#128293;<span>Heat</span></button>
        <button class="action-btn" id="btnCool" data-tool="cool">&#10052;<span>Cool</span></button>
        <button class="action-btn" id="btnAdd" data-tool="add">&#10133;<span>Add</span></button>
        <button class="action-btn" id="btnCompress" data-tool="compress">&#128230;<span>Compress</span></button>
      </div>

      <!-- Kanan Bawah: Driving Controls (GAS ONLY) -->
      <div class="webar-driving-controls" id="webarDrivingControls" style="display:none">
        <div class="gas-pedal">
          <button class="ctrl-btn gas" id="btnGas">&#9191;</button>
        </div>
      </div>

      <div class="webar-success-popup" id="webarSuccessPopup" style="display:none">
        <div class="webar-success-card">
          <div class="success-icon">&#10024;</div>
          <h2>Eksperimen Selesai</h2>
          <button class="btn-primary" id="btnClaimWebar">Tutup Simulator</button>
        </div>
      </div>
    </div>`;

  const canvas = container.querySelector('#webarCanvas');
  const videoEl = container.querySelector('#webarVideo');
  
  const scanOverlay = container.querySelector('#webarScanOverlay');
  const hudForm = container.querySelector('#hudCurrentForm');
  const formValue = container.querySelector('#currentFormValue');
  const hudMission = container.querySelector('#hudMission');
  const hudStatusTop = container.querySelector('#hudStatusTop');
  
  const aiPanel = container.querySelector('#webarAiPanel');
  const aiSpeech = container.querySelector('#webarAiSpeech');
  
  const quizOverlay = container.querySelector('#webarQuizOverlay');
  const quizBtns = container.querySelectorAll('.quiz-btn');
  
  const actionBar = container.querySelector('#webarActionBar');
  const drivingCtrls = container.querySelector('#webarDrivingControls');
  const successPopup = container.querySelector('#webarSuccessPopup');

  let typeTimeout;
  function setAI(text) {
    if(!text) { aiPanel.style.display = 'none'; return; }
    aiPanel.style.display = 'flex';
    aiSpeech.textContent = '';
    clearTimeout(typeTimeout);
    let i = 0;
    function typeChar() {
      if (i < text.length) { aiSpeech.textContent += text.charAt(i); i++; typeTimeout = setTimeout(typeChar, 30); }
    }
    typeChar();
  }

  window._updateHUDForm = (isProduct, namaPartikel) => {
    formValue.innerHTML = isProduct ? '&#128308; Product (' + namaPartikel + ')' : '&#128309; Reactant (' + namaPartikel + ')';
    formValue.className = isProduct ? 'form-value product' : 'form-value reactant';
  };

  function onStateChange(state, aiText) {
    if (aiText) setAI(aiText);
    scanOverlay.style.display = (state === AR_STATE.SCAN) ? 'flex' : 'none';
    
    if (state === AR_STATE.MOLECULAR_JOURNEY || state === AR_STATE.DYNAMIC_EQUILIBRIUM || state === AR_STATE.EXPERIMENT) {
      hudForm.style.display = 'flex'; hudMission.style.display = 'flex'; hudStatusTop.style.display = 'block';
    } else {
      hudForm.style.display = 'none'; hudMission.style.display = 'none'; hudStatusTop.style.display = 'none';
    }

    if (state === AR_STATE.DYNAMIC_EQUILIBRIUM) {
      hudStatusTop.innerHTML = '&#9878; Dynamic Equilibrium';
      hudStatusTop.classList.add('glow');
      setTimeout(() => { quizOverlay.style.display = 'flex'; drivingCtrls.style.display = 'none'; }, 2000);
    }

    if (state === AR_STATE.EXPERIMENT) {
      actionBar.style.display = 'flex';
      drivingCtrls.style.display = 'block'; // Bisa nyetir lagi
    } else {
      actionBar.style.display = 'none';
    }
    
    if (state === AR_STATE.MOLECULAR_JOURNEY) {
      drivingCtrls.style.display = 'block';
    }

    if (state === AR_STATE.REFLECTION) setTimeout(() => successPopup.style.display = 'flex', 2000);
  }

  // Quiz Logic
  quizBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const ans = e.target.dataset.ans;
      if (ans === 'C') {
        e.target.classList.add('correct');
        setTimeout(() => {
          quizOverlay.style.display = 'none';
          if (sesiARAktif && sesiARAktif.onQuizAnswered) sesiARAktif.onQuizAnswered();
        }, 1500);
      } else {
        e.target.classList.add('wrong');
      }
    });
  });

  function resizeCanvas() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const mode = await deteksiModeAR();
  setAI('Menginisialisasi...');
  try {
    if (mode === 'webxr') {
      sesiARAktif = await mulaiSesiWebXR(canvas, misiId, onStateChange);
    } else {
      videoEl.style.display = 'block';
      sesiARAktif = await mulaiSesiARjs(canvas, videoEl, misiId, onStateChange);
    }
  } catch (err) { setAI('Gagal akses kamera.'); return; }

  // Action buttons
  ['heat', 'cool', 'add', 'compress'].forEach(tool => {
    const btn = container.querySelector('[data-tool="' + tool + '"]');
    if (btn) btn.addEventListener('click', () => { if (sesiARAktif?.triggerTool) sesiARAktif.triggerTool(tool); });
  });

  // Driving buttons (GAS ONLY)
  const btnGas = container.querySelector('#btnGas');
  let isGassing = false;
  
  if (btnGas) {
    const pd = (e) => { e.preventDefault(); isGassing = true; };
    const pu = (e) => { e.preventDefault(); isGassing = false; };
    btnGas.addEventListener('mousedown', pd); btnGas.addEventListener('touchstart', pd);
    btnGas.addEventListener('mouseup', pu); btnGas.addEventListener('touchend', pu);
    btnGas.addEventListener('mouseleave', pu); btnGas.addEventListener('touchcancel', pu);
  }

  window._getDrivingInput = () => ({ steer: 0, gas: isGassing });

  container.querySelector('#btnClaimWebar').addEventListener('click', () => { hentikanSesiAR(); onKeluar(); });
  container.querySelector('#webarKeluar').addEventListener('click', () => { hentikanSesiAR(); onKeluar(); });
}

export function hentikanSesiAR() {
  if (sesiARAktif) { sesiARAktif.hentikan(); sesiARAktif = null; }
  window._updateHUDForm = null; window._getDrivingInput = null;
  window.removeEventListener('resize', () => {});
}
