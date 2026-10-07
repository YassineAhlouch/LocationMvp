import Button from '@/components/ui/Button'

const Variant = () => {
    return (
        <div className="inline-flex flex-wrap xl:flex gap-2">
            <Button>Default</Button>
            <Button variant="solid">Solid</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
        </div>
    )
}

export default Variant
