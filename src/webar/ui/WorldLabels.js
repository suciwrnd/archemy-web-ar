/* ==========================================================================
   WorldLabels.js — PhET-style CSS2D Labels in 3D Space

   Attaches HTML elements (labels, hints) to 3D coordinates.
   Ensures typography stays sharp and matches the DOM.
   ========================================================================== */

import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import * as THREE from 'three';

export class WorldLabels {
  constructor(scene, container) {
    this.scene = scene;
    
    this.renderer = new CSS2DRenderer();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.pointerEvents = 'none'; // Let clicks pass through to canvas
    container.appendChild(this.renderer.domElement);

    this._labels = new Map();
  }

  /**
   * Create a floating label above a 3D object
   * @param {string} id - Unique identifier
   * @param {THREE.Object3D} target - 3D object to track
   * @param {string} text - HTML content
   * @param {string} className - CSS class
   * @param {THREE.Vector3} offset - Offset from object center
   */
  addLabel(id, target, text, className = 'webar-world-label', offset = new THREE.Vector3(0, 0.6, 0)) {
    this.removeLabel(id);

    const div = document.createElement('div');
    div.className = className;
    div.innerHTML = text;
    // Base styles (can be overridden by CSS class)
    div.style.fontFamily = 'Poppins, sans-serif';
    div.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
    div.style.backdropFilter = 'blur(8px)';
    div.style.WebkitBackdropFilter = 'blur(8px)';
    div.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    div.style.color = '#fff';
    div.style.padding = '4px 12px';
    div.style.borderRadius = '20px';
    div.style.fontSize = '12px';
    div.style.transition = 'opacity 0.3s ease';

    const labelObj = new CSS2DObject(div);
    labelObj.position.copy(offset);
    
    target.add(labelObj);
    this._labels.set(id, { obj: labelObj, div, target });
  }

  removeLabel(id) {
    const label = this._labels.get(id);
    if (label) {
      label.target.remove(label.obj);
      this._labels.delete(id);
    }
  }

  clearAll() {
    for (const [id, label] of this._labels.entries()) {
      label.target.remove(label.obj);
    }
    this._labels.clear();
  }

  resize(w, h) {
    this.renderer.setSize(w, h);
  }

  update(camera) {
    this.renderer.render(this.scene, camera);
  }

  dispose() {
    this.clearAll();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
