import Avatar from '@/components/ui/Avatar'
import acronym from '@/utils/acronym'
import { colors } from '@/constants/colors.constant'
import {
    LiClipboardText,
    LiGasStation,
    LiNotification,
    LiShield,
    LiWalletMoney,
} from '@/icons'
import classNames from '@/utils/classNames'
import type { AppNotification } from '@/@types/location'
import type { ReactNode } from 'react'

type NotificationAvatarProps = {
    notification: AppNotification
}

type CarAlertBadge = {
    icon: ReactNode
    color: (typeof colors)[keyof typeof colors]
}

const carAlertBadges: Record<string, CarAlertBadge> = {
    car_insurance: { icon: <LiShield className="text-lg" />, color: colors.yellow },
    car_inspection: { icon: <LiClipboardText className="text-lg" />, color: colors.cyan },
    car_fuel: { icon: <LiGasStation className="text-lg" />, color: colors.rose },
}

/**
 * Media node of an inbox row. Payments get a fixed money badge; fleet alerts
 * get a document/ fuel badge; announcements fall back to the sender's
 * initials, or a generic bell for system notices.
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

    const badge = carAlertBadges[notification.type]

    if (badge) {
        return (
            <Avatar
                shape="circle"
                size={30}
                className={classNames('border-0', badge.color.iconBg, badge.color.iconText)}
                icon={badge.icon}
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
