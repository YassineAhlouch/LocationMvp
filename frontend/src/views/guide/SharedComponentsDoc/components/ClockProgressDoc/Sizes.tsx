import ClockProgress from '@/components/shared/ClockProgress'

const Sizes = () => {
    return (
        <div className="flex items-center gap-4">
            <ClockProgress value={60} size={24} />
            <ClockProgress value={60} size={40} />
            <ClockProgress value={60} size={56} />
            <ClockProgress value={60} size={72} />
        </div>
    )
}

export default Sizes
