/* =====================================================================
   VOYAGE FACILE — « Détails du vol »
   Avant de choisir, le client voit chaque vol du trajet : horaires,
   numéros de vol, compagnie qui opère, temps d'attente à chaque escale,
   changement d'aéroport, bagages, classe et prix.
   Commun à l'application et au site.
   ===================================================================== */
(function(){
  const T = (s, v) => window.L ? L.t(s, v) : (v ? s.replace(/\{(\w+)\}/g, (_, k) => v[k] != null ? v[k] : '') : s);
  const LOC = () => (window.L && L.loc) || 'fr-FR';
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ville = c => (window.Pays && Pays.ville) ? Pays.ville(c) : c;
  const lieu = c => `${esc(ville(c))} <span class="dv-code">${esc(c)}</span>`;
  const heure = iso => String(iso || '').slice(11, 16);
  const jourDe = iso => String(iso || '').slice(0, 10);
  const date = iso => { const d = new Date(jourDe(iso) + 'T12:00:00'); return isNaN(d) ? '' : d.toLocaleDateString(LOC(), { weekday: 'short', day: 'numeric', month: 'short' }); };
  const duree = m => m > 0 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}` : '';
  // Écart en minutes entre deux heures locales du même aéroport (même fuseau)
  const ecart = (a, b) => { const x = Date.parse(String(a).slice(0, 19) + 'Z'), y = Date.parse(String(b).slice(0, 19) + 'Z'); return isNaN(x) || isNaN(y) ? null : Math.round((y - x) / 60000); };
  const CLASSES = { economy: 'Économique', premium_economy: 'Éco premium', business: 'Affaires', first: 'Première' };

  function trajet(t, titre){
    if (!t) return '';
    const segs = Array.isArray(t.segments) && t.segments.length ? t.segments : null;
    let corps = '';
    if (segs) {
      segs.forEach((s, k) => {
        const autreJour = jourDe(s.depart) !== jourDe(t.depart_heure);
        corps += `<li class="dv-pt"><b class="dv-h">${esc(heure(s.depart))}</b><span>${lieu(s.de)}${autreJour ? ` <small>${esc(date(s.depart))}</small>` : ''}</span></li>
          <li class="dv-vol"><span>✈ ${esc(T('Vol {v}', { v: s.vol }))}${s.operateur && s.operateur !== t.compagnie ? ` · ${esc(T('opéré par {c}', { c: s.operateur }))}` : ''}${s.duree_min ? ` · ${esc(duree(s.duree_min))}` : ''}</span></li>
          <li class="dv-pt"><b class="dv-h">${esc(heure(s.arrivee))}</b><span>${lieu(s.a)}${jourDe(s.arrivee) !== jourDe(t.depart_heure) ? ` <small>${esc(date(s.arrivee))}</small>` : ''}</span></li>`;
        const suivant = segs[k + 1];
        if (suivant) {
          const att = ecart(s.arrivee, suivant.depart);
          const alertes = [];
          if (att != null && att >= 360) alertes.push(T('Longue escale'));
          if (jourDe(s.arrivee) !== jourDe(suivant.depart)) alertes.push(T('Escale de nuit'));
          corps += `<li class="dv-esc"><span>⏱ ${esc(T('Escale à {v}', { v: ville(s.a) }))}${att != null ? `${window.L && L.code === 'en' ? ':' : ' :'} <b>${esc(duree(att))}</b>` : ''}${alertes.length ? ` <em>${esc(alertes.join(' · '))}</em>` : ''}</span></li>`;
          if (suivant.de && s.a && suivant.de !== s.a)
            corps += `<li class="dv-alerte">⚠️ ${esc(T("Changement d'aéroport : arrivée à {a}, départ de {b}. Prévoyez le trajet entre les deux.", { a: `${ville(s.a)} (${s.a})`, b: `${ville(suivant.de)} (${suivant.de})` }))}</li>`;
        }
      });
    } else {
      corps = `<li class="dv-pt"><b class="dv-h">${esc(heure(t.depart_heure))}</b><span>${lieu(t.depart_aeroport)}</span></li>
        <li class="dv-vol"><span>✈ ${esc((t.vols || []).join(' + '))}${t.escales ? ' · ' + esc(T('Escale(s) : {e}', { e: t.escales_aeroports.map(ville).join(', ') })) : ''}</span></li>
        <li class="dv-pt"><b class="dv-h">${esc(heure(t.arrivee_heure))}</b><span>${lieu(t.arrivee_aeroport)}${jourDe(t.arrivee_heure) !== jourDe(t.depart_heure) ? ` <small>${esc(date(t.arrivee_heure))}</small>` : ''}</span></li>`;
    }
    return `<section class="dv-leg"><div class="dv-legh"><b>${esc(T(titre))} · ${esc(date(t.depart_heure))}</b><span>${esc(t.compagnie)}</span></div>
      <ol class="dv-ligne">${corps}</ol>
      <div class="dv-tot">${esc(T('Durée totale : {d}', { d: duree(t.duree_min) }))} · ${esc(t.escales ? T('{n} escale(s)', { n: t.escales }) : T('Direct'))}</div></section>`;
  }

  function bagages(o){
    const b = o.bagages;
    if (!b) return `<p>🧳 ${esc(T('Bagages : votre conseiller vous confirme la franchise de la compagnie.'))}</p>`;
    const l = [];
    if (b.cabine != null) l.push(T('{n} bagage cabine', { n: b.cabine }));
    if (b.soute != null) l.push(b.soute ? T('{n} en soute', { n: b.soute }) : T('pas de bagage en soute'));
    return `<p>🧳 ${esc(l.join(' · ') || T('Bagages : votre conseiller vous confirme la franchise de la compagnie.'))}</p>` +
      (b.soute === 0 ? `<p class="dv-note">${esc(T("Bagage en soute non compris dans ce prix : la compagnie le fait payer en plus. Demandez le tarif à votre conseiller."))}</p>` : '');
  }

  function html(o, opts){
    const n = opts.passagers || 1;
    const prix = opts.prix ? opts.prix(o.total_gnf) : esc(String(o.total_gnf));
    const escales = (o.aller?.escales || 0) + (o.retour?.escales || 0);
    return `<div class="dv-tete"><h2>${esc(T('Détails du vol'))}</h2><button type="button" class="dv-x" data-dv="fermer" aria-label="${esc(T('Fermer'))}">✕</button></div>
      ${trajet(o.aller, 'Aller')}${trajet(o.retour, 'Retour')}
      <section class="dv-bloc">${bagages(o)}<p>💺 ${esc(T('Classe : {c}', { c: T(CLASSES[o.classe] || o.classe || 'Économique') }))}</p>
        ${escales ? `<p class="dv-note">${esc(T("Escale : vérifiez si un visa de transit est demandé pour le pays de l'escale."))}</p>` : ''}</section>
      <section class="dv-prix"><div><b>${prix}</b><span class="dv-sous">${esc(T('pour {n} passager(s), commission comprise', { n }))}</span></div></section>
      <p class="dv-petit">${esc(T('Prix indicatif : votre conseiller confirme le prix et les places avec la compagnie avant tout paiement.'))}</p>
      <div class="dv-acts"><button type="button" class="dv-b dv-ghost" data-dv="fermer">${esc(T('Retour aux vols'))}</button><button type="button" class="dv-b dv-or" data-dv="choisir">${esc(T('Choisir ce vol'))}</button></div>`;
  }

  // Ouvre la fenêtre de détails. opts : { passagers, prix(n) → HTML, choisir(o) }
  function ouvrir(o, opts = {}){
    fermer();
    const fond = document.createElement('div');
    fond.className = 'dv-fond'; fond.id = 'dvFond';
    fond.innerHTML = `<div class="dv-feuille" role="dialog" aria-modal="true" aria-label="${esc(T('Détails du vol'))}"><div class="dv-grab"></div>${html(o, opts)}</div>`;
    document.body.appendChild(fond);
    document.body.classList.add('dv-ouvert');
    fond.addEventListener('click', e => {
      if (e.target === fond) return fermer();
      const b = e.target.closest('[data-dv]'); if (!b) return;
      if (b.dataset.dv === 'fermer') fermer();
      if (b.dataset.dv === 'choisir') { fermer(); if (opts.choisir) opts.choisir(o); }
    });
    const x = fond.querySelector('.dv-x'); if (x) x.focus();
  }
  function fermer(){ const f = document.getElementById('dvFond'); if (f) f.remove(); document.body.classList.remove('dv-ouvert'); }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') fermer(); });

  const CSS = `.dv-fond{position:fixed;inset:0;z-index:60;background:rgba(8,26,51,.55);display:flex;align-items:flex-end;justify-content:center}
.dv-feuille{background:#fff;width:100%;max-width:640px;max-height:92vh;overflow:auto;border-radius:22px 22px 0 0;padding:14px 16px calc(16px + env(safe-area-inset-bottom));color:#0b2545;font-size:15px}
@media(min-width:700px){.dv-fond{align-items:center}.dv-feuille{border-radius:22px}}
.dv-grab{width:44px;height:5px;border-radius:5px;background:#d5dde8;margin:0 auto 10px}
.dv-tete{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.dv-tete h2{margin:0;font-size:20px}
.dv-x{width:40px;height:40px;border-radius:20px;border:1.5px solid #d5e1ef;background:#fff;font-size:16px;color:#0b2545;cursor:pointer}
.dv-leg{border:1px solid #e3eaf3;border-radius:16px;padding:12px 14px;margin:10px 0}
.dv-legh{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:8px}
.dv-legh span{color:#5b6b80}
.dv-ligne{list-style:none;margin:0;padding:0 0 0 14px;border-left:2px dashed #c9d6e6}
.dv-ligne li{position:relative;margin:0}
.dv-pt{display:flex;gap:10px;align-items:baseline;padding:4px 0}
.dv-pt::before{content:'';position:absolute;left:-22px;top:9px;width:14px;height:14px;box-sizing:border-box;border-radius:50%;background:#fff;border:3px solid #f28c28}
.dv-h{font-size:17px;min-width:48px}
.dv-code{display:inline-block;font-size:12px;font-weight:700;color:#5b6b80;background:#f0f4f9;border-radius:6px;padding:1px 6px;margin-left:2px}
.dv-pt small{color:#5b6b80}
.dv-vol{padding:2px 0 6px 58px;color:#5b6b80;font-size:13.5px}
.dv-esc{margin:6px 0 8px -4px!important;padding:8px 10px;border-radius:10px;background:#f4f7fb;font-size:14px}
.dv-esc em{display:inline-block;font-style:normal;font-weight:700;color:#b85c00;background:#fff1e0;border-radius:6px;padding:1px 6px;margin-left:4px;font-size:12px}
.dv-alerte{margin:0 0 8px -4px!important;padding:8px 10px;border-radius:10px;background:#fdecec;color:#9b1c1c;font-size:13.5px;font-weight:600}
.dv-tot{margin-top:8px;font-size:13.5px;color:#5b6b80}
.dv-bloc p{margin:6px 0}
.dv-note{background:#fff7ec;color:#7a4a00;border-radius:10px;padding:8px 10px;font-size:13.5px}
.dv-prix{display:flex;justify-content:space-between;align-items:center;background:#0b2545;color:#fff;border-radius:14px;padding:12px 14px;margin-top:12px}
.dv-prix b,.dv-prix b *{display:block;font-size:22px;line-height:1.2}
.dv-prix b small{font-size:12.5px;font-weight:600}
.dv-prix .dv-sous{display:block;font-size:13px;opacity:.85;margin-top:2px}
.dv-prix small{color:#cfe0f5}
.dv-petit{font-size:12.5px;color:#5b6b80;margin:8px 2px}
.dv-acts{display:grid;grid-template-columns:1fr 1.4fr;gap:10px;margin-top:10px}
.dv-b{min-height:50px;border-radius:14px;font-weight:800;font-size:15px;cursor:pointer;border:0}
.dv-ghost{background:#fff;border:1.5px solid #d5e1ef;color:#0b2545}
.dv-or{background:#f28c28;color:#0b2545}
body.dv-ouvert{overflow:hidden}`;
  const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);

  window.DetailVol = { ouvrir, fermer, html };
})();
