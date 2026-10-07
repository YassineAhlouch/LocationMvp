import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'

const MediaSkeletonDemo = () => {
    return (
        <div className="space-y-4 w-full max-w-md">
            <MediaSkeleton />
            <MediaSkeleton showAvatar={false} />
        </div>
    )
}

export default MediaSkeletonDemo
