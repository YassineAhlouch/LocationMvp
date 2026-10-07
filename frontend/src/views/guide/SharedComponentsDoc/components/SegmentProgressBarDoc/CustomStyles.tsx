import SegmentProgressBar from '@/components/shared/SegmentProgressBar'

const CustomStyles = () => {
    return (
        <div className="w-full max-w-md mx-auto space-y-2">
            <div>Custom height and gap</div>
            <SegmentProgressBar
                segments={50}
                percent={70}
                height={32}
                gap={2}
                filledClass="bg-primary"
            />
        </div>
    )
}

export default CustomStyles
