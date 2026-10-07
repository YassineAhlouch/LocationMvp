import Button from '@/components/ui/Button'
import Container from '@/components/shared/Container'

const ActivityHeader = () => {
    return (
        <div className="py-8 border-b border-gray-200 dark:border-gray-800">
            <Container size="md" className="px-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h4>Activity Log</h4>
                        <p className="mt-2">
                            Browse all activity at a glance. Filter by status,
                            monitor activity, and take action with built-in
                            tools.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button>Export Data</Button>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default ActivityHeader
