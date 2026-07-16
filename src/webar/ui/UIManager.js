/* ==========================================================================
   UIManager.js — Low-Poly Landscape UI

   Philosophy:
   - Landscape only. Max 20% screen usage.
   - Top Left: Mission & Prediction
   - Top Right: XP & Settings
   - Bottom Center: Floating Toolbar
   ========================================================================== */

import { MISSION_STATE } from '../engine/MissionController.js';

export class UIManager {
  constructor(container, config) {
    this.container = container;
    this.config    = config;
    
    this.uiLayer = document.createElement('div');
    this.uiLayer.className = 'webar-ui-layer';
    this.uiLayer.style.position = 'absolute';
    this.uiLayer.style.inset = '0';
    this.uiLayer.style.pointerEvents = 'none';
    this.uiLayer.style.fontFamily = 'Poppins, sans-serif';
    this.container.appendChild(this.uiLayer);

    this._buildTopLeft();
    this._buildTopRight();
    this._buildBottomToolbar();
    this._buildContextPanel(); // For tapping 3D equipment
    this._buildInstructionToast(); // Now used as contextual hints
    this._buildInspectionUI();

    this.onBack = null;
    this.onChallengeAnswer = null;
    
    // Specific tool bindings
    this.onToolbarClick = null; // (toolName) => void
  }

  // -------------------------------------------------------------------------
  // Top Left: Mission & Progress
  // -------------------------------------------------------------------------
  _buildTopLeft() {
    this.topLeft = document.createElement('div');
    this.topLeft.style.position = 'absolute';
    this.topLeft.style.top = '12px';
    this.topLeft.style.left = '12px';
    this.topLeft.style.pointerEvents = 'auto';
    this.topLeft.style.display = 'flex';
    this.topLeft.style.flexDirection = 'column';
    this.topLeft.style.gap = '8px';

    // Mission Card
    this.missionCard = document.createElement('div');
    this.missionCard.style.background = 'rgba(40, 40, 40, 0.6)';
    this.missionCard.style.backdropFilter = 'blur(12px)';
    this.missionCard.style.borderRadius = '12px';
    this.missionCard.style.padding = '10px 14px';
    this.missionCard.style.color = '#fff';
    this.missionCard.style.width = '200px';

    this.titleEl = document.createElement('div');
    this.titleEl.style.fontSize = '13px';
    this.titleEl.style.fontWeight = '700';
    this.titleEl.innerText = `Misi 1`;

    this.subEl = document.createElement('div');
    this.subEl.style.fontSize = '10px';
    this.subEl.style.color = '#cbd5e1';
    this.subEl.innerText = this.config.name;

    this.missionCard.appendChild(this.titleEl);
    this.missionCard.appendChild(this.subEl);

    // Mock Prediction Card (Visual only)
    const predCard = document.createElement('div');
    predCard.style.background = 'rgba(40, 40, 40, 0.6)';
    predCard.style.backdropFilter = 'blur(12px)';
    predCard.style.borderRadius = '12px';
    predCard.style.padding = '10px 14px';
    predCard.style.color = '#fff';
    predCard.style.width = '200px';
    predCard.innerHTML = `
      <div style="font-size:10px; margin-bottom:8px">Amati peralatan lab. Ketuk setiap objek untuk mempelajarinya.</div>
      <div style="font-size:9px; color:#cbd5e1; margin-bottom:2px">Aksi Anda</div>
      <div style="font-size:11px; font-weight:600">Eksplorasi Lab</div>
    `;

    // Mock Progress Card (Visual only)
    const progCard = document.createElement('div');
    progCard.style.background = 'rgba(40, 40, 40, 0.6)';
    progCard.style.backdropFilter = 'blur(12px)';
    progCard.style.borderRadius = '12px';
    progCard.style.padding = '10px 14px';
    progCard.style.color = '#fff';
    progCard.style.width = '200px';
    progCard.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-size:10px; margin-bottom:6px">
        <span>Progres</span>
        <span>0/5</span>
      </div>
      <div style="height:6px; background:rgba(255,255,255,0.2); border-radius:3px">
        <div style="width:20%; height:100%; background:#8b5cf6; border-radius:3px"></div>
      </div>
    `;

    this.topLeft.appendChild(this.missionCard);
    this.topLeft.appendChild(predCard);
    this.topLeft.appendChild(progCard);
    this.uiLayer.appendChild(this.topLeft);
  }

  get missionTitle() { return this.titleEl; }
  get missionSub() { return this.subEl; }

  // -------------------------------------------------------------------------
  // Top Right: XP & Menu
  // -------------------------------------------------------------------------
  _buildTopRight() {
    this.topRight = document.createElement('div');
    this.topRight.style.position = 'absolute';
    this.topRight.style.top = '16px';
    this.topRight.style.right = '16px';
    this.topRight.style.pointerEvents = 'auto';
    this.topRight.style.display = 'flex';
    this.topRight.style.gap = '8px';
    this.topRight.style.alignItems = 'center';

    const createPill = (icon, text, bg) => {
      const pill = document.createElement('div');
      pill.style.background = bg;
      pill.style.borderRadius = '20px';
      pill.style.padding = '6px 12px';
      pill.style.color = '#fff';
      pill.style.fontSize = '12px';
      pill.style.fontWeight = '600';
      pill.style.display = 'flex';
      pill.style.alignItems = 'center';
      pill.style.gap = '6px';
      pill.innerHTML = `<span style="font-size:14px">${icon}</span> ${text}`;
      return pill;
    };

    const xpPill = createPill('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>', '1250', 'rgba(168, 85, 247, 0.5)'); // Purple
    const goldPill = createPill('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>', '230', 'rgba(234, 179, 8, 0.5)'); // Gold

    // Fullscreen Button
    const fsBtn = document.createElement('button');
    fsBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
    fsBtn.style.background = 'rgba(255,255,255,0.1)';
    fsBtn.style.border = '1px solid rgba(255,255,255,0.2)';
    fsBtn.style.borderRadius = '50%';
    fsBtn.style.width = '32px';
    fsBtn.style.height = '32px';
    fsBtn.style.color = '#fff';
    fsBtn.style.cursor = 'pointer';
    fsBtn.style.display = 'flex';
    fsBtn.style.alignItems = 'center';
    fsBtn.style.justifyContent = 'center';
    fsBtn.onclick = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.warn(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    };

    const menuBtn = document.createElement('button');
    // Exit / Close Icon (X)
    menuBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    menuBtn.style.background = 'rgba(239, 68, 68, 0.8)'; // Red background to make it obvious

    menuBtn.style.border = '1px solid rgba(255,255,255,0.2)';
    menuBtn.style.borderRadius = '50%';
    menuBtn.style.width = '32px';
    menuBtn.style.height = '32px';
    menuBtn.style.color = '#fff';
    menuBtn.style.cursor = 'pointer';
    menuBtn.style.display = 'flex';
    menuBtn.style.alignItems = 'center';
    menuBtn.style.justifyContent = 'center';
    menuBtn.onclick = () => { if (this.onBack) this.onBack(); };

    this.topRight.appendChild(xpPill);
    this.topRight.appendChild(goldPill);
    this.topRight.appendChild(fsBtn);
    this.topRight.appendChild(menuBtn);
    this.uiLayer.appendChild(this.topRight);
  }

  // -------------------------------------------------------------------------
  // Bottom Toolbar
  // -------------------------------------------------------------------------
  _buildBottomToolbar() {
    this.toolbar = document.createElement('div');
    this.toolbar.style.position = 'absolute';
    this.toolbar.style.bottom = '16px';
    this.toolbar.style.left = '50%';
    this.toolbar.style.transform = 'translateX(-50%)';
    this.toolbar.style.pointerEvents = 'auto';
    this.toolbar.style.background = 'rgba(15, 23, 42, 0.7)';
    this.toolbar.style.backdropFilter = 'blur(12px)';
    this.toolbar.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    this.toolbar.style.borderRadius = '24px';
    this.toolbar.style.display = 'flex';
    this.toolbar.style.padding = '8px 16px';
    this.toolbar.style.gap = '20px';

    const tools = [
      { id: 'interact', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/></svg>', label: 'Interaksi' },
      { id: 'observe', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>', label: 'Amati' },
      { id: 'graph', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 14l5-5 4 4 5-5"/></svg>', label: 'Grafik' },
      { id: 'hint', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>', label: 'Petunjuk' },
      { id: 'ai', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>', label: 'AI Tutor' }
    ];

    tools.forEach((t, i) => {
      const btn = document.createElement('button');
      btn.style.background = 'transparent';
      btn.style.border = 'none';
      btn.style.color = i === 0 ? '#c084fc' : '#94a3b8'; // Highlight first tool
      btn.style.display = 'flex';
      btn.style.flexDirection = 'column';
      btn.style.alignItems = 'center';
      btn.style.gap = '4px';
      btn.style.cursor = 'pointer';
      
      const icon = document.createElement('span');
      icon.innerHTML = t.icon;
      
      const label = document.createElement('span');
      label.style.fontSize = '10px';
      label.innerText = t.label;

      btn.appendChild(icon);
      btn.appendChild(label);
      
      btn.onclick = () => {
        // Simple visual toggle for active state
        Array.from(this.toolbar.children).forEach(c => c.style.color = '#94a3b8');
        btn.style.color = '#c084fc';
        if (this.onToolbarClick) this.onToolbarClick(t.id);
      };

      this.toolbar.appendChild(btn);
    });

    this.uiLayer.appendChild(this.toolbar);
  }

  // -------------------------------------------------------------------------
  // Context Panel (3D Object Tap)
  // -------------------------------------------------------------------------
  _buildContextPanel() {
    this.contextPanel = document.createElement('div');
    this.contextPanel.style.position = 'absolute';
    this.contextPanel.style.bottom = '100px';
    this.contextPanel.style.left = '50%';
    this.contextPanel.style.transform = 'translateX(-50%)';
    this.contextPanel.style.pointerEvents = 'auto';
    this.contextPanel.style.background = 'rgba(30, 27, 75, 0.85)'; // Dark purple
    this.contextPanel.style.backdropFilter = 'blur(10px)';
    this.contextPanel.style.border = '1px solid rgba(192, 132, 252, 0.3)';
    this.contextPanel.style.borderRadius = '16px';
    this.contextPanel.style.padding = '16px 24px';
    this.contextPanel.style.color = '#fff';
    this.contextPanel.style.display = 'none';
    this.contextPanel.style.flexDirection = 'column';
    this.contextPanel.style.alignItems = 'center';
    this.contextPanel.style.gap = '12px';

    this.contextTitle = document.createElement('div');
    this.contextTitle.style.fontSize = '14px';
    this.contextTitle.style.fontWeight = '600';
    this.contextTitle.style.color = '#c084fc';

    this.contextContent = document.createElement('div');

    this.contextPanel.appendChild(this.contextTitle);
    this.contextPanel.appendChild(this.contextContent);
    this.uiLayer.appendChild(this.contextPanel);
  }

  showContextPanel(title, innerHTML) {
    this.contextTitle.innerText = title;
    this.contextContent.innerHTML = innerHTML;
    this.contextPanel.style.display = 'flex';
  }

  hideContextPanel() {
    this.contextPanel.style.display = 'none';
  }

  // -------------------------------------------------------------------------
  // Instruction Toast (Top Center Pill)
  // -------------------------------------------------------------------------
  _buildInstructionToast() {
    this.instructionToast = document.createElement('div');
    this.instructionToast.style.position = 'absolute';
    this.instructionToast.style.top = '16px';
    this.instructionToast.style.left = '50%';
    this.instructionToast.style.transform = 'translateX(-50%)';
    this.instructionToast.style.background = 'rgba(107, 70, 193, 0.8)'; // Purple from mockup
    this.instructionToast.style.backdropFilter = 'blur(8px)';
    this.instructionToast.style.color = '#fff';
    this.instructionToast.style.padding = '8px 20px';
    this.instructionToast.style.borderRadius = '24px';
    this.instructionToast.style.fontSize = '12px';
    this.instructionToast.style.fontWeight = '600';
    this.instructionToast.style.pointerEvents = 'none';
    this.instructionToast.style.display = 'block'; // Show by default
    this.instructionToast.innerText = 'Ketuk objek untuk berinteraksi';
    this.uiLayer.appendChild(this.instructionToast);
  }

  showInstruction(text) {
    this.instructionToast.innerText = text;
  }

  hideInstruction() {
    this.instructionToast.innerText = 'Ketuk objek untuk berinteraksi';
  }

  // -------------------------------------------------------------------------
  // Question Subtitle (For AI Questions)
  // -------------------------------------------------------------------------
  _buildQuestionSubtitle() {
    this.questionContainer = document.createElement('div');
    this.questionContainer.style.position = 'absolute';
    this.questionContainer.style.top = '50%';
    this.questionContainer.style.left = '50%';
    this.questionContainer.style.transform = 'translate(-50%, -50%)';
    this.questionContainer.style.pointerEvents = 'auto';
    this.questionContainer.style.background = 'rgba(10, 15, 30, 0.9)';
    this.questionContainer.style.border = '1px solid rgba(255, 255, 255, 0.15)';
    this.questionContainer.style.borderRadius = '16px';
    this.questionContainer.style.padding = '20px 32px';
    this.questionContainer.style.color = '#fff';
    this.questionContainer.style.textAlign = 'center';
    this.questionContainer.style.display = 'none';
    this.questionContainer.style.flexDirection = 'column';
    this.questionContainer.style.alignItems = 'center';
    this.questionContainer.style.gap = '16px';
    this.questionContainer.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';

    this.questionText = document.createElement('div');
    this.questionText.style.fontSize = '16px';
    this.questionText.style.fontWeight = '500';

    this.choicesContainer = document.createElement('div');
    this.choicesContainer.style.display = 'flex';
    this.choicesContainer.style.gap = '12px';
    this.choicesContainer.style.flexWrap = 'wrap';
    this.choicesContainer.style.justifyContent = 'center';

    this.questionContainer.appendChild(this.questionText);
    this.questionContainer.appendChild(this.choicesContainer);
    this.uiLayer.appendChild(this.questionContainer);
  }

  showQuestion(text, choices = []) {
    this.questionContainer.style.display = 'flex';
    this.questionText.innerText = text;
    this.choicesContainer.innerHTML = '';

    choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.innerText = choice.label;
      btn.style.background = 'rgba(168, 85, 247, 0.2)'; // Purple tint
      btn.style.border = '1px solid rgba(192, 132, 252, 0.4)';
      btn.style.color = '#fff';
      btn.style.padding = '8px 20px';
      btn.style.borderRadius = '20px';
      btn.style.fontSize = '14px';
      btn.style.cursor = 'pointer';
      btn.style.transition = 'all 0.2s';
      btn.onclick = () => {
        if (this.onChallengeAnswer) this.onChallengeAnswer(choice.id);
      };
      this.choicesContainer.appendChild(btn);
    });
  }

  hideQuestion() {
    this.questionContainer.style.display = 'none';
  }

  // -------------------------------------------------------------------------
  // Inspection Mode UI
  // -------------------------------------------------------------------------
  _buildInspectionUI() {
    this.inspectionUI = document.createElement('div');
    this.inspectionUI.style.position = 'absolute';
    this.inspectionUI.style.inset = '0';
    this.inspectionUI.style.pointerEvents = 'none';
    this.inspectionUI.style.display = 'none';
    this.inspectionUI.style.flexDirection = 'column';
    this.inspectionUI.style.justifyContent = 'space-between';
    this.inspectionUI.style.padding = '24px';
    
    // Top bar for inspection
    const topBar = document.createElement('div');
    topBar.style.display = 'flex';
    topBar.style.justifyContent = 'space-between';
    topBar.style.alignItems = 'flex-start';
    topBar.style.pointerEvents = 'auto';

    const title = document.createElement('div');
    title.innerText = 'Mode Inspeksi Molekul';
    title.style.color = '#fff';
    title.style.fontSize = '18px';
    title.style.fontWeight = '600';
    title.style.background = 'rgba(15, 23, 42, 0.8)';
    title.style.padding = '8px 16px';
    title.style.borderRadius = '12px';

    this.exitInspectBtn = document.createElement('button');
    this.exitInspectBtn.innerText = 'Kembali ke Lab';
    this.exitInspectBtn.style.background = '#c084fc';
    this.exitInspectBtn.style.color = '#fff';
    this.exitInspectBtn.style.border = 'none';
    this.exitInspectBtn.style.padding = '10px 20px';
    this.exitInspectBtn.style.borderRadius = '20px';
    this.exitInspectBtn.style.fontWeight = '600';
    this.exitInspectBtn.style.cursor = 'pointer';

    topBar.appendChild(title);
    topBar.appendChild(this.exitInspectBtn);
    this.inspectionUI.appendChild(topBar);
    this.uiLayer.appendChild(this.inspectionUI);
  }

  showInspectionMode(onExit) {
    this.inspectionUI.style.display = 'flex';
    // Hide main UI
    this.topLeft.style.display = 'none';
    this.topRight.style.display = 'none';
    this.toolbar.style.display = 'none';
    
    this.exitInspectBtn.onclick = () => {
      this.hideInspectionMode();
      if (onExit) onExit();
    };
  }

  hideInspectionMode() {
    this.inspectionUI.style.display = 'none';
    this.topLeft.style.display = 'flex';
    this.topRight.style.display = 'flex';
    this.toolbar.style.display = 'flex';
  }

  destroy() {
    if (this.uiLayer && this.uiLayer.parentNode) {
      this.uiLayer.parentNode.removeChild(this.uiLayer);
    }
  }
}
