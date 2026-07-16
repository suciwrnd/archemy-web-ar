/* ==========================================================================
   SoundEngine.js — Synthesized audio feedback for the Molecular Learning Engine
   All sounds are generated via Web Audio API — no external files needed.
   ========================================================================== */

export class SoundEngine {
  constructor() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      this.ctx = null;
    }
    this._masterGain = null;
    if (this.ctx) {
      this._masterGain = this.ctx.createGain();
      this._masterGain.gain.value = 0.6;
      this._masterGain.connect(this.ctx.destination);
    }
  }

  _resume() {
    if (this.ctx?.state === 'suspended') this.ctx.resume();
  }

  /** Soft woosh — scene transition */
  whoosh() {
    if (!this.ctx) return;
    this._resume();
    const bufLen = this.ctx.sampleRate * 1.8;
    const buf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 2);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 1.8);
    filter.Q.value = 1.5;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.5, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.8);
    src.connect(filter);
    filter.connect(g);
    g.connect(this._masterGain);
    src.start();
  }

  /** Sharp pop — failed collision */
  bounce() {
    if (!this.ctx) return;
    this._resume();
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.connect(g);
    g.connect(this._masterGain);
    o.type = 'triangle';
    o.frequency.setValueAtTime(200, this.ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.25);
    g.gain.setValueAtTime(0.35, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
    o.start();
    o.stop(this.ctx.currentTime + 0.25);
  }

  /** Bright chime — bond forms / product created */
  bondForm() {
    if (!this.ctx) return;
    this._resume();
    [880, 1100, 1320].forEach((freq, i) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.connect(g);
      g.connect(this._masterGain);
      o.type = 'sine';
      o.frequency.value = freq;
      const t = this.ctx.currentTime + i * 0.07;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.18, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      o.start(t);
      o.stop(t + 0.6);
    });
  }

  /** Low crack — bond breaks */
  bondBreak() {
    if (!this.ctx) return;
    this._resume();
    const bufLen = this.ctx.sampleRate * 0.4;
    const buf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 1.5);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;
    const g = this.ctx.createGain();
    g.gain.value = 0.4;
    src.connect(filter);
    filter.connect(g);
    g.connect(this._masterGain);
    src.start();
  }

  /** Ascending fanfare — mission complete */
  missionComplete() {
    if (!this.ctx) return;
    this._resume();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.connect(g);
      g.connect(this._masterGain);
      o.type = 'sine';
      o.frequency.value = freq;
      const t = this.ctx.currentTime + i * 0.15;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.2, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
      o.start(t);
      o.stop(t + 0.7);
    });
  }

  /** Soft click — UI tap */
  click() {
    if (!this.ctx) return;
    this._resume();
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.connect(g);
    g.connect(this._masterGain);
    o.type = 'sine';
    o.frequency.value = 1200;
    g.gain.setValueAtTime(0.1, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    o.start();
    o.stop(this.ctx.currentTime + 0.08);
  }

  /** Typewriter tick */
  tick() {
    if (!this.ctx) return;
    this._resume();
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.connect(g);
    g.connect(this._masterGain);
    o.type = 'square';
    o.frequency.value = 600 + Math.random() * 200;
    g.gain.setValueAtTime(0.03, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    o.start();
    o.stop(this.ctx.currentTime + 0.04);
  }
}

export const soundEngine = new SoundEngine();
