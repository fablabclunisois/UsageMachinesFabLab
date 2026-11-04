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
   Ajoute une seconde propriété `CODE_GESTIONNAIRE` (un autre code, que toi seul connais) : il protège la page d'impression des QR codes.
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
1. Ouvre une fois sur ton ordinateur : `https://TON-COMPTE.github.io/fablab-machines/?k=TON_CODE_D_ACCES`
   (le code `CLE_ACCES`), puis ouvre `https://TON-COMPTE.github.io/fablab-machines/?qr` et saisis ton `CODE_GESTIONNAIRE`.
   Cette page n'est liée nulle part dans l'appli.
2. Tu obtiens un QR général et un QR par machine (la machine est alors déjà choisie). **Imprime-les** et colle
   chacun sur sa machine. Ils contiennent le code d'accès : à ne pas publier en ligne.
3. Le premier scan enregistre le code dans le téléphone ; ensuite l'étudiant peut « Ajouter à l'écran d'accueil »
   (Chrome ⋮ > *Installer l'application*).

## Ce que remplissent les étudiants

| Machine | Champs |
|---|---|
| Tous | étudiant / projet / « / », heure de lancement (préremplie) |
| FDM | durée prévue (slicer), buse(s) utilisée(s) et, **pour chaque buse**, le matériau et la masse utilisée (g, facultative) |
| SLA | durée prévue, matériau, volume (mL) |
| SLS | durée prévue, volume (mL), matériau (facultatif) |
| Découpe laser | matériau découpé, durée (prévue **ou** effective), laser CO2/YAG, lentille 1.5" / 2.85" / 5" |
| Usinage | durée effective, matériau usiné |

Plus une remarque libre. Dans **« Mes saisies »** (propres à chaque téléphone) : *Modifier* (échec, changement de machine,
correction…), boutons rapides *Terminé* / *Échec*, et *Relancer* (copie d'une saisie). Statuts : Lancé, Terminé, Échec, Annulé.
Il n'y a pas de suppression côté étudiant : on passe en « Annulé » pour que l'historique reste complet.

**État des machines en direct** : sur la page d'accueil, chaque machine affiche *Libre*, *En cours · fin prévue 14:30* ou
*Libre* dès la fin prévue (rafraîchi à l'ouverture et chaque minute). Il se calcule à partir des saisies au statut
« Lancé » : heure de lancement + durée. Une machine redevient « Libre » quand l'étudiant appuie sur *Terminé* / *Échec*,
ou automatiquement une fois la fin prévue passée (plus de confirmation demandée). Le script ne renvoie que machine, lancement et durée,
jamais de nom ni de remarque. Pour un lancement fait hors réseau, l'état n'apparaît chez les autres qu'après l'envoi.

Sans réseau, la saisie est gardée sur le téléphone puis envoyée automatiquement au retour de la connexion
(le badge en haut indique « à envoyer »).

## Côté gestionnaire

- **« Saisies »** : ton tableau de travail (colonnes « Masse (g) » = total et « Détail par buse » = matériau et masse de chaque buse) (filtres, tableaux croisés, *Fichier > Télécharger > Excel*). Tu peux y corriger
  une ligne à la main. Évite de changer la colonne `id`.
- **« Historique »** : ajout seul, ne jamais y supprimer. Chaque ligne garde l'enregistrement complet (JSON) à cet instant.
- **Sauvegarde mensuelle (facultatif)** : dans l'éditeur Apps Script, choisis la fonction `installerSauvegardeMensuelle`
  et clique *Exécuter* une fois : une copie datée du Sheet est créée dans ton Drive le 1er de chaque mois.
- **Matériaux proposés** : listes dans `config.js`. Si tu renseignes `stockUrl` (adresse du `stock.json` de l'appli de stock),
  les matériaux de filament, de résine et de plaques laser réellement en stock sont aussi proposés. Le champ reste libre.
- **Ajouter / renommer une machine** : modifie `config.js` et republie ; les anciennes saisies gardent le nom d'origine.
- **Changer le code d'accès** : modifie `CLE_ACCES` dans le script et réimprime les QR codes.

## Marquer une machine « terminée » pour tous

Quand une machine est indiquée *En cours* ou *Fin prévue dépassée* (parce que l'utilisateur précédent a oublié de clôturer), tout utilisateur
peut appuyer sur **✓ Marquer terminée** : sous la machine dans la liste, ou dans le bandeau qui apparaît quand on scanne le QR code de la machine.
Après confirmation, toutes les saisies « Lancé » de cette machine passent à « Terminé » dans le Sheet, et la machine redevient « Libre » pour tout le monde.

- Chaque clôture est tracée dans l'onglet « Historique » (action « clôture machine ») et la colonne « Clôturé par machine » de « Saisies » est renseignée. Le Sheet ne garde pas qui a cliqué.
- Un téléphone resté sur « Lancé » ne peut pas remettre la saisie en cours en la modifiant ensuite.
- Il faut du réseau (la clôture n'est pas mise en attente hors ligne).
- Pour retirer le bouton : ajoute `forceFinish: false,` dans `config.js`.

## Onglet « Historique »

Troisième onglet de l'appli : choix du mois (24 derniers mois, ou « Tout »), nombre d'utilisations, durée cumulée et échecs, courbe par mois,
et une carte par machine (utilisations, durée, matière en g pour la FDM, volume en mL pour la SLA/SLS). Les statistiques sont **anonymes** :
le script ne renvoie jamais de nom ni de remarque, et les saisies « Annulé » sont exclues.

- Elles sont calculées à partir de l'onglet **« Saisies »** du Sheet. Si tu y supprimes des lignes, elles disparaissent de l'historique.
- Les copies de sauvegarde mensuelles dans ton Drive sont des fichiers à part : l'appli ne les lit pas, et n'en a pas besoin, puisque le Sheet garde tous les mois.
- Après mise à jour de `Code.gs` : exécute `doGet` une fois depuis l'éditeur (réautorisation), puis *Déployer > Gérer les déploiements > ✎ > Nouvelle version*.

## Apparence

- Bouton **Thème** en haut de l'appli : 5 palettes (Atelier, Arts et Métiers violet/jaune, Océan, Forêt, Graphite) et mode Auto / Clair / Sombre. Le choix est mémorisé sur chaque téléphone.
- Thème proposé par défaut : `defaultPalette` dans `config.js`.
- Palette à tes couleurs (ex. 4D Pioneers) : décommente `customPalette` dans `config.js` et renseigne deux codes `#RRGGBB`
  (couleur principale + couleur d'accent) ; elle apparaît dans le sélecteur.
- Icône de l'appli : le dossier `logos/` contient 5 propositions. Pour en changer, il faut remplacer `icon.svg`, `icon-192.png` et
  `icon-512.png` (je peux les générer dans la palette de ton choix) ; l'icône déjà installée sur un téléphone ne change qu'après réinstallation.

## Dépannage : « Script Google injoignable » / l'envoi échoue

À chaque modification de `Code.gs` (ou si Google redemande l'accès), **les autorisations doivent être revalidées** :
1. Dans l'éditeur Apps Script, choisis la fonction `doGet` dans la liste en haut et clique **Exécuter** : Google propose d'autoriser (*Examiner les autorisations > ton compte > Avancé > Accéder à… > Autoriser*).
2. Puis *Déployer > Gérer les déploiements > ✎ > Nouvelle version > Déployer*.
3. Vérifie que l'URL `…/exec` ouverte dans le navigateur du téléphone affiche `{"ok":true,…}`.

Autres causes : déploiement qui n'est pas ouvert à « Tout le monde », `scriptUrl` qui ne finit pas par `/exec`, code d'accès (`?k=…`) absent du téléphone, Wi-Fi filtré.
Le badge en haut de l'appli et le bandeau indiquent la cause ; l'onglet *Exécutions* d'Apps Script montre si les requêtes arrivent.

## Bon à savoir

- Les saisies contiennent des noms d'étudiants : elles ne sont que dans ton Sheet, mais pense à le mentionner si tu tiens un registre RGPD.
- Quelqu'un qui voit un QR code obtient le code d'accès : en pratique ça limite l'écriture aux personnes passées au FabLab, pas plus.
- Une saisie modifiée dans le Sheet par toi, puis modifiée à nouveau par l'étudiant depuis son téléphone, sera écrasée par la version de l'étudiant (la tienne reste dans l'historique).
- Limites gratuites de Google (quotas du script) largement suffisantes pour un FabLab.

> Mise à jour du script : si ton Sheet existe déjà, colle le nouveau `Code.gs` et redéploie une nouvelle version ; les deux nouvelles colonnes s'ajoutent à droite au premier envoi, sans toucher aux lignes existantes.

## Entretien des machines (onglet « Entretien »)

Rappels d'entretien d'après les préconisations des constructeurs : pour chaque machine, la liste des tâches avec l'état
**À jour / Bientôt (≥ 85 %) / En retard**, et un badge rouge sur l'onglet. L'échéance est la première atteinte entre les heures d'utilisation et les mois.

- **Plans** : `maintenance.js` (UltiMaker, UP BOX+, Bambu P1S, uPrint SE, Sinterit Lisa X, Trotec, Form 4). Chaque plan indique sa source.
  Les rappels sans échéance chiffrée (nettoyage de la lentille, ventilateurs…) sont listés en texte. EMotion, Charly Robot et Tour numérisé n'ont pas de plan.
- **Compteurs** : `config.js` > `maintenance` : heures cumulées à la date `asOf` (tes fichiers Excel 2025-2026, au 02/11/2026) ; l'appli y ajoute
  les durées saisies ensuite dans l'onglet « Saisies » (hors « Annulé »). Pour repartir d'un nouvel Excel : mets à jour `asOf` et `hours`.
- **« Entretien fait »** : demande le `CODE_GESTIONNAIRE` et écrit une ligne dans l'onglet **« Maintenance »** du Sheet (machine, tâche, heures machine).
  Le compteur de la tâche repart de zéro à ce moment. Pour annuler une erreur : supprime la ligne dans le Sheet.
- Tant qu'un entretien n'est pas enregistré, la tâche est comptée depuis la **première utilisation** de la machine : beaucoup de tâches apparaissent donc en retard au début.
- Mise à jour : colle le nouveau `Code.gs`, exécute `doGet` (réautorisation), puis *Déployer > Nouvelle version* ; republie `index.html`, `config.js`, `maintenance.js`, `sw.js`.
