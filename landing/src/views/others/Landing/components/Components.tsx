import Alert from '@/components/svg/components/Alert'
import Avatar from '@/components/svg/components/Avatar'
import Button from '@/components/svg/components/Button'
import UiButton from '@/components/ui/Button'
import Icons from '@/components/svg/components/Icons'
import Dialog from '@/components/svg/components/Dialog'
import Drawer from '@/components/svg/components/Drawer'
import Progress from '@/components/svg/components/Progress'
import Skeleton from '@/components/svg/components/Skeleton'
import Spinner from '@/components/svg/components/Spinner'
import Toast from '@/components/svg/components/Toast'
import Badge from '@/components/svg/components/Badge'
import Calendar from '@/components/svg/components/Calendar'
import Card from '@/components/svg/components/Card'
import Table from '@/components/svg/components/Table'
import Tag from '@/components/svg/components/Tag'
import Timeline from '@/components/svg/components/Timeline'
import Tooltip from '@/components/svg/components/Tooltip'
import Checkbox from '@/components/svg/components/Checkbox'
import DatePicker from '@/components/svg/components/DatePicker'
import FormControl from '@/components/svg/components/FormControl'
import Input from '@/components/svg/components/Input'
import InputGroup from '@/components/svg/components/InputGroup'
import Radio from '@/components/svg/components/Radio'
import Segment from '@/components/svg/components/Segment'
import Select from '@/components/svg/components/Select'
import Switcher from '@/components/svg/components/Switcher'
import TimeInput from '@/components/svg/components/TimeInput'
import Upload from '@/components/svg/components/Upload'
import Dropdown from '@/components/svg/components/Dropdown'
import Menu from '@/components/svg/components/Menu'
import Pagination from '@/components/svg/components/Pagination'
import Steps from '@/components/svg/components/Steps'
import Tabs from '@/components/svg/components/Tabs'
import Carousel from '@/components/svg/components/Carousel'
import Collapsible from '@/components/svg/components/Collapsible'
import Scroll from '@/components/svg/components/Scroll'
import Chart from '@/components/svg/components/Chart'
import FullCalendar from '@/components/svg/components/FullCalendar'
import Gantt from '@/components/svg/components/Gantt'
import RichTextEditor from '@/components/svg/components/RichTextEditor'
import useDemoUrl from '../hooks/useDemoUrl'
import type { LandingComponents } from '../types'
import type { Framework } from '../types'

const componentItems = [
    { id: 'uiDataDisplayAvatar', name: 'Avatar', link: 'avatar', svg: Avatar },
    { id: 'uiCommonButton', name: 'Button', link: 'button', svg: Button },
    { id: 'uiCommonIcons', name: 'Icons', link: 'icons', svg: Icons },
    { id: 'uiFeedbackAlert', name: 'Alert', link: 'alert', svg: Alert },
    { id: 'uiFeedbackDialog', name: 'Dialog', link: 'dialog', svg: Dialog },
    { id: 'uiFeedbackDrawer', name: 'Drawer', link: 'drawer', svg: Drawer },
    {
        id: 'uiFeedbackProgress',
        name: 'Progress',
        link: 'progress',
        svg: Progress,
    },
    {
        id: 'uiFeedbackSkeleton',
        name: 'Skeleton',
        link: 'skeleton',
        svg: Skeleton,
    },
    { id: 'uiFeedbackSpinner', name: 'Spinner', link: 'spinner', svg: Spinner },
    { id: 'uiFeedbackToast', name: 'Toast', link: 'toast', svg: Toast },
    { id: 'uiDataDisplayBadge', name: 'Badge', link: 'badge', svg: Badge },
    {
        id: 'uiDataDisplayCalendar',
        name: 'Calendar',
        link: 'calendar',
        svg: Calendar,
    },
    { id: 'uiDataDisplayCard', name: 'Card', link: 'card', svg: Card },
    { id: 'uiDataDisplayTable', name: 'Table', link: 'table', svg: Table },
    { id: 'uiDataDisplayTag', name: 'Tag', link: 'tag', svg: Tag },
    {
        id: 'uiDataDisplayTimeline',
        name: 'Timeline',
        link: 'timeline',
        svg: Timeline,
    },
    {
        id: 'uiDataDisplayTooltip',
        name: 'Tooltip',
        link: 'tooltip',
        svg: Tooltip,
    },
    {
        id: 'uiFormsCheckbox',
        name: 'Checkbox',
        link: 'checkbox',
        svg: Checkbox,
    },
    {
        id: 'uiFormsDatepicker',
        name: 'Datepicker',
        link: 'datepicker',
        svg: DatePicker,
    },
    {
        id: 'uiFormsFormControl',
        name: 'Form Control',
        link: 'form-control',
        svg: FormControl,
    },
    { id: 'uiFormsInput', name: 'Input', link: 'input', svg: Input },
    {
        id: 'uiFormsInputGroup',
        name: 'Input Group',
        link: 'input-group',
        svg: InputGroup,
    },
    { id: 'uiFormsRadio', name: 'Radio', link: 'radio', svg: Radio },
    { id: 'uiFormsSegment', name: 'Segment', link: 'segment', svg: Segment },
    { id: 'uiFormsSelect', name: 'Select', link: 'select', svg: Select },
    {
        id: 'uiFormsSwitcher',
        name: 'Switcher',
        link: 'switcher',
        svg: Switcher,
    },
    {
        id: 'uiFormsTimePicker',
        name: 'Time Input',
        link: 'time-input',
        svg: TimeInput,
    },
    { id: 'uiFormsUpload', name: 'Upload', link: 'upload', svg: Upload },
    {
        id: 'uiNavigationDropdown',
        name: 'Dropdown',
        link: 'dropdown',
        svg: Dropdown,
    },
    { id: 'uiNavigationMenu', name: 'Menu', link: 'menu', svg: Menu },
    {
        id: 'uiNavigationPagination',
        name: 'Pagination',
        link: 'pagination',
        svg: Pagination,
    },
    { id: 'uiNavigationSteps', name: 'Steps', link: 'steps', svg: Steps },
    { id: 'uiNavigationTabs', name: 'Tabs', link: 'tabs', svg: Tabs },
    {
        id: 'uiDataDisplayCarousel',
        name: 'Carousel',
        link: 'carousel',
        svg: Carousel,
    },
    {
        id: 'uiDataDisplayCollapsible',
        name: 'Collapsible',
        link: 'collapsible',
        svg: Collapsible,
    },
    { id: 'uiDataDisplayScroll', name: 'Scroll', link: 'scroll', svg: Scroll },
    {
        id: 'uiChartsChart',
        name: 'Chart',
        link: 'chart',
        svg: Chart,
        shared: true,
    },
    {
        id: 'uiChartsFullCalendar',
        name: 'Full Calendar',
        link: 'full-calendar',
        svg: FullCalendar,
        shared: true,
    },
    {
        id: 'uiChartsGantt',
        name: 'Gantt',
        link: 'gantt',
        svg: Gantt,
        shared: true,
    },
    {
        id: 'uiRichTextEditor',
        name: 'Rich Text Editor',
        link: 'rich-text-editor',
        svg: RichTextEditor,
        shared: true,
    },
]

const Components = ({
    framework,
    content,
}: {
    framework: Framework
    content: LandingComponents
}) => {
    const url = useDemoUrl(framework)

    return (
        <section
            id="components"
            className="border-t border-gray-200 dark:border-gray-700"
        >
            <div className="max-w-7xl mx-auto border-r border-l border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-12 py-24">
                    <div className="col-span-1" />
                    <div className="col-span-10">
                        <div className="flex items-center justify-between">
                            <h3 className="leading-snug">
                                <span>{content.heading}</span>
                            </h3>
                            <p className="text-slate-400 mt-2 text-lg max-w-112.5">
                                {content.subheading}
                            </p>
                        </div>
                    </div>
                    <div className="col-span-1" />
                </div>
                <div className="grid grid-cols-12 pb-24">
                    <div className="col-span-1" />
                    <div className="col-span-10 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-24">
                            {componentItems.map((item) => {
                                const Svg = item.svg as React.FC<{
                                    width: number
                                    height: number
                                    className?: string
                                }>
                                return (
                                    <a
                                        href={`${url}${item.shared ? 'guide/shared-component-doc' : 'ui-components'}/${item.link}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        key={item.id}
                                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-1 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700/20 hover:border-gray-300 dark:hover:border-gray-600 transition ease-in duration-150"
                                    >
                                        <div className="rounded-lg h-36 bg-gray-50 dark:bg-gray-800">
                                            <Svg
                                                width={244}
                                                height={144}
                                                className="mx-auto"
                                            />
                                        </div>
                                        <div className="px-2 py-2">
                                            <span className="heading-text font-semibold">
                                                {item.name}
                                            </span>
                                        </div>
                                    </a>
                                )
                            })}
                        </div>
                        <div className="absolute -bottom-2 left-0 w-full h-60 bg-linear-to-t from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 dark:to-transparent flex items-end justify-center">
                            <UiButton
                                asElement="a"
                                href={`${url}/guide/shared-component-doc/action-link`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                And More
                            </UiButton>
                        </div>
                    </div>
                    <div className="col-span-1" />
                </div>
            </div>
        </section>
    )
}

export default Components
