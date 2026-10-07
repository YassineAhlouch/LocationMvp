import VectorMap from '@/components/shared/VectorMap'
import worldJson from '@/assets/data/maps/world.json'

const WithTooltip = () => {
    const getLayerProps = (layer: { id: string; name: string; d: string }) => {
        return {
            className:
                'fill-gray-300 dark:fill-gray-600 hover:fill-primary transition-colors',
            hover: {
                tooltipContent: <div className="font-medium">{layer.name}</div>,
            },
        }
    }

    return (
        <div className="flex justify-center">
            <VectorMap
                layerProps={(layer) => getLayerProps(layer)}
                className="h-[400px]"
                {...worldJson}
            />
        </div>
    )
}

export default WithTooltip
