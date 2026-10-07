import { LuCheck, LuFileText, LuRefreshCcw } from 'react-icons/lu'
import type { ReactNode } from 'react'

export const historyIconMap: Record<
    string,
    { icon: ReactNode; color: string }
> = {
    close: {
        icon: <LuCheck />,
        color: 'bg-success text-white ',
    },
    proposal: {
        icon: <LuFileText />,
        color: 'bg-blue-500 text-white',
    },
    update: {
        icon: <LuRefreshCcw />,
        color: 'bg-gray-500 text-white',
    },
    create: {
        icon: <LuFileText />,
        color: 'bg-orange-500 text-white',
    },
}
