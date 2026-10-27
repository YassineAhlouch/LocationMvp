/**
 * Permission required to show each location navigation entry.
 *
 * Entries missing from this map stay visible to every signed-in user (the
 * template/demo screens). A parent with several modules uses an array and is
 * shown when the user has at least one of those grants.
 */
const navigationPermissions: Record<string, string | string[]> = {
    // Dashboard.
    'gestion.dashboard': 'dashboard.view',

    // Reservations.
    'gestion.reservations.nouvelle': 'reservations.create',
    'gestion.reservations.liste': 'reservations.view',
    'gestion.reservations.calendrier': 'reservations.view',

    // Vehicles.
    'gestion.vehicules.ajouter': 'fleet.create',
    'gestion.vehicules.liste': 'fleet.view',

    // QR posters.
    'gestion.qr.create': 'fleet.create',
    'gestion.qr.liste': 'fleet.view',

    // Clients.
    'gestion.clients.ajouter': 'clients.create',
    'gestion.clients.liste': 'clients.view',

    // Finances.
    'gestion.finances.depenses': 'expenses.view',
    'gestion.finances.paiements': 'payments.view',

    // Staff.
    'gestion.utilisateurs.ajouter': 'users.create',
    'gestion.utilisateurs.liste': 'users.view',

    // Reports.
    'gestion.rapports.clients': 'reports.view',
    'gestion.rapports.vehicules': 'reports.view',
    'gestion.rapports.encaissement': 'reports.view',

    // Activity.
    'gestion.activite.journal': 'activity_logs.view',
    'gestion.activite.notifications': 'notifications.view',

    // Settings.
    parametrage: 'settings.manage',
    'gestion.parametres.devise': 'settings.manage',
    'gestion.parametres.factures': 'settings.manage',
}

export default navigationPermissions
