# Outils basse

Métronome avancé, boîte à rythmes, drone ou ligne de basse et grille d'accords pour travailler la basse.

Conçu par **aupa**. © 2026 aupa.

Application : https://aupa83.github.io/Basse/

## Installer sur le téléphone

- **iPhone (Safari)** : ouvrir le lien, bouton Partager, puis « Sur l'écran d'accueil ».
- **Android (Chrome)** : ouvrir le lien, menu ⋮, puis « Installer l'application » ou « Ajouter à l'écran d'accueil ».

Une fois installée, l'application s'ouvre en plein écran et fonctionne sans connexion.

## Mettre à jour

1. Modifier `source/outils-basse.html`.
2. Reconstruire la page installable : `python3 source/build-site.py source/outils-basse.html index.html`
3. Changer `VERSION` dans `sw.js` pour que les téléphones récupèrent la nouvelle version.
