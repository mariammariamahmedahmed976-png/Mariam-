/**
 * Audio Synthesizer and Web Audio utility for realistic warm piano/ambient tribute melody
 * and procedurally generated celebratory chime when the glowing heart forms.
 */

class AudioTributeEngine {
  private ctx: AudioContext | null = null;
  private isMelodyPlaying = false;
  private melodyInterval: any = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Plays a celestial angelic chime chord when the surprise heart forms
   */
  public playSurpriseChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Celestial harmonic frequencies: Eb5, G5, Bb5, Eb6, F6
      const freqs = [622.25, 783.99, 932.33, 1244.51, 1396.91];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.18 / (idx + 1), now + idx * 0.08 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 2.5);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 2.6);
      });
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  /**
   * Plays an ambient, peaceful harmonic backdrop note
   */
  public playAmbientNote(freq: number, duration: number = 2) {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch (e) {
      console.warn('Ambient note error:', e);
    }
  }

  /**
   * Toggles peaceful ambient tribute music
   */
  public toggleAmbientMusic(onStateChange?: (playing: boolean) => void) {
    if (this.isMelodyPlaying) {
      this.stopAmbientMusic();
      onStateChange?.(false);
      return false;
    } else {
      this.startAmbientMusic();
      onStateChange?.(true);
      return true;
    }
  }

  public startAmbientMusic() {
    this.initContext();
    this.isMelodyPlaying = true;
    // Gentle melodic notes in C minor / Eb major scale
    const melody = [
      311.13, 392.00, 466.16, 523.25, 466.16, 392.00,
      349.23, 440.00, 523.25, 587.33, 523.25, 440.00,
      392.00, 466.16, 587.33, 622.25, 587.33, 466.16
    ];
    let noteIndex = 0;

    const playNext = () => {
      if (!this.isMelodyPlaying) return;
      const freq = melody[noteIndex % melody.length];
      this.playAmbientNote(freq, 2.8);
      noteIndex++;
      this.melodyInterval = setTimeout(playNext, 1800);
    };

    playNext();
  }

  public stopAmbientMusic() {
    this.isMelodyPlaying = false;
    if (this.melodyInterval) {
      clearTimeout(this.melodyInterval);
      this.melodyInterval = null;
    }
  }

  public getContext(): AudioContext | null {
    this.initContext();
    return this.ctx;
  }
}

export const audioTributeEngine = new AudioTributeEngine();
