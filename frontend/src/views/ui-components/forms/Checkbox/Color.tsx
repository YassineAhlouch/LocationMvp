import { useState } from 'react'
import Checkbox from '@/components/ui/Checkbox'

const Color = () => {
    const [checkboxList] = useState(['A', 'B', 'C'])

    return (
        <div>
            <div className="mb-5">
                <Checkbox checked checkboxClass="text-emerald-500">
                    Checkbox 1
                </Checkbox>
            </div>
            <Checkbox.Group checkboxClass="text-amber-500" value={checkboxList}>
                <Checkbox checkboxClass="text-indigo-500" value="A">
                    Selection A{' '}
                </Checkbox>
                <Checkbox value="B">Selection B </Checkbox>
                <Checkbox value="C">Selection C </Checkbox>
            </Checkbox.Group>
        </div>
    )
}

export default Color
