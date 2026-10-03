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

## Comptes (Firebase)

- Sans `source/firebase-config.json`, l'application est libre d'accès.
- Avec ce fichier (le bloc `firebaseConfig` du projet Firebase), `build-site.py` active la connexion : chaque nouveau compte attend la validation de l'administrateur, et l'application doit se connecter à Internet au moins une fois tous les 7 jours.
- Les règles de sécurité de la base sont dans `firestore.rules` (à coller dans Firestore, onglet Règles).
- `firebase/` contient le kit Firebase (version 12.19.0), servi avec l'application pour fonctionner hors connexion.
