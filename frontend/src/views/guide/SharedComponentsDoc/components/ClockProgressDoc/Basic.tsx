import ClockProgress from '@/components/shared/ClockProgress'

const Basic = () => {
    return (
        <div className="flex items-center gap-4">
            <ClockProgress value={0} />
            <ClockProgress value={25} />
            <ClockProgress value={50} />
            <ClockProgress value={75} />
            <ClockProgress value={100} />
        </div>
    )
}

export default Basic
