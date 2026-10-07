import { BsBanFill, BsArchiveFill, BsCheckCircleFill } from 'react-icons/bs'
import { MdOutlineTimelapse } from 'react-icons/md'
import { ReactNode } from 'react'

export const priorityMap: Record<string, { color: string }> = {
    Low: {
        color: 'bg-success',
    },
    Medium: {
        color: 'bg-warning',
    },
    High: {
        color: 'bg-error',
    },
}

export const statusMap: Record<
    string,
    { color: string; label: string; icon: ReactNode }
> = {
    active: {
        label: 'Active',
        color: 'text-info',
        icon: <MdOutlineTimelapse className="text-base" />,
    },
    onHold: {
        label: 'On Hold',
        color: 'text-error',
        icon: <BsBanFill />,
    },
    archived: {
        label: 'Archived',
        color: 'text-warning',
        icon: <BsArchiveFill />,
    },
    completed: {
        label: 'Completed',
        color: 'text-success',
        icon: <BsCheckCircleFill />,
    },
}

export const progressColor = (progress: number) => {
    if (progress < 30) {
        return 'bg-error stroke-error'
    }

    if (progress < 50) {
        return 'bg-warning stroke-warning'
    }

    if (progress > 80) {
        return 'bg-success stroke-success'
    }

    return ''
}
