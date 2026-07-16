/* ==========================================================================
   EnvironmentBuilder.js — Low-Poly Laboratory Environment

   Provides clean, bright, educational lighting (Hemisphere + Directional)
   without heavy PBR or photorealism. No SSAO or PMREM needed.
   ========================================================================== */

import * as THREE from 'three';

export class EnvironmentBuilder {
  constructor(scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;

    this._initLighting();
  }

  _initLighting() {
    // Clean bright ambient/hemisphere light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x94a3b8, 0.8);
    hemiLight.position.set(0, 5, 0);
    this.scene.add(hemiLight);

    // Directional light for soft, clean shadows (flat shading style)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = false; // Disable complex shadows to keep it low-poly flat
    this.scene.add(dirLight);
    
    // Optional secondary fill light
    const fillLight = new THREE.DirectionalLight(0xa5b4fc, 0.3);
    fillLight.position.set(-5, 5, -5);
    this.scene.add(fillLight);
  }

  update(dt) {
    // No animated environment needed for Low-Poly Lab
  }
}
