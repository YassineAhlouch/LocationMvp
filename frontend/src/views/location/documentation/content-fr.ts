import type { DocsContent } from './types'

const fr: DocsContent = {
    groups: {
        gettingStarted: 'Pour commencer',
        areas: 'Espaces du système',
        statuses: 'Statuts',
        flow: 'Parcours',
    },
    labels: {
        howTo: 'Mode d’emploi',
        goodToKnow: 'Bon à savoir',
    },
    sections: {
        introduction: {
            kind: 'introduction',
            title: 'Introduction',
            paras: [
                'Double V Drive est le système de gestion de l’agence de location de voitures. La flotte, les réservations, l’argent, l’équipe et les demandes du public vivent au même endroit, pour piloter l’activité quotidienne sans tableurs.',
                'Tout tourne autour d’un objet : la réservation. Une voiture garde ses dates bloquées tant que la réservation est en attente, confirmée, réservée ou en cours — impossible de double-réserver. Les paiements se rattachent à la réservation, les coûts à la voiture, et chaque action est consignée dans le journal d’audit. Le tableau de bord, les KPIs et les rapports lisent cette même source.',
            ],
            listHeading: 'Ce que le système regroupe',
            listItems: [
                'Flotte — véhicules, statuts, dépenses, statistiques',
                'Réservations — le cycle de location, le calendrier et les factures imprimables',
                'Clients — annuaire, sources et segments',
                'Argent — paiements et dépenses',
                'Landing publique — affiches QR et boîte de réception des demandes',
                'Équipe — utilisateurs, rôles et permissions',
                'Analyses — tableau de bord, KPIs, rapports, journal d’audit',
            ],
            outro: 'Nouveau ici ? Commencez par « Premiers pas » dans le menu latéral — il parcourt toute la mise en place dans l’ordre.',
        },
        'first-steps': {
            kind: 'steps',
            title: 'Premiers pas',
            intro: 'Suivez cet ordre une fois, et tout le système s’aligne derrière vous.',
            steps: [
                {
                    title: 'Se connecter',
                    body: 'Ouvrez /sign-in et utilisez votre adresse e-mail et votre mot de passe. Votre rôle et vos permissions décident des écrans que vous voyez.',
                },
                {
                    title: 'Choisir la devise (admin)',
                    body: 'Paramètres → Devise. Le choix vaut pour toute l’agence : chaque prix, facture et KPI l’utilise ensuite.',
                },
                {
                    title: 'Créer l’équipe',
                    body: 'Utilisateurs → Ajouter un utilisateur : nom, e-mail et rôle. Le rôle pilote ce que le membre peut voir ou modifier.',
                },
                {
                    title: 'Enregistrer la flotte',
                    body: 'Véhicules → Ajouter un véhicule : marque, modèle, année, plaque, type de carburant, transmission, places et tarif journalier.',
                },
                {
                    title: 'Enregistrer les clients',
                    body: 'Clients → Ajouter un client : coordonnées, source d’acquisition et segment (normal, VIP, liste noire).',
                },
                {
                    title: 'Créer la première réservation',
                    body: 'Réservations → Nouvelle réservation : choisissez le client, le véhicule et les dates. Une demande qui chevauche une période bloquée est refusée automatiquement.',
                },
                {
                    title: 'Encaisser le paiement',
                    body: 'Finances → Paiements : encaissez en une fois ou en partie ; l’accord passe d’impayé à partiel à payé.',
                },
                {
                    title: 'Suivre les coûts et le travail',
                    body: 'Notez carburant, réparations et autres coûts dans Finances → Dépenses, et répartissez les suivis dans Tâches.',
                },
                {
                    title: 'Passer au public',
                    body: 'Codes QR → Créez une affiche, imprimez-la et placez-la à l’agence. Chaque scan ouvre la page publique et envoie la demande dans votre boîte QR.',
                },
            ],
        },
        dashboard: {
            kind: 'area',
            title: 'Tableau de bord & KPIs',
            intro: 'L’écran d’accueil. Des tuiles pour le chiffre d’affaires, l’état de la flotte, l’occupation et plus donnent le pouls de l’agence d’un coup d’œil. Chaque tuile ouvre sa page de détail avec graphiques et enregistrements sous-jacents.',
            steps: [
                {
                    title: 'L’ouvrir chaque matin',
                    body: 'Les tuiles répondent d’un coup d’œil aux questions du jour : combien encaissé, combien de véhicules sortis, quoi traiter.',
                },
                {
                    title: 'Cliquer une tuile pour creuser',
                    body: 'Chaque KPI ouvre une page de détail avec la courbe dans le temps et les enregistrements exacts derrière le chiffre — jamais d’impasse.',
                },
                {
                    title: 'La lire, pas la remplir',
                    body: 'Le tableau de bord ne saisit rien. Il lit les réservations, les paiements et les véhicules — gardez-les justes et les tuiles restent justes.',
                },
            ],
            notes: ['Les chiffres sont calculés en direct — aucune ressaisie nulle part.'],
        },
        tasks: {
            kind: 'area',
            title: 'Tâches',
            intro: 'La liste du travail de l’équipe. Suivez la liste simple ou déplacez les tickets sur le tableau Kanban.',
            steps: [
                {
                    title: 'Créer la tâche',
                    body: 'Dites quoi faire, qui le fait et pour quand — une ligne par item du travail du jour.',
                },
                {
                    title: 'Suivre en liste ou en tableau',
                    body: 'La liste garde tout d’un seul coup d’œil ; le Kanban laisse glisser les tickets entre les colonnes au fil de l’avancement.',
                },
                {
                    title: 'Terminer ce qui est fait',
                    body: 'Fermer une tâche garde le tableau honnête pour la prochaine équipe.',
                },
            ],
        },
        reservations: {
            kind: 'area',
            title: 'Réservations',
            intro: 'Le cœur du système. Tout ce que traverse une location, du premier appel téléphonique à la voiture rendue.',
            steps: [
                {
                    title: 'Les dates d’abord',
                    body: 'Dans Nouvelle réservation, commencez par l’onglet Voyage : date et heure de départ, retour prévu. Avec les dates connues, le sélecteur de véhicule affiche la vraie disponibilité pour cette période exacte.',
                },
                {
                    title: 'Choisir le véhicule',
                    body: 'Dans Véhicule & clients, ouvrez le sélecteur : chaque véhicule affiche Disponible ou Indisponible pour vos dates ; un véhicule qui touche une période occupée est refusé — impossible de double-réserver.',
                },
                {
                    title: 'Choisir le client',
                    body: 'Le client principal est obligatoire — tapez dans le champ pour chercher par nom ou téléphone, ou créez-le sur place (noms, CIN ou passeport, permis et échéance, téléphones). Ajoutez un conducteur secondaire si besoin.',
                },
                {
                    title: 'Fixer le statut de départ',
                    body: 'En attente pour une note prise au téléphone, Confirmée quand l’accord est fait, Réservée pour une mise de côté pas encore sûre. Chaque choix garde son indication.',
                },
                {
                    title: 'Vérifier le tarif',
                    body: 'Le prix journalier se pré-remplit depuis le véhicule. Ajustez-le, ajoutez remise et caution, et construisez les extras — chaque extra a un nom, un type forfaitaire ou journalier, une quantité et un prix unitaire. Le devis se recalcule à chaque frappe.',
                },
                {
                    title: 'Saisir les paiements',
                    body: 'Dans l’onglet Paiement, ajoutez une ou plusieurs lignes : date, montant, moyen (espèces, carte ou virement), référence et statut. Le récapitulatif montre le statut de paiement généré — impayé, partiel ou payé.',
                },
                {
                    title: 'Enregistrer et laisser tenir',
                    body: 'Enregistrez la réservation : ses dates sont tenues immédiatement. Personne d’autre ne peut réserver ce véhicule sur la même période.',
                },
                {
                    title: 'Piloter le cycle depuis la liste',
                    body: 'Depuis la liste, faites vivre la réservation : activez à la signature du contrat, terminez au retour, ou annulez / marquez l’absence — une raison est demandée pour garder l’historique propre.',
                },
                {
                    title: 'Modifier ou prolonger',
                    body: 'Modifiez pour corriger les détails. Prolonger garde le statut et ne déplace que les dates. Imprimez la facture depuis la réservation — elle suit le modèle de facture des Paramètres.',
                },
            ],
            notes: [
                'Chaque mouvement est validé : les statuts refusent les sauts illégaux et les conflits remontent avec les numéros de réservation en cause.',
                'Le calendrier mensuel par véhicule est le plus rapide pour repérer les créneaux libres.',
                'Voyez Statuts de réservation dans le menu latéral pour toute la machine à états.',
            ],
        },
        vehicles: {
            kind: 'area',
            title: 'Véhicules & flotte',
            intro: 'Enregistrer et entretenir la flotte. Chaque page véhicule réunit ses données au même endroit.',
            steps: [
                {
                    title: 'L’identité',
                    body: 'Dans Ajouter un véhicule : marque, modèle et catégorie (au sélecteur), immatriculation, VIN optionnel, année et couleur.',
                },
                {
                    title: 'Les caractéristiques',
                    body: 'Transmission, type de carburant, places et portes — ce que les clients voient sur la landing publique.',
                },
                {
                    title: 'Fixer le tarif',
                    body: 'Prix journalier, plus prix d’achat si vous suivez le financement. C’est ce prix qui pré-remplit une nouvelle réservation.',
                },
                {
                    title: 'Consigner l’état',
                    body: 'Kilométrage initial et actuel, niveau de carburant en pourcentage — pratique à la remise des clés.',
                },
                {
                    title: 'Protéger les échéances importantes',
                    body: 'Assurance (compagnie et échéance) et contrôle technique — quand ces dates approchent, le véhicule réclame de l’attention avant que le papier ne le fasse.',
                },
                {
                    title: 'Photos et notes',
                    body: 'Déposez les images et définissez la principale, celle de la landing et des impressions. Les notes gardent tout le reste.',
                },
                {
                    title: 'Gérer sa vie',
                    body: 'Un véhicule démarre disponible. Passez-le en maintenance ou inactif pour le sortir de la rotation ; loué et réservé avancent seuls avec les réservations.',
                },
            ],
            notes: [
                'La page véhicule réunit les onglets Aperçu, Réservations, Dépenses et Historique — coûts et historique de location par véhicule au même endroit.',
                'Voyez Statuts de véhicule dans le menu latéral pour ce que chaque statut permet.',
            ],
        },
        'qr-landing': {
            kind: 'area',
            title: 'Codes QR & landing',
            intro: 'Des affiches imprimables qui ouvrent la page de réservation publique. Le client scanne, parcourt les véhicules libres dans sa langue (EN / FR / AR / ES) et envoie une demande — sans compte.',
            steps: [
                {
                    title: 'Créer l’affiche',
                    body: 'Dans Codes QR, créez une affiche et imprimez-la. Comptoir de l’agence, trottoir ou réseaux sociaux.',
                },
                {
                    title: 'Le client scanne et choisit',
                    body: 'Le scan ouvre la landing publique dans la langue du visiteur. Il saisit ses dates et voit les véhicules réellement libres.',
                },
                {
                    title: 'Il envoie la demande',
                    body: 'Un formulaire plus tard, la demande est en route — sans identifiants, sans application.',
                },
                {
                    title: 'Traiter la boîte',
                    body: 'La demande arrive dans Réservations → boîte QR avec le client, son téléphone et e-mail, le véhicule demandé, la période départ → retour et son message.',
                },
                {
                    title: 'Agir',
                    body: 'Ouvrez les détails et servez-vous des boutons Appeler ou WhatsApp. Marquez Contactée après l’appel, puis Convertissez-en une vraie réservation — ou Rejetez-la.',
                },
            ],
            notes: [
                'Traitez la boîte comme un pipeline de prospects : nouvelle → contactée → convertie ou rejetée. La conversion construit la réservation pour vous.',
            ],
        },
        clients: {
            kind: 'area',
            title: 'Clients',
            intro: 'L’annuaire des clients. Chaque réservation est rattachée à un client, et la source dit quel canal l’a amené.',
            steps: [
                {
                    title: 'La personne',
                    body: 'Dans Ajouter un client : prénom, nom, téléphone principal et secondaire, e-mail.',
                },
                {
                    title: 'Les papiers',
                    body: 'CIN, numéro de passeport, numéro de permis et son échéance — ce que le comptoir vérifie avant de remettre les clés.',
                },
                {
                    title: 'Le profil',
                    body: 'Date et lieu de naissance, nationalité, ville et pays.',
                },
                {
                    title: 'Source et segment',
                    body: 'La source raconte comment ils sont arrivés (Facebook, WhatsApp, recommandation, téléphone, sur place ou autre) ; le statut les marque normal, VIP ou liste noire.',
                },
                {
                    title: 'Réutiliser partout',
                    body: 'À la réservation, tapez dans le sélecteur de client pour les retrouver par nom ou téléphone — jamais de ressaisie.',
                },
            ],
            notes: [
                'Un client en liste noire ne devrait pas obtenir de voiture ; un VIP mérite le meilleur tarif et le meilleur service.',
                'Voyez Statuts clients & prospects dans le menu latéral.',
            ],
        },
        payments: {
            kind: 'area',
            title: 'Paiements',
            intro: 'Le volet argent de chaque réservation : totaux, lignes de paiement et échéances.',
            steps: [
                {
                    title: 'Ouvrir l’argent de la réservation',
                    body: 'Depuis Finances → Paiements, retrouvez la réservation — total, encaissé et statut actuel de l’accord en une vue.',
                },
                {
                    title: 'Enregistrer un paiement',
                    body: 'Date, montant, moyen (espèces, carte ou virement), référence optionnelle. Marquez Payé quand l’argent est vraiment dans la caisse.',
                },
                {
                    title: 'Suivre l’accord',
                    body: 'Pendant que les lignes se règlent, l’accord passe impayé → partiel → payé. Le badge se voit sur la page paiements et sur la réservation elle-même.',
                },
                {
                    title: 'Gérer les exceptions',
                    body: 'Un retour au client devient une ligne de remboursement. Pour les plans échelonnés, chaque échéance porte une date — celles en retard basculent « En retard ».',
                },
            ],
            notes: [
                'Les paiements alimentent le rapport d’encaissement et les KPIs de chiffre automatiquement.',
                'Voyez Statuts de paiement dans le menu latéral pour les détails.',
            ],
        },
        expenses: {
            kind: 'area',
            title: 'Dépenses',
            intro: 'Le volet coût de la flotte : carburant, entretien, amendes, réparations — par véhicule et par période.',
            steps: [
                {
                    title: 'Enregistrer le coût',
                    body: 'Ajoutez une dépense : choisissez le véhicule et le type, donnez un titre et une description.',
                },
                {
                    title: 'Les détails d’argent',
                    body: 'Le montant et le fournisseur — payé ou à payer.',
                },
                {
                    title: 'Les dates',
                    body: 'Date de début, date d’échéance et date de paiement réel.',
                },
                {
                    title: 'Régler ou escalader',
                    body: 'Les coûts en attente passent à Payé quand ils sont réglés ; ceux qui dépassent l’échéance basculent « En retard » pour ne rien oublier.',
                },
            ],
            notes: [
                'Les coûts du véhicule apparaissent aussi dans l’onglet Dépenses de sa page, à côté de ses réservations.',
            ],
        },
        'users-roles': {
            kind: 'area',
            title: 'Utilisateurs & rôles',
            intro: 'Les comptes du personnel et ce que chacun peut faire. Les rôles regroupent des permissions par verbe (créer, lire, modifier, supprimer…) et chaque écran les vérifie.',
            steps: [
                {
                    title: 'Ajouter le membre',
                    body: 'Nom et e-mail dans Utilisateurs → Ajouter un utilisateur, puis rattachez un rôle.',
                },
                {
                    title: 'Choisir ou bâtir le rôle',
                    body: 'Un rôle est un lot de verbes par module — un lecteur des seules réservations diffère d’un éditeur des finances. Bâtissez le rôle dans le dialogue des rôles si aucun ne convient.',
                },
                {
                    title: 'Transmettre les identifiants',
                    body: 'Le membre se connecte avec son propre e-mail et mot de passe ; l’interface masque ensuite tout ce que son rôle interdit — menus, boutons et actions.',
                },
                {
                    title: 'S’appuyer sur le journal d’audit',
                    body: 'Chaque action d’un membre est enregistrée. Si quelque chose change, le journal dit qui et quand.',
                },
            ],
            notes: [
                'Les zones sensibles comme le financement passent par une permission dédiée, accordée séparément.',
            ],
        },
        settings: {
            kind: 'area',
            title: 'Paramètres',
            intro: 'Des choix valables pour toute l’agence, réservés aux administrateurs.',
            steps: [
                {
                    title: 'Choisir la devise',
                    body: 'Dans Devise, choisissez la devise de l’agence dans la liste préparée par la plateforme — la plateforme tient le catalogue, l’agence choisit seulement. Chaque prix, facture et KPI l’utilise ensuite.',
                },
                {
                    title: 'Habiller les factures',
                    body: 'Dans Modèle de facture : le logo, le titre et le pied de page que portera chaque facture imprimée.',
                },
            ],
            notes: [
                'Ces deux choix valent pour toute l’agence — ils s’appliquent à toute l’équipe, pas par utilisateur.',
            ],
        },
        reports: {
            kind: 'area',
            title: 'Rapports',
            intro: 'La performance sur toute période, bâtie sur les mêmes enregistrements que le tableau de bord et prête pour l’export.',
            steps: [
                {
                    title: 'Choisir l’angle',
                    body: 'Performance clients, véhicules ou encaissement — le rapport qui répond à la question que vous vous posez ce mois-ci.',
                },
                {
                    title: 'Fixer la période',
                    body: 'Choisissez la période — le mois dernier, ce trimestre ou une plage libre — les métriques et graphiques suivent.',
                },
                {
                    title: 'Lire et exporter',
                    body: 'Parcourez les métriques, creusez les tableaux derrière et exportez la vue quand le gérant demande une feuille.',
                },
            ],
            notes: [
                'Les rapports n’inventent rien — ils agrègent les mêmes réservations, paiements et véhicules que le reste du système.',
            ],
        },
        activity: {
            kind: 'area',
            title: 'Activité',
            intro: 'La traçabilité : un journal d’audit des actions du personnel et un centre de notifications, pour que rien n’arrive dans le noir.',
            steps: [
                {
                    title: 'Regarder avant d’enquêter',
                    body: 'Le journal d’audit dit qui a fait quoi, quand — sur les réservations, les véhicules, les paiements et les rôles.',
                },
                {
                    title: 'Laisser porter la nouvelle',
                    body: 'Le centre de notifications réunit les alertes de l’équipe — consultez-le, personne n’a besoin de crier à travers le bureau.',
                },
            ],
            notes: [
                'Tout ici est automatique. Rien à remplir — seulement à lire.',
            ],
        },
        'status-reservations': {
            kind: 'statuses',
            title: 'Statuts de réservation',
            intro: 'Le cycle d’une location. Ces mouvements sont les seuls légaux — le système refuse tout le reste.',
            entities: [
                {
                    heading: 'Réservation',
                    note: 'En attente, Confirmée, Réservée et En cours tiennent les dates du véhicule — elles bloquent les nouvelles réservations. Prolonger garde le statut et ne déplace que les dates.',
                    rows: [
                        {
                            value: 'pending',
                            labelKey: 'reservations.status.pending',
                            tone: 'amber',
                            meaning: 'Tout juste créée, en attente de confirmation. Tient les dates du véhicule.',
                            moves: ['Confirmée', 'Réservée', 'Annulée', 'Non présenté'],
                        },
                        {
                            value: 'confirmed',
                            labelKey: 'reservations.status.confirmed',
                            tone: 'indigo',
                            meaning: 'Client confirmé. Tient les dates du véhicule.',
                            moves: ['En cours (contrat signé)', 'Annulée', 'Non présenté'],
                        },
                        {
                            value: 'reserved',
                            labelKey: 'reservations.status.reserved',
                            tone: 'violet',
                            meaning: 'Mise de côté au téléphone — pas encore confirmée. Tient les dates du véhicule.',
                            moves: ['Confirmée', 'En cours', 'Annulée', 'Non présenté'],
                        },
                        {
                            value: 'active',
                            labelKey: 'reservations.status.active',
                            tone: 'sky',
                            meaning: 'Location en cours. Tient les dates du véhicule.',
                            moves: ['Terminée'],
                        },
                        {
                            value: 'completed',
                            labelKey: 'reservations.status.completed',
                            tone: 'emerald',
                            meaning: 'Véhicule rendu et location close — état final.',
                        },
                        {
                            value: 'cancelled',
                            labelKey: 'reservations.status.cancelled',
                            tone: 'rose',
                            meaning: 'Abandonnée — état final, libère les dates.',
                        },
                        {
                            value: 'no_show',
                            labelKey: 'reservations.status.no_show',
                            tone: 'rose',
                            meaning: 'Le client n’est jamais venu — état final, libère les dates.',
                        },
                    ],
                },
            ],
        },
        'status-cars': {
            kind: 'statuses',
            title: 'Statuts de véhicule',
            intro: 'Où chaque véhicule en est. La liste de flotte et la page véhicule les gèrent.',
            entities: [
                {
                    heading: 'Véhicule',
                    rows: [
                        {
                            value: 'available',
                            labelKey: 'cars.status.available',
                            tone: 'emerald',
                            meaning: 'Prêt à louer — le seul statut qui peut entrer dans une nouvelle réservation.',
                        },
                        {
                            value: 'reserved',
                            labelKey: 'cars.status.reserved',
                            tone: 'violet',
                            meaning: 'Dates tenues par une réservation à venir (confirmée ou mise de côté).',
                        },
                        {
                            value: 'rented',
                            labelKey: 'cars.status.rented',
                            tone: 'sky',
                            meaning: 'Actuellement loué par une réservation en cours.',
                        },
                        {
                            value: 'maintenance',
                            labelKey: 'cars.status.maintenance',
                            tone: 'amber',
                            meaning: 'En entretien ou réparation — non louable.',
                        },
                        {
                            value: 'inactive',
                            labelKey: 'cars.status.inactive',
                            tone: 'gray',
                            meaning: 'Archivé ou hors service — non louable.',
                        },
                    ],
                },
            ],
            footnote: 'Seuls les véhicules disponibles peuvent entrer dans une nouvelle réservation. Passer un véhicule en maintenance ou inactif le sort de la rotation.',
        },
        'status-money': {
            kind: 'statuses',
            title: 'Statuts de paiement',
            intro: 'Comment l’argent avance : l’accord, chaque ligne de paiement, les échéances, plus le volet dépenses.',
            entities: [
                {
                    heading: 'Accord de paiement (par réservation)',
                    rows: [
                        {
                            value: 'unpaid',
                            labelKey: 'reservations.payment.unpaid',
                            tone: 'rose',
                            meaning: 'Aucun argent encore encaissé sur la réservation.',
                        },
                        {
                            value: 'partial',
                            labelKey: 'reservations.payment.partial',
                            tone: 'amber',
                            meaning: 'De l’argent encaissé, un reste à payer.',
                        },
                        {
                            value: 'paid',
                            labelKey: 'reservations.payment.paid',
                            tone: 'emerald',
                            meaning: 'Encaissé en totalité.',
                        },
                    ],
                },
                {
                    heading: 'Ligne de paiement',
                    note: 'Une ligne passée à Remboursé est finale — l’argent est reparti au client.',
                    rows: [
                        {
                            value: 'pending',
                            labelKey: 'payments.status.pending',
                            tone: 'amber',
                            meaning: 'Saisie mais pas encore réglée.',
                            moves: ['Payé'],
                        },
                        {
                            value: 'paid',
                            labelKey: 'payments.status.paid',
                            tone: 'emerald',
                            meaning: 'Argent reçu.',
                            moves: ['Remboursé'],
                        },
                        {
                            value: 'refunded',
                            labelKey: 'payments.status.refunded',
                            tone: 'violet',
                            meaning: 'Rendu au client — état final.',
                        },
                    ],
                },
                {
                    heading: 'Échéance',
                    rows: [
                        {
                            value: 'pending',
                            labelKey: 'payments.status.pending',
                            tone: 'amber',
                            meaning: 'Échéance planifiée, pas encore due ou pas encore payée.',
                            moves: ['Payée'],
                        },
                        {
                            value: 'paid',
                            labelKey: 'payments.status.paid',
                            tone: 'emerald',
                            meaning: 'Échéance encaissée.',
                        },
                        {
                            value: 'overdue',
                            labelKey: 'expenses.status.overdue',
                            tone: 'rose',
                            meaning: 'Échéance passée sans paiement — à traiter.',
                        },
                    ],
                },
                {
                    heading: 'Dépense',
                    rows: [
                        {
                            value: 'pending',
                            labelKey: 'expenses.status.pending',
                            tone: 'amber',
                            meaning: 'Coût enregistré, en attente de règlement.',
                            moves: ['Payée'],
                        },
                        {
                            value: 'paid',
                            labelKey: 'expenses.status.paid',
                            tone: 'emerald',
                            meaning: 'Coût réglé.',
                        },
                        {
                            value: 'overdue',
                            labelKey: 'expenses.status.overdue',
                            tone: 'rose',
                            meaning: 'Règlement en retard — signalé pour suivi.',
                        },
                    ],
                },
            ],
        },
        'status-people': {
            kind: 'statuses',
            title: 'Statuts clients & prospects',
            intro: 'Comment l’agence traite les clients et comment avancent les demandes publiques.',
            entities: [
                {
                    heading: 'Client',
                    rows: [
                        {
                            value: 'normal',
                            labelKey: 'clients.statusOption.normal',
                            tone: 'sky',
                            meaning: 'Client régulier, sans traitement particulier.',
                        },
                        {
                            value: 'vip',
                            labelKey: 'clients.statusOption.vip',
                            tone: 'violet',
                            meaning: 'Client à forte valeur — priorité sur le tarif et le service.',
                        },
                        {
                            value: 'blacklist',
                            labelKey: 'clients.statusOption.blacklist',
                            tone: 'rose',
                            meaning: 'Client bloqué — ne pas lui louer.',
                        },
                    ],
                },
                {
                    heading: 'Demande (landing)',
                    note: 'Convertir un prospect crée une vraie réservation pour ce client et ce véhicule.',
                    rows: [
                        {
                            value: 'new',
                            labelKey: 'landingReservations.status.new',
                            tone: 'sky',
                            meaning: 'Demande tout juste reçue depuis la landing publique.',
                            moves: ['Contactée', 'Convertie', 'Rejetée'],
                        },
                        {
                            value: 'contacted',
                            labelKey: 'landingReservations.status.contacted',
                            tone: 'amber',
                            meaning: 'Votre équipe a appelé ou écrit au prospect.',
                            moves: ['Convertie', 'Rejetée'],
                        },
                        {
                            value: 'converted',
                            labelKey: 'landingReservations.status.converted',
                            tone: 'emerald',
                            meaning: 'Le prospect est devenu une vraie réservation.',
                        },
                        {
                            value: 'rejected',
                            labelKey: 'landingReservations.status.rejected',
                            tone: 'rose',
                            meaning: 'Prospect refusé — état final.',
                        },
                    ],
                },
            ],
        },
        lifecycle: {
            kind: 'lifecycle',
            title: 'Cycle de vie',
            flow: [
                'Affiche QR',
                'Demande (nouvelle)',
                'Contactée',
                'Convertie',
                'Réservation (en attente)',
                'Confirmée',
                'En cours + paiements',
                'Terminée',
                'Véhicule à nouveau disponible',
            ],
            paras: [
                'Un client scanne l’affiche QR et remplit la landing publique dans sa langue. La demande tombe dans la boîte QR comme « nouvelle » ; l’équipe la marque « contactée » après le premier appel, puis « convertie » quand l’affaire est faite.',
                'La conversion crée une vraie réservation qui tient les dates du véhicule tant qu’elle est en attente, confirmée, réservée ou en cours. Les paiements encaissent pendant que les Dépenses suivent le volet coûts et les Tâches portent le suivi opérationnel.',
                'Au retour du véhicule, la réservation devient « terminée », le véhicule redevient « disponible », et chaque chiffre atterrit dans le tableau de bord, les rapports et le journal d’audit automatiquement — rien à ressaisir.',
            ],
        },
    },
}

export default fr
