/* Configuration de l'appli « Utilisation des machines ».
   C'est le seul fichier à adapter (avec Code.gs côté Google). */
window.FABLAB_CONFIG = {

  titre: 'FabLab Clunisois',

  // Adresse de déploiement du script Google (se termine par /exec). Voir README.md, étape 2.
  scriptUrl: '',

  // Facultatif : adresse du stock.json de l'appli de stock, pour proposer les matériaux réellement en stock.
  // Exemple : 'https://TON-COMPTE.github.io/fablab-stock/stock.json'
  stockUrl: '',

  // Valeurs proposées pour la découpe laser (modifiables aussi machine par machine, voir plus bas).
  lasers: ['CO2', 'YAG'],
  lenses: ['1.5"', '2.85"', '5"'],

  // Matériaux proposés (le champ reste libre : on peut toujours taper autre chose).
  materials: {
    fdm: ['PLA', 'PETG', 'ABS', 'ASA', 'TPU', 'PA', 'PA-CF', 'PC', 'PVA', 'HIPS'],
    sla: ['Résine standard', 'Résine tough', 'Résine flexible', 'Résine castable', 'Résine dentaire'],
    sls: ['PA12', 'PA11', 'TPU'],
    usinage: ['Aluminium', 'Acier', 'Inox', 'Laiton', 'Cuivre', 'Titane', 'Bois', 'MDF', 'POM', 'PMMA', 'Résine usinable']
  },

  /* Liste des machines — À ADAPTER à ton parc.
     id      : court, sans espace ni accent (sert dans les QR codes par machine)
     name    : nom affiché aux étudiants
     type    : 'fdm' | 'sla' | 'sls' | 'laser' | 'usinage'
     nozzles : (FDM) buses disponibles sur cette machine, plusieurs possibles pour les machines multi-buses
     lasers / lenses : (laser) pour limiter les choix de cette machine (sinon listes ci-dessus)
  */
  machines: [
    { id: 'fdm1', name: 'FDM 1', type: 'fdm', nozzles: ['0.4 mm', '0.6 mm'] },
    { id: 'fdm2', name: 'FDM 2 (double buse)', type: 'fdm', nozzles: ['Buse 1 – 0.4 mm', 'Buse 2 – 0.4 mm'] },
    { id: 'sla1', name: 'SLA 1', type: 'sla' },
    { id: 'sls1', name: 'SLS 1', type: 'sls' },
    { id: 'laser1', name: 'Découpe laser', type: 'laser' },
    { id: 'usinage1', name: 'Usinage 1', type: 'usinage' },
    { id: 'usinage2', name: 'Usinage 2', type: 'usinage' }
  ]
};
