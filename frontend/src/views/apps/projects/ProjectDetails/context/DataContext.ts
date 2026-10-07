import { createContext } from 'react'
import type { Project } from '../types'

type DataContextProps = {
    data: Project | null
    isLoading: boolean
    setData: (callback: (data: Project) => Project) => void
}

const DataContext = createContext<DataContextProps>({
    data: null,
    isLoading: false,
    setData: () => {},
})

export default DataContext
