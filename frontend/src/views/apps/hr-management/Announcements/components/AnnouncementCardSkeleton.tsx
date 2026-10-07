import Skeleton from '@/components/ui/Skeleton'

const AnnouncementCardSkeleton = () => {
    return (
        <div className="space-y-4 py-4">
            {/* Header - Author info */}
            <div className="flex items-center gap-3">
                <Skeleton variant="circle" width={40} height={40} />
                <div className="flex-1 space-y-2">
                    <Skeleton height={10} width="30%" />
                    <Skeleton height={10} width="20%" />
                </div>
                <Skeleton variant="circle" width={24} height={24} />
            </div>

            <Skeleton height={10} width="60%" />

            {/* Description */}
            <div className="space-y-2">
                <Skeleton height={10} width="100%" />
                <Skeleton height={10} width="90%" />
                <Skeleton height={10} width="70%" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2">
                <Skeleton height={10} width="20%" />
                <Skeleton height={10} width="15%" />
            </div>
        </div>
    )
}

export default AnnouncementCardSkeleton
