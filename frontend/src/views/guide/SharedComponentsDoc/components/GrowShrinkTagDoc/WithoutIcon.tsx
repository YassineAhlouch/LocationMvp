import GrowShrinkTag from '@/components/shared/GrowShrinkTag'

const WithoutIcon = () => {
    return (
        <div className="flex items-center gap-4">
            <GrowShrinkTag
                value={25}
                showIcon={false}
                prefix="+"
                suffix=" units"
            />
            <GrowShrinkTag value={-15} showIcon={false} suffix=" units" />
        </div>
    )
}

export default WithoutIcon
