import { useContext } from 'react'
import DataContext from '../context/DataContext'

function useMarketData() {
    return useContext(DataContext)
}

export default useMarketData
