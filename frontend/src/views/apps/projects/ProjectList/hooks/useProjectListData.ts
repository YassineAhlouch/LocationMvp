import { useContext } from 'react'
import DataContext from '../context/DataContext'

function useProjectListData() {
    return useContext(DataContext)
}

export default useProjectListData
