import { userDetailData } from './usersData'
import { intergrationSettingData } from './accountsData'

export const NOTIFICATION_TYPES = {
    COMMENT_MENTION: 'COMMENT_MENTION',
    COMMENT: 'COMMENT',
    MEETING_INVITED: 'MEETING_INVITED',
    TASK_ASSIGNED: 'TASK_ASSIGNED',
    FILE_SHARED: 'FILE_SHARED',
    ACCESS_REQUESTED: 'ACCESS_REQUESTED',
    STATUS_UPDATE: 'STATUS_UPDATE',
    SYSTEM: 'SYSTEM',
}

export const NOTIFICATION_CATEGORIES = {
    GENERAL: 'general',
    MENTIONS: 'mentions',
    ARCHIVE: 'archive',
}

export const notificationListData = [
    {
        id: 'notif_001',
        type: 'FILE_SHARED',
        category: 'general',
        actor: {
            id: 'u1',
            name: 'Katelyn',
            avatar: 'thumb-6.jpg',
        },
        entity: {
            type: 'project',
            id: 'proj_001',
            name: 'Orbital',
            image: '/img/thumbs/projects/img-1.jpg',
        },
        payload: {
            department: 'Design',
            attachments: [
                {
                    id: 'att-1',
                    name: 'Team_banner_inspo.jpg',
                    size: '996 KB',
                    fileType: 'jpg',
                    downloadUrl: '/files/team-banner-inspo.jpg',
                },
            ],
        },
        read: false,
        createdAt: '2025-04-12T08:00:00Z',
    },
    {
        id: 'notif_002',
        type: 'COMMENT',
        category: 'general',
        actor: {
            id: 'u2',
            name: 'Zander',
            avatar: 'thumb-4.jpg',
        },
        entity: {
            type: 'project',
            id: 'proj_002',
            name: 'Trackline',
            image: '/img/thumbs/projects/img-2.jpg',
        },
        payload: {
            comment:
                "I think these schedule times will need to update to the users' timezone automatically. Alternatively, sho...",
            department: 'Engineering',
        },
        read: false,
        createdAt: '2025-04-12T08:00:00Z',
    },
    {
        id: 'notif_003',
        type: 'ACCESS_REQUESTED',
        category: 'general',
        actor: {
            id: 'u3',
            name: 'Marcus',
            avatar: 'thumb-8.jpg',
        },
        entity: {
            type: 'project',
            id: 'proj_003',
            name: 'Voltstream',
            image: '/img/thumbs/projects/img-3.jpg',
        },
        payload: {
            department: 'Design',
            requestType: 'edit',
        },
        read: false,
        createdAt: '2025-04-11T04:00:00Z',
    },
    {
        id: 'notif_004',
        type: 'FILE_SHARED',
        category: 'general',
        actor: {
            id: 'u4',
            name: 'Fiona',
            avatar: 'thumb-7.jpg',
        },
        entity: {
            type: 'project',
            id: 'proj_004',
            name: 'Voltstream',
            image: '/img/thumbs/projects/img-3.jpg',
        },
        payload: {
            department: 'Design',
            attachments: [
                {
                    id: 'att-2',
                    name: 'Customer_Data_Q12025.csv',
                    size: '2 MB',
                    fileType: 'xlsx',
                    downloadUrl: '/files/customer-data-q12025.csv',
                },
            ],
        },
        read: false,
        createdAt: '2025-04-11T14:00:00Z',
    },
    {
        id: 'notif_006',
        type: 'MEETING_INVITED',
        category: 'general',
        actor: {
            id: 'u6',
            name: 'Nora Whitfield',
            avatar: 'thumb-3.jpg',
        },
        entity: {
            type: 'meeting',
            id: 'm1',
            name: 'Release Prep Meeting',
        },
        payload: {
            name: 'Release Prep Meeting',
            startTime: '2025-04-12T21:00:00Z',
            endTime: '2025-04-12T22:00:00Z',
        },
        read: false,
        createdAt: '2025-04-12T10:00:00Z',
    },
    {
        id: 'notif_007',
        type: 'TASK_ASSIGNED',
        category: 'general',
        actor: {
            id: 'u7',
            name: 'Elena Cruz',
            avatar: 'thumb-5.jpg',
        },
        entity: {
            type: 'task',
            id: 'task_002',
            name: 'Component Review',
        },
        payload: {
            priority: 'medium',
            dueDate: '2025-04-30T12:00:00Z',
        },
        read: false,
        createdAt: '2025-04-12T09:00:00Z',
    },
    {
        id: 'notif_009',
        type: 'SYSTEM',
        category: 'general',
        actor: null,
        entity: {
            type: 'report',
            id: 'report_001',
            name: 'Daily Report',
        },
        payload: {
            message: 'Please submit your daily report.',
            deadline: '2025-04-12T17:00:00Z',
            priority: 'high',
        },
        read: false,
        createdAt: '2025-04-12T07:00:00Z',
    },
    {
        id: 'notif_005',
        type: 'COMMENT_MENTION',
        category: 'mentions',
        actor: {
            id: 'u5',
            name: 'Jeremy Mills',
            avatar: 'thumb-2.jpg',
        },
        entity: {
            type: 'task',
            id: 'task_001',
            name: 'Project Kickoff',
            image: '/img/thumbs/projects/img-6.jpg',
        },
        payload: {
            comment:
                'Hey @you, can you review the latest design changes? I think we need to adjust the color scheme.',
        },
        read: false,
        createdAt: '2025-04-12T10:00:00Z',
    },
    {
        id: 'notif_010',
        type: 'COMMENT_MENTION',
        category: 'mentions',
        actor: {
            id: 'u8',
            name: 'Liam Chen',
            avatar: 'thumb-9.jpg',
        },
        entity: {
            type: 'project',
            id: 'proj_005',
            name: 'Orbital',
            image: '/img/thumbs/projects/img-1.jpg',
        },
        payload: {
            comment:
                '@you Can you take a look at the API integration? Something seems off with the response handling.',
        },
        read: false,
        createdAt: '2025-04-12T11:30:00Z',
    },
    {
        id: 'notif_011',
        type: 'COMMENT_MENTION',
        category: 'mentions',
        actor: {
            id: 'u9',
            name: 'Sophie Turner',
            avatar: 'thumb-10.jpg',
        },
        entity: {
            type: 'task',
            id: 'task_003',
            name: 'Dashboard Redesign',
            image: '/img/thumbs/projects/img-7.jpg',
        },
        payload: {
            comment:
                'Hey @you, the stakeholders loved your mockups! Can we schedule a call to discuss next steps?',
        },
        read: false,
        createdAt: '2025-04-12T09:15:00Z',
    },
    {
        id: 'notif_012',
        type: 'COMMENT_MENTION',
        category: 'mentions',
        actor: {
            id: 'u2',
            name: 'Zander',
            avatar: 'thumb-4.jpg',
        },
        entity: {
            type: 'project',
            id: 'proj_002',
            name: 'Trackline',
            image: '/img/thumbs/projects/img-2.jpg',
        },
        payload: {
            comment:
                '@you FYI - I pushed the updated components to staging. Let me know if you spot any issues.',
        },
        read: true,
        createdAt: '2025-04-11T16:45:00Z',
    },
    {
        id: 'notif_008',
        type: 'STATUS_UPDATE',
        category: 'archive',
        actor: null,
        entity: {
            type: 'request',
            id: 'req_001',
            name: 'Feature Request',
        },
        payload: {
            status: 'rejected',
            reason: 'Insufficient permissions for this action',
        },
        read: true,
        createdAt: '2025-04-10T10:00:00Z',
    },
    {
        id: 'notif_013',
        type: 'STATUS_UPDATE',
        category: 'archive',
        actor: null,
        entity: {
            type: 'request',
            id: 'req_002',
            name: 'Access Request',
        },
        payload: {
            status: 'approved',
            reason: 'Your request for admin access has been approved.',
        },
        read: true,
        createdAt: '2025-04-08T14:00:00Z',
    },
    {
        id: 'notif_014',
        type: 'TASK_ASSIGNED',
        category: 'archive',
        actor: {
            id: 'u7',
            name: 'Elena Cruz',
            avatar: 'thumb-5.jpg',
        },
        entity: {
            type: 'task',
            id: 'task_004',
            name: 'Q1 Report Review',
        },
        payload: {
            priority: 'high',
            dueDate: '2025-03-31T12:00:00Z',
        },
        read: true,
        createdAt: '2025-03-25T09:00:00Z',
    },
    {
        id: 'notif_015',
        type: 'FILE_SHARED',
        category: 'archive',
        actor: {
            id: 'u1',
            name: 'Katelyn',
            avatar: 'thumb-6.jpg',
        },
        entity: {
            type: 'project',
            id: 'proj_001',
            name: 'Orbital',
            image: '/img/thumbs/projects/img-1.jpg',
        },
        payload: {
            department: 'Design',
            attachments: [
                {
                    id: 'att-3',
                    name: 'Brand_Guidelines_v2.pdf',
                    size: '4.5 MB',
                    fileType: 'pdf',
                    downloadUrl: '/files/brand-guidelines-v2.pdf',
                },
            ],
        },
        read: true,
        createdAt: '2025-03-20T11:00:00Z',
    },
    {
        id: 'notif_016',
        type: 'MEETING_INVITED',
        category: 'archive',
        actor: {
            id: 'u6',
            name: 'Nora Whitfield',
            avatar: 'thumb-3.jpg',
        },
        entity: {
            type: 'meeting',
            id: 'm2',
            name: 'Sprint Retrospective',
        },
        payload: {
            name: 'Sprint Retrospective',
            startTime: '2025-03-15T15:00:00Z',
            endTime: '2025-03-15T16:00:00Z',
        },
        read: true,
        createdAt: '2025-03-14T10:00:00Z',
    },
]

const usersSearchData = userDetailData.map((user) => ({
    id: user.id,
    type: 'user',
    name: user.name,
    email: user.email,
    img: user.img,
}))

const companiesSearchData = intergrationSettingData.map((integration) => ({
    type: 'companies',
    name: integration.name,
    email: `contact@${integration.name.toLowerCase().replace(/\s+/g, '')}.com`,
    img: integration.img,
}))

const quickActionsSearchData = [
    {
        type: 'quickAction',
        title: 'Create Task',
        icon: 'task',
        path: '/apps/projects/tasks',
        shortcut: 'T',
    },
    {
        type: 'quickAction',
        title: 'Open Personal Settings',
        icon: 'settings',
        path: '/apps/accounts/settings/profile',
    },
    {
        type: 'quickAction',
        title: 'Add Person',
        icon: 'person',
        path: '/apps/customers/list',
        shortcut: '⌘3',
    },
    {
        type: 'quickAction',
        title: 'Add Product',
        icon: 'email',
        path: '/apps/sales/order',
        shortcut: 'E',
    },
    {
        type: 'quickAction',
        title: 'Send Feedback',
        icon: 'feedback',
        path: '/apps/customers/helpdesk',
    },
]

const filesSearchData = [
    {
        type: 'files',
        title: 'Q4 Report.pdf',
        fileType: 'PDF Document',
    },
    {
        type: 'files',
        title: 'Marketing Strategy.docx',
        fileType: 'Word Document',
    },
    {
        type: 'files',
        title: 'Budget 2025.xlsx',
        fileType: 'Excel Spreadsheet',
    },
]

export const searchQueryPoolData = [
    ...usersSearchData,
    ...companiesSearchData,
    ...quickActionsSearchData,
    ...filesSearchData,
]

export const tenantListData = [
    {
        id: 'tenant_001',
        name: 'Eyris',
        slug: 'eyris',
        logo: '/img/thumbs/misc/eyris.png',
        role: 'Owner',
        memberCount: 42,
        isDefault: true,
    },
    {
        id: 'tenant_002',
        name: 'Cloudora',
        slug: 'cloudora',
        logo: '/img/thumbs/misc/cloudora.png',
        role: 'Admin',
        memberCount: 24,
        isDefault: false,
    },
    {
        id: 'tenant_003',
        name: 'Nexera',
        slug: 'nexera',
        logo: '/img/thumbs/misc/nexera.png',
        role: 'Member',
        memberCount: 12,
        isDefault: false,
    },
    {
        id: 'tenant_004',
        name: 'Analytix',
        slug: 'analytix',
        logo: '/img/thumbs/misc/analytix.png',
        role: 'Member',
        memberCount: 56,
        isDefault: false,
    },
]
