import SegmentProgressBar from '@/components/shared/SegmentProgressBar'

const Basic = () => {
    return (
        <div className="w-full max-w-md mx-auto space-y-4">
            <div>
                <p className="mb-2">0%</p>
                <SegmentProgressBar segments={40} percent={0} />
            </div>
            <div>
                <p className="mb-2">40%</p>
                <SegmentProgressBar segments={40} percent={40} />
            </div>
            <div>
                <p className="mb-2">80%</p>
                <SegmentProgressBar segments={40} percent={80} />
            </div>
            <div>
                <p className="mb-2">100%</p>
                <SegmentProgressBar segments={40} percent={100} />
            </div>
        </div>
    )
}

export default Basic
