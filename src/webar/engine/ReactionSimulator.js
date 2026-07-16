/* ==========================================================================
   ReactionSimulator.js — True Collision-Based Simulator

   Molecules move via Brownian motion inside the AR Chamber.
   Reactions ONLY occur upon physical collision, simulating Collision Theory.
   ========================================================================== */

import * as THREE from 'three';
import { createMoleculeAsset } from './MoleculeBuilder.js';
import { soundEngine } from './SoundEngine.js';

export class ParticleWrapper {
  constructor(def, mesh, isProduct) {
    this.def = def;
    this.mesh = mesh;
    this.isProduct = isProduct;
    this.radius = 0.3 * mesh.scale.x; // approximate collision radius
    
    // Brownian velocity
    this.vel = new THREE.Vector3(
      (Math.random() - 0.5),
      (Math.random() - 0.5),
      (Math.random() - 0.5)
    ).normalize().multiplyScalar(0.5);

    this.rotVel = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    );

    // Prevent immediate re-collision after a reaction/bounce
    this.cooldown = 0;
  }
}

export class ReactionSimulator {
  constructor(scene, reactionConfig) {
    this.scene = scene;
    this.config = reactionConfig;
    this.chamber = null; // Set by MolecularEngine

    this.particles = [];
    this.isPlaying = false;
    
    this.temperature = 1.0; // 0.5 to 2.0 (Controls speed & reaction probability)
    this.activationEnergy = 0.5; // Base probability hurdle
    
    this._listeners = {};
    this.totalSpawns = 0;
  }

  setChamber(chamber) {
    this.chamber = chamber;
  }

  async setMissionLevel(level) {
    this._clearParticles();
    this.isPlaying = false;

    const rDef = this.config.reactants[0];
    const pDef = this.config.products[0];

    if (level === 1) {
      // Observe: Just 5 molecules, natural scale, very slow
      await this._spawn(5, rDef, pDef, 0.5, 0.2);
    } else if (level === 2) {
      // Investigate: Start paused. 10 molecules.
      await this._spawn(10, rDef, pDef, 0.5, 0.0);
    } else if (level === 3 || level === 4) {
      // Experiment/Challenge: 30 molecules
      this.isPlaying = false; // Must be started by user
      await this._spawn(30, rDef, pDef, 0.4, 0.5);
    }
    
    this._emit('sceneReady', level);
  }

  async _spawn(count, reactantDef, productDef, scale, initialProductRatio) {
    this.totalSpawns = count;
    for (let i = 0; i < count; i++) {
      const isProd = i < Math.round(count * initialProductRatio);
      const def = isProd ? productDef : reactantDef;
      const mesh = await createMoleculeAsset(def);
      
      mesh.scale.setScalar(scale);
      
      // Random position inside chamber
      if (this.chamber) {
        const b = this.chamber.getBounds();
        mesh.position.set(
          THREE.MathUtils.randFloat(b.minX + 0.5, b.maxX - 0.5),
          THREE.MathUtils.randFloat(b.minY + 0.5, b.maxY - 0.5),
          THREE.MathUtils.randFloat(b.minZ + 0.5, b.maxZ - 0.5)
        );
      }
      
      // We must add the mesh to the chamber group so it moves with the AR box
      if (this.chamber && this.chamber.chamberGroup) {
        this.chamber.chamberGroup.add(mesh);
      } else {
        this.scene.add(mesh);
      }
      
      this.particles.push(new ParticleWrapper(def, mesh, isProd));
    }
    this._broadcastRatio();
  }

  _clearParticles() {
    this.particles.forEach(p => {
      if (p.mesh.parent) p.mesh.parent.remove(p.mesh);
    });
    this.particles = [];
  }

  async swapParticle(p, newDef, isProduct) {
    const newMesh = await createMoleculeAsset(newDef);
    newMesh.position.copy(p.mesh.position);
    newMesh.rotation.copy(p.mesh.rotation);
    newMesh.scale.copy(p.mesh.scale);
    
    const parent = p.mesh.parent;
    if (parent) {
      parent.remove(p.mesh);
      parent.add(newMesh);
    }
    
    p.mesh = newMesh;
    p.def = newDef;
    p.isProduct = isProduct;
    p.cooldown = 0.5; // Prevent immediate re-reaction
  }

  update(dt) {
    if (!this.isPlaying) return;

    // Move particles
    this.particles.forEach(p => {
      if (p.cooldown > 0) p.cooldown -= dt;
      
      // Temp increases speed
      const speed = this.temperature * 1.5;
      p.mesh.position.addScaledVector(p.vel, dt * speed);
      
      p.mesh.rotation.x += p.rotVel.x * dt * speed;
      p.mesh.rotation.y += p.rotVel.y * dt * speed;
      
      // Wall collisions
      if (this.chamber) {
        const b = this.chamber.getBounds();
        const r = p.radius;
        const pos = p.mesh.position;
        
        if (pos.x - r < b.minX) { pos.x = b.minX + r; p.vel.x *= -1; }
        if (pos.x + r > b.maxX) { pos.x = b.maxX - r; p.vel.x *= -1; }
        if (pos.y - r < b.minY) { pos.y = b.minY + r; p.vel.y *= -1; }
        if (pos.y + r > b.maxY) { pos.y = b.maxY - r; p.vel.y *= -1; }
        if (pos.z - r < b.minZ) { pos.z = b.minZ + r; p.vel.z *= -1; }
        if (pos.z + r > b.maxZ) { pos.z = b.maxZ - r; p.vel.z *= -1; }
      }
    });

    // Particle Collisions (O(n^2) is fine for ~30 particles)
    let collisionOccurred = false;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        
        if (p1.cooldown > 0 || p2.cooldown > 0) continue;

        const distSq = p1.mesh.position.distanceToSquared(p2.mesh.position);
        const minDist = p1.radius + p2.radius;
        
        if (distSq < minDist * minDist) {
          this._handleCollision(p1, p2);
          collisionOccurred = true;
          break;
        }
      }
    }
  }

  _handleCollision(p1, p2) {
    // 1. Elastic Bounce
    const normal = new THREE.Vector3().subVectors(p2.mesh.position, p1.mesh.position).normalize();
    p1.vel.reflect(normal);
    p2.vel.reflect(normal);
    
    p1.mesh.position.addScaledVector(p1.vel, 0.05); // Separate slightly
    p2.mesh.position.addScaledVector(p2.vel, 0.05);
    
    p1.cooldown = 0.2;
    p2.cooldown = 0.2;

    this._emit('collision', { p1, p2 });

    // 2. Reaction Logic (Collision Theory)
    // The higher the temperature, the higher the chance of surpassing Activation Energy
    const reactionChance = 0.1 * (this.temperature * this.temperature); 

    if (Math.random() < reactionChance) {
      if (!p1.isProduct && !p2.isProduct) {
        // Effective Collision! Forward Reaction (2 Reactants -> 2 Products, simplified stoichiometry for visual balance)
        this.swapParticle(p1, this.config.products[0], true);
        this.swapParticle(p2, this.config.products[0], true);
        soundEngine.bondForm();
        this._emit('reactionEvent', { type: 'forward', success: true });
        this._broadcastRatio();
      } 
      else if (p1.isProduct && p2.isProduct) {
        // Reverse Reaction
        this.swapParticle(p1, this.config.reactants[0], false);
        this.swapParticle(p2, this.config.reactants[0], false);
        this._emit('reactionEvent', { type: 'reverse', success: true });
        this._broadcastRatio();
      }
    } else {
      // Ineffective collision
      this._emit('reactionEvent', { type: 'none', success: false });
    }
  }

  _broadcastRatio() {
    let pCount = 0;
    this.particles.forEach(p => { if (p.isProduct) pCount++; });
    const ratio = pCount / (this.particles.length || 1);
    
    this._emit('equilibriumUpdate', {
      reactantPct: (1 - ratio) * 100,
      productPct:  ratio * 100,
    });
  }

  getCurrentRatio() {
    let pCount = 0;
    this.particles.forEach(p => { if (p.isProduct) pCount++; });
    const ratio = pCount / (this.particles.length || 1);
    return {
      reactant: Math.round((1 - ratio) * 100),
      product: Math.round(ratio * 100)
    };
  }

  async addMolecules(isProduct, count = 5) {
    const rDef = this.config.reactants[0];
    const pDef = this.config.products[0];
    const def = isProduct ? pDef : rDef;
    
    // Gunakan scale yang sama dengan yang sudah ada, atau default 0.4
    const scale = this.particles.length > 0 ? this.particles[0].mesh.scale.x : 0.4;
    
    for (let i = 0; i < count; i++) {
      const mesh = await createMoleculeAsset(def);
      mesh.scale.setScalar(scale);
      
      if (this.chamber) {
        const b = this.chamber.getBounds();
        mesh.position.set(
          THREE.MathUtils.randFloat(b.minX + 0.5, b.maxX - 0.5),
          THREE.MathUtils.randFloat(b.minY + 0.5, b.maxY - 0.5),
          THREE.MathUtils.randFloat(b.minZ + 0.5, b.maxZ - 0.5)
        );
        this.chamber.chamberGroup.add(mesh);
      } else {
        this.scene.add(mesh);
      }
      this.particles.push(new ParticleWrapper(def, mesh, isProduct));
    }
    this._broadcastRatio();
  }

  applyExperiment(experimentId) {
    // Legacy support, but we rely on setTemperature/setVolume now
  }

  setTemperature(val) {
    this.temperature = val; // 0.5 to 2.0
  }

  play() { this.isPlaying = true; }
  pause() { this.isPlaying = false; }

  // --- Interaction Utils ---
  get allMeshes() { return this.particles.map(p => p.mesh); }

  on(event, cb) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(cb);
  }

  _emit(event, data) {
    if (this._listeners[event]) this._listeners[event].forEach(fn => fn(data));
  }

  dispose() {
    this._clearParticles();
    this._listeners = {};
  }
}
