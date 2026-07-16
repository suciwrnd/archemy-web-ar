/* ==========================================================================
   LabBuilder.js — Procedural Low-Poly Laboratory

   Generates a complete 3D laboratory environment using simple Three.js
   geometries and flat colors. Acts as a placeholder for future GLTF models.
   ========================================================================== */

import * as THREE from 'three';

// Low-Poly material helper
const createMat = (color, transparent = false, opacity = 1.0) => {
  return new THREE.MeshLambertMaterial({
    color: color,
    flatShading: true,
    transparent: transparent,
    opacity: opacity,
    side: transparent ? THREE.DoubleSide : THREE.FrontSide
  });
};

export class LabBuilder {
  static buildLaboratory() {
    const labGroup = new THREE.Group();
    
    // 1. Table
    const tableGeo = new THREE.BoxGeometry(6, 0.2, 3);
    const tableMat = createMat(0xe2e8f0); // light gray
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = -0.1;
    labGroup.add(table);

    // 2. Reaction Chamber (Center)
    const chamberGroup = this._buildChamber();
    chamberGroup.position.set(0, 0, 0);
    labGroup.add(chamberGroup);
    // Expose for raycaster/collision
    labGroup.userData.chamber = chamberGroup;

    // 3. Heater (Left Front)
    const heaterGroup = this._buildHeater();
    heaterGroup.position.set(-1.8, 0, 0.6);
    labGroup.add(heaterGroup);
    labGroup.userData.heater = heaterGroup;

    // 4. Pressure Piston (Right Front)
    const pistonGroup = this._buildPiston();
    pistonGroup.position.set(2.0, 0, 0.6);
    labGroup.add(pistonGroup);
    labGroup.userData.piston = pistonGroup;

    // 5. Monitor (Right Back)
    const monitorGroup = this._buildMonitor();
    monitorGroup.position.set(2.0, 0, -1.0);
    monitorGroup.rotation.y = -Math.PI / 8;
    labGroup.add(monitorGroup);
    labGroup.userData.monitor = monitorGroup;

    // 6. Reagent Shelf (Left Back)
    const shelfGroup = this._buildShelf();
    shelfGroup.position.set(-1.8, 0, -1.0);
    labGroup.add(shelfGroup);

    return labGroup;
  }

  static _buildChamber() {
    const group = new THREE.Group();
    // Glass Box
    const glassGeo = new THREE.BoxGeometry(2, 1.5, 1.5);
    glassGeo.translate(0, 1.5 / 2, 0);
    const glassMat = createMat(0xbae6fd, true, 0.3); // transparent light blue
    const glass = new THREE.Mesh(glassGeo, glassMat);
    
    // Edges
    const edgesGeo = new THREE.EdgesGeometry(glassGeo);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x94a3b8 });
    const edges = new THREE.LineSegments(edgesGeo, edgesMat);

    // Base
    const baseGeo = new THREE.BoxGeometry(2.2, 0.1, 1.7);
    baseGeo.translate(0, 0.05, 0);
    const baseMat = createMat(0x94a3b8);
    const base = new THREE.Mesh(baseGeo, baseMat);

    group.add(glass);
    group.add(edges);
    group.add(base);
    
    // Hitbox for raycaster
    const hitBox = new THREE.Mesh(glassGeo, new THREE.MeshBasicMaterial({visible: false}));
    hitBox.userData = { id: 'chamber' };
    group.add(hitBox);

    group.userData.bounds = { minX: -1, maxX: 1, minY: 0.1, maxY: 1.5, minZ: -0.75, maxZ: 0.75 };
    
    return group;
  }

  static _buildHeater() {
    const group = new THREE.Group();
    
    // Body
    const bodyGeo = new THREE.BoxGeometry(1.2, 0.3, 1.2);
    bodyGeo.translate(0, 0.15, 0);
    const bodyMat = createMat(0xf8fafc);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    
    // Hot Plate
    const plateGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 16);
    plateGeo.translate(0, 0.325, 0);
    const plateMat = createMat(0x334155);
    const plate = new THREE.Mesh(plateGeo, plateMat);
    
    // Control Knob
    const knobGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
    knobGeo.rotateX(Math.PI / 2);
    knobGeo.translate(0.3, 0.15, 0.65);
    const knobMat = createMat(0x64748b);
    const knob = new THREE.Mesh(knobGeo, knobMat);
    group.userData.knob = knob;

    // Display Screen
    const screenGeo = new THREE.PlaneGeometry(0.4, 0.15);
    screenGeo.translate(-0.2, 0.15, 0.61);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const screen = new THREE.Mesh(screenGeo, screenMat);

    group.add(body);
    group.add(plate);
    group.add(knob);
    group.add(screen);

    // Hitbox
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 1.3), new THREE.MeshBasicMaterial({visible: false}));
    hitBox.position.set(0, 0.2, 0);
    hitBox.userData = { id: 'heater' };
    group.add(hitBox);

    return group;
  }

  static _buildPiston() {
    const group = new THREE.Group();
    
    // Base
    const baseGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 16);
    baseGeo.translate(0, 0.05, 0);
    const baseMat = createMat(0xe2e8f0);
    const base = new THREE.Mesh(baseGeo, baseMat);

    // Glass Tube
    const tubeGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 16);
    tubeGeo.translate(0, 0.7, 0);
    const tubeMat = createMat(0xbae6fd, true, 0.4);
    const tube = new THREE.Mesh(tubeGeo, tubeMat);

    // Plunger
    const plungerGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.1, 16);
    plungerGeo.translate(0, 1.0, 0);
    const plungerMat = createMat(0x475569);
    const plunger = new THREE.Mesh(plungerGeo, plungerMat);
    group.userData.plunger = plunger;

    // Rod
    const rodGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.0, 8);
    rodGeo.translate(0, 1.5, 0);
    const rodMat = createMat(0x94a3b8);
    const rod = new THREE.Mesh(rodGeo, rodMat);
    group.userData.rod = rod;

    // Handle
    const handleGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    handleGeo.translate(0, 2.05, 0);
    const handleMat = createMat(0x0f172a);
    const handle = new THREE.Mesh(handleGeo, handleMat);
    group.userData.handle = handle;

    group.add(base);
    group.add(tube);
    group.add(plunger);
    group.add(rod);
    group.add(handle);

    // Hitbox
    const hitBox = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2.2, 8), new THREE.MeshBasicMaterial({visible: false}));
    hitBox.position.set(0, 1.1, 0);
    hitBox.userData = { id: 'piston' };
    group.add(hitBox);

    return group;
  }

  static _buildMonitor() {
    const group = new THREE.Group();
    
    // Stand Base
    const baseGeo = new THREE.BoxGeometry(0.6, 0.05, 0.4);
    const baseMat = createMat(0x94a3b8);
    const base = new THREE.Mesh(baseGeo, baseMat);
    
    // Stand Neck
    const neckGeo = new THREE.BoxGeometry(0.1, 0.6, 0.1);
    neckGeo.translate(0, 0.3, 0);
    const neck = new THREE.Mesh(neckGeo, baseMat);
    
    // Screen Frame
    const frameGeo = new THREE.BoxGeometry(1.6, 1.0, 0.1);
    frameGeo.translate(0, 0.8, 0.05);
    const frameMat = createMat(0x334155);
    const frame = new THREE.Mesh(frameGeo, frameMat);
    
    // Screen Display
    const displayGeo = new THREE.PlaneGeometry(1.5, 0.9);
    displayGeo.translate(0, 0.8, 0.11);
    const displayMat = new THREE.MeshBasicMaterial({ color: 0x0f172a }); // Dark screen
    const display = new THREE.Mesh(displayGeo, displayMat);

    group.add(base);
    group.add(neck);
    group.add(frame);
    group.add(display);

    // Hitbox
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.4, 0.4), new THREE.MeshBasicMaterial({visible: false}));
    hitBox.position.set(0, 0.7, 0);
    hitBox.userData = { id: 'monitor' };
    group.add(hitBox);

    return group;
  }

  static _buildShelf() {
    const group = new THREE.Group();
    
    // Racks
    const rackGeo = new THREE.BoxGeometry(1.5, 0.05, 0.4);
    const rackMat = createMat(0xcbd5e1);
    
    const rack1 = new THREE.Mesh(rackGeo, rackMat);
    rack1.position.y = 0.5;
    const rack2 = new THREE.Mesh(rackGeo, rackMat);
    rack2.position.y = 1.0;
    const rack3 = new THREE.Mesh(rackGeo, rackMat);
    rack3.position.y = 1.5;

    // Supports
    const poleGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
    const poleMat = createMat(0x94a3b8);
    
    const p1 = new THREE.Mesh(poleGeo, poleMat); p1.position.set(-0.7, 0.75, -0.15);
    const p2 = new THREE.Mesh(poleGeo, poleMat); p2.position.set(0.7, 0.75, -0.15);
    const p3 = new THREE.Mesh(poleGeo, poleMat); p3.position.set(-0.7, 0.75, 0.15);
    const p4 = new THREE.Mesh(poleGeo, poleMat); p4.position.set(0.7, 0.75, 0.15);

    group.add(rack1, rack2, rack3, p1, p2, p3, p4);

    // Bottles
    const colors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b, 0xa855f7];
    let bIndex = 0;
    
    for (let r = 1; r <= 2; r++) {
      for (let x = -0.5; x <= 0.5; x += 0.5) {
        const bottleGroup = new THREE.Group();
        const bGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.25, 12);
        bGeo.translate(0, 0.125, 0);
        const bMat = createMat(colors[bIndex % colors.length], true, 0.8);
        const bMesh = new THREE.Mesh(bGeo, bMat);
        
        const capGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.1, 12);
        capGeo.translate(0, 0.3, 0);
        const capMat = createMat(0xffffff);
        const cap = new THREE.Mesh(capGeo, capMat);

        bottleGroup.add(bMesh, cap);
        bottleGroup.position.set(x, r === 1 ? 0.5 : 1.0, 0);
        group.add(bottleGroup);
        bIndex++;
      }
    }

    // Hitbox
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 0.6), new THREE.MeshBasicMaterial({visible: false}));
    hitBox.position.set(0, 0.8, 0);
    hitBox.userData = { id: 'shelf' };
    group.add(hitBox);

    return group;
  }

  static _buildNotebook() {
    const group = new THREE.Group();
    
    // Cover
    const coverGeo = new THREE.BoxGeometry(1.2, 0.05, 0.8);
    coverGeo.translate(0, 0.025, 0);
    const coverMat = createMat(0x6366f1); // Indigo cover
    const cover = new THREE.Mesh(coverGeo, coverMat);

    // Pages
    const pagesGeo = new THREE.BoxGeometry(1.1, 0.06, 0.7);
    pagesGeo.translate(0.02, 0.05, 0);
    const pagesMat = createMat(0xffffff);
    const pages = new THREE.Mesh(pagesGeo, pagesMat);
    
    // Binding (Left side)
    const bindGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8);
    bindGeo.rotateX(Math.PI / 2);
    bindGeo.translate(-0.58, 0.05, 0);
    const bindMat = createMat(0x1e1b4b);
    const bind = new THREE.Mesh(bindGeo, bindMat);

    group.add(cover);
    group.add(pages);
    group.add(bind);

    // Hitbox
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.2, 0.9), new THREE.MeshBasicMaterial({visible: false}));
    hitBox.position.set(0, 0.1, 0);
    hitBox.userData = { id: 'notebook' };
    group.add(hitBox);

    return group;
  }
}
