import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Progress from '@/components/ui/Progress'
import Table from '@/components/ui/Table'
import Avatar from '@/components/ui/Avatar'
import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import ActionLink from '@/components/shared/ActionLink'
import classNames from '@/utils/classNames'
import { statusMap } from '@/views/apps/projects/ProjectList/utils'
import dayjs from 'dayjs'
import { LiLightbulbCharge } from '@/icons'
import type { ProjectListData } from '../types'

const { Tr, Th, Td, THead, TBody } = Table

type ProjectListSectionProps = {
    data: ProjectListData
}

const ProjectList = ({ data }: ProjectListSectionProps) => {
    const projects = data?.list || []

    return (
        <Card
            bodyClass="p-0"
            header={{
                content: (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="border border-gray-300 rounded-lg p-0.5 inline-flex">
                                <div className="h-8 w-8 flex items-center justify-center heading-text border border-gray-300 rounded-lg">
                                    <LiLightbulbCharge className="text-xl" />
                                </div>
                            </div>
                            <div>
                                <h6 className="font-semibold">Project List</h6>
                            </div>
                        </div>
                        <Button variant="default">View all projects</Button>
                    </div>
                ),
            }}
        >
            <Table hoverable overflow>
                <THead>
                    <Tr>
                        <Th>Project name</Th>
                        <Th>Due task</Th>
                        <Th>Assigne Teams</Th>
                        <Th>Status</Th>
                        <Th>Progress</Th>
                    </Tr>
                </THead>
                <TBody>
                    {projects.map((project) => (
                        <Tr key={project.id}>
                            <Td>
                                <div className="flex items-center gap-2">
                                    <Avatar
                                        src={project.img}
                                        alt={project.name}
                                        size={25}
                                    >
                                        {project.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <ActionLink
                                        themeColor={false}
                                        to={`/apps/projects/${project.id}`}
                                        className="font-medium heading-text"
                                    >
                                        {project.name}
                                    </ActionLink>
                                </div>
                            </Td>
                            <Td>
                                <span>
                                    {dayjs(project.dueDate).format(
                                        'DD MMM YYYY',
                                    )}
                                </span>
                            </Td>
                            <Td>
                                <UsersAvatarGroup
                                    users={project.members}
                                    avatarProps={{
                                        size: 25,
                                        shape: 'circle',
                                    }}
                                />
                            </Td>
                            <Td>
                                <Tag className="bg-transparent gap-1">
                                    <span
                                        className={classNames(
                                            statusMap[project.status]?.color,
                                        )}
                                    >
                                        {statusMap[project.status]?.icon}
                                    </span>
                                    {statusMap[project.status]?.label || ''}
                                </Tag>
                            </Td>
                            <Td>
                                <div className="flex items-center gap-2">
                                    <Progress
                                        showInfo={false}
                                        percent={project.progress}
                                        className="flex-1"
                                        size="sm"
                                    />
                                    <span className="font-medium heading-text">
                                        {project.progress}%
                                    </span>
                                </div>
                            </Td>
                        </Tr>
                    ))}
                </TBody>
            </Table>
        </Card>
    )
}

export default ProjectList
