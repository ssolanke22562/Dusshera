// Main Application Controller
// Integrates Sound, Canvas Particles, Bow Experience, Diya Ritual, and Sharing

import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { sound } from './audio.js';
import { ParticleEngine } from './particles.js';
import { BowExperience } from './bow.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Particles Engine
  const canvas = document.getElementById('particles-canvas');
  const particles = new ParticleEngine(canvas);
  particles.setSoundCallback(() => sound.playFirework());
  particles.start();

  // 2. Initialize Bow & Arrow Arena
  const bowContainer = document.querySelector('.interactive-epic-arena');
  const bowExp = new BowExperience(bowContainer, sound, particles);

  // 3. Audio Controls
  const audioBtn = document.getElementById('btn-audio-toggle');
  const audioLabel = document.getElementById('audio-label');
  let isAudioPlaying = false;

  const toggleSound = () => {
    sound.ensureContext();
    if (!isAudioPlaying) {
      sound.startAmbientDrone();
      sound.playTempleBell(880, 2.5);
      isAudioPlaying = true;
      audioBtn.classList.add('playing');
      audioLabel.textContent = 'Music: ON';
      showToast('Festive Indian Drone & Bells Enabled 🔔');
    } else {
      sound.stopAmbientDrone();
      isAudioPlaying = false;
      audioBtn.classList.remove('playing');
      audioLabel.textContent = 'Music: OFF';
      showToast('Sound Muted 🔇');
    }
  };

  audioBtn.addEventListener('click', toggleSound);

  // Allow first user interaction anywhere to unlock audio context smoothly
  const unlockAudio = () => {
    sound.ensureContext();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);

  // 4. Global Click Flower / Gold Leaf Shower Burst
  window.addEventListener('click', (e) => {
    // Avoid triggering when clicking interactive buttons
    if (e.target.closest('button, input, a, .divine-arrow, .amrit-navel-target')) return;
    particles.burstShower(e.clientX, e.clientY, 14);
  });

  // 5. "Shower Sona" Button
  const showerSonaBtn = document.getElementById('btn-shower-sona');
  if (showerSonaBtn) {
    showerSonaBtn.addEventListener('click', (e) => {
      sound.ensureContext();
      sound.playBlessingChime();
      
      const rect = showerSonaBtn.getBoundingClientRect();
      particles.burstShower(rect.left + rect.width / 2, rect.top, 50);

      // Also trigger golden confetti
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.15 },
        colors: ['#FFD700', '#FFA500', '#FFF8DC', '#FF4500']
      });

      showToast('🍃 Golden Apta Leaves & Marigolds Showered!');
    });
  }

  // 6. "Receive Your Gold Leaves" Tradition button
  const collectSonaBtn = document.getElementById('btn-collect-sona');
  if (collectSonaBtn) {
    collectSonaBtn.addEventListener('click', () => {
      sound.ensureContext();
      sound.playTempleBell(1046, 3.0);
      particles.burstShower(window.innerWidth / 2, window.innerHeight * 0.6, 70);

      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFF', '#FF8F00']
      });

      showToast('✨ Sona (Gold) Accepted! May your life be filled with wealth and joy!');
    });
  }

  // 7. Scroll to Bow Arena Button
  const scrollBowBtn = document.getElementById('btn-scroll-bow');
  if (scrollBowBtn) {
    scrollBowBtn.addEventListener('click', () => {
      const arena = document.getElementById('bow-arena-section');
      if (arena) {
        arena.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          bowExp.quickFireAnimation();
        }, 600);
      }
    });
  }

  // 8. Diya Lamp Interactive Lighting Ritual
  const diyaCards = document.querySelectorAll('.diya-card');
  const diyaBlessingBanner = document.getElementById('diya-blessing-text');

  diyaCards.forEach((card) => {
    card.addEventListener('click', () => {
      sound.ensureContext();
      sound.playTempleBell(880 + Math.random() * 200, 2.5);

      const isAlreadyLit = card.classList.contains('active-lit');
      card.classList.add('active-lit');
      
      const btn = card.querySelector('.diya-action-btn');
      if (btn) btn.textContent = 'Lighted ✨';

      const blessing = card.getAttribute('data-blessing');
      if (diyaBlessingBanner && blessing) {
        diyaBlessingBanner.textContent = blessing;
        diyaBlessingBanner.parentElement.classList.add('highlight');
        setTimeout(() => diyaBlessingBanner.parentElement.classList.remove('highlight'), 800);
      }

      // Sparkles at diya position
      const rect = card.getBoundingClientRect();
      particles.burstShower(rect.left + rect.width / 2, rect.top + 20, 18);
    });
  });

  // 9. Personalization (URL Params + Input)
  const recipientInput = document.getElementById('recipient-input');
  const applyNameBtn = document.getElementById('btn-apply-name');
  const recipientDisplay = document.getElementById('recipient-name-display');
  const recipientTag = document.getElementById('personalized-recipient-tag');
  const openPersonalizeBtn = document.getElementById('btn-open-personalize');

  // Check URL parameters for ?to=Name
  const urlParams = new URLSearchParams(window.location.search);
  const toParam = urlParams.get('to');
  if (toParam) {
    setRecipientName(toParam);
  }

  function setRecipientName(name) {
    if (!name || !name.trim()) {
      if (recipientTag) recipientTag.style.display = 'none';
      return;
    }
    const cleanName = name.trim();
    if (recipientDisplay) recipientDisplay.textContent = cleanName;
    if (recipientTag) recipientTag.style.display = 'inline-block';
    if (recipientInput) recipientInput.value = cleanName;
  }

  if (applyNameBtn && recipientInput) {
    applyNameBtn.addEventListener('click', () => {
      const val = recipientInput.value.trim();
      setRecipientName(val);
      sound.playBlessingChime();
      showToast(`Greeting updated for ${val || 'you'}! 💌`);
      
      // Update browser URL query without reload
      const newUrl = new URL(window.location);
      if (val) {
        newUrl.searchParams.set('to', val);
      } else {
        newUrl.searchParams.delete('to');
      }
      window.history.replaceState({}, '', newUrl);

      // Smooth scroll up to hero to see the change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (openPersonalizeBtn) {
    openPersonalizeBtn.addEventListener('click', () => {
      const section = document.querySelector('.share-wishes-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        if (recipientInput) recipientInput.focus();
      }
    });
  }

  // 10. WhatsApp & Social Sharing
  const whatsappBtn = document.getElementById('btn-share-whatsapp');
  const copyLinkBtn = document.getElementById('btn-copy-link');
  const shareTopBtn = document.getElementById('btn-share-top');

  function getShareUrl() {
    return window.location.href;
  }

  function getShareMessage() {
    const toName = recipientInput && recipientInput.value.trim() ? recipientInput.value.trim() : '';
    const addressedTo = toName ? `Dear ${toName}, ` : '';
    return `🏹 *Happiest Dussera To You!* 🏹\n\n` +
      `${addressedTo}May the divine light of Vijayadashami destroy all negativity and illuminate your path with triumph, prosperity, and endless joy!\n\n` +
      `🌸 *Regards: Sarthak Solanke and Family* 🌸\n\n` +
      `Experience the interactive greeting & fire Lord Rama's arrow:\n${getShareUrl()}`;
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const msg = encodeURIComponent(getShareMessage());
      window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
    });
  }

  if (shareTopBtn) {
    shareTopBtn.addEventListener('click', () => {
      const section = document.querySelector('.share-wishes-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(getShareUrl());
        showToast('Link copied to clipboard! 📋');
      } catch (err) {
        showToast('Greeting link: ' + getShareUrl());
      }
    });
  }

  // 11. Toast System
  function showToast(message) {
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // 12. Entrance Animations with GSAP
  gsap.from('.top-nav-bar', {
    y: -40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });

  gsap.from('.hero-card-container', {
    scale: 0.94,
    opacity: 0,
    duration: 1.2,
    delay: 0.2,
    ease: 'power2.out'
  });

  gsap.from('.main-greeting-title', {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: 'back.out(1.7)'
  });

  gsap.from('.regards-signature-card', {
    y: 20,
    opacity: 0,
    duration: 1,
    delay: 0.8,
    ease: 'power2.out'
  });
});
