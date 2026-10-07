import { useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import acronym from '@/utils/acronym'
import classNames from '@/utils/classNames'
import useRandomColor from '@/utils/hooks/useRandomColor'
import { avatarType } from './constants'
import type { AvatarProps } from '@/components/ui/Avatar'

type ActivityAvatar = {
    data?: {
        type: string
        userImg?: string
        userName: string
    }
}

const ActivityAvatar = ({ data }: ActivityAvatar) => {
    const color = useRandomColor()

    const defaultAvatarProps: AvatarProps = useMemo(
        () => ({ size: 25, shape: 'circle' }),
        [],
    )

    if (data && avatarType.includes(data.type)) {
        const avatarProps = data.userImg
            ? { src: data.userImg }
            : { className: classNames(color(data.userName || '')) }

        return (
            <Avatar {...avatarProps} {...defaultAvatarProps}>
                <span className="heading-text font-bold">
                    {acronym(data.userName || '')}
                </span>
            </Avatar>
        )
    }

    return null
}

export default ActivityAvatar
