// Dussehra Web Audio Sound Engine
// Synthesized auspicious Indian temple bells, celebratory fireworks, arrow effects, and ambient drone

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isDronePlaying = false;
    this.droneGain = null;
    this.droneNodes = [];
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();
    this.initialized = true;
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.droneGain) {
      this.droneGain.gain.setValueAtTime(this.isMuted ? 0 : 0.12, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // Auspicious Temple Bell (Ghanta)
  playTempleBell(frequency = 880, decay = 2.8) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const harmonics = [1, 2.02, 3.01, 4.2, 5.43];
    const gains = [0.4, 0.22, 0.14, 0.08, 0.04];

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.35, t);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    masterGain.connect(this.ctx.destination);

    harmonics.forEach((h, i) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(frequency * h, t);

      oscGain.gain.setValueAtTime(gains[i], t);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, t + decay * (1 - i * 0.15));

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(t);
      osc.stop(t + decay);
    });
  }

  // Celestial Chime glissando (Flower shower / Blessings)
  playBlessingChime() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    // Raga Bhupali / Pentatonic notes: C5, D5, E5, G5, A5, C6
    const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const t = now + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.85);
    });
  }

  // Blazing Arrow Launch Whoosh
  playArrowLaunch() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const dur = 0.55;

    // Filtered noise for whoosh
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3.5, t);
    filter.frequency.setValueAtTime(250, t);
    filter.frequency.exponentialRampToValueAtTime(3200, t + dur * 0.4);
    filter.frequency.exponentialRampToValueAtTime(600, t + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    // Whistling arrow tone
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(1400, t + dur * 0.5);
    osc.frequency.exponentialRampToValueAtTime(500, t + dur);

    oscGain.gain.setValueAtTime(0.001, t);
    oscGain.gain.linearRampToValueAtTime(0.12, t + 0.2);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    noise.start(t);
    osc.start(t);
    noise.stop(t + dur);
    osc.stop(t + dur);
  }

  // Firework Burst & Crackle
  playFirework() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Low punch boom
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.4);

    oscGain.gain.setValueAtTime(0.5, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.55);

    // Crackle noise
    const noiseDur = 0.6;
    const bufferSize = this.ctx.sampleRate * noiseDur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() > 0.88 ? (Math.random() * 2 - 1) : 0);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + noiseDur);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(t + 0.05);
    noise.stop(t + noiseDur + 0.05);
  }

  // Ambient Meditative Tanpura Chord Drone
  startAmbientDrone() {
    if (this.isDronePlaying) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(this.isMuted ? 0 : 0.09, t);
    this.droneGain.connect(this.ctx.destination);

    // Root C#3 (138.59 Hz), Fifth G#3 (207.65 Hz), Octave C#4 (277.18 Hz)
    const droneFreqs = [138.59, 207.65, 277.18, 554.37];

    droneFreqs.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
      const filter = this.ctx.createBiquadFilter();

      osc.type = i === 0 ? 'sine' : (i === 1 ? 'triangle' : 'sine');
      osc.frequency.setValueAtTime(freq, t);

      // Gentle tremolo
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.2 + i * 0.1, t);
      lfoGain.gain.setValueAtTime(2.5, t);
      lfo.connect(osc.frequency);
      lfo.start();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, t);

      if (panner) {
        panner.pan.setValueAtTime((i % 2 === 0 ? -0.3 : 0.3), t);
        osc.connect(filter);
        filter.connect(panner);
        panner.connect(this.droneGain);
      } else {
        osc.connect(filter);
        filter.connect(this.droneGain);
      }

      osc.start(t);
      this.droneNodes.push(osc, lfo);
    });

    this.isDronePlaying = true;
  }

  stopAmbientDrone() {
    if (!this.isDronePlaying) return;
    this.droneNodes.forEach(node => {
      try { node.stop(); } catch(e) {}
    });
    this.droneNodes = [];
    this.isDronePlaying = false;
  }
}

export const sound = new SoundEngine();
