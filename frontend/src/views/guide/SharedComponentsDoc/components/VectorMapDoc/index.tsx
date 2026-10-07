import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import WithTooltip from './WithTooltip'

const mdPath = 'VectorMapDoc'

const demoHeader = {
    title: 'VectorMap',
    desc: 'VectorMap renders SVG-based maps with interactive layers, supporting tooltips, click handlers, and custom styling for each region.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic vector map with simple layers.`,
        component: <Basic />,
    },
    {
        mdName: 'WithTooltip',
        mdPath: mdPath,
        title: 'With Tooltip & Click',
        desc: `Interactive map with tooltips and click handlers for each region.`,
        component: <WithTooltip />,
    },
]

const demoApi = [
    {
        component: 'VectorMap',
        api: [
            {
                propName: 'id',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Unique identifier for the map',
            },
            {
                propName: 'name',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Accessible name for the map (used in aria-label)',
            },
            {
                propName: 'viewBox',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'SVG viewBox attribute defining the coordinate system',
            },
            {
                propName: 'layers',
                type: `<code>Array&lt;{ id: string; name: string; d: string }&gt;</code>`,
                default: `-`,
                desc: 'Array of layer objects with id, name, and SVG path data (d)',
            },
            {
                propName: 'tabIndex',
                type: `<code>number</code>`,
                default: `<code>0</code>`,
                desc: 'Tab index for keyboard navigation',
            },
            {
                propName: 'layerProps',
                type: `<code>(layer: VectorMapLayer) => LayerProps</code>`,
                default: `-`,
                desc: 'Function to compute props for each layer (className, onClick, hover)',
            },
            {
                propName: 'checkedLayers',
                type: `<code>string[]</code>`,
                default: `-`,
                desc: 'Array of layer IDs that are checked/selected',
            },
            {
                propName: 'currentLayers',
                type: `<code>string[]</code>`,
                default: `-`,
                desc: 'Array of layer IDs that are currently active',
            },
        ],
    },
    {
        component: 'LayerProps',
        api: [
            {
                propName: 'onClick',
                type: `<code>(layerId: string) => void</code>`,
                default: `-`,
                desc: 'Click handler for the layer',
            },
            {
                propName: 'hover.tooltipContent',
                type: `<code>ReactNode</code> | <code>string</code>`,
                default: `-`,
                desc: 'Content to display in the tooltip on hover',
            },
            {
                propName: 'className',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'CSS classes for the layer path',
            },
        ],
    },
]

const VectorMapDoc = () => {
    return (
        <DemoLayout
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            api={demoApi}
            mdPrefixPath="shared"
        />
    )
}

export default VectorMapDoc
