import { useState } from 'react'
import AdvancedFilterBuilder from '@/components/shared/AdvancedFilterBuilder'
import Popover from '@/components/ui/Popover'
import Button from '@/components/ui/Button'
import { LuFilter } from 'react-icons/lu'

const WithPopover = () => {
    const [open, setOpen] = useState(false)

    const handleApply = () => {
        setOpen(false)
    }

    return (
        <div className="w-full">
            <Popover
                open={open}
                onOpenChange={setOpen}
                placement="bottom-start"
                width={500}
                renderTrigger={<Button icon={<LuFilter />}>Filter</Button>}
            >
                <AdvancedFilterBuilder onApply={handleApply} />
            </Popover>
        </div>
    )
}

export default WithPopover
