import { useContext } from 'react'
import DataContext from '../context/DataContext'

function useOrderListData() {
    return useContext(DataContext)
}

export default useOrderListData
