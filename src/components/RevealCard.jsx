import Confetti from "./Confetti";
import "./RevealCard.css";

export default function RevealCard({ prenom, onContinue }) {
  return (
    <section className="stage reveal">
      <Confetti count={45} />

      <span className="reveal__emoji"></span>
      <h1 className="reveal__title">BRAVO, QUELLE CHANCE !</h1>
      <p className="reveal__subtitle">Voici ta récompense :</p>

      <div className="reveal__card">
        <span className="reveal__hearts">💕</span>
        <p className="reveal__prize">Un date avec moi</p>
      </div>

      <p className="reveal__next"></p>

      <button className="reveal__cta" onClick={onContinue}>
        Réclamer mon cadeau →
      </button>
    </section>
  );
}
