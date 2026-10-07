import {
    LiBox,
    LiBoxTime,
    LiBoxCross,
    LiBoxTick,
    LiCross,
    LiClock,
    LiTick,
    LiStatus,
} from '@/icons'

import { ReactNode } from 'react'

export const statusMap: {
    [key: string]: {
        color: { bg: string; text: string }
        icon: ReactNode
        label: string
    }
} = {
    processing: {
        color: {
            bg: 'bg-info',
            text: 'text-white',
        },
        icon: <LiStatus />,
        label: 'Processing',
    },
    completed: {
        color: {
            bg: 'bg-success',
            text: 'text-white',
        },
        icon: <LiTick />,
        label: 'Completed',
    },
    pending: {
        color: {
            bg: 'bg-warning',
            text: 'text-white',
        },
        icon: <LiClock />,
        label: 'Pending',
    },
    cancelled: {
        color: {
            bg: 'bg-error',
            text: 'text-white',
        },
        icon: <LiCross />,
        label: 'Cancelled',
    },
}

export const paymentStatusMap: {
    [key: string]: {
        color: { bg: string; text: string; border: string }
        label: string
    }
} = {
    paid: {
        color: {
            bg: 'bg-success-subtle',
            text: 'text-success',
            border: 'border-success',
        },
        label: 'Paid',
    },
    unpaid: {
        color: {
            bg: 'bg-error-subtle',
            text: 'text-error',
            border: 'border-error',
        },
        label: 'Unpaid',
    },
}

export const orderStatisticIconMap: { [key: string]: ReactNode } = {
    totalOrders: <LiBox />,
    pendingOrders: <LiBoxTime />,
    returnedOrders: <LiBoxCross />,
    deliveredOrders: <LiBoxTick />,
}
