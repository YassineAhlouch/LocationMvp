import { createContext } from 'react'
import type { TimelineDataContextType } from '../types'

const DataContext = createContext<TimelineDataContextType>({
    isLoading: false,
    updateTask: () => {},
    updateProject: () => {},
    refetch: () => {},
})

export default DataContext
