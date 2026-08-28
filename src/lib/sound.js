// Petits sons synthétisés (pas de fichier audio à charger) pour le tic-tac
// de la roulette et le carillon de victoire. Silencieux si le navigateur
// bloque l'audio pour une raison quelconque — jamais bloquant.

let ctx;

function getCtx() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function playTick(volume = 0.05) {
  try {
    const audioCtx = getCtx();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "square";
    osc.frequency.value = 720;
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } catch {
    // audio non disponible, on ignore silencieusement
  }
}

export function playWin() {
  try {
    const audioCtx = getCtx();
    if (!audioCtx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // Do Mi Sol Do
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = audioCtx.currentTime + i * 0.11;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.15, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + 0.36);
    });
  } catch {
    // audio non disponible, on ignore silencieusement
  }
}

// Programme une série de "tics" qui se rapprochent puis s'espacent,
// pour accompagner visuellement le ralentissement de la roulette.
export function scheduleTicks(durationMs, count = 26) {
  const ids = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const eased = Math.pow(t, 1.8); // tics serrés au début, espacés à la fin
    const delay = eased * durationMs;
    ids.push(window.setTimeout(() => playTick(), delay));
  }
  return () => ids.forEach((id) => window.clearTimeout(id));
}
