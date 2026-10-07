const y = new Date().getFullYear()

const currentDate = new Date()
const today = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
)

const taskDetailsDataSet = [
    {
        attachments: [
            {
                id: 'jubuK7XGp3',
                name: 'mail.jpg',
                src: '/img/others/img-14.jpg',
                size: '36.1kb',
                type: 'jpeg',
            },
            {
                id: 'xsb3HCejCM',
                name: 'Design-brief.pdf',
                src: '',
                size: '55.9kb',
                type: 'pdf',
            },
        ],
        comments: [
            {
                id: 'Wx8FDSsVTg',
                name: 'Arlene Pierce',
                src: '/img/avatars/thumb-6.jpg',
                message: `Hey team! Just saw the new ticket titled "Design Marketing Landing Page for Product X" - wanted to confirm a few things before I get started.`,
                date: '2025-07-07T06:36:00.000Z',
            },
            {
                id: '3AhkqqSFFr',
                name: 'Max Alexander',
                src: '/img/avatars/thumb-3.jpg',
                message: `Yep, that's the one. We're aiming to launch this landing page next sprint to support the Product X campaign. Think bold, modern, and conversion-focused.`,
                date: '2025-07-07T08:13:00.000Z',
            },
            {
                id: '5Hk9xYnM3j',
                name: 'Lucas Greene',
                src: '/img/avatars/thumb-9.jpg',
                message: `Got it. Do we have any copy or wireframes yet, or should I start from scratch?`,
                date: '2025-07-07T09:01:00.000Z',
            },
        ],
        subtasks: [
            {
                id: 'TKT-1118',
                title: 'Gather requirements and confirm page structure',
                description:
                    'Align with PM and dev on content sections, goals, and technical constraints.',
                checked: false,
                status: 'To Do',
                assignee: [
                    {
                        id: '4',
                        name: 'Lucas Greene',
                        email: 'lucasg@pixelhub.io',
                        img: '/img/avatars/thumb-4.jpg',
                    },
                ],
                priority: 'High',
                dueDate: '2025-08-10T00:00:00.000Z',
            },
            {
                id: 'TKT-1110',
                title: 'Conduct usability testing session',
                description:
                    'Gather feedback from users on the latest prototype.',
                checked: false,
                status: 'Under Review',
                assignee: [
                    {
                        id: '9',
                        name: 'Nina Lopez',
                        email: 'nina@pixelhub.io',
                        img: '/img/avatars/thumb-9.jpg',
                    },
                ],
                priority: 'Medium',
                dueDate: '2025-07-17T00:00:00.000Z',
            },
        ],
    },
    {
        attachments: [
            {
                id: 'att-001',
                name: 'Homepage-sketch.jpg',
                src: '/img/others/img-11.jpg',
                size: '48.2kb',
                type: 'jpg',
            },
            {
                id: 'att-002',
                name: 'Brief.docx',
                src: '',
                size: '34.7kb',
                type: 'docx',
            },
        ],
        comments: [
            {
                id: 'com-001',
                name: 'Arlene Pierce',
                src: '/img/avatars/thumb-6.jpg',
                message: `Can someone confirm if the wireframe includes the testimonial section?`,
                date: '2025-07-03T11:00:00.000Z',
            },
            {
                id: 'com-002',
                name: 'Lucas Greene',
                src: '/img/avatars/thumb-4.jpg',
                message: `Yes, it's in the second section after features.`,
                date: '2025-07-03T11:12:00.000Z',
            },
        ],
        subtasks: [
            {
                id: 'TKT-1102',
                title: 'Review design wireframes',
                description: 'Go through the layout and give feedback.',
                status: 'Under Review',
                assignee: [
                    {
                        id: '6',
                        name: 'Arlene Pierce',
                        email: 'arlene@pixelhub.io',
                        img: '/img/avatars/thumb-6.jpg',
                    },
                ],
                priority: 'Medium',
                dueDate: '2025-07-09T00:00:00.000Z',
            },
            {
                id: 'TKT-1109',
                title: 'Sync staging data with production',
                description:
                    'Run scripts to mirror production data to staging environment.',
                status: 'In Progress',
                checked: false,
                assignee: [
                    {
                        id: '7',
                        name: 'Daniel Kim',
                        email: 'daniel@pixelhub.io',
                        img: '/img/avatars/thumb-7.jpg',
                    },
                ],
                priority: 'High',
                dueDate: '2025-07-10T00:00:00.000Z',
            },
            {
                id: 'TKT-1103',
                title: 'Fix login form validation',
                description:
                    'Ensure all required fields have proper validation messages.',
                status: 'In Progress',
                assignee: [
                    {
                        id: '3',
                        name: 'James Howard',
                        email: 'james@pixelhub.io',
                        img: '/img/avatars/thumb-3.jpg',
                    },
                ],
                priority: 'High',
                dueDate: '2025-07-11T00:00:00.000Z',
            },
        ],
    },
    {
        attachments: [
            {
                id: 'att-003',
                name: 'feature-banner.pdf',
                src: '',
                size: '122kb',
                type: 'pdf',
            },
        ],
        comments: [
            {
                id: 'com-003',
                name: 'Max Alexander',
                src: '/img/avatars/thumb-3.jpg',
                message: `We need to decide the main CTA color before moving forward.`,
                date: '2025-07-05T08:00:00.000Z',
            },
        ],
        subtasks: [],
    },
    {
        attachments: [],
        comments: [],
        subtasks: [
            {
                id: 'TKT-1103',
                title: 'Choose CTA colors',
                description:
                    'Pick the primary button color from brand palette.',
                status: 'To Do',
                assignee: [
                    {
                        id: '3',
                        name: 'Max Alexander',
                        email: 'max@pixelhub.io',
                        img: '/img/avatars/thumb-3.jpg',
                    },
                ],
                priority: 'Low',
                dueDate: '2025-07-12T00:00:00.000Z',
            },
            {
                id: 'TKT-1104',
                title: 'Update navigation menu',
                description: 'Reflect new product structure and branding.',
                status: 'In Progress',
                assignee: [
                    {
                        id: '2',
                        name: 'Emily Carter',
                        email: 'emily@pixelhub.io',
                        img: '/img/avatars/thumb-8.jpg',
                    },
                ],
                priority: 'High',
                dueDate: '2025-07-13T00:00:00.000Z',
            },
            {
                id: 'TKT-1108',
                title: 'Add unit tests for dashboard widgets',
                description:
                    'Write test coverage for all major dashboard components.',
                status: 'To Do',
                assignee: [
                    {
                        id: '1',
                        name: 'Sophie Allen',
                        email: 'sophie@pixelhub.io',
                        img: '/img/avatars/thumb-1.jpg',
                    },
                ],
                priority: 'Low',
                dueDate: '2025-07-20T00:00:00.000Z',
            },
        ],
    },
    {
        attachments: [
            {
                id: 'att-004',
                name: 'Logo.svg',
                src: '',
                size: '7.8kb',
                type: 'svg',
            },
        ],
        comments: [
            {
                id: 'com-004',
                name: 'Jasmine Lee',
                src: '/img/avatars/thumb-2.jpg',
                message: `Here's the final logo variant. Please confirm before applying.`,
                date: '2025-07-06T14:24:00.000Z',
            },
        ],
        subtasks: [],
    },
    {
        attachments: [],
        comments: [
            {
                id: 'CMT-2001',
                name: 'Emma Johnson',
                src: '/img/avatars/thumb-2.jpg',
                message:
                    'Started working on the authentication module. Planning to use JWT for token management.',
                date: '2025-06-08T09:00:00.000Z',
            },
            {
                id: 'CMT-2002',
                name: 'Oliver Smith',
                src: '/img/avatars/thumb-5.jpg',
                message: 'Ensure to follow OWASP guidelines for security.',
                date: '2025-06-08T10:15:00.000Z',
            },
        ],
        subtasks: [
            {
                id: 'TKT-1106',
                title: 'Test responsive layout',
                description: 'Check on mobile, tablet, and desktop.',
                status: 'To Do',
                assignee: [
                    {
                        id: '7',
                        name: 'Connor Smith',
                        email: 'connor@pixelhub.io',
                        img: '/img/avatars/thumb-5.jpg',
                    },
                ],
                priority: 'High',
                dueDate: '2025-07-15T00:00:00.000Z',
            },

            {
                id: 'TKT-1105',
                title: 'Replace logo across pages',
                description:
                    'Update the new logo on all landing and internal pages.',
                status: 'To Do',
                assignee: [
                    {
                        id: '5',
                        name: 'Jasmine Lee',
                        email: 'jasmine@pixelhub.io',
                        img: '/img/avatars/thumb-2.jpg',
                    },
                ],
                priority: 'Medium',
                dueDate: '2025-07-14T00:00:00.000Z',
            },
        ],
    },
    {
        attachments: [
            {
                id: 'att-005',
                name: 'analytics-setup.pdf',
                src: '',
                size: '33kb',
                type: 'pdf',
            },
        ],
        comments: [
            {
                id: 'com-005',
                name: 'Emily Carter',
                src: '/img/avatars/thumb-8.jpg',
                message: `Please review GA4 setup details in the attached file.`,
                date: '2025-07-06T10:00:00.000Z',
            },
        ],
        subtasks: [
            {
                id: 'TKT-1107',
                title: 'Set up Google Analytics',
                description: 'Use GA4 with event tracking for button clicks.',
                status: 'In Progress',
                assignee: [
                    {
                        id: '2',
                        name: 'Emily Carter',
                        email: 'emily@pixelhub.io',
                        img: '/img/avatars/thumb-8.jpg',
                    },
                ],
                priority: 'Medium',
                dueDate: '2025-07-17T00:00:00.000Z',
            },
            {
                id: 'TKT-1106',
                title: 'Test payment gateway integration',
                description: 'Verify test transactions and handle error cases.',
                status: 'In Progress',
                assignee: [
                    {
                        id: '8',
                        name: 'Rachel Wang',
                        email: 'rachel@pixelhub.io',
                        img: '/img/avatars/thumb-8.jpg',
                    },
                ],
                priority: 'High',
                dueDate: '2025-07-12T00:00:00.000Z',
            },
            {
                id: 'TKT-1107',
                title: 'Refactor user profile component',
                description:
                    'Simplify logic and split into smaller components.',
                status: 'Under Review',
                assignee: [
                    {
                        id: '4',
                        name: 'Ethan Chen',
                        email: 'ethan@pixelhub.io',
                        img: '/img/avatars/thumb-4.jpg',
                    },
                ],
                priority: 'Medium',
                dueDate: '2025-07-13T00:00:00.000Z',
            },
        ],
    },
    {
        attachments: [],
        comments: [
            {
                id: 'CMT-3001',
                name: 'Sophia Lee',
                src: '/img/avatars/thumb-3.jpg',
                message:
                    'CI/CD pipeline setup is in progress. Integrating with GitHub Actions as well.',
                date: '2025-06-07T14:30:00.000Z',
            },
            {
                id: 'CMT-3002',
                name: 'Lucas Greene',
                src: '/img/avatars/thumb-4.jpg',
                message: 'Remember to add unit tests in the pipeline.',
                date: '2025-06-07T15:00:00.000Z',
            },
        ],
        subtasks: [
            {
                id: 'TKT-1108',
                title: 'Finalize typography system',
                description:
                    'Set consistent heading, body, and caption styles.',
                status: 'Completed',
                assignee: [
                    {
                        id: '6',
                        name: 'Arlene Pierce',
                        email: 'arlene@pixelhub.io',
                        img: '/img/avatars/thumb-6.jpg',
                    },
                ],
                priority: 'Low',
                dueDate: '2025-07-05T00:00:00.000Z',
            },
        ],
    },
    {
        attachments: [],
        comments: [
            {
                id: 'CMT-4001',
                name: 'Liam Brown',
                src: '/img/avatars/thumb-5.jpg',
                message:
                    'Initial draft of the database schema is ready for review.',
                date: '2025-06-06T11:00:00.000Z',
            },
            {
                id: 'CMT-4002',
                name: 'Emma Johnson',
                src: '/img/avatars/thumb-2.jpg',
                message: 'Consider indexing the frequently queried fields.',
                date: '2025-06-06T12:30:00.000Z',
            },
        ],
        subtasks: [
            {
                id: 'TKT-1109',
                title: 'Prepare assets for dev handoff',
                description: 'Organize Figma files and export images.',
                status: 'To Do',
                assignee: [
                    {
                        id: '5',
                        name: 'Jasmine Lee',
                        email: 'jasmine@pixelhub.io',
                        img: '/img/avatars/thumb-2.jpg',
                    },
                ],
                priority: 'High',
                dueDate: '2025-07-18T00:00:00.000Z',
            },
            {
                id: 'TKT-1104',
                title: 'Implement dark mode toggle',
                description:
                    'Add UI and functionality to switch between light and dark themes.',
                status: 'To Do',
                assignee: [
                    {
                        id: '5',
                        name: 'Lena Mendez',
                        email: 'lena@pixelhub.io',
                        img: '/img/avatars/thumb-5.jpg',
                    },
                ],
                priority: 'Medium',
                dueDate: '2025-07-15T00:00:00.000Z',
            },
            {
                id: 'TKT-1105',
                title: 'Update documentation for API v2',
                description:
                    'Document all changes and new endpoints introduced in v2.',
                status: 'To Do',
                assignee: [
                    {
                        id: '2',
                        name: 'Marcus Reid',
                        email: 'marcus@pixelhub.io',
                        img: '/img/avatars/thumb-2.jpg',
                    },
                ],
                priority: 'Low',
                dueDate: '2025-07-18T00:00:00.000Z',
            },
        ],
    },
    {
        attachments: [
            {
                id: 'att-006',
                name: 'mail.jpg',
                src: '/img/others/img-14.jpg',
                size: '36.1kb',
                type: 'jpeg',
            },
            {
                id: 'att-007',
                name: 'Design-brief.pdf',
                src: '',
                size: '55.9kb',
                type: 'pdf',
            },
        ],
        comments: [
            {
                id: 'com-006',
                name: 'Arlene Pierce',
                src: '/img/avatars/thumb-6.jpg',
                message: `Hey team! Just saw the new ticket titled "Design Marketing Landing Page for Product X" - wanted to confirm a few things before I get started.`,
                date: '2025-07-07T06:36:00.000Z',
            },
            {
                id: 'com-007',
                name: 'Max Alexander',
                src: '/img/avatars/thumb-3.jpg',
                message: `Yep, that's the one. We're aiming to launch this landing page next sprint to support the Product X campaign. Think bold, modern, and conversion-focused.`,
                date: '2025-07-07T08:13:00.000Z',
            },
            {
                id: 'com-008',
                name: 'Lucas Greene',
                src: '/img/avatars/thumb-9.jpg',
                message: `Got it. Do we have any copy or wireframes yet, or should I start from scratch?`,
                date: '2025-07-07T09:01:00.000Z',
            },
        ],
        subtasks: [],
    },
    {
        attachments: [],
        comments: [],
        subtasks: [
            {
                id: 'TKT-1111',
                title: 'Proofread final content',
                description: 'Ensure grammar and tone are brand-aligned.',
                status: 'Under Review',
                assignee: [
                    {
                        id: '8',
                        name: 'Noah Taylor',
                        email: 'noah@pixelhub.io',
                        img: '/img/avatars/thumb-1.jpg',
                    },
                ],
                priority: 'Medium',
                dueDate: '2025-07-21T00:00:00.000Z',
            },
            {
                id: 'TKT-1110',
                title: 'Gather requirements and confirm page structure',
                description:
                    'Align with PM and dev on content sections, goals, and technical constraints.',
                status: 'To Do',
                assignee: [
                    {
                        id: '4',
                        name: 'Lucas Greene',
                        email: 'lucasg@pixelhub.io',
                        img: '/img/avatars/thumb-4.jpg',
                    },
                ],
                priority: 'High',
                dueDate: '2025-08-10T00:00:00.000Z',
            },
            {
                id: 'TKT-1103',
                title: 'Fix login form validation',
                description:
                    'Ensure all required fields have proper validation messages.',
                status: 'In Progress',
                assignee: [
                    {
                        id: '3',
                        name: 'James Howard',
                        email: 'james@pixelhub.io',
                        img: '/img/avatars/thumb-3.jpg',
                    },
                ],
                priority: 'High',
                dueDate: '2025-07-11T00:00:00.000Z',
            },
        ],
    },
]

export const projectListData = [
    {
        id: 'proj-001',
        name: 'Marketing Site Revamp',
        client: 'Acme Corp',
        projectType: 'web',
        status: 'active',
        startDate: '2025-05-01T00:00:00.000Z',
        dueDate: '2025-07-15T00:00:00.000Z',
        progress: 60,
        favorite: true,
        img: '/img/thumbs/projects/img-1.jpg',
        description:
            'Redesign of the main site to improve UX and showcase products.',
        members: [
            {
                id: '1',
                name: 'Alice Yang',
                email: 'alice@acme.io',
                img: '/img/avatars/thumb-1.jpg',
            },
            {
                id: '2',
                name: 'Jeremiah Minsk',
                email: 'terrance_moreno@infotech.io',
                img: '/img/avatars/thumb-2.jpg',
            },
            {
                id: '3',
                name: 'Bob Lee',
                email: 'bob@acme.io',
                img: '/img/avatars/thumb-3.jpg',
            },
        ],
        tasks: { total: 20, completed: 12 },
        priority: 'High',
        comments: [
            {
                id: 'cmt-001',
                name: 'Alice Yang',
                src: '/img/avatars/thumb-1.jpg',
                message:
                    'Updated the homepage layout draft. Please review by EOD.',
                date: '2025-06-20T10:15:00Z',
            },
            {
                id: 'cmt-002',
                name: 'Bob Lee',
                src: '/img/avatars/thumb-3.jpg',
                message:
                    'Product showcase carousel needs optimization for mobile.',
                date: '2025-06-21T13:42:00Z',
            },
        ],
    },
    {
        id: 'proj-002',
        name: 'Internal HR Portal',
        client: 'Initech',
        projectType: 'web',
        status: 'onHold',
        startDate: '2025-03-20T00:00:00.000Z',
        dueDate: '2025-08-01T00:00:00.000Z',
        progress: 30,
        favorite: false,
        img: '/img/thumbs/projects/img-2.jpg',
        description:
            'HR portal is on hold pending budget approval and scope updates.',
        members: [
            {
                id: '4',
                name: 'Diana Stone',
                email: 'diana@initech.com',
                img: '/img/avatars/thumb-4.jpg',
            },
            {
                id: '5',
                name: 'Eve Turner',
                email: 'eve@initech.com',
                img: '/img/avatars/thumb-5.jpg',
            },
        ],
        tasks: { total: 10, completed: 3 },
        priority: 'Medium',
        comments: [
            {
                id: 'cmt-003',
                name: 'Diana Stone',
                src: '/img/avatars/thumb-4.jpg',
                message: 'Awaiting feedback from finance for budget release.',
                reactions: [],
                replies: [],
                date: '2025-06-10T08:30:00Z',
            },
            {
                id: 'cmt-004',
                name: 'Eve Turner',
                src: '/img/avatars/thumb-5.jpg',
                message: 'Updated scope draft uploaded to Drive.',
                reactions: [],
                replies: [],
                date: '2025-06-11T17:45:00Z',
            },
        ],
    },
    {
        id: 'proj-003',
        name: 'Mobile App MVP',
        client: 'BetaSoft',
        projectType: 'mobile',
        status: 'completed',
        startDate: '2025-01-10T00:00:00.000Z',
        dueDate: '2025-04-30T00:00:00.000Z',
        progress: 100,
        favorite: true,
        img: '/img/thumbs/projects/img-3.jpg',
        description:
            'Initial mobile app delivered with onboarding and essential features.',
        members: [
            {
                id: '6',
                name: 'Frank Moore',
                email: 'frank@betasoft.io',
                img: '/img/avatars/thumb-6.jpg',
            },
            {
                id: '7',
                name: 'Grace Liu',
                email: 'grace@betasoft.io',
                img: '/img/avatars/thumb-7.jpg',
            },
            {
                id: '8',
                name: 'Heidi Scott',
                email: 'heidi@betasoft.io',
                img: '/img/avatars/thumb-8.jpg',
            },
            {
                id: '9',
                name: 'Ivan Brock',
                email: 'ivan@betasoft.io',
                img: '/img/avatars/thumb-9.jpg',
            },
        ],
        tasks: { total: 25, completed: 25 },
        priority: 'High',
        comments: [
            {
                id: 'cmt-005',
                name: 'Grace Liu',
                src: '/img/avatars/thumb-7.jpg',
                message: 'Client confirmed delivery and approved invoice.',
                reactions: [],
                replies: [],
                date: '2025-05-02T11:00:00Z',
            },
            {
                id: 'cmt-006',
                name: 'Ivan Brock',
                src: '/img/avatars/thumb-9.jpg',
                message: 'Please archive the Figma designs as final.',
                reactions: [],
                replies: [],
                date: '2025-05-03T09:25:00Z',
            },
        ],
    },
    {
        id: 'proj-004',
        name: 'CRM Integration',
        client: 'Delta Inc',
        projectType: 'data',
        status: 'archived',
        startDate: '2025-02-15T00:00:00.000Z',
        dueDate: '2025-05-15T00:00:00.000Z',
        progress: 10,
        favorite: false,
        img: '/img/thumbs/projects/img-4.jpg',
        description:
            'Project cancelled due to vendor switch and budget changes.',
        members: [
            {
                id: '10',
                name: 'Jack Yuen',
                email: 'jack@delta.io',
                img: '/img/avatars/thumb-10.jpg',
            },
        ],
        tasks: { total: 15, completed: 2 },
        priority: 'Low',
        comments: [
            {
                id: 'cmt-007',
                name: 'Jack Yuen',
                src: '/img/avatars/thumb-10.jpg',
                message:
                    'Archived all repo branches and sent summary to stakeholders.',
                reactions: [],
                replies: [],
                date: '2025-05-20T14:10:00Z',
            },
        ],
    },
    {
        id: 'proj-005',
        name: 'Sales Dashboard',
        client: 'GlobalTech',
        projectType: 'mobile',
        status: 'active',
        startDate: '2025-06-01T00:00:00.000Z',
        dueDate: '2025-09-30T00:00:00.000Z',
        progress: 45,
        favorite: false,
        img: '/img/thumbs/projects/img-5.jpg',
        description:
            'Dashboard to unify sales data and replace old reporting tools.',
        members: [
            {
                id: '11',
                name: 'Kara Boone',
                email: 'kara@globaltech.io',
                img: '/img/avatars/thumb-11.jpg',
            },
            {
                id: '12',
                name: 'Leo Garcia',
                email: 'leo@globaltech.io',
                img: '/img/avatars/thumb-12.jpg',
            },
            {
                id: '13',
                name: 'Mia Zhang',
                email: 'mia@globaltech.io',
                img: '/img/avatars/thumb-13.jpg',
            },
        ],
        tasks: { total: 18, completed: 8 },
        priority: 'Medium',
        comments: [
            {
                id: 'cmt-008',
                name: 'Mia Zhang',
                src: '/img/avatars/thumb-13.jpg',
                message: 'Backend API integration for reports is halfway done.',
                reactions: [],
                replies: [],
                date: '2025-06-25T10:00:00Z',
            },
            {
                id: 'cmt-009',
                name: 'Leo Garcia',
                src: '/img/avatars/thumb-12.jpg',
                message: 'UI draft for the dashboard is ready for review.',
                reactions: [],
                replies: [],
                date: '2025-06-26T15:30:00Z',
            },
        ],
    },
    {
        id: 'proj-006',
        name: 'E-Commerce Revamp',
        client: 'ShopLine',
        projectType: 'web',
        status: 'active',
        startDate: '2025-05-20T00:00:00.000Z',
        dueDate: '2025-08-20T00:00:00.000Z',
        progress: 50,
        favorite: true,
        img: '/img/thumbs/projects/img-6.jpg',
        description:
            'Revamping e-commerce platform for better speed and UI polish.',
        members: [
            {
                id: '14',
                name: 'Nina Patel',
                email: 'nina@shopline.io',
                img: '/img/avatars/thumb-14.jpg',
            },
            {
                id: '15',
                name: 'Oscar Wang',
                email: 'oscar@shopline.io',
                img: '/img/avatars/thumb-15.jpg',
            },
        ],
        tasks: { total: 22, completed: 11 },
        priority: 'High',
        comments: [
            {
                id: 'cmt-010',
                name: 'Nina Patel',
                src: '/img/avatars/thumb-14.jpg',
                message:
                    'Homepage performance improvements deployed to staging.',
                date: '2025-06-18T14:20:00Z',
            },
            {
                id: 'cmt-011',
                name: 'Oscar Wang',
                src: '/img/avatars/thumb-15.jpg',
                message:
                    'Still reviewing the mobile cart UI update from last sprint.',
                date: '2025-06-19T09:05:00Z',
            },
        ],
    },
    {
        id: 'proj-007',
        name: 'Analytics Setup',
        client: 'Quantura',
        projectType: 'data',
        status: 'active',
        startDate: '2025-04-01T00:00:00.000Z',
        dueDate: '2025-07-01T00:00:00.000Z',
        progress: 70,
        favorite: false,
        img: '/img/thumbs/projects/img-7.jpg',
        description: 'Setting up analytics pipelines and real-time dashboards.',
        members: [
            {
                id: '16',
                name: 'Paula Reed',
                email: 'paula@quantura.ai',
                img: '/img/avatars/thumb-23.jpg',
            },
            {
                id: '17',
                name: 'Raymond Cho',
                email: 'ray@quantura.ai',
                img: '/img/avatars/thumb-17.jpg',
            },
        ],
        tasks: { total: 14, completed: 10 },
        priority: 'Medium',
        comments: [
            {
                id: 'cmt-012',
                name: 'Raymond Cho',
                src: '/img/avatars/thumb-17.jpg',
                message:
                    'Kafka stream configuration verified, moving to next node.',
                reactions: [],
                replies: [],
                date: '2025-06-17T11:45:00Z',
            },
            {
                id: 'cmt-013',
                name: 'Paula Reed',
                src: '/img/avatars/thumb-23.jpg',
                message: 'Final dashboard mockups shared in Figma board.',
                reactions: [],
                replies: [],
                date: '2025-06-18T17:10:00Z',
            },
        ],
    },
    {
        id: 'proj-008',
        name: 'Brand Guidelines',
        client: 'Nimbus Studio',
        projectType: 'web',
        status: 'completed',
        startDate: '2025-02-01T00:00:00.000Z',
        dueDate: '2025-04-10T00:00:00.000Z',
        progress: 100,
        favorite: false,
        img: '/img/thumbs/projects/img-8.jpg',
        description: 'Completed visual identity and usage rules for branding.',
        members: [
            {
                id: '18',
                name: 'Sophie Lin',
                email: 'sophie@nimbus.studio',
                img: '/img/avatars/thumb-18.jpg',
            },
        ],
        tasks: { total: 12, completed: 12 },
        priority: 'Low',
        comments: [
            {
                id: 'cmt-014',
                name: 'Sophie Lin',
                src: '/img/avatars/thumb-18.jpg',
                message:
                    'Sent final PDF and editable files to client on delivery date.',
                reactions: [],
                replies: [],
                date: '2025-04-10T10:30:00Z',
            },
        ],
    },
    {
        id: 'proj-009',
        name: 'Support Chatbot',
        client: 'Helply',
        projectType: 'web',
        status: 'onHold',
        startDate: '2025-03-01T00:00:00.000Z',
        dueDate: '2025-06-30T00:00:00.000Z',
        progress: 25,
        favorite: true,
        img: '/img/thumbs/projects/img-9.jpg',
        description:
            'AI-powered chatbot in development; paused for training updates.',
        members: [
            {
                id: '19',
                name: 'Tom Nguyen',
                email: 'tom@helply.io',
                img: '/img/avatars/thumb-19.jpg',
            },
            {
                id: '20',
                name: 'Uma Jafari',
                email: 'uma@helply.io',
                img: '/img/avatars/thumb-20.jpg',
            },
        ],
        tasks: { total: 16, completed: 4 },
        priority: 'High',
        comments: [
            {
                id: 'cmt-015',
                name: 'Uma Jafari',
                src: '/img/avatars/thumb-20.jpg',
                message:
                    'Paused development to sync with new ML model version.',
                reactions: [],
                replies: [],
                date: '2025-06-05T08:00:00Z',
            },
            {
                id: 'cmt-016',
                name: 'Tom Nguyen',
                src: '/img/avatars/thumb-19.jpg',
                message: 'Preparing training data export from previous sprint.',
                reactions: [],
                replies: [],
                date: '2025-06-06T16:15:00Z',
            },
        ],
    },
    {
        id: 'proj-010',
        name: 'API Gateway Upgrade',
        client: 'StreamOne',
        projectType: 'data',
        status: 'archived',
        startDate: '2025-01-15T00:00:00.000Z',
        dueDate: '2025-03-20T00:00:00.000Z',
        progress: 95,
        favorite: false,
        img: '/img/thumbs/projects/img-10.jpg',
        description:
            'Infrastructure upgrade completed but replaced by newer stack.',
        members: [
            {
                id: '21',
                name: 'Victor Chan',
                email: 'victor@streamone.io',
                img: '/img/avatars/thumb-21.jpg',
            },
            {
                id: '22',
                name: 'Wendy Ho',
                email: 'wendy@streamone.io',
                img: '/img/avatars/thumb-22.jpg',
            },
        ],
        tasks: { total: 20, completed: 19 },
        priority: 'Medium',
        comments: [
            {
                id: 'cmt-017',
                name: 'Wendy Ho',
                src: '/img/avatars/thumb-22.jpg',
                message: 'Final test case for latency metrics passed QA.',
                reactions: [],
                replies: [],
                date: '2025-03-18T13:50:00Z',
            },
            {
                id: 'cmt-018',
                name: 'Victor Chan',
                src: '/img/avatars/thumb-21.jpg',
                message:
                    'Migration to the new stack has been fully handed over.',
                reactions: [],
                replies: [],
                date: '2025-03-20T09:00:00Z',
            },
        ],
    },
]

export const projectDetailsData = {
    detailDescription: `<div><h6>Project Overview</h6><p>The project aims to revamp the existing Acme Corp marketing site with a more modern, responsive, and conversion-driven design. The new website will reflect updated brand guidelines, improve user experience, and increase lead generation through optimized landing pages. The updated site will not only reflect the company's refreshed brand identity but also enhance the overall user experience through intuitive navigation, improved content hierarchy, and accessible design.</p><br><h6>About the Client</h6><p><strong>Acme Corp</strong> is a global technology provider known for its innovative SaaS solutions in the enterprise productivity space. Their current website was built over five years ago and no longer aligns with their current branding and product positioning. As their product suite has evolved and their brand guidelines have been updated, a new digital experience is essential to better reflect their market position and support their business growth initiatives.</p><br><h6>Goals & Requirements</h6><ul><li>Redesign all key landing pages with a focus on user engagement and conversion.<li>Ensure full responsiveness across desktop, tablet, and mobile devices.<li>Integrate the new design with Acme Corp’s existing CMS (Contentful).<li>Implement modern UI components that are modular and easily reusable.<li>Improve page load performance and SEO score across all pages.<li>Include a lightweight animation layer for interactive sections.</ul></div>`,
    client: {
        id: 'client_001',
        name: 'Acme Corp',
        contactPerson: 'Sarah Gomez',
        email: 'sarah.gomez@acme.io',
        phone: '+1 555-123-4567',
        companyWebsite: 'https://acme.io',
        logo: '/img/clients/acme-logo.png',
        address: '123 Market Street, San Francisco, CA',
    },
    stakeholders: [
        {
            id: 'user_101',
            name: 'Alvin Moreno',
            role: 'Primary Client Contact',
            email: 'sarah.gomez@acme.io',
            img: '/img/avatars/thumb-14.jpg',
        },
    ],
    milestones: [
        {
            id: 'milestone_001',
            title: 'Project Kickoff',
            description:
                'Initial meetings and planning sessions with stakeholders.',
            status: 'Completed',
            checked: true,
            dueDate: '2025-05-05',
        },
        {
            id: 'milestone_002',
            title: 'Wireframes & UX Approval',
            description:
                'Create and get approval for desktop and mobile wireframes.',
            status: 'In Progress',
            checked: false,
            dueDate: '2025-05-20',
        },
        {
            id: 'milestone_003',
            title: 'Development Phase 1',
            description:
                'Build the homepage and product pages using the approved design.',
            status: 'Pending',
            checked: false,
            dueDate: '2025-06-10',
        },
        {
            id: 'milestone_004',
            title: 'QA & Testing',
            description:
                'Perform cross-browser, mobile, and functional testing.',
            status: 'Pending',
            checked: false,
            dueDate: '2025-06-25',
        },
        {
            id: 'milestone_005',
            title: 'Launch',
            description: 'Go live with the redesigned marketing website.',
            status: 'Pending',
            checked: false,
            dueDate: '2025-07-01',
        },
    ],
    attachments: [
        {
            id: 'file_001',
            name: 'wireframes-homepage.pdf',
            uploadedBy: 'Diana Collins',
            uploadedAt: '2025-06-18',
            url: '/files/wireframes-homepage.pdf',
            type: 'pdf',
        },
        {
            id: 'file_002',
            name: 'competitor-analysis.xlsx',
            uploadedBy: 'Garry Davis',
            uploadedAt: '2025-06-10',
            url: '/files/competitor-analysis.xlsx',
            type: 'xlsx',
        },
    ],
    activity: [
        {
            type: 'UPDATE-TICKET',
            dateTime: 1646457321,
            ticket: 'LD-1203',
            status: 1,
            userName: 'Morgan Brooks',
            userImg: '/img/avatars/thumb-6.jpg',
        },
        {
            type: 'COMMENT-MENTION',
            dateTime: 1646456120,
            userName: 'Chloe Zimmerman',
            userImg: '/img/avatars/thumb-2.jpg',
            comment: `<strong>@Morgan</strong> I've pushed the latest changes to the staging branch. Can you review the homepage layout by tomorrow?`,
        },
        {
            type: 'ADD-FILES',
            dateTime: 1646454305,
            userName: 'Elijah Grant',
            userImg: '/img/avatars/thumb-8.jpg',
            files: ['lead-profile.pdf', 'call-summary.docx'],
            ticket: 'LD-1194',
        },
        {
            type: 'CREATE-TICKET',
            dateTime: 1646453002,
            ticket: 'LD-1182',
            userName: 'Stella Hawkins',
        },
        {
            type: 'COMMENT',
            dateTime: 1646451108,
            userName: 'Elijah Grant',
            userImg: '/img/avatars/thumb-8.jpg',
            comment: `I’ve started preparing the demo build for the client meeting next Monday. Will share a preview link by Friday.`,
        },
        {
            type: 'ADD-TAGS',
            dateTime: 1646358120,
            userName: 'Ava Mitchell',
            userImg: '/img/avatars/thumb-5.jpg',
            tags: [
                {
                    value: '1',
                    label: 'High Priority',
                },
                {
                    value: '2',
                    label: 'Data Analysis',
                },
            ],
        },
    ],
}

export const scrumboardColumnData = [
    {
        id: 'todo',
        name: 'To Do',
        color: 'amber',
    },
    {
        id: 'in-progress',
        name: 'In Progress',
        color: 'blue',
    },
    {
        id: 'under-review',
        name: 'Under Review',
        color: 'indigo',
    },
    {
        id: 'completed',
        name: 'Completed',
        color: 'green',
    },
]

export const tasksData = [
    {
        id: 'TKT-1001',
        subject: 'Design landing page',
        columnId: 'in-progress',
        description:
            'Create a responsive landing page design with a clean layout, brand-aligned visuals, and key sections like hero, features, and call-to-action, optimized for all devices',
        cover: '',
        members: [
            {
                id: '4',
                name: 'Lucas Greene',
                email: 'lucasg@pixelhub.io',
                img: '/img/avatars/thumb-4.jpg',
            },
        ],
        tags: ['Design', 'UI/UX', 'Wireframes'],
        priority: 'High',
        attachmentCount: 0,
        taskCount: 1,
        commentCount: 2,
        dueDate: '2025-07-10T00:00:00.000Z',
    },
    {
        id: 'TKT-1002',
        subject: 'Implement authentication flow',
        columnId: 'todo',
        description:
            'Set up email/password authentication and OAuth with proper routing and error handling.',
        cover: '',
        members: [
            {
                id: '2',
                name: 'Emma Johnson',
                email: 'emmaj@pixelhub.io',
                img: '/img/avatars/thumb-2.jpg',
            },
        ],
        tags: ['Development', 'Authentication'],
        priority: 'High',
        attachmentCount: 1,
        taskCount: 3,
        commentCount: 4,
        dueDate: '2025-07-15T00:00:00.000Z',
    },
    {
        id: 'TKT-1003',
        subject: 'Fix mobile layout bug',
        columnId: 'in-progress',
        description:
            'Resolve responsiveness issues in the navigation menu on small screens.',
        cover: '',
        members: [
            {
                id: '3',
                name: 'Liam Wong',
                email: 'liamw@pixelhub.io',
                img: '/img/avatars/thumb-3.jpg',
            },
        ],
        tags: ['Bug', 'UI/UX'],
        priority: 'Medium',
        attachmentCount: 0,
        taskCount: 2,
        commentCount: 1,
        dueDate: '2025-07-08T00:00:00.000Z',
    },
    {
        id: 'TKT-1004',
        subject: 'Write onboarding documentation',
        columnId: 'todo',
        description:
            'Prepare a comprehensive onboarding guide for new developers with setup instructions and best practices.',
        cover: '',
        members: [
            {
                id: '5',
                name: 'Sophia Lee',
                email: 'sophial@pixelhub.io',
                img: '/img/avatars/thumb-5.jpg',
            },
        ],
        tags: ['Documentation'],
        priority: 'Low',
        attachmentCount: 2,
        taskCount: 1,
        commentCount: 0,
        dueDate: '2025-07-20T00:00:00.000Z',
    },
    {
        id: 'TKT-1005',
        subject: 'Set up CI/CD pipeline',
        columnId: 'in-progress',
        description:
            'Integrate GitHub Actions for automated build, test, and deploy processes.',
        cover: '',
        members: [
            {
                id: '6',
                name: 'Daniel Kim',
                email: 'danielk@pixelhub.io',
                img: '/img/avatars/thumb-6.jpg',
            },
            {
                id: '4',
                name: 'Lucas Greene',
                email: 'lucasg@pixelhub.io',
                img: '/img/avatars/thumb-4.jpg',
            },
        ],
        tags: ['DevOps', 'CI/CD'],
        priority: 'High',
        attachmentCount: 1,
        taskCount: 2,
        commentCount: 3,
        dueDate: '2025-07-12T00:00:00.000Z',
    },
    {
        id: 'TKT-1006',
        subject: 'Design dashboard analytics widgets',
        columnId: 'under-review',
        description:
            'Create modern visual components for sales and user activity insights.',
        cover: '',
        members: [
            {
                id: '4',
                name: 'Lucas Greene',
                email: 'lucasg@pixelhub.io',
                img: '/img/avatars/thumb-4.jpg',
            },
        ],
        tags: ['Design'],
        priority: 'Medium',
        attachmentCount: 3,
        taskCount: 4,
        commentCount: 2,
        dueDate: '2025-07-09T00:00:00.000Z',
    },
    {
        id: 'TKT-1007',
        subject: 'Integrate payment gateway',
        columnId: 'in-progress',
        description:
            'Add Stripe integration with subscription support and webhook handling.',
        cover: '',
        members: [
            {
                id: '2',
                name: 'Emma Johnson',
                email: 'emmaj@pixelhub.io',
                img: '/img/avatars/thumb-2.jpg',
            },
        ],
        tags: ['Development', 'Integration'],
        priority: 'High',
        attachmentCount: 1,
        taskCount: 3,
        commentCount: 5,
        dueDate: '2025-07-13T00:00:00.000Z',
    },
    {
        id: 'TKT-1008',
        subject: 'Conduct usability testing',
        columnId: 'under-review',
        description:
            'Test navigation and user flows with selected users and gather feedback.',
        cover: '',
        members: [
            {
                id: '5',
                name: 'Sophia Lee',
                email: 'sophial@pixelhub.io',
                img: '/img/avatars/thumb-5.jpg',
            },
        ],
        tags: ['Research', 'Testing'],
        priority: 'Low',
        attachmentCount: 0,
        taskCount: 2,
        commentCount: 1,
        dueDate: '2025-07-11T00:00:00.000Z',
    },
    {
        id: 'TKT-1009',
        subject: 'Optimize image loading',
        columnId: 'todo',
        description:
            'Implement lazy loading and image compression for performance improvement.',
        cover: '',
        members: [
            {
                id: '6',
                name: 'Daniel Kim',
                email: 'danielk@pixelhub.io',
                img: '/img/avatars/thumb-6.jpg',
            },
        ],
        tags: ['Performance', 'Development'],
        priority: 'Medium',
        attachmentCount: 0,
        taskCount: 1,
        commentCount: 2,
        dueDate: '2025-07-14T00:00:00.000Z',
    },
    {
        id: 'TKT-1010',
        subject: 'Refactor settings page',
        columnId: 'completed',
        description:
            'Improve the settings page structure and move to modular components.',
        cover: '',
        members: [
            {
                id: '3',
                name: 'Liam Wong',
                email: 'liamw@pixelhub.io',
                img: '/img/avatars/thumb-3.jpg',
            },
        ],
        tags: ['Refactor', 'Development'],
        priority: 'Low',
        attachmentCount: 1,
        taskCount: 2,
        commentCount: 0,
        dueDate: '2025-07-06T00:00:00.000Z',
    },
    {
        id: 'TKT-1011',
        subject: 'Deploy to staging',
        columnId: 'completed',
        description:
            'Push latest features and fixes to the staging environment for QA testing.',
        cover: '',
        members: [
            {
                id: '2',
                name: 'Emma Johnson',
                email: 'emmaj@pixelhub.io',
                img: '/img/avatars/thumb-2.jpg',
            },
        ],
        tags: ['DevOps'],
        priority: 'Medium',
        attachmentCount: 1,
        taskCount: 1,
        commentCount: 1,
        dueDate: '2025-07-07T00:00:00.000Z',
    },
    {
        id: 'TKT-1012',
        subject: 'Create dark mode theme',
        columnId: 'todo',
        description:
            'Implement dark mode styling across all pages using CSS variables and theme toggling.',
        cover: '',
        members: [
            {
                id: '3',
                name: 'Liam Wong',
                email: 'liamw@pixelhub.io',
                img: '/img/avatars/thumb-3.jpg',
            },
        ],
        tags: ['UI'],
        priority: 'Medium',
        attachmentCount: 0,
        taskCount: 3,
        commentCount: 2,
        dueDate: '2025-07-18T00:00:00.000Z',
    },
    {
        id: 'TKT-1013',
        subject: 'Add unit tests for user module',
        columnId: 'in-progress',
        description:
            'Write unit tests using Jest and ensure 90%+ code coverage for the user module.',
        cover: '',
        members: [
            {
                id: '6',
                name: 'Daniel Kim',
                email: 'danielk@pixelhub.io',
                img: '/img/avatars/thumb-6.jpg',
            },
        ],
        tags: ['Testing', 'Development'],
        priority: 'High',
        attachmentCount: 1,
        taskCount: 4,
        commentCount: 3,
        dueDate: '2025-07-17T00:00:00.000Z',
    },
    {
        id: 'TKT-1014',
        subject: 'Update user profile UI',
        columnId: 'under-review',
        description:
            'Redesign user profile layout with better spacing, mobile responsiveness, and editable fields.',
        cover: '',
        members: [
            {
                id: '4',
                name: 'Lucas Greene',
                email: 'lucasg@pixelhub.io',
                img: '/img/avatars/thumb-4.jpg',
            },
        ],
        tags: ['Design', 'UI/UX'],
        priority: 'Medium',
        attachmentCount: 2,
        taskCount: 2,
        commentCount: 1,
        dueDate: '2025-07-16T00:00:00.000Z',
    },
    {
        id: 'TKT-1015',
        subject: 'Research competitor features',
        columnId: 'todo',
        description:
            'Analyze top 3 competitors and document key features and user experience highlights.',
        cover: '',
        members: [
            {
                id: '5',
                name: 'Sophia Lee',
                email: 'sophial@pixelhub.io',
                img: '/img/avatars/thumb-5.jpg',
            },
        ],
        tags: ['Research'],
        priority: 'Low',
        attachmentCount: 0,
        taskCount: 1,
        commentCount: 2,
        dueDate: '2025-07-21T00:00:00.000Z',
    },
    {
        id: 'TKT-1016',
        subject: 'Fix 500 error on login API',
        columnId: 'in-progress',
        description:
            'Investigate server logs and resolve the backend issue causing login failures.',
        cover: '',
        members: [
            {
                id: '2',
                name: 'Emma Johnson',
                email: 'emmaj@pixelhub.io',
                img: '/img/avatars/thumb-2.jpg',
            },
        ],
        tags: ['Bug'],
        priority: 'High',
        attachmentCount: 1,
        taskCount: 2,
        commentCount: 4,
        dueDate: '2025-07-11T00:00:00.000Z',
    },
    {
        id: 'TKT-1017',
        subject: 'Translate app to Spanish',
        columnId: 'todo',
        description:
            'Use i18n library to support Spanish translations for all major screens and messages.',
        cover: '',
        members: [
            {
                id: '3',
                name: 'Liam Wong',
                email: 'liamw@pixelhub.io',
                img: '/img/avatars/thumb-3.jpg',
            },
        ],
        tags: ['Localization', 'Development'],
        priority: 'Medium',
        attachmentCount: 2,
        taskCount: 3,
        commentCount: 2,
        dueDate: '2025-07-23T00:00:00.000Z',
    },
    {
        id: 'TKT-1018',
        subject: 'Build activity log component',
        columnId: 'in-progress',
        description:
            'Create a reusable component to display user activity logs with filters and pagination.',
        cover: '',
        members: [
            {
                id: '6',
                name: 'Daniel Kim',
                email: 'danielk@pixelhub.io',
                img: '/img/avatars/thumb-6.jpg',
            },
        ],
        tags: ['Development', 'UI/UX'],
        priority: 'High',
        attachmentCount: 1,
        taskCount: 4,
        commentCount: 3,
        dueDate: '2025-07-19T00:00:00.000Z',
    },
    {
        id: 'TKT-1019',
        subject: 'Review accessibility standards',
        columnId: 'under-review',
        description:
            'Conduct audit for accessibility compliance (WCAG 2.1) and suggest improvements.',
        cover: '',
        members: [
            {
                id: '5',
                name: 'Sophia Lee',
                email: 'sophial@pixelhub.io',
                img: '/img/avatars/thumb-5.jpg',
            },
        ],
        tags: ['Audit'],
        priority: 'Low',
        attachmentCount: 0,
        taskCount: 1,
        commentCount: 1,
        dueDate: '2025-07-22T00:00:00.000Z',
    },
    {
        id: 'TKT-1020',
        subject: 'Update README and setup guide',
        columnId: 'completed',
        description:
            'Add recent environment changes, setup steps, and development scripts to the README.',
        cover: '',
        members: [
            {
                id: '4',
                name: 'Lucas Greene',
                email: 'lucasg@pixelhub.io',
                img: '/img/avatars/thumb-4.jpg',
            },
        ],
        tags: ['Documentation', 'DevOps'],
        priority: 'Medium',
        attachmentCount: 1,
        taskCount: 2,
        commentCount: 0,
        dueDate: '2025-07-05T00:00:00.000Z',
    },
    {
        id: 'TKT-1021',
        subject: 'Fix date picker validation issue',
        columnId: 'completed',
        description:
            'Resolve issue where invalid dates bypass form validation in booking module.',
        cover: '',
        members: [
            {
                id: '2',
                name: 'Emma Johnson',
                email: 'emmaj@pixelhub.io',
                img: '/img/avatars/thumb-2.jpg',
            },
        ],
        tags: ['Bug', 'UI/UX'],
        priority: 'High',
        attachmentCount: 1,
        taskCount: 1,
        commentCount: 2,
        dueDate: '2025-07-06T00:00:00.000Z',
    },
]

export const taskDetailsData = [
    {
        id: 'TKT-1001',
        ...taskDetailsDataSet[0],
    },
    {
        id: 'TKT-1002',
        ...taskDetailsDataSet[1],
    },
    {
        id: 'TKT-1003',
        ...taskDetailsDataSet[2],
    },
    {
        id: 'TKT-1004',
        ...taskDetailsDataSet[3],
    },
    {
        id: 'TKT-1005',
        ...taskDetailsDataSet[4],
    },
    {
        id: 'TKT-1006',
        ...taskDetailsDataSet[5],
    },
    {
        id: 'TKT-1007',
        ...taskDetailsDataSet[6],
    },
    {
        id: 'TKT-1008',
        ...taskDetailsDataSet[7],
    },
    {
        id: 'TKT-1009',
        ...taskDetailsDataSet[8],
    },
    {
        id: 'TKT-1010',
        ...taskDetailsDataSet[9],
    },
    {
        id: 'TKT-1011',
        ...taskDetailsDataSet[10],
    },
    {
        id: 'TKT-1012',
        ...taskDetailsDataSet[0],
    },
    {
        id: 'TKT-1013',
        ...taskDetailsDataSet[1],
    },
    {
        id: 'TKT-1014',
        ...taskDetailsDataSet[2],
    },
    {
        id: 'TKT-1015',
        ...taskDetailsDataSet[3],
    },
    {
        id: 'TKT-1016',
        ...taskDetailsDataSet[4],
    },
    {
        id: 'TKT-1017',
        ...taskDetailsDataSet[5],
    },
    {
        id: 'TKT-1018',
        ...taskDetailsDataSet[6],
    },
    {
        id: 'TKT-1019',
        ...taskDetailsDataSet[7],
    },
    {
        id: 'TKT-1020',
        ...taskDetailsDataSet[8],
    },
    {
        id: 'TKT-1021',
        ...taskDetailsDataSet[9],
    },
]

export const projectMetaData = {
    id: '',
    title: 'Sprint #06',
    description: 'Sprint 06 — interface improvements • Oct 15 - Nov 5',
}

export const issueData = {
    ticketId: '#PD-127',
    title: 'API not working',
    createdBy: 'Angelina Gotelli',
    underProject: 'Sprint 2',
    status: 'In progress',
    priority: 'High',
    description: `<p>Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.</p>
	<p>Enslave the hooman pounce on unsuspecting person or tuxedo cats always looking dapper yet poop on grasses or growl at dogs in my sleep but love blinks and purr purr purr purr yawn.</p>
	<p>Decide to want nothing to do with my owner today being gorgeous with belly side up claw your carpet in places everyone can see - why hide my amazing artistic clawing skills?</p>
	<p>Bite nose of your human leave fur on owners clothes so scratch my tummy actually i hate you now fight me blow up sofa in 3 seconds.</p>
	`,
    dueDate: 1742795479,
    assignees: [
        {
            id: '2',
            name: 'Jeremiah Minsk',
            email: 'terrance_moreno@infotech.io',
            img: '/img/avatars/thumb-2.jpg',
        },
        {
            id: '3',
            name: 'Max Alexander',
            email: 'ronnie_vergas@infotech.io',
            img: '/img/avatars/thumb-3.jpg',
        },
    ],
    labels: [
        {
            id: '1',
            title: 'Bug',
        },
        {
            id: '2',
            title: 'Live issue',
        },
    ],
    comments: [
        {
            id: 'Wx8FDSsVTg',
            name: 'Arlene Pierce',
            src: '/img/avatars/thumb-6.jpg',
            message:
                'Helvetica 8-bit photo booth tumblr food truck. Enamel pin wolf tousled sartorial, brunch shoreditch skateboard beard helvetica. Plaid typewriter gastropub bespoke.',
            date: new Date(y, 4, 20),
        },
        {
            id: '3AhkqqSFFr',
            name: 'Roberta Horton',
            src: '/img/avatars/thumb-7.jpg',
            message:
                '<strong>@Angelina</strong> One of the main causes of the fall of the Roman Empire was that-lacking zero-they had no way to indicate successful termination of their C programs. ',
            date: new Date(y, 4, 20),
        },
    ],
    attachments: [
        {
            id: 'jubuK7XGp3',
            name: 'mail.jpg',
            src: '/img/others/img-13.jpg',
            size: '36.1kb',
        },
        {
            id: 'NjHJhHeWrG',
            name: 'issue.jpg',
            src: '/img/others/img-16.jpg',
            size: '46.1kb',
        },
    ],
    activity: [
        {
            type: 'UPDATE-TICKET',
            dateTime: 1646580000,
            ticket: 'PD-127',
            status: 1,
            userName: 'Angelina Gotelli',
            userImg: '',
        },
        {
            type: 'COMMENT',
            dateTime: 1646578417,
            userName: 'Arlene Pierce',
            userImg: '/img/avatars/thumb-1.jpg',
            comment: `Helvetica 8-bit photo booth tumblr food truck. Enamel pin wolf tousled sartorial, brunch shoreditch skateboard beard helvetica. Plaid typewriter gastropub bespoke.`,
        },
        {
            type: 'ADD-TAGS',
            dateTime: 1646574027,
            userName: 'Eugene Stewart',
            tags: ['Live Issue', 'Bug'],
        },
        {
            type: 'ADD-FILES',
            dateTime: 1646569123,
            userName: 'Shannon Baker',
            files: ['document.csv'],
            ticket: 'PD-1092',
        },
        {
            type: 'COMMENT-MENTION',
            dateTime: 1646565473,
            userName: 'Roberta Horton',
            userImg: '/img/avatars/thumb-7.jpg',
            comment: `<strong>@Angelina</strong> One of the main causes of the fall of the Roman Empire was that-lacking zero-they had no way to indicate successful termination of their C programs. `,
        },
        {
            type: 'ASSIGN-TICKET',
            dateTime: 1646554397,
            userName: 'Lee Wheeler',
            assignee: 'Alvin Moreno',
            ticket: 'PD-1092',
        },
    ],
}

export const taskBugFix = []

export const projectSettingsData = {
    general: {
        name: 'Appwize',
        slug: 'appwize',
        logo: '',
        status: 'active',
        language: 'en',
        timezone: 'UTC',
        description:
            'A development project for Appwize — a modern application designed to enhance productivity through clean design, efficient architecture, and scalable features.',
    },
    security: {
        apiKeys: [
            {
                id: 'key_01',
                name: 'Primary Backend Key',
                description:
                    'Used by the main backend server to access protected endpoints.',
                token: 'sk_live_7fhd98sdf7sdf7sdf',
                createdAt: '2024-10-01T12:34:56Z',
                lastUsedAt: '2025-06-12T08:15:00Z',
                status: 'active',
                scopes: ['read', 'write', 'deploy'],
                expiresAt: null,
            },
            {
                id: 'key_02',
                name: 'CI/CD Pipeline',
                token: 'sk_live_4kfd82nd72nd82n3',
                description:
                    'Used by GitHub Actions to deploy code to staging and production environments.',
                createdAt: '2024-12-18T09:21:00Z',
                lastUsedAt: '2025-06-10T11:00:00Z',
                status: 'active',
                scopes: ['read', 'deploy'],
                expiresAt: '2025-12-31T23:59:59Z',
            },
            {
                id: 'key_03',
                name: 'Staging Server Key',
                token: 'sk_live_8dfb23jk2sdfg78',
                description:
                    'Temporary key for testing read-only endpoints on the staging server.',
                createdAt: '2024-09-01T07:00:00Z',
                lastUsedAt: null,
                status: 'revoked',
                scopes: ['read'],
                expiresAt: null,
            },
        ],
        whiteList: {
            enabled: ['email', 'in-app', 'sms'],
            list: [
                {
                    id: 'ip_01',
                    ip: '203.0.113.10',
                    label: 'Main Office',
                    description: 'Primary network for internal team access.',
                    addedAt: '2024-11-05T10:15:00Z',
                    createdBy: 'admin@infotech.io',
                },
                {
                    id: 'ip_02',
                    ip: '192.168.1.0/24',
                    label: 'Staging Environment',
                    description: 'Internal subnet used by staging servers.',
                    addedAt: '2025-01-12T08:00:00Z',
                    createdBy: 'devops@infotech.io',
                },
                {
                    id: 'ip_03',
                    ip: '198.51.100.22',
                    label: 'Freelancer Access',
                    description: 'Temporary access for external developer.',
                    addedAt: '2025-03-20T14:30:00Z',
                    createdBy: 'admin@infotech.io',
                },
            ],
        },
    },
    notification: {
        list: [
            {
                id: 'project',
                events: [
                    {
                        id: 'task-changes',
                        title: 'Task assigned / updated / completed',
                        description: 'Get notified about task changes',
                        enabled: ['email', 'in-app'],
                    },
                    {
                        id: 'comments-mentions',
                        title: 'New comment / mention',
                        description: 'When someone comments or mentions you',
                        enabled: ['email', 'in-app'],
                    },
                    {
                        id: 'project-updates',
                        title: 'Project updated',
                        description: 'Status changes, name changes, etc.',
                        enabled: ['email', 'in-app'],
                    },
                    {
                        id: 'milestone-reached',
                        title: 'Milestone reached',
                        description: 'When project milestones are completed',
                        enabled: ['email', 'in-app'],
                    },
                    {
                        id: 'deadline-approaching',
                        title: 'Deadline approaching',
                        description: 'Reminders for upcoming deadlines',
                        enabled: ['email', 'in-app'],
                    },
                ],
            },
            {
                id: 'team',
                events: [
                    {
                        id: 'member-joined',
                        title: 'New member joined / invited',
                        description: 'When team members are added or invited',
                        enabled: ['in-app'],
                    },
                    {
                        id: 'member-role-changed',
                        title: 'Member role changed',
                        description: 'When member permissions are updated',
                        enabled: ['in-app'],
                    },
                    {
                        id: 'member-left',
                        title: 'Member left project',
                        description: 'When team members leave or are removed',
                        enabled: ['email', 'in-app'],
                    },
                    {
                        id: 'team-activity',
                        title: 'Team activity summary',
                        description: 'Daily or weekly team activity digest',
                        enabled: ['email', 'in-app'],
                    },
                ],
            },
            {
                id: 'security',
                events: [
                    {
                        id: 'api-key-activity',
                        title: 'API key used / revoked / expired',
                        description: 'API key activity and security events',
                        enabled: ['email', 'in-app', 'sms'],
                    },
                    {
                        id: 'suspicious-login',
                        title: 'Suspicious login detected',
                        description: 'Unusual login patterns or locations',
                        enabled: ['email', 'in-app', 'sms'],
                    },
                    {
                        id: 'password-changed',
                        title: 'Password changed',
                        description: 'When account password is updated',
                        enabled: ['email', 'in-app', 'sms'],
                    },
                    {
                        id: 'two-factor-changes',
                        title: 'Two-factor authentication changes',
                        description:
                            '2FA enabled, disabled, or recovery codes used',
                        enabled: ['email', 'in-app', 'sms'],
                    },
                    {
                        id: 'failed-login-attempts',
                        title: 'Failed login attempts',
                        description: 'Multiple failed login attempts detected',
                        enabled: ['email', 'in-app'],
                    },
                    {
                        id: 'session-expired',
                        title: 'Session expired',
                        description: 'When user sessions are terminated',
                        enabled: ['email', 'in-app'],
                    },
                ],
            },
            {
                id: 'deployment',
                events: [
                    {
                        id: 'build-status',
                        title: 'Build succeeded / failed',
                        description: 'CI/CD pipeline build results',
                        enabled: ['email', 'in-app'],
                    },
                    {
                        id: 'deployment-status',
                        title: 'New deployment or release',
                        description: 'When code is deployed to production',
                        enabled: ['email', 'in-app'],
                    },
                    {
                        id: 'repository-changes',
                        title: 'Repository changes',
                        description: 'New commits, pull requests, or merges',
                        enabled: ['email', 'in-app'],
                    },
                    {
                        id: 'performance-alerts',
                        title: 'Performance alerts',
                        description: 'High response times or error rates',
                        enabled: ['email', 'in-app'],
                    },
                    {
                        id: 'dependency-updates',
                        title: 'Dependency updates available',
                        description: 'When package dependencies have updates',
                        enabled: ['in-app'],
                    },
                    {
                        id: 'security-vulnerabilities',
                        title: 'Security vulnerabilities found',
                        description:
                            'When security issues are detected in dependencies',
                        enabled: ['in-app'],
                    },
                ],
            },
        ],
    },
    billing: {
        currentPlan: {
            plan: 'Business',
            planDescription: 'Collaboration for growing teams',
            status: 'active',
            billingCycle: 'monthly',
            nextPaymentDate: '2026-07-01T10:00:00Z',
            planDetails: {
                maxProjects: 10,
                maxMembers: 100,
                storage: '100GB',
                support: 'Email support',
            },
            usage: {
                projectsUsed: 5,
                membersUsed: 75,
                storageUsed: '50GB',
            },
            amount: 199,
        },
        paymentMethods: {
            cardId: '1',
            cardHolderName: 'Carolyn Perkins',
            cardType: 'VISA',
            expMonth: '12',
            expYear: '25',
            last4Number: '0392',
            primary: true,
        },
        transactionHistory: [
            {
                id: '#36223',
                item: 'Add on - 300GB quota',
                status: 'pending',
                amount: 39.9,
                date: 1739132800,
            },
            {
                id: '#34283',
                item: 'Monthly subscription plan - Business',
                status: 'paid',
                amount: 199,
                date: 1736790880,
            },
            {
                id: '#32234',
                item: 'Monthly subscription plan - Business',
                status: 'paid',
                amount: 199,
                date: 1734090880,
            },
            {
                id: '#31354',
                item: 'Monthly subscription plan - Business',
                status: 'paid',
                amount: 199,
                date: 1731532800,
            },
            {
                id: '#30234',
                item: 'Monthly subscription plan - Business',
                status: 'paid',
                amount: 199,
                date: 1728974800,
            },
            {
                id: '#29234',
                item: 'Monthly subscription plan - Business',
                status: 'paid',
                amount: 199,
                date: 1726416800,
            },
            {
                id: '#28234',
                item: 'Monthly subscription plan - Business',
                status: 'paid',
                amount: 199,
                date: 1723858800,
            },
            {
                id: '#27234',
                item: 'Monthly subscription plan - Business',
                status: 'paid',
                amount: 199,
                date: 1721300800,
            },
            {
                id: '#26234',
                item: 'Monthly subscription plan - Business',
                status: 'paid',
                amount: 199,
                date: 1718742800,
            },
            {
                id: '#25234',
                item: 'Monthly subscription plan - Business',
                status: 'paid',
                amount: 199,
                date: 1716184800,
            },
        ],
    },
}

export const projectDashboardData = {
    taskDistribution: {
        total: 47,
        projectCount: 6,
        categories: [
            {
                label: 'On Going',
                count: 24,
            },
            {
                label: 'Under Review',
                count: 15,
            },
            {
                label: 'Finish',
                count: 8,
            },
        ],
    },
    performance: {
        projectId: 'proj-006',
        timeRange: '3 Month',
        metric: {
            label: 'Hours Logged',
            total: 1247,
            trend: 8.5,
        },
        chartData: [
            { month: 'Jan', planned: 285, actual: 310 },
            { month: 'Feb', planned: 320, actual: 295 },
            { month: 'Mar', planned: 375, actual: 340 },
            { month: 'Apr', planned: 410, actual: 385 },
        ],
    },
    progress: {
        metrics: [
            {
                label: 'Performing Progress',
                percentage: 89,
                trend: 10.2,
                segments: Array(30)
                    .fill(0)
                    .map((_, i) => (i < 27 ? 1 : 0)),
            },
            {
                label: 'Task Completion',
                percentage: 67,
                trend: 2.2,
                segments: Array(30)
                    .fill(0)
                    .map((_, i) => (i < 20 ? 1 : 0)),
            },
        ],
    },
    timeline: {
        tasks: [
            {
                id: 'proj-001',
                name: 'Marketing Site Revamp',
                start: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
                end: new Date(today.getTime() + 11 * 24 * 60 * 60 * 1000),
                progress: 60,
                type: 'project',
                hideChildren: false,
                meta: {
                    status: 'In Progress',
                    priority: 'High',
                    assignee: [],
                },
                styles: {
                    progressClass: 'fill-[#05aed3]',
                    indicatorColor: '#06b6d4',
                },
            },
            {
                id: 'task-meeting-brief',
                name: 'Meeting Brief Project',
                start: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
                end: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
                progress: 100,
                type: 'task',
                project: 'proj-001',
                meta: {
                    status: 'Completed',
                    priority: 'High',
                    description: 'Initial project kickoff meeting',
                    assignee: [
                        {
                            id: '1',
                            name: 'Alice Yang',
                            email: 'alice@acme.io',
                            img: '/img/avatars/thumb-1.jpg',
                        },
                        {
                            id: '2',
                            name: 'Bob Lee',
                            email: 'bob@acme.io',
                            img: '/img/avatars/thumb-2.jpg',
                        },
                    ],
                },
                styles: {
                    indicatorColor: '#05aed3',
                },
            },
            {
                id: 'task-research-analyze',
                name: 'Research Analyze Content',
                start: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
                end: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
                progress: 60,
                type: 'task',
                project: 'proj-001',
                meta: {
                    status: 'In Progress',
                    priority: 'Medium',
                    description: 'Content research and analysis phase',
                    assignee: [
                        {
                            id: '3',
                            name: 'Charlie Davis',
                            email: 'charlie@acme.io',
                            img: '/img/avatars/thumb-3.jpg',
                        },
                    ],
                },
                styles: {
                    indicatorColor: '#05aed3',
                },
            },
            {
                id: 'task-build-website',
                name: 'Build Website & Mobile Responsive',
                start: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
                end: new Date(today.getTime() + 11 * 24 * 60 * 60 * 1000),
                progress: 30,
                type: 'task',
                project: 'proj-001',
                meta: {
                    status: 'In Progress',
                    priority: 'High',
                    description: 'Full responsive website development',
                    assignee: [
                        {
                            id: '4',
                            name: 'Diana Stone',
                            email: 'diana@acme.io',
                            img: '/img/avatars/thumb-4.jpg',
                        },
                        {
                            id: '5',
                            name: 'Eve Turner',
                            email: 'eve@acme.io',
                            img: '/img/avatars/thumb-5.jpg',
                        },
                    ],
                },
                styles: {
                    indicatorColor: '#05aed3',
                },
            },
            {
                id: 'proj-006',
                name: 'E-Commerce Revamp',
                start: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
                end: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
                progress: 50,
                type: 'project',
                hideChildren: false,
                meta: {
                    status: 'In Progress',
                    priority: 'High',
                    assignee: [],
                },
                styles: {
                    progressClass: 'fill-[#8C62FF]',
                    indicatorColor: '#8b5cf6',
                },
            },
            {
                id: 'task-internal-meeting',
                name: 'Internal Meeting',
                start: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
                end: new Date(today.getTime()),
                progress: 100,
                type: 'task',
                project: 'proj-006',
                meta: {
                    status: 'Completed',
                    priority: 'Medium',
                    assignee: [
                        {
                            id: '6',
                            name: 'Frank Moore',
                            email: 'frank@acme.io',
                            img: '/img/avatars/thumb-6.jpg',
                        },
                        {
                            id: '7',
                            name: 'Grace Liu',
                            email: 'grace@acme.io',
                            img: '/img/avatars/thumb-7.jpg',
                        },
                    ],
                },
                styles: {
                    indicatorColor: '#8C62FF',
                },
            },
            {
                id: 'task-review-feedback',
                name: 'Review & Feedback',
                start: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
                end: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000),
                progress: 80,
                type: 'task',
                project: 'proj-006',
                meta: {
                    status: 'Under Review',
                    priority: 'High',
                    assignee: [
                        {
                            id: '8',
                            name: 'Heidi Scott',
                            email: 'heidi@acme.io',
                            img: '/img/avatars/thumb-8.jpg',
                        },
                    ],
                },
                styles: {
                    indicatorColor: '#8C62FF',
                },
            },
            {
                id: 'task-design-system',
                name: 'Design System',
                start: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
                end: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000),
                progress: 50,
                type: 'task',
                project: 'proj-006',
                meta: {
                    status: 'In Progress',
                    priority: 'Medium',
                    assignee: [
                        {
                            id: '9',
                            name: 'Ivan Brock',
                            email: 'ivan@acme.io',
                            img: '/img/avatars/thumb-9.jpg',
                        },
                        {
                            id: '10',
                            name: 'Jack Yuen',
                            email: 'jack@acme.io',
                            img: '/img/avatars/thumb-10.jpg',
                        },
                    ],
                },
                styles: {
                    indicatorColor: '#8C62FF',
                },
            },
            {
                id: 'task-branding-project',
                name: 'Branding Project',
                start: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
                end: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
                progress: 90,
                type: 'task',
                project: 'proj-006',
                meta: {
                    status: 'Under Review',
                    priority: 'High',
                    assignee: [
                        {
                            id: '11',
                            name: 'Kara Boone',
                            email: 'kara@acme.io',
                            img: '/img/avatars/thumb-11.jpg',
                        },
                    ],
                },
                styles: {
                    indicatorColor: '#8C62FF',
                },
            },
            {
                id: 'proj-003',
                name: 'Mobile App MVP',
                start: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
                end: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000),
                progress: 35,
                type: 'project',
                hideChildren: false,
                meta: {
                    status: 'In Progress',
                    priority: 'High',
                    assignee: [],
                },
                styles: {
                    progressClass: 'fill-[#00c27f]',
                    indicatorColor: '#f59e0b',
                },
            },
            {
                id: 'task-app-design',
                name: 'App Design & Wireframes',
                start: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
                end: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000),
                progress: 80,
                type: 'task',
                project: 'proj-003',
                meta: {
                    status: 'Under Review',
                    priority: 'High',
                    assignee: [
                        {
                            id: '6',
                            name: 'Frank Moore',
                            email: 'frank@betasoft.io',
                            img: '/img/avatars/thumb-6.jpg',
                        },
                    ],
                },
                styles: {
                    indicatorColor: '#00c27f',
                },
            },
            {
                id: 'task-app-development',
                name: 'Core Features Development',
                start: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
                end: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000),
                progress: 20,
                type: 'task',
                project: 'proj-003',
                meta: {
                    status: 'In Progress',
                    priority: 'High',
                    assignee: [
                        {
                            id: '7',
                            name: 'Grace Liu',
                            email: 'grace@betasoft.io',
                            img: '/img/avatars/thumb-7.jpg',
                        },
                        {
                            id: '8',
                            name: 'Heidi Scott',
                            email: 'heidi@betasoft.io',
                            img: '/img/avatars/thumb-8.jpg',
                        },
                    ],
                },
                styles: {
                    indicatorColor: '#00c27f',
                },
            },
            {
                id: 'proj-007',
                name: 'Analytics Setup',
                start: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
                end: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
                progress: 70,
                type: 'project',
                hideChildren: false,
                meta: {
                    status: 'In Progress',
                    priority: 'Medium',
                    assignee: [],
                },
                styles: {
                    progressClass: 'fill-[#fbc13e]',
                    indicatorColor: '#10b981',
                },
            },
            {
                id: 'task-analytics-integration',
                name: 'Analytics Integration',
                start: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
                end: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
                progress: 100,
                type: 'task',
                project: 'proj-007',
                meta: {
                    status: 'Completed',
                    priority: 'High',
                    assignee: [
                        {
                            id: '16',
                            name: 'Paula Reed',
                            email: 'paula@quantura.ai',
                            img: '/img/avatars/thumb-23.jpg',
                        },
                    ],
                },
                styles: {
                    indicatorColor: '#fbc13e',
                },
            },
            {
                id: 'task-dashboard-setup',
                name: 'Dashboard Configuration',
                start: new Date(today.getTime()),
                end: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
                progress: 50,
                type: 'task',
                project: 'proj-007',
                meta: {
                    status: 'In Progress',
                    priority: 'Medium',
                    assignee: [
                        {
                            id: '17',
                            name: 'Raymond Cho',
                            email: 'ray@quantura.ai',
                            img: '/img/avatars/thumb-17.jpg',
                        },
                    ],
                },
                styles: {
                    indicatorColor: '#fbc13e',
                },
            },
        ],
    },
    projects: {
        list: projectListData
            .filter(
                (project) =>
                    !['proj-001', 'proj-003', 'proj-006'].includes(project.id),
            )
            .slice(0, 3)
            .concat([
                projectListData.find((project) => project.id === 'proj-010')!,
                projectListData.find((project) => project.id === 'proj-009')!,
                projectListData.find((project) => project.id === 'proj-008')!,
            ])
            .map((project) => ({
                id: project.id,
                name: project.name,
                dueDate: project.dueDate,
                members: project.members,
                status: project.status,
                progress: project.progress,
                img: project.img,
            })),
    },
}
