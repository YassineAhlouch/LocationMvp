import type { ReactNode } from 'react'
import { TbFileDollar } from 'react-icons/tb'

import {
    LuCheckCheck,
    LuHeadset,
    LuBan,
    LuStar,
    LuRadius,
    LuWrench,
    LuCircleChevronDown,
    LuCircleChevronUp,
    LuCircleMinus,
} from 'react-icons/lu'
export const categoriesMap: Record<string, { color: string; icon: ReactNode }> =
    {
        General: {
            color: 'text-[#5062d1]',
            icon: <LuRadius />,
        },
        Billing: {
            color: 'text-[#17a17d]',
            icon: <TbFileDollar />,
        },
        Technical: {
            color: 'text-[#f66229]',
            icon: <LuWrench />,
        },
        Request: {
            color: 'text-[#f7ae34]',
            icon: <LuStar />,
        },
    }

export const statusMap: Record<string, { color: string; icon?: ReactNode }> = {
    Open: {
        color: 'bg-[#5062d1]',
        icon: <LuHeadset />,
    },
    Resolved: {
        color: 'bg-[#17a17d]',
        icon: <LuCheckCheck />,
    },
    Pending: {
        color: 'bg-[#f66229]',
        icon: <LuBan />,
    },
    Closed: {
        color: 'bg-[#f7ae34]',
        icon: <LuCheckCheck />,
    },
}

export const priorityMap: Record<string, { color: string; icon?: ReactNode }> =
    {
        Low: {
            color: 'text-success',
            icon: <LuCircleChevronDown />,
        },
        Medium: {
            color: 'text-info',
            icon: <LuCircleMinus />,
        },
        High: {
            color: 'text-error',
            icon: <LuCircleChevronUp />,
        },
    }
