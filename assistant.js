/* =====================================================================
   VOYAGE FACILE — écran de l'assistant (application et site)
   L'assistant répond grâce à la fonction serveur "vf-ia".
   Les prix affichés viennent du serveur ; la demande n'est envoyée
   qu'après le bouton « Confirmer et envoyer » du client.
   ===================================================================== */
(function () {
  const CFG = window.VF_CONFIG;
  const host = document.getElementById('assistant');
  if (!host || !CFG) return;
  const URL_IA = CFG.SUPABASE_URL + '/functions/v1/vf-ia';
  const IC = (n, t) => (window.ico ? window.ico(n, t) : '');
  const URL_API = CFG.SUPABASE_URL + '/functions/v1/vf-api';
  const ech = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const T = (s, v) => window.L ? L.t(s, v) : (v ? s.replace(/\{(\w+)\}/g, (_, k) => v[k] != null ? v[k] : '') : s);
  const LOC = (window.L && L.loc) || 'fr-FR';
  const ORIG = (window.Pays && Pays.aeroport()) || null;
  const fgnf = n => Math.round(n).toLocaleString(LOC).replace(/[  ]/g, ' ') + ' GNF';
  const ouvrirLien = url => (window.ouvrir ? window.ouvrir(url) : window.open(url, '_blank'));
  const lire = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const ecrire = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  // Suggestions adaptées à la ville du client
  function suggestions(){
    const en = window.L && L.code === 'en';
    const dubai = en ? 'Dubai' : 'Dubaï';
    // Ville du client inconnue : suggestions valables partout dans le monde
    if (!ORIG) return [T('Je veux un billet pour {d}', { d: 'Paris' }), T('Un vol pour {d} le mois prochain', { d: dubai }),
      T('Où en est ma demande ?'), T('Je cherche un hôtel à {v}', { v: 'Istanbul' })];
    const o = ORIG.ville, code = ORIG.code;
    const loin = code === 'CDG' ? 'Dakar' : 'Paris';
    const proche = code === 'DSS' ? 'Abidjan' : code === 'DXB' ? 'Istanbul' : window.Pays && Pays.afrique ? 'Dakar' : dubai;
    return [T('Je veux un billet {o} – {d}', { o, d: loin }), T('Un vol direct pour {d} la semaine prochaine', { d: proche }),
      T('Où en est ma demande ?'), T('Je cherche un hôtel à {v}', { v: code === 'DXB' ? 'Istanbul' : dubai })];
  }
  // Discussions gardées sur l'appareil (comme Claude) : « Nouvelle discussion » n'efface rien,
  // les anciennes se rouvrent depuis « Mes discussions ».
  // vf_ia_discussions = [{ id, titre, cree, maj, hist:[{role, content, cartes?}], etat }]
  const MAX_DISC = 30;
  let DISC = lire('vf_ia_discussions', []);
  if (!Array.isArray(DISC)) DISC = [];
  // Ancienne version : une seule discussion (vf_ia_hist) → première discussion de la liste
  const ancien = lire('vf_ia_hist', null);
  if (Array.isArray(ancien) && ancien.length && !DISC.length) {
    DISC.push({ id: 'd' + Date.now().toString(36), titre: titreDe(ancien), cree: new Date().toISOString(), maj: new Date().toISOString(), hist: ancien, etat: lire('vf_ia_etat', {}) });
    ecrire('vf_ia_discussions', DISC);
  }
  try { localStorage.removeItem('vf_ia_hist'); localStorage.removeItem('vf_ia_etat'); } catch (e) {}
  let COURANTE = lire('vf_ia_courante', null);
  const disc = DISC.find(d => d.id === COURANTE);
  let HIST = disc ? disc.hist : [];       // [{role, content, cartes?}]
  let ETAT = disc ? (disc.etat || {}) : {};
  if (!disc) COURANTE = null;
  let occupe = false;
  function titreDe(h){
    const m = (h || []).find(x => x.role === 'user');
    const t = m ? String(m.content).replace(/\s+/g, ' ').trim() : '';
    return t.length > 60 ? t.slice(0, 57) + '…' : t;
  }

  if (!document.getElementById('ia-hist-css')) {
    const st = document.createElement('style'); st.id = 'ia-hist-css';
    st.textContent = `.ia{position:relative}
.ia-btns{margin-left:auto;display:flex;gap:6px}
.ia-btns .ia-new{margin-left:0;display:inline-flex;align-items:center;gap:4px;min-height:36px}
.ia-liste{position:absolute;left:0;right:0;top:59px;bottom:0;background:#f6f8fb;z-index:5;overflow-y:auto;padding:12px 14px}
.ia-liste-tete{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.ia-liste-tete b{font-size:17px;color:var(--navy,#0b2545)}
.ia-liste-nouv{width:100%;min-height:46px;border-radius:12px;border:1.5px dashed #c9d6e6;background:#fff;color:var(--navy,#0b2545);font:inherit;font-weight:700;margin-bottom:10px;cursor:pointer}
.ia-disc{display:flex;align-items:stretch;background:#fff;border:1px solid var(--line,#dde5ee);border-radius:12px;margin-bottom:8px;overflow:hidden}
.ia-disc.active{border-color:#f28c28;box-shadow:inset 3px 0 0 #f28c28}
.ia-disc-o{flex:1;text-align:left;background:none;border:0;padding:10px 12px;font:inherit;cursor:pointer;min-height:56px}
.ia-disc-o b{display:block;color:var(--navy,#0b2545);font-size:14.5px;line-height:1.3}
.ia-disc-o span{display:block;color:#64748b;font-size:12.5px;margin-top:2px}
.ia-disc-x{background:none;border:0;border-left:1px solid var(--line,#dde5ee);color:#b42318;width:48px;cursor:pointer;display:grid;place-items:center}
.ia-liste-vide{color:#64748b;text-align:center;padding:24px 8px}
@media (max-width:380px){.ia-btns .ia-new span{display:none}}`;
    document.head.appendChild(st);
  }
  host.innerHTML = `
    <div class="ia">
      <div class="ia-head"><div class="ia-av"><svg width="26" height="26" viewBox="14 0 112 112" aria-hidden="true"><path d="M56 100 C56 100 22 70 22 45 C22 26 37 11 56 11 C75 11 90 26 90 45 C90 70 56 100 56 100 Z" fill="#fff"/><path d="M40 46 L52 58 L73 35" fill="none" stroke="#0b2545" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><b>Assistant VOYAGE FACILE</b><span>● Disponible 24 h/24</span></div>
        <div class="ia-btns"><button type="button" class="ia-new" id="iaListe" aria-label="Mes discussions">${IC('message-circle', 16)} <span>Mes discussions</span></button>
        <button type="button" class="ia-new" id="iaNew" aria-label="Nouvelle discussion">＋ <span>Nouvelle</span></button></div></div>
      <div class="ia-liste" id="iaListePanneau" hidden></div>
      <div class="ia-msgs" id="iaMsgs" aria-live="polite"></div>
      <div class="ia-chips" id="iaChips">${suggestions().map(t => `<button type="button">${ech(t)}</button>`).join('')}</div>
      <form class="ia-compose" id="iaForm"><label for="iaIn" class="sr">Votre message</label>
        <textarea id="iaIn" rows="1" placeholder="Écrivez votre message…"></textarea>
        <button class="btn btn-or" type="submit" id="iaSend">Envoyer</button></form>
    </div>`;
  const $m = host.querySelector('#iaMsgs');

  function md(t) {
    let s = ech(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    const out = []; let liste = false;
    for (const l of s.split('\n')) {
      const m = l.match(/^\s*(?:[-•*]|\d+[.)])\s+(.*)/);
      if (m) { if (!liste) { out.push('<ul>'); liste = true; } out.push('<li>' + m[1] + '</li>'); }
      else { if (liste) { out.push('</ul>'); liste = false; } out.push(l ? l + '<br>' : '<br>'); }
    }
    if (liste) out.push('</ul>');
    return out.join('').replace(/(<br>)+$/, '');
  }
  const bas = () => { $m.scrollTop = $m.scrollHeight; };
  function bulle(cls, html) { const d = document.createElement('div'); d.className = 'ia-m ' + cls; d.innerHTML = html; $m.appendChild(d); bas(); return d; }

  const hm = iso => (iso || '').slice(11, 16);
  const jr = iso => { const d = new Date((iso || '').slice(0, 10) + 'T12:00:00'); return isNaN(d) ? '' : d.toLocaleDateString(LOC, { weekday: 'short', day: 'numeric', month: 'short' }); };
  const dur = m => m ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}` : '';
  const ligne = (t, titre) => !t ? '' : `<div class="ia-leg"><span class="muted">${ech(T(titre))} · ${ech(jr(t.depart_heure))}</span><br><b>${ech(hm(t.depart_heure))}</b> ${ech(t.depart_aeroport)} → <b>${ech(hm(t.arrivee_heure))}</b> ${ech(t.arrivee_aeroport)} <span class="muted">· ${ech(dur(t.duree_min))} · ${t.escales ? ech(T('{n} escale(s)', { n: t.escales })) : T('direct')}</span></div>`;

  function carteOffres(c) {
    const d = document.createElement('div'); d.className = 'ia-card';
    let offres = [...c.offres].sort((a, b) => a.total_gnf - b.total_gnf);
    if (c.direct) { const dir = offres.filter(o => o.aller.escales === 0 && (!o.retour || o.retour.escales === 0)); if (dir.length) offres = dir; }
    const visibles = offres.slice(0, 5);
    d.innerHTML = `<h4>${IC('plane',18)} ${T('{n} vol(s) trouvé(s) · {p} passager(s)', { n: offres.length, p: c.passagers })}</h4>` + visibles.map(o => `
      <div class="ia-offer"><div class="muted">${ech(o.aller.compagnie)} ${window.Transit ? Transit.badge(o) : ''}</div>${ligne(o.aller, 'Aller')}${ligne(o.retour, 'Retour')}
        <div class="ia-row"><b>${window.Devise ? Devise.html(o.total_gnf) : fgnf(o.total_gnf)}</b><button type="button" class="btn btn-or" data-i="${o.i}" data-c="${ech(o.aller.compagnie)}" data-h="${ech(hm(o.aller.depart_heure))}">Choisir ce vol</button></div></div>`).join('') +
      (offres.length > visibles.length ? `<p class="muted">${T('{n} autre(s) vol(s) : demandez-moi « plus rapide », « direct » ou une compagnie précise.', { n: offres.length - visibles.length })}</p>` : '') +
      `<p class="muted">${T('Prix total, confirmé par votre conseiller avant paiement.')}</p>`;
    d.querySelectorAll('[data-i]').forEach(b => b.onclick = () => envoyer(T('Je choisis le vol n°{i} ({c}, départ {h}).', { i: b.dataset.i, c: b.dataset.c, h: b.dataset.h })));
    $m.appendChild(d); bas();
  }

  function carteConfirmation(c, idx) {
    const d = document.createElement('div'); d.className = 'ia-card';
    const fait = c.envoye;
    d.innerHTML = `<h4>${IC('file-check-2',18)} Vérifiez votre demande</h4>${ligne(c.offre.aller, 'Aller')}${ligne(c.offre.retour, 'Retour')}
      <div class="muted" style="margin-top:6px">${ech(c.offre.aller.compagnie)}</div>
      ${window.Transit && !fait ? Transit.bloc(c.offre, { vide: false }) : ''}
      <div style="margin:6px 0"><b>Passager(s) :</b> ${c.passagers.map(p => ech(T({ m:'M. ', f:'Mme ', mlle:'Mlle ' }[p.civilite] || '') + p.prenom + ' ' + p.nom)).join(', ')}</div>
      <div><b>WhatsApp :</b> ${ech(c.telephone)}</div>
      <div class="ia-row" style="margin-top:8px"><span>Total</span><b style="text-align:right">${window.Devise ? Devise.html(c.offre.total_gnf) : fgnf(c.offre.total_gnf)}</b></div>
      ${fait ? `<div class="ok" style="margin-top:10px">${IC('circle-check',18)} Demande envoyée · Référence <b>${ech(c.reference)}</b></div>`
             : `<button type="button" class="btn btn-or w100" style="margin-top:10px">Confirmer et envoyer</button>
                <p class="muted" style="margin-top:6px">Un conseiller vérifie le prix avec la compagnie et vous contacte sur WhatsApp avant tout paiement.</p>`}`;
    const b = d.querySelector('button');
    if (b) b.onclick = async () => {
      b.disabled = true; b.textContent = T('Envoi…');
      try {
        const r = await fetch(URL_API, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: CFG.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + CFG.SUPABASE_ANON_KEY },
          body: JSON.stringify({ action: 'demande', recherche_id: c.recherche_id, offre: c.offre_index, passagers: c.passagers, telephone: c.telephone, email: c.email, message: c.message, accord: true, devise: window.Devise ? Devise.code() : 'GNF', langue: window.L ? L.code : 'fr', passeport: window.Transit ? Transit.passeport() : null }) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.erreur || T("L'envoi n'a pas abouti. Réessayez."));
        c.envoye = true; c.reference = j.reference;
        // Le voyage apparaît aussi dans « Mes voyages » (application)
        const v = lire('vf_voyages', []);
        v.unshift({ reference: j.reference, telephone: c.telephone, trajet: c.trajet.replace(/ \(.*\)$/, ''), aller: c.offre.aller, retour: c.offre.retour,
          passagers: c.passagers.map(p => p.prenom + ' ' + p.nom), total: j.total_gnf, cree: new Date().toISOString(), statut: 'nouvelle' });
        ecrire('vf_voyages', v.slice(0, 50));
        // Sur le site : la demande apparaît aussi sur la page « Suivre et payer ma demande »
        const w = lire('vf_web_demandes', []).filter(x => x.reference !== j.reference); w.unshift({ reference: j.reference, telephone: c.telephone }); ecrire('vf_web_demandes', w.slice(0, 20));
        const app = !!document.getElementById('v-voyages');
        const note = app ? T("Votre demande {r} est envoyée. Un conseiller vérifie avec la compagnie et vous écrit sur WhatsApp. Vous pouvez suivre l'avancement dans « Mes voyages ».", { r: j.reference })
          : T("Votre demande {r} est envoyée. Un conseiller vérifie avec la compagnie et vous écrit sur WhatsApp. Suivez l'avancement et payez sur la page « Suivre et payer ma demande » (suivi.html).", { r: j.reference });
        HIST.push({ role: 'assistant', content: note });
        sauver(); d.replaceWith(carteConfirmationNode(c)); bulle('bot', md(note));
      } catch (e) { b.disabled = false; b.textContent = T('Confirmer et envoyer'); bulle('sys', ech(e.message)); }
    };
    return d;
  }
  const carteConfirmationNode = c => carteConfirmation(c);

  function afficherCartes(cartes) {
    for (const c of cartes || []) {
      if (c.type === 'offres') carteOffres(c);
      if (c.type === 'confirmation') { $m.appendChild(carteConfirmation(c)); bas(); }
    }
  }
  // Enregistre la discussion en cours dans la liste (créée au premier message)
  function sauver() {
    if (!HIST.length) {   // discussion redevenue vide (message non parti) : on la retire de la liste
      if (COURANTE) { DISC = DISC.filter(x => x.id !== COURANTE); ecrire('vf_ia_discussions', DISC); COURANTE = null; ecrire('vf_ia_courante', null); }
      return;
    }
    const maintenant = new Date().toISOString();
    let d = DISC.find(x => x.id === COURANTE);
    if (!d) { COURANTE = 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); d = { id: COURANTE, cree: maintenant }; DISC.unshift(d); ecrire('vf_ia_courante', COURANTE); }
    Object.assign(d, { titre: titreDe(HIST), maj: maintenant, hist: HIST.slice(-40), etat: ETAT });
    DISC.sort((a, b) => String(b.maj).localeCompare(String(a.maj)));
    DISC = DISC.slice(0, MAX_DISC);
    ecrire('vf_ia_discussions', DISC);
  }
  function nouvelle() {
    HIST = []; ETAT = {}; COURANTE = null; ecrire('vf_ia_courante', null);
    host.querySelector('#iaChips').style.display = ''; fermerListe(); reafficher();
  }
  function ouvrirDiscussion(id) {
    const d = DISC.find(x => x.id === id); if (!d) return;
    COURANTE = id; HIST = d.hist || []; ETAT = d.etat || {}; ecrire('vf_ia_courante', id);
    fermerListe(); reafficher();
  }
  const quand = iso => {
    const t = new Date(iso); if (isNaN(t)) return '';
    const auj = new Date(); auj.setHours(0, 0, 0, 0);
    const j = Math.round((auj - new Date(t.getFullYear(), t.getMonth(), t.getDate())) / 864e5);
    if (j <= 0) return T("Aujourd'hui") + ' · ' + t.toLocaleTimeString(LOC, { hour: '2-digit', minute: '2-digit' });
    if (j === 1) return T('Hier');
    return t.toLocaleDateString(LOC, { day: 'numeric', month: 'short', year: t.getFullYear() === auj.getFullYear() ? undefined : 'numeric' });
  };
  // Liste « Mes discussions »
  function afficherListe() {
    const p = host.querySelector('#iaListePanneau');
    p.innerHTML = `<div class="ia-liste-tete"><b>${T('Mes discussions')}</b><button type="button" class="ia-new" data-l="fermer">${T('Fermer')}</button></div>
      <button type="button" class="ia-liste-nouv" data-l="nouvelle">＋ ${T('Nouvelle discussion')}</button>
      ${DISC.length ? DISC.map(d => `<div class="ia-disc${d.id === COURANTE ? ' active' : ''}" data-id="${ech(d.id)}">
          <button type="button" class="ia-disc-o" data-l="ouvrir"><b>${ech(d.titre || T('Discussion'))}</b><span>${ech(quand(d.maj))} · ${ech(T((d.hist || []).length > 1 ? '{n} messages' : '{n} message', { n: (d.hist || []).length }))}</span></button>
          <button type="button" class="ia-disc-x" data-l="suppr" aria-label="${ech(T('Supprimer'))}">${window.Corbeille ? Corbeille.ICO.poubelle : '✕'}</button></div>`).join('')
        : `<p class="ia-liste-vide">${T('Aucune discussion pour l\'instant. Vos discussions apparaîtront ici.')}</p>`}`;
    p.hidden = false;
    p.querySelectorAll('[data-l]').forEach(b => b.onclick = async () => {
      const a = b.dataset.l, id = b.closest('[data-id]') && b.closest('[data-id]').dataset.id;
      if (a === 'fermer') return fermerListe();
      if (a === 'nouvelle') return nouvelle();
      if (a === 'ouvrir') return ouvrirDiscussion(id);
      if (a === 'suppr') {
        const d = DISC.find(x => x.id === id); if (!d) return;
        const ok = window.Corbeille ? await Corbeille.confirmer({ danger: true, titre: T('Supprimer cette discussion ?'), texte: d.titre || '', oui: T('Supprimer') })
          : window.confirm(T('Supprimer cette discussion ?'));
        if (!ok) return;
        DISC = DISC.filter(x => x.id !== id); ecrire('vf_ia_discussions', DISC);
        if (id === COURANTE) { HIST = []; ETAT = {}; COURANTE = null; ecrire('vf_ia_courante', null); reafficher(); }
        afficherListe();
      }
    });
  }
  function fermerListe() { const p = host.querySelector('#iaListePanneau'); if (!p || p.hidden) return false; p.hidden = true; return true; }

  function accueil() {
    bulle('bot', md(T("Bonjour et bienvenue chez **VOYAGE FACILE**.\nJe trouve votre vol au meilleur prix, je prépare votre réservation et je vous donne l'avancement de vos demandes, à toute heure.\nOù souhaitez-vous partir ?")));
  }
  function reafficher() {
    $m.innerHTML = '';
    if (!HIST.length) { accueil(); return; }
    host.querySelector('#iaChips').style.display = 'none';
    for (const h of HIST) { bulle(h.role === 'user' ? 'me' : 'bot', md(h.content)); afficherCartes(h.cartes); }
  }

  async function envoyer(texte) {
    texte = String(texte || '').trim(); if (!texte || occupe) return;
    occupe = true; host.querySelector('#iaSend').disabled = true; host.querySelector('#iaChips').style.display = 'none';
    bulle('me', ech(texte));
    HIST.push({ role: 'user', content: texte }); sauver();
    const attente = bulle('bot', '<span class="ia-typing"><i></i><i></i><i></i></span>');
    try {
      const r = await fetch(URL_IA, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: CFG.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + CFG.SUPABASE_ANON_KEY },
        body: JSON.stringify({ messages: HIST.map(h => ({ role: h.role, content: h.content })), etat: ETAT, devise: window.Devise ? Devise.code() : 'GNF', langue: window.L ? L.code : 'fr', origine: ORIG }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.erreur || T("L'assistant ne répond pas. Réessayez."));
      attente.innerHTML = md(j.texte);
      ETAT = j.etat || {};
      HIST.push({ role: 'assistant', content: j.texte, cartes: j.cartes && j.cartes.length ? j.cartes : undefined });
      sauver(); afficherCartes(j.cartes);
    } catch (e) {
      attente.remove(); HIST.pop(); sauver();
      const d = bulle('sys', ech(e.message.includes('Failed to fetch') ? T('Pas de connexion Internet. Vérifiez votre réseau.') : e.message) + ` <button type="button" class="btn btn-wa" style="margin-top:8px;min-height:40px">${T('Écrire sur WhatsApp')}</button>`);
      d.querySelector('button').onclick = () => ouvrirLien('https://wa.me/' + CFG.AGENCE_WHATSAPP + '?text=' + encodeURIComponent(texte));
    } finally { occupe = false; host.querySelector('#iaSend').disabled = false; }
  }

  host.querySelector('#iaForm').addEventListener('submit', e => { e.preventDefault(); const i = host.querySelector('#iaIn'); const v = i.value; i.value = ''; envoyer(v); });
  host.querySelector('#iaIn').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); host.querySelector('#iaForm').requestSubmit(); } });
  host.querySelectorAll('#iaChips button').forEach(b => b.onclick = () => envoyer(b.textContent));
  host.querySelector('#iaNew').onclick = nouvelle;
  host.querySelector('#iaListe').onclick = () => { const p = host.querySelector('#iaListePanneau'); if (!p.hidden) fermerListe(); else afficherListe(); };
  reafficher();
  window.VFAssistant = { envoyer, fermerListe, nouvelle };
})();
