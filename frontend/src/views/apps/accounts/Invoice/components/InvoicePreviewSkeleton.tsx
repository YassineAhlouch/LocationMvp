import Skeleton from '@/components/ui/Skeleton'

const InvoicePreviewSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            {/* Header Skeleton */}
            <div className="flex justify-between items-start mb-8">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-32" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-44" />
                        <Skeleton className="h-4 w-36" />
                    </div>
                </div>
                <Skeleton className="w-24 h-24 rounded-lg" />
            </div>

            {/* Customer Info Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-3">
                    <Skeleton className="h-5 w-20" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                </div>
                <div className="space-y-3">
                    <Skeleton className="h-5 w-16" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-4 w-44" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
            </div>

            {/* Items Table Skeleton */}
            <div className="mb-8">
                <Skeleton className="h-5 w-16 mb-4" />
                <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-4 py-3 border-b-2 border-gray-200 dark:border-gray-700">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="grid grid-cols-4 gap-4 py-3">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-8" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Totals Skeleton */}
            <div className="flex justify-end mb-8">
                <div className="w-full max-w-sm space-y-3">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-18" />
                    </div>
                    <div className="flex justify-between pt-3 border-t-2 border-gray-200 dark:border-gray-700">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvoicePreviewSkeleton
