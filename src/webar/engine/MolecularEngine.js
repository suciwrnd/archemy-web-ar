/* ==========================================================================
   MolecularEngine.js — Master Orchestrator for WebAR

   Integrates:
   - WebXR Portal System
   - Reaction Simulator & Animator
   - Camera & Interaction
   - Ultra Minimal UI (PhET style)
   - World Labels (CSS2D)
   ========================================================================== */

import * as THREE from 'three';

import { getReaction, resolveReactionId } from '../reactions/ReactionConfig.js';
import { EnvironmentBuilder   } from './EnvironmentBuilder.js';
import { ReactionSimulator    } from './ReactionSimulator.js';
import { CameraController     } from './CameraController.js';
import { RaycasterInteraction } from './RaycasterInteraction.js';
import { MissionController, MISSION_STATE } from './MissionController.js';
import { soundEngine          } from './SoundEngine.js';
import { ARLaboratory         } from './ARLaboratory.js';
import { UIManager            } from '../ui/UIManager.js';
import { WorldLabels          } from '../ui/WorldLabels.js';

export class MolecularEngine {
  constructor(canvas, container, reactionId, callbacks = {}) {
    this.canvas     = canvas;
    this.container  = container;
    this.reactionId = resolveReactionId(reactionId);
    this.config     = getReaction(this.reactionId);
    this.callbacks  = callbacks;

    this._running   = false;
    this._clock     = new THREE.Clock();

    // The order is extremely important
    this._initScene();
    this._initRenderer();
    this._initEnvironment();
    
    this._initSimulator();
    this._initCamera();
    this._initRaycaster();
    
    this._initUI();
    this._initMissionController();
    this._bindMissionEvents();

    this._initARLaboratory();
  }

  // ── Setup ──────────────────────────────────────────────────────────────

  _initScene() {
    this._scene = new THREE.Scene();
    
    // Camera rig for orbital/drag rotation
    this._rig = new THREE.Group();
    this._scene.add(this._rig);

    this._camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this._rig.add(this._camera);
  }

  _initRenderer() {
    this._renderer = new THREE.WebGLRenderer({
      canvas:      this.canvas,
      alpha:       true, // Transparent background before portal entry
      antialias:   true,
      powerPreference: 'high-performance',
    });
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this._renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this._renderer.xr.enabled = true;

    this._onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.canvas.width  = w;
      this.canvas.height = h;
      if (this._renderer) this._renderer.setSize(w, h);
      if (this._camera) {
        this._camera.aspect = w / h;
        this._camera.updateProjectionMatrix();
      }
      if (this._composer) this._composer.setSize(w, h);
      if (this._worldLabels) this._worldLabels.resize(w, h);
    };
    window.addEventListener('resize', this._onResize);
    this._onResize();
  }

  // Post-processing removed for Low-Poly style performance

  _initEnvironment() {
    this._env = new EnvironmentBuilder(this._scene, this._renderer);
  }

  _initSimulator() {
    this._simulator = new ReactionSimulator(this._scene, this.config);
    this._simulator.on('equilibriumUpdate', (data) => {
      if (this.callbacks.onEquilibriumUpdate) {
        this.callbacks.onEquilibriumUpdate(data);
      }
    });
  }

  _initCamera() {
    this._camCtrl = new CameraController(this._camera, this.canvas);
  }

  _initRaycaster() {
    this._raycaster = new RaycasterInteraction(this._camera, this.canvas, this._scene);
    this._raycaster.onMoleculeSelected   = (particle) => this._onMoleculeSelected(particle);
    this._raycaster.onMoleculeDeselected = () => this._onMoleculeDeselected();
    this._raycaster.onBackgroundTap      = () => {};
    this._raycaster.disable();
  }

  _initUI() {
    this._worldLabels = new WorldLabels(this._scene, this.container);
    this._ui = new UIManager(this.container, this.config);
    this._ui.onBack = () => {
      soundEngine.click();
      this.hentikan();
      if (this.callbacks.onExit) this.callbacks.onExit();
    };
  }

  _initMissionController() {
    this._missionCtrl = new MissionController(this._simulator, this.config);
    this._missionCtrl.init({
      ui: this._ui,
      worldLabels: this._worldLabels,
      cameraCtrl: this._camCtrl
    });
  }

  _bindMissionEvents() {
    this._raycaster.onEquipmentTap = (eqId) => {
      if (this._missionCtrl._onEquipmentTap) {
        this._missionCtrl._onEquipmentTap(eqId);
      }
    };

    this._missionCtrl.on('missionChange', ({ next }) => {
      // Allow interaction in all missions since equipment tapping is the core flow now.
      this._raycaster.enable();

      if (this.callbacks.onPhase) {
        this.callbacks.onPhase(next, '');
      }
    });

    this._missionCtrl.on('missionComplete', () => {
      if (this.callbacks.onComplete) this.callbacks.onComplete();
    });
  }

  async _initARLaboratory() {
    this._laboratory = new ARLaboratory(this._renderer, this._scene, this._camera);
    const supported = await this._laboratory.checkSupport();
    
    this._laboratory.onLabPlaced = (labGroup) => {
      this._simulator.setChamber(this._laboratory);
      this._raycaster.registerEquipment(labGroup);
      this._camCtrl.setLabGroup(labGroup);
      this.startJourney();
    };
  }

  // ── Molecule Selection ───────────────────────────────────────────────────

  _onMoleculeSelected(particle) {
    const state = this._missionCtrl.state;

    if (window.state && window.state.colorblind && this._worldLabels) {
      const molId = particle.userData.moleculeId || 'Molekul';
      const isProduct = particle.userData.isProduct ? 'Produk' : 'Reaktan';
      const labelText = `<b>${molId}</b><br><span style="font-size:10px">${isProduct}</span>`;
      const labelId = `lbl_${particle.uuid}`;
      
      this._worldLabels.addLabel(labelId, particle, labelText, 'webar-world-label', new THREE.Vector3(0, 0.8, 0));
      
      setTimeout(() => {
        if (this._worldLabels) this._worldLabels.removeLabel(labelId);
      }, 3000);
    }

    if (state === MISSION_STATE.M1_LAB) {
      soundEngine.click();
      if (this._missionCtrl.onMission1MoleculeTap) {
        this._missionCtrl.onMission1MoleculeTap(particle);
      }
    } 
    else {
      soundEngine.click();
    }
  }

  _onMoleculeDeselected() {
    // Nothing needed
  }

  // ── Public API ─────────────────────────────────────────────────────────

  async startSession(force3D = false) {
    soundEngine.whoosh();
    this._camCtrl.setARMode(!force3D);
    this._renderer.setAnimationLoop((time, frame) => this._tick(time, frame));
    await this._laboratory.startSession(force3D);
  }

  startJourney() {
    this._running = true;
    
    setTimeout(() => {
      this._missionCtrl.startMission1();
    }, 1000);
  }

  _tick(time, frame) {
    const dt = Math.min(this._clock.getDelta(), 0.05);

    if (this._laboratory) this._laboratory.update(frame);

    if (this._running) {
      this._env.update(dt);
      this._simulator.update(dt);
      this._camCtrl.update(dt);
      this._raycaster.update();
      this._missionCtrl.update(dt);

      if (Math.floor(this._clock.elapsedTime * 3) % 3 === 0) {
        this._raycaster.updateMeshList(this._simulator);
      }
    }

    this._renderer.render(this._scene, this._camera);
    this._worldLabels.update(this._camera);
  }

  hentikan() {
    this._running = false;
    try {
      this._renderer.setAnimationLoop(null);
    } catch (e) {}

    try { if (this._simulator) this._simulator.dispose(); } catch (e) {}
    try { if (this._raycaster) this._raycaster.dispose(); } catch (e) {}
    try { if (this._ui) this._ui.destroy(); } catch (e) {}
    try { if (this._worldLabels) this._worldLabels.dispose(); } catch (e) {}
    try { if (this._laboratory) this._laboratory.dispose(); } catch (e) {}
    
    try {
      this._renderer.dispose();
      this._renderer.forceContextLoss();
    } catch (e) {}

    window.removeEventListener('resize', this._onResize);

    if (this._composer) this._composer.dispose();
  }
}

// ---------------------------------------------------------------------------
// Factory functions
// ---------------------------------------------------------------------------

export async function mulaiSesiARjs(canvas, videoEl, reactionId, callbacks) {
  if (videoEl?.srcObject) {
    videoEl.srcObject.getTracks().forEach(t => t.stop());
    videoEl.srcObject = null;
  }

  const container = canvas.parentElement || document.body;
  const engine    = new MolecularEngine(canvas, container, reactionId, callbacks);

  return {
    startSession: (force3D = false) => engine.startSession(force3D),
    hentikan:     () => engine.hentikan(),
  };
}

export async function mulaiSesiWebXR(canvas, reactionId, callbacks) {
  return mulaiSesiARjs(canvas, null, reactionId, callbacks);
}

export async function deteksiModeAR() {
  if (navigator.xr) {
    try {
      if (await navigator.xr.isSessionSupported('immersive-ar')) return 'webxr';
    } catch {}
  }
  return navigator.mediaDevices?.getUserMedia ? 'arjs' : 'unsupported';
}

export function requestSensorPermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission().catch(() => {});
  }
}
