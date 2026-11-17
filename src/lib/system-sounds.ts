type SystemSound = "open" | "close" | "minimize" | "maximize";

export function playSystemSound(sound: SystemSound) {
  if (typeof window === "undefined") return;
  const AudioContextClass =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const frequencies: Record<SystemSound, [number, number]> = {
    open: [392, 523.25],
    close: [523.25, 329.63],
    minimize: [440, 349.23],
    maximize: [349.23, 523.25],
  };
  const [start, end] = frequencies[sound];
  const now = context.currentTime;
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(start, now);
  oscillator.frequency.exponentialRampToValueAtTime(end, now + 0.11);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.045, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.14);
  oscillator.addEventListener("ended", () => void context.close());
}
