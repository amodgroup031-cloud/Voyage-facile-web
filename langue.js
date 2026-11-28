/* =====================================================================
   VOYAGE FACILE — langue de l'application (français / anglais)
   - Français par défaut dans les pays francophones ; ailleurs, la langue
     du téléphone décide (français si le téléphone est en français,
     sinon anglais). Le client change à tout moment (bouton FR / EN).
   - Les textes sont écrits en français dans le code ; en anglais, ils
     sont remplacés à l'affichage grâce au dictionnaire ci-dessous.
   - L'espace agence reste en français.
   Commun à l'application et au site.
   ===================================================================== */
(function(){
  const EN = {
    // ---------- Général / en-tête / onglets ----------
    'Voyage Facile':'Voyage Facile', 'Retour':'Return', 'PARTEZ SANS SOUCI':'TRAVEL WORRY-FREE', 'Aide et contact':'Help & contact',
    'Aide et contact et questions fréquentes':'Help, contact and FAQ', 'Accueil':'Home', 'Vols':'Flights', 'Services':'Services', 'Assistant':'Assistant',
    'Mes voyages':'My trips', 'Aide':'Help', 'Aide et contact ':'Help & contact', 'Changer de langue':'Change language',
    // ---------- Accueil ----------
    "Réservez votre billet d'avion depuis votre téléphone, sans vous déplacer.":'Book your plane ticket from your phone, without going anywhere.',
    'Réserver un vol':'Book a flight', 'Assistant 24h/24':'24/7 assistant', "Billets d'avion":'Plane tickets', 'Destinations populaires':'Popular destinations',
    'Nos services':'Our services', 'Comment ça marche ?':'How does it work?', 'Cherchez votre vol':'Search for your flight',
    'Vrais vols du jour, prix total dans votre monnaie.':"Today's real flights, total price in your currency.",
    'Choisissez et confirmez':'Choose and confirm', 'Noms des passagers et votre numéro WhatsApp.':'Passenger names and your WhatsApp number.',
    'Un conseiller vous répond':'An advisor gets back to you',
    'Il confirme le prix sur WhatsApp, vous payez, vous recevez votre billet.':'They confirm the price on WhatsApp, you pay, you receive your ticket.',
    'Vous payez seulement après la confirmation du conseiller':'You only pay after the advisor confirms',
    'Paiement par Orange Money ou en agence':'Pay by Orange Money or at the agency', 'Nous ne demandons jamais votre code secret':'We never ask for your PIN',
    "Besoin d'aide ?":'Need help?', 'Un conseiller vous répond sur WhatsApp.':'An advisor answers you on WhatsApp.',
    'Aide, contact et questions fréquentes':'Help, contact and FAQ', 'Espace agence':'Agency area',
    "Administration — réservé à l'agence VOYAGE FACILE":'Administration — VOYAGE FACILE agency only', 'Votre dernière demande':'Your latest request',
    'Vers les grandes villes':'To major cities', 'Partout dans le monde':'All over the world',
    // ---------- Recherche de vols ----------
    'Où partez-vous ?':'Where are you going?', 'Vrais vols du jour, prix en GNF.':"Today's real flights.",
    "Demander à l'assistant":'Ask the assistant', 'Type de voyage':'Trip type', 'Aller-retour':'Round trip', 'Aller simple':'One way',
    'Départ':'From', 'Inverser départ et destination':'Swap departure and destination', '⇅ Inverser':'⇅ Swap', 'Destination':'Destination',
    'Ville ou aéroport (ex. Paris)':'City or airport (e.g. Paris)', 'Ville ou aéroport':'City or airport', 'Départ le':'Departure date', 'Retour le':'Return date',
    'Adultes':'Adults', 'Enfants 2-11 ans':'Children 2-11', 'Classe':'Class', 'Économique':'Economy', 'Éco premium':'Premium economy',
    'Affaires':'Business', 'Première':'First', 'Je préfère les vols directs (sans escale)':'I prefer direct flights (no stops)',
    'Rechercher les vols':'Search flights', 'Recherche des meilleurs vols…':'Finding the best flights…', 'Aucun aéroport trouvé':'No airport found',
    'Moins cher':'Cheapest', 'Plus rapide':'Fastest', 'Départ tôt':'Earliest', 'Direct uniquement':'Direct only', 'Bagage en soute':'Checked bag',
    'Compagnie':'Airline', 'Compagnie (facultatif)':'Airline (optional)', 'Toutes les compagnies':'All airlines', 'Toutes':'All', 'vols':'flights', 'dès':'from',
    'Compagnies africaines':'African airlines', 'Europe':'Europe', 'Moyen-Orient et Turquie':'Middle East and Turkey', 'Amériques':'Americas', 'Le moins cher':'Cheapest', 'Le plus rapide':'Fastest', 'Direct':'Direct', 'direct':'direct', 'total':'total',
    'Choisir ce vol':'Choose this flight', 'Détails':'Details', 'Détails du vol':'Flight details', 'Fermer':'Close', 'Retour aux vols':'Back to flights',
    'Vol {v}':'Flight {v}', 'opéré par {c}':'operated by {c}', 'Escale à {v}':'Layover in {v}', 'Longue escale':'Long layover', 'Escale de nuit':'Overnight layover',
    "Changement d'aéroport : arrivée à l'aéroport {a}, départ de l'aéroport {b}. Prévoyez le trajet entre les deux.":'Airport change: you arrive at {a} and leave from {b}. Allow time to travel between them.',
    'Escale(s) : {e}':'Stop(s): {e}', '1 escale':'1 stop', '{n} escales':'{n} stops', 'Arrivée {a} · Départ {b}':'Arrives {a} · Departs {b}', "d'attente":'wait',
    'À confirmer':'To be confirmed', '1 passager':'1 passenger', '{n} passagers':'{n} passengers', 'Durée':'Duration', 'Escales':'Stops', 'Bagages':'Baggage',
    'Prix total':'Total price', 'pour 1 passager':'for 1 passenger', 'pour {n} passagers':'for {n} passengers',
    'Bagages : votre conseiller vous confirme la franchise de la compagnie.':'Baggage: your advisor will confirm the airline allowance.',
    "Bagage en soute non compris dans ce prix : la compagnie le fait payer en plus. Demandez le tarif à votre conseiller.":'Checked bag not included in this price: the airline charges extra for it. Ask your advisor for the fee.',
    "Escale : vérifiez si un visa de transit est demandé pour le pays de l'escale.":'Layover: check whether a transit visa is required for the layover country.',
    'Prix indicatif : votre conseiller confirme le prix et les places avec la compagnie avant tout paiement.':'Estimated price: your advisor confirms the price and seats with the airline before any payment.', 'Aucun vol avec ces critères.':'No flights match these filters.', 'Voir tous les vols':'See all flights',
    'Aucun vol trouvé.':'No flights found.', 'Demander à un conseiller':'Ask an advisor', 'Aller':'Outbound',
    'Prix en':'Prices in', 'Changer':'Change',
    '{n} vols sur {t}':'{n} flights of {t}', '{n} vol sur {t}':'{n} flight of {t}',
    'Prix total pour 1 passager':'Total price for 1 passenger', 'Prix total pour {n} passagers':'Total price for {n} passengers',
    'Prix confirmé par votre conseiller avant paiement.':'Price confirmed by your advisor before payment.',
    'Toutes les compagnies ({n})':'All airlines ({n})', '{n} escale(s)':'{n} stop(s)', '{n} bagage cabine':'{n} cabin bag', '{n} en soute':'{n} checked',
    'pas de bagage en soute':'no checked bag', 'Merci de compléter : {liste}.':'Please complete: {liste}.',
    "la ville de départ (vérifiez l'orthographe)":'the departure city (check the spelling)', "la destination (vérifiez l'orthographe)":'the destination (check the spelling)',
    'la date de départ':'the departure date', 'la date de retour':'the return date',
    'Bonjour VOYAGE FACILE, je cherche un vol {o} → {d} le {j}.':'Hello VOYAGE FACILE, I am looking for a flight {o} → {d} on {j}.',
    // ---------- Passagers ----------
    'Vos informations':'Your details', 'Noms exactement comme sur le passeport.':'Names exactly as on the passport.',
    'Votre numéro WhatsApp':'Your WhatsApp number', 'E-mail (facultatif)':'Email (optional)', "Message pour l'agence (facultatif)":'Message for the agency (optional)',
    'Bagages, siège, besoin particulier…':'Baggage, seat, special needs…',
    'Je confirme ma demande. Un conseiller vérifie le prix avec la compagnie et me contacte sur WhatsApp avant tout paiement.':
      'I confirm my request. An advisor checks the price with the airline and contacts me on WhatsApp before any payment.',
    'Envoyer ma demande':'Send my request', 'Envoi…':'Sending…', 'Passager {n}':'Passenger {n}', 'Passager {n} (enfant)':'Passenger {n} (child)',
    'Civilité':'Title', 'Garçon':'Boy', 'Fille':'Girl', 'Monsieur':'Mr', 'Madame':'Mrs', 'Mademoiselle':'Miss', 'Prénom(s)':'First name(s)', 'Nom':'Last name',
    'Date de naissance':'Date of birth', 'Jour':'Day', 'Mois':'Month', 'Année':'Year',
    'janvier':'January', 'février':'February', 'mars':'March', 'avril':'April', 'mai':'May', 'juin':'June', 'juillet':'July', 'août':'August',
    'septembre':'September', 'octobre':'October', 'novembre':'November', 'décembre':'December',
    'Total : {p}':'Total: {p}', '({n} passager(s))':'({n} passenger(s))',
    'Passager {n} : indiquez le prénom et le nom.':'Passenger {n}: enter the first and last name.',
    'Passager {n} : choisissez Garçon ou Fille.':'Passenger {n}: choose Boy or Girl.',
    'Passager {n} : choisissez Monsieur, Madame ou Mademoiselle.':'Passenger {n}: choose Mr, Mrs or Miss.',
    'Passager {n} : date de naissance incomplète ou impossible (jour, mois et année).':'Passenger {n}: date of birth incomplete or impossible (day, month and year).',
    'Passager {n} : la date de naissance est nécessaire pour émettre le billet.':'Passenger {n}: the date of birth is needed to issue the ticket.',
    'Indiquez votre numéro WhatsApp.':'Enter your WhatsApp number.', 'Cochez la case pour confirmer votre demande.':'Tick the box to confirm your request.',
    'Demande envoyée !':'Request sent!', 'Référence :':'Reference:',
    "Un conseiller vérifie le prix et les places avec la compagnie, puis vous écrit sur WhatsApp. Suivez l'avancement dans":
      'An advisor checks the price and seats with the airline, then messages you on WhatsApp. Follow the progress in',
    'Ne payez rien avant la confirmation de votre conseiller. Nous ne vous demanderons jamais votre code secret Orange Money.':
      'Do not pay anything before your advisor confirms. We will never ask for your Orange Money PIN.',
    'Voir mes voyages':'See my trips', "Écrire à l'agence sur WhatsApp":'Message the agency on WhatsApp', 'Nouvelle recherche':'New search',
    "Bonjour VOYAGE FACILE, je viens d'envoyer la demande {r} ({t}, {p}).":'Hello VOYAGE FACILE, I have just sent request {r} ({t}, {p}).',
    // ---------- Mes voyages ----------
    'Actualiser':'Refresh', 'Suivez vos demandes en temps réel.':'Track your requests in real time.', 'Mise à jour…':'Updating…',
    'Reçue':'Received', 'En vérification':'Being checked', 'Prix confirmé':'Price confirmed', 'Billet envoyé':'Ticket sent', 'Annulée':'Cancelled',
    'Votre conseiller vérifie le prix et les places avec la compagnie.':'Your advisor is checking the price and seats with the airline.',
    'Votre conseiller est en train de vérifier avec la compagnie.':'Your advisor is checking with the airline.',
    'Le prix est confirmé. Payez avec Orange Money ci-dessous, ou en agence.':'The price is confirmed. Pay with Orange Money below, or at the agency.',
    'Votre billet vous a été envoyé sur WhatsApp. Bon voyage !':'Your ticket has been sent to you on WhatsApp. Have a good trip!',
    'Cette demande a été annulée. Écrivez-nous pour une nouvelle recherche.':'This request was cancelled. Message us for a new search.',
    "Aucun voyage pour l'instant.":'No trips yet.', 'Chercher un vol':'Search for a flight', 'Réf. {r}':'Ref. {r}', 'Prix indicatif':'Estimated price',
    'Référence billet':'Ticket reference', 'Votre billet est prêt : téléchargez-le ci-dessous. Bon voyage !':'Your ticket is ready: download it below. Have a good trip!', 'Télécharger mon billet':'Download my ticket', 'Ouverture de votre billet…':'Opening your ticket…',
    "Le billet n'est pas encore disponible. Votre conseiller vous prévient sur WhatsApp dès qu'il est prêt.":'The ticket is not available yet. Your advisor will let you know on WhatsApp as soon as it is ready.', "Écrire à l'agence":'Message the agency', 'Bonjour VOYAGE FACILE, au sujet de ma demande {r} :':'Hello VOYAGE FACILE, about my request {r}:',
    // Rappels de voyage
    "Départ aujourd'hui":'Departure today', 'Départ demain':'Departure tomorrow', 'Départ dans {n} jours':'Departure in {n} days',
    'Préparation {a}/{b}':'Checklist {a}/{b}', 'Bon voyage !':'Have a good trip!',
    'Passeport valable au moins 6 mois après la date de retour':'Passport valid for at least 6 months after the return date',
    "Visa ou autorisation d'entrée vérifiés (si nécessaire)":'Visa or entry permit checked (if needed)',
    'Carnet de vaccination (fièvre jaune) dans le bagage à main':'Vaccination card (yellow fever) in your hand luggage',
    'Billet et référence enregistrés sur le téléphone':'Ticket and reference saved on your phone',
    'Bagages pesés selon la franchise de la compagnie':"Bags weighed against the airline's allowance",
    "Arriver à l'aéroport 3 heures avant le départ":'Arrive at the airport 3 hours before departure',
    'Départ dans {n} jours : préparez votre voyage':'Departure in {n} days: get your trip ready',
    // Faire payer un proche
    'Faire payer un proche':'Ask someone to pay', 'Lien de paiement prêt : choisissez la personne sur WhatsApp.':'Payment link ready: choose the person on WhatsApp.',
    "Bonjour, peux-tu m'aider à payer mon billet d'avion VOYAGE FACILE ({t}) ? Tu vois le montant et tu paies en toute sécurité ici : {u}":
      'Hello, can you help me pay for my VOYAGE FACILE plane ticket ({t})? You can see the amount and pay safely here: {u}',
    "Envoyez un lien à un parent ou un ami : il voit le montant et paie à votre place. Il ne voit ni votre numéro ni votre billet.":
      'Send a link to a relative or friend: they see the amount and pay for you. They cannot see your number or your ticket.',
    // ---------- Services ----------
    'Hôtel':'Hotel', 'Toutes les villes, tous budgets':'All cities, all budgets', 'Ville':'City', "Date d'arrivée":'Arrival date', 'Personnes':'People',
    'Budget par nuit (GNF)':'Budget per night', 'Visa':'Visa', 'Dossier, rendez-vous, suivi':'Application, appointment, follow-up', 'Pays du visa':'Visa country',
    'Type (tourisme, affaires, études…)':'Type (tourism, business, studies…)', 'Date de voyage prévue':'Planned travel date', 'Nombre de personnes':'Number of people',
    'Hajj & Omra':'Hajj & Umrah', 'Formules complètes':'Complete packages', 'Formule (Omra, Omra Ramadan, Hajj)':'Package (Umrah, Ramadan Umrah, Hajj)',
    'Période souhaitée':'Preferred period', 'Nombre de pèlerins':'Number of pilgrims', 'Confort (standard, confort, VIP)':'Comfort (standard, comfort, VIP)',
    'Assurance voyage':'Travel insurance', 'Santé et rapatriement':'Health and repatriation', 'Date de départ':'Departure date', 'Date de retour':'Return date',
    'Nombre de voyageurs':'Number of travellers', 'Votre nom':'Your name', 'Précisions (facultatif)':'Details (optional)', 'Envoyer sur WhatsApp':'Send on WhatsApp',
    'Remplissez au moins une information.':'Fill in at least one field.', 'Bonjour VOYAGE FACILE, demande : {s}':'Hello VOYAGE FACILE, request: {s}', 'Nom : {n}':'Name: {n}',
    // ---------- Aide ----------
    'Nous sommes là pour vous.':'We are here for you.', "Appeler l'agence":'Call the agency', 'E-mail':'Email', 'Monnaie des prix':'Price currency',
    'Afficher les prix en':'Show prices in', 'Langue':'Language',
    'Choisie automatiquement selon votre pays. Les prix sont convertis depuis le franc guinéen (GNF) ; votre conseiller confirme le montant exact avant paiement.':
      'Chosen automatically from your country. Prices are converted from the Guinean franc (GNF); your advisor confirms the exact amount before payment.',
    'Questions fréquentes':'Frequently asked questions', 'Le prix affiché est-il définitif ?':'Is the displayed price final?',
    "C'est le prix total trouvé au moment de votre recherche. Votre conseiller le confirme avec la compagnie avant tout paiement.":
      'It is the total price found at the time of your search. Your advisor confirms it with the airline before any payment.',
    'Comment je paie ?':'How do I pay?',
    'Par Orange Money ou en agence, selon les instructions de votre conseiller. Ne communiquez jamais votre code secret.':
      "By Orange Money or at the agency, following your advisor's instructions. Never share your PIN.",
    'Comment je reçois mon billet ?':'How do I receive my ticket?',
    "Par WhatsApp, et par e-mail si vous l'avez indiqué. Sa référence s'affiche aussi dans « Mes voyages ».":'By WhatsApp, and by email if you gave one. Its reference also shows in “My trips”.',
    'Puis-je changer la date de mon billet ?':'Can I change the date of my ticket?',
    'Oui, selon les règles de la compagnie. Écrivez-nous sur WhatsApp avec votre référence : nous vous donnons le prix du changement.':
      "Yes, according to the airline's rules. Message us on WhatsApp with your reference: we will give you the price of the change.",
    'Quelqu\'un d\'autre peut-il payer pour moi ?':'Can someone else pay for me?',
    "Oui. Dans « Mes voyages », touchez « Faire payer un proche » et envoyez le lien sur WhatsApp. La personne voit le montant et paie, sans voir votre numéro ni votre billet.":
      'Yes. In “My trips”, tap “Ask someone to pay” and send the link on WhatsApp. The person sees the amount and pays, without seeing your number or your ticket.',
    "Réservé à l'équipe VOYAGE FACILE":'VOYAGE FACILE team only', 'Crédits photos et taux de change':'Photo credits and exchange rates', 'Taux de change :':'Exchange rates:',
    'Voyage Facile · version':'Voyage Facile · version', ' · mise à jour {v}':' · update {v}', 'Prix affichés en {d}':'Prices shown in {d}',
    'Photos réelles prises par des photographes et publiées sous licence libre sur Wikimedia Commons.':'Real photos taken by photographers and published under a free licence on Wikimedia Commons.',
    'Icônes : Lucide (licence ISC).':'Icons: Lucide (ISC licence).', 'Bannière':'Banner', 'Assurance':'Insurance',
    'Destination : {v}. Choisissez vos dates.':'Destination: {v}. Choose your dates.',
    'Bonjour':'Good morning', 'Bon après-midi':'Good afternoon', 'Bonsoir':'Good evening',
    "{m} ! Réservez votre billet d'avion depuis votre téléphone, sans vous déplacer.":'{m}! Book your plane ticket from your phone, without going anywhere.',
    'Bonjour VOYAGE FACILE, ':'Hello VOYAGE FACILE, ',
    // Pays (destinations)
    'France':'France', 'Sénégal':'Senegal', "Côte d'Ivoire":'Ivory Coast', 'Maroc':'Morocco', 'Turquie':'Turkey', 'Émirats arabes unis':'United Arab Emirates',
    'Arabie saoudite':'Saudi Arabia', 'Belgique':'Belgium', 'Guinée':'Guinea', 'Mali':'Mali', 'Nigeria':'Nigeria', 'Ghana':'Ghana', 'Royaume-Uni':'United Kingdom',
    'États-Unis':'United States', 'Canada':'Canada', 'Chine':'China', 'Sierra Leone':'Sierra Leone', 'Kenya':'Kenya', 'Éthiopie':'Ethiopia', 'Afrique du Sud':'South Africa',
    'Vols depuis {v}':'Flights from {v}',
    // ---------- Erreurs réseau ----------
    'Pas de connexion Internet. Vérifiez votre réseau puis réessayez.':'No Internet connection. Check your network and try again.',
    'Le service ne répond pas. Réessayez ou écrivez-nous sur WhatsApp.':'The service is not responding. Try again or message us on WhatsApp.',
    'Pas de connexion Internet. Vérifiez votre réseau.':'No Internet connection. Check your network.',
    // ---------- Paiement Orange Money ----------
    'Paiement reçu':'Payment received', ' en agence':' at the agency', ' · réf. {r}':' · ref. {r}', 'Merci, bon voyage !':'Thank you, have a good trip!',
    'Votre billet est en préparation.':'Your ticket is being prepared.', 'Paiement déclaré':'Payment reported', '(réf. {r}).':'(ref. {r}).',
    "L'agence vérifie la réception sur son compte Orange Money. Vous serez prévenu sur WhatsApp.":'The agency is checking receipt on its Orange Money account. You will be notified on WhatsApp.',
    'Payer avec Orange Money':'Pay with Orange Money',
    "La référence envoyée n'a pas été retrouvée par l'agence. Vérifiez le SMS d'Orange Money et renvoyez-la, ou écrivez-nous.":
      'The agency could not find the reference you sent. Check the Orange Money SMS and send it again, or message us.',
    "⏳ Paiement Orange Money en cours. Si vous l'avez validé, touchez « Actualiser ».":'⏳ Orange Money payment in progress. If you have confirmed it, tap “Refresh”.',
    'Montant à payer':'Amount to pay', 'Reprendre le paiement Orange Money':'Resume Orange Money payment',
    "Page sécurisée d'Orange Money : vous validez avec votre code secret sur votre téléphone.":'Secure Orange Money page: you confirm with your PIN on your phone.',
    'Composez {a} (paiement marchand), entrez le code marchand {c} et le montant {m}.':'Dial {a} (merchant payment), enter merchant code {c} and the amount {m}.',
    "Composez {a}, choisissez « Transfert d'argent » et envoyez {m} au {n}{t}.":'Dial {a}, choose “Money transfer” and send {m} to {n}{t}.',
    'Ou payer avec le code *144#':'Or pay with the *144# code', 'Comment payer':'How to pay', 'Ouvrir {c} sur le téléphone':'Open {c} on the phone',
    'Validez avec {v} code secret. Ne le donnez à personne, même pas à l\'agence.':'Confirm with {v} PIN. Never give it to anyone, not even the agency.',
    'votre':'your', "Recopiez ici la référence de transaction reçue par SMS d'Orange Money :":'Copy here the transaction reference from the Orange Money SMS:',
    'Référence du SMS Orange Money':'Orange Money SMS reference', 'Numéro qui a payé (si différent du vôtre)':'Number that paid (if different from yours)',
    'Votre numéro Orange Money (celui qui a payé)':'Your Orange Money number (the one that paid)',
    "J'ai payé : envoyer la référence":'I have paid: send the reference',
    'Montant élevé ? Vous pouvez payer en plusieurs fois : mettez toutes les références, séparées par un espace.':'Large amount? You can pay in several parts: enter all the references, separated by a space.',
    'Votre conseiller vous indique comment payer sur WhatsApp (Orange Money ou en agence).':'Your advisor tells you how to pay on WhatsApp (Orange Money or at the agency).',
    'Vous pouvez aussi payer directement en agence.':'You can also pay directly at the agency.', 'Un instant…':'One moment…',
    "Ouverture d'Orange Money…":'Opening Orange Money…', "Recopiez la référence reçue par SMS d'Orange Money.":'Copy the reference from the Orange Money SMS.',
    "Indiquez votre numéro Orange Money (celui qui a payé).":'Enter your Orange Money number (the one that paid).',
    "Merci ! L'agence vérifie votre paiement.":'Thank you! The agency is checking your payment.', 'Une erreur est survenue. Réessayez.':'Something went wrong. Try again.',
    // ---------- Mise à jour ----------
    'Continuer':'Continue', 'Mise à jour disponible':'Update available', "Installation en cours, gardez l'application ouverte.":'Installing, please keep the app open.',
    'Application mise à jour':'App updated',
    // Page de paiement simple (lien personnel du client)
    "Chargement…":"Loading…",
    "Besoin d'aide ? Écrivez-nous sur WhatsApp":"Need help? Message us on WhatsApp",
    "Bonjour VOYAGE FACILE, j'ai besoin d'aide pour payer mon billet.":"Hello VOYAGE FACILE, I need help paying for my ticket.",
    "Votre voyage":"Your trip",
    "Votre voyage aller-retour":"Your round trip",
    "Référence":"Reference",
    "Copier":"Copy",
    "Copié ✓":"Copied ✓",
    "Envoyez le montant par Orange Money":"Send the amount with Orange Money",
    "Code marchand":"Merchant code",
    "Numéro":"Number",
    "Montant":"Amount",
    "Ouvrir Orange Money":"Open Orange Money",
    "Validez avec votre code secret. Ne le donnez à personne, même pas à l'agence.":"Confirm with your PIN. Never share it with anyone, not even the agency.",
    "Après le paiement":"After paying",
    "Orange Money vous envoie un SMS avec une référence de transaction.":"Orange Money sends you an SMS with a transaction reference.",
    "J'ai payé":"I have paid",
    "Collez la référence reçue par SMS":"Paste the reference from the SMS",
    "Payé depuis un autre numéro ?":"Paid from another number?",
    "Numéro Orange Money qui a payé":"Orange Money number that paid",
    "Envoyer la référence":"Send the reference",
    "Cette demande est annulée.":"This request has been cancelled.",
    "Pour toute question, écrivez-nous sur WhatsApp.":"For any question, message us on WhatsApp.",
    "Paiement reçu, merci !":"Payment received, thank you!",
    "Votre billet est prêt.":"Your ticket is ready.",
    "Votre billet arrive très bientôt sur WhatsApp.":"Your ticket is coming very soon on WhatsApp.",
    "Paiement envoyé":"Payment sent",
    "L'agence vérifie la réception et vous prévient sur WhatsApp.":"The agency is checking receipt and will let you know on WhatsApp.",
    "Prix en cours de vérification":"Price being checked",
    "Votre conseiller vérifie le prix et les places avec la compagnie. Vous recevrez le lien de paiement sur WhatsApp.":"Your advisor is checking the price and seats with the airline. You will receive the payment link on WhatsApp.",
    "Référence non retrouvée":"Reference not found",
    "Vérifiez le SMS d'Orange Money et renvoyez la bonne référence.":"Check the Orange Money SMS and send the correct reference again.",
    "Paiement Orange Money en cours":"Orange Money payment in progress",
    "Si vous avez validé le paiement, touchez « Actualiser ».":"If you have confirmed the payment, tap “Refresh”.",
    "Page sécurisée d'Orange Money : vous validez avec votre code secret.":"Secure Orange Money page: you confirm with your PIN.",
    "Votre conseiller vous envoie les instructions de paiement sur WhatsApp.":"Your advisor will send you the payment instructions on WhatsApp.",
    "Bonjour VOYAGE FACILE, je souhaite payer ma demande {r}.":"Hello VOYAGE FACILE, I would like to pay for my request {r}.",
    "Écrire à VOYAGE FACILE":"Message VOYAGE FACILE",
    "Lien de paiement":"Payment link",
    "Bonjour VOYAGE FACILE, mon lien de paiement ne s'ouvre pas.":"Hello VOYAGE FACILE, my payment link won't open.",
    "Lien de paiement invalide ou incomplet. Écrivez-nous sur WhatsApp : nous vous renvoyons le bon lien.":"Invalid or incomplete payment link. Message us on WhatsApp and we will send you the right link.",
    "Collez la référence reçue par SMS.":"Paste the reference from the SMS.",
    "Nous vérifions votre paiement":"We are checking your payment",
    "Cela peut prendre quelques secondes.":"This may take a few seconds.",
    "Paiement annulé":"Payment cancelled",
    "Vous pouvez réessayer ci-dessous.":"You can try again below.",
    // Recherche : attente et secours
    'Nous comparons les compagnies…':'Comparing airlines…',
    "Encore un instant, nous vérifions d'autres compagnies…":'One moment, checking more airlines…',
    "La recherche prend un peu plus de temps que d'habitude, nous continuons…":'The search is taking a little longer than usual, still working…',
    'Dates trop lointaines':'Dates too far ahead', "La recherche n'a pas abouti":"The search didn't go through", 'Relancer la recherche':'Search again',
    'Demander ce vol à un conseiller':'Ask an advisor for this flight', 'Votre conseiller cherche le vol pour vous et vous répond sur WhatsApp.':'Your advisor looks for the flight and replies on WhatsApp.',
    "Bonjour VOYAGE FACILE, je cherche un vol {o} → {d}, départ le {j}{r}, {n}, classe {c}. Pouvez-vous m'aider ?":'Hello VOYAGE FACILE, I am looking for a flight {o} → {d}, leaving on {j}{r}, {n}, {c} class. Can you help me?',
    ', retour le {d}':', returning on {d}',
    'Téléchargement…':'Downloading…', 'Téléchargement… {p} %':'Downloading… {p}%', 'Installation…':'Installing…', 'Mise à jour reportée':'Update postponed',
    "Le téléchargement n'a pas abouti (connexion faible ?). Nous réessaierons automatiquement.":'The download did not finish (weak connection?). We will try again automatically.',
    'Nouvelle version à installer':'New version to install', 'Télécharger la nouvelle version':'Download the new version', 'Plus tard':'Later',
    "Cette mise à jour demande d'installer la nouvelle application ({v}). Vos voyages restent enregistrés.":'This update requires installing the new app ({v}). Your trips stay saved.',
    // ---------- Assistant ----------
    'Assistant VOYAGE FACILE':'VOYAGE FACILE assistant', '● Disponible 24 h/24':'● Available 24/7', 'Nouvelle discussion':'New chat', 'Votre message':'Your message',
    'Écrivez votre message…':'Type your message…', 'Envoyer':'Send', 'Je veux un billet {o} – {d}':'I want a ticket {o} – {d}',
    'Un vol direct pour {d} la semaine prochaine':'A direct flight to {d} next week', 'Où en est ma demande ?':'Where is my request?',
    'Je cherche un hôtel à {v}':"I'm looking for a hotel in {v}",
    "Bonjour et bienvenue chez **VOYAGE FACILE**.\nJe trouve votre vol au meilleur prix, je prépare votre réservation et je vous donne l'avancement de vos demandes, à toute heure.\nOù souhaitez-vous partir ?":
      "Hello and welcome to **VOYAGE FACILE**.\nI find your flight at the best price, prepare your booking and give you updates on your requests, any time.\nWhere would you like to go?",
    '{n} vol(s) trouvé(s) · {p} passager(s)':'{n} flight(s) found · {p} passenger(s)',
    '{n} autre(s) vol(s) : demandez-moi « plus rapide », « direct » ou une compagnie précise.':'{n} more flight(s): ask me for “fastest”, “direct” or a specific airline.',
    'Prix total, confirmé par votre conseiller avant paiement.':'Total price, confirmed by your advisor before payment.',
    'Je choisis le vol n°{i} ({c}, départ {h}).':'I choose flight no. {i} ({c}, departing {h}).', 'Vérifiez votre demande':'Check your request',
    'Passager(s) :':'Passenger(s):', 'WhatsApp :':'WhatsApp:', 'Total':'Total', 'Demande envoyée · Référence':'Request sent · Reference',
    'Confirmer et envoyer':'Confirm and send', 'Un conseiller vérifie le prix avec la compagnie et vous contacte sur WhatsApp avant tout paiement.':
      'An advisor checks the price with the airline and contacts you on WhatsApp before any payment.',
    "L'envoi n'a pas abouti. Réessayez.":'Sending failed. Try again.',
    "Votre demande {r} est envoyée. Un conseiller vérifie avec la compagnie et vous écrit sur WhatsApp. Vous pouvez suivre l'avancement dans « Mes voyages ».":
      'Your request {r} has been sent. An advisor checks with the airline and messages you on WhatsApp. You can follow the progress in “My trips”.',
    "L'assistant ne répond pas. Réessayez.":'The assistant is not responding. Try again.', 'Écrire sur WhatsApp':'Message on WhatsApp',
    'M. ':'Mr ', 'Mme ':'Mrs ', 'Mlle ':'Miss ',
    // ---------- Site : page de suivi ----------
    'Suivre et payer ma demande':'Track and pay my request',
    'Une fois le prix confirmé par votre conseiller, vous payez ici par Orange Money.':'Once your advisor confirms the price, you pay here by Orange Money.',
    'Retrouver une demande':'Find a request', 'Ajouter une autre demande':'Add another request', 'Référence de la demande':'Request reference',
    'Numéro WhatsApp utilisé':'WhatsApp number used', 'Voir ma demande':'See my request', 'Écrivez-nous sur WhatsApp':'Message us on WhatsApp',
    'Nous ne vous demanderons jamais votre code secret Orange Money.':'We will never ask for your Orange Money PIN.',
    'Ne plus afficher cette demande sur cet appareil':'Stop showing this request on this device',
    'Indiquez la référence reçue (ex. VF-K7P3QX).':'Enter the reference you received (e.g. VF-K7P3QX).',
    'Indiquez le numéro WhatsApp utilisé pour la demande.':'Enter the WhatsApp number used for the request.',
    'Aucune demande avec cette référence et ce numéro. Vérifiez-les, ou écrivez-nous sur WhatsApp.':'No request with this reference and number. Check them, or message us on WhatsApp.',
    "⏳ Nous vérifions votre paiement auprès d'Orange Money. Cela peut prendre quelques secondes.":'⏳ We are checking your payment with Orange Money. This can take a few seconds.',
    'Le paiement Orange Money a été annulé. Vous pouvez réessayer ci-dessous.':'The Orange Money payment was cancelled. You can try again below.',
    "Votre conseiller vérifie le prix et les places avec la compagnie. Ne payez rien pour l'instant.":'Your advisor is checking the price and seats with the airline. Do not pay anything yet.',
    "Votre conseiller est en train de vérifier avec la compagnie. Ne payez rien pour l'instant.":'Your advisor is checking with the airline. Do not pay anything yet.',
    'Le prix est confirmé : vous pouvez payer ci-dessous par Orange Money, ou en agence.':'The price is confirmed: you can pay below by Orange Money, or at the agency.',
    'Payer pour un proche':'Pay for someone', 'Voyageur(s) : {p}':'Traveller(s): {p}', 'Départ le {d}':'Departure on {d}',
    "Vous payez le billet d'un proche. Vérifiez le trajet et le prénom avant de payer.":"You are paying for someone's ticket. Check the route and first name before paying.",
    "Le prix n'est pas encore confirmé par le conseiller. Revenez sur ce lien un peu plus tard : le bouton de paiement apparaîtra ici.":
      'The advisor has not confirmed the price yet. Come back to this link a little later: the payment button will appear here.',
    "Bonjour VOYAGE FACILE, j'ai une question sur ma demande.":'Hello VOYAGE FACILE, I have a question about my request.',
    "Bonjour VOYAGE FACILE, j'ai besoin d'aide pour suivre ou payer ma demande.":'Hello VOYAGE FACILE, I need help tracking or paying my request.',
    'Besoin d\'aide ?':'Need help?',
  };

  // Phrases avec des parties variables (texte déjà affiché), pour les textes construits ailleurs.
  const MOTIFS = [
    [/^(\d+) vols? sur (\d+) · Prix total pour (\d+) passagers?\. Prix confirmé par votre conseiller avant paiement\.$/,
      '$1 of $2 flights · total price for $3 passenger(s). Price confirmed by your advisor before payment.'],
    [/^(.+) \(aller-retour\)$/, '$1 (round trip)'], [/^(.+) \(aller simple\)$/, '$1 (one way)'],
    [/^ex\. (MP[\w.]+)$/, 'e.g. $1'],
  ];

  const FRANCOPHONES_LANGUE = /^fr\b/i;
  const norm = s => String(s).replace(/[\s  ]+/g, ' ').trim();
  const DICO = {};
  for (const k in EN) DICO[norm(k)] = EN[k];

  function lire(){ try { return localStorage.getItem('vf-langue'); } catch(e){ return null; } }
  function detecter(){
    const tel = String((navigator.languages && navigator.languages[0]) || navigator.language || '');
    if (window.Pays && window.Pays.francophone) return 'fr';          // pays francophone : français
    if (FRANCOPHONES_LANGUE.test(tel)) return 'fr';                     // téléphone en français
    if (!window.Pays || !window.Pays.code) return 'fr';                 // pays inconnu : langue de l'agence
    return 'en';
  }
  const choix = lire();
  const code = choix === 'fr' || choix === 'en' ? choix : detecter();

  const remplir = (s, v) => v ? String(s).replace(/\{(\w+)\}/g, (_, k) => v[k] != null ? v[k] : '') : s;
  function enAnglais(fr){
    const k = norm(fr);
    if (DICO[k] != null) return DICO[k];
    for (const [re, rep] of MOTIFS) if (re.test(k)) return k.replace(re, rep);
    return null;
  }
  // Traduit un texte (avec des {variables} éventuelles) dans la langue choisie.
  function t(fr, v){
    if (code !== 'en') return remplir(fr, v);
    const e = enAnglais(fr);
    return remplir(e != null ? e : fr, v);
  }

  window.L = {
    code,
    loc: code === 'en' ? 'en-GB' : 'fr-FR',
    t,
    choisir(c){ if (c !== 'fr' && c !== 'en') return; try { localStorage.setItem('vf-langue', c); } catch(e){} location.reload(); },
    autre: () => code === 'en' ? 'fr' : 'en',
  };
  document.documentElement.lang = code;
  if (code !== 'en') return;

  // ----- Traduction de l'affichage (anglais) -----
  // Zones jamais traduites : espace agence, messages écrits par le client ou par l'assistant (déjà dans sa langue).
  const IGNORER = '#v-agence, script, style, [data-no-t], .ia-m.me, .ia-m.bot';
  const ATTRS = ['placeholder', 'aria-label', 'title', 'label'];
  function texte(n){
    const brut = n.nodeValue; if (!brut || brut.length > 600) return;
    if (n.parentElement && n.parentElement.tagName === 'TEXTAREA') return;
    const k = norm(brut); if (!k) return;
    const e = enAnglais(k); if (e == null || e === k) return;
    const m = brut.match(/^\s*/)[0], f = brut.match(/\s*$/)[0];
    n.nodeValue = m + e + f;
  }
  function attrs(el){
    for (const a of ATTRS) { const v = el.getAttribute && el.getAttribute(a); if (v) { const e = enAnglais(v); if (e != null && e !== v) el.setAttribute(a, e); } }
  }
  const ignore = el => !el || (el.closest && el.closest(IGNORER));
  function parcourir(r){
    if (r.nodeType === 3) { if (!ignore(r.parentElement)) texte(r); return; }
    if (r.nodeType !== 1 || ignore(r)) return;
    attrs(r);
    const w = document.createTreeWalker(r, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.nodeType === 1 && n.matches(IGNORER) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    let n; while ((n = w.nextNode())) { if (n.nodeType === 3) texte(n); else attrs(n); }
  }
  if (document.title) document.title = t(document.title);
  if (document.body) parcourir(document.body);
  new MutationObserver(ms => {
    for (const m of ms) {
      if (m.type === 'childList') m.addedNodes.forEach(parcourir);
      else if (m.type === 'characterData') parcourir(m.target);
      else if (m.type === 'attributes' && !ignore(m.target)) attrs(m.target);
    }
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  document.addEventListener('DOMContentLoaded', () => parcourir(document.body));
})();
