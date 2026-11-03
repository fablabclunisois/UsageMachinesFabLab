/* Configuration de l'appli « Utilisation des machines ».
   C'est le seul fichier à adapter (avec Code.gs côté Google). */
window.FABLAB_CONFIG = {

  titre: 'FabLab Clunisois',

  // Adresse de déploiement du script Google (se termine par /exec). Voir README.md, étape 2.
  scriptUrl: 'https://script.google.com/macros/s/AKfycbyzAN97WnpJ_yDk4JBVwiSQ8ssdQom08lrCfEQ5XuABZqbRFU2pSAOgqDxKYYhJnEnM/exec',

  // Facultatif : adresse du stock.json de l'appli de stock, pour proposer les matériaux réellement en stock.
  // Exemple : 'https://TON-COMPTE.github.io/fablab-stock/stock.json'
  stockUrl: 'https://fablabclunisois.github.io/StockFabLab/stock.json',

  // Valeurs proposées pour la découpe laser (modifiables aussi machine par machine, voir plus bas).
  lasers: ['CO2', 'YAG'],
  lenses: ['1.5"', '2.85"', '5"'],

  // Matériaux proposés (le champ reste libre : on peut toujours taper autre chose).
  materials: {
    fdm: ['PLA', 'PETG', 'ABS', 'ASA', 'TPU', 'PVA'],
    sla: ['Résine standard', 'Résine tough', 'Résine flexible', 'Résine castable'],
    sls: ['PA12'],
    usinage: ['Aluminium', 'Laiton', 'Cuivre', 'Bois', 'MDF', 'POM', 'PMMA', 'Résine usinable']
  },

  /* Liste des machines — À ADAPTER à ton parc.
     id      : court, sans espace ni accent (sert dans les QR codes par machine)
     name    : nom affiché aux étudiants
     type    : 'fdm' | 'sla' | 'sls' | 'laser' | 'usinage'
     nozzles : (FDM) buses disponibles sur cette machine, plusieurs possibles pour les machines multi-buses
     lasers / lenses : (laser) pour limiter les choix de cette machine (sinon listes ci-dessus)
  */
  machines: [
   { id: 'UM3', name: 'Ultimaker 3', type: 'fdm', nozzles: ['Buse 1', 'Buse 2'] },
   { id: 'UMS5', name: 'Ultimaker S5', type: 'fdm', nozzles: ['Buse 1', 'Buse 2'] },
   { id: 'Up1', name: 'UpBox + n°1', type: 'fdm', nozzles: ['Buse 1'] },
   { id: 'Up2', name: 'UpBox + n°2', type: 'fdm', nozzles: ['Buse 1'] },
   { id: 'Up3', name: 'UpBox + n°3', type: 'fdm', nozzles: ['Buse 1'] },
   { id: 'P1S', name: 'BambuLab P1S', type: 'fdm', nozzles: ['Buse 1'] },
   { id: 'EM', name: 'EMotion', type: 'fdm', nozzles: ['Buse 1'] },
   { id: 'UPSE', name: 'uPrint SE', type: 'fdm', nozzles: ['Buse 1', 'Buse 2'] },
   { id: 'Form4', name: 'Form 4', type: 'sla' },
   { id: 'Lisa', name: 'Sinterit Lisa X', type: 'sls' },
   { id: 'Trotec', name: 'Trotec Speedy 400 flexx', type: 'laser' },
   { id: 'PtChar', name: 'Charly Robot (Gd)', type: 'usinage' },
   { id: 'GdChar', name: 'Charly Robot (Pt)', type: 'usinage' },
   { id: 'Tour', name: 'Tour Numérisé', type: 'usinage' }
  ],

  /* Rappels d'entretien (onglet « Entretien »), d'après les préconisations des constructeurs (plans dans maintenance.js).
     asOf  : date jusqu'à laquelle les compteurs ci-dessous sont à jour (ici : tes fichiers Excel 2025-2026).
     hours : heures d'utilisation cumulées à cette date. L'appli y ajoute les durées saisies dans le Sheet après asOf.
     since : date de première utilisation (point de départ des échéances en mois tant qu'aucun entretien n'est enregistré).
     plan  : plan d'entretien (voir maintenance.js) ; sans plan, la machine est listée sans échéance.
     Pour ajouter / modifier un plan : maintenance.plans = { monplan: {name, tasks:[{id,label,hours,months}], info:[]} } */
  maintenance: {
    asOf: '2026-11-02',
    machines: {
      UM3:    { plan: 'ultimaker3', hours: 654.1,  since: '2025-01-30' },
      UMS5:   { plan: 'ultimakerS', hours: 1651.2, since: '2025-01-30' },
      Up1:    { plan: 'upboxplus',  hours: 453.9,  since: '2025-02-20' },
      Up2:    { plan: 'upboxplus',  hours: 581.1,  since: '2025-02-05' },
      Up3:    { plan: 'upboxplus',  hours: 618.3,  since: '2025-02-11' },
      P1S:    { plan: 'bambup1',    hours: 767.0,  since: '2025-05-30' },
      EM:     { hours: 0 },
      UPSE:   { plan: 'uprintse',   hours: 363.4,  since: '2025-03-06' },
      Form4:  { plan: 'form4',      hours: 0 },
      Lisa:   { plan: 'lisax',      hours: 29.0,   since: '2026-03-19' },
      Trotec: { plan: 'trotec',     hours: 452.1,  since: '2025-01-30' },
      PtChar: { hours: 0 },
      GdChar: { hours: 0 },
      Tour:   { hours: 0 }
    }
  }
};
