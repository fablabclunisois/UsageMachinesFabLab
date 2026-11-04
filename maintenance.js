/* Plans d'entretien d'après les préconisations des constructeurs.
   Une tâche : id, label, hours (heures d'utilisation) et/ou months (mois) -> échéance au premier des deux atteint.
   optional : n'entre pas dans le décompte « en retard » (accessoire facultatif).
   info : rappels sans échéance chiffrée (à chaque impression, selon l'état, alerte de la machine…).
   Tu peux ajouter ou modifier un plan dans config.js (maintenance.plans) sans toucher à ce fichier. */
window.FABLAB_PLANS = {

  ultimaker3: {
    name: 'Ultimaker 3',
    source: 'Calendrier UltiMaker (série S / UM2+, base 1 500 h par an) appliqué à l’UM3.',
    tasks: [
      {id:'clean',  label:'Nettoyer l’imprimante (plateau, buses, tubes Bowden, intérieur)', months:1},
      {id:'xylube', label:'Lubrifier les axes X et Y', months:1},
      {id:'belts',  label:'Vérifier la tension des courroies courtes (moteurs X et Y)', months:3, hours:300},
      {id:'fan',    label:'Nettoyer le ventilateur avant de la tête d’impression', months:3, hours:300},
      {id:'lead',   label:'Lubrifier la vis-mère de l’axe Z', months:3, hours:300},
      {id:'play',   label:'Vérifier le jeu des axes X et Y', months:6, hours:700},
      {id:'feeder', label:'Nettoyer les extrudeurs (feeders)', months:6, hours:700},
      {id:'zlube',  label:'Lubrifier les axes Z', months:6, hours:700},
      {id:'gear',   label:'Lubrifier l’engrenage des extrudeurs', months:12, hours:1500},
      {id:'bowden', label:'Vérifier les tubes Bowden (remplacer si abîmés)', months:12, hours:1500}
    ],
    info: ['Nettoyage des print cores : selon le type de core et les matériaux.']
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
      {id:'feeder', label:'Nettoyer les extrudeurs (feeders)', months:6, hours:700},
      {id:'zlube',  label:'Lubrifier les axes Z', months:6, hours:700},
      {id:'gear',   label:'Lubrifier l’engrenage des extrudeurs', months:12, hours:1500},
      {id:'bowden', label:'Vérifier les tubes Bowden (remplacer si abîmés)', months:12, hours:1500},
      {id:'airfilter', label:'Remplacer le filtre de l’Air Manager ', hours:1500}
    ],
    info: ['Nettoyage des print cores : selon le type de core et les matériaux.']
  },

  upboxplus: {
    name: 'UP BOX+',
    source: 'Tiertime.',
    tasks: [
      {id:'hepa', label:'Remplacer le filtre HEPA', hours:300, months:6}
    ],
    info: ['Nettoyage de la buse et du plateau selon l’état.']
  },

  bambup1: {
    name: 'Bambu Lab P1S',
    source: 'Wiki Bambu Lab, page de maintenance de la P1P.',
    tasks: [
      {id:'xrods',  label:'Contrôler et nettoyer les tiges X (alcool isopropylique, sans graisse) et les tiges Y/Z (poussière)', months:1},
      {id:'lead',   label:'Nettoyer puis graisser les vis-mères de l’axe Z', months:3},
      {id:'rust',   label:'Traitement anti-rouille des tiges linéaires Y et Z', months:3}
    ],
    info: [
      'Chaque semaine : dépoussiérer les ventilateurs (hotend, face avant, auxiliaire).',
      'Contrôler la lame du coupe-filament tous les 3 à 5 bobines (1 à 2 bobines si matériaux abrasifs).',
      'Tube PTFE : contrôle après ~10 bobines (~5 si matériaux abrasifs). Embout de nettoyage de buse : vérifier avant chaque impression.',
      'Selon l’état : dépoussiérer l’engrenage de l’extrudeur, changer le manchon silicone du hotend, nettoyer la buse.'
    ]
  },

  uprintse: {
    name: 'uPrint SE',
    source: 'Guide Stratasys uPrint SE Plus.',
    tasks: [
      {id:'wipe',   label:'Remplacer l’ensemble d’essuyage des buses (tip wipe)', hours:500},
      {id:'shield', label:'Remplacer les protections de buses (tip shields)', hours:500},
      {id:'tips',   label:'Remplacer les buses (modèle et support) puis recalibrer', hours:2000}
    ],
    info: []
  },

  lisax: {
    name: 'Sinterit Lisa X',
    source: 'Manuel Sinterit Lisa X.',
    tasks: [
      {id:'glass', label:'Vitre du laser : entretien', hours:80},
      {id:'cord',  label:'Cordon du recoater : contrôle / remplacement', hours:200},
      {id:'seals', label:'Joints du lit d’impression et du lit d’alimentation : contrôle / remplacement', hours:200}
    ],
    info: ['Les minuteurs de la machine (écran MAINTENANCE, remis à zéro après chaque opération) sont la référence pour les autres composants.',
          'L’écran MAINTENANCE de la machine a son propre minuteur : il fait foi.']
  },

  trotec: {
    name: 'Trotec Speedy 400 flexx',
    source: 'Préconisations Trotec.',
    tasks: [
      {id:'mirrors', label:'Contrôler / nettoyer les miroirs latéraux', months:1},
      {id:'pfiltre', label:'Changer le préfiltre', months:3},
      {id:'filtre',label:'Changer le filtre', months:6},
      {id:'cfiltre', label:'Changer le charbon du filtre', hours:1000}
    ],
    info: [
      'Chaque jour : contrôler et nettoyer la lentille de focalisation.'
    ]
  },

  form4: {
    name: 'Formlabs Form 4',
    source: 'Formlabs, « Schedule of maintenance (Form 4 generation) » et « Resin tank lifetime ».',
    tasks: [],
    info: [
      'Entre les impressions : inspecter et nettoyer le plateau (IPA, grattoir) ; inspecter la cartouche de résine (fuites, date de péremption ≈ 24 mois) ; vérifier la cuve (résine durcie, débris).',
      'À chaque changement de résine : nettoyer complètement le mélangeur (mixer) et le laisser sécher.',
      'Cuve de résine : durée de vie estimée 75 000+ couches (écran Imprimante > Tank). Remplacer si film percé, coupé, plié ou usé, ou après échecs inexpliqués ; remplacer aussi le mélangeur.',
      'Au besoin : dépoussiérer la surface de décollement (LPU) au chiffon photo ; si bruit ou frottement de l’axe Z, nettoyer et regraisser la vis-mère (graisse au lithium) ; mettre à jour PreForm et le firmware.'
    ]
  },

  tourotmt: {
    name: 'Tour OTMT OT222450',
    source: 'Manuel OTMT OT222450.',
    tasks: [],
    info: [
      'Lubrifier régulièrement les godets à huile et graisser légèrement les surfaces usinées (glissières, vis-mère).',
      'Ne pas démonter le moteur sans balai : contacter le distributeur pour tout entretien ou réparation du moteur.'
    ]
  }

  ,charly2u: {
    name: 'Charlyrobot Charly 2U',
    source: 'Mode d’emploi Charly 2U, § 8.6 « Fréquence de maintenance » (axes) et § 7.2 (révision de la broche HF : 2000 h).',
    tasks: [
      {id:'axclean', label:'Nettoyer les axes', months:1},
      {id:'axgrease', label:'Graisser les axes (pompe à graisse, 2 points par axe ; graisse Charlyrobot réf. 22019 ou BP PREP-00)', months:6},
      {id:'spindle', label:'Révision complète de la broche HF', hours:2000}
    ],
    info: [
      'Tous les jours : contrôler les organes de sécurité, nettoyer la machine (aspirateur, white-spirit sur les parties peintes, eau claire sur les vitres), purger les condensats pneumatiques.',
      'Vérifier régulièrement l’état des pinces ER20.'
    ]
  }
   
   ,charly4u: {
    name: 'Charlyrobot Charly 4U',
    source: 'Mode d’emploi Charly 2U, § 8.6 « Fréquence de maintenance » (axes) et § 7.2 (révision de la broche HF : 2000 h).',
    tasks: [
      {id:'axclean', label:'Nettoyer les axes', months:1},
      {id:'axgrease', label:'Graisser les axes (pompe à graisse, 2 points par axe ; graisse Charlyrobot réf. 22019 ou BP PREP-00)', months:6},
      {id:'spindle', label:'Révision complète de la broche HF', hours:2000}
    ],
    info: [
      'Tous les jours : contrôler les organes de sécurité, nettoyer la machine (aspirateur, white-spirit sur les parties peintes, eau claire sur les vitres), purger les condensats pneumatiques.',
      'Vérifier régulièrement l’état des pinces ER20.'
    ]
  }
};
