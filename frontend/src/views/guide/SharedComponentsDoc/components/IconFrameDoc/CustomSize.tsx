import IconFrame from '@/components/shared/IconFrame'
import { LiDollarCircle } from '@/icons'

const CustomSize = () => {
    return (
        <div className="flex items-end gap-4">
            <div className="flex flex-col items-center gap-2">
                <IconFrame size={32}>
                    <LiDollarCircle className="text-base heading-text" />
                </IconFrame>
            </div>
            <div className="flex flex-col items-center gap-2">
                <IconFrame size={40}>
                    <LiDollarCircle className="text-xl heading-text" />
                </IconFrame>
            </div>
            <div className="flex flex-col items-center gap-2">
                <IconFrame size={56}>
                    <LiDollarCircle className="text-2xl heading-text" />
                </IconFrame>
            </div>
            <div className="flex flex-col items-center gap-2">
                <IconFrame size={72}>
                    <LiDollarCircle className="text-3xl heading-text" />
                </IconFrame>
            </div>
        </div>
    )
}

export default CustomSize
