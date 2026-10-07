import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Progress from '@/components/ui/Progress'
import Tag from '@/components/ui/Tag'
import Badge from '@/components/ui/Badge'
import Tooltip from '@/components/ui/Tooltip'
import Button from '@/components/ui/Button'
import Divider from '@/components/shared/Divider'
import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import ActionDropdownList from './ActionDropdown'
import { priorityMap, statusMap } from '../utils'
import { TbStar, TbStarFilled } from 'react-icons/tb'
import { Link, useNavigate } from 'react-router'
import classNames from '@/utils/classNames'
import type { Projects, ActionPayload } from '../types'

type ListViewProps = {
    data: Projects
    isLoading?: boolean
    onChange: (payload: ActionPayload) => void
}

const ListView = ({ data, onChange }: ListViewProps) => {
    const navigate = useNavigate()
    return (
        <div className="space-y-4">
            {data.map((project) => (
                <Card key={project.id}>
                    <div className="flex justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <div>
                                    <Avatar
                                        src={project.img}
                                        size={25}
                                        className={classNames(
                                            'text-white border-0',
                                        )}
                                    />
                                </div>
                                <h6 className="mb-1 font-semibold hover:underline">
                                    <Link to={`/apps/projects/${project.id}`}>
                                        {project.name}
                                    </Link>
                                </h6>
                            </div>
                            <p>{project.description}</p>
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
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mt-4">
                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-4">
                            <div className="space-y-1">
                                <div className="font-medium">Members</div>
                                <div className="flex items-center gap-1">
                                    <span>
                                        <UsersAvatarGroup
                                            avatarGroupProps={{
                                                className: 'flex',
                                            }}
                                            users={project.members}
                                            avatarProps={{ size: 22 }}
                                        />
                                    </span>
                                </div>
                            </div>
                            <Divider
                                orientation="vertical"
                                className="h-10 hidden sm:block"
                            />
                            <div className="space-y-1">
                                <div className="font-medium">Progress</div>
                                <div className="flex items-center gap-1">
                                    <Progress
                                        className="w-auto"
                                        variant="circle"
                                        strokeWidth={15}
                                        width={19}
                                        showInfo={false}
                                        size="sm"
                                        percent={project.progress}
                                    />
                                    <span className="heading-text font-semibold">
                                        {project.progress}%
                                    </span>
                                </div>
                            </div>
                            <Divider
                                orientation="vertical"
                                className="h-10 hidden sm:block"
                            />
                            <div className="space-y-1">
                                <div className="font-medium">Tasks</div>
                                <div className="flex items-center gap-1">
                                    <span className="heading-text font-semibold">
                                        {project.tasks.completed}/
                                        {project.tasks.total}
                                    </span>
                                </div>
                            </div>
                            <Divider
                                orientation="vertical"
                                className="h-10 hidden sm:block"
                            />
                            <div className="space-y-1">
                                <div className="font-medium">Priority</div>
                                <div className="flex items-center gap-2">
                                    <Tag className="py-0.5 px-1 flex items-center gap-1 bg-transparent">
                                        <Badge
                                            className={classNames(
                                                'w-2.5 h-2.5',
                                                priorityMap[project.priority]
                                                    .color,
                                            )}
                                        />
                                        <span>{project.priority}</span>
                                    </Tag>
                                </div>
                            </div>
                            <Divider
                                orientation="vertical"
                                className="h-10 hidden sm:block"
                            />
                            <div className="space-y-1 col-span-2 sm:col-span-1">
                                <div className="font-medium">Status</div>
                                <div className="flex items-center gap-1">
                                    <Tag className="py-0.5 px-1 flex items-center gap-1 bg-transparent">
                                        <span
                                            className={classNames(
                                                statusMap[project.status].color,
                                            )}
                                        >
                                            {statusMap[project.status].icon}
                                        </span>
                                        <span>
                                            {statusMap[project.status].label}
                                        </span>
                                    </Tag>
                                </div>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <Button
                                className="w-full sm:w-auto"
                                variant="subtle"
                                onClick={() =>
                                    navigate(`/apps/projects/${project.id}`)
                                }
                            >
                                Details
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}

export default ListView
