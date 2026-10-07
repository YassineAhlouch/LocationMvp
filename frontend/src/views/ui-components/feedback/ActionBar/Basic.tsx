import { useState } from 'react'
import Button from '@/components/ui/Button'
import ActionBar from '@/components/ui/ActionBar'

const Basic = () => {
    const [open, setOpen] = useState(false)

    const handleClose = () => setOpen(false)

    return (
        <div>
            <Button onClick={() => setOpen(true)}>Click Me</Button>
            <ActionBar open={open}>
                <div className="flex items-center justify-between">
                    <span className="font-medium">
                        <span className="heading-text font-semibold">
                            1 Items
                        </span>{' '}
                        selected
                    </span>
                    <div className="flex items-center gap-2">
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button variant="solid" onClick={handleClose}>
                            Confirm
                        </Button>
                    </div>
                </div>
            </ActionBar>
        </div>
    )
}

export default Basic
