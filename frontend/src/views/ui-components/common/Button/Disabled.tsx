import Button from '@/components/ui/Button'

const Disabled = () => {
    return (
        <div className="flex items-center gap-2">
            <Button disabled>Default</Button>
            <Button disabled variant="solid">
                Solid
            </Button>
            <Button disabled variant="subtle">
                Subtle
            </Button>
            <Button disabled variant="ghost">
                Ghost
            </Button>
            <Button disabled variant="link">
                Link
            </Button>
        </div>
    )
}

export default Disabled
