/* =====================================================================
   VOYAGE FACILE — réservation d'hôtels (commun à l'application et au site)
   - Recherche en direct : vrais hôtels, chambres et prix du jour (fournisseur
     LiteAPI, branché sur le serveur). Le client choisit, puis un conseiller
     confirme la disponibilité et le prix avant tout paiement (comme les vols).
   - Si la recherche en direct n'est pas encore activée (ou ne trouve rien),
     le client envoie sa demande : un conseiller lui trouve l'hôtel.
   Hotels.monter(racine, options) affiche tout le parcours dans « racine ».
   ===================================================================== */
(function(){
  const CSS = `.htl-hero{background:linear-gradient(135deg,#0b2545,#13406f);color:#fff;border-radius:18px;padding:18px 16px;margin-bottom:12px}
.htl-hero h1{color:#fff;margin:0 0 4px;font-size:22px}.htl-hero p{margin:0;opacity:.9;font-size:14.5px}
.htl-note-man{background:#fff4e5;color:#7a4b00;border-radius:12px;padding:10px 12px;font-size:14px;line-height:1.45;margin-bottom:10px}
.htl-ages{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}
.htl-ages:empty{display:none}
.htl-nuits{margin:10px 0 0;font-size:14px}
.htl-res{display:flex;flex-direction:column;gap:12px;margin-top:14px}
.htl-fil{display:flex;gap:6px;flex-wrap:wrap}
.htl-fil button{border:1px solid #d5e1ef;background:#fff;border-radius:999px;padding:7px 12px;font-size:13px;cursor:pointer;min-height:38px;color:#0b2545;font-weight:600}
.htl-fil button[aria-pressed="true"]{background:#0b2545;color:#fff;border-color:#0b2545}
.htl-carte{background:#fff;border:1px solid #d5e1ef;border-radius:16px;overflow:hidden;display:flex;flex-direction:column}
.htl-photo{position:relative;height:170px;background:#e9eef5;display:flex;align-items:center;justify-content:center;color:#8aa0bb}
.htl-photo img{width:100%;height:100%;object-fit:cover;display:block}
.htl-photo .htl-note{position:absolute;right:10px;top:10px}
.htl-corps{padding:12px 14px 14px;display:flex;flex-direction:column;gap:5px}
.htl-nom{font-size:16.5px;color:#0b2545;font-weight:800;line-height:1.25}
.htl-et{color:#f2a900;letter-spacing:1px;font-size:14px;margin-left:4px;white-space:nowrap}
.htl-adr{font-size:13px;color:#5b6b80}
.htl-note{display:inline-flex;align-items:center;gap:6px;background:#0b2545;color:#fff;border-radius:10px;padding:3px 8px;font-size:12.5px;font-weight:700}
.htl-note small{font-weight:500;opacity:.85}
.htl-ch{font-size:14px;color:#22324a}
.htl-tags{display:flex;gap:6px;flex-wrap:wrap}
.htl-tag{font-size:12.5px;border-radius:999px;padding:3px 9px;background:#eef3f9;color:#3b4d66;font-weight:600}
.htl-tag.ok{background:#e3f5ea;color:#165c3d}.htl-tag.dej{background:#fff1e0;color:#8a4b00}
.htl-pied{display:flex;justify-content:space-between;align-items:flex-end;gap:10px;margin-top:6px;flex-wrap:wrap}
.htl-pied .htl-px>b{font-size:19px;color:#0b2545;display:block;line-height:1.15}
.htl-pied .htl-px>span{display:block;font-size:12.5px;color:#5b6b80}
.htl-grille{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(290px,1fr))}
.htl-pied .htl-btns{display:flex;gap:8px}
.htl-pied .btn{min-width:0;padding-left:16px;padding-right:16px}
.htl-pied .btn-ghost{background:#eef3f9;color:#0b2545;border:0}
.htl-fond{position:fixed;inset:0;background:rgba(5,20,40,.55);z-index:9000;display:flex;align-items:flex-end;justify-content:center}
.htl-feuille{background:#fff;width:100%;max-width:640px;max-height:92vh;border-radius:20px 20px 0 0;display:flex;flex-direction:column;overflow:hidden;animation:htlMonte .22s ease-out}
@keyframes htlMonte{from{transform:translateY(40px);opacity:.4}to{transform:none;opacity:1}}
@media(min-width:700px){.htl-fond{align-items:center}.htl-feuille{border-radius:20px;max-height:88vh}}
.htl-f-haut{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid #e3eaf3}
.htl-f-haut b{flex:1;color:#0b2545;font-size:16px;line-height:1.25}
.htl-f-x{border:0;background:#eef3f9;color:#0b2545;width:38px;height:38px;border-radius:50%;font-size:18px;cursor:pointer;flex:0 0 auto}
.htl-f-corps{overflow-y:auto;padding:0 0 12px;-webkit-overflow-scrolling:touch}
.htl-galerie{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:6px;background:#e9eef5;height:230px}
.htl-galerie img{flex:0 0 88%;height:100%;object-fit:cover;scroll-snap-align:center;display:block}
.htl-galerie img:only-child{flex-basis:100%}
.htl-galerie .htl-vide{flex:1;display:flex;align-items:center;justify-content:center;color:#8aa0bb}
.htl-nbp{font-size:12px;color:#5b6b80;padding:4px 14px 0}
.htl-f-sec{padding:12px 14px 0}
.htl-f-sec h3{font-size:15px;color:#0b2545;margin:0 0 6px}
.htl-f-sec p{margin:0;font-size:14px;line-height:1.5;color:#22324a;white-space:pre-line}
.htl-desc.court{display:-webkit-box;-webkit-line-clamp:6;-webkit-box-orient:vertical;overflow:hidden}
.htl-lien{background:none;border:0;color:#1d4f86;font-weight:700;padding:6px 0;cursor:pointer;font-size:14px}
.htl-equip{display:flex;flex-wrap:wrap;gap:6px}
.htl-equip span{font-size:12.5px;background:#eef3f9;color:#22324a;border-radius:999px;padding:4px 10px}
.htl-heures{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.htl-heures div{background:#f4f7fb;border-radius:12px;padding:8px 10px;font-size:13px;color:#5b6b80}
.htl-heures b{display:block;color:#0b2545;font-size:15px}
.htl-f-ch{background:#f4f9ff;border:1px solid #d6e6f7;border-radius:14px;padding:10px 12px;font-size:14px;line-height:1.45}
.htl-f-bas{padding:10px 14px calc(10px + env(safe-area-inset-bottom));border-top:1px solid #e3eaf3;display:flex;align-items:center;gap:10px;background:#fff}
.htl-f-bas .htl-px{flex:1}.htl-f-bas .htl-px b{display:block;color:#0b2545;font-size:17px}.htl-f-bas .htl-px>span{font-size:12px;color:#5b6b80}
.htl-f-load{display:flex;align-items:center;gap:8px;color:#5b6b80;font-size:14px;padding:14px}
.htl-recap{display:flex;gap:12px;align-items:flex-start}
.htl-recap img{width:86px;height:86px;object-fit:cover;border-radius:12px;flex:0 0 auto}
.htl-recap .htl-ph{width:86px;height:86px;border-radius:12px;background:#dfe8f3;display:flex;align-items:center;justify-content:center;color:#8aa0bb;flex:0 0 auto}
.htl-recap div{font-size:14px;line-height:1.45}
.htl-mini{display:flex;gap:10px;align-items:center;margin:6px 0}
.htl-mini img{width:54px;height:54px;object-fit:cover;border-radius:10px;flex:0 0 auto}
.htl-mini div{font-size:13.5px;line-height:1.4}
.htl-fin .ok{margin-bottom:10px}
.htl-plus{text-align:center;margin-top:4px}`;
  let styleMis = false;
  function style(){ if (styleMis) return; styleMis = true; const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); }

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const Tdef = (s, v) => window.L ? L.t(s, v) : (v ? s.replace(/\{(\w+)\}/g, (_, k) => v[k] != null ? v[k] : '') : s);
  const LOC = () => (window.L && L.loc) || 'fr-FR';
  const EN = () => !!(window.L && L.code === 'en');
  const auj = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
  const plusJours = (iso, n) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const nuitsEntre = (a, b) => (a && b) ? Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 864e5) : 0;
  const jourCourt = iso => { const d = new Date(String(iso || '').slice(0, 10) + 'T12:00:00'); return isNaN(d) ? '' : d.toLocaleDateString(LOC(), { weekday: 'short', day: 'numeric', month: 'short' }); };
  const jourLong = iso => { const d = new Date(String(iso || '').slice(0, 10) + 'T12:00:00'); return isNaN(d) ? '' : d.toLocaleDateString(LOC(), { day: 'numeric', month: 'long' }); };
  const ICO_LIT = '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/></svg>';

  // Repas (les fournisseurs écrivent en anglais)
  const REPAS = [[/all.?inclusive|tout compris/i, 'Tout compris'], [/full.?board|pension compl/i, 'Pension complète'], [/half.?board|demi/i, 'Demi-pension'],
    [/breakfast|petit|\bBB\b|b&b/i, 'Petit-déjeuner inclus'], [/room.?only|sans repas|chambre seule|\bRO\b/i, 'Chambre seule']];
  const repas = r => { if (!r) return null; for (const [re, t] of REPAS) if (re.test(r)) return t; return r; };
  const avecRepas = o => /breakfast|petit|\bBB\b|b&b|board|pension|demi|inclusive|compris/i.test(o.chambre?.repas || '');
  const appreciation = n => n >= 9 ? 'Exceptionnel' : n >= 8 ? 'Très bien' : n >= 7 ? 'Bien' : 'Correct';
  const etoiles = n => n ? `<span class="htl-et" aria-label="${n} étoiles">${'★'.repeat(n)}</span>` : '';
  const nationalite = () => (window.Transit && Transit.passeport && Transit.passeport()) || (window.Pays && Pays.code) || 'GN';

  /* ---------- Libellés pour « Mes voyages » et le suivi ---------- */
  const LIB = { nouvelle: 'Reçue', en_cours: 'En vérification', confirmee: 'Prix confirmé', billet_envoye: 'Réservation confirmée', annulee: 'Annulée' };
  const EXPL = {
    nouvelle: "Votre conseiller vérifie la disponibilité et le prix avec l'hôtel.",
    en_cours: "Votre conseiller vérifie avec l'hôtel.",
    confirmee: 'Le prix est confirmé. Payez ci-dessous pour réserver votre chambre.',
    billet_envoye: 'Votre réservation est confirmée. Bon séjour !',
    annulee: 'Cette demande a été annulée. Écrivez-nous pour une nouvelle recherche.',
  };
  const est = x => !!x && x.type === 'hotel';
  const dateDebut = x => (x && x.sejour && x.sejour.arrivee) || (x && x.depart) || null;
  function libelle(x){ return LIB[x.statut] || x.statut; }
  function explication(x){
    if (x.statut === 'nouvelle' && x.hotel && x.hotel.manuel) return 'Votre conseiller cherche des hôtels pour vos dates et vous écrit sur WhatsApp.';
    if (x.statut === 'billet_envoye' && x.billet_fichier) return "Votre réservation est confirmée : téléchargez votre bon d'hôtel ci-dessous. Bon séjour !";
    return EXPL[x.statut] || '';
  }
  // Petit résumé de l'hôtel pour les cartes de suivi : photo, dates, chambre.
  function resume(x, t){
    t = t || Tdef;
    const h = x.hotel || {}, s = x.sejour || {};
    const dates = s.arrivee ? t('Du {a} au {d} · {n}', { a: jourCourt(s.arrivee), d: jourCourt(s.depart), n: s.nuits > 1 ? t('{n} nuits', { n: s.nuits }) : t('1 nuit') }) : '';
    const qui = s.adultes ? [s.chambres > 1 ? t('{n} chambres', { n: s.chambres }) : t('1 chambre'), s.adultes > 1 ? t('{n} adultes', { n: s.adultes }) : t('1 adulte'), s.enfants ? (s.enfants > 1 ? t('{n} enfants', { n: s.enfants }) : t('1 enfant')) : ''].filter(Boolean).join(' · ') : '';
    const ch = [h.chambre, repas(h.repas) ? t(repas(h.repas)) : ''].filter(Boolean).join(' · ');
    return `<div class="htl-mini">${h.photo ? `<img src="${esc(h.photo)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : ''}<div>${esc(dates)}${qui ? `<br><span class="muted">${esc(qui)}</span>` : ''}${ch ? `<br><span class="muted" data-no-t>${esc(ch)}</span>` : ''}</div></div>`;
  }
  // Données de suivi (serveur) → voyage enregistré sur le téléphone
  function completer(x, d){
    if (!d || d.type !== 'hotel') return;
    if (d.hotel) x.hotel = { ...(x.hotel || {}), ...d.hotel };
    if (d.sejour) x.sejour = d.sejour;
  }

  /* ---------- Espace agence (en français) ---------- */
  // Encadré d'une demande d'hôtel : hôtel, chambre, séjour, voyageurs et marche à suivre.
  function boiteAgence(d){
    const o = d.offre || {}, s = o.sejour || {}, h = o.hotel, c = o.chambre || {};
    const jj = iso => { const x = new Date(String(iso || '').slice(0, 10) + 'T12:00:00'); return isNaN(x) ? (iso || '') : x.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }); };
    const pl = (n, m) => `${n} ${m}${n > 1 ? 's' : ''}`;
    const ages = Array.isArray(s.ages) && s.ages.length ? ` (${s.ages.map(a => a === 0 ? "moins d'1 an" : a + ' an' + (a > 1 ? 's' : '')).join(', ')})` : '';
    const sejour = `Du ${esc(jj(s.arrivee))} au ${esc(jj(s.depart))} · <b>${pl(s.nuits || 0, 'nuit')}</b><br>${pl(s.chambres || 1, 'chambre')} · ${pl(s.adultes || 1, 'adulte')}${s.enfants ? ' · ' + pl(s.enfants, 'enfant') + esc(ages) : ''}`;
    const hotel = h ? `<div class="htl-recap" style="margin:8px 0">${h.photo ? `<img src="${esc(h.photo)}" alt="" referrerpolicy="no-referrer">` : ''}<div>
        <b>${esc(h.nom)}</b>${etoiles(h.etoiles)}${h.note ? ` · note ${esc(h.note)}/10` : ''}<br>${esc([h.adresse, h.ville, h.pays].filter(Boolean).join(', '))}<br>
        Chambre : <b>${esc(c.nom || '—')}</b>${c.repas ? ' · ' + esc(repas(c.repas)) : ''}<br>
        ${c.remboursable ? `<span class="htl-tag ok">Remboursable${c.annulation_avant ? ' jusqu\'au ' + esc(String(c.annulation_avant).slice(0, 16).replace('T', ' ')) : ''}</span>` : '<span class="htl-tag">Non remboursable</span>'}
        ${h.id ? `<br><span class="muted">Identifiant fournisseur : ${esc(h.id)}</span>` : ''}</div></div>`
      : `<div style="margin:8px 0">Destination : <b>${esc(o.lieu || '—')}</b>${o.budget ? `<br>Budget du client : <b>${esc(o.budget)}</b>` : ''}${o.preferences ? `<br>Souhaits : ${esc(o.preferences)}` : ''}</div>`;
    const etapes = o.manuel
      ? "1) Cherchez des hôtels qui correspondent (dates, budget, souhaits). 2) Écrivez au client avec vos propositions, puis mettez le prix final ci-dessous et envoyez « WhatsApp au client : prix confirmé ». 3) Après le paiement, réservez et joignez le bon d'hôtel ci-dessous."
      : "1) Vérifiez la disponibilité et le prix de cette chambre (auprès de l'hôtel ou de votre fournisseur). 2) Envoyez « WhatsApp au client : prix confirmé ». 3) Après le paiement, réservez la chambre et joignez le bon d'hôtel ci-dessous avec le n° de confirmation.";
    return `<div class="box" style="border:1.5px solid #9cc3ea;background:#f4f9ff"><b>🏨 ${o.manuel ? "Demande d'hôtel (sans recherche en direct)" : "Réservation d'hôtel"}</b>
      ${hotel}<div>${sejour}</div>${o.nationalite ? `<div class="muted" style="margin-top:4px">Nationalité des voyageurs : ${esc(window.Transit && Transit.nom ? Transit.nom(o.nationalite) : o.nationalite)}</div>` : ''}
      <p class="muted" style="margin:8px 0 0">${etapes}</p></div>`;
  }

  /* ---------- Parcours complet ---------- */
  function monter(racine, o){
    style();
    const t = o.t || Tdef, prix = o.prix || (n => String(n)), api = o.api;
    const $ = s => racine.querySelector(s);
    const H = { mode: null, rech: null, params: null, choix: null, manuel: false, filtre: { tri: 'prix', rembours: false, dej: false } };
    const FICHES = {};   // fiches détaillées déjà chargées
    let fiche = null;    // fiche « Détails » ouverte
    const opt = (n, a, sel) => Array.from({ length: n }, (_, k) => `<option value="${a + k}"${a + k === sel ? ' selected' : ''}>${a + k}</option>`).join('');
    const d0 = auj();
    racine.innerHTML = `
      <div data-h="recherche">
        <div class="htl-hero"><h1>${t('Trouvez votre hôtel')}</h1><p>${t('Hôtels du monde entier, prix total dans votre monnaie.')}</p></div>
        <div class="htl-note-man" id="hManNote" hidden>${t("Dites-nous où et quand : un conseiller vous trouve le meilleur hôtel pour votre budget et vous répond sur WhatsApp.")}</div>
        <form class="panel" id="hForm" novalidate>
          <div class="grid">
            <div class="ac full"><label for="hLieu">${t('Destination')}</label><input id="hLieu" autocomplete="off" placeholder="${esc(t('Ville, quartier ou hôtel (ex. Dakar)'))}"><ul id="hLieux" hidden></ul></div>
            <div><label for="hD1">${t("Arrivée à l'hôtel")}</label><input id="hD1" type="date" min="${d0}"></div>
            <div><label for="hD2">${t("Départ de l'hôtel")}</label><input id="hD2" type="date" min="${plusJours(d0, 1)}"></div>
            <div><label for="hCh">${t('Chambres')}</label><select id="hCh">${opt(5, 1, 1)}</select></div>
            <div><label for="hAd">${t('Adultes')}</label><select id="hAd">${opt(12, 1, 2)}</select></div>
            <div class="full"><label for="hEn">${t('Enfants (0 à 17 ans)')}</label><select id="hEn">${opt(9, 0, 0)}</select></div>
            <div class="full htl-ages" id="hAges"></div>
          </div>
          <p class="muted htl-nuits" id="hNuits"></p>
          <button class="btn btn-or w100" type="submit" id="hGo" style="margin-top:12px">${t('Rechercher les hôtels')}</button>
          <div class="err" id="hErr" hidden></div>
        </form>
        <div class="loading" id="hLoad" hidden><div class="spin"></div><span>${t('Recherche des hôtels disponibles…')}</span></div>
        <div class="htl-res" id="hRes"></div>
      </div>
      <div data-h="client" hidden>
        <h1>${t('Vos informations')}</h1>
        <p class="sub">${t("Nom de la personne qui arrive à l'hôtel, comme sur sa pièce d'identité.")}</p>
        <form class="panel" id="hClient" novalidate>
          <div class="recap" id="hRecap"></div>
          <div class="grid" id="hManChamps" hidden>
            <div class="full"><label for="hBudget">${t('Budget par nuit (facultatif)')}</label><input id="hBudget" maxlength="60" placeholder="${esc(t('ex. 50 € ou 500 000 GNF'))}"></div>
            <div class="full"><label for="hPref">${t('Vos souhaits (facultatif)')}</label><textarea id="hPref" rows="2" maxlength="300" placeholder="${esc(t('Quartier, étoiles, petit-déjeuner, piscine…'))}"></textarea></div>
          </div>
          <div class="grid">
            <div class="full"><label>${t('Civilité')}</label><div class="civ" role="radiogroup">
              <label><input type="radio" name="hCiv" value="m"> ${t('Monsieur')}</label><label><input type="radio" name="hCiv" value="f"> ${t('Madame')}</label><label><input type="radio" name="hCiv" value="mlle"> ${t('Mademoiselle')}</label></div></div>
            <div><label for="hPre">${t('Prénom(s)')}</label><input id="hPre" autocomplete="given-name"></div>
            <div><label for="hNom">${t('Nom')}</label><input id="hNom" autocomplete="family-name"></div>
            <div class="full"><label for="hTel">${t('Votre numéro WhatsApp')}</label><input id="hTel" type="tel" inputmode="tel" placeholder="${esc(o.placeholderTel || '+')}"></div>
            <div class="full"><label for="hMail">${t('E-mail (facultatif)')}</label><input id="hMail" type="email" inputmode="email"></div>
            <div class="full"><label for="hMsg">${t("Message pour l'agence (facultatif)")}</label><textarea id="hMsg" rows="2" maxlength="500" placeholder="${esc(t('Heure d\'arrivée, lit bébé, besoin particulier…'))}"></textarea></div>
          </div>
          <label class="check"><input type="checkbox" id="hOk"> <span>${t("Je confirme ma demande. Un conseiller vérifie la disponibilité et le prix avec l'hôtel et me contacte sur WhatsApp avant tout paiement.")}</span></label>
          <button class="btn btn-or w100" type="submit" id="hEnv">${t('Envoyer ma demande')}</button>
          <div class="err" id="hErr2" hidden></div>
        </form>
      </div>
      <div data-h="fin" hidden>
        <div class="panel htl-fin">
          <div class="ok"><b>✅ <span id="hFinTitre"></span></b><br>${t('Référence :')} <b id="hRef"></b></div>
          <p id="hFinTxt" style="margin:12px 0 6px"></p>
          <p class="muted">${t('Ne payez rien avant la confirmation de votre conseiller.')}</p>
          <div class="cards" style="margin-top:14px;display:grid;gap:8px">
            ${o.voirVoyages ? `<button class="btn btn-navy" type="button" id="hVoir">${t(o.libVoir || 'Voir mes voyages')}</button>` : ''}
            <button class="btn btn-wa" type="button" id="hWa">${t("Écrire à l'agence sur WhatsApp")}</button>
            <button class="btn btn-ghost" type="button" id="hNouv">${t('Nouvelle recherche')}</button>
          </div>
        </div>
      </div>`;

    function etape(nom){
      fermerDetails();
      racine.querySelectorAll('[data-h]').forEach(e => e.hidden = e.dataset.h !== nom);
      H.etape = nom;
      if (o.etape) o.etape(nom); else window.scrollTo && window.scrollTo(0, 0);
    }
    const err = (id, m) => { const e = $('#' + id); e.textContent = m || ''; e.hidden = !m; };

    /* Mode : recherche en direct ou demande à un conseiller */
    function appliquerMode(m){
      H.mode = m;
      $('#hManNote').hidden = m !== 'manuel';
      $('#hGo').textContent = t(m === 'manuel' ? 'Continuer' : 'Rechercher les hôtels');
    }
    appliquerMode('direct');
    // Serveur injoignable : le client peut quand même envoyer sa demande à un conseiller.
    api('hotel_etat', {}).then(j => appliquerMode(j && j.disponible ? 'direct' : 'manuel')).catch(() => appliquerMode('manuel'));

    /* Dates, nuits, âges des enfants */
    function majNuits(){
      const a = $('#hD1').value, b = $('#hD2').value, n = nuitsEntre(a, b);
      $('#hNuits').textContent = n > 0 ? (n > 1 ? t('{n} nuits', { n }) : t('1 nuit')) : '';
    }
    $('#hD1').onchange = () => {
      const a = $('#hD1').value; if (!a) return;
      $('#hD2').min = plusJours(a, 1);
      if (!$('#hD2').value || $('#hD2').value <= a) $('#hD2').value = plusJours(a, Math.max(1, H.duree || 2));
      majNuits();
    };
    $('#hD2').onchange = () => { H.duree = nuitsEntre($('#hD1').value, $('#hD2').value); majNuits(); };
    function ages(){
      const n = +$('#hEn').value, old = [...racine.querySelectorAll('[data-age]')].map(s => s.value);
      $('#hAges').innerHTML = Array.from({ length: n }, (_, k) => `<div><label for="hAge${k}">${t('Âge enfant {n}', { n: k + 1 })}</label><select id="hAge${k}" data-age>
        <option value="">—</option>${Array.from({ length: 18 }, (_, a) => `<option value="${a}"${old[k] === String(a) ? ' selected' : ''}>${a === 0 ? t("moins d'1 an") : a > 1 ? t('{n} ans', { n: a }) : t('1 an')}</option>`).join('')}</select></div>`).join('');
    }
    $('#hEn').onchange = ages;

    /* Destination : liste des lieux (villes, quartiers, hôtels) du fournisseur */
    // Chaque recherche de lieu est payante chez le fournisseur (environ 1 centime de dollar) :
    // on attend 3 lettres et une pause de frappe, et les réponses sont gardées 30 jours sur l'appareil.
    const inp = $('#hLieu'), liste = $('#hLieux');
    let minut = null, tour = 0, items = [];
    const CLE_LIEUX = 'vf_lieux_hotels', JOURS_LIEUX = 30;
    const cleQ = q => (window.Pays && Pays.sansAccent ? Pays.sansAccent(q) : q.toLowerCase()).trim() + '|' + ((window.L && L.code) || 'fr');
    const lireCache = () => { try { return JSON.parse(localStorage.getItem(CLE_LIEUX) || '{}') || {}; } catch (e) { return {}; } };
    async function chercherLieux(q){
      const k = cleQ(q), c = lireCache(), x = c[k];
      if (x && Date.now() - x.t < JOURS_LIEUX * 864e5) return x.l;
      // Une recherche plus courte déjà faite contient souvent la réponse (« Dak » → « Dakar »)
      for (const [kk, v] of Object.entries(c)) {
        const [qq, lg] = kk.split('|');
        if (lg === k.split('|')[1] && k.startsWith(qq) && Date.now() - v.t < JOURS_LIEUX * 864e5) {
          const t = k.split('|')[0], l = v.l.filter(p => cleQ(p.nom).split('|')[0].includes(t));
          if (l.length) return l;
        }
      }
      const j = await api('hotel_lieux', { q });
      const l = j.lieux || [];
      if (l.length) {
        c[k] = { t: Date.now(), l };
        const cles = Object.keys(c); if (cles.length > 200) cles.sort((a, b) => c[a].t - c[b].t).slice(0, cles.length - 200).forEach(z => delete c[z]);
        try { localStorage.setItem(CLE_LIEUX, JSON.stringify(c)); } catch (e) {}
      }
      return l;
    }
    const fermer = () => { liste.hidden = true; };
    const choisirLieu = l => { inp.value = l.nom; inp.dataset.id = l.id; inp.dataset.nom = l.nom; fermer(); inp.blur(); };
    inp.addEventListener('input', () => {
      inp.dataset.id = ''; clearTimeout(minut);
      const q = inp.value.trim(); if (q.length < 3 || H.mode === 'manuel') { fermer(); return; }
      const n = ++tour;
      minut = setTimeout(async () => {
        try {
          const l = await chercherLieux(q);
          if (n !== tour) return;
          items = l;
          liste.innerHTML = items.map((l, i) => `<li data-i="${i}"><b>${esc(l.nom)}</b><div class="muted">${esc(l.adresse || '')}</div></li>`).join('');
          liste.hidden = !items.length || document.activeElement !== inp;
          liste.querySelectorAll('li').forEach(li => li.addEventListener('pointerdown', e => { e.preventDefault(); choisirLieu(items[+li.dataset.i]); }));
        } catch (e) { fermer(); }
      }, 550);
    });
    inp.addEventListener('blur', () => setTimeout(fermer, 200));
    // Le client a tapé une ville sans toucher la liste : le premier lieu trouvé est pris.
    async function resoudreLieu(){
      if (inp.dataset.id) return true;
      const q = inp.value.trim(); if (q.length < 2) return false;
      try { const l = (await chercherLieux(q))[0]; if (l) { choisirLieu(l); return true; } } catch (e) {}
      return false;
    }

    function lireRecherche(){
      const p = { lieu: { id: inp.dataset.id || null, nom: inp.value.trim() }, arrivee: $('#hD1').value, depart: $('#hD2').value,
        chambres: +$('#hCh').value, adultes: +$('#hAd').value, enfants: [...racine.querySelectorAll('[data-age]')].map(s => s.value), nationalite: nationalite() };
      const manque = [];
      if (!p.lieu.nom) manque.push(t('la destination'));
      if (!p.arrivee) manque.push(t("la date d'arrivée"));
      if (!p.depart) manque.push(t("la date de départ de l'hôtel"));
      if (manque.length) return { erreur: t('Merci de compléter : {liste}.', { liste: manque.join(', ') }) };
      const n = nuitsEntre(p.arrivee, p.depart);
      if (n < 1) return { erreur: t("La date de départ doit être après la date d'arrivée.") };
      if (n > 30) return { erreur: t('30 nuits au maximum par réservation.') };
      if (p.adultes < p.chambres) return { erreur: t('Il faut au moins un adulte par chambre.') };
      if (p.enfants.some(a => a === '')) return { erreur: t("Indiquez l'âge de chaque enfant (les prix en dépendent).") };
      p.enfants = p.enfants.map(Number); p.nuits = n;
      return p;
    }

    $('#hForm').addEventListener('submit', async e => {
      e.preventDefault(); err('hErr', '');
      const p = lireRecherche(); if (p.erreur) return err('hErr', p.erreur);
      if (H.mode === 'manuel') { H.params = p; return versClient(null); }
      $('#hGo').disabled = true;
      const trouve = await resoudreLieu();
      $('#hGo').disabled = false;
      if (H.mode === 'manuel') { H.params = p; return versClient(null); }   // l'état a pu arriver entre-temps
      if (!trouve) return err('hErr', t('Destination introuvable : vérifiez l\'orthographe ou choisissez-la dans la liste.'));
      p.lieu = { id: inp.dataset.id, nom: inp.dataset.nom || inp.value.trim() };
      $('#hGo').disabled = true; $('#hRes').innerHTML = ''; $('#hLoad').hidden = false;
      try {
        const j = await api('hotel_recherche', p);
        H.params = p;
        if (j.disponible === false) { appliquerMode('manuel'); return versClient(null); }
        H.rech = j;
        if (!j.offres || !j.offres.length) return sansResultat(j.message || t('Aucun hôtel disponible pour ces dates.'));
        H.filtre = { tri: 'prix', rembours: false, dej: false }; H.max = 12;
        afficherOffres();
        setTimeout(() => $('#hRes').scrollIntoView && $('#hRes').scrollIntoView({ behavior: 'smooth' }), 50);
      } catch (x) {
        H.params = p;
        $('#hRes').innerHTML = `<div class="panel secours"><b>${t("La recherche n'a pas abouti")}</b><p class="muted">${esc(x.message)}</p>
          <button class="btn btn-or w100" type="button" id="hRe">${t('Relancer la recherche')}</button>
          <button class="btn btn-ghost w100" type="button" id="hMan">${t('Demander à un conseiller')}</button></div>`;
        $('#hRe').onclick = () => $('#hForm').requestSubmit();
        $('#hMan').onclick = () => versClient(null);
      } finally { $('#hGo').disabled = false; $('#hLoad').hidden = true; }
    });

    function sansResultat(m){
      $('#hRes').innerHTML = `<div class="panel secours"><p>${esc(m)}</p><button class="btn btn-or w100" type="button" id="hMan">${t('Demander à un conseiller')}</button>
        <p class="muted petit">${t('Votre conseiller cherche des hôtels pour vous et vous répond sur WhatsApp.')}</p></div>`;
      $('#hMan').onclick = () => versClient(null);
    }

    function carte(x){
      const h = x.hotel, c = x.chambre, s = x.sejour;
      const nuit = Math.round(x.total_gnf / Math.max(1, s.nuits) / 1000) * 1000;
      const tags = [c.remboursable ? `<span class="htl-tag ok">${esc(c.annulation_avant ? t("Annulation gratuite jusqu'au {d}", { d: jourLong(c.annulation_avant) }) : t('Annulation gratuite'))}</span>` : `<span class="htl-tag">${t('Non remboursable')}</span>`,
        repas(c.repas) && avecRepas(x) ? `<span class="htl-tag dej">${esc(t(repas(c.repas)))}</span>` : ''].join('');
      return `<article class="htl-carte"><div class="htl-photo">${h.photo ? `<img src="${esc(h.photo)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : ICO_LIT}
          ${h.note ? `<span class="htl-note">${esc(String(h.note).replace('.', EN() ? '.' : ','))} <small>${esc(t(appreciation(h.note)))}</small></span>` : ''}</div>
        <div class="htl-corps"><div><span class="htl-nom" data-no-t>${esc(h.nom)}</span>${etoiles(h.etoiles)}</div>
          <div class="htl-adr" data-no-t>${esc([h.adresse, h.ville].filter(Boolean).join(', '))}</div>
          ${h.avis ? `<div class="htl-adr">${esc(t('{n} avis', { n: h.avis.toLocaleString(LOC()) }))}</div>` : ''}
          <div class="htl-ch"><span data-no-t>${esc(c.nom)}</span>${repas(c.repas) && !avecRepas(x) ? ` · ${esc(t(repas(c.repas)))}` : ''}</div>
          <div class="htl-tags">${tags}</div>
          <div class="htl-pied"><div class="htl-px"><b>${prix(x.total_gnf)}</b><span>${esc(t('total pour {n}', { n: s.nuits > 1 ? t('{n} nuits', { n: s.nuits }) : t('1 nuit') }))}</span>${s.nuits > 1 ? `<span>${t('soit {p} par nuit', { p: prix(nuit, false) })}</span>` : ''}</div>
            <div class="htl-btns"><button class="btn btn-ghost" type="button" data-hd="${x.i}">${t('Détails')}</button><button class="btn btn-or" type="button" data-hc="${x.i}">${t('Choisir')}</button></div></div></div></article>`;
    }
    /* Fiche détaillée d'un hôtel (bouton « Détails ») : photos, description, équipements, horaires, carte */
    function fermerDetails(){ if (fiche) { fiche.remove(); fiche = null; document.documentElement.style.overflow = ''; } }
    async function voirDetails(i){
      const x = H.rech && H.rech.offres.find(y => y.i === i); if (!x) return;
      const h = x.hotel, c = x.chambre, s = x.sejour;
      fermerDetails();
      fiche = document.createElement('div');
      fiche.className = 'htl-fond'; fiche.setAttribute('role', 'dialog'); fiche.setAttribute('aria-modal', 'true');
      fiche.innerHTML = `<div class="htl-feuille"><div class="htl-f-haut"><b data-no-t>${esc(h.nom)}</b><button class="htl-f-x" type="button" aria-label="${esc(t('Fermer'))}">✕</button></div>
        <div class="htl-f-corps"></div>
        <div class="htl-f-bas"><div class="htl-px"><b>${prix(x.total_gnf, false)}</b><span>${esc(t('total pour {n}', { n: s.nuits > 1 ? t('{n} nuits', { n: s.nuits }) : t('1 nuit') }))}</span></div>
          <button class="btn btn-or" type="button" data-fc>${t('Choisir cet hôtel')}</button></div></div>`;
      document.body.appendChild(fiche); document.documentElement.style.overflow = 'hidden';
      const corps = fiche.querySelector('.htl-f-corps');
      fiche.addEventListener('click', e => { if (e.target === fiche) fermerDetails(); });
      fiche.querySelector('.htl-f-x').onclick = fermerDetails;
      fiche.querySelector('[data-fc]').onclick = () => { fermerDetails(); versClient(i); };
      const chambre = `<div class="htl-f-sec"><h3>${t('Votre chambre')}</h3><div class="htl-f-ch"><b data-no-t>${esc(c.nom)}</b>${repas(c.repas) ? ' · ' + esc(t(repas(c.repas))) : ''}<br>
        ${esc(t('Du {a} au {d}', { a: jourCourt(s.arrivee), d: jourCourt(s.depart) }))} · ${esc(s.nuits > 1 ? t('{n} nuits', { n: s.nuits }) : t('1 nuit'))}<br>
        ${c.remboursable ? `<span class="htl-tag ok">${esc(c.annulation_avant ? t("Annulation gratuite jusqu'au {d}", { d: jourLong(c.annulation_avant) }) : t('Annulation gratuite'))}</span>` : `<span class="htl-tag">${t('Non remboursable')}</span>`}</div></div>`;
      const dessiner = (d, erreur) => {
        const photos = d && d.photos && d.photos.length ? d.photos : (h.photo ? [h.photo] : []);
        const adr = [d && d.adresse || h.adresse, d && d.ville || h.ville].filter(Boolean).join(', ');
        const note = (d && d.note) || h.note, avis = (d && d.avis) || h.avis, et = (d && d.etoiles) || h.etoiles;
        let html = `<div class="htl-galerie">${photos.length ? photos.map(u => `<img src="${esc(u)}" alt="" loading="lazy" referrerpolicy="no-referrer">`).join('') : `<span class="htl-vide">${ICO_LIT}</span>`}</div>
          ${photos.length > 1 ? `<div class="htl-nbp">${esc(t('{n} photos · faites glisser', { n: photos.length }))}</div>` : ''}
          <div class="htl-f-sec"><div>${etoiles(et)}${note ? ` <span class="htl-note" style="vertical-align:middle">${esc(String(note).replace('.', EN() ? '.' : ','))} <small>${esc(t(appreciation(note)))}</small></span>` : ''}${avis ? ` <span class="htl-adr">${esc(t('{n} avis', { n: avis.toLocaleString(LOC()) }))}</span>` : ''}</div>
            ${adr ? `<p class="htl-adr" style="margin-top:6px" data-no-t>📍 ${esc(adr)}</p>` : ''}
            ${d && d.position ? `<button class="htl-lien" type="button" data-carte>${t('Voir sur la carte')}</button>` : ''}</div>
          ${chambre}`;
        if (!d) html += erreur ? `<div class="htl-f-sec"><p class="muted">${esc(t('Les détails de cet hôtel ne sont pas disponibles pour le moment.'))}</p></div>` : `<div class="htl-f-load"><div class="spin"></div>${t('Chargement des détails…')}</div>`;
        else {
          if (d.arrivee || d.depart) html += `<div class="htl-f-sec"><h3>${t('Horaires')}</h3><div class="htl-heures">${d.arrivee ? `<div>${t('Arrivée à partir de')}<b>${esc(d.arrivee)}</b></div>` : ''}${d.depart ? `<div>${t('Départ avant')}<b>${esc(d.depart)}</b></div>` : ''}</div></div>`;
          if (d.description) html += `<div class="htl-f-sec"><h3>${t("À propos de l'hôtel")}</h3><p class="htl-desc${d.description.length > 380 ? ' court' : ''}" data-no-t>${esc(d.description)}</p>${d.description.length > 380 ? `<button class="htl-lien" type="button" data-plus="desc">${t('Lire la suite')}</button>` : ''}</div>`;
          if (d.equipements && d.equipements.length) html += `<div class="htl-f-sec"><h3>${t('Équipements')}</h3><div class="htl-equip" data-no-t>${d.equipements.map((e, k) => `<span${k >= 12 ? ' hidden' : ''}>${esc(e)}</span>`).join('')}</div>${d.equipements.length > 12 ? `<button class="htl-lien" type="button" data-plus="equip">${esc(t('Voir tout ({n})', { n: d.equipements.length }))}</button>` : ''}</div>`;
          if (d.infos) html += `<div class="htl-f-sec"><h3>${t('Informations importantes')}</h3><p data-no-t style="font-size:13px;color:#5b6b80">${esc(d.infos)}</p></div>`;
        }
        corps.innerHTML = html;
        const carteB = corps.querySelector('[data-carte]');
        if (carteB) carteB.onclick = () => { const u = `https://www.google.com/maps/search/?api=1&query=${d.position.lat},${d.position.lng}`; o.ouvrir ? o.ouvrir(u) : window.open(u, '_blank'); };
        corps.querySelectorAll('[data-plus]').forEach(b => b.onclick = () => {
          if (b.dataset.plus === 'desc') corps.querySelector('.htl-desc').classList.remove('court');
          else corps.querySelectorAll('.htl-equip span[hidden]').forEach(sp => sp.hidden = false);
          b.remove();
        });
      };
      if (FICHES[h.id]) return dessiner(FICHES[h.id]);
      dessiner(null);
      const ouvert = fiche;
      try {
        const d = await api('hotel_details', { id: h.id });
        FICHES[h.id] = d;
        if (fiche === ouvert) dessiner(d);
      } catch (e) { if (fiche === ouvert) dessiner(null, true); }
    }

    function afficherOffres(){
      const f = H.filtre, toutes = H.rech.offres;
      let l = toutes.filter(x => (!f.rembours || x.chambre.remboursable) && (!f.dej || avecRepas(x)));
      if (f.tri === 'note') l.sort((a, b) => (b.hotel.note || 0) - (a.hotel.note || 0) || a.total_gnf - b.total_gnf);
      else if (f.tri === 'etoiles') l.sort((a, b) => (b.hotel.etoiles || 0) - (a.hotel.etoiles || 0) || a.total_gnf - b.total_gnf);
      else l.sort((a, b) => a.total_gnf - b.total_gnf);
      const b = (k, v, txt) => `<button type="button" data-${k}="${v}" aria-pressed="${k === 'tri' ? f.tri === v : !!f[v]}">${t(txt)}</button>`;
      const p = H.params, nb = p.adultes + p.enfants.length;
      $('#hRes').innerHTML = (o.entete ? o.entete() : '') +
        `<p class="muted">${esc(t(toutes.length > 1 ? '{n} hôtels disponibles' : '{n} hôtel disponible', { n: toutes.length }))} · ${esc(jourCourt(p.arrivee))} → ${esc(jourCourt(p.depart))} · ${esc(nb > 1 ? t('{n} voyageurs', { n: nb }) : t('1 voyageur'))}. ${t('Prix confirmé par votre conseiller avant paiement.')}</p>
        <div class="htl-fil" id="hFil">${b('tri', 'prix', 'Moins cher')}${b('tri', 'note', 'Mieux notés')}${b('tri', 'etoiles', "Plus d'étoiles")}${b('f', 'rembours', 'Annulation gratuite')}${b('f', 'dej', 'Petit-déjeuner')}</div>` +
        (l.length ? `<div class="htl-grille">${l.slice(0, H.max).map(carte).join('')}</div>` + (l.length > H.max ? `<button class="btn btn-ghost w100 htl-plus" type="button" id="hPlus">${t('Voir plus d\'hôtels')} (${l.length - H.max})</button>` : '')
          : `<div class="panel">${t('Aucun hôtel avec ces critères.')} <button class="btn btn-ghost w100" style="margin-top:10px" type="button" id="hTous">${t('Voir tous les hôtels')}</button></div>`) +
        `<button class="btn btn-ghost w100" type="button" id="hMan2" style="margin-top:4px">${t('Aucun ne convient ? Demander à un conseiller')}</button>`;
      $('#hRes').querySelectorAll('[data-hc]').forEach(x => x.onclick = () => versClient(+x.dataset.hc));
      $('#hRes').querySelectorAll('[data-hd]').forEach(x => x.onclick = () => voirDetails(+x.dataset.hd));
      $('#hFil').querySelectorAll('[data-tri]').forEach(x => x.onclick = () => { H.filtre.tri = x.dataset.tri; afficherOffres(); });
      $('#hFil').querySelectorAll('[data-f]').forEach(x => x.onclick = () => { H.filtre[x.dataset.f] = !H.filtre[x.dataset.f]; afficherOffres(); });
      if ($('#hPlus')) $('#hPlus').onclick = () => { H.max += 12; afficherOffres(); };
      if ($('#hTous')) $('#hTous').onclick = () => { H.filtre = { tri: H.filtre.tri, rembours: false, dej: false }; afficherOffres(); };
      $('#hMan2').onclick = () => versClient(null);
      if (o.apresOffres) o.apresOffres($('#hRes'));
    }

    function texteSejour(p){
      const nb = p.enfants.length;
      return [t('Du {a} au {d}', { a: jourCourt(p.arrivee), d: jourCourt(p.depart) }) + ' · ' + (p.nuits > 1 ? t('{n} nuits', { n: p.nuits }) : t('1 nuit')),
        [p.chambres > 1 ? t('{n} chambres', { n: p.chambres }) : t('1 chambre'), p.adultes > 1 ? t('{n} adultes', { n: p.adultes }) : t('1 adulte'), nb ? (nb > 1 ? t('{n} enfants', { n: nb }) : t('1 enfant')) : ''].filter(Boolean).join(' · ')];
    }
    function versClient(i){
      const p = H.params; if (!p) return;
      H.choix = i == null ? null : H.rech.offres.find(x => x.i === i);
      H.manuel = !H.choix;
      const [dates, qui] = texteSejour(p);
      if (H.choix) {
        const x = H.choix, h = x.hotel, c = x.chambre;
        $('#hRecap').innerHTML = `<div class="htl-recap">${h.photo ? `<img src="${esc(h.photo)}" alt="" referrerpolicy="no-referrer">` : `<span class="htl-ph">${ICO_LIT}</span>`}<div>
          <b data-no-t>${esc(h.nom)}</b>${etoiles(h.etoiles)}<br><span class="muted" data-no-t>${esc([h.adresse, h.ville].filter(Boolean).join(', '))}</span><br>
          ${esc(dates)}<br>${esc(qui)}<br><span data-no-t>${esc(c.nom)}</span>${repas(c.repas) ? ' · ' + esc(t(repas(c.repas))) : ''}<br>
          ${c.remboursable ? `<span class="htl-tag ok">${esc(c.annulation_avant ? t("Annulation gratuite jusqu'au {d}", { d: jourLong(c.annulation_avant) }) : t('Annulation gratuite'))}</span>` : `<span class="htl-tag">${t('Non remboursable')}</span>`}
          <div style="margin-top:8px"><b>${t('Total : {p}', { p: prix(x.total_gnf) })}</b></div>
          <div class="muted" style="font-size:12.5px">${t("Taxe de séjour éventuelle à payer à l'hôtel, selon la ville.")}</div></div></div>`;
      } else {
        $('#hRecap').innerHTML = `<b>${t("Demande d'hôtel")}</b> — <span data-no-t>${esc(p.lieu.nom)}</span><br>${esc(dates)}<br>${esc(qui)}
          <div class="muted" style="margin-top:6px">${t('Un conseiller vous propose des hôtels et un prix sur WhatsApp.')}</div>`;
      }
      $('#hManChamps').hidden = !H.manuel;
      const moi = o.moi ? o.moi() : {};
      if (moi.tel && !$('#hTel').value) $('#hTel').value = moi.tel;
      if (moi.mail && !$('#hMail').value) $('#hMail').value = moi.mail;
      err('hErr2', ''); etape('client');
    }

    $('#hClient').addEventListener('submit', async e => {
      e.preventDefault(); err('hErr2', '');
      const prenom = $('#hPre').value.trim(), nom = $('#hNom').value.trim();
      const civ = racine.querySelector('input[name=hCiv]:checked');
      if (!prenom || !nom) return err('hErr2', t('Indiquez le prénom et le nom de la personne qui arrive à l\'hôtel.'));
      if (!civ) return err('hErr2', t('Choisissez Monsieur, Madame ou Mademoiselle.'));
      let tel = $('#hTel').value.trim();
      if (!tel) return err('hErr2', t('Indiquez votre numéro WhatsApp.'));
      if (o.normaliserTel) tel = o.normaliserTel(tel);
      if (!$('#hOk').checked) return err('hErr2', t('Cochez la case pour confirmer votre demande.'));
      const p = H.params, mail = $('#hMail').value.trim() || null;
      const commun = { passagers: [{ prenom, nom, naissance: null, civilite: civ.value }], telephone: tel, email: mail, message: $('#hMsg').value.trim() || null, accord: true };
      $('#hEnv').disabled = true; $('#hEnv').textContent = t('Envoi…');
      try {
        const j = H.manuel
          ? await api('hotel_manuel', { ...commun, lieu: { nom: p.lieu.nom }, arrivee: p.arrivee, depart: p.depart, chambres: p.chambres, adultes: p.adultes, enfants: p.enfants,
              nationalite: p.nationalite, budget: $('#hBudget').value.trim() || null, preferences: $('#hPref').value.trim() || null })
          : await api('demande', { ...commun, recherche_id: H.rech.recherche_id, offre: H.choix.i });
        const x = H.choix;
        const voyage = { reference: j.reference, telephone: tel, type: 'hotel', cree: new Date().toISOString(), statut: 'nouvelle', total: j.total_gnf,
          trajet: x ? `${x.hotel.nom}${x.hotel.ville ? ', ' + x.hotel.ville : ''}` : t('Hôtel à {v}', { v: p.lieu.nom }),
          hotel: x ? { nom: x.hotel.nom, ville: x.hotel.ville, adresse: x.hotel.adresse, photo: x.hotel.photo, etoiles: x.hotel.etoiles, chambre: x.chambre.nom, repas: x.chambre.repas,
            remboursable: x.chambre.remboursable, annulation_avant: x.chambre.annulation_avant } : { nom: null, ville: p.lieu.nom, manuel: true },
          sejour: { arrivee: p.arrivee, depart: p.depart, nuits: p.nuits, chambres: p.chambres, adultes: p.adultes, enfants: p.enfants.length },
          depart: p.arrivee, passagers: [prenom + ' ' + nom.toUpperCase()] };
        if (o.enregistrer) o.enregistrer(voyage, { tel, mail });
        $('#hRef').textContent = j.reference;
        $('#hFinTitre').textContent = t("Demande d'hôtel envoyée !");
        $('#hFinTxt').textContent = H.manuel ? t('Votre conseiller cherche les meilleurs hôtels pour vos dates et votre budget, puis vous écrit sur WhatsApp avec une proposition.')
          : t("Votre conseiller vérifie la disponibilité et le prix avec l'hôtel, puis vous écrit sur WhatsApp. Suivez l'avancement dans Mes voyages.");
        const msgWa = t("Bonjour VOYAGE FACILE, je viens d'envoyer la demande d'hôtel {r} ({h}).", { r: j.reference, h: voyage.trajet });
        $('#hWa').onclick = () => o.ouvrir && o.waAgence && o.ouvrir(o.waAgence(msgWa));
        $('#hClient').reset();
        etape('fin');
      } catch (x) { err('hErr2', x.message); }
      finally { $('#hEnv').disabled = false; $('#hEnv').textContent = t('Envoyer ma demande'); }
    });
    if ($('#hVoir')) $('#hVoir').onclick = () => { etape('recherche'); o.voirVoyages(); };
    $('#hNouv').onclick = () => { $('#hRes').innerHTML = ''; etape('recherche'); };

    return {
      // Bouton retour : revient d'une étape en arrière dans le parcours. false si on est déjà au début.
      retour(){
        if (fiche) { fermerDetails(); return true; }
        if (H.etape === 'client') { etape('recherche'); return true; }
        if (H.etape === 'fin') { $('#hRes').innerHTML = ''; etape('recherche'); return true; }
        return false;
      },
      etape: () => H.etape || 'recherche',
      destination(nom){ inp.value = nom; inp.dataset.id = ''; },
      // Pré-remplit le formulaire (ex. depuis la page d'accueil du site)
      remplir(x){
        if (x.lieu) { inp.value = String(x.lieu).slice(0, 80); inp.dataset.id = ''; }
        if (/^\d{4}-\d{2}-\d{2}$/.test(x.arrivee || '') && x.arrivee >= d0) { $('#hD1').value = x.arrivee; $('#hD2').min = plusJours(x.arrivee, 1); }
        if (/^\d{4}-\d{2}-\d{2}$/.test(x.depart || '') && x.depart > ($('#hD1').value || d0)) $('#hD2').value = x.depart;
        if (x.chambres >= 1 && x.chambres <= 5) $('#hCh').value = String(x.chambres);
        if (x.adultes >= 1 && x.adultes <= 12) $('#hAd').value = String(x.adultes);
        majNuits();
      },
    };
  }

  style();
  window.Hotels = { monter, est, libelle, explication, resume, completer, dateDebut, repas, LIB, boiteAgence, style };
})();
