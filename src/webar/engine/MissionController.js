/* ==========================================================================
   MissionController.js — Educational Flow Manager
   ========================================================================== */

import { soundEngine } from './SoundEngine.js';

export const MISSION_STATE = {
  INIT: 'INIT',
  M1_LAB: 'M1_LAB',
  M2_COLLISION: 'M2_COLLISION',
  M3_DYNAMIC: 'M3_DYNAMIC',
  M4_LE_CHAT: 'M4_LE_CHAT'
};

export class MissionController {
  constructor(simulator, config) {
    this.simulator = simulator;
    this.config = config;
    
    this.state = MISSION_STATE.INIT;
    this.ui = null;
    this.worldLabels = null;
    this.cameraCtrl = null;
    
    this._listeners = {};

    this._m1Progress = new Set();
  }

  init(deps) {
    this.ui = deps.ui;
    this.worldLabels = deps.worldLabels;
    this.cameraCtrl = deps.cameraCtrl;

    this.simulator.on('stepComplete', () => this._onStepComplete());
    this.simulator.on('reactionEvent', (data) => this._onReactionEvent(data));
    this.simulator.on('equilibriumUpdate', (data) => this._onEquilUpdate(data));
    this.simulator.on('collision', (data) => this._onCollision(data));
  }

  // -------------------------------------------------------------------------
  // Mission 1: Know Your Lab
  // -------------------------------------------------------------------------
  async startMission1() {
    this._setState(MISSION_STATE.M1_LAB);
    this.ui.missionTitle.innerText = `Misi 1: Kenali Lab Anda`;
    this.ui.missionSub.innerText = this.config.name;

    await this.simulator.setMissionLevel(1);
    this.simulator.setTemperature(0.2); 
    this.simulator.play();

    this.ui.showInstruction('👉 Sentuh berbagai peralatan di meja untuk mengenalinya.');
    this._m1Progress.clear();
  }

  _onEquipmentTap(eqId) {
    soundEngine.click();

    // M1 Logic
    if (this.state === MISSION_STATE.M1_LAB) {
      this._m1Progress.add(eqId);
      
      const names = {
        'heater': 'Pemanas',
        'piston': 'Piston Tekanan',
        'monitor': 'Layar Monitor',
        'shelf': 'Rak Reagen',
        'notebook': 'Buku Misi',
        'chamber': 'Wadah Reaksi'
      };

      this.ui.showInstruction(`Itu adalah ${names[eqId] || eqId}.`);

      if (eqId === 'chamber') {
        this.cameraCtrl.enterInspectionMode(this.simulator.chamber.chamberGroup);
        this.ui.showInspectionMode(() => {
          this.cameraCtrl.exitInspectionMode();
          if (this._m1Progress.size >= 3) {
            this.startMission2();
          } else {
            this.ui.showInstruction('Terus eksplorasi peralatan lainnya.');
          }
        });
      }
      return;
    }

    // Equipment Interactions (for all other missions)
    if (eqId === 'heater') {
      this.ui.showContextPanel('HEATER', `
        <div style="font-size:12px; margin-bottom:8px;">Atur Suhu Reaksi:</div>
        <input type="range" id="meTempSlider" min="0.5" max="2.0" step="0.1" value="${this.simulator.temperature}">
        <button id="meCloseCtx" style="margin-top:12px; padding:6px 12px; border-radius:12px; background:#c084fc; color:#fff; border:none;">Tutup</button>
      `);
      document.getElementById('meTempSlider').oninput = (e) => {
        this.simulator.setTemperature(parseFloat(e.target.value));
      };
      document.getElementById('meCloseCtx').onclick = () => this.ui.hideContextPanel();
    }
    else if (eqId === 'piston') {
      this.ui.showContextPanel('PISTON (VOLUME)', `
        <div style="font-size:12px; margin-bottom:8px;">Atur Volume Wadah:</div>
        <input type="range" id="meVolSlider" min="0.5" max="1.5" step="0.1" value="${this.simulator.chamber.currentVolume}">
        <button id="meCloseCtx" style="margin-top:12px; padding:6px 12px; border-radius:12px; background:#c084fc; color:#fff; border:none;">Tutup</button>
      `);
      document.getElementById('meVolSlider').oninput = (e) => {
        this.simulator.chamber.setVolume(parseFloat(e.target.value));
      };
      document.getElementById('meCloseCtx').onclick = () => this.ui.hideContextPanel();
    }
    else if (eqId === 'chamber') {
      this.cameraCtrl.enterInspectionMode(this.simulator.chamber.chamberGroup);
      this.ui.showInspectionMode(() => {
        this.cameraCtrl.exitInspectionMode();
      });
    }
    else if (eqId === 'shelf') {
      this.ui.showContextPanel('RAK REAGEN (KONSENTRASI)', `
        <div style="font-size:12px; margin-bottom:8px;">Tambah Molekul:</div>
        <div style="display:flex; gap:12px; margin-bottom:12px;">
          <button id="meAddReactant" style="padding:8px 16px; border-radius:12px; background:rgba(48, 80, 248, 0.5); border:1px solid #3050f8; color:#fff; cursor:pointer;">+ Reaktan</button>
          <button id="meAddProduct" style="padding:8px 16px; border-radius:12px; background:rgba(255, 32, 16, 0.5); border:1px solid #ff2010; color:#fff; cursor:pointer;">+ Produk</button>
        </div>
        <button id="meCloseCtx" style="padding:6px 12px; border-radius:12px; background:#c084fc; color:#fff; border:none; cursor:pointer;">Tutup</button>
      `);
      document.getElementById('meAddReactant').onclick = () => {
        this.simulator.addMolecules(false, 5); // Add 5 reactants
        soundEngine.whoosh();
      };
      document.getElementById('meAddProduct').onclick = () => {
        this.simulator.addMolecules(true, 5);  // Add 5 products
        soundEngine.whoosh();
      };
      document.getElementById('meCloseCtx').onclick = () => this.ui.hideContextPanel();
    }
    else if (eqId === 'monitor') {
      const ratio = this.simulator.getCurrentRatio();
      const isCb = window.state && window.state.colorblind;
      
      const reactBg = isCb ? 'repeating-linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.2) 10px, rgba(255,255,255,0) 10px, rgba(255,255,255,0) 20px)' : 'rgba(59, 130, 246, 0.8)';
      const prodBg = isCb ? 'repeating-radial-gradient(circle, rgba(255,255,255,0.4), rgba(255,255,255,0.4) 4px, rgba(255,255,255,0) 4px, rgba(255,255,255,0) 8px)' : 'rgba(16, 185, 129, 0.8)';

      this.ui.showContextPanel('LAYAR MONITOR (INDIKATOR)', `
        <div style="font-size:12px; margin-bottom:8px;">Rasio Kesetimbangan Saat Ini:</div>
        
        <div style="display:flex; width:200px; height:24px; border-radius:12px; overflow:hidden; border: 2px solid rgba(255,255,255,0.3); margin-bottom: 12px;">
          <div style="width:${ratio.reactant}%; background:${reactBg}; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:bold;">${ratio.reactant}%</div>
          <div style="width:${ratio.product}%; background:${prodBg}; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:bold;">${ratio.product}%</div>
        </div>
        
        <div style="font-size:12px; font-weight:bold; color:#cbd5e1; margin-bottom:12px; text-align:center;">
          <span style="display:inline-block; width:12px; height:12px; background:${reactBg}; margin-right:4px; vertical-align:middle; border:1px solid #fff;"></span> Reaktan
          &nbsp;&nbsp;
          <span style="display:inline-block; width:12px; height:12px; background:${prodBg}; margin-right:4px; vertical-align:middle; border:1px solid #fff;"></span> Produk
        </div>
        
        <button id="meCloseCtx" style="padding:6px 12px; border-radius:12px; background:#c084fc; color:#fff; border:none; cursor:pointer;">Tutup</button>
      `);
      document.getElementById('meCloseCtx').onclick = () => this.ui.hideContextPanel();
    }
  }

  // -------------------------------------------------------------------------
  // Mission 2: Collision Theory
  // -------------------------------------------------------------------------
  async startMission2() {
    this._setState(MISSION_STATE.M2_COLLISION);
    if (this.worldLabels) this.worldLabels.clearAll();
    this.ui.missionTitle.innerText = `Misi 2: Teori Tumbukan`;
    
    await this.simulator.setMissionLevel(2);
    this.simulator.play();
    this.simulator.setTemperature(0.2); // Start very slow

    this.ui.showInstruction('👉 Sentuh Heater untuk menaikkan suhu agar molekul bertumbukan.');
    this._m2CollisionCount = 0;
  }

  _onCollision(data) {
    if (this.state === MISSION_STATE.M2_COLLISION) {
      if (this.simulator.temperature > 0.5) {
        this._m2CollisionCount++;
        if (this._m2CollisionCount === 5) {
          this.ui.showInstruction('Bagus! Suhu tinggi meningkatkan energi kinetik dan jumlah tumbukan.');
          setTimeout(() => this.startMission3(), 5000);
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // Mission 3: Dynamic Equilibrium
  // -------------------------------------------------------------------------
  async startMission3() {
    this._setState(MISSION_STATE.M3_DYNAMIC);
    this.ui.missionTitle.innerText = `Misi 3: Kesetimbangan Dinamis`;
    
    await this.simulator.setMissionLevel(3);
    this.simulator.setTemperature(1.0);
    this.simulator.play();

    this.ui.showInstruction('👉 Biarkan reaksi berjalan. Sentuh Monitor untuk melihat grafik.');
    this._m3EquilTimer = 0;
    this._m3Asked = false;
  }

  _onEquilUpdate(data) {
    if (this.state === MISSION_STATE.M3_DYNAMIC && this.simulator.isPlaying) {
      this._m3EquilTimer += 0.016; 
      if (this._m3EquilTimer > 10.0 && !this._m3Asked) {
        this._m3Asked = true;
        this.ui.showInstruction('Kesetimbangan tercapai. Reaksi maju dan mundur berjalan dengan laju yang sama.');
        setTimeout(() => this.startMission4(), 5000);
      }
    }
  }

  // -------------------------------------------------------------------------
  // Mission 4: Le Chatelier
  // -------------------------------------------------------------------------
  async startMission4() {
    this._setState(MISSION_STATE.M4_LE_CHAT);
    this.ui.missionTitle.innerText = `Misi 4: Asas Le Chatelier`;
    
    await this.simulator.setMissionLevel(4);
    this.simulator.play();

    this.ui.showInstruction('👉 Gunakan Heater dan Piston untuk mengganggu kesetimbangan!');
  }

  _onReactionEvent(data) {
    // We can add effects here if needed
  }

  _onStepComplete() {}

  // -------------------------------------------------------------------------
  // Utils
  // -------------------------------------------------------------------------
  update(dt) {
    if (this.state === MISSION_STATE.M3_DYNAMIC && this.simulator.isPlaying) {
      this._onEquilUpdate(); 
    }
  }

  _setState(newState) {
    this.state = newState;
    this._emit('missionChange', { next: newState });
  }

  on(event, cb) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(cb);
  }

  _emit(event, data) {
    if (this._listeners[event]) {
      this._listeners[event].forEach(fn => fn(data));
    }
  }
}
