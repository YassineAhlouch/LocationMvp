import Container from '@/components/shared/Container'
import PricingHeader from './components/PricingHeader'
import Plans from './components/Plans'
import Faq from './components/Faq'
import PaymentDialog from './components/PaymentDialog'
import { apiGetPricingPlans } from '@/services/AccountService'
import useSWR from 'swr'
import type { GetPricingPlanResponse } from './types'

const Pricing = () => {
    const { data } = useSWR(
        ['/api/pricing'],
        () => apiGetPricingPlans<GetPricingPlanResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    return (
        <Container size="md">
            <PricingHeader />
            <div className="py-4">
                <Plans data={data?.plans} />
            </div>
            <Faq />
            <PaymentDialog />
        </Container>
    )
}

export default Pricing
