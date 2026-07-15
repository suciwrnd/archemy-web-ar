import {
  MISI_DATA, CHECKPOINT,
  deteksiModeAR, mulaiSesiARjs, mulaiSesiWebXR,
  requestSensorPermission, soundEngine
} from './webar.js';
import './webar.css';

let sesi = null;

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

export function renderPilihMisi(container, onPilihMisi, recommendedIds = [], onKeluar) {
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
        <button class="hud-back" id="btnBackPilih" style="position:relative; top:0; left:0; margin-bottom:16px;">← Keluar</button>
        <div class="pilih-misi-title">ARChemy Lab</div>
        <h1 class="pilih-misi-subtitle">Pilih Eksperimen</h1>
      </div>
      <div class="misi-grid">${cards}</div>
    </div>`;

  container.querySelectorAll('.misi-card').forEach(c => {
    c.addEventListener('click', () => onPilihMisi(c.dataset.misi));
  });
  
  if (onKeluar) {
    container.querySelector('#btnBackPilih').addEventListener('click', onKeluar);
  }
}

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

      <div class="fade-overlay" id="fadeOverlay"></div>

      <!-- Reality Portal Overlay -->
      <div class="scan-overlay" id="scanOverlay">
        <div class="scan-ring"></div>
        <div class="scan-title">Portal Siap</div>
        <button class="scan-start-btn" id="btnMulaiAR">Masuk ke Dunia Molekul</button>
      </div>

      <!-- HUD Layer -->
      <div class="hud-layer" id="hudLayer">
        <button class="hud-back" id="btnBack">← Keluar</button>

        <!-- Dynamic Equilibrium Chart (Appears only during ZoomOut & Experiment) -->
        <div class="hud-eq" id="hudEq" style="display:none">
          <div class="hud-eq-title">⚖️ KESETIMBANGAN DINAMIS</div>
          <div class="hud-eq-row">
            <div class="hud-eq-label">Reaktan</div>
            <div class="hud-eq-bar-wrap"><div class="hud-eq-bar reactant" id="eqRevBar" style="width:50%"></div></div>
            <div class="hud-eq-pct" id="eqRevPct">50%</div>
          </div>
          <div class="hud-eq-row">
            <div class="hud-eq-label">Produk</div>
            <div class="hud-eq-bar-wrap"><div class="hud-eq-bar product" id="eqFwdBar" style="width:50%"></div></div>
            <div class="hud-eq-pct" id="eqFwdPct">50%</div>
          </div>
        </div>

        <!-- Cinematic Subtitle (AI) -->
        <div class="hud-subtitle" id="hudSubtitle"></div>
      </div>

      <!-- Experiment tools -->
      <div class="exp-panel" id="expPanel" style="display:none">
        <div class="exp-label">Eksperimen (Le Chatelier)</div>
        <button class="exp-btn" data-tool="heat">🔥 Suhu Naik</button>
        <button class="exp-btn" data-tool="cool">❄️ Suhu Turun</button>
        <button class="exp-btn" data-tool="compress">📦 Tekanan Naik</button>
      </div>

      <!-- Challenge -->
      <div class="challenge-overlay" id="challengeOverlay" style="display:none">
        <div class="challenge-card">
          <div class="quiz-label">🎯 Challenge — Terapkan Le Chatelier</div>
          <div class="quiz-question">${misi.challenge_q}</div>
          <div class="quiz-options" id="challengeOpts">
            ${misi.challenge_opts.map((o, i) =>
              `<button class="quiz-btn challenge-opt-btn" data-idx="${i}" data-correct="${o.correct}">${o.text}</button>`
            ).join('')}
          </div>
          <div style="font-size: 13px; color: #94a3b8; margin-top: 10px; display:none" id="challengeExp">${misi.challenge_explanation}</div>
        </div>
      </div>

      <!-- Reflection -->
      <div class="reflection-overlay" id="reflectionOverlay" style="display:none">
        <div class="reflection-card">
          <div class="quiz-label">✨ Refleksi</div>
          <div class="quiz-question">${misi.reflection_q}</div>
          <div class="quiz-options" id="reflectionOpts">
            ${misi.reflection_opts.map((o, i) =>
              `<button class="quiz-btn reflection-ans" data-idx="${i}" data-correct="${o.correct}">${o.text}</button>`
            ).join('')}
          </div>
          <div style="font-size: 13px; color: #94a3b8; margin-top: 10px; display:none" id="reflectionExp">${misi.reflection_explanation}</div>
          <button class="btn-finish" id="btnFinish" style="display:none">✓ Selesai</button>
        </div>
      </div>

    </div>`;

  // DOM refs
  const canvas     = container.querySelector('#webarCanvas');
  const videoEl    = container.querySelector('#webarVideo');
  const scanOvl    = container.querySelector('#scanOverlay');
  const fadeOvl    = container.querySelector('#fadeOverlay');
  const hudLayer   = container.querySelector('#hudLayer');
  const hudSub     = container.querySelector('#hudSubtitle');
  const hudEq      = container.querySelector('#hudEq');
  const eqFwdBar   = container.querySelector('#eqFwdBar');
  const eqFwdPct   = container.querySelector('#eqFwdPct');
  const eqRevBar   = container.querySelector('#eqRevBar');
  const eqRevPct   = container.querySelector('#eqRevPct');
  const expPanel   = container.querySelector('#expPanel');
  const challOvl   = container.querySelector('#challengeOverlay');
  const reflOvl    = container.querySelector('#reflectionOverlay');

  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize(); window.addEventListener('resize', resize);

  // Subtitle Typewriter
  let typeTimer;
  function setSubtitle(text) {
    clearTimeout(typeTimer);
    if (!text) { hudSub.style.opacity = 0; return; }
    hudSub.style.opacity = 1;
    hudSub.textContent = '';
    let i = 0;
    const type = () => { if (i < text.length) { hudSub.textContent += text[i++]; typeTimer = setTimeout(type, 30); } };
    type();
  }

  // Engine callbacks
  window._updateHUDEq = (reactantPct, productPct) => {
    eqRevBar.style.width = reactantPct + '%'; eqRevPct.textContent = Math.round(reactantPct) + '%';
    eqFwdBar.style.width = productPct + '%';  eqFwdPct.textContent = Math.round(productPct) + '%';
  };

  function onPhase(phase, msg) {
    // Show chart only during macro view
    if (phase >= CHECKPOINT.ZOOMOUT && phase < CHECKPOINT.CHALLENGE) {
      hudEq.style.display = 'flex';
    } else {
      hudEq.style.display = 'none';
    }

    if (phase === CHECKPOINT.EXPERIMENT || phase === 'TOOL') {
      expPanel.style.display = 'flex';
      setSubtitle(msg || ''); 
    } else {
      expPanel.style.display = 'none';
      setSubtitle(msg || '');
    }

    if (phase === CHECKPOINT.CHALLENGE) {
      expPanel.style.display = 'none';
      challOvl.style.display = 'flex';
    }
    if (phase === CHECKPOINT.REFLECTION) {
      reflOvl.style.display = 'flex';
      challOvl.style.display = 'none';
    }
  }

  // Bind Challenge & Reflection Buttons
  challOvl.querySelectorAll('.challenge-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      challOvl.querySelectorAll('.challenge-opt-btn').forEach(b => b.classList.remove('selected'));
      btn.style.borderColor = '#3b82f6';
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
      if (isCorrect) container.querySelector('#btnFinish').style.display = 'block';
    });
  });

  container.querySelector('#btnFinish').addEventListener('click', () => { hentikanSesiAR(); onKeluar({ completed: true }); });
  container.querySelector('#btnBack').addEventListener('click', () => { hentikanSesiAR(); onKeluar({ completed: false }); });

  // Experiment tools
  expPanel.querySelectorAll('.exp-btn').forEach(btn => {
    btn.addEventListener('click', () => { sesi?.triggerTool(btn.dataset.tool); });
  });

  // ATTACH MULAI BUTTON SYNCHRONOUSLY
  let journeyStarted = false;
  const btnMulai = container.querySelector('#btnMulaiAR');
  const startAR = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (journeyStarted) return;
    journeyStarted = true;
    
    soundEngine.whoosh();
    scanOvl.style.display = 'none';
    fadeOvl.classList.add('blackout');
    
    setTimeout(() => {
      hudLayer.style.display = '';
      if (sesi) sesi.startJourney(); 
      fadeOvl.classList.remove('blackout');
    }, 2000);
  };
  
  if (btnMulai) {
    btnMulai.addEventListener('click', startAR);
    btnMulai.addEventListener('touchstart', startAR, { passive: false });
  }

  const mode = await deteksiModeAR();
  try {
    const callbacks = { onPhase, onChallenge: () => {}, onReflection: () => {} };
    sesi = mode === 'webxr'
      ? await mulaiSesiWebXR(canvas, misiId, callbacks)
      : await mulaiSesiARjs(canvas, videoEl, misiId, callbacks);
  } catch(e) {
    console.error('AR session failed:', e);
    setSubtitle('Gagal memuat dunia 3D. Coba refresh halaman.');
  }
}

export function hentikanSesiAR() {
  if (sesi) { sesi.hentikan?.(); sesi = null; }
  window._onPhase = null;
  window._updateHUDEq = null;
}
