import TextBlockSkeleton from '@/components/shared/loaders/TextBlockSkeleton'

const TextBlockSkeletonDemo = () => {
    return (
        <div className="space-y-8 w-full max-w-md">
            <div>
                <p className="text-sm text-gray-500 mb-2">With title:</p>
                <TextBlockSkeleton rowCount={3} />
            </div>
            <div>
                <p className="text-sm text-gray-500 mb-2">Without title:</p>
                <TextBlockSkeleton title={false} rowCount={4} />
            </div>
        </div>
    )
}

export default TextBlockSkeletonDemo
