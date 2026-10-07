import VectorMap from '@/components/shared/VectorMap'
import worldJson from '@/assets/data/maps/world.json'

const Basic = () => {
    return (
        <div className="flex justify-center">
            <VectorMap className="h-[400px]" {...worldJson} />
        </div>
    )
}

export default Basic
