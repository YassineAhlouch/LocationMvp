import ToggleDrawer from '@/components/shared/ToggleDrawer'

const Basic = () => {
    return (
        <div className="flex items-center gap-4">
            <ToggleDrawer title="Menu">
                <div className="p-4">
                    <h5 className="mb-4">Navigation</h5>
                    <ul className="space-y-2">
                        <li className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                            Home
                        </li>
                        <li className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                            Dashboard
                        </li>
                        <li className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                            Settings
                        </li>
                        <li className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                            Profile
                        </li>
                    </ul>
                </div>
            </ToggleDrawer>
            <span>Click the toggle button to open the drawer</span>
        </div>
    )
}

export default Basic
