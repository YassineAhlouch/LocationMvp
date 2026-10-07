import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import LineChartSimple from './LineChartSimple'
import LineChartLinear from './LineChartLinear'
import AreaChartSimple from './AreaChartSimple'
import AreaChartStack from './AreaChartStack'
import AreaChartGradiant from './AreaChartGradiant'
import AreaChartAdvanceGradient from './AreaChartAdvanceGradient'
import BarChartSimple from './BarChartSimple'
import BarChartHorizontal from './BarCharHorizontal'
import BarCharMultiple from './BarCharMultiple'
import BarChartStack from './BarChartStack'
import PieChartSimple from './PieChartSimple'
import PieChartDonut from './PieChartDonut'
import PieChartDonutContent from './PieChartDonutContent'
import RadarChartSimple from './RadarChartSimple'
import RadarChartMultiple from './RadarChartMultiple'
import CohortChartBasic from './CohortChartBasic'
import Color from './Color'
import CustomTooltip from './CustomTooltip'
import Compose from './Compose'

const mdPath = 'ChartDoc'

const demoHeader = {
    title: 'Charts',
    desc: 'A collection of chart components built on top of <a class="underline text-gray-900 dark:text-gray-100" href="https://recharts.org/en-US" target="_blank">Recharts</a>. These preconfigured charts are ready to use and designed for various types of data visualization.',
}

const demos = [
    {
        mdName: 'LineChartSimple',
        mdPath: mdPath,
        title: 'Line Chart - Simple',
        desc: `Simple line chart example`,
        component: <LineChartSimple />,
    },
    {
        mdName: 'LineChartLinear',
        mdPath: mdPath,
        title: 'Line Chart - Linear',
        desc: `Linear line chart example`,
        component: <LineChartLinear />,
    },
    {
        mdName: 'AreaChartSimple',
        mdPath: mdPath,
        title: 'Area Chart - Simple',
        desc: `Simple area chart example`,
        component: <AreaChartSimple />,
    },
    {
        mdName: 'AreaChartStack',
        mdPath: mdPath,
        title: 'Area Chart - Stack',
        desc: `Having multiple area charts stacked on top of each other`,
        component: <AreaChartStack />,
    },
    {
        mdName: 'AreaChartGradiant',
        mdPath: mdPath,
        title: 'Area Chart - Gradiant',
        desc: `Area chart with gradiant color`,
        component: <AreaChartGradiant />,
    },
    {
        mdName: 'AreaChartAdvanceGradient',
        mdPath: mdPath,
        title: 'Area Chart - Advance Gradiant',
        desc: `Area chart with complex gradiant style`,
        component: <AreaChartAdvanceGradient />,
    },
    {
        mdName: 'BarChartSimple',
        mdPath: mdPath,
        title: 'Bar Chart - Simple',
        desc: `Simple bar chart example`,
        component: <BarChartSimple />,
    },
    {
        mdName: 'BarCharHorizontal',
        mdPath: mdPath,
        title: 'Bar Chart - Horizontal',
        desc: `Simple horizontal bar chart example`,
        component: <BarChartHorizontal />,
    },
    {
        mdName: 'BarCharMultiple',
        mdPath: mdPath,
        title: 'Bar Chart - Multiple',
        desc: `Simple multiple bar chart example`,
        component: <BarCharMultiple />,
    },
    {
        mdName: 'BarChartStack',
        mdPath: mdPath,
        title: 'Bar Chart - Stack',
        desc: `Having multiple bar charts stacked on top of each other`,
        component: <BarChartStack />,
    },
    {
        mdName: 'PieChartSimple',
        mdPath: mdPath,
        title: 'Pie Chart - Simple',
        desc: `Simple pie chart example`,
        component: <PieChartSimple />,
    },
    {
        mdName: 'PieChartDonut',
        mdPath: mdPath,
        title: 'Pie Chart - Donut',
        desc: `Donut chart example`,
        component: <PieChartDonut />,
    },
    {
        mdName: 'PieChartDonutContent',
        mdPath: mdPath,
        title: 'Pie Chart - Donut with Content',
        desc: `Donut chart with content within`,
        component: <PieChartDonutContent />,
    },
    {
        mdName: 'RadarChartSimple',
        mdPath: mdPath,
        title: 'Radar Chart - Simple',
        desc: `Simple radar chart example`,
        component: <RadarChartSimple />,
    },
    {
        mdName: 'RadarChartMultiple',
        mdPath: mdPath,
        title: 'Radar Chart - Multiple',
        desc: `Radart chart with multiple series`,
        component: <RadarChartMultiple />,
    },
    {
        mdName: 'CohortChartBasic',
        mdPath: mdPath,
        title: 'Cohort Chart',
        desc: `Cohort analysis chart for visualizing retention, conversion, or performance data over time periods`,
        component: <CohortChartBasic />,
    },
    {
        mdName: 'Color',
        mdPath: mdPath,
        title: 'Color',
        desc: `Precomposed chart come with a set of color scheme, but it can be customized for each chart`,
        component: <Color />,
    },
    {
        mdName: 'CustomTooltip',
        mdPath: mdPath,
        title: 'Custom Tooltip',
        desc: `Tooltip can be customized for each chart via the <code>tooltipConfig.content</code> prop.`,
        component: <CustomTooltip />,
    },
    {
        mdName: 'Compose',
        mdPath: mdPath,
        title: 'Custom & Compose',
        desc: `You can build your own chart or compose multiple chart together by using the <code>children</code> prop of <code>ChartContainer</code>.`,
        component: <Compose />,
    },
]

const demoApi = [
    {
        component: 'LineChart',
        api: [
            {
                propName: 'cartesianGridConfig',
                type: `<code><a href="https://recharts.org/en-US/api/CartesianGrid" target="_blank">CartesianGridProps</a></code>`,
                default: `<code>{}</code>`,
                desc: 'Configuration options for the cartesian grid.',
            },
            {
                propName: 'chartHorizontalSpace',
                type: `<code>number</code>`,
                default: `<code>20</code>`,
                desc: 'Horizontal padding around the chart.',
            },
            {
                propName: 'chartVerticalSpace',
                type: `<code>number</code>`,
                default: `<code>10</code>`,
                desc: 'Vertical padding around the chart.',
            },
            {
                propName: 'children',
                type: `<code>ReactNode</code> | <code>(props: typeof defaultChartConfig) =&gt; ReactNode</code>`,
                default: `-`,
                desc: 'Custom chart elements or a render function to access with default chart config.',
            },
            {
                propName: 'data',
                type: `<code>Array&lt;Record&lt;string, string | number&gt;&gt;</code>`,
                default: `-`,
                desc: 'The dataset to be visualized in the chart.',
            },
            {
                propName: 'height',
                type: `<code>number</code>`,
                default: `<code>300</code>`,
                desc: 'Height of the chart in pixels.',
            },
            {
                propName: 'lineConfig',
                type: `<code>Array&lt;<u><strong><a href="https://recharts.org/en-US/api/Line" target="_blank">LineProps</a></strong></u>&gt;</code>`,
                default: `-`,
                desc: 'Configuration of each of the line',
            },
            {
                propName: 'tooltipConfig',
                type: `<code><u><strong><a href="https://recharts.org/en-US/api/Tooltip" target="_blank">TooltipProps</a></strong></u></code>`,
                default: `-`,
                desc: 'Configuration options for the chart tooltip.',
            },
            {
                propName: 'tooltipContentConfig',
                type: `<code>ChartTooltipContentConfig</code>`,
                default: `-`,
                desc: 'Configuration for ChartTooltipContent.',
            },
            {
                propName: 'width',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'Width of the chart.',
            },
            {
                propName: 'xAxisConfig',
                type: `<code><u><strong><a href="https://recharts.org/en-US/api/XAxis" target="_blank">XAxisProps</a></strong></u></code>`,
                default: `-`,
                desc: 'Configuration options for the X-axis.',
            },
        ],
    },
    {
        component: 'BarChart',
        api: [
            {
                propName: 'barConfig',
                type: `<code>Array&lt;<u><strong><a href="https://recharts.org/en-US/api/Bar" target="_blank">BarProps</a></strong></u>&gt;</code>`,
                default: `-`,
                desc: 'Configuration of each of the bar',
            },
            {
                propName: 'cartesianGridConfig',
                type: `<code><a href="https://recharts.org/en-US/api/CartesianGrid" target="_blank">CartesianGridProps</a></code>`,
                default: `<code>{}</code>`,
                desc: 'Configuration options for the cartesian grid.',
            },
            {
                propName: 'chartHorizontalSpace',
                type: `<code>number</code>`,
                default: `<code>20</code>`,
                desc: 'Horizontal padding around the chart.',
            },
            {
                propName: 'chartVerticalSpace',
                type: `<code>number</code>`,
                default: `<code>10</code>`,
                desc: 'Vertical padding around the chart.',
            },
            {
                propName: 'children',
                type: `<code>ReactNode</code> | <code>(props: typeof defaultChartConfig) =&gt; ReactNode</code>`,
                default: `-`,
                desc: 'Custom chart elements or a render function to access with default chart config.',
            },
            {
                propName: 'data',
                type: `<code>Array&lt;Record&lt;string, string | number&gt;&gt;</code>`,
                default: `-`,
                desc: 'The dataset to be visualized in the chart.',
            },
            {
                propName: 'height',
                type: `<code>number</code>`,
                default: `<code>300</code>`,
                desc: 'Height of the chart in pixels.',
            },
            {
                propName: 'layout',
                type: `<code>'vertical' | 'horizontal'</code>`,
                default: `<code>'horizontal'</code>`,
                desc: 'The layout of bars chart.',
            },
            {
                propName: 'tooltipConfig',
                type: `<code><u><strong><a href="https://recharts.org/en-US/api/Tooltip" target="_blank">TooltipProps</a></strong></u></code>`,
                default: `-`,
                desc: 'Configuration options for the chart tooltip.',
            },
            {
                propName: 'tooltipContentConfig',
                type: `<code>ChartTooltipContentConfig</code>`,
                default: `-`,
                desc: 'Configuration for ChartTooltipContent.',
            },
            {
                propName: 'width',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'Width of the chart.',
            },
            {
                propName: 'xAxisConfig',
                type: `<code><u><strong><a href="https://recharts.org/en-US/api/XAxis" target="_blank">XAxisProps</a></strong></u></code>`,
                default: `-`,
                desc: 'Configuration options for the X-axis.',
            },
        ],
    },
    {
        component: 'AreaChart',
        api: [
            {
                propName: 'areaConfig',
                type: `<code>Array&lt;<u><strong><a href="https://recharts.org/en-US/api/Area" target="_blank">AreaProps</a></strong></u>&gt;</code>`,
                default: `-`,
                desc: 'Configuration of each of the area',
            },
            {
                propName: 'cartesianGridConfig',
                type: `<code><a href="https://recharts.org/en-US/api/CartesianGrid" target="_blank">CartesianGridProps</a></code>`,
                default: `<code>{}</code>`,
                desc: 'Configuration options for the cartesian grid.',
            },
            {
                propName: 'chartHorizontalSpace',
                type: `<code>number</code>`,
                default: `<code>20</code>`,
                desc: 'Horizontal padding around the chart.',
            },
            {
                propName: 'chartVerticalSpace',
                type: `<code>number</code>`,
                default: `<code>10</code>`,
                desc: 'Vertical padding around the chart.',
            },
            {
                propName: 'children',
                type: `<code>ReactNode</code> | <code>(props: typeof defaultChartConfig) =&gt; ReactNode</code>`,
                default: `-`,
                desc: 'Custom chart elements or a render function to access with default chart config.',
            },
            {
                propName: 'data',
                type: `<code>Array&lt;Record&lt;string, string | number&gt;&gt;</code>`,
                default: `-`,
                desc: 'The dataset to be visualized in the chart.',
            },
            {
                propName: 'height',
                type: `<code>number</code>`,
                default: `<code>300</code>`,
                desc: 'Height of the chart in pixels.',
            },
            {
                propName: 'tooltipConfig',
                type: `<code><u><strong><a href="https://recharts.org/en-US/api/Tooltip" target="_blank">TooltipProps</a></strong></u></code>`,
                default: `-`,
                desc: 'Configuration options for the chart tooltip.',
            },
            {
                propName: 'tooltipContentConfig',
                type: `<code>ChartTooltipContentConfig</code>`,
                default: `-`,
                desc: 'Configuration for ChartTooltipContent.',
            },
            {
                propName: 'width',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'Width of the chart.',
            },
            {
                propName: 'xAxisConfig',
                type: `<code><u><strong><a href="https://recharts.org/en-US/api/XAxis" target="_blank">XAxisProps</a></strong></u></code>`,
                default: `-`,
                desc: 'Configuration options for the X-axis.',
            },
        ],
    },
    {
        component: 'PieChart',
        api: [
            {
                propName: 'chartHorizontalSpace',
                type: `<code>number</code>`,
                default: `<code>20</code>`,
                desc: 'Horizontal padding around the chart.',
            },
            {
                propName: 'chartVerticalSpace',
                type: `<code>number</code>`,
                default: `<code>10</code>`,
                desc: 'Vertical padding around the chart.',
            },
            {
                propName: 'cellConfig',
                type: `<code>Array&lt;SVGAttributes&lt;SVGElement&gt;&gt;</code>`,
                default: `-`,
                desc: 'Configuration of each of the pie slices',
            },
            {
                propName: 'children',
                type: `<code>ReactNode</code> | <code>(props: typeof defaultChartConfig) =&gt; ReactNode</code>`,
                default: `-`,
                desc: 'Custom chart elements or a render function to access with default chart config.',
            },
            {
                propName: 'data',
                type: `<code>Array&lt;Record&lt;string, string | number&gt;&gt;</code>`,
                default: `-`,
                desc: 'The dataset to be visualized in the chart.',
            },
            {
                propName: 'height',
                type: `<code>number</code>`,
                default: `<code>300</code>`,
                desc: 'Height of the chart in pixels.',
            },
            {
                propName: 'pieConfig',
                type: `<code>Array&lt;<u><strong><a href="https://recharts.org/en-US/api/Pie" target="_blank">PieProps</a></strong></u>&gt;</code>`,
                default: `-`,
                desc: 'Configuration of the pie chart.',
            },
            {
                propName: 'pieContent',
                type: `<code>ReactNode</code>`,
                default: `-`,
                desc: 'Content of the pie chart.',
            },
            {
                propName: 'tooltipConfig',
                type: `<code><u><strong><a href="https://recharts.org/en-US/api/Tooltip" target="_blank">TooltipProps</a></strong></u></code>`,
                default: `-`,
                desc: 'Configuration options for the chart tooltip.',
            },
            {
                propName: 'tooltipContentConfig',
                type: `<code>ChartTooltipContentConfig</code>`,
                default: `-`,
                desc: 'Configuration for ChartTooltipContent.',
            },
            {
                propName: 'width',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'Width of the chart.',
            },
        ],
    },
    {
        component: 'RadarChart',
        api: [
            {
                propName: 'angleAxisConfig',
                type: `<code><u><strong><a href="https://recharts.org/en-US/api/PolarAngleAxis" target="_blank">PolarAngleAxisProps</a></strong></u></code>`,
                default: `-`,
                desc: 'Configuration options for the Angle axis.',
            },
            {
                propName: 'chartHorizontalSpace',
                type: `<code>number</code>`,
                default: `<code>20</code>`,
                desc: 'Horizontal padding around the chart.',
            },
            {
                propName: 'chartVerticalSpace',
                type: `<code>number</code>`,
                default: `<code>10</code>`,
                desc: 'Vertical padding around the chart.',
            },
            {
                propName: 'children',
                type: `<code>ReactNode</code> | <code>(props: typeof defaultChartConfig) =&gt; ReactNode</code>`,
                default: `-`,
                desc: 'Custom chart elements or a render function to access with default chart config.',
            },
            {
                propName: 'data',
                type: `<code>Array&lt;Record&lt;string, string | number&gt;&gt;</code>`,
                default: `-`,
                desc: 'The dataset to be visualized in the chart.',
            },
            {
                propName: 'height',
                type: `<code>number</code>`,
                default: `<code>300</code>`,
                desc: 'Height of the chart in pixels.',
            },
            {
                propName: 'radarConfig',
                type: `<code>Array&lt;<u><strong><a href="https://recharts.org/en-US/api/Radar" target="_blank">RadarProps</a></strong></u>&gt;</code>`,
                default: `-`,
                desc: 'Configuration of each of the radar',
            },
            {
                propName: 'tooltipConfig',
                type: `<code><u><strong><a href="https://recharts.org/en-US/api/Tooltip" target="_blank">TooltipProps</a></strong></u></code>`,
                default: `-`,
                desc: 'Configuration options for the chart tooltip.',
            },
            {
                propName: 'tooltipContentConfig',
                type: `<code>ChartTooltipContentConfig</code>`,
                default: `-`,
                desc: 'Configuration for ChartTooltipContent.',
            },
            {
                propName: 'width',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'Width of the chart.',
            },
        ],
    },
    {
        component: 'ChartContainer',
        api: [
            {
                propName: 'children',
                type: `<code>ReactElement</code>`,
                default: `-`,
                desc: 'Custom chart elements',
            },
            {
                propName: 'height',
                type: `<code>number</code>`,
                default: `<code>300</code>`,
                desc: 'Height of the chart in pixels.',
            },
            {
                propName: 'width',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'Width of the chart.',
            },
        ],
    },
    {
        component: 'ChartTooltipContent',
        api: [
            {
                propName: 'active',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether the tooltip is active.',
            },
            {
                propName: 'customContent',
                type: `<code>(props: ChartTooltipContentProps) => ReactNode</code>`,
                default: `-`,
                desc: 'Custom render function to override the default tooltip content.',
            },
            {
                propName: 'hideLabel',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Hides the label (usually the X-axis label) in the tooltip.',
            },
            {
                propName: 'hideIndicator',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Hides the colored indicator dots in the tooltip entries.',
            },
            {
                propName: 'label',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'The hovered chart label.',
            },
            {
                propName: 'labelFormatter',
                type: `<code>(value: string, payload: Payload) => ReactNode</code>`,
                default: `-`,
                desc: 'Formats the label displayed in the tooltip.',
            },
            {
                propName: 'nameFormatter',
                type: `<code>(value: string) => ReactNode</code>`,
                default: `-`,
                desc: 'Formats the name (key) displayed in the tooltip entries.',
            },
            {
                propName: 'payload',
                type: `<code>Array&lt;{
                    type?: 'none';
                    color?: string;
                    formatter?: (value: TValue, name: TName) => ReactNode;
                    name?: TName;
                    value?: TValue;
                    unit?: ReactNode;
                    dataKey?: string | number;
                    payload?: any;
                    chartType?: string;
                    stroke?: string;
                    strokeDasharray?: string | number;
                    strokeWidth?: number | string;
                    className?: string;
                    hide?: boolean;
                }&gt;</code>`,
                default: `<code>false</code>`,
                desc: 'The hovered chart data .',
            },
            {
                propName: 'valueFormatter',
                type: `<code>(value: number) => ReactNode</code>`,
                default: `-`,
                desc: 'Formats the value displayed in the tooltip entries.',
            },
        ],
    },
    {
        component: 'ChartLegendContent',
        api: [
            {
                propName: 'customContent',
                type: `<code>(props: LegendProps) => ReactNode</code>`,
                default: `-`,
                desc: 'Custom render function to override the default tooltip content.',
            },
            {
                propName: 'payload',
                type: `<code>Array&lt;{
                    type?: 'none';
                    color?: string;
                    formatter?: (value: TValue, name: TName) => ReactNode;
                    name?: TName;
                    value?: TValue;
                    unit?: ReactNode;
                    dataKey?: string | number;
                    payload?: any;
                    chartType?: string;
                    stroke?: string;
                    strokeDasharray?: string | number;
                    strokeWidth?: number | string;
                    className?: string;
                    hide?: boolean;
                }&gt;</code>`,
                default: `<code>false</code>`,
                desc: 'Chart data payload.',
            },
            {
                propName: 'verticalAlign',
                type: `<code>'top' | 'bottom' | 'middle'</code>`,
                default: `-`,
                desc: 'Vertical alignment of the legend.',
            },
        ],
    },
    {
        component: 'CohortChart',
        api: [
            {
                propName: 'data',
                type: `<code>CohortChartData</code>`,
                default: `-`,
                desc: 'The cohort data to visualize. Object with cohort keys mapping to CohortEntry objects.',
            },
            {
                propName: 'timeUnits',
                type: `<code>string[]</code>`,
                default: `-`,
                desc: 'Custom time unit labels (e.g., ["Week 1", "Week 2"]).',
            },
            {
                propName: 'valueFormatter',
                type: `<code>(value: number) => string</code>`,
                default: `-`,
                desc: 'Function to format cohort sizes.',
            },
            {
                propName: 'onCohortSelect',
                type: `<code>(cohortKey: string, cohortData: CohortEntry) => void</code>`,
                default: `-`,
                desc: 'Callback when a cohort row is selected.',
            },
            {
                propName: 'selectedCohort',
                type: `<code>string | null</code>`,
                default: `-`,
                desc: 'Currently selected cohort key.',
            },
            {
                propName: 'minValue',
                type: `<code>number</code>`,
                default: `<code>0</code>`,
                desc: 'Minimum value for color scaling.',
            },
            {
                propName: 'maxValue',
                type: `<code>number</code>`,
                default: `<code>100</code>`,
                desc: 'Maximum value for color scaling.',
            },
            {
                propName: 'emptyCellContent',
                type: `<code>ReactNode</code>`,
                default: `-`,
                desc: 'Custom content for empty cells.',
            },
            {
                propName: 'showLegend',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to show the color legend.',
            },
            {
                propName: 'legendTitle',
                type: `<code>string</code>`,
                default: `<code>"Retention Rate"</code>`,
                desc: 'Title for the color legend.',
            },
            {
                propName: 'height',
                type: `<code>number</code>`,
                default: `<code>400</code>`,
                desc: 'Chart height in pixels.',
            },
            {
                propName: 'width',
                type: `<code>number</code>`,
                default: `<code>100%</code>`,
                desc: 'Chart width.',
            },
            {
                propName: 'colors',
                type: `<code>string[]</code>`,
                default: `-`,
                desc: 'Custom colors for the chart.',
            },
            {
                propName: 'cohortHeaderText',
                type: `<code>string</code>`,
                default: `<code>"Cohort"</code>`,
                desc: 'Text for the cohort column header.',
            },
            {
                propName: 'sizeLabelText',
                type: `<code>string</code>`,
                default: `<code>"Size"</code>`,
                desc: 'Text for the size/quantity subtitle.',
            },
            {
                propName: 'percentageSuffix',
                type: `<code>string</code>`,
                default: `<code>"%"</code>`,
                desc: 'Suffix for percentage values.',
            },
            {
                propName: 'defaultPeriodText',
                type: `<code>string</code>`,
                default: `<code>"Period"</code>`,
                desc: 'Text prefix for auto-generated time periods.',
            },
        ],
    },
]

const ChartDoc = () => {
    return (
        <DemoLayout
            header={demoHeader}
            demos={demos}
            api={demoApi}
            mdPrefixPath="shared"
        />
    )
}

export default ChartDoc
