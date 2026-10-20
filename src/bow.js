// Interactive Bow, Arrow & Ravana Effigy Experience
// Kodanda Bow physics, blazing Brahmastra arrow trajectory, and Ravana burning celebration

import confetti from 'canvas-confetti';

export class BowExperience {
  constructor(container, sound, particleEngine) {
    this.container = container;
    this.sound = sound;
    this.particles = particleEngine;

    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.currentPull = { x: 0, y: 0 };
    this.maxPull = 90;
    this.isFiring = false;
    this.isDefeated = false;

    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    this.bowWrapper = this.container.querySelector('.bow-interactive-zone');
    this.bowString = this.container.querySelector('.bow-string-path');
    this.arrow = this.container.querySelector('.divine-arrow');
    this.ravanContainer = this.container.querySelector('.ravan-effigy-wrapper');
    this.victoryBanner = this.container.querySelector('.victory-celebration-banner');
    this.fireBtn = this.container.querySelector('#btn-fire-arrow');
    this.resetBtn = this.container.querySelector('#btn-replay-arrow');
  }

  bindEvents() {
    if (!this.arrow) return;

    // Mouse / Touch Dragging on arrow
    const onStart = (e) => {
      if (this.isFiring || this.isDefeated) return;
      this.isDragging = true;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      this.dragStart = { x: clientX, y: clientY };
      this.sound.ensureContext();
      this.arrow.classList.add('charging');
    };

    const onMove = (e) => {
      if (!this.isDragging || this.isFiring) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      
      const dx = clientX - this.dragStart.x;
      const dy = clientY - this.dragStart.y;
      
      // Calculate pull backwards (to the left/down)
      const pullX = Math.min(0, Math.max(-this.maxPull, dx));
      const pullY = Math.max(-30, Math.min(30, dy * 0.4));
      this.currentPull = { x: pullX, y: pullY };

      this.updatePullVisuals();
    };

    const onEnd = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.arrow.classList.remove('charging');

      if (Math.abs(this.currentPull.x) > 35) {
        this.launchArrow(Math.abs(this.currentPull.x) / this.maxPull);
      } else {
        // Reset position
        this.resetString();
      }
    };

    this.arrow.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    this.arrow.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);

    // Quick Fire Button
    if (this.fireBtn) {
      this.fireBtn.addEventListener('click', () => {
        if (!this.isFiring) {
          this.quickFireAnimation();
        }
      });
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        this.resetExperience();
      });
    }
  }

  updatePullVisuals() {
    const px = this.currentPull.x;
    const py = this.currentPull.y;
    
    // Bow string dynamic curve
    if (this.bowString) {
      this.bowString.setAttribute(
        'd',
        `M 40,10 Q ${40 + px},${130 + py} 40,250`
      );
    }
    
    // Arrow offset
    if (this.arrow) {
      this.arrow.style.transform = `translate(${px}px, ${py}px)`;
    }
  }

  resetString() {
    this.currentPull = { x: 0, y: 0 };
    if (this.bowString) {
      this.bowString.setAttribute('d', 'M 40,10 Q 40,130 40,250');
    }
    if (this.arrow) {
      this.arrow.style.transform = 'translate(0px, 0px)';
    }
  }

  quickFireAnimation() {
    if (this.isFiring) return;
    this.sound.ensureContext();
    this.isFiring = true;
    
    // Animate pull back
    let pull = 0;
    const interval = setInterval(() => {
      pull += 10;
      this.currentPull = { x: -pull, y: 0 };
      this.updatePullVisuals();
      if (pull >= 70) {
        clearInterval(interval);
        setTimeout(() => {
          this.launchArrow(1.0);
        }, 120);
      }
    }, 20);
  }

  launchArrow(powerRatio = 1.0) {
    this.isFiring = true;
    this.sound.playArrowLaunch();

    // Snap string back
    if (this.bowString) {
      this.bowString.setAttribute('d', 'M 40,10 Q 55,130 40,250');
      setTimeout(() => this.resetString(), 80);
    }

    // Arrow flight animation
    const rectArrow = this.arrow.getBoundingClientRect();
    const rectTarget = this.ravanContainer.getBoundingClientRect();

    const startX = rectArrow.left + rectArrow.width / 2;
    const startY = rectArrow.top + rectArrow.height / 2;
    const targetX = rectTarget.left + rectTarget.width / 2;
    const targetY = rectTarget.top + rectTarget.height * 0.45; // Hit the navel/chest

    // Create flying arrow projectile in body
    const flyingArrow = document.createElement('div');
    flyingArrow.className = 'flying-brahmastra-arrow';
    document.body.appendChild(flyingArrow);

    flyingArrow.style.left = `${startX}px`;
    flyingArrow.style.top = `${startY}px`;

    const deltaX = targetX - startX;
    const deltaY = targetY - startY;
    const distance = Math.hypot(deltaX, deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    flyingArrow.style.transform = `rotate(${angle}deg)`;

    // Spawn sparks along arrow trail
    const trailInterval = setInterval(() => {
      const curRect = flyingArrow.getBoundingClientRect();
      this.particles.burstShower(curRect.left, curRect.top, 3);
    }, 45);

    // Animate flight via CSS transitions or RAF
    const flightDuration = Math.max(450, Math.min(750, distance * 0.9));
    flyingArrow.style.transition = `all ${flightDuration}ms cubic-bezier(0.2, 0.8, 0.25, 1)`;

    requestAnimationFrame(() => {
      flyingArrow.style.left = `${targetX}px`;
      flyingArrow.style.top = `${targetY}px`;
    });

    setTimeout(() => {
      clearInterval(trailInterval);
      flyingArrow.remove();
      this.onArrowImpact(targetX, targetY);
    }, flightDuration);
  }

  onArrowImpact(x, y) {
    this.isDefeated = true;

    // Trigger powerful sound effects
    this.sound.playFirework();
    setTimeout(() => this.sound.playTempleBell(660, 4.0), 150);
    setTimeout(() => this.sound.playFirework(), 300);
    setTimeout(() => this.sound.playBlessingChime(), 600);

    // Screen Shake
    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 600);

    // Canvas flower & gold leaf explosion
    this.particles.burstShower(x, y, 65);
    this.particles.launchFirework(x, x - 100, y - 140);
    this.particles.launchFirework(x, x + 100, y - 180);
    this.particles.launchFirework(x, x, y - 220);

    // Ravan Effigy burn state
    if (this.ravanContainer) {
      this.ravanContainer.classList.add('burning', 'defeated');
    }

    // Confetti Fireworks Celebration
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { x: x / window.innerWidth, y: y / window.innerHeight },
      colors: ['#FFD700', '#FF4500', '#FF1493', '#00FF7F', '#FFFFFF']
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF4500']
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF4500']
      });
    }, 400);

    // Show Victory Celebration Banner
    setTimeout(() => {
      if (this.victoryBanner) {
        this.victoryBanner.classList.add('show');
      }
      if (this.fireBtn) this.fireBtn.style.display = 'none';
      if (this.resetBtn) this.resetBtn.style.display = 'inline-flex';
      this.isFiring = false;
    }, 800);
  }

  resetExperience() {
    this.isDefeated = false;
    this.isFiring = false;
    this.resetString();

    if (this.ravanContainer) {
      this.ravanContainer.classList.remove('burning', 'defeated');
    }
    if (this.victoryBanner) {
      this.victoryBanner.classList.remove('show');
    }
    if (this.fireBtn) this.fireBtn.style.display = 'inline-flex';
    if (this.resetBtn) this.resetBtn.style.display = 'none';

    this.sound.playBlessingChime();
  }
}
