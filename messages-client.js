/* =====================================================================
   VOYAGE FACILE — messages WhatsApp envoyés au client par l'agence
   Courts et professionnels : les villes en clair, le prix total et un
   lien personnel. Le client touche le lien et arrive directement sur
   sa page de paiement (ou de billet), sans rien taper.
   Commun à l'Espace agence de l'application et du site.
   ===================================================================== */
(function(){
  const C = window.VF_CONFIG || {};
  const SITE = C.SITE || 'https://amodgroup031-cloud.github.io/Voyage-facile-web';
  const API = C.SUPABASE_URL + '/functions/v1/vf-api';
  const gnf = n => Math.round(n || 0).toLocaleString('fr-FR').replace(/[  ]/g, ' ') + ' GNF';
  const ville = c => (window.Pays && Pays.ville) ? Pays.ville(c) : c;
  const jour = iso => {
    const d = new Date(String(iso || '').slice(0, 10) + 'T12:00:00'); if (isNaN(d)) return '';
    const t = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    return d.getDate() === 1 ? t.replace(/^1 /, '1er ') : t;
  };

  // Lien personnel du client (signé par le serveur), gardé en mémoire pour chaque demande.
  const enCours = {}, connus = {};
  function lien(d){
    if (connus[d.id]) return Promise.resolve(connus[d.id]);
    if (!enCours[d.id]) enCours[d.id] = fetch(API, { method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': C.SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + C.SUPABASE_ANON_KEY },
        body: JSON.stringify({ action: 'lien_client', reference: d.id, telephone: d.telephone }) })
      .then(r => r.json().then(j => (r.ok && j.url) ? j.url : null)).catch(() => null)
      .then(u => { delete enCours[d.id]; if (u) connus[d.id] = u; return u; });
    return enCours[d.id];
  }
  // Lien déjà connu, sinon la page de suivi (le client y tape alors son numéro).
  const lienConnu = d => connus[d.id] || `${SITE}/suivi.html?ref=${encodeURIComponent(d.id)}`;

  function voyage(d){
    const o = d.offre || {}, a = o.aller, r = o.retour;
    if (!a) return `Votre vol ${d.trajet || ''}`.trim();
    const t = `${ville(a.depart_aeroport)} → ${ville(a.arrivee_aeroport)}`;
    return r ? `Votre vol aller-retour ${t} (${jour(a.depart_heure)} – ${jour(r.depart_heure)})` : `Votre vol ${t} du ${jour(a.depart_heure)}`;
  }
  const nb = d => (Array.isArray(d.passagers) ? d.passagers.length : 1);

  const dateLimite = iso => { const t = new Date(iso); return isNaN(t) ? '' : t.toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }); };
  function prix(d, montant, url){
    if (d.type === 'visa') return `Bonjour, ici VOYAGE FACILE ✈️\nRéservation pour votre visa — ${voyage(d)}.\n` +
      `Frais de réservation : ${gnf(montant)} (déduits du billet si vous l'achetez chez nous)\nPour payer : ${url || lienConnu(d)}\nRéférence : ${d.id}`;
    if (d.type === 'blocage') return `Bonjour, ici VOYAGE FACILE ✈️\nBloquer le prix — ${voyage(d)}.\n` +
      `Frais : ${gnf(montant)} (déduits du billet)\nPour payer : ${url || lienConnu(d)}\nRéférence : ${d.id}`;
    const deja = d.frais_payes_gnf ? `Frais de réservation déjà payés : ${gnf(d.frais_payes_gnf)} (déduits)\nReste à payer : ${gnf(montant)}\n`
      : `Prix total${nb(d) > 1 ? ` (${nb(d)} passagers)` : ''} : ${gnf(montant)}\n`;
    return `Bonjour, ici VOYAGE FACILE ✈️\n${voyage(d)} est confirmé.\n` + deja +
      `Pour payer : ${url || lienConnu(d)}\nRéférence : ${d.id}`;
  }
  function recu(d){
    const opt = d.type === 'visa' || d.type === 'blocage';
    return `Bonjour, ici VOYAGE FACILE ✈️\n${opt ? 'Frais bien reçus' : 'Paiement bien reçu'} : ${gnf(d.paiement_montant_gnf || d.prix_final_gnf || d.prix_indicatif_gnf)}. Merci !\n` +
      `${opt ? 'Votre réservation arrive très bientôt ici.' : 'Votre billet arrive très bientôt ici.'}\nRéférence : ${d.id}`;
  }
  function refuse(d, url){
    return `Bonjour, ici VOYAGE FACILE.\nNous ne trouvons pas votre paiement${d.paiement_ref ? ` (référence ${d.paiement_ref})` : ''}.\n` +
      `Vérifiez le SMS d'Orange Money et renvoyez la bonne référence ici : ${url || lienConnu(d)}\nRéférence : ${d.id}`;
  }
  // Billet joint dans l'Espace agence : le client le télécharge depuis son lien personnel.
  // Réservation (visa / prix bloqué) : code, date limite et suite à donner.
  function reservation(d, ref, ou){
    const lim = d.option_expire ? `, valable jusqu'au ${dateLimite(d.option_expire)}` : '';
    const suite = d.type === 'visa' ? 'Joignez-la à votre dossier de visa. Une fois le visa obtenu, achetez votre billet ici : les frais sont déduits.'
      : 'Achetez votre billet avant la date limite : les frais déjà payés sont déduits.';
    return `Bonjour, ici VOYAGE FACILE ✈️\nVotre réservation est prête${ref ? ` (code ${ref})` : ''}${lim}.\n${ou}\n${suite}\nRéférence : ${d.id}`;
  }
  function billet(d, ref, url){
    if (d.type === 'visa' || d.type === 'blocage') return reservation(d, ref, `Téléchargez-la ici : ${url || lienConnu(d)}`);
    return `Bonjour, ici VOYAGE FACILE ✈️\nVotre billet est prêt${ref ? ` (réservation ${ref})` : ''}.\n` +
      `Téléchargez-le ici : ${url || lienConnu(d)}\nBon voyage, partez sans souci !`;
  }
  // Billet envoyé directement en pièce jointe sur WhatsApp.
  function billetJoint(d, ref){
    if (d.type === 'visa' || d.type === 'blocage') return reservation(d, ref, 'Vous la trouverez ci-jointe.');
    return `Bonjour, ici VOYAGE FACILE ✈️\nVotre billet est prêt${ref ? ` (réservation ${ref})` : ''}.\nVous le trouverez ci-joint.\nBon voyage, partez sans souci !`;
  }

  window.MessagesClient = { lien, lienConnu, prix, recu, refuse, billet, billetJoint, voyage };
})();
