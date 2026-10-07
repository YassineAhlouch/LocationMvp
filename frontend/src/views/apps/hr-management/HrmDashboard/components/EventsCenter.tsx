import { useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import Popover from '@/components/ui/Popover'
import Calendar from '@/components/ui/Calendar'
import Scroll from '@/components/ui/Scroll'
import { colors } from '@/constants/colors.constant'
import {
    LiMessageQuestion,
    LiLikeBadge,
    LiMessages,
    LiBell,
    LiDocumentText,
    LiUserAdd,
    LiCake,
    LiAward,
    LiNotification,
    LiBriefcase,
    LiCalendar,
    LiSetting2,
    LiProfiles,
} from '@/icons'
import classNames from '@/utils/classNames'
import dayjs from 'dayjs'
import type { ActionsData, ActionItem, ActionCategory } from '../types'

type EventsCenterProps = {
    data: ActionsData
}

const categoryConfig: Record<
    ActionCategory,
    { icon: React.ReactNode; label: string }
> = {
    schedule: {
        icon: <LiCalendar />,
        label: 'Schedule',
    },
    system: {
        icon: <LiSetting2 />,
        label: 'System',
    },
    employees: {
        icon: <LiProfiles />,
        label: 'Employees',
    },
}

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'interview':
            return <LiMessageQuestion />
        case 'performance_review':
            return <LiLikeBadge />
        case 'meeting':
            return <LiMessages />
        case 'system_update':
            return <LiSetting2 />
        case 'policy_change':
            return <LiDocumentText />
        case 'training_notification':
            return <LiBell />
        case 'leave_request':
            return <LiBriefcase />
        case 'onboarding':
            return <LiUserAdd />
        case 'birthday':
            return <LiCake />
        case 'work_anniversary':
            return <LiAward />
        case 'offer_approval':
            return <LiNotification />
        default:
            return <LiCalendar />
    }
}

const EventsCenter = ({ data }: EventsCenterProps) => {
    const { events } = data
    const [open, setOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState(dayjs(new Date()).toDate())

    const groupedEvents = useMemo(() => {
        const groups: Record<ActionCategory, ActionItem[]> = {
            schedule: [],
            system: [],
            employees: [],
        }

        events.forEach((event) => {
            groups[event.category].push(event)
        })

        return groups
    }, [events])

    const handleDateChange = (date: Date) => {
        setSelectedDate(date)
        setOpen(false)
    }

    const renderEvent = (event: ActionItem) => (
        <div
            key={event.id}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-pointer overflow-hidden"
            role="button"
        >
            <div className="w-8 h-8 shrink-0 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 flex items-center justify-center">
                <span className="heading-text text-lg">
                    {getTypeIcon(event.type)}
                </span>
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0 overflow-hidden">
                        <p className="font-medium text-sm heading-text truncate">
                            {event.title}
                        </p>
                        {event.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                                {event.description}
                            </p>
                        )}
                    </div>
                    {event.status === 'urgent' && (
                        <Tag
                            className={classNames(
                                colors.red.iconBg,
                                colors.red.iconText,
                                'border-0 shrink-0',
                            )}
                        >
                            Urgent
                        </Tag>
                    )}
                </div>
            </div>
        </div>
    )

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h5>Events Center</h5>
                <Popover
                    renderTrigger={
                        <button className="h-9 w-9 flex flex-col gap-4 items-center justify-center rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <span className="text-[10px] leading-0 font-medium text-primary">
                                {dayjs(selectedDate).format('ddd')}
                            </span>
                            <span className="font-semibold heading-text leading-0">
                                {dayjs(selectedDate).format('DD')}
                            </span>
                        </button>
                    }
                    open={open}
                    placement="bottom-end"
                    onOpenChange={setOpen}
                    style={{ width: 280 }}
                >
                    <Calendar
                        value={selectedDate}
                        onChange={(date) => handleDateChange(date as Date)}
                    />
                </Popover>
            </div>
            <Scroll
                className="max-h-[860px]"
                scrollbars="vertical"
                contentClassName="!block"
            >
                <div className="space-y-4">
                    {(Object.keys(groupedEvents) as ActionCategory[]).map(
                        (category) => {
                            const categoryEvents = groupedEvents[category]
                            if (categoryEvents.length === 0) return null

                            const config = categoryConfig[category]

                            return (
                                <div key={category}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div
                                            className={classNames(
                                                'flex items-center gap-1.5 shrink-0',
                                            )}
                                        >
                                            <span className="heading-text text-base">
                                                {config.icon}
                                            </span>
                                            <h6 className="font-semibold">
                                                {config.label}
                                            </h6>
                                        </div>
                                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                                    </div>
                                    <div className="space-y-1">
                                        {categoryEvents
                                            .slice(0, 5)
                                            .map(renderEvent)}
                                    </div>
                                </div>
                            )
                        },
                    )}
                </div>
            </Scroll>
        </Card>
    )
}

export default EventsCenter
