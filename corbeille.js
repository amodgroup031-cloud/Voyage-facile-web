/* =====================================================================
   VOYAGE FACILE — Corbeille (commun à l'application et au site)
   - Corbeille.locale(...) : historique du client gardé sur son appareil.
     Une demande effacée part dans la corbeille : elle peut être restaurée
     pendant 30 jours, puis elle disparaît d'elle-même.
   - Corbeille.agence : même principe pour l'Espace agence (colonne
     demandes.supprime_le). La suppression définitive n'est possible que
     depuis la corbeille (protégé par la base).
   - Corbeille.confirmer / Corbeille.annulable / Corbeille.liste : fenêtre
     de confirmation, message « Annuler » et affichage de la corbeille.
   ===================================================================== */
(function(){
  const JOURS = 30, JOUR = 864e5, DUREE = JOURS * JOUR;
  const fr = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => v && v[k] != null ? v[k] : '');   // textes en français (espace agence)
  const tr = (s, v) => window.L ? window.L.t(s, v) : fr(s, v);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const svg = p => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const ICO = {
    poubelle: svg('<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>'),
    restaurer: svg('<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>'),
    retour: svg('<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>'),
    info: svg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
  };
  const age = x => Date.now() - (Date.parse(x && x.supprime_le) || 0);
  const restant = x => Math.max(1, Math.ceil((DUREE - age(x)) / JOUR));
  const expire = x => age(x) >= DUREE;

  /* ---------- Styles (injectés une fois, valables dans l'application et sur le site) ---------- */
  function styles(){
    if (document.getElementById('vfc-css')) return;
    const s = document.createElement('style'); s.id = 'vfc-css';
    s.textContent = `
.vfc-dlg{margin:auto;border:0;border-radius:18px;padding:0;max-width:340px;width:calc(100% - 40px);box-shadow:0 20px 50px rgba(11,37,69,.28);color:var(--ink,#1b2430)}
.vfc-dlg::backdrop{background:rgba(11,37,69,.45)}
.vfc-dlg .in{padding:20px}
.vfc-dlg .ic{width:44px;height:44px;border-radius:50%;background:#fde8e8;color:#b42318;display:grid;place-items:center;margin-bottom:10px}
.vfc-dlg .ic svg{width:22px;height:22px}
.vfc-dlg b{display:block;font-size:17px;color:var(--navy,#0b2545);margin-bottom:6px}
.vfc-dlg p{margin:0;color:#475569;font-size:14.5px;line-height:1.45}
.vfc-dlg .acts{display:flex;gap:8px;margin-top:16px}
.vfc-dlg .acts button{flex:1;min-height:46px;padding:6px 10px;line-height:1.2;border-radius:12px;font:inherit;font-weight:700;font-size:15px;cursor:pointer}
.vfc-dlg .non{background:#fff;border:1.5px solid #d5e1ef;color:var(--navy,#0b2545)}
.vfc-dlg .oui{background:var(--navy,#0b2545);border:0;color:#fff}
.vfc-dlg .oui.danger{background:#c0362c}
.vfc-snack{position:fixed;left:12px;right:12px;bottom:var(--vfc-bas,20px);margin:0 auto;max-width:460px;background:var(--navy,#0b2545);color:#fff;border-radius:14px;padding:8px 8px 8px 16px;display:flex;align-items:center;gap:10px;font-size:14.5px;z-index:2147483000;box-shadow:0 10px 30px rgba(11,37,69,.3);animation:vfc-in .2s ease-out}
.vfc-snack span{flex:1}
.vfc-snack button{background:none;border:0;color:#ffb36b;font:inherit;font-weight:800;padding:10px 12px;min-height:44px;cursor:pointer;text-transform:uppercase;letter-spacing:.3px;font-size:13.5px}
@keyframes vfc-in{from{transform:translateY(12px);opacity:0}to{transform:none;opacity:1}}
.vfc-outils{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;margin:0 0 10px}
.vfc-btn{display:inline-flex;align-items:center;gap:6px;min-height:40px;padding:7px 13px;border-radius:999px;border:1.5px solid #d5e1ef;background:#fff;color:var(--navy,#0b2545);font:inherit;font-size:14px;font-weight:600;cursor:pointer}
.vfc-btn.rouge{color:#b42318;border-color:#f3c9c4}
.vfc-btn .n{background:var(--navy,#0b2545);color:#fff;border-radius:999px;min-width:20px;padding:0 6px;font-size:12px;line-height:20px;text-align:center}
.vfc-lien{background:none;border:0;color:#b42318;font:inherit;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:6px;min-height:44px;width:100%;cursor:pointer;padding:0;margin-top:6px}
.vfc-tete{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}
.vfc-tete h2{font-size:18px;color:var(--navy,#0b2545);margin:0;display:flex;align-items:center;gap:8px}
.vfc-retour{background:none;border:0;color:var(--navy,#0b2545);font:inherit;font-weight:700;font-size:15px;display:inline-flex;align-items:center;gap:6px;min-height:44px;cursor:pointer;padding:0}
.vfc-info{background:#f1f5f9;color:#475569;border-radius:12px;padding:10px 12px;font-size:13.5px;margin-bottom:12px;display:flex;gap:8px;align-items:flex-start;line-height:1.4}
.vfc-info svg{flex:none;margin-top:1px}
.vfc-carte{background:#fff;border:1px solid #d5e1ef;border-radius:14px;padding:12px 14px;margin-bottom:10px}
.vfc-carte .l1{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}
.vfc-carte .l1 b{color:var(--navy,#0b2545)}
.vfc-carte .m{color:#64748b;font-size:13px;margin-top:2px}
.vfc-carte .exp{color:#9a5b00;font-size:12.5px;font-weight:600;white-space:nowrap}
.vfc-carte .acts{display:flex;gap:8px;margin-top:10px}
.vfc-carte .acts button{flex:1;min-height:44px;border-radius:10px;font:inherit;font-weight:700;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px}
.vfc-carte .rest{background:var(--navy,#0b2545);color:#fff;border:0}
.vfc-carte .supp{background:#fff;color:#b42318;border:1.5px solid #f3c9c4}
.vfc-vide{text-align:center;color:#64748b;padding:28px 10px;background:#fff;border:1px dashed #d5e1ef;border-radius:14px}
.vfc-vide svg{width:34px;height:34px;color:#94a3b8;display:block;margin:0 auto 8px}
.vfc-vider{margin-top:6px}`;
    document.head.appendChild(s);
  }

  /* ---------- Fenêtre de confirmation ---------- */
  function confirmer(o){
    styles();
    const t = o.t || tr;
    const dlg = document.createElement('dialog');
    if (typeof dlg.showModal !== 'function') return Promise.resolve(window.confirm(o.titre + '\n\n' + (o.texte || '')));
    dlg.className = 'vfc-dlg'; dlg.setAttribute('data-no-t', '');   // déjà traduit
    dlg.innerHTML = `<div class="in">${o.danger ? `<div class="ic">${ICO.poubelle}</div>` : ''}<b></b><p></p><div class="acts"><button type="button" class="non"></button><button type="button" class="oui${o.danger ? ' danger' : ''}"></button></div></div>`;
    dlg.querySelector('b').textContent = o.titre;
    dlg.querySelector('p').textContent = o.texte || '';
    dlg.querySelector('.non').textContent = o.non || t('Annuler');
    dlg.querySelector('.oui').textContent = o.oui || t('Confirmer');
    document.body.appendChild(dlg);
    return new Promise(res => {
      let fait = false;
      const fin = v => { if (fait) return; fait = true; try { dlg.close(); } catch(e){} dlg.remove(); res(v); };
      dlg.querySelector('.non').onclick = () => fin(false);
      dlg.querySelector('.oui').onclick = () => fin(true);
      dlg.addEventListener('cancel', e => { e.preventDefault(); fin(false); });
      dlg.addEventListener('click', e => { if (e.target === dlg) fin(false); });
      dlg.showModal(); dlg.querySelector('.non').focus();
    });
  }

  /* ---------- Message avec bouton « Annuler » (quelques secondes) ---------- */
  function annulable(texte, annuler, o = {}){
    styles();
    const t = o.t || tr;
    document.querySelectorAll('.vfc-snack').forEach(x => x.remove());
    const el = document.createElement('div'); el.className = 'vfc-snack'; el.setAttribute('role', 'status'); el.setAttribute('data-no-t', '');
    el.innerHTML = '<span></span><button type="button"></button>';
    el.querySelector('span').textContent = texte;
    el.querySelector('button').textContent = t === tr && window.L && window.L.code === 'en' ? 'Undo' : t('Annuler');
    // Au-dessus d'une fenêtre ouverte (site agence) sinon dans la page
    const hote = [...document.querySelectorAll('dialog[open]')].pop() || document.body;
    hote.appendChild(el);
    const fin = () => { clearTimeout(minuterie); el.remove(); };
    const minuterie = setTimeout(fin, o.duree || 6000);
    el.querySelector('button').onclick = async () => { fin(); try { await annuler(); } catch(e){} };
    return fin;
  }

  /* ---------- Historique local du client ---------- */
  // liste : clé localStorage de l'historique ; corbeille : clé de la corbeille.
  // oublier(x) : appelé quand une demande quitte définitivement l'appareil (nettoyage).
  function locale({ liste, corbeille, cle = x => x.reference, oublier = () => {}, max = 50 }){
    const lire = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } };
    const ecrire = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} };
    const C = {
      JOURS,
      // Contenu de la corbeille (les éléments de plus de 30 jours sont effacés au passage)
      items(){
        const l = lire(corbeille, []), ok = l.filter(x => x && x.item && !expire(x));
        if (ok.length !== l.length) { ecrire(corbeille, ok); l.filter(x => !ok.includes(x)).forEach(x => x && x.item && oublier(x.item)); }
        return ok;
      },
      nombre(){ return C.items().length; },
      // Met une demande de l'historique dans la corbeille ; info : données d'affichage en plus (trajet…)
      mettre(ref, info){
        const l = lire(liste, []), i = l.findIndex(x => cle(x) === ref);
        if (i < 0) return false;
        const [item] = l.splice(i, 1); ecrire(liste, l);
        const c = C.items().filter(x => cle(x.item) !== ref);
        c.unshift({ item, info: info || null, supprime_le: new Date().toISOString() });
        ecrire(corbeille, c.slice(0, 100));
        return true;
      },
      // Tout l'historique dans la corbeille ; infos(item) donne les données d'affichage
      toutMettre(infos){
        const l = lire(liste, []); if (!l.length) return 0;
        const maintenant = new Date().toISOString(), refs = new Set(l.map(cle));
        const c = l.map(item => ({ item, info: infos ? infos(item) : null, supprime_le: maintenant }))
          .concat(C.items().filter(x => !refs.has(cle(x.item))));
        ecrire(corbeille, c.slice(0, 100)); ecrire(liste, []);
        return l.length;
      },
      restaurer(ref){
        const c = C.items(), x = c.find(y => cle(y.item) === ref); if (!x) return false;
        ecrire(corbeille, c.filter(y => y !== x));
        const l = lire(liste, []).filter(y => cle(y) !== ref);
        const date = y => Date.parse(y && y.cree) || 0, d = date(x.item);
        let pos = d ? l.findIndex(y => date(y) < d) : 0; if (pos < 0) pos = l.length;
        l.splice(pos, 0, x.item); ecrire(liste, l.slice(0, Math.max(max, l.length)));
        return true;
      },
      // Restaure plusieurs éléments (bouton « Annuler » après « Effacer l'historique »)
      restaurerTout(refs){ (refs || C.items().map(x => cle(x.item))).forEach(r => C.restaurer(r)); },
      supprimer(ref){
        const c = C.items(), x = c.find(y => cle(y.item) === ref); if (!x) return false;
        ecrire(corbeille, c.filter(y => y !== x)); oublier(x.item); return true;
      },
      vider(){ const c = C.items(); ecrire(corbeille, []); c.forEach(x => oublier(x.item)); return c.length; },
    };
    return C;
  }

  /* ---------- Affichage d'une corbeille (client ou agence) ----------
     o.items : éléments ; o.titre(x), o.details(x) : textes ; o.cle(x) : identifiant
     o.restaurer(x), o.supprimer(x), o.vider() : actions (async) ; o.apres() : réafficher
     o.retour : fonction du bouton « Retour » (facultatif) ; o.t : traduction ; o.toast */
  function liste(racine, o){
    styles();
    const t = o.t || tr, items = o.items || [];
    const n = items.length;
    racine.innerHTML = `
      ${o.retour ? `<button type="button" class="vfc-retour" data-vfc="retour">${ICO.retour} ${esc(t(o.libRetour || 'Retour'))}</button>` : ''}
      <div class="vfc-tete"><h2>${ICO.poubelle} ${esc(t('Corbeille'))}</h2>${n > 1 ? `<button type="button" class="vfc-btn rouge vfc-vider" data-vfc="vider">${esc(t('Vider la corbeille'))}</button>` : ''}</div>
      <div class="vfc-info">${ICO.info}<span>${esc(t('Les éléments restent {n} jours dans la corbeille, puis sont effacés définitivement.', { n: JOURS }))}</span></div>
      ${n ? items.map((x, i) => `<div class="vfc-carte" data-i="${i}">
          <div class="l1"><b>${esc(o.titre(x))}</b><span class="exp">${esc(t(restant(x) > 1 ? 'Effacé dans {n} jours' : 'Effacé demain', { n: restant(x) }))}</span></div>
          <div class="m">${esc(o.details ? o.details(x) : '')}</div>
          <div class="acts"><button type="button" class="rest" data-vfc="restaurer">${ICO.restaurer} ${esc(t('Restaurer'))}</button><button type="button" class="supp" data-vfc="supprimer">${ICO.poubelle} ${esc(t('Supprimer'))}</button></div>
        </div>`).join('')
        : `<div class="vfc-vide">${ICO.poubelle}${esc(t('La corbeille est vide.'))}</div>`}`;
    const bouton = (sel, f) => racine.querySelectorAll(`[data-vfc="${sel}"]`).forEach(b => b.onclick = async () => {
      b.disabled = true;
      try { await f(b); } catch(e){ if (o.toast) o.toast(e && e.message ? e.message : t('Action impossible')); }
      finally { b.disabled = false; }
    });
    const elt = b => items[+b.closest('[data-i]').dataset.i];
    bouton('retour', () => o.retour());
    bouton('restaurer', async b => { await o.restaurer(elt(b)); if (o.toast) o.toast(t('Restauré')); o.apres(); });
    bouton('supprimer', async b => {
      if (!await confirmer({ t, danger: true, titre: t('Supprimer définitivement ?'), texte: t('« {x} » sera effacé pour toujours. Cette action est irréversible.', { x: o.titre(elt(b)) }), oui: t('Supprimer') })) return;
      await o.supprimer(elt(b)); if (o.toast) o.toast(t('Supprimé définitivement')); o.apres();
    });
    bouton('vider', async () => {
      if (!await confirmer({ t, danger: true, titre: t('Vider la corbeille ?'), texte: t('Les {n} éléments seront effacés pour toujours. Cette action est irréversible.', { n }), oui: t('Vider') })) return;
      await o.vider(); if (o.toast) o.toast(t('Corbeille vidée')); o.apres();
    });
  }

  /* ---------- Espace agence (base Supabase) ---------- */
  const agence = {
    JOURS,
    dans: d => !!(d && d.supprime_le),
    async mettre(sb, d){
      const maj = { supprime_le: new Date().toISOString() };
      const { error } = await sb.from('demandes').update(maj).eq('id', d.id);
      if (error) throw new Error(/supprime_le/.test(error.message || '') ? 'Corbeille pas encore activée sur le serveur.' : 'Mise à la corbeille impossible');
      Object.assign(d, maj);
    },
    async mettrePlusieurs(sb, liste){
      if (!liste.length) return;
      const maj = { supprime_le: new Date().toISOString() };
      const { error } = await sb.from('demandes').update(maj).in('id', liste.map(d => d.id));
      if (error) throw new Error(/supprime_le/.test(error.message || '') ? 'Corbeille pas encore activée sur le serveur.' : 'Mise à la corbeille impossible');
      liste.forEach(d => Object.assign(d, maj));
    },
    async restaurer(sb, d){
      const { error } = await sb.from('demandes').update({ supprime_le: null }).eq('id', d.id);
      if (error) throw new Error('Restauration impossible');
      d.supprime_le = null;
    },
    async restaurerPlusieurs(sb, liste){
      if (!liste.length) return;
      const { error } = await sb.from('demandes').update({ supprime_le: null }).in('id', liste.map(d => d.id));
      if (error) throw new Error('Restauration impossible');
      liste.forEach(d => d.supprime_le = null);
    },
    // Suppression définitive : fichier du billet puis la demande (seulement si déjà dans la corbeille)
    async supprimer(sb, liste){
      liste = (Array.isArray(liste) ? liste : [liste]).filter(d => d && d.supprime_le);
      if (!liste.length) return 0;
      const fichiers = liste.map(d => d.billet_fichier).filter(Boolean);
      if (fichiers.length) await sb.storage.from('billets').remove(fichiers).catch(() => {});
      const { data, error } = await sb.from('demandes').delete().in('id', liste.map(d => d.id)).select('id');
      if (error) throw new Error('Suppression impossible');
      return (data || []).length;
    },
    // Efface d'elles-mêmes les demandes restées plus de 30 jours dans la corbeille
    async purger(sb, DEM){
      const vieilles = DEM.filter(d => d.supprime_le && expire(d));
      if (!vieilles.length) return [];
      try { await agence.supprimer(sb, vieilles); return vieilles.map(d => d.id); } catch(e){ return []; }
    },
  };

  // Styles prêts dès l'affichage de la page (boutons « Corbeille » et « Effacer l'historique »)
  if (document.head) styles(); else document.addEventListener('DOMContentLoaded', styles);

  window.Corbeille = { JOURS, ICO, fr, styles, confirmer, annulable, locale, liste, agence, restant, expire };
})();
