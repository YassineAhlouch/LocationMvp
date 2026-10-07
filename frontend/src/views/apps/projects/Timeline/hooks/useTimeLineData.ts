import { useContext } from 'react'
import DataContext from '../context/DataContext'

function useTimelineData() {
    const context = useContext(DataContext)

    if (!context) {
        throw new Error('useTimelineData must be used within a TimelineContext')
    }

    return context
}

export default useTimelineData
