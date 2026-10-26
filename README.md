# FabLab – Utilisation des machines

Appli installable sur téléphone (comme l'appli de stock). Les étudiants scannent un QR code, remplissent
une fiche par lancement, et peuvent la modifier ensuite. Tout arrive dans **ton** Google Sheet.

```
téléphone (GitHub Pages) ──► script Google ──► Google Sheet
                                                 ├─ « Saisies »    état actuel (1 ligne par lancement)
                                                 └─ « Historique » journal, une ligne à chaque création/modification
```

Pourquoi un Google Sheet plutôt que GitHub : ici les étudiants doivent *écrire*. Avec GitHub il faudrait
mettre un jeton d'écriture dans l'appli, donc le rendre public. Avec le script Google, personne n'a d'accès
direct à ton tableur, et le script ne renvoie jamais les saisies : les noms des étudiants ne sont lisibles que par toi.

## Mise en ligne (≈ 20 min)

### 1. Le tableur
1. Crée un Google Sheet vide (ex. « FabLab – utilisation des machines »).
2. *Fichier > Paramètres* : fuseau horaire **Paris**.

### 2. Le script Google
1. Dans le Sheet : *Extensions > Apps Script*. Supprime le contenu et colle le fichier **`Code.gs`**. Enregistre.
2. *Paramètres du projet* (roue dentée) > *Propriétés du script* > *Ajouter* : nom `CLE_ACCES`, valeur = un code que tu inventes
   (lettres/chiffres, ex. `Fab8kQ2mZ7`). Il évite que n'importe qui qui trouverait l'adresse du script puisse y écrire.
3. *Déployer > Nouveau déploiement* > type **Application Web** :
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tout le monde**
   Autorise les droits demandés (écran « application non vérifiée » : *Avancé > Accéder à…*).
4. Copie l'**URL de l'application Web** (se termine par `/exec`). La coller dans un navigateur doit afficher `{"ok":true,…}`.

> Si tu modifies `Code.gs` plus tard : *Déployer > Gérer les déploiements > ✎ > Nouvelle version*, sinon l'ancien code reste actif.

### 3. L'appli sur GitHub Pages
1. Ouvre **`config.js`** : colle l'URL `/exec` dans `scriptUrl` et adapte la liste `machines` à ton parc
   (nom, type, buses de chaque imprimante FDM, etc.).
2. Crée un dépôt public (ex. `fablab-machines`), dépose-y tous les fichiers **sauf `Code.gs` et `README.md`**
   (inutiles en ligne), puis *Settings > Pages* : branche `main`, dossier `/ (root)`.
3. L'adresse sera `https://TON-COMPTE.github.io/fablab-machines/`.

### 4. Les QR codes
1. Ouvre une fois sur ton téléphone ou ordinateur :
   `https://TON-COMPTE.github.io/fablab-machines/?k=TON_CODE_D_ACCES` (le code de l'étape 2.2), puis clique sur
   **« QR codes à imprimer »** en bas de page (ou ajoute `&qr` à l'adresse).
2. Tu obtiens un QR général et un QR par machine (la machine est alors déjà choisie). **Imprime-les** et colle
   chacun sur sa machine. Ils contiennent le code d'accès : à ne pas publier en ligne.
3. Le premier scan enregistre le code dans le téléphone ; ensuite l'étudiant peut « Ajouter à l'écran d'accueil »
   (Chrome ⋮ > *Installer l'application*).

## Ce que remplissent les étudiants

| Machine | Champs |
|---|---|
| Tous | étudiant / projet / « / », heure de lancement (préremplie) |
| FDM | durée prévue (slicer), buse(s) utilisée(s), matériau(x) |
| SLA | durée prévue, matériau, volume (mL) |
| SLS | durée prévue, volume (mL), matériau (facultatif) |
| Découpe laser | durée (prévue **ou** effective), laser CO2/YAG, lentille 1.5" / 2.85" / 5" |
| Usinage | durée effective, matériau usiné |

Plus une remarque libre. Dans **« Mes saisies »** (propres à chaque téléphone) : *Modifier* (échec, changement de machine,
correction…), boutons rapides *Terminé* / *Échec*, et *Relancer* (copie d'une saisie). Statuts : Lancé, Terminé, Échec, Annulé.
Il n'y a pas de suppression côté étudiant : on passe en « Annulé » pour que l'historique reste complet.

**État des machines en direct** : sur la page d'accueil, chaque machine affiche *Libre*, *En cours · fin prévue 14:30* ou
*Fin prévue dépassée · à confirmer* (rafraîchi à l'ouverture et chaque minute). Il se calcule à partir des saisies au statut
« Lancé » : heure de lancement + durée. Une machine redevient « Libre » quand l'étudiant appuie sur *Terminé* / *Échec*,
ou une fois la durée écoulée (elle est alors signalée « à confirmer »). Le script ne renvoie que machine, lancement et durée,
jamais de nom ni de remarque. Pour un lancement fait hors réseau, l'état n'apparaît chez les autres qu'après l'envoi.

Sans réseau, la saisie est gardée sur le téléphone puis envoyée automatiquement au retour de la connexion
(le badge en haut indique « à envoyer »).

## Côté gestionnaire

- **« Saisies »** : ton tableau de travail (filtres, tableaux croisés, *Fichier > Télécharger > Excel*). Tu peux y corriger
  une ligne à la main. Évite de changer la colonne `id`.
- **« Historique »** : ajout seul, ne jamais y supprimer. Chaque ligne garde l'enregistrement complet (JSON) à cet instant.
- **Sauvegarde mensuelle (facultatif)** : dans l'éditeur Apps Script, choisis la fonction `installerSauvegardeMensuelle`
  et clique *Exécuter* une fois : une copie datée du Sheet est créée dans ton Drive le 1er de chaque mois.
- **Matériaux proposés** : listes dans `config.js`. Si tu renseignes `stockUrl` (adresse du `stock.json` de l'appli de stock),
  les matériaux de filament et de résine réellement en stock sont aussi proposés. Le champ reste libre.
- **Ajouter / renommer une machine** : modifie `config.js` et republie ; les anciennes saisies gardent le nom d'origine.
- **Changer le code d'accès** : modifie `CLE_ACCES` dans le script et réimprime les QR codes.

## Bon à savoir

- Les saisies contiennent des noms d'étudiants : elles ne sont que dans ton Sheet, mais pense à le mentionner si tu tiens un registre RGPD.
- Quelqu'un qui voit un QR code obtient le code d'accès : en pratique ça limite l'écriture aux personnes passées au FabLab, pas plus.
- Une saisie modifiée dans le Sheet par toi, puis modifiée à nouveau par l'étudiant depuis son téléphone, sera écrasée par la version de l'étudiant (la tienne reste dans l'historique).
- Limites gratuites de Google (quotas du script) largement suffisantes pour un FabLab.
