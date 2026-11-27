/* =====================================================================
   VOYAGE FACILE — prix dans la monnaie du client
   Le pays est reconnu par le fuseau horaire du téléphone (réglé par le
   réseau mobile), sinon par la langue. Le client peut changer la monnaie
   dans « Aide ». Les prix restent calculés en GNF par le serveur ; la
   conversion utilise les taux du serveur (ExchangeRate-API + taux agence).
   ===================================================================== */
(function(){
  const NOMS = {
    GNF:'Franc guinéen', XOF:'Franc CFA (Afrique de l\'Ouest)', XAF:'Franc CFA (Afrique centrale)', EUR:'Euro', USD:'Dollar américain',
    GBP:'Livre sterling', CAD:'Dollar canadien', CHF:'Franc suisse', MAD:'Dirham marocain', DZD:'Dinar algérien', TND:'Dinar tunisien',
    EGP:'Livre égyptienne', NGN:'Naira', GHS:'Cedi', SLE:'Leone', LRD:'Dollar libérien', GMD:'Dalasi', MRU:'Ouguiya', CVE:'Escudo cap-verdien',
    AED:'Dirham des Émirats', SAR:'Riyal saoudien', QAR:'Riyal qatari', TRY:'Livre turque', CNY:'Yuan', INR:'Roupie indienne', RUB:'Rouble'
  };
  const NOMS_EN = {
    GNF:'Guinean franc', XOF:'CFA franc (West Africa)', XAF:'CFA franc (Central Africa)', EUR:'Euro', USD:'US dollar', GBP:'Pound sterling',
    CAD:'Canadian dollar', CHF:'Swiss franc', MAD:'Moroccan dirham', DZD:'Algerian dinar', TND:'Tunisian dinar', EGP:'Egyptian pound', NGN:'Naira',
    GHS:'Cedi', SLE:'Leone', LRD:'Liberian dollar', GMD:'Dalasi', MRU:'Ouguiya', CVE:'Cape Verdean escudo', AED:'UAE dirham', SAR:'Saudi riyal',
    QAR:'Qatari riyal', TRY:'Turkish lira', CNY:'Yuan', INR:'Indian rupee', RUB:'Ruble'
  };
  const EN = () => !!(window.L && window.L.code === 'en');
  const LOC = () => (window.L && window.L.loc) || 'fr-FR';
  const SANS_DECIMALES = new Set(['GNF','XOF','XAF','NGN','SLE','LRD','GMD','MRU','CVE','DZD','INR','RUB','EGP']);
  const FUSEAUX = {
    'Africa/Conakry':'GNF', 'Africa/Dakar':'XOF', 'Africa/Abidjan':'XOF', 'Africa/Bamako':'XOF', 'Africa/Ouagadougou':'XOF', 'Africa/Niamey':'XOF',
    'Africa/Lome':'XOF', 'Africa/Porto-Novo':'XOF', 'Africa/Bissau':'XOF', 'Africa/Douala':'XAF', 'Africa/Libreville':'XAF', 'Africa/Brazzaville':'XAF',
    'Africa/Bangui':'XAF', 'Africa/Ndjamena':'XAF', 'Africa/Malabo':'XAF', 'Africa/Freetown':'SLE', 'Africa/Monrovia':'LRD', 'Africa/Banjul':'GMD',
    'Africa/Nouakchott':'MRU', 'Atlantic/Cape_Verde':'CVE', 'Africa/Casablanca':'MAD', 'Africa/El_Aaiun':'MAD', 'Africa/Algiers':'DZD',
    'Africa/Tunis':'TND', 'Africa/Cairo':'EGP', 'Africa/Lagos':'NGN', 'Africa/Accra':'GHS', 'Europe/London':'GBP', 'Europe/Zurich':'CHF',
    'Europe/Istanbul':'TRY', 'Europe/Moscow':'RUB', 'Asia/Dubai':'AED', 'Asia/Riyadh':'SAR', 'Asia/Qatar':'QAR', 'Asia/Shanghai':'CNY',
    'Asia/Kolkata':'INR', 'Asia/Calcutta':'INR'
  };
  const EURO = ['Paris','Brussels','Berlin','Madrid','Rome','Lisbon','Amsterdam','Luxembourg','Vienna','Dublin','Helsinki','Athens','Bratislava',
    'Ljubljana','Tallinn','Riga','Vilnius','Monaco','Malta','Zagreb','Andorra','San_Marino','Vatican','Busingen','Nicosia'];
  const CANADA = ['Toronto','Vancouver','Montreal','Edmonton','Winnipeg','Halifax','Regina','St_Johns','Moncton','Whitehorse','Iqaluit'];
  const REGIONS = { GN:'GNF', SN:'XOF', CI:'XOF', ML:'XOF', BF:'XOF', NE:'XOF', TG:'XOF', BJ:'XOF', GW:'XOF', CM:'XAF', GA:'XAF', CG:'XAF',
    SL:'SLE', LR:'LRD', GM:'GMD', MR:'MRU', MA:'MAD', DZ:'DZD', TN:'TND', EG:'EGP', NG:'NGN', GH:'GHS', FR:'EUR', BE:'EUR', DE:'EUR', ES:'EUR',
    IT:'EUR', PT:'EUR', NL:'EUR', LU:'EUR', GB:'GBP', CH:'CHF', US:'USD', CA:'CAD', AE:'AED', SA:'SAR', QA:'QAR', TR:'TRY', CN:'CNY', IN:'INR', RU:'RUB' };

  function detecter(){
    let tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch(e){}
    if (FUSEAUX[tz]) return FUSEAUX[tz];
    const ville = tz.split('/')[1] || '';
    if (tz.startsWith('Europe/') && EURO.includes(ville)) return 'EUR';
    if (tz.startsWith('America/')) return CANADA.includes(ville) ? 'CAD' : 'USD';
    const region = String((navigator.languages && navigator.languages[0]) || navigator.language || '').split('-')[1];
    return REGIONS[String(region || '').toUpperCase()] || 'GNF';
  }

  const lire = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } };
  const ecrire = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} };
  let code = lire('vf-devise', null) || detecter();
  if (!NOMS[code]) code = 'GNF';
  let cache = lire('vf-taux', null);            // { taux: {EUR: 9450, …}, t: horodatage }
  const ecouteurs = [];

  const gnfTxt = n => Math.round(n).toLocaleString(LOC()).replace(/[  ]/g, ' ') + ' GNF';
  function montant(n){
    if (n == null || !isFinite(n)) return null;
    if (code === 'GNF') return Math.round(n);
    const t = cache && cache.taux && cache.taux[code];
    if (!(t > 0)) return null;
    const v = n / t;
    return SANS_DECIMALES.has(code) ? Math.ceil(v / 100) * 100 : Math.ceil(v);
  }
  function format(v){
    try { return new Intl.NumberFormat(LOC(), { style:'currency', currency: code, maximumFractionDigits:0, minimumFractionDigits:0 }).format(v).replace(/[  ]/g, ' '); }
    catch(e){ return Math.round(v).toLocaleString(LOC()).replace(/[  ]/g, ' ') + ' ' + code; }
  }
  // Texte principal : dans la monnaie du client (ou en GNF si le taux n'est pas encore connu).
  function prix(n){
    if (n == null) return '—';
    const v = montant(n);
    return code === 'GNF' || v == null ? gnfTxt(n) : format(v);
  }
  // Rappel en GNF sous le prix (seulement si la monnaie n'est pas le GNF).
  const rappel = n => (code !== 'GNF' && montant(n) != null && n != null) ? (EN() ? 'i.e. ' : 'soit ') + gnfTxt(n) : '';
  const escA = s => String(s).replace(/"/g, '&quot;');
  // HTML qui se met à jour tout seul quand la monnaie ou les taux changent.
  const html = (n, avecRappel = true) => `<span data-gnf="${escA(n ?? '')}" data-r="${avecRappel ? 1 : 0}">${prix(n)}${avecRappel && rappel(n) ? `<small class="px-gnf">${rappel(n)}</small>` : ''}</span>`;
  function repeindre(){
    document.querySelectorAll('[data-gnf]').forEach(el => {
      const n = el.dataset.gnf === '' ? null : Number(el.dataset.gnf);
      el.innerHTML = prix(n) + (el.dataset.r === '1' && rappel(n) ? `<small class="px-gnf">${rappel(n)}</small>` : '');
    });
    ecouteurs.forEach(f => { try { f(code); } catch(e){} });
  }

  async function chargerTaux(force){
    if (!force && cache && Date.now() - cache.t < 6 * 3600e3) return;
    try {
      const C = window.VF_CONFIG;
      const r = await fetch(C.SUPABASE_URL + '/functions/v1/vf-api', { method:'POST',
        headers:{ 'Content-Type':'application/json', 'apikey':C.SUPABASE_ANON_KEY, 'Authorization':'Bearer ' + C.SUPABASE_ANON_KEY },
        body: JSON.stringify({ action:'taux' }) });
      const j = await r.json();
      if (r.ok && j && j.taux && j.taux.GNF === 1) { cache = { taux: j.taux, t: Date.now() }; ecrire('vf-taux', cache); repeindre(); }
    } catch(e){ /* hors ligne : on garde les anciens taux, ou le GNF */ }
  }

  window.Devise = {
    code: () => code,
    nom: c => (EN() ? NOMS_EN : NOMS)[c || code] || c,
    liste: () => Object.keys(NOMS).map(c => ({ code: c, nom: (EN() ? NOMS_EN : NOMS)[c] })),
    choisir(c){ if (!NOMS[c]) return; code = c; ecrire('vf-devise', c); repeindre(); chargerTaux(); },
    detecter, prix, rappel, html, repeindre, chargerTaux,
    surChangement: f => ecouteurs.push(f),
    disponible: () => code === 'GNF' || montant(1e6) != null,
  };
  chargerTaux();
})();
