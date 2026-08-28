import { useState } from "react";
import Confetti from "./Confetti";
import "./GiftBox3D.css";

export default function GiftBox3D({ prenom, onOpened }) {
  const [opening, setOpening] = useState(false);

  const handleClick = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => onOpened(), 900);
  };

  return (
    <section className="stage landing">
      {opening && <Confetti count={32} />}

      <div className="landing__badge">Ton jour rien qu'à toi</div>
      <h1 className="landing__title">Bon anniversaire{prenom ? `, ${prenom}` : ""} !</h1>
      <p className="landing__subtitle">Pour cette belle occasion, j'ai préparé quelque chose rien que pour toi hehe</p>

      <button
        className={`giftbox ${opening ? "is-opening" : ""}`}
        onClick={handleClick}
        disabled={opening}
        aria-label="Ouvrir le cadeau"
      >
        <span className="giftbox__glow" />
        <span className="giftbox__stack">
          <span className="giftbox__bow">🎀</span>
          <span className="giftbox__emoji">🎁</span>
        </span>
      </button>

      <p className="landing__hint">{opening ? "..." : "Clique sur le cadeau pour découvrir ta surprise"}</p>
    </section>
  );
}
