import { useContext } from 'react'
import DataContext from '../context/DataContext'

function useProductListData() {
    return useContext(DataContext)
}

export default useProductListData
