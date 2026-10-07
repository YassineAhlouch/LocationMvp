import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'

const StaticBackdrop = () => {
    const [dialogIsOpen, setIsOpen] = useState(false)

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = (currentState: boolean) => {
        console.log('onDialogClose', currentState)
        setIsOpen(false)
    }

    return (
        <div>
            <Button variant="solid" onClick={() => openDialog()}>
                Open Dialog
            </Button>
            <Dialog lockScroll isOpen={dialogIsOpen} onClose={onDialogClose}>
                <h5 className="mb-4">Dialog Title</h5>
                <p>
                    There are many variations of passages of Lorem Ipsum
                    available, but the majority have suffered alteration in some
                    form, by injected humour, or randomised words which dont
                    look even slightly believable.
                </p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="subtle"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={() => setIsOpen(false)}>
                        Okay
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default StaticBackdrop
