import InfoBar from '@/components/shared/InfoBar'

const Levels = () => {
    return (
        <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
                <InfoBar level="low" height={20} />
                <span className="text-sm text-error">Weak signal</span>
            </div>
            <div className="flex items-center gap-2">
                <InfoBar level="medium" height={20} />
                <span className="text-sm text-warning">Moderate signal</span>
            </div>
            <div className="flex items-center gap-2">
                <InfoBar level="high" height={20} />
                <span className="text-sm text-success">Strong signal</span>
            </div>
        </div>
    )
}

export default Levels
