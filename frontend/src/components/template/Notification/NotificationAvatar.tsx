import Avatar from '@/components/ui/Avatar'
import acronym from '@/utils/acronym'
import { colors } from '@/constants/colors.constant'
import { LiNotification, LiWalletMoney } from '@/icons'
import classNames from '@/utils/classNames'
import type { AppNotification } from '@/@types/location'

type NotificationAvatarProps = {
    notification: AppNotification
}

/**
 * Media node of an inbox row. Payments get a fixed money badge; announcements
 * fall back to the sender's initials, or a generic bell for system notices.
 */
const NotificationAvatar = ({ notification }: NotificationAvatarProps) => {
    if (notification.type === 'payment') {
        return (
            <Avatar
                shape="circle"
                size={30}
                className={classNames(
                    'border-0',
                    colors.emerald.iconBg,
                    colors.emerald.iconText,
                )}
                icon={<LiWalletMoney className="text-lg" />}
            />
        )
    }

    const sender = notification.data.sent_by
    const name = sender
        ? `${sender.first_name} ${sender.last_name}`.trim()
        : ''

    if (name) {
        return (
            <Avatar shape="circle" size={30}>
                {acronym(name)}
            </Avatar>
        )
    }

    return (
        <Avatar
            shape="circle"
            size={30}
            className={classNames(
                'border-0',
                colors.blue.iconBg,
                colors.blue.iconText,
            )}
            icon={<LiNotification className="text-lg" />}
        />
    )
}

export default NotificationAvatar
