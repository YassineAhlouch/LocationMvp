import { useContext } from 'react'
import DataContext from '../context/DataContext'

export const useLeaveData = () => {
    const context = useContext(DataContext)
    if (!context) {
        throw new Error('useLeaveContext must be used within a DataContext')
    }
    return context
}

export default useLeaveData
