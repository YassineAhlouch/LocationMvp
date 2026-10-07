import DataContext from '../context/DataContext'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import {
    apiGetReferralData,
    apiSendInvitation,
} from '@/services/AccountService'
import useSWR from 'swr'
import type { GetReferralDataResponse, SendInvitationRequest } from '../types'
import type { ReactNode } from 'react'

type ReferralProviderProps = {
    children: ReactNode
}

const ReferralContext = ({ children }: ReferralProviderProps) => {
    const { data, error, isLoading, mutate } = useSWR(
        'referral-data',
        () => apiGetReferralData<GetReferralDataResponse>(),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
        },
    )

    const sendInvitation = async (email: string) => {
        try {
            const response = await apiSendInvitation<
                { success: boolean; message: string },
                SendInvitationRequest
            >({
                email,
            })

            if (response.success) {
                toast.push(
                    <Notification type="success" title="Invitation Sent">
                        {response.message}
                    </Notification>,
                )

                mutate()
            } else {
                toast.push(
                    <Notification
                        type="danger"
                        title="Failed to Send Invitation"
                    >
                        {response.message}
                    </Notification>,
                )
            }
        } catch (error) {
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to send invitation. Please try again.
                </Notification>,
            )
            throw error
        }
    }

    const copyToClipboard = async (text: string, type: 'link' | 'code') => {
        try {
            await navigator.clipboard.writeText(text)

            const typeLabel =
                type === 'link' ? 'Referral Link' : 'Referral Code'
            toast.push(
                <Notification type="success" title="Copied to Clipboard">
                    {typeLabel} copied successfully!
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification type="danger" title="Copy Failed">
                    Unable to copy to clipboard. Please try again.
                </Notification>,
            )
            throw error
        }
    }

    return (
        <DataContext.Provider
            value={{
                data: data?.data || null,
                loading: isLoading,
                error: error?.message || null,
                refetch: () => mutate(),
                sendInvitation,
                copyToClipboard,
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export default ReferralContext
