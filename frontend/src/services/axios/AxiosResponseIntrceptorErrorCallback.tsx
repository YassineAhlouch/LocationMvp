import { useSessionUser, useToken } from '@/store/authStore'
import { mutate } from 'swr'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { SUBSCRIPTION_SWR_KEY } from '@/constants/billing.constant'
import type { AxiosError } from 'axios'

const unauthorizedCode = [401, 419, 440]

const AxiosResponseIntrceptorErrorCallback = (error: AxiosError) => {
    const { response } = error
    const { setToken } = useToken()

    if (response && unauthorizedCode.includes(response.status)) {
        setToken('')
        useSessionUser.getState().setUser({})
        useSessionUser.getState().setSessionSignedIn(false)
        return
    }

    // 402 payment_required: the agency's subscription is overdue, so the
    // backend refused a write. Refresh the banner and explain why nothing saved.
    const data = response?.data as { code?: string } | undefined
    if (response?.status === 402 && data?.code === 'payment_required') {
        mutate(SUBSCRIPTION_SWR_KEY)
        toast.push(
            <Notification type="danger" title="Account read-only">
                Settle your overdue subscription to make changes.
            </Notification>,
        )
    }
}

export default AxiosResponseIntrceptorErrorCallback
