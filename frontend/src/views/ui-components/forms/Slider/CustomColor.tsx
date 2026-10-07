import Slider from '@/components/ui/Slider'

const CustomColor = () => {
    return (
        <div className="flex flex-col gap-6">
            <Slider
                defaultValue={60}
                classNames={{
                    bar: 'bg-amber-500',
                    mark: 'bg-amber-500',
                    thumb: 'border-amber-500',
                }}
            />
            <Slider.Range
                defaultValue={[20, 50]}
                classNames={{
                    bar: 'bg-linear-to-r from-pink-500 via-purple-500 to-blue-500',
                    mark: 'bg-red-500',
                    thumb: ['border-pink-500', 'border-blue-500'],
                }}
            />
        </div>
    )
}

export default CustomColor
