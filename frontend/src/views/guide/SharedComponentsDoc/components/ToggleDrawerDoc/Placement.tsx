import ToggleDrawer from '@/components/shared/ToggleDrawer'

const Placement = () => {
    return (
        <div className="flex items-center gap-4">
            <ToggleDrawer placement="right" title="Right Drawer">
                <div className="p-4">
                    <h5 className="mb-4">Right Side Panel</h5>
                    <p className="text-gray-500">
                        This drawer opens from the right side of the screen.
                    </p>
                </div>
            </ToggleDrawer>
            <span>Opens from the right</span>
        </div>
    )
}

export default Placement
