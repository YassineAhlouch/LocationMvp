import navigationPermissions from '@/configs/navigation.config/permissions'

/**
 * Permission required to open each location route. Most route keys are shared
 * with the sidebar, so the navigation map is the base; the extra keys below
 * cover create/edit/detail screens that are not exposed as menu entries.
 */
const routePermissions: Record<string, string | string[]> = {
    ...navigationPermissions,

    'gestion.dashboard.kpi': 'dashboard.view',
    'gestion.reservations.modifier': 'reservations.update',
    'gestion.reservations.facture': 'reservations.view',
    'gestion.vehicules.modifier': 'fleet.update',
    'gestion.vehicules.details': 'fleet.view',
    'gestion.qr.modifier': 'fleet.update',
}

export default routePermissions
