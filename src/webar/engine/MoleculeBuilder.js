/* ==========================================================================
   MoleculeBuilder.js — High-quality PBR Molecule Factory
   
   Architecture:
   - MoleculeAsset interface: { id, glbPath?, atomDefs }
   - If glbPath exists AND load succeeds → use GLB (future-proof)
   - Otherwise → build procedural ball-and-stick with PBR materials
   
   Procedural molecules:
   - CPK color convention (O=red, N=blue, C=gray, H=white, Cl=green, etc.)
   - MeshPhysicalMaterial with clearcoat, metalness, emissive glow
   - Realistic bond angles and lengths per molecule definition
   - High-poly spheres (48 segments) and metallic bond cylinders
   - Per-atom PointLight for soft glow (pooled, max 2 per molecule)
   ========================================================================== */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ---------------------------------------------------------------------------
// CPK Color & Radius Table
// ---------------------------------------------------------------------------
export const CPK = {
  H:  { color: 0xffffff, emissive: 0x000000, r: 0.18 },
  C:  { color: 0x303030, emissive: 0x000000, r: 0.24 },
  N:  { color: 0x3050f8, emissive: 0x000000, r: 0.22 },
  O:  { color: 0xff2010, emissive: 0x000000, r: 0.20 },
  F:  { color: 0x90e050, emissive: 0x000000, r: 0.19 },
  S:  { color: 0xffff30, emissive: 0x000000, r: 0.26 },
  Cl: { color: 0x1ff01f, emissive: 0x000000, r: 0.25 },
  Br: { color: 0xa62929, emissive: 0x000000, r: 0.28 },
  I:  { color: 0x940094, emissive: 0x000000, r: 0.30 },
  Fe: { color: 0xe06633, emissive: 0x000000, r: 0.28 },
  Ag: { color: 0xc0c0d8, emissive: 0x000000, r: 0.27 },
  Na: { color: 0xab5cf2, emissive: 0x000000, r: 0.26 },
  K:  { color: 0x8f40d4, emissive: 0x000000, r: 0.28 },
  Ca: { color: 0x3dff00, emissive: 0x000000, r: 0.26 },
  Mg: { color: 0x8aff00, emissive: 0x000000, r: 0.24 },
  // Fallback
  X:  { color: 0x888888, emissive: 0x000000, r: 0.22 },
};

// ---------------------------------------------------------------------------
// Geometry & Material Cache (singleton pools)
// ---------------------------------------------------------------------------
const _geoCache  = new Map();
const _matCache  = new Map();
const _bondGeo   = new THREE.CylinderGeometry(0.045, 0.045, 1, 20, 1);
let   _bondMat   = null;

function getSphereGeo(r) {
  const key = r.toFixed(3);
  if (!_geoCache.has(key)) {
    _geoCache.set(key, new THREE.SphereGeometry(r, 48, 36));
  }
  return _geoCache.get(key);
}

function generatePatternTexture(moleculeId, baseColorHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  // Fill base color
  ctx.fillStyle = '#' + baseColorHex.toString(16).padStart(6, '0');
  ctx.fillRect(0, 0, 64, 64);
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; 
  
  if (moleculeId === 'NO2' || moleculeId === 'HI') {
    // Diagonal stripes
    for (let i = -64; i < 128; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 64, 64);
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.stroke();
    }
  } else if (moleculeId === 'N2O4' || moleculeId === 'I2') {
    // Dots
    for (let x = 8; x < 64; x += 16) {
      for (let y = 8; y < 64; y += 16) {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (moleculeId === 'NH3' || moleculeId === 'FeSCN' || moleculeId === 'CH3COOH') {
    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 64; i += 16) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 64); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(64, i); ctx.stroke();
    }
  } else if (moleculeId === 'H2' || moleculeId === 'N2' || moleculeId === 'AgCl') {
    // Cross
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(64, 64); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(64, 0); ctx.lineTo(0, 64); ctx.stroke();
  } else {
    // Generic dash for others
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(16, 28, 32, 8);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

function getAtomMat(element, moleculeId = 'UNKNOWN') {
  const isColorblind = typeof window !== 'undefined' && window.state && window.state.colorblind;
  const key = isColorblind ? `${element}_${moleculeId}_cb` : element;

  if (!_matCache.has(key)) {
    const cfg = CPK[element] || CPK.X;
    const matOpts = {
      color:              cfg.color,
      emissive:           cfg.emissive,
      emissiveIntensity:  0.25,
      metalness:          0.15,
      roughness:          0.25,
      clearcoat:          1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity:    1.8,
      reflectivity:       0.8,
    };

    if (isColorblind) {
      matOpts.map = generatePatternTexture(moleculeId, cfg.color);
      matOpts.color = 0xffffff; // Let the texture provide the base color
    }

    _matCache.set(key, new THREE.MeshPhysicalMaterial(matOpts));
  }
  return _matCache.get(key);
}

function getBondMat() {
  if (!_bondMat) {
    _bondMat = new THREE.MeshPhysicalMaterial({
      color:              0xd0d8e0,
      metalness:          0.85,
      roughness:          0.15,
      clearcoat:          0.9,
      clearcoatRoughness: 0.1,
      envMapIntensity:    1.5,
    });
  }
  return _bondMat;
}

// ---------------------------------------------------------------------------
// Bond helper — cylinder between two 3D points
// ---------------------------------------------------------------------------
function makeBond(from, to) {
  const dir  = new THREE.Vector3().subVectors(to, from);
  const len  = dir.length();
  if (len < 0.01) return null;

  const bond = new THREE.Mesh(_bondGeo, getBondMat());
  bond.scale.y = len;
  bond.position.copy(from).lerp(to, 0.5);
  bond.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize()
  );
  return bond;
}

// ---------------------------------------------------------------------------
// Procedural Molecule Builder
// ---------------------------------------------------------------------------
/**
 * Build a procedural ball-and-stick molecule from an atom definition array.
 * @param {Array} atomDefs  - Array of [element, x, y, z] tuples
 * @param {string} id       - Molecule identifier (for userData)
 * @returns {THREE.Group}
 */
export function buildProceduralMolecule(atomDefs, id = 'MOL') {
  const group = new THREE.Group();
  group.userData.moleculeId = id;
  group.userData.isProcedural = true;

  const positions = [];

  // Build atoms
  atomDefs.forEach(([element, x, y, z]) => {
    const cfg  = CPK[element] || CPK.X;
    const mesh = new THREE.Mesh(getSphereGeo(cfg.r), getAtomMat(element, id).clone());
    mesh.position.set(x, y, z);
    mesh.castShadow    = true;
    mesh.receiveShadow = true;
    mesh.userData.element = element;
    group.add(mesh);
    positions.push({ el: element, pos: new THREE.Vector3(x, y, z) });
  });

  // Auto-bond: connect atoms within bonding distance
  // Max bond distance heuristic: sum of covalent radii × 1.6
  const BOND_SCALE = 1.6;
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const a = positions[i];
      const b = positions[j];
      const ri = (CPK[a.el] || CPK.X).r;
      const rj = (CPK[b.el] || CPK.X).r;
      const maxDist = (ri + rj) * BOND_SCALE + 0.3;
      const dist = a.pos.distanceTo(b.pos);
      if (dist > 0.01 && dist < maxDist) {
        const bond = makeBond(a.pos, b.pos);
        if (bond) {
          bond.castShadow = true;
          group.add(bond);
        }
      }
    }
  }

  // Remove the bloom point light completely to avoid any glowing/shiny effect
  // and keep the scene clean as requested by the user.

  return group;
}

// ---------------------------------------------------------------------------
// GLB Loader
// ---------------------------------------------------------------------------
const _loader    = new GLTFLoader();
const _glbCache  = new Map();

/**
 * Load a GLB model. Returns cached result if already loaded.
 * @param {string} path - URL/path to .glb file
 * @returns {Promise<THREE.Group>}
 */
export async function loadGLBMolecule(path) {
  if (_glbCache.has(path)) {
    return _glbCache.get(path).clone();
  }
  return new Promise((resolve, reject) => {
    _loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        // Enhance GLB materials for PBR consistency
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow    = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.envMapIntensity = 1.5;
            }
          }
        });
        _glbCache.set(path, model);
        resolve(model.clone());
      },
      undefined,
      reject
    );
  });
}

// ---------------------------------------------------------------------------
// MoleculeAsset Factory — primary entry point
// ---------------------------------------------------------------------------
/**
 * Create a molecule from a MoleculeAsset descriptor.
 * Tries GLB first; falls back to procedural.
 * 
 * @param {Object} asset - MoleculeAsset { id, glbPath?, atomDefs }
 * @returns {Promise<THREE.Group>}
 */
export async function createMoleculeAsset(asset) {
  if (asset.glbPath) {
    try {
      const model = await loadGLBMolecule(asset.glbPath);
      model.userData.moleculeId = asset.id;
      model.userData.isGLB = true;
      return model;
    } catch (err) {
      console.warn(`[MoleculeBuilder] GLB failed for ${asset.id}, using procedural fallback:`, err);
    }
  }
  return buildProceduralMolecule(asset.atomDefs, asset.id);
}

/**
 * Synchronous procedural-only factory (use when GLB is not needed).
 * @param {Object} asset - MoleculeAsset { id, atomDefs }
 * @returns {THREE.Group}
 */
export function createMoleculeSync(asset) {
  return buildProceduralMolecule(asset.atomDefs, asset.id);
}

// ---------------------------------------------------------------------------
// Animation helpers for molecules
// ---------------------------------------------------------------------------

/**
 * Pulse animation — makes a molecule gently breathe in scale.
 * Call this every frame with delta time.
 */
export function pulseMolecule(mol, time, intensity = 0.04) {
  const s = 1 + Math.sin(time * 2.0 + mol.userData._pulseOffset || 0) * intensity;
  mol.scale.setScalar(s);
}

/**
 * Assign random pulse offsets so molecules don't all sync.
 */
export function randomizePulse(mol) {
  mol.userData._pulseOffset = Math.random() * Math.PI * 2;
}

/**
 * Hover highlight — boost size slightly when mouse is over.
 */
export function setMoleculeHighlight(mol, on) {
  const isColorblind = typeof window !== 'undefined' && window.state && window.state.colorblind;
  if (on) {
    if (!mol.userData.isHighlighted) {
      mol.userData.isHighlighted = true;
      mol.scale.multiplyScalar(1.1);
      
      if (isColorblind) {
        mol.traverse((child) => {
          if (child.isMesh && child.geometry && child.userData.element) {
            const edges = new THREE.EdgesGeometry(child.geometry);
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 }));
            line.userData.isOutline = true;
            child.add(line);
          }
        });
      }
    }
  } else {
    if (mol.userData.isHighlighted) {
      mol.userData.isHighlighted = false;
      mol.scale.multiplyScalar(1/1.1);
      
      mol.traverse((child) => {
        if (child.isMesh) {
          const outlines = child.children.filter(c => c.userData.isOutline);
          outlines.forEach(o => {
            if (o.geometry) o.geometry.dispose();
            if (o.material) o.material.dispose();
            child.remove(o);
          });
        }
      });
    }
  }
}

/**
 * Set molecule opacity for fade in/out.
 */
export function setMoleculeOpacity(mol, opacity) {
  mol.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.transparent = opacity < 1;
      child.material.opacity     = opacity;
    }
  });
}
