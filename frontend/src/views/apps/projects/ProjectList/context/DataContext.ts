import { createContext } from 'react'
import type { Projects } from '../types'

type DataContextProps = {
    data: Projects
    isLoading: boolean
    setData: (callback: (data: Projects) => Projects) => void
}

const DataContext = createContext<DataContextProps>({
    data: [],
    isLoading: false,
    setData: () => {},
})

export default DataContext
