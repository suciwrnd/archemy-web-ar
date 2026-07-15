/* ==========================================================================
   ARCHEMY WEBAR PAGE v5.0 - Driving & Grid
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
      <button class="misi-card ${isRec ? 'misi-recommended' : ''} ${isDone ? 'misi-done' : ''}" data-misi="${id}">
        ${isRec ? '<div class="misi-ai-badge">Prioritas AI</div>' : ''}
        ${isDone ? '<div class="misi-done-badge">&#10003; Selesai</div>' : ''}
        <h3 class="misi-judul">${misi.judul}</h3>
        <code class="misi-persamaan">${misi.persamaan}</code>
      </button>`;
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

      <!-- Kiri Atas -->
      <div class="hud-top-left" id="hudCurrentForm" style="display:none">
        <div class="form-label">Current Form</div>
        <div class="form-value" id="currentFormValue">&#128309; Reactant</div>
      </div>

      <!-- Kanan Atas -->
      <div class="hud-top-right" id="hudMission" style="display:none">
        <div class="mission-label">Mission</div>
        <div class="mission-value" id="missionValue">Find ${misi.target_pasangan || 'Target'}</div>
      </div>

      <!-- Tengah Atas: Equilibrium -->
      <div class="hud-top-center" id="hudEquilibrium" style="display:none">
        <div class="eq-title">Equilibrium</div>
        <div class="eq-row">
          <span class="eq-label">Forward &#10142;</span>
          <div class="eq-track"><div class="eq-fill forward" id="barForward" style="width:50%"></div></div>
        </div>
        <div class="eq-row">
          <span class="eq-label">&#11013; Reverse</span>
          <div class="eq-track reverse"><div class="eq-fill backward" id="barReverse" style="width:50%"></div></div>
        </div>
      </div>

      <!-- AI Panel -->
      <div class="webar-ai-panel" id="webarAiPanel" style="display:none">
        <div class="ai-avatar">&#129302;</div>
        <div class="ai-speech" id="webarAiSpeech">...</div>
      </div>

      <!-- Kanan Bawah: Action Bar -->
      <div class="webar-action-bar" id="webarActionBar" style="display:none">
        <button class="action-btn" id="btnHeat" data-tool="heat">&#128293;<span>Heat</span></button>
        <button class="action-btn" id="btnCool" data-tool="cool">&#10052;<span>Cool</span></button>
        <button class="action-btn" id="btnAdd" data-tool="add">&#10133;<span>Add</span></button>
        <button class="action-btn" id="btnCompress" data-tool="compress">&#128230;<span>Compress</span></button>
      </div>

      <!-- Bawah: Driving Controls -->
      <div class="webar-driving-controls" id="webarDrivingControls" style="display:none">
        <div class="steer-left-right">
          <button class="ctrl-btn steer" id="btnSteerLeft">&#11013;</button>
          <button class="ctrl-btn steer" id="btnSteerRight">&#10145;</button>
        </div>
        <div class="gas-pedal">
          <button class="ctrl-btn gas" id="btnGas">&#9191;</button>
        </div>
      </div>

      <div class="webar-success-popup" id="webarSuccessPopup" style="display:none">
        <div class="webar-success-card">
          <div class="success-icon">&#10024;</div>
          <h2>Kesetimbangan Tercapai</h2>
          <button class="btn-primary" id="btnClaimWebar">Selesai</button>
        </div>
      </div>
    </div>`;

  const canvas = container.querySelector('#webarCanvas');
  const videoEl = container.querySelector('#webarVideo');
  
  const scanOverlay = container.querySelector('#webarScanOverlay');
  const hudForm = container.querySelector('#hudCurrentForm');
  const formValue = container.querySelector('#currentFormValue');
  const hudMission = container.querySelector('#hudMission');
  const hudEq = container.querySelector('#hudEquilibrium');
  const barForward = container.querySelector('#barForward');
  const barReverse = container.querySelector('#barReverse');
  
  const aiPanel = container.querySelector('#webarAiPanel');
  const aiSpeech = container.querySelector('#webarAiSpeech');
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

  window._updateHUDEq = (forwardPct, reversePct) => {
    barForward.style.width = forwardPct + '%';
    barReverse.style.width = reversePct + '%';
  };

  function onStateChange(state, aiText) {
    if (aiText) setAI(aiText);
    scanOverlay.style.display = (state === AR_STATE.SCAN) ? 'flex' : 'none';
    
    if (state === AR_STATE.MOLECULAR_JOURNEY || state === AR_STATE.REACTION_EVENT || state === AR_STATE.EXPERIMENT) {
      hudForm.style.display = 'flex'; hudMission.style.display = 'flex'; hudEq.style.display = 'flex';
    } else {
      hudForm.style.display = 'none'; hudMission.style.display = 'none'; hudEq.style.display = 'none';
    }

    actionBar.style.display = (state === AR_STATE.EXPERIMENT) ? 'flex' : 'none';
    drivingCtrls.style.display = (state === AR_STATE.MOLECULAR_JOURNEY) ? 'block' : 'none';
    
    if (state === AR_STATE.REFLECTION) setTimeout(() => successPopup.style.display = 'flex', 1500);
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  }
  resizeCanvas();

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

  // Driving buttons
  const btnL = container.querySelector('#btnSteerLeft');
  const btnR = container.querySelector('#btnSteerRight');
  const btnGas = container.querySelector('#btnGas');
  
  let steerDir = 0;
  let isGassing = false;
  
  const bindBtn = (btn, downFn, upFn) => {
    if(!btn) return;
    const pd = (e) => { e.preventDefault(); downFn(); };
    const pu = (e) => { e.preventDefault(); upFn(); };
    btn.addEventListener('mousedown', pd); btn.addEventListener('touchstart', pd);
    btn.addEventListener('mouseup', pu); btn.addEventListener('touchend', pu);
    btn.addEventListener('mouseleave', pu); btn.addEventListener('touchcancel', pu);
  };

  bindBtn(btnL, () => steerDir = 1, () => steerDir = 0);
  bindBtn(btnR, () => steerDir = -1, () => steerDir = 0);
  bindBtn(btnGas, () => isGassing = true, () => isGassing = false);

  window._getDrivingInput = () => ({ steer: steerDir, gas: isGassing });

  container.querySelector('#btnClaimWebar').addEventListener('click', () => { hentikanSesiAR(); onKeluar(); });
  container.querySelector('#webarKeluar').addEventListener('click', () => { hentikanSesiAR(); onKeluar(); });
}

export function hentikanSesiAR() {
  if (sesiARAktif) { sesiARAktif.hentikan(); sesiARAktif = null; }
  window._updateHUDForm = null; window._updateHUDEq = null; window._getDrivingInput = null;
}
