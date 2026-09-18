import { PopSoundType, SoundscapeType } from '../types';

// Synthesized Web Audio API sound effects and ambient underwater soundscapes
class SoundController {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public popVariation: PopSoundType = 'classic';
  public currentSoundscape: SoundscapeType = 'off';

  // Soundscape audio nodes
  private soundscapeGain: GainNode | null = null;
  private soundscapeStopFn: (() => void) | null = null;

  public getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Soft water droplet bloop when a bubble is selected
  playSelect(pitchMultiplier = 1.0) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480 * pitchMultiplier, now);
      osc.frequency.exponentialRampToValueAtTime(800 * pitchMultiplier, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Ignore
    }
  }

  // Play bubble pop with customizable sound variations
  playPop(variation: PopSoundType = this.popVariation) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      switch (variation) {
        case 'crystal': {
          // Glassy crystalline chime pop
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc2.type = 'triangle';
          osc1.frequency.setValueAtTime(1046.5, now); // C6
          osc1.frequency.exponentialRampToValueAtTime(1318.5, now + 0.06); // E6
          osc2.frequency.setValueAtTime(2093, now); // C7
          osc2.frequency.exponentialRampToValueAtTime(1567.98, now + 0.08);

          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.2);
          osc2.stop(now + 0.2);
          break;
        }

        case 'deep': {
          // Low hollow sub-bass bubble thump
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(75, now + 0.1);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(400, now);

          gain.gain.setValueAtTime(0.45, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.14);
          break;
        }

        case 'cartoon': {
          // Playful comical boing / cork pop
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.exponentialRampToValueAtTime(950, now + 0.06);
          osc.frequency.exponentialRampToValueAtTime(350, now + 0.11);

          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.13);
          break;
        }

        case 'arcade': {
          // 8-bit retro pulse arpeggio pop
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'square';
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.setValueAtTime(783.99, now + 0.025);
          osc.frequency.setValueAtTime(1046.5, now + 0.05);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.09);
          break;
        }

        case 'classic':
        default: {
          // Crisp wet bubble pop with airy noise transient
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.exponentialRampToValueAtTime(650, now + 0.04);
          osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);

          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.1);

          // Subtle airy noise splash
          const bufferSize = Math.floor(ctx.sampleRate * 0.035);
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }

          const whiteNoise = ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1200, now);
          filter.Q.setValueAtTime(2, now);

          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.12, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

          whiteNoise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(ctx.destination);

          whiteNoise.start(now);
          whiteNoise.stop(now + 0.05);
          break;
        }
      }
    } catch {
      // Ignore audio failure
    }
  }

  // Harmonic chord chime when two numbers successfully match
  playSuccess(streak = 1) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const baseFreq = 523.25; // C5
      const scale = [1, 1.25, 1.5, 2.0]; // C, E, G, High C
      const multiplier = Math.min(1.5, 1 + (streak - 1) * 0.08);

      scale.forEach((interval, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const noteTime = now + index * 0.06;
        const freq = baseFreq * interval * multiplier;

        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.22, noteTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.36);
      });
    } catch {
      // Ignore
    }
  }

  // Cheerful chime played when target number changes
  playTargetChanged(newTarget: number) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // High bright sparkling trill
      const base = 440 + (newTarget % 8) * 35;
      const notes = [base, base * 1.25, base * 1.5, base * 2];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const t = now + idx * 0.05;

        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.3);
      });
    } catch {
      // Ignore
    }
  }

  // Gentle underwater wobble for incorrect sum
  playError() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.15);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Ignore
    }
  }

  // Shimmering chime
  playReveal() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [659.25, 830.61, 987.77];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const t = now + idx * 0.05;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.26);
      });
    } catch {
      // Ignore
    }
  }

  // Victory / Game finished chime
  playVictory() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const chords = [523.25, 659.25, 783.99, 1046.5];
      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const t = now + idx * 0.09;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.65);
      });
    } catch {
      // Ignore
    }
  }

  // ==========================================
  // UNDERWATER AMBIENT SOUNDSCAPES
  // Pure Web Audio synthesized continuous soundscapes
  // ==========================================

  setSoundscape(soundscape: SoundscapeType) {
    this.currentSoundscape = soundscape;
    this.stopSoundscape();

    if (!this.enabled || soundscape === 'off') {
      return;
    }

    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 1.5);
      masterGain.connect(ctx.destination);
      this.soundscapeGain = masterGain;

      const activeNodes: (AudioNode | number)[] = [];

      if (soundscape === 'deep_ocean') {
        // Deep Ocean Hum & Pressure Swell
        // Sub-bass drone
        const subOsc1 = ctx.createOscillator();
        const subOsc2 = ctx.createOscillator();
        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.35, ctx.currentTime);

        subOsc1.type = 'sine';
        subOsc1.frequency.setValueAtTime(52, ctx.currentTime);
        subOsc2.type = 'sine';
        subOsc2.frequency.setValueAtTime(78, ctx.currentTime);

        subOsc1.connect(subGain);
        subOsc2.connect(subGain);
        subGain.connect(masterGain);
        subOsc1.start();
        subOsc2.start();
        activeNodes.push(subOsc1, subOsc2, subGain);

        // Low ocean swell noise
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + white * 0.05;
          b1 = 0.96 * b1 + white * 0.11;
          b2 = 0.86 * b2 + white * 0.25;
          data[i] = (b0 + b1 + b2) * 0.15;
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, ctx.currentTime);

        // LFO for slow breathing swells
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.09, ctx.currentTime); // ~11 sec wave
        lfoGain.gain.setValueAtTime(80, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        noiseNode.connect(filter);
        filter.connect(masterGain);

        lfo.start();
        noiseNode.start();
        activeNodes.push(noiseNode, filter, lfo, lfoGain);
      } else if (soundscape === 'coral_reef') {
        // Coral Reef: Warm aquatic tidal currents & gentle organic bubble ticks
        const bufferSize = ctx.sampleRate * 3;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.2;
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        const bandFilter = ctx.createBiquadFilter();
        bandFilter.type = 'bandpass';
        bandFilter.frequency.setValueAtTime(450, ctx.currentTime);
        bandFilter.Q.setValueAtTime(1.5, ctx.currentTime);

        // Slow wave modulation
        const waveLfo = ctx.createOscillator();
        const waveGain = ctx.createGain();
        waveLfo.type = 'sine';
        waveLfo.frequency.setValueAtTime(0.14, ctx.currentTime);
        waveGain.gain.setValueAtTime(220, ctx.currentTime);

        waveLfo.connect(waveGain);
        waveGain.connect(bandFilter.frequency);

        noiseNode.connect(bandFilter);
        bandFilter.connect(masterGain);

        waveLfo.start();
        noiseNode.start();
        activeNodes.push(noiseNode, bandFilter, waveLfo, waveGain);

        // Periodic microscopic coral bubble clicks
        const tickInterval = window.setInterval(() => {
          if (!this.enabled || !this.ctx || this.currentSoundscape !== 'coral_reef') return;
          try {
            const t = this.ctx.currentTime;
            const tickOsc = this.ctx.createOscillator();
            const tickGain = this.ctx.createGain();
            tickOsc.type = 'sine';
            const f = 1100 + Math.random() * 900;
            tickOsc.frequency.setValueAtTime(f, t);
            tickGain.gain.setValueAtTime(0.015, t);
            tickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
            tickOsc.connect(tickGain);
            tickGain.connect(masterGain);
            tickOsc.start(t);
            tickOsc.stop(t + 0.05);
          } catch {
            // Ignore
          }
        }, 1800);
        activeNodes.push(tickInterval);
      } else if (soundscape === 'whale_song') {
        // Ethereal Whale Sanctuary
        // Low ocean bed foundation
        const bedOsc = ctx.createOscillator();
        const bedGain = ctx.createGain();
        bedOsc.type = 'sine';
        bedOsc.frequency.setValueAtTime(60, ctx.currentTime);
        bedGain.gain.setValueAtTime(0.2, ctx.currentTime);
        bedOsc.connect(bedGain);
        bedGain.connect(masterGain);
        bedOsc.start();
        activeNodes.push(bedOsc, bedGain);

        // Distant gentle whale calls trigger every ~5 seconds
        const whaleInterval = window.setInterval(() => {
          if (!this.enabled || !this.ctx || this.currentSoundscape !== 'whale_song') return;
          try {
            const t = this.ctx.currentTime;
            const wOsc = this.ctx.createOscillator();
            const wGain = this.ctx.createGain();
            wOsc.type = 'sine';
            const startFreq = 260 + Math.random() * 80;
            const midFreq = startFreq * (1.3 + Math.random() * 0.4);
            const endFreq = startFreq * (0.8 + Math.random() * 0.3);

            wOsc.frequency.setValueAtTime(startFreq, t);
            wOsc.frequency.exponentialRampToValueAtTime(midFreq, t + 1.2);
            wOsc.frequency.exponentialRampToValueAtTime(endFreq, t + 2.4);

            wGain.gain.setValueAtTime(0.001, t);
            wGain.gain.linearRampToValueAtTime(0.08, t + 0.6);
            wGain.gain.linearRampToValueAtTime(0.05, t + 1.8);
            wGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.8);

            wOsc.connect(wGain);
            wGain.connect(masterGain);
            wOsc.start(t);
            wOsc.stop(t + 2.9);
          } catch {
            // Ignore
          }
        }, 4800);
        activeNodes.push(whaleInterval);
      } else if (soundscape === 'zen_tide') {
        // Zen Tidal Drift: Harmonious underwater ambient chords
        const freqs = [82.4, 123.5, 164.8, 246.9]; // E-B-E-B warm chord
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime);

          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(0.08 + i * 0.03, ctx.currentTime);
          lfoGain.gain.setValueAtTime(0.03, ctx.currentTime);

          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          lfo.connect(lfoGain);
          lfoGain.connect(gain.gain);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start();
          lfo.start();
          activeNodes.push(osc, gain, lfo, lfoGain);
        });
      }

      this.soundscapeStopFn = () => {
        try {
          if (this.soundscapeGain && ctx) {
            this.soundscapeGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
            setTimeout(() => {
              activeNodes.forEach((node) => {
                if (typeof node === 'number') {
                  clearInterval(node);
                } else {
                  try {
                    if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
                      (node as AudioScheduledSourceNode).stop();
                    }
                    node.disconnect();
                  } catch {
                    // Ignore
                  }
                }
              });
              try {
                this.soundscapeGain?.disconnect();
              } catch {
                // Ignore
              }
              this.soundscapeGain = null;
            }, 450);
          }
        } catch {
          // Ignore
        }
      };
    } catch {
      // Ignore
    }
  }

  stopSoundscape() {
    if (this.soundscapeStopFn) {
      this.soundscapeStopFn();
      this.soundscapeStopFn = null;
    }
  }
}

export const soundFx = new SoundController();
