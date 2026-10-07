import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Progress from '@/components/ui/Progress'
import Tag from '@/components/ui/Tag'
import Badge from '@/components/ui/Badge'
import Tooltip from '@/components/ui/Tooltip'
import Divider from '@/components/shared/Divider'
import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import ActionDropdownList from './ActionDropdown'
import { LiTask } from '@/icons'
import { priorityMap, progressColor, statusMap } from '../utils'
import { TbStar, TbStarFilled } from 'react-icons/tb'
import { Link } from 'react-router'
import classNames from '@/utils/classNames'
import type { Projects, ActionPayload } from '../types'

type GridViewProps = {
    data: Projects
    isLoading?: boolean
    onChange: (payload: ActionPayload) => void
}

const GridView = ({ data, onChange }: GridViewProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.map((project) => (
                <Card
                    key={project.id}
                    bodyClass="flex flex-col justify-between h-full"
                    className="shadow-lg"
                >
                    <div className="flex justify-between">
                        <div className="flex gap-2">
                            <div>
                                <Avatar
                                    src={project.img}
                                    size={25}
                                    className={classNames(
                                        'text-white border-0',
                                    )}
                                />
                            </div>
                            <h6 className="mb-1 font-semibold hover:underline mt-0.5">
                                <Link to={`/apps/projects/${project.id}`}>
                                    {project.name}
                                </Link>
                            </h6>
                        </div>
                        <div>
                            <div className="flex gap-2">
                                <Tooltip
                                    title={
                                        project.favorite
                                            ? 'Remove from favorite'
                                            : 'Mark as favorite'
                                    }
                                >
                                    <button
                                        className="w-6 h-6 flex items-center justify-center text-yellow-500 text-lg"
                                        onClick={() =>
                                            onChange({
                                                type: 'favorite',
                                                id: project.id,
                                                value: !project.favorite,
                                            })
                                        }
                                    >
                                        {project.favorite ? (
                                            <TbStarFilled />
                                        ) : (
                                            <TbStar />
                                        )}
                                    </button>
                                </Tooltip>
                                <ActionDropdownList
                                    status={project.status}
                                    onChange={(status) =>
                                        onChange({
                                            type: 'statusChange',
                                            id: project.id,
                                            status: status,
                                        })
                                    }
                                    onDelete={() =>
                                        onChange({
                                            type: 'delete',
                                            id: project.id,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 space-y-2">
                        <p>{project.description}</p>
                        <div className="heading-text font-medium">
                            <Progress
                                className="w-auto"
                                width={19}
                                size="sm"
                                percent={project.progress}
                                strokeClass={progressColor(project.progress)}
                            />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <div className="flex items-center gap-1 cursor-pointer">
                                    <Tooltip
                                        title={statusMap[project.status].label}
                                    >
                                        <span
                                            className={classNames(
                                                statusMap[project.status].color,
                                            )}
                                        >
                                            {statusMap[project.status].icon}
                                        </span>
                                    </Tooltip>
                                </div>
                                <Divider
                                    orientation="vertical"
                                    className="min-h-3"
                                />
                                <div className="flex items-center gap-1">
                                    <LiTask className="text-base" />
                                    <span className="heading-text leading-none">
                                        {project.tasks.completed}/
                                        {project.tasks.total}
                                    </span>
                                </div>
                                <Divider
                                    orientation="vertical"
                                    className="min-h-3"
                                />
                                <Tag className="py-0.5 px-1 flex items-center gap-1 bg-transparent">
                                    <Badge
                                        className={classNames(
                                            'w-2.5 h-2.5',
                                            priorityMap[project.priority].color,
                                        )}
                                    />
                                    <span>{project.priority}</span>
                                </Tag>
                            </div>
                            <span>
                                <UsersAvatarGroup
                                    avatarGroupProps={{ className: 'flex' }}
                                    users={project.members}
                                    avatarProps={{ size: 22 }}
                                />
                            </span>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}

export default GridView
