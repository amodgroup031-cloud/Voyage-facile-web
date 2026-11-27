/* =====================================================================
   VOYAGE FACILE — Paiement Orange Money (commun à l'application et au site)
   - Guidé : le client paie avec *144#, recopie la référence du SMS, l'agence valide.
   - En ligne : page sécurisée d'Orange Money, dès que le compte marchand est branché.
   Le montant vient toujours du serveur (prix confirmé par l'agence).
   ===================================================================== */
(function(){
  const CSS = `.pay{margin-top:10px;border:1px solid #d5e1ef;border-radius:14px;padding:12px;background:#fff}
.pay h4{color:#0b2545;font-size:15px;margin:0 0 6px}
.pay .pay-montant{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin:4px 0 10px}
.pay .pay-montant b{font-size:18px;color:#0b2545;text-align:right}
.pay ol{margin:6px 0 8px 18px;padding:0}.pay li{margin:5px 0;line-height:1.45}
.pay .pay-num{font-weight:700;color:#0b2545;white-space:nowrap}
.pay .pay-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:46px;border:0;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer;margin-top:8px;text-decoration:none}
.pay .pay-om{background:#ff7900;color:#fff}.pay .pay-ok-btn{background:#0b2545;color:#fff}.pay .pay-ghost{background:#eef3f9;color:#0b2545}
.pay label{display:block;font-size:13px;color:#5b6b80;margin:8px 0 4px;text-transform:none;letter-spacing:0}
.pay input{width:100%;min-height:44px;border:1px solid #c9d6e6;border-radius:10px;padding:8px 10px;font-size:16px;box-sizing:border-box;text-transform:uppercase}
.pay input.tel{text-transform:none}
.pay .pay-note{font-size:12.5px;color:#5b6b80;margin-top:6px;line-height:1.4}
.pay .pay-etat{border-radius:12px;padding:10px 12px;font-size:14px;line-height:1.45}
.pay .pay-etat.ok{background:#e3f5ea;color:#165c3d}.pay .pay-etat.att{background:#fff4e5;color:#7a4b00}.pay .pay-etat.non{background:#fde8e8;color:#8a1f1f;margin-bottom:8px}
.pay details summary{cursor:pointer;font-weight:700;color:#0b2545;margin-top:10px;min-height:32px}
.pay .pay-err{color:#8a1f1f;font-size:13.5px;margin-top:6px}`;
  let styleMis = false;
  function style(){ if (styleMis) return; styleMis = true; const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); }

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const T = (s, v) => window.L ? L.t(s, v) : (v ? s.replace(/\{(\w+)\}/g, (_, k) => v[k] != null ? v[k] : '') : s);
  const gnf = n => Math.round(n).toLocaleString((window.L && L.loc) || 'fr-FR').replace(/[  ]/g,' ') + ' GNF';
  const prix = n => (window.Devise && Devise.html) ? Devise.html(n) : gnf(n);
  const telAff = t => { const d = String(t || '').replace(/\D/g, ''); return d.startsWith('224') && d.length === 12 ? '+224 ' + d.slice(3,6) + ' ' + d.slice(6,8) + ' ' + d.slice(8,10) + ' ' + d.slice(10) : String(t || ''); };

  // v : voyage tel que renvoyé par « suivi » ; infos : paiement_infos (coordonnées Orange Money de l'agence)
  function html(v, infos){
    const p = v && v.paiement; if (!p) return '';
    if (p.statut === 'recu') return `<div class="pay"><div class="pay-etat ok">✅ <b>${T('Paiement reçu')}</b>${p.mode === 'agence' ? T(' en agence') : ''}${p.ref ? T(' · réf. {r}', { r: esc(p.ref) }) : ''}.<br>${v.statut === 'billet_envoye' ? T('Merci, bon voyage !') : T('Votre billet est en préparation.')}</div></div>`;
    if (p.statut === 'declare') return `<div class="pay"><div class="pay-etat att">⏳ <b>${T('Paiement déclaré')}</b> ${T('(réf. {r}).', { r: esc(p.ref) })}<br>${T("L'agence vérifie la réception sur son compte Orange Money. Vous serez prévenu sur WhatsApp.")}</div></div>`;
    if (!v.a_payer) return '';
    const montant = p.montant_gnf || v.prix_gnf;
    const i = infos || {};
    const enLigne = i.en_ligne && (!i.plafond_en_ligne || montant <= i.plafond_en_ligne);
    let h = `<div class="pay"><h4>Payer avec Orange Money</h4>`;
    if (p.statut === 'refuse') h += `<div class="pay-etat non">La référence envoyée n'a pas été retrouvée par l'agence. Vérifiez le SMS d'Orange Money et renvoyez-la, ou écrivez-nous.</div>`;
    if (p.statut === 'en_cours') h += `<div class="pay-etat att">⏳ Paiement Orange Money en cours. Si vous l'avez validé, touchez « Actualiser ».</div><button class="pay-btn pay-ghost" type="button" data-pay="actualiser">Actualiser</button>`;
    h += `<div class="pay-montant"><span>Montant à payer</span><b>${prix(montant)}</b></div>`;
    if (enLigne) h += `<button class="pay-btn pay-om" type="button" data-pay="om">${p.statut === 'en_cours' ? 'Reprendre le paiement Orange Money' : 'Payer avec Orange Money'}</button>
      <div class="pay-note">Page sécurisée d'Orange Money : vous validez avec votre code secret sur votre téléphone.</div>`;
    const guide = i.om_numero || i.om_code_marchand;
    if (guide) {
      const num = x => `<span class="pay-num">${x}</span>`;
      const etape1 = i.om_code_marchand
        ? T('Composez {a} (paiement marchand), entrez le code marchand {c} et le montant {m}.', { a: num('*144*6#'), c: num(esc(i.om_code_marchand)), m: num(gnf(montant)) })
        : T("Composez {a}, choisissez « Transfert d'argent » et envoyez {m} au {n}{t}.", { a: num('*144#'), m: num(gnf(montant)), n: num(esc(telAff(i.om_numero))), t: i.om_titulaire ? ` (${esc(i.om_titulaire)})` : '' });
      h += `<details${enLigne ? '' : ' open'}><summary>${enLigne ? 'Ou payer avec le code *144#' : 'Comment payer'}</summary>
        <ol><li>${etape1}<a class="pay-btn pay-ghost" href="tel:${i.om_code_marchand ? '*144*6%23' : '*144%23'}">${T('Ouvrir {c} sur le téléphone', { c: i.om_code_marchand ? '*144*6#' : '*144#' })}</a></li>
        <li>${T("Validez avec {v} code secret. Ne le donnez à personne, même pas à l'agence.", { v: '<b>' + T('votre') + '</b>' })}</li>
        <li>Recopiez ici la référence de transaction reçue par SMS d'Orange Money :</li></ol>
        <label for="payRef-${esc(v.reference)}">Référence du SMS Orange Money</label><input id="payRef-${esc(v.reference)}" data-pay-ref autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ex. MP261127.1530.A12345">
        <label for="payTel-${esc(v.reference)}">${v.proche ? 'Votre numéro Orange Money (celui qui a payé)' : 'Numéro qui a payé (si différent du vôtre)'}</label><input class="tel" id="payTel-${esc(v.reference)}" data-pay-tel type="tel" inputmode="tel" placeholder="+224 6__ __ __ __">
        <button class="pay-btn pay-ok-btn" type="button" data-pay="declarer">J'ai payé : envoyer la référence</button>
        <div class="pay-err" data-pay-err hidden></div>
        <div class="pay-note">Montant élevé ? Vous pouvez payer en plusieurs fois : mettez toutes les références, séparées par un espace.</div></details>`;
    } else if (!enLigne) {
      h += `<div class="pay-note">Votre conseiller vous indique comment payer sur WhatsApp (Orange Money ou en agence).</div>`;
    }
    h += `<div class="pay-note">Vous pouvez aussi payer directement en agence.</div></div>`;
    return h;
  }

  // ctx : { api(action, data) → Promise, ouvrir(url), toast(msg), apres() }
  function brancher(racine, v, ctx){
    if (!racine) return;
    // Le client s'identifie avec sa référence et son numéro ; un proche avec le lien reçu.
    const ident = v.lien ? { lien: v.lien } : { reference: v.reference, telephone: v.telephone };
    const err = m => { const e = racine.querySelector('[data-pay-err]'); if (e) { e.textContent = m; e.hidden = !m; } else ctx.toast(m); };
    racine.querySelectorAll('[data-pay]').forEach(b => b.onclick = async () => {
      const act = b.dataset.pay;
      if (act === 'actualiser') { ctx.apres(); return; }
      const texte = b.textContent; b.disabled = true; b.textContent = T('Un instant…'); err('');
      try {
        if (act === 'om') {
          const j = await ctx.api('payer_om', ident);
          if (j.url) { ctx.toast(T("Ouverture d'Orange Money…")); ctx.ouvrir(j.url); }
          setTimeout(ctx.apres, 1500);
        } else if (act === 'declarer') {
          const ref = (racine.querySelector('[data-pay-ref]')?.value || '').trim();
          const tel = (racine.querySelector('[data-pay-tel]')?.value || '').trim();
          if (!ref) { err(T("Recopiez la référence reçue par SMS d'Orange Money.")); return; }
          if (v.proche && !tel) { err(T("Indiquez votre numéro Orange Money (celui qui a payé).")); return; }
          await ctx.api('declarer_paiement', { ...ident, transaction: ref, tel_payeur: tel || null });
          ctx.toast(T("Merci ! L'agence vérifie votre paiement."));
          ctx.apres();
        }
      } catch(e) { err(e.message || T('Une erreur est survenue. Réessayez.')); }
      finally { b.disabled = false; b.textContent = texte; }
    });
  }

  style();
  window.Paiement = { html, brancher };
})();
