import { useState } from 'react'
import Checkbox from '@/components/ui/Checkbox'
import ActionBar from '@/components/ui/ActionBar'
import Button from '@/components/ui/Button'

const CheckboxExample = () => {
    const [checkboxList, setCheckboxList] = useState<string[]>([])

    const onCheckboxChange = (options: string[]) => {
        setCheckboxList(options)
    }

    return (
        <div>
            <Checkbox.Group value={checkboxList} onChange={onCheckboxChange}>
                <Checkbox value="Selection A">Selection A </Checkbox>
                <Checkbox value="Selection B">Selection B </Checkbox>
                <Checkbox value="Selection C">Selection C </Checkbox>
            </Checkbox.Group>
            <ActionBar open={checkboxList.length > 0}>
                <div className="flex items-center justify-between">
                    <span className="font-medium">
                        <span className="heading-text font-semibold">
                            {checkboxList.length} Items
                        </span>{' '}
                        selected
                    </span>
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setCheckboxList([])}>
                            Clear All
                        </Button>
                    </div>
                </div>
            </ActionBar>
        </div>
    )
}

export default CheckboxExample
