import IconFrame from '@/components/shared/IconFrame'
import { LiDollarCircle, LiUser, LiSetting } from '@/icons'

const Basic = () => {
    return (
        <div className="flex items-center gap-4">
            <IconFrame>
                <LiDollarCircle className="text-xl heading-text" />
            </IconFrame>
            <IconFrame>
                <LiUser className="text-xl heading-text" />
            </IconFrame>
            <IconFrame>
                <LiSetting className="text-xl heading-text" />
            </IconFrame>
        </div>
    )
}

export default Basic
