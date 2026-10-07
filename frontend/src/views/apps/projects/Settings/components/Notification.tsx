import { useState } from 'react'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Card from '@/components/ui/Card'
import Collapsible from '@/components/ui/Collapsible'
import SettingsHeader from './SettingsHeader'
import { notificationCategorys } from '../utils'
import useProjectSettingData from '../hooks/useProjectSettingData'
import {
    LiCalendar,
    LiProfiles,
    LiShield,
    LiRocket,
    LiDollarSquare,
    LiChevronDown,
    LiChevronUp,
} from '@/icons'

const iconMap: Record<string, React.ReactNode> = {
    project: <LiCalendar />,
    team: <LiProfiles />,
    security: <LiShield />,
    deployment: <LiRocket />,
    billing: <LiDollarSquare />,
}

const Notification = () => {
    const { data, setData } = useProjectSettingData()

    const [expanded, setExpanded] = useState<string[]>([
        'project',
        'team',
        'security',
        'deployment',
        'billing',
    ])

    const handleCheckboxChange = (
        categoryId: string,
        eventId: string,
        checked: string[],
    ) => {
        if (data) {
            const updatedCategories = data.notification.list.map((category) => {
                if (category.id === categoryId) {
                    const updatedEvents = category.events.map((event) => {
                        if (event.id === eventId) {
                            return { ...event, enabled: checked }
                        }
                        return event
                    })
                    return { ...category, events: updatedEvents }
                }
                return category
            })

            setData((prevData) => {
                return {
                    ...prevData,
                    notification: {
                        ...prevData.notification,
                        list: updatedCategories,
                    },
                }
            })
        }
    }

    return (
        <>
            <div className="space-y-4">
                <SettingsHeader
                    title="Notifications"
                    description="Choose how you want to be notified"
                />
                <div>
                    <Card bodyClass="p-0 divide-y divide-gray-200 dark:divide-gray-800">
                        {data &&
                            data.notification.list.map((category) => (
                                <Collapsible
                                    key={category.id}
                                    open={expanded.includes(category.id)}
                                    className="p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {iconMap[category.id] && (
                                                <span className="heading-text text-xl">
                                                    {iconMap[category.id]}
                                                </span>
                                            )}
                                            <h5>
                                                {
                                                    notificationCategorys[
                                                        category.id
                                                    ].title
                                                }
                                            </h5>
                                        </div>
                                        <div>
                                            {expanded.includes(category.id) ? (
                                                <Button
                                                    variant="subtle"
                                                    className="w-6 h-6"
                                                    icon={<LiChevronUp />}
                                                    size="sm"
                                                    onClick={() =>
                                                        setExpanded(
                                                            expanded.filter(
                                                                (id) =>
                                                                    id !==
                                                                    category.id,
                                                            ),
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <Button
                                                    variant="subtle"
                                                    className="w-6 h-6"
                                                    icon={<LiChevronDown />}
                                                    size="sm"
                                                    onClick={() =>
                                                        setExpanded([
                                                            ...expanded,
                                                            category.id,
                                                        ])
                                                    }
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <Collapsible.Content>
                                        <div className="space-y-4 mt-4">
                                            {category.events.map((event) => (
                                                <div
                                                    key={event.id}
                                                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                                                >
                                                    <div>
                                                        <div className="heading-text font-medium">
                                                            {event.title}
                                                        </div>
                                                        <div>
                                                            {event.description}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Checkbox.Group
                                                            value={
                                                                event.enabled
                                                            }
                                                            onChange={(value) =>
                                                                handleCheckboxChange(
                                                                    category.id,
                                                                    event.id,
                                                                    value,
                                                                )
                                                            }
                                                        >
                                                            <Checkbox value="email">
                                                                Mail
                                                            </Checkbox>
                                                            <Checkbox value="in-app">
                                                                In App
                                                            </Checkbox>
                                                            <Checkbox value="sms">
                                                                SMS
                                                            </Checkbox>
                                                        </Checkbox.Group>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Collapsible.Content>
                                </Collapsible>
                            ))}
                    </Card>
                </div>
            </div>
        </>
    )
}

export default Notification
