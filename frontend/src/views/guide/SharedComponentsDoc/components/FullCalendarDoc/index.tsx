import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import CustomRender from './CustomRender'

const mdPath = 'FullCalendarDoc'

const demoHeader = {
    title: 'FullCalendar',
    desc: 'A full-featured calendar component with month, week, day, year, and agenda views. Supports drag-and-drop event management.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage of FullCalendar with events. The calendar supports multiple views and event interactions.`,
        component: <Basic />,
    },
    {
        mdName: 'CustomRender',
        mdPath: mdPath,
        title: 'Custom Render',
        desc: `Customize the calendar header and event rendering using <code>renderHeaderStart</code>, <code>renderHeaderEnd</code>, and <code>renderEvent</code> props.`,
        component: <CustomRender />,
    },
]

const demoApi = [
    {
        component: 'FullCalendar',
        api: [
            {
                propName: 'events',
                type: `<code>{ id: number; startDate: string; endDate: string; title: string; color: string; description: string; type: string; disabled?: boolean }[]</code>`,
                default: `-`,
                desc: 'Array of calendar events to display',
            },
            {
                propName: 'onCellClick',
                type: `<code>(date: Date) => void</code>`,
                default: `-`,
                desc: 'Callback when a calendar cell is clicked',
            },
            {
                propName: 'onEventClick',
                type: `<code>(event: { id: number; startDate: string; endDate: string; title: string; color: string; description: string; type: string; disabled?: boolean }) => void</code>`,
                default: `-`,
                desc: 'Callback when an event is clicked',
            },
            {
                propName: 'onChange',
                type: `<code>(events: { id: number; startDate: string; endDate: string; title: string; color: string; description: string; type: string; disabled?: boolean }[], event: { id: number; startDate: string; endDate: string; title: string; color: string; description: string; type: string; disabled?: boolean }) => void</code>`,
                default: `-`,
                desc: 'Callback when events are modified (e.g., drag and drop)',
            },
            {
                propName: 'onMoreClick',
                type: `<code>(overflowedEvents: { id: number; startDate: string; endDate: string; title: string; color: string; description: string; type: string; disabled?: boolean }[], allEvents: { id: number; startDate: string; endDate: string; title: string; color: string; description: string; type: string; disabled?: boolean }[]) => void</code>`,
                default: `-`,
                desc: 'Callback when "more" link is clicked for overflowed events',
            },
            {
                propName: 'renderEvent',
                type: `<code>(props: { event: { id: number; startDate: string; endDate: string; title: string; color: string; description: string; type: string; disabled?: boolean } }) => { className?: string; content: ReactNode }</code>`,
                default: `-`,
                desc: 'Custom render function for events. Returns an object with content (ReactNode) and optional className.',
            },
            {
                propName: 'renderHeaderStart',
                type: `<code>(payload: { handlePrevious: () => void; handleNext: () => void; selectedDate: Date; setView: (view: CalendarView) => void; setSelectedDate: (date: Date) => void }) => ReactNode | string</code>`,
                default: `-`,
                desc: 'Custom render function for the start section of the calendar header',
            },
            {
                propName: 'renderHeaderEnd',
                type: `<code>(payload: { handlePrevious: () => void; handleNext: () => void; selectedDate: Date; setView: (view: CalendarView) => void; setSelectedDate: (date: Date) => void }) => ReactNode | string</code>`,
                default: `-`,
                desc: 'Custom render function for the end section of the calendar header',
            },
        ],
    },
]

const FullCalendarDoc = () => {
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

export default FullCalendarDoc
