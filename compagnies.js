/* =====================================================================
   VOYAGE FACILE — choix de la compagnie aérienne
   1) Dans le formulaire de recherche : le client peut choisir une
      compagnie avant de chercher (le serveur ne demande alors que ses vols).
   2) Dans les résultats : une rangée avec le nom de chaque compagnie
      trouvée et son prix le plus bas ; un geste suffit pour filtrer.
   Commun à l'application et au site.
   ===================================================================== */
(function(){
  // Codes IATA à 2 caractères (ceux que les compagnies utilisent sur les billets)
  const GROUPES = [
    ['Compagnies africaines', [
      ['HF',"Air Côte d'Ivoire"], ['HC','Air Sénégal'], ['KP','ASKY Airlines'], ['AT','Royal Air Maroc'], ['ET','Ethiopian Airlines'],
      ['KQ','Kenya Airways'], ['MS','EgyptAir'], ['AH','Air Algérie'], ['TU','Tunisair'], ['WB','RwandAir'], ['SA','South African Airways'],
      ['2J','Air Burkina'], ['P4','Air Peace'], ['AW','Africa World Airlines'], ['QC','Camair-Co'], ['J7','Afrijet'], ['DT','TAAG Angola Airlines'],
      ['L6','Mauritania Airlines'], ['MK','Air Mauritius'], ['3O','Air Arabia Maroc'], ['UR','Uganda Airlines'], ['TC','Air Tanzania'],
    ]],
    ['Europe', [
      ['AF','Air France'], ['SN','Brussels Airlines'], ['TP','TAP Air Portugal'], ['IB','Iberia'], ['SS','Corsair'], ['KL','KLM'],
      ['LH','Lufthansa'], ['BA','British Airways'], ['VY','Vueling'],
    ]],
    ['Moyen-Orient et Turquie', [
      ['TK','Turkish Airlines'], ['EK','Emirates'], ['QR','Qatar Airways'], ['SV','Saudia'], ['FZ','flydubai'], ['G9','Air Arabia'],
    ]],
    ['Amériques', [ ['DL','Delta Air Lines'], ['UA','United Airlines'], ['AC','Air Canada'] ]],
  ];
  GROUPES.forEach(g => g[1].sort((a, b) => a[1].localeCompare(b[1], 'fr')));
  const NOMS = {}; GROUPES.forEach(g => g[1].forEach(([c, n]) => { NOMS[c] = n; }));
  const T = s => (window.L ? L.t(s) : s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  // <option> du formulaire de recherche
  function options(choisi){
    return `<option value="">${esc(T('Toutes les compagnies'))}</option>` + GROUPES.map(([g, l]) =>
      `<optgroup label="${esc(T(g))}">${l.map(([c, n]) => `<option value="${c}"${c === choisi ? ' selected' : ''}>${esc(n)}</option>`).join('')}</optgroup>`).join('');
  }

  // Rangée des compagnies trouvées : nom, nombre de vols et prix le plus bas (prix déjà mis en forme par prixTxt)
  function rangee(offres, actif, prixTxt){
    const m = new Map();
    for (const o of offres) {
      const c = o.aller.compagnie || '?';
      const x = m.get(c) || { n: 0, min: Infinity };
      x.n++; x.min = Math.min(x.min, o.total_gnf); m.set(c, x);
    }
    if (m.size < 2) return '';
    const liste = [...m.entries()].sort((a, b) => a[1].min - b[1].min);
    const bouton = (val, nom, sous, on) => `<button type="button" data-comp="${esc(val)}" aria-pressed="${on}"><b>${esc(nom)}</b><span>${sous}</span></button>`;
    return `<div class="comp-row" role="group" aria-label="${esc(T('Compagnie'))}">` +
      bouton('', T('Toutes'), esc(String(offres.length)) + ' ' + esc(T('vols')), !actif) +
      liste.map(([c, x]) => bouton(c, c, esc(T('dès')) + ' ' + prixTxt(x.min), actif === c)).join('') + '</div>';
  }

  const CSS = `.comp-row{display:flex;gap:8px;overflow-x:auto;margin:0 -16px 12px;padding:2px 16px 4px;scrollbar-width:none}
.comp-row::-webkit-scrollbar{display:none}
.comp-row button{flex:0 0 auto;display:flex;flex-direction:column;align-items:flex-start;gap:2px;min-height:52px;max-width:190px;padding:8px 12px;border-radius:14px;border:1.5px solid #d5e1ef;background:#fff;color:#0b2545;text-align:left;cursor:pointer}
.comp-row button b{font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:166px}
.comp-row button span{font-size:12px;color:#5b6b80;white-space:nowrap}
.comp-row button span small{display:none}
.comp-row button[aria-pressed="true"]{border-color:#f28c28;background:#fff5ea}`;
  const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);

  window.Compagnies = { GROUPES, NOMS, nom: c => NOMS[c] || c, options, rangee };
})();
