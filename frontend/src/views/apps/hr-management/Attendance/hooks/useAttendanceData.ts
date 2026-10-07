import { useContext } from 'react'
import DataContext from '../context/DataContext'

function useAttendanceData() {
    return useContext(DataContext)
}

export default useAttendanceData
