/* ==========================================================================
   CameraController.js — Low-Poly Laboratory Touch Controls

   Desktop: Mouse controls orbit the lab.
   AR: Physical movement is prioritized. Rotating the lab is disabled by default.
   Inspection Mode: When chamber is tapped, camera focuses and user can rotate/zoom molecules.
   ========================================================================== */

import * as THREE from 'three';

export class CameraController {
  constructor(camera, domElement) {
    this.camera     = camera;
    this.domElement = domElement;
    
    this._labGroup  = null;
    this._isAR      = false;
    this.allowRotation = false; // By default, disabled in AR

    // Inspection Mode State
    this.isInspecting = false;
    this._inspectTarget = null;
    this._baseCameraPos = new THREE.Vector3();
    this._baseCameraRot = new THREE.Quaternion();

    this._isDragging = false;
    this._prevX      = 0;
    this._prevY      = 0;
    this._pinchDist  = 0;

    this._bindEvents();
  }

  setLabGroup(labGroup) {
    this._labGroup = labGroup;
  }

  setARMode(isAR) {
    this._isAR = isAR;
    // On desktop, we always allow rotation. In AR, we don't (unless settings allow it later).
    this.allowRotation = !isAR;
  }

  enterInspectionMode(targetGroup) {
    this.isInspecting = true;
    this._inspectTarget = targetGroup;
    
    // Save base camera state (useful for desktop fallback orbit reset)
    this._baseCameraPos.copy(this.camera.position);
    this._baseCameraRot.copy(this.camera.quaternion);

    // In AR, we don't move the physical camera. We just let the user rotate the targetGroup directly.
    // Ensure targetGroup has its rotation reset
    this._inspectTarget.rotation.set(0, 0, 0);
  }

  exitInspectionMode() {
    this.isInspecting = false;
    if (this._inspectTarget) {
      this._inspectTarget.rotation.set(0, 0, 0);
      this._inspectTarget.scale.setScalar(1.0);
      this._inspectTarget = null;
    }
  }

  update(dt) {
    // Camera animation logic if needed
  }

  // ── Input Binding ───────────────────────────────────────────────────────

  _bindEvents() {
    const el = this.domElement;

    // Touch
    el.addEventListener('touchstart', (e) => {
      if (e.target.tagName === 'BUTTON') return;
      if (e.touches.length === 1) {
        this._isDragging = true;
        this._prevX = e.touches[0].clientX;
        this._prevY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        this._isDragging = false;
        this._pinchDist = this._getPinchDist(e);
      }
    }, { passive: false });

    el.addEventListener('touchmove', (e) => {
      if (this.isInspecting && this._inspectTarget) {
        this._handleInspectionMove(e);
        return;
      }

      if (!this._labGroup || !this.allowRotation) return;

      if (e.touches.length === 1 && this._isDragging) {
        const dx = e.touches[0].clientX - this._prevX;
        this._prevX = e.touches[0].clientX;
        // Rotate the lab group (simulate orbit)
        this._labGroup.rotation.y += dx * 0.01;
      } else if (e.touches.length === 2) {
        const newDist = this._getPinchDist(e);
        const delta   = (newDist - this._pinchDist) * 0.005;
        this._pinchDist = newDist;
        
        // Scale the lab group (simulate zoom)
        let scale = this._labGroup.scale.x + delta;
        scale = THREE.MathUtils.clamp(scale, 0.2, 5.0);
        this._labGroup.scale.setScalar(scale);
      }
    }, { passive: false });

    el.addEventListener('touchend', () => {
      this._isDragging = false;
    });

    // Mouse (Desktop fallback)
    el.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'BUTTON') return;
      this._isDragging = true;
      this._prevX = e.clientX;
      this._prevY = e.clientY;
    });

    el.addEventListener('mousemove', (e) => {
      if (this.isInspecting && this._inspectTarget) {
        if (this._isDragging) {
          const dx = e.clientX - this._prevX;
          const dy = e.clientY - this._prevY;
          this._prevX = e.clientX;
          this._prevY = e.clientY;
          this._inspectTarget.rotation.y += dx * 0.01;
          this._inspectTarget.rotation.x += dy * 0.01;
        }
        return;
      }

      if (!this._labGroup || !this.allowRotation || !this._isDragging) return;
      const dx = e.clientX - this._prevX;
      this._prevX = e.clientX;
      this._labGroup.rotation.y += dx * 0.01;
    });

    el.addEventListener('mouseup', () => {
      this._isDragging = false;
    });

    el.addEventListener('mouseleave', () => {
      this._isDragging = false;
    });

    el.addEventListener('wheel', (e) => {
      const delta = e.deltaY * -0.001;
      if (this.isInspecting && this._inspectTarget) {
        let scale = this._inspectTarget.scale.x + delta;
        scale = THREE.MathUtils.clamp(scale, 0.5, 3.0);
        this._inspectTarget.scale.setScalar(scale);
        return;
      }

      if (!this._labGroup || !this.allowRotation) return;
      let scale = this._labGroup.scale.x + delta;
      scale = THREE.MathUtils.clamp(scale, 0.2, 5.0);
      this._labGroup.scale.setScalar(scale);
    }, { passive: true });
  }

  _handleInspectionMove(e) {
    if (e.touches.length === 1 && this._isDragging) {
      const dx = e.touches[0].clientX - this._prevX;
      const dy = e.touches[0].clientY - this._prevY;
      this._prevX = e.touches[0].clientX;
      this._prevY = e.touches[0].clientY;
      this._inspectTarget.rotation.y += dx * 0.01;
      this._inspectTarget.rotation.x += dy * 0.01;
    } else if (e.touches.length === 2) {
      const newDist = this._getPinchDist(e);
      const delta   = (newDist - this._pinchDist) * 0.005;
      this._pinchDist = newDist;
      
      let scale = this._inspectTarget.scale.x + delta;
      scale = THREE.MathUtils.clamp(scale, 0.5, 3.0);
      this._inspectTarget.scale.setScalar(scale);
    }
  }

  _getPinchDist(e) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
