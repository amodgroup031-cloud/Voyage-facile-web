/* =====================================================================
   VOYAGE FACILE — pays du client et aéroport de départ
   Le pays est reconnu par le fuseau horaire du téléphone (réglé par le
   réseau mobile), sinon par la langue du téléphone. Il sert à proposer
   la ville de départ, les destinations populaires et la langue.
   Commun à l'application et au site.
   ===================================================================== */
(function(){
  const FUSEAUX = {
    'Africa/Conakry':'GN','Africa/Dakar':'SN','Africa/Abidjan':'CI','Africa/Bamako':'ML','Africa/Ouagadougou':'BF','Africa/Niamey':'NE',
    'Africa/Lome':'TG','Africa/Porto-Novo':'BJ','Africa/Bissau':'GW','Africa/Douala':'CM','Africa/Libreville':'GA','Africa/Brazzaville':'CG',
    'Africa/Kinshasa':'CD','Africa/Lubumbashi':'CD','Africa/Bangui':'CF','Africa/Ndjamena':'TD','Africa/Malabo':'GQ','Africa/Freetown':'SL',
    'Africa/Monrovia':'LR','Africa/Banjul':'GM','Africa/Nouakchott':'MR','Atlantic/Cape_Verde':'CV','Africa/Casablanca':'MA','Africa/El_Aaiun':'MA',
    'Africa/Algiers':'DZ','Africa/Tunis':'TN','Africa/Tripoli':'LY','Africa/Cairo':'EG','Africa/Lagos':'NG','Africa/Accra':'GH',
    'Africa/Nairobi':'KE','Africa/Addis_Ababa':'ET','Africa/Kigali':'RW','Africa/Johannesburg':'ZA','Africa/Kampala':'UG',
    'Africa/Dar_es_Salaam':'TZ','Africa/Khartoum':'SD','Africa/Luanda':'AO','Africa/Maputo':'MZ','Africa/Harare':'ZW','Africa/Lusaka':'ZM',
    'Africa/Bujumbura':'BI','Africa/Djibouti':'DJ','Indian/Antananarivo':'MG','Indian/Comoro':'KM','Indian/Mauritius':'MU',
    'Europe/Paris':'FR','Europe/Brussels':'BE','Europe/Berlin':'DE','Europe/Madrid':'ES','Europe/Rome':'IT','Europe/Lisbon':'PT',
    'Europe/Amsterdam':'NL','Europe/Luxembourg':'LU','Europe/Zurich':'CH','Europe/London':'GB','Europe/Dublin':'IE','Europe/Vienna':'AT',
    'Europe/Istanbul':'TR','Europe/Moscow':'RU','Europe/Oslo':'NO','Europe/Stockholm':'SE','Europe/Copenhagen':'DK','Europe/Warsaw':'PL',
    'Europe/Athens':'GR','Europe/Monaco':'MC',
    'Asia/Dubai':'AE','Asia/Riyadh':'SA','Asia/Qatar':'QA','Asia/Kuwait':'KW','Asia/Bahrain':'BH','Asia/Muscat':'OM','Asia/Beirut':'LB',
    'Asia/Amman':'JO','Asia/Shanghai':'CN','Asia/Hong_Kong':'HK','Asia/Kolkata':'IN','Asia/Calcutta':'IN','Asia/Tokyo':'JP',
    'Asia/Kuala_Lumpur':'MY','Asia/Singapore':'SG','America/Port-au-Prince':'HT','America/Sao_Paulo':'BR','America/Mexico_City':'MX',
    // Reste de l'Europe
    'Europe/Prague':'CZ','Europe/Budapest':'HU','Europe/Bucharest':'RO','Europe/Sofia':'BG','Europe/Kiev':'UA','Europe/Kyiv':'UA','Europe/Helsinki':'FI',
    'Europe/Riga':'LV','Europe/Vilnius':'LT','Europe/Tallinn':'EE','Europe/Belgrade':'RS','Europe/Zagreb':'HR','Europe/Ljubljana':'SI','Europe/Bratislava':'SK',
    'Europe/Malta':'MT','Asia/Nicosia':'CY','Europe/Nicosia':'CY','Atlantic/Reykjavik':'IS','Europe/Sarajevo':'BA','Europe/Tirane':'AL','Europe/Skopje':'MK',
    'Europe/Chisinau':'MD','Europe/Minsk':'BY','Europe/Andorra':'AD',
    // Asie et Moyen-Orient
    'Asia/Jerusalem':'IL','Asia/Tel_Aviv':'IL','Asia/Gaza':'PS','Asia/Hebron':'PS','Asia/Tehran':'IR','Asia/Baghdad':'IQ','Asia/Damascus':'SY','Asia/Aden':'YE',
    'Asia/Karachi':'PK','Asia/Dhaka':'BD','Asia/Kathmandu':'NP','Asia/Colombo':'LK','Asia/Bangkok':'TH','Asia/Jakarta':'ID','Asia/Makassar':'ID',
    'Asia/Manila':'PH','Asia/Ho_Chi_Minh':'VN','Asia/Saigon':'VN','Asia/Seoul':'KR','Asia/Taipei':'TW','Asia/Tashkent':'UZ','Asia/Almaty':'KZ',
    'Asia/Baku':'AZ','Asia/Tbilisi':'GE','Asia/Yerevan':'AM','Asia/Kabul':'AF','Indian/Maldives':'MV',
    // Océanie
    'Australia/Sydney':'AU','Australia/Melbourne':'AU','Australia/Brisbane':'AU','Australia/Perth':'AU','Australia/Adelaide':'AU','Australia/Darwin':'AU',
    'Australia/Hobart':'AU','Pacific/Auckland':'NZ','Pacific/Fiji':'FJ','Pacific/Tahiti':'PF','Pacific/Noumea':'NC',
    // Amérique latine et Caraïbes
    'America/Argentina/Buenos_Aires':'AR','America/Buenos_Aires':'AR','America/Santiago':'CL','America/Lima':'PE','America/Bogota':'CO','America/Caracas':'VE',
    'America/Guayaquil':'EC','America/La_Paz':'BO','America/Asuncion':'PY','America/Montevideo':'UY','America/Havana':'CU','America/Santo_Domingo':'DO',
    'America/Panama':'PA','America/Costa_Rica':'CR','America/Guatemala':'GT','America/Jamaica':'JM','America/Martinique':'MQ','America/Guadeloupe':'GP',
    'America/Cayenne':'GF','America/Port_of_Spain':'TT','America/Puerto_Rico':'PR','America/Bahia':'BR','America/Fortaleza':'BR','America/Recife':'BR',
    'America/Manaus':'BR','America/Belem':'BR','America/Cancun':'MX','America/Monterrey':'MX','America/Tijuana':'MX',
    // Reste de l'Afrique et océan Indien
    'Africa/Windhoek':'NA','Africa/Gaborone':'BW','Africa/Blantyre':'MW','Africa/Asmara':'ER','Africa/Mogadishu':'SO','Africa/Juba':'SS',
    'Africa/Sao_Tome':'ST','Indian/Mahe':'SC','Indian/Reunion':'RE','Indian/Mayotte':'YT','Africa/Maseru':'LS','Africa/Mbabane':'SZ'
  };
  const CANADA = ['Toronto','Vancouver','Montreal','Edmonton','Winnipeg','Halifax','Regina','St_Johns','Moncton','Whitehorse','Iqaluit'];

  // Aéroport principal de chaque pays : [code, nom français, nom anglais]
  const AEROPORTS = {
    GN:['CKY','Conakry'], SN:['DSS','Dakar'], CI:['ABJ','Abidjan'], ML:['BKO','Bamako'], BF:['OUA','Ouagadougou'], NE:['NIM','Niamey'],
    TG:['LFW','Lomé'], BJ:['COO','Cotonou'], GW:['OXB','Bissau'], CM:['DLA','Douala'], GA:['LBV','Libreville'], CG:['BZV','Brazzaville'],
    CD:['FIH','Kinshasa'], CF:['BGF','Bangui'], TD:['NDJ',"N'Djamena"], GQ:['SSG','Malabo'], SL:['FNA','Freetown'], LR:['ROB','Monrovia'],
    GM:['BJL','Banjul'], MR:['NKC','Nouakchott'], CV:['RAI','Praia'], MA:['CMN','Casablanca'], DZ:['ALG','Alger','Algiers'], TN:['TUN','Tunis'],
    EG:['CAI','Le Caire','Cairo'], NG:['LOS','Lagos'], GH:['ACC','Accra'], KE:['NBO','Nairobi'], ET:['ADD','Addis-Abeba','Addis Ababa'],
    RW:['KGL','Kigali'], ZA:['JNB','Johannesburg'], UG:['EBB','Entebbe'], TZ:['DAR','Dar es Salaam'], AO:['LAD','Luanda'], MZ:['MPM','Maputo'],
    BI:['BJM','Bujumbura'], DJ:['JIB','Djibouti'], MG:['TNR','Antananarivo'], KM:['HAH','Moroni'], MU:['MRU','Maurice','Mauritius'],
    FR:['CDG','Paris'], BE:['BRU','Bruxelles','Brussels'], DE:['FRA','Francfort','Frankfurt'], ES:['MAD','Madrid'], IT:['FCO','Rome'],
    PT:['LIS','Lisbonne','Lisbon'], NL:['AMS','Amsterdam'], LU:['LUX','Luxembourg'], CH:['GVA','Genève','Geneva'], GB:['LHR','Londres','London'],
    IE:['DUB','Dublin'], AT:['VIE','Vienne','Vienna'], TR:['IST','Istanbul'], RU:['SVO','Moscou','Moscow'], NO:['OSL','Oslo'],
    SE:['ARN','Stockholm'], DK:['CPH','Copenhague','Copenhagen'], PL:['WAW','Varsovie','Warsaw'], GR:['ATH','Athènes','Athens'], MC:['NCE','Nice'],
    AE:['DXB','Dubaï','Dubai'], SA:['JED','Djeddah','Jeddah'], QA:['DOH','Doha'], KW:['KWI','Koweït','Kuwait'], BH:['BAH','Bahreïn','Bahrain'],
    OM:['MCT','Mascate','Muscat'], LB:['BEY','Beyrouth','Beirut'], JO:['AMM','Amman'], CN:['CAN','Canton','Guangzhou'], HK:['HKG','Hong Kong'],
    IN:['DEL','New Delhi'], JP:['NRT','Tokyo'], MY:['KUL','Kuala Lumpur'], SG:['SIN','Singapour','Singapore'], HT:['PAP','Port-au-Prince'],
    BR:['GRU','São Paulo'], MX:['MEX','Mexico','Mexico City'], CA:['YUL','Montréal','Montreal'], US:['JFK','New York'],
    ZW:['HRE','Harare'], ZM:['LUN','Lusaka'], SD:['KRT','Khartoum'], LY:['TIP','Tripoli'], NA:['WDH','Windhoek'], BW:['GBE','Gaborone'],
    MW:['LLW','Lilongwe'], ER:['ASM','Asmara'], SO:['MGQ','Mogadiscio','Mogadishu'], SS:['JUB','Djouba','Juba'], ST:['TMS','São Tomé'],
    SC:['SEZ','Seychelles'], RE:['RUN','La Réunion','Reunion'], YT:['DZA','Mayotte'], LS:['MSU','Maseru'], SZ:['SHO','Manzini'],
    CZ:['PRG','Prague'], HU:['BUD','Budapest'], RO:['OTP','Bucarest','Bucharest'], BG:['SOF','Sofia'], UA:['KBP','Kiev','Kyiv'], FI:['HEL','Helsinki'],
    LV:['RIX','Riga'], LT:['VNO','Vilnius'], EE:['TLL','Tallinn'], RS:['BEG','Belgrade'], HR:['ZAG','Zagreb'], SI:['LJU','Ljubljana'],
    SK:['BTS','Bratislava'], MT:['MLA','Malte','Malta'], CY:['LCA','Larnaca'], IS:['KEF','Reykjavik'], BA:['SJJ','Sarajevo'], AL:['TIA','Tirana'],
    MK:['SKP','Skopje'], MD:['KIV','Chisinau'], BY:['MSQ','Minsk'], AD:['BCN','Barcelone','Barcelona'],
    IL:['TLV','Tel-Aviv','Tel Aviv'], PS:['AMM','Amman'], IR:['IKA','Téhéran','Tehran'], IQ:['BGW','Bagdad','Baghdad'], SY:['DAM','Damas','Damascus'],
    YE:['ADE','Aden'], PK:['KHI','Karachi'], BD:['DAC','Dacca','Dhaka'], NP:['KTM','Katmandou','Kathmandu'], LK:['CMB','Colombo'], TH:['BKK','Bangkok'],
    ID:['CGK','Jakarta'], PH:['MNL','Manille','Manila'], VN:['SGN','Hô-Chi-Minh-Ville','Ho Chi Minh City'], KR:['ICN','Séoul','Seoul'], TW:['TPE','Taipei'],
    UZ:['TAS','Tachkent','Tashkent'], KZ:['ALA','Almaty'], AZ:['GYD','Bakou','Baku'], GE:['TBS','Tbilissi','Tbilisi'], AM:['EVN','Erevan','Yerevan'],
    AF:['KBL','Kaboul','Kabul'], MV:['MLE','Malé','Male'],
    AU:['SYD','Sydney'], NZ:['AKL','Auckland'], FJ:['NAN','Nadi'], PF:['PPT','Papeete'], NC:['NOU','Nouméa','Noumea'],
    AR:['EZE','Buenos Aires'], CL:['SCL','Santiago du Chili','Santiago'], PE:['LIM','Lima'], CO:['BOG','Bogota','Bogotá'], VE:['CCS','Caracas'],
    EC:['UIO','Quito'], BO:['VVI','Santa Cruz'], PY:['ASU','Asuncion','Asunción'], UY:['MVD','Montevideo'], CU:['HAV','La Havane','Havana'],
    DO:['SDQ','Saint-Domingue','Santo Domingo'], PA:['PTY','Panama','Panama City'], CR:['SJO','San José'], GT:['GUA','Guatemala','Guatemala City'],
    JM:['KIN','Kingston'], MQ:['FDF','Fort-de-France'], GP:['PTP','Pointe-à-Pitre'], GF:['CAY','Cayenne'], TT:['POS','Port-d\'Espagne','Port of Spain'],
    PR:['SJU','San Juan']
  };
  // Grandes villes d'Amérique du Nord selon le fuseau horaire
  const AMERIQUE = {
    'America/Toronto':['YYZ','Toronto'], 'America/Montreal':['YUL','Montréal','Montreal'], 'America/Vancouver':['YVR','Vancouver'],
    'America/Edmonton':['YEG','Edmonton'], 'America/Winnipeg':['YWG','Winnipeg'], 'America/Halifax':['YHZ','Halifax'],
    'America/New_York':['JFK','New York'], 'America/Chicago':['ORD','Chicago'], 'America/Denver':['DEN','Denver'],
    'America/Los_Angeles':['LAX','Los Angeles'], 'America/Phoenix':['PHX','Phoenix'], 'America/Detroit':['DTW','Detroit'],
    // Australie : la ville du fuseau horaire
    'Australia/Melbourne':['MEL','Melbourne'], 'Australia/Brisbane':['BNE','Brisbane'], 'Australia/Perth':['PER','Perth'],
    'Australia/Adelaide':['ADL','Adélaïde','Adelaide'], 'Australia/Darwin':['DRW','Darwin'], 'Australia/Hobart':['HBA','Hobart']
  };
  // Pays où l'application s'ouvre en français par défaut
  const FRANCOPHONES = new Set(['GN','SN','CI','ML','BF','NE','TG','BJ','CM','GA','CG','CD','CF','TD','GQ','MR','MA','DZ','TN','DJ','KM','MG',
    'BI','RW','HT','FR','BE','LU','CH','MC','RE','YT','GP','MQ','GF','PF','NC','SC']);
  // Afrique (pour choisir les destinations populaires)
  const AFRIQUE = new Set(['GN','SN','CI','ML','BF','NE','TG','BJ','GW','CM','GA','CG','CD','CF','TD','GQ','SL','LR','GM','MR','CV','MA','DZ',
    'TN','LY','EG','NG','GH','KE','ET','RW','ZA','UG','TZ','SD','AO','MZ','ZW','ZM','BI','DJ','MG','KM','MU','NA','BW','MW','ER','SO','SS','ST','SC',
    'RE','YT','LS','SZ']);

  // Indicatif téléphonique de chaque pays (pour écrire le numéro WhatsApp au format international)
  const INDICATIFS = {
    GN:'224', SN:'221', CI:'225', ML:'223', BF:'226', NE:'227', TG:'228', BJ:'229', GW:'245', CM:'237', GA:'241', CG:'242', CD:'243', CF:'236',
    TD:'235', GQ:'240', SL:'232', LR:'231', GM:'220', MR:'222', CV:'238', MA:'212', DZ:'213', TN:'216', LY:'218', EG:'20', NG:'234', GH:'233',
    KE:'254', ET:'251', RW:'250', ZA:'27', UG:'256', TZ:'255', SD:'249', AO:'244', MZ:'258', ZW:'263', ZM:'260', BI:'257', DJ:'253', MG:'261',
    KM:'269', MU:'230', NA:'264', BW:'267', MW:'265', ER:'291', SO:'252', SS:'211', ST:'239', SC:'248', RE:'262', YT:'262', LS:'266', SZ:'268',
    FR:'33', BE:'32', DE:'49', ES:'34', IT:'39', PT:'351', NL:'31', LU:'352', CH:'41', GB:'44', IE:'353', AT:'43', TR:'90', RU:'7', NO:'47',
    SE:'46', DK:'45', PL:'48', GR:'30', MC:'377', CZ:'420', HU:'36', RO:'40', BG:'359', UA:'380', FI:'358', LV:'371', LT:'370', EE:'372',
    RS:'381', HR:'385', SI:'386', SK:'421', MT:'356', CY:'357', IS:'354', BA:'387', AL:'355', MK:'389', MD:'373', BY:'375', AD:'376',
    AE:'971', SA:'966', QA:'974', KW:'965', BH:'973', OM:'968', LB:'961', JO:'962', IL:'972', PS:'970', IR:'98', IQ:'964', SY:'963', YE:'967',
    CN:'86', HK:'852', IN:'91', JP:'81', MY:'60', SG:'65', PK:'92', BD:'880', NP:'977', LK:'94', TH:'66', ID:'62', PH:'63', VN:'84', KR:'82',
    TW:'886', UZ:'998', KZ:'7', AZ:'994', GE:'995', AM:'374', AF:'93', MV:'960', AU:'61', NZ:'64', FJ:'679', PF:'689', NC:'687',
    US:'1', CA:'1', PR:'1', DO:'1', JM:'1', TT:'1', MX:'52', BR:'55', AR:'54', CL:'56', PE:'51', CO:'57', VE:'58', EC:'593', BO:'591', PY:'595',
    UY:'598', CU:'53', PA:'507', CR:'506', GT:'502', HT:'509', MQ:'596', GP:'590', GF:'594'
  };
  // Pays où le 0 du début fait partie du numéro (il reste après l'indicatif)
  const GARDE_ZERO = new Set(['CI', 'CG', 'IT', 'SM', 'VA']);
  const EXEMPLES = { GN:'+224 6__ __ __ __', FR:'+33 6 12 34 56 78', BE:'+32 470 12 34 56', GB:'+44 7700 900123', US:'+1 202 555 0123', CA:'+1 514 555 0123',
    SN:'+221 77 123 45 67', CI:'+225 07 12 34 56 78', ML:'+223 70 12 34 56', ES:'+34 612 34 56 78', IT:'+39 312 345 6789', DE:'+49 151 23456789' };

  // Autres aéroports fréquents (escales, deuxièmes aéroports) : code → [nom français, nom anglais]
  const AUTRES = {
    ORY:['Paris-Orly'], BVA:['Paris-Beauvais'], LGW:['Londres-Gatwick','London Gatwick'], STN:['Londres-Stansted','London Stansted'], MAN:['Manchester'],
    BCN:['Barcelone','Barcelona'], MXP:['Milan'], LIN:['Milan'], MRS:['Marseille'], LYS:['Lyon'], TLS:['Toulouse'], BOD:['Bordeaux'], ZRH:['Zurich'],
    MUC:['Munich'], CRL:['Bruxelles-Charleroi','Brussels Charleroi'], AUH:['Abou Dabi','Abu Dhabi'], DWC:['Dubaï','Dubai'], RUH:['Riyad','Riyadh'],
    MED:['Médine','Medina'], SAW:['Istanbul'], IAD:['Washington'], ATL:['Atlanta'], EWR:['Newark'], BOS:['Boston'], IAH:['Houston'],
    RAK:['Marrakech'], AGA:['Agadir'], TNG:['Tanger','Tangier'], ORN:['Oran'], DKR:['Dakar'], ABV:['Abuja'], KAN:['Kano'], KMS:['Kumasi'],
    BOY:['Bobo-Dioulasso'], NSI:['Yaoundé'], PNR:['Pointe-Noire'], JRO:['Kilimandjaro','Kilimanjaro'], ZNZ:['Zanzibar'], CPT:['Le Cap','Cape Town'],
    HRG:['Hurghada'], PEK:['Pékin','Beijing'], PVG:['Shanghai'], BKK:['Bangkok'], BOM:['Bombay','Mumbai'], LAS:['Las Vegas'], MIA:['Miami'],
  };

  let tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch(e){}
  function detecter(){
    if (FUSEAUX[tz]) return FUSEAUX[tz];
    if (tz.startsWith('America/')) return CANADA.includes(tz.split('/')[1]) ? 'CA' : 'US';
    const region = String((navigator.languages && navigator.languages[0]) || navigator.language || '').split('-')[1];
    const r = String(region || '').toUpperCase();
    return /^[A-Z]{2}$/.test(r) ? r : null;
  }
  const code = detecter();

  function aeroport(){
    const a = AMERIQUE[tz] || (code && AEROPORTS[code]);
    if (!a) return null;
    const en = window.L && window.L.code === 'en';
    return { code: a[0], ville: en && a[2] ? a[2] : a[1] };
  }

  // Nom de la ville d'un aéroport (dans la langue de l'application), ou le code s'il est inconnu.
  function ville(c){
    c = String(c || '').toUpperCase();
    let a = AUTRES[c] ? [c, ...AUTRES[c]] : null;
    if (!a) for (const k in AEROPORTS) if (AEROPORTS[k][0] === c) { a = AEROPORTS[k]; break; }
    if (!a) for (const k in AMERIQUE) if (AMERIQUE[k][0] === c) { a = AMERIQUE[k]; break; }
    if (!a) return c;
    return (window.L && window.L.code === 'en' && a[2]) || a[1];
  }

  // Recherche instantanée d'une ville connue (sans Internet) : « Abi » → Abidjan, « dak » → Dakar, « abj » → Abidjan.
  // Évite les confusions avec des aéroports lointains au code proche (ABI = Abilene, aux États-Unis).
  const sansAccent = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
  let INDEX = null;
  function index(){
    if (INDEX) return INDEX;
    INDEX = []; const vus = new Set();
    const ANCIENS = new Set(['DKR']);   // ancien aéroport de Dakar, fermé aux vols commerciaux (Dakar = DSS)
    const ajouter = (code, noms, pays) => { if (vus.has(code) || ANCIENS.has(code)) return; vus.add(code); INDEX.push({ code, noms: noms.filter(Boolean), pays }); };
    for (const k in AEROPORTS) ajouter(AEROPORTS[k][0], AEROPORTS[k].slice(1), k);
    for (const k in AMERIQUE) ajouter(AMERIQUE[k][0], AMERIQUE[k].slice(1), FUSEAUX[k] || (CANADA.includes(k.split('/')[1]) ? 'CA' : 'US'));
    for (const c in AUTRES) ajouter(c, AUTRES[c], null);
    return INDEX;
  }
  let nomsPays = null;
  try { nomsPays = new Intl.DisplayNames([window.L && window.L.code === 'en' ? 'en' : 'fr'], { type: 'region' }); } catch (e) {}
  function chercher(q, max = 6){
    const t = sansAccent(q); if (t.length < 2) return [];
    const code = t.replace(/ /g, '').toUpperCase();
    const res = [];
    index().forEach((a, rang) => {
      let s = 9;
      for (const n of a.noms.map(sansAccent)) {
        if (n.startsWith(t)) s = Math.min(s, 0);
        else if (n.split(' ').some(m => m.startsWith(t))) s = Math.min(s, 1);
      }
      if (code.length === 3 && a.code === code) s = Math.min(s, 2);
      if (s < 9) res.push({ s, rang, a });
    });
    res.sort((x, y) => x.s - y.s || x.rang - y.rang);
    return res.slice(0, max).map(({ a }) => ({ code: a.code, ville: ville(a.code), nom: '', pays: a.pays && nomsPays ? (nomsPays.of(a.pays) || '') : '', local: true }));
  }

  // Numéro WhatsApp au format international : « 06 12 34 56 78 » en France → « +33612345678 ».
  // Un numéro qui commence par + ou 00 est gardé tel quel (le 0 en trop après l'indicatif est enlevé).
  function telInternational(v){
    let t = String(v || '').replace(/[\s.()\-\/]/g, '');
    if (!t) return '';
    if (t.startsWith('00')) t = '+' + t.slice(2);
    const ind = code && INDICATIFS[code];
    if (t.startsWith('+')) {
      if (ind && !GARDE_ZERO.has(code) && t.startsWith('+' + ind + '0')) t = '+' + ind + t.slice(ind.length + 2);
      return t;
    }
    if (/^6\d{8}$/.test(t) && (!code || code === 'GN')) return '+224' + t;   // numéro guinéen sans indicatif
    if (!ind || !/^\d{6,14}$/.test(t)) return t;                               // le serveur demandera l'indicatif
    if (!GARDE_ZERO.has(code)) t = t.replace(/^0+/, '');
    return '+' + ind + t;
  }
  const exempleTel = () => EXEMPLES[code] || (code && INDICATIFS[code] ? `+${INDICATIFS[code]} …` : '+ …');

  window.Pays = {
    code,
    indicatif: () => (code && INDICATIFS[code]) || null,
    telInternational,
    exempleTel,
    ville,
    chercher,
    sansAccent,
    fuseau: tz,
    aeroport,
    francophone: !!code && FRANCOPHONES.has(code),
    afrique: !!code && AFRIQUE.has(code),
  };
})();
