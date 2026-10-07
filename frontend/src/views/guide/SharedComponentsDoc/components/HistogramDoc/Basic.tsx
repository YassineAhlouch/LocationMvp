import { useState } from 'react'
import Histogram from '@/components/shared/Historgram'
import Slider from '@/components/ui/Slider'

const sampleData = [
    { value: 5, label: '0-10' },
    { value: 12, label: '10-20' },
    { value: 25, label: '20-30' },
    { value: 38, label: '30-40' },
    { value: 45, label: '40-50' },
    { value: 32, label: '50-60' },
    { value: 28, label: '60-70' },
    { value: 15, label: '70-80' },
    { value: 8, label: '80-90' },
    { value: 3, label: '90-100' },
]

const Basic = () => {
    const [range, setRange] = useState<[number, number]>([20, 70])

    return (
        <div className="w-full max-w-md">
            <Histogram data={sampleData} range={range} min={0} max={100} />
            <div className="mt-4 space-y-4">
                <div className="text-sm">
                    Range: {range[0]} - {range[1]}
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm w-10">Min</span>
                    <div className="flex-1">
                        <Slider
                            min={0}
                            max={100}
                            value={range[0]}
                            onChange={(value) =>
                                setRange([value as number, range[1]])
                            }
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm w-10">Max</span>
                    <div className="flex-1">
                        <Slider
                            min={0}
                            max={100}
                            value={range[1]}
                            onChange={(value) =>
                                setRange([range[0], value as number])
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Basic
