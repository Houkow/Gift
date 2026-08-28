import { useState } from "react";
import GiftBox3D from "./components/GiftBox3D";
import CaseOpening from "./components/CaseOpening";
import RevealCard from "./components/RevealCard";
import DateForm from "./components/DateForm";

// Change ce prénom pour personnaliser le site.
const PRENOM = "Nui";

const STAGES = {
  LANDING: "landing",
  OPENING: "opening",
  REVEAL: "reveal",
  FORM: "form",
};

export default function App() {
  const [stage, setStage] = useState(STAGES.LANDING);

  return (
    <main>
      {stage === STAGES.LANDING && (
        <GiftBox3D prenom={PRENOM} onOpened={() => setStage(STAGES.OPENING)} />
      )}
      {stage === STAGES.OPENING && (
        <CaseOpening key="opening" onFinished={() => setStage(STAGES.REVEAL)} />
      )}
      {stage === STAGES.REVEAL && (
        <RevealCard prenom={PRENOM} onContinue={() => setStage(STAGES.FORM)} />
      )}
      {stage === STAGES.FORM && <DateForm prenom={PRENOM} />}
    </main>
  );
}
