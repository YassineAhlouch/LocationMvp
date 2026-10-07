function generateTicketConversation({
    ticketId,
    customer,
    support,
    messageContentSetIndex = 1,
}: {
    ticketId: string
    customer: {
        id: string
        name: string
        img?: string
    }
    support: {
        id: string
        name: string
        img?: string
    }
    messageContentSetIndex: number
}) {
    const othersSupports = [
        { id: '1', name: 'Angelina Gotelli', img: '/img/avatars/thumb-1.jpg' },
        { id: '11', name: 'Steve Sutton', img: '/img/avatars/thumb-11.jpg' },
    ]

    const messageContentSet: Record<
        number,
        Array<{
            type: string
            message: string
            sender: string
            otherSupports?: { id: string; name: string; img: string }
            timestamp: string
            attachments?: Array<{ id: string; name: string; type: string }>
        }>
    > = {
        1: [
            {
                type: 'public',
                sender: 'customer',
                message: `
            <p>Hi there,</p>
            <p>I'm having trouble logging into my account. I keep getting an <strong>"Invalid username or password"</strong> error, but I'm sure I'm entering the correct credentials.</p>
            <p>Could you please help me figure out what might be wrong?</p>
            `,
                timestamp: '2025-05-31T09:00:00Z',
            },
            {
                type: 'private',
                sender: 'support',
                message: `
            <p>Customer email seems valid, no lockout or suspicious login attempts detected. Might be a simple password issue — will guide through reset process.</p>
            `,
                timestamp: '2025-05-31T09:01:00Z',
            },
            {
                type: 'public',
                sender: 'support',
                message: `
            <p>Hi,</p>
            <p>Thanks for reaching out! I'm sorry you're experiencing login issues.</p>
            <p>Just to confirm, have you tried clicking the <strong>"Forgot Password"</strong> option on the login page? That usually helps if the password was changed or stored incorrectly by your browser.</p>
            `,
                timestamp: '2025-05-31T09:01:45Z',
            },
            {
                type: 'public',
                sender: 'customer',
                message: `
            <p>Thanks for the quick reply.</p>
            <p>I haven’t tried that yet, but I’ve just submitted the reset request. I’m waiting for the email to arrive.</p>
            <p>How long does it usually take to receive it?</p>
            `,
                timestamp: '2025-05-31T09:03:10Z',
            },
            {
                type: 'public',
                sender: 'support',
                message: `
            <p>No problem!</p>
            <p>The password reset email usually arrives within 1–2 minutes. Please also check your <strong>spam</strong> or <strong>junk</strong> folder just in case it got filtered.</p>
            <p>If you don’t see it soon, let me know and I can send it manually from our system.</p>
            `,
                timestamp: '2025-05-31T09:04:30Z',
            },
            {
                type: 'public',
                sender: 'customer',
                message: `
            <p>Got it, thank you!</p>
            <p>I found the email in my spam folder. I reset the password and I was able to log in successfully.</p>
            <p>Appreciate the help!</p>
            `,
                timestamp: '2025-05-31T09:05:45Z',
            },
            {
                type: 'private',
                sender: 'support',
                message: `
            <p>Issue resolved. Customer successfully reset their password. No further action needed unless they reach out again.</p>
            `,
                otherSupports: othersSupports[0],
                timestamp: '2025-05-31T09:06:10Z',
            },
            {
                type: 'public',
                sender: 'support',
                message: `
            <p>That’s great to hear!</p>
            <p>Happy I could help. If you need anything else or run into any other issues, feel free to contact us anytime.</p>
            <p>Have a wonderful day!</p>
            `,
                timestamp: '2025-05-31T09:06:30Z',
            },
        ],
        2: [
            {
                type: 'public',
                sender: 'customer',
                message: `
            <p>Hello,</p>
            <p>I recently upgraded my plan, but I don’t see the additional features unlocked in my dashboard. Is there a delay in activation?</p>
            `,
                timestamp: '2025-05-31T10:00:00Z',
            },
            {
                type: 'private',
                sender: 'support',
                message: `
            <p>Checked customer ID in the billing system. Payment went through successfully this morning. Feature flag may not have synced. Will refresh manually.</p>
            `,
                timestamp: '2025-05-31T10:01:00Z',
            },
            {
                type: 'public',
                sender: 'support',
                message: `
            <p>Hi there,</p>
            <p>Thanks for reaching out. Your payment did go through, but it looks like the upgrade didn’t sync correctly. I’ve just refreshed it on our end — can you try logging out and back in?</p>
            `,
                timestamp: '2025-05-31T10:01:30Z',
            },
            {
                type: 'public',
                sender: 'customer',
                message: `
            <p>Okay, I just logged out and back in — now I see the new analytics panel and export options. Looks like it’s working!</p>
            `,
                timestamp: '2025-05-31T10:03:00Z',
            },
            {
                type: 'public',
                sender: 'support',
                message: `
            <p>Perfect! Glad it’s showing now.</p>
            <p>Sometimes there’s a short delay with syncing user entitlements, but refreshing usually resolves it quickly.</p>
            `,
                timestamp: '2025-05-31T10:03:45Z',
            },
            {
                type: 'private',
                sender: 'support',
                message: `
            <p>Marking ticket as resolved. May consider adding automated retry logic for future entitlement sync failures.</p>
            `,
                timestamp: '2025-05-31T10:04:10Z',
            },
            {
                type: 'public',
                sender: 'customer',
                message: `
            <p>Thanks for the quick help — really appreciate it!</p>
            <p>Everything seems to be working now.</p>
            `,
                timestamp: '2025-05-31T10:04:30Z',
            },
        ],
        3: [
            {
                type: 'public',
                sender: 'customer',
                message: `
      <p>Hi,</p>
      <p>I’m trying to connect my app to your API, but I keep getting a <strong>401 Unauthorized</strong> error. I’ve double-checked my API key, and it seems correct.</p>
    `,
                timestamp: '2025-05-31T11:00:00Z',
            },
            {
                type: 'private',
                sender: 'support',
                message: `
      <p>Customer is using an older key format that was deprecated last month. We should recommend generating a new one from the dashboard.</p>
    `,
                timestamp: '2025-05-31T11:00:30Z',
            },
            {
                type: 'public',
                sender: 'support',
                message: `
      <p>Hello,</p>
      <p>Thanks for bringing this up! It looks like your current API key might be outdated. We recently updated our key format.</p>
      <p>Please try generating a new API key from your <a href="https:
    `,
                timestamp: '2025-05-31T11:01:15Z',
            },
            {
                type: 'public',
                sender: 'customer',
                message: `
      <p>Thanks for the info! I’ve just generated a new key and updated my app.</p>
      <p>I’m now getting a <strong>403 Forbidden</strong> error instead. Any idea what that might mean?</p>
    `,
                timestamp: '2025-05-31T11:02:30Z',
            },
            {
                type: 'private',
                sender: 'support',
                message: `
      <p>The new key likely doesn’t have the required scopes. Suggest user double-checks the permissions assigned when creating the key.</p>
    `,
                timestamp: '2025-05-31T11:02:50Z',
            },
            {
                type: 'public',
                sender: 'support',
                message: `
      <p>Good progress so far!</p>
      <p>The 403 error usually means the key is valid but doesn’t have the right permissions. When you created the new key, did you assign it the correct scopes (like <code>read:data</code> and <code>write:data</code>)?</p>
    `,
                timestamp: '2025-05-31T11:03:15Z',
            },
            {
                type: 'public',
                sender: 'customer',
                message: `
      <p>Ah, I missed that step! I regenerated the key with full access and now everything is working perfectly.</p>
      <p>Thanks so much for your help!</p>
    `,
                timestamp: '2025-05-31T11:04:10Z',
            },
            {
                type: 'public',
                sender: 'support',
                message: `
      <p>You’re very welcome — happy to hear it’s working!</p>
      <p>Feel free to reach out again if you have more questions or run into anything else. Have a great day!</p>
    `,
                timestamp: '2025-05-31T11:04:45Z',
            },
        ],
        4: [
            {
                type: 'public',
                sender: 'customer',
                message: `
      <p>Hi team,</p>
      <p>I noticed that my subscription was renewed today, but I intended to cancel before the renewal date. Is it possible to request a refund?</p>
    `,
                timestamp: '2025-05-31T12:00:00Z',
            },
            {
                type: 'private',
                sender: 'support',
                message: `
      <p>Customer was 1 day past renewal. Eligible for goodwill refund as per policy (within 7 days). Proceed with partial refund and suggest cancellation for next cycle.</p>
    `,
                timestamp: '2025-05-31T12:01:00Z',
            },
            {
                type: 'public',
                sender: 'support',
                message: `
      <p>Hello,</p>
      <p>Thanks for reaching out. We understand these things happen! I've gone ahead and processed a partial refund as a courtesy.</p>
      <p>Your subscription will remain active until the end of this billing cycle and won’t renew next time.</p>
    `,
                timestamp: '2025-05-31T12:02:00Z',
            },
            {
                type: 'public',
                sender: 'customer',
                message: `
      <p>Thank you, I really appreciate that. The gesture means a lot.</p>
      <p>I’ve also gone ahead and canceled future renewals from my end.</p>
    `,
                timestamp: '2025-05-31T12:03:15Z',
            },
            {
                type: 'private',
                sender: 'support',
                message: `
      <p>Marked refund completed. Added tag "goodwill_refund" for tracking.</p>
    `,
                timestamp: '2025-05-31T12:03:45Z',
            },
            {
                type: 'public',
                sender: 'support',
                message: `
      <p>You're most welcome! Let us know if you need anything else in the future.</p>
      <p>Have a great rest of your day!</p>
    `,
                timestamp: '2025-05-31T12:04:30Z',
            },
        ],
        5: [
            {
                type: 'public',
                sender: 'customer',
                message: `
      <p>Hello,</p>
      <p>I’m experiencing intermittent issues with receiving email notifications from your system. Sometimes they arrive, sometimes they don’t.</p>
      <p>Could you please help me troubleshoot this?</p>
    `,
                timestamp: '2025-05-31T13:00:00Z',
            },
            {
                type: 'private',
                sender: 'support',
                message: `
      <p>Customer reports inconsistent email notifications. Need to check email delivery logs and spam filtering rules.</p>
    `,
                timestamp: '2025-05-31T13:00:30Z',
            },
            {
                type: 'public',
                sender: 'support',
                message: `
      <p>Hi there,</p>
      <p>Thanks for letting us know. We’ll start by checking if our system shows any delivery errors for your account.</p>
      <p>Meanwhile, please check your spam or junk folder and any email filters that might block our messages.</p>
    `,
                timestamp: '2025-05-31T13:01:00Z',
            },
            {
                type: 'public',
                sender: 'customer',
                message: `
      <p>I checked my spam folder and didn’t find the missing emails there. No specific filters on my email account either.</p>
      <p>Is there any other reason this could happen?</p>
    `,
                timestamp: '2025-05-31T13:02:00Z',
            },
            {
                type: 'private',
                sender: 'support',
                message: `
      <p>Investigating email delivery system — found some transient SMTP errors last week affecting specific regions. Possibly causing delays or dropped messages.</p>
    `,
                timestamp: '2025-05-31T13:02:30Z',
            },
            {
                type: 'public',
                sender: 'support',
                message: `
      <p>We identified some temporary email delivery issues on our end affecting a few regions last week.</p>
      <p>These should now be resolved. Could you please monitor your notifications over the next day and let us know if the problem persists?</p>
    `,
                timestamp: '2025-05-31T13:03:00Z',
            },
            {
                type: 'public',
                sender: 'customer',
                message: `
      <p>Thanks for the update! I’ll keep an eye on it and report back if I notice any further problems.</p>
    `,
                timestamp: '2025-05-31T13:04:00Z',
            },
            {
                type: 'private',
                sender: 'support',
                message: `
      <p>Set follow-up reminder in CRM for 2 days to check back with customer.</p>
    `,
                timestamp: '2025-05-31T13:04:30Z',
            },
            {
                type: 'public',
                sender: 'support',
                message: `
      <p>Great! Thanks for your patience.</p>
      <p>Feel free to reach out anytime if you experience any more issues or have questions.</p>
    `,
                timestamp: '2025-05-31T13:05:00Z',
            },
        ],
    }

    const messages = messageContentSetIndex
        ? messageContentSet[messageContentSetIndex]
        : []

    return messages.map((msg, index) => ({
        id: `${ticketId}-m${index}`,
        user:
            msg.sender === 'support'
                ? msg?.otherSupports
                    ? msg?.otherSupports
                    : support
                : customer,
        sender: msg.sender,
        type: msg.type,
        createdDate: msg.timestamp,
        content: msg.message,
        attachments: msg.attachments || [],
    }))
}

export const helpdeskTicketDetailsData = [
    {
        id: 'TKT-1000',
        messages: generateTicketConversation({
            ticketId: 'TKT-1000',
            messageContentSetIndex: 1,
            support: {
                id: '22',
                name: 'Brittany Garcia',
                img: '/img/avatars/thumb-3.jpg',
            },
            customer: {
                id: '13',
                name: 'Cassandra Murray',
                img: '/img/avatars/thumb-13.jpg',
            },
        }),
        project: 'CRM Web',
        linkedTickes: [
            {
                id: 'TKT-1095',
                subject: 'Session timeout issue',
                status: 'Resolved',
                priority: 'High',
                category: 'Authentication',
            },
            {
                id: 'TKT-1099',
                subject: 'Slow response during login',
                status: 'Open',
                priority: 'Medium',
                category: 'Performance',
            },
        ],
        dueDate: '2025-06-01',
    },
    {
        id: 'TKT-1001',
        messages: generateTicketConversation({
            ticketId: 'TKT-1001',
            messageContentSetIndex: 2,
            support: {
                id: '18',
                name: 'Ethan Foster',
                img: '/img/avatars/thumb-6.jpg',
            },
            customer: {
                id: '7',
                name: 'Monica Ray',
                img: '/img/avatars/thumb-9.jpg',
            },
        }),
        project: 'Inventory App',
        linkedTickes: [
            {
                id: 'TKT-1121',
                subject: 'Item duplication on sync',
                status: 'In Progress',
                priority: 'High',
                category: 'Sync Issues',
            },
            {
                id: 'TKT-1105',
                subject: 'Outdated item data after update',
                status: 'Resolved',
                priority: 'Low',
                category: 'Data Integrity',
            },
        ],
        dueDate: '2025-06-05',
    },
    {
        id: 'TKT-1002',
        messages: generateTicketConversation({
            ticketId: 'TKT-1002',
            messageContentSetIndex: 3,
            support: {
                id: '31',
                name: 'Jason Wu',
                img: '/img/avatars/thumb-11.jpg',
            },
            customer: {
                id: '4',
                name: 'Natalie Chen',
                img: '/img/avatars/thumb-16.jpg',
            },
        }),
        project: 'Inventory App',
        linkedTickes: [
            {
                id: 'TKT-1070',
                subject: 'Campaign scheduler not working',
                status: 'Open',
                priority: 'High',
                category: 'Scheduling',
            },
            {
                id: 'TKT-1035',
                subject: 'Email preview not rendering correctly',
                status: 'Resolved',
                priority: 'Medium',
                category: 'UI Bug',
            },
        ],
        dueDate: '2025-06-03',
    },
    {
        id: 'TKT-1003',
        messages: generateTicketConversation({
            ticketId: 'TKT-1003',
            messageContentSetIndex: 4,
            support: {
                id: 'TKT-1126',
                name: 'Ava Mitchell',
                img: '/img/avatars/thumb-5.jpg',
            },
            customer: {
                id: 'TKT-1117',
                name: 'Derrick Holt',
                img: '/img/avatars/thumb-14.jpg',
            },
        }),
        project: 'Workflow Manager',
        linkedTickes: [
            {
                id: 'TKT-1102',
                subject: 'Order history not loading',
                status: 'Resolved',
                priority: 'High',
                category: 'Data Display',
            },
            {
                id: 'TKT-1119',
                subject: 'Product images failing to upload',
                status: 'In Progress',
                priority: 'Medium',
                category: 'Media Upload',
            },
        ],
        dueDate: '2025-06-07',
    },
    {
        id: 'TKT-1004',
        messages: generateTicketConversation({
            ticketId: 'TKT-1004',
            messageContentSetIndex: 5,
            support: {
                id: '35',
                name: 'Liam Navarro',
                img: '/img/avatars/thumb-2.jpg',
            },
            customer: {
                id: '2',
                name: 'Priya Nair',
                img: '/img/avatars/thumb-12.jpg',
            },
        }),
        project: 'Billing System',
        linkedTickes: [
            {
                id: 'TKT-1135',
                subject: 'Currency symbol mismatch',
                status: 'Resolved',
                priority: 'Low',
                category: 'Formatting',
            },
            {
                id: 'TKT-1120',
                subject: 'Graphs not displaying data',
                status: 'Open',
                priority: 'High',
                category: 'Charts',
            },
        ],
        dueDate: '2025-06-02',
    },
    {
        id: 'TKT-1005',
        messages: generateTicketConversation({
            ticketId: 'TKT-1005',
            messageContentSetIndex: 1,
            support: {
                id: '40',
                name: 'Olivia Hughes',
                img: '/img/avatars/thumb-4.jpg',
            },
            customer: {
                id: '15',
                name: 'Marcus Boone',
                img: '/img/avatars/thumb-15.jpg',
            },
        }),
        project: 'Analytics Suite',
        linkedTickes: [],
        dueDate: '2025-06-04',
    },
    {
        id: 'TKT-1006',
        messages: generateTicketConversation({
            ticketId: 'TKT-1006',
            messageContentSetIndex: 2,
            support: {
                id: '44',
                name: 'Noah Becker',
                img: '/img/avatars/thumb-7.jpg',
            },
            customer: {
                id: '9',
                name: 'Isabella Hart',
                img: '/img/avatars/thumb-10.jpg',
            },
        }),
        project: 'Analytics Suite',
        linkedTickes: [
            {
                id: 'TKT-1106',
                subject: 'Dashboard filters not saving',
                status: 'Open',
                priority: 'Medium',
                category: 'Settings',
            },
        ],
        dueDate: '2025-06-08',
    },
    {
        id: 'TKT-1007',
        messages: generateTicketConversation({
            ticketId: 'TKT-1007',
            messageContentSetIndex: 3,
            support: {
                id: '52',
                name: 'Grace Lin',
                img: '/img/avatars/thumb-8.jpg',
            },
            customer: {
                id: '6',
                name: 'Logan Carr',
                img: '/img/avatars/thumb-6.jpg',
            },
        }),
        project: 'CRM Web',
        linkedTickes: [
            {
                id: 'TKT-1145',
                subject: 'Task deadlines not updating',
                status: 'In Progress',
                priority: 'High',
                category: 'Task Management',
            },
            {
                id: 'TKT-1172',
                subject: 'Comment threads disappearing',
                status: 'Resolved',
                priority: 'Low',
                category: 'Collaboration',
            },
        ],
        dueDate: '2025-06-10',
    },
    {
        id: 'TKT-1008',
        messages: generateTicketConversation({
            ticketId: 'TKT-1008',
            messageContentSetIndex: 4,
            support: {
                id: '60',
                name: 'Benjamin Rivera',
                img: '/img/avatars/thumb-1.jpg',
            },
            customer: {
                id: '11',
                name: 'Sophia Grant',
                img: '/img/avatars/thumb-11.jpg',
            },
        }),
        project: 'Billing System',
        linkedTickes: [],
        dueDate: '2025-06-06',
    },
    {
        id: 'TKT-1009',
        messages: generateTicketConversation({
            ticketId: 'TKT-1009',
            messageContentSetIndex: 5,
            support: {
                id: '24',
                name: 'Emma Salazar',
                img: '/img/avatars/thumb-17.jpg',
            },
            customer: {
                id: '19',
                name: 'Tyler Rhodes',
                img: '/img/avatars/thumb-5.jpg',
            },
        }),
        project: 'Inventory App',
        linkedTickes: [
            {
                id: 'TKT-1111',
                subject: 'Invoice generation errors',
                status: 'Open',
                priority: 'High',
                category: 'Billing',
            },
        ],
        dueDate: '2025-06-09',
    },
    {
        id: 'TKT-1010',
        messages: generateTicketConversation({
            ticketId: 'TKT-1010',
            messageContentSetIndex: 1,
            support: {
                id: '33',
                name: 'Ethan Blake',
                img: '/img/avatars/thumb-12.jpg',
            },
            customer: {
                id: '21',
                name: 'Maya Sutton',
                img: '/img/avatars/thumb-18.jpg',
            },
        }),
        project: 'Inventory App',
        linkedTickes: [],
        dueDate: '2025-06-03',
    },
    {
        id: 'TKT-1011',
        messages: generateTicketConversation({
            ticketId: 'TKT-1011',
            messageContentSetIndex: 2,
            support: {
                id: '28',
                name: 'Chloe Freeman',
                img: '/img/avatars/thumb-9.jpg',
            },
            customer: {
                id: '17',
                name: 'Liam Wolfe',
                img: '/img/avatars/thumb-14.jpg',
            },
        }),
        project: 'Marketing Suite',
        linkedTickes: [
            {
                id: 'TKT-1133',
                subject: 'Campaign metrics not refreshing',
                status: 'Resolved',
                priority: 'Medium',
                category: 'Analytics',
            },
        ],
        dueDate: '2025-06-12',
    },
    {
        id: 'TKT-1012',
        messages: generateTicketConversation({
            ticketId: 'TKT-1012',
            messageContentSetIndex: 3,
            support: {
                id: '37',
                name: 'Lucas Palmer',
                img: '/img/avatars/thumb-6.jpg',
            },
            customer: {
                id: '22',
                name: 'Nora Boyd',
                img: '/img/avatars/thumb-3.jpg',
            },
        }),
        project: 'Workflow Manager',
        linkedTickes: [],
        dueDate: '2025-06-15',
    },
    {
        id: 'TKT-1013',
        messages: generateTicketConversation({
            ticketId: 'TKT-1013',
            messageContentSetIndex: 4,
            support: {
                id: '19',
                name: 'Isla Jennings',
                img: '/img/avatars/thumb-5.jpg',
            },
            customer: {
                id: '24',
                name: 'Ezekiel Benton',
                img: '/img/avatars/thumb-16.jpg',
            },
        }),
        project: 'Workflow Manager',
        linkedTickes: [
            {
                id: 'TKT-1129',
                subject: 'CI/CD pipeline failure',
                status: 'In Progress',
                priority: 'High',
                category: 'Deployment',
            },
            {
                id: '30',
                subject: 'Missing environment variable',
                status: 'Resolved',
                priority: 'Low',
                category: 'Configuration',
            },
        ],
        dueDate: '2025-06-14',
    },
    {
        id: 'TKT-1014',
        messages: generateTicketConversation({
            ticketId: 'TKT-1014',
            messageContentSetIndex: 5,
            support: {
                id: '45',
                name: 'Dylan Steele',
                img: '/img/avatars/thumb-2.jpg',
            },
            customer: {
                id: '30',
                name: 'Eliza Bowen',
                img: '/img/avatars/thumb-8.jpg',
            },
        }),
        project: 'Billing System',
        linkedTickes: [],
        dueDate: '2025-06-11',
    },
    {
        id: 'TKT-1015',
        messages: generateTicketConversation({
            ticketId: 'TKT-1015',
            messageContentSetIndex: 1,
            support: {
                id: '38',
                name: 'Zoe Benson',
                img: '/img/avatars/thumb-10.jpg',
            },
            customer: {
                id: '26',
                name: 'Victor Silva',
                img: '/img/avatars/thumb-2.jpg',
            },
        }),
        project: 'Workflow Manager',
        linkedTickes: [
            {
                id: 'TKT-1145',
                subject: 'Notification emails delayed',
                status: 'Open',
                priority: 'Medium',
                category: 'Notifications',
            },
        ],
        dueDate: '2025-06-07',
    },
    {
        id: 'TKT-1016',
        messages: generateTicketConversation({
            ticketId: 'TKT-1016',
            messageContentSetIndex: 2,
            support: {
                id: '50',
                name: 'Caleb Goodwin',
                img: '/img/avatars/thumb-7.jpg',
            },
            customer: {
                id: '28',
                name: 'Amelia Walsh',
                img: '/img/avatars/thumb-4.jpg',
            },
        }),
        project: 'Workflow Manager',
        linkedTickes: [],
        dueDate: '2025-06-13',
    },
    {
        id: 'TKT-1017',
        messages: generateTicketConversation({
            ticketId: 'TKT-1017',
            messageContentSetIndex: 3,
            support: {
                id: '31',
                name: 'Ryan McCoy',
                img: '/img/avatars/thumb-11.jpg',
            },
            customer: {
                id: '32',
                name: 'Hazel Meyer',
                img: '/img/avatars/thumb-17.jpg',
            },
        }),
        project: 'CRM Web',
        linkedTickes: [
            {
                id: 'TKT-1083',
                subject: 'Push notifications not working',
                status: 'Open',
                priority: 'High',
                category: 'Mobile',
            },
        ],
        dueDate: '2025-06-05',
    },
    {
        id: 'TKT-1018',
        messages: generateTicketConversation({
            ticketId: 'TKT-1018',
            messageContentSetIndex: 4,
            support: {
                id: '29',
                name: 'Aiden Brady',
                img: '/img/avatars/thumb-15.jpg',
            },
            customer: {
                id: '33',
                name: 'Naomi Cobb',
                img: '/img/avatars/thumb-13.jpg',
            },
        }),
        project: 'Analytics Suite',
        linkedTickes: [],
        dueDate: '2025-06-16',
    },
    {
        id: 'TKT-1019',
        messages: generateTicketConversation({
            ticketId: 'TKT-1019',
            messageContentSetIndex: 5,
            support: {
                id: '41',
                name: 'Ella Preston',
                img: '/img/avatars/thumb-9.jpg',
            },
            customer: {
                id: '36',
                name: 'Dorian Caldwell',
                img: '/img/avatars/thumb-6.jpg',
            },
        }),
        project: 'Billing System',
        linkedTickes: [
            {
                id: 'TKT-1140',
                subject: 'Tax calculations incorrect',
                status: 'Open',
                priority: 'High',
                category: 'Billing',
            },
        ],
        dueDate: '2025-06-17',
    },
]

export const helpdeskTicketData = [
    {
        id: 'TKT-1000',
        subject: 'Cannot login',
        customer: {
            id: '13',
            name: 'Cassandra Murray',
            img: '/img/avatars/thumb-13.jpg',
        },
        assignee: {
            id: '22',
            name: 'Brittany Garcia',
            img: '/img/avatars/thumb-3.jpg',
        },
        status: 'Open',
        priority: 'Medium',
        category: 'Request',
        channel: 'Web Form',
        tags: ['login'],
        createdAt: '2025-05-22T12:48:56.220703',
        updatedAt: '2025-05-23T12:48:56.220749',
        pinned: false,
    },
    {
        id: 'TKT-1001',
        subject: 'Billing issue',
        customer: {
            id: '16',
            name: 'Sherri Cook',
            img: '/img/avatars/thumb-9.jpg',
        },
        assignee: {
            id: '23',
            name: 'Justin Steele',
            img: '/img/avatars/thumb-9.jpg',
        },
        status: 'Closed',
        priority: 'High',
        category: 'Request',
        channel: 'Email',
        tags: ['bug', 'UI', 'VIP'],
        createdAt: '2025-05-19T12:48:56.220786',
        updatedAt: '2025-05-27T12:48:56.220805',
        pinned: true,
    },
    {
        id: 'TKT-1002',
        subject: 'Feature request',
        customer: {
            id: '21',
            name: 'Jesse Monroe',
            img: '/img/avatars/thumb-3.jpg',
        },
        assignee: {
            id: '6',
            name: 'Arlene Pierce',
            img: '/img/avatars/thumb-6.jpg',
        },
        status: 'Open',
        priority: 'Medium',
        category: 'Technical',
        channel: 'Phone',
        tags: ['sync', 'admin', 'payment'],
        createdAt: '2025-05-23T12:48:56.220821',
        updatedAt: '2025-05-26T12:48:56.220825',
        pinned: false,
    },
    {
        id: 'TKT-1003',
        subject: 'Bug in new update',
        customer: {
            id: '24',
            name: 'Jocelyn Hansen',
            img: '/img/avatars/thumb-2.jpg',
        },
        assignee: {
            id: '16',
            name: 'Sherri Cook',
            img: '/img/avatars/thumb-9.jpg',
        },
        status: 'Resolved',
        priority: 'Low',
        category: 'General',
        channel: 'Live Chat',
        tags: ['timeout', 'sync', 'login'],
        createdAt: '2025-05-23T12:48:56.220838',
        updatedAt: '2025-05-24T12:48:56.220842',
        pinned: false,
    },
    {
        id: 'TKT-1004',
        subject: 'Unable to reset password',
        customer: {
            id: '7',
            name: 'Roberta Horton',
            img: '/img/avatars/thumb-7.jpg',
        },
        assignee: {
            id: '21',
            name: 'Jesse Monroe',
            img: '/img/avatars/thumb-3.jpg',
        },
        status: 'Open',
        priority: 'High',
        category: 'Billing',
        channel: 'Live Chat',
        tags: ['mobile', 'login', 'bug'],
        createdAt: '2025-05-10T12:48:56.220853',
        updatedAt: '2025-05-24T12:48:56.220856',
        pinned: false,
    },
    {
        id: 'TKT-1005',
        subject: 'Mobile app crash',
        customer: {
            id: '20',
            name: 'Jason Rogers',
            img: '/img/avatars/thumb-6.jpg',
        },
        assignee: {
            id: '10',
            name: 'Earl Miles',
            img: '/img/avatars/thumb-10.jpg',
        },
        status: 'Resolved',
        priority: 'High',
        category: 'Technical',
        channel: 'Live Chat',
        tags: ['sync'],
        createdAt: '2025-05-02T12:48:56.220868',
        updatedAt: '2025-05-24T12:48:56.220871',
        pinned: true,
    },
    {
        id: 'TKT-1006',
        subject: 'Data sync issue',
        customer: {
            id: '14',
            name: 'Alvin Moreno',
            img: '/img/avatars/thumb-14.jpg',
        },
        assignee: {
            id: '1',
            name: 'Angelina Gotelli',
            img: '/img/avatars/thumb-1.jpg',
        },
        status: 'Resolved',
        priority: 'Low',
        category: 'Technical',
        channel: 'Email',
        tags: ['bug'],
        createdAt: '2025-05-26T12:48:56.220903',
        updatedAt: '2025-05-25T12:48:56.220909',
        pinned: false,
    },
    {
        id: 'TKT-1007',
        subject: 'Account suspended',
        customer: {
            id: '13',
            name: 'Cassandra Murray',
            img: '/img/avatars/thumb-13.jpg',
        },
        assignee: {
            id: '4',
            name: 'Shannon Baker',
            img: '/img/avatars/thumb-4.jpg',
        },
        status: 'Resolved',
        priority: 'High',
        category: 'General',
        channel: 'Live Chat',
        tags: ['VIP', 'timeout', 'admin'],
        createdAt: '2025-04-27T12:48:56.220925',
        updatedAt: '2025-05-25T12:48:56.220929',
        pinned: false,
    },
    {
        id: 'TKT-1008',
        subject: 'Email notifications not received',
        customer: {
            id: '21',
            name: 'Jesse Monroe',
            img: '/img/avatars/thumb-3.jpg',
        },
        assignee: {
            id: '16',
            name: 'Sherri Cook',
            img: '/img/avatars/thumb-9.jpg',
        },
        status: 'Resolved',
        priority: 'Medium',
        category: 'General',
        channel: 'Phone',
        tags: ['bug', 'timeout'],
        createdAt: '2025-05-17T12:48:56.220944',
        updatedAt: '2025-05-23T12:48:56.220952',
        pinned: false,
    },
    {
        id: 'TKT-1009',
        subject: '2FA not working',
        customer: {
            id: '16',
            name: 'Sherri Cook',
            img: '/img/avatars/thumb-9.jpg',
        },
        assignee: {
            id: '8',
            name: 'Jessica Wells',
            img: '/img/avatars/thumb-8.jpg',
        },
        status: 'Closed',
        priority: 'Medium',
        category: 'General',
        channel: 'Phone',
        tags: ['timeout', 'VIP'],
        createdAt: '2025-05-24T12:48:56.220975',
        updatedAt: '2025-05-27T12:48:56.220984',
        pinned: false,
    },
    {
        id: 'TKT-1010',
        subject: 'Dashboard loading slowly',
        customer: {
            id: '24',
            name: 'Jocelyn Hansen',
            img: '/img/avatars/thumb-2.jpg',
        },
        assignee: {
            id: '15',
            name: 'Jackie Soto',
            img: '/img/avatars/thumb-15.jpg',
        },
        status: 'Pending',
        priority: 'Medium',
        category: 'Technical',
        channel: 'Email',
        tags: ['VIP', 'sync', 'payment'],
        createdAt: '2025-04-29T12:48:56.221007',
        updatedAt: '2025-05-24T12:48:56.221013',
        pinned: false,
    },
    {
        id: 'TKT-1011',
        subject: 'Request for API access',
        customer: {
            id: '3',
            name: 'Max Alexander',
            img: '/img/avatars/thumb-3.jpg',
        },
        assignee: {
            id: '9',
            name: 'Camila Simmmons',
            img: '/img/avatars/thumb-9.jpg',
        },
        status: 'Closed',
        priority: 'Medium',
        category: 'Request',
        channel: 'Live Chat',
        tags: ['VIP', 'UI'],
        createdAt: '2025-05-21T12:48:56.221063',
        updatedAt: '2025-05-27T12:48:56.221073',
        pinned: false,
    },
    {
        id: 'TKT-1012',
        subject: 'Profile update problem',
        customer: {
            id: '23',
            name: 'Justin Steele',
            img: '/img/avatars/thumb-9.jpg',
        },
        assignee: {
            id: '2',
            name: 'Jeremiah Minsk',
            img: '/img/avatars/thumb-2.jpg',
        },
        status: 'Pending',
        priority: 'Low',
        category: 'Billing',
        channel: 'Live Chat',
        tags: ['admin', 'mobile', 'VIP'],
        createdAt: '2025-05-10T12:48:56.221108',
        updatedAt: '2025-05-27T12:48:56.221116',
        pinned: false,
    },
    {
        id: 'TKT-1013',
        subject: 'Error 500 on checkout',
        customer: {
            id: '2',
            name: 'Jeremiah Minsk',
            img: '/img/avatars/thumb-2.jpg',
        },
        assignee: {
            id: '22',
            name: 'Brittany Garcia',
            img: '/img/avatars/thumb-3.jpg',
        },
        status: 'Resolved',
        priority: 'High',
        category: 'Billing',
        channel: 'Live Chat',
        tags: ['VIP'],
        createdAt: '2025-05-23T12:48:56.221136',
        updatedAt: '2025-05-26T12:48:56.221147',
        pinned: false,
    },
    {
        id: 'TKT-1014',
        subject: 'Subscription auto-renewal',
        customer: {
            id: '24',
            name: 'Jocelyn Hansen',
            img: '/img/avatars/thumb-2.jpg',
        },
        assignee: {
            id: '17',
            name: 'Rebecca Rodriguez',
            img: '/img/avatars/thumb-12.jpg',
        },
        status: 'Resolved',
        priority: 'Medium',
        category: 'Request',
        channel: 'Web Form',
        tags: ['sync'],
        createdAt: '2025-05-06T12:48:56.221165',
        updatedAt: '2025-05-24T12:48:56.221172',
        pinned: false,
    },
    {
        id: 'TKT-1015',
        subject: 'Incorrect user role',
        customer: {
            id: '3',
            name: 'Max Alexander',
            img: '/img/avatars/thumb-3.jpg',
        },
        assignee: {
            id: '14',
            name: 'Alvin Moreno',
            img: '/img/avatars/thumb-14.jpg',
        },
        status: 'Pending',
        priority: 'High',
        category: 'General',
        channel: 'Phone',
        tags: ['mobile'],
        createdAt: '2025-05-05T12:48:56.221195',
        updatedAt: '2025-05-26T12:48:56.221202',
        pinned: false,
    },
    {
        id: 'TKT-1016',
        subject: 'UI misalignment',
        customer: {
            id: '13',
            name: 'Cassandra Murray',
            img: '/img/avatars/thumb-13.jpg',
        },
        assignee: {
            id: '22',
            name: 'Brittany Garcia',
            img: '/img/avatars/thumb-3.jpg',
        },
        status: 'Open',
        priority: 'High',
        category: 'General',
        channel: 'Email',
        tags: ['bug', 'admin', 'timeout'],
        createdAt: '2025-05-10T12:48:56.221221',
        updatedAt: '2025-05-27T12:48:56.221228',
        pinned: false,
    },
    {
        id: 'TKT-1017',
        subject: 'Export CSV broken',
        customer: {
            id: '13',
            name: 'Cassandra Murray',
            img: '/img/avatars/thumb-13.jpg',
        },
        assignee: {
            id: '5',
            name: 'Eugene Stewart',
            img: '/img/avatars/thumb-5.jpg',
        },
        status: 'Open',
        priority: 'Medium',
        category: 'Billing',
        channel: 'Live Chat',
        tags: ['admin', 'UI'],
        createdAt: '2025-05-12T12:48:56.221298',
        updatedAt: '2025-05-22T12:48:56.221345',
        pinned: false,
    },
    {
        id: 'TKT-1018',
        subject: 'Timezone mismatch',
        customer: {
            id: '23',
            name: 'Justin Steele',
            img: '/img/avatars/thumb-9.jpg',
        },
        assignee: {
            id: '7',
            name: 'Roberta Horton',
            img: '/img/avatars/thumb-7.jpg',
        },
        status: 'Resolved',
        priority: 'Medium',
        category: 'General',
        channel: 'Email',
        tags: ['mobile', 'bug'],
        createdAt: '2025-05-01T12:48:56.221381',
        updatedAt: '2025-05-27T12:48:56.221391',
        pinned: false,
    },
    {
        id: 'TKT-1019',
        subject: 'Language switch bug',
        customer: {
            id: '17',
            name: 'Rebecca Rodriguez',
            img: '/img/avatars/thumb-12.jpg',
        },
        assignee: {
            id: '13',
            name: 'Cassandra Murray',
            img: '/img/avatars/thumb-13.jpg',
        },
        status: 'Pending',
        priority: 'Medium',
        category: 'Technical',
        channel: 'Phone',
        tags: ['VIP', 'mobile'],
        createdAt: '2025-05-01T12:48:56.221406',
        updatedAt: '2025-05-26T12:48:56.221410',
        pinned: false,
    },
]
