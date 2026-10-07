import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'

const CustomStyle = () => {
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
            <Dialog
                isOpen={dialogIsOpen}
                className="pb-0 px-0"
                onClose={onDialogClose}
            >
                <div className="px-6 pb-6">
                    <h5 className="mb-4">Dialog Title</h5>
                    <p>
                        There are many variations of passages of Lorem Ipsum
                        available, but the majority have suffered alteration in
                        some form, by injected humour, or randomised words which
                        dont look even slightly believable.
                    </p>
                </div>
                <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
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

export default CustomStyle
