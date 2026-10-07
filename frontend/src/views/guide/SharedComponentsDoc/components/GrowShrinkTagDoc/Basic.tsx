import GrowShrinkTag from '@/components/shared/GrowShrinkTag'

const Basic = () => {
    return (
        <div className="flex items-center gap-4">
            <GrowShrinkTag value={12.5} suffix="%" />
            <GrowShrinkTag value={-8.3} suffix="%" />
            <GrowShrinkTag value={0} suffix="%" />
        </div>
    )
}

export default Basic
