// High-Performance Dussehra Festive Particles Engine
// Handles Marigold petals, Golden Apta/Shami leaves, celebratory Fireworks, and ambient Stardust

export class ParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.petals = [];
    this.goldLeaves = [];
    this.fireworks = [];
    this.fireworkSparks = [];
    this.embers = [];

    this.isRunning = false;
    this.autoFireworkTimer = 0;
    this.soundCallback = null;

    this.initCanvas();
    this.initEmbers(45);
    this.initPetals(25);
    this.bindEvents();
  }

  setSoundCallback(cb) {
    this.soundCallback = cb;
  }

  initCanvas() {
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.resize();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.pixelRatio;
    this.canvas.height = this.height * this.pixelRatio;
    this.ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
  }

  initEmbers(count) {
    this.embers = [];
    for (let i = 0; i < count; i++) {
      this.embers.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2.5 + 1,
        speedY: -(Math.random() * 0.6 + 0.2),
        speedX: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseVal: Math.random() * Math.PI,
        color: Math.random() > 0.4 ? 'rgba(255, 215, 0, ' : 'rgba(255, 140, 0, '
      });
    }
  }

  initPetals(count) {
    this.petals = [];
    for (let i = 0; i < count; i++) {
      this.petals.push(this.createPetal(true));
    }
    for (let i = 0; i < 15; i++) {
      this.goldLeaves.push(this.createGoldLeaf(true));
    }
  }

  createPetal(randomY = false) {
    const colors = [
      { r: 255, g: 153, b: 0 },   // Vibrant Saffron
      { r: 255, g: 195, b: 0 },   // Marigold Gold
      { r: 255, g: 110, b: 0 },   // Deep Tangerine
      { r: 230, g: 70, b: 20 },   // Vermilion
      { r: 255, g: 215, b: 0 }    // Bright Gold
    ];
    const c = colors[Math.floor(Math.random() * colors.length)];
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -30,
      size: Math.random() * 10 + 9,
      speedX: (Math.random() - 0.5) * 1.2,
      speedY: Math.random() * 1.5 + 1.2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2.5,
      pitch: Math.random() * Math.PI,
      pitchSpeed: Math.random() * 0.04 + 0.02,
      color: c,
      opacity: Math.random() * 0.3 + 0.7
    };
  }

  createGoldLeaf(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -30,
      size: Math.random() * 12 + 10,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: Math.random() * 1.2 + 0.9,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2,
      pitch: Math.random() * Math.PI,
      pitchSpeed: Math.random() * 0.03 + 0.015,
      shimmer: Math.random() * Math.PI,
      opacity: Math.random() * 0.3 + 0.7
    };
  }

  // Interactive Flower / Gold Leaf shower burst at (x, y)
  burstShower(x, y, count = 28) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      const isGoldLeaf = Math.random() > 0.45;

      if (isGoldLeaf) {
        this.goldLeaves.push({
          x: x,
          y: y,
          size: Math.random() * 14 + 10,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed - 2,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 4,
          pitch: Math.random() * Math.PI,
          pitchSpeed: 0.05,
          shimmer: Math.random() * Math.PI,
          opacity: 1
        });
      } else {
        const colors = [
          { r: 255, g: 175, b: 0 },
          { r: 255, g: 110, b: 0 },
          { r: 255, g: 215, b: 50 },
          { r: 240, g: 80, b: 20 }
        ];
        this.petals.push({
          x: x,
          y: y,
          size: Math.random() * 12 + 8,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed - 3,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 5,
          pitch: Math.random() * Math.PI,
          pitchSpeed: 0.06,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 1
        });
      }
    }
  }

  // Launch a celebratory Firework
  launchFirework(startX = null, targetX = null, targetY = null, customPalette = null) {
    const sX = startX !== null ? startX : Math.random() * (this.width * 0.7) + this.width * 0.15;
    const tX = targetX !== null ? targetX : sX + (Math.random() - 0.5) * 120;
    const tY = targetY !== null ? targetY : Math.random() * (this.height * 0.45) + 60;

    const palettes = [
      ['#FFD700', '#FFA500', '#FF4500', '#FFF8DC'], // Gold & Vermilion
      ['#FF1493', '#9400D3', '#00FFFF', '#FFD700'], // Royal Magenta & Cyan
      ['#00FF7F', '#7CFC00', '#FFD700', '#FFFFFF'], // Auspicious Green & Gold
      ['#FF4500', '#FF6347', '#FFD700', '#FFE4B5']  // Fire & Sun
    ];

    const palette = customPalette || palettes[Math.floor(Math.random() * palettes.length)];

    this.fireworks.push({
      x: sX,
      y: this.height + 10,
      targetX: tX,
      targetY: tY,
      speedX: (tX - sX) / 38,
      speedY: (tY - (this.height + 10)) / 38,
      progress: 0,
      maxProgress: 38,
      color: palette[0],
      palette: palette,
      trail: []
    });
  }

  explodeFirework(x, y, palette, particleCount = 85) {
    if (this.soundCallback) {
      this.soundCallback();
    }

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6.5 + 1.2;
      const color = palette[Math.floor(Math.random() * palette.length)];

      this.fireworkSparks.push({
        x: x,
        y: y,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        color: color,
        alpha: 1,
        decay: Math.random() * 0.016 + 0.012,
        size: Math.random() * 2.8 + 1.5,
        gravity: 0.065,
        trail: []
      });
    }

    // Add a golden shockwave ring
    this.fireworkSparks.push({
      isRing: true,
      x: x,
      y: y,
      radius: 5,
      maxRadius: Math.random() * 50 + 60,
      growth: 3.5,
      alpha: 0.9,
      decay: 0.035,
      color: palette[0]
    });
  }

  // Draw Realistic Marigold Petal
  drawPetal(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate((p.rotation * Math.PI) / 180);
    const scaleY = Math.cos(p.pitch);
    this.ctx.scale(1, Math.abs(scaleY) > 0.05 ? scaleY : 0.05);

    this.ctx.beginPath();
    this.ctx.moveTo(0, -p.size);
    this.ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.6, p.size * 0.7, p.size * 0.6, 0, p.size);
    this.ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.6, -p.size * 0.8, -p.size * 0.6, 0, -p.size);

    const grad = this.ctx.createLinearGradient(0, -p.size, 0, p.size);
    grad.addColorStop(0, `rgba(${p.color.r}, ${p.color.g + 30}, ${p.color.b}, ${p.opacity})`);
    grad.addColorStop(1, `rgba(${p.color.r - 20}, ${Math.max(0, p.color.g - 30)}, ${p.color.b}, ${p.opacity * 0.9})`);

    this.ctx.fillStyle = grad;
    this.ctx.fill();

    // Central vein
    this.ctx.beginPath();
    this.ctx.moveTo(0, -p.size * 0.8);
    this.ctx.lineTo(0, p.size * 0.8);
    this.ctx.strokeStyle = `rgba(255, 230, 150, ${p.opacity * 0.4})`;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    this.ctx.restore();
  }

  // Draw Auspicious Apta / Shami Leaf (Twin-lobed gold leaf)
  drawGoldLeaf(leaf) {
    this.ctx.save();
    this.ctx.translate(leaf.x, leaf.y);
    this.ctx.rotate((leaf.rotation * Math.PI) / 180);
    const scaleY = Math.cos(leaf.pitch);
    this.ctx.scale(1, Math.abs(scaleY) > 0.05 ? scaleY : 0.05);

    const s = leaf.size;
    const shimmerAlpha = Math.sin(leaf.shimmer) * 0.25 + 0.75;

    this.ctx.beginPath();
    // Distinctive bilobed Apta leaf shape
    this.ctx.moveTo(0, s);
    this.ctx.bezierCurveTo(s * 0.8, s * 0.5, s * 0.9, -s * 0.3, s * 0.4, -s * 0.8);
    this.ctx.bezierCurveTo(s * 0.1, -s * 0.9, 0, -s * 0.4, 0, -s * 0.3);
    this.ctx.bezierCurveTo(0, -s * 0.4, -s * 0.1, -s * 0.9, -s * 0.4, -s * 0.8);
    this.ctx.bezierCurveTo(-s * 0.9, -s * 0.3, -s * 0.8, s * 0.5, 0, s);

    // Liquid gold gradient
    const grad = this.ctx.createLinearGradient(-s, -s, s, s);
    grad.addColorStop(0, `rgba(255, 235, 120, ${leaf.opacity * shimmerAlpha})`);
    grad.addColorStop(0.5, `rgba(220, 175, 40, ${leaf.opacity * shimmerAlpha})`);
    grad.addColorStop(1, `rgba(180, 120, 10, ${leaf.opacity * shimmerAlpha})`);

    this.ctx.fillStyle = grad;
    this.ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';
    this.ctx.shadowBlur = 8;
    this.ctx.fill();

    // Central leaf vein
    this.ctx.beginPath();
    this.ctx.moveTo(0, s * 0.9);
    this.ctx.lineTo(0, -s * 0.3);
    this.ctx.strokeStyle = `rgba(255, 255, 200, ${leaf.opacity * 0.6})`;
    this.ctx.lineWidth = 1.2;
    this.ctx.stroke();

    this.ctx.restore();
  }

  update() {
    // 1. Embers & Stardust
    for (let i = 0; i < this.embers.length; i++) {
      const e = this.embers[i];
      e.y += e.speedY;
      e.x += e.speedX;
      e.pulseVal += e.pulseSpeed;

      if (e.y < -10) {
        e.y = this.height + 10;
        e.x = Math.random() * this.width;
      }
      if (e.x < -10) e.x = this.width + 10;
      if (e.x > this.width + 10) e.x = -10;

      const alpha = (Math.sin(e.pulseVal) * 0.5 + 0.5) * e.alpha;
      this.ctx.beginPath();
      this.ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
      this.ctx.fillStyle = e.color + alpha + ')';
      this.ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
      this.ctx.shadowBlur = 6;
      this.ctx.fill();
    }

    // 2. Petals
    for (let i = this.petals.length - 1; i >= 0; i--) {
      const p = this.petals[i];
      p.x += p.speedX + Math.sin(p.pitch) * 0.8;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;
      p.pitch += p.pitchSpeed;

      this.drawPetal(p);

      if (p.y > this.height + 40) {
        if (this.petals.length > 30) {
          this.petals.splice(i, 1);
        } else {
          this.petals[i] = this.createPetal(false);
        }
      }
    }

    // 3. Gold Leaves (Sona)
    for (let i = this.goldLeaves.length - 1; i >= 0; i--) {
      const leaf = this.goldLeaves[i];
      leaf.x += leaf.speedX + Math.sin(leaf.pitch) * 0.9;
      leaf.y += leaf.speedY;
      leaf.rotation += leaf.rotSpeed;
      leaf.pitch += leaf.pitchSpeed;
      leaf.shimmer += 0.05;

      this.drawGoldLeaf(leaf);

      if (leaf.y > this.height + 40) {
        if (this.goldLeaves.length > 20) {
          this.goldLeaves.splice(i, 1);
        } else {
          this.goldLeaves[i] = this.createGoldLeaf(false);
        }
      }
    }

    // 4. Fireworks Rockets
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i];
      fw.trail.push({ x: fw.x, y: fw.y, alpha: 1 });
      if (fw.trail.length > 8) fw.trail.shift();

      fw.x += fw.speedX;
      fw.y += fw.speedY;
      fw.progress++;

      // Draw rocket trail
      this.ctx.beginPath();
      for (let t = 0; t < fw.trail.length; t++) {
        const pt = fw.trail[t];
        const rad = (t / fw.trail.length) * 2.5 + 0.5;
        this.ctx.fillStyle = `rgba(255, 220, 100, ${t / fw.trail.length})`;
        this.ctx.fillRect(pt.x, pt.y, rad, rad);
      }

      // Spark head
      this.ctx.beginPath();
      this.ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = '#FFF8DC';
      this.ctx.shadowColor = '#FFD700';
      this.ctx.shadowBlur = 10;
      this.ctx.fill();

      if (fw.progress >= fw.maxProgress || fw.y <= fw.targetY) {
        this.explodeFirework(fw.x, fw.y, fw.palette);
        this.fireworks.splice(i, 1);
      }
    }

    // 5. Firework Sparks & Shockwaves
    for (let i = this.fireworkSparks.length - 1; i >= 0; i--) {
      const sp = this.fireworkSparks[i];

      if (sp.isRing) {
        sp.radius += sp.growth;
        sp.alpha -= sp.decay;
        if (sp.alpha <= 0) {
          this.fireworkSparks.splice(i, 1);
          continue;
        }
        this.ctx.beginPath();
        this.ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = sp.color;
        this.ctx.globalAlpha = sp.alpha * 0.7;
        this.ctx.lineWidth = 2.5;
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
        continue;
      }

      sp.x += sp.speedX;
      sp.y += sp.speedY;
      sp.speedY += sp.gravity;
      sp.speedX *= 0.985;
      sp.alpha -= sp.decay;

      if (sp.alpha <= 0) {
        this.fireworkSparks.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = sp.alpha;
      this.ctx.beginPath();
      this.ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      this.ctx.fillStyle = sp.color;
      this.ctx.shadowColor = sp.color;
      this.ctx.shadowBlur = 8;
      this.ctx.fill();
      this.ctx.restore();
    }

    // Auto fireworks periodically
    this.autoFireworkTimer++;
    if (this.autoFireworkTimer % 110 === 0) {
      this.launchFirework();
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    const loop = () => {
      if (!this.isRunning) return;
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.update();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  stop() {
    this.isRunning = false;
  }
}
