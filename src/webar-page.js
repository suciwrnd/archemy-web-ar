/* ==========================================================================
   ARCHEMY WEBAR PAGE v8.0 — Pedagogically Sequenced Experience
   
   Flow: Hook → Pilih Misi → Portal AR → Journey → ZoomOut → Experiment → Challenge → Reflection
   ========================================================================== */

import {
  MISI_DATA, AR_STATE,
  deteksiModeAR, mulaiSesiARjs, mulaiSesiWebXR,
  requestSensorPermission, soundEngine
} from './webar.js';
import './webar.css';

let sesi = null;

// ---------------------------------------------------------------------------
// HOOK SCREEN — Pre-mission question to spark curiosity
// ---------------------------------------------------------------------------
export function renderHook(container, misiId, onContinue) {
  const misi = MISI_DATA[misiId];
  if (!misi) return;

  // Floating dot positions
  const dots = Array.from({length: 12}, (_, i) => {
    const top = 5 + Math.random() * 85;
    const left = 5 + Math.random() * 85;
    const size = 6 + Math.random() * 12;
    const delay = Math.random() * 4;
    const dur = 4 + Math.random() * 4;
    return `<div class="hook-float" style="
      top:${top}%;left:${left}%;
      width:${size}px;height:${size}px;
      animation-delay:${delay}s;animation-duration:${dur}s;
    "></div>`;
  }).join('');

  container.innerHTML = `
    <div class="archemy-hook">
      ${dots}
      <div class="hook-label">ARChemy Lab</div>
      <h2 class="hook-question">"${misi.hook}"</h2>
      <p class="hook-hint">Masuki dunia mikroskopis dan temukan sendiri jawabannya.</p>
      <button class="hook-btn" id="hookContinue">
        <span>🔬</span> Selidiki
      </button>
    </div>`;

  container.querySelector('#hookContinue').addEventListener('click', () => {
    soundEngine.whoosh();
    onContinue();
  });
}

// ---------------------------------------------------------------------------
// PILIH MISI
// ---------------------------------------------------------------------------
export function renderPilihMisi(container, onPilihMisi, recommendedIds = []) {
  const done = window.state?.viewedMisi || [];

  const cards = Object.entries(MISI_DATA).map(([id, m]) => {
    const isDone = done.includes(id);
    const isRec = recommendedIds.includes(id);
    return `
      <div class="misi-card" data-misi="${id}" tabindex="0" role="button">
        <div class="misi-card-header">
          <div class="misi-number">${m.judul.split(':')[0]}</div>
          <div>
            ${isRec ? '<span class="misi-badge rec">AI Pick</span>' : ''}
            ${isDone ? '<span class="misi-badge done">✓ Selesai</span>' : ''}
          </div>
        </div>
        <div class="misi-judul">${m.judul.split(':')[1]?.trim() || m.judul}</div>
        <code class="misi-persamaan">${m.persamaan}</code>
      </div>`;
  }).join('');

  container.innerHTML = `
    <div class="webar-pilih-misi">
      <div class="pilih-misi-header">
        <div class="pilih-misi-title">ARChemy Lab</div>
        <h1 class="pilih-misi-subtitle">Pilih Eksperimen</h1>
      </div>
      <div class="misi-grid">${cards}</div>
    </div>`;

  container.querySelectorAll('.misi-card').forEach(card => {
    card.addEventListener('click', () => onPilihMisi(card.dataset.misi));
  });
}

// ---------------------------------------------------------------------------
// AR SESSION PAGE — Full experience
// ---------------------------------------------------------------------------
export async function renderHalamanAR(container, misiId, onKeluar) {
  const misi = MISI_DATA[misiId];
  if (!misi) return;

  requestSensorPermission();

  container.innerHTML = `
    <div class="webar-stage" id="webarStage">
      
      <!-- 3D Canvas -->
      <div class="webar-viewport">
        <video id="webarVideo" playsinline muted></video>
        <canvas id="webarCanvas"></canvas>
      </div>

      <!-- Scan Overlay -->
      <div class="scan-overlay" id="scanOverlay">
        <div class="scan-ring"></div>
        <div class="scan-title">Arahkan kamera ke meja</div>
        <div class="scan-subtitle">Tap untuk meletakkan portal</div>
      </div>

      <!-- HUD Layer -->
      <div class="hud-layer" id="hudLayer" style="display:none">
        <button class="hud-back" id="btnBack">← Keluar</button>
        
        <div class="hud-status" id="hudStatus">Menginisialisasi...</div>
        
        <div class="hud-form" id="hudForm" style="display:none">
          <div class="hud-form-label">Current Form</div>
          <div class="hud-form-value reactant" id="hudFormVal">…</div>
        </div>
        
        <div class="hud-ai" id="hudAI" style="display:none">
          <div class="hud-ai-avatar">🤖</div>
          <div class="hud-ai-text" id="hudAIText"></div>
        </div>
        
        <div class="hud-eq" id="hudEq" style="display:none">
          <div class="hud-eq-title">⚖ Equilibrium</div>
          <div class="hud-eq-row">
            <span class="hud-eq-label">Forward →</span>
            <div class="hud-eq-track"><div class="hud-eq-fill fwd" id="eqFwd" style="width:50%"></div></div>
          </div>
          <div class="hud-eq-row">
            <span class="hud-eq-label">← Reverse</span>
            <div class="hud-eq-track"><div class="hud-eq-fill rev" id="eqRev" style="width:50%"></div></div>
          </div>
        </div>
      </div>

      <!-- Experiment Panel (Right side, appears after zoom-out) -->
      <div class="exp-panel" id="expPanel" style="display:none">
        <button class="exp-btn" data-tool="heat"><span class="exp-btn-icon">🔥</span>Heat</button>
        <button class="exp-btn" data-tool="cool"><span class="exp-btn-icon">❄️</span>Cool</button>
        <button class="exp-btn" data-tool="add"><span class="exp-btn-icon">➕</span>Add Reaktan</button>
        <button class="exp-btn" data-tool="compress"><span class="exp-btn-icon">📦</span>Compress</button>
      </div>

      <!-- Quiz Overlay (Eureka moment) -->
      <div class="quiz-overlay" id="quizOverlay" style="display:none">
        <div class="quiz-card">
          <div class="quiz-header">
            <div class="quiz-icon">🧠</div>
            <div class="quiz-label">Pertanyaan Pemahaman</div>
          </div>
          <div class="quiz-question">Mengapa molekulmu terus berubah bolak-balik tanpa pernah berhenti?</div>
          <div class="quiz-options">
            <button class="quiz-btn" data-ans="A">Reaksi belum selesai dan masih mencari bentuk akhirnya.</button>
            <button class="quiz-btn" data-ans="B">Molekul bergerak secara acak tanpa pola.</button>
            <button class="quiz-btn" data-ans="C">Laju reaksi maju dan balik berlangsung secara bersamaan dengan kecepatan sama.</button>
            <button class="quiz-btn" data-ans="D">Produk selalu lebih stabil daripada reaktan.</button>
          </div>
        </div>
      </div>

      <!-- Challenge Panel (Game-like) -->
      <div class="challenge-overlay" id="challengeOverlay" style="display:none">
        <div class="challenge-card">
          <div class="challenge-label">🎯 Challenge</div>
          <div class="challenge-text" id="challengeText">${misi.challenge_q}</div>
          <div class="challenge-opts" id="challengeOpts">
            ${misi.challenge_opts.map((o, i) => 
              `<button class="challenge-opt-btn" data-idx="${i}" data-correct="${o.correct}">${o.text}</button>`
            ).join('')}
          </div>
          <div class="reflection-explanation" id="challengeExplanation" style="display:none">${misi.challenge_explanation}</div>
        </div>
      </div>

      <!-- Reflection (End screen) -->
      <div class="reflection-overlay" id="reflectionOverlay" style="display:none">
        <div class="reflection-card">
          <div class="reflection-icon">✨</div>
          <div class="reflection-title">Refleksi Akhir</div>
          <div class="reflection-question">${misi.reflection_q}</div>
          <div class="reflection-answer-btns" id="reflectionOpts">
            ${misi.reflection_opts.map((o, i) =>
              `<button class="reflection-ans" data-idx="${i}" data-correct="${o.correct}">${o.text}</button>`
            ).join('')}
          </div>
          <div class="reflection-explanation" id="reflectionExp">${misi.reflection_explanation}</div>
          <button class="btn-finish" id="btnFinish" style="display:none">✓ Selesai & Klaim XP</button>
        </div>
      </div>

    </div>`;

  // Get elements
  const canvas    = container.querySelector('#webarCanvas');
  const videoEl   = container.querySelector('#webarVideo');
  const scanOvl   = container.querySelector('#scanOverlay');
  const hudLayer  = container.querySelector('#hudLayer');
  const hudStatus = container.querySelector('#hudStatus');
  const hudForm   = container.querySelector('#hudForm');
  const hudFormVal= container.querySelector('#hudFormVal');
  const hudAI     = container.querySelector('#hudAI');
  const hudAIText = container.querySelector('#hudAIText');
  const hudEq     = container.querySelector('#hudEq');
  const eqFwd     = container.querySelector('#eqFwd');
  const eqRev     = container.querySelector('#eqRev');
  const expPanel  = container.querySelector('#expPanel');
  const quizOvl   = container.querySelector('#quizOverlay');
  const challOvl  = container.querySelector('#challengeOverlay');
  const reflOvl   = container.querySelector('#reflectionOverlay');

  // Resize canvas
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);

  // AI Typewriter
  let typeTimer;
  function setAI(text, show = true) {
    clearTimeout(typeTimer);
    if (!show || !text) { hudAI.style.display = 'none'; return; }
    hudAI.style.display = 'flex';
    hudAIText.textContent = '';
    let i = 0;
    const type = () => {
      if (i < text.length) { hudAIText.textContent += text[i++]; typeTimer = setTimeout(type, 25); }
    };
    type();
  }

  // HUD updates (called by engine)
  window._updateHUDForm = (isProduct, name) => {
    hudForm.style.display = 'flex';
    hudFormVal.textContent = isProduct ? `🟡 Product (${name})` : `🔵 Reactant (${name})`;
    hudFormVal.className = 'hud-form-value ' + (isProduct ? 'product' : 'reactant');
  };
  window._updateHUDEq = (fwd, rev) => {
    eqFwd.style.width = fwd + '%';
    eqRev.style.width = rev + '%';
  };

  // State-change handler from engine
  function onState(state, aiMsg) {
    scanOvl.style.display   = state === AR_STATE.SCAN ? 'flex' : 'none';
    hudLayer.style.display  = state !== AR_STATE.SCAN ? '' : 'none';

    if (state === AR_STATE.PORTAL) {
      hudStatus.textContent = '🌀 Portal terbuka — Tap untuk masuk';
      setAI(aiMsg);
    }
    if (state === AR_STATE.JOURNEY) {
      hudStatus.textContent = 'Reaction Status: Loading...';
      hudStatus.classList.remove('equilibrium');
      setAI(aiMsg, true);
    }
    if (state === AR_STATE.ZOOMOUT) {
      hudStatus.textContent = '⚖ Dynamic Equilibrium';
      hudStatus.classList.add('equilibrium');
      hudEq.style.display = '';
      setAI(aiMsg, true);
      // Show quiz after AI finishes speaking
      setTimeout(() => { quizOvl.style.display = 'flex'; setAI(''); }, 5000);
    }
    if (state === AR_STATE.EXPERIMENT) {
      setAI(aiMsg, true);
      expPanel.style.display = 'flex';
      // Show challenge after 3s of experiment
      setTimeout(() => { challOvl.style.display = 'flex'; }, 4000);
    }
    if (state === AR_STATE.CHALLENGE) {
      challOvl.style.display = 'flex';
      expPanel.style.display = 'flex';
    }
    if (state === AR_STATE.REFLECTION) {
      reflOvl.style.display = 'flex';
      challOvl.style.display = 'none';
    }
  }

  // Quiz logic (MCQ — C is correct: "laju maju & balik sama")
  quizOvl.querySelectorAll('.quiz-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const correct = btn.dataset.ans === 'C';
      btn.classList.add(correct ? 'correct' : 'wrong');
      if (!correct) return;
      setTimeout(() => {
        quizOvl.style.display = 'none';
        sesi?.onQuizAnswered();
      }, 1200);
    });
  });

  // Challenge logic
  container.querySelectorAll('.challenge-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const correct = btn.dataset.correct === 'true';
      btn.classList.add(correct ? 'correct' : 'wrong');
      const exp = container.querySelector('#challengeExplanation');
      exp.style.display = 'block';
      if (correct) {
        soundEngine.success?.() || soundEngine.bondForm?.();
        setTimeout(() => { sesi?.onChallengeAnswered(); }, 1500);
      }
    });
  });

  // Reflection logic
  container.querySelectorAll('.reflection-ans').forEach(btn => {
    btn.addEventListener('click', () => {
      const correct = btn.dataset.correct === 'true';
      btn.classList.add(correct ? 'correct' : 'wrong');
      const exp = container.querySelector('#reflectionExp');
      exp.style.display = 'block';
      const finBtn = container.querySelector('#btnFinish');
      finBtn.style.display = '';
    });
  });

  container.querySelector('#btnFinish').addEventListener('click', () => {
    hentikanSesiAR();
    onKeluar({ completed: true });
  });
  container.querySelector('#btnBack').addEventListener('click', () => {
    hentikanSesiAR();
    onKeluar({ completed: false });
  });

  // Experiment buttons
  expPanel.querySelectorAll('.exp-btn').forEach(btn => {
    btn.addEventListener('click', () => sesi?.triggerTool(btn.dataset.tool));
  });

  // Launch engine
  const mode = await deteksiModeAR();
  try {
    const callbacks = { onState, onChallenge: () => {}, onReflection: () => {} };
    if (mode === 'webxr') {
      sesi = await mulaiSesiWebXR(canvas, misiId, callbacks);
    } else {
      sesi = await mulaiSesiARjs(canvas, videoEl, misiId, callbacks);
    }
  } catch(e) {
    console.error('AR session failed:', e);
    setAI('Gagal mengakses kamera. Coba refresh halaman.');
  }
}

export function hentikanSesiAR() {
  if (sesi) { sesi.hentikan?.(); sesi = null; }
  window._updateHUDForm = null;
  window._updateHUDEq = null;
  window.removeEventListener('resize', () => {});
}
