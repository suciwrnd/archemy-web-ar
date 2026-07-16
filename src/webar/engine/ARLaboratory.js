/* ==========================================================================
   ARLaboratory.js — Interactive AR Laboratory Manager

   Handles:
   - WebXR Hit Testing for tabletop placement of the entire laboratory
   - Resizing the reaction chamber dynamically based on Volume adjustments
   ========================================================================== */

import * as THREE from 'three';
import { LabBuilder } from './LabBuilder.js';

export class ARLaboratory {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    
    // WebXR state
    this.isARSupported = false;
    this.session = null;
    this.labPlaced = false;
    this.reticle = null;
    this.hitTestSource = null;
    this.hitTestSourceRequested = false;

    // Build the laboratory group
    this.labGroup = LabBuilder.buildLaboratory();
    this.labGroup.visible = false;
    this.scene.add(this.labGroup);

    // References to interactive parts
    this.chamberGroup = this.labGroup.userData.chamber;
    this.chamberBaseBounds = this.chamberGroup.userData.bounds;
    this.currentVolume = 1.0; 

    // Callbacks
    this.onLabPlaced = null;
    this.onSessionEnded = null;

    this._initReticle();
  }

  _initReticle() {
    const ringGeo = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    this.reticle = new THREE.Mesh(ringGeo, ringMat);
    this.reticle.matrixAutoUpdate = false;
    this.reticle.visible = false;
    this.scene.add(this.reticle);
  }

  async checkSupport() {
    if (navigator.xr) {
      try {
        this.isARSupported = await navigator.xr.isSessionSupported('immersive-ar');
      } catch (e) {
        this.isARSupported = false;
      }
    }
    return this.isARSupported;
  }

  async startSession() {
    if (!this.isARSupported) {
      // Fallback: Place immediately at origin (for Desktop/OrbitControls)
      this.labGroup.position.set(0, -1, -3); 
      this._activateLab();
      return;
    }

    this.renderer.xr.enabled = true;
    try {
      this.session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: document.getElementById('meStage') || document.body }
      });
    } catch (err) {
      console.warn('WebXR requestSession failed:', err);
      alert('Gagal memulai kamera AR (mungkin izin ditolak atau tidak didukung). Menggunakan mode 3D standar.');
      this.renderer.xr.enabled = false;
      this.labGroup.position.set(0, -1, -3); 
      this._activateLab();
      return;
    }

    this.session.addEventListener('end', () => {
      if (this.onSessionEnded) this.onSessionEnded();
    });

    this.renderer.xr.setReferenceSpaceType('local');
    await this.renderer.xr.setSession(this.session);

    // Tap to place
    const controller = this.renderer.xr.getController(0);
    controller.addEventListener('select', () => this._onTap());
    this.scene.add(controller);
  }

  _onTap() {
    if (this.labPlaced || !this.reticle.visible) return;
    
    // Set lab position to reticle position
    this.labGroup.position.setFromMatrixPosition(this.reticle.matrix);
    // Point lab towards user
    const lookAtPos = new THREE.Vector3();
    this.camera.getWorldPosition(lookAtPos);
    lookAtPos.y = this.labGroup.position.y;
    this.labGroup.lookAt(lookAtPos);
    
    this._activateLab();
  }

  _activateLab() {
    this.labPlaced = true;
    this.reticle.visible = false;
    this.labGroup.visible = true;
    this.labGroup.scale.set(1, 1, 1);
    
    if (this.onLabPlaced) this.onLabPlaced(this.labGroup);
  }

  setVolume(volume) {
    this.currentVolume = volume;
    // Scale only the chamber (the glass box part)
    this.chamberGroup.scale.set(volume, 1.0, volume);
  }

  getBounds() {
    const v = this.currentVolume;
    const b = this.chamberBaseBounds;
    return {
      minX: b.minX * v,
      maxX: b.maxX * v,
      minY: b.minY,
      maxY: b.maxY,
      minZ: b.minZ * v,
      maxZ: b.maxZ * v
    };
  }

  update(frame) {
    if (!frame || this.labPlaced) return;

    const referenceSpace = this.renderer.xr.getReferenceSpace();
    const session = this.renderer.xr.getSession();

    if (!this.hitTestSourceRequested) {
      session.requestReferenceSpace('viewer').then((referenceSpace) => {
        session.requestHitTestSource({ space: referenceSpace }).then((source) => {
          this.hitTestSource = source;
        });
      });
      session.addEventListener('end', () => {
        this.hitTestSourceRequested = false;
        this.hitTestSource = null;
      });
      this.hitTestSourceRequested = true;
    }

    if (this.hitTestSource) {
      const hitTestResults = frame.getHitTestResults(this.hitTestSource);
      if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        this.reticle.visible = true;
        this.reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
      } else {
        this.reticle.visible = false;
      }
    }
  }

  dispose() {
    this.scene.remove(this.labGroup);
    if (this.reticle) {
      this.scene.remove(this.reticle);
    }
    if (this.session) {
      try {
        this.session.end();
      } catch (e) {}
      this.session = null;
    }
  }
}
