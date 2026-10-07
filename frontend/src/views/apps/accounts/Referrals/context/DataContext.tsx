import { createContext } from 'react'
import type { ReferralData } from '../types'

type DataContextProps = {
    data: ReferralData | null
    loading: boolean
    error: string | null
    refetch: () => void
    sendInvitation: (email: string) => Promise<void>
    copyToClipboard: (text: string, type: 'link' | 'code') => Promise<void>
}
const DataContext = createContext<DataContextProps | null>(null)

export default DataContext
