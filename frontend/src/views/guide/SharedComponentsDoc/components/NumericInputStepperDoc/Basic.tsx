import { useState } from 'react'
import NumericInputStepper from '@/components/shared/NumericInputStepper'
import Input from '@/components/ui/Input'

const Basic = () => {
    const [value, setValue] = useState(5)

    return (
        <Input
            value={value}
            readOnly
            className="text-center"
            suffix={
                <div className="ltr:-mr-2 rtl:-ml-2">
                    <NumericInputStepper value={value} onChange={setValue} />
                </div>
            }
        />
    )
}

export default Basic
