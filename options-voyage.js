/* =====================================================================
   VOYAGE FACILE — « Bloquer le prix » et « Réservation pour visa »
   Le client choisit : acheter le billet, bloquer le prix (le temps de
   réunir l'argent) ou obtenir une vraie réservation pour son dossier de
   visa. Pour les deux derniers, il paie d'abord des frais, déduits du
   billet s'il l'achète ensuite. Le conseiller pose l'option avec la
   compagnie (jamais de faux billet) et envoie la réservation.
   Commun à l'application et au site.
   ===================================================================== */
(function(){
  const tr = (s, v) => window.L ? window.L.t(s, v) : String(s).replace(/\{(\w+)\}/g, (_, k) => v && v[k] != null ? v[k] : '');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const est = t => t === 'visa' || t === 'blocage';
  const TITRE = { visa: 'Réservation pour visa', blocage: 'Prix bloqué' };
  const ICONE = { visa: '🛂', blocage: '🔒' };
  const LIB = { nouvelle: 'Reçue', en_cours: 'En préparation', confirmee: 'Frais à payer', billet_envoye: 'Réservation prête', annulee: 'Annulée' };
  const EXPL = {
    visa: {
      nouvelle: "Votre conseiller prépare votre réservation pour le visa. Ne payez rien pour l'instant.",
      en_cours: "Votre conseiller prépare votre réservation pour le visa. Ne payez rien pour l'instant.",
      confirmee: 'Payez les frais de réservation ci-dessous. Votre conseiller vous envoie ensuite la réservation pour votre dossier de visa.',
      billet_envoye: 'Votre réservation est prête : joignez-la à votre dossier de visa. Une fois le visa obtenu, achetez le billet : les frais sont déduits.',
      annulee: 'Cette demande a été annulée. Écrivez-nous pour une nouvelle recherche.',
    },
    blocage: {
      nouvelle: "Votre conseiller bloque le prix avec la compagnie. Ne payez rien pour l'instant.",
      en_cours: "Votre conseiller bloque le prix avec la compagnie. Ne payez rien pour l'instant.",
      confirmee: 'Payez les frais ci-dessous : votre conseiller bloque le prix et vous donne la date limite.',
      billet_envoye: 'Le prix est bloqué. Achetez le billet avant la date limite : les frais déjà payés sont déduits.',
      annulee: 'Cette demande a été annulée. Écrivez-nous pour une nouvelle recherche.',
    },
  };
  const loc = () => window.L && window.L.loc || 'fr-FR';
  const dateHeure = iso => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleString(loc(), { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); };

  function styles(){
    if (document.getElementById('ov-css')) return;
    const s = document.createElement('style'); s.id = 'ov-css';
    s.textContent = `
.ov-choix{display:grid;gap:8px;margin:12px 0 4px}
.ov-choix h4{margin:0 0 2px;font-size:15px;color:var(--navy,#0b2545)}
.ov-opt{display:flex;gap:10px;align-items:flex-start;padding:12px;border:1.5px solid #d5e1ef;border-radius:14px;background:#fff;cursor:pointer;text-transform:none;letter-spacing:0;font-size:14px;font-weight:400;color:inherit;margin:0}
.ov-opt input{width:20px;height:20px;margin-top:2px;flex:none;accent-color:#f28c28}
.ov-opt b{display:block;color:var(--navy,#0b2545);font-size:15px}
.ov-opt small{display:block;color:#5b6b80;font-size:13px;line-height:1.4;margin-top:2px}
.ov-opt .ov-px{font-weight:800;color:#c95a12;font-size:14px}
.ov-opt:has(input:checked){border-color:#f28c28;background:#fff8f0}
.ov-tag{display:inline-block;padding:3px 9px;border-radius:999px;font-size:12px;font-weight:700;background:#eef4fb;color:#24456f;margin-right:4px}
.ov-info{background:#f6f8fb;border-radius:12px;padding:10px 12px;margin:8px 0;font-size:14px;color:#334155}
.ov-info .r{display:flex;justify-content:space-between;gap:10px;margin:2px 0}
.ov-info .r b{color:var(--navy,#0b2545);text-align:right}
.ov-info .exp{color:#9a3412;font-weight:700}
.ov-info .fin{color:#8a1f1f;font-weight:700}`;
    document.head.appendChild(s);
  }
  if (document.head) styles(); else document.addEventListener('DOMContentLoaded', styles);

  // Choix au moment de la demande. opts : { options:{ visa_gnf, blocage_gnf }, total, prix(n) → HTML, nom }
  function choix(opts){
    const o = opts.options; if (!o) return '';
    const p = opts.prix || (n => esc(n));
    const nom = opts.nom || 'vfType', sel = opts.selection || 'billet';
    const opt = (v, titre, prix, txt) => `<label class="ov-opt"><input type="radio" name="${nom}" value="${v}"${v === sel ? ' checked' : ''}><span><b>${titre}</b><span class="ov-px">${prix}</span><small>${esc(txt)}</small></span></label>`;
    return `<div class="ov-choix" role="radiogroup" aria-label="${esc(tr('Que voulez-vous ?'))}"><h4>${esc(tr('Que voulez-vous ?'))}</h4>
      ${opt('billet', esc(tr('Acheter le billet')), p(opts.total), tr('Votre conseiller confirme le prix, vous payez, vous recevez le billet.'))}
      ${opt('blocage', '🔒 ' + esc(tr('Bloquer ce prix')), tr('Frais : {p}', { p: p(o.blocage_gnf) }), tr("Le temps de réunir l'argent. La durée dépend de la compagnie : votre conseiller vous donne la date limite. Frais déduits du billet."))}
      ${opt('visa', '🛂 ' + esc(tr('Réservation pour mon visa')), tr('Frais : {p}', { p: p(o.visa_gnf) }), tr("Une vraie réservation à joindre au dossier de visa. Vous achetez le billet après le visa : frais déduits."))}
    </div>`;
  }
  const choisi = (racine, nom = 'vfType') => { const r = racine.querySelector(`input[name="${nom}"]:checked`); return r ? r.value : 'billet'; };

  const libelle = x => est(x.type) ? LIB[x.statut] || null : null;
  const explication = x => est(x.type) ? (EXPL[x.type][x.statut] || null) : null;
  const titre = t => est(t) ? `${ICONE[t]} ${tr(TITRE[t])}` : '';
  const expire = x => !!x.option_expire && Date.parse(x.option_expire) < Date.now();

  // Encadré d'une demande dans « Mes voyages » / « Mes demandes »
  function bloc(x, prix){
    const p = prix || (n => esc(n)), l = [];
    if (est(x.type)) {
      if (x.prix_vol_gnf) l.push(`<div class="r"><span>${esc(tr('Prix du billet (indicatif)'))}</span><b>${p(x.prix_vol_gnf)}</b></div>`);
      if (x.option_expire) l.push(`<div class="r"><span>${esc(tr(x.type === 'visa' ? 'Réservation valable jusqu\'au' : 'Prix bloqué jusqu\'au'))}</span><b class="${expire(x) ? 'fin' : 'exp'}">${esc(dateHeure(x.option_expire))}</b></div>`);
      if (expire(x)) l.push(`<div class="fin">${esc(tr('Délai dépassé : demandez à votre conseiller s\'il peut prolonger.'))}</div>`);
      return `<div class="ov-info"><span class="ov-tag">${esc(titre(x.type))}</span>${l.join('')}</div>`;
    }
    if (x.frais_payes_gnf) return `<div class="ov-info"><div class="r"><span>${esc(tr('Frais de réservation déjà payés (déduits)'))}</span><b>${p(x.frais_payes_gnf)}</b></div></div>`;
    return '';
  }
  // Bouton « Acheter le billet » quand la réservation est prête
  const peutAcheter = x => est(x.type) && x.statut === 'billet_envoye';
  const libAcheter = x => tr(x.type === 'visa' ? "J'ai mon visa : acheter le billet" : 'Acheter le billet maintenant');
  const messageAcheter = x => tr('Bonjour VOYAGE FACILE, je veux acheter le billet de ma réservation {r} ({t}).', { r: x.reference || x.id, t: x.trajet || '' });

  window.OptionsVoyage = { est, choix, choisi, libelle, explication, titre, bloc, peutAcheter, libAcheter, messageAcheter, expire, TITRE, dateHeure };
})();
