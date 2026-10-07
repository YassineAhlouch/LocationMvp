import { mock } from '../MockAdapter'
import wildCardSearch from '@/utils/wildCardSearch'
import sortBy, { Primer } from '@/utils/sortBy'
import paginate from '@/utils/paginate'
import {
    scrumboardColumnData,
    tasksData,
    projectListData,
    projectDetailsData,
    projectSettingsData,
    taskDetailsData,
    projectMetaData,
    projectDashboardData,
    issueData,
} from '../data/projectsData'
import { allTimelineTasks, timelineProjects } from '../data/timelineData'
import { intergrationSettingData } from '../data/accountsData'
import { auditLogData } from '../data/logData'
import { userDetailData } from '../data/usersData'

const boardMembersId = ['3', '2', '4', '7', '1', '10', '9']

mock.onGet('/api/projects/dashboard').reply(() => {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, projectDashboardData])
        }, 500)
    })
})

mock.onGet(`/api/projects`).reply(() => {
    return [200, projectListData]
})

mock.onGet(`/api/projects/scrum-board`).reply(() => {
    const participantMembers = userDetailData.filter((user) =>
        boardMembersId.includes(user.id),
    )

    return [
        200,
        {
            columns: scrumboardColumnData,
            tasks: tasksData.slice(0, 11),
            projectMeta: {
                ...projectMetaData,
                participantMembers,
                allMembers: userDetailData,
            },
        },
    ]
})

mock.onGet(`/api/projects/tasks`).reply(() => {
    const participantMembers = userDetailData.filter((user) =>
        boardMembersId.includes(user.id),
    )

    return [
        200,
        {
            groups: scrumboardColumnData,
            tasks: tasksData,
            projectMeta: {
                ...projectMetaData,
                participantMembers,
                allMembers: userDetailData,
            },
        },
    ]
})

mock.onGet(/\/api\/projects\/tasks\/\d+/).reply(function () {
    return [200, issueData]
})

mock.onGet(new RegExp(`/api/projects/tasks/*`)).reply(function (config) {
    const segement = config.url?.split('/')
    const id = segement?.[segement.length - 1]

    const taskDetail = taskDetailsData.find((details) => details.id === id)

    const task = {
        ...taskDetail,
        ...tasksData.find((task) => task.id === id),
    }

    if (!task) {
        return [404, {}]
    }

    return [200, task]
})

mock.onGet(`/api/projects/scrum-board/members`).reply(() => {
    const participantMembers = userDetailData.filter((user) =>
        boardMembersId.includes(user.id),
    )
    return [
        200,
        {
            participantMembers,
            allMembers: userDetailData,
        },
    ]
})

mock.onGet(`/api/projects/settings`).reply(() => {
    const allMembers = userDetailData.map((user) => {
        const { lastOnline, ...rest } = user
        return {
            ...rest,
            invitedDate: lastOnline,
            invitedBy: 'you',
        }
    })

    const participantMembers = allMembers.filter((user) =>
        boardMembersId.includes(user.id),
    )

    return [
        200,
        {
            ...projectSettingsData,
            participantMembers,
            allMembers,
            integrations: intergrationSettingData,
            invitedMembers: [allMembers[11], allMembers[12]],
        },
    ]
})

mock.onGet(new RegExp(`/api/projects/audit-log`)).reply(function (config) {
    const { pageIndex, pageSize, sortOrder, sortKey, query } = config.params

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data = auditLogData as any[]

    let total = data.length

    if (sortKey && sortOrder) {
        if (sortKey !== 'totalSpending') {
            data.sort(
                sortBy(sortKey, sortOrder === 'desc', (a) =>
                    (a as string).toUpperCase(),
                ),
            )
        } else {
            data.sort(sortBy(sortKey, sortOrder === 'desc', parseInt as Primer))
        }
    }

    if (query) {
        data = wildCardSearch(data, query)
        total = data.length
    }

    data = paginate(data, pageSize, pageIndex)

    const responseData = {
        list: data,
        total: total,
    }

    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, responseData])
        }, 500)
    })
})

// Timeline API endpoints
mock.onGet('/api/projects/timeline').reply(() => {
    const participantMembers = userDetailData.filter((user) =>
        boardMembersId.includes(user.id),
    )

    const { sprints, ...project } = timelineProjects[0]

    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([
                200,
                {
                    projects: {
                        ...project,
                        ...projectMetaData,
                        participantMembers,
                        allMembers: userDetailData,
                    },
                    sprints,
                    tasks: allTimelineTasks,
                    members: participantMembers,
                    total: timelineProjects.length,
                },
            ])
        }, 300)
    })
})

mock.onGet(new RegExp('/api/projects/timeline/*')).reply(function (config) {
    const projectId = config.url?.split('/').pop()

    const project = timelineProjects.find((p) => p.id === projectId)

    if (!project) {
        return [404, { message: 'Project not found' }]
    }

    const projectTasks = allTimelineTasks.filter(
        (task) => task.project === projectId,
    )

    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([
                200,
                {
                    project,
                    tasks: projectTasks,
                    members: project.members,
                },
            ])
        }, 300)
    })
})

mock.onGet(new RegExp(`/api/projects/*`)).reply(function (config) {
    const id = config.url?.split('/')[2]

    const baseProjectData =
        projectListData.find((user) => user.id === id) || projectListData[0]

    const projectDetails = {
        ...baseProjectData,
        ...projectDetailsData,
    }

    return [200, projectDetails]
})
