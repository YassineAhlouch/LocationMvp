import appsNavigationConfig from './apps.navigation.config'
import parametrageNavigationConfig from './parametrage.navigation.config'
import documentationNavigationConfig from './documentation.navigation.config'
import type { NavigationTree } from '@/@types/navigation'

// The Elstar template's demo menus (UI components showcase, Authentication
// demos, Others and Guide) are intentionally not composed here — the sidebar
// shows only the real car-rental menus, with Documentation pinned last.
const navigationConfig: NavigationTree[] = [
    ...appsNavigationConfig,
    ...parametrageNavigationConfig,
    ...documentationNavigationConfig,
]

export default navigationConfig
