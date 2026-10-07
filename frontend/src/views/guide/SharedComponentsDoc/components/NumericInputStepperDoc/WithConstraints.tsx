import { useState } from 'react'
import NumericInputStepper from '@/components/shared/NumericInputStepper'
import Input from '@/components/ui/Input'

const WithConstraints = () => {
    const [value, setValue] = useState(50)

    return (
        <div>
            <Input
                value={value}
                readOnly
                className="text-center"
                suffix={
                    <div className="ltr:-mr-2 rtl:-ml-2">
                        <NumericInputStepper
                            value={value}
                            onChange={setValue}
                            min={0}
                            max={100}
                            step={10}
                        />
                    </div>
                }
            />
            <p className="mt-2 text-sm text-gray-500">
                Min: 0, Max: 100, Step: 10
            </p>
        </div>
    )
}

export default WithConstraints
