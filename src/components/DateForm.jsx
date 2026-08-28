import { useState } from "react";
import Confetti from "./Confetti";
import "./DateForm.css";

// ⚠️ Remplace cette valeur par un nom de topic difficile à deviner
// (ex: "annif-lea-9f3k2") avant de déployer. N'importe qui connaissant
// ce nom peut lire les notifications envoyées dessus.
const NTFY_TOPIC = "annif-nui-9f3k2x";

const MOODS = [
  { emoji: "😭", label: "Pas envie..." },
  { emoji: "😞", label: "Bof bof" },
  { emoji: "😊", label: "Ça me va !" },
  { emoji: "🥰", label: "J'adore !" },
  { emoji: "😍", label: "Trop hâte !!" },
];

// Envoie une notification push via ntfy.sh — pas de serveur à héberger,
// juste s'abonner au même topic dans l'appli ntfy (iOS/Android) ou sur
// https://ntfy.sh/<ton-topic> dans un navigateur.
async function sendNtfyNotification({ prenom, date, time, moodLabel, happiness }) {
  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  try {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: "POST",
      body: `${prenom || "Elle"} a choisi le ${formattedDate} à ${time}. Humeur : ${moodLabel} (${happiness}/10)`,
      headers: {
        Title: "🎁 Elle a répondu !",
        Priority: "urgent",
        Tags: "tada,gift",
      },
    });
  } catch {
    // Si la notif échoue (pas de réseau, topic mal configuré...), on ne
    // bloque pas son expérience : elle voit quand même l'écran de confirmation.
  }
}

export default function DateForm({ prenom }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mood, setMood] = useState(2);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !time) return;
    const happiness = (mood + 1) * 2;
    sendNtfyNotification({ prenom, date, time, moodLabel: MOODS[mood].label, happiness });
    setSubmitted(true);
  };

  if (submitted) {
    const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const happiness = (mood + 1) * 2;

    return (
      <section className="stage confirm">
        <Confetti count={45} />
        <span className="confirm__emoji"></span>
        <h1 className="confirm__title">C'est noté !</h1>
        <p className="confirm__date">
          Le <em>{formattedDate}</em> à <em>{time}</em>
        </p>
        <p className="confirm__mood">
          Niveau de bonheur : {happiness}/10 {MOODS[mood].emoji}
        </p>
        <div className="confirm__bar">
          <div className="confirm__bar-fill" style={{ width: `${happiness * 10}%` }} />
        </div>
        <p className="confirm__sign">De quelqu'un qui pense à toi ❤️</p>
        <p className="confirm__sign">
          Passe une merveilleuse journée, ma star, tu le mérites tellement. Bon 20ème anniversaire hihi !
        </p>
      </section>
    );
  }

  return (
    <section className="stage dateform">
      <form className="dateform__card" onSubmit={handleSubmit}>
        <h2 className="dateform__title">Ton cadeau t'attend</h2>
        <p className="dateform__subtitle">Choisis une date et une heure, je m'occupe du reste.</p>

        <div className="dateform__row">
          <label className="dateform__field">
            <span className="dateform__label">La date parfaite :</span>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="dateform__date"
            />
          </label>

          <label className="dateform__field">
            <span className="dateform__label">À quelle heure ?</span>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="dateform__date"
            />
          </label>
        </div>

        <div className="dateform__field">
          <span className="dateform__label">Tu es contente de ton cadeau ? {MOODS[mood].emoji}</span>
          <input
            type="range"
            min="0"
            max="4"
            step="1"
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="dateform__slider"
            aria-label="Ton avis sur le cadeau"
          />
          <div className="dateform__mood-row">
            {MOODS.map((m, i) => (
              <span key={i} className={i === mood ? "is-active" : ""}>
                {m.emoji}
              </span>
            ))}
          </div>
          <p className="dateform__mood-label">{MOODS[mood].label}</p>
        </div>

        <button type="submit" className="dateform__submit" disabled={!date || !time}>
          Confirmer mon date 💕
        </button>
      </form>
    </section>
  );
}