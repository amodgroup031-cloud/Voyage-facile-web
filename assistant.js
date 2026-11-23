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
  const URL_API = CFG.SUPABASE_URL + '/functions/v1/vf-api';
  const ech = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fgnf = n => Math.round(n).toLocaleString('fr-FR').replace(/[  ]/g, ' ') + ' GNF';
  const ouvrirLien = url => (window.ouvrir ? window.ouvrir(url) : window.open(url, '_blank'));
  const lire = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const ecrire = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  let HIST = lire('vf_ia_hist', []);      // [{role, content, cartes?}]
  let ETAT = lire('vf_ia_etat', {});
  let occupe = false;

  host.innerHTML = `
    <div class="ia">
      <div class="ia-head"><div class="ia-av">✈️</div><div><b>Assistant VOYAGE FACILE</b><span>● Disponible 24 h/24</span></div>
        <button type="button" class="ia-new" id="iaNew">Nouvelle discussion</button></div>
      <div class="ia-msgs" id="iaMsgs" aria-live="polite"></div>
      <div class="ia-chips" id="iaChips">
        <button type="button">Je veux un billet Conakry – Paris</button>
        <button type="button">Un vol direct pour Dakar la semaine prochaine</button>
        <button type="button">Où en est ma demande ?</button>
        <button type="button">Je cherche un hôtel à Dubaï</button>
      </div>
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
  const jr = iso => { const d = new Date((iso || '').slice(0, 10) + 'T12:00:00'); return isNaN(d) ? '' : d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }); };
  const dur = m => m ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}` : '';
  const ligne = (t, titre) => !t ? '' : `<div class="ia-leg"><span class="muted">${titre} · ${ech(jr(t.depart_heure))}</span><br><b>${ech(hm(t.depart_heure))}</b> ${ech(t.depart_aeroport)} → <b>${ech(hm(t.arrivee_heure))}</b> ${ech(t.arrivee_aeroport)} <span class="muted">· ${ech(dur(t.duree_min))} · ${t.escales ? t.escales + ' escale(s)' : 'direct'}</span></div>`;

  function carteOffres(c) {
    const d = document.createElement('div'); d.className = 'ia-card';
    let offres = [...c.offres].sort((a, b) => a.total_gnf - b.total_gnf);
    if (c.direct) { const dir = offres.filter(o => o.aller.escales === 0 && (!o.retour || o.retour.escales === 0)); if (dir.length) offres = dir; }
    const visibles = offres.slice(0, 5);
    d.innerHTML = `<h4>✈️ ${offres.length} vol(s) trouvé(s) · ${c.passagers} passager(s)</h4>` + visibles.map(o => `
      <div class="ia-offer"><div class="muted">${ech(o.aller.compagnie)}</div>${ligne(o.aller, 'Aller')}${ligne(o.retour, 'Retour')}
        <div class="ia-row"><b>${fgnf(o.total_gnf)}</b><button type="button" class="btn btn-or" data-i="${o.i}" data-c="${ech(o.aller.compagnie)}" data-h="${ech(hm(o.aller.depart_heure))}">Choisir ce vol</button></div></div>`).join('') +
      (offres.length > visibles.length ? `<p class="muted">${offres.length - visibles.length} autre(s) vol(s) : demandez-moi « plus rapide », « direct » ou une compagnie précise.</p>` : '') +
      `<p class="muted">Prix commission comprise, confirmé par votre conseiller avant paiement.</p>`;
    d.querySelectorAll('[data-i]').forEach(b => b.onclick = () => envoyer(`Je choisis le vol n°${b.dataset.i} (${b.dataset.c}, départ ${b.dataset.h}).`));
    $m.appendChild(d); bas();
  }

  function carteConfirmation(c, idx) {
    const d = document.createElement('div'); d.className = 'ia-card';
    const fait = c.envoye;
    d.innerHTML = `<h4>📝 Vérifiez votre demande</h4>${ligne(c.offre.aller, 'Aller')}${ligne(c.offre.retour, 'Retour')}
      <div class="muted" style="margin-top:6px">${ech(c.offre.aller.compagnie)}</div>
      <div style="margin:6px 0"><b>Passager(s) :</b> ${c.passagers.map(p => ech(p.prenom + ' ' + p.nom)).join(', ')}</div>
      <div><b>WhatsApp :</b> ${ech(c.telephone)}</div>
      <div class="ia-row" style="margin-top:8px"><span>Total</span><b>${fgnf(c.offre.total_gnf)}</b></div>
      ${fait ? `<div class="ok" style="margin-top:10px">✅ Demande envoyée · Référence <b>${ech(c.reference)}</b></div>`
             : `<button type="button" class="btn btn-or w100" style="margin-top:10px">Confirmer et envoyer</button>
                <p class="muted" style="margin-top:6px">Un conseiller vérifie le prix avec la compagnie et vous contacte sur WhatsApp avant tout paiement.</p>`}`;
    const b = d.querySelector('button');
    if (b) b.onclick = async () => {
      b.disabled = true; b.textContent = 'Envoi…';
      try {
        const r = await fetch(URL_API, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: CFG.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + CFG.SUPABASE_ANON_KEY },
          body: JSON.stringify({ action: 'demande', recherche_id: c.recherche_id, offre: c.offre_index, passagers: c.passagers, telephone: c.telephone, email: c.email, message: c.message, accord: true }) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.erreur || "L'envoi n'a pas abouti. Réessayez.");
        c.envoye = true; c.reference = j.reference;
        // Le voyage apparaît aussi dans « Mes voyages » (application)
        const v = lire('vf_voyages', []);
        v.unshift({ reference: j.reference, telephone: c.telephone, trajet: c.trajet.replace(/ \(.*\)$/, ''), aller: c.offre.aller, retour: c.offre.retour,
          passagers: c.passagers.map(p => p.prenom + ' ' + p.nom), total: j.total_gnf, cree: new Date().toISOString(), statut: 'nouvelle' });
        ecrire('vf_voyages', v.slice(0, 50));
        const note = `✅ Votre demande ${j.reference} est envoyée. Un conseiller vérifie avec la compagnie et vous écrit sur WhatsApp. Vous pouvez suivre l'avancement dans « Mes voyages ».`;
        HIST.push({ role: 'assistant', content: note });
        sauver(); d.replaceWith(carteConfirmationNode(c)); bulle('bot', md(note));
      } catch (e) { b.disabled = false; b.textContent = 'Confirmer et envoyer'; bulle('sys', ech(e.message)); }
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
  function sauver() { ecrire('vf_ia_hist', HIST.slice(-40)); ecrire('vf_ia_etat', ETAT); }

  function accueil() {
    bulle('bot', md("Bonjour et bienvenue chez **VOYAGE FACILE** 👋\nJe trouve votre vol au meilleur prix, je prépare votre réservation et je vous donne l'avancement de vos demandes, à toute heure.\nOù souhaitez-vous partir ?"));
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
        body: JSON.stringify({ messages: HIST.map(h => ({ role: h.role, content: h.content })), etat: ETAT }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.erreur || "L'assistant ne répond pas. Réessayez.");
      attente.innerHTML = md(j.texte);
      ETAT = j.etat || {};
      HIST.push({ role: 'assistant', content: j.texte, cartes: j.cartes && j.cartes.length ? j.cartes : undefined });
      sauver(); afficherCartes(j.cartes);
    } catch (e) {
      attente.remove(); HIST.pop(); sauver();
      const d = bulle('sys', ech(e.message.includes('Failed to fetch') ? 'Pas de connexion Internet. Vérifiez votre réseau.' : e.message) + ' <button type="button" class="btn btn-wa" style="margin-top:8px;min-height:40px">Écrire sur WhatsApp</button>');
      d.querySelector('button').onclick = () => ouvrirLien('https://wa.me/' + CFG.AGENCE_WHATSAPP + '?text=' + encodeURIComponent(texte));
    } finally { occupe = false; host.querySelector('#iaSend').disabled = false; }
  }

  host.querySelector('#iaForm').addEventListener('submit', e => { e.preventDefault(); const i = host.querySelector('#iaIn'); const v = i.value; i.value = ''; envoyer(v); });
  host.querySelector('#iaIn').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); host.querySelector('#iaForm').requestSubmit(); } });
  host.querySelectorAll('#iaChips button').forEach(b => b.onclick = () => envoyer(b.textContent));
  host.querySelector('#iaNew').onclick = () => { HIST = []; ETAT = {}; sauver(); host.querySelector('#iaChips').style.display = ''; reafficher(); };
  reafficher();
  window.VFAssistant = { envoyer };
})();
