import { useState } from 'react'
import { ViewMode } from '@/components/shared/Gantt/constants'
import TimelineContext from './components/TimelineContext'
import TimelineHeader from './components/TimelineHeader'
import TimelineContent from './components/TimelineContent'

const Timeline = () => {
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Week)

    return (
        <TimelineContext>
            <TimelineHeader
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />
            <TimelineContent viewMode={viewMode} />
        </TimelineContext>
    )
}

export default Timeline
