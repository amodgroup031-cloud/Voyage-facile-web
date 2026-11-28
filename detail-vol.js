/* =====================================================================
   VOYAGE FACILE — « Détails du vol », présentés comme un billet d'avion
   Bandeau de la compagnie, un coupon par vol (codes d'aéroport, heures,
   numéro de vol, durée), encadré clair pour chaque escale (temps
   d'attente, heure d'arrivée et de redécollage, nuit, changement
   d'aéroport), résumé et prix total. Commun à l'application et au site.
   ===================================================================== */
(function(){
  const T = (s, v) => window.L ? L.t(s, v) : (v ? s.replace(/\{(\w+)\}/g, (_, k) => v[k] != null ? v[k] : '') : s);
  const LOC = () => (window.L && L.loc) || 'fr-FR';
  const EN = () => !!(window.L && L.code === 'en');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ville = c => (window.Pays && Pays.ville) ? Pays.ville(c) : c;
  const heure = iso => String(iso || '').slice(11, 16);
  const jourDe = iso => String(iso || '').slice(0, 10);
  const date = iso => { const d = new Date(jourDe(iso) + 'T12:00:00'); return isNaN(d) ? '' : d.toLocaleDateString(LOC(), { weekday: 'short', day: 'numeric', month: 'short' }); };
  const duree = m => m > 0 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}` : '';
  // Écart en minutes entre deux heures locales du même aéroport (même fuseau)
  const ecart = (a, b) => { const x = Date.parse(String(a).slice(0, 19) + 'Z'), y = Date.parse(String(b).slice(0, 19) + 'Z'); return isNaN(x) || isNaN(y) ? null : Math.round((y - x) / 60000); };
  const CLASSES = { economy: 'Économique', premium_economy: 'Éco premium', business: 'Affaires', first: 'Première' };
  const nbEscales = n => n ? (n > 1 ? T('{n} escales', { n }) : T('1 escale')) : T('Direct');
  const AVION = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" fill="currentColor"/></svg>';

  // Code de la compagnie (ex. « ET 934 » → ET) pour le petit écusson du bandeau
  // (le code le plus fréquent du trajet : AT + QR + QR → QR, même si le 1er vol est assuré par un partenaire)
  const codeCie = t => {
    const vols = t ? (Array.isArray(t.segments) && t.segments.length ? t.segments.map(s => s.vol) : (t.vols || [])) : [];
    const n = {}; let best = '';
    vols.forEach(v => { const c = String(v || '').split(' ')[0].slice(0, 2).toUpperCase(); if (!c) return; n[c] = (n[c] || 0) + 1; if (!best || n[c] > n[best]) best = c; });
    return best;
  };

  // Les vols d'un trajet ; sans détail (anciennes recherches), un seul coupon de bout en bout.
  function segmentsDe(t){
    if (Array.isArray(t.segments) && t.segments.length) return { segs: t.segments, complet: true };
    return { segs: [{ de: t.depart_aeroport, a: t.arrivee_aeroport, depart: t.depart_heure, arrivee: t.arrivee_heure, vol: (t.vols || []).join(' + '), duree_min: t.duree_min }], complet: false };
  }

  function coupon(s, t){
    const op = s.operateur && s.operateur !== t.compagnie ? `<span class="dv-chip">${esc(T('opéré par {c}', { c: s.operateur }))}</span>` : '';
    return `<div class="dv-coupon">
      <div class="dv-route">
        <div class="dv-bout"><b class="dv-iata">${esc(s.de)}</b><b class="dv-heure">${esc(heure(s.depart))}</b><span class="dv-ville">${esc(ville(s.de))}</span><small>${esc(date(s.depart))}</small></div>
        <div class="dv-milieu"><span class="dv-trait"></span><span class="dv-avion">${AVION}</span><span class="dv-trait"></span><small>${esc(duree(s.duree_min))}</small></div>
        <div class="dv-bout dv-droite"><b class="dv-iata">${esc(s.a)}</b><b class="dv-heure">${esc(heure(s.arrivee))}</b><span class="dv-ville">${esc(ville(s.a))}</span><small>${esc(date(s.arrivee))}</small></div>
      </div>
      <div class="dv-chips"><span class="dv-chip dv-fort">${esc(T('Vol {v}', { v: s.vol }))}</span>${op}</div>
    </div>`;
  }

  function escale(s, suivant){
    const att = ecart(s.arrivee, suivant.depart);
    const badges = [];
    if (att != null && att >= 360) badges.push(T('Longue escale'));
    if (jourDe(s.arrivee) !== jourDe(suivant.depart)) badges.push(T('Escale de nuit'));
    const change = suivant.de && s.a && suivant.de !== s.a;
    return `<div class="dv-escale${change ? ' dv-change' : ''}">
      <div class="dv-esc-l"><span class="dv-horloge" aria-hidden="true">⏱</span><div>
        <b>${esc(T('Escale à {v}', { v: ville(s.a) }))} <span class="dv-code">${esc(s.a)}</span></b>
        <span class="dv-esc-h">${esc(T('Arrivée {a} · Départ {b}', { a: heure(s.arrivee), b: heure(suivant.depart) + (jourDe(suivant.depart) !== jourDe(s.arrivee) ? ` (${date(suivant.depart)})` : '') }))}</span>
      </div></div>
      ${att != null ? `<div class="dv-attente"><b>${esc(duree(att))}</b><small>${esc(T("d'attente"))}</small></div>` : ''}
      ${badges.length ? `<div class="dv-badges">${badges.map(b => `<span>${esc(b)}</span>`).join('')}</div>` : ''}
      ${change ? `<p class="dv-alerte">⚠️ ${esc(T("Changement d'aéroport : arrivée à l'aéroport {a}, départ de l'aéroport {b}. Prévoyez le trajet entre les deux.", { a: `${s.a} (${ville(s.a)})`, b: `${suivant.de} (${ville(suivant.de)})` }))}</p>` : ''}
    </div>`;
  }

  function trajet(t, titre){
    if (!t) return '';
    const { segs, complet } = segmentsDe(t);
    let corps = '';
    segs.forEach((s, k) => { corps += coupon(s, t); if (segs[k + 1]) corps += escale(s, segs[k + 1]); });
    if (!complet && t.escales) corps += `<p class="dv-note">${esc(T('Escale(s) : {e}', { e: (t.escales_aeroports || []).map(ville).join(', ') }))}</p>`;
    return `<section class="dv-leg">
      <div class="dv-legh"><span class="dv-sens">${esc(T(titre))}</span><b>${esc(date(t.depart_heure))}</b><span class="dv-legd">${esc(duree(t.duree_min))} · ${esc(nbEscales(t.escales))}</span></div>
      ${corps}
    </section>`;
  }

  function bagagesTxt(o){
    const b = o.bagages; if (!b) return T('À confirmer');
    const l = [];
    if (b.cabine != null) l.push(T('{n} bagage cabine', { n: b.cabine }));
    if (b.soute != null) l.push(b.soute ? T('{n} en soute', { n: b.soute }) : T('pas de bagage en soute'));
    return l.join(' · ') || T('À confirmer');
  }

  function html(o, opts){
    const n = opts.passagers || 1;
    const prix = opts.prix ? opts.prix(o.total_gnf) : esc(String(o.total_gnf));
    const a = o.aller, r = o.retour;
    const escales = (a?.escales || 0) + (r?.escales || 0);
    const classe = T(CLASSES[o.classe] || o.classe || 'Économique');
    const cie = codeCie(a);
    const ligne = (k, v) => `<div><span>${esc(T(k))}</span><b>${esc(v)}</b></div>`;
    const notes = [];
    if (o.bagages && o.bagages.soute === 0) notes.push(T("Bagage en soute non compris dans ce prix : la compagnie le fait payer en plus. Demandez le tarif à votre conseiller."));
    if (!o.bagages) notes.push(T('Bagages : votre conseiller vous confirme la franchise de la compagnie.'));
    if (escales && !window.Transit) notes.push(T("Escale : vérifiez si un visa de transit est demandé pour le pays de l'escale."));
    return `<div class="dv-tete"><h2>${esc(T('Détails du vol'))}</h2><button type="button" class="dv-x" data-dv="fermer" aria-label="${esc(T('Fermer'))}">✕</button></div>
      <article class="dv-billet">
        <header class="dv-bandeau">
          <span class="dv-ecusson">${esc(cie || '✈')}</span>
          <div class="dv-cie"><b>${esc(a ? a.compagnie : '')}</b><span>${esc(a ? `${ville(a.depart_aeroport)} → ${ville(a.arrivee_aeroport)}` : '')}</span></div>
          <span class="dv-classe">${esc(classe)}</span>
        </header>
        <div class="dv-sousbandeau">${esc(r ? T('Aller-retour') : T('Aller simple'))} · ${esc(n > 1 ? T('{n} passagers', { n }) : T('1 passager'))}</div>
        ${trajet(a, 'Aller')}
        ${r ? `<div class="dv-decoupe" aria-hidden="true"></div>${trajet(r, 'Retour')}` : ''}
        <div class="dv-decoupe" aria-hidden="true"></div>
        <div class="dv-resume">
          ${ligne('Durée', r ? `${duree(a.duree_min)} / ${duree(r.duree_min)}` : duree(a.duree_min))}
          ${ligne('Escales', r ? `${nbEscales(a.escales)} / ${nbEscales(r.escales)}` : nbEscales(a.escales))}
          ${ligne('Bagages', bagagesTxt(o))}
          ${ligne('Classe', classe)}
        </div>
        <div class="dv-prix"><span>${esc(T('Prix total'))}</span><b>${prix}</b><small class="dv-sous">${esc(n > 1 ? T('pour {n} passagers', { n }) : T('pour 1 passager'))}</small></div>
      </article>
      ${window.Transit ? Transit.bloc(o, { choixPasseport: true }) : ''}
      ${notes.map(t => `<p class="dv-note">${esc(t)}</p>`).join('')}
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
    // Changement du pays du passeport : l'alerte « visa de transit » se met à jour
    if (window.Transit) Transit.brancher(fond, () => { const y = fond.querySelector('.dv-feuille').scrollTop; ouvrir(o, opts); const f = document.querySelector('#dvFond .dv-feuille'); if (f) f.scrollTop = y; });
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

  const CSS = `.dv-fond{position:fixed;inset:0;z-index:60;background:rgba(8,26,51,.6);display:flex;align-items:flex-end;justify-content:center}
.dv-feuille{background:#eef3f9;width:100%;max-width:640px;max-height:94vh;overflow:auto;border-radius:22px 22px 0 0;padding:12px 14px calc(16px + env(safe-area-inset-bottom));color:#0b2545;font-size:15px}
@media(min-width:700px){.dv-fond{align-items:center}.dv-feuille{border-radius:22px}}
.dv-grab{width:44px;height:5px;border-radius:5px;background:#c8d3e1;margin:0 auto 10px}
.dv-tete{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.dv-tete h2{margin:0;font-size:20px;color:#0b2545}
.dv-x{width:40px;height:40px;border-radius:20px;border:1.5px solid #d5e1ef;background:#fff;font-size:16px;color:#0b2545;cursor:pointer}
.dv-billet{background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 6px 22px rgba(11,37,69,.12)}
.dv-bandeau{display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,#0b2545,#13315c);color:#fff;padding:14px 16px}
.dv-ecusson{flex:0 0 auto;width:44px;height:44px;border-radius:50%;background:#fff;color:#0b2545;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;letter-spacing:.02em;box-shadow:0 0 0 3px rgba(242,140,40,.85)}
.dv-cie{flex:1;min-width:0;display:flex;flex-direction:column}
.dv-cie b{font-size:17px;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dv-cie span{font-size:13px;color:#cfe0f5;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dv-classe{flex:0 0 auto;background:#f28c28;color:#0b2545;font-weight:800;font-size:12px;border-radius:999px;padding:5px 10px;text-transform:uppercase;letter-spacing:.04em}
.dv-sousbandeau{background:#f6f9fd;border-bottom:1px solid #e3eaf3;color:#4a5b72;font-size:13px;font-weight:600;padding:7px 16px}
.dv-leg{padding:12px 14px 4px}
.dv-legh{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px}
.dv-sens{background:#0b2545;color:#fff;font-size:11.5px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;border-radius:6px;padding:3px 8px}
.dv-legh b{font-size:15px}
.dv-legd{margin-left:auto;color:#5b6b80;font-size:13px;font-weight:600}
.dv-coupon{border:1.5px solid #e3eaf3;border-radius:14px;padding:12px 12px 10px;margin-bottom:10px;background:#fff}
.dv-route{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:6px}
.dv-bout{display:flex;flex-direction:column;min-width:0}
.dv-droite{text-align:right;align-items:flex-end}
.dv-iata{font-size:28px;line-height:1;font-weight:800;letter-spacing:.02em;color:#0b2545}
.dv-heure{font-size:17px;margin-top:4px;color:#0b2545}
.dv-ville{font-size:13px;color:#33465e;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}
.dv-bout small{font-size:12px;color:#7a8799}
.dv-milieu{display:grid;grid-template-columns:22px auto 22px;align-items:center;justify-items:center;column-gap:2px;color:#f28c28;align-self:start;padding-top:6px}
.dv-trait{width:22px;border-top:2px dashed #c3d0e0}
.dv-avion svg{width:22px;height:22px;transform:rotate(90deg);display:block}
.dv-milieu small{grid-column:1/4;color:#5b6b80;font-size:12px;font-weight:700;margin-top:4px;white-space:nowrap}
.dv-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;padding-top:9px;border-top:1px dashed #e3eaf3}
.dv-chip{font-size:12.5px;color:#4a5b72;background:#f2f6fb;border-radius:8px;padding:3px 8px}
.dv-chip.dv-fort{color:#0b2545;font-weight:700}
.dv-escale{display:grid;grid-template-columns:1fr auto;gap:8px 10px;align-items:center;margin:-2px 6px 12px;padding:10px 12px;border-radius:12px;background:#fff7ec;border:1.5px dashed #f2b36b}
.dv-escale.dv-change{background:#fdf0f0;border-color:#e9a2a2}
.dv-esc-l{display:flex;gap:9px;align-items:flex-start;min-width:0}
.dv-horloge{font-size:18px;line-height:1.2}
.dv-esc-l b{display:block;font-size:14.5px;color:#0b2545}
.dv-esc-h{display:block;font-size:12.5px;color:#6b5a3f;margin-top:2px}
.dv-attente{text-align:right}
.dv-attente b{display:block;font-size:19px;color:#b85c00;line-height:1.1;white-space:nowrap}
.dv-attente small{font-size:11.5px;color:#8a6a3d}
.dv-badges{grid-column:1/3;display:flex;flex-wrap:wrap;gap:6px}
.dv-badges span{font-size:12px;font-weight:800;color:#b85c00;background:#ffe4c4;border-radius:6px;padding:2px 8px}
.dv-alerte{grid-column:1/3;margin:0;font-size:13px;font-weight:600;color:#9b1c1c}
.dv-code{display:inline-block;font-size:11.5px;font-weight:700;color:#5b6b80;background:#eef2f7;border-radius:5px;padding:0 5px;vertical-align:1px}
.dv-decoupe{position:relative;height:22px;margin:2px 0}
.dv-decoupe::before{content:'';position:absolute;left:16px;right:16px;top:50%;border-top:2px dashed #d5dfeb}
.dv-decoupe::after{content:'';position:absolute;left:-11px;right:-11px;top:0;height:22px;background:radial-gradient(circle at 11px 11px,#eef3f9 10px,transparent 11px) left/22px 22px no-repeat,radial-gradient(circle at 11px 11px,#eef3f9 10px,transparent 11px) right/22px 22px no-repeat}
.dv-resume{display:grid;grid-template-columns:1fr 1fr;gap:10px 14px;padding:4px 16px 14px}
.dv-resume div{display:flex;flex-direction:column;min-width:0}
.dv-resume span{font-size:11.5px;color:#7a8799;text-transform:uppercase;letter-spacing:.06em;font-weight:700}
.dv-resume b{font-size:14px;color:#0b2545}
.dv-prix{display:flex;flex-direction:column;background:#0b2545;color:#fff;padding:14px 16px}
.dv-prix > span{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#f6b56f;font-weight:800}
.dv-prix b,.dv-prix b *{display:block;font-size:24px;line-height:1.2;color:#fff}
.dv-prix b small{font-size:12.5px;font-weight:600;color:#cfe0f5}
.dv-prix .dv-sous{display:block;font-size:13px;color:#cfe0f5;margin-top:2px}
.dv-note{background:#fff;border-left:4px solid #f28c28;color:#5a4320;border-radius:10px;padding:9px 11px;font-size:13.5px;margin:10px 0 0}
.dv-petit{font-size:12.5px;color:#5b6b80;margin:10px 2px}
.dv-acts{display:grid;grid-template-columns:1fr 1.4fr;gap:10px;margin-top:6px}
.dv-b{min-height:50px;border-radius:14px;font-weight:800;font-size:15px;cursor:pointer;border:0}
.dv-ghost{background:#fff;border:1.5px solid #d5e1ef;color:#0b2545}
.dv-or{background:#f28c28;color:#0b2545}
body.dv-ouvert{overflow:hidden}`;
  const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);

  window.DetailVol = { ouvrir, fermer, html };
})();
