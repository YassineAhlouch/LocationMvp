import MultiValueInput from '@/components/ui/MultiValueInput'

const Basic = () => {
    return (
        <div className="max-w-md mx-auto">
            <MultiValueInput
                placeholder="Type and press Enter to add tags"
                defaultValue={['React', 'TypeScript']}
            />
        </div>
    )
}

export default Basic
