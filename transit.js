/* =====================================================================
   VOYAGE FACILE — Alerte « visa de transit » (commun à l'application et au site)
   Avant de confirmer, on repère les escales qui demandent un visa selon le
   passeport du voyageur : visa de transit aéroportuaire (Schengen), visa
   Schengen (plusieurs aéroports européens ou changement d'aéroport),
   transit au Royaume-Uni, aux États-Unis et au Canada.
   Sources officielles vérifiées le 28/11/2026 : france-visas.gouv.fr,
   dofi.ibz.be (Belgique), netherlandsworldwide.nl et VFS (Pays-Bas,
   Luxembourg), exteriores.gob.es (Espagne), gov.pt (Portugal), gov.uk.
   L'alerte prévient ; le conseiller confirme toujours avant le paiement.
   ===================================================================== */
(function(){
  const L = s => new Set(s.split(' '));
  const SCHENGEN = L('AT BE BG CH CZ DE DK EE ES FI FR GR HR HU IS IT LI LT LU LV MT NL NO PL PT RO SE SI SK');
  // Visa de transit aéroportuaire exigé dans TOUS les aéroports Schengen
  const VTA_COMMUN = L('AF BD CD ER ET GH IR IQ NG PK SO LK');
  // Listes nationales (en plus de la liste commune)
  const VTA_PAYS = {
    FR: L('AO BO CM CF TD CI CU DO HT IN ML MR NP PH GN CG SN SL SS SD SY TR TG UZ'),
    BE: L('AO DO GN GW HT NP SD SY SS'),
    NL: L('AO CU GN GW NP SD SY SS SL CF TD MR SN TR'),
    LU: L('AO GN GW NP SD SY SS'),
    ES: L('BF CM CG CI CU DJ GM GN GW HT IN KE LR ML MR NP SN SL SD SY TJ TG TR UZ YE TD PS RU'),
    PT: L('GN SN UZ'),
  };
  // Royaume-Uni : visa de transit « airside » (DATV)
  const DATV_UK = L('AF AL DZ AO BD BY BI CM CN CO CD CG EG ER SZ ET GM GH GN GW IN IR IQ CI JM KE XK LB LS LR LY MW MD MN MM NP NG MK PK PS RW SN RS SL SO ZA SS LK SD SY TZ TR UG VE VN YE ZW');
  const EUROPE = 'AT BE BG CH CY CZ DE DK EE ES FI FR GR HR HU IE IS IT LI LT LU LV MC MT NL NO PL PT RO SE SI SK SM AD VA';
  const SANS_VISA_SCHENGEN = L(EUROPE + ' GB US CA AU NZ JP KR SG MY BR AR CL MX UY PY CR PA IL AE TW HK MO MU SC AL BA ME MK RS MD UA GE PE CO');
  const SANS_VISA_UK = L(EUROPE + ' US CA AU NZ JP KR SG MY BR AR CL MX IL AE TW HK MU SC');
  const SANS_VISA_US = L('AD AT AU BE BN CA CH CL CZ DE DK EE ES FI FR GB GR HR HU IE IL IS IT JP KR LI LT LU LV MC MT NL NO NZ PL PT QA RO SE SG SI SK SM TW');
  const SANS_VISA_CA = L(EUROPE + ' US GB AU NZ JP KR SG TW IL AE CL BN BS BB PG SB WS');

  // Aéroports d'escale fréquents → pays
  const AP = {};
  const met = (pays, codes) => codes.split(' ').forEach(c => AP[c] = pays);
  met('FR', 'CDG ORY NCE MRS LYS TLS BOD NTE BVA MPL'); met('BE', 'BRU CRL LGG ANR'); met('NL', 'AMS EIN RTM'); met('LU', 'LUX');
  met('DE', 'FRA MUC DUS BER TXL HAM CGN STR HAJ NUE'); met('ES', 'MAD BCN AGP PMI VLC LPA TFN TFS SVQ BIO ALC');
  met('PT', 'LIS OPO FAO FNC PDL'); met('IT', 'FCO MXP LIN BGY VCE NAP BLQ CTA PMO TRN PSA FLR'); met('CH', 'ZRH GVA BSL');
  met('AT', 'VIE'); met('DK', 'CPH'); met('SE', 'ARN GOT'); met('NO', 'OSL BGO'); met('FI', 'HEL'); met('IS', 'KEF'); met('PL', 'WAW KRK');
  met('CZ', 'PRG'); met('HU', 'BUD'); met('GR', 'ATH SKG'); met('MT', 'MLA'); met('HR', 'ZAG'); met('SI', 'LJU'); met('SK', 'BTS');
  met('BG', 'SOF'); met('RO', 'OTP'); met('EE', 'TLL'); met('LV', 'RIX'); met('LT', 'VNO');
  met('GB', 'LHR LGW STN LTN LCY MAN BHX EDI GLA BRS');
  met('US', 'JFK EWR LGA IAD DCA BWI ATL ORD MDW IAH DFW MIA FLL BOS DTW LAX SFO SEA PHL CLT MSP DEN PHX LAS MCO');
  met('CA', 'YUL YYZ YVR YOW YYC YEG YHZ YQB YWG');

  const tr = (s, v) => window.L ? window.L.t(s, v) : String(s).replace(/\{(\w+)\}/g, (_, k) => v && v[k] != null ? v[k] : '');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const ville = c => (window.Pays ? window.Pays.ville(c) : c) || c;
  let NOMS = null;
  const nom = code => { try { NOMS = NOMS || new Intl.DisplayNames([window.L && window.L.code === 'en' ? 'en' : 'fr'], { type: 'region' }); return NOMS.of(code) || code; } catch(e){ return code; } };

  // Passeport du voyageur : choisi une fois, sinon le pays du téléphone (Guinée par défaut)
  const CLE = 'vf_passeport';
  function passeport(){
    try { const v = localStorage.getItem(CLE); if (/^[A-Z]{2}$/.test(v || '')) return v; } catch(e){}
    const p = window.Pays && window.Pays.code;
    return /^[A-Z]{2}$/.test(p || '') ? p : 'GN';
  }
  function definir(code){ if (/^[A-Z]{2}$/.test(code)) try { localStorage.setItem(CLE, code); } catch(e){} }

  // Alertes pour une offre : [{ sens, type, aeroport, pays }]
  function alertes(o, pp){
    pp = pp || passeport();
    const res = [], vu = new Set();
    const ajoute = a => { const k = a.sens + a.type + a.pays; if (!vu.has(k)) { vu.add(k); res.push(a); } };
    for (const [sens, t] of [['aller', o && o.aller], ['retour', o && o.retour]]) {
      if (!t) continue;
      const segs = Array.isArray(t.segments) && t.segments.length > 1 ? t.segments : null;
      const conns = segs ? segs.slice(0, -1).map((s, k) => ({ a: s.a, b: segs[k + 1].de || s.a }))
        : (t.escales_aeroports || []).map(a => ({ a, b: a }));
      if (!conns.length) continue;
      const pO = AP[t.depart_aeroport] || null, pD = AP[t.arrivee_aeroport] || null;
      // Espace Schengen (seulement si le voyage ne part pas d'Europe et n'y arrive pas)
      if (!SCHENGEN.has(pO) && !SCHENGEN.has(pD)) {
        const sch = conns.filter(c => SCHENGEN.has(AP[c.a]));
        if (sch.length && !SANS_VISA_SCHENGEN.has(pp)) {
          if (sch.length > 1 || sch.some(c => c.a !== c.b)) ajoute({ sens, type: 'schengen', aeroport: sch[0].a, pays: AP[sch[0].a] });
          else { const p = AP[sch[0].a]; if (VTA_COMMUN.has(pp) || (VTA_PAYS[p] && VTA_PAYS[p].has(pp))) ajoute({ sens, type: 'vta', aeroport: sch[0].a, pays: p }); }
        }
      }
      const uk = conns.filter(c => AP[c.a] === 'GB');
      if (uk.length && pO !== 'GB' && pD !== 'GB') {
        if (uk.some(c => c.a !== c.b) && !SANS_VISA_UK.has(pp)) ajoute({ sens, type: 'uk_entree', aeroport: uk[0].a, pays: 'GB' });
        else if (DATV_UK.has(pp)) ajoute({ sens, type: 'uk', aeroport: uk[0].a, pays: 'GB' });
      }
      const us = conns.filter(c => AP[c.a] === 'US');
      if (us.length && pO !== 'US' && pD !== 'US' && !SANS_VISA_US.has(pp)) ajoute({ sens, type: 'us', aeroport: us[0].a, pays: 'US' });
      const ca = conns.filter(c => AP[c.a] === 'CA');
      if (ca.length && pO !== 'CA' && pD !== 'CA' && !SANS_VISA_CA.has(pp)) ajoute({ sens, type: 'ca', aeroport: ca[0].a, pays: 'CA' });
    }
    // Même règle à l'aller et au retour : une seule ligne
    const uniques = [];
    res.forEach(a => { const d = uniques.find(u => u.type === a.type && u.pays === a.pays); if (d) d.sens = 'les deux'; else uniques.push({ ...a }); });
    return uniques;
  }

  function texte(a, pp, t){
    t = t || tr;
    const v = `${ville(a.aeroport)} (${a.aeroport})`, p = nom(pp);
    switch (a.type) {
      case 'vta': return t('Escale à {v} : un visa de transit est exigé (passeport : {p}), même sans sortir de l\'aéroport.', { v, p }) + ' '
        + t('Sauf si vous avez un visa ou un titre de séjour valable de l\'Union européenne, des États-Unis, du Canada ou du Japon.');
      case 'schengen': return t('Escale à {v} : ce trajet passe par plusieurs aéroports européens ou change d\'aéroport. Il faut un visa Schengen (passeport : {p}).', { v, p });
      case 'uk': return t('Escale à {v} : un visa de transit britannique est exigé (passeport : {p}).', { v, p }) + ' '
        + t('Sauf avec un visa ou un titre de séjour valable des États-Unis, du Canada, de l\'Australie, de la Nouvelle-Zélande ou de l\'Europe.');
      case 'uk_entree': return t('Escale à {v} avec changement d\'aéroport : un visa britannique est exigé (passeport : {p}).', { v, p });
      case 'us': return t('Escale à {v} : un visa américain est exigé (passeport : {p}), même pour une simple correspondance.', { v, p });
      case 'ca': return t('Escale à {v} : un visa canadien de transit est exigé (passeport : {p}).', { v, p });
    }
    return '';
  }

  /* ---------- Styles ---------- */
  function styles(){
    if (document.getElementById('vt-css')) return;
    const s = document.createElement('style'); s.id = 'vt-css';
    s.textContent = `
.vt-pill{display:inline-block;padding:4px 10px;border-radius:999px;font-size:12.5px;font-weight:700;background:#fde8e8;color:#8a1f1f;white-space:nowrap}
.vt-bloc{border:1.5px solid #f0b4ae;background:#fff5f4;border-radius:14px;padding:12px 14px;margin:10px 0;color:#5c1a14;font-size:14px;line-height:1.45}
.vt-bloc.ok{border-color:#cfe3d6;background:#f3faf5;color:#1f4d33}
.vt-bloc b.vt-t{display:flex;align-items:center;gap:6px;color:#8a1f1f;font-size:15px;margin-bottom:6px}
.vt-bloc.ok b.vt-t{color:#165c3d}
.vt-bloc ul{margin:6px 0 0;padding-left:18px}
.vt-bloc li{margin:4px 0}
.vt-bloc .vt-sens{display:inline-block;font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;color:#a5432f;margin-right:4px}
.vt-bloc .vt-pp{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:8px;font-size:13.5px;color:#475569}
.vt-bloc .vt-pp select{min-height:38px;padding:4px 8px;border-radius:10px;border:1.5px solid #d5e1ef;background:#fff;font:inherit;font-size:14px;max-width:100%}
.vt-bloc .vt-petit{font-size:12.5px;color:#7a4b45;margin-top:8px}
.vt-bloc.ok .vt-petit{color:#3c6a52}
.vt-bloc label.vt-ok{display:flex;gap:8px;align-items:flex-start;margin:10px 0 0;font-weight:600;color:#5c1a14;cursor:pointer;text-transform:none;letter-spacing:0;font-size:14px}
.vt-bloc label.vt-ok input{width:20px;height:20px;margin-top:1px;flex:none}`;
    document.head.appendChild(s);
  }
  if (document.head) styles(); else document.addEventListener('DOMContentLoaded', styles);

  const PAYS_LISTE = 'GN SN CI ML BF NE TG BJ GW SL LR GM MR CV CM GA CG CD CF TD GQ NG GH MA DZ TN EG LY SD SS ET ER SO DJ KE UG TZ RW BI AO MZ ZA ZW ZM MW MG KM MU SC FR BE CH LU DE ES IT PT NL GB IE US CA TR AE SA QA LB SY IN PK BD CN HT CU DO RU UZ';
  function options(sel){
    const l = PAYS_LISTE.split(' ').map(c => ({ c, n: nom(c) }));
    const premiers = l.slice(0, 1), reste = l.slice(1).sort((a, b) => a.n.localeCompare(b.n));
    return premiers.concat(reste).map(x => `<option value="${x.c}"${x.c === sel ? ' selected' : ''}>${esc(x.n)}</option>`).join('');
  }

  // Petit badge pour la liste des vols
  function badge(o){ return alertes(o).length ? `<span class="vt-pill">⚠️ ${esc(tr('Visa de transit'))}</span>` : ''; }

  // Encadré complet. opts : { case: true (case à cocher obligatoire), choixPasseport: true, t: traduction, vide: texte si rien }
  function bloc(o, opts = {}){
    const t = opts.t || tr, pp = opts.passeport || passeport(), l = alertes(o, pp);
    const sens = s => s === 'aller' ? t('Aller') : s === 'retour' ? t('Retour') : t('Aller et retour');
    const choix = opts.choixPasseport ? `<div class="vt-pp"><span>${esc(t('Pays du passeport'))}</span><select data-vt="passeport" aria-label="${esc(t('Pays du passeport'))}">${options(pp)}</select></div>` : '';
    if (!l.length) return opts.vide === false ? '' : `<div class="vt-bloc ok" data-vt-bloc>${o.aller && (o.aller.escales || (o.retour && o.retour.escales)) ? `<b class="vt-t">✓ ${esc(t('Pas de visa de transit connu pour ce trajet'))}</b><span>${esc(t('Passeport : {p}. Votre conseiller le confirme avant le paiement.', { p: nom(pp) }))}</span>` : `<b class="vt-t">✓ ${esc(t('Vol direct : pas d\'escale'))}</b>`}${choix}</div>`;
    return `<div class="vt-bloc" data-vt-bloc><b class="vt-t">⚠️ ${esc(t(l.length > 1 ? 'Visas exigés pendant les escales' : 'Visa exigé pendant l\'escale'))}</b>
      <ul>${l.map(a => `<li><span class="vt-sens">${esc(sens(a.sens))}</span>${esc(texte(a, pp, t))}</li>`).join('')}</ul>
      <p class="vt-petit">${esc(t('Sans ce visa, la compagnie peut refuser l\'embarquement et le billet peut être perdu. Choisissez un autre vol ou vérifiez avec votre conseiller.'))}</p>
      ${choix}
      ${opts.case ? `<label class="vt-ok"><input type="checkbox" data-vt="ok"> <span>${esc(t('J\'ai ce visa, ou un visa / titre de séjour qui m\'en dispense'))}</span></label>` : ''}</div>`;
  }

  // Branche le choix du passeport d'un encadré (réaffiche avec rendu())
  function brancher(racine, rendu){
    const s = racine && racine.querySelector('[data-vt="passeport"]');
    if (s) s.onchange = () => { definir(s.value); rendu(); };
  }

  window.Transit = { alertes, texte, badge, bloc, brancher, passeport, definir, nom, options, aeroportPays: c => AP[c] || null };
})();
