import InfoBar from '@/components/shared/InfoBar'

const Basic = () => {
    return (
        <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
                <span className="text-sm">Low:</span>
                <InfoBar level="low" />
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm">Medium:</span>
                <InfoBar level="medium" />
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm">High:</span>
                <InfoBar level="high" />
            </div>
        </div>
    )
}

export default Basic
