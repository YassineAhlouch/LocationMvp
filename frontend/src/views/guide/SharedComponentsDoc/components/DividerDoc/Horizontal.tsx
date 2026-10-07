import Divider from '@/components/shared/Divider'

const Horizontal = () => {
    return (
        <div className="w-full">
            <p>Content above the divider</p>
            <Divider />
            <p>Content below the divider</p>
        </div>
    )
}

export default Horizontal
