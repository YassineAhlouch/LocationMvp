import { useContext } from 'react'
import DataContext from '../context/DataContext'

function useProjectDetailsData() {
    return useContext(DataContext)
}

export default useProjectDetailsData
