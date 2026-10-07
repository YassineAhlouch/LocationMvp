import { useContext } from 'react'
import DataContext from '../context/DataContext'

export const useReferralData = () => {
    const context = useContext(DataContext)
    if (!context) {
        throw new Error('useReferralData must be used within ReferralProvider')
    }
    return context
}
