import { useEffect, useMemo, useRef, useState } from "react";
import { playWin, scheduleTicks } from "../lib/sound";
import "./CaseOpening.css";

const ITEM_GAP = 16;
const REEL_LENGTH = 46;
const WINNING_INDEX = 39;
// Un peu plus long qu'avant : le temps de bien voir défiler les lots
// possibles, surtout sur mobile.
const SPIN_DURATION_MS = 8200;

// Chaque item a sa propre teinte de carte, comme sur la référence.
const POOL = [
  { id: "iphone", emoji: "📱", label: "IPhone 17", bg: "#1c2438" },
  { id: "peluche", emoji: "🧸", label: "Peluche", bg: "#3a2a1c" },
  { id: "chaussures", emoji: "👠", label: "Chaussures", bg: "#3a1f24" },
  { id: "bijoux", emoji: "💎", label: "Bijoux", bg: "#1c2c38" },
  { id: "fleurs", emoji: "🌷", label: "Fleurs", bg: "#1f3a2e" },
  { id: "voyage", emoji: "✈️", label: "Voyage", bg: "#1c3838" },
  { id: "vetements", emoji: "👗", label: "Vêtements", bg: "#2a1f38" },
];

const PRIZE = {
  id: "date",
  emoji: "💕",
  label: "Un date avec moi",
  bg: "#3a1428",
  isPrize: true,
};

// La bobine défile dans l'ordre des lots (pas de random) : ils se suivent
// puis la boucle recommence. Le lot gagnant est juste inséré à sa position.
function buildReel() {
  const items = Array.from({ length: REEL_LENGTH }, (_, i) => POOL[i % POOL.length]);
  items[WINNING_INDEX] = PRIZE;
  return items.map((item, i) => ({ ...item, key: `${item.id}-${i}` }));
}

export default function CaseOpening({ onFinished }) {
  const containerRef = useRef(null);
  const cancelTicksRef = useRef(null);
  const [phase, setPhase] = useState("choose"); // choose | spinning | landed
  const [offset, setOffset] = useState(0);

  const previewItems = useMemo(() => [...POOL, PRIZE], []);
  const reel = useMemo(buildReel, []);

  useEffect(() => () => cancelTicksRef.current?.(), []);

  const launchSpin = () => {
    if (phase !== "choose") return;
    // On mesure la vraie largeur rendue (elle change selon la taille d'écran
    // via le CSS), plutôt qu'une constante fixe, pour rester aligné sur mobile.
    const sample = containerRef.current?.querySelector(".case__item");
    const itemWidth = sample ? sample.getBoundingClientRect().width : 148;
    const itemFull = itemWidth + ITEM_GAP;

    setPhase("spinning");
    const jitter = (Math.random() - 0.5) * (itemWidth * 0.5);
    const target = WINNING_INDEX * itemFull + itemWidth / 2 + jitter;
    requestAnimationFrame(() => setOffset(target));

    cancelTicksRef.current = scheduleTicks(SPIN_DURATION_MS);
  };

  const handleTransitionEnd = () => {
    if (phase !== "spinning") return;
    setPhase("landed");
    playWin();
  };

  return (
    <section className="stage case">
      <h2 className="case__title">Choisis ton cadeau (enfin tu choisis pas vraiment enft)</h2>
      <p className="case__subtitle">La chance va décider pour toi...</p>

      <div className="case__reel-wrapper" ref={containerRef}>
        <div className="case__pointer-line" aria-hidden="true" />
        <div className="case__pointer case__pointer--top" aria-hidden="true" />
        <div className="case__pointer case__pointer--bottom" aria-hidden="true" />

        {phase === "choose" ? (
          <div className="case__preview">
            {previewItems.map((item) => (
              <div key={item.id} className="case__item" style={{ background: item.bg }}>
                <span className="case__item-emoji">{item.emoji}</span>
                <span className="case__item-label">{item.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="case__track"
            style={{
              transform: `translateX(-${offset}px)`,
              transitionDuration: phase === "spinning" ? `${SPIN_DURATION_MS / 1000}s` : "0s",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {reel.map((item) => (
              <div
                key={item.key}
                className={`case__item ${item.isPrize && phase === "landed" ? "is-winner" : ""}`}
                style={{ background: item.bg }}
              >
                <span className="case__item-emoji">{item.emoji}</span>
                <span className="case__item-label">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="case__fade case__fade--left" aria-hidden="true" />
        <div className="case__fade case__fade--right" aria-hidden="true" />
      </div>

      {phase === "choose" && (
        <button className="case__cta" onClick={launchSpin}>
          Lancer la roulette
        </button>
      )}
      {phase === "landed" && (
        <button className="case__cta case__cta--gold" onClick={onFinished}>
          Voir mon cadeau
        </button>
      )}
    </section>
  );
}
