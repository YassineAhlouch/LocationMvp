import { useContext } from 'react'
import DataContext from '../context/DataContext'

function useActivityData() {
    return useContext(DataContext)
}

export default useActivityData
