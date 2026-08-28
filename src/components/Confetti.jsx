import "./Confetti.css";

const COLORS = ["#ff3d78", "#f2b84b", "#6c9bd1", "#9b6fd1", "#f2ecdb"];

// Confettis qui tombent du haut de l'écran, comme une vraie pluie de confettis.
export default function Confetti({ count = 40 }) {
  const pieces = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 6 + Math.random() * 6,
    color: COLORS[i % COLORS.length],
    duration: 2.4 + Math.random() * 1.8,
    delay: Math.random() * 0.5,
    drift: (Math.random() - 0.5) * 90,
    rotate: Math.random() * 360,
  }));

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti__piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--drift": `${p.drift}px`,
            "--rot": `${p.rotate + 360}deg`,
          }}
        />
      ))}
    </div>
  );
}
