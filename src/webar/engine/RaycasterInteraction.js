/* ==========================================================================
   RaycasterInteraction.js — Tap/hover molecule selection
   
   Features:
   - Mouse + touch raycasting against swarm meshes
   - Hover: emissive highlight on mouse-over
   - Tap: select molecule → emit 'moleculeSelected'
   - Double-tap: deselect → emit 'moleculeDeselected'
   - Selection ring: a thin torus orbiting the selected molecule
   ========================================================================== */

import * as THREE from 'three';
import { setMoleculeHighlight } from './MoleculeBuilder.js';

export class RaycasterInteraction {
  /**
   * @param {THREE.Camera}  camera
   * @param {HTMLElement}   domElement
   * @param {THREE.Scene}   scene
   */
  constructor(camera, domElement, scene) {
    this.camera     = camera;
    this.domElement = domElement;
    this.scene      = scene;

    this._raycaster     = new THREE.Raycaster();
    this._mouse         = new THREE.Vector2();
    this._meshMap       = new Map(); // mesh -> particle
    this._equipMap      = new Map(); // mesh -> equipment object
    this._hoveredMesh   = null;
    this._selectedGroup = null;
    this._selectionRing = null;
    this._enabled       = true;

    // Callbacks
    this.onMoleculeSelected   = null; // (particle) => void
    this.onMoleculeDeselected = null; // () => void
    this.onEquipmentTap       = null; // (equipmentId) => void
    this.onBackgroundTap      = null; // () => void

    this._lastTap  = 0;
    this._tapTimer = null;

    this._buildSelectionRing();
    this._bindEvents();
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /** Register meshes for raycasting. meshMap: Map<THREE.Mesh, SwarmParticle> */
  registerMeshes(meshToParticleMap) {
    this._meshMap = meshToParticleMap;
  }

  /** Update meshes from simulator every frame */
  updateMeshList(simulator) {
    this._meshMap.clear();
    simulator.particles.forEach(p => {
      p.mesh.traverse(child => {
        if (child.isMesh) this._meshMap.set(child, p);
      });
    });
  }

  registerEquipment(labGroup) {
    this._equipMap.clear();
    labGroup.traverse(child => {
      if (child.isMesh && child.userData && child.userData.id) {
        this._equipMap.set(child, child.userData.id);
      }
    });
  }

  enable()  { this._enabled = true;  }
  disable() { this._enabled = false; }

  /** Update — call every frame for hover effects */
  update() {
    if (!this._enabled || this._meshMap.size === 0) return;

    const meshes = Array.from(this._meshMap.keys());
    this._raycaster.setFromCamera(this._mouse, this.camera);
    const hits = this._raycaster.intersectObjects(meshes, false);

    const hit = hits.length > 0 ? hits[0].object : null;

    if (hit !== this._hoveredMesh) {
      // Clear old hover
      if (this._hoveredMesh) {
        const oldParticle = this._meshMap.get(this._hoveredMesh);
        if (oldParticle && oldParticle.mesh !== this._selectedGroup) {
          setMoleculeHighlight(oldParticle.mesh, false);
        }
      }
      // Set new hover
      this._hoveredMesh = hit;
      if (hit) {
        const particle = this._meshMap.get(hit);
        if (particle) setMoleculeHighlight(particle.mesh, true);
        this.domElement.style.cursor = 'pointer';
      } else {
        this.domElement.style.cursor = '';
      }
    }

    // Animate selection ring
    if (this._selectionRing && this._selectedGroup) {
      const center = new THREE.Vector3();
      new THREE.Box3().setFromObject(this._selectedGroup).getCenter(center);
      this._selectionRing.position.copy(center);
      this._selectionRing.rotation.y += 0.02;
      this._selectionRing.rotation.x  = Math.sin(Date.now() * 0.001) * 0.3;
    }
  }

  // ── Selection Ring ─────────────────────────────────────────────────────────

  _buildSelectionRing() {
    const geo = new THREE.TorusGeometry(0.9, 0.03, 12, 50);
    const mat = new THREE.MeshBasicMaterial({
      color:       0x4fc3f7,
      transparent: true,
      opacity:     0.7,
    });
    this._selectionRing = new THREE.Mesh(geo, mat);
    this._selectionRing.visible = false;
    this.scene.add(this._selectionRing);
  }

  _showSelectionRing(group) {
    const box    = new THREE.Box3().setFromObject(group);
    const size   = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());
    this._selectionRing.scale.setScalar(size * 0.65);
    this._selectionRing.position.copy(center);
    this._selectionRing.visible = true;
  }

  _hideSelectionRing() {
    this._selectionRing.visible = false;
  }

  // ── Tap Handling ────────────────────────────────────────────────────────────

  _bindEvents() {
    const target = document.body;

    target.addEventListener('mousemove', (e) => {
      this._mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this._mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    target.addEventListener('click', (e) => {
      if (!this._enabled) return;
      if (e.target.closest('button, .me-misi-card, .me-pilih-header')) return;
      
      this._mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this._mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this._handleTap();
    });

    target.addEventListener('touchend', (e) => {
      if (!this._enabled) return;
      if (e.target.closest('button, .me-misi-card, .me-pilih-header')) return;
      
      const touch = e.changedTouches[0];
      this._mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
      this._mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

      const now = Date.now();
      if (now - this._lastTap < 300) {
        // Double tap -> deselect
        this._deselect();
      } else {
        this._handleTap();
      }
      this._lastTap = now;
    });
  }

  _handleTap() {
    const meshes = Array.from(this._meshMap.keys()).concat(Array.from(this._equipMap.keys()));
    this._raycaster.setFromCamera(this._mouse, this.camera);
    const hits = this._raycaster.intersectObjects(meshes, false);

    if (hits.length > 0) {
      const hit = hits[0].object;
      
      // Check if it's equipment
      if (this._equipMap.has(hit)) {
        this._deselect();
        if (this.onEquipmentTap) this.onEquipmentTap(this._equipMap.get(hit));
        return;
      }

      // Otherwise it's a molecule
      const particle = this._meshMap.get(hit);
      if (particle) {
        this._select(particle);
      }
    } else {
      this._deselect();
      if (this.onBackgroundTap) this.onBackgroundTap();
    }
  }

  _select(particle) {
    // Clear previous selection
    if (this._selectedGroup) {
      setMoleculeHighlight(this._selectedGroup, false);
    }
    this._selectedGroup = particle.mesh;
    setMoleculeHighlight(particle.mesh, true);
    this._showSelectionRing(particle.mesh);
    if (this.onMoleculeSelected) this.onMoleculeSelected(particle);
  }

  _deselect() {
    if (this._selectedGroup) {
      setMoleculeHighlight(this._selectedGroup, false);
    }
    this._selectedGroup = null;
    this._hideSelectionRing();
    if (this.onMoleculeDeselected) this.onMoleculeDeselected();
  }

  dispose() {
    this._meshMap.clear();
    this._equipMap.clear();
    this._hideSelectionRing();
    if (this._selectionRing) {
      this._selectionRing.geometry.dispose();
      this._selectionRing.material.dispose();
    }
  }
}
