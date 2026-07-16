/* ==========================================================================
   webar-page.js — Page-level launcher for the Molecular Learning Engine
   
   Public API (identical to original):
   - renderHook(container, misiId, onContinue)
   - renderPilihMisi(container, onPilihMisi, recommendedIds, onKeluar)
   - renderHalamanAR(container, misiId, onKeluar)
   - hentikanSesiAR()
   
   Internally uses MolecularEngine + REACTION_REGISTRY instead of
   the old hardcoded MISI_DATA + CoreEngine.
   ========================================================================== */

import {
  deteksiModeAR,
  mulaiSesiARjs,
  mulaiSesiWebXR,
  requestSensorPermission,
} from './engine/MolecularEngine.js';
import {
  REACTION_REGISTRY,
  getAllReactions,
  getReaction,
  resolveReactionId,
  MISI_DATA,
} from './reactions/ReactionConfig.js';
import { soundEngine } from './engine/SoundEngine.js';
import './webar-engine.css';

// Re-export MISI_DATA for main.js compatibility
export { MISI_DATA };

let _activeSesi = null;

// ---------------------------------------------------------------------------
// Hook Screen — Pre-AR curiosity hook
// ---------------------------------------------------------------------------
export function renderHook(container, misiId, onContinue) {
  const id     = resolveReactionId(misiId);
  const config = getReaction(id);
  if (!config) return;

  const hook    = config.missions?.[1]?.hook || '';
  const dots    = Array.from({ length: 16 }, () => {
    const top  = 5 + Math.random() * 85;
    const left = 5 + Math.random() * 85;
    const size = 4 + Math.random() * 10;
    const dur  = 4 + Math.random() * 5;
    const del  = Math.random() * 5;
    return `<div class="me-hook-float" style="top:${top}%;left:${left}%;width:${size}px;height:${size}px;animation-duration:${dur}s;animation-delay:${del}s"></div>`;
  }).join('');

  container.innerHTML = `
    <div class="me-hook">
      ${dots}
      <div class="me-hook-label">ARChemy — ${config.name}</div>
      <div class="me-hook-eq">${config.equation}</div>
      <h2 class="me-hook-question">"${hook}"</h2>
      <p class="me-hook-hint">Masuki dunia molekul dan temukan sendiri jawabannya.</p>
      <button class="me-hook-btn" id="hookContinue">
        <span>🔬</span> Selidiki
      </button>
    </div>
  `;

  container.querySelector('#hookContinue').addEventListener('click', () => {
    soundEngine.whoosh();
    onContinue();
  });
}

// ---------------------------------------------------------------------------
// Mission Selector — Grid of available reactions
// ---------------------------------------------------------------------------
export function renderPilihMisi(container, onPilihMisi, recommendedIds = [], onKeluar) {
  const done     = window.state?.viewedMisi || [];
  const reactions = getAllReactions();

  // Map new reaction IDs back to legacy misiIds for compatibility
  const legacyMap = { H2I2: 'misi1', NO2_N2O4: 'misi2', FeSCN: 'misi3', AceticAcid: 'misi4' };

  const cards = reactions.map(r => {
    const legacyId = legacyMap[r.id] || r.id;
    const isDone   = done.includes(legacyId) || done.includes(r.id);
    const isRec    = recommendedIds.includes(legacyId) || recommendedIds.includes(r.id);
    const accent   = r.accentColor ? `#${r.accentColor.toString(16).padStart(6, '0')}` : '#4fc3f7';

    return `
      <div class="me-misi-card" data-misi="${legacyId}" data-rid="${r.id}" tabindex="0" role="button" aria-label="${r.name}">
        <div class="me-card-accent" style="background:${accent}22;border-color:${accent}44"></div>
        <div class="me-card-header">
          <div class="me-card-num">${r.name.split(' ')[0]}</div>
          <div class="me-card-badges">
            ${isRec  ? '<span class="me-badge rec">AI Pick</span>' : ''}
            ${isDone ? '<span class="me-badge done">✓ Selesai</span>' : ''}
          </div>
        </div>
        <div class="me-card-name">${r.name}</div>
        <code class="me-card-eq">${r.equation}</code>
        <div class="me-card-tags">
          <span class="me-tag">${r.deltaH || 'netral'}</span>
          <span class="me-tag">${r.experiments?.length || 0} eksperimen</span>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="me-pilih-misi">
      <div class="me-pilih-header" style="position:relative;">
        ${onKeluar ? '<button class="me-btn-back" id="btnBackPilih">← Keluar</button>' : ''}
        
        <div style="position:absolute; top:0; right:0;">
          <button id="btnA11yPilih" style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:50%; width:36px; height:36px; color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
          </button>
        </div>

        <div class="me-pilih-brand">ARChemy Lab</div>
        <h1 class="me-pilih-title">Pilih Eksperimen</h1>
        <p class="me-pilih-sub">Setiap eksperimen mengikuti alur: Amati → Selidiki → Eksperimen → Refleksi</p>
      </div>
      
      <!-- Accessibility Settings Panel (Hidden by default) -->
      <div id="a11yPanelPilih" style="display:none; position:absolute; top:60px; right:24px; background:rgba(30, 27, 75, 0.95); backdrop-filter:blur(10px); border:1px solid rgba(192, 132, 252, 0.3); border-radius:16px; padding:16px; z-index:100; width:300px; color:#fff; box-shadow:0 8px 32px rgba(0,0,0,0.5);">
        <div style="font-size:14px; margin-bottom:12px; color:#c084fc; font-weight:bold;">Pengaturan Aksesibilitas (CUD)</div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; padding:12px; background:rgba(255,255,255,0.05); border-radius:8px;">
          <b style="font-size:13px;">Mode Buta Warna</b>
          <button id="btnToggleCbPilih" style="border:none; padding:4px 12px; border-radius:12px; cursor:pointer; font-weight:bold; font-size:12px;"></button>
        </div>

        <div id="cbPreviewContainerPilih" style="display:none; width:100%; text-align:left; padding:12px; background:rgba(0,0,0,0.2); border-radius:8px; margin-bottom:8px;">
          <b style="font-size: 13px; display: block; margin-bottom: 8px;">Pratinjau Visi (Filter Kamera)</b>
          <div style="display: flex; flex-direction:column; gap: 8px; font-size: 13px;" id="cbRadiosPilih">
            <label style="cursor:pointer; display:flex; align-items:center; gap:8px;"><input type="radio" name="cbPreviewPilih" value="normal"> Normal</label>
            <label style="cursor:pointer; display:flex; align-items:center; gap:8px;"><input type="radio" name="cbPreviewPilih" value="protanopia"> Protanopia</label>
            <label style="cursor:pointer; display:flex; align-items:center; gap:8px;"><input type="radio" name="cbPreviewPilih" value="deuteranopia"> Deuteranopia</label>
            <label style="cursor:pointer; display:flex; align-items:center; gap:8px;"><input type="radio" name="cbPreviewPilih" value="tritanopia"> Tritanopia</label>
          </div>
        </div>
      </div>

      <div class="me-misi-grid">${cards}</div>
    </div>
  `;

  container.querySelectorAll('.me-misi-card').forEach(card => {
    card.addEventListener('click', () => onPilihMisi(card.dataset.misi));
  });

  if (onKeluar) {
    const backBtn = container.querySelector('#btnBackPilih');
    if (backBtn) backBtn.addEventListener('click', onKeluar);
  }

  // A11y Settings Logic
  const a11yPanel = container.querySelector('#a11yPanelPilih');
  const btnA11y = container.querySelector('#btnA11yPilih');
  const btnToggleCb = container.querySelector('#btnToggleCbPilih');
  const previewContainer = container.querySelector('#cbPreviewContainerPilih');
  const radios = container.querySelectorAll('input[name="cbPreviewPilih"]');

  const updateA11yUI = () => {
    const isCb = window.state?.colorblind || false;
    const preview = window.state?.colorblindPreview || 'normal';
    
    btnToggleCb.style.background = isCb ? '#10b981' : '#d97706';
    btnToggleCb.style.color = '#fff';
    btnToggleCb.innerText = isCb ? 'Aktif' : 'Nonaktif';
    previewContainer.style.display = isCb ? 'block' : 'none';

    radios.forEach(r => {
      r.checked = (r.value === preview);
    });
  };

  btnA11y.addEventListener('click', () => {
    a11yPanel.style.display = a11yPanel.style.display === 'none' ? 'block' : 'none';
    if (a11yPanel.style.display === 'block') {
      updateA11yUI();
    }
  });

  btnToggleCb.addEventListener('click', () => {
    if (window.state) {
      window.state.colorblind = !window.state.colorblind;
      if (window.saveState) window.saveState();
      updateA11yUI();
    }
  });

  radios.forEach(r => {
    r.addEventListener('change', (e) => {
      if (window.state) {
        window.state.colorblindPreview = e.target.value;
        if (window.saveState) window.saveState();
      }
    });
  });

}

// ---------------------------------------------------------------------------
// AR Session Page — Full immersive experience
// ---------------------------------------------------------------------------
export async function renderHalamanAR(container, misiId, onKeluar) {
  const id     = resolveReactionId(misiId);
  const config = getReaction(id);
  if (!config) return;

  requestSensorPermission();

  container.innerHTML = `
    <div class="me-stage" id="meStage" style="background: #111;">
      <div class="me-viewport">
        <video id="meVideo" playsinline muted></video>
        <canvas id="meCanvas"></canvas>
      </div>
      <div class="me-fade" id="meFade"></div>
      
      <!-- Portal Entry Overlay -->
      <div class="me-portal-overlay" id="mePortal">
        <div class="me-portal-ring">
          <div class="me-portal-inner">
            <div class="me-portal-icon">✨</div>
          </div>
        </div>
        <div class="me-portal-title">${config.equation}</div>
        <p class="me-portal-sub">Sistem Kesetimbangan Molekuler</p>
        <button class="me-portal-btn" id="btnMasuk">Masuk ke Dunia Molekul (AR)</button>
        <button class="me-portal-btn" id="btnMasuk3D" style="margin-top: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); box-shadow: none;">Masuk Mode 3D (Tanpa Kamera)</button>
      </div>

      <!-- Landscape Lock for Mobile -->
      <div id="meLandscapeLock" class="me-landscape-lock">
        <div style="display:flex; flex-direction:column; align-items:center; gap:16px;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
            <path d="M12 18h.01"/>
          </svg>
          <div>
            <div style="font-size:18px; margin-bottom:8px">Mohon putar HP Anda (Landscape)</div>
            <div style="font-size:12px; color:#94a3b8; font-weight:400;">*Pastikan fitur "Auto-Rotate" / "Rotasi Otomatis" di HP Anda menyala</div>
          </div>
        </div>
      </div>
    </div>
  `;

  const canvas   = container.querySelector('#meCanvas');
  const videoEl  = container.querySelector('#meVideo');
  const portal   = container.querySelector('#mePortal');
  const fade     = container.querySelector('#meFade');
  const stage    = container.querySelector('#meStage');

  // Fit canvas to screen
  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  // Apply colorblind preview filter
  if (window.state?.colorblind && window.state?.colorblindPreview && window.state.colorblindPreview !== 'normal') {
    canvas.style.filter = `url(#${window.state.colorblindPreview})`;
  }

  // Initialize engine (loads before user taps — ready immediately)
  const mode = await deteksiModeAR();
  let sesi = null;

  try {
    const callbacks = {
      onPhase:   () => {},
      onExit:    () => {
        hentikanSesiAR();
        onKeluar({ completed: false });
      },
      onComplete: () => {
        // Mission complete callback — engine handles its own UI
      },
    };
    sesi = mode === 'webxr'
      ? await mulaiSesiWebXR(canvas, misiId, callbacks)
      : await mulaiSesiARjs(canvas, videoEl, misiId, callbacks);
    _activeSesi = sesi;
  } catch (err) {
    console.error('[ARPage] Engine init failed:', err);
    alert('Engine init failed: ' + err.message + '\n' + err.stack);
  }

  // Portal entry button
  let started = false;
  const enterAR = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (started) return;
    if (!sesi) {
      alert('Sesi belum siap atau gagal dimuat.');
      return;
    }
    started = true;

    // Must be called synchronously to satisfy WebXR requirements
    if (sesi) sesi.startSession();

    // Auto fullscreen for better immersion (requires user gesture, which this click provides)
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (e) {}

    // Fade out HTML portal
    portal.style.opacity = '0';
    portal.style.pointerEvents = 'none';
    setTimeout(() => {
      portal.style.display = 'none';
    }, 500);
  };

  const btn = container.querySelector('#btnMasuk');
  if (btn) {
    btn.addEventListener('click',      enterAR);
    btn.addEventListener('touchstart', enterAR, { passive: false });
  }

  const enter3D = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (started) return;
    if (!sesi) {
      alert('Sesi belum siap atau gagal dimuat.');
      return;
    }
    started = true;
    if (sesi) sesi.startSession(true); // true = force3D
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (e) {}
    portal.style.opacity = '0';
    portal.style.pointerEvents = 'none';
    setTimeout(() => {
      portal.style.display = 'none';
    }, 500);
  };

  const btn3D = container.querySelector('#btnMasuk3D');
  if (btn3D) {
    btn3D.addEventListener('click',      enter3D);
    btn3D.addEventListener('touchstart', enter3D, { passive: false });
  }
}

// ---------------------------------------------------------------------------
// Stop current AR session
// ---------------------------------------------------------------------------
export function hentikanSesiAR() {
  if (_activeSesi) {
    _activeSesi.hentikan?.();
    _activeSesi = null;
  }
}
