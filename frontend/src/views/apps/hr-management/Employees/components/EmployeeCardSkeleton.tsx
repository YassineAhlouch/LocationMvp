import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'

const EmployeeCardSkeleton = () => {
    return (
        <Card>
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Skeleton width={25} height={25} variant="circle" />
                    <Skeleton height={10} width="40%" />
                </div>
                <div className="space-y-2 pl-1.5">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} height={10} width="70%" />
                    ))}
                </div>
            </div>
        </Card>
    )
}

export default EmployeeCardSkeleton
