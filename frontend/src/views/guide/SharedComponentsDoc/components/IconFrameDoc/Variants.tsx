import IconFrame from '@/components/shared/IconFrame'
import { LiDollarCircle } from '@/icons'

const Variants = () => {
    return (
        <div className="flex flex-wrap items-center gap-6">
            <div className="flex flex-col items-center gap-2">
                <IconFrame>
                    <LiDollarCircle className="text-xl heading-text" />
                </IconFrame>
            </div>
            <div className="flex flex-col items-center gap-2">
                <IconFrame variant="thick">
                    <LiDollarCircle className="text-xl heading-text" />
                </IconFrame>
            </div>
            <div className="flex flex-col items-center gap-2">
                <IconFrame variant="layered">
                    <LiDollarCircle className="text-xl heading-text" />
                </IconFrame>
            </div>
        </div>
    )
}

export default Variants
