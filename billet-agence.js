/* =====================================================================
   VOYAGE FACILE — Espace agence : joindre le billet électronique
   Après la confirmation avec la compagnie, l'agence joint le billet
   (PDF ou photo). Le fichier est rangé dans un espace privé ; le client
   le télécharge dans l'application (« Mes voyages ») ou sur la page de
   suivi du site, avec sa référence et son numéro.
   Commun à l'application et au site (agence.html).
   ===================================================================== */
(function(){
  const TYPES = { 'application/pdf': 'pdf', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
  const MAX = 10 * 1024 * 1024;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const quand = iso => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' }); };
  const waClient = (tel, texte) => 'https://wa.me/' + String(tel).replace(/\D/g, '') + '?text=' + encodeURIComponent(texte);

  // Message WhatsApp au client : le billet est prêt dans l'application.
  function message(d, site, ref){
    return `Bonjour, ici VOYAGE FACILE.\nVotre billet est prêt !${ref ? '\nRéférence de réservation : ' + ref : ''}\nTrajet : ${d.trajet}\n\n` +
      `Téléchargez votre billet dans l'application VOYAGE FACILE, rubrique « Mes voyages » (touchez « Actualiser »).\n` +
      `Sans l'application : ${site}/suivi.html?ref=${encodeURIComponent(d.id)} (avec votre numéro WhatsApp).\n\nMerci de votre confiance, et partez sans souci !`;
  }

  function html(d){
    const joint = !!d.billet_fichier;
    return `<b>Billet électronique pour le client</b>
      ${joint
        ? `<div class="ok" style="margin-top:8px">📄 Billet joint : <b>${esc(d.billet_fichier_nom || 'billet')}</b>${d.billet_fichier_maj ? ' · ' + esc(quand(d.billet_fichier_maj)) : ''}<br>Le client le télécharge dans « Mes voyages ».</div>
           <div class="cards" style="margin-top:8px"><button class="btn btn-ghost" type="button" data-bf="voir">Voir le billet joint</button>
           <button class="btn btn-wa" type="button" data-bf="wa">Prévenir le client sur WhatsApp</button></div>`
        : `<p class="muted" style="margin:6px 0 4px">Après la confirmation avec la compagnie, joignez ici le billet (PDF ou photo). Le client le reçoit dans son application, rubrique « Mes voyages », et la demande passe à « Billet envoyé ».</p>`}
      <label class="btn ${joint ? 'btn-ghost' : 'btn-or'} w100" style="margin-top:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;text-transform:none;letter-spacing:0;font-size:15px;font-weight:700">${joint ? 'Remplacer le billet' : '📎 Joindre le billet (PDF ou photo)'}<input type="file" data-bf="fichier" accept="application/pdf,image/jpeg,image/png,image/webp" hidden></label>
      <div class="muted" data-bf="etat" style="margin-top:6px" role="status"></div>`;
  }

  // ctx : { sb (client Supabase connecté), toast(msg), ouvrir(url), site, ref() → réf. billet saisie, apres(d) }
  function monter(racine, d, ctx){
    if (!racine) return;
    racine.innerHTML = html(d);
    const etat = m => { const e = racine.querySelector('[data-bf="etat"]'); if (e) e.textContent = m || ''; };
    const input = racine.querySelector('[data-bf="fichier"]');
    input.onchange = async () => {
      const f = input.files && input.files[0]; input.value = '';
      if (!f) return;
      const ext = TYPES[f.type];
      if (!ext) { etat('Choisissez un fichier PDF ou une photo (JPG, PNG).'); return; }
      if (f.size > MAX) { etat('Fichier trop lourd : 10 Mo au maximum.'); return; }
      const chemin = `${d.id}/${Date.now()}.${ext}`;
      input.disabled = true; etat('Envoi du billet…');
      try {
        const up = await ctx.sb.storage.from('billets').upload(chemin, f, { contentType: f.type, upsert: false });
        if (up.error) throw up.error;
        const maintenant = new Date().toISOString();
        const maj = { billet_fichier: chemin, billet_fichier_nom: String(f.name || 'billet.' + ext).slice(0, 120), billet_fichier_maj: maintenant, maj: maintenant };
        if (d.statut !== 'annulee') maj.statut = 'billet_envoye';
        const ref = ctx.ref ? ctx.ref() : ''; if (ref) maj.billet_ref = ref;
        const { error } = await ctx.sb.from('demandes').update(maj).eq('id', d.id);
        if (error) { await ctx.sb.storage.from('billets').remove([chemin]).catch(() => {}); throw error; }
        const ancien = d.billet_fichier;
        Object.assign(d, maj);
        if (ancien && ancien !== chemin) ctx.sb.storage.from('billets').remove([ancien]).catch(() => {});
        ctx.toast('Billet envoyé dans l\'application du client ✅');
        monter(racine, d, ctx);
        if (ctx.apres) ctx.apres(d);
        ctx.ouvrir(waClient(d.telephone, message(d, ctx.site, d.billet_ref || ref)));   // message prêt : il suffit d'appuyer sur « Envoyer »
      } catch (e) {
        etat('Envoi impossible : ' + ((e && e.message) || e) + '. Vérifiez la connexion puis réessayez.');
        input.disabled = false;
      }
    };
    const voir = racine.querySelector('[data-bf="voir"]');
    if (voir) voir.onclick = async () => {
      const { data, error } = await ctx.sb.storage.from('billets').createSignedUrl(d.billet_fichier, 300);
      if (error || !data) { ctx.toast('Ouverture impossible'); return; }
      ctx.ouvrir(data.signedUrl);
    };
    const wa = racine.querySelector('[data-bf="wa"]');
    if (wa) wa.onclick = () => ctx.ouvrir(waClient(d.telephone, message(d, ctx.site, (ctx.ref && ctx.ref()) || d.billet_ref)));
  }

  window.BilletAgence = { html, monter, message };
})();
