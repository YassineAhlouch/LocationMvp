import Divider from '@/components/shared/Divider'

const Vertical = () => {
    return (
        <div className="flex items-center h-8">
            <span>Left content</span>
            <Divider orientation="vertical" />
            <span>Right content</span>
        </div>
    )
}

export default Vertical
