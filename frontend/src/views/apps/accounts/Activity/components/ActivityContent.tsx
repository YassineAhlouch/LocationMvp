import Scroll from '@/components/ui/Scroll'
import Container from '@/components/shared/Container'
import Logs from './Logs'
import useActivityData from '../hooks/useActivityData'

const ActivityContent = () => {
    const { data, loadable, isLoading, onLoadMore } = useActivityData()

    return (
        <div className="relative h-[calc(100%-125px)]">
            <div className="absolute top-0 left-0  h-full w-full py-4">
                <Scroll className="h-full" scrollbars="vertical">
                    <Container size="md" className="p-4">
                        <Logs
                            activities={data}
                            loadable={loadable}
                            isLoading={isLoading}
                            onLoadMore={onLoadMore}
                        />
                    </Container>
                </Scroll>
            </div>
        </div>
    )
}

export default ActivityContent
