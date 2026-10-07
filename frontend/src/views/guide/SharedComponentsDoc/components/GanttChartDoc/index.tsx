import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import CustomRender from './CustomRender'
import WithColumns from './WithColumns'
import ViewModes from './ViewModes'

const mdPath = 'GanttChartDoc'

const demoHeader = {
    title: 'Gantt',
    desc: 'A Gantt chart component for visualizing project timelines, tasks, and milestones. Supports task dependencies, progress tracking, and interactive editing.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage showing a project with tasks, milestones, and dependencies.`,
        component: <Basic />,
    },
    {
        mdName: 'CustomRender',
        mdPath: mdPath,
        title: 'Custom Bar Content',
        desc: `Use the customBarContent prop to render custom content inside task bars with colored indicator dots.`,
        component: <CustomRender />,
    },
    {
        mdName: 'WithColumns',
        mdPath: mdPath,
        title: 'With Columns',
        desc: `Display a task list with custom columns showing assignee, status, and priority.`,
        component: <WithColumns />,
    },
    {
        mdName: 'ViewModes',
        mdPath: mdPath,
        title: 'View Modes',
        desc: `Switch between different time scales: Day, Week, and Month views.`,
        component: <ViewModes />,
    },
]

const demoApi = [
    {
        component: 'Gantt',
        api: [
            {
                propName: 'tasks',
                type: `<code>{ id: string; type: 'task' | 'milestone' | 'project'; name: string; start: Date; end: Date; progress: number; styles?: { progressClass?: string; wrapperClass?: string }; isDisabled?: boolean; project?: string; dependencies?: string[]; hideChildren?: boolean; displayOrder?: number }[]</code>`,
                default: '-',
                desc: 'Array of tasks to display in the Gantt chart.',
            },
            {
                propName: 'columns',
                type: `<code>{ header: string | ReactNode; cell: (task: Task & { expander: ReactNode }) => string | ReactNode; width?: string | number }[] | null</code>`,
                default: '-',
                desc: 'Custom columns to display in the task list. Set to null to hide the task list.',
            },
            {
                propName: 'customBarContent',
                type: `<code>(barTask: BarTask) => ReactNode</code>`,
                default: '-',
                desc: 'Custom content renderer for task bars.',
            },
            {
                propName: 'viewMode',
                type: `<code>'Hour' | 'QuarterDay' | 'Half Day' | 'Day' | 'Week' | 'Month' | 'QuarterYear' | 'Year'</code>`,
                default: `<code>'Day'</code>`,
                desc: 'The time scale view mode of the Gantt chart.',
            },
            {
                propName: 'viewDate',
                type: `<code>Date</code>`,
                default: '-',
                desc: 'Date to scroll to in the view.',
            },
            {
                propName: 'preStepsCount',
                type: `<code>number</code>`,
                default: `<code>1</code>`,
                desc: 'Number of time steps to show before the first task.',
            },
            {
                propName: 'locale',
                type: `<code>string</code>`,
                default: `<code>'en-GB'</code>`,
                desc: 'Locale for date formatting.',
            },
            {
                propName: 'rtl',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Enable right-to-left layout.',
            },
            {
                propName: 'headerHeight',
                type: `<code>number</code>`,
                default: `<code>70</code>`,
                desc: 'Height of the calendar header in pixels.',
            },
            {
                propName: 'gridColumnsWidth',
                type: `<code>number</code>`,
                default: `<code>100</code>`,
                desc: 'Width of each time column in pixels.',
            },
            {
                propName: 'rowHeight',
                type: `<code>number</code>`,
                default: `<code>50</code>`,
                desc: 'Height of each task row in pixels.',
            },
            {
                propName: 'ganttHeight',
                type: `<code>number</code>`,
                default: `<code>0</code>`,
                desc: 'Fixed height for the Gantt chart. Set to 0 for auto height.',
            },
            {
                propName: 'barCornerRadius',
                type: `<code>number</code>`,
                default: `<code>4</code>`,
                desc: 'Corner radius of task bars.',
            },
            {
                propName: 'barFill',
                type: `<code>number</code>`,
                default: `<code>60</code>`,
                desc: 'Percentage of row height filled by the task bar.',
            },
            {
                propName: 'handleWidth',
                type: `<code>number</code>`,
                default: `<code>8</code>`,
                desc: 'Width of the resize handles on task bars.',
            },
            {
                propName: 'barProgressClass',
                type: `<code>string</code>`,
                default: `<code>'fill-primary'</code>`,
                desc: 'CSS class for task progress fill.',
            },
            {
                propName: 'barWrapperClass',
                type: `<code>string</code>`,
                default: `<code>'fill-[#b8c2cc]'</code>`,
                desc: 'CSS class for task bar background.',
            },
            {
                propName: 'projectProgressClass',
                type: `<code>string</code>`,
                default: `<code>'fill-primary'</code>`,
                desc: 'CSS class for project progress fill.',
            },
            {
                propName: 'projectWrapperClass',
                type: `<code>string</code>`,
                default: `<code>'fill-[#b8c2cc]'</code>`,
                desc: 'CSS class for project bar background.',
            },
            {
                propName: 'milestoneClass',
                type: `<code>string</code>`,
                default: `<code>'fill-primary'</code>`,
                desc: 'CSS class for milestone markers.',
            },
            {
                propName: 'arrowClass',
                type: `<code>string</code>`,
                default: `<code>'grey'</code>`,
                desc: 'CSS class for dependency arrows.',
            },
            {
                propName: 'arrowIndent',
                type: `<code>number</code>`,
                default: `<code>20</code>`,
                desc: 'Indentation for dependency arrows.',
            },
            {
                propName: 'todayColor',
                type: `<code>string</code>`,
                default: `<code>'#fafafa'</code>`,
                desc: 'Background color for the current day column.',
            },
            {
                propName: 'timeStep',
                type: `<code>number</code>`,
                default: `<code>300000</code>`,
                desc: 'Time step in milliseconds for drag operations.',
            },
            {
                propName: 'TooltipContent',
                type: `<code>React.FC<{ task: Task }></code>`,
                default: `<code>StandardTooltipContent</code>`,
                desc: 'Custom tooltip component for task hover.',
            },
            {
                propName: 'onSelect',
                type: `<code>(task: Task, isSelected: boolean) => void</code>`,
                default: '-',
                desc: 'Callback when a task is selected or deselected.',
            },
            {
                propName: 'onDoubleClick',
                type: `<code>(task: Task) => void</code>`,
                default: '-',
                desc: 'Callback when a task is double-clicked.',
            },
            {
                propName: 'onClick',
                type: `<code>(task: Task) => void</code>`,
                default: '-',
                desc: 'Callback when a task is clicked.',
            },
            {
                propName: 'onDateChange',
                type: `<code>(task: Task, children: Task[]) => void | boolean | Promise<void | boolean></code>`,
                default: '-',
                desc: 'Callback when task dates are changed. Return false to cancel.',
            },
            {
                propName: 'onProgressChange',
                type: `<code>(task: Task, children: Task[]) => void | boolean | Promise<void | boolean></code>`,
                default: '-',
                desc: 'Callback when task progress is changed. Return false to cancel.',
            },
            {
                propName: 'onDelete',
                type: `<code>(task: Task) => void | boolean | Promise<void | boolean></code>`,
                default: '-',
                desc: 'Callback when a task is deleted. Return false to cancel.',
            },
            {
                propName: 'onExpanderClick',
                type: `<code>(task: Task) => void</code>`,
                default: '-',
                desc: 'Callback when a project expander is clicked.',
            },
        ],
    },
]

const GanttChartDoc = () => {
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

export default GanttChartDoc
