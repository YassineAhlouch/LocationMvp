import { useContext } from 'react'
import DataContext from '../context/DataContext'

function useReportsData() {
    return useContext(DataContext)
}

export default useReportsData
