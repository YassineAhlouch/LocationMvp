import { useContext } from 'react'
import DataContext from '../context/DataContext'

function useAccessControlData() {
    return useContext(DataContext)
}

export default useAccessControlData
