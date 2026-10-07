import Tooltip from '@/components/ui/Tooltip'

const DefaultOpen = () => {
    return (
        <div>
            <Tooltip title="Tooltip Message" open={true} placement="right">
                <span>Default Open</span>
            </Tooltip>
        </div>
    )
}

export default DefaultOpen
