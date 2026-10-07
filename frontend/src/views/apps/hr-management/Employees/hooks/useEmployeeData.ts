import { useContext } from 'react'
import EmployeeContext from '../context/DataContext'

function useEmployeeData() {
    return useContext(EmployeeContext)
}

export default useEmployeeData
