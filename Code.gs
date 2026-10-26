/**
 * FabLab – Utilisation des machines : backend Google Sheets.
 *
 * À coller dans Extensions > Apps Script du Google Sheet (voir README.md).
 * Le script ne fait qu'ENREGISTRER : il ne renvoie aucune donnée de saisie,
 * donc les noms des étudiants ne sont lisibles que dans ton Sheet.
 *
 * Onglets créés automatiquement :
 *   - « Saisies »    : l'état actuel de chaque utilisation (une ligne par id, mise à jour à chaque modification)
 *   - « Historique » : journal en ajout seul, une ligne à chaque création / modification (jamais effacée)
 *
 * Propriété de script facultative (Paramètres du projet > Propriétés du script) :
 *   CLE_ACCES : si renseignée, les saisies sans cette clé sont refusées.
 */

var NOM_SAISIES = 'Saisies';
var NOM_HISTORIQUE = 'Historique';

var COLONNES = [
  'id', 'Créé le', 'Modifié le', 'Lancement', 'Machine', 'Type', 'Étudiant / projet', 'Statut',
  'Durée (min)', 'Nature de la durée', 'Buses', 'Matériaux', 'Volume (mL)', 'Laser', 'Lentille', 'Remarque'
];
var COLONNES_HISTO = ['Horodatage', 'Action', 'id', 'Machine', 'Statut', 'Étudiant / projet', 'Enregistrement complet (JSON)'];

var TYPES = { fdm: 'Impression 3D FDM', sla: 'Impression 3D SLA', sls: 'Impression 3D SLS', laser: 'Découpe laser', usinage: 'Usinage' };
var STATUTS = ['Lancé', 'Terminé', 'Échec', 'Annulé'];

function doGet(e) {
  var action = e && e.parameter && e.parameter.action;
  if (action === 'status') return etat_(e.parameter.k);
  return reponse_({ ok: true, service: 'fablab-machines', protege: !!cle_() });
}

/** État des machines à l'instant t : uniquement machine, lancement et durée des saisies « Lancé »
 *  des dernières 48 h. Aucun nom d'étudiant, aucun id, aucune remarque. */
function etat_(k) {
  var cle = cle_();
  if (cle && k !== cle) return reponse_({ ok: false, error: 'cle' });
  var f = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOM_SAISIES);
  var busy = [];
  if (f && f.getLastRow() > 1) {
    var limite = Date.now() - 48 * 3600 * 1000;
    f.getRange(2, 1, f.getLastRow() - 1, COLONNES.length).getValues().forEach(function (r) {
      var lancement = r[3] instanceof Date ? r[3].getTime() : NaN;
      if (r[7] === 'Lancé' && lancement > limite && Number(r[8]) >= 0) {
        busy.push({ machine: String(r[4]), launch: new Date(lancement).toISOString(), duration: Number(r[8]) });
      }
    });
  }
  return reponse_({ ok: true, now: new Date().toISOString(), busy: busy });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var corps = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var cle = cle_();
    if (cle && corps.k !== cle) return reponse_({ ok: false, error: 'cle' });
    var recs = corps.records;
    if (!Array.isArray(recs) || recs.length === 0 || recs.length > 50) return reponse_({ ok: false, error: 'format' });

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var feuille = feuille_(ss, NOM_SAISIES, COLONNES);
    var histo = feuille_(ss, NOM_HISTORIQUE, COLONNES_HISTO);

    var ids = feuille.getLastRow() > 1 ? feuille.getRange(2, 1, feuille.getLastRow() - 1, 1).getValues().map(function (r) { return String(r[0]); }) : [];
    var saved = [];
    var maintenant = new Date();

    recs.forEach(function (r) {
      var rec = nettoyer_(r);
      if (!rec) return;
      var idx = ids.indexOf(rec.id);
      var action;
      if (idx === -1) {
        action = 'création';
        feuille.appendRow(ligne_(rec, maintenant, null));
        ids.push(rec.id);
        formater_(feuille, feuille.getLastRow());
      } else {
        action = 'modification';
        var rang = idx + 2;
        var cree = feuille.getRange(rang, 2).getValue();
        feuille.getRange(rang, 1, 1, COLONNES.length).setValues([ligne_(rec, maintenant, cree)]);
        formater_(feuille, rang);
      }
      histo.appendRow([maintenant, action, rec.id, rec.machine, rec.status, rec.user, JSON.stringify(rec)]);
      histo.getRange(histo.getLastRow(), 1).setNumberFormat('dd/MM/yyyy HH:mm:ss');
      saved.push(rec.id);
    });
    return reponse_({ ok: true, saved: saved });
  } catch (err) {
    return reponse_({ ok: false, error: String(err && err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (x) { }
  }
}

/** Valide et normalise un enregistrement venant de l'appli (ne fait confiance à rien). */
function nettoyer_(r) {
  if (!r || typeof r !== 'object') return null;
  var id = String(r.id || '');
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(id)) return null;
  var lancement = new Date(r.launch);
  if (isNaN(lancement.getTime())) lancement = new Date();
  var duree = Number(r.duration);
  var tab = function (v) { return Array.isArray(v) ? v.map(function (s) { return txt_(s, 60); }).filter(String) : []; };
  return {
    id: id,
    launch: lancement.toISOString(),
    machine: txt_(r.machine, 80),
    type: TYPES[r.type] ? r.type : '',
    user: txt_(r.user, 120),
    status: STATUTS.indexOf(r.status) >= 0 ? r.status : 'Lancé',
    duration: isFinite(duree) && duree >= 0 ? Math.round(duree) : '',
    durationKind: r.durationKind === 'effective' ? 'effective' : 'prévue',
    nozzles: tab(r.nozzles),
    materials: tab(r.materials),
    volume: r.volume === '' || r.volume == null || isNaN(Number(r.volume)) ? '' : Number(r.volume),
    laser: txt_(r.laser, 20),
    lens: txt_(r.lens, 20),
    note: txt_(r.note, 500),
    created: r.created
  };
}

function ligne_(rec, maintenant, creeExistant) {
  var cree = creeExistant || (rec.created ? new Date(rec.created) : maintenant);
  if (!(cree instanceof Date) || isNaN(cree.getTime())) cree = maintenant;
  return [
    rec.id, cree, maintenant, new Date(rec.launch), rec.machine, TYPES[rec.type] || '', rec.user, rec.status,
    rec.duration, rec.durationKind === 'effective' ? 'effective' : 'prévue',
    rec.nozzles.join(', '), rec.materials.join(', '), rec.volume, rec.laser, rec.lens, rec.note
  ];
}

function formater_(feuille, rang) {
  feuille.getRange(rang, 2, 1, 3).setNumberFormat('dd/MM/yyyy HH:mm');
}

function feuille_(ss, nom, entetes) {
  var f = ss.getSheetByName(nom);
  if (!f) {
    // Premier lancement : on réutilise la feuille vierge par défaut si elle existe
    var premiere = ss.getSheets()[0];
    if (premiere.getLastRow() === 0 && ss.getSheets().length === 1) { f = premiere; f.setName(nom); }
    else f = ss.insertSheet(nom);
    f.getRange(1, 1, 1, entetes.length).setValues([entetes]).setFontWeight('bold').setBackground('#e8eef5');
    f.setFrozenRows(1);
  }
  return f;
}

function cle_() {
  return PropertiesService.getScriptProperties().getProperty('CLE_ACCES') || '';
}

function reponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function txt_(v, max) {
  var s = String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);
  // Empêche l'interprétation d'une saisie comme une formule dans le tableur
  return /^[=+\-@]/.test(s) && s !== '/' ? "'" + s : s;
}

/* ---------- Sauvegarde mensuelle (facultative) ----------
 * Exécute une fois « installerSauvegardeMensuelle » depuis l'éditeur : une copie
 * datée du Sheet est ensuite créée dans ton Drive le 1er de chaque mois.
 */
function installerSauvegardeMensuelle() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'sauvegardeMensuelle') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('sauvegardeMensuelle').timeBased().onMonthDay(1).atHour(3).create();
}

function sauvegardeMensuelle() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var date = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd');
  DriveApp.getFileById(ss.getId()).makeCopy(ss.getName() + ' – sauvegarde ' + date);
}
