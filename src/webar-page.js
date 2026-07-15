/* ==========================================================================
   ARCHEMY WEBAR PAGE v9.0 — Phase-perfect educational journey
   ========================================================================== */

import {
  MISI_DATA, CHECKPOINT,
  deteksiModeAR, mulaiSesiARjs, mulaiSesiWebXR,
  requestSensorPermission, soundEngine
} from './webar.js';
import './webar.css';

let sesi = null;

// ---------------------------------------------------------------------------
// HOOK SCREEN
// ---------------------------------------------------------------------------
export function renderHook(container, misiId, onContinue) {
  const misi = MISI_DATA[misiId];
  if (!misi) return;

  const dots = Array.from({length: 14}, () => {
    const top = 5 + Math.random() * 85, left = 5 + Math.random() * 85;
    const size = 5 + Math.random() * 10, delay = Math.random() * 5, dur = 4 + Math.random() * 4;
    return `<div class="hook-float" style="top:${top}%;left:${left}%;width:${size}px;height:${size}px;animation-delay:${delay}s;animation-duration:${dur}s"></div>`;
  }).join('');

  container.innerHTML = `
    <div class="archemy-hook">
      ${dots}
      <div class="hook-label">ARChemy — ${misi.judul}</div>
      <div class="hook-equation">${misi.persamaan}</div>
      <h2 class="hook-question">"${misi.hook}"</h2>
      <p class="hook-hint">Masuki dunia molekul dan temukan sendiri jawabannya.</p>
      <button class="hook-btn" id="hookContinue"><span>🔬</span> Selidiki</button>
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
    const isRec  = recommendedIds.includes(id);
    return `
      <div class="misi-card" data-misi="${id}" tabindex="0" role="button" aria-label="${m.judul}">
        <div class="misi-card-header">
          <div class="misi-number">${m.judul.split('—')[0].trim()}</div>
          <div>${isRec ? '<span class="misi-badge rec">AI Pick</span>' : ''}${isDone ? '<span class="misi-badge done">✓ Selesai</span>' : ''}</div>
        </div>
        <div class="misi-judul">${(m.judul.split('—')[1] || m.judul).trim()}</div>
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

  container.querySelectorAll('.misi-card').forEach(c => {
    c.addEventListener('click', () => onPilihMisi(c.dataset.misi));
  });
}

// ---------------------------------------------------------------------------
// AR SESSION PAGE
// ---------------------------------------------------------------------------
export async function renderHalamanAR(container, misiId, onKeluar) {
  const misi = MISI_DATA[misiId];
  if (!misi) return;

  requestSensorPermission();

  container.innerHTML = `
    <div class="webar-stage" id="webarStage">

      <div class="webar-viewport">
        <video id="webarVideo" playsinline muted></video>
        <canvas id="webarCanvas"></canvas>
      </div>

      <!-- Start Overlay -->
      <div class="scan-overlay" id="scanOverlay">
        <div class="scan-ring"></div>
        <div class="scan-title">Dunia Molekul Siap</div>
        <div class="scan-subtitle">Kamu akan menjadi molekul <strong>${misi.jenis}</strong></div>
        <button class="scan-start-btn" id="btnMulaiAR">🔬 Mulai Perjalanan</button>
      </div>

      <!-- HUD Layer -->
      <div class="hud-layer" id="hudLayer" style="display:none">
        <button class="hud-back" id="btnBack">← Keluar</button>

        <!-- Phase indicator (top center) -->
        <div class="hud-status" id="hudStatus">Persiapan...</div>

        <!-- Current Form (left center) -->
        <div class="hud-form" id="hudForm" style="display:none">
          <div class="hud-form-label">Bentuk Saat Ini</div>
          <div class="hud-form-value reactant" id="hudFormVal">…</div>
        </div>

        <!-- Reaction counter (right side during journey) -->
        <div class="hud-counter" id="hudCounter" style="display:none">
          <div class="hud-counter-label">Perubahan</div>
          <div class="hud-counter-val" id="hudCounterVal">0×</div>
        </div>

        <!-- AI Speech -->
        <div class="hud-ai" id="hudAI" style="display:none">
          <div class="hud-ai-avatar">🤖</div>
          <div class="hud-ai-text" id="hudAIText"></div>
        </div>

        <!-- Equilibrium bars (shows during zoom-out and experiment) -->
        <div class="hud-eq" id="hudEq" style="display:none">
          <div class="hud-eq-title">⚖ Kesetimbangan Dinamis</div>
          <div class="hud-eq-row">
            <span class="hud-eq-label">Maju →</span>
            <div class="hud-eq-track"><div class="hud-eq-fill fwd" id="eqFwd" style="width:50%"></div></div>
            <span class="hud-eq-pct" id="eqFwdPct">50%</span>
          </div>
          <div class="hud-eq-row">
            <span class="hud-eq-label">← Balik</span>
            <div class="hud-eq-track"><div class="hud-eq-fill rev" id="eqRev" style="width:50%"></div></div>
            <span class="hud-eq-pct" id="eqRevPct">50%</span>
          </div>
        </div>
      </div>

      <!-- Experiment tools (right side, after quiz) -->
      <div class="exp-panel" id="expPanel" style="display:none">
        <div class="exp-label">Le Chatelier</div>
        <button class="exp-btn" data-tool="heat"><span class="exp-btn-icon">🔥</span>Naikkan Suhu</button>
        <button class="exp-btn" data-tool="cool"><span class="exp-btn-icon">❄️</span>Turunkan Suhu</button>
        <button class="exp-btn" data-tool="add"><span class="exp-btn-icon">➕</span>Tambah Reaktan</button>
        <button class="exp-btn" data-tool="compress"><span class="exp-btn-icon">📦</span>Naikkan Tekanan</button>
      </div>

      <!-- Challenge -->
      <div class="challenge-overlay" id="challengeOverlay" style="display:none">
        <div class="challenge-card">
          <div class="challenge-label">🎯 Challenge — Terapkan Le Chatelier</div>
          <div class="challenge-text">${misi.challenge_q}</div>
          <div class="challenge-opts" id="challengeOpts">
            ${misi.challenge_opts.map((o, i) =>
              `<button class="challenge-opt-btn" data-idx="${i}" data-correct="${o.correct}">${o.text}</button>`
            ).join('')}
          </div>
          <div class="reflection-explanation" id="challengeExp" style="display:none">${misi.challenge_explanation}</div>
        </div>
      </div>

      <!-- Reflection -->
      <div class="reflection-overlay" id="reflectionOverlay" style="display:none">
        <div class="reflection-card">
          <div class="reflection-icon">✨</div>
          <div class="reflection-title">Refleksi — Balik ke Pertanyaan Awal</div>
          <div class="reflection-question">${misi.reflection_q}</div>
          <div class="reflection-answer-btns" id="reflectionOpts">
            ${misi.reflection_opts.map((o, i) =>
              `<button class="reflection-ans" data-idx="${i}" data-correct="${o.correct}">${o.text}</button>`
            ).join('')}
          </div>
          <div class="reflection-explanation" id="reflectionExp" style="display:none">${misi.reflection_explanation}</div>
          <button class="btn-finish" id="btnFinish" style="display:none">✓ Selesai & Klaim XP</button>
        </div>
      </div>

    </div>`;

  // DOM refs
  const canvas     = container.querySelector('#webarCanvas');
  const videoEl    = container.querySelector('#webarVideo');
  const scanOvl    = container.querySelector('#scanOverlay');
  const hudLayer   = container.querySelector('#hudLayer');
  const hudStatus  = container.querySelector('#hudStatus');
  const hudForm    = container.querySelector('#hudForm');
  const hudFormVal = container.querySelector('#hudFormVal');
  const hudCounter = container.querySelector('#hudCounter');
  const hudCounterVal = container.querySelector('#hudCounterVal');
  const hudAI      = container.querySelector('#hudAI');
  const hudAIText  = container.querySelector('#hudAIText');
  const hudEq      = container.querySelector('#hudEq');
  const eqFwd      = container.querySelector('#eqFwd');
  const eqRev      = container.querySelector('#eqRev');
  const eqFwdPct   = container.querySelector('#eqFwdPct');
  const eqRevPct   = container.querySelector('#eqRevPct');
  const expPanel   = container.querySelector('#expPanel');
  const challOvl   = container.querySelector('#challengeOverlay');
  const reflOvl    = container.querySelector('#reflectionOverlay');

  // Resize canvas
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize(); window.addEventListener('resize', resize);

  // AI typewriter
  let typeTimer, reactionCount = 0;
  function setAI(text, show = true) {
    clearTimeout(typeTimer);
    if (!show || !text) { hudAI.style.display = 'none'; return; }
    hudAI.style.display = 'flex';
    hudAIText.textContent = '';
    let i = 0;
    const type = () => { if (i < text.length) { hudAIText.textContent += text[i++]; typeTimer = setTimeout(type, 22); } };
    type();
  }

  // Phase status labels
  const PHASE_LABEL = {
    [CHECKPOINT.START]:      '🚀 Memasuki Dunia Molekul...',
    [CHECKPOINT.OBSERVE]:    '🔵 Mengamati Pergerakan Kinetik',
    [CHECKPOINT.FAIL_BUMP]:  '⚠️ Tumbukan Gagal',
    [CHECKPOINT.SUCCESS]:    '⚡ Reaksi Terjadi! Ikatan Terbentuk',
    [CHECKPOINT.BREAK]:      '💥 Terurai Kembali!',
    [CHECKPOINT.LOOP]:       '🔄 Kesetimbangan Berlangsung...',
    [CHECKPOINT.ZOOMOUT]:    '🌍 Melihat Sistem Keseluruhan',
    [CHECKPOINT.EXPERIMENT]: '🧪 Eksperimen Le Chatelier',
    [CHECKPOINT.CHALLENGE]:  '🎯 Challenge',
    [CHECKPOINT.REFLECTION]: '✨ Refleksi',
    'TOOL':                  '⚗️ Pengamatan Efek',
  };

  // Global HUD update callbacks
  window._updateHUDForm = (isProduct, name) => {
    hudForm.style.display = 'flex';
    hudFormVal.textContent = isProduct ? `🟡 ${name} (Produk)` : `🔵 ${name} (Reaktan)`;
    hudFormVal.className = 'hud-form-value ' + (isProduct ? 'product' : 'reactant');
    if (isProduct || !isProduct) {
      reactionCount++;
      hudCounterVal.textContent = reactionCount + '×';
    }
  };
  window._updateHUDEq = (fwd, rev) => {
    eqFwd.style.width = fwd + '%'; eqFwdPct.textContent = fwd + '%';
    eqRev.style.width = rev + '%'; eqRevPct.textContent = rev + '%';
  };

  // Phase callback from engine
  function onPhase(phase, msg) {
    hudStatus.textContent = PHASE_LABEL[phase] || phase;
    hudStatus.classList.toggle('equilibrium', phase === CHECKPOINT.ZOOMOUT || phase === CHECKPOINT.EXPERIMENT);

    const isJourney = phase > CHECKPOINT.START && phase <= CHECKPOINT.LOOP;
    hudForm.style.display = isJourney ? 'flex' : 'none';
    hudCounter.style.display = isJourney ? 'flex' : 'none';
    
    hudEq.style.display = (phase >= CHECKPOINT.ZOOMOUT || phase === 'TOOL') ? '' : 'none';
    expPanel.style.display = (phase >= CHECKPOINT.EXPERIMENT || phase === 'TOOL') ? 'flex' : 'none';
    challOvl.style.display = (phase === CHECKPOINT.CHALLENGE) ? 'flex' : 'none';

    if (msg) setAI(msg, true);
    else setAI('', false);

    if (phase === CHECKPOINT.REFLECTION) {
      reflOvl.style.display = 'flex';
      challOvl.style.display = 'none';
    }
  }

  // Bind Quiz, Challenge & Reflection Buttons
  const quizOvl = container.querySelector('#quizOverlay');
  if (quizOvl) {
    quizOvl.querySelectorAll('.quiz-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const correct = btn.dataset.ans === 'C';
        btn.classList.add(correct ? 'correct' : 'wrong');
        if (!correct) return;
        setTimeout(() => { quizOvl.style.display = 'none'; sesi?.onQuizAnswered(); }, 1200);
      });
    });
  }

  challOvl.querySelectorAll('.challenge-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      challOvl.querySelectorAll('.challenge-opt-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const isCorrect = btn.dataset.correct === 'true';
      btn.classList.add(isCorrect ? 'correct' : 'wrong');
      challOvl.querySelector('#challengeExp').style.display = 'block';
      if (isCorrect) setTimeout(() => { sesi?.onChallengeAnswered(); }, 3500);
    });
  });
  reflOvl.querySelectorAll('.reflection-ans').forEach(btn => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.dataset.correct === 'true';
      btn.classList.add(isCorrect ? 'correct' : 'wrong');
      reflOvl.querySelector('#reflectionExp').style.display = 'block';
      if (isCorrect) container.querySelector('#btnFinish').style.display = 'flex';
    });
  });

  container.querySelector('#btnFinish').addEventListener('click', () => { hentikanSesiAR(); onKeluar({ completed: true }); });
  container.querySelector('#btnBack').addEventListener('click', () => { hentikanSesiAR(); onKeluar({ completed: false }); });

  // Experiment tools
  expPanel.querySelectorAll('.exp-btn').forEach(btn => {
    btn.addEventListener('click', () => { sesi?.triggerTool(btn.dataset.tool); });
  });

  // ATTACH MULAI BUTTON SYNCHRONOUSLY BEFORE AWAIT
  let journeyStarted = false;
  const btnMulai = container.querySelector('#btnMulaiAR');
  const startAR = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (journeyStarted) return;
    journeyStarted = true;
    scanOvl.style.display = 'none';
    hudLayer.style.display = '';
    reactionCount = -1; // will increment on first form update
    if (sesi) sesi.startJourney();
    else {
      // If sesi is not ready yet, wait for it
      const checkSesi = setInterval(() => {
        if (sesi) {
          clearInterval(checkSesi);
          sesi.startJourney();
        }
      }, 200);
    }
  };
  if (btnMulai) {
    btnMulai.addEventListener('click', startAR);
    btnMulai.addEventListener('touchstart', startAR, { passive: false });
  }

  // Launch engine
  const mode = await deteksiModeAR();
  try {
    const callbacks = { onPhase, onChallenge: () => {}, onReflection: () => {} };
    sesi = mode === 'webxr'
      ? await mulaiSesiWebXR(canvas, misiId, callbacks)
      : await mulaiSesiARjs(canvas, videoEl, misiId, callbacks);
  } catch(e) {
    console.error('AR session failed:', e);
    setAI('Gagal memuat dunia 3D. Coba refresh halaman.');
  }
}

export function hentikanSesiAR() {
  if (sesi) { sesi.hentikan?.(); sesi = null; }
  window._updateHUDForm = null;
  window._updateHUDEq = null;
  window.removeEventListener('resize', () => {});
}
