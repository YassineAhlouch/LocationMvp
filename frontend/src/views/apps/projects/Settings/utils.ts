export const notificationCategorys: Record<
    string,
    {
        title: string
        description: string
    }
> = {
    project: {
        title: 'Project',
        description: 'Receive notifications related to project activities.',
    },
    team: {
        title: 'Team',
        description: 'Get updates on team activities and changes.',
    },
    security: {
        title: 'Security',
        description: 'Stay informed about security-related events.',
    },
    deployment: {
        title: 'Deployment',
        description: 'Monitor deployment and release updates.',
    },
    billing: {
        title: 'Billing',
        description: 'Get alerts about billing and payment updates.',
    },
}
