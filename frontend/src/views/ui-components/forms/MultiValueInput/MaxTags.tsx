import MultiValueInput from '@/components/ui/MultiValueInput'

const MaxTags = () => {
    return (
        <div className="max-w-md mx-auto">
            <MultiValueInput
                placeholder="Add up to 5 tags..."
                maxTags={5}
                defaultValue={['Tag 1', 'Tag 2', 'Tag 3']}
            />
            <p className="mt-2 text-sm text-gray-500">Maximum 5 tags allowed</p>
        </div>
    )
}

export default MaxTags
