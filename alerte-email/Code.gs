/* Outils basse : un e-mail pour chaque nouveau compte inscrit.
   Le script tourne avec votre compte Google, toutes les 5 minutes, et vous écrit
   sur votre propre adresse Gmail (elle n'apparaît nulle part dans le code). */
var PROJECT_ID = 'outils-basse';
var APP_URL = 'https://aupa83.github.io/Basse/';

/* À lancer une seule fois : crée la vérification automatique toutes les 5 minutes. */
function installer(){
  ScriptApp.getProjectTriggers().forEach(function(t){ ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('verifierNouveauxComptes').timeBased().everyMinutes(5).create();
  PropertiesService.getScriptProperties().setProperty('depuis', new Date().toISOString());
  verifierNouveauxComptes();
}

/* À lancer pour essayer : vous envoie tout de suite un e-mail d'exemple. */
function envoyerUnTest(){
  envoyer([{nom:'Exemple', email:'exemple@exemple.fr', date:new Date().toISOString()}], true);
}

function verifierNouveauxComptes(){
  var props = PropertiesService.getScriptProperties();
  var depuis = props.getProperty('depuis') || new Date().toISOString();
  var url = 'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID + '/databases/(default)/documents:runQuery';
  var requete = {structuredQuery:{
    from:[{collectionId:'users'}],
    where:{fieldFilter:{field:{fieldPath:'createdAt'}, op:'GREATER_THAN', value:{timestampValue:depuis}}},
    orderBy:[{field:{fieldPath:'createdAt'}, direction:'ASCENDING'}]
  }};
  var rep = UrlFetchApp.fetch(url, {
    method:'post', contentType:'application/json', payload:JSON.stringify(requete), muteHttpExceptions:true,
    headers:{Authorization:'Bearer ' + ScriptApp.getOAuthToken(), 'X-Goog-User-Project':PROJECT_ID}
  });
  if(rep.getResponseCode() !== 200) throw new Error('Firestore a répondu ' + rep.getResponseCode() + ' : ' + rep.getContentText());
  var comptes = JSON.parse(rep.getContentText()).filter(function(r){ return r.document; }).map(function(r){
    var f = r.document.fields || {};
    return {nom:f.name ? f.name.stringValue : '', email:f.email ? f.email.stringValue : '', date:f.createdAt.timestampValue};
  });
  if(!comptes.length) return;
  envoyer(comptes, false);
  props.setProperty('depuis', comptes[comptes.length - 1].date);
}

function envoyer(comptes, test){
  var n = comptes.length;
  var sujet = (test ? '[Test] ' : '') + 'Outils basse : ' + (n === 1
    ? 'nouveau compte à valider (' + (comptes[0].nom || comptes[0].email) + ')'
    : n + ' nouveaux comptes à valider');
  var lignes = comptes.map(function(c){
    var d = Utilities.formatDate(new Date(c.date), 'Europe/Paris', "dd/MM/yyyy 'à' HH:mm");
    return '- ' + (c.nom || '(sans nom)') + ', ' + c.email + ', inscrit le ' + d;
  });
  var texte = (n === 1 ? 'Une nouvelle personne s\'est inscrite' : n + ' nouvelles personnes se sont inscrites') + ' sur Outils basse :\n\n'
    + lignes.join('\n')
    + '\n\nPour valider ou refuser : ouvrez ' + APP_URL + ', roue crantée, Administration, puis Ouvrir la page Admin.';
  MailApp.sendEmail(Session.getEffectiveUser().getEmail(), sujet, texte, {name:'Outils basse'});
}
