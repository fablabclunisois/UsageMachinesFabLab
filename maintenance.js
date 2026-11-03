/* Plans d'entretien d'après les préconisations des constructeurs.
   Une tâche : id, label, hours (heures d'utilisation) et/ou months (mois) -> échéance au premier des deux atteint.
   optional : n'entre pas dans le décompte « en retard » (accessoire facultatif).
   info : rappels sans échéance chiffrée (à chaque impression, selon l'état, alerte de la machine…).
   Tu peux ajouter ou modifier un plan dans config.js (maintenance.plans) sans toucher à ce fichier. */
window.FABLAB_PLANS = {

  ultimaker3: {
    name: 'Ultimaker 3',
    source: 'Calendrier UltiMaker (série S / UM2+, base 1 500 h par an) appliqué à l’UM3 : pas de calendrier propre à l’UM3 trouvé.',
    tasks: [
      {id:'clean',  label:'Nettoyer l’imprimante (plateau, buses, tubes Bowden, intérieur)', months:1},
      {id:'xylube', label:'Lubrifier les axes X et Y', months:1},
      {id:'belts',  label:'Vérifier la tension des courroies courtes (moteurs X et Y)', months:3, hours:300},
      {id:'fan',    label:'Nettoyer le ventilateur avant de la tête d’impression', months:3, hours:300},
      {id:'lead',   label:'Lubrifier la vis-mère de l’axe Z', months:3, hours:300},
      {id:'play',   label:'Vérifier le jeu des axes X et Y', months:6, hours:700},
      {id:'feeder', label:'Nettoyer les dévidoirs (feeders)', months:6, hours:700},
      {id:'zlube',  label:'Lubrifier les axes Z', months:6, hours:700},
      {id:'gear',   label:'Lubrifier l’engrenage du dévidoir', months:12, hours:1500},
      {id:'bowden', label:'Vérifier les tubes Bowden (remplacer si abîmés)', months:12, hours:1500}
    ],
    info: ['Nettoyage des print cores : selon le type de core et les matériaux (calendrier UltiMaker séparé).']
  },

  ultimakerS: {
    name: 'Ultimaker S-series',
    source: 'Calendrier de maintenance UltiMaker, série S (S3 à S8), base 1 500 h par an.',
    tasks: [
      {id:'clean',  label:'Nettoyer l’imprimante (plateau, buses, tubes Bowden, intérieur)', months:1},
      {id:'xylube', label:'Lubrifier les axes X et Y', months:1},
      {id:'belts',  label:'Vérifier la tension des courroies courtes (moteurs X et Y)', months:3, hours:300},
      {id:'fan',    label:'Nettoyer le ventilateur avant de la tête d’impression', months:3, hours:300},
      {id:'cover',  label:'Vérifier la gaine de buse (nozzle cover)', months:3, hours:300},
      {id:'lead',   label:'Lubrifier la vis-mère de l’axe Z', months:3, hours:300},
      {id:'play',   label:'Vérifier le jeu des axes X et Y', months:6, hours:700},
      {id:'feeder', label:'Nettoyer les dévidoirs (feeders)', months:6, hours:700},
      {id:'zlube',  label:'Lubrifier les axes Z', months:6, hours:700},
      {id:'gear',   label:'Lubrifier l’engrenage du dévidoir', months:12, hours:1500},
      {id:'bowden', label:'Vérifier les tubes Bowden (remplacer si abîmés)', months:12, hours:1500},
      {id:'airfilter', label:'Remplacer le filtre de l’Air Manager (si équipée)', hours:1500, optional:true}
    ],
    info: ['Nettoyage des print cores : selon le type de core et les matériaux (calendrier UltiMaker séparé).']
  },

  upboxplus: {
    name: 'UP BOX+',
    source: 'Tiertime : filtre HEPA à changer toutes les 300 h ou 6 mois. Pas d’autre échéance chiffrée trouvée.',
    tasks: [
      {id:'hepa', label:'Remplacer le filtre HEPA', hours:300, months:6}
    ],
    info: ['Pas d’autre échéance chiffrée trouvée chez le constructeur (nettoyage de la buse et du plateau selon l’état).']
  },

  bambup1: {
    name: 'Bambu Lab P1S',
    source: 'Wiki Bambu Lab, page de maintenance de la P1P (la page P1S n’était pas accessible ; mêmes tiges et vis-mères).',
    tasks: [
      {id:'xrods',  label:'Contrôler et nettoyer les tiges X (alcool isopropylique, sans graisse) et les tiges Y/Z (poussière)', months:1},
      {id:'lead',   label:'Nettoyer puis graisser les vis-mères de l’axe Z', months:3},
      {id:'rust',   label:'Traitement anti-rouille des tiges linéaires Y et Z', months:3}
    ],
    info: [
      'Chaque semaine : dépoussiérer les ventilateurs (hotend, face avant, auxiliaire).',
      'Contrôler la lame du coupe-filament tous les 3 à 5 rouleaux (1 à 2 rouleaux si matériaux abrasifs).',
      'Tube PTFE : contrôle après ~10 rouleaux (~5 si matériaux abrasifs). Embout de nettoyage de buse : vérifier avant chaque impression.',
      'Selon l’état : dépoussiérer l’engrenage de l’extrudeur, changer le manchon silicone du hotend, nettoyer la buse.'
    ]
  },

  uprintse: {
    name: 'uPrint SE',
    source: 'Guide Stratasys uPrint SE Plus (le SE est très proche). Les heures sont des heures de fonctionnement.',
    tasks: [
      {id:'wipe',   label:'Remplacer l’ensemble d’essuyage des buses (tip wipe)', hours:500},
      {id:'shield', label:'Remplacer les protections de buses (tip shields)', hours:500},
      {id:'tips',   label:'Remplacer les buses (modèle et support) puis recalibrer', hours:2000}
    ],
    info: []
  },

  lisax: {
    name: 'Sinterit Lisa X',
    source: 'Manuel Sinterit Lisa X : vitre du laser 80 h, cordon du recoater 200 h, joints des lits 200 h. L’écran MAINTENANCE de la machine a son propre minuteur : il fait foi.',
    tasks: [
      {id:'glass', label:'Vitre du laser : entretien', hours:80},
      {id:'cord',  label:'Cordon du recoater : contrôle / remplacement', hours:200},
      {id:'seals', label:'Joints du lit d’impression et du lit d’alimentation : contrôle / remplacement', hours:200}
    ],
    info: ['Les minuteurs de la machine (écran MAINTENANCE, remis à zéro après chaque opération) sont la référence pour les autres composants.']
  },

  trotec: {
    name: 'Trotec Speedy 400 flexx',
    source: 'Préconisations Trotec : lentille chaque jour, miroirs latéraux chaque mois, filtre selon l’alerte du logiciel.',
    tasks: [
      {id:'mirrors', label:'Contrôler / nettoyer les miroirs latéraux', months:1}
    ],
    info: [
      'Chaque jour : contrôler et nettoyer la lentille de focalisation.',
      'Filtre d’aspiration : à changer quand le logiciel de la machine l’indique.'
    ]
  },

  form4: {
    name: 'Formlabs Form 4',
    source: 'Formlabs : pas de calendrier à échéance fixe ; consommables suivis par la machine.',
    tasks: [],
    info: ['Réservoir de résine (tank) : durée de vie d’environ 75 000 couches, suivie par la machine.']
  }
};
