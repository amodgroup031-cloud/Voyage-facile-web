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
    'Asia/Kuala_Lumpur':'MY','Asia/Singapore':'SG','America/Port-au-Prince':'HT','America/Sao_Paulo':'BR','America/Mexico_City':'MX'
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
    BR:['GRU','São Paulo'], MX:['MEX','Mexico','Mexico City'], CA:['YUL','Montréal','Montreal'], US:['JFK','New York']
  };
  // Grandes villes d'Amérique du Nord selon le fuseau horaire
  const AMERIQUE = {
    'America/Toronto':['YYZ','Toronto'], 'America/Montreal':['YUL','Montréal','Montreal'], 'America/Vancouver':['YVR','Vancouver'],
    'America/Edmonton':['YEG','Edmonton'], 'America/Winnipeg':['YWG','Winnipeg'], 'America/Halifax':['YHZ','Halifax'],
    'America/New_York':['JFK','New York'], 'America/Chicago':['ORD','Chicago'], 'America/Denver':['DEN','Denver'],
    'America/Los_Angeles':['LAX','Los Angeles'], 'America/Phoenix':['PHX','Phoenix'], 'America/Detroit':['DTW','Detroit']
  };
  // Pays où l'application s'ouvre en français par défaut
  const FRANCOPHONES = new Set(['GN','SN','CI','ML','BF','NE','TG','BJ','CM','GA','CG','CD','CF','TD','GQ','MR','MA','DZ','TN','DJ','KM','MG',
    'BI','RW','HT','FR','BE','LU','CH','MC']);
  // Afrique (pour choisir les destinations populaires)
  const AFRIQUE = new Set(['GN','SN','CI','ML','BF','NE','TG','BJ','GW','CM','GA','CG','CD','CF','TD','GQ','SL','LR','GM','MR','CV','MA','DZ',
    'TN','LY','EG','NG','GH','KE','ET','RW','ZA','UG','TZ','SD','AO','MZ','ZW','ZM','BI','DJ','MG','KM','MU']);

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

  window.Pays = {
    code,
    ville,
    fuseau: tz,
    aeroport,
    francophone: !!code && FRANCOPHONES.has(code),
    afrique: !!code && AFRIQUE.has(code),
  };
})();
