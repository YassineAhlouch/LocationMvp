import Tag from '@/components/ui/Tag'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import Progress from '@/components/ui/Progress'
import { statusMap, projectTypeMap } from '../utils'
import { LiCalendar } from '@/icons'
import classNames from '@/utils/classNames'
import dayjs from 'dayjs'
import type { Project } from '../types'
import type { ReactNode } from 'react'

type ProjectDetailsContentProps = {
    data: Project
}

const Field = ({ title, children }: { title: string; children: ReactNode }) => {
    return (
        <div>
            <div className="heading-text font-semibold">{title}</div>
            <div className="mt-2">{children}</div>
        </div>
    )
}

const SummaryPanel = ({ data }: ProjectDetailsContentProps) => {
    return (
        <div className="space-y-8">
            <Field title="Status">
                <Tag className="py-0.5 px-1 gap-1 bg-transparent">
                    <Badge
                        className={classNames(
                            'w-2.5 h-2.5',
                            statusMap[data.status].color,
                        )}
                    />
                    <span>{statusMap[data.status].label}</span>
                </Tag>
            </Field>
            <Field title="Project type">
                <Tag
                    className={classNames(
                        'py-1 px-2 border-0',
                        projectTypeMap[data.projectType].color,
                    )}
                >
                    {projectTypeMap[data.projectType].label}
                </Tag>
            </Field>
            <Field title="Due date">
                <div className="flex items-center gap-2 font-medium">
                    <LiCalendar className="text-lg " />
                    <span className="leading-none">
                        {dayjs(data.dueDate).format('MMM, DD YYYY')}
                    </span>
                </div>
            </Field>
            <Field title="Start date">
                <div className="flex items-center gap-2 font-medium">
                    <LiCalendar className="text-lg " />
                    <span className="leading-none">
                        {dayjs(data.startDate).format('MMM, DD YYYY')}
                    </span>
                </div>
            </Field>
            <Field title="Owner">
                <div className="flex flex-col gap-4 mt-2">
                    {data.stakeholders.map((stakeholder) => (
                        <div
                            key={stakeholder.id}
                            className="flex items-center gap-2"
                        >
                            <Avatar
                                key={stakeholder.id}
                                src={stakeholder.img}
                                shape="circle"
                                size={25}
                            />
                            <div className="leading-none">
                                <div className="heading-text font-medium mb-1">
                                    {stakeholder.name}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Field>
            <Field title="Contributors">
                <div className="flex flex-col gap-4 mt-2">
                    {data.members.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center gap-2"
                        >
                            <Avatar
                                key={member.id}
                                src={member.img}
                                shape="circle"
                                size={25}
                            />
                            <div className="leading-none">
                                <div className="heading-text font-medium mb-1">
                                    {member.name}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Field>
            <Field title="Completion">
                <div className="flex items-center gap-2 w-[60px]">
                    <Progress
                        className="min-w-[150px]"
                        strokeWidth={15}
                        width={19}
                        showInfo={false}
                        size="sm"
                        percent={data.progress}
                    />
                    <span className="heading-text">{data.progress}%</span>
                </div>
            </Field>
        </div>
    )
}

export default SummaryPanel
