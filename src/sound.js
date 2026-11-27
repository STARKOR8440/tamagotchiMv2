class RetroSound {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playTone(freq, duration = 0.08, type = 'square', delay = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  beep() {
    this.playTone(980, 0.06, 'square', 0);
  }

  confirm() {
    this.playTone(880, 0.06, 'square', 0);
    this.playTone(1320, 0.09, 'square', 0.06);
  }

  eat() {
    this.playTone(520, 0.07, 'triangle', 0);
    this.playTone(660, 0.07, 'triangle', 0.08);
    this.playTone(780, 0.09, 'triangle', 0.16);
  }

  win() {
    this.playTone(587, 0.08, 'square', 0);
    this.playTone(784, 0.08, 'square', 0.09);
    this.playTone(988, 0.08, 'square', 0.18);
    this.playTone(1175, 0.16, 'square', 0.27);
  }

  evolve() {
    const notes = [523, 659, 784, 1046, 784, 1046, 1318];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.09, 'square', idx * 0.08);
    });
  }
}

export const sfx = new RetroSound();
