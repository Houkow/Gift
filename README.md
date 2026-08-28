# 🎁 Surprise d'anniversaire

Petit site React (Vite) : cadeau animé → ouverture façon "case opening" → révélation → formulaire (date + jauge d'impatience + note).

## Personnaliser

- **Prénom** : dans `src/App.jsx`, change la constante `PRENOM`.
- **Message de révélation** : `src/components/RevealCard.jsx`.
- **Objets qui défilent dans la case** : `src/components/CaseOpening.jsx` (tableau `POOL` et `PRIZE`).
- **Couleurs / polices** : `src/index.css` (variables `--gold`, `--pink`, etc.).

## Lancer en local

```bash
npm install
npm run dev
```

## Déployer sur GitHub Pages

1. Dans `vite.config.js`, ajoute la ligne `base: '/NOM_DU_REPO/'` (remplace par le nom exact de ton repo GitHub).
2. Build puis publie le dossier `dist` :

```bash
npm run build
npm install -D gh-pages
npx gh-pages -d dist
```

3. Dans les paramètres du repo GitHub → Pages, choisis la branche `gh-pages`.

Ton site sera dispo à `https://TON-PSEUDO.github.io/NOM_DU_REPO/`.
